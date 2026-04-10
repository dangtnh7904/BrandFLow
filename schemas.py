from pydantic import BaseModel, Field
from typing import Dict, Optional, Literal, Any

class PresetRequest(BaseModel):
    industry: str = Field(..., description="Tên ngành nghề, ví dụ: 'F&B', 'Spa_Beauty', 'B2B_Tech'")

class InterviewRequest(BaseModel):
    answers: Dict[str, str] = Field(..., description="Từ điển chứa cặp Câu hỏi và Câu trả lời phỏng vấn")

class RawInputRequest(BaseModel):
    raw_text: str = Field(..., description="Ngôn ngữ tự nhiên từ người dùng")
    budget: Optional[int] = Field(None, description="Ngân sách cố định do người dùng nhập (VND)")
    comprehensive_form: Optional[Dict[str, Any]] = Field(None, description="Dữ liệu form trắc nghiệm")
    tenant_id: str = Field("default", description="Mã định danh phiên làm việc của người dùng")

class RefineRequest(BaseModel):
    previous_plan: dict = Field(..., description="Kế hoạch cũ dạng JSON")
    budget: int = Field(..., description="Ngân sách (để kiểm duyệt lại)")
    feedback: str = Field(..., description="Yêu cầu thay đổi từ CEO")
    tenant_id: str = Field("default", description="Mã định danh phiên làm việc của người dùng")

class MicroExecuteRequest(BaseModel):
    brand_dna: str = Field(..., description="Master Brand DNA")
    usp: str = Field(..., description="Master Brand USP")
    persona_prompt: str = Field(..., description="Target Persona Prompt")
    command: str = Field(..., description="Lệnh viết content (VD: Viết bài FB)")


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


class PlanWizardRequest(BaseModel):
    user_id: str = Field("anonymous", description="Định danh người dùng")
    tier: str = Field("FREE", description="Tier người dùng: FREE/PLUS/PRO")

    goal: str = Field(..., min_length=3, description="Mục tiêu chiến dịch")
    industry: str = Field("General", description="Ngành nghề")
    budget: int = Field(0, ge=0, description="Ngân sách kỳ vọng (VND)")
    target_audience: str = Field("", description="Tệp khách hàng mục tiêu")
    constraints: str = Field("", description="Ràng buộc đặc biệt")

    route_preference: Literal["fast-track", "balanced", "deep-analysis"] = Field(
        "balanced",
        description="Ưu tiên route ban đầu của user",
    )
    risk_level: Literal["low", "medium", "high"] = Field(
        "medium",
        description="Mức rủi ro user chấp nhận",
    )
    output_format: Literal["json", "markdown", "pdf_bundle"] = Field(
        "json",
        description="Định dạng đầu ra mong muốn",
    )
    human_review_required: bool = Field(
        False,
        description="Có yêu cầu review thủ công trước khi chốt output không",
    )


class PlanIntent(BaseModel):
    plan_hash: str = Field(..., description="Hash cố định của plan intent")
    user_id: str = Field(..., description="Định danh user")
    tier: str = Field(..., description="Tier đã normalize")

    goal: str = Field(..., description="Mục tiêu chiến dịch")
    industry: str = Field("General", description="Ngành nghề")
    budget: int = Field(0, ge=0, description="Ngân sách")
    target_audience: str = Field("", description="Tệp khách hàng mục tiêu")
    constraints: str = Field("", description="Ràng buộc đặc biệt")

    route_decision: Literal["fast-track", "balanced", "deep-analysis"] = Field(
        "balanced",
        description="Route compiler chốt để execute",
    )
    route_reason_code: str = Field(
        "USER_ROUTE_PREFERENCE",
        description="Lý do route được chọn để trace/debug",
    )
    risk_level: Literal["low", "medium", "high"] = Field(
        "medium",
        description="Mức rủi ro từ wizard",
    )
    output_format: Literal["json", "markdown", "pdf_bundle"] = Field(
        "json",
        description="Định dạng output mong muốn",
    )
    human_review_required: bool = Field(
        False,
        description="Cờ yêu cầu review thủ công",
    )
    clarification_count: int = Field(
        0,
        ge=0,
        description="Số vòng clarification đã dùng trong run hiện tại",
    )
    question_signatures: list[str] = Field(
        default_factory=list,
        description="Danh sách câu hỏi đã hỏi để dedupe theo question_signature",
    )
    sub_agent_user_question_allowed: bool = Field(
        False,
        description="Cờ policy: sub-agent có được hỏi user trực tiếp không",
    )


class ExecutionRequest(BaseModel):
    plan_hash: str = Field(..., min_length=8, description="Hash từ wizard submit")
    user_id: str = Field("anonymous", description="Định danh người dùng")
    tier: str = Field("FREE", description="Tier user cho policy/quota")

    files_count: int = Field(0, ge=0, description="Số file trong request execute")
    file_size_mb: float = Field(0, ge=0, description="Dung lượng file lớn nhất (MB)")
    urls_count: int = Field(0, ge=0, description="Số URL trong request execute")
    clarification_answers: Dict[str, str] = Field(
        default_factory=dict,
        description="Câu trả lời bổ sung cho clarification_guard (nếu có)",
    )

    mock_mode: bool = Field(True, description="Dùng mock flow deterministic để test nhanh")

class ModuleInputData(BaseModel):
    industry: str = Field(..., description="Ngành hàng (F&B, Tech, Cosmetics, Edu, General)")
    goal: str = Field(..., description="Mục tiêu cốt lõi")
    budget: int = Field(0, description="Ngân sách thực tế (VNĐ)")
    csfs: list[str] = Field(default_factory=list, description="Yếu tố thành công then chốt (CSFs)")
    resources: str = Field("", description="Nguồn lực sẵn có")

class MasterBrandProfile(BaseModel):
    brand_dna: str
    usp: str
    target_persona_prompt: str

class StrategicBlueprint(BaseModel):
    strategic_plan_md: str
    core_message: str
    media_mix: list[str]

class TacticalCampaign(BaseModel):
    operational_plan_md: str
    touchpoints_timeline: str

class AgentFeedback(BaseModel):
    is_approved: bool
    feedback: str

class CFOTacticalFeedback(BaseModel):
    is_approved: bool
    feedback: str
    contingency_percent: float
    budget_allocations: list[dict]

