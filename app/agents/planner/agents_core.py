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
    NeedsBasedAudience,
    CSFFactor,
    DownsideRiskAssessment,
    MasterPlanPhase4Output,
    CorporateObjective,
    MissionStatement
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
PHASE1_PROMPT = """Bạn là CMO B2B chuyên nghiệp. Dựa vào yêu cầu ban đầu của doanh nghiệp kinh doanh trong lĩnh vực {industry}:
Mục tiêu sơ bộ: {goal}
Ngân sách dự kiến: {budget} VND

Nhiệm vụ: Thiết lập Giai đoạn 1 (Goal Setting) bao gồm Xây dựng Sứ mệnh & Ranh giới (Mission) và bóc tách các mục tiêu Doanh nghiệp (Corporate Objectives - Financial & Non-Financial).

Quy tắc:
1. Đảm bảo "Lằn ranh đỏ" (red_lines) phải chứa những việc cấm kị tuyệt đối không được làm dựa trên rủi ro của ngành {industry}.
2. Trả về đúng định dạng JSON Schema.
"""

def run_cmo_phase1_goal_setting(goal: str, industry: str, budget: int) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        api_key = "dummy_key" # fallback for dev environment
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3, api_key=api_key)
    structured_llm = llm.with_structured_output(GoalSettingPhase1)
    
    prompt = PHASE1_PROMPT.format(goal=goal, industry=industry, budget=budget)
    print(f"\n{'═' * 70}")
    print(f"👑 [CMO] Đang thiết lập Mục tiêu & Ranh giới (Phase 1)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


# =============================================================================
# GIAI ĐOẠN 2: SITUATION AUDIT (CMO)
# =============================================================================
class Phase2Output(BaseModel):
    target_segments: List[NeedsBasedAudience]
    csf_analysis: List[CSFFactor]

PHASE2_PROMPT = """Bạn là CMO B2B chuyên nghiệp. Dựa trên Mục tiêu Giai đoạn 1 đã chốt:
{phase1_data}

Nhiệm vụ (Giai đoạn 2 - Situation Review):
1. Needs-Based Segmentation: Thay vì phân khúc theo nhân khẩu học, hãy chia tệp khách hàng "{target_audience}" thành các cụm đau điểm (Pain-points) cụ thể. Xây dựng Tuyên bố giá trị lượng hóa (Benefit - Sacrifice).
2. Xây dựng bộ chỉ số Critical Success Factors (CSFs) của ngành này để chấm điểm cạnh tranh. Tổng trọng số (weight_percentage) của các CSF PHẢI BẰNG 100. Điểm số (1-10) phản ánh thực lực hiện tại của doanh nghiệp. KHÔNG TỰ NHÂN TRỌNG SỐ VỚI ĐIỂM, hệ thống sẽ tự tính toán.

Trả về chuẩn JSON.
"""

def run_cmo_phase2_situation_audit(phase1_data: dict, target_audience: str) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3, api_key=api_key)
    structured_llm = llm.with_structured_output(Phase2Output)
    
    prompt = PHASE2_PROMPT.format(phase1_data=json.dumps(phase1_data, ensure_ascii=False), target_audience=target_audience)
    print(f"👑 [CMO] Đang phân tích Thị trường & Chọn CSFs (Phase 2)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


# =============================================================================
# GIAI ĐOẠN 3: STRATEGY FORMULATION (CMO)
# =============================================================================
class Phase3Output(BaseModel):
    ansoff_strategy: str

PHASE3_PROMPT = """Bạn là CMO B2B chuyên nghiệp. Hệ thống toán học vừa phân tích Khoảng trống Doanh thu (Gap Analysis):
{gap_analysis_result}

Dựa vào khoảng trống này, và dữ liệu khách hàng:
{segments_data}

Nhiệm vụ: Sử dụng Ma trận Ansoff để chọn ra chiến lược Marketing cốt lõi nhằm lấp đầy khoảng trống này (Ví dụ: Thâm nhập thị trường, Phát triển sản phẩm, Mở rộng thị trường, Đa dạng hóa...).
Trả về JSON chứa giải thích chi tiết chiến lược (ansoff_strategy).
"""

def run_cmo_phase3_strategy_formulation(gap_analysis: dict, segments_data: dict) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.4, api_key=api_key)
    structured_llm = llm.with_structured_output(Phase3Output)
    
    prompt = PHASE3_PROMPT.format(
        gap_analysis_result=json.dumps(gap_analysis, ensure_ascii=False),
        segments_data=json.dumps(segments_data, ensure_ascii=False)
    )
    print(f"👑 [CMO] Đang hoạch định Chiến lược Ansoff (Phase 3)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


# =============================================================================
# GIAI ĐOẠN 4: TACTICAL ALLOCATOR (CMO)
# =============================================================================
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

class TacticsOutput(BaseModel):
    phased_execution: List[PhasedExecution]
    activity_and_financial_breakdown: List[ActivityAndFinancialBreakdown]

PHASE4_PROMPT = """Bạn là CMO. Dựa vào Chiến lược Ansoff đã chốt: {strategy}
Ngân sách tổng (VND): {budget}

Nhiệm vụ: Lập kế hoạch thực thi chiến thuật chi tiết (Phân bổ ngân sách).
Quy tắc:
1. Gắn nhãn MoSCoW (MUST_HAVE, SHOULD_HAVE, COULD_HAVE) cho từng activity.
2. CỐ TÌNH phân bổ quá tay khoảng 10-15% tổng ngân sách, và nhét các khoản vượt này vào loại 'COULD_HAVE' để CFO lọc.
Trả về định dạng JSON Schema.
"""

def run_cmo_phase4_tactical_allocator(strategy_data: dict, budget: int) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3, api_key=api_key)
    structured_llm = llm.with_structured_output(TacticsOutput)
    
    prompt = PHASE4_PROMPT.format(strategy=json.dumps(strategy_data, ensure_ascii=False), budget=budget)
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
    all_activities = []
    
    for phase in plan.get("activity_and_financial_breakdown", []):
        for act in phase.get("activities", []):
            raw_total += act.get("cost_vnd", 0)
            all_activities.append(act)
            
    overflow_amount = max(0, raw_total - allowed_budget)
    cut_items = []
    
    if overflow_amount > 0:
        could_have_items = [act for act in all_activities if act.get("moscow_tag") == "COULD_HAVE"]
        could_have_items.sort(key=lambda x: x.get("cost_vnd", 0), reverse=True)
        
        remaining_overflow = overflow_amount
        for act in could_have_items:
            if remaining_overflow <= 0: break
            cost = act.get("cost_vnd", 0)
            if cost == 0: continue
            
            reduction = min(cost, remaining_overflow)
            act["cost_vnd"] = cost - reduction
            remaining_overflow -= reduction
            
            if act["cost_vnd"] == 0:
                cut_items.append(f"Cắt hẳn: {act.get('activity_name', '')} (-{reduction:,} VND)")
            else:
                cut_items.append(f"Ép giá: {act.get('activity_name', '')} (-{reduction:,} VND)")
                
    final_total = sum(act.get("cost_vnd", 0) for act in all_activities)
    return {
        "final_activities": plan,
        "raw_total": raw_total,
        "final_total": final_total,
        "overflow_amount": overflow_amount,
        "cut_items": cut_items
    }

class CFODefenseOutput(BaseModel):
    cfo_comment: str
    risk_assessment: List[DownsideRiskAssessment]

CFO_RISK_PROMPT = """Bạn là Giám đốc Tài chính (CFO) khó tính, chuyên về Quản trị rủi ro.
Ngân sách cuối sau khi ép giá (Zero-based): {final_total} VND. Bị cắt: {cut_items}.
Danh sách Chiến thuật: {activities}

Nhiệm vụ: 
1. Vứt cho CMO 1 câu bình luận (cfo_comment).
2. Lập 2-3 kịch bản rủi ro nảy sinh từ chiến thuật này (Downside Risk). Đặt ra Mốc Kích Hoạt (Trigger Point) số liệu thực tế để chuyển sang Kế hoạch B.
Trả về JSON.
"""

def run_cfo_defense_review(budget_data: dict, budget: int) -> dict:
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY")
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2, api_key=api_key)
    structured_llm = llm.with_structured_output(CFODefenseOutput)
    
    cut_items_str = ", ".join(budget_data.get("cut_items", [])) if budget_data.get("cut_items") else "Đã an toàn."
    act_str = json.dumps(budget_data.get("final_activities"), ensure_ascii=False)
    
    prompt = CFO_RISK_PROMPT.format(cut_items=cut_items_str, final_total=budget_data.get('final_total', 0), activities=act_str[:1500])
    print(f"💼 [CFO] Đang ban hành Trigger point Quản trị rủi ro & Review Ngân sách (Phase 5)...")
    res = structured_llm.invoke(prompt)
    return res.model_dump()


PERSONA_PROMPT = """Bạn là một khách hàng thuộc tệp: "{target_audience}".
Đọc Kế hoạch (Chiến lược + Chiến thuật) dưới đây:
{plan_summary}

Nhận xét theo góc nhìn nhu cầu (Needs) của bạn. Khách hàng này có thực sự bị thuyết phục không? Tại sao? Xưng tôi tự nhiên. Phê phán nếu thấy sai sự thật.
CHỈ TRẢ VỀ CÂU TEXT NGẮN.
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
