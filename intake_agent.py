import json
import os
from typing import Optional

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
        from groq import Groq
        client = Groq()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        parsed_data = json.loads(response.choices[0].message.content)
        return parsed_data
    except Exception as e:
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
        from groq import Groq
        client = Groq()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"🔴 [DOCUMENT] Lỗi trích xuất qua Groq: {e}")
        return {
            "company_name": "Không trích xuất được",
            "industry": "Không rõ",
            "target_audience": "Không rõ",
            "core_usps": [],
            "tone_of_voice": "Không rõ",
            "key_products": []
        }
