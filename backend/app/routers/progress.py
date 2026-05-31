import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

from app.database import get_db
from app.models.user import User, StudentProfile
from app.models.content import Lesson, Topic
from app.models.progress import StudentProgress, CompletedLesson, TopicProgress, LessonAttempt, TopicQuizAttempt, EarnedBadge
from app.schemas.progress import CompleteLessonRequest, CompleteTopicQuizRequest, ProgressOut, BadgeOut, LessonAttemptOut, TopicProgressOut, TopicQuizAttemptOut
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
    attempt_rows = (await db.execute(
        select(LessonAttempt, Lesson.title)
        .join(Lesson, Lesson.id == LessonAttempt.lesson_id)
        .where(LessonAttempt.student_profile_id == profile_id)
        .order_by(LessonAttempt.completed_at)
    )).all()
    total_lessons = (await db.execute(select(func.count(Lesson.id)))).scalar_one()
    completion_percentage = round(
        (len(completed) / total_lessons) * 100
    ) if total_lessons else 0
    earned = (await db.execute(
        select(EarnedBadge).where(EarnedBadge.student_profile_id == profile_id)
    )).scalars().all()
    topic_counts = (await db.execute(
        select(Topic.id, func.count(Lesson.id))
        .outerjoin(Lesson, Lesson.topic_id == Topic.id)
        .group_by(Topic.id)
    )).all()
    topic_progress_rows = (await db.execute(
        select(TopicProgress).where(TopicProgress.student_profile_id == profile_id)
    )).scalars().all()
    topic_progress_map = {row.topic_id: row for row in topic_progress_rows}

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
        total_lessons=total_lessons,
        completion_percentage=completion_percentage,
        completed_lesson_ids=[c.lesson_id for c in completed],
        topic_progress=[
            TopicProgressOut(
                topic_id=topic_id,
                last_completed_lesson_id=topic_progress_map[topic_id].last_completed_lesson_id
                if topic_id in topic_progress_map
                else None,
                completed_lesson_count=topic_progress_map[topic_id].completed_lesson_count
                if topic_id in topic_progress_map
                else 0,
                total_lessons=lesson_count,
                completion_percentage=round(
                    (
                        (
                            topic_progress_map[topic_id].completed_lesson_count
                            if topic_id in topic_progress_map
                            else 0
                        )
                        / lesson_count
                    )
                    * 100
                )
                if lesson_count
                else 0,
            )
            for topic_id, lesson_count in topic_counts
        ],
        earned_badges=[BadgeOut.model_validate(b) for b in badges],
        attempts=[
            LessonAttemptOut(
                lesson_id=attempt.lesson_id,
                lesson_title=lesson_title,
                correct=attempt.correct,
                total=attempt.total,
                completed_at=attempt.completed_at,
            )
            for attempt, lesson_title in attempt_rows
        ],
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
