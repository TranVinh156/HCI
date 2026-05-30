"""
ASL alphabet recognition service.

Loads a Keras CNN (`ml/models/asl_alphabet.h5`) trained on 64x64 RGB images
across 29 classes (A-Z + del/nothing/space). The browser captures a frame
and POSTs a base64 image; this service decodes, resizes, normalizes to
[0, 1] (matching the training pipeline), and runs prediction.

TensorFlow is imported lazily so the API still boots if the dependency or
the model file is missing — callers get a stub response with
model_loaded=False.
"""
from __future__ import annotations

import base64
import binascii
import json
import logging
from io import BytesIO
from pathlib import Path

try:
    import numpy as np
    _NUMPY_AVAILABLE = True
except ImportError:  # pragma: no cover
    _NUMPY_AVAILABLE = False

try:
    from PIL import Image
    _PIL_AVAILABLE = True
except ImportError:  # pragma: no cover
    _PIL_AVAILABLE = False

logger = logging.getLogger(__name__)

ML_DIR = Path(__file__).resolve().parent.parent.parent / "ml"
MODELS_DIR = ML_DIR / "models"
MODEL_PATH = MODELS_DIR / "asl_alphabet.h5"
LABELS_PATH = MODELS_DIR / "asl_alphabet_labels.json"

IMG_SIZE = 64
NUM_CLASSES = 29
TOP_K = 5


def _decode_base64_image(image_b64: str):
    """Strip optional data-URL prefix and return a PIL RGB Image."""
    if "," in image_b64 and image_b64.lstrip().startswith("data:"):
        image_b64 = image_b64.split(",", 1)[1]
    try:
        raw = base64.b64decode(image_b64, validate=False)
    except (binascii.Error, ValueError) as exc:
        raise ValueError(f"Invalid base64 image: {exc}") from exc
    return Image.open(BytesIO(raw)).convert("RGB")


class AlphabetRecognizer:
    """Lazy-loaded Keras ASL alphabet CNN wrapper."""

    def __init__(self):
        self.model = None
        self.idx_to_label: dict[int, str] = {}
        self._loaded = False

    def _try_load(self):
        if self._loaded:
            return
        self._loaded = True

        if not _NUMPY_AVAILABLE or not _PIL_AVAILABLE:
            logger.warning(
                "numpy/Pillow unavailable; alphabet recognition disabled."
            )
            return
        if not MODEL_PATH.exists() or not LABELS_PATH.exists():
            logger.warning(
                "ASL alphabet model/labels not found at %s; using stub.",
                MODELS_DIR,
            )
            return

        try:
            import tensorflow as tf

            raw = json.loads(LABELS_PATH.read_text(encoding="utf-8"))
            self.idx_to_label = {int(k): v for k, v in raw.items()}
            self.model = tf.keras.models.load_model(str(MODEL_PATH))
            logger.info(
                "Loaded ASL alphabet model: %d classes.", len(self.idx_to_label)
            )
        except Exception as exc:  # pragma: no cover
            logger.exception("Failed to load ASL alphabet model: %s", exc)
            self.model = None

    def predict(
        self, image_b64: str
    ) -> tuple[str, float, list[tuple[str, float]], bool]:
        """Returns (label, confidence, top_k, loaded)."""
        self._try_load()

        if self.model is None:
            return "—", 0.0, [], False

        img = _decode_base64_image(image_b64)
        img = img.resize((IMG_SIZE, IMG_SIZE))
        arr = np.asarray(img, dtype=np.float32) / 255.0
        arr = np.expand_dims(arr, 0)

        probs = self.model.predict(arr, verbose=0)[0]
        order = np.argsort(probs)[::-1][:TOP_K]
        top_k = [
            (self.idx_to_label.get(int(i), str(int(i))), float(probs[i]))
            for i in order
        ]
        label, confidence = top_k[0]
        return label, confidence, top_k, True


_recognizer = AlphabetRecognizer()


def recognize_image(image_b64: str) -> dict:
    label, confidence, top_k, loaded = _recognizer.predict(image_b64)
    return {
        "kind": "alphabet",
        "label": label,
        "confidence": confidence,
        "top_k": [{"label": lbl, "confidence": conf} for lbl, conf in top_k],
        "model_loaded": loaded,
    }
