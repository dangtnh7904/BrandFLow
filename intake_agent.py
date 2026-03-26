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
        model_name="gemini-1.5-flash",
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
    Kiểm tra các trường thiết yếu. Nếu thiếu trả về trạng thái cần làm rõ.
    """
    budget = parsed_data.get("budget")
    industry = parsed_data.get("industry", "General")
    
    if budget is None:
        return {
            "status": "clarification_needed", 
            "message": "Dạ, để BrandFlow phân bổ chi phí và lên kế hoạch tối ưu nhất, anh/chị có thể bật mí mức ngân sách dự kiến cho chiến dịch này khoảng bao nhiêu không ạ?"
        }
    
    # Kiểm tra kĩ các biến thể của "General" để an toàn
    general_variations = ["general", "null", "none", "", "không rõ"]
    if str(industry).strip().lower() in general_variations:
        return {
            "status": "clarification_needed", 
            "message": "Dạ, anh/chị đang kinh doanh sản phẩm/dịch vụ trong ngành hàng nào ạ? (Ví dụ: F&B, Mỹ phẩm, Công nghệ...)"
        }
        
    return {
        "status": "ready",
        "data": parsed_data
    }
