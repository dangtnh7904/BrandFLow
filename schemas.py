from pydantic import BaseModel, Field
from typing import Dict, Optional

class PresetRequest(BaseModel):
    industry: str = Field(..., description="Tên ngành nghề, ví dụ: 'F&B', 'Spa_Beauty', 'B2B_Tech'")

class InterviewRequest(BaseModel):
    answers: Dict[str, str] = Field(..., description="Từ điển chứa cặp Câu hỏi và Câu trả lời phỏng vấn")

class RawInputRequest(BaseModel):
    raw_text: str = Field(..., description="Ngôn ngữ tự nhiên từ người dùng")
    budget: Optional[int] = Field(None, description="Ngân sách cố định do người dùng nhập (VND)")

class RefineRequest(BaseModel):
    previous_plan: dict = Field(..., description="Kế hoạch cũ dạng JSON")
    budget: int = Field(..., description="Ngân sách (để kiểm duyệt lại)")
    feedback: str = Field(..., description="Yêu cầu thay đổi từ CEO")


class OrchestrationMockRequest(BaseModel):
    goal: str = Field(..., description="Mục tiêu chiến dịch")
    industry: str = Field("General", description="Ngành nghề")
    budget: int = Field(0, ge=0, description="Ngân sách kỳ vọng (VND)")
    target_audience: str = Field("", description="Tệp khách hàng mục tiêu")
    constraints: str = Field("", description="Ràng buộc đặc biệt")

    tier: str = Field("FREE", description="Tier người dùng: FREE/PLUS/PRO")
    user_id: str = Field("anonymous", description="Định danh người dùng cho quota")

    files_count: int = Field(0, ge=0, description="Số file gửi trong request")
    file_size_mb: float = Field(0, ge=0, description="Dung lượng lớn nhất của 1 file (MB)")
    urls_count: int = Field(0, ge=0, description="Số URL gửi trong request")

    mock_mode: bool = Field(True, description="Tuần 1 chạy deterministic mock flow")
