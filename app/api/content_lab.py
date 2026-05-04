from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List

from app.services.scraper import ContentScraper
from app.agents.content_lab.agent import ContentLabAgent

router = APIRouter()

class IngestRequest(BaseModel):
    url: str

class AnalyzeRequest(BaseModel):
    scraped_data: Dict[str, Any]

# In-memory storage for MVP (In production, use VectorDB or Redis)
# Dictionary mapping session_id or url to extracted data
session_storage = {}

@router.post("/ingest")
async def ingest_content(req: IngestRequest):
    try:
        data = await ContentScraper.scrape_url(req.url)
        # Store in session if needed, but for MVP we can just return it to frontend
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/analyze")
async def analyze_vibe(req: AnalyzeRequest):
    try:
        agent = ContentLabAgent()
        report = await agent.analyze_vibe(req.scraped_data)
        return {"status": "success", "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    scraped_data: Dict[str, Any]
    message: str

@router.post("/chat")
async def chat_with_content(req: ChatRequest):
    try:
        agent = ContentLabAgent()
        if not agent.llm:
             return {"status": "success", "reply": "Chế độ Mock: Xin chào, tôi đang trong giai đoạn thử nghiệm. Tính năng Chat sẽ hoạt động khi có API Key Gemini."}
        
        # Build prompt
        title = req.scraped_data.get('title', '')
        content = req.scraped_data.get('content', '')[:15000]
        context = f"Title: {title}\nContent: {content}"
        prompt = f"Bạn là AI Marketing Assistant. Hãy trả lời câu hỏi của người dùng dựa trên nội dung sau:\n{context}\n\nCâu hỏi của người dùng: {req.message}\n\nTrả lời chuyên nghiệp, tập trung vào góc độ truyền thông/marketing:"
        
        from langchain_core.messages import HumanMessage
        response = await agent.llm.ainvoke([HumanMessage(content=prompt)])
        
        return {"status": "success", "reply": response.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
