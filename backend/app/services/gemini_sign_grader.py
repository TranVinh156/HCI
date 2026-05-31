from __future__ import annotations

import asyncio
import json
import time
from collections import deque

import httpx
from fastapi import HTTPException

from app.config import settings


class _KeyPool:
    def __init__(self, keys: list[str], rpm_limit: int):
        self.keys = [key.strip() for key in keys if key and key.strip()]
        self.rpm_limit = max(1, rpm_limit)
        self._usage: dict[str, deque[float]] = {key: deque() for key in self.keys}
        self._lock = asyncio.Lock()

    def _prune(self, key: str, now: float) -> None:
        window = self._usage[key]
        cutoff = now - 60
        while window and window[0] < cutoff:
            window.popleft()

    async def reserve_key(self) -> str:
        if not self.keys:
            raise HTTPException(status_code=503, detail="Gemini API keys are not configured")

        async with self._lock:
            now = time.monotonic()
            for key in self.keys:
                self._prune(key, now)

            ordered = sorted(self.keys, key=lambda key: (len(self._usage[key]), key))
            for key in ordered:
                if len(self._usage[key]) < self.rpm_limit:
                    self._usage[key].append(now)
                    return key

        raise HTTPException(status_code=429, detail="All Gemini API keys are currently rate-limited")


_key_pool = _KeyPool(settings.google_api_keys.split(","), settings.gemini_rpm_limit)


async def grade_sign_with_gemini(image: str, expected_label: str) -> tuple[bool, float, str]:
    """
    Return (is_correct, confidence, reasoning) from Gemini image grading.
    """
    prompt = (
        "You are an ASL sign grading assistant. "
        "Compare the hand sign in the image against the expected label. "
        "Respond with strict JSON only: "
        '{"is_correct": boolean, "confidence": number, "reasoning": string}. '
        "confidence must be between 0 and 1."
    )

    for _ in range(max(1, len(_key_pool.keys))):
        api_key = await _key_pool.reserve_key()
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.gemini_model}:generateContent?key={api_key}"
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {"text": f"Expected label: {expected_label}"},
                        {"inline_data": {"mime_type": "image/jpeg", "data": _extract_base64(image)}},
                    ]
                }
            ],
            "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"},
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(url, json=payload)
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}") from exc

        if response.status_code == 429:
            continue
        if response.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"Gemini error: {response.text}")

        raw = _extract_text_response(response.json())
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise HTTPException(status_code=502, detail=f"Gemini returned invalid JSON: {raw}") from exc

        is_correct = bool(data.get("is_correct", False))
        confidence = float(data.get("confidence", 0.0))
        confidence = max(0.0, min(1.0, confidence))
        reasoning = str(data.get("reasoning", "")).strip()[:500]
        return is_correct, confidence, reasoning

    raise HTTPException(status_code=429, detail="All Gemini API keys are currently rate-limited")


def _extract_base64(image: str) -> str:
    if "," in image and image.startswith("data:"):
        return image.split(",", 1)[1]
    return image


def _extract_text_response(payload: dict) -> str:
    candidates = payload.get("candidates") or []
    if not candidates:
        raise HTTPException(status_code=502, detail="Gemini returned no candidates")
    parts = (candidates[0].get("content") or {}).get("parts") or []
    text_chunks = [part.get("text", "") for part in parts if isinstance(part, dict)]
    text = "".join(text_chunks).strip()
    if not text:
        raise HTTPException(status_code=502, detail="Gemini returned empty content")
    return text
