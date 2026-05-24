import uuid
from pydantic import BaseModel


class QuizQuestionCreate(BaseModel):
    prompt: str
    type: str
    options: list[str]
    answer: str
    hint: str | None = None


class QuizQuestionUpdate(BaseModel):
    prompt: str | None = None
    type: str | None = None
    options: list[str] | None = None
    answer: str | None = None
    hint: str | None = None


class QuizQuestionOut(BaseModel):
    id: uuid.UUID
    lesson_id: uuid.UUID
    prompt: str
    type: str
    options: list[str]
    answer: str
    hint: str | None

    model_config = {"from_attributes": True}
