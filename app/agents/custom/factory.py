import os
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_experimental.tools import PythonREPLTool
from langchain.tools import Tool

from app.services.memory_rag import search_niche_knowledge

class CustomAgentFactory:
    """
    Factory to build dynamic tool-bound agents.
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
    def build_agent(name: str, role: str, system_prompt: str, capabilities: List[str]) -> AgentExecutor:
        # 1. Initialize LLM
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        # Use pro model for complex tool usage
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.1, api_key=api_key)

        # 2. Bind Tools based on capabilities
        tools = []
        
        if "web_search" in capabilities:
            tools.append(DuckDuckGoSearchResults(name="WebSearch"))
            
        if "data_analysis" in capabilities:
            tools.append(PythonREPLTool(name="PythonREPL", description="A Python shell. Dùng công cụ này để thực thi code tính toán dữ liệu bằng pandas, numpy... Trả về kết quả đầu ra."))
            
        if "niche_knowledge" in capabilities:
            tools.append(CustomAgentFactory._create_niche_knowledge_tool())
            
        if not tools:
            # Fallback tool if none selected, as React Agent needs at least 1 tool
            tools.append(Tool(name="NoOp", func=lambda x: "No capabilities granted.", description="Không có công cụ nào."))

        # 3. Create strict Prompt
        template = f"""Bạn là {name}, chuyên gia đảm nhận vai trò: {role}.

{system_prompt}

TUYỆT ĐỐI TUÂN THỦ CÁC QUY TẮC SAU:
- BẠN BỊ CẤM BỊA ĐẶT DỮ LIỆU. NẾU CẦN TÍNH TOÁN, PHẢI DÙNG CÔNG CỤ PYTHON. NẾU CẦN TÌM THÔNG TIN, PHẢI DÙNG CÔNG CỤ SEARCH.
- Trả lời trung thực. Nêu rõ nguồn (URL hoặc từ Tool) nếu có.

Bạn có quyền sử dụng các công cụ sau:
{{tools}}

Định dạng suy nghĩ của bạn BẮT BUỘC PHẢI tuân theo cấu trúc sau (nếu không hệ thống sẽ lỗi):

Question: câu hỏi bạn cần trả lời
Thought: bạn nên suy nghĩ xem cần làm gì
Action: tên công cụ sẽ dùng, phải là một trong số: [{{tool_names}}]
Action Input: đầu vào cho công cụ
Observation: kết quả từ công cụ
... (quá trình Thought/Action/Action Input/Observation có thể lặp lại N lần)
Thought: Tôi đã biết câu trả lời cuối cùng
Final Answer: câu trả lời cuối cùng cho người dùng

Bắt đầu!

Question: {{input}}
Thought:{{agent_scratchpad}}"""

        prompt = PromptTemplate.from_template(template)

        # 4. Construct the ReAct agent
        agent = create_react_agent(llm, tools, prompt)

        # 5. Create an agent executor by passing in the agent and tools
        agent_executor = AgentExecutor(
            agent=agent, 
            tools=tools, 
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=5
        )

        return agent_executor

    @staticmethod
    async def chat_with_agent(agent_executor: AgentExecutor, user_message: str) -> str:
        """
        Execute the agent with a user message.
        """
        try:
            response = await agent_executor.ainvoke({"input": user_message})
            return response.get("output", "Không có câu trả lời.")
        except Exception as e:
            return f"Lỗi hệ thống Agent: {str(e)}"
