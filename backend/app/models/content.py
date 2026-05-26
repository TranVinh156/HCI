import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    lessons: Mapped[list["Lesson"]] = relationship("Lesson", back_populates="topic", cascade="all, delete", order_by="Lesson.sort_order")
    quiz_questions: Mapped[list["QuizQuestion"]] = relationship("QuizQuestion", back_populates="topic", cascade="all, delete")


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    type: Mapped[str] = mapped_column(String(20), default="vocabulary")  # 'vocabulary' | 'communication'
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    phrase: Mapped[str | None] = mapped_column(String(200), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    visual: Mapped[str | None] = mapped_column(String(20), nullable=True)
    sign_hint: Mapped[str | None] = mapped_column(Text, nullable=True)
    difficulty: Mapped[str] = mapped_column(String(10), default="Easy")  # 'Easy' | 'Medium'
    xp: Mapped[int] = mapped_column(Integer, default=10)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    topic: Mapped["Topic"] = relationship("Topic", back_populates="lessons")
    exercises: Mapped[list["Exercise"]] = relationship("Exercise", back_populates="lesson", cascade="all, delete", order_by="Exercise.sort_order")
    quiz_questions: Mapped[list["QuizQuestion"]] = relationship("QuizQuestion", back_populates="lesson", cascade="all, delete")


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lesson_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # 'learning' | 'sign_practice' | 'quiz' | 'completion'
    content: Mapped[dict] = mapped_column(JSONB, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="exercises")
