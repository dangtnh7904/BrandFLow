from fastapi import APIRouter, HTTPException, Depends
from app.agents.research.market_agent import MarketAgent
from app.schemas.schemas import ExtractDNARequest, MarketResearchRequest
from app.services.memory_rag import extract_unified_dna
from app.api.auth_routes import get_current_user

router = APIRouter(prefix="/api/v1/research", tags=["Market Research"])

@router.post("/market")
async def get_market_research(request: MarketResearchRequest, user_id: str = Depends(get_current_user)):
    """
    Trigger the MarketAgent to perform real-time research based on the industry and Brand DNA.
    """
    if not request.industry:
        raise HTTPException(status_code=400, detail="Industry is required")
        
    agent = MarketAgent()
    result = await agent.run_research(request.industry, request.brand_dna)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result.get("data")

@router.post("/extract-dna")
async def extract_brand_dna(request: ExtractDNARequest):
    """
    Extract Brand DNA and Design DNA from combined Form and Document inputs.
    Allows anonymous access so the frontend mock can trigger without login.
    """
    try:
        result = extract_unified_dna(
            form_data=request.form_data,
            document_content=request.document_content,
            tenant_id=request.tenant_id
        )
        if result.get("status") == "error":
            raise HTTPException(status_code=500, detail=result.get("message"))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
