from collections import defaultdict

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

    topic_rows = (await db.execute(select(Topic).order_by(Topic.sort_order))).scalars().all()
    lesson_rows = (await db.execute(select(Lesson))).scalars().all()
    question_rows = (await db.execute(select(QuizQuestion))).scalars().all()

    return OverviewStats(
        total_students=students,
        total_topics=topics,
        total_lessons=lessons,
        total_questions=questions,
        total_attempts=attempts,
        lesson_type_distribution=_count_by_field(lesson_rows, "type"),
        question_type_distribution=_count_by_field(question_rows, "type"),
        difficulty_distribution=_count_by_field(lesson_rows, "difficulty"),
        content_readiness=_build_content_readiness(lesson_rows, question_rows),
        topic_inventory=_build_topic_inventory(topic_rows, lesson_rows, question_rows),
    )


def _count_by_field(rows: list, field_name: str) -> list[dict]:
    counts: dict[str, int] = defaultdict(int)
    for row in rows:
        value = getattr(row, field_name) or "Unknown"
        counts[str(value).replace("_", " ").title()] += 1
    return [
        {"label": label, "value": value}
        for label, value in sorted(counts.items(), key=lambda item: item[0])
    ]


def _build_content_readiness(
    lesson_rows: list[Lesson],
    question_rows: list[QuizQuestion],
) -> list[dict]:
    question_count_by_lesson: dict = defaultdict(int)
    for question in question_rows:
        question_count_by_lesson[question.lesson_id] += 1

    ready = sum(1 for lesson in lesson_rows if question_count_by_lesson[lesson.id] > 0)
    needs_quiz = len(lesson_rows) - ready
    return [
        {"label": "Ready", "value": ready},
        {"label": "Needs Quiz", "value": needs_quiz},
    ]


def _build_topic_inventory(
    topic_rows: list[Topic],
    lesson_rows: list[Lesson],
    question_rows: list[QuizQuestion],
) -> list[dict]:
    lesson_count_by_topic: dict = defaultdict(int)
    for lesson in lesson_rows:
        lesson_count_by_topic[lesson.topic_id] += 1

    question_count_by_topic: dict = defaultdict(int)
    for question in question_rows:
        question_count_by_topic[question.topic_id] += 1

    result = []
    for topic in topic_rows:
        result.append(
            {
                "label": topic.title,
                "lessons": lesson_count_by_topic[topic.id],
                "questions": question_count_by_topic[topic.id],
            }
        )
    return result


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
