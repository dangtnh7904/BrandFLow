import json
import google.generativeai as genai
import os

def get_gemini_model():
    """
    Cấu hình và trả về model Gemini 1.5 Flash.
    Bật response_mime_type="application/json" và thiết lập temperature=0.1
    """
    # Đọc key từ tham số môi trường nếu cần, SDK tự lấy GEMINI_API_KEY
    generation_config = {
        "temperature": 0.1,
        "response_mime_type": "application/json",
    }
    
    return genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        generation_config=generation_config,
    )

def analyze_raw_input(user_raw_text: str) -> dict:
    """
    Dùng Gemini để trích xuất 5 trường dữ liệu từ text:
    goal, industry, budget (null nếu không có), target_audience, special_constraints.
    """
    model = get_gemini_model()
    
    prompt = f"""Bạn là Lễ tân AI của hệ thống phần mềm BrandFlow. Nhiệm vụ của bạn là bóc tách yêu cầu khách hàng thành dữ liệu có cấu trúc.
Hãy phân tích đoạn văn bản người dùng cung cấp và DỪNG LẠI SAU KHI TẠO ĐÚNG MỘT JSON hợp lệ. Bắt buộc JSON có đúng 5 trường sau:

1. "goal" (string): Mục tiêu chiến dịch truyền thông mà KH mong muốn. Nếu không rõ, hãy tóm tắt ý chính.
2. "industry" (string): Ngành hàng khách đang kinh doanh (VD: F&B, Mỹ phẩm, Công nghệ...). Nếu không rõ, trả về chuỗi "General".
3. "budget" (integer hoặc null): Ngân sách cho chiến dịch (quy đổi giá trị ra VND, lấy số nguyên thuần túy, VD: 20000000). QUAN TRỌNG: TUYỆT ĐỐI KHÔNG TỰ ĐỘNG GÁN NGÂN SÁCH MẶC ĐỊNH. NẾU TRONG TEXT KHÁCH KHÔNG NHẮC ĐẾN TIỀN/CHI PHÍ/NGÂN SÁCH THÌ BẮT BUỘC TRẢ VỀ null.
4. "target_audience" (string): Tệp khách hàng mục tiêu nếu có nhắc đến, hoặc để rỗng.
5. "special_constraints" (string): Bất kỳ ràng buộc hoặc yêu cầu bổ sung nào.

Đoạn văn bản của khách hàng:
"{user_raw_text}"
"""
    
    try:
        response = model.generate_content(prompt)
        # response_mime_type="application/json" đảm bảo text trả về Parse-able JSON
        parsed_data = json.loads(response.text)
        return parsed_data
    except Exception as e:
        print(f"Lỗi khi xử lý qua Gemini: {e}")
        # Trả về mặc định dự phòng
        return {
            "goal": user_raw_text,
            "industry": "General",
            "budget": None,
            "target_audience": "",
            "special_constraints": ""
        }

def check_required_info(parsed_data: dict) -> dict:
    """
    Tự động chuẩn hóa các trường thiết yếu để hỗ trợ Demo mượt mà mà không bị chặn lại.
    """
    if parsed_data.get("budget") is None or parsed_data.get("budget") < 1000000:
        parsed_data["budget"] = 20000000  # Default 20 triệu cho Demo
        
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
    Dùng Gemini để tóm tắt các thông tin cốt lõi từ tài liệu doanh nghiệp.
    """
    model = get_gemini_model()
    
    prompt = f"""Bạn là AI phân tích tài liệu doanh nghiệp chuyên nghiệp. Khách hàng vừa tải lên một tài liệu (Brand Guidelines, Company Profile, Product Deck...).
Hãy đọc tài liệu sau và trích xuất các thông tin cốt lõi dưới định dạng JSON với CÁC TRƯỜNG BẮT BUỘC sau:

1. "company_name" (string): Tên công ty hoặc thương hiệu.
2. "industry" (string): Ngành nghề kinh doanh (VD: F&B, Mỹ phẩm...).
3. "target_audience" (string): Tệp khách hàng mục tiêu mà thương hiệu hướng tới.
4. "core_usps" (list of strings): Danh sách 3-5 điểm bán hàng độc nhất (Unique Selling Propositions) hoặc điểm khác biệt cốt lõi.
5. "tone_of_voice" (string): Giọng văn hoặc phong cách ngôn ngữ của thương hiệu.
6. "key_products" (list of strings): Danh sách các sản phẩm/dịch vụ chính yếu.

Nếu thông tin nào không có trong tài liệu, hãy trả về string "Chưa rõ" hoặc mảng rỗng tương ứng. Tuyệt đối không tự bịa thông tin.
DỪNG LẠI SAU KHI TẠO ĐÚNG MỘT JSON HỢP LỆ.

Đoạn tài liệu trích xuất:
"{raw_text[:20000]}"
"""
    
    try:
        response = model.generate_content(prompt)
        parsed_data = json.loads(response.text)
        return parsed_data
    except Exception as e:
        print(f"Lỗi khi trích xuất tài liệu qua Gemini: {e}")
        return {
            "company_name": "Không trích xuất được",
            "industry": "Không rõ",
            "target_audience": "Không rõ",
            "core_usps": [],
            "tone_of_voice": "Không rõ",
            "key_products": []
        }
