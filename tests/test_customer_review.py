from customer_review import calculate_customer_rule_score, DEFAULT_CRITERIA_WEIGHTS


def test_rule_score_full_plan():
    plan = {
        "executive_summary": "Summary",
        "target_audience": "Gen Z",
        "phases": [
            {
                "phase_name": "Phase 1",
                "activities": [
                    {"name": "A", "cost": 1000000, "expected_kpi": "1000 reach"}
                ]
            }
        ]
    }

    score = calculate_customer_rule_score(plan, DEFAULT_CRITERIA_WEIGHTS)
    assert 0 <= score <= 100
    assert score >= 60


def test_rule_score_missing_fields_fallback():
    plan = {"phases": []}
    score = calculate_customer_rule_score(plan, DEFAULT_CRITERIA_WEIGHTS)
    assert score == 50
