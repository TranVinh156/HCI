import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User, StudentProfile
from app.schemas.profile import StudentProfileCreate, StudentProfileUpdate, StudentProfileOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/profiles", tags=["profiles"])


@router.get("", response_model=list[StudentProfileOut])
async def list_profiles(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id))
    return result.scalars().all()


@router.post("", response_model=StudentProfileOut, status_code=201)
async def create_profile(body: StudentProfileCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = StudentProfile(user_id=current_user.id, **body.model_dump())
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile


@router.get("/{profile_id}", response_model=StudentProfileOut)
async def get_profile(profile_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(StudentProfile).where(StudentProfile.id == profile_id, StudentProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile


@router.put("/{profile_id}", response_model=StudentProfileOut)
async def update_profile(profile_id: uuid.UUID, body: StudentProfileUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(StudentProfile).where(StudentProfile.id == profile_id, StudentProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(404, "Profile not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(profile, k, v)
    await db.commit()
    await db.refresh(profile)
    return profile


@router.delete("/{profile_id}", status_code=204)
async def delete_profile(profile_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(StudentProfile).where(StudentProfile.id == profile_id, StudentProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(404, "Profile not found")
    await db.delete(profile)
    await db.commit()
