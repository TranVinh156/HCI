import uuid
from pydantic import BaseModel


class OverviewStats(BaseModel):
    total_students: int
    total_topics: int
    total_lessons: int
    total_questions: int
    total_attempts: int


class StudentStat(BaseModel):
    profile_id: uuid.UUID
    name: str
    xp: int
    stars: int
    completed_lessons: int
    streak: int


class LessonStat(BaseModel):
    lesson_id: uuid.UUID
    title: str
    topic_title: str
    attempt_count: int
    avg_score: float


class StudentDetail(BaseModel):
    profile_id: uuid.UUID
    name: str
    xp: int
    stars: int
    streak: int
    completed_lessons: int
    total_attempts: int
    avg_accuracy: float
