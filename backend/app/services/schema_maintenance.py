from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection


async def ensure_quiz_question_topic_relation(conn: AsyncConnection) -> None:
    await conn.execute(text("ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS topic_id UUID"))
    await conn.execute(
        text(
            """
            UPDATE quiz_questions AS q
            SET topic_id = l.topic_id
            FROM lessons AS l
            WHERE q.lesson_id = l.id
              AND q.topic_id IS NULL
            """
        )
    )
    await conn.execute(
        text(
            """
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'quiz_questions_topic_id_fkey'
                ) THEN
                    ALTER TABLE quiz_questions
                    ADD CONSTRAINT quiz_questions_topic_id_fkey
                    FOREIGN KEY (topic_id)
                    REFERENCES topics(id)
                    ON DELETE CASCADE;
                END IF;
            END $$;
            """
        )
    )
    await conn.execute(
        text(
            """
            CREATE INDEX IF NOT EXISTS ix_quiz_questions_topic_id
            ON quiz_questions(topic_id)
            """
        )
    )
    await conn.execute(text("ALTER TABLE quiz_questions ALTER COLUMN topic_id SET NOT NULL"))
