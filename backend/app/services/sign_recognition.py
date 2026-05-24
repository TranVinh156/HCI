"""
Sign recognition service using MobileNetV2 transfer learning.

Supports two model types:
  - alphabet: ASL fingerspelling A-Z (26 classes)
  - word:     Whole-word vocabulary (configurable classes)

Models are loaded lazily on first request. If a model file is missing,
the service falls back to a deterministic stub so the API stays usable
during development.
"""
from __future__ import annotations

import base64
import io
import json
import logging
from pathlib import Path
from typing import Literal

try:
    import numpy as np
    _NUMPY_AVAILABLE = True
except ImportError:
    _NUMPY_AVAILABLE = False

try:
    from PIL import Image
    _PIL_AVAILABLE = True
except ImportError:
    _PIL_AVAILABLE = False

logger = logging.getLogger(__name__)

ML_DIR = Path(__file__).resolve().parent.parent.parent / "ml"
MODELS_DIR = ML_DIR / "models"
IMG_SIZE = 224  # MobileNetV2 default input

ModelKind = Literal["alphabet", "word"]


class SignRecognizer:
    """Lazy-loaded TensorFlow model wrapper."""

    def __init__(self, kind: ModelKind):
        self.kind = kind
        self.model = None
        self.labels: list[str] = []
        self._loaded = False

    def _try_load(self):
        if self._loaded:
            return
        model_path = MODELS_DIR / f"{self.kind}_model.h5"
        labels_path = MODELS_DIR / f"{self.kind}_labels.json"

        if not model_path.exists() or not labels_path.exists():
            logger.warning("Model files for '%s' not found; falling back to stub.", self.kind)
            self._loaded = True
            return

        try:
            import tensorflow as tf  # imported lazily to keep startup snappy

            self.model = tf.keras.models.load_model(str(model_path))
            self.labels = json.loads(labels_path.read_text(encoding="utf-8"))
            logger.info("Loaded %s model with %d classes.", self.kind, len(self.labels))
        except Exception as exc:
            logger.exception("Failed to load %s model: %s", self.kind, exc)
            self.model = None
        finally:
            self._loaded = True

    def predict(self, image_bytes: bytes) -> tuple[str, float, list[tuple[str, float]]]:
        """Return (top_label, confidence, top_k)."""
        self._try_load()

        if self.model is None:
            return self._stub_prediction()

        try:
            if not _PIL_AVAILABLE or not _NUMPY_AVAILABLE:
                return self._stub_prediction()
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((IMG_SIZE, IMG_SIZE))
            arr = np.asarray(img, dtype=np.float32)
            # MobileNetV2 preprocessing: scale to [-1, 1]
            arr = (arr / 127.5) - 1.0
            arr = np.expand_dims(arr, axis=0)

            preds = self.model.predict(arr, verbose=0)[0]
            top_idx = int(np.argmax(preds))
            top_label = self.labels[top_idx] if top_idx < len(self.labels) else str(top_idx)
            confidence = float(preds[top_idx])

            top_k_idx = np.argsort(preds)[::-1][:5]
            top_k = [(self.labels[i] if i < len(self.labels) else str(i), float(preds[i])) for i in top_k_idx]
            return top_label, confidence, top_k
        except Exception as exc:
            logger.exception("Inference failed: %s", exc)
            return self._stub_prediction()

    def _stub_prediction(self) -> tuple[str, float, list[tuple[str, float]]]:
        if self.kind == "alphabet":
            return "A", 0.0, [("A", 0.0), ("B", 0.0), ("C", 0.0)]
        return "hello", 0.0, [("hello", 0.0), ("thank-you", 0.0)]


_recognizers: dict[ModelKind, SignRecognizer] = {
    "alphabet": SignRecognizer("alphabet"),
    "word": SignRecognizer("word"),
}


def decode_image(data: str | bytes) -> bytes:
    """Accept raw bytes or a data URL / base64 string and return raw bytes."""
    if isinstance(data, bytes):
        return data
    if data.startswith("data:"):
        _, _, b64 = data.partition(",")
        data = b64
    return base64.b64decode(data)


def recognize(kind: ModelKind, image: str | bytes) -> dict:
    image_bytes = decode_image(image)
    recognizer = _recognizers[kind]
    label, confidence, top_k = recognizer.predict(image_bytes)
    return {
        "kind": kind,
        "label": label,
        "confidence": confidence,
        "top_k": [{"label": lbl, "confidence": conf} for lbl, conf in top_k],
        "model_loaded": recognizer.model is not None,
    }
