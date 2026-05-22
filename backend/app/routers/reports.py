import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.report import OverviewStats, StudentStat, LessonStat, StudentDetail
from app.services.reports import get_overview, get_student_stats, get_lesson_stats, get_student_detail
from app.dependencies import require_admin

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/overview", response_model=OverviewStats)
async def overview(db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    return await get_overview(db)


@router.get("/students", response_model=list[StudentStat])
async def students(db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    return await get_student_stats(db)


@router.get("/students/{profile_id}", response_model=StudentDetail)
async def student_detail(profile_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    detail = await get_student_detail(profile_id, db)
    if not detail:
        raise HTTPException(404, "Student not found")
    return detail


@router.get("/lessons", response_model=list[LessonStat])
async def lessons(db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    return await get_lesson_stats(db)
