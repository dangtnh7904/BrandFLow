import os
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_experimental.tools import PythonREPLTool
from langchain_core.tools import Tool

from app.services.memory_rag import search_niche_knowledge

from langgraph.prebuilt import create_react_agent

class CustomAgentFactory:
    """
    Factory to build dynamic tool-bound agents.
    Enterprise-grade: supports 10 distinct capabilities for C-Level use cases.
    Prevents hallucination by forcing the LLM to use Tools for specific capabilities.
    """

    @staticmethod
    def _create_niche_knowledge_tool() -> Tool:
        return Tool(
            name="NicheKnowledgeSearch",
            func=lambda q: search_niche_knowledge(q),
            description="Tìm kiếm kiến thức nội bộ chuyên sâu về ngành. Cần đưa vào một câu hỏi (query) rõ ràng."
        )

    @staticmethod
    def _create_financial_modeling_tool() -> Tool:
        """Financial modeling via Python — DCF, P&L, unit economics"""
        return PythonREPLTool(
            name="FinancialModeler",
            description="Chạy code Python để xây dựng mô hình tài chính: DCF valuation, P&L projection, unit economics (CAC/LTV), break-even analysis. LUÔN dùng pandas/numpy. Trả về kết quả bảng tính hoặc biểu đồ."
        )

    @staticmethod
    def _create_market_sizing_tool() -> Tool:
        """Market sizing calculator using Python"""
        return PythonREPLTool(
            name="MarketSizingEngine",
            description="Tính toán quy mô thị trường (TAM/SAM/SOM) bằng Python. Sử dụng phương pháp Top-down hoặc Bottom-up với dữ liệu có sẵn. Trả về con số kèm confidence interval."
        )

    @staticmethod
    def _create_competitor_intel_tool() -> Tool:
        """Competitor intelligence via web search"""
        return DuckDuckGoSearchResults(
            name="CompetitorIntel",
            description="Tìm kiếm và phân tích thông tin đối thủ cạnh tranh: chiến lược giá, định vị, messaging, marketing mix. Bắt buộc trích dẫn URL nguồn."
        )

    @staticmethod
    def _create_content_strategy_tool() -> Tool:
        """Content gap analysis and editorial planning"""
        return DuckDuckGoSearchResults(
            name="ContentStrategyResearch",
            description="Nghiên cứu content gap, phân tích top-performing content trong ngành, xu hướng SEO/Social. Sử dụng cho lên editorial calendar và content pillar. Trích dẫn URL nguồn."
        )

    @staticmethod
    def _create_customer_insights_tool() -> Tool:
        """Customer insights via internal knowledge + web"""
        return DuckDuckGoSearchResults(
            name="CustomerInsightsSearch",
            description="Tìm kiếm insight về khách hàng: persona, customer journey, sentiment analysis, NPS benchmark trong ngành. Trích dẫn URL nguồn."
        )

    @staticmethod
    def _create_campaign_optimizer_tool() -> Tool:
        """Campaign optimization via Python analytics"""
        return PythonREPLTool(
            name="CampaignOptimizer",
            description="Chạy code Python để phân tích và tối ưu chiến dịch marketing: phân bổ ngân sách theo kênh, tính ROAS/CPA, A/B test significance (chi-squared/t-test), attribution modeling."
        )

    @staticmethod
    def _create_brand_health_tool() -> Tool:
        """Brand health monitoring via web search"""
        return DuckDuckGoSearchResults(
            name="BrandHealthMonitor",
            description="Theo dõi sức khỏe thương hiệu: brand awareness, recall, sentiment, share of voice. Tìm kiếm benchmark ngành và so sánh với đối thủ. Trích dẫn URL nguồn."
        )

    @staticmethod
    def build_agent(name: str, role: str, system_prompt: str, capabilities: List[str]):
        # 1. Initialize LLM
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.1, api_key=api_key)

        # 2. Bind Tools based on capabilities — Enterprise-grade tool registry
        tools = []
        
        capability_map = {
            "web_search": lambda: DuckDuckGoSearchResults(name="WebSearch"),
            "data_analysis": lambda: PythonREPLTool(
                name="PythonREPL", 
                description="A Python shell. Dùng công cụ này để thực thi code tính toán dữ liệu bằng pandas, numpy... Trả về kết quả đầu ra."
            ),
            "niche_knowledge": lambda: CustomAgentFactory._create_niche_knowledge_tool(),
            "financial_modeling": lambda: CustomAgentFactory._create_financial_modeling_tool(),
            "market_sizing": lambda: CustomAgentFactory._create_market_sizing_tool(),
            "competitor_intel": lambda: CustomAgentFactory._create_competitor_intel_tool(),
            "content_strategy": lambda: CustomAgentFactory._create_content_strategy_tool(),
            "customer_insights": lambda: CustomAgentFactory._create_customer_insights_tool(),
            "campaign_optimizer": lambda: CustomAgentFactory._create_campaign_optimizer_tool(),
            "brand_health": lambda: CustomAgentFactory._create_brand_health_tool(),
        }

        for cap in capabilities:
            if cap in capability_map:
                tools.append(capability_map[cap]())
            
        if not tools:
            # Fallback tool if none selected
            tools.append(Tool(name="NoOp", func=lambda x: "No capabilities granted.", description="Không có công cụ nào."))

        # 3. Create strict Prompt
        template = f"""Bạn là {name}, chuyên gia đảm nhận vai trò: {role}.

{system_prompt}

TUYỆT ĐỐI TUÂN THỦ CÁC QUY TẮC SAU:
- BẠN BỊ CẤM BỊA ĐẶT DỮ LIỆU. NẾU CẦN TÍNH TOÁN, PHẢI DÙNG CÔNG CỤ PYTHON. NẾU CẦN TÌM THÔNG TIN, PHẢI DÙNG CÔNG CỤ SEARCH.
- Trả lời trung thực. Nêu rõ nguồn (URL hoặc từ Tool) nếu có.
- Trả lời có cấu trúc rõ ràng, sử dụng bullet points và heading khi phù hợp.
- Khi phân tích số liệu, PHẢI viết code Python thay vì tự nhẩm tính.
"""
        # 4. Create an agent executor using langgraph
        agent_executor = create_react_agent(
            model=llm,
            tools=tools,
            state_modifier=template
        )

        return agent_executor

    @staticmethod
    async def chat_with_agent(agent_executor, user_message: str) -> str:
        """
        Execute the agent with a user message.
        """
        try:
            response = await agent_executor.ainvoke({"messages": [("user", user_message)]})
            messages = response.get("messages", [])
            if messages:
                return messages[-1].content
            return "Không có câu trả lời."
        except Exception as e:
            return f"Lỗi hệ thống Agent: {str(e)}"
