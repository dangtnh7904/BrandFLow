"""
═══════════════════════════════════════════════════════════════════════════════
engine_adapters.py v2 — Bridge functions giữa workflow nodes và business logic
═══════════════════════════════════════════════════════════════════════════════
Nâng cấp:
  - Handle None/timeout values từ parallel agents
  - Validate final output trước khi return
  - Robust fallback cho mọi edge case
"""

import json
import uuid
from typing import Dict, Any

# Tránh circular import bằng cách import cụ thể tại runtime hoặc local import
from app.workflows.workflow_graph import MathEngine, export_final_plan_to_disk


def calc_math_swot(phase2_data: dict) -> dict:
    math_engine = MathEngine()
    # csf_analysis có thể không tồn tại trực tiếp trong schema mới, dùng [] nếu thiếu
    csfs = phase2_data.get("csf_analysis", []) if isinstance(phase2_data, dict) else []
    try:
        return math_engine.calculate_swot_csfs(csfs)
    except Exception as e:
        print(f"⚠️ [ADAPTER] calc_math_swot failed: {e}")
        return {"swot_scores": {}, "csf_scores": [], "error": str(e)}


def calc_market_gap(target_profit: int, budget: int) -> dict:
    math_engine = MathEngine()
    target_profit_val = target_profit if target_profit else 0
    budget_val = budget if budget else 0
    
    if target_profit_val > 0:
        target_rev = budget_val + target_profit_val
    else:
        target_rev = budget_val * 2 if budget_val > 0 else 100_000_000
        
    baseline_rev = int(budget_val * 0.5) if budget_val > 0 else 0
    try:
        return math_engine.calculate_market_gap(target_revenue=target_rev, baseline_revenue=baseline_rev)
    except Exception as e:
        print(f"⚠️ [ADAPTER] calc_market_gap failed: {e}")
        return {"gap": target_rev - baseline_rev, "gap_percentage": 0, "error": str(e)}


def extract_loop_metrics(interceptor_result: dict, customer_res: dict, cfo_res: dict, coo_res: dict = None, sales_res: dict = None) -> dict:
    """
    Trích xuất metrics từ kết quả CFO + Persona + COO + Sales review.
    
    v2: Handle None/timeout — nếu agent bị timeout hoặc trả None, 
    dùng fallback values thay vì crash.
    """
    math_engine = MathEngine()
    
    # ── Robust handling cho interceptor_result ──
    if not interceptor_result or not isinstance(interceptor_result, dict):
        print("⚠️ [ADAPTER] interceptor_result is None/invalid. Using empty fallback.")
        interceptor_result = {"final_activities": {}, "final_total": 0, "raw_total": 0}
    
    final_plan_tactics = interceptor_result.get("final_activities", {})
    
    # ── Robust handling cho customer_res (Persona) ──
    if not customer_res or not isinstance(customer_res, dict):
        print("⚠️ [ADAPTER] customer_res is None (Persona timeout?). Using fallback score=60.")
        customer_res = {
            "client_self_score": 60,
            "feedback": ["Persona review không khả dụng (timeout/error)."],
            "reasoning_summary": "Fallback — Persona agent bị timeout."
        }
    
    client_self_score = customer_res.get("client_self_score", 60)
    feedback = customer_res.get("feedback", [])
    
    # Ensure client_self_score is numeric
    try:
        client_self_score = int(client_self_score)
    except (ValueError, TypeError):
        client_self_score = 60
    
    # Clamp to valid range
    client_self_score = max(0, min(100, client_self_score))
    
    # ── Robust handling cho cfo_res ──
    if not cfo_res or not isinstance(cfo_res, dict):
        print("⚠️ [ADAPTER] cfo_res is None (CFO timeout?). Using fallback.")
        cfo_res = {
            "cfo_comment": "CFO review không khả dụng (timeout/error). Khuyến nghị: kiểm tra lại ngân sách thủ công.",
            "risk_assessment": []
        }

    # ── Robust handling cho coo_res ──
    if not coo_res or not isinstance(coo_res, dict):
        print("⚠️ [ADAPTER] coo_res is None. Using fallback.")
        coo_res = {
            "coo_score": 60,
            "operational_risks": [],
            "coo_comment": "COO review không khả dụng (timeout/error)."
        }
    coo_score = max(0, min(100, int(coo_res.get("coo_score", 60))))

    # ── Robust handling cho sales_res ──
    if not sales_res or not isinstance(sales_res, dict):
        print("⚠️ [ADAPTER] sales_res is None. Using fallback.")
        sales_res = {
            "sales_alignment_score": 60,
            "lead_quality_concerns": [],
            "sales_comment": "Sales review không khả dụng (timeout/error)."
        }
    sales_score = max(0, min(100, int(sales_res.get("sales_alignment_score", 60))))
    
    # ── Calculate scores ──
    try:
        rule_score_data = math_engine.calculate_customer_rule_score(final_plan_tactics)
        rule_score = rule_score_data.get("rule_score", 50)
    except Exception as e:
        print(f"⚠️ [ADAPTER] calculate_customer_rule_score failed: {e}. Using fallback=50.")
        rule_score = 50
    
    # New final score formula: Persona 30%, CFO (rule) 20%, COO 25%, Sales 25%
    final_score = (client_self_score * 0.3) + (rule_score * 0.2) + (coo_score * 0.25) + (sales_score * 0.25)
    
    return {
        "client_self_score": client_self_score,
        "rule_score": rule_score,
        "coo_score": coo_score,
        "sales_score": sales_score,
        "final_score": final_score,
        "customer_feedback": feedback if isinstance(feedback, list) else [str(feedback)],
        "cfo_comment": cfo_res.get("cfo_comment", ""),
        "coo_comment": coo_res.get("coo_comment", ""),
        "sales_comment": sales_res.get("sales_comment", ""),
        "persona_comment": customer_res.get("reasoning_summary", ""),
        "risk_assessment": cfo_res.get("risk_assessment", []) if isinstance(cfo_res.get("risk_assessment"), list) else [],
        "operational_risks": coo_res.get("operational_risks", []) if isinstance(coo_res.get("operational_risks"), list) else [],
        "lead_quality_concerns": sales_res.get("lead_quality_concerns", []) if isinstance(sales_res.get("lead_quality_concerns"), list) else []
    }


def format_refine_feedback(cfo_comment: str, customer_feedback: list, coo_comment: str = "", sales_comment: str = "") -> str:
    """Format feedback string for the refine planner agent."""
    if not cfo_comment:
        cfo_comment = "Không có phản hồi từ CFO."
    
    if isinstance(customer_feedback, list) and customer_feedback:
        feedback_str = ", ".join(str(fb) for fb in customer_feedback)
    else:
        feedback_str = "Không có phản hồi từ khách hàng."
    
    parts = [
        f"CFO cảnh báo: {cfo_comment}",
        f"COO phản hồi: {coo_comment}" if coo_comment else "",
        f"Sales phản hồi: {sales_comment}" if sales_comment else "",
        f"Khách hàng phản hồi: {feedback_str}"
    ]
    
    return " | ".join(filter(None, parts)) + ". Hãy điều chỉnh lại chiến thuật để giải quyết các vấn đề trên."


def finalize_and_export(state: Dict[str, Any]) -> dict:
    """
    Gom dữ liệu để xuất kết quả cuối cùng.
    
    v2: Validate final_plan trước khi return, 
    handle missing fields gracefully.
    """
    # Gom dữ liệu — robust handling cho mọi field
    interceptor_result = state.get("interceptor_result") or {}
    final_plan_tactics = interceptor_result.get("final_activities", {}) if isinstance(interceptor_result, dict) else {}
    actual_cost = interceptor_result.get("final_total", 0) if isinstance(interceptor_result, dict) else 0
    
    phase1_data = state.get("phase1_data") or {}
    phase2_data = state.get("phase2_data") or {}
    phase3_data = state.get("phase3_data") or {}
    
    metrics = state.get("loop_metrics") or {}
    final_score = metrics.get("final_score", 0)
    rule_score = metrics.get("rule_score", 0)
    client_self_score = metrics.get("client_self_score", 0)
    cfo_comment = metrics.get("cfo_comment", "")
    customer_feedback = metrics.get("customer_feedback", [])
    risk_assessment = metrics.get("risk_assessment", [])
    
    plan_5w1h = final_plan_tactics.get("plan_5w1h", {}) if isinstance(final_plan_tactics, dict) else {}
    distribution_channels = final_plan_tactics.get("distribution_channels", {}) if isinstance(final_plan_tactics, dict) else {}
    integrated_matrix = final_plan_tactics.get("integrated_matrix", {}) if isinstance(final_plan_tactics, dict) else {}
    omnichannel_crm_plan = final_plan_tactics.get("omnichannel_crm_plan", []) if isinstance(final_plan_tactics, dict) else []
    campaign_phasing = phase3_data.get("campaign_phasing", []) if isinstance(phase3_data, dict) else []

    final_plan = {
        "goal_setting": phase1_data,
        "target_segments": phase2_data.get("target_segments", []) if isinstance(phase2_data, dict) else [],
        "benchmarks": phase2_data.get("benchmarks", []) if isinstance(phase2_data, dict) else [],
        "gap_analysis_result": json.dumps(state.get("gap_result", {}), ensure_ascii=False),
        "ansoff_strategy": phase3_data.get("ansoff_matrix_choice", "") if isinstance(phase3_data, dict) else "",
        "campaign_phasing": campaign_phasing,
        "tactics_7ps": final_plan_tactics.get("tactics_7ps", []) if isinstance(final_plan_tactics, dict) else [],
        "plan_5w1h": plan_5w1h,
        "distribution_channels": distribution_channels,
        "integrated_matrix": integrated_matrix,
        "omnichannel_crm_plan": omnichannel_crm_plan,
        "risk_assessment": risk_assessment,
        "operational_risks": metrics.get("operational_risks", []),
        "lead_quality_concerns": metrics.get("lead_quality_concerns", []),
        "coo_comment": metrics.get("coo_comment", ""),
        "sales_comment": metrics.get("sales_comment", "")
    }
    
    # ── VALIDATION — Check if final_plan has meaningful content ──
    tactics_count = len(final_plan.get("tactics_7ps", []))
    has_goal = bool(phase1_data)
    
    if tactics_count == 0 and not has_goal:
        print("⚠️ [FINALIZE] Final plan appears empty. Pipeline may have had errors.")
        state.setdefault("agent_logs", []).append({
            "agent": "SYSTEM",
            "role": "Output Validator",
            "message": "⚠️ Final plan có thể thiếu nội dung do lỗi pipeline. Vui lòng kiểm tra lại."
        })
    else:
        print(f"✅ [FINALIZE] Plan validated: {tactics_count} tactics, goal_setting={'present' if has_goal else 'missing'}")
    
    # ── Export to disk ──
    run_id = str(uuid.uuid4())
    try:
        export_final_plan_to_disk(
            run_id=run_id,
            goal=state.get("goal", ""),
            budget=state.get("budget", 0),
            rounds=state.get("current_round", 1),
            customer_feedback=customer_feedback,
            cfo_comment=cfo_comment,
            rule_score=rule_score,
            client_self_score=client_self_score,
            final_score=final_score,
            actual_total_cost=actual_cost,
            final_plan=final_plan
        )
    except Exception as e:
        print(f"⚠️ [FINALIZE] Failed to export to disk: {e}")
    
    # ── Append execution summary to agent_logs ──
    exec_summary = state.get("_execution_summary", {})
    if exec_summary:
        state.setdefault("agent_logs", []).append({
            "agent": "SYSTEM",
            "role": "Engine Summary",
            "message": (
                f"Pipeline hoàn tất: {exec_summary.get('total_steps', '?')} steps, "
                f"{exec_summary.get('success_count', '?')} thành công, "
                f"{exec_summary.get('error_count', '?')} lỗi, "
                f"tổng thời gian {exec_summary.get('total_duration_ms', '?')}ms"
            )
        })
    
    return {
        "final_plan": final_plan,
        "actual_total_cost": actual_cost,
        "run_id": run_id
    }
