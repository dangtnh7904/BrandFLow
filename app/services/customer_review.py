DEFAULT_CRITERIA_WEIGHTS = {
    "kpi_activity_clarity": 35,
    "feasibility_budget": 25,
    "strategic_coherence": 20,
    "target_fit": 10,
    "brand_fit": 10,
}


def calculate_customer_rule_score(plan: dict, criteria_weights: dict) -> int:
    if not plan or not plan.get("activity_and_financial_breakdown"):
        return 50

    score = 0
    has_kpi = False
    for phase in plan.get("activity_and_financial_breakdown", []):
        for act in phase.get("activities", []):
            if act.get("kpi_commitment"):
                has_kpi = True

    if has_kpi:
        score += criteria_weights.get("kpi_activity_clarity", 0)

    # Minimal baseline for now, remaining criteria are heuristic-safe defaults
    score += criteria_weights.get("feasibility_budget", 0) // 2
    score += criteria_weights.get("strategic_coherence", 0) // 2
    score += criteria_weights.get("target_fit", 0) // 2
    score += criteria_weights.get("brand_fit", 0) // 2

    return min(100, max(0, score))
