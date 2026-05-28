from __future__ import annotations

import logging
from typing import Optional
from urllib.parse import unquote, urlparse

import httpx
from fastapi import APIRouter, HTTPException, Query, Request
from starlette.background import BackgroundTask
from starlette.responses import StreamingResponse

router = APIRouter(prefix="/api/media", tags=["media"])

logger = logging.getLogger("app.media")

ALLOWED_HOSTS = {"aslsignbank.haskins.yale.edu"}
ALLOWED_SCHEMES = {"https"}
ALLOWED_EXTENSIONS = {".mp4"}


def validate_media_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES:
        raise HTTPException(status_code=400, detail="Only https URLs are allowed.")
    if parsed.hostname not in ALLOWED_HOSTS:
        raise HTTPException(status_code=400, detail="Host is not allowed.")
    if not any(parsed.path.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Only MP4 files are allowed.")


@router.get("/proxy")
async def proxy_media(
    request: Request,
    url: str = Query(..., max_length=2048, description="Remote MP4 URL"),
):
    decoded_url = unquote(url)
    validate_media_url(decoded_url)

    range_header: Optional[str] = request.headers.get("range")
    forward_headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": (
            "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,"
            "audio/*;q=0.6,*/*;q=0.5"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }
    if range_header:
        forward_headers["Range"] = range_header

    try:
        client = httpx.AsyncClient(
            follow_redirects=True,
            timeout=30.0,
            verify=False,
        )
        stream = client.stream("GET", decoded_url, headers=forward_headers)
        response = await stream.__aenter__()

        if response.status_code not in (200, 206):
            body_preview = await response.aread()
            logger.error(
                "Upstream rejected %s with status %s: %s",
                decoded_url,
                response.status_code,
                body_preview[:1024].decode("utf-8", errors="replace"),
            )
            await stream.__aexit__(None, None, None)
            await client.aclose()
            raise HTTPException(
                status_code=response.status_code,
                detail="Upstream media request failed.",
            )

        headers = {
            "Cache-Control": "public, max-age=3600",
        }
        content_length = response.headers.get("content-length")
        if content_length:
            headers["Content-Length"] = content_length
        content_range = response.headers.get("content-range")
        if content_range:
            headers["Content-Range"] = content_range
        accept_ranges = response.headers.get("accept-ranges")
        if accept_ranges:
            headers["Accept-Ranges"] = accept_ranges

        media_type = response.headers.get("content-type", "video/mp4")

        async def cleanup() -> None:
            await stream.__aexit__(None, None, None)
            await client.aclose()

        return StreamingResponse(
            response.aiter_bytes(),
            status_code=response.status_code,
            media_type=media_type,
            headers=headers,
            background=BackgroundTask(cleanup),
        )
    except HTTPException:
        raise
    except httpx.RequestError as exc:
        logger.exception("Upstream request failed for %s", decoded_url)
        raise HTTPException(status_code=502, detail=f"Upstream request failed: {exc}") from exc
    except Exception as exc:  # noqa: BLE001 - want detailed logs for proxy failures
        logger.exception("Media proxy failed for %s", decoded_url)
        raise HTTPException(status_code=500, detail=f"Proxy error: {exc}") from exc
