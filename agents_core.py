"""
=============================================================================
BrandFlow Strategy Engine - agents_core.py (v6 — Non-Convergence Fix)
=============================================================================
Hệ thống Multi-Agent stateless chạy 100% Local bằng Ollama.

Thay đổi v6 (Ép hội tụ):
  - MasterPlanner nhận thêm `previous_plan`, `actual_total_cost` và bị cấm 
    viết mới hoàn toàn nếu đang sửa lỗi dôi ngân sách.
  - CFO KHÔNG CÒN phải làm toán. Output schema của CFO được tối giản lại, 
    chỉ còn `target_cuts` và `feedback_to_planner`.
=============================================================================
"""

import json
from typing import List, Literal

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.exceptions import OutputParserException
from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_fixed

# =============================================================================
# 1. PYDANTIC SCHEMAS — v6: Tối giản CFO, ép MasterPlanner chặt hơn
# =============================================================================

class ExecutiveSummary(BaseModel):
    campaign_name: str
    campaign_summary: str
    core_objectives: str
    total_budget_vnd: int

class TargetAudienceAndBrandVoice(BaseModel):
    target_audience: str
    brand_voice: str

class PhasedExecution(BaseModel):
    phase_id: str
    phase_name: str
    duration: str

class Activity(BaseModel):
    activity_name: str
    description: str
    cost_vnd: int
    kpi_commitment: str
    moscow_tag: Literal["MUST_HAVE", "SHOULD_HAVE", "COULD_HAVE"]

class ActivityAndFinancialBreakdown(BaseModel):
    phase_id: str
    activities: List[Activity]

class MasterPlanOutput(BaseModel):
    executive_summary: ExecutiveSummary
    target_audience_and_brand_voice: TargetAudienceAndBrandVoice
    phased_execution: List[PhasedExecution]
    activity_and_financial_breakdown: List[ActivityAndFinancialBreakdown]


class CFODecision(BaseModel):
    """(v6) Lược bỏ is_approved và total_cost_calculated vì Python tự tính."""
    target_cuts: List[str] = Field(
        default=[],
        description="Danh sách TÊN CỤ THỂ các hoạt động (thuộc phase nào) cần cắt giảm hoặc giảm chi phí"
    )
    feedback_to_planner: str = Field(
        description="Phản hồi chi tiết: yêu cầu cắt giảm hạng mục nào, thuộc Phase nào, để giảm bao nhiêu tiền."
    )


class CustomerReview(BaseModel):
    client_self_score: int = Field(description="Customer self score (1-100)")
    feedback: str = Field(description="Customer feedback details")
    reasoning_summary: str = Field(description="Short reasoning summary")


# =============================================================================
# 2. OUTPUT PARSERS
# =============================================================================

planner_parser = JsonOutputParser(pydantic_object=MasterPlanOutput)
cfo_parser = JsonOutputParser(pydantic_object=CFODecision)
customer_parser = JsonOutputParser(pydantic_object=CustomerReview)


# =============================================================================
# 3. SYSTEM PROMPTS — v6: Edit-Only & Python Math integration
# =============================================================================

JSON_ENFORCEMENT = (
    "CHỈ TRẢ VỀ CHUỖI JSON HỢP LỆ. KHÔNG CÓ BẤT KỲ VĂN BẢN NÀO BÊN NGOÀI. "
    "QUAN TRỌNG: Tất cả các con số (tiền tệ, cost, budget) PHẢI là SỐ NGUYÊN (Integer) THUẦN TÚY. "
    "Ví dụ: 15000000 chứ KHÔNG PHẢI 15.000.000 hay 15,000,000."
)

# ---- Master Planner Prompt ----
planner_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """Role: Bạn là một Giám đốc Marketing (CMO) cấp C-level tại một Agency hàng đầu. Trách nhiệm của bạn là lập Báo cáo Chiến lược (Executive Report) cho doanh nghiệp.

CRITICAL RULES (LUẬT SỐNG CÒN BẮT BUỘC TUÂN THỦ):
1. GIỌNG VĂN: Chuyên nghiệp, sắc bén. Không dùng từ ngữ sáo rỗng.
2. TỪ ĐIỂN KPI NGÀNH BẮT BUỘC (Phải áp dụng đúng ngành của khách hàng vào trường 'kpi_commitment'):
   - Ngành F&B: Footfall (Lượng khách đến quán), CPA (Cost per Action/Voucher), AOV (Giá trị trung bình đơn), Tỷ lệ quay lại (Retention Rate).
   - Ngành Mỹ phẩm/Làm đẹp: CPL (Cost per Lead), ROAS (Return on Ad Spend), CVR% (Tỷ lệ chuyển đổi dùng thử), Lượng UGC (User-Generated Content).
   - Ngành Công nghệ/B2B: MQL (Marketing Qualified Lead), Demo Booking Rate (Tỷ lệ đặt lịch), CAC (Chi phí thu thập khách hàng), CPA (Chi phí mỗi người dự sự kiện).
   - Ngành General (Chưa xác định): Tập trung vào Sales, Conversion Rate, và Brand Awareness reach.
3. LUẬT TÀI CHÍNH (DÀNH CHO CFO KIỂM DUYỆT): 
   - Tổng chi phí (cost_vnd) của tất cả hoạt động phải CỐ TÌNH vượt ngân sách được giao khoảng 10% - 20%. Bạn CHỈ ĐƯỢC PHÉP cố tình vượt ngân sách nếu đây là LẦN LẬP KẾ HOẠCH ĐẦU TIÊN (khi previous_plan là "Không có").
   - Để làm được điều này, hãy tạo ra 1-2 hạng mục mồi nhử mang tính chất "Nice-to-have" (Ví dụ: Tặng quà đắt tiền, Thuê KOL lớn) và GẮN NHÃN 'moscow_tag' LÀ "COULD_HAVE". 
   - Các hoạt động cốt lõi mang lại doanh thu phải gắn nhãn "MUST_HAVE" và "SHOULD_HAVE".
4. QUY TRÌNH HỒI TƯỞNG VÀ CHỈNH SỬA:
   - KHI SỬA KẾ HOẠCH DO BỊ CFO TỪ CHỐI (vì vượt ngân sách quá lớn): BẠN CHỈ ĐƯỢC PHÉP CHỈNH SỬA bản nháp cũ (giảm tiền, xóa hoặc tắt hạng mục COULD_HAVE) DỰA THEO YÊU CẦU CỦA CFO. 
   - Ở vòng lặp chỉnh sửa, BẮT BUỘC phải làm cho `total_budget_vnd` TỪ BẰNG ĐẾN NHỎ HƠN ngân sách ban đầu, KHÔNG THÊM HẠNG MỤC MỚI, KHÔNG cố tình vượt ngân sách nữa.
   
HƯỚNG DẪN TỪ BỘ NHỚ CÔNG TY:
{company_guidelines}

BẮT BUỘC TRẢ VỀ CHUỖI JSON HỢP LỆ, KHÔNG VĂN BẢN THỪA.

{format_instructions}"""
    ),
    (
        "human",
        """Context:
- Ngành hàng (Industry): {industry}
- Mục tiêu (Goal): {goal}
- Ngân sách tối đa (Budget): {budget} VNĐ
- Khách hàng mục tiêu: {target_audience}
- Ràng buộc/Lưu ý (Constraints): {constraints}

TỔNG CHI PHÍ THỰC TẾ CỦA BẢN NHÁP TRƯỚC ĐÓ: {actual_total_cost} VND (Vượt ngân sách: {over_budget} VND).

Feedback YÊU CẦU CẮT GIẢM từ CFO: {feedback}

BẢN NHÁP TRƯỚC ĐÓ CỦA BẠN (previous_plan):
{previous_plan}

NẾU previous_plan là "Không có", hãy lập một bản Kế hoạch Marketing cực kỳ thực dụng, data-driven và bám sát phương pháp MoSCoW. Nhớ TỰ ĐỘNG THÊM 10-20% NGÂN SÁCH ẢO bằng các hạng mục COULD_HAVE.
NẾU CÓ previous_plan, HÃY CẮT GIẢM/SỬA TRÊN ĐÓ THEO ĐÚNG Ý CFO ĐỂ TỔNG CHI PHÍ BẰNG HOẶC NHỎ HƠN NGÂN SÁCH {budget} VNĐ. TUYỆT ĐỐI KHÔNG VƯỢT NGÂN SÁCH NỮA."""
    ),
])

# ---- CFO Agent Prompt ----
cfo_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """Bạn là CFO (Giám đốc Tài chính) của công ty.
Nhiệm vụ: Chỉ định CẮT GIẢM ngân sách cho Master Plan khi bị dôi chi phí. (Bạn không cần làm toán, hệ thống Python đã tính số liệu sẵn cho bạn).

NGUYÊN TẮC CẮT GIẢM THÔNG MINH:
- BƯỚC 1: Chỉ định cắt bỏ các hạng mục có priority = "COULD_HAVE" trước (Ghi rõ ở Phase nào).
- BƯỚC 2: Nếu chưa đủ, chỉ định giảm QUY MÔ chi phí các hạng mục "SHOULD_HAVE".
- BƯỚC 3: TUYỆT ĐỐI KHÔNG yêu cầu cắt bỏ các hạng mục "MUST_HAVE".

CÁCH VIẾT feedback_to_planner:
- Ghi rõ: Cần cắt/giảm hạng mục nào, thuộc Phase nào.
- Ví dụ: "Yêu cầu xóa 'Sản xuất Video' (COULD_HAVE) ở Phase 1. Giảm ngân sách 'Booking KOL' ở Phase 2 xuống còn 8,000,000 VND."

""" + JSON_ENFORCEMENT + """

{format_instructions}"""
    ),
    (
        "human",
        """Ngân sách được duyệt: {budget} VND
Tổng chi phí thực tế (do hệ thống máy tính tự cộng): {actual_total_cost} VND
Vượt ngân sách     : {over_budget} VND

Kế hoạch tổng thể (Master Plan):
{master_plan}

Đang bị vượt ngân sách, hãy chỉ định cắt giảm các hoạt động ngay lập tức."""
    ),
])

# ---- Customer Reviewer Prompt ----
customer_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are the customer reviewing the marketing plan. Score satisfaction from 1-100.\n"
        "Consider: activity/KPI clarity, feasibility vs budget, strategic coherence, target fit, brand fit.\n"
        "Provide clear feedback for improvements. Return JSON only."
        + JSON_ENFORCEMENT + "\n\n{format_instructions}"
    ),
    (
        "human",
        "Budget: {budget}\n\nBrand guidelines:\n{company_guidelines}\n\nRule score (Python): {rule_score}\n\nPlan:\n{master_plan}"
    ),
])


# =============================================================================
# 4. LLM INITIALIZATION
# =============================================================================

def get_llm(temperature: float = 0.5) -> ChatOllama:
    return ChatOllama(
        model="llama3.2",
        temperature=temperature,
        format="json",
    )


# =============================================================================
# 5. LCEL CHAINS
# =============================================================================

def build_planner_chain():
    # Giảm temperature xuống 0.2 để Planner tập trung tuân lệnh thay vì sáng tạo lung tung khi đang bị ép giảm ngân sách
    llm = get_llm(temperature=0.2) 
    prompt_with_format = planner_prompt.partial(
        format_instructions=planner_parser.get_format_instructions()
    )
    return prompt_with_format | llm | planner_parser


def build_cfo_chain():
    llm = get_llm(temperature=0.0)
    prompt_with_format = cfo_prompt.partial(
        format_instructions=cfo_parser.get_format_instructions()
    )
    return prompt_with_format | llm | cfo_parser


def build_customer_chain():
    llm = get_llm(temperature=0.2)
    prompt_with_format = customer_prompt.partial(
        format_instructions=customer_parser.get_format_instructions()
    )
    return prompt_with_format | llm | customer_parser


# =============================================================================
# 6. FAULT-TOLERANT EXECUTION
# =============================================================================

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def safe_invoke_chain(chain, inputs: dict, validator=None):
    try:
        result = chain.invoke(inputs)
        if validator:
            validator(result)
        return result
    except OutputParserException as e:
        print(f"\n   ⚠️ [Retry] Ollama xuất JSON lỗi, đang tự động thử lại... ({e.__class__.__name__})")
        raise e
    except Exception as e:
        print(f"\n   🔴 [Lỗi Invoke/Validation] {e}. Đang thử lại...")
        raise e

if __name__ == "__main__":
    print("File agents_core.py v6 — Non-Convergence Fixed")
