from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_current_user
from app.schemas.translate import (
    ImageTranslateRequest,
    KeypointTranslateRequest,
    TranslateResponse,
)
from app.services.alphabet_service import recognize_image
from app.services.landmark_sign_service import recognize_landmark_keypoints
from app.services.sign_service import NUM_KEYPOINTS, KP_DIMS, recognize_keypoints

router = APIRouter(prefix="/api/translate", tags=["translate"])


@router.post("/sign-to-text", response_model=TranslateResponse)
async def sign_to_text(body: ImageTranslateRequest, _=Depends(get_current_user)):
    """Predict ASL alphabet (A-Z + del/nothing/space) from a single image."""
    if body.kind == "word":
        return {
            "kind": "word",
            "label": "—",
            "confidence": 0.0,
            "top_k": [],
            "model_loaded": False,
        }
    try:
        return recognize_image(body.image)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))


@router.post("/sign-keypoints", response_model=TranslateResponse)
async def sign_keypoints(body: KeypointTranslateRequest, _=Depends(get_current_user)):
    """Predict an ASL word from a clip of MediaPipe keypoints.

    Expects `frames` of shape (T, 75, 3) extracted in the browser.
    """
    for frame in body.frames:
        if len(frame) != NUM_KEYPOINTS or any(len(pt) != KP_DIMS for pt in frame):
            raise HTTPException(
                status_code=422,
                detail=f"Each frame must be {NUM_KEYPOINTS} keypoints of {KP_DIMS} dims.",
            )
    return recognize_keypoints(body.frames)


@router.post("/sign-landmark", response_model=TranslateResponse)
async def sign_landmark(body: KeypointTranslateRequest, _=Depends(get_current_user)):
    """Predict letter/digit/word using the BiLSTM landmark model (46 classes).

    Accepts frames of shape (T, 75, 3) — same wire format as /sign-keypoints,
    but the 3rd dim must be z (not visibility). T can be 1 for a static sign
    (the backend repeats it x20) or any length (uniformly sampled to 20).
    """
    for frame in body.frames:
        if len(frame) != NUM_KEYPOINTS or any(len(pt) != KP_DIMS for pt in frame):
            raise HTTPException(
                status_code=422,
                detail=f"Each frame must be {NUM_KEYPOINTS} keypoints of {KP_DIMS} dims.",
            )
    return recognize_landmark_keypoints(body.frames)
