import json
import os
from typing import Optional


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
    Dùng Groq llama-3.3-70b để trích xuất 5 trường dữ liệu từ text:
    goal, industry, budget (null nếu không có), target_audience, special_constraints.
    """
    print(f"📡 [INTAKE] Đang bóc tách yêu cầu qua Groq...")
    
    prompt = f"""Bạn là Lễ tân AI của hệ thống phần mềm BrandFlow. Nhiệm vụ của bạn là bóc tách yêu cầu khách hàng thành dữ liệu có cấu trúc JSON.
Hãy phân tích đoạn văn bản người dùng cung cấp và trả về MỘT JSON hợp lệ có đúng 5 trường sau:

1. "goal" (string): Mục tiêu chiến dịch truyền thông mà KH mong muốn.
2. "industry" (string): Ngành hàng khách đang kinh doanh (VD: F&B, Mỹ phẩm...). Nếu không rõ, trả về "General".
3. "budget" (integer hoặc null): Ngân sách cho chiến dịch (quy đổi giá trị ra VND, lấy số nguyên thuần túy, VD: 20000000). QUAN TRỌNG: TUYỆT ĐỐI KHÔNG TỰ ĐỘNG GÁN NGÂN SÁCH MẶC ĐỊNH. NẾU KHÔNG CÓ TRONG TEXT THÌ TRẢ VỀ null.
4. "target_audience" (string): Tệp khách hàng mục tiêu nếu có, hoặc rỗng.
5. "special_constraints" (string): Ràng buộc hoặc yêu cầu bổ sung.

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
            "target_audience": "",
            "special_constraints": ""
        }

def check_required_info(parsed_data: dict) -> dict:
    """
    Kiểm tra các trường bắt buộc. Nếu thiếu ngân sách -> trả về lỗi yêu cầu.
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
        
    return {
        "status": "ready",
        "data": parsed_data
    }

def extract_document_summary(raw_text: str) -> dict:
    """
    Dùng Groq llama-3.3-70b để tóm tắt các thông tin cốt lõi từ tài liệu doanh nghiệp.
    """
    print(f"📄 [DOCUMENT] Đang phân tích tài liệu qua Groq...")
    
    prompt = f"""Bạn là AI phân tích tài liệu chuyên nghiệp. Hãy đọc tài liệu sau và trích xuất thông tin JSON:
1. "company_name" (string)
2. "industry" (string)
3. "target_audience" (string)
4. "core_usps" (list of strings)
5. "tone_of_voice" (string)
6. "key_products" (list of strings)

Đoạn tài liệu trích xuất:
"{raw_text[:20000]}"
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
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        if _is_timeout_error(e):
            raise TimeoutError(
                f"Document extraction timeout sau {int(GROQ_TIMEOUT_SECONDS)} giay."
            ) from e
        print(f"🔴 [DOCUMENT] Lỗi trích xuất qua Groq: {e}")
        return {
            "company_name": "Không trích xuất được",
            "industry": "Không rõ",
            "target_audience": "Không rõ",
            "core_usps": [],
            "tone_of_voice": "Không rõ",
            "key_products": []
        }
