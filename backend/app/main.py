from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401 - register SQLAlchemy models
from app.database import Base, engine
from app.routers import auth, profiles, topics, lessons, exercises, quizzes, progress, reports, translate

app = FastAPI(title="SignOcean API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(topics.router)
app.include_router(lessons.router)
app.include_router(exercises.router)
app.include_router(quizzes.router)
app.include_router(progress.router)
app.include_router(reports.router)
app.include_router(translate.router)


@app.on_event("startup")
async def ensure_database_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health():
    return {"status": "ok"}
