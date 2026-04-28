import asyncio
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun
from pydantic import BaseModel, Field

class MarketResearchOutput(BaseModel):
    tam_sam_som: dict = Field(description="Dictionary containing TAM, SAM, SOM, CAGR estimates and explanation")
    competitors: list = Field(description="List of top 3 competitors and their SWOT analysis (strengths, weaknesses, pain_points)")
    market_gap: str = Field(description="The market gap identified based on competitor weaknesses")
    trends: list = Field(description="List of 3 current trends in this industry")

class MarketAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
        self.output_parser = JsonOutputParser(pydantic_object=MarketResearchOutput)
        self.search_tool = DuckDuckGoSearchRun()
        
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("user", 
             """Bạn là Giám đốc Nghiên cứu Thị trường (Market Research Director) cấp cao.
Bạn vừa nhận được thông tin về ngành hàng (Industry) và Brand DNA của một công ty. 
Nhiệm vụ của bạn là sử dụng dữ liệu trinh sát thô do hệ thống thu thập được từ Internet để phân tích và trả về kết quả JSON theo đúng cấu trúc.

NGÀNH HÀNG: {industry}

BRAND DNA (Tài liệu nội bộ):
{brand_dna}

DỮ LIỆU TRINH SÁT TỪ INTERNET:
{search_data}

YÊU CẦU ĐẦU RA:
Dựa trên kiến thức chuyên gia của bạn và dữ liệu trinh sát ở trên, hãy ước lượng:
1. Các chỉ số vĩ mô (Macro Metrics): TAM (Tổng thị trường), SAM (Thị trường phục vụ được), SOM (Thị phần mục tiêu), CAGR (Tỷ lệ tăng trưởng). Ước lượng hợp lý nếu không có số chính xác.
2. Đối thủ cạnh tranh (Competitors): 3 đối thủ tiêu biểu, điểm mạnh, điểm yếu và "pain points" khách hàng của họ.
3. Khoảng trống thị trường (Market Gap): Đề xuất cơ hội.
4. Xu hướng (Trends): 3 xu hướng công nghệ / hành vi tiêu dùng nổi bật.

CHỈ TRẢ VỀ CHUỖI JSON HỢP LỆ THEO ĐỊNH DẠNG SAU:
{format_instructions}
"""),
        ])

    async def run_research(self, industry: str, brand_dna: dict = None) -> dict:
        print(f"🔍 [Market Agent] Đang khởi động trinh sát mạng cho ngành: {industry}...")
        
        # Mapping industry names for better search queries
        industry_keywords = {
            "tech": "SaaS and Technology software startups market size and pain points",
            "edu": "EdTech and online education market trends and competitors",
            "cosmetics": "Beauty and cosmetics market trends, vegan ingredients and competitors",
            "fnb": "Food and Beverage restaurant market trends and customer sentiment",
            "fb": "Food and Beverage restaurant market trends and customer sentiment",
        }
        
        query = industry_keywords.get(industry.lower(), f"{industry} market size, trends, and competitors")
        
        # Step 1: Run Web Search (Simulated real-time scraping)
        print(f"🌐 [Market Agent] Đang thu thập dữ liệu từ DuckDuckGo: '{query}'...")
        try:
            # Chạy search tool đồng bộ trong async (bằng cách dùng to_thread nếu cần, nhưng ddg_search chạy khá nhanh)
            search_result = await asyncio.wait_for(
                asyncio.to_thread(self.search_tool.run, query),
                timeout=10.0
            )
            print("   ✅ Đã thu thập xong dữ liệu thô từ Internet.")
        except Exception as e:
            print(f"   ⚠️ Lỗi tìm kiếm: {e}")
            search_result = "Không thể truy xuất dữ liệu internet lúc này. Hãy sử dụng kiến thức sẵn có của bạn."

        # Step 2: Pass into LLM to synthesize
        chain = self.prompt_template | self.llm | self.output_parser
        
        try:
            print("🧠 [Market Agent] Đang tổng hợp và tính toán TAM, SAM, SOM...")
            dna_str = json.dumps(brand_dna, ensure_ascii=False, indent=2) if brand_dna else "Không có dữ liệu Brand DNA."
            result = await chain.ainvoke({
                "industry": industry,
                "brand_dna": dna_str,
                "search_data": search_result[:3000], # Giới hạn 3000 ký tự để tránh quá tải context
                "format_instructions": self.output_parser.get_format_instructions()
            })
            
            if not isinstance(result, dict):
                raise ValueError(f"LLM returned invalid data type: {type(result)}. Expected dictionary.")
                
            print("   ✅ Hoàn tất phân tích thị trường!")
            return {
                "status": "success",
                "data": result
            }
        except Exception as e:
            print(f"   🔴 Lỗi trong quá trình phân tích: {e}")
            return {
                "status": "error",
                "message": str(e)
            }
