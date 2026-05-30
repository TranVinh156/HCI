"""
WLASL word-level sign recognition service.

The trained model (`ml/models/wlasl_transformer.pt`) is an encoder-only
Transformer that consumes a fixed-length clip of MediaPipe keypoints
(32 frames x 75 keypoints x 3 dims) and predicts one of 300 ASL glosses.

Keypoint *extraction* happens in the browser (MediaPipe Tasks JS); this
service receives the raw per-frame keypoints, applies the same
shoulder-based normalization used during training, and runs the model.

torch is imported lazily so the API still boots if the dependency or the
model file is missing — callers get a stub response with model_loaded=False.
"""
from __future__ import annotations

import json
import logging
from pathlib import Path

try:
    import numpy as np
    _NUMPY_AVAILABLE = True
except ImportError:  # pragma: no cover
    _NUMPY_AVAILABLE = False

logger = logging.getLogger(__name__)

ML_DIR = Path(__file__).resolve().parent.parent.parent / "ml"
MODELS_DIR = ML_DIR / "models"
MODEL_PATH = MODELS_DIR / "wlasl_transformer.pt"
LABELS_PATH = MODELS_DIR / "wlasl_labels.json"

# Must match kaggle_train_wlasl.py / demo_inference.py exactly.
NUM_FRAMES = 32
NUM_KEYPOINTS = 75  # 33 pose + 21 left hand + 21 right hand
KP_DIMS = 3
TOP_K = 5


def _normalize(kp):
    """Shoulder-based normalization, matching demo_inference.py.

    kp: (T, 75, 3) float array. Frames where both shoulders are detected get
    centered on the shoulder midpoint and scaled by shoulder width; xy clamped
    to [-5, 5]. Frames without both shoulders are left untouched.
    """
    L = kp[:, 11, :2]
    R = kp[:, 12, :2]
    detected = (np.abs(L).sum(1) > 1e-6) & (np.abs(R).sum(1) > 1e-6)
    center = (L + R) / 2.0
    scale = np.linalg.norm(L - R, axis=1, keepdims=True) + 1e-6
    out = kp.copy()
    out[detected, :, :2] = (
        kp[detected, :, :2] - center[detected, None, :]
    ) / scale[detected, None, :]
    out[..., :2] = np.clip(out[..., :2], -5.0, 5.0)
    return out


class WordSignRecognizer:
    """Lazy-loaded WLASL Transformer wrapper."""

    def __init__(self):
        self.model = None
        self.idx_to_gloss: dict[int, str] = {}
        self._loaded = False
        self._torch = None

    def _try_load(self):
        if self._loaded:
            return
        self._loaded = True

        if not _NUMPY_AVAILABLE:
            logger.warning("numpy unavailable; word sign recognition disabled.")
            return
        if not MODEL_PATH.exists() or not LABELS_PATH.exists():
            logger.warning(
                "WLASL model/labels not found at %s; using stub.", MODELS_DIR
            )
            return

        try:
            import torch

            self._torch = torch
            raw = json.loads(LABELS_PATH.read_text(encoding="utf-8"))
            self.idx_to_gloss = {int(k): v for k, v in raw.items()}

            from app.services._transformer_arch import SignTransformer

            ckpt = torch.load(str(MODEL_PATH), map_location="cpu")
            model = SignTransformer(num_classes=ckpt["num_classes"])
            model.load_state_dict(ckpt["model_state"])
            model.eval()
            self.model = model
            logger.info(
                "Loaded WLASL model: %d classes.", ckpt["num_classes"]
            )
        except Exception as exc:  # pragma: no cover
            logger.exception("Failed to load WLASL model: %s", exc)
            self.model = None

    def predict(self, frames) -> tuple[str, float, list[tuple[str, float]], bool]:
        """frames: (T, 75, 3) list/array. Returns (label, confidence, top_k, loaded)."""
        self._try_load()

        if self.model is None or self._torch is None:
            return "—", 0.0, [], False

        torch = self._torch
        kp = np.asarray(frames, dtype=np.float32)
        kp = self._fit_length(kp)
        kp = _normalize(kp)

        with torch.no_grad():
            x = torch.from_numpy(kp).unsqueeze(0)
            probs = torch.softmax(self.model(x), dim=1)[0]
            top_p, top_i = probs.topk(min(TOP_K, probs.shape[0]))
            top_k = [
                (self.idx_to_gloss.get(int(i), str(int(i))), float(p))
                for p, i in zip(top_p, top_i)
            ]
        label, confidence = top_k[0]
        return label, confidence, top_k, True

    @staticmethod
    def _fit_length(kp):
        """Coerce arbitrary frame count to exactly NUM_FRAMES via uniform sampling / pad."""
        if kp.ndim != 3 or kp.shape[1:] != (NUM_KEYPOINTS, KP_DIMS):
            raise ValueError(
                f"Expected keypoints of shape (T, {NUM_KEYPOINTS}, {KP_DIMS}), got {kp.shape}"
            )
        total = kp.shape[0]
        if total == NUM_FRAMES:
            return kp
        if total >= NUM_FRAMES:
            idxs = np.linspace(0, total - 1, NUM_FRAMES).astype(int)
            return kp[idxs]
        pad = np.repeat(kp[-1:], NUM_FRAMES - total, axis=0)
        return np.concatenate([kp, pad], axis=0)


_recognizer = WordSignRecognizer()


def recognize_keypoints(frames) -> dict:
    label, confidence, top_k, loaded = _recognizer.predict(frames)
    return {
        "kind": "word",
        "label": label,
        "confidence": confidence,
        "top_k": [{"label": lbl, "confidence": conf} for lbl, conf in top_k],
        "model_loaded": loaded,
    }
