"""
=============================================================================
BrandFlow Strategy Engine - agents_core.py (B2B 10-Step Workflow)
=============================================================================
Cốt lõi Hệ thống:
- GĐ 1: CMO Goal Setting 
- GĐ 2: CMO Situation Audit (Needs-based)
- GĐ 3: CMO Strategy Formulation (Ansoff)
- GĐ 4: CMO Tactical & Budgeting (Python ép giá CFO)
- GĐ 5: Cross-functional (CFO Risk Review & Persona Validation)
=============================================================================
"""

import json
import os
import time
from typing import List, Literal, Any, Dict
from pydantic import BaseModel, Field

# Nhập các schemas b2b chuẩn
from app.schemas.schemas import (
    GoalSettingPhase1,
    SituationAuditPhase2,
    StrategyPhase3,
    TacticsPhase4,
    CFODefenseOutput,
    MasterPlanPhase4Output
)

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
# GIAI ĐOẠN 1: GOAL SETTING (CMO)
# =============================================================================
PHASE1_PROMPT = """Bạn là một Chuyên gia Tư vấn Chiến lược Cấp cao (CMO & Strategic Consultant) từ hãng tư vấn hàng đầu (McKinsey/BCG). Bạn đang xây dựng kế hoạch cho một doanh nghiệp B2B trong lĩnh vực {industry}.
Mục tiêu sơ bộ: {goal}
Ngân sách dự kiến: {budget} VND

BRAND DNA:
{brand_dna}

Nhiệm vụ: Thiết lập Giai đoạn 1 (Goal Setting) với tư duy C-Level:
1. Xây dựng Sứ mệnh (Mission): Thể hiện tầm nhìn dài hạn, giá trị cốt lõi và định hướng phát triển rõ ràng.
2. Thiết lập Mục tiêu Doanh nghiệp (Corporate Objectives) theo chuẩn OKRs / Balanced Scorecard:
   - Financial Objectives: Tăng trưởng doanh thu, biên lợi nhuận (Margin), ROI mục tiêu, Tỷ lệ chi phí/doanh thu (CAC/LTV target).
   - Non-Financial Objectives: Thị phần (Market Share), Brand Equity, NPS (Net Promoter Score), tỷ lệ giữ chân khách hàng (Retention Rate).
3. Thiết lập Ranh giới (Red lines): Không chỉ là việc cấm kị, mà phải là các ranh giới rủi ro pháp lý, rủi ro tài chính, và đạo đức kinh doanh đặc thù của ngành {industry}.

Yêu cầu xuất sắc: Không dùng từ ngữ sáo rỗng. Mọi mục tiêu phải cụ thể, đo lường được (SMART) và mang tính thách thức (Stretch goals).
Trả về đúng định dạng JSON Schema.
"""

def run_cmo_phase1_goal_setting(goal: str, industry: str, budget: int, brand_dna: dict = None) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        api_key = "dummy_key" # fallback for dev environment
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3, api_key=api_key)
    structured_llm = llm.with_structured_output(GoalSettingPhase1)
    
    dna_str = json.dumps(brand_dna, ensure_ascii=False, indent=2) if brand_dna else "Không có dữ liệu Brand DNA."
    prompt = PHASE1_PROMPT.format(goal=goal, industry=industry, budget=budget, brand_dna=dna_str)
    prompt += "\n\nNO FLUFF: Trả về cực kỳ ngắn gọn, không giải thích vòng vo, tập trung vào bullet points. Tiết kiệm tối đa token."
    print(f"\n{'═' * 70}")
    print(f"👑 [CMO] Đang thiết lập Mục tiêu & Ranh giới (Phase 1)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


# =============================================================================
# GIAI ĐOẠN 2: SITUATION AUDIT (CMO)
# =============================================================================

PHASE2_PROMPT = """Bạn là Chuyên gia Tư vấn Chiến lược Cấp cao. Dựa trên Mục tiêu Giai đoạn 1 đã chốt:
{phase1_data}

Nhiệm vụ (Giai đoạn 2 - Situation Audit & Competitive Benchmarking):
1. Needs-Based Segmentation & Value Proposition: 
   - Chia tệp khách hàng "{target_audience}" thành các cụm Pain-points (đau điểm) phức tạp của tổ chức B2B. 
   - Ứng dụng Value Proposition Canvas: Lập bản đồ Pain Relievers (Thuốc giảm đau) và Gain Creators (Giá trị gia tăng) cụ thể.
   - Xây dựng Tuyên bố giá trị lượng hóa (Benefit - Sacrifice) rõ ràng (VD: Giảm 30% thời gian vận hành).
2. Critical Success Factors (CSFs) & Benchmarking: 
   - Xây dựng bộ CSF cốt lõi của ngành, có so sánh với điểm chuẩn ngành (Industry Benchmarks).
   - Tổng trọng số (weight_percentage) PHẢI BẰNG 100. Điểm số (1-10) đánh giá thực lực hiện tại một cách khắt khe (không tự chấm điểm quá cao nếu không có cơ sở). KHÔNG tự nhân trọng số với điểm.

Yêu cầu xuất sắc: Phân tích khách hàng B2B phải tính đến Decision-Making Unit (DMU - Ai là người quyết định, ai là người sử dụng, ai là người chi tiền).
Trả về chuẩn JSON.
"""

def run_cmo_phase2_situation_audit(phase1_data: dict, target_audience: str) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    structured_llm = llm.with_structured_output(SituationAuditPhase2)
    
    # Ép LLM viết ngắn gọn
    prompt = PHASE2_PROMPT.format(phase1_data=json.dumps(phase1_data, ensure_ascii=False), target_audience=target_audience)
    prompt += "\n\nNO FLUFF: Output cực kỳ ngắn gọn, dùng bullet points, tuyệt đối không chém gió giải thích dài dòng để tiết kiệm token."
    
    print(f"👑 [CMO] Đang phân tích Thị trường & Chọn CSFs (Phase 2)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


# =============================================================================
# GIAI ĐOẠN 3: STRATEGY FORMULATION (CMO)
# =============================================================================

PHASE3_PROMPT = """Bạn là Chuyên gia Hoạch định Chiến lược (Chief Strategy Officer). Hệ thống toán học đã phân tích Khoảng trống Doanh thu (Gap Analysis):
{gap_analysis_result}

Dữ liệu khách hàng trọng tâm:
{segments_data}

Nhiệm vụ (Giai đoạn 3 - Strategy Formulation):
1. Xây dựng Chiến lược cốt lõi: Kết hợp Ma trận Ansoff (Thâm nhập, Phát triển sản phẩm/thị trường, Đa dạng hóa) với STP (Segmentation, Targeting, Positioning).
2. Biện luận chiến lược: 
   - Giải thích tại sao chiến lược này là phương án tối ưu nhất về mặt tài chính (Feasibility & Expected ROI) để lấp đầy Khoảng trống Doanh thu.
   - Phác thảo chiến lược Định vị cạnh tranh (Competitive Positioning - 4Ps/7Ps cấp độ cao).

Yêu cầu xuất sắc: Văn phong phân tích chuyên sâu, sắc sảo. Chiến lược không được là lý thuyết suông mà phải gắn chặt với con số Khoảng trống Doanh thu và tính chất khốc liệt của ngành.
Trả về JSON chứa giải thích chi tiết chiến lược (ansoff_strategy).
"""

def run_cmo_phase3_strategy_formulation(gap_analysis: dict, segments_data: dict) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    structured_llm = llm.with_structured_output(StrategyPhase3)
    
    prompt = PHASE3_PROMPT.format(
        gap_analysis_result=json.dumps(gap_analysis, ensure_ascii=False),
        segments_data=json.dumps(segments_data, ensure_ascii=False)
    )
    prompt += "\n\nNO FLUFF: Trả về cực kỳ ngắn gọn, đi thẳng vào vấn đề. Các luận điểm giải thích chỉ tối đa 2 câu."
    
    print(f"👑 [CMO] Đang hoạch định Chiến lược Ansoff (Phase 3)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


# =============================================================================
# GIAI ĐOẠN 4: TACTICAL ALLOCATOR (CMO)
# =============================================================================

PHASE4_PROMPT = """Bạn là Giám đốc Tăng trưởng (Growth Director / CMO). Dựa vào Chiến lược cốt lõi đã chốt: 
{strategy}
Ngân sách tổng (VND): {budget}

Nhiệm vụ (Giai đoạn 4 - Tactical Execution & ZBB): Lập kế hoạch thực thi chiến thuật chi tiết bằng tư duy Zero-Based Budgeting (ZBB) và Account-Based Marketing (ABM) (nếu là B2B).
Quy tắc:
1. Mỗi hạng mục (Activity) KHÔNG ĐƯỢC MƠ HỒ. Phải có mô tả cụ thể về kênh, công nghệ, và tệp khách hàng.
2. Gắn KPI định lượng và cam kết cho TỪNG hạng mục (VD: CPL < 500k, CPA < 2M, 50 MQLs, Conversion Rate > 5%).
3. Gắn nhãn MoSCoW (MUST_HAVE, SHOULD_HAVE, COULD_HAVE) để xác định mức độ ưu tiên giải ngân.
4. Chiến thuật tâm lý: CỐ TÌNH phân bổ quá tay khoảng 10-15% tổng ngân sách, và nhét các khoản vượt này vào loại 'COULD_HAVE' để tạo không gian thương lượng với CFO.
Trả về định dạng chuẩn JSON Schema.
"""

def run_cmo_phase4_tactical_allocator(strategy_data: dict, budget: int) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    structured_llm = llm.with_structured_output(TacticsPhase4)
    
    prompt = PHASE4_PROMPT.format(strategy=json.dumps(strategy_data, ensure_ascii=False), budget=budget)
    prompt += "\n\nNO FLUFF: Mô tả chiến thuật ngắn nhất có thể, tối đa 1 câu mỗi Tactic. Dồn token vào việc nghĩ ra KPI chất lượng."
    print(f"👑 [CMO] Đang triển khai Bảng Khối lượng công việc & Ngân sách (Phase 4)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


# =============================================================================
# GIAI ĐOẠN 5: PYTHON BUDGET INTERCEPTOR & CFO RISK (CROSS-FUNCTIONAL)
# =============================================================================
def python_interceptor(raw_plan: dict, allowed_budget: int) -> dict:
    import copy
    plan = copy.deepcopy(raw_plan)
    raw_total = 0
    all_activities = plan.get("tactics_7ps", [])
    
    for act in all_activities:
        raw_total += act.get("budget_vnd", 0)
            
    overflow_amount = max(0, raw_total - allowed_budget)
    cut_items = []
    
    if overflow_amount > 0:
        could_have_items = [act for act in all_activities if act.get("moscow_tag") == "COULD_HAVE"]
        could_have_items.sort(key=lambda x: x.get("budget_vnd", 0), reverse=True)
        
        remaining_overflow = overflow_amount
        for act in could_have_items:
            if remaining_overflow <= 0: break
            cost = act.get("budget_vnd", 0)
            if cost == 0: continue
            
            reduction = min(cost, remaining_overflow)
            act["budget_vnd"] = cost - reduction
            remaining_overflow -= reduction
            
            if act["budget_vnd"] == 0:
                cut_items.append(f"Cắt hẳn: {act.get('p_name', '')} (-{reduction:,} VND)")
            else:
                cut_items.append(f"Ép giá: {act.get('p_name', '')} (-{reduction:,} VND)")
                
    final_total = sum(act.get("budget_vnd", 0) for act in all_activities)
    plan["total_budget_used"] = final_total
    return {
        "final_activities": plan,
        "raw_total": raw_total,
        "final_total": final_total,
        "overflow_amount": overflow_amount,
        "cut_items": cut_items
    }

CFO_RISK_PROMPT = """Bạn là Giám đốc Tài chính (CFO) & Chuyên gia Quản trị Rủi ro (CRO) vô cùng khắt khe, người nắm giữ sinh mệnh tài chính của công ty.
Ngân sách chốt hạ (Zero-based): {final_total} VND. Hạng mục bị ép giá/cắt bỏ: {cut_items}.
Danh sách Chiến thuật CMO đề xuất: {activities}

Nhiệm vụ: 
1. Bình luận tài chính (cfo_comment): Vứt cho CMO 1 câu nhận xét gai góc, xoáy sâu vào chỉ số LTV:CAC ratio, Thời gian thu hồi vốn (Payback Period), hoặc rủi ro đốt tiền (Cash burn rate).
2. Lập 2-3 kịch bản rủi ro nảy sinh từ chiến thuật này (Downside Risk Assessment). 
3. Thiết lập Mốc Kích Hoạt Kế hoạch B (Trigger Points) dựa trên con số thực tế tuyệt đối (VD: "Nếu CPL vượt 1.5 triệu VND trong 2 tuần liên tiếp", "Nếu Conversion Rate MQL to SQL < 2% trong tháng đầu"). 

Trả về định dạng JSON chuyên nghiệp.
"""

def run_cfo_defense_review(budget_data: dict, budget: int) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2, api_key=api_key)
    structured_llm = llm.with_structured_output(CFODefenseOutput)
    
    cut_items_str = ", ".join(budget_data.get("cut_items", [])) if budget_data.get("cut_items") else "Đã an toàn."
    act_str = json.dumps(budget_data.get("final_activities"), ensure_ascii=False)
    
    prompt = CFO_RISK_PROMPT.format(cut_items=cut_items_str, final_total=budget_data.get('final_total', 0), activities=act_str[:1500])
    prompt += "\n\nNO FLUFF: Đừng rườm rà. Risk Scenario và Contingency Plan chỉ được viết tối đa 15 chữ mỗi mục."
    print(f"💼 [CFO] Đang ban hành Trigger point Quản trị rủi ro & Review Ngân sách (Phase 5)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


PERSONA_PROMPT = """Bạn là Đại diện Mua hàng B2B (Decision-Making Unit - DMU, VD: Giám đốc Thu mua, CEO, hoặc Giám đốc IT) thuộc tệp: "{target_audience}".
Đọc Kế hoạch tiếp cận và các Giá trị Đề xuất (Strategy + Tactics) dưới đây:
{plan_summary}

Nhiệm vụ: Đánh giá cực kỳ khắt khe theo góc nhìn của một doanh nghiệp đang tìm kiếm giải pháp mang lại ROI thực sự, chứ không mua bằng cảm xúc.
1. Các thông điệp và chiến thuật này có đánh trúng Pain-points và mang lại Gain Creators rõ ràng cho công ty bạn không?
2. Phê phán thẳng thắn nếu kế hoạch sáo rỗng, thiếu tính thực tế, hoặc không chứng minh được ROI.
3. Xưng "Tôi" hoặc "Công ty chúng tôi" một cách tự nhiên, chuyên nghiệp và có tính cảnh giác cao.
CHỈ TRẢ VỀ MỘT ĐOẠN TEXT NGẮN (MAX 3-4 CÂU).
"""

def run_persona_validator(plan_summary: str, target_audience: str) -> str:
    print(f"\n🎭 [CUSTOMER] Đang nhập vai phản biện Needs & Tactics...")
    client = _create_groq_client()
    prompt = PERSONA_PROMPT.format(target_audience=target_audience, plan_summary=plan_summary[:2000])
    
    try:
        response = _chat_completion_with_timeout(
            client,
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=200,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return "Rủi ro: Các hoạt động này chưa đánh trúng Pain-points của tôi."

# Refiner agent is kept for iterative feedback loop in workspace
def run_refine_planner(previous_plan: dict, feedback: str, budget: int) -> dict:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import PromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    # For now, simplistic JSON string replacer just to satisfy module imports
    client = _create_groq_client()
    prompt = f"Tuỳ chỉnh JSON sau dựa vào yêu cầu: {feedback}\nJSON: {json.dumps(previous_plan, ensure_ascii=False)}\nTrả về Markdown Code block ```json"
    try:
        response = client.chat.completions.create(model="llama-3.1-8b-instant", messages=[{"role": "user", "content": prompt}], temperature=0.3)
        res = response.choices[0].message.content.strip()
        if "```json" in res:
            res = res.split("```json")[-1].split("```")[0]
        return json.loads(res.strip())
    except:
        return previous_plan

# =============================================================================
# STUB FUNCTIONS (imported by workflow_graph.py — Stage 2/3/4 Pipeline)
# =============================================================================

def run_cmo_profiling(industry: str, goal: str, csfs: list = None, resources: str = "") -> dict:
    """Stage 1 — CMO Profiling: Tạo Brand DNA, USP, và Persona prompt."""
    print(f"🔍 [STAGE 1] CMO Profiling cho ngành {industry}...")
    csfs = csfs or []
    return {
        "brand_dna": f"Brand DNA cho ngành {industry} — mục tiêu: {goal}",
        "usp": f"USP dựa trên CSFs: {', '.join(csfs[:3]) if csfs else 'Chưa xác định'}",
        "target_persona_prompt": (
            f"Bạn là một khách hàng tiềm năng trong ngành {industry}. "
            f"Bạn quan tâm đến: {goal}. Hãy phản biện như một người tiêu dùng thực tế."
        ),
    }


def run_cmo_tactical_campaign(blueprint: dict, budget: int, constraints: str = "") -> dict:
    """Stage 3 — CMO Tactical Campaign: Chuyển blueprint thành kế hoạch chiến thuật."""
    print(f"📋 [STAGE 3] CMO Tactical Campaign (budget={budget:,} VND)...")
    return {
        "tactical_plan": f"Kế hoạch chiến thuật dựa trên blueprint với ngân sách {budget:,} VND",
        "activities": [],
        "estimated_cost": budget,
    }


def run_cfo_tactical_feedback(tactical_plan: str, resources: str, budget: int) -> dict:
    """Stage 3 — CFO Tactical Feedback: CFO đánh giá kế hoạch chiến thuật."""
    print(f"💼 [STAGE 3] CFO Tactical Feedback...")
    return {
        "is_approved": True,
        "feedback": "Kế hoạch chiến thuật phù hợp với nguồn lực hiện có.",
    }


if __name__ == "__main__":
    print("agents_core.py v8 — Multi-Agent Phase 1->5 Workflow Báo Cáo")
