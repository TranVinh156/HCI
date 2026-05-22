import uuid
from pydantic import BaseModel


class TopicCreate(BaseModel):
    title: str
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    sort_order: int = 0


class TopicUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    sort_order: int | None = None


class TopicOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    icon: str | None
    color: str | None
    sort_order: int
    lesson_count: int = 0

    model_config = {"from_attributes": True}


class LessonCreate(BaseModel):
    topic_id: uuid.UUID
    type: str = "vocabulary"
    title: str
    phrase: str | None = None
    description: str | None = None
    visual: str | None = None
    sign_hint: str | None = None
    difficulty: str = "Easy"
    xp: int = 10
    sort_order: int = 0


class LessonUpdate(BaseModel):
    type: str | None = None
    title: str | None = None
    phrase: str | None = None
    description: str | None = None
    visual: str | None = None
    sign_hint: str | None = None
    difficulty: str | None = None
    xp: int | None = None
    sort_order: int | None = None


class LessonOut(BaseModel):
    id: uuid.UUID
    topic_id: uuid.UUID
    type: str
    title: str
    phrase: str | None
    description: str | None
    visual: str | None
    sign_hint: str | None
    difficulty: str
    xp: int
    sort_order: int

    model_config = {"from_attributes": True}


class ExerciseCreate(BaseModel):
    type: str
    content: dict
    sort_order: int = 0


class ExerciseUpdate(BaseModel):
    type: str | None = None
    content: dict | None = None
    sort_order: int | None = None


class ExerciseOut(BaseModel):
    id: uuid.UUID
    lesson_id: uuid.UUID
    type: str
    content: dict
    sort_order: int

    model_config = {"from_attributes": True}
