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
import hashlib
import os
import uuid
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from datetime import datetime, timezone
from typing import Any, Optional

from app.agents.planner.agents_core import (
    run_cmo_phase1_goal_setting,
    run_cmo_phase2_situation_audit,
    run_cmo_phase3_strategy_formulation,
    run_cmo_phase4_tactical_allocator,
    python_interceptor,
    run_cfo_defense_review,
    run_persona_validator,
    run_customer_reviewer_agent,
    run_refine_planner
)
from app.services.math_engine import MathEngine


ORCHESTRATION_CONTRACT_VERSION = "week1-v1"
NODE_INTAKE_CONTEXT = "intake_context"
NODE_GATEWAY_ROUTER = "gateway_router"
NODE_FINALIZE_OUTPUT = "finalize_output"
NODE_PLAN_WIZARD = "plan_wizard"
NODE_PLAN_COMPILER = "plan_compiler"
NODE_CLARIFICATION_GUARD = "clarification_guard"
PARALLEL_AGENT_TIMEOUT_SECONDS = int(os.getenv("BRANDFLOW_PARALLEL_AGENT_TIMEOUT_SECONDS", "75"))


class OrchestrationStageError(Exception):
    def __init__(
        self,
        *,
        code: str,
        message: str,
        status_code: int,
        node_name: str,
        error_scope: str,
        retryable: bool = False,
        details: Optional[dict] = None,
    ):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.node_name = node_name
        self.error_scope = error_scope
        self.retryable = retryable
        self.details = details or {}


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


def _select_route_decision(route_preference: str, tier: str) -> tuple[str, str]:
    preference = (route_preference or "balanced").strip().lower()
    if preference not in {"fast-track", "balanced", "deep-analysis"}:
        preference = "balanced"

    if tier == "FREE":
        return "fast-track", "TIER_FREE_FORCE_FAST_TRACK"

    if tier == "PLUS" and preference == "deep-analysis":
        return "balanced", "TIER_PLUS_DOWNGRADE_DEEP_ANALYSIS"

    return preference, "USER_ROUTE_PREFERENCE"


def _build_plan_hash(plan_intent: dict) -> str:
    canonical = json.dumps(plan_intent, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:24]


def _build_question_signature(question_key: str, question_text: str) -> str:
    canonical = f"{question_key}:{question_text}".strip().lower()
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]


def _validate_model_router_or_raise(model_router: dict) -> None:
    primary = dict(model_router.get("primary", {}) or {})
    provider = str(primary.get("provider", "")).strip().lower()
    model_name = str(primary.get("model", "")).strip()

    if provider not in {"local", "cloud"}:
        raise OrchestrationStageError(
            code="PROVIDER_ROUTER_INVALID",
            message="Model router trả provider không hợp lệ.",
            status_code=502,
            node_name=NODE_GATEWAY_ROUTER,
            error_scope="provider",
            retryable=True,
            details={
                "provider": provider,
                "allowed_providers": ["local", "cloud"],
            },
        )

    if not model_name:
        raise OrchestrationStageError(
            code="PROVIDER_MODEL_MISSING",
            message="Model router không trả model hợp lệ.",
            status_code=502,
            node_name=NODE_GATEWAY_ROUTER,
            error_scope="provider",
            retryable=True,
            details={
                "provider": provider,
                "model": model_name,
            },
        )


def _build_output_artifacts(
    *,
    trace_id: str,
    run_id: str,
    tier: str,
    route_decision: str,
    route_reason_code: str,
    plan: dict,
    agent_logs: list[dict],
    usage_telemetry: dict,
    actual_total_cost: int,
    clarification: dict,
) -> dict:
    artifact_version = "week1-output-v1"
    json_artifact = {
        "artifact_type": "application/json",
        "artifact_version": artifact_version,
        "trace_id": trace_id,
        "run_id": run_id,
        "tier": tier,
        "route_decision": route_decision,
        "route_reason_code": route_reason_code,
        "actual_total_cost": int(actual_total_cost or 0),
        "plan": plan,
        "agent_logs": agent_logs,
        "usage_telemetry": usage_telemetry,
        "clarification": clarification,
        "generated_at": _now_iso(),
    }

    txt_lines = [
        "BrandFlow Output Artifact",
        f"trace_id={trace_id}",
        f"run_id={run_id}",
        f"tier={tier}",
        f"route={route_decision}",
        f"route_reason={route_reason_code}",
        f"actual_total_cost={int(actual_total_cost or 0)}",
    ]

    campaign_name = (
        plan.get("executive_summary", {}).get("campaign_name")
        if isinstance(plan, dict)
        else None
    )
    if campaign_name:
        txt_lines.append(f"campaign_name={campaign_name}")

    usage_tokens = int(usage_telemetry.get("total_tokens_est", 0) or 0)
    usage_cost = float(usage_telemetry.get("estimated_cost_usd", 0.0) or 0.0)
    txt_lines.append(f"usage_tokens_est={usage_tokens}")
    txt_lines.append(f"usage_cost_est_usd={usage_cost}")
    txt_lines.append(f"agent_log_count={len(agent_logs or [])}")

    txt_artifact = "\n".join(txt_lines).strip()

    return {
        "version": artifact_version,
        "json": json_artifact,
        "json_string": json.dumps(json_artifact, ensure_ascii=False, indent=2),
        "txt": txt_artifact,
    }


def _validate_output_artifacts_or_raise(artifacts: dict) -> dict:
    checks: list[dict[str, Any]] = []

    json_artifact = artifacts.get("json")
    if not isinstance(json_artifact, dict):
        raise OrchestrationStageError(
            code="OUTPUT_ARTIFACT_JSON_INVALID",
            message="Output JSON artifact không hợp lệ.",
            status_code=500,
            node_name=NODE_FINALIZE_OUTPUT,
            error_scope="graph",
            retryable=False,
            details={"check": "json_artifact_must_be_dict"},
        )
    checks.append({"name": "json_artifact_must_be_dict", "passed": True})

    required_fields = [
        "trace_id",
        "run_id",
        "tier",
        "route_decision",
        "plan",
        "usage_telemetry",
    ]
    missing_fields = [field for field in required_fields if field not in json_artifact]
    if missing_fields:
        raise OrchestrationStageError(
            code="OUTPUT_ARTIFACT_JSON_MISSING_FIELDS",
            message="Output JSON artifact thiếu field bắt buộc.",
            status_code=500,
            node_name=NODE_FINALIZE_OUTPUT,
            error_scope="graph",
            retryable=False,
            details={"missing_fields": missing_fields},
        )
    checks.append({"name": "json_artifact_required_fields", "passed": True})

    plan_payload = json_artifact.get("plan", {})
    if not isinstance(plan_payload, dict) or not plan_payload:
        raise OrchestrationStageError(
            code="OUTPUT_PLAN_INVALID",
            message="Output plan rỗng hoặc không hợp lệ.",
            status_code=500,
            node_name=NODE_FINALIZE_OUTPUT,
            error_scope="graph",
            retryable=False,
            details={"check": "plan_must_be_non_empty_dict"},
        )
    checks.append({"name": "plan_must_be_non_empty_dict", "passed": True})

    txt_artifact = artifacts.get("txt")
    if not isinstance(txt_artifact, str) or len(txt_artifact.strip()) < 40:
        raise OrchestrationStageError(
            code="OUTPUT_ARTIFACT_TXT_INVALID",
            message="Output TXT artifact không hợp lệ hoặc quá ngắn.",
            status_code=500,
            node_name=NODE_FINALIZE_OUTPUT,
            error_scope="graph",
            retryable=False,
            details={"minimum_length": 40},
        )
    checks.append({"name": "txt_artifact_min_length", "passed": True})

    try:
        json.loads(artifacts.get("json_string", ""))
    except Exception as exc:
        raise OrchestrationStageError(
            code="OUTPUT_ARTIFACT_JSON_SERIALIZATION_FAILED",
            message="Output JSON string artifact không parse lại được.",
            status_code=500,
            node_name=NODE_FINALIZE_OUTPUT,
            error_scope="runtime",
            retryable=False,
            details={"exception": str(exc)},
        ) from exc
    checks.append({"name": "json_artifact_roundtrip_parse", "passed": True})

    return {
        "is_valid": True,
        "validator": "output_reliability_v1",
        "checks": checks,
    }


def _build_deterministic_fallback(
    route_decision: str,
    primary_model: dict,
    local_model: str,
) -> dict:
    route = (route_decision or "balanced").strip().lower()
    if route not in {"fast-track", "balanced", "deep-analysis"}:
        route = "balanced"

    chain_by_route = {
        "fast-track": [
            {"provider": "cloud", "model": "gemini-2.0-flash-lite"},
            {"provider": "local", "model": "qwen2.5:7b"},
            {"provider": "local", "model": local_model},
        ],
        "balanced": [
            {"provider": "cloud", "model": "gemini-2.0-flash"},
            {"provider": "local", "model": local_model},
            {"provider": "cloud", "model": "gemini-2.0-flash-lite"},
        ],
        "deep-analysis": [
            {"provider": "cloud", "model": "gemini-2.5-pro"},
            {"provider": "cloud", "model": "gemini-2.0-flash"},
            {"provider": "local", "model": local_model},
        ],
    }

    candidate_chain = chain_by_route[route]
    selected_if_triggered = next(
        (
            candidate
            for candidate in candidate_chain
            if not (
                candidate["provider"] == primary_model.get("provider")
                and candidate["model"] == primary_model.get("model")
            )
        ),
        candidate_chain[0],
    )

    reason_code = f"ROUTE_{route.upper().replace('-', '_')}_DETERMINISTIC_FALLBACK"
    return {
        "policy": "deterministic_by_route",
        "reason_code": reason_code,
        "candidate_chain": candidate_chain,
        "selected_if_triggered": selected_if_triggered,
    }


def _resolve_model_router(tier: str, route_decision: str) -> dict:
    local_model = (os.environ.get("BRANDFLOW_LOCAL_MODEL", "qwen2.5:14b") or "").strip() or "qwen2.5:14b"

    primary_by_tier = {
        "FREE": {
            "provider": "local",
            "model": local_model,
            "reason_code": "TIER_FREE_LOCAL_FIRST",
        },
        "PLUS": {
            "provider": "cloud",
            "model": "gemini-2.0-flash",
            "reason_code": "TIER_PLUS_CLOUD_STANDARD",
        },
        "PRO": {
            "provider": "cloud",
            "model": "gemini-2.5-pro",
            "reason_code": "TIER_PRO_CLOUD_PREMIUM",
        },
    }
    primary = primary_by_tier.get(tier, primary_by_tier["FREE"])
    fallback = _build_deterministic_fallback(
        route_decision=route_decision,
        primary_model=primary,
        local_model=local_model,
    )

    return {
        "tier": tier,
        "policy": "tier_router_local_first",
        "primary": primary,
        "fallback": fallback,
    }


def _estimate_usage_and_cost(
    tier: str,
    route_decision: str,
    route_reason_code: str,
    primary_model: dict,
    goal: str,
    industry: str,
    target_audience: str,
    constraints: str,
    plan: dict,
    mock_mode: bool,
) -> dict:
    route = (route_decision or "balanced").strip().lower()
    route_factor = {
        "fast-track": 0.75,
        "balanced": 1.0,
        "deep-analysis": 1.35,
    }.get(route, 1.0)

    tier_factor = {
        "FREE": 0.85,
        "PLUS": 1.0,
        "PRO": 1.25,
    }.get(tier, 1.0)

    context_chars = len(goal) + len(industry) + len(target_audience) + len(constraints)
    plan_chars = len(json.dumps(plan, ensure_ascii=False))

    prompt_tokens_est = max(90, int((220 + context_chars / 3) * route_factor * tier_factor))
    completion_tokens_est = max(160, int((180 + plan_chars / 5) * route_factor * tier_factor))
    total_tokens_est = prompt_tokens_est + completion_tokens_est

    pricing_per_1k = {
        "cloud:gemini-2.0-flash-lite": 0.0002,
        "cloud:gemini-2.0-flash": 0.0005,
        "cloud:gemini-2.5-pro": 0.0025,
        "local:qwen2.5:14b": 0.0,
        "local:qwen2.5:7b": 0.0,
    }
    pricing_key = f"{primary_model.get('provider', 'unknown')}:{primary_model.get('model', 'unknown')}"
    rate_per_1k = pricing_per_1k.get(pricing_key, 0.0 if pricing_key.startswith("local:") else 0.0008)
    estimated_cost_usd = round((total_tokens_est / 1000.0) * rate_per_1k, 8)

    return {
        "is_estimated": True,
        "prompt_tokens_est": prompt_tokens_est,
        "completion_tokens_est": completion_tokens_est,
        "total_tokens_est": total_tokens_est,
        "estimated_cost_usd": estimated_cost_usd,
        "cost_breakdown": {
            "currency": "USD",
            "pricing_key": pricing_key,
            "rate_per_1k_usd": rate_per_1k,
            "mock_mode": bool(mock_mode),
        },
        "tracking": {
            "tier": tier,
            "route_decision": route_decision,
            "route_reason_code": route_reason_code,
            "provider": primary_model.get("provider"),
            "model": primary_model.get("model"),
        },
    }


def _node_plan_wizard(node_input: dict) -> dict:
    """Chuẩn hóa dữ liệu wizard đầu vào trước bước plan compiler."""
    payload = node_input.get("payload", {})

    normalized_payload = {
        "user_id": (payload.get("user_id") or "anonymous").strip() or "anonymous",
        "goal": payload.get("goal", ""),
        "industry": payload.get("industry", "General"),
        "budget": int(payload.get("budget", 0) or 0),
        "target_audience": payload.get("target_audience", ""),
        "constraints": payload.get("constraints", ""),
        "route_preference": payload.get("route_preference", "balanced"),
        "risk_level": payload.get("risk_level", "medium"),
        "output_format": payload.get("output_format", "json"),
        "human_review_required": bool(payload.get("human_review_required", False)),
    }
    return build_node_output(node_input=node_input, payload=normalized_payload)


def _node_plan_compiler(node_input: dict) -> dict:
    """Biên dịch wizard answers thành plan_intent + plan_hash cố định."""
    payload = node_input.get("payload", {})
    route_decision, route_reason_code = _select_route_decision(
        route_preference=str(payload.get("route_preference", "balanced")),
        tier=node_input["tier"],
    )

    plan_intent = {
        "user_id": payload.get("user_id", "anonymous"),
        "tier": node_input["tier"],
        "goal": payload.get("goal", ""),
        "industry": payload.get("industry", "General"),
        "budget": int(payload.get("budget", 0) or 0),
        "target_audience": payload.get("target_audience", ""),
        "constraints": payload.get("constraints", ""),
        "route_decision": route_decision,
        "route_reason_code": route_reason_code,
        "risk_level": payload.get("risk_level", "medium"),
        "output_format": payload.get("output_format", "json"),
        "human_review_required": bool(payload.get("human_review_required", False)),
        "clarification_count": 0,
        "question_signatures": [],
        "sub_agent_user_question_allowed": False,
    }
    plan_hash = _build_plan_hash(plan_intent)

    compiled_payload = {
        "plan_hash": plan_hash,
        "plan_intent": plan_intent,
    }
    return build_node_output(node_input=node_input, payload=compiled_payload)


def run_plan_wizard_contract(
    request_payload: dict,
    trace_id: Optional[str] = None,
    tier: str = "FREE",
) -> dict:
    """
    Contract Plan-first cho giai đoạn A:
    wizard submit -> plan compiler -> trả plan_hash và plan_intent.
    """
    resolved_trace_id = trace_id or str(uuid.uuid4())
    run_id = str(uuid.uuid4())
    node_outputs: list[dict[str, Any]] = []

    try:
        wizard_input = build_node_input(
            trace_id=resolved_trace_id,
            run_id=run_id,
            node_name=NODE_PLAN_WIZARD,
            payload=request_payload,
            tier=tier,
        )
        wizard_output = _node_plan_wizard(wizard_input)
        node_outputs.append(wizard_output)

        compiler_input = build_node_input(
            trace_id=resolved_trace_id,
            run_id=run_id,
            node_name=NODE_PLAN_COMPILER,
            payload=wizard_output.get("payload", {}),
            tier=tier,
        )
        compiler_output = _node_plan_compiler(compiler_input)
        node_outputs.append(compiler_output)

        return {
            "status": "success",
            "contract_version": ORCHESTRATION_CONTRACT_VERSION,
            "trace_id": resolved_trace_id,
            "run_id": run_id,
            "tier": tier,
            "result": compiler_output.get("payload", {}),
            "node_outputs": node_outputs,
            "errors": [],
        }
    except Exception as exc:
        error = build_error_envelope(
            trace_id=resolved_trace_id,
            code="PLAN_COMPILER_INTERNAL_ERROR",
            message="Plan wizard/plan compiler bị lỗi nội bộ.",
            status_code=500,
            node_name=NODE_PLAN_COMPILER,
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


def _build_mock_plan(goal: str, industry: str, budget: int, target_audience: str) -> dict:
    if "chữa lành" in str(target_audience).lower() or "hoài cổ" in str(target_audience).lower() or "bếp nhà mộc" in goal.lower():
        return {
          "brand_dna": {
            "brand_name": "Bếp Nhà Mộc",
            "core_value": "Mộc mạc, Gắn kết, Lành sạch",
            "positioning": "Nơi tái hiện mâm cơm gia đình Việt truyền thống giữa lòng phố thị hiện đại, sử dụng 100% nguyên liệu hữu cơ và không gian kiến trúc gỗ tự nhiên chữa lành.",
            "brand_archetype": "The Caregiver (Người chăm sóc) & The Innocent (Kẻ mộng mơ thuần khiết)"
          },
          "executive_summary": {
            "campaign_name": "Thơm Khói Bếp - Ấm Tình Nhà",
            "campaign_summary": "Chiến dịch định vị lại thương hiệu Bếp Nhà Mộc sau 3 năm hoạt động. Chuyển đổi từ mô hình quán ăn gia đình thông thường sang không gian Trải nghiệm Ẩm thực & Chữa lành (Mindful Dining), thu hút tệp khách hàng Gen Y và Gen Z có thu nhập khá, yêu thích lối sống xanh.",
            "core_objectives": "Tăng 50% độ nhận diện thương hiệu tại khu vực Quận 1 và Quận 3. Đạt doanh thu 2 tỷ VNĐ trong tháng ra mắt chiến dịch. Tỷ lệ khách hàng đăng ký thẻ thành viên đạt 25%.",
            "total_budget_vnd": 250000000
          },
          "target_audience_and_brand_voice": {
            "target_audience": "Nhóm 1: Nhân viên văn phòng (25-35 tuổi) cần bữa trưa chất lượng, thư giãn. Nhóm 2: Gia đình trẻ (30-45 tuổi) tìm kiếm không gian ăn tối ấm cúng cuối tuần. Nhóm 3: Giới trẻ (18-25 tuổi) thích không gian check-in mang phong cách chữa lành, hoài niệm.",
            "brand_voice": "Ấm áp, chân thành, mộc mạc nhưng tinh tế. Gợi nhớ về quê nhà, tuổi thơ và những giá trị gia đình cốt lõi."
          },
          "phased_execution": [
            {
              "phase_id": "phase_1",
              "phase_name": "Giai đoạn 1: Nhen Lửa (Teasing & Tái Định Vị)",
              "duration": "Tuần 1 - Tuần 2, Tháng 7/2026",
              "focus": "Tạo sự tò mò, gợi nhớ kỷ niệm về mâm cơm nhà."
            },
            {
              "phase_id": "phase_2",
              "phase_name": "Giai đoạn 2: Bùng Vị (Launch & Traffic Generation)",
              "duration": "Tuần 3 - Tuần 4, Tháng 7/2026",
              "focus": "Ra mắt Menu 'Ký Ức' mới, thu hút traffic đến quán, tạo viral trên MXH."
            },
            {
              "phase_id": "phase_3",
              "phase_name": "Giai đoạn 3: Giữ Lửa (Loyalty & Retention)",
              "duration": "Tháng 8/2026",
              "focus": "Chăm sóc khách hàng, đẩy mạnh UGC (User Generated Content) và thẻ thành viên."
            }
          ],
          "activity_and_financial_breakdown": [
            {
              "phase_id": "phase_1",
              "activities": [
                {
                  "activity_name": "Viral Clip: 'Bao lâu rồi chưa ăn cơm mẹ nấu?'",
                  "description": "Phim ngắn 3 phút chạy Ads đa nền tảng, kể câu chuyện người trẻ quay cuồng trong công việc và bật khóc khi nếm lại hương vị canh cua rau đay tại Bếp Nhà Mộc.",
                  "cost_vnd": 60000000,
                  "kpi_commitment": "2 Triệu Lượt Xem, 50K Tương Tác",
                  "moscow_tag": "MUST_HAVE",
                  "channel": "Facebook, YouTube, TikTok"
                },
                {
                  "activity_name": "Thay đổi Nhận diện Mạng Xã Hội",
                  "description": "Thiết kế lại toàn bộ cover, avatar, frame bài viết theo nhận diện mới (tone nâu gỗ, xanh lá úa, typography retro).",
                  "cost_vnd": 5000000,
                  "kpi_commitment": "Hoàn thiện 100% nền tảng",
                  "moscow_tag": "MUST_HAVE",
                  "channel": "Fanpage, Instagram"
                }
              ]
            },
            {
              "phase_id": "phase_2",
              "activities": [
                {
                  "activity_name": "Chiến dịch KOLs & Food Reviewers",
                  "description": "Book 5 Macro-TikTokers (Food/Lifestyle) và 15 Micro-Influencers đến trải nghiệm Menu 'Ký Ức'. Tập trung vào âm thanh ASMR nấu ăn và không gian mộc mạc.",
                  "cost_vnd": 85000000,
                  "kpi_commitment": "5 Triệu Reach, Tăng 1000 lượt Booking",
                  "moscow_tag": "MUST_HAVE",
                  "channel": "TikTok, Instagram Reels"
                },
                {
                  "activity_name": "Sự kiện: 'Mâm Cơm 0 Đồng - Nếu bạn dẫn Mẹ theo'",
                  "description": "Miễn phí 100 set ăn cho 100 khách hàng đầu tiên trong tuần lễ ra mắt mang theo mẹ hoặc người thân lớn tuổi đến quán.",
                  "cost_vnd": 30000000,
                  "kpi_commitment": "100 Bàn, PR Báo chí Organic",
                  "moscow_tag": "SHOULD_HAVE",
                  "channel": "Offline, PR"
                },
                {
                  "activity_name": "Performance Ads",
                  "description": "Chạy quảng cáo chuyển đổi (Conversion) hướng khách hàng đặt bàn qua Landing Page.",
                  "cost_vnd": 40000000,
                  "kpi_commitment": "Tỷ lệ chuyển đổi booking < 50k/bàn",
                  "moscow_tag": "MUST_HAVE",
                  "channel": "Facebook Ads, Google Search"
                }
              ]
            },
            {
              "phase_id": "phase_3",
              "activities": [
                {
                  "activity_name": "Workshop Cuối Tuần: 'Làm Gốm & Thưởng Trà'",
                  "description": "Kết hợp với xưởng gốm địa phương tổ chức sự kiện tại không gian lầu 2. Khách mua vé hoặc miễn phí cho hạng thẻ VIP.",
                  "cost_vnd": 15000000,
                  "kpi_commitment": "150 Người Tham Dự",
                  "moscow_tag": "COULD_HAVE",
                  "channel": "Offline, Fanpage"
                },
                {
                  "activity_name": "Chương trình Loyalty 'Người Nhà'",
                  "description": "Ra mắt thẻ thành viên tích điểm. Khách hàng thân thiết được tặng món tráng miệng (Chè khúc bạch thủ công) mỗi lần ghé.",
                  "cost_vnd": 15000000,
                  "kpi_commitment": "1000 Member mới, 25% tỷ lệ quay lại",
                  "moscow_tag": "MUST_HAVE",
                  "channel": "Zalo OA, App"
                }
              ]
            }
          ],
          "risk_management": {
            "financial_risk": "Ngân sách Ads có thể bị overspend nếu không kiểm soát kỹ CPC/CPA trong Giai đoạn 2.",
            "operational_risk": "Quá tải bếp trong sự kiện 'Mâm Cơm 0 Đồng', dẫn đến trải nghiệm khách hàng kém."
          },
          "estimated_total_cost_vnd": 250000000
        }

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
        "route_decision": payload.get("route_decision", "balanced"),
        "route_reason_code": payload.get("route_reason_code", "PLAN_COMPILER_ROUTE"),
        "clarification_count": int(payload.get("clarification_count", 0) or 0),
        "question_signatures": list(payload.get("question_signatures", []) or []),
        "sub_agent_user_question_allowed": bool(payload.get("sub_agent_user_question_allowed", False)),
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
    forced_route = (payload.get("route_decision") or "").strip()
    forced_reason = (payload.get("route_reason_code") or "").strip()

    if forced_route:
        route_decision = forced_route
        route_reason_code = forced_reason or "PLAN_COMPILER_LOCKED_ROUTE"
    elif not mock_mode:
        # TODO(week2): gọi LLM gateway/router thật theo tier + policy.
        route_decision = "deterministic_fallback"
        route_reason_code = "GATEWAY_DETERMINISTIC_FALLBACK"
    else:
        route_decision = "mock_router"
        route_reason_code = "GATEWAY_MOCK_MODE"

    plan = _build_mock_plan(
        goal=goal,
        industry=industry,
        budget=budget,
        target_audience=target_audience,
    )

    model_router = _resolve_model_router(
        tier=node_input["tier"],
        route_decision=route_decision,
    )
    _validate_model_router_or_raise(model_router)

    usage_telemetry = _estimate_usage_and_cost(
        tier=node_input["tier"],
        route_decision=route_decision,
        route_reason_code=route_reason_code,
        primary_model=model_router.get("primary", {}),
        goal=goal,
        industry=industry,
        target_audience=target_audience,
        constraints=payload.get("constraints", ""),
        plan=plan,
        mock_mode=mock_mode,
    )

    output_payload = {
        "route_decision": route_decision,
        "route_reason_code": route_reason_code,
        "model_router": model_router,
        "usage_telemetry": usage_telemetry,
        "plan": plan,
        "actual_total_cost": plan.get("estimated_total_cost_vnd", 0),
        "clarification_count": int(payload.get("clarification_count", 0) or 0),
        "question_signatures": list(payload.get("question_signatures", []) or []),
        "sub_agent_user_question_allowed": bool(payload.get("sub_agent_user_question_allowed", False)),
        "clarification_reason_code": payload.get("clarification_reason_code", "CLARIFICATION_NOT_REQUIRED"),
        "agent_logs": [
            {
                "agent": "SYSTEM",
                "role": "Orchestration Router",
                "ask_user": False,
                "reason_code": route_reason_code,
                "message": (
                    f"Route '{route_decision}' đã được chọn cho tier {node_input['tier']} "
                    f"(reason_code={route_reason_code}); model={model_router['primary']['provider']}:{model_router['primary']['model']}."
                ),
            },
            {
                "agent": "CMO",
                "role": "Master Planner",
                "ask_user": False,
                "message": "Đã tạo kế hoạch mock deterministic theo contract tuần 1.",
            },
        ],
    }
    return build_node_output(node_input=node_input, payload=output_payload)


def _node_clarification_guard(node_input: dict) -> dict:
    """Chỉ cho phép tối đa 1 vòng hỏi bổ sung và dedupe theo question_signature."""
    payload = node_input.get("payload", {})

    target_audience = (payload.get("target_audience") or "").strip()
    constraints = (payload.get("constraints") or "").strip()

    clarification_count = int(payload.get("clarification_count", 0) or 0)
    existing_signatures = list(payload.get("question_signatures", []) or [])
    existing_signature_set = set(existing_signatures)

    question_candidates = []
    if not target_audience:
        question_candidates.append(
            {
                "question_key": "target_audience",
                "question": "Bạn xác nhận tệp khách hàng mục tiêu chính cho run này là gì?",
            }
        )
    if not constraints:
        question_candidates.append(
            {
                "question_key": "constraints",
                "question": "Có ràng buộc bắt buộc nào về kênh, pháp lý, hoặc thời gian không?",
            }
        )

    clarification_questions = []
    for candidate in question_candidates:
        signature = _build_question_signature(
            candidate["question_key"],
            candidate["question"],
        )
        if signature in existing_signature_set:
            continue
        clarification_questions.append(
            {
                "question_signature": signature,
                "question_key": candidate["question_key"],
                "question": candidate["question"],
            }
        )

    if clarification_questions and clarification_count < 1:
        updated_signatures = existing_signatures + [
            item["question_signature"]
            for item in clarification_questions
            if item["question_signature"] not in existing_signature_set
        ]
        guarded_payload = {
            **payload,
            "clarification_needed": True,
            "clarification_count": clarification_count + 1,
            "question_signatures": updated_signatures,
            "clarification_questions": clarification_questions,
            "clarification_reason_code": "CLARIFICATION_REQUIRED_MISSING_CONTEXT",
        }
        return build_node_output(node_input=node_input, payload=guarded_payload)

    normalized_target_audience = target_audience or "Tệp khách hàng chung (fallback)"
    normalized_constraints = constraints or "Không có ràng buộc bắt buộc (fallback)"

    if clarification_questions and clarification_count >= 1:
        clarification_reason_code = "CLARIFICATION_MAX_ROUND_REACHED_USE_DEFAULTS"
    elif question_candidates and not clarification_questions:
        clarification_reason_code = "CLARIFICATION_DEDUPED_BY_QUESTION_SIGNATURE"
    else:
        clarification_reason_code = "CLARIFICATION_NOT_REQUIRED"

    guarded_payload = {
        **payload,
        "target_audience": normalized_target_audience,
        "constraints": normalized_constraints,
        "clarification_needed": False,
        "clarification_count": clarification_count,
        "question_signatures": existing_signatures,
        "clarification_questions": [],
        "clarification_reason_code": clarification_reason_code,
    }
    return build_node_output(node_input=node_input, payload=guarded_payload)


def _node_finalize_output(node_input: dict, mock_mode: bool) -> dict:
    """Chuẩn hóa payload cuối để API trả thống nhất."""
    payload = node_input.get("payload", {})

    clarification_payload = {
        "reason_code": payload.get("clarification_reason_code", "CLARIFICATION_NOT_REQUIRED"),
        "count": int(payload.get("clarification_count", 0) or 0),
        "question_signatures": list(payload.get("question_signatures", []) or []),
    }

    artifacts = _build_output_artifacts(
        trace_id=node_input["trace_id"],
        run_id=node_input["run_id"],
        tier=node_input["tier"],
        route_decision=payload.get("route_decision", "unknown"),
        route_reason_code=payload.get("route_reason_code", "UNKNOWN_REASON"),
        plan=payload.get("plan", {}),
        agent_logs=payload.get("agent_logs", []),
        usage_telemetry=payload.get("usage_telemetry", {}),
        actual_total_cost=int(payload.get("actual_total_cost", 0) or 0),
        clarification=clarification_payload,
    )
    validation = _validate_output_artifacts_or_raise(artifacts)

    final_payload = {
        "is_mock": bool(mock_mode),
        "route_decision": payload.get("route_decision", "unknown"),
        "route_reason_code": payload.get("route_reason_code", "UNKNOWN_REASON"),
        "model_router": payload.get("model_router", {}),
        "usage_telemetry": payload.get("usage_telemetry", {}),
        "plan": payload.get("plan", {}),
        "agent_logs": payload.get("agent_logs", []),
        "actual_total_cost": int(payload.get("actual_total_cost", 0) or 0),
        "clarification": clarification_payload,
        "artifacts": artifacts,
        "validation": validation,
        "sub_agent_user_question_allowed": bool(payload.get("sub_agent_user_question_allowed", False)),
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

        clarification_input = build_node_input(
            trace_id=resolved_trace_id,
            run_id=run_id,
            node_name=NODE_CLARIFICATION_GUARD,
            payload=intake_output.get("payload", {}),
            tier=tier,
        )
        clarification_output = _node_clarification_guard(clarification_input)
        node_outputs.append(clarification_output)

        clarification_payload = clarification_output.get("payload", {})
        if clarification_payload.get("clarification_needed"):
            return {
                "status": "clarification_needed",
                "contract_version": ORCHESTRATION_CONTRACT_VERSION,
                "trace_id": resolved_trace_id,
                "run_id": run_id,
                "tier": tier,
                "result": {
                    "clarification_needed": True,
                    "clarification_questions": clarification_payload.get("clarification_questions", []),
                    "clarification_count": clarification_payload.get("clarification_count", 0),
                    "question_signatures": clarification_payload.get("question_signatures", []),
                    "reason_code": clarification_payload.get("clarification_reason_code", "CLARIFICATION_REQUIRED_MISSING_CONTEXT"),
                    "route_decision": clarification_payload.get("route_decision", "unknown"),
                    "route_reason_code": clarification_payload.get("route_reason_code", "UNKNOWN_REASON"),
                },
                "node_outputs": node_outputs,
                "errors": [],
            }

        gateway_input = build_node_input(
            trace_id=resolved_trace_id,
            run_id=run_id,
            node_name=NODE_GATEWAY_ROUTER,
            payload=clarification_payload,
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
    except OrchestrationStageError as exc:
        error = build_error_envelope(
            trace_id=resolved_trace_id,
            code=exc.code,
            message=exc.message,
            status_code=exc.status_code,
            node_name=exc.node_name,
            retryable=exc.retryable,
            details={
                "error_scope": exc.error_scope,
                **exc.details,
            },
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
    except Exception as exc:
        error = build_error_envelope(
            trace_id=resolved_trace_id,
            code="ORCH_RUNTIME_ERROR",
            message="Orchestration tuần 1 bị lỗi nội bộ.",
            status_code=500,
            node_name=NODE_FINALIZE_OUTPUT,
            retryable=False,
            details={
                "error_scope": "runtime",
                "exception": str(exc),
            },
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


def export_final_plan_to_disk(
    run_id: str,
    goal: str,
    budget: int,
    rounds: int,
    customer_feedback: list,
    cfo_comment: str,
    rule_score: int,
    client_self_score: int,
    final_score: int,
    actual_total_cost: int,
    final_plan: dict
):
    import os
    import json
    from datetime import datetime
    
    os.makedirs("outputs/final", exist_ok=True)
    
    json_payload = {
        "meta": {
            "run_id": run_id,
            "goal": goal,
            "budget": budget,
            "approved": final_score >= 70,
            "rounds": rounds,
            "timestamp": datetime.now().isoformat()
        },
        "plan": final_plan,
        "scores": {
            "rule_score": rule_score,
            "client_self_score": client_self_score,
            "final_score": final_score
        },
        "customer_feedback": customer_feedback,
        "cfo_decision": cfo_comment
    }
    
    json_path = f"outputs/final/final-{run_id}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_payload, f, ensure_ascii=False, indent=2)
        
    txt_lines = [
        f"BrandFlow Executive Summary (Run: {run_id})",
        f"Goal: {goal} | Budget: {budget:,} VND",
        f"Final Cost: {actual_total_cost:,} VND",
        f"Status: {'APPROVED' if final_score >= 70 else 'REJECTED'} (Score: {final_score}/100, Rounds: {rounds})",
        "---",
        "CFO Risk Comment:",
        f"> {cfo_comment}",
        "Customer Feedback:",
        *[f"- {fb}" for fb in customer_feedback],
        "---",
        "Key Tactics & KPIs:"
    ]
    
    tactics = final_plan.get("tactics_7ps", [])
    if tactics:
        for act in tactics:
            p_name = act.get("p_name", "Tactic")
            action = act.get("action_bullet", "")
            cost = act.get("budget_vnd", 0)
            kpi = act.get("kpi", "")
            txt_lines.append(f"[{p_name}] {action} | Cost: {cost:,} | KPI: {kpi}")
            
    txt_path = f"outputs/final/final-{run_id}.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(txt_lines))
        
    return json_path, txt_path


def run_pipeline(
    goal: str,
    industry: str,
    budget: int,
    csfs: list = None,
    resources: str = "",
    target_audience: str = "Tệp khách hàng chung",
    constraints: str = "Không có",
    brand_dna: dict = None,
    scenario_type: str = "budget_driven",
    target_profit: int = None,
    idea_description: str = None,
) -> dict:
    """
    Pipeline tuyến tính: MasterPlanner → Python Interceptor → CFO/Persona Agents.
    """
    print(f"\n{'═' * 70}")
    print(f"🚀 [PIPELINE START] Node-based Engine (Gumloop Architecture)")
    print(f"{'═' * 70}")

    import os
    from app.engine.executor import WorkflowExecutor
    
    initial_state = {
        "goal": goal,
        "industry": industry,
        "budget": int(budget or 0),
        "csfs": csfs or [],
        "resources": resources,
        "target_audience": target_audience,
        "constraints": constraints,
        "brand_dna": brand_dna,
        "scenario_type": scenario_type,
        "target_profit": target_profit,
        "idea_description": idea_description,
        "agent_logs": []
    }
    
    workflow_path = os.path.join(os.path.dirname(__file__), "cmo_workflow.json")
    engine = WorkflowExecutor(workflow_json_path=workflow_path, initial_state=initial_state)
    
    final_state = engine.run(start_node_id="init_vars")
    
    # Kết quả trả về sau khi engine chạy hết graph
    export_result = final_state.get("final_export_result", {})
    
    return {
        "final_plan": export_result.get("final_plan", {}),
        "agent_logs": final_state.get("agent_logs", []),
        "actual_total_cost": export_result.get("actual_total_cost", 0),
        "run_id": export_result.get("run_id", "")
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
    final_plan_tactics = interceptor_result["final_activities"]
    overflow_amount = interceptor_result["overflow_amount"]
    cut_items = interceptor_result["cut_items"]
    actual_cost = interceptor_result["final_total"]

    # ── STEP 3: Agent 2 & Agent 3 chạy song song ──
    # target_audience có thể nằm ở phase 1 hoặc 2. Ở đây extract nếu có.
    target_audience = "Khách hàng B2B"
    if "target_segments" in raw_plan and len(raw_plan["target_segments"]) > 0:
        target_audience = raw_plan["target_segments"][0].get("segment_name", "Khách hàng")
    
    with ThreadPoolExecutor(max_workers=2) as executor:
        cfo_future = executor.submit(
            run_cfo_defense_review, interceptor_result, budget
        )
        persona_future = executor.submit(
            run_persona_validator, json.dumps(final_plan_tactics, ensure_ascii=False), target_audience
        )
        try:
            cfo_res = cfo_future.result(timeout=PARALLEL_AGENT_TIMEOUT_SECONDS)
            cfo_comment = cfo_res.get("cfo_comment", "")
            persona_comment = persona_future.result(timeout=PARALLEL_AGENT_TIMEOUT_SECONDS)
        except FuturesTimeoutError as exc:
            cfo_future.cancel()
            persona_future.cancel()
            raise TimeoutError(
                f"CFO/PERSONA timeout sau {PARALLEL_AGENT_TIMEOUT_SECONDS} giay."
            ) from exc

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

    # Cập nhật mảng tactics trong raw_plan sau khi ep giá
    raw_plan["activity_and_financial_breakdown"] = final_plan_tactics.get("activity_and_financial_breakdown", [])

    return {
        "final_plan": raw_plan,
        "agent_logs": agent_logs,
        "actual_total_cost": interceptor_result['final_total'],
    }

if __name__ == "__main__":
    result = run_pipeline(
        goal="Ra mắt app mới",
        industry="Tech",
        budget=100_000_000,
        csfs=["User acquisition rẻ", "App tải nhanh"],
        resources="Team dev 5 người, marketing 2 người"
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
