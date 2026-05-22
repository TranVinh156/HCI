from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.dependencies import get_current_user
from app.schemas.translate import TranslateRequest, TranslateResponse
from app.services.sign_recognition import recognize

router = APIRouter(prefix="/api/translate", tags=["translate"])


@router.post("/sign-to-text", response_model=TranslateResponse)
async def sign_to_text(body: TranslateRequest, _=Depends(get_current_user)):
    """Predict a sign label from a base64-encoded image."""
    result = recognize(body.kind, body.image)
    return result


@router.post("/sign-to-text/upload", response_model=TranslateResponse)
async def sign_to_text_upload(
    file: UploadFile = File(...),
    kind: str = Form(default="alphabet"),
    _=Depends(get_current_user),
):
    """Same as sign-to-text but accepts a multipart file upload."""
    image_bytes = await file.read()
    if kind not in ("alphabet", "word"):
        kind = "alphabet"
    result = recognize(kind, image_bytes)  # type: ignore[arg-type]
    return result
