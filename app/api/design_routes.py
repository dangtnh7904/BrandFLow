from fastapi import APIRouter, HTTPException, Depends
from app.schemas.schemas import DesignGenerateRequest, DesignReviseRequest
from app.agents.design.design_agent import BrandDesigner
from app.api.auth_routes import get_current_user

router = APIRouter(
    prefix="/api/v1/design",
    tags=["Design"]
)

@router.post("/generate-prompts")
async def generate_design_prompts(request: DesignGenerateRequest, user_id: str = Depends(get_current_user)):
    """
    API biên dịch Brand DNA thành hệ quy chiếu thiết kế và sinh Prompt vẽ ảnh.
    Trọng tâm: Sử dụng LLM để giải mã yêu cầu, kết hợp các quy tắc loại trừ (Guardrails).
    HIỆN TẠI CHỈ XUẤT PROMPT. Chưa tích hợp AI vẽ ảnh (DALL-E/Midjourney).
    """
    designer = BrandDesigner()
    result = designer.generate_design_prompts(request)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result

@router.post("/generate-assets")
async def generate_design_assets(request: DesignGenerateRequest, user_id: str = Depends(get_current_user)):
    """
    API gọi DALL-E 3 để sinh ảnh Logo, Banner, Fanpage Avatar từ Brand DNA.
    """
    designer = BrandDesigner()
    result = await designer.generate_final_assets(request)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result

@router.post("/revise-assets")
async def revise_design_assets(request: DesignReviseRequest, user_id: str = Depends(get_current_user)):
    """
    API nhận feedback của khách hàng và gọi DALL-E sửa đổi thiết kế.
    """
    designer = BrandDesigner()
    result = await designer.revise_final_assets(request)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result

# =========================================================================
# BEHANCE CASE STUDY ENGINE (BLOCK-LEVEL RAG & REVISION)
# =========================================================================

from app.schemas.schemas import ReviseBlockRequest

@router.post("/generate-case-study")
async def generate_case_study(request: DesignGenerateRequest, user_id: str = Depends(get_current_user)):
    """
    API biên dịch Brand DNA thành danh sách các Block JSON theo cấu trúc Behance Layout.
    """
    designer = BrandDesigner()
    result = designer.generate_behance_layout(request)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result

@router.post("/revise-block")
async def revise_block(request: ReviseBlockRequest, user_id: str = Depends(get_current_user)):
    """
    API nhận feedback cục bộ cho một block và cập nhật lại thông số của block đó.
    """
    designer = BrandDesigner()
    result = designer.revise_block(request)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result


# =========================================================================
# BRAND DECK BUILDER — AI Slide Generator & PPTX Export
# =========================================================================

from pydantic import BaseModel as PydanticBaseModel
from typing import List

class GenerateSlidesRequest(PydanticBaseModel):
    template_type: str = "brand_guideline"
    brand_name: str = ""
    goal: str = ""
    industry: str = ""
    core_usps: List[str] = []
    target_audience: str = ""
    tone_of_voice: str = ""
    brand_dna: dict = None
    business_context: dict = None

class ExportPptxRequest(PydanticBaseModel):
    slides: list
    brand_name: str = "Brand"

@router.post("/generate-slides")
async def generate_slides(request: GenerateSlidesRequest, user_id: str = Depends(get_current_user)):
    """
    AI sinh slide deck từ Brand DNA.
    Hỗ trợ: brand_guideline, pitch_deck, proposal.
    """
    from app.agents.design.slide_generator import SlideGenerator
    
    generator = SlideGenerator()
    
    brand_dna = request.brand_dna or {
        "brand_name": request.brand_name,
        "positioning": request.goal,
        "tone_of_voice": request.tone_of_voice,
        "core_usps": request.core_usps,
    }
    
    business_context = request.business_context or {
        "company_name": request.brand_name,
        "industry": request.industry,
        "goal": request.goal,
        "target_audience": request.target_audience,
    }
    
    result = generator.generate_slides(
        template_type=request.template_type,
        brand_dna=brand_dna,
        business_context=business_context,
    )
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
    
    return result


@router.post("/export-pptx")
async def export_pptx(request: ExportPptxRequest, user_id: str = Depends(get_current_user)):
    """
    Export slide JSON array to PPTX file for download.
    """
    from app.agents.design.slide_generator import export_slides_to_pptx
    from fastapi.responses import StreamingResponse
    
    try:
        buffer = export_slides_to_pptx(request.slides, request.brand_name)
        
        filename = f"BrandDeck_{request.brand_name.replace(' ', '_')}.pptx"
        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PPTX export failed: {str(e)}")

