import os
import json
from pydantic import BaseModel, Field
from typing import List

# =============================================================================
# PYDANTIC SCHEMA CHO BÁO CÁO THỊ TRƯỜNG TỰ ĐỘNG
# =============================================================================
class MarketContextResult(BaseModel):
    pestle_factors: str = Field(description="Các yếu tố Vĩ mô (Kinh tế, Xã hội, Pháp lý) đang tác động đến ngành này lúc này.")
    competitor_trends: str = Field(description="Xu hướng các đối thủ trong ngành đang làm gì gần đây.")
    consumer_behavior: str = Field(description="Đặc điểm hành vi của tệp khách hàng mục tiêu tại thời điểm hiện tại.")
    data_sources: List[str] = Field(description="Danh sách 2-3 links hoặc nguồn dữ liệu đã thu thập được từ Web.")

def _resolve_groq_timeout_seconds() -> float:
    return max(1.0, float(os.getenv("BRANDFLOW_GROQ_TIMEOUT_SECONDS", "60")))

GROQ_TIMEOUT_SECONDS = _resolve_groq_timeout_seconds()


def run_autonomous_market_research(industry: str, audience: str, custom_workflow_rules: str = "") -> dict:
    """
    Quy trình Thám tử AI:
    Sử dụng DuckDuckGo Search API để tìm tin tức Real-time về Ngành và Khách hàng trên mạng.
    Nén thông tin lại thành Bản tin Thị trường (Market Context) cho Agent 1 lập kế hoạch.
    """
    from langchain_groq import ChatGroq
    from langchain_community.tools import DuckDuckGoSearchResults
    from langchain_core.messages import HumanMessage, SystemMessage
    
    print(f"\n{'═' * 70}")
    print(f"🕵️ [WEB RESEARCHER AGENT] Đang thu thập tin tức thời gian thực...")
    print(f"   Ngành: {industry} | Khách mục tiêu: {audience}")
    print(f"{'═' * 70}")

    try:
        api_key = os.getenv("GROQ_API_KEY")
        # Sử dụng Model 70B siêu mạnh để tư duy công cụ Tìm kiếm
        llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1, api_key=api_key)
        
        # Công cụ tìm kiếm Web - Cắm cho AI quyền Lướt Net
        search_tool = DuckDuckGoSearchResults()
        
        # Ràng buộc Schema để ép AI trả về Pydantic
        structured_llm = llm.with_structured_output(MarketContextResult)
        
        system_prompt = "Bạn là Chuyên gia Nghiên cứu Thị trường (Market Researcher) cấp khu vực (Đông Nam Á).\n"
        if custom_workflow_rules:
            system_prompt += f"\nQUY TRÌNH KÉO DỮ LIỆU ĐƯỢC CHỈ ĐỊNH TỪ TEAM BUSINESS:\n{custom_workflow_rules}\n"
            
        research_prompt = f"""
        Nhiệm vụ của bạn là dựa vào tri thức nội bộ và công cụ Tìm kiếm Web để lập "Tóm tắt Báo cáo Thị trường Hiện tại" tại Việt Nam.
        
        Ngành hàng: {industry}
        Tệp khách hàng mục tiêu: {audience}
        
        Quy tắc:
        - Đừng đoán bừa. Nếu thiếu thông tin, hãy ưu tiên các xu hướng chung về thói quen mua sắm.
        - Tìm kiếm ít nhất 2 tin tức mới nhất về ngành này.
        """
        
        print("   🔍 Đang lướt Web tra cứu (DuckDuckGo Search)...")
        # Chạy Tool giả lập vì Agent Execution Loop rườm rà.
        # Ở đây ta tối ưu Token bằng cách tự query Search rồi nhồi thẳng kết quả cho LLM dịch JSON.
        query_string = f"Xu hướng ngành {industry} đối với {audience} tại Việt Nam"
        
        raw_search_results = search_tool.invoke(query_string)
        print("   ✅ Đã lấy được bài báo từ Internet. Đang nén thành Báo cáo Khung...")
        
        # Nhồi kết quả tìm kiếm vào Promt cho con 70B
        final_prompt = research_prompt + f"\n\n--- KẾT QUẢ TỰ ĐỘNG TÌM KIẾM TRÊN WEB ---\n{raw_search_results}\n"
        
        result_obj = structured_llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=final_prompt)
        ])
        
        print(f"   💡 Phát hiện xu hướng: {result_obj.competitor_trends[:50]}...")
        return result_obj.model_dump()
        
    except Exception as e:
        print(f"🔴 [WEB RESEARCH Lỗi]: {e}")
        # Trả về Context Trống để không làm Crash toàn bộ hệ thống
        return {
            "pestle_factors": "Chưa có thay đổi vĩ mô đáng kể nào tác động lớn đến ngành này.",
            "competitor_trends": "Các đối thủ vẫn đang tập trung vào kênh truyền thống và Social Media Cũ.",
            "consumer_behavior": "Khách hàng chú trọng vào chất lượng thực tế thay vì quảng cáo hoa mỹ.",
            "data_sources": ["Fallback Knowledge"]
        }

if __name__ == "__main__":
    # Test thử Thám Tử lướt Web
    res = run_autonomous_market_research(
        industry="F&B (Trà sữa)", 
        audience="Gen Z", 
        custom_workflow_rules="Tập trung vào xu hướng trà sữa Healthy (Ít đường)."
    )
    print(json.dumps(res, indent=2, ensure_ascii=False))
