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
    business_context: Dict[str, Any] = {}

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
        report = await agent.analyze_vibe(req.scraped_data, req.business_context)
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

@router.get("/trends")
async def get_platform_trends(platform: str = "Tất cả"):
    import urllib.request
    import xml.etree.ElementTree as ET
    try:
        req = urllib.request.Request('https://trends.google.com/trending/rss?geo=VN', headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        tree = ET.fromstring(res.read())
        
        raw_trends = []
        for item in tree.findall('.//item')[:20]:
            title_node = item.find('title')
            if title_node is not None and title_node.text:
                raw_trends.append(title_node.text)

        agent = ContentLabAgent()
        if not agent.llm or platform == "Tất cả" or not platform:
            return {"status": "success", "data": raw_trends[:5]}
            
        prompt = f"""Dưới đây là top 20 Google Trends hôm nay tại Việt Nam:
{chr(10).join(raw_trends)}

Bạn là chuyên gia sáng tạo nội dung. Hãy lọc ra 5 chủ đề phù hợp nhất để đăng lên {platform} từ danh sách trên.
Định dạng trả về: Chỉ trả về đúng 5 dòng, mỗi dòng là một chủ đề ngắn gọn (đã được bạn điều chỉnh ngôn từ cho hợp với {platform}).
KHÔNG GIẢI THÍCH, KHÔNG GẠCH ĐẦU DÒNG.
"""
        from langchain_core.messages import HumanMessage
        response = await agent.llm.ainvoke([HumanMessage(content=prompt)])
        
        filtered = [t.strip('-*. \t') for t in response.content.strip().split('\n') if t.strip()][:5]
        # Xóa số thứ tự nếu AI cố tình trả về số (vd: 1. Trend)
        filtered = [t.split('. ', 1)[1] if '. ' in t[:5] else t for t in filtered]
        
        return {"status": "success", "data": filtered}
    except Exception as e:
        print(f"Lỗi Trends API: {e}")
        return {"status": "error", "message": str(e), "data": []}

