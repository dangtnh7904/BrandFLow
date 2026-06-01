import json
import uuid
from typing import Dict, Any

# Tránh circular import bằng cách import cụ thể tại runtime hoặc local import
from app.workflows.workflow_graph import MathEngine, export_final_plan_to_disk

def calc_math_swot(phase2_data: dict) -> dict:
    math_engine = MathEngine()
    # csf_analysis có thể không tồn tại trực tiếp trong schema mới, dùng [] nếu thiếu
    csfs = phase2_data.get("csf_analysis", []) if isinstance(phase2_data, dict) else []
    return math_engine.calculate_swot_csfs(csfs)

def calc_market_gap(target_profit: int, budget: int) -> dict:
    math_engine = MathEngine()
    target_profit_val = target_profit if target_profit else 0
    budget_val = budget if budget else 0
    
    if target_profit_val > 0:
        target_rev = budget_val + target_profit_val
    else:
        target_rev = budget_val * 2 if budget_val > 0 else 100_000_000
        
    baseline_rev = int(budget_val * 0.5) if budget_val > 0 else 0
    return math_engine.calculate_market_gap(target_revenue=target_rev, baseline_revenue=baseline_rev)

def extract_loop_metrics(interceptor_result: dict, customer_res: dict, cfo_res: dict) -> dict:
    math_engine = MathEngine()
    final_plan_tactics = interceptor_result.get("final_activities", {})
    
    client_self_score = customer_res.get("client_self_score", 50)
    feedback = customer_res.get("feedback", [])
    
    rule_score_data = math_engine.calculate_customer_rule_score(final_plan_tactics)
    rule_score = rule_score_data["rule_score"]
    final_score = (client_self_score * 0.5) + (rule_score * 0.5)
    
    return {
        "client_self_score": client_self_score,
        "rule_score": rule_score,
        "final_score": final_score,
        "customer_feedback": feedback,
        "cfo_comment": cfo_res.get("cfo_comment", ""),
        "persona_comment": customer_res.get("reasoning_summary", ""),
        "risk_assessment": cfo_res.get("risk_assessment", [])
    }

def format_refine_feedback(cfo_comment: str, customer_feedback: list) -> str:
    feedback_str = ", ".join(customer_feedback) if customer_feedback else "Không có phản hồi."
    return f"CFO cảnh báo: {cfo_comment}. Khách hàng phản hồi: {feedback_str}. Hãy điều chỉnh lại chiến thuật cho hiệu quả hơn."

def finalize_and_export(state: Dict[str, Any]) -> dict:
    # Gom dữ liệu để xuất giống hệ thống cũ
    final_plan_tactics = state.get("interceptor_result", {}).get("final_activities", {})
    actual_cost = state.get("interceptor_result", {}).get("final_total", 0)
    
    phase1_data = state.get("phase1_data", {})
    phase2_data = state.get("phase2_data", {})
    phase3_data = state.get("phase3_data", {})
    
    metrics = state.get("loop_metrics", {})
    final_score = metrics.get("final_score", 0)
    rule_score = metrics.get("rule_score", 0)
    client_self_score = metrics.get("client_self_score", 0)
    cfo_comment = metrics.get("cfo_comment", "")
    customer_feedback = metrics.get("customer_feedback", [])
    risk_assessment = metrics.get("risk_assessment", [])
    
    plan_5w1h = final_plan_tactics.get("plan_5w1h", {})
    distribution_channels = final_plan_tactics.get("distribution_channels", {})
    integrated_matrix = final_plan_tactics.get("integrated_matrix", {})
    omnichannel_crm_plan = final_plan_tactics.get("omnichannel_crm_plan", [])
    campaign_phasing = phase3_data.get("campaign_phasing", [])

    final_plan = {
        "goal_setting": phase1_data,
        "target_segments": phase2_data.get("target_segments", []),
        "benchmarks": phase2_data.get("benchmarks", []),
        "gap_analysis_result": json.dumps(state.get("gap_result", {}), ensure_ascii=False),
        "ansoff_strategy": phase3_data.get("ansoff_matrix_choice", ""),
        "campaign_phasing": campaign_phasing,
        "tactics_7ps": final_plan_tactics.get("tactics_7ps", []),
        "plan_5w1h": plan_5w1h,
        "distribution_channels": distribution_channels,
        "integrated_matrix": integrated_matrix,
        "omnichannel_crm_plan": omnichannel_crm_plan,
        "risk_assessment": risk_assessment
    }
    
    run_id = str(uuid.uuid4())
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
    
    return {
        "final_plan": final_plan,
        "actual_total_cost": actual_cost,
        "run_id": run_id
    }
