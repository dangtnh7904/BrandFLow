import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class CRMMessage(BaseModel):
    day: int = Field(description="Ngày gửi tính từ lúc mua hàng (VD: 1, 7, 30)")
    channel: str = Field(description="Kênh gửi: Zalo ZNS, SMS, hoặc Email")
    objective: str = Field(description="Mục tiêu: Đánh giá, Upsell, Mời quay lại")
    content: str = Field(description="Nội dung thông điệp (ngắn gọn, cá nhân hóa)")

class LoyaltyProgram(BaseModel):
    tier_name: str = Field(description="Tên hạng thẻ (VD: Silver, Gold, Platinum)")
    condition: str = Field(description="Điều kiện đạt hạng (VD: Chi tiêu > 5 triệu)")
    perks: list[str] = Field(description="Quyền lợi của hạng thẻ")

class CRMOutput(BaseModel):
    strategy_overview: str = Field(description="Tổng quan chiến lược giữ chân khách hàng (Retention Strategy)")
    communication_sequence: list[CRMMessage] = Field(description="Chuỗi kịch bản chăm sóc khách hàng")
    loyalty_tiers: list[LoyaltyProgram] = Field(description="Hệ thống tích điểm/thành viên")

class CRMAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
        self.output_parser = JsonOutputParser(pydantic_object=CRMOutput)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", 
             """Bạn là Senior CRM & Retention Strategist (Chuyên gia Giữ chân Khách hàng).
Nhiệm vụ của bạn là thiết kế chuỗi hành trình chăm sóc khách hàng (Customer Journey) và hệ thống Loyalty.
Tập trung vào tối ưu hóa LTV (Lifetime Value) thông qua các kênh Zalo ZNS, SMS, Email.

Chỉ trả về định dạng JSON theo đúng cấu trúc:
{format_instructions}"""),
            ("human", "Thông tin doanh nghiệp:\nBrand DNA: {brand_dna}\nCấu trúc giá & Biên lợi nhuận: {financial_data}")
        ])

    async def generate_crm_strategy(self, brand_dna: dict, financial_data: dict) -> dict:
        try:
            chain = self.prompt | self.llm | self.output_parser
            result = await chain.ainvoke({
                "brand_dna": json.dumps(brand_dna, ensure_ascii=False),
                "financial_data": json.dumps(financial_data, ensure_ascii=False),
                "format_instructions": self.output_parser.get_format_instructions()
            })
            return {"status": "success", "data": result}
        except Exception as e:
            return {"status": "error", "message": str(e)}
