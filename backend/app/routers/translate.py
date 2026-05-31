from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_current_user
from app.schemas.translate import (
    GeminiSignGradeRequest,
    GeminiSignGradeResponse,
    ImageTranslateRequest,
    KeypointTranslateRequest,
    TranslateResponse,
)
from app.services.alphabet_service import recognize_image
from app.services.gemini_sign_grader import (
    classify_alphabet_with_gemini,
    grade_sign_with_gemini,
)
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


@router.post("/sign-alphabet-gemini", response_model=TranslateResponse)
async def sign_alphabet_gemini(body: ImageTranslateRequest, _=Depends(get_current_user)):
    """Fallback ASL alphabet recognition using Gemini."""
    try:
        label, confidence = await classify_alphabet_with_gemini(body.image)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    return {
        "kind": "alphabet",
        "label": label,
        "confidence": confidence,
        "top_k": [{"label": label, "confidence": confidence}],
        "model_loaded": True,
    }


@router.post("/sign-grade", response_model=GeminiSignGradeResponse)
async def sign_grade(body: GeminiSignGradeRequest, _=Depends(get_current_user)):
    """
    Grade a submitted sign image against an expected label using Gemini.
    """
    is_correct, confidence, reasoning = await grade_sign_with_gemini(
        image=body.image,
        expected_label=body.expected_label.strip(),
    )
    return {
        "expected_label": body.expected_label.strip(),
        "is_correct": is_correct,
        "confidence": confidence,
        "reasoning": reasoning,
    }
