from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.user import StudentProfile
from app.models.content import Topic, Lesson
from app.models.quiz import QuizQuestion
from app.models.progress import StudentProgress, CompletedLesson, LessonAttempt
from app.schemas.report import OverviewStats, StudentStat, LessonStat, StudentDetail


async def get_overview(db: AsyncSession) -> OverviewStats:
    students = (await db.execute(select(func.count(StudentProfile.id)))).scalar() or 0
    topics = (await db.execute(select(func.count(Topic.id)))).scalar() or 0
    lessons = (await db.execute(select(func.count(Lesson.id)))).scalar() or 0
    questions = (await db.execute(select(func.count(QuizQuestion.id)))).scalar() or 0
    attempts = (await db.execute(select(func.count(LessonAttempt.id)))).scalar() or 0
    return OverviewStats(total_students=students, total_topics=topics, total_lessons=lessons, total_questions=questions, total_attempts=attempts)


async def get_student_stats(db: AsyncSession) -> list[StudentStat]:
    profiles = (await db.execute(select(StudentProfile))).scalars().all()
    result = []
    for p in profiles:
        prog = (await db.execute(select(StudentProgress).where(StudentProgress.student_profile_id == p.id))).scalar_one_or_none()
        completed = (await db.execute(select(func.count(CompletedLesson.lesson_id)).where(CompletedLesson.student_profile_id == p.id))).scalar() or 0
        result.append(StudentStat(
            profile_id=p.id,
            name=p.name,
            xp=prog.xp if prog else 0,
            stars=prog.stars if prog else 0,
            completed_lessons=completed,
            streak=prog.streak if prog else 0,
        ))
    return result


async def get_lesson_stats(db: AsyncSession) -> list[LessonStat]:
    lessons = (await db.execute(select(Lesson))).scalars().all()
    topic_map = {t.id: t.title for t in (await db.execute(select(Topic))).scalars().all()}
    result = []
    for lesson in lessons:
        attempts = (await db.execute(select(LessonAttempt).where(LessonAttempt.lesson_id == lesson.id))).scalars().all()
        avg = sum(a.correct / a.total for a in attempts if a.total > 0) / len(attempts) if attempts else 0.0
        result.append(LessonStat(
            lesson_id=lesson.id,
            title=lesson.title,
            topic_title=topic_map.get(lesson.topic_id, ""),
            attempt_count=len(attempts),
            avg_score=round(avg, 2),
        ))
    return result


async def get_student_detail(profile_id, db: AsyncSession) -> StudentDetail | None:
    p = (await db.execute(select(StudentProfile).where(StudentProfile.id == profile_id))).scalar_one_or_none()
    if not p:
        return None
    prog = (await db.execute(select(StudentProgress).where(StudentProgress.student_profile_id == profile_id))).scalar_one_or_none()
    completed = (await db.execute(select(func.count(CompletedLesson.lesson_id)).where(CompletedLesson.student_profile_id == profile_id))).scalar() or 0
    attempts = (await db.execute(select(LessonAttempt).where(LessonAttempt.student_profile_id == profile_id))).scalars().all()
    avg_acc = sum(a.correct / a.total for a in attempts if a.total > 0) / len(attempts) if attempts else 0.0
    return StudentDetail(
        profile_id=p.id,
        name=p.name,
        xp=prog.xp if prog else 0,
        stars=prog.stars if prog else 0,
        streak=prog.streak if prog else 0,
        completed_lessons=completed,
        total_attempts=len(attempts),
        avg_accuracy=round(avg_acc, 2),
    )
