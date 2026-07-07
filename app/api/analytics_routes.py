from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from app.api.auth_routes import get_current_user
from app.agents.analytics.media_buyer_agent import MediaBuyerAgent

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])

class CampaignDataRequest(BaseModel):
    campaign_data: Dict[str, Any]

@router.post("/media-buyer/analyze")
async def analyze_campaign_performance(request: CampaignDataRequest, user_id: str = Depends(get_current_user)):
    """
    API gửi dữ liệu quảng cáo (Impressions, Spend, Clicks, Conversions) để AI Media Buyer phân tích và đưa ra quyết định tối ưu.
    """
    agent = MediaBuyerAgent()
    result = await agent.analyze_campaign(request.campaign_data)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result

class CRMRequest(BaseModel):
    brand_dna: Dict[str, Any]
    financial_data: Dict[str, Any]

@router.post("/crm/generate-strategy")
async def generate_crm_strategy(request: CRMRequest, user_id: str = Depends(get_current_user)):
    """
    API thiết kế kịch bản chăm sóc khách hàng (Zalo, Email) và Loyalty Program.
    """
    from app.agents.analytics.crm_agent import CRMAgent
    agent = CRMAgent()
    result = await agent.generate_crm_strategy(request.brand_dna, request.financial_data)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result

