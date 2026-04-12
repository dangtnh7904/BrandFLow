from fastapi import APIRouter, HTTPException
from app.schemas.schemas import DesignGenerateRequest, DesignReviseRequest
from app.agents.design.design_agent import BrandDesigner

router = APIRouter(
    prefix="/api/v1/design",
    tags=["Design"]
)

@router.post("/generate-prompts")
async def generate_design_prompts(request: DesignGenerateRequest):
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
async def generate_design_assets(request: DesignGenerateRequest):
    """
    API gọi DALL-E 3 để sinh ảnh Logo, Banner, Fanpage Avatar từ Brand DNA.
    """
    designer = BrandDesigner()
    result = await designer.generate_final_assets(request)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result

@router.post("/revise-assets")
async def revise_design_assets(request: DesignReviseRequest):
    """
    API nhận feedback của khách hàng và gọi DALL-E sửa đổi thiết kế.
    """
    designer = BrandDesigner()
    result = await designer.revise_final_assets(request)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
        
    return result
