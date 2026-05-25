from pathlib import Path

from pydantic_settings import BaseSettings


BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/signocean"
    jwt_secret: str = "changeme"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    admin_email: str = "admin@signocean.local"
    admin_username: str = "admin"
    admin_password: str = "admin123"

    model_config = {"env_file": BACKEND_DIR / ".env"}


settings = Settings()
