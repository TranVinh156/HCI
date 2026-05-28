from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings


BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/signocean"
    cors_allow_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    jwt_secret: str = "changeme"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    admin_email: str = "admin@signocean.local"
    admin_username: str = "admin"
    admin_password: str = "admin123"

    model_config = {"env_file": BACKEND_DIR / ".env"}

    @field_validator("database_url")
    @classmethod
    def use_async_postgres_driver(cls, value: str) -> str:
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

    @field_validator("cors_allow_origins", mode="before")
    @classmethod
    def split_cors_allow_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


settings = Settings()
