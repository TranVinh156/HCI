import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="guardian")  # 'admin' | 'guardian'
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    profiles: Mapped[list["StudentProfile"]] = relationship("StudentProfile", back_populates="user", cascade="all, delete")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    avatar: Mapped[str | None] = mapped_column(String(10), nullable=True)
    guardian_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="profiles")
    progress: Mapped["StudentProgress | None"] = relationship("StudentProgress", back_populates="profile", uselist=False, cascade="all, delete")
    completed_lessons: Mapped[list["CompletedLesson"]] = relationship("CompletedLesson", back_populates="profile", cascade="all, delete")
    attempts: Mapped[list["LessonAttempt"]] = relationship("LessonAttempt", back_populates="profile", cascade="all, delete")
    topic_quiz_attempts: Mapped[list["TopicQuizAttempt"]] = relationship("TopicQuizAttempt", back_populates="profile", cascade="all, delete")
    earned_badges: Mapped[list["EarnedBadge"]] = relationship("EarnedBadge", back_populates="profile", cascade="all, delete")
