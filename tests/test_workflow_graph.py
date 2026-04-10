import copy
import json
from pathlib import Path

import pytest

from workflow_graph import run_plan_wizard_contract, run_week1_orchestration_contract


DATASET_PATH = (
    Path(__file__).resolve().parents[1]
    / "docs"
    / "plans"
    / "2026-04-09-quality-gate-dataset.json"
)


def _load_dataset_cases() -> list[dict]:
    payload = json.loads(DATASET_PATH.read_text(encoding="utf-8"))
    return list(payload.get("cases", []))


CASES = _load_dataset_cases()
CASE_IDS = [case["case_id"] for case in CASES]


def _build_wizard_payload(case: dict) -> dict:
    return {
        "user_id": f"stage-e-{case['case_id']}",
        "tier": case["tier"],
        "goal": case["goal"],
        "industry": case["industry"],
        "budget": case["budget"],
        "target_audience": case["target_audience"],
        "constraints": case["constraints"],
        "route_preference": case["route_preference"],
        "risk_level": "medium",
        "output_format": "json",
        "human_review_required": False,
    }


def _compile_plan_intent(case: dict) -> dict:
    wizard_result = run_plan_wizard_contract(
        request_payload=_build_wizard_payload(case),
        trace_id=f"trace-{case['case_id']}",
        tier=case["tier"],
    )
    assert wizard_result["status"] == "success"

    compiled = wizard_result["result"]
    plan_intent = dict(compiled.get("plan_intent", {}))
    assert compiled.get("plan_hash")
    assert plan_intent.get("route_decision") == case["expected_route_decision"]
    return plan_intent


def _build_orchestration_payload(plan_intent: dict) -> dict:
    return {
        "goal": plan_intent.get("goal", ""),
        "industry": plan_intent.get("industry", "General"),
        "budget": int(plan_intent.get("budget", 0) or 0),
        "target_audience": plan_intent.get("target_audience", ""),
        "constraints": plan_intent.get("constraints", ""),
        "route_decision": plan_intent.get("route_decision", "balanced"),
        "route_reason_code": plan_intent.get("route_reason_code", "USER_ROUTE_PREFERENCE"),
        "clarification_count": int(plan_intent.get("clarification_count", 0) or 0),
        "question_signatures": list(plan_intent.get("question_signatures", []) or []),
        "sub_agent_user_question_allowed": bool(plan_intent.get("sub_agent_user_question_allowed", False)),
    }


def _execute_orchestration(plan_intent: dict, tier: str, trace_suffix: str = "run") -> tuple[dict, dict]:
    first_payload = _build_orchestration_payload(plan_intent)
    first_result = run_week1_orchestration_contract(
        request_payload=first_payload,
        trace_id=f"trace-{trace_suffix}-first",
        tier=tier,
        mock_mode=True,
    )

    if first_result["status"] != "clarification_needed":
        return first_result, first_result

    clarification_payload = dict(first_payload)
    clarification_payload["clarification_count"] = int(
        first_result["result"].get("clarification_count", 0) or 0
    )
    clarification_payload["question_signatures"] = list(
        first_result["result"].get("question_signatures", []) or []
    )

    second_result = run_week1_orchestration_contract(
        request_payload=clarification_payload,
        trace_id=f"trace-{trace_suffix}-second",
        tier=tier,
        mock_mode=True,
    )
    return first_result, second_result


@pytest.mark.parametrize("case", CASES, ids=CASE_IDS)
def test_plan_compiler_route_policy_matrix(case):
    plan_intent = _compile_plan_intent(case)
    route_reason_code = plan_intent.get("route_reason_code")

    if case["tier"] == "FREE":
        assert route_reason_code == "TIER_FREE_FORCE_FAST_TRACK"
    elif case["tier"] == "PLUS" and case["route_preference"] == "deep-analysis":
        assert route_reason_code == "TIER_PLUS_DOWNGRADE_DEEP_ANALYSIS"
    else:
        assert route_reason_code == "USER_ROUTE_PREFERENCE"


@pytest.mark.parametrize("case", CASES, ids=CASE_IDS)
def test_graph_and_tier_router_regression(case):
    plan_intent = _compile_plan_intent(case)
    first_result, final_result = _execute_orchestration(
        copy.deepcopy(plan_intent),
        tier=case["tier"],
        trace_suffix=f"{case['case_id']}-a",
    )

    if case["expects_clarification"]:
        assert first_result["status"] == "clarification_needed"
        questions = first_result["result"].get("clarification_questions", [])
        signatures = [item.get("question_signature") for item in questions]
        assert len(signatures) == len(set(signatures))
    else:
        assert first_result["status"] == "success"

    assert final_result["status"] == "success"
    result_payload = final_result["result"]
    assert result_payload["route_decision"] == case["expected_route_decision"]

    expected_provider = "local" if case["tier"] == "FREE" else "cloud"
    assert result_payload["model_router"]["primary"]["provider"] == expected_provider
    assert result_payload["model_router"]["fallback"]["policy"] == "deterministic_by_route"

    validation = result_payload["validation"]
    assert validation["is_valid"] is True
    assert validation["validator"] == "output_reliability_v1"

    artifacts = result_payload["artifacts"]
    assert isinstance(artifacts["json"], dict)
    assert isinstance(artifacts["txt"], str)
    assert len(artifacts["txt"]) >= 40

    usage = result_payload["usage_telemetry"]
    assert int(usage["total_tokens_est"]) > 0
    assert float(usage["estimated_cost_usd"]) >= 0.0


@pytest.mark.parametrize("case", CASES, ids=CASE_IDS)
def test_route_decision_is_deterministic_for_same_plan_intent(case):
    plan_intent = _compile_plan_intent(case)

    _, final_result_a = _execute_orchestration(
        copy.deepcopy(plan_intent),
        tier=case["tier"],
        trace_suffix=f"{case['case_id']}-det-a",
    )
    _, final_result_b = _execute_orchestration(
        copy.deepcopy(plan_intent),
        tier=case["tier"],
        trace_suffix=f"{case['case_id']}-det-b",
    )

    assert final_result_a["status"] == "success"
    assert final_result_b["status"] == "success"
    assert final_result_a["result"]["route_decision"] == final_result_b["result"]["route_decision"]
    assert final_result_a["result"]["route_reason_code"] == final_result_b["result"]["route_reason_code"]
