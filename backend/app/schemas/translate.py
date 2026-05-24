from typing import Literal
from pydantic import BaseModel


class TranslateRequest(BaseModel):
    image: str  # base64 or data URL
    kind: Literal["alphabet", "word"] = "alphabet"


class PredictionItem(BaseModel):
    label: str
    confidence: float


class TranslateResponse(BaseModel):
    kind: str
    label: str
    confidence: float
    top_k: list[PredictionItem]
    model_loaded: bool
