"""
Seed database with initial data matching the frontend mock data.
Run: python seed.py
"""
import asyncio
import string
from app.database import engine, AsyncSessionLocal, Base
from app.models import *  # noqa: F401, F403 — import all models so Base.metadata is populated


TOPICS = [
    {"title": "Gia đình", "description": "Từ vựng về các thành viên trong gia đình", "icon": "Home", "color": "teal", "sort_order": 0},
    {"title": "Màu sắc", "description": "Học các màu sắc cơ bản", "icon": "Palette", "color": "blue", "sort_order": 1},
    {"title": "Cảm xúc", "description": "Biểu đạt cảm xúc và tâm trạng", "icon": "Smile", "color": "yellow", "sort_order": 2},
    {"title": "Trường học", "description": "Từ vựng về trường học và học tập", "icon": "BookOpen", "color": "green", "sort_order": 3},
    {"title": "ASL Alphabet (A-Z)", "description": "Học bảng chữ cái ASL — chấm điểm thật bằng AI", "icon": "Type", "color": "purple", "sort_order": 4},
]

LESSONS = [
    # Family
    {"topic_idx": 0, "type": "vocabulary", "title": "Xin chào gia đình", "phrase": "Xin chào", "description": "Học cách chào hỏi các thành viên trong gia đình", "visual": "👋", "sign_hint": "Vẫy tay phải từ trán ra ngoài", "difficulty": "Easy", "xp": 10, "sort_order": 0},
    {"topic_idx": 0, "type": "vocabulary", "title": "Mẹ", "phrase": "Mẹ", "description": "Ký hiệu cho từ 'Mẹ'", "visual": "👩", "sign_hint": "Chạm ngón cái vào cằm, xòe 5 ngón tay", "difficulty": "Easy", "xp": 10, "sort_order": 1},
    {"topic_idx": 0, "type": "vocabulary", "title": "Bố", "phrase": "Bố", "description": "Ký hiệu cho từ 'Bố'", "visual": "👨", "sign_hint": "Chạm ngón cái vào trán, xòe 5 ngón tay", "difficulty": "Easy", "xp": 10, "sort_order": 2},
    # Colors
    {"topic_idx": 1, "type": "vocabulary", "title": "Màu xanh dương", "phrase": "Xanh dương", "description": "Học ký hiệu màu xanh dương", "visual": "🔵", "sign_hint": "Lắc ngón út sang phải", "difficulty": "Easy", "xp": 10, "sort_order": 0},
    {"topic_idx": 1, "type": "vocabulary", "title": "Màu vàng", "phrase": "Vàng", "description": "Học ký hiệu màu vàng", "visual": "🟡", "sign_hint": "Lắc chữ Y hai lần", "difficulty": "Easy", "xp": 10, "sort_order": 1},
    {"topic_idx": 1, "type": "vocabulary", "title": "Màu đỏ", "phrase": "Đỏ", "description": "Học ký hiệu màu đỏ", "visual": "🔴", "sign_hint": "Vuốt ngón trỏ xuống môi dưới", "difficulty": "Easy", "xp": 10, "sort_order": 2},
    # Feelings
    {"topic_idx": 2, "type": "communication", "title": "Vui vẻ", "phrase": "Vui", "description": "Biểu đạt cảm xúc vui vẻ", "visual": "😊", "sign_hint": "Vuốt tay lên ngực, mặt tươi cười", "difficulty": "Easy", "xp": 10, "sort_order": 0},
    {"topic_idx": 2, "type": "communication", "title": "Buồn", "phrase": "Buồn", "description": "Biểu đạt cảm xúc buồn bã", "visual": "😢", "sign_hint": "Kéo hai tay xuống trước mặt", "difficulty": "Easy", "xp": 10, "sort_order": 1},
    {"topic_idx": 2, "type": "communication", "title": "Cần giúp đỡ", "phrase": "Giúp tôi", "description": "Yêu cầu giúp đỡ", "visual": "🙏", "sign_hint": "Nắm tay phải đặt lên lòng bàn tay trái, nâng lên", "difficulty": "Medium", "xp": 15, "sort_order": 2},
    # School
    {"topic_idx": 3, "type": "vocabulary", "title": "Giáo viên", "phrase": "Giáo viên", "description": "Ký hiệu cho giáo viên", "visual": "👩‍🏫", "sign_hint": "Hai tay mở rộng trước trán, di chuyển ra ngoài", "difficulty": "Medium", "xp": 15, "sort_order": 0},
    {"topic_idx": 3, "type": "vocabulary", "title": "Sách", "phrase": "Sách", "description": "Ký hiệu cho cuốn sách", "visual": "📚", "sign_hint": "Hai lòng bàn tay úp vào nhau rồi mở ra như cuốn sách", "difficulty": "Easy", "xp": 10, "sort_order": 1},
    {"topic_idx": 3, "type": "communication", "title": "Cảm ơn", "phrase": "Cảm ơn", "description": "Nói lời cảm ơn", "visual": "🙌", "sign_hint": "Chạm ngón tay vào cằm rồi đưa tay ra phía trước", "difficulty": "Easy", "xp": 10, "sort_order": 2},
]

# ASL Alphabet (A-Z) — appended to LESSONS; AI scoring uses ASL.h5
for _i, _letter in enumerate(string.ascii_uppercase):
    LESSONS.append({
        "topic_idx": 4,
        "type": "vocabulary",
        "title": f"Chữ {_letter}",
        "phrase": _letter,
        "description": f"Ký hiệu ASL cho chữ {_letter}",
        "visual": _letter,
        "sign_hint": f"Tạo hình chữ {_letter} bằng bàn tay theo bảng ASL",
        "difficulty": "Easy",
        "xp": 5,
        "sort_order": _i,
    })

QUIZ_QUESTIONS = [
    # lesson 0: hello-family
    {"lesson_idx": 0, "prompt": "Đây là ký hiệu của từ nào?", "type": "image-choice", "options": ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], "answer": "Xin chào", "hint": "Vẫy tay từ trán ra ngoài"},
    {"lesson_idx": 0, "prompt": "Hãy thực hiện ký hiệu 'Xin chào'", "type": "sign-choice", "options": ["Vẫy tay", "Gật đầu", "Vỗ tay", "Lắc đầu"], "answer": "Vẫy tay", "hint": "Vẫy tay phải từ trán"},
    # lesson 1: mother
    {"lesson_idx": 1, "prompt": "Ký hiệu nào thể hiện 'Mẹ'?", "type": "image-choice", "options": ["Mẹ", "Bố", "Bà", "Chị"], "answer": "Mẹ", "hint": "Ngón cái chạm cằm"},
    {"lesson_idx": 1, "prompt": "Thực hiện ký hiệu 'Mẹ'", "type": "sign-choice", "options": ["Ngón cái vào cằm", "Ngón cái vào trán", "Vẫy tay", "Khoanh tay"], "answer": "Ngón cái vào cằm", "hint": "Chạm ngón cái vào cằm"},
    # lesson 2: father
    {"lesson_idx": 2, "prompt": "Ký hiệu nào thể hiện 'Bố'?", "type": "image-choice", "options": ["Bố", "Mẹ", "Ông", "Anh"], "answer": "Bố", "hint": "Ngón cái chạm trán"},
    {"lesson_idx": 2, "prompt": "Thực hiện ký hiệu 'Bố'", "type": "sign-choice", "options": ["Ngón cái vào trán", "Ngón cái vào cằm", "Vỗ tay", "Lắc tay"], "answer": "Ngón cái vào trán", "hint": "Chạm ngón cái vào trán"},
    # lesson 3: blue
    {"lesson_idx": 3, "prompt": "Màu nào đang được thể hiện?", "type": "image-choice", "options": ["Xanh dương", "Đỏ", "Vàng", "Xanh lá"], "answer": "Xanh dương", "hint": "Lắc ngón út"},
    {"lesson_idx": 3, "prompt": "Thực hiện ký hiệu màu xanh dương", "type": "sign-choice", "options": ["Lắc ngón út", "Lắc chữ Y", "Vuốt môi", "Vỗ tay"], "answer": "Lắc ngón út", "hint": "Ngón út lắc sang phải"},
    # lesson 4: yellow
    {"lesson_idx": 4, "prompt": "Màu nào đang được thể hiện?", "type": "image-choice", "options": ["Vàng", "Xanh dương", "Đỏ", "Tím"], "answer": "Vàng", "hint": "Lắc chữ Y"},
    {"lesson_idx": 4, "prompt": "Thực hiện ký hiệu màu vàng", "type": "sign-choice", "options": ["Lắc chữ Y", "Lắc ngón út", "Vuốt môi", "Khẽ gật"], "answer": "Lắc chữ Y", "hint": "Chữ Y lắc hai lần"},
    # lesson 5: red
    {"lesson_idx": 5, "prompt": "Màu nào đang được thể hiện?", "type": "image-choice", "options": ["Đỏ", "Vàng", "Xanh", "Cam"], "answer": "Đỏ", "hint": "Vuốt ngón trỏ xuống môi"},
    {"lesson_idx": 5, "prompt": "Thực hiện ký hiệu màu đỏ", "type": "sign-choice", "options": ["Vuốt môi dưới", "Lắc ngón út", "Lắc chữ Y", "Vẫy tay"], "answer": "Vuốt môi dưới", "hint": "Ngón trỏ vuốt môi dưới"},
    # lesson 6: happy
    {"lesson_idx": 6, "prompt": "Cảm xúc nào đang được thể hiện?", "type": "image-choice", "options": ["Vui", "Buồn", "Tức giận", "Sợ hãi"], "answer": "Vui", "hint": "Vuốt tay lên ngực"},
    {"lesson_idx": 6, "prompt": "Thực hiện ký hiệu 'Vui'", "type": "sign-choice", "options": ["Vuốt ngực lên", "Kéo tay xuống", "Vỗ tay", "Lắc đầu"], "answer": "Vuốt ngực lên", "hint": "Vuốt tay lên ngực, mặt vui"},
    # lesson 7: sad
    {"lesson_idx": 7, "prompt": "Cảm xúc nào đang được thể hiện?", "type": "image-choice", "options": ["Buồn", "Vui", "Ngạc nhiên", "Tức"], "answer": "Buồn", "hint": "Kéo tay xuống"},
    {"lesson_idx": 7, "prompt": "Thực hiện ký hiệu 'Buồn'", "type": "sign-choice", "options": ["Kéo hai tay xuống", "Vuốt ngực lên", "Vỗ tay", "Lắc tay"], "answer": "Kéo hai tay xuống", "hint": "Kéo hai tay xuống trước mặt"},
    # lesson 8: help
    {"lesson_idx": 8, "prompt": "Ký hiệu này có nghĩa là gì?", "type": "image-choice", "options": ["Giúp tôi", "Cảm ơn", "Xin chào", "Tạm biệt"], "answer": "Giúp tôi", "hint": "Nắm tay đặt lên lòng bàn tay"},
    {"lesson_idx": 8, "prompt": "Thực hiện ký hiệu 'Giúp tôi'", "type": "sign-choice", "options": ["Nắm tay lên lòng bàn tay", "Vẫy tay", "Vuốt ngực", "Kéo tay xuống"], "answer": "Nắm tay lên lòng bàn tay", "hint": "Nâng nắm tay lên từ lòng bàn tay"},
    # lesson 9: teacher
    {"lesson_idx": 9, "prompt": "Đây là ký hiệu của ai?", "type": "image-choice", "options": ["Giáo viên", "Học sinh", "Bố", "Mẹ"], "answer": "Giáo viên", "hint": "Hai tay mở rộng trước trán"},
    {"lesson_idx": 9, "prompt": "Thực hiện ký hiệu 'Giáo viên'", "type": "sign-choice", "options": ["Hai tay mở trước trán", "Một tay lên trán", "Vỗ tay", "Vuốt ngực"], "answer": "Hai tay mở trước trán", "hint": "Hai tay mở rộng di ra ngoài"},
    # lesson 10: book
    {"lesson_idx": 10, "prompt": "Đây là ký hiệu của vật gì?", "type": "image-choice", "options": ["Sách", "Bút", "Bảng", "Cặp"], "answer": "Sách", "hint": "Hai tay úp vào nhau rồi mở ra"},
    {"lesson_idx": 10, "prompt": "Thực hiện ký hiệu 'Sách'", "type": "sign-choice", "options": ["Hai tay mở như sách", "Một tay chỉ lên", "Vỗ tay", "Lắc tay"], "answer": "Hai tay mở như sách", "hint": "Hai lòng bàn tay mở ra như cuốn sách"},
    # lesson 11: thank-you
    {"lesson_idx": 11, "prompt": "Ký hiệu này có nghĩa là gì?", "type": "image-choice", "options": ["Cảm ơn", "Xin lỗi", "Xin chào", "Tạm biệt"], "answer": "Cảm ơn", "hint": "Chạm ngón tay vào cằm rồi đưa ra ngoài"},
    {"lesson_idx": 11, "prompt": "Thực hiện ký hiệu 'Cảm ơn'", "type": "sign-choice", "options": ["Chạm cằm đưa ra ngoài", "Vẫy tay", "Gật đầu", "Vỗ tay"], "answer": "Chạm cằm đưa ra ngoài", "hint": "Ngón tay chạm cằm rồi đưa ra"},
]

BADGES = [
    {"slug": "first-ocean-step", "title": "Bước chân đầu tiên", "description": "Hoàn thành bài học đầu tiên", "icon": "Star"},
    {"slug": "perfect-answers", "title": "Trả lời hoàn hảo", "description": "Trả lời đúng tất cả câu hỏi trong một bài", "icon": "Trophy"},
    {"slug": "steady-learner", "title": "Học sinh chăm chỉ", "description": "Hoàn thành 3 bài học", "icon": "Award"},
]


async def seed():
    from app.models.content import Topic, Lesson
    from app.models.quiz import QuizQuestion
    from app.models.badge import Badge

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Clear existing data
        from sqlalchemy import text
        await db.execute(text("TRUNCATE quiz_questions, exercises, lessons, topics, badges RESTART IDENTITY CASCADE"))
        await db.commit()

        # Seed topics
        topic_objs = []
        for t in TOPICS:
            obj = Topic(**t)
            db.add(obj)
            topic_objs.append(obj)
        await db.flush()

        # Seed lessons
        lesson_objs = []
        for l in LESSONS:
            data = {k: v for k, v in l.items() if k != "topic_idx"}
            data["topic_id"] = topic_objs[l["topic_idx"]].id
            obj = Lesson(**data)
            db.add(obj)
            lesson_objs.append(obj)
        await db.flush()

        # Seed quiz questions
        for q in QUIZ_QUESTIONS:
            data = {k: v for k, v in q.items() if k != "lesson_idx"}
            data["lesson_id"] = lesson_objs[q["lesson_idx"]].id
            data["topic_id"] = lesson_objs[q["lesson_idx"]].topic_id
            db.add(QuizQuestion(**data))

        # Seed badges
        for b in BADGES:
            db.add(Badge(**b))

        await db.commit()
        print("Seed completed successfully!")
        print(f"  {len(TOPICS)} topics, {len(LESSONS)} lessons, {len(QUIZ_QUESTIONS)} questions, {len(BADGES)} badges")


if __name__ == "__main__":
    asyncio.run(seed())
