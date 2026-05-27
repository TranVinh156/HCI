from sqlalchemy import select

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.user import User
from app.services.auth import hash_password


async def ensure_admin_user() -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(User).where(User.username == settings.admin_username)
        )
        user = result.scalar_one_or_none()
        if user is not None:
            if user.role != "admin":
                user.role = "admin"
                await db.commit()
            return

        db.add(
            User(
                email=settings.admin_email,
                username=settings.admin_username,
                password_hash=hash_password(settings.admin_password),
                role="admin",
            )
        )
        await db.commit()
