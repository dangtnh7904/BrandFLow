import pytest
from pydantic import ValidationError
from app.agents.planner.agents_core import CustomerReview


def test_customer_review_requires_score():
    with pytest.raises(ValidationError):
        CustomerReview(feedback="Missing score")
