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
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from typing import Any, Optional

from agents_core import (
    run_master_planner,
    run_refine_planner,
    python_interceptor,
    run_cfo_commentary,
    run_persona_validator,
)
from design_agent import generate_brand_identity


ORCHESTRATION_CONTRACT_VERSION = "week1-v1"
NODE_INTAKE_CONTEXT = "intake_context"
NODE_GATEWAY_ROUTER = "gateway_router"
NODE_FINALIZE_OUTPUT = "finalize_output"


def _now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat()


def build_error_envelope(
    trace_id: str,
    code: str,
    message: str,
    status_code: int,
    node_name: str,
    retryable: bool = False,
    details: Optional[dict] = None,
) -> dict:
    """Contract chung cho lỗi orchestration và API boundary."""
    return {
        "status": "error",
        "trace_id": trace_id,
        "error": {
            "code": code,
            "message": message,
            "http_status": status_code,
            "node": node_name,
            "retryable": retryable,
            "details": details or {},
        },
    }


def build_node_input(
    trace_id: str,
    run_id: str,
    node_name: str,
    payload: dict,
    tier: str,
    metadata: Optional[dict] = None,
) -> dict:
    return {
        "contract_version": ORCHESTRATION_CONTRACT_VERSION,
        "trace_id": trace_id,
        "run_id": run_id,
        "tier": tier,
        "node": node_name,
        "received_at": _now_iso(),
        "payload": payload,
        "metadata": metadata or {},
    }


def build_node_output(
    node_input: dict,
    payload: Optional[dict],
    status: str = "success",
    error: Optional[dict] = None,
) -> dict:
    return {
        "contract_version": ORCHESTRATION_CONTRACT_VERSION,
        "trace_id": node_input["trace_id"],
        "run_id": node_input["run_id"],
        "tier": node_input["tier"],
        "node": node_input["node"],
        "status": status,
        "finished_at": _now_iso(),
        "payload": payload or {},
        "error": error,
    }


def _build_mock_plan(goal: str, industry: str, budget: int, target_audience: str) -> dict:
    safe_budget = max(int(budget or 0), 0)

    if safe_budget == 0:
        phase_1_cost = 2_000_000
        phase_2_cost = 1_500_000
    else:
        phase_1_cost = int(safe_budget * 0.35)
        phase_2_cost = int(safe_budget * 0.25)

    total_cost = phase_1_cost + phase_2_cost
    campaign_name = f"Mock Launch - {industry}"

    return {
        "executive_summary": {
            "campaign_name": campaign_name,
            "goal": goal,
            "industry": industry,
            "target_audience": target_audience,
            "contract_mode": "mock",
        },
        "activity_and_financial_breakdown": [
            {
                "phase": "Awareness",
                "activities": [
                    {
                        "name": "Content seeding",
                        "cost_vnd": phase_1_cost,
                        "kpi": "Reach 120k",
                    }
                ],
            },
            {
                "phase": "Conversion",
                "activities": [
                    {
                        "name": "Landing page + retargeting",
                        "cost_vnd": phase_2_cost,
                        "kpi": "CPL <= 50k",
                    }
                ],
            },
        ],
        "estimated_total_cost_vnd": total_cost,
    }


def _node_intake_context(node_input: dict, mock_mode: bool) -> dict:
    """Chuẩn hóa dữ liệu đầu vào trước khi route model/gateway."""
    payload = node_input.get("payload", {})

    normalized_payload = {
        "goal": payload.get("goal", ""),
        "industry": payload.get("industry", "General"),
        "budget": int(payload.get("budget", 0) or 0),
        "target_audience": payload.get("target_audience", ""),
        "constraints": payload.get("constraints", ""),
        "mock_mode": bool(mock_mode),
    }

    # TODO(week2): thay bằng intake parser + business identity/tier context đã verify.
    return build_node_output(node_input=node_input, payload=normalized_payload)


def _node_gateway_router(node_input: dict, mock_mode: bool) -> dict:
    """Router skeleton: tuần 1 dùng deterministic path để khóa contract I/O."""
    payload = node_input.get("payload", {})
    goal = payload.get("goal", "")
    industry = payload.get("industry", "General")
    budget = int(payload.get("budget", 0) or 0)
    target_audience = payload.get("target_audience", "")

    if not mock_mode:
        # TODO(week2): gọi LLM gateway/router thật theo tier + policy.
        route_decision = "deterministic_fallback"
    else:
        route_decision = "mock_router"

    plan = _build_mock_plan(
        goal=goal,
        industry=industry,
        budget=budget,
        target_audience=target_audience,
    )

    output_payload = {
        "route_decision": route_decision,
        "plan": plan,
        "actual_total_cost": plan.get("estimated_total_cost_vnd", 0),
        "agent_logs": [
            {
                "agent": "SYSTEM",
                "role": "Orchestration Router",
                "message": f"Route '{route_decision}' đã được chọn cho tier {node_input['tier']}.",
            },
            {
                "agent": "CMO",
                "role": "Master Planner",
                "message": "Đã tạo kế hoạch mock deterministic theo contract tuần 1.",
            },
        ],
    }
    return build_node_output(node_input=node_input, payload=output_payload)


def _node_finalize_output(node_input: dict, mock_mode: bool) -> dict:
    """Chuẩn hóa payload cuối để API trả thống nhất."""
    payload = node_input.get("payload", {})

    final_payload = {
        "is_mock": bool(mock_mode),
        "route_decision": payload.get("route_decision", "unknown"),
        "plan": payload.get("plan", {}),
        "agent_logs": payload.get("agent_logs", []),
        "actual_total_cost": int(payload.get("actual_total_cost", 0) or 0),
    }

    # TODO(week2): nối thêm quality gate hooks và trace artifact logger theo step.
    return build_node_output(node_input=node_input, payload=final_payload)


def run_week1_orchestration_contract(
    request_payload: dict,
    trace_id: Optional[str] = None,
    tier: str = "FREE",
    mock_mode: bool = True,
) -> dict:
    """
    Contract orchestration tuần 1.
    Input/Output của từng node cố định để team API/Gateway/Test bám theo.
    """
    resolved_trace_id = trace_id or str(uuid.uuid4())
    run_id = str(uuid.uuid4())
    node_outputs: list[dict[str, Any]] = []

    try:
        intake_input = build_node_input(
            trace_id=resolved_trace_id,
            run_id=run_id,
            node_name=NODE_INTAKE_CONTEXT,
            payload=request_payload,
            tier=tier,
        )
        intake_output = _node_intake_context(intake_input, mock_mode=mock_mode)
        node_outputs.append(intake_output)

        gateway_input = build_node_input(
            trace_id=resolved_trace_id,
            run_id=run_id,
            node_name=NODE_GATEWAY_ROUTER,
            payload=intake_output.get("payload", {}),
            tier=tier,
        )
        gateway_output = _node_gateway_router(gateway_input, mock_mode=mock_mode)
        node_outputs.append(gateway_output)

        finalize_input = build_node_input(
            trace_id=resolved_trace_id,
            run_id=run_id,
            node_name=NODE_FINALIZE_OUTPUT,
            payload=gateway_output.get("payload", {}),
            tier=tier,
        )
        finalize_output = _node_finalize_output(finalize_input, mock_mode=mock_mode)
        node_outputs.append(finalize_output)

        return {
            "status": "success",
            "contract_version": ORCHESTRATION_CONTRACT_VERSION,
            "trace_id": resolved_trace_id,
            "run_id": run_id,
            "tier": tier,
            "result": finalize_output.get("payload", {}),
            "node_outputs": node_outputs,
            "errors": [],
        }
    except Exception as exc:
        error = build_error_envelope(
            trace_id=resolved_trace_id,
            code="ORCH_INTERNAL_ERROR",
            message="Orchestration tuần 1 bị lỗi nội bộ.",
            status_code=500,
            node_name=NODE_FINALIZE_OUTPUT,
            retryable=False,
            details={"exception": str(exc)},
        )

        return {
            "status": "error",
            "contract_version": ORCHESTRATION_CONTRACT_VERSION,
            "trace_id": resolved_trace_id,
            "run_id": run_id,
            "tier": tier,
            "result": {},
            "node_outputs": node_outputs,
            "errors": [error],
        }


def run_pipeline(
    goal: str,
    industry: str,
    budget: int,
    target_audience: str = "",
    constraints: str = "",
    include_design: bool = False,
) -> dict:
    """
    Pipeline tuyến tính chính của BrandFlow.
    Trả về: { "final_plan": dict, "agent_logs": list[dict] }

    Args:
        include_design: Nếu True, tự động sinh Brand Identity (logo, banner, fanpage)
                        sau khi hoàn tất plan. Mặc định False để giữ tương thích ngược.
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

    # ── STEP 4 (Tùy chọn): Sinh Brand Identity Assets ──
    design_assets = None
    if include_design:
        print(f"\n{'─' * 70}")
        print(f"🎨 [STEP 4] Sinh Brand Identity Assets...")
        print(f"{'─' * 70}")
        try:
            campaign_name = final_plan.get("executive_summary", {}).get("campaign_name", goal)
            design_assets = generate_brand_identity(
                brand_name=campaign_name,
                goal=goal,
                industry=industry,
                target_audience=target_audience,
            )
            # Gỡ bỏ status key trùng lặp — chỉ giữ data
            design_assets.pop("status", None)
        except Exception as e:
            print(f"   ⚠️ [DESIGN] Lỗi sinh Brand Identity ({e}) — bỏ qua, pipeline vẫn thành công.")
            design_assets = None

    print(f"\n{'═' * 70}")
    print(f"✅ [PIPELINE COMPLETE] Kết quả cuối cùng:")
    print(f"   📊 Tổng chi phí cuối: {interceptor_result['final_total']:,} VND")
    print(f"   ✂️ Hạng mục bị cắt : {len(cut_items)}")
    if design_assets:
        print(f"   🎨 Brand Identity : Đã sinh thành công")
    for log in agent_logs:
        print(f"   [{log['agent']}] {log['message']}")
    print(f"{'═' * 70}")

    result = {
        "final_plan": final_plan,
        "agent_logs": agent_logs,
        "actual_total_cost": interceptor_result["final_total"],
    }

    if design_assets:
        result["design_assets"] = design_assets

    return result

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
