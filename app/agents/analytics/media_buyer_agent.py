import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class AdCreativeAnalysis(BaseModel):
    creative_name: str = Field(description="Tên hoặc ID của mẫu quảng cáo (Ad Creative)")
    status: str = Field(description="Quyết định hành động: SCALE (Tăng ngân sách), MAINTAIN (Giữ nguyên), KILL (Tắt ngay), hoặc FATIGUE_WARNING (Cảnh báo mòn nội dung)")
    reasoning: str = Field(description="Lý do dựa trên chỉ số CTR, CPA, và ROAS (dùng ngôn ngữ chuyên môn Media Buyer)")

class MediaBuyerOutput(BaseModel):
    overall_health: str = Field(description="Trạng thái sức khỏe tổng thể của chiến dịch (VD: 'Đang đốt tiền', 'Ổn định', 'Đang scale tốt')")
    creative_decisions: list[AdCreativeAnalysis] = Field(description="Danh sách quyết định cho từng mẫu quảng cáo")
    budget_reallocation: str = Field(description="Lời khuyên phân bổ lại ngân sách (VD: Chuyển 20% từ Facebook sang TikTok)")
    next_action_step: str = Field(description="Hành động ưu tiên số 1 cần làm ngay hôm nay")

class MediaBuyerAgent:
    def __init__(self):
        # Sử dụng model nhanh & chính xác cho phân tích dữ liệu
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1, max_retries=1)
        self.output_parser = JsonOutputParser(pydantic_object=MediaBuyerOutput)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", 
             """Bạn là Senior Media Buyer (Chuyên gia Tối ưu Quảng cáo cấp cao).
Bạn đang phân tích các chỉ số chiến dịch quảng cáo thực tế (Spend, Impressions, Clicks, Conversions, ROAS, CPA).
Dựa trên kiến thức về thuật toán Meta/TikTok Ads, hãy đưa ra quyết định cắt lỗ (KILL), tăng ngân sách (SCALE), hoặc cảnh báo mòn nội dung (FATIGUE_WARNING).

NGUYÊN TẮC TỐI ƯU CỦA AGENCY:
- CTR < 1.0% và CPA cao hơn kỳ vọng: Tắt ngay (KILL) để cắt lỗ.
- ROAS > 2.5 hoặc CPA thấp hơn kỳ vọng: Tăng ngân sách 15-20% (SCALE).
- Nếu CPA tăng đột biến trong 3 ngày qua nhưng CTR vẫn ổn: Cảnh báo (FATIGUE_WARNING - do trùng lặp tệp).
- Hãy viết nhận xét cực kỳ gãy gọn, chuyên nghiệp, như một giám đốc báo cáo cho CMO.

Chỉ trả về định dạng JSON hợp lệ theo đúng cấu trúc (TUYỆT ĐỐI KHÔNG CHỨA MARKDOWN BLOCK QUOTE TRONG KẾT QUẢ):
{format_instructions}"""),
            ("human", "Dữ liệu chiến dịch hiện tại cần phân tích:\n{campaign_data}")
        ])

    async def analyze_campaign(self, campaign_data: dict) -> dict:
        print("[MediaBuyerAgent] Đang phân tích chỉ số chiến dịch...")
        try:
            chain = self.prompt | self.llm | self.output_parser
            result = await chain.ainvoke({
                "campaign_data": json.dumps(campaign_data, ensure_ascii=False, indent=2),
                "format_instructions": self.output_parser.get_format_instructions()
            })
            print("[MediaBuyerAgent] Phân tích thành công.")
            return {"status": "success", "data": result}
        except Exception as e:
            print(f"[MediaBuyerAgent] Lỗi phân tích: {e}")
            return {"status": "error", "message": str(e)}
