import uuid
from datetime import datetime
from pydantic import BaseModel


class CompleteLessonRequest(BaseModel):
    lesson_id: uuid.UUID
    correct: int
    total: int


class CompleteTopicQuizRequest(BaseModel):
    topic_id: uuid.UUID
    correct: int
    total: int


class BadgeOut(BaseModel):
    id: uuid.UUID
    slug: str
    title: str
    description: str | None
    icon: str | None

    model_config = {"from_attributes": True}


class LessonAttemptOut(BaseModel):
    lesson_id: uuid.UUID
    correct: int
    total: int
    completed_at: datetime

    model_config = {"from_attributes": True}


class TopicQuizAttemptOut(BaseModel):
    id: uuid.UUID
    student_profile_id: uuid.UUID
    topic_id: uuid.UUID
    correct: int
    total: int
    completed_at: datetime

    model_config = {"from_attributes": True}


class ProgressOut(BaseModel):
    student_profile_id: uuid.UUID
    xp: int
    stars: int
    streak: int
    completed_lesson_ids: list[uuid.UUID]
    earned_badges: list[BadgeOut]
    attempts: list[LessonAttemptOut]
