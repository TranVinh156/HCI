import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.content import Lesson, Exercise
from app.models.quiz import QuizQuestion
from app.schemas.content import LessonCreate, LessonUpdate, LessonOut, ExerciseCreate, ExerciseUpdate, ExerciseOut
from app.schemas.quiz import QuizQuestionCreate, QuizQuestionUpdate, QuizQuestionOut
from app.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("", response_model=list[LessonOut])
async def list_lessons(
    topic_id: uuid.UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    q = select(Lesson).order_by(Lesson.sort_order)
    if topic_id:
        q = q.where(Lesson.topic_id == topic_id)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=LessonOut, status_code=201)
async def create_lesson(body: LessonCreate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    lesson = Lesson(**body.model_dump())
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return lesson


@router.get("/{lesson_id}", response_model=LessonOut)
async def get_lesson(lesson_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    return lesson


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
    question = QuizQuestion(lesson_id=lesson_id, **body.model_dump())
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question
