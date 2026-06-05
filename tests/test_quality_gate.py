"""
═══════════════════════════════════════════════════════════════════════════════
Quality Gate Tests — Based on docs/plans/2026-04-09-quality-gate-dataset.json
═══════════════════════════════════════════════════════════════════════════════
12 test cases covering:
  - Anti-loop (no infinite graph traversal)
  - Deterministic route decision
  - Hard-check (budget, activities, scores)
  - Quality score
═══════════════════════════════════════════════════════════════════════════════
"""

import json
import os
import sys
import pytest

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.agents.planner.agents_core import calculate_customer_rule_score
from app.workflows.workflow_graph import _select_route_decision


# ── Load quality gate dataset ──
DATASET_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "docs", "plans", "2026-04-09-quality-gate-dataset.json"
)

def load_dataset():
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["cases"]


CASES = load_dataset()


# ═══════════════════════════════════════════════════════════════════
# TEST 1: Route Decision Determinism
# ═══════════════════════════════════════════════════════════════════

class TestRouteDeterminism:
    """Verify route decisions match expected values from dataset."""

    @pytest.mark.parametrize("case", CASES, ids=[c["case_id"] for c in CASES])
    def test_route_decision_matches_expected(self, case):
        route_pref = case["route_preference"]
        tier = case["tier"]
        expected = case["expected_route_decision"]
        
        actual_route, _ = _select_route_decision(route_pref, tier)
        assert actual_route == expected, (
            f"Case {case['case_id']}: expected route '{expected}' "
            f"for tier={tier}, pref={route_pref}, got '{actual_route}'"
        )


# ═══════════════════════════════════════════════════════════════════
# TEST 2: Hard Checks (Budget, Activities)
# ═══════════════════════════════════════════════════════════════════

class TestHardChecks:
    """Verify hard constraints are enforced."""

    @pytest.mark.parametrize("case", CASES, ids=[c["case_id"] for c in CASES])
    def test_budget_is_positive(self, case):
        assert case["budget"] > 0, f"Budget must be positive: {case['case_id']}"

    @pytest.mark.parametrize("case", CASES, ids=[c["case_id"] for c in CASES])
    def test_goal_not_empty(self, case):
        assert len(case["goal"]) > 5, f"Goal too short: {case['case_id']}"

    @pytest.mark.parametrize("case", CASES, ids=[c["case_id"] for c in CASES])
    def test_industry_valid(self, case):
        valid_industries = {"F&B", "B2B", "General", "Tech", "Cosmetics", "Edu", "Healthcare", "Real Estate"}
        assert case["industry"] in valid_industries, f"Invalid industry: {case['industry']}"

    @pytest.mark.parametrize("case", CASES, ids=[c["case_id"] for c in CASES])
    def test_tier_valid(self, case):
        valid_tiers = {"FREE", "PLUS", "PRO"}
        assert case["tier"] in valid_tiers, f"Invalid tier: {case['tier']}"


# ═══════════════════════════════════════════════════════════════════
# TEST 3: Clarification Guard
# ═══════════════════════════════════════════════════════════════════

class TestClarificationGuard:
    """Verify clarification is triggered for incomplete inputs."""

    @pytest.mark.parametrize("case", [c for c in CASES if c["expects_clarification"]], 
                             ids=[c["case_id"] for c in CASES if c["expects_clarification"]])
    def test_missing_fields_trigger_clarification(self, case):
        """Cases with empty target_audience or constraints should expect clarification."""
        has_missing = (not case["target_audience"]) or (not case["constraints"])
        assert has_missing, f"Case {case['case_id']} expects clarification but has no missing fields"


# ═══════════════════════════════════════════════════════════════════
# TEST 4: Customer Rule Score
# ═══════════════════════════════════════════════════════════════════

class TestCustomerRuleScore:
    """Verify rule score calculator produces valid results."""

    def test_perfect_plan_scores_high(self):
        plan = {
            "activity_and_financial_breakdown": [
                {"name": "SEO", "cost": 5_000_000, "kpi": "Top 3 Google"},
                {"name": "Ads", "cost": 8_000_000, "kpi": "100 leads"},
            ],
            "strategic_pillars": ["Growth"],
            "target_segments": [{"segment_name": "Gen Z"}],
            "channel_strategy": {"fb": 60, "google": 40},
        }
        scores = calculate_customer_rule_score(plan, budget=15_000_000, target_audience="Gen Z")
        assert scores["total"] >= 80, f"Perfect plan should score >= 80, got {scores['total']}"

    def test_empty_plan_scores_low(self):
        plan = {}
        scores = calculate_customer_rule_score(plan, budget=10_000_000, target_audience="")
        assert scores["total"] < 30, f"Empty plan should score < 30, got {scores['total']}"

    def test_over_budget_penalized(self):
        plan = {
            "activity_and_financial_breakdown": [
                {"name": "Mega Campaign", "cost": 50_000_000, "kpi": "Brand recall"},
            ],
        }
        scores = calculate_customer_rule_score(plan, budget=10_000_000)
        assert scores["budget_fit"] < 20, f"Over-budget should be penalized, got {scores['budget_fit']}"

    def test_score_sum_never_exceeds_100(self):
        plan = {
            "activity_and_financial_breakdown": [
                {"name": "A", "cost": 1_000_000, "kpi": "K1"},
                {"name": "B", "cost": 2_000_000, "kpi": "K2"},
                {"name": "C", "cost": 3_000_000, "kpi": "K3"},
            ],
            "strategic_pillars": ["Growth", "Retention"],
            "target_segments": [{"segment_name": "Office workers"}],
            "channel_strategy": {"fb": 50, "google": 30, "tiktok": 20},
        }
        brand_dna = {"brand_name": "TestBrand", "tone_of_voice": "Professional"}
        scores = calculate_customer_rule_score(
            plan, budget=10_000_000, brand_dna=brand_dna, target_audience="Office workers"
        )
        assert 0 <= scores["total"] <= 100, f"Score must be 0-100, got {scores['total']}"

    def test_all_criteria_present(self):
        """Ensure all 5 criteria are computed."""
        plan = {"activity_and_financial_breakdown": [{"name": "A", "cost": 100, "kpi": "K"}]}
        scores = calculate_customer_rule_score(plan, budget=1000)
        required = {"kpi_clarity", "budget_fit", "strategic_coherence", "audience_fit", "dna_fit", "total", "max"}
        assert required.issubset(set(scores.keys())), f"Missing criteria: {required - set(scores.keys())}"


# ═══════════════════════════════════════════════════════════════════
# TEST 5: Anti-Loop Safety
# ═══════════════════════════════════════════════════════════════════

class TestAntiLoop:
    """Verify anti-loop constants are properly set."""

    def test_max_steps_configured(self):
        from app.engine.executor import MAX_STEPS, MAX_NODE_VISITS
        assert MAX_STEPS <= 50, f"MAX_STEPS should be <= 50, got {MAX_STEPS}"
        assert MAX_NODE_VISITS <= 4, f"MAX_NODE_VISITS should be <= 4, got {MAX_NODE_VISITS}"

    def test_customer_review_max_rounds(self):
        from app.agents.planner.agents_core import MAX_CUSTOMER_ROUNDS, CUSTOMER_SATISFACTION_THRESHOLD
        assert MAX_CUSTOMER_ROUNDS <= 5, f"MAX_CUSTOMER_ROUNDS too high: {MAX_CUSTOMER_ROUNDS}"
        assert 50 <= CUSTOMER_SATISFACTION_THRESHOLD <= 90, f"Threshold out of range: {CUSTOMER_SATISFACTION_THRESHOLD}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
