"""
Seed lessons from WLASL_v0.3.json.

Run from the repository root:
    cd backend
    python scripts/seed_wlasl_lessons.py --json ../WLASL_v0.3.json

Useful options:
    --dry-run            Preview grouping without writing to the database.
    --limit 200          Import only the first 200 WLASL glosses.
    --replace-wlasl      Remove previously generated WLASL topics first.
    --batch-size 50      Commit every 50 lessons to avoid one long transaction.
    --db-timeout 30      Fail a stalled database operation after 30 seconds.
    --topic-start 1      Start from the first planned topic, using 1-based indexing.
    --topic-count 2      Seed only two topics from the topic range.
    --lesson-start 1     Start from the first lesson inside each selected topic.
    --lesson-count 50    Seed only 50 lessons per selected topic.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from sqlalchemy import delete, func, select

BACKEND_DIR = Path(__file__).resolve().parents[1]
REPO_DIR = BACKEND_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import AsyncSessionLocal, Base, engine  # noqa: E402
from app.models import *  # noqa: F401, F403, E402
from app.models.content import Exercise, Lesson, Topic  # noqa: E402
from app.models.quiz import QuizQuestion  # noqa: E402
from app.services.schema_maintenance import ensure_quiz_question_topic_relation  # noqa: E402


LEGACY_WLASL_TOPIC_PREFIX = "WLASL - "
DEFAULT_DB_TIMEOUT_SECONDS = 30.0
DEFAULT_BATCH_SIZE = 50


@dataclass(frozen=True)
class TopicRule:
    key: str
    title: str
    description: str
    icon: str
    color: str
    visual: str
    words: set[str]


TOPIC_RULES = [
    TopicRule(
        key="family",
        title="Family & People",
        description="ASL vocabulary about family members, people, and relationships.",
        icon="Users",
        color="teal",
        visual="👥",
        words={
            "aunt",
            "baby",
            "boy",
            "brother",
            "child",
            "children",
            "cousin",
            "dad",
            "daughter",
            "family",
            "father",
            "friend",
            "girl",
            "grandfather",
            "grandma",
            "grandmother",
            "grandpa",
            "he",
            "her",
            "herself",
            "him",
            "himself",
            "husband",
            "man",
            "mother",
            "parent",
            "people",
            "person",
            "sister",
            "son",
            "they",
            "uncle",
            "we",
            "wife",
            "woman",
            "you",
        },
    ),
    TopicRule(
        key="colors",
        title="Colors",
        description="ASL vocabulary for colors and visual descriptions.",
        icon="Palette",
        color="blue",
        visual="🎨",
        words={
            "black",
            "blue",
            "brown",
            "color",
            "dark",
            "gold",
            "gray",
            "green",
            "grey",
            "light",
            "orange",
            "pink",
            "purple",
            "red",
            "silver",
            "tan",
            "white",
            "yellow",
        },
    ),
    TopicRule(
        key="school",
        title="School & Learning",
        description="ASL vocabulary for school, study, and classroom objects.",
        icon="BookOpen",
        color="green",
        visual="📚",
        words={
            "book",
            "class",
            "college",
            "computer",
            "dictionary",
            "education",
            "english",
            "graduate",
            "homework",
            "language",
            "learn",
            "library",
            "math",
            "paper",
            "pencil",
            "read",
            "school",
            "science",
            "sign",
            "student",
            "study",
            "teacher",
            "test",
            "university",
            "write",
        },
    ),
    TopicRule(
        key="food",
        title="Food & Drink",
        description="ASL vocabulary for meals, food, drinks, and ingredients.",
        icon="Utensils",
        color="amber",
        visual="🍽️",
        words={
            "apple",
            "banana",
            "bread",
            "breakfast",
            "cake",
            "candy",
            "cheese",
            "chicken",
            "coffee",
            "cook",
            "cookie",
            "corn",
            "dinner",
            "drink",
            "eat",
            "egg",
            "fish",
            "food",
            "fruit",
            "hamburger",
            "icecream",
            "juice",
            "lunch",
            "meat",
            "milk",
            "pizza",
            "potato",
            "rice",
            "salad",
            "sandwich",
            "soup",
            "tea",
            "thanksgiving",
            "vegetable",
            "water",
        },
    ),
    TopicRule(
        key="actions",
        title="Actions & Verbs",
        description="ASL vocabulary for common actions and movement.",
        icon="Activity",
        color="violet",
        visual="🏃",
        words={
            "ask",
            "bring",
            "buy",
            "call",
            "catch",
            "change",
            "clean",
            "close",
            "come",
            "dance",
            "do",
            "drive",
            "fall",
            "find",
            "finish",
            "give",
            "go",
            "help",
            "jump",
            "kiss",
            "leave",
            "like",
            "listen",
            "look",
            "make",
            "move",
            "open",
            "play",
            "pull",
            "push",
            "run",
            "see",
            "send",
            "show",
            "sit",
            "sleep",
            "stand",
            "start",
            "stop",
            "take",
            "talk",
            "think",
            "try",
            "use",
            "wait",
            "walk",
            "want",
            "wash",
            "watch",
            "work",
        },
    ),
    TopicRule(
        key="questions",
        title="Questions & Communication",
        description="ASL vocabulary for questions, responses, and conversation.",
        icon="MessageCircle",
        color="cyan",
        visual="💬",
        words={
            "again",
            "answer",
            "because",
            "but",
            "can",
            "conversation",
            "deaf",
            "fine",
            "hello",
            "how",
            "maybe",
            "name",
            "no",
            "please",
            "question",
            "sorry",
            "thank",
            "thanks",
            "what",
            "when",
            "where",
            "which",
            "who",
            "why",
            "yes",
        },
    ),
    TopicRule(
        key="time",
        title="Time & Calendar",
        description="ASL vocabulary for time, days, months, and sequence.",
        icon="Clock",
        color="slate",
        visual="🕒",
        words={
            "after",
            "afternoon",
            "again",
            "before",
            "day",
            "early",
            "evening",
            "future",
            "hour",
            "later",
            "minute",
            "month",
            "morning",
            "night",
            "now",
            "past",
            "today",
            "tomorrow",
            "week",
            "year",
            "yesterday",
        },
    ),
    TopicRule(
        key="places",
        title="Places & Travel",
        description="ASL vocabulary for places, directions, and travel.",
        icon="MapPin",
        color="indigo",
        visual="🗺️",
        words={
            "airport",
            "america",
            "bathroom",
            "beach",
            "building",
            "car",
            "church",
            "city",
            "country",
            "drive",
            "home",
            "hospital",
            "house",
            "left",
            "office",
            "place",
            "restaurant",
            "right",
            "room",
            "store",
            "street",
            "travel",
            "washington",
            "world",
        },
    ),
    TopicRule(
        key="feelings",
        title="Feelings & Descriptions",
        description="ASL vocabulary for emotions, states, and descriptive words.",
        icon="Smile",
        color="yellow",
        visual="😊",
        words={
            "angry",
            "bad",
            "beautiful",
            "big",
            "bored",
            "busy",
            "cold",
            "cool",
            "cute",
            "different",
            "easy",
            "excited",
            "fast",
            "favorite",
            "funny",
            "good",
            "happy",
            "hard",
            "hot",
            "hungry",
            "interesting",
            "new",
            "old",
            "pretty",
            "sad",
            "same",
            "short",
            "sick",
            "slow",
            "small",
            "sorry",
            "tall",
            "thin",
            "tired",
            "wrong",
        },
    ),
    TopicRule(
        key="animals",
        title="Animals & Nature",
        description="ASL vocabulary for animals, nature, and outdoor words.",
        icon="Trees",
        color="emerald",
        visual="🌿",
        words={
            "animal",
            "bird",
            "cat",
            "dog",
            "fish",
            "flower",
            "horse",
            "rain",
            "river",
            "snow",
            "tree",
            "waterfall",
            "weather",
        },
    ),
    TopicRule(
        key="objects",
        title="Objects & Everyday Life",
        description="ASL vocabulary for clothing, household items, and everyday objects.",
        icon="Package",
        color="rose",
        visual="⭐",
        words={
            "bed",
            "chair",
            "clothes",
            "coat",
            "door",
            "dress",
            "glass",
            "hat",
            "key",
            "money",
            "phone",
            "picture",
            "shirt",
            "shoe",
            "table",
            "television",
            "window",
        },
    ),
    TopicRule(
        key="general_a_d",
        title="General Vocabulary A-D",
        description="WLASL signs from A to D that do not match a narrower starter topic.",
        icon="Sparkles",
        color="purple",
        visual="✨",
        words=set(),
    ),
    TopicRule(
        key="general_e_h",
        title="General Vocabulary E-H",
        description="WLASL signs from E to H that do not match a narrower starter topic.",
        icon="Sparkles",
        color="purple",
        visual="✨",
        words=set(),
    ),
    TopicRule(
        key="general_i_m",
        title="General Vocabulary I-M",
        description="WLASL signs from I to M that do not match a narrower starter topic.",
        icon="Sparkles",
        color="purple",
        visual="✨",
        words=set(),
    ),
    TopicRule(
        key="general_n_r",
        title="General Vocabulary N-R",
        description="WLASL signs from N to R that do not match a narrower starter topic.",
        icon="Sparkles",
        color="purple",
        visual="✨",
        words=set(),
    ),
    TopicRule(
        key="general_s_z",
        title="General Vocabulary S-Z",
        description="WLASL signs from S to Z that do not match a narrower starter topic.",
        icon="Sparkles",
        color="purple",
        visual="✨",
        words=set(),
    ),
]


TOPIC_BY_KEY = {rule.key: rule for rule in TOPIC_RULES}


def general_topic_key(gloss: str) -> str:
    first = normalize_gloss(gloss)[:1]
    if first <= "d":
        return "general_a_d"
    if first <= "h":
        return "general_e_h"
    if first <= "m":
        return "general_i_m"
    if first <= "r":
        return "general_n_r"
    return "general_s_z"


def normalize_gloss(value: str) -> str:
    return " ".join(value.replace("-", " ").replace("_", " ").split()).lower()


def display_phrase(gloss: str) -> str:
    normalized = normalize_gloss(gloss)
    return normalized.upper() if len(normalized) == 1 else normalized.title()


def classify_topic(gloss: str) -> TopicRule:
    parts = set(normalize_gloss(gloss).split())
    normalized = normalize_gloss(gloss)
    for rule in TOPIC_RULES:
        if rule.key.startswith("general_"):
            continue
        if normalized in rule.words or parts.intersection(rule.words):
            return rule
    return TOPIC_BY_KEY[general_topic_key(gloss)]


def choose_difficulty(gloss: str, instances: list[dict[str, Any]], index: int) -> str:
    normalized = normalize_gloss(gloss)
    train_count = sum(1 for item in instances if item.get("split") == "train")
    has_phrase = len(normalized.split()) > 1
    is_short = len(normalized) <= 10
    if index < 300 or (train_count >= 8 and is_short and not has_phrase):
        return "Easy"
    return "Medium"


def choose_xp(difficulty: str) -> int:
    return 10 if difficulty == "Easy" else 15


def best_instance(instances: list[dict[str, Any]]) -> dict[str, Any] | None:
    if not instances:
        return None
    preferred_sources = ("aslsignbank", "aslbrick", "aslpro", "spreadthesign")
    split_rank = {"train": 0, "val": 1, "test": 2}

    def rank(instance: dict[str, Any]) -> tuple[int, int, int]:
        source = str(instance.get("source") or "")
        source_rank = (
            preferred_sources.index(source)
            if source in preferred_sources
            else len(preferred_sources)
        )
        split = split_rank.get(str(instance.get("split") or ""), 9)
        has_direct_video = 0 if str(instance.get("url") or "").endswith(".mp4") else 1
        return (has_direct_video, source_rank, split)

    return sorted(instances, key=rank)[0]


def build_lesson_payload(
    gloss: str,
    instances: list[dict[str, Any]],
    index: int,
    topic_rule: TopicRule,
    sort_order: int,
) -> dict[str, Any]:
    phrase = display_phrase(gloss)
    difficulty = choose_difficulty(gloss, instances, index)
    instance = best_instance(instances)
    url = instance.get("url") if instance else None
    source = instance.get("source") if instance else None
    video_id = instance.get("video_id") if instance else None
    sign_hint = f"Practice the ASL sign for '{phrase}'."
    if url:
        sign_hint += f" Reference video: {url}"

    return {
        "type": "communication" if topic_rule.key == "questions" else "vocabulary",
        "title": phrase,
        "phrase": phrase,
        "description": f"WLASL sign lesson for '{phrase}' in {topic_rule.title}.",
        "visual": topic_rule.visual,
        "sign_hint": sign_hint,
        "difficulty": difficulty,
        "xp": choose_xp(difficulty),
        "sort_order": sort_order,
        "metadata": {
            "gloss": normalize_gloss(gloss),
            "instance_count": len(instances),
            "train_count": sum(1 for item in instances if item.get("split") == "train"),
            "reference_url": url,
            "reference_source": source,
            "reference_video_id": video_id,
            "wlasl_index": index,
        },
    }


def build_exercises(payload: dict[str, Any]) -> list[dict[str, Any]]:
    metadata = payload["metadata"]
    phrase = payload["phrase"]
    return [
        {
            "type": "learning",
            "sort_order": 0,
            "content": {
                "title": phrase,
                "content": payload["description"],
                "gloss": metadata["gloss"],
                "source": "WLASL",
                "reference_url": metadata["reference_url"],
                "reference_source": metadata["reference_source"],
                "reference_video_id": metadata["reference_video_id"],
            },
        },
        {
            "type": "sign_practice",
            "sort_order": 1,
            "content": {
                "prompt": f"Practice the ASL sign for {phrase}.",
                "target": phrase,
                "hint": payload["sign_hint"],
                "reference_url": metadata["reference_url"],
            },
        },
        {
            "type": "completion",
            "sort_order": 2,
            "content": {
                "message": f"You completed the WLASL lesson for {phrase}.",
                "xp": payload["xp"],
            },
        },
    ]


def build_questions(payload: dict[str, Any], distractors: list[str]) -> list[dict[str, Any]]:
    phrase = payload["phrase"]
    options = [phrase, *[item for item in distractors if item != phrase]][:4]
    return [
        {
            "prompt": "What word does this ASL sign represent?",
            "type": "image-choice",
            "options": options,
            "answer": phrase,
            "hint": payload["sign_hint"],
        },
        {
            "prompt": f"Choose the correct meaning for '{phrase}'.",
            "type": "sign-choice",
            "options": options,
            "answer": phrase,
            "hint": "Use the WLASL reference sign in the lesson card.",
        },
    ]


def load_wlasl(path: Path, limit: int | None) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)
    if not isinstance(data, list):
        raise ValueError("WLASL JSON must contain a list of gloss records.")
    if limit is not None:
        return data[:limit]
    return data


def make_plan(records: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    grouped: dict[str, list[dict[str, Any]]] = {rule.key: [] for rule in TOPIC_RULES}
    for index, record in enumerate(records):
        gloss = str(record.get("gloss") or "").strip()
        if not gloss:
            continue
        instances = record.get("instances") or []
        if not isinstance(instances, list):
            instances = []
        topic_rule = classify_topic(gloss)
        grouped[topic_rule.key].append(
            build_lesson_payload(
                gloss=gloss,
                instances=instances,
                index=index,
                topic_rule=topic_rule,
                sort_order=len(grouped[topic_rule.key]),
            )
        )
    return {key: values for key, values in grouped.items() if values}


def slice_plan(
    plan: dict[str, list[dict[str, Any]]],
    *,
    topic_start: int,
    topic_count: int | None,
    lesson_start: int,
    lesson_count: int | None,
) -> dict[str, list[dict[str, Any]]]:
    topic_offset = topic_start - 1
    lesson_offset = lesson_start - 1
    topic_items = list(plan.items())[topic_offset:]
    if topic_count is not None:
        topic_items = topic_items[:topic_count]

    sliced: dict[str, list[dict[str, Any]]] = {}
    for key, lessons in topic_items:
        selected_lessons = lessons[lesson_offset:]
        if lesson_count is not None:
            selected_lessons = selected_lessons[:lesson_count]
        if selected_lessons:
            sliced[key] = selected_lessons
    return sliced


def topic_sort_order(rule: TopicRule) -> int:
    return 100 + TOPIC_RULES.index(rule)


def legacy_topic_title(rule: TopicRule) -> str:
    return f"{LEGACY_WLASL_TOPIC_PREFIX}{rule.title}"


def print_progress(
    current: int,
    total: int,
    *,
    created: int,
    updated: int,
    width: int = 32,
) -> None:
    if total <= 0:
        return

    ratio = current / total
    filled = min(width, int(width * ratio))
    bar = "#" * filled + "-" * (width - filled)
    percent = ratio * 100
    message = (
        f"\rSeeding lessons [{bar}] {current}/{total} "
        f"({percent:5.1f}%) created={created} updated={updated}"
    )
    print(message, end="", flush=True)


async def with_db_timeout(awaitable, label: str, timeout: float):
    try:
        return await asyncio.wait_for(awaitable, timeout=timeout)
    except TimeoutError as exc:
        raise TimeoutError(
            f"Database operation timed out after {timeout:.0f}s while {label}."
        ) from exc


async def db_execute(db, statement, label: str, timeout: float):
    return await with_db_timeout(db.execute(statement), label, timeout)


async def db_flush(db, label: str, timeout: float) -> None:
    await with_db_timeout(db.flush(), label, timeout)


async def db_commit(db, label: str, timeout: float) -> None:
    await with_db_timeout(db.commit(), label, timeout)


async def upsert_topic(db, rule: TopicRule, timeout: float) -> Topic:
    result = await db_execute(
        db,
        select(Topic).where(Topic.title.in_([rule.title, legacy_topic_title(rule)])),
        f"loading topic {rule.title}",
        timeout,
    )
    topics = result.scalars().all()
    topic = next((item for item in topics if item.title == rule.title), None)
    if topic is None and topics:
        topic = topics[0]
    if topic is None:
        topic = Topic(
            title=rule.title,
            description=rule.description,
            icon=rule.icon,
            color=rule.color,
            sort_order=topic_sort_order(rule),
        )
        db.add(topic)
        await db_flush(db, f"creating topic {rule.title}", timeout)
        return topic

    topic.title = rule.title
    topic.description = rule.description
    topic.icon = rule.icon
    topic.color = rule.color
    topic.sort_order = topic_sort_order(rule)
    return topic


async def upsert_lesson(
    db,
    topic: Topic,
    payload: dict[str, Any],
    timeout: float,
) -> tuple[Lesson, bool]:
    result = await db_execute(
        db,
        select(Lesson).where(
            Lesson.topic_id == topic.id,
            func.lower(Lesson.phrase) == payload["phrase"].lower(),
        ),
        f"loading lesson {payload['phrase']}",
        timeout,
    )
    lesson = result.scalar_one_or_none()
    created = lesson is None
    if lesson is None:
        lesson = Lesson(topic_id=topic.id)
        db.add(lesson)

    lesson.type = payload["type"]
    lesson.title = payload["title"]
    lesson.phrase = payload["phrase"]
    lesson.description = payload["description"]
    lesson.visual = payload["visual"]
    lesson.sign_hint = payload["sign_hint"]
    lesson.difficulty = payload["difficulty"]
    lesson.xp = payload["xp"]
    lesson.sort_order = payload["sort_order"]
    await db_flush(db, f"upserting lesson {payload['phrase']}", timeout)
    return lesson, created


async def ensure_children(
    db,
    lesson: Lesson,
    payload: dict[str, Any],
    distractors: list[str],
    timeout: float,
) -> tuple[int, int]:
    exercise_count = (
        await db_execute(
            db,
            select(func.count(Exercise.id)).where(Exercise.lesson_id == lesson.id),
            f"counting exercises for {payload['phrase']}",
            timeout,
        )
    ).scalar_one()
    question_count = (
        await db_execute(
            db,
            select(func.count(QuizQuestion.id)).where(QuizQuestion.lesson_id == lesson.id),
            f"counting questions for {payload['phrase']}",
            timeout,
        )
    ).scalar_one()

    exercises_created = 0
    questions_created = 0
    if exercise_count == 0:
        for item in build_exercises(payload):
            db.add(Exercise(lesson_id=lesson.id, **item))
            exercises_created += 1

    if question_count == 0 and len(distractors) >= 3:
        for item in build_questions(payload, distractors):
            db.add(QuizQuestion(lesson_id=lesson.id, topic_id=lesson.topic_id, **item))
            questions_created += 1

    return exercises_created, questions_created


async def seed(args: argparse.Namespace) -> None:
    json_path = Path(args.json)
    if not json_path.is_absolute():
        json_path = (Path.cwd() / json_path).resolve()
    if not json_path.exists():
        fallback = REPO_DIR / "WLASL_v0.3.json"
        if fallback.exists():
            json_path = fallback
        else:
            raise FileNotFoundError(f"Cannot find WLASL JSON at {json_path}")

    records = load_wlasl(json_path, args.limit)
    plan = make_plan(records)
    plan = slice_plan(
        plan,
        topic_start=args.topic_start,
        topic_count=args.topic_count,
        lesson_start=args.lesson_start,
        lesson_count=args.lesson_count,
    )

    print(f"Loaded {sum(len(items) for items in plan.values())} WLASL lessons from {json_path}")
    print(
        "Selected range: "
        f"topics from {args.topic_start}"
        f"{f' count {args.topic_count}' if args.topic_count is not None else ''}, "
        f"lessons from {args.lesson_start}"
        f"{f' count {args.lesson_count}' if args.lesson_count is not None else ''}"
    )
    for key, lessons in plan.items():
        print(f"  {TOPIC_BY_KEY[key].title}: {len(lessons)} lessons")

    if args.dry_run:
        return

    async with engine.begin() as conn:
        await with_db_timeout(
            conn.run_sync(Base.metadata.create_all),
            "creating database tables",
            args.db_timeout,
        )
        await with_db_timeout(
            ensure_quiz_question_topic_relation(conn),
            "ensuring quiz question topic relation",
            args.db_timeout,
        )

    topics_created = 0
    lessons_created = 0
    lessons_updated = 0
    exercises_created = 0
    questions_created = 0
    total_lessons = sum(len(items) for items in plan.values())
    processed_lessons = 0
    progress_started_at = time.monotonic()

    async with AsyncSessionLocal() as db:
        if args.replace_wlasl:
            wlasl_topic_titles = [
                title
                for rule in TOPIC_RULES
                for title in (rule.title, legacy_topic_title(rule))
            ]
            await db_execute(
                db,
                delete(Topic).where(Topic.title.in_(wlasl_topic_titles)),
                "deleting old WLASL topics",
                args.db_timeout,
            )
            await db_commit(db, "committing deleted WLASL topics", args.db_timeout)

        for key, lesson_payloads in plan.items():
            rule = TOPIC_BY_KEY[key]
            existing_topics = (
                await db_execute(
                    db,
                    select(Topic).where(
                        Topic.title.in_([rule.title, legacy_topic_title(rule)])
                    ),
                    f"checking topic {rule.title}",
                    args.db_timeout,
                )
            ).scalars().all()
            if not existing_topics:
                topics_created += 1
            topic = await upsert_topic(db, rule, args.db_timeout)

            topic_phrases = [payload["phrase"] for payload in lesson_payloads]
            global_phrases = [
                payload["phrase"]
                for payloads in plan.values()
                for payload in payloads
            ]
            for payload in lesson_payloads:
                lesson, created = await upsert_lesson(
                    db,
                    topic,
                    payload,
                    args.db_timeout,
                )
                if created:
                    lessons_created += 1
                else:
                    lessons_updated += 1

                distractors = [
                    phrase for phrase in topic_phrases if phrase != payload["phrase"]
                ]
                if len(distractors) < 3:
                    distractors.extend(
                        phrase
                        for phrase in global_phrases
                        if phrase != payload["phrase"] and phrase not in distractors
                    )
                created_exercises, created_questions = await ensure_children(
                    db,
                    lesson,
                    payload,
                    distractors[:3],
                    args.db_timeout,
                )
                exercises_created += created_exercises
                questions_created += created_questions
                processed_lessons += 1
                print_progress(
                    processed_lessons,
                    total_lessons,
                    created=lessons_created,
                    updated=lessons_updated,
                )
                if processed_lessons % args.batch_size == 0:
                    await db_commit(
                        db,
                        f"committing batch ending at lesson {processed_lessons}",
                        args.db_timeout,
                    )

        await db_commit(db, "committing final batch", args.db_timeout)

    elapsed = time.monotonic() - progress_started_at
    print()
    print("WLASL seed completed.")
    print(f"  Elapsed: {elapsed:.1f}s")
    print(f"  Topics created: {topics_created}")
    print(f"  Lessons created: {lessons_created}")
    print(f"  Lessons updated: {lessons_updated}")
    print(f"  Exercises created: {exercises_created}")
    print(f"  Questions created: {questions_created}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed lessons from WLASL_v0.3.json")
    parser.add_argument(
        "--json",
        default=str(REPO_DIR / "WLASL_v0.3.json"),
        help="Path to WLASL_v0.3.json.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Import only the first N WLASL records.",
    )
    parser.add_argument(
        "--replace-wlasl",
        action="store_true",
        help="Delete topics generated by this script before seeding.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print grouping summary without writing to the database.",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help="Commit every N lessons while writing to the database.",
    )
    parser.add_argument(
        "--db-timeout",
        type=float,
        default=DEFAULT_DB_TIMEOUT_SECONDS,
        help="Seconds to wait before failing a single database operation.",
    )
    parser.add_argument(
        "--topic-start",
        type=int,
        default=1,
        help="1-based topic index to start seeding from after grouping WLASL words.",
    )
    parser.add_argument(
        "--topic-count",
        type=int,
        default=None,
        help="Number of grouped topics to seed from --topic-start.",
    )
    parser.add_argument(
        "--lesson-start",
        type=int,
        default=1,
        help="1-based lesson index to start from inside each selected topic.",
    )
    parser.add_argument(
        "--lesson-count",
        type=int,
        default=None,
        help="Number of lessons to seed inside each selected topic.",
    )
    args = parser.parse_args()
    if args.batch_size < 1:
        parser.error("--batch-size must be at least 1")
    if args.db_timeout <= 0:
        parser.error("--db-timeout must be greater than 0")
    if args.topic_start < 1:
        parser.error("--topic-start must be at least 1")
    if args.topic_count is not None and args.topic_count < 1:
        parser.error("--topic-count must be at least 1")
    if args.lesson_start < 1:
        parser.error("--lesson-start must be at least 1")
    if args.lesson_count is not None and args.lesson_count < 1:
        parser.error("--lesson-count must be at least 1")
    return args


if __name__ == "__main__":
    asyncio.run(seed(parse_args()))
