import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User, StudentProfile
from app.models.content import Topic
from app.models.progress import StudentProgress, CompletedLesson, LessonAttempt, TopicQuizAttempt, EarnedBadge
from app.schemas.progress import CompleteLessonRequest, CompleteTopicQuizRequest, ProgressOut, BadgeOut, TopicQuizAttemptOut
from app.services.progress import complete_lesson, get_or_create_progress
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/progress", tags=["progress"])


async def _check_profile_ownership(profile_id: uuid.UUID, current_user: User, db: AsyncSession) -> StudentProfile:
    result = await db.execute(select(StudentProfile).where(StudentProfile.id == profile_id, StudentProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile


@router.get("/{profile_id}", response_model=ProgressOut)
async def get_progress(profile_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await _check_profile_ownership(profile_id, current_user, db)

    prog = await get_or_create_progress(profile_id, db)
    await db.commit()

    completed = (await db.execute(select(CompletedLesson).where(CompletedLesson.student_profile_id == profile_id))).scalars().all()
    attempts = (await db.execute(select(LessonAttempt).where(LessonAttempt.student_profile_id == profile_id))).scalars().all()
    earned = (await db.execute(
        select(EarnedBadge).where(EarnedBadge.student_profile_id == profile_id)
    )).scalars().all()

    from app.models.badge import Badge
    badge_ids = [e.badge_id for e in earned]
    badges = []
    if badge_ids:
        badges = (await db.execute(select(Badge).where(Badge.id.in_(badge_ids)))).scalars().all()

    return ProgressOut(
        student_profile_id=profile_id,
        xp=prog.xp,
        stars=prog.stars,
        streak=prog.streak,
        completed_lesson_ids=[c.lesson_id for c in completed],
        earned_badges=[BadgeOut.model_validate(b) for b in badges],
        attempts=attempts,
    )


@router.post("/{profile_id}/complete", response_model=list[BadgeOut])
async def complete(profile_id: uuid.UUID, body: CompleteLessonRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await _check_profile_ownership(profile_id, current_user, db)
    new_badges = await complete_lesson(profile_id, body.lesson_id, body.correct, body.total, db)
    return [BadgeOut.model_validate(b) for b in new_badges]


@router.get("/{profile_id}/topic-quiz-attempts/{topic_id}", response_model=list[TopicQuizAttemptOut])
async def list_topic_quiz_attempts(
    profile_id: uuid.UUID,
    topic_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _check_profile_ownership(profile_id, current_user, db)
    result = await db.execute(
        select(TopicQuizAttempt)
        .where(
            TopicQuizAttempt.student_profile_id == profile_id,
            TopicQuizAttempt.topic_id == topic_id,
        )
        .order_by(TopicQuizAttempt.completed_at.desc())
    )
    return result.scalars().all()


@router.post("/{profile_id}/topic-quiz-attempts", response_model=TopicQuizAttemptOut)
async def complete_topic_quiz(
    profile_id: uuid.UUID,
    body: CompleteTopicQuizRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _check_profile_ownership(profile_id, current_user, db)
    topic = (await db.execute(select(Topic).where(Topic.id == body.topic_id))).scalar_one_or_none()
    if not topic:
        raise HTTPException(404, "Topic not found")

    attempt = TopicQuizAttempt(
        student_profile_id=profile_id,
        topic_id=body.topic_id,
        correct=body.correct,
        total=body.total,
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    return attempt
