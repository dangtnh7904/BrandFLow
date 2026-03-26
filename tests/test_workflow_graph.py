import pytest
from unittest.mock import patch, MagicMock
from workflow_graph import strategy_app

# Kế hoạch rẻ (15 triệu)
mock_cheap_plan = {
    "campaign_name": "Test Convergence",
    "executive_summary": "Cheap Plan",
    "target_audience": "N/A",
    "total_estimated_cost": 15000000,
    "phases": [
        {
            "phase_name": "Phase 1",
            "duration": "1 week",
            "objective": "Test",
            "phase_subtotal_cost": 15000000,
            "activities": [
                {
                    "name": "Act 1",
                    "description": "Desc 1",
                    "cost": 15000000,
                    "priority": "MUST_HAVE",
                    "expected_kpi": "Testing"
                }
            ]
        }
    ]
}

# Kế hoạch đắt (25 triệu)
mock_expensive_plan = {
    "campaign_name": "Test Deadlock",
    "executive_summary": "Expensive Plan",
    "target_audience": "N/A",
    "total_estimated_cost": 25000000,
    "phases": [
        {
            "phase_name": "Phase 1",
            "duration": "1 week",
            "objective": "Test",
            "phase_subtotal_cost": 25000000,
            "activities": [
                {
                    "name": "Act 1",
                    "description": "Desc 1",
                    "cost": 25000000,
                    "priority": "MUST_HAVE",
                    "expected_kpi": "Testing"
                }
            ]
        }
    ]
}

mock_cfo_decision = {
    "target_cuts": ["Act 1"],
    "feedback_to_planner": "Chi phí cao quá, đề nghị cắt giảm."
}

@patch('workflow_graph.get_relevant_guidelines', return_value="")
@patch('workflow_graph.safe_invoke_chain')
def test_workflow_graph_fast_convergence(mock_invoke, mock_rag):
    """
    Kịch bản 1 (Hội tụ nhanh): Mock Creative trả về kế hoạch 15tr, budget 20tr.
    Assert rằng graph chỉ chạy đúng 1 vòng và is_approved == True.
    """
    # Vì actual total cost <= budget, workflow_graph sẽ TỰ ĐỘNG bỏ qua việc gọi CFO chain
    # Do đó safe_invoke_chain chỉ được gọi 1 lần bởi planner_chain
    mock_invoke.return_value = mock_cheap_plan
    
    initial_state = {
        "goal": "Test Convergence Goal",
        "budget": 20000000,
        "feedback": "Chưa có",
        "company_guidelines": "",
        "previous_plan": None,
        "current_plan": None,
        "cfo_decision": None,
        "actual_total_cost": 0,
        "over_budget": 0,
        "iteration_count": 0,
        "is_approved": False,
        "needs_human_intervention": False,
        "customer_round": 0,
        "satisfaction_threshold": 70,
        "max_customer_rounds": 3,
        "customer_feedback": "",
        "rule_score": 0,
        "client_self_score": 0,
        "final_score": 0,
    }

    final_state = strategy_app.invoke(initial_state)

    assert final_state["is_approved"] is True
    assert final_state["iteration_count"] == 1
    assert final_state["needs_human_intervention"] is False
    assert final_state["actual_total_cost"] == 15000000
    assert mock_invoke.call_count == 2


@patch('workflow_graph.get_relevant_guidelines', return_value="")
@patch('workflow_graph.safe_invoke_chain')
def test_workflow_graph_infinite_loop_protection(mock_invoke, mock_rag):
    """
    Kịch bản 2 (Infinite Loop Protection): Mock CFO liên tục trả về over budget (CFO quyết định không approve).
    Assert rằng graph tự động DỪNG LẠI khi iteration_count == 3 và state có cờ needs_human_intervention == True.
    """
    # Hàm side effect để trả về plan đắt hoặc CFO feedback tùy context chain
    def side_effect_invoke(chain, inputs, validator=None):
        if "budget" in inputs and "actual_total_cost" in inputs and "master_plan" in inputs:
            # ????y l?? CFO
            return mock_cfo_decision
        if "rule_score" in inputs and "master_plan" in inputs:
            # ????y l?? Customer Reviewer
            return {
                "client_self_score": 50,
                "feedback": "Can tinh gon ke hoach.",
                "reasoning_summary": "Chua dat ky vong."
            }
        # ????y l?? Planner
        return mock_expensive_plan


    mock_invoke.side_effect = side_effect_invoke
    
    initial_state = {
        "goal": "Test Loop Goal",
        "budget": 20000000,
        "feedback": "Chưa có",
        "company_guidelines": "",
        "previous_plan": None,
        "current_plan": None,
        "cfo_decision": None,
        "actual_total_cost": 0,
        "over_budget": 0,
        "iteration_count": 0,
        "is_approved": False,
        "needs_human_intervention": False,
        "customer_round": 0,
        "satisfaction_threshold": 70,
        "max_customer_rounds": 3,
        "customer_feedback": "",
        "rule_score": 0,
        "client_self_score": 0,
        "final_score": 0,
    }

    final_state = strategy_app.invoke(initial_state)

    assert final_state["is_approved"] is False
    assert final_state["iteration_count"] == 1
    assert final_state["needs_human_intervention"] is True
    assert final_state["customer_round"] == 3
    assert final_state["actual_total_cost"] == 25000000
@patch('workflow_graph.safe_invoke_chain')
def test_customer_review_threshold_stops_loop(mock_invoke):
    mock_invoke.return_value = {
        "campaign_name": "Plan",
        "executive_summary": "Summary",
        "target_audience": "Gen Z",
        "total_estimated_cost": 10000000,
        "phases": [
            {"phase_name": "P1", "duration": "1w", "objective": "O", "phase_subtotal_cost": 10000000,
             "activities": [{"name": "A", "description": "D", "cost": 10000000, "priority": "MUST_HAVE", "expected_kpi": "K"}]}
        ]
    }

    initial_state = {
        "goal": "Test",
        "budget": 20000000,
        "feedback": "",
        "company_guidelines": "",
        "previous_plan": None,
        "current_plan": None,
        "cfo_decision": None,
        "actual_total_cost": 0,
        "over_budget": 0,
        "iteration_count": 0,
        "is_approved": False,
        "needs_human_intervention": False,
        "customer_round": 0,
        "satisfaction_threshold": 60,
        "max_customer_rounds": 2
    }

    final_state = strategy_app.invoke(initial_state)
    assert final_state["is_approved"] is True
