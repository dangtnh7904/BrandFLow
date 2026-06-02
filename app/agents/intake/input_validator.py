"""
Smart Input Completeness Validator
===================================
Kiểm tra dữ liệu đầu vào từ file/web/fanpage có ĐỦ để hệ thống 5 giai đoạn 
chạy chất lượng hay không. Nếu thiếu → đề xuất câu hỏi cụ thể cho user bổ sung.
"""

from typing import Dict, Any, List, Optional


# ═══════════════════════════════════════════════════════════════════════════════
# REQUIRED FIELDS — Không có thì Brand DNA quá yếu, output 5 GĐ sẽ kém
# ═══════════════════════════════════════════════════════════════════════════════

REQUIRED_FIELDS = {
    "company_name": {
        "weight": 15,
        "label": "Tên doanh nghiệp / thương hiệu",
        "question": "Tên chính thức của doanh nghiệp hoặc thương hiệu là gì?",
        "check_keys": ["company_name", "brand_name"],
    },
    "industry": {
        "weight": 15,
        "label": "Ngành hàng / Lĩnh vực",
        "question": "Doanh nghiệp hoạt động trong ngành hàng / lĩnh vực nào? (VD: F&B, Tech, Edu, Cosmetics, Bất động sản...)",
        "check_keys": ["industry"],
    },
    "target_audience": {
        "weight": 15,
        "label": "Khách hàng mục tiêu",
        "question": "Khách hàng mục tiêu chính của bạn là ai? (Độ tuổi, thu nhập, hành vi, nhu cầu cốt lõi)",
        "check_keys": ["target_audience", "target_audience_insights"],
    },
    "core_usps": {
        "weight": 15,
        "label": "Điểm bán hàng độc nhất (USP)",
        "question": "3 điểm khác biệt/lợi thế cạnh tranh lớn nhất của bạn so với đối thủ là gì?",
        "check_keys": ["core_usps"],
    },
    "tone_of_voice": {
        "weight": 10,
        "label": "Giọng văn thương hiệu",
        "question": "Giọng văn thương hiệu của bạn nên là gì? (VD: Chuyên nghiệp, Gần gũi, Hài hước, Sang trọng...)",
        "check_keys": ["tone_of_voice"],
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
# NICE-TO-HAVE FIELDS — Có thì output tốt hơn nhiều, nhưng vẫn chạy được nếu thiếu
# ═══════════════════════════════════════════════════════════════════════════════

NICE_TO_HAVE_FIELDS = {
    "budget": {
        "weight": 5,
        "label": "Ngân sách marketing",
        "question": "Ngân sách marketing dự kiến hàng tháng hoặc cho chiến dịch này là bao nhiêu? (VND)",
        "check_keys": ["budget", "marketing_budget"],
    },
    "competitors": {
        "weight": 5,
        "label": "Đối thủ cạnh tranh",
        "question": "3 đối thủ cạnh tranh trực tiếp lớn nhất của bạn hiện nay là ai?",
        "check_keys": ["competitors", "competitive_positioning"],
    },
    "channels": {
        "weight": 5,
        "label": "Kênh phân phối / marketing",
        "question": "Bạn đang bán hàng và marketing qua những kênh nào? (VD: Facebook, TikTok, Shopee, Cửa hàng...)",
        "check_keys": ["channels", "marketing_channels", "distribution_channels"],
    },
    "brand_story": {
        "weight": 5,
        "label": "Câu chuyện thương hiệu",
        "question": "Câu chuyện khởi nguồn của thương hiệu là gì? Điều gì thôi thúc bạn bắt đầu?",
        "check_keys": ["brand_story", "brand_origin", "positioning", "core_value"],
    },
    "revenue_model": {
        "weight": 5,
        "label": "Mô hình doanh thu",
        "question": "Mô hình tạo doanh thu chính của bạn là gì? (VD: bán lẻ, subscription, freemium, B2B contract...)",
        "check_keys": ["revenue_model", "business_model"],
    },
    "pain_points": {
        "weight": 5,
        "label": "Vấn đề đang gặp",
        "question": "Vấn đề marketing/kinh doanh lớn nhất mà bạn đang đối mặt hiện nay là gì?",
        "check_keys": ["pain_points", "challenges", "operational_bottlenecks"],
    },
}


def _field_has_value(data: Dict[str, Any], check_keys: List[str]) -> bool:
    """Check if any of the check_keys has a non-empty value in data (recursive search)."""
    for key in check_keys:
        val = data.get(key)
        if val is not None:
            if isinstance(val, str) and val.strip() and val.strip().lower() not in [
                "chưa rõ", "không rõ", "chưa xác định", "null", "none", "", "n/a",
                "không trích xuất được", "không có", "general"
            ]:
                return True
            elif isinstance(val, list) and len(val) > 0:
                # Check if list items are not just placeholder text
                real_items = [
                    item for item in val 
                    if isinstance(item, str) and item.strip() 
                    and item.strip().lower() not in ["chưa rõ", "không rõ", "n/a"]
                ]
                if real_items:
                    return True
            elif isinstance(val, (int, float)) and val > 0:
                return True
            elif isinstance(val, dict) and len(val) > 0:
                return True
    
    # Deep search in nested dicts
    for key, val in data.items():
        if isinstance(val, dict):
            if _field_has_value(val, check_keys):
                return True
    
    return False


def validate_input_completeness(
    extracted_data: Dict[str, Any],
    wizard_answers: Optional[Dict[str, Any]] = None,
    brand_dna: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Validate if the extracted input data is complete enough for the 5-stage pipeline.
    
    Args:
        extracted_data: Data from file upload / web scrape AI analysis
        wizard_answers: Data from the onboarding wizard questionnaire
        brand_dna: Data from Brand DNA extraction
        
    Returns:
        {
            "completeness_score": 0-100,
            "can_proceed": bool,
            "missing_required": [{"field": str, "label": str, "question": str}],
            "missing_optional": [{"field": str, "label": str, "question": str}],
            "suggested_questions": [str],
            "field_status": {"field_name": True/False, ...}
        }
    """
    # Merge all data sources into one flat dict for checking
    merged = {}
    if extracted_data:
        merged.update(extracted_data)
    if wizard_answers:
        merged.update(wizard_answers)
    if brand_dna:
        merged.update(brand_dna)
    
    total_weight = 0
    achieved_weight = 0
    missing_required = []
    missing_optional = []
    field_status = {}
    
    # Check required fields
    for field_id, field_config in REQUIRED_FIELDS.items():
        total_weight += field_config["weight"]
        has_value = _field_has_value(merged, field_config["check_keys"])
        field_status[field_id] = has_value
        
        if has_value:
            achieved_weight += field_config["weight"]
        else:
            missing_required.append({
                "field": field_id,
                "label": field_config["label"],
                "question": field_config["question"],
            })
    
    # Check nice-to-have fields
    for field_id, field_config in NICE_TO_HAVE_FIELDS.items():
        total_weight += field_config["weight"]
        has_value = _field_has_value(merged, field_config["check_keys"])
        field_status[field_id] = has_value
        
        if has_value:
            achieved_weight += field_config["weight"]
        else:
            missing_optional.append({
                "field": field_id,
                "label": field_config["label"],
                "question": field_config["question"],
            })
    
    # Calculate score
    completeness_score = round((achieved_weight / total_weight) * 100) if total_weight > 0 else 0
    
    # Can proceed if ALL required fields are present (or at least 3/5)
    required_present = sum(1 for f in REQUIRED_FIELDS if field_status.get(f, False))
    can_proceed = required_present >= 3  # At least company + industry + 1 more
    
    # Build suggested questions list (required first, then optional)
    suggested_questions = [m["question"] for m in missing_required]
    suggested_questions += [m["question"] for m in missing_optional[:3]]  # Max 3 optional
    
    return {
        "completeness_score": completeness_score,
        "can_proceed": can_proceed,
        "missing_required": missing_required,
        "missing_optional": missing_optional,
        "suggested_questions": suggested_questions,
        "field_status": field_status,
        "required_count": len(REQUIRED_FIELDS),
        "required_filled": required_present,
    }
