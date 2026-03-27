"""
=============================================================================
BrandFlow Strategy Engine - workflow_graph.py (v7 — Deterministic Pipeline)
=============================================================================
Pipeline tuyến tính, KHÔNG vòng lặp, KHÔNG LangGraph.
  Input → Agent 1 (MasterPlanner) → Python Interceptor
        → Song song: Agent 2 (CFO) & Agent 3 (Persona)
        → Output: final_plan + agent_logs
=============================================================================
"""

import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

import json
from concurrent.futures import ThreadPoolExecutor

from agents_core import (
    run_master_planner,
    run_refine_planner,
    python_interceptor,
    run_cfo_commentary,
    run_persona_validator,
)


def run_pipeline(
    goal: str,
    industry: str,
    budget: int,
    target_audience: str = "",
    constraints: str = "",
) -> dict:
    """
    Pipeline tuyến tính chính của BrandFlow.
    Trả về: { "final_plan": dict, "agent_logs": list[dict] }
    """
    print(f"\n{'═' * 70}")
    print(f"🚀 [PIPELINE START] Deterministic Arbitration v7")
    print(f"   Mục Tiêu : {goal}")
    print(f"   Ngân Sách: {budget:,} VND")
    print(f"   Ngành    : {industry}")
    print(f"{'═' * 70}")

    # ── STEP 1: Agent 1 — MasterPlanner (Gemini Flash) ──
    raw_plan = run_master_planner(
        goal=goal,
        industry=industry,
        budget=budget,
        target_audience=target_audience,
        constraints=constraints,
    )

    # ── STEP 2: Python Interceptor (Kế toán Python) ──
    interceptor_result = python_interceptor(raw_plan, budget)
    final_plan = interceptor_result["final_plan"]
    overflow_amount = interceptor_result["overflow_amount"]
    cut_items = interceptor_result["cut_items"]

    # ── STEP 3: Agent 2 & Agent 3 chạy song song ──
    print(f"\n{'─' * 70}")
    print(f"⚡ [PARALLEL] Gọi CFO & Persona Validator cùng lúc...")
    print(f"{'─' * 70}")

    with ThreadPoolExecutor(max_workers=2) as executor:
        cfo_future = executor.submit(
            run_cfo_commentary, overflow_amount, cut_items, budget
        )
        persona_future = executor.submit(
            run_persona_validator, final_plan, target_audience
        )

        cfo_comment = cfo_future.result()
        persona_comment = persona_future.result()

    # ── KẾT QUẢ CUỐI CÙNG ──
    agent_logs = [
        {"agent": "CMO", "role": "Giám đốc Marketing", "message": f"Tôi đã lập xong kế hoạch '{final_plan.get('executive_summary', {}).get('campaign_name', 'N/A')}'. Tổng chi phí ban đầu là {interceptor_result['raw_total']:,} VND."},
        {"agent": "SYSTEM", "role": "Hệ thống Kiểm toán", "message": f"Đã rà soát và cắt giảm {len(cut_items)} hạng mục có thể bỏ. Tổng ngân sách sau điều chỉnh: {interceptor_result['final_total']:,} VND."},
        {"agent": "CFO", "role": "Giám đốc Tài chính", "message": cfo_comment},
        {"agent": "PERSONA", "role": "Đại diện Khách hàng", "message": persona_comment},
    ]

    print(f"\n{'═' * 70}")
    print(f"✅ [PIPELINE COMPLETE] Kết quả cuối cùng:")
    print(f"   📊 Tổng chi phí cuối: {interceptor_result['final_total']:,} VND")
    print(f"   ✂️ Hạng mục bị cắt : {len(cut_items)}")
    for log in agent_logs:
        print(f"   [{log['agent']}] {log['message']}")
    print(f"{'═' * 70}")

    return {
        "final_plan": final_plan,
        "agent_logs": agent_logs,
        "actual_total_cost": interceptor_result["final_total"],
    }

def run_refinement_pipeline(
    previous_plan: dict,
    feedback: str,
    budget: int,
) -> dict:
    """
    Pipeline (Refinement): Nhận phản hồi từ CEO và bắt Agent cập nhật kế hoạch.
    """
    print(f"\n{'═' * 70}")
    print(f"🚀 [PIPELINE START] Refinement Arbitration")
    print(f"   Feedback: {feedback}")
    print(f"{'═' * 70}")

    # ── STEP 1: Agent 1 — Refiner (Gemini 2.5 Flash) ──
    raw_plan = run_refine_planner(
        previous_plan=previous_plan,
        feedback=feedback,
        budget=budget,
    )

    # ── STEP 2: Python Interceptor (Kế toán Python) ──
    interceptor_result = python_interceptor(raw_plan, budget)
    final_plan = interceptor_result["final_plan"]
    overflow_amount = interceptor_result["overflow_amount"]
    cut_items = interceptor_result["cut_items"]

    # ── STEP 3: Agent 2 & Agent 3 chạy song song ──
    target_audience = final_plan.get("target_audience_and_brand_voice", {}).get("target_audience", "")
    
    with ThreadPoolExecutor(max_workers=2) as executor:
        cfo_future = executor.submit(
            run_cfo_commentary, overflow_amount, cut_items, budget
        )
        persona_future = executor.submit(
            run_persona_validator, final_plan, target_audience
        )

        cfo_comment = cfo_future.result()
        persona_comment = persona_future.result()

    # ── KẾT QUẢ CUỐI CÙNG ──
    agent_logs = [
        {"agent": "CMO", "role": "Giám đốc Marketing", "message": f"Dạ, tôi đã sửa lại theo phản hồi của Sếp. Kế hoạch mới có tổng chi phí sơ bộ là {interceptor_result['raw_total']:,} VND."},
        {"agent": "SYSTEM", "role": "Hệ thống Kiểm toán", "message": f"Hệ thống đã rà soát lại dòng tiền mới, cắt giảm {len(cut_items)} hạng mục rủi ro. Số dư cuối: {interceptor_result['final_total']:,} VND."},
        {"agent": "CFO", "role": "Giám đốc Tài chính", "message": cfo_comment},
        {"agent": "PERSONA", "role": "Đại diện Khách hàng", "message": persona_comment},
    ]

    print(f"\n{'═' * 70}")
    print(f"✅ [REFINEMENT COMPLETE] Kết quả cuối cùng:")
    print(f"   📊 Tổng chi phí: {interceptor_result['final_total']:,} VND")
    print(f"{'═' * 70}")

    return {
        "final_plan": final_plan,
        "agent_logs": agent_logs,
        "actual_total_cost": interceptor_result["final_total"],
    }


# =============================================================================
# TEST
# =============================================================================

if __name__ == "__main__":
    result = run_pipeline(
        goal="Tổ chức sự kiện ra mắt trà sữa mới tại Quận 1",
        industry="F&B",
        budget=20_000_000,
        target_audience="Gen Z 18-25 tuổi, thích check-in, sống tại TP.HCM",
        constraints="Không có KOL, tập trung organic",
    )

    print("\n📋 FINAL PLAN JSON:")
    print(json.dumps(result["final_plan"], ensure_ascii=False, indent=2))
    print("\n📝 AGENT LOGS:")
    for log in result["agent_logs"]:
        print(f"  [{log['agent']}] {log['message']}")
