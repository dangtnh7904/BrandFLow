from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from app.services.scraper import ContentScraper
from app.agents.content_lab.agent import ContentLabAgent, _fetch_trending_topics
from app.api.auth_routes import get_current_user

router = APIRouter()

class IngestRequest(BaseModel):
    url: str

class AnalyzeRequest(BaseModel):
    scraped_data: Dict[str, Any]
    business_context: Dict[str, Any] = {}
    brand_dna: Dict[str, Any] = None
    extracted_answers: Dict[str, Any] = None

# ── Enterprise Content Generation Request ──
class GenerateRequest(BaseModel):
    topic: str
    format_type: str = "Social Post"
    tone_of_voice: str = "Chuyên nghiệp"
    platform: str = "Facebook"
    business_context: Dict[str, Any] = None
    brand_dna: Dict[str, Any] = None

# In-memory storage for MVP
session_storage = {}

@router.post("/ingest")
async def ingest_content(req: IngestRequest, user_id: str = Depends(get_current_user)):
    try:
        data = await ContentScraper.scrape_url(req.url)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/analyze")
async def analyze_vibe(req: AnalyzeRequest, user_id: str = Depends(get_current_user)):
    try:
        agent = ContentLabAgent()
        report = await agent.analyze_vibe(req.scraped_data, req.business_context, req.brand_dna, req.extracted_answers)
        return {"status": "success", "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Enterprise Content Generation ──
@router.post("/generate")
async def generate_content(req: GenerateRequest, user_id: str = Depends(get_current_user)):
    """
    Generate enterprise-grade content with:
    - Brand DNA context
    - Real-time Google Trends
    - Platform-specific optimization
    """
    try:
        agent = ContentLabAgent()
        
        # Fetch real-time trends in parallel
        trending_topics = await _fetch_trending_topics()
        
        result = await agent.generate_content(
            topic=req.topic,
            format_type=req.format_type,
            tone_of_voice=req.tone_of_voice,
            platform=req.platform,
            business_context=req.business_context,
            brand_dna=req.brand_dna,
            trending_topics=trending_topics,
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    scraped_data: Dict[str, Any]
    message: str

@router.post("/chat")
async def chat_with_content(req: ChatRequest, user_id: str = Depends(get_current_user)):
    try:
        agent = ContentLabAgent()
        if not agent.llm:
             return {"status": "success", "reply": "Chế độ Mock: Xin chào, tôi đang trong giai đoạn thử nghiệm. Tính năng Chat sẽ hoạt động khi có API Key Gemini."}
        
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
async def get_platform_trends(platform: str = "Tất cả", user_id: str = Depends(get_current_user)):
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
        filtered = [t.split('. ', 1)[1] if '. ' in t[:5] else t for t in filtered]
        
        return {"status": "success", "data": filtered}
    except Exception as e:
        print(f"Lỗi Trends API: {e}")
        return {"status": "error", "message": str(e), "data": []}
