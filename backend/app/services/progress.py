from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.progress import StudentProgress, CompletedLesson, LessonAttempt, EarnedBadge
from app.models.badge import Badge
from app.models.content import Lesson


async def get_or_create_progress(profile_id, db: AsyncSession) -> StudentProgress:
    result = await db.execute(select(StudentProgress).where(StudentProgress.student_profile_id == profile_id))
    prog = result.scalar_one_or_none()
    if not prog:
        prog = StudentProgress(student_profile_id=profile_id)
        db.add(prog)
        await db.flush()
    return prog


async def complete_lesson(profile_id, lesson_id, correct: int, total: int, db: AsyncSession) -> list[Badge]:
    lesson = (await db.execute(select(Lesson).where(Lesson.id == lesson_id))).scalar_one_or_none()
    if not lesson:
        return []

    # Record attempt
    attempt = LessonAttempt(student_profile_id=profile_id, lesson_id=lesson_id, correct=correct, total=total)
    db.add(attempt)

    # Mark completed (upsert — ignore if already exists)
    already = (await db.execute(
        select(CompletedLesson).where(
            CompletedLesson.student_profile_id == profile_id,
            CompletedLesson.lesson_id == lesson_id,
        )
    )).scalar_one_or_none()
    if not already:
        db.add(CompletedLesson(student_profile_id=profile_id, lesson_id=lesson_id))

    # Update progress: XP + stars
    prog = await get_or_create_progress(profile_id, db)
    prog.xp += lesson.xp
    if correct == total and total > 0:
        prog.stars += 1

    # Streak logic
    today = date.today()
    if prog.last_active_date != today:
        if prog.last_active_date and (today - prog.last_active_date).days == 1:
            prog.streak += 1
        elif prog.last_active_date and (today - prog.last_active_date).days > 1:
            prog.streak = 1
        else:
            prog.streak = max(prog.streak, 1)
        prog.last_active_date = today

    await db.flush()

    # Count total completed lessons for this profile
    completed_count = (await db.execute(
        select(func.count(CompletedLesson.lesson_id)).where(CompletedLesson.student_profile_id == profile_id)
    )).scalar() or 0

    # Award badges
    new_badges: list[Badge] = []
    all_badges = (await db.execute(select(Badge))).scalars().all()
    earned_ids = {
        row[0] for row in (await db.execute(
            select(EarnedBadge.badge_id).where(EarnedBadge.student_profile_id == profile_id)
        )).all()
    }

    for badge in all_badges:
        if badge.id in earned_ids:
            continue
        should_award = False
        if badge.slug == "first-ocean-step" and completed_count >= 1:
            should_award = True
        elif badge.slug == "perfect-answers" and correct == total and total > 0:
            should_award = True
        elif badge.slug == "steady-learner" and completed_count >= 3:
            should_award = True

        if should_award:
            db.add(EarnedBadge(student_profile_id=profile_id, badge_id=badge.id))
            new_badges.append(badge)

    await db.commit()
    return new_badges
