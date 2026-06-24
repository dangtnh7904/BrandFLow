from __future__ import annotations

import copy
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from workflow_graph import run_plan_wizard_contract, run_week1_orchestration_contract
DATASET_PATH = ROOT_DIR / "docs" / "plans" / "2026-04-09-quality-gate-dataset.json"
REPORT_JSON_PATH = ROOT_DIR / "docs" / "plans" / "2026-04-09-go-no-go-report.json"
REPORT_MD_PATH = ROOT_DIR / "docs" / "plans" / "2026-04-09-go-no-go-report.md"


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _load_cases() -> list[dict[str, Any]]:
    payload = json.loads(DATASET_PATH.read_text(encoding="utf-8"))
    cases = payload.get("cases", [])
    if not isinstance(cases, list) or not cases:
        raise ValueError("Dataset is empty or invalid.")
    return cases


def _build_wizard_payload(case: dict[str, Any]) -> dict[str, Any]:
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


def _compile_plan_intent(case: dict[str, Any]) -> dict[str, Any]:
    wizard_result = run_plan_wizard_contract(
        request_payload=_build_wizard_payload(case),
        trace_id=f"trace-{case['case_id']}-compile",
        tier=case["tier"],
    )
    if wizard_result.get("status") != "success":
        raise RuntimeError(f"Compile failed for case={case['case_id']}")

    compiled = wizard_result.get("result", {})
    plan_hash = compiled.get("plan_hash")
    plan_intent = dict(compiled.get("plan_intent", {}))
    if not plan_hash or not plan_intent:
        raise RuntimeError(f"Missing compiled plan data for case={case['case_id']}")

    return plan_intent


def _build_orchestration_payload(plan_intent: dict[str, Any]) -> dict[str, Any]:
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


def _execute_case(plan_intent: dict[str, Any], tier: str, trace_prefix: str) -> tuple[dict[str, Any], dict[str, Any]]:
    first_payload = _build_orchestration_payload(plan_intent)
    first_result = run_week1_orchestration_contract(
        request_payload=first_payload,
        trace_id=f"{trace_prefix}-first",
        tier=tier,
        mock_mode=True,
    )

    if first_result.get("status") != "clarification_needed":
        return first_result, first_result

    follow_payload = dict(first_payload)
    follow_payload["clarification_count"] = int(first_result["result"].get("clarification_count", 0) or 0)
    follow_payload["question_signatures"] = list(first_result["result"].get("question_signatures", []) or [])

    second_result = run_week1_orchestration_contract(
        request_payload=follow_payload,
        trace_id=f"{trace_prefix}-second",
        tier=tier,
        mock_mode=True,
    )
    return first_result, second_result


def _expected_provider_by_tier(tier: str) -> str:
    return "local" if str(tier).upper() == "FREE" else "cloud"


def _safe_get(data: dict[str, Any], *keys: str) -> Any:
    current: Any = data
    for key in keys:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def _compute_quality_score(*, final_status: str, route_match: bool, provider_match: bool, validation_ok: bool, artifacts_ok: bool, usage_ok: bool) -> int:
    score = 0
    if final_status == "success":
        score += 30
    if route_match:
        score += 15
    if provider_match:
        score += 15
    if validation_ok:
        score += 20
    if artifacts_ok:
        score += 10
    if usage_ok:
        score += 10
    return min(100, max(0, score))


def _run_regression_tests() -> dict[str, Any]:
    command = [
        sys.executable,
        "-m",
        "pytest",
        "tests/test_workflow_graph.py",
        "-q",
    ]
    completed = subprocess.run(
        command,
        cwd=str(ROOT_DIR),
        capture_output=True,
        text=True,
        check=False,
    )
    return {
        "command": " ".join(command),
        "return_code": completed.returncode,
        "passed": completed.returncode == 0,
        "stdout_tail": "\n".join((completed.stdout or "").splitlines()[-20:]),
        "stderr_tail": "\n".join((completed.stderr or "").splitlines()[-20:]),
    }


def run_gate_pack() -> dict[str, Any]:
    run_at = _now_iso()
    cases = _load_cases()
    regression = _run_regression_tests()

    case_reports: list[dict[str, Any]] = []

    anti_loop_pass_count = 0
    deterministic_pass_count = 0
    hard_check_pass_count = 0
    manual_accept_count = 0
    quality_scores: list[int] = []

    for case in cases:
        plan_intent = _compile_plan_intent(case)
        expected_route = case["expected_route_decision"]
        expected_provider = _expected_provider_by_tier(case["tier"])

        first_result, final_result = _execute_case(
            copy.deepcopy(plan_intent),
            tier=case["tier"],
            trace_prefix=f"trace-{case['case_id']}-A",
        )
        _, deterministic_result = _execute_case(
            copy.deepcopy(plan_intent),
            tier=case["tier"],
            trace_prefix=f"trace-{case['case_id']}-B",
        )

        first_status = str(first_result.get("status", "unknown"))
        final_status = str(final_result.get("status", "unknown"))
        deterministic_status = str(deterministic_result.get("status", "unknown"))

        observed_route = _safe_get(final_result, "result", "route_decision")
        observed_reason = _safe_get(final_result, "result", "route_reason_code")
        observed_provider = _safe_get(final_result, "result", "model_router", "primary", "provider")

        deterministic_route = _safe_get(deterministic_result, "result", "route_decision")
        deterministic_reason = _safe_get(deterministic_result, "result", "route_reason_code")

        clarification_count = int(_safe_get(final_result, "result", "clarification", "count") or 0)

        expects_clarification = bool(case.get("expects_clarification", False))
        if expects_clarification:
            anti_loop_pass = (
                first_status == "clarification_needed"
                and final_status == "success"
                and clarification_count == 1
            )
        else:
            anti_loop_pass = (
                first_status == "success"
                and final_status == "success"
                and clarification_count == 0
            )

        route_match = final_status == "success" and observed_route == expected_route
        provider_match = final_status == "success" and observed_provider == expected_provider

        validation_ok = bool(_safe_get(final_result, "result", "validation", "is_valid"))
        artifacts_json = _safe_get(final_result, "result", "artifacts", "json")
        artifacts_txt = _safe_get(final_result, "result", "artifacts", "txt")
        artifacts_ok = isinstance(artifacts_json, dict) and isinstance(artifacts_txt, str) and len(artifacts_txt.strip()) >= 40

        tokens_est = int(_safe_get(final_result, "result", "usage_telemetry", "total_tokens_est") or 0)
        usage_ok = tokens_est > 0

        hard_check_pass = final_status == "success" and validation_ok and artifacts_ok and usage_ok
        deterministic_pass = (
            final_status == "success"
            and deterministic_status == "success"
            and observed_route == deterministic_route
            and observed_reason == deterministic_reason
        )

        quality_score = _compute_quality_score(
            final_status=final_status,
            route_match=route_match,
            provider_match=provider_match,
            validation_ok=validation_ok,
            artifacts_ok=artifacts_ok,
            usage_ok=usage_ok,
        )
        auto_accept = quality_score >= 85

        if anti_loop_pass:
            anti_loop_pass_count += 1
        if deterministic_pass:
            deterministic_pass_count += 1
        if hard_check_pass:
            hard_check_pass_count += 1
        if auto_accept:
            manual_accept_count += 1

        quality_scores.append(quality_score)

        case_reports.append(
            {
                "case_id": case["case_id"],
                "tier": case["tier"],
                "expected_route": expected_route,
                "observed_route": observed_route,
                "expected_provider": expected_provider,
                "observed_provider": observed_provider,
                "first_status": first_status,
                "final_status": final_status,
                "clarification_count": clarification_count,
                "route_match": route_match,
                "provider_match": provider_match,
                "anti_loop_pass": anti_loop_pass,
                "deterministic_pass": deterministic_pass,
                "hard_check_pass": hard_check_pass,
                "quality_score": quality_score,
                "auto_accept": auto_accept,
            }
        )

    total_cases = len(cases)
    anti_loop_rate = round((anti_loop_pass_count / total_cases) * 100, 2)
    deterministic_rate = round((deterministic_pass_count / total_cases) * 100, 2)
    hard_check_rate = round((hard_check_pass_count / total_cases) * 100, 2)
    mean_quality_score = round(sum(quality_scores) / total_cases, 2)
    manual_accept_rate = round((manual_accept_count / total_cases) * 100, 2)

    gates = {
        "regression_tests_passed": bool(regression["passed"]),
        "anti_loop_gate_pass": anti_loop_rate >= 95.0,
        "deterministic_route_gate_pass": deterministic_rate >= 100.0,
        "hard_check_pass_rate_gate_pass": hard_check_rate >= 100.0,
        "mean_quality_score_gate_pass": mean_quality_score >= 80.0,
        "manual_accept_rate_gate_pass": manual_accept_rate >= 85.0,
    }

    go_no_go = "GO" if all(gates.values()) else "NO_GO"

    report = {
        "stage": "E",
        "scope": "Gate pack Day 13-15",
        "run_at": run_at,
        "dataset": {
            "path": str(DATASET_PATH.relative_to(ROOT_DIR)).replace("\\", "/"),
            "total_cases": total_cases,
        },
        "regression": regression,
        "metrics": {
            "anti_loop_pass_rate": anti_loop_rate,
            "deterministic_route_pass_rate": deterministic_rate,
            "hard_check_pass_rate": hard_check_rate,
            "mean_quality_score": mean_quality_score,
            "manual_accept_rate": manual_accept_rate,
        },
        "thresholds": {
            "anti_loop_pass_rate": ">= 95.0",
            "deterministic_route_pass_rate": "== 100.0",
            "hard_check_pass_rate": "== 100.0",
            "mean_quality_score": ">= 80.0",
            "manual_accept_rate": ">= 85.0",
        },
        "gates": gates,
        "release_checklist": [
            {
                "item": "Graph + tier regression tests are green",
                "status": "PASS" if gates["regression_tests_passed"] else "FAIL",
            },
            {
                "item": "Anti-loop guard pass rate meets threshold",
                "status": "PASS" if gates["anti_loop_gate_pass"] else "FAIL",
            },
            {
                "item": "Route determinism gate is stable",
                "status": "PASS" if gates["deterministic_route_gate_pass"] else "FAIL",
            },
            {
                "item": "Hard output checks pass on dataset",
                "status": "PASS" if gates["hard_check_pass_rate_gate_pass"] else "FAIL",
            },
            {
                "item": "Quality score and acceptance gates are met",
                "status": "PASS" if (gates["mean_quality_score_gate_pass"] and gates["manual_accept_rate_gate_pass"]) else "FAIL",
            },
            {
                "item": "Go/No-Go decision is documented",
                "status": "PASS",
            },
        ],
        "decision": {
            "go_no_go": go_no_go,
            "reason": "All mandatory Stage E gates passed." if go_no_go == "GO" else "One or more mandatory Stage E gates failed.",
        },
        "case_reports": case_reports,
    }

    return report


def _render_markdown_report(report: dict[str, Any]) -> str:
    metrics = report["metrics"]
    gates = report["gates"]
    checklist = report["release_checklist"]

    lines = [
        "# Stage E Gate Pack Report",
        "",
        f"- Run at: {report['run_at']}",
        f"- Dataset: {report['dataset']['path']}",
        f"- Total cases: {report['dataset']['total_cases']}",
        f"- Decision: {report['decision']['go_no_go']}",
        "",
        "## Metrics",
        "",
        f"- Anti-loop pass rate: {metrics['anti_loop_pass_rate']}%",
        f"- Deterministic route pass rate: {metrics['deterministic_route_pass_rate']}%",
        f"- Hard-check pass rate: {metrics['hard_check_pass_rate']}%",
        f"- Mean quality score: {metrics['mean_quality_score']}",
        f"- Manual accept rate: {metrics['manual_accept_rate']}%",
        "",
        "## Gate Results",
        "",
        f"- Regression tests passed: {gates['regression_tests_passed']}",
        f"- Anti-loop gate pass: {gates['anti_loop_gate_pass']}",
        f"- Deterministic route gate pass: {gates['deterministic_route_gate_pass']}",
        f"- Hard-check gate pass: {gates['hard_check_pass_rate_gate_pass']}",
        f"- Mean quality score gate pass: {gates['mean_quality_score_gate_pass']}",
        f"- Manual accept gate pass: {gates['manual_accept_rate_gate_pass']}",
        "",
        "## Release Checklist",
        "",
    ]

    for item in checklist:
        marker = "x" if item["status"] == "PASS" else " "
        lines.append(f"- [{marker}] {item['item']} ({item['status']})")

    lines.extend(
        [
            "",
            "## Regression Output Tail",
            "",
            "```",
            report["regression"].get("stdout_tail", ""),
            "```",
            "",
            "## Go/No-Go Reason",
            "",
            report["decision"]["reason"],
            "",
        ]
    )

    return "\n".join(lines)


def main() -> int:
    report = run_gate_pack()

    REPORT_JSON_PATH.write_text(
        json.dumps(report, ensure_ascii=True, indent=2),
        encoding="utf-8",
    )
    REPORT_MD_PATH.write_text(_render_markdown_report(report), encoding="utf-8")

    print(json.dumps({
        "decision": report["decision"]["go_no_go"],
        "metrics": report["metrics"],
        "gates": report["gates"],
        "report_json": str(REPORT_JSON_PATH.relative_to(ROOT_DIR)).replace("\\", "/"),
        "report_md": str(REPORT_MD_PATH.relative_to(ROOT_DIR)).replace("\\", "/"),
    }, ensure_ascii=True, indent=2))

    return 0 if report["decision"]["go_no_go"] == "GO" else 1


if __name__ == "__main__":
    raise SystemExit(main())
