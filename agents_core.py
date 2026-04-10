"""
=============================================================================
BrandFlow Strategy Engine - agents_core.py (Token Optimized & 4 Stages)
=============================================================================
Cốt lõi Hệ thống:
 - 1. Chống Ảo giác Tài chính: CFO cấm xuất ra con số tuyệt đối.
 - 2. Single Source of Truth: Bám chặt Master Brand Profile.
 - 3. Tranh luận Bắt buộc: CMO, Persona, CFO phải Approve.
=============================================================================
"""

import json

def _call_groq(prompt: str, temp: float = 0.3) -> dict:
    """Hàm gọi API Groq chung, bắt lỗi và parse JSON."""
    try:
        from groq import Groq
        client = Groq()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=temp,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"🔴 [GROQ ERROR] Lỗi: {e}")
        return {}

# =============================================================================
# GIAI ĐOẠN 1: DATA INGESTION & AUTO-PROFILING
# =============================================================================

def run_cmo_profiling(industry: str, goal: str, csfs: list, resources: str) -> dict:
    print(f"\n📡 [STAGE 1] CMO đang tổng hợp Master Brand Profile...")
    prompt = f"""Bạn là Giám đốc Marketing (CMO). Nhiệm vụ: Khởi tạo Master Brand Profile cô đọng nhất để tiết kiệm token.
THÔNG TIN VÀO: Ngành: {industry} | Mục tiêu: {goal} | CSFs: {csfs} | Nguồn lực: {resources}

YÊU CẦU:
1. Xác định Nhận diện cốt lõi (Brand DNA) và Lợi điểm bán hàng độc nhất (USP).
2. Viết ra một câu Hệ thống (System Prompt) nhập hồn cho Agent Khách Hàng (Tối đa 3 câu). Ví dụ: "Bạn là nữ 25 tuổi, thích mỹ phẩm thuần chay..."

TRẢ VỀ JSON:
{{
    "brand_dna": "DNA ngắn gọn...",
    "usp": "USP ngắn gọn...",
    "target_persona_prompt": "Câu lệnh nhập hồn khách hàng..."
}}
"""
    return _call_groq(prompt, temp=0.4)


# =============================================================================
# GIAI ĐOẠN 2: STRATEGIC DEBATE
# =============================================================================

def run_cmo_strategic_blueprint(brand_dna: str, usp: str, goal: str) -> dict:
    print(f"🎯 [STAGE 2] CMO đang phác thảo Strategic Blueprint...")
    prompt = f"""Bạn là CMO. Dựa vào Master Profile (Single Source of Truth):
- DNA: {brand_dna}
- USP: {usp}
- Mục tiêu: {goal}

Lập Kế hoạch Chiến lược dài hạn. Trình bày dạng Markdown với những điểm tinh túy nhất để tối ưu token. Rút gọn 12 Form chuẩn MKT thành 1 đoạn markdown table.
ĐẶC BIỆT LƯU Ý: 
- Bắt buộc vẽ các bảng Form 2, 3, 12 (Tài chính & Ngân sách) từ Dữ liệu Lịch sử & Động lực tăng trưởng (nếu có trong Mục tiêu).
- Bắt buộc sinh ra Điểm Cạnh Tranh vẽ Ma trận DPM (Form 6) và lập bảng SWOT (Form 5) bằng cách nhân trọng số % với Điểm số (1-10) ứng với các yếu tố cạnh tranh CSFs (nếu có).
Bắt buộc có bình luận giải thích 'Tại sao?' cho mỗi chiến thuật. Mọi chiến lược 7T đều nhằm giải quyết 'Vấn đề then chốt / Nỗi đau' đã thu thập.

TRẢ VỀ JSON:
{{
    "strategic_plan_md": "Bảng MD chiến lược...",
    "core_message": "Thông điệp lõi chiến dịch",
    "media_mix": ["FB", "Tiktok", "KOLs..."]
}}
"""
    return _call_groq(prompt, temp=0.6)

def run_customer_agent_feedback(persona_prompt: str, core_message: str, media_mix: list) -> dict:
    print(f"🎭 [STAGE 2/3] Customer Persona đang chấm điểm và phản biện...")
    prompt = f"""{persona_prompt}
Bạn đang xem xét đề xuất từ CMO: Thông điệp "{core_message}" chạy trên kênh {media_mix}.
Bạn có thích mua hàng với thông điệp này không? Nó có sai Insight không?
Nếu KHÔNG hợp, trả về is_approved = false. Nếu HỢP, trả về true. Trả lời cực ngắn.

TRẢ VỀ JSON:
{{
    "is_approved": true,
    "feedback": "Phản hồi tại sao thích/chê..."
}}
"""
    return _call_groq(prompt, temp=0.7)

def run_cfo_agent_feedback(resources: str, tactical_plan: str) -> dict:
    print(f"💼 [STAGE 2] CFO đang đánh giá khả năng phòng thủ của nguồn lực...")
    prompt = f"""Bạn là CFO khó tính. 
Nguồn lực hiện có: {resources}.
Đề xuất truyền thông: {tactical_plan}.
QUY TẮC CỐT LÕI: 
1. Bạn BỊ CẤM xuất ra số tiền VND/USD cụ thể. 
2. Nếu CMO vẽ vời chiến dịch cần nhiều nhân sự hơn mức giới hạn In-house (có trong nguồn lực), PHẢI bác bỏ (is_approved = false).
3. Bắt buộc thiết lập Kế hoạch Dự phòng (Form 5 - Phần B) để đối phó với 'Giả định rủi ro sống còn' có trong nguồn lực.

TRẢ VỀ JSON:
{{
    "is_approved": false,
    "feedback": "Lý do bác bỏ/hoặc duyệt dựa trên nguồn lực..."
}}
"""
    return _call_groq(prompt, temp=0.2)


# =============================================================================
# GIAI ĐOẠN 3: TACTICAL CAMPAIGN & EXACT BUDGETING
# =============================================================================

def run_cmo_tactical_campaign(strategic_plan_md: str) -> dict:
    print(f"🗓️ [STAGE 3] CMO đang lập Touchpoints & Operational Plan...")
    prompt = f"""Bạn là CMO. Dựa vào Strategic Blueprint đã chốt:
{strategic_plan_md}

Phác thảo Kế hoạch hành động 3 tháng cực kỳ ngắn gọn (Markdown Table). Giải thích rõ các chiến thuật nhỏ phục vụ Mục tiêu dài hạn thế nào.

TRẢ VỀ JSON:
{{
    "operational_plan_md": "Bảng Kế hoạch vận hành MD...",
    "touchpoints_timeline": "Timeline các điểm chạm."
}}
"""
    return _call_groq(prompt, temp=0.5)

def run_cfo_tactical_feedback(tactical_md: str) -> dict:
    print(f"⚖️ [STAGE 3] CFO đang chia Tỷ lệ % ngân sách...")
    prompt = f"""Bạn là CFO. Phân bổ NGÂN SÁCH DẠNG PERCENTAGE (%) cho kế hoạch:
{tactical_md}

🔥 CHỐNG ẢO GIÁC: KHÔNG ĐƯỢC PHÉP ghi số tiền.
QUY TẮC TỐI THƯỢNG:
1. Bắt buộc trích một quỹ rủi ro (contingency_percent) từ 10-15%.
2. Tổng các percentage cộng lại (bao gồm cả quỹ rủi ro) BẮT BUỘC ĐÚNG BẰNG 100.

TRẢ VỀ JSON:
{{
    "is_approved": true,
    "feedback": "Bình luận...",
    "contingency_percent": 15.0,
    "budget_allocations": [
        {{"category": "Tên chi phí 1", "percentage": 50.0}},
        {{"category": "Tên chi phí 2", "percentage": 35.0}}
    ]
}}
"""
    return _call_groq(prompt, temp=0.1)


# =============================================================================
# GIAI ĐOẠN 4: MICRO-EXECUTION
# =============================================================================

def run_cmo_micro_execution(brand_dna: str, usp: str, command: str) -> dict:
    print(f"🖋️ [STAGE 4] CMO bắt đầu Micro-execution nội dung...")
    prompt = f"""Bạn là CMO. TUYỆT ĐỐI TUÂN THỦ (Single Source of Truth):
- Brand DNA: {brand_dna}
- USP: {usp}

Task hiện tại: "{command}"
KHÔNG ĐƯỢC sáng tạo ngẫu hứng sai lệch với DNA. 

TRẢ VỀ JSON:
{{
    "content": "Bài viết/Kịch bản chi tiết...",
    "tone_of_voice_used": "Cách xưng hô..."
}}
"""
    return _call_groq(prompt, temp=0.8)
