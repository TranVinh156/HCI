from pydantic import BaseModel, Field


class KeypointTranslateRequest(BaseModel):
    # frames: (T, 75, 3) — per-frame MediaPipe keypoints (33 pose + 21 LH + 21 RH).
    # Extracted in the browser; the backend normalizes and runs the model.
    frames: list[list[list[float]]] = Field(..., min_length=1)


class ImageTranslateRequest(BaseModel):
    image: str = Field(..., description="Base64 data URL or raw base64 image")
    kind: str = Field(default="alphabet", description="alphabet | word")


class PredictionItem(BaseModel):
    label: str
    confidence: float


class TranslateResponse(BaseModel):
    kind: str
    label: str
    confidence: float
    top_k: list[PredictionItem]
    model_loaded: bool
