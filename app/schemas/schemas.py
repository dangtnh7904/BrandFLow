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
    brand_dna: Optional[Dict[str, Any]] = Field(None, description="Brand DNA đã trích xuất")
    tenant_id: str = Field("default", description="Mã định danh phiên làm việc của người dùng")

class ExtractDNARequest(BaseModel):
    form_data: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Dữ liệu form từ người dùng")
    document_content: Optional[str] = Field("", description="Nội dung text đã trích xuất từ file hoặc link")
    tenant_id: str = Field("default", description="Mã định danh phiên làm việc")

class MarketResearchRequest(BaseModel):
    industry: str = Field(..., description="Ngành nghề")
    brand_dna: Optional[Dict[str, Any]] = Field(None, description="Brand DNA đã trích xuất")

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

# ============================================================================
# KOTLER & MCDONALD PROFESSIONAL B2B SCHEMAS (TOKEN OPTIMIZED)
# ============================================================================

class VRIO_Competency(BaseModel):
    competency: str = Field(..., description="Năng lực (VD: Bản quyền công nghệ)")
    is_vrio: bool = Field(..., description="Đạt chuẩn VRIO không?")

class CorporateObjective(BaseModel):
    financial_goals: list[str] = Field(..., max_length=2, description="2 mục tiêu tài chính (ROI, Margin)")
    marketing_goals: list[str] = Field(..., max_length=2, description="2 mục tiêu Marketing (Market Share, CAC/LTV)")

class GoalSettingPhase1(BaseModel):
    mission_statement: str = Field(..., description="Tuyên bố sứ mệnh ngắn gọn")
    core_competencies: list[VRIO_Competency] = Field(..., max_length=2)
    objectives: CorporateObjective
    red_lines: list[str] = Field(..., max_length=2, description="2 rủi ro pháp lý/tài chính cấm kỵ")

class DMU_Profile(BaseModel):
    role: Literal["Initiator", "Influencer", "Decider", "Buyer", "User"]
    pain_points: list[str] = Field(..., max_length=2)
    decision_drivers: list[str] = Field(..., max_length=2)
    opportunism_risk: str = Field(..., description="Rủi ro chuộc lợi/cảm tính (Kotler B2B)")

class ConsumerDecisionJourney(BaseModel):
    problem_recognition: str = Field(..., description="Trigger khiến họ nhận ra nhu cầu")
    information_search: str = Field(..., description="Nơi họ tìm kiếm thông tin")
    alternative_evaluation: str = Field(..., description="Tiêu chí đánh giá các lựa chọn")
    purchase_decision: str = Field(..., description="Động lực chốt sale cuối cùng")

class NeedsBasedAudience(BaseModel):
    segment_name: str
    dmu_profiles: list[DMU_Profile] = Field(..., max_length=2, description="2 roles chính trong DMU")
    decision_journey: ConsumerDecisionJourney
    value_proposition: str = Field(..., description="Benefit vs Sacrifice statement")

class DirectionalPolicyMatrix(BaseModel):
    market_attractiveness: Literal["High", "Medium", "Low"] = Field(..., description="Độ hấp dẫn của thị trường")
    business_strength: Literal["Strong", "Average", "Weak"] = Field(..., description="Sức mạnh cạnh tranh của DN")
    investment_decision: str = Field(..., description="Quyết định đầu tư (VD: Invest to grow, Manage for earnings, Divest)")

class CompetitiveBenchmark(BaseModel):
    factor_name: str = Field(..., description="CSF")
    our_score: int = Field(..., ge=1, le=10)
    industry_benchmark_score: int = Field(..., ge=1, le=10)
    weight_percentage: float

class SituationAuditPhase2(BaseModel):
    target_segments: list[NeedsBasedAudience] = Field(..., max_length=2)
    directional_policy: DirectionalPolicyMatrix
    benchmarks: list[CompetitiveBenchmark] = Field(..., max_length=3)
    tows_strategic_options: list[str] = Field(..., max_length=2, description="2 chiến lược TOWS rút ra từ Audit")

class StrategyPhase3(BaseModel):
    ansoff_matrix_choice: str = Field(..., description="Chiến lược cốt lõi Ansoff")
    competitor_defense_strategy: Literal["Position Defense", "Flank Defense", "Preemptive", "Counteroffensive", "Mobile", "Contraction"] = Field(..., description="Chiến lược phòng thủ/tấn công Kotler")
    product_lifecycle_stage: Literal["Introduction", "Growth", "Maturity", "Decline"] = Field(..., description="Vòng đời sản phẩm (PLC)")
    positioning_statement: str = Field(..., description="Tuyên bố định vị với POP và POD")
    expected_roi_justification: str = Field(..., description="Biện luận tính khả thi ROI ngắn gọn")

class Tactic7P(BaseModel):
    p_name: Literal["Product", "Price", "Place", "Promotion", "People", "Process", "Physical Evidence"]
    action_bullet: str = Field(..., description="1 hành động cốt lõi")
    kpi: str = Field(..., description="1 KPI định lượng")
    budget_vnd: int
    moscow_tag: Literal["MUST_HAVE", "SHOULD_HAVE", "COULD_HAVE"] = Field(..., description="Mức độ ưu tiên")

class Plan5W1H(BaseModel):
    why: str = Field(..., description="Tại sao thực hiện chiến lược này?")
    what: str = Field(..., description="Sản phẩm/dịch vụ cốt lõi là gì?")
    where: str = Field(..., description="Triển khai ở đâu (Kênh/Địa điểm)?")
    when: str = Field(..., description="Thời gian diễn ra?")
    who: str = Field(..., description="Ai là đối tượng mục tiêu/Người phụ trách?")
    how: str = Field(..., description="Phương pháp thực thi chính?")

class DistributionChannelStrategy(BaseModel):
    gt_strategy: str = Field(..., description="Chiến lược Kênh Truyền thống (Tạp hóa, Sỉ) - Volume và Visibility")
    mt_strategy: str = Field(..., description="Chiến lược Kênh Hiện đại (Siêu thị, CVS) - Coverage và Promotion")

class IMCPhasing(BaseModel):
    tease: str = Field(..., description="Giai đoạn gây tò mò / nhận diện")
    launch: str = Field(..., description="Giai đoạn bùng nổ / ra mắt")
    sustain: str = Field(..., description="Giai đoạn duy trì nhiệt / chuyển đổi")
    amplify: str = Field(..., description="Giai đoạn khuếch đại / tối ưu LTV")

class PushPullStrategy(BaseModel):
    push_tactics: str = Field(..., description="Trade marketing, chiết khấu đẩy hàng cho đại lý")
    pull_tactics: str = Field(..., description="Branding, quảng cáo kéo nhu cầu từ end-user")

class TacticsPhase4(BaseModel):
    tactics_7ps: list[Tactic7P] = Field(..., max_length=4, description="Chọn 4 chữ P quan trọng nhất để dồn ngân sách")
    imc_phasing: IMCPhasing
    push_pull_strategy: PushPullStrategy
    plan_5w1h: Plan5W1H
    distribution_channels: DistributionChannelStrategy
    omnichannel_crm_plan: list[str] = Field(..., max_length=2, description="2 chiến thuật Đa kênh & CRM")
    total_budget_used: int

class DownsideRiskAssessment(BaseModel):
    risk_scenario: str
    probability: int = Field(..., ge=1, le=5, description="Xác suất xảy ra (1-5)")
    impact: int = Field(..., ge=1, le=5, description="Mức độ ảnh hưởng (1-5)")
    trigger_point_metric: str = Field(..., description="VD: CPL > 500k")
    contingency_plan_b: str

class CFODefenseOutput(BaseModel):
    cfo_comment: str
    risk_assessment: list[DownsideRiskAssessment] = Field(..., max_length=2)

class MasterPlanPhase4Output(BaseModel):
    goal_setting: GoalSettingPhase1
    situation_audit: SituationAuditPhase2
    strategy: StrategyPhase3
    tactics: TacticsPhase4
    cfo_risk: CFODefenseOutput

class CustomerReviewerOutput(BaseModel):
    client_self_score: int = Field(..., ge=1, le=100, description="Điểm đánh giá cảm tính từ 1-100")
    feedback: list[str] = Field(..., description="Danh sách các điểm cần sửa đổi hoặc ép giá xuống")
    reasoning_summary: str = Field(..., description="Giải thích ngắn gọn lý do cho điểm số và feedback")


# ============================================================================
# DESIGN MODULE SCHEMAS
# ============================================================================

class VisualLanguage(BaseModel):
    primary_colors: list[str] = Field(..., description="Danh sách mã màu HEX chủ đạo")
    visual_style: str = Field(..., description="Phong cách hình học (VD: minimalist, bold, curvy, flat vector...)")
    mood: str = Field(..., description="Cảm giác thị giác tổng thể (VD: Sang trọng, công nghệ, vui nhộn...)")

class DesignGenerateRequest(BaseModel):
    brand_name: str = Field(..., description="Tên thương hiệu")
    goal: str = Field(..., description="Mục tiêu chiến dịch / thương hiệu")
    industry: str = Field(..., description="Ngành hàng của doanh nghiệp")
    target_audience: str = Field(default="", description="Tệp khách hàng mục tiêu")
    brand_dna_context: Optional[Dict[str, Any]] = Field(None, description="Brand DNA từ DB")
    
    # Backward compatibility
    core_usps: list[str] = Field(default_factory=list, description="Các USP cốt lõi")
    target_audience_insights: list[str] = Field(default_factory=list, description="Insight khách hàng mục tiêu")
    tone_of_voice: str = Field(default="", description="Giọng điệu thương hiệu")
    strict_rules: list[str] = Field(default_factory=list, description="Các điều kiêng kị / quy tắc bắt buộc")
    custom_prompt: Optional[str] = Field(default="", description="Yêu cầu thiết kế tuỳ chỉnh từ người dùng")

class DesignOutput(BaseModel):
    visual_language: VisualLanguage
    logo_prompt: str = Field(..., description="Prompt siêu chi tiết tiếng Anh để sinh Logo")
    banner_prompt: str = Field(..., description="Prompt siêu chi tiết tiếng Anh để sinh Banner / Fanpage Cover")
    fanpage_avatar_prompt: str = Field(..., description="Prompt siêu chi tiết tiếng Anh để sinh Fanpage Avatar")

# Các trường URL sẽ được backend gắn thêm sau khi DALL-E trả về.
# Nên ta có thể tạo schema mở rộng hoặc để frontend tự parse dict.

class DesignReviseRequest(BaseModel):
    original_request: DesignGenerateRequest
    original_output: DesignOutput
    user_feedback: str = Field(..., description="Yêu cầu sửa đổi từ người dùng")

# --- MỚI: BEHANCE CASE STUDY ENGINE ---

class BlockData(BaseModel):
    id: str = Field(..., description="ID định danh duy nhất của block")
    type: str = Field(..., description="Tên loại component (ví dụ: HeroBlock, PaletteBlock, etc.)")
    props: Dict[str, Any] = Field(..., description="Dữ liệu động để render Component")

class CaseStudyOutput(BaseModel):
    blocks: list[BlockData] = Field(..., description="Danh sách các block cấu thành Layout của Case Study")

class ReviseBlockRequest(BaseModel):
    target_block_id: str = Field(..., description="ID của block đang cần sửa đổi")
    current_context: BlockData = Field(..., description="Dữ liệu block hiện tại")
    user_prompt: str = Field(..., description="Câu lệnh sửa đổi từ người dùng (Comment-to-refine)")
    brand_dna_context: Optional[Dict[str, Any]] = Field(None, description="Ngữ cảnh gốc để giữ DNA chuẩn")

# ============================================================================

# BUSINESS METRICS & AI TELEMETRY SCHEMAS (AGENT 0 - REAL-TIME)
# ============================================================================

class MarketFunnelMetrics(BaseModel):
    tam: float | None = Field(None, description="Tổng nhu cầu thị trường (Total Addressable Market)")
    sam: float | None = Field(None, description="Thị trường có thể phục vụ (Serviceable Addressable Market)")
    som: float | None = Field(None, description="Thị phần thực tế có thể nắm giữ (Serviceable Obtainable Market)")
    cagr: float | None = Field(None, description="Tỷ lệ tăng trưởng kép hàng năm (%)")

class FinancialHealthMetrics(BaseModel):
    cac: float | None = Field(None, description="Chi phí để có được một khách hàng mới")
    ltv: float | None = Field(None, description="Giá trị trọn đời của một khách hàng")
    ltv_cac_ratio: float | None = Field(None, description="Tỷ lệ LTV/CAC")
    roi: float | None = Field(None, description="Tỷ lệ lợi nhuận trên tổng vốn đầu tư (%)")

class MarketPositionMetrics(BaseModel):
    market_share: float | None = Field(None, description="Thị phần của doanh nghiệp (%)")
    retention_rate: float | None = Field(None, description="Tỷ lệ khách hàng cũ quay lại (%)")
    proxy_nps: float | None = Field(None, description="Net Promoter Score giả lập từ đối thủ")

class AITelemetryMetrics(BaseModel):
    model_accuracy: float | None = Field(None, description="Độ chính xác của dự đoán mô hình")
    loss_function_trend: float | None = Field(None, description="Xu hướng giảm sai số")
    inference_latency: float | None = Field(None, description="Thời gian phản hồi thực tế (ms)")
    training_cost_per_run: float | None = Field(None, description="Chi phí tài nguyên cho mỗi lần training")
    data_acquisition_cost: float | None = Field(None, description="Chi phí thu thập dữ liệu (DAC)")
    resource_utilization: float | None = Field(None, description="Tỷ lệ sử dụng phần cứng (%)")
    retention_rate_improvement: float | None = Field(None, description="Tỷ lệ giữ chân tăng sau model update (%)")
    ltv_estimation: float | None = Field(None, description="Dự báo LTV từ AI")
    nps_correlation: float | None = Field(None, description="Tương quan độ chính xác AI và NPS")

class CombinedBusinessMetrics(BaseModel):
    market_funnel: MarketFunnelMetrics
    financial_health: FinancialHealthMetrics
    market_position: MarketPositionMetrics
    ai_telemetry: AITelemetryMetrics | None = None
