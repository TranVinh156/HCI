"""
Generate SVG visuals for existing lessons and seed them into lessons.visual.

Usage:
  python backend/scripts/generate_lesson_svg_visuals.py
  python backend/scripts/generate_lesson_svg_visuals.py --only-missing
  python backend/scripts/generate_lesson_svg_visuals.py --dry-run

The script:
  1. Alters lessons.visual to TEXT so SVG data URLs fit.
  2. Queries current lessons from the database.
  3. Generates one deterministic SVG per lesson from title/phrase/type.
  4. Writes the SVG files to backend/generated_lesson_visuals/.
  5. Stores each SVG as a base64 data URL in lessons.visual.
"""

from __future__ import annotations

import argparse
import asyncio
import base64
import hashlib
import html
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import engine  # noqa: E402


PALETTES = [
    ("#00C2E4", "#DFF8FF", "#123040", "#FBBF24"),
    ("#14B8A6", "#E0F7F3", "#123040", "#FB7185"),
    ("#0677B8", "#EAF7FB", "#123040", "#34D399"),
    ("#F59E0B", "#FFF4D6", "#123040", "#00C2E4"),
    ("#8B5CF6", "#F0EAFF", "#123040", "#FBBF24"),
    ("#10B981", "#ECFDF5", "#123040", "#38BDF8"),
]


@dataclass(frozen=True)
class LessonRow:
    id: str
    title: str
    phrase: str | None
    type: str
    visual: str | None
    sort_order: int


def slugify(value: str | None) -> str:
    if not value:
        return "lesson"
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")
    return slug or "lesson"


def display_text(value: str | None, fallback: str) -> str:
    text_value = (value or fallback).strip()
    return html.escape(text_value[:22])


def initials(title: str, phrase: str | None) -> str:
    source = (phrase or title).strip()
    if len(source) == 1 and source.isalpha():
        return source.upper()

    words = [word for word in re.split(r"\s+", source) if word]
    if not words:
        return "ASL"
    if len(words) == 1:
        return words[0][:2].upper()
    return "".join(word[0] for word in words[:2]).upper()


def palette_for(lesson: LessonRow) -> tuple[str, str, str, str]:
    digest = hashlib.sha1(f"{lesson.id}:{lesson.title}".encode("utf-8")).digest()
    return PALETTES[digest[0] % len(PALETTES)]


COLOR_VALUES = {
    "black": "#111827",
    "blue": "#2563EB",
    "brown": "#8B5E34",
    "dark": "#1F2937",
    "gold": "#D97706",
    "gray": "#6B7280",
    "green": "#16A34A",
    "grey": "#6B7280",
    "orange": "#F97316",
    "pink": "#EC4899",
    "purple": "#7C3AED",
    "red": "#DC2626",
    "silver": "#94A3B8",
    "tan": "#D6B48C",
    "white": "#F8FAFC",
    "yellow": "#FACC15",
}


KEYWORD_CATEGORIES: list[tuple[str, set[str]]] = [
    ("family", {"aunt", "baby", "boy", "brother", "child", "children", "cousin", "dad", "daughter", "family", "father", "girl", "grandfather", "grandma", "grandmother", "her", "herself", "husband", "man", "mother", "people", "person", "sister", "son", "uncle", "we", "wife", "woman", "you", "they"}),
    ("color", set(COLOR_VALUES)),
    ("food", {"apple", "banana", "bar", "bread", "breakfast", "cake", "candy", "cereal", "cheese", "chicken", "coffee", "cookie", "cook", "corn", "dinner", "drink", "eat", "egg", "food", "fruit", "hamburger", "hot-dog", "hungry", "lunch", "meat", "milk", "pizza", "potato", "restaurant", "salad", "sandwich", "soup", "tea", "vegetable", "water"}),
    ("animal", {"animal", "bird", "cat", "cow", "dog", "fish", "horse"}),
    ("school", {"backpack", "book", "class", "college", "dictionary", "education", "graduate", "high-school", "homework", "learn", "library", "math", "paper", "pencil", "read", "school", "science", "student", "study", "teacher", "test", "university", "write"}),
    ("home_place", {"africa", "america", "bath", "bathroom", "bed", "building", "church", "city", "country", "dining-room", "door", "home", "hospital", "house", "new-york", "office", "place", "room", "south-america", "store", "street", "table", "washington", "window", "world"}),
    ("time", {"after", "afternoon", "again", "all-day", "before", "clock", "day", "early", "evening", "from-now-on", "future", "hour", "last-week", "last-year", "later", "minute", "month", "morning", "new", "night", "now", "past", "today", "tomorrow", "week", "year", "yesterday"}),
    ("question", {"answer", "ask", "how", "name", "question", "what", "when", "where", "which", "who", "why"}),
    ("emotion", {"angry", "bad", "beautiful", "bored", "crazy", "cry", "cute", "delicious", "excited", "favorite", "fine", "funny", "good", "happy", "hard", "interesting", "like", "pretty", "sad", "sick", "sorry", "thank-you", "tired", "want", "wrong", "yes", "no"}),
    ("nature_weather", {"flower", "rain", "river", "snow", "tree", "waterfall", "weather"}),
    ("clothing", {"blanket", "clothes", "coat", "dress", "glass", "hat", "shirt"}),
    ("body_health", {"accident", "age", "beard", "cold", "cough", "deaf", "hard-of-hearing", "hot", "language", "sign", "sign-language", "sleep", "thin"}),
    ("movement", {"arrive", "back", "balance", "basketball", "bowling", "bring", "buy", "call", "catch", "change", "chat", "clean", "close", "come", "come-here", "copy", "crash", "dance", "decide", "delay", "disappear", "discuss", "divorce", "don-t-want", "draw", "drive", "drop", "fall-in-love", "find", "finish", "give", "give-up", "go", "help", "jump", "kiss", "leave", "listen", "look-at", "look-for", "make", "move", "open", "play", "pull", "push", "run", "same", "see", "send", "show", "sit", "slow", "stand", "start", "stop", "take", "take-turns", "take-up", "talk", "think", "travel", "try", "use", "wait", "walk", "wash", "wash-face", "watch", "work"}),
]


def lesson_key(lesson: LessonRow) -> str:
    return slugify(f"{lesson.phrase or ''} {lesson.title}")


def category_for(lesson: LessonRow) -> str:
    key = lesson_key(lesson)
    tokens = set(key.split("-"))
    phrases = {key}
    for category, keywords in KEYWORD_CATEGORIES:
        for keyword in keywords:
            if keyword in phrases or keyword in tokens or f"-{keyword}-" in f"-{key}-":
                return category
    return "hand"


def color_for_lesson(lesson: LessonRow, fallback: str) -> str:
    key = lesson_key(lesson)
    for name, color in COLOR_VALUES.items():
        if name in key.split("-") or f"-{name}-" in f"-{key}-":
            return color
    return fallback


def family_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <circle cx="112" cy="116" r="29" fill="{primary}"/>
  <circle cx="184" cy="116" r="29" fill="{accent}"/>
  <circle cx="148" cy="94" r="33" fill="white"/>
  <path d="M73 211 C80 171, 105 151, 137 151 C167 151, 193 171, 201 211" fill="{primary}" opacity="0.22"/>
  <path d="M101 214 C108 171, 126 149, 150 149 C174 149, 193 171, 199 214" fill="white"/>
  <path d="M151 128 C171 128, 186 113, 186 94 C186 75, 171 60, 151 60 C131 60, 116 75, 116 94 C116 113, 131 128, 151 128Z" stroke="{ink}" stroke-width="9" fill="none"/>
  <path d="M85 210 C93 170, 117 149, 151 149 C184 149, 209 170, 216 210" stroke="{ink}" stroke-width="9" fill="none" stroke-linecap="round"/>
"""


def food_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <circle cx="150" cy="145" r="76" fill="white"/>
  <path d="M91 150 C112 112, 144 99, 184 112 C219 123, 233 158, 214 191 C194 226, 141 229, 109 204 C90 189, 80 170, 91 150Z" fill="{accent}" opacity="0.45"/>
  <path d="M106 179 H196" stroke="{ink}" stroke-width="12" stroke-linecap="round"/>
  <path d="M126 151 C134 130, 164 125, 179 143" stroke="{primary}" stroke-width="14" stroke-linecap="round"/>
  <path d="M150 105 C161 84, 177 81, 191 91" stroke="{ink}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="119" cy="143" r="9" fill="{primary}"/>
  <circle cx="197" cy="154" r="9" fill="{primary}"/>
"""


def color_motif(lesson: LessonRow, primary: str, ink: str) -> str:
    swatch = color_for_lesson(lesson, primary)
    border = "#CBD5E1" if swatch == "#F8FAFC" else ink
    return f"""
  <rect x="74" y="80" width="152" height="126" rx="34" fill="white"/>
  <rect x="94" y="100" width="112" height="86" rx="24" fill="{swatch}" stroke="{border}" stroke-width="8"/>
  <path d="M95 213 H205" stroke="{ink}" stroke-width="10" stroke-linecap="round"/>
  <circle cx="212" cy="87" r="17" fill="{primary}" opacity="0.55"/>
"""


def animal_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <path d="M94 155 C94 118, 119 93, 150 93 C181 93, 206 118, 206 155 C206 190, 182 216, 150 216 C118 216, 94 190, 94 155Z" fill="white"/>
  <path d="M103 111 L86 78 L128 94 M197 111 L214 78 L172 94" fill="{accent}" stroke="{ink}" stroke-width="8" stroke-linejoin="round"/>
  <circle cx="126" cy="151" r="8" fill="{ink}"/>
  <circle cx="174" cy="151" r="8" fill="{ink}"/>
  <path d="M145 173 Q150 181 155 173" stroke="{ink}" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M112 192 C130 207, 170 207, 188 192" stroke="{primary}" stroke-width="10" stroke-linecap="round" fill="none"/>
"""


def school_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <path d="M82 105 C105 92, 129 92, 150 108 C171 92, 195 92, 218 105 V211 C194 199, 171 200, 150 216 C129 200, 106 199, 82 211Z" fill="white" stroke="{ink}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M150 108 V216" stroke="{ink}" stroke-width="7" stroke-linecap="round"/>
  <path d="M101 130 H132 M101 153 H132 M168 130 H199 M168 153 H199" stroke="{primary}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="220" cy="86" r="17" fill="{accent}"/>
"""


def home_place_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <path d="M73 143 L150 78 L227 143" fill="{accent}" opacity="0.45"/>
  <path d="M91 135 L150 85 L209 135 V213 H91Z" fill="white" stroke="{ink}" stroke-width="8" stroke-linejoin="round"/>
  <rect x="132" y="164" width="36" height="49" rx="9" fill="{primary}" opacity="0.3" stroke="{ink}" stroke-width="7"/>
  <path d="M112 150 H132 M168 150 H188" stroke="{primary}" stroke-width="9" stroke-linecap="round"/>
"""


def time_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <circle cx="150" cy="150" r="76" fill="white" stroke="{ink}" stroke-width="9"/>
  <path d="M150 105 V153 L184 179" stroke="{primary}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M150 74 V91 M150 209 V226 M74 150 H91 M209 150 H226" stroke="{ink}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="210" cy="91" r="16" fill="{accent}"/>
"""


def question_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <path d="M100 110 C110 82, 135 68, 165 73 C195 78, 213 100, 210 126 C207 150, 189 163, 169 174 C158 181, 153 190, 153 204" fill="none" stroke="{ink}" stroke-width="13" stroke-linecap="round"/>
  <circle cx="153" cy="230" r="10" fill="{primary}"/>
  <circle cx="212" cy="85" r="18" fill="{accent}"/>
"""


def emotion_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <circle cx="150" cy="150" r="77" fill="white" stroke="{ink}" stroke-width="8"/>
  <circle cx="123" cy="135" r="9" fill="{ink}"/>
  <circle cx="177" cy="135" r="9" fill="{ink}"/>
  <path d="M116 176 C132 196, 168 196, 184 176" stroke="{primary}" stroke-width="11" stroke-linecap="round" fill="none"/>
  <path d="M101 101 C119 85, 135 80, 150 80 C168 80, 190 90, 204 110" stroke="{accent}" stroke-width="10" stroke-linecap="round" fill="none"/>
"""


def nature_weather_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <path d="M109 201 C112 154, 127 121, 150 93 C173 121, 188 154, 191 201" fill="{primary}" opacity="0.2"/>
  <path d="M150 93 V215" stroke="{ink}" stroke-width="10" stroke-linecap="round"/>
  <path d="M150 126 C123 109, 99 113, 84 136 C112 145, 135 140, 150 126Z" fill="{primary}" stroke="{ink}" stroke-width="7"/>
  <path d="M151 151 C180 130, 207 133, 222 158 C192 167, 168 163, 151 151Z" fill="{accent}" stroke="{ink}" stroke-width="7"/>
  <path d="M105 217 H199" stroke="{ink}" stroke-width="10" stroke-linecap="round"/>
"""


def clothing_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <path d="M111 87 L82 118 L111 145 V218 H189 V145 L218 118 L189 87 C177 101, 162 108, 150 108 C138 108, 123 101, 111 87Z" fill="white" stroke="{ink}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M118 153 H182 M118 180 H182" stroke="{primary}" stroke-width="9" stroke-linecap="round"/>
  <circle cx="216" cy="90" r="16" fill="{accent}"/>
"""


def health_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <rect x="78" y="94" width="144" height="118" rx="32" fill="white" stroke="{ink}" stroke-width="8"/>
  <path d="M150 120 V186 M117 153 H183" stroke="{primary}" stroke-width="18" stroke-linecap="round"/>
  <path d="M98 91 C110 70, 135 64, 150 83 C165 64, 190 70, 202 91" fill="{accent}" opacity="0.45"/>
"""


def movement_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <circle cx="129" cy="91" r="19" fill="{accent}" stroke="{ink}" stroke-width="7"/>
  <path d="M126 119 L153 148 L130 183" stroke="{ink}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M151 148 L194 136 M137 181 L107 218 M133 181 L171 217" stroke="{primary}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M82 220 H214" stroke="{ink}" stroke-width="9" stroke-linecap="round"/>
"""


def hand_motif(primary: str, accent: str, ink: str) -> str:
    return f"""
  <rect x="78" y="68" width="124" height="124" rx="34" fill="white" opacity="0.92"/>
  <path d="M110 160 C100 132, 103 105, 124 91 C146 76, 180 84, 187 112 C193 136, 180 164, 156 173 C138 180, 119 176, 110 160Z" fill="{primary}" opacity="0.18"/>
  <path d="M120 158 C112 139, 116 115, 131 104 M142 170 L142 104 M162 166 L166 111 M181 154 C186 138, 185 121, 178 111" stroke="{ink}" stroke-width="9" stroke-linecap="round"/>
  <circle cx="190" cy="78" r="16" fill="{accent}"/>
"""


def motif_for(lesson: LessonRow, primary: str, accent: str, ink: str) -> str:
    if len((lesson.phrase or "").strip()) == 1:
        return hand_motif(primary, accent, ink)

    category = category_for(lesson)
    if category == "family":
        return family_motif(primary, accent, ink)
    if category == "food":
        return food_motif(primary, accent, ink)
    if category == "color":
        return color_motif(lesson, primary, ink)
    if category == "animal":
        return animal_motif(primary, accent, ink)
    if category == "school":
        return school_motif(primary, accent, ink)
    if category == "home_place":
        return home_place_motif(primary, accent, ink)
    if category == "time":
        return time_motif(primary, accent, ink)
    if category == "question":
        return question_motif(primary, accent, ink)
    if category == "emotion":
        return emotion_motif(primary, accent, ink)
    if category == "nature_weather":
        return nature_weather_motif(primary, accent, ink)
    if category == "clothing":
        return clothing_motif(primary, accent, ink)
    if category == "body_health":
        return health_motif(primary, accent, ink)
    if category == "movement":
        return movement_motif(primary, accent, ink)
    return hand_motif(primary, accent, ink)


def generate_svg(lesson: LessonRow) -> str:
    primary, bg, ink, accent = palette_for(lesson)
    phrase = display_text(lesson.phrase, lesson.title)
    title = display_text(lesson.title, lesson.phrase or lesson.title)
    chip = "COMMUNICATION" if lesson.type == "communication" else "VOCABULARY"
    motif = motif_for(lesson, primary, accent, ink)

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" role="img" aria-label="{title}">
  <rect width="300" height="300" rx="64" fill="{bg}"/>
  <circle cx="250" cy="49" r="42" fill="{primary}" opacity="0.16"/>
  <circle cx="44" cy="247" r="54" fill="{accent}" opacity="0.24"/>
  {motif}
  <rect x="46" y="42" width="104" height="34" rx="17" fill="white" opacity="0.9"/>
  <text x="98" y="64" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="11" font-weight="900" fill="{primary}">{chip}</text>
  <text x="150" y="244" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="21" font-weight="1000" fill="{ink}">{phrase}</text>
  <text x="150" y="269" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="12" font-weight="800" fill="{ink}" opacity="0.58">{title}</text>
</svg>
"""


def svg_data_url(svg: str) -> str:
    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


async def fetch_lessons(only_missing: bool) -> list[LessonRow]:
    query = """
        SELECT id::text AS id, title, phrase, type, visual, sort_order
        FROM lessons
    """
    if only_missing:
        query += """
        WHERE visual IS NULL
           OR visual = ''
           OR (
                visual NOT LIKE 'data:image/svg+xml%'
            AND visual NOT LIKE '<svg%'
           )
        """
    query += " ORDER BY sort_order, title, id"

    async with engine.connect() as conn:
        rows = (await conn.execute(text(query))).mappings().all()

    return [
        LessonRow(
            id=row["id"],
            title=row["title"] or "Untitled lesson",
            phrase=row["phrase"],
            type=row["type"] or "vocabulary",
            visual=row["visual"],
            sort_order=row["sort_order"] or 0,
        )
        for row in rows
    ]


async def visual_column_is_text(conn) -> bool:
    column_type = (
        await conn.execute(
            text(
                """
                SELECT data_type
                FROM information_schema.columns
                WHERE table_name = 'lessons'
                  AND column_name = 'visual'
                """
            )
        )
    ).scalar_one_or_none()
    return column_type == "text"


async def seed_visuals(
    output_dir: Path,
    only_missing: bool,
    skip_alter: bool,
    dry_run: bool,
) -> None:
    lessons = await fetch_lessons(only_missing)
    print(f"Found {len(lessons)} lessons to process")

    async with engine.begin() as conn:
        await conn.execute(text("SET statement_timeout = 0"))

        if skip_alter:
            print("Skipping lessons.visual type migration")
        elif await visual_column_is_text(conn):
            print("lessons.visual is already TEXT")
        elif dry_run:
            print("DRY RUN: would alter lessons.visual to TEXT")
        else:
            await conn.execute(text("ALTER TABLE lessons ALTER COLUMN visual TYPE TEXT"))
            print("Altered lessons.visual to TEXT")

        if not dry_run:
            output_dir.mkdir(parents=True, exist_ok=True)

        for lesson in lessons:
            slug = slugify(f"{lesson.sort_order + 1:03d}-{lesson.phrase or lesson.title}")
            file_name = f"{slug}-{lesson.id[:8]}.svg"
            svg = generate_svg(lesson)
            data_url = svg_data_url(svg)

            if dry_run:
                print(f"DRY RUN: would generate and seed {file_name}")
                continue

            (output_dir / file_name).write_text(svg, encoding="utf-8")
            await conn.execute(
                text("UPDATE lessons SET visual = :visual WHERE id = :id"),
                {"visual": data_url, "id": lesson.id},
            )
            print(f"Seeded {file_name}")

    print("Done")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate SVG lesson visuals and seed them into the database."
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=BACKEND_DIR / "generated_lesson_visuals",
        help="Directory where generated SVG files are written.",
    )
    parser.add_argument(
        "--only-missing",
        action="store_true",
        help="Only replace empty or non-SVG visuals.",
    )
    parser.add_argument(
        "--skip-alter",
        action="store_true",
        help="Do not alter lessons.visual to TEXT before seeding.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned changes without writing files or updating the database.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(
        seed_visuals(args.output_dir, args.only_missing, args.skip_alter, args.dry_run)
    )
