import pytest
from pydantic import ValidationError
from app.agents.planner.agents_core import MasterPlanOutput
from app.workflows.workflow_graph import calculate_actual_cost

def test_calculate_actual_cost_over_budget():
    """
    Test 1: Mô phỏng hành vi tính toán 'actual_total_cost' khi 
    kế hoạch (MasterPlanOutput JSON) vượt quá ngân sách giả định.
    """
    # Ngân sách (budget) giả định: 20,000,000
    # Kế hoạch AI sinh ra có tổng chi phí các hoạt động là 25,000,000
    mock_plan_dict = {
        "campaign_name": "Test Campaign",
        "executive_summary": "Test Summary",
        "target_audience": "Test Audience",
        "total_estimated_cost": 20000000,  # AI ảo tưởng chỉ hết 20tr
        "phases": [
            {
                "phase_name": "Phase 1",
                "duration": "1 week",
                "objective": "Testing",
                "phase_subtotal_cost": 20000000,
                "activities": [
                    {
                        "name": "Activity 1",
                        "description": "Desc 1",
                        "cost": 15000000,
                        "priority": "MUST_HAVE",
                        "expected_kpi": "KPI 1"
                    },
                    {
                        "name": "Activity 2",
                        "description": "Desc 2",
                        "cost": 10000000,
                        "priority": "COULD_HAVE",
                        "expected_kpi": "KPI 2"
                    }
                ]
            }
        ]
    }
    
    # Hàm Python phải bóc tách list activities và cộng lại cho đúng 25tr
    calculated_cost = calculate_actual_cost(mock_plan_dict)
    assert calculated_cost == 25000000, f"Expected 25,000,000 but got {calculated_cost}"

def test_pydantic_validation_missing_fields():
    """
    Test 2: Kiểm tra Pydantic schema (MasterPlanOutput) xem có ném ra lỗi (raise ValueError / ValidationError)
    nếu thiếu trường dữ liệu bắt buộc không.
    """
    mock_invalid_plan = {
        "campaign_name": "Test Campaign",
        # Thiếu executive_summary & target_audience
        "total_estimated_cost": 10000000,
        "phases": [] # Vi phạm min_length=1
    }

    with pytest.raises(ValidationError) as exc_info:
        MasterPlanOutput(**mock_invalid_plan)
    
    errors = str(exc_info.value)
    
    # Assert lỗi Pydantic liên quan đến các trường bị thiếu
    assert "executive_summary" in errors
    assert "target_audience" in errors
    assert "phases" in errors # List should have at least 1 item
