"""
Landmark-based ASL recognition service (BiLSTM, 46 classes).

The trained model (`ml/models/model_landmarks.keras`) is a Keras BiLSTM that
consumes a fixed-length clip of MediaPipe landmarks (20 frames x 225 features)
and predicts one of 46 classes: 10 WLASL words + A-Z + 0-9.

Per-frame feature layout expected by the model:
    [left_hand (21 * 3 = 63) | right_hand (21 * 3 = 63) | pose (33 * 3 = 99)]
with each landmark stored as (x, y, z).

Wire format from the browser stays compatible with the existing word endpoint:
    frames: (T, 75, 3) laid out as [pose(33) | LH(21) | RH(21)], 3rd dim = z.
This service reorders the layout, fits T to 20 (repeat if T==1, uniform sample
otherwise), applies the same per-component normalization used at training time,
then runs Keras inference.

TensorFlow is imported lazily so the API still boots if TF or the model file is
missing — callers get a stub response with model_loaded=False.
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
MODEL_PATH = MODELS_DIR / "model_landmarks.keras"
MAPPING_PATH = MODELS_DIR / "landmark_mapping.json"

# Must match the training notebook exactly.
SEQ_LEN = 20
FEATURE_DIM = 225
NUM_KEYPOINTS = 75  # 33 pose + 21 LH + 21 RH
KP_DIMS = 3
TOP_K = 5


def _reorder_and_flatten(kp):
    """Map browser layout (T, 75, 3) [pose, LH, RH] → training layout (T, 225) [LH, RH, pose]."""
    T = kp.shape[0]
    pose = kp[:, 0:33, :].reshape(T, 99)
    lh = kp[:, 33:54, :].reshape(T, 63)
    rh = kp[:, 54:75, :].reshape(T, 63)
    return np.concatenate([lh, rh, pose], axis=1).astype(np.float32)


def _fit_length(flat):
    """Coerce arbitrary frame count to exactly SEQ_LEN. T==1 → repeat; T>=2 → uniform sample / pad."""
    T = flat.shape[0]
    if T == SEQ_LEN:
        return flat
    if T == 1:
        return np.repeat(flat, SEQ_LEN, axis=0)
    if T >= SEQ_LEN:
        idxs = np.linspace(0, T - 1, SEQ_LEN).astype(int)
        return flat[idxs]
    pad = np.repeat(flat[-1:], SEQ_LEN - T, axis=0)
    return np.concatenate([flat, pad], axis=0)


def _normalize_sequence(seq):
    """Per-frame per-component normalization, matching CELL 10 of the training notebook.

    seq: (SEQ_LEN, 225) where each frame is [LH(63), RH(63), pose(99)].
    Hands are wrist-anchored and scaled by max landmark distance; pose is hip-anchored
    and scaled by shoulder width.
    """
    seq = seq.copy()
    for t in range(seq.shape[0]):
        lh = seq[t, 0:63].reshape(21, 3)
        if np.any(lh != 0):
            lh = lh - lh[0]
            s = np.max(np.linalg.norm(lh, axis=1)) + 1e-8
            seq[t, 0:63] = (lh / s).flatten()
        rh = seq[t, 63:126].reshape(21, 3)
        if np.any(rh != 0):
            rh = rh - rh[0]
            s = np.max(np.linalg.norm(rh, axis=1)) + 1e-8
            seq[t, 63:126] = (rh / s).flatten()
        pose = seq[t, 126:225].reshape(33, 3)
        if np.any(pose != 0):
            pose = pose - pose[0]
            sw = np.linalg.norm(pose[11] - pose[12]) + 1e-8
            seq[t, 126:225] = (pose / sw).flatten()
    return seq.astype(np.float32)


class LandmarkSignRecognizer:
    """Lazy-loaded Keras BiLSTM wrapper."""

    def __init__(self):
        self.model = None
        self.index_to_word: dict[int, str] = {}
        self._loaded = False
        self._tf = None

    def _try_load(self):
        if self._loaded:
            return
        self._loaded = True

        if not _NUMPY_AVAILABLE:
            logger.warning("numpy unavailable; landmark recognition disabled.")
            return
        if not MODEL_PATH.exists() or not MAPPING_PATH.exists():
            logger.warning(
                "Landmark model/mapping not found at %s; using stub.", MODELS_DIR
            )
            return

        try:
            import tensorflow as tf

            self._tf = tf
            mapping = json.loads(MAPPING_PATH.read_text(encoding="utf-8"))
            self.index_to_word = {
                int(k): v for k, v in mapping["index_to_word"].items()
            }
            self.model = tf.keras.models.load_model(str(MODEL_PATH), compile=False)
            logger.info(
                "Loaded landmark model: %d classes.", len(self.index_to_word)
            )
        except Exception as exc:  # pragma: no cover
            logger.exception("Failed to load landmark model: %s", exc)
            self.model = None

    def predict(self, frames) -> tuple[str, float, list[tuple[str, float]], bool]:
        """frames: (T, 75, 3) list/array. Returns (label, confidence, top_k, loaded)."""
        self._try_load()

        if self.model is None:
            return "—", 0.0, [], False

        kp = np.asarray(frames, dtype=np.float32)
        if kp.ndim != 3 or kp.shape[1:] != (NUM_KEYPOINTS, KP_DIMS):
            raise ValueError(
                f"Expected keypoints of shape (T, {NUM_KEYPOINTS}, {KP_DIMS}), got {kp.shape}"
            )

        flat = _reorder_and_flatten(kp)
        flat = _fit_length(flat)
        flat = _normalize_sequence(flat)

        probs = self.model.predict(flat[None, ...], verbose=0)[0]
        top_idx = np.argsort(probs)[::-1][:TOP_K]
        top_k = [
            (self.index_to_word.get(int(i), str(int(i))), float(probs[i]))
            for i in top_idx
        ]
        label, confidence = top_k[0]
        return label, confidence, top_k, True


_recognizer = LandmarkSignRecognizer()


def recognize_landmark_keypoints(frames) -> dict:
    label, confidence, top_k, loaded = _recognizer.predict(frames)
    return {
        "kind": "landmark",
        "label": label,
        "confidence": confidence,
        "top_k": [{"label": lbl, "confidence": conf} for lbl, conf in top_k],
        "model_loaded": loaded,
    }
