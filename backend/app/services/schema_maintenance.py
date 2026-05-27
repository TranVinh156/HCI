from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection


async def ensure_quiz_question_topic_relation(conn: AsyncConnection) -> None:
    await conn.execute(text("ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS topic_id UUID"))
    await conn.execute(text("ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS video_url TEXT"))
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
            UPDATE quiz_questions AS q
            SET video_url = COALESCE(
                substring(q.hint FROM 'https?://[^[:space:]]+'),
                substring(l.sign_hint FROM 'https?://[^[:space:]]+')
            )
            FROM lessons AS l
            WHERE q.lesson_id = l.id
              AND q.video_url IS NULL
              AND (
                q.hint ~ 'https?://'
                OR l.sign_hint ~ 'https?://'
              )
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


async def ensure_topic_quiz_attempts_table(conn: AsyncConnection) -> None:
    await conn.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS topic_quiz_attempts (
                id UUID PRIMARY KEY,
                student_profile_id UUID NOT NULL
                    REFERENCES student_profiles(id)
                    ON DELETE CASCADE,
                topic_id UUID NOT NULL
                    REFERENCES topics(id)
                    ON DELETE CASCADE,
                correct INTEGER NOT NULL DEFAULT 0,
                total INTEGER NOT NULL DEFAULT 0,
                completed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
            )
            """
        )
    )
    await conn.execute(
        text(
            """
            CREATE INDEX IF NOT EXISTS ix_topic_quiz_attempts_profile_topic
            ON topic_quiz_attempts(student_profile_id, topic_id)
            """
        )
    )
