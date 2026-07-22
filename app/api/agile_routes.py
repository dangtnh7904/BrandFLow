from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.api.auth_routes import get_current_user
from app.agents.analytics.agile_agent import evaluate_agile_campaign

router = APIRouter()

class AgileEvaluateRequest(BaseModel):
    campaign_name: str
    current_kpis: Dict[str, Any]
    remaining_days: int

@router.post("/evaluate")
async def evaluate_campaign(req: AgileEvaluateRequest, user_id: str = Depends(get_current_user)):
    """
    Nhận số liệu thực tế từ chiến dịch và yêu cầu AI Agent đưa ra chiến lược xoay chuyển (Pivot).
    """
    account_profile = "STANDARD"
    if user_id:
        from app.core.database import SessionLocal
        from app.models.models import User
        try:
            db = SessionLocal()
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                account_profile = user.account_profile
        except Exception as e:
            print(f"Lỗi khi query User account_profile trong agile_routes: {e}")
        finally:
            db.close()
            
    try:
        result = evaluate_agile_campaign(
            campaign_name=req.campaign_name,
            current_kpis=req.current_kpis,
            remaining_days=req.remaining_days,
            account_profile=account_profile
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
