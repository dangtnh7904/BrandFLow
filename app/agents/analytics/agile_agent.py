import json
from langchain_core.messages import SystemMessage, HumanMessage
from app.agents.planner.agents_core import _get_strategy_llm

AGILE_SYSTEM_PROMPT = """Bạn là Giám đốc Tối ưu hóa Chiến dịch (Performance Marketing Lead) của một agency cấp cao.
Nhiệm vụ của bạn là nhận các chỉ số KPI hiện tại, thời gian còn lại của chiến dịch, và phân tích chúng để đưa ra QUYẾT ĐỊNH ĐIỀU CHỈNH CHIẾN LƯỢC (Pivot Strategy).

Thay vì đưa ra các giải pháp chung chung (như "tăng ngân sách", "kéo dài thời gian đăng ký"), hãy đưa ra chiến thuật xoay chuyển tình thế (Pivot) thật sự sáng tạo, dựa trên insight tâm lý học và hành vi.

YÊU CẦU ĐẦU RA (JSON FORMAT):
{
    "status_analysis": "Phân tích sắc bén về tình trạng hiện tại dựa trên số liệu.",
    "root_cause_hypothesis": "Giả thuyết về nguyên nhân gốc rễ (ví dụ: thông điệp quá nhàm chán, sai kênh, thiếu tính cấp bách).",
    "pivot_strategy": "Chiến lược xoay chuyển (Pivot) cốt lõi (1-2 câu).",
    "actionable_tactics": [
        {
            "name": "Tên chiến thuật",
            "description": "Mô tả chi tiết cách thực thi",
            "expected_impact": "Dự kiến kết quả mang lại"
        }
    ],
    "message_angle_shift": "Gợi ý thay đổi góc nhìn thông điệp (Angle) cho Content Team."
}
Tuyệt đối chỉ trả về JSON, không kèm markdown hay text thừa.
"""

def evaluate_agile_campaign(
    campaign_name: str,
    current_kpis: dict,
    remaining_days: int,
    account_profile: str = "STANDARD"
) -> dict:
    llm = _get_strategy_llm(temperature=0.6)
    
    context = f"Tên chiến dịch: {campaign_name}\n"
    context += f"Số ngày còn lại: {remaining_days} ngày\n"
    context += f"Dữ liệu KPI hiện tại: {json.dumps(current_kpis, ensure_ascii=False)}\n"
    
    if account_profile == "BK_INNOVATION":
        context += "\n[BỐI CẢNH ĐẶC BIỆT]: Đây là sự kiện/cuộc thi khởi nghiệp cho sinh viên (Trung tâm Sáng tạo Khởi nghiệp Bách Khoa). Nếu số lượng đăng ký (applicants) đang thấp, KHÔNG đề xuất kéo dài hạn chót một cách thụ động. HÃY đề xuất các chiến thuật như: FOMO (Sợ bỏ lỡ cơ hội networking), kích thích cạnh tranh giữa các khoa/trường, dùng Mentor/KOL sinh viên để lôi kéo, hoặc hé lộ một phần giải thưởng độc quyền."
        
    messages = [
        SystemMessage(content=AGILE_SYSTEM_PROMPT),
        HumanMessage(content=f"Hãy phân tích và đưa ra chiến lược tối ưu cho dữ liệu sau:\n{context}")
    ]
    
    print(f"🚀 [AGILE AGENT] Đang phân tích chiến dịch {campaign_name}...")
    try:
        response = llm.invoke(messages)
        raw_text = response.content.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text.split("```json")[1].rsplit("```", 1)[0].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1].rsplit("```", 1)[0].strip()
            
        return json.loads(raw_text, strict=False)
    except Exception as e:
        print(f"Lỗi Agile Agent: {e}")
        return {
            "status_analysis": "Hệ thống AI đang quá tải, không thể phân tích ngay lúc này.",
            "root_cause_hypothesis": "N/A",
            "pivot_strategy": "Vui lòng thử lại sau.",
            "actionable_tactics": [],
            "message_angle_shift": "N/A"
        }
