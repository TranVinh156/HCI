"""
Allow long SVG lesson visuals and optionally backfill existing lessons.

Usage:
  python backend/scripts/migrate_lesson_visuals_to_svg.py
  python backend/scripts/migrate_lesson_visuals_to_svg.py --visual-dir assets/lesson-visuals
  python backend/scripts/migrate_lesson_visuals_to_svg.py --visual-dir assets/lesson-visuals --dry-run

SVG matching:
  The script matches each .svg filename stem against a lesson's id, title, or
  phrase after slug normalization. Example: "thank-you.svg" matches a lesson
  with title or phrase "Thank you".
"""

from __future__ import annotations

import argparse
import asyncio
import base64
import re
import sys
import unicodedata
from pathlib import Path

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import engine  # noqa: E402


def slugify(value: str | None) -> str:
    if not value:
        return ""
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")
    return slug


def svg_to_data_url(path: Path) -> str:
    raw = path.read_bytes()
    encoded = base64.b64encode(raw).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


def load_svg_map(visual_dir: Path | None) -> dict[str, str]:
    if not visual_dir:
        return {}
    if not visual_dir.exists():
        raise FileNotFoundError(f"SVG directory does not exist: {visual_dir}")

    svg_map: dict[str, str] = {}
    for svg_path in sorted(visual_dir.glob("*.svg")):
        svg_map[slugify(svg_path.stem)] = svg_to_data_url(svg_path)
    return svg_map


async def migrate(visual_dir: Path | None, clear_non_svg: bool, dry_run: bool) -> None:
    svg_map = load_svg_map(visual_dir)

    async with engine.begin() as conn:
        if dry_run:
            print("DRY RUN: would alter lessons.visual to TEXT")
        else:
            await conn.execute(text("ALTER TABLE lessons ALTER COLUMN visual TYPE TEXT"))
            print("Altered lessons.visual to TEXT")

        if not svg_map and not clear_non_svg:
            return

        rows = (
            await conn.execute(
                text(
                    """
                    SELECT id::text AS id, title, phrase, visual
                    FROM lessons
                    ORDER BY sort_order, id
                    """
                )
            )
        ).mappings().all()

        updated = 0
        for row in rows:
            keys = {
                slugify(row["id"]),
                slugify(row["title"]),
                slugify(row["phrase"]),
            }
            match_key = next((key for key in keys if key in svg_map), "")
            if match_key:
                next_visual = svg_map[match_key]
            elif clear_non_svg:
                current_visual = (row["visual"] or "").strip()
                if current_visual.startswith("data:image/svg+xml") or current_visual.startswith("<svg"):
                    continue
                next_visual = None
            else:
                continue

            updated += 1
            if dry_run:
                target = f"{match_key}.svg" if next_visual else "NULL"
                print(f"DRY RUN: would update {row['id']} -> {target}")
                continue

            await conn.execute(
                text("UPDATE lessons SET visual = :visual WHERE id = :id"),
                {"visual": next_visual, "id": row["id"]},
            )
            target = f"{match_key}.svg" if next_visual else "NULL"
            print(f"Updated {row['id']} -> {target}")

        print(f"{'Would update' if dry_run else 'Updated'} {updated} lesson visuals")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Migrate lesson visual storage to SVG data URLs."
    )
    parser.add_argument(
        "--visual-dir",
        type=Path,
        default=None,
        help="Optional directory of .svg files to backfill into lessons.visual.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned changes without altering the database.",
    )
    parser.add_argument(
        "--clear-non-svg",
        action="store_true",
        help="Set existing non-SVG lesson visuals, such as emoji values, to NULL.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(migrate(args.visual_dir, args.clear_non_svg, args.dry_run))
