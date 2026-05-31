import uuid
from math import ceil
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.content import Lesson, Exercise
from app.models.quiz import QuizQuestion
from app.schemas.content import (
    ExerciseCreate,
    ExerciseOut,
    ExerciseUpdate,
    LessonCreate,
    LessonDetailOut,
    LessonOut,
    LessonPageOut,
    LessonUpdate,
)
from app.schemas.quiz import QuizQuestionCreate, QuizQuestionUpdate, QuizQuestionOut
from app.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("", response_model=LessonPageOut)
async def list_lessons(
    topic_id: uuid.UUID | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    count_query = select(func.count(Lesson.id))
    q = (
        select(Lesson)
        .options(
            selectinload(Lesson.exercises),
            selectinload(Lesson.quiz_questions),
        )
        .order_by(Lesson.sort_order, Lesson.id)
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    if topic_id:
        count_query = count_query.where(Lesson.topic_id == topic_id)
        q = q.where(Lesson.topic_id == topic_id)

    total = (await db.execute(count_query)).scalar_one()
    result = await db.execute(q)
    lessons = result.scalars().all()
    return LessonPageOut(
        items=lessons,
        total=total,
        page=page,
        page_size=page_size,
        pages=ceil(total / page_size) if total else 0,
    )


@router.post("", response_model=LessonOut, status_code=201)
async def create_lesson(body: LessonCreate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    lesson = Lesson(**body.model_dump())
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return lesson


@router.get("/{lesson_id}", response_model=LessonDetailOut)
async def get_lesson(lesson_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(
        select(Lesson)
        .options(
            selectinload(Lesson.exercises),
            selectinload(Lesson.quiz_questions),
        )
        .where(Lesson.id == lesson_id)
    )
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(404, "Lesson not found")

    next_lesson_id = (
        await db.execute(
            select(Lesson.id)
            .where(
                Lesson.topic_id == lesson.topic_id,
                Lesson.id != lesson.id,
                or_(
                    Lesson.sort_order > lesson.sort_order,
                    and_(
                        Lesson.sort_order == lesson.sort_order,
                        Lesson.id > lesson.id,
                    ),
                ),
            )
            .order_by(Lesson.sort_order, Lesson.id)
            .limit(1)
        )
    ).scalar_one_or_none()

    out = LessonDetailOut.model_validate(lesson)
    out.next_lesson_id = next_lesson_id
    return out


@router.put("/{lesson_id}", response_model=LessonOut)
async def update_lesson(lesson_id: uuid.UUID, body: LessonUpdate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(lesson, k, v)
    await db.commit()
    await db.refresh(lesson)
    return lesson


@router.delete("/{lesson_id}", status_code=204)
async def delete_lesson(lesson_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    await db.delete(lesson)
    await db.commit()


# --- Exercises ---

@router.get("/{lesson_id}/exercises", response_model=list[ExerciseOut])
async def list_exercises(lesson_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(Exercise).where(Exercise.lesson_id == lesson_id).order_by(Exercise.sort_order))
    return result.scalars().all()


@router.post("/{lesson_id}/exercises", response_model=ExerciseOut, status_code=201)
async def create_exercise(lesson_id: uuid.UUID, body: ExerciseCreate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    exercise = Exercise(lesson_id=lesson_id, **body.model_dump())
    db.add(exercise)
    await db.commit()
    await db.refresh(exercise)
    return exercise


# --- Quiz Questions ---

@router.get("/{lesson_id}/questions", response_model=list[QuizQuestionOut])
async def list_questions(lesson_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(QuizQuestion).where(QuizQuestion.lesson_id == lesson_id))
    return result.scalars().all()


@router.post("/{lesson_id}/questions", response_model=QuizQuestionOut, status_code=201)
async def create_question(lesson_id: uuid.UUID, body: QuizQuestionCreate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    lesson = (await db.execute(select(Lesson).where(Lesson.id == lesson_id))).scalar_one_or_none()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    question = QuizQuestion(
        lesson_id=lesson_id,
        topic_id=lesson.topic_id,
        **body.model_dump(),
    )
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question
