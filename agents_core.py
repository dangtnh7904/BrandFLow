"""
=============================================================================
BrandFlow Strategy Engine - agents_core.py (v7 — Deterministic Arbitration)
=============================================================================
Kiến trúc: Pipeline tuyến tính, KHÔNG vòng lặp.
  Agent 1 (MasterPlanner) → Python Interceptor → Agent 2 (CFO) & Agent 3 (Persona) song song.

APIs:
  - MasterPlanner: Google Gemini 1.5 Flash (JSON mode)
  - CFO Commentary: Groq llama3-8b-8192
  - Persona Validator: Groq mixtral-8x7b-32768
=============================================================================
"""

import json
import os
from typing import List, Literal
from pydantic import BaseModel, Field

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

Trả về JSON hợp lệ theo schema sau (KHÔNG bọc trong markdown):
{{
  "executive_summary": {{
    "campaign_name": "string",
    "campaign_summary": "string",
    "core_objectives": "string",
    "total_budget_vnd": integer
  }},
  "target_audience_and_brand_voice": {{
    "target_audience": "string",
    "brand_voice": "string"
  }},
  "phased_execution": [
    {{ "phase_id": "phase_1", "phase_name": "string", "duration": "string" }}
  ],
  "activity_and_financial_breakdown": [
    {{
      "phase_id": "phase_1",
      "activities": [
        {{
          "activity_name": "string",
          "description": "string",
          "cost_vnd": integer,
          "kpi_commitment": "string",
          "moscow_tag": "MUST_HAVE | SHOULD_HAVE | COULD_HAVE"
        }}
      ]
    }}
  ]
    }}
  ]
}}"""

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
        from groq import Groq
        client = Groq()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=4096,
            response_format={"type": "json_object"},
        )
        raw_text = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"🔴 [REFINER] Groq API Error: {e}, trả về plan cũ.")
        return previous_plan

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


def run_master_planner(goal: str, industry: str, budget: int, target_audience: str, constraints: str) -> dict:
    """Agent 1: Gọi Groq llama-3.3-70b-versatile để sinh Master Plan (JSON mode)."""
    print(f"\n{'═' * 70}")
    print(f"👑 [AGENT 1 — MASTER PLANNER] Đang lên chiến lược Marketing...")
    print(f"   API: Groq | Model: llama-3.3-70b-versatile | Mode: JSON")
    print(f"{'═' * 70}")

    prompt = MASTER_PLANNER_PROMPT.format(
        industry=industry,
        goal=goal,
        budget=budget,
        target_audience=target_audience or "Chưa xác định",
        constraints=constraints or "Không có",
    )

    from groq import Groq
    client = Groq()
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=4096,
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

    try:
        plan = json.loads(raw_text)
    except Exception as e:
        print(f"🔴 [MASTER PLANNER] JSON Parse Error: {e}")
        print(f"🔴 [MASTER PLANNER] Raw Output:\n{raw_text}")
        raise e

    # Log ra terminal
    campaign_name = plan.get("executive_summary", {}).get("campaign_name", "N/A")
    print(f"   ✅ Tên Chiến Dịch: {campaign_name}")

    return plan


# =============================================================================
# 3. PYTHON INTERCEPTOR (Kế toán trưởng vô cảm — KHÔNG dùng AI)
# =============================================================================

def python_interceptor(plan: dict, budget: int) -> dict:
    """
    Nhận JSON từ MasterPlanner. Tính tổng cost bằng Python.
    Nếu vượt ngân sách, xóa/giảm các hạng mục COULD_HAVE cho đến khi hợp lệ.
    Trả về: final_plan, overflow_amount, cut_items.
    """
    print(f"\n{'─' * 70}")
    print(f"🧮 [PYTHON INTERCEPTOR] Đang kiểm toán bằng code Python...")
    print(f"{'─' * 70}")

    def calc_total(p):
        total = 0
        for phase in p.get("activity_and_financial_breakdown", []):
            for act in phase.get("activities", []):
                total += int(act.get("cost_vnd", 0))
        return total

    raw_total = calc_total(plan)
    overflow = max(0, raw_total - budget)
    cut_items = []

    print(f"   Ngân sách được cấp : {budget:,} VND")
    print(f"   Tổng chi phí gốc  : {raw_total:,} VND")
    if overflow > 0:
        print(f"   ⚠️ Vượt ngân sách : {overflow:,} VND → Bắt đầu cắt COULD_HAVE...")

    # Cắt bỏ hoặc ép giá COULD_HAVE từ dưới lên
    if overflow > 0:
        for phase in plan.get("activity_and_financial_breakdown", []):
            remaining_acts = []
            for act in phase.get("activities", []):
                if act.get("moscow_tag") == "COULD_HAVE" and overflow > 0:
                    item_cost = int(act.get("cost_vnd", 0))
                    if item_cost <= overflow:
                        overflow -= item_cost
                        cut_items.append(f"{act.get('activity_name')} ({item_cost:,}đ)")
                        print(f"   ✂️ Cắt bỏ: {act.get('activity_name')} — {item_cost:,} VND")
                    else:
                        new_cost = item_cost - overflow
                        act["cost_vnd"] = new_cost
                        print(f"   📉 Ép giá: {act.get('activity_name')} — Giảm {overflow:,} VND (Còn {new_cost:,} VND)")
                        cut_items.append(f"{act.get('activity_name')} (Ép giá: -{overflow:,}đ)")
                        overflow = 0
                        remaining_acts.append(act)
                else:
                    remaining_acts.append(act)
            phase["activities"] = remaining_acts

    final_total = calc_total(plan)
    final_overflow = max(0, raw_total - budget)

    print(f"   ✅ Tổng sau cắt    : {final_total:,} VND")
    print(f"   📋 Hạng mục bị cắt: {len(cut_items)} mục")

    return {
        "final_plan": plan,
        "overflow_amount": final_overflow,
        "cut_items": cut_items,
        "raw_total": raw_total,
        "final_total": final_total,
    }


# =============================================================================
# 4. AGENT 2: CFO COMMENTARY (Groq — llama3-8b-8192)
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
    """Agent 2: Gọi Groq llama3-8b-8192 để sinh 1 câu bình luận CFO."""
    print(f"\n💼 [AGENT 2 — CFO] Đang bình luận tài chính...")
    print(f"   API: Groq | Model: llama3-8b-8192")

    try:
        from groq import Groq
        client = Groq()

        prompt = CFO_PROMPT.format(
            overflow_amount=f"{overflow_amount:,}",
            cut_items=", ".join(cut_items) if cut_items else "Không có",
            budget=f"{budget:,}",
        )

        response = client.chat.completions.create(
            model="llama3-8b-8192",
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
# 5. AGENT 3: PERSONA VALIDATOR (Groq — mixtral-8x7b-32768)
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
    """Agent 3: Gọi Groq mixtral-8x7b-32768 để nhập vai khách hàng mục tiêu."""
    print(f"\n🎭 [AGENT 3 — PERSONA VALIDATOR] Đang nhập vai khách hàng...")
    print(f"   API: Groq | Model: mixtral-8x7b-32768")

    # Tóm tắt danh sách hoạt động
    activities = []
    for phase in plan.get("activity_and_financial_breakdown", []):
        for act in phase.get("activities", []):
            activities.append(f"- {act.get('activity_name')}: {act.get('description', '')}")
    summary = "\n".join(activities) if activities else "Không có hoạt động nào."

    try:
        from groq import Groq
        client = Groq()

        prompt = PERSONA_PROMPT.format(
            target_audience=target_audience or "Người tiêu dùng phổ thông",
            activities_summary=summary,
        )

        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
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
