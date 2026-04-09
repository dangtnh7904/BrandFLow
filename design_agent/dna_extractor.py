"""
=============================================================================
design_agent/dna_extractor.py — Trích xuất Design Language từ Brand DNA
=============================================================================
Gọi LLM (Groq) để phân tích Brand DNA + industry context,
trả về bộ Design Language (bảng màu, font, keywords, mood).
=============================================================================
"""

import json
from .config import get_fallback_design_language


# Prompt yêu cầu LLM phân tích Brand DNA → Design Language
DESIGN_LANGUAGE_PROMPT = """Bạn là Giám đốc Sáng tạo (Creative Director) cấp cao tại một Agency thiết kế hàng đầu Việt Nam.

CONTEXT:
- Ngành hàng: {industry}
- Mục tiêu chiến dịch: {goal}
- Đối tượng khách hàng: {target_audience}

BRAND DNA (Quy tắc thương hiệu đã thu thập từ doanh nghiệp):
{brand_dna}

NHIỆM VỤ:
Dựa trên Brand DNA và context trên, hãy đề xuất bộ Design Language (Ngôn ngữ Thiết kế) cho thương hiệu.
Bộ Design Language này sẽ được dùng làm nền tảng để thiết kế Logo, Banner, và Fanpage.

QUY TẮC:
1. Bảng màu phải phù hợp tâm lý ngành hàng (F&B → màu ấm; Tech → màu lạnh; Spa → pastel...)
2. Typography phải hài hòa: 1 font heading (display/serif) + 1 font body (sans-serif)
3. Style keywords phải đủ cụ thể để AI sinh ảnh (KHÔNG dùng từ chung chung như "đẹp", "tốt")
4. Nếu Brand DNA trống → tự suy luận từ ngành hàng và mục tiêu

CHỈ TRẢ VỀ JSON HỢP LỆ, KHÔNG BỌC MARKDOWN:
{{
  "color_palette": "danh sách mã HEX cách nhau bởi dấu phẩy",
  "typography": "Font heading / Font body",
  "style_keywords": ["keyword1", "keyword2", "..."],
  "mood": "Mô tả tâm trạng thiết kế 1 câu"
}}"""


def extract_design_language(
    goal: str,
    industry: str,
    target_audience: str,
    brand_dna: str,
) -> dict:
    """
    Gọi LLM (Groq) để trích xuất Design Language từ Brand DNA + context.

    Flow:
      Brand DNA text + industry info → Groq LLM → JSON Design Language

    Returns:
        dict chứa color_palette, typography, style_keywords, mood.
        Trả fallback mặc định nếu LLM lỗi.
    """
    print(f"\n{'─' * 70}")
    print(f"🎨 [DNA EXTRACTOR] Đang trích xuất Design Language...")
    print(f"   API: Groq | Model: llama-3.3-70b-versatile")
    print(f"{'─' * 70}")

    prompt = DESIGN_LANGUAGE_PROMPT.format(
        industry=industry or "General",
        goal=goal,
        target_audience=target_audience or "Chưa xác định",
        brand_dna=brand_dna if brand_dna else "(Chưa có Brand DNA — hãy suy luận từ ngành hàng)",
    )

    try:
        from groq import Groq

        client = Groq()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=1024,
            response_format={"type": "json_object"},
        )
        raw_text = response.choices[0].message.content.strip()

        # Loại bỏ markdown wrapper nếu LLM vẫn bọc
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        design_language = json.loads(raw_text)

        # Ensure style_keywords is a list
        if isinstance(design_language.get("style_keywords"), str):
            design_language["style_keywords"] = [
                kw.strip() for kw in design_language["style_keywords"].split(",")
            ]

        print(f"   ✅ Bảng màu  : {design_language.get('color_palette', 'N/A')}")
        print(f"   ✅ Typography: {design_language.get('typography', 'N/A')}")
        print(f"   ✅ Keywords  : {design_language.get('style_keywords', [])}")
        print(f"   ✅ Mood      : {design_language.get('mood', 'N/A')}")

        return design_language

    except Exception as e:
        print(f"   ⚠️ [DNA EXTRACTOR] LLM lỗi ({e}), dùng Design Language mặc định.")
        return get_fallback_design_language(industry)
