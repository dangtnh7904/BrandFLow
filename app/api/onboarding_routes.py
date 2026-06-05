import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List
from app.services.document_processor import DocumentIngestor
from app.agents.intake.intake_agent import extract_document_summary
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/onboarding", tags=["Onboarding"])

class UploadUrlRequest(BaseModel):
    url: str
    tenant_id: str = "default"

@router.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    tenant_id: str = Form("default")
):
    """
    Nhận file từ giao diện Onboarding (Screen 1), parse text bằng DocumentIngestor,
    sau đó dùng Agent 0 để phân tích (extract_document_summary).
    """
    try:
        # 1. Lưu file tạm thời & parse text
        raw_text_chunks = []
        ingestor = DocumentIngestor(tenant_id=tenant_id)
        
        os.makedirs("temp_uploads", exist_ok=True)
        
        for file in files:
            file_path = f"temp_uploads/{file.filename}"
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            
            # Đọc text từ file
            text = ingestor.ingest_file(file_path)
            if text:
                raw_text_chunks.append(text)
                
            # Xóa file tạm
            os.remove(file_path)
            
        combined_text = "\n\n---\n\n".join(raw_text_chunks)
        
        if not combined_text.strip():
            return {"status": "error", "message": "Không thể trích xuất nội dung từ các file này."}
            
        # 2. Phân tích nội dung qua LLM
        analysis_result = extract_document_summary(combined_text)
        
        # 3. Trả về kết quả
        return {
            "status": "success",
            "extracted_answers": analysis_result,
            "completeness": 80 # Tạm thời mock completeness
        }
    except Exception as e:
        print(f"[Upload Error]: {e}")
        return {"status": "error", "message": str(e)}

@router.post("/upload-url")
async def upload_url(request: UploadUrlRequest):
    """
    Nhận URL từ giao diện Onboarding (Screen 1), parse text bằng DocumentIngestor,
    sau đó phân tích tương tự upload_files.
    """
    try:
        ingestor = DocumentIngestor(tenant_id=request.tenant_id)
        text = ingestor.ingest_url(request.url)
        
        if not text.strip():
            return {"status": "error", "message": "Không thể trích xuất nội dung từ URL này."}
            
        analysis_result = extract_document_summary(text)
        
        return {
            "status": "success",
            "extracted_answers": analysis_result,
            "completeness": 80
        }
    except Exception as e:
        print(f"[Upload URL Error]: {e}")
        return {"status": "error", "message": str(e)}
