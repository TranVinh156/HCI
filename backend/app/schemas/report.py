import uuid
from pydantic import BaseModel


class OverviewChartPoint(BaseModel):
    label: str
    value: int


class TopicInventoryPoint(BaseModel):
    label: str
    lessons: int
    questions: int


class OverviewStats(BaseModel):
    total_students: int
    total_topics: int
    total_lessons: int
    total_questions: int
    total_attempts: int
    lesson_type_distribution: list[OverviewChartPoint]
    question_type_distribution: list[OverviewChartPoint]
    difficulty_distribution: list[OverviewChartPoint]
    content_readiness: list[OverviewChartPoint]
    topic_inventory: list[TopicInventoryPoint]


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
