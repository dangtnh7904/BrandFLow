import json
import os
from typing import Optional, List
from pydantic import BaseModel, Field

# =============================================================================
# PYDANTIC SCHEMAS CHO GIAI ĐOẠN INTAKE (AGENT 0)
# =============================================================================
class ExecutiveBrandAudit(BaseModel):
    company_status: str = Field(description="Đánh giá tổng quan về vị thế hiện tại của doanh nghiệp lấy từ tài liệu.")
    market_opportunities: List[str] = Field(description="2-3 cơ hội lớn nhất trên thị trường.")
    critical_weaknesses: List[str] = Field(description="1-2 Điểm mù hoặc rủi ro (dùng từ ngữ tinh tế, mang tính 'khu vực cần cải thiện' thay vì chê bai).")
    trust_score: int = Field(description="Điểm sức mạnh thương hiệu (0-100) theo cảm quan từ dữ liệu.")

class VisualBrandDNA(BaseModel):
    primary_colors: List[str] = Field(description="2-3 mã màu HEX phù hợp nhất với tính cách ngành (VD: #FF0000).")
    typography_style: str = Field(description="Gợi ý kiểu chữ (VD: Minimalist Serif, Bold Sans).")
    visual_archetype: str = Field(description="Định hướng hình ảnh (VD: Tối giản, Năng động, Bí ẩn).")
    moodboard_keywords: List[str] = Field(description="3-5 từ khóa thẩm mỹ (VD: Luxury, Fast, Trust).")

class IntakeAnalysisResult(BaseModel):
    executive_brand_audit: ExecutiveBrandAudit
    visual_brand_dna: VisualBrandDNA
    company_name: str = Field(description="Tên công ty / thương hiệu.")
    industry: str = Field(description="Phân loại ngành nghề chung.")
    target_audience: str = Field(description="Tệp khách hàng mục tiêu.")
    core_usps: List[str] = Field(description="2-3 đặc điểm bán hàng độc nhất (USP).")
    tone_of_voice: str = Field(description="Giọng văn thương hiệu.")



def _resolve_groq_timeout_seconds() -> float:
    raw_value = os.getenv("BRANDFLOW_GROQ_TIMEOUT_SECONDS", "60")
    try:
        return max(1.0, float(raw_value))
    except ValueError:
        return 60.0


GROQ_TIMEOUT_SECONDS = _resolve_groq_timeout_seconds()


def _is_timeout_error(exc: Exception) -> bool:
    name = exc.__class__.__name__.lower()
    message = str(exc).lower()
    timeout_keywords = ("timeout", "timed out", "read timeout", "connect timeout")
    return "timeout" in name or any(keyword in message for keyword in timeout_keywords)


def _create_groq_client():
    from groq import Groq

    try:
        return Groq(timeout=GROQ_TIMEOUT_SECONDS)
    except TypeError:
        return Groq()


def _chat_completion_with_timeout(client, **kwargs):
    try:
        return client.chat.completions.create(timeout=GROQ_TIMEOUT_SECONDS, **kwargs)
    except TypeError:
        return client.chat.completions.create(**kwargs)

def analyze_raw_input(user_raw_text: str) -> dict:
    """
    Dùng Groq llama-3.3-70b để trích xuất dữ liệu Input chuẩn cho Module 1:
    goal, industry, budget (null nếu không có), csfs, resources.
    """
    print(f"📡 [INTAKE] Đang bóc tách yêu cầu qua Groq...")
    
    prompt = f"""Bạn là Lễ tân AI của hệ thống phần mềm BrandFlow. Nhiệm vụ của bạn là bóc tách yêu cầu khách hàng thành dữ liệu có cấu trúc JSON cho Module Input.
Hãy phân tích đoạn văn bản người dùng cung cấp và trả về MỘT JSON hợp lệ có đúng 5 trường sau:

1. "goal" (string): Mục tiêu chiến dịch truyền thông mà KH mong muốn.
2. "industry" (string): Phân loại vào 1 trong 5 ngành hàng sau: "F&B", "Tech", "Cosmetics", "Edu", "General". Nếu không rõ, trả về "General".
3. "budget" (integer hoặc null): Ngân sách cho chiến dịch (quy đổi giá trị ra VND, lấy số nguyên thuần túy, VD: 20000000). NẾU KHÔNG CÓ TRONG TEXT THÌ TRẢ VỀ null.
4. "csfs" (array of strings): Các yếu tố thành công then chốt (Critical Success Factors) được rút ra từ văn bản.
5. "resources" (string): Nguồn lực sẵn có của khách hàng (VD: "Có sẵn fanpage 100k sub, có đội ngũ quay dựng...").

Đoạn văn bản của khách hàng:
"{user_raw_text}"
"""
    
    try:
        client = _create_groq_client()
        response = _chat_completion_with_timeout(
            client,
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        parsed_data = json.loads(response.choices[0].message.content)
        return parsed_data
    except Exception as e:
        if _is_timeout_error(e):
            raise TimeoutError(
                f"Intake timeout sau {int(GROQ_TIMEOUT_SECONDS)} giay."
            ) from e
        print(f"🔴 [INTAKE] Lỗi khi xử lý qua Groq: {e}")
        return {
            "goal": user_raw_text,
            "industry": "General",
            "budget": None,
            "csfs": [],
            "resources": ""
        }

def get_industry_questionnaire(industry: str) -> dict:
    """Hardcode 4 bộ câu hỏi đặc thù ngành cho Module 1."""
    questionnaires = {
        "F&B": ["Q1: Sản phẩm đặc trưng của bạn (Signature dish) là gì?", "Q2: Khung giờ vàng khách hàng đông nhất của quán?", "Q3: Bạn có bán qua các app giao hàng (ShopeeFood, Grab) không?"],
        "Tech": ["Q1: Sản phẩm của bạn là B2B hay B2C?", "Q2: Giá trị trọn đời của khách hàng (LTV) dự kiến?", "Q3: Ứng dụng/Phần mềm của bạn giải quyết Pain-point gì lớn nhất?"],
        "Cosmetics": ["Q1: USP của sản phẩm có giấy chứng nhận/bác sĩ khuyên dùng không?", "Q2: Tỷ lệ khách quay lại mua (Retention rate) thường là bao nhiêu?", "Q3: Khách hàng mua sắm qua kênh nào nhiều nhất (Shopee, TikTok Shop, Showroom)?"],
        "Edu": ["Q1: Khóa học của bạn hướng tới độ tuổi nào?", "Q2: Điểm khác biệt của giáo trình/giảng viên là gì?", "Q3: Khách hàng thường chốt sale qua tư vấn điện thoại hay tự đăng ký trên web?"]
    }
    return questionnaires.get(industry, ["Q1: Thế mạnh cốt lõi của thương hiệu là gì?", "Q2: Khách hàng mục tiêu của bạn nằm ở phân khúc nào?", "Q3: Kênh phân phối chính của bạn?"])

def check_required_info(parsed_data: dict) -> dict:
    """
    Kiểm tra các trường bắt buộc. Nếu thiếu ngân sách -> trả về lỗi yêu cầu.
    Đồng thời lấy bảng hỏi đặc thù tương ứng.
    """
    if parsed_data.get("budget") is None or parsed_data.get("budget") < 1000000:
        return {
            "status": "clarification_needed",
            "message": "⚠️ Bạn chưa nêu rõ ngân sách dự kiến. Vui lòng quay lại và ghi rõ ngân sách (VD: 'Ngân sách 15 triệu')."
        }
        
    general_variations = ["general", "null", "none", "", "không rõ", "chưa rõ"]
    if str(parsed_data.get("industry", "")).strip().lower() in general_variations:
        parsed_data["industry"] = "F&B" # Default F&B cho Demo
        
    if not parsed_data.get("goal"):
        parsed_data["goal"] = "Chạy một chiến dịch hiệu quả để quảng bá thương hiệu"
        
    parsed_data["questionnaire"] = get_industry_questionnaire(parsed_data["industry"])
        
    return {
        "status": "ready",
        "data": parsed_data
    }

def extract_document_summary(raw_text: str) -> dict:
    """
    Dùng Agent 0 (Llama-3.3-70b) để Audit tài liệu doanh nghiệp.
    """
    from langchain_groq import ChatGroq
    
    print(f"\n{'═' * 70}")
    print(f"👑 [AGENT 0 — EXECUTIVE AUDITOR] Đang thẩm định dữ liệu doanh nghiệp...")
    print(f"{'═' * 70}")
    
    prompt = f"""Bạn là Cố vấn Thương hiệu Cấp cao (Executive Auditor).
Nhiệm vụ của bạn là đọc tài liệu nội bộ sau để Đánh giá Mức độ Trưởng thành của Doanh nghiệp bằng lăng kính chuyên gia (PESTLE & Porter's Five Forces).

QUY TẮC QUAN TRỌNG:
1. Ở phần 'critical_weaknesses', NGHIÊM CẤM dùng từ ngữ hạ thấp. PHẢI dùng ngôn ngữ ngoại giao, tinh tế (VD: "Chưa tối ưu hóa độ phủ", "Còn dư địa để mở rộng").
2. Dựa vào mô tả, hãy tự suy luận ra một bộ Visual Brand DNA (mã màu HEX, kiểu chữ) để làm định hướng thiết kế UI/UX sau này.
3. NO FLUFF: Trả về các phân tích siêu ngắn gọn, đi thẳng vào trọng tâm, tuyệt đối không viết dài dòng.

Tài liệu:
"{raw_text[:20000]}"
"""
    
    try:
        api_key = os.getenv("GROQ_API_KEY")
        # Sử dụng model mạnh để tư duy Audit
        llm_orchestrator = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2, api_key=api_key, max_retries=2)
        # Khóa Output bằng Pydantic Struct để không bao giờ lỗi JSON
        structured_llm = llm_orchestrator.with_structured_output(IntakeAnalysisResult)
        
        result_obj = structured_llm.invoke(prompt)
        print(f"   ✅ Agent 0 đã trích xuất DNA cho: {result_obj.company_name}")
        
        # Format trả về tương thích với Client
        return result_obj.model_dump()
        
    except Exception as e:
        print(f"🔴 [DOCUMENT AUDIT] Lỗi trích xuất qua Agent 0: {e}")
        # Fallback an toàn nếu model sập
        return {
            "executive_brand_audit": {
                "company_status": "Dữ liệu đang được cập nhật...",
                "market_opportunities": ["Đang phân tích"],
                "critical_weaknesses": ["Cần tối ưu hóa quy trình"],
                "trust_score": 50
            },
            "visual_brand_dna": {
                "primary_colors": ["#10B981", "#0F172A"],
                "typography_style": "Modern Sans",
                "visual_archetype": "Chuyên nghiệp",
                "moodboard_keywords": ["Trust", "Clean"]
            },
            "company_name": "Không trích xuất được",
            "industry": "General",
            "target_audience": "Không rõ",
            "core_usps": [],
            "tone_of_voice": "Chưa xác định"
        }
