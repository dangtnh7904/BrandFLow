"""
=============================================================================
BrandFlow Strategy Engine - workflow_engine.py (v4 — Smart Negotiation)
=============================================================================
Orchestrator chạy vòng lặp Creative ↔ CFO với:
  - Hiển thị priority (MUST_HAVE/SHOULD_HAVE/COULD_HAVE) cho từng hoạt động.
  - Hiển thị target_cuts khi CFO yêu cầu cắt giảm cụ thể.
  - safe_invoke_chain với Tenacity retry.
  - max_iterations = 3 chống adversarial loop.
  - 100% Local (Ollama), không rate limit.

Kiến trúc: Stateless.
=============================================================================
"""

import json
from agents_core import build_creative_chain, build_cfo_chain, safe_invoke_chain

# =============================================================================
# HELPER — In bảng hoạt động đẹp mắt lên Terminal
# =============================================================================

PRIORITY_ICON = {
    "MUST_HAVE": "🔴",
    "SHOULD_HAVE": "🟡",
    "COULD_HAVE": "🟢",
}

def print_activities_table(activities: list):
    """In danh sách hoạt động dạng bảng trên Terminal."""
    print(f"   {'─' * 55}")
    print(f"   {'STT':<4} {'Hoạt Động':<25} {'Chi Phí':>12} {'Ưu Tiên'}")
    print(f"   {'─' * 55}")
    for i, act in enumerate(activities, 1):
        name = act.get("name", "N/A")[:24]
        cost = f"{act.get('cost', 0):,}"
        priority = act.get("priority", "N/A")
        icon = PRIORITY_ICON.get(priority, "⚪")
        print(f"   {i:<4} {name:<25} {cost:>12} {icon} {priority}")
    print(f"   {'─' * 55}")


# =============================================================================
# WORKFLOW CHÍNH
# =============================================================================

def run_strategy_workflow(goal: str, budget: int) -> dict:
    """
    Chạy vòng lặp đàm phán Creative ↔ CFO.

    Args:
        goal:   Mục tiêu chiến dịch marketing.
        budget: Ngân sách tối đa (VND).

    Returns:
        dict kết quả sau đàm phán.
    """

    max_iterations = 3
    feedback = "Chưa có feedback. Đây là lần đầu tiên."

    creative_chain = build_creative_chain()
    cfo_chain = build_cfo_chain()

    creative_result = None
    cfo_result = None

    print("\n" + "=" * 70)
    print(f"  BrandFlow Strategy Engine v4 — Smart Negotiation (Local)")
    print(f"  Muc Tieu : {goal}")
    print(f"  Ngan Sach: {budget:,} VND")
    print(f"  Toi Da   : {max_iterations} vong lap")
    print("=" * 70)

    for iteration in range(1, max_iterations + 1):

        # =====================================================================
        # BUOC 1: Creative Agent
        # =====================================================================
        print(f"\n{'=' * 70}")
        print(f"  VONG LAP {iteration}/{max_iterations}")
        print(f"{'=' * 70}")
        print(f"\n  [Agent Creative] Dang suy nghi va soan thao ke hoach...")

        try:
            creative_result = safe_invoke_chain(creative_chain, {
                "goal": goal,
                "budget": budget,
                "feedback": feedback,
            })

            campaign = creative_result.get("campaign_name", "N/A")
            total_cost = creative_result.get("total_estimated_cost", 0)
            activities = creative_result.get("activities", [])

            print(f"\n   [Creative] Chien dich: '{campaign}'")
            print(f"   [Creative] Tong chi phi: {total_cost:,} VND")
            print(f"   [Creative] So hoat dong: {len(activities)}")
            print_activities_table(activities)

            # In impact justification cho từng hoạt động
            for act in activities:
                impact = act.get("impact_justification", "")
                if impact:
                    priority = act.get("priority", "")
                    icon = PRIORITY_ICON.get(priority, "")
                    print(f"   {icon} {act.get('name', '')}: {impact}")

        except Exception as e:
            print(f"   [LOI] Creative Agent that bai sau 3 lan thu.")
            print(f"   Chi tiet: {str(e)[:150]}")
            continue

        # =====================================================================
        # BUOC 2: CFO Agent
        # =====================================================================
        print(f"\n  [Agent CFO] Nhan ban ke hoach. Dang kiem duyet...")

        try:
            cfo_result = safe_invoke_chain(cfo_chain, {
                "budget": budget,
                "creative_plan": json.dumps(creative_result, ensure_ascii=False),
            })
        except Exception as e:
            print(f"   [LOI] CFO Agent that bai sau 3 lan thu.")
            print(f"   Chi tiet: {str(e)[:150]}")
            continue

        # =====================================================================
        # BUOC 3: Phan xu
        # =====================================================================
        is_approved = cfo_result.get("is_approved", False)
        over_budget = cfo_result.get("over_budget_amount", 0)
        target_cuts = cfo_result.get("target_cuts", [])
        cfo_feedback = cfo_result.get("feedback_to_creative", "Khong co")

        if is_approved:
            print(f"\n   >>> CFO DUYET! Ke hoach duoc phe duyet o vong {iteration}. <<<")
            print(f"   Feedback: {cfo_feedback}")

            return {
                "status": "approved",
                "creative_plan": creative_result,
                "cfo_decision": cfo_result,
                "iterations_used": iteration,
            }
        else:
            print(f"\n   >>> CFO TU CHOI! <<<")
            print(f"   CFO tinh lai   : {cfo_result.get('total_cost_calculated', 0):,} VND")
            print(f"   Vuot ngan sach : {over_budget:,} VND")
            if target_cuts:
                print(f"   Hang muc can cat:")
                for cut in target_cuts:
                    print(f"     - {cut}")
            print(f"   Feedback       : {cfo_feedback}")

            feedback = cfo_feedback

    # =========================================================================
    # Het vong lap
    # =========================================================================
    print(f"\n{'=' * 70}")
    print(f"  DA HET {max_iterations} VONG LAP. CFO van chua duyet.")
    print(f"  Can can thiep thu cong.")
    print(f"{'=' * 70}")

    return {
        "status": "rejected",
        "creative_plan": creative_result,
        "cfo_decision": cfo_result,
        "iterations_used": max_iterations,
    }


# =============================================================================
# TEST
# =============================================================================

if __name__ == "__main__":

    result = run_strategy_workflow(
        goal="Ra mat san pham sua duong da ban dem cho Gen Z tai Ha Noi",
        budget=15_000_000,
    )

    print("\n" + "=" * 70)
    print("  BAO CAO KET QUA JSON")
    print("=" * 70)
    print(json.dumps(result, indent=2, ensure_ascii=False, default=str))
