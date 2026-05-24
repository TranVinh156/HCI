#!/bin/sh
set -e

echo "→ Running database setup"
python - <<'PY'
import asyncio
from app.database import engine, Base
import app.models  # noqa: F401 — register models

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(main())
print("✓ Tables ensured")
PY

echo "→ Starting FastAPI"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
