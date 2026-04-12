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
import os
from typing import List, Literal
from pydantic import BaseModel, Field


def _resolve_groq_timeout_seconds() -> float:
  raw_value = os.getenv("BRANDFLOW_GROQ_TIMEOUT_SECONDS", "60")
  try:
    return max(1.0, float(raw_value))
  except ValueError:
    return 60.0


GROQ_TIMEOUT_SECONDS = _resolve_groq_timeout_seconds()


def _is_timeout_error(exc: Exception) -> bool:
  name = exc.__class__.__name__.lower()
  message = str(exc).lower()
  timeout_keywords = ("timeout", "timed out", "read timeout", "connect timeout")
  return "timeout" in name or any(keyword in message for keyword in timeout_keywords)


def _create_groq_client():
  from groq import Groq

  try:
    return Groq(timeout=GROQ_TIMEOUT_SECONDS)
  except TypeError:
    return Groq()


def _chat_completion_with_timeout(client, **kwargs):
  try:
    return client.chat.completions.create(timeout=GROQ_TIMEOUT_SECONDS, **kwargs)
  except TypeError:
    return client.chat.completions.create(**kwargs)

# =============================================================================
# 1. PYDANTIC SCHEMAS (giữ nguyên cấu trúc output cho Frontend)
# =============================================================================

class ExecutiveSummary(BaseModel):
    campaign_name: str
    campaign_summary: str
    core_objectives: str
    total_budget_vnd: int

class TargetAudienceAndBrandVoice(BaseModel):
    target_audience: str
    brand_voice: str

class PhasedExecution(BaseModel):
    phase_id: str
    phase_name: str
    duration: str

class Activity(BaseModel):
    activity_name: str
    description: str
    cost_vnd: int
    kpi_commitment: str
    moscow_tag: Literal["MUST_HAVE", "SHOULD_HAVE", "COULD_HAVE"]

class ActivityAndFinancialBreakdown(BaseModel):
    phase_id: str
    activities: List[Activity]

class MasterPlanOutput(BaseModel):
    executive_summary: ExecutiveSummary
    target_audience_and_brand_voice: TargetAudienceAndBrandVoice
    phased_execution: List[PhasedExecution]
    activity_and_financial_breakdown: List[ActivityAndFinancialBreakdown]


# =============================================================================
# 2. AGENT 1: MASTER PLANNER (Gemini 1.5 Flash — JSON Mode)
# =============================================================================

MASTER_PLANNER_PROMPT = """Role: Bạn là một Giám đốc Marketing (CMO) cấp C-level tại một Agency hàng đầu. Trách nhiệm của bạn là lập Báo cáo Chiến lược (Executive Report) cho doanh nghiệp.

Context:
- Ngành hàng (Industry): {industry}
- Mục tiêu (Goal): {goal}
- Ngân sách (Budget): {budget} VNĐ
- Khách hàng mục tiêu: {target_audience}
- Ràng buộc/Lưu ý (Constraints): {constraints}
- Bối cảnh Thị trường Vĩ mô (Market Context): {market_context}

CRITICAL RULES (LUẬT SỐNG CÒN BẮT BUỘC TUÂN THỦ):
1. GIỌNG VĂN: Chuyên nghiệp, sắc bén. Không dùng từ ngữ sáo rỗng.
2. TỪ ĐIỂN KPI NGÀNH BẮT BUỘC — THÔNG TIN NGHIỆP VỤ BẮT BUỘC:
   Khi phân bổ ngân sách và thiết lập KPI cho từng hoạt động, bạn PHẢI sử dụng ngôn ngữ quản trị chuyên ngành tùy theo lĩnh vực khách hàng.
   Các con số KPI phải THỰC TẾ với thị trường Việt Nam. TUYỆT ĐỐI KHÔNG dùng các từ chung chung như "Nâng cao nhận diện" hay "Tăng doanh số".

   🍜 Ngành F&B (Nhà hàng / Quán Cafe / FMCG):
   Đặc thù: Vòng đời quyết định ngắn, mua bằng mắt (Visual), cảm xúc và khuyến mãi. Lợi nhuận trên từng món mỏng nên cần số lượng lớn (Volume).
      - Footfall (Lượng khách đến quán): Chỉ số sống còn của F&B Offline.
        VD: "Thu hút 500 lượt khách (Footfall) đến check-in tại cửa hàng trong tuần lễ khai trương."
      - CPA (Cost Per Action - Chi phí cho mỗi hành động): Đo lường việc khách lấy Voucher hoặc đăng ký thẻ thành viên.
        VD: "CPA < 15.000 VNĐ cho mỗi lượt lưu E-Voucher trên Zalo Mini App."
      - Social Engagement Rate (Tỷ lệ tương tác mạng xã hội): Đo lường độ viral của món ăn mới.
        VD: "Đạt 20.000 lượt thảo luận (Mentions) và tỷ lệ tương tác (ER) > 5% trên video TikTok của Food Reviewer."
      - AOV (Average Order Value - Giá trị trung bình trên một đơn): KPI dùng cho các chiến dịch Upsell.
        VD: "Tăng AOV từ 50k lên 75k thông qua chương trình Combo Mua Trà sữa tặng bánh."

   💄 Ngành Mỹ phẩm / Làm đẹp (Skincare / Spa):
   Đặc thù: Khách hàng mua bằng niềm tin (Trust). Cần nội dung giáo dục (Educate) và trải nghiệm thử. Rất quan tâm tỷ lệ khách quay lại.
      - CPL (Cost Per Lead - Chi phí một khách hàng tiềm năng): Cực kỳ quan trọng với Spa/Clinic chạy quảng cáo tìm khách soi da.
        VD: "Thu thập 300 Leads đăng ký soi da miễn phí với CPL tối đa 150.000 VNĐ/Lead."
      - ROAS (Return On Ad Spend - Lợi nhuận trên chi phí quảng cáo): Chỉ số vua của ngành bán lẻ mỹ phẩm online (Shopee/TikTok Shop).
        VD: "Đạt chỉ số ROAS > 3.5 cho chiến dịch Facebook Ads bán Set Serum mùa hè."
      - Sample Conversion Rate (Tỷ lệ chuyển đổi từ Mẫu thử): Rất hay dùng khi ra mắt sản phẩm mới.
        VD: "Tỷ lệ chuyển đổi (CVR) đạt 15% (15 người mua full-size trên 100 người nhận sample dùng thử)."
      - UGC (User-Generated Content - Nội dung do khách hàng tự tạo): Review, feedback tự nhiên.
        VD: "Tạo ra 100 bài review UGC tự nhiên kèm hashtag #ClearSummer trên các Group làm đẹp."

   💻 Ngành Công nghệ (B2B SaaS / Phần mềm):
   Đặc thù: Khách hàng là doanh nghiệp (B2B). Vòng đời chốt sale dài (vài tuần đến vài tháng). Đòi hỏi tính chuyên môn và logic cao.
      - MQL (Marketing Qualified Lead - Khách hàng tiềm năng chất lượng): Người để lại data có nhu cầu thực (tải Ebook, xem Webinar).
        VD: "Thu về 200 MQLs thông qua chiến dịch chạy LinkedIn Ads tặng Ebook Quản trị Nhân sự."
      - Demo Booking Rate (Tỷ lệ đặt lịch dùng thử): Chỉ số quan trọng nhất của SaaS.
        VD: "Tỷ lệ chuyển đổi từ traffic Landing Page sang hành động Book Demo đạt tối thiểu 8%."
      - CAC (Customer Acquisition Cost - Chi phí thu thập một khách hàng mới): Tổng tiền marketing chia cho số khách mua phần mềm.
        VD: "Kiểm soát CAC ở mức < 2.000.000 VNĐ/Khách hàng trả phí doanh nghiệp."
      - CPA (Cost Per Attendee - Chi phí cho một người tham dự): Dùng khi tổ chức Sự kiện hoặc Webinar.
        VD: "CPA < 100.000 VNĐ cho mỗi lượt đăng ký tham gia Webinar thành công."

   📦 Ngành General (Chưa xác định ngành cụ thể):
      - Sales conversion rate (Tỷ lệ chuyển đổi bán hàng): VD "CVR 2.5%"
      - Reach (Số người tiếp cận thực): VD "Reach 50.000 người/tháng"
      - CTR (Tỷ lệ nhấp chuột): VD "CTR đạt 1.8%"
3. LUẬT TÀI CHÍNH CỐ TÌNH LỐ:
   - Tổng chi phí (cost_vnd) phải CỐ TÌNH VƯỢT ngân sách 10-20%.
   - Tạo 1-2 hạng mục "Nice-to-have" gắn nhãn moscow_tag = "COULD_HAVE" để tạo "đất diễn" cho CFO cắt giảm.
   - Các hoạt động cốt lõi gắn nhãn "MUST_HAVE" hoặc "SHOULD_HAVE".
4. Tất cả con số tiền phải là SỐ NGUYÊN thuần túy (VD: 15000000, KHÔNG phải 15.000.000).

149. TRẢ VỀ DỮ LIỆU ĐÚNG THEO YÊU CẦU CỦA Pydantic SCHEMA LẬP TRÌNH BÊN DƯỚI.
Lưu ý quan trọng cho Agent 0: Ở mục `description` của mỗi `Activity`, bạn CHỈ VIẾT DUY NHẤT 1 CÂU NGẮN MÔ TẢ TRIẾT LÝ, KHÔNG CẦN VIẾT DÀI vì các Agent sau sẽ tự động viết phần thịt để tiết kiệm Tokens.
"""

EXPAND_ACTIVITY_PROMPT = """Bạn là Chuyên gia Copywriter (Agent 1).
Dựa trên sườn chiến lược (Skeleton) của Giám đốc Chiến lược (Agent 0). Chức trách của bạn là 'Đắp thịt' chi tiết vào Hoạt động sau để sinh ra nội dung (description) đọc lọt tai, dễ hiểu, thuyết phục doanh nghiệp.

- Chiến dịch: {campaign_name}
- Tệp khách hàng: {target_audience}
- Tên hoạt động: {activity_name} (Chi phí: {cost_vnd} VND)
- Mục tiêu KPI: {kpi_commitment}

Yêu cầu: Viết ĐOẠN MÔ TẢ CHI TIẾT (tối đa 60 chữ) để giải thích hoạt động này sẽ diễn ra như thế nào. TRẢ VỀ CHỈ ĐOẠN TEXT, KHÔNG MARKDOWN.
"""

REFINE_PLANNER_PROMPT = """Bạn là Giám đốc Marketing (CMO) cấp cao của hệ thống BrandFlow.
Bạn đã lập ra một Kế hoạch ban đầu, nhưng CEO/Khách hàng vừa phản hồi yêu cầu thay đổi.

1. KẾ HOẠCH CŨ TRƯỚC ĐÓ:
```json
{previous_plan}
```

2. YÊU CẦU THAY ĐỔI TỪ CEO:
"{feedback}"

3. NGÂN SÁCH DỰ KIẾN: {budget} VND

NHIỆM VỤ CỦA BẠN:
- Cắt giảm, gỡ bỏ, hoặc thêm mới các hoạt động (activities) theo ĐÚNG Ý CEO.
- Sửa lại "cost_vnd", "activity_name" hoặc "moscow_tag" cho phù hợp với nhận xét.
- Giữ nguyên cấu trúc JSON (phải trả về đúng format cũ, không thêm hay bớt khóa ngoài).

Trả về toàn bộ Kế hoạch sau khi chỉnh sửa thành JSON hợp lệ ngay lập tức (KHÔNG bọc trong markdown):"""

def run_refine_planner(previous_plan: dict, feedback: str, budget: int) -> dict:
    """Agent 1 (Refine): Gọi Groq xử lý Feedback của CEO để sửa Plan cũ."""
    print(f"\n{'═' * 70}")
    print(f"👑 [AGENT 1 — REFINER] Đang cập nhật chiến lược theo Feedback...")
    print(f"   Feedback: {feedback}")
    print(f"   API: Groq | Model: llama-3.3-70b-versatile")
    print(f"{'═' * 70}")

    prompt = REFINE_PLANNER_PROMPT.format(
        previous_plan=json.dumps(previous_plan, ensure_ascii=False),
        feedback=feedback,
        budget=budget,
    )

    try:
        client = _create_groq_client()
        response = _chat_completion_with_timeout(
            client,
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            response_format={"type": "json_object"},
        )
    except Exception as e:
        if _is_timeout_error(e):
            raise TimeoutError(
                f"Refiner timeout sau {int(GROQ_TIMEOUT_SECONDS)} giay."
            ) from e
        print(f"🔴 [REFINER] Groq API Error: {e}, trả về plan cũ.")
        return previous_plan

    raw_text = response.choices[0].message.content.strip()

    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    elif raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
    raw_text = raw_text.strip()
    
    try:
        plan = json.loads(raw_text)
    except Exception as e:
        print(f"🔴 [REFINER] JSON Parse Error: {e}")
        plan = previous_plan
        
    print(f"   ✅ Đã cập nhật xong Kế hoạch mới!")
    return plan


def run_master_planner(goal: str, industry: str, budget: int, target_audience: str, constraints: str, market_context: str = "") -> dict:
    """Kiến trúc Cập nhật: Agent 0 (Mạnh) rải sườn Schema + Agent 1 (Rẻ) đắp nội dung."""
    from langchain_groq import ChatGroq
    from langchain_core.prompts import PromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    import time
    
    print(f"\n{'═' * 70}")
    print(f"👑 [AGENT 0 — THE ORCHESTRATOR] Đang vẽ khung bằng Structured JSON Schema...")
    print(f"   API: Groq | Model: llama-3.3-70b-versatile (Gánh xương sống)")
    print(f"{'═' * 70}")

    prompt = MASTER_PLANNER_PROMPT.format(
        industry=industry,
        goal=goal,
        budget=budget,
        target_audience=target_audience or "Chưa xác định",
        constraints=constraints or "Không có",
        market_context=market_context or "Chưa có thông tin khảo sát tự động.",
    )

    try:
        # Bước 1: Gọi Model 70B cực mạnh thông qua Tool Calling rập thẳng vào Class Pydantic
        # Điều này GIẢI QUYẾT TRIỆT ĐỂ rủi ro "ngắt giữa chừng" và parse lỗi JSON do model ảo giác.
        api_key = os.getenv("GROQ_API_KEY")
        llm_orchestrator = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3, api_key=api_key, max_retries=2)
        structured_llm = llm_orchestrator.with_structured_output(MasterPlanOutput)
        
        # Gọi phát được luôn Object Python chuẩn
        master_plan_obj = structured_llm.invoke(prompt)
        
        campaign_name = master_plan_obj.executive_summary.campaign_name
        print(f"   ✅ Agent 0 đã đẻ khung thành công: {campaign_name}")
        
        # Bước 2: Khởi động bầy Worker Agent 1 (Model 8B siêu rẻ) để đắp thịt vào Description
        print(f"\n   ⚙️ [WORKER STAGE] Gọi Agent 1 (llama-3.1-8b-instant) bù đắp Text siêu tiết kiệm token...")
        llm_worker = ChatGroq(model="llama-3.1-8b-instant", temperature=0.7, api_key=api_key)
        chain_worker = PromptTemplate.from_template(EXPAND_ACTIVITY_PROMPT) | llm_worker | StrOutputParser()
        
        for phase in master_plan_obj.activity_and_financial_breakdown:
            for act in phase.activities:
                print(f"      ⛏️ Đang viết tóm tắt cho act: {act.activity_name}...")
                expanded_desc = chain_worker.invoke({
                    "campaign_name": campaign_name,
                    "target_audience": master_plan_obj.target_audience_and_brand_voice.target_audience,
                    "activity_name": act.activity_name,
                    "cost_vnd": act.cost_vnd,
                    "kpi_commitment": act.kpi_commitment
                })
                # Ghi đè Description cộc lốc của Agent 0 bằng Description dài của Agent 1
                act.description = expanded_desc.strip()
                # Nghỉ ngơi tránh vấp Rate Limit
                time.sleep(0.5)
        
        # Trộn hoàn hảo và trả về Frontend (Trả về dict để các component khác tương thích nguyên trạng)
        return master_plan_obj.model_dump()
        
    except Exception as e:
        print(f"🔴 [FATAL] Master Planner lỗi: {e}")
        raise e


def _call_groq(prompt: str, temp: float = 0.5) -> dict:
    client = _create_groq_client()
    try:
        response = _chat_completion_with_timeout(
            client,
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=temp,
            response_format={"type": "json_object"},
        )
        raw_text = response.choices[0].message.content.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()
        return json.loads(raw_text)
    except Exception as e:
        if _is_timeout_error(e):
            raise TimeoutError(f"Groq timeout ({GROQ_TIMEOUT_SECONDS}s).") from e
        print(f"🔴 [_call_groq] Lỗi API hoặc JSON: {e}")
        return {}

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

CFO_PROMPT = """Bạn là CFO (Giám đốc Tài chính) khó tính, lạnh lùng.
Số tiền vượt ngân sách: {overflow_amount} VND.
Danh sách hạng mục đã bị cắt bỏ: {cut_items}.
Ngân sách được duyệt: {budget} VND.

QUY TẮC:
- Viết ĐÚNG 1 CÂU THOẠI (dưới 30 chữ), bằng tiếng Việt.
- Nếu có cut_items: Mắng Planner vì vung tay quá trán, thông báo đã gạch bỏ hạng mục để bảo vệ dòng tiền.
- Nếu không có cut_items: Nói ngắn gọn "Ngân sách hợp lý, đã duyệt."
- CHỈ TRẢ VỀ CÂU THOẠI TRƠN, KHÔNG JSON, KHÔNG MARKDOWN."""


def run_cfo_commentary(overflow_amount: int, cut_items: list, budget: int) -> str:
    """Agent 2: Gọi Groq llama-3.1-8b-instant để sinh 1 câu bình luận CFO."""
    print(f"\n💼 [AGENT 2 — CFO] Đang bình luận tài chính...")
    print(f"   API: Groq | Model: llama-3.1-8b-instant")

    try:
        client = _create_groq_client()

        prompt = CFO_PROMPT.format(
            overflow_amount=f"{overflow_amount:,}",
            cut_items=", ".join(cut_items) if cut_items else "Không có",
            budget=f"{budget:,}",
        )

        response = _chat_completion_with_timeout(
            client,
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=100,
        )
        comment = response.choices[0].message.content.strip()
        print(f"   💬 CFO nói: \"{comment}\"")
        return comment
    except Exception as e:
        fallback = "Đã cắt các khoản thừa. Ngân sách tạm ổn." if cut_items else "Ngân sách hợp lý, đã duyệt."
        print(f"   ⚠️ Groq CFO lỗi ({e}), dùng fallback: \"{fallback}\"")
        return fallback


# =============================================================================
# PYTHON INTERCEPTOR: KIỂM TOÁN TÀI CHÍNH & ÉP GIÁ
# =============================================================================

def python_interceptor(raw_plan: dict, allowed_budget: int) -> dict:
    import copy
    plan = copy.deepcopy(raw_plan)
    raw_total = 0
    all_activities = []
    
    # Gom tất cả activity để tính tổng
    for phase in plan.get("activity_and_financial_breakdown", []):
        for act in phase.get("activities", []):
            raw_total += act.get("cost_vnd", 0)
            all_activities.append(act)
            
    overflow_amount = max(0, raw_total - allowed_budget)
    cut_items = []
    
    if overflow_amount > 0:
        # Lọc các item COULD_HAVE
        could_have_items = [act for act in all_activities if act.get("moscow_tag") == "COULD_HAVE"]
        # Sắp xếp từ đắt xuống rẻ
        could_have_items.sort(key=lambda x: x.get("cost_vnd", 0), reverse=True)
        
        remaining_overflow = overflow_amount
        for act in could_have_items:
            if remaining_overflow <= 0:
                break
            cost = act.get("cost_vnd", 0)
            if cost == 0:
                continue
            
            # Ép giá: giảm đúng bằng phần đang thiếu hoặc tối đa là cost
            reduction = min(cost, remaining_overflow)
            act["cost_vnd"] = cost - reduction
            remaining_overflow -= reduction
            
            if act["cost_vnd"] == 0:
                cut_items.append(f"Cắt hẳn: {act.get('activity_name', '')} (-{reduction:,} VND)")
            else:
                cut_items.append(f"Ép giá: {act.get('activity_name', '')} (-{reduction:,} VND)")
                
    final_total = sum(act.get("cost_vnd", 0) for act in all_activities)
    
    return {
        "final_plan": plan,
        "raw_total": raw_total,
        "final_total": final_total,
        "overflow_amount": overflow_amount,
        "cut_items": cut_items
    }


# =============================================================================
# GIAI ĐOẠN 4: MICRO-EXECUTION
# =============================================================================

PERSONA_PROMPT = """Bạn là một khách hàng thực tế thuộc tệp: "{target_audience}".

Hãy đọc lướt qua bản kế hoạch marketing dưới đây và đưa ra phản biện:
{activities_summary}

QUY TẮC:
- Đóng vai ĐÚNG tệp khách hàng. Xưng "tôi", văn phong đời thường, tự nhiên.
  (Gen Z nói kiểu Gen Z, Giám đốc nói kiểu Giám đốc).
- Đưa ra 1-2 câu nhận xét: Khen 1 điểm hấp dẫn HOẶC chê 1 điểm nhàm chán/sai kênh.
- CHỈ TRẢ VỀ CÂU THOẠI TRƠN, KHÔNG JSON, KHÔNG MARKDOWN."""


def run_persona_validator(plan: dict, target_audience: str) -> str:
    """Agent 3: Gọi Groq llama-3.1-8b-instant để nhập vai khách hàng mục tiêu."""
    print(f"\n🎭 [AGENT 3 — PERSONA VALIDATOR] Đang nhập vai khách hàng...")
    print(f"   API: Groq | Model: llama-3.1-8b-instant")

    # Tóm tắt danh sách hoạt động
    activities = []
    for phase in plan.get("activity_and_financial_breakdown", []):
        for act in phase.get("activities", []):
            activities.append(f"- {act.get('activity_name')}: {act.get('description', '')}")
    summary = "\n".join(activities) if activities else "Không có hoạt động nào."

    try:
        client = _create_groq_client()

        prompt = PERSONA_PROMPT.format(
            target_audience=target_audience or "Người tiêu dùng phổ thông",
            activities_summary=summary,
        )

        response = _chat_completion_with_timeout(
            client,
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=200,
        )
        comment = response.choices[0].message.content.strip()
        print(f"   🗣️ Khách hàng nói: \"{comment}\"")
        return comment
    except Exception as e:
        fallback = "Chiến dịch này nghe thú vị, nhưng tôi muốn thấy nhiều ưu đãi trực tiếp hơn."
        print(f"   ⚠️ Groq Persona lỗi ({e}), dùng fallback: \"{fallback}\"")
        return fallback


if __name__ == "__main__":
    print("agents_core.py v7 — Deterministic Arbitration Architecture")
    print("Modules: run_master_planner, python_interceptor, run_cfo_commentary, run_persona_validator")
