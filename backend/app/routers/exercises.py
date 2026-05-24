import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.content import Exercise
from app.schemas.content import ExerciseUpdate, ExerciseOut
from app.dependencies import require_admin

router = APIRouter(prefix="/api/exercises", tags=["exercises"])


@router.put("/{exercise_id}", response_model=ExerciseOut)
async def update_exercise(exercise_id: uuid.UUID, body: ExerciseUpdate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(Exercise).where(Exercise.id == exercise_id))
    exercise = result.scalar_one_or_none()
    if not exercise:
        raise HTTPException(404, "Exercise not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(exercise, k, v)
    await db.commit()
    await db.refresh(exercise)
    return exercise


@router.delete("/{exercise_id}", status_code=204)
async def delete_exercise(exercise_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(Exercise).where(Exercise.id == exercise_id))
    exercise = result.scalar_one_or_none()
    if not exercise:
        raise HTTPException(404, "Exercise not found")
    await db.delete(exercise)
    await db.commit()
