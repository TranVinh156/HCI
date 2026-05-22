import uuid
from pydantic import BaseModel


class StudentProfileCreate(BaseModel):
    name: str
    age: int | None = None
    avatar: str | None = None
    guardian_name: str | None = None


class StudentProfileUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
    avatar: str | None = None
    guardian_name: str | None = None


class StudentProfileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    age: int | None
    avatar: str | None
    guardian_name: str | None

    model_config = {"from_attributes": True}
