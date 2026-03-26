"""
=============================================================================
BrandFlow Strategy Engine - workflow_graph.py (v6 — Force Convergence)
=============================================================================
Đồ thị phân phối nhiệm vụ giữa MasterPlanner (CMO) và CFO.
Hỗ trợ tính toán chi phí bằng Python (nhanh, chuẩn xác 100%) và tự gỡ rối 
khi gặp Deadlock ở vòng lặp cuối cùng.
=============================================================================
"""

import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

import json
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END

from agents_core import build_planner_chain, build_cfo_chain, build_customer_chain, safe_invoke_chain
from memory_rag import get_relevant_guidelines
from customer_review import calculate_customer_rule_score, DEFAULT_CRITERIA_WEIGHTS

# =============================================================================
# HELPER — Tính toán Toán học bằng Python & In Terminal
# =============================================================================
PRIORITY_ICON = {
    "MUST_HAVE": "🔴",
    "SHOULD_HAVE": "🟡",
    "COULD_HAVE": "🟢",
}

def calculate_actual_cost(plan: dict) -> int:
    """Hàm Python tự cộng tiền chuẩn xác 100%, thay cho LLM."""
    total = 0
    if not plan: return 0
    try:
        breakdown = plan.get("activity_and_financial_breakdown", [])
        for phase in breakdown:
            activities = phase.get("activities", [])
            for act in activities:
                total += int(act.get("cost_vnd", 0))
    except (ValueError, TypeError):
        pass
    return total

def print_master_plan(plan: dict):
    exec_summary = plan.get("executive_summary", {})
    target_info = plan.get("target_audience_and_brand_voice", {})
    
    if not isinstance(exec_summary, dict): exec_summary = {}
    if not isinstance(target_info, dict): target_info = {}
    
    print(f"\n   [Tóm Tắt Khách Hàng]: {target_info.get('target_audience', 'N/A')}")
    print(f"   [Chiến Lược Cốt Lõi]: {exec_summary.get('campaign_summary', 'N/A')}")
    print(f"   [Mục Tiêu Chính]: {exec_summary.get('core_objectives', 'N/A')}")
    
    phases = plan.get("phased_execution", [])
    breakdown = plan.get("activity_and_financial_breakdown", [])
    
    phase_map = {p.get("phase_id"): p.get("phase_name") for p in phases if isinstance(p, dict)}
    
    for b in breakdown:
        pid = b.get("phase_id")
        pname = phase_map.get(pid, pid)
        activities = b.get("activities", [])
        
        print(f"\n   {'─' * 65}")
        print(f"   ► {str(pname).upper()}")
        print(f"   {'─' * 65}")
        
        for act in activities:
            name = act.get("activity_name", "N/A")
            desc = act.get("description", "")
            cost = act.get("cost_vnd", 0)
            priority = act.get("moscow_tag", "N/A")
            kpi = act.get("kpi_commitment", "N/A")
            
            icon = PRIORITY_ICON.get(priority, "⚪")
            
            print(f"   {icon} {name} — {cost:,} ₫ ({priority})")
            if desc: print(f"      ↳ {desc}")
            print(f"      🎯 KPI: {kpi}")


# =============================================================================
# 1. ĐỊNH NGHĨA STATE (v6)
# =============================================================================

class StrategyState(TypedDict):
    goal: str
    industry: str
    budget: int
    target_audience: str
    special_constraints: str
    feedback: str
    company_guidelines: str
    previous_plan: Optional[dict]
    current_plan: Optional[dict]
    cfo_decision: Optional[dict]
    actual_total_cost: int
    over_budget: int
    iteration_count: int
    is_approved: bool
    customer_round: int
    satisfaction_threshold: int
    max_customer_rounds: int
    customer_feedback: str
    rule_score: int
    client_self_score: int
    final_score: int
    needs_human_intervention: bool


# =============================================================================
# 2. ĐỊNH NGHĨA CÁC NODE (v6)
# =============================================================================

planner_chain = build_planner_chain()
cfo_chain = build_cfo_chain()
customer_chain = build_customer_chain()

def planner_node(state: StrategyState) -> dict:
    iteration = state.get("iteration_count", 0) + 1
    
    print(f"\n{'＝' * 70}")
    print(f"🌀 [VÒNG LẶP {iteration}] Bắt đầu chu trình...")
    
    # ── RAG: Loại a lòng kiến thức từ bộ nhớ dài hạn ──
    guidelines = state.get("company_guidelines", "")
    if iteration == 1 and not guidelines:
        print(f"🧠 [RAG] Đang truy vấn bộ nhớ dài hạn (ChromaDB)...")
        guidelines = get_relevant_guidelines(state["goal"])
        if guidelines:
            print(f"   📋 [RAG] Tìm thấy quy tắc liên quan:")
            print(guidelines)
        else:
            print(f"   📋 [RAG] Bộ nhớ chưa có dữ liệu. Bỏ qua.")
            guidelines = "Chưa có quy tắc nào được ghi nhận."
    
    print(f"👑 [Giám Đốc Marketing] Đang lên Master Plan chiến lược...")
    
    def validate_plan(plan):
        # 🛑 HARD VALIDATION: KIỂM TRA BẢN NHÁP RỖNG
        breakdown = plan.get("activity_and_financial_breakdown", [])
        if not breakdown:
            print(f"   ❌ [LỖI NGHIÊM TRỌNG]: LLM trả về Plan rỗng hoặc thiếu activity_and_financial_breakdown. Kích hoạt thử lại...")
            raise ValueError("Master Plan bị rỗng hoặc thiếu activity_and_financial_breakdown.")

    plan_output = safe_invoke_chain(planner_chain, {
        "goal": state["goal"],
        "industry": state.get("industry", "General"),
        "budget": state["budget"],
        "target_audience": state.get("target_audience", ""),
        "constraints": state.get("special_constraints", "Không có"),
        "actual_total_cost": state.get("actual_total_cost", 0),
        "over_budget": state.get("over_budget", 0),
        "feedback": state.get("feedback", "Không có"),
        "previous_plan": json.dumps(state.get("current_plan"), ensure_ascii=False) if state.get("current_plan") else "Không có",
        "company_guidelines": guidelines,
    }, validator=validate_plan)

    campaign = plan_output.get("campaign_name", "N/A")
    
    # ⚠️ PYTHON TỰ ĐỘNG TÍNH TIỀN THỰC TẾ (Không tin LLM nữa)
    actual_total = calculate_actual_cost(plan_output)
    over_budget = max(0, actual_total - state["budget"])

    print(f"\n   [CMO] Tên Chiến Dịch: '{campaign}'")
    print(f"   [SYSTEM] Tổng Python tính được: {actual_total:,} VND")
    if over_budget > 0:
        print(f"   [SYSTEM] Vượt ngân sách: {over_budget:,} VND")
    
    print_master_plan(plan_output)
    
    return {
        "previous_plan": state.get("current_plan"),
        "current_plan": plan_output,
        "actual_total_cost": actual_total,
        "over_budget": over_budget,
        "iteration_count": iteration,
        "company_guidelines": guidelines,
    }




def customer_node(state: StrategyState) -> dict:
    print("\n\ud83e\udd1d [Khach hang] Dang danh gia ke hoach...")

    plan = state.get("current_plan") or {}
    rule_score = calculate_customer_rule_score(plan, DEFAULT_CRITERIA_WEIGHTS)

    customer_output = safe_invoke_chain(customer_chain, {
        "budget": state["budget"],
        "company_guidelines": state.get("company_guidelines", ""),
        "rule_score": rule_score,
        "master_plan": json.dumps(plan, ensure_ascii=False)
    })

    client_self_score = int(customer_output.get("client_self_score", 50))
    feedback = customer_output.get("feedback", "Khong co phan hoi bo sung")
    reasoning_summary = customer_output.get("reasoning_summary", "")

    final_score = int(0.7 * rule_score + 0.3 * client_self_score)
    customer_round = state.get("customer_round", 0) + 1

    is_approved = final_score >= state.get("satisfaction_threshold", 70)
    needs_human = customer_round >= state.get("max_customer_rounds", 3)

    print(f"   [Customer] Rule score: {rule_score}")
    print(f"   [Customer] Self score: {client_self_score}")
    print(f"   [Customer] Final score: {final_score}")

    return {
        "customer_round": customer_round,
        "customer_feedback": feedback,
        "rule_score": rule_score,
        "client_self_score": client_self_score,
        "final_score": final_score,
        "feedback": feedback,
        "is_approved": is_approved,
        "needs_human_intervention": needs_human,
    }

def cfo_node(state: StrategyState) -> dict:
    print(f"\n💼 [Giám Đốc Tài Chính] Đã nhận Master Plan. Bắt đầu audit...")

    # Guard: Nếu total_cost = 0 thì LLM trả JSON rỗng/lỗi → KHÔNG được duyệt
    if state["actual_total_cost"] == 0:
        print(f"\n   ⚠️ [SYSTEM] Phát hiện kế hoạch rỗng (Total Cost = 0). LLM có thể đã trả JSON lỗi.")
        print(f"   ⏭️ Buộc CMO viết lại kế hoạch...")
        return {
            "is_approved": False,
            "feedback": "Kế hoạch bị lỗi (Total Cost = 0). Hãy viết lại Master Plan hoàn chỉnh với đầy đủ phases và activities.",
            "cfo_decision": {"target_cuts": [], "feedback_to_planner": "Kế hoạch rỗng, cần viết lại."},
            "needs_human_intervention": (state["iteration_count"] >= 3)
        }

    # Cơ chế Bypass thông minh: Nếu Python thấy rẻ hơn ngân sách
    # Thì tự động duyệt (Bỏ qua tốn RAM chạy LLM).
    if state["actual_total_cost"] <= state["budget"]:
        print(f"\n   🎉 [QUYẾT ĐỊNH CFO] NGÂN SÁCH HỢP LÝ. PHÊ DUYỆT TỰ ĐỘNG!")
        print(f"   💬 Nhận Xét: Tổng chi phí {state['actual_total_cost']:,} VND, dưới ngân sách {state['budget']:,} VND.")
        return {
            "is_approved": True,
            "feedback": "Tuyệt vời, ngân sách đã đáp ứng yêu cầu. Tôi duyệt!",
            "cfo_decision": {"target_cuts": [], "feedback_to_planner": "Tuyệt vời!"},
            "needs_human_intervention": False
        }
    
    # Nếu bị vượt, gọi CFO LLM sinh Feedback chỉ định chỗ cắt
    cfo_output = safe_invoke_chain(cfo_chain, {
        "budget": state["budget"],
        "actual_total_cost": state["actual_total_cost"],
        "over_budget": state["over_budget"],
        "master_plan": json.dumps(state["current_plan"], ensure_ascii=False)
    })

    cfo_feedback = cfo_output.get("feedback_to_planner", "Không có thông tin bổ sung")
    target_cuts = cfo_output.get("target_cuts", [])

    print(f"\n   ⛔ [QUYẾT ĐỊNH CFO] YÊU CẦU CẮT GIẢM NGÂN SÁCH!")
    print(f"   📉 Vượt Ngân Sách   : {state['over_budget']:,} VND")
    if target_cuts:
        print(f"   ✂️ Chỉ Định Cắt Gọt : {', '.join(target_cuts)}")
    print(f"   💬 Yêu Cầu Cụ Thể  : {cfo_feedback}")

    return {
        "is_approved": False,
        "feedback": cfo_feedback,  
        "cfo_decision": cfo_output,
        # Nếu vòng 3 vẫn bị từ chối thì ép cờ Needs Human Intervention
        "needs_human_intervention": (state["iteration_count"] >= 3)
    }


# =============================================================================
# 3. ĐỊNH NGHĨA ROUTER 
# =============================================================================

def route_after_cfo(state: StrategyState) -> str:
    if state["is_approved"] == True:
        return "END"
    
    if state.get("needs_human_intervention") == True:
        print(f"\n{'＝' * 70}")
        print(f"🛑 ĐÃ CHẠM ĐÁY 3 VÒNG LẶP MÀ VẪN VƯỢT NGÂN SÁCH.")
        print(f"   Graph đã tự đông dừng hệ thống. Human Intervention Required.")
        print(f"{'＝' * 70}")
        return "END"
    
    print(f"\n   ⏭️ [Hệ Thống] Yêu cầu CMO sửa lại bản nháp Master Plan...")
    return "continue_to_customer"


# =============================================================================


def route_after_customer(state: StrategyState) -> str:
    if state.get("is_approved") is True:
        return "END"

    if state.get("needs_human_intervention") is True:
        print(f"\n{'=' * 70}")
        print("\ud83d\udee1 Khach hang chua hai long sau nhieu vong. Can can thiep thu cong.")
        print(f"{'=' * 70}")
        return "END"

    return "continue_to_cfo"

# 4. CHUẨN BỊ GRAPH
# =============================================================================

builder = StateGraph(StrategyState)

builder.add_node("planner", planner_node)
builder.add_node("customer", customer_node)
builder.add_node("cfo", cfo_node)

builder.set_entry_point("planner")
builder.add_edge("planner", "customer")

builder.add_conditional_edges(
    "customer",
    route_after_customer,
    {
        "END": END,
        "continue_to_cfo": "cfo"
    }
)

builder.add_conditional_edges(
    "cfo",
    route_after_cfo,
    {
        "END": END,
        "continue_to_planner": "planner",
        "continue_to_customer": "customer"
    }
)

strategy_app = builder.compile()

# =============================================================================
# CHẠY TEST ĐỒ THỊ MỞ BÁN
# =============================================================================

if __name__ == "__main__":
    initial_state = {
        "goal": "Tổ chức sự kiện ra mắt mỹ phẩm cho nam giới tại AEON Mall",
        "industry": "Mỹ phẩm/Làm đẹp",
        "budget": 20_000_000,
        "target_audience": "Nam giới 18-25 tuổi",
        "special_constraints": "Khách mời có KOL",
        "feedback": "Chưa có",
        "company_guidelines": "",
        "previous_plan": None,
        "current_plan": None,
        "cfo_decision": None,
        "actual_total_cost": 0,
        "over_budget": 0,
        "iteration_count": 0,
        "is_approved": False,
        "needs_human_intervention": False,
        "customer_round": 0,
        "satisfaction_threshold": 70,
        "max_customer_rounds": 3,
        "customer_feedback": "",
        "rule_score": 0,
        "client_self_score": 0,
        "final_score": 0
    }
    
    print("\n" + "═" * 70)
    print(f"🚀 [LangGraph Start] KÍCH HOẠT MASTER PLAN (PHASE V6)")
    print(f"   Mục Tiêu : {initial_state['goal']}")
    print(f"   Ngân Sách: {initial_state['budget']:,} VND")
    print("═" * 70)
    
    final_state = strategy_app.invoke(initial_state)

    print("\n" + "═" * 70)
    print("📋 BÁO CÁO TOÀN DIỆN MỚI NHẤT (V6 - TÍNH BẰNG PYTHON)")
    print("═" * 70)
    
    if final_state['is_approved']:
        print("  Trạng Thái     : ✅ APPROVED (Hội Tụ Thành Công)")
    elif final_state.get('needs_human_intervention'):
        print("  Trạng Thái     : ⚠️ REJECTED - Cần Giám Đốc Con Người Xử Lý")
    else:
        print("  Trạng Thái     : ❌ REJECTED")

    print(f"  Vòng Lặp       : {final_state['iteration_count']} rounds")
    print(f"  Ngân Sách Quỹ  : {final_state['budget']:,} VND")
    print(f"  Code Python Tính Báo Giá: {final_state['actual_total_cost']:,} VND")
    
    if final_state.get('current_plan'):
        print(f"  Chiến Dịch Chốt: {final_state['current_plan'].get('campaign_name')}")
