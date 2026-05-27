import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.content import Lesson
from app.models.quiz import QuizQuestion
from app.schemas.quiz import QuizQuestionUpdate, QuizQuestionOut
from app.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/questions", tags=["quizzes"])


@router.get("", response_model=list[QuizQuestionOut])
async def list_questions(
    topic_id: uuid.UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    query = select(QuizQuestion).join(Lesson).order_by(Lesson.sort_order, QuizQuestion.id)
    if topic_id:
        query = query.where(QuizQuestion.topic_id == topic_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.put("/{question_id}", response_model=QuizQuestionOut)
async def update_question(question_id: uuid.UUID, body: QuizQuestionUpdate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(QuizQuestion).where(QuizQuestion.id == question_id))
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(404, "Question not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(question, k, v)
    await db.commit()
    await db.refresh(question)
    return question


@router.delete("/{question_id}", status_code=204)
async def delete_question(question_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(QuizQuestion).where(QuizQuestion.id == question_id))
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(404, "Question not found")
    await db.delete(question)
    await db.commit()
