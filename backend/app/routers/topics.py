import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.content import Topic, Lesson
from app.schemas.content import TopicCreate, TopicUpdate, TopicOut
from app.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/topics", tags=["topics"])


@router.get("", response_model=list[TopicOut])
async def list_topics(db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(Topic).order_by(Topic.sort_order))
    topics = result.scalars().all()

    counts = await db.execute(
        select(Lesson.topic_id, func.count(Lesson.id)).group_by(Lesson.topic_id)
    )
    count_map = {row[0]: row[1] for row in counts}

    out = []
    for t in topics:
        d = TopicOut.model_validate(t)
        d.lesson_count = count_map.get(t.id, 0)
        out.append(d)
    return out


@router.post("", response_model=TopicOut, status_code=201)
async def create_topic(body: TopicCreate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    topic = Topic(**body.model_dump())
    db.add(topic)
    await db.commit()
    await db.refresh(topic)
    return TopicOut.model_validate(topic)


@router.get("/{topic_id}", response_model=TopicOut)
async def get_topic(topic_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(Topic).where(Topic.id == topic_id))
    topic = result.scalar_one_or_none()
    if not topic:
        raise HTTPException(404, "Topic not found")
    count = await db.execute(select(func.count(Lesson.id)).where(Lesson.topic_id == topic_id))
    out = TopicOut.model_validate(topic)
    out.lesson_count = count.scalar() or 0
    return out


@router.put("/{topic_id}", response_model=TopicOut)
async def update_topic(topic_id: uuid.UUID, body: TopicUpdate, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(Topic).where(Topic.id == topic_id))
    topic = result.scalar_one_or_none()
    if not topic:
        raise HTTPException(404, "Topic not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(topic, k, v)
    await db.commit()
    await db.refresh(topic)
    return TopicOut.model_validate(topic)


@router.delete("/{topic_id}", status_code=204)
async def delete_topic(topic_id: uuid.UUID, db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(Topic).where(Topic.id == topic_id))
    topic = result.scalar_one_or_none()
    if not topic:
        raise HTTPException(404, "Topic not found")
    await db.delete(topic)
    await db.commit()
