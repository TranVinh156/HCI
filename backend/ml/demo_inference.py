"""
Demo inference cho WLASL Transformer.
Compatible: mediapipe >= 0.10.13, Python 3.12.

Download từ Kaggle output về local:
  backend/ml/models/wlasl_transformer.pt
  backend/ml/models/wlasl_labels.json

Usage:
  python -m ml.demo_inference --video path/to/sign.mp4
  python -m ml.demo_inference --folder path/to/videos --top 5
  python -m ml.demo_inference --webcam
"""
from __future__ import annotations

import argparse
import json
import math
import os
import time
import urllib.request
from collections import deque
from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn as nn
import mediapipe as mp
from mediapipe.tasks import python as mp_tasks
from mediapipe.tasks.python import vision as mp_vision

# ── Paths ─────────────────────────────────────────────────────────────
MODELS_DIR  = Path(__file__).resolve().parent / "models"
MODEL_PATH  = MODELS_DIR / "wlasl_transformer.pt"
LABELS_PATH = MODELS_DIR / "wlasl_labels.json"
POSE_TASK   = Path("/tmp/pose_landmarker.task")
HAND_TASK   = Path("/tmp/hand_landmarker.task")

# ── Keypoint config (PHẢI match với kaggle_train_wlasl.py) ───────────
NUM_FRAMES    = 32
NUM_KEYPOINTS = 75     # 33 pose + 21 left + 21 right
KP_DIMS       = 3
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# =====================================================================
# Download MediaPipe task models nếu chưa có
# =====================================================================
def ensure_mp_models():
    models = {
        POSE_TASK: (
            "https://storage.googleapis.com/mediapipe-models/"
            "pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"
        ),
        HAND_TASK: (
            "https://storage.googleapis.com/mediapipe-models/"
            "hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task"
        ),
    }
    for dst, url in models.items():
        if not dst.exists():
            print(f"Downloading {dst.name} ...")
            dst.parent.mkdir(parents=True, exist_ok=True)
            urllib.request.urlretrieve(url, dst)


# =====================================================================
# MediaPipe Tasks detectors
# =====================================================================
def create_pose_detector():
    opts = mp_vision.PoseLandmarkerOptions(
        base_options=mp_tasks.BaseOptions(model_asset_path=str(POSE_TASK)),
        running_mode=mp_vision.RunningMode.IMAGE,
        num_poses=1,
        min_pose_detection_confidence=0.5,
    )
    return mp_vision.PoseLandmarker.create_from_options(opts)


def create_hand_detector():
    opts = mp_vision.HandLandmarkerOptions(
        base_options=mp_tasks.BaseOptions(model_asset_path=str(HAND_TASK)),
        running_mode=mp_vision.RunningMode.IMAGE,
        num_hands=2,
        min_hand_detection_confidence=0.5,
    )
    return mp_vision.HandLandmarker.create_from_options(opts)


# =====================================================================
# Keypoint extraction
# =====================================================================
def frame_to_keypoints(rgb: np.ndarray, pose_det, hand_det) -> np.ndarray:
    """RGB frame → (75, 3)."""
    arr = np.zeros((NUM_KEYPOINTS, KP_DIMS), dtype=np.float32)
    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

    # Pose (33 kp @ offset 0)
    pose_res = pose_det.detect(mp_img)
    if pose_res.pose_landmarks:
        for i, lm in enumerate(pose_res.pose_landmarks[0]):
            arr[i] = [lm.x, lm.y, lm.visibility]

    # Hands (21+21 kp @ offsets 33 / 54)
    hand_res = hand_det.detect(mp_img)
    for j, hand_lms in enumerate(hand_res.hand_landmarks):
        side   = hand_res.handedness[j][0].category_name   # "Left" | "Right"
        offset = 33 if side == "Left" else 54
        for i, lm in enumerate(hand_lms):
            arr[offset + i] = [lm.x, lm.y, 1.0]

    return arr


def normalize(kp: np.ndarray) -> np.ndarray:
    """Normalize theo khoảng vai. kp: (T, 75, 3) → (T, 75, 3).
    Chỉ normalize các frame mà 2 vai đều detect được; clamp [-5, 5]."""
    L = kp[:, 11, :2]
    R = kp[:, 12, :2]
    detected = (np.abs(L).sum(1) > 1e-6) & (np.abs(R).sum(1) > 1e-6)
    center = (L + R) / 2.0
    scale  = np.linalg.norm(L - R, axis=1, keepdims=True) + 1e-6
    out = kp.copy()
    out[detected, :, :2] = (
        (kp[detected, :, :2] - center[detected, None, :])
        / scale[detected, None, :]
    )
    out[..., :2] = np.clip(out[..., :2], -5.0, 5.0)
    return out


def extract_from_video(path: Path, pose_det, hand_det) -> np.ndarray | None:
    cap = cv2.VideoCapture(str(path))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total < 4:
        cap.release()
        return None

    if total >= NUM_FRAMES:
        idxs = np.linspace(0, total - 1, NUM_FRAMES, dtype=int)
    else:
        idxs = np.concatenate([np.arange(total),
                               np.full(NUM_FRAMES - total, total - 1, dtype=int)])

    out = np.zeros((NUM_FRAMES, NUM_KEYPOINTS, KP_DIMS), dtype=np.float32)
    target = set(idxs.tolist())
    idx_to_slots: dict[int, list[int]] = {}
    for slot, fi in enumerate(idxs):
        idx_to_slots.setdefault(int(fi), []).append(slot)

    cur = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if cur in target:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            kp  = frame_to_keypoints(rgb, pose_det, hand_det)
            for slot in idx_to_slots[cur]:
                out[slot] = kp
        cur += 1
    cap.release()
    return normalize(out)


# =====================================================================
# Model (phải match kaggle_train_wlasl.py)
# =====================================================================
class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 128):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        pos = torch.arange(max_len, dtype=torch.float).unsqueeze(1)
        div = torch.exp(torch.arange(0, d_model, 2).float() *
                        (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        self.register_buffer("pe", pe.unsqueeze(0))

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]


class SignTransformer(nn.Module):
    def __init__(self, num_classes: int, num_kp: int = NUM_KEYPOINTS,
                 kp_dims: int = KP_DIMS, d_model: int = 256,
                 nhead: int = 8, num_layers: int = 4,
                 dim_ff: int = 512, dropout: float = 0.3):
        super().__init__()
        in_dim = num_kp * kp_dims
        self.input_norm = nn.LayerNorm(in_dim)
        self.embed      = nn.Linear(in_dim, d_model)
        self.cls_token  = nn.Parameter(torch.empty(1, 1, d_model))
        nn.init.trunc_normal_(self.cls_token, std=0.02)
        self.pos_enc  = PositionalEncoding(d_model, max_len=NUM_FRAMES + 1)
        self.pos_drop = nn.Dropout(dropout)
        enc_layer = nn.TransformerEncoderLayer(
            d_model=d_model, nhead=nhead, dim_feedforward=dim_ff,
            dropout=dropout, batch_first=True, activation="gelu",
        )
        self.encoder = nn.TransformerEncoder(enc_layer, num_layers=num_layers)
        self.norm = nn.LayerNorm(d_model)
        self.head = nn.Sequential(
            nn.Linear(d_model, d_model // 2), nn.GELU(), nn.Dropout(dropout),
            nn.Linear(d_model // 2, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B = x.size(0)
        x   = self.input_norm(x.flatten(2))
        x   = self.embed(x)
        cls = self.cls_token.expand(B, -1, -1)
        x   = self.pos_drop(self.pos_enc(torch.cat([cls, x], dim=1)))
        return self.head(self.norm(self.encoder(x)[:, 0]))


# =====================================================================
# Inference helpers
# =====================================================================
def load_model():
    assert MODEL_PATH.exists(), f"Thiếu model: {MODEL_PATH}\nDownload từ Kaggle về!"
    assert LABELS_PATH.exists(), f"Thiếu labels: {LABELS_PATH}"

    with open(LABELS_PATH, encoding="utf-8") as f:
        raw = json.load(f)
    idx_to_gloss = {int(k): v for k, v in raw.items()}

    ckpt = torch.load(MODEL_PATH, map_location=DEVICE)
    model = SignTransformer(num_classes=ckpt["num_classes"]).to(DEVICE)
    model.load_state_dict(ckpt["model_state"])
    model.eval()
    print(f"Model loaded: {ckpt['num_classes']} classes | device={DEVICE}")
    return model, idx_to_gloss


@torch.no_grad()
def predict(model, kp: np.ndarray, idx_to_gloss: dict, top: int = 5):
    x = torch.from_numpy(kp).unsqueeze(0).to(DEVICE)
    probs = torch.softmax(model(x), dim=1)[0]
    top_p, top_i = probs.topk(top)
    return [(idx_to_gloss[int(i)], float(p)) for p, i in zip(top_p, top_i)]


# =====================================================================
# CLI modes
# =====================================================================
def draw_skeleton(frame, pose_res, hand_res):
    """Vẽ skeleton lên frame BGR."""
    # Vẽ thủ công vì dùng Tasks API (không có mp.solutions.*)
    h, w = frame.shape[:2]

    def pt(lm):
        return (int(lm.x * w), int(lm.y * h))

    # Hands (MediaPipe hand topology)
    HAND_CONNECTIONS = [
        (0, 1), (1, 2), (2, 3), (3, 4),
        (0, 5), (5, 6), (6, 7), (7, 8),
        (5, 9), (9, 10), (10, 11), (11, 12),
        (9, 13), (13, 14), (14, 15), (15, 16),
        (13, 17), (17, 18), (18, 19), (19, 20),
        (0, 17),
    ]
    for hand_lms in hand_res.hand_landmarks:
        pts = [pt(lm) for lm in hand_lms]
        for a, b in HAND_CONNECTIONS:
            cv2.line(frame, pts[a], pts[b], (0, 220, 255), 2)
        for p in pts:
            cv2.circle(frame, p, 4, (255, 255, 0), -1)

    # Pose (upper body + hands/torso anchors)
    POSE_CONNECTIONS = [(11,12),(11,13),(13,15),(12,14),(14,16),
                        (11,23),(12,24),(23,24),(0,1),(1,2),(2,3),(3,7),
                        (0,4),(4,5),(5,6),(6,8)]
    if pose_res.pose_landmarks:
        lms = pose_res.pose_landmarks[0]
        pts = [pt(lm) for lm in lms]
        for a, b in POSE_CONNECTIONS:
            if a < len(pts) and b < len(pts):
                cv2.line(frame, pts[a], pts[b], (100, 255, 100), 2)
        for p in pts:
            cv2.circle(frame, p, 3, (100, 255, 100), -1)


def run_video(video_path: Path, top: int):
    ensure_mp_models()
    model, idx_to_gloss = load_model()
    pose_det = create_pose_detector()
    hand_det = create_hand_detector()

    t0 = time.time()
    kp = extract_from_video(video_path, pose_det, hand_det)
    pose_det.close(); hand_det.close()

    if kp is None:
        print("Video quá ngắn hoặc không đọc được."); return

    preds = predict(model, kp, idx_to_gloss, top)
    elapsed = time.time() - t0

    print(f"\nVideo : {video_path.name}")
    print(f"Time  : {elapsed:.2f}s")
    print("-" * 45)
    for rank, (gloss, prob) in enumerate(preds, 1):
        bar = "#" * int(prob * 30)
        print(f"  {rank}. {gloss:<22s} {prob*100:5.1f}%  {bar}")


def run_folder(folder: Path, top: int):
    ensure_mp_models()
    model, idx_to_gloss = load_model()
    pose_det = create_pose_detector()
    hand_det = create_hand_detector()

    videos = sorted(folder.glob("*.mp4")) + sorted(folder.glob("*.avi"))
    print(f"Found {len(videos)} videos in {folder}\n")

    for v in videos:
        kp = extract_from_video(v, pose_det, hand_det)
        if kp is None:
            print(f"  {v.name:<35s} SKIP"); continue
        preds = predict(model, kp, idx_to_gloss, top)
        top3 = " | ".join(f"{g}({p*100:.0f}%)" for g, p in preds[:3])
        print(f"  {v.name:<35s} → {top3}")

    pose_det.close(); hand_det.close()


def run_webcam(top: int):
    ensure_mp_models()
    model, idx_to_gloss = load_model()

    # Webcam dùng VIDEO mode để tracking tốt hơn IMAGE mode
    pose_opts = mp_vision.PoseLandmarkerOptions(
        base_options=mp_tasks.BaseOptions(model_asset_path=str(POSE_TASK)),
        running_mode=mp_vision.RunningMode.VIDEO,
        num_poses=1,
    )
    hand_opts = mp_vision.HandLandmarkerOptions(
        base_options=mp_tasks.BaseOptions(model_asset_path=str(HAND_TASK)),
        running_mode=mp_vision.RunningMode.VIDEO,
        num_hands=2,
    )
    pose_det = mp_vision.PoseLandmarker.create_from_options(pose_opts)
    hand_det = mp_vision.HandLandmarker.create_from_options(hand_opts)

    cap = cv2.VideoCapture(0)
    buffer: deque = deque(maxlen=NUM_FRAMES)
    recording   = False
    last_preds: list = []
    ts_ms = 0

    print("\n=== Webcam Demo ===")
    print("  SPACE : bắt đầu record 32 frames rồi predict")
    print("  Q     : thoát\n")

    while True:
        ret, frame = cap.read()
        if not ret: break
        frame = cv2.flip(frame, 1)
        ts_ms += 33   # ~30 fps

        rgb    = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

        pose_res = pose_det.detect_for_video(mp_img, ts_ms)
        hand_res = hand_det.detect_for_video(mp_img, ts_ms)

        draw_skeleton(frame, pose_res, hand_res)

        if recording:
            arr = np.zeros((NUM_KEYPOINTS, KP_DIMS), dtype=np.float32)
            if pose_res.pose_landmarks:
                for i, lm in enumerate(pose_res.pose_landmarks[0]):
                    arr[i] = [lm.x, lm.y, lm.visibility]
            for j, hand_lms in enumerate(hand_res.hand_landmarks):
                side   = hand_res.handedness[j][0].category_name
                offset = 33 if side == "Left" else 54
                for i, lm in enumerate(hand_lms):
                    arr[offset + i] = [lm.x, lm.y, 1.0]
            buffer.append(arr)

            # REC indicator
            cv2.circle(frame, (30, 30), 12, (0, 0, 220), -1)
            cv2.putText(frame, f"REC {len(buffer)}/{NUM_FRAMES}",
                        (50, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,220), 2)

            if len(buffer) == NUM_FRAMES:
                kp = normalize(np.stack(list(buffer)))
                last_preds = predict(model, kp, idx_to_gloss, top)
                recording = False
                buffer.clear()

        # Hiển thị predictions
        for idx, (gloss, prob) in enumerate(last_preds):
            color = (0, 255, 80) if idx == 0 else (180, 180, 180)
            cv2.putText(frame, f"{gloss}: {prob*100:.1f}%",
                        (10, 75 + idx * 32),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.75, color, 2)

        # Hint
        status = "● REC" if recording else "[ SPACE ] to sign"
        cv2.putText(frame, status, (10, frame.shape[0] - 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

        cv2.imshow("Sign Recognition Demo", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        if key == ord(" ") and not recording:
            recording = True
            buffer.clear()
            last_preds = []

    cap.release()
    cv2.destroyAllWindows()
    pose_det.close()
    hand_det.close()


# =====================================================================
# Entry point
# =====================================================================
def main():
    ap = argparse.ArgumentParser(description="WLASL Sign Language Demo")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--video",   type=Path, help="Đường dẫn 1 file video")
    g.add_argument("--folder",  type=Path, help="Folder chứa nhiều video")
    g.add_argument("--webcam",  action="store_true", help="Real-time webcam")
    ap.add_argument("--top", type=int, default=5, help="Hiển thị top-N dự đoán")
    args = ap.parse_args()

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    if args.video:
        run_video(args.video, args.top)
    elif args.folder:
        run_folder(args.folder, args.top)
    else:
        run_webcam(args.top)


if __name__ == "__main__":
    main()
