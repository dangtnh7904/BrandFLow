import pytest
from pydantic import ValidationError
from app.schemas.schemas import CustomerReviewerOutput as CustomerReview


def test_customer_review_requires_score():
    with pytest.raises(ValidationError):
        CustomerReview(feedback="Missing score")
