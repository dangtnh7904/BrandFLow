import os
import json
import httpx
import base64
from typing import Dict, Any
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

SYSTEM_PROMPT = """Bạn là một Chuyên gia Phân tích Marketing (Marketing Vibe Analyst). 
Nhiệm vụ của bạn là mổ xẻ nội dung được cung cấp (bao gồm Text/Transcript và Hình ảnh Thumbnail/Cover) để trích xuất các insight sâu sắc về cách thức marketing của nội dung này.

LUÔN PHÂN TÍCH DỰA TRÊN 2 KHÍA CẠNH QUAN TRỌNG:
1. Nội dung (Text): Câu chữ, thông điệp, cách kể chuyện (storytelling).
2. Cách xây dựng hình ảnh & Đăng bài (Visuals & Delivery): Dựa vào hình ảnh đại diện (thumbnail) hoặc cách trình bày, tiêu đề, mô tả.

HÃY TRẢ VỀ ĐỊNH DẠNG JSON VỚI CẤU TRÚC SAU:
{
    "vibe_summary": "1 câu tóm tắt cốt lõi nội dung làm về gì",
    "vibe_keywords": ["Từ khóa 1", "Từ khóa 2", "Từ khóa 3"],
    "vibe_analysis": "Phân tích nhịp điệu, cảm xúc, định vị phong cách",
    
    "visual_colors": ["Màu 1", "Màu 2"],
    "visual_style": "Phong cách thiết kế (ví dụ: Minimalist, Đậm đà, Điện ảnh...)",
    "visual_analysis": "Ý đồ xây dựng thương hiệu đằng sau hình ảnh/thumbnail",
    
    "copywriting_hooks": [
        "Kỹ thuật giật tít 1",
        "Cách viết mô tả 2"
    ],
    "target_audience": [
        "Tệp khán giả 1",
        "Tệp khán giả 2"
    ],
    "learning_actions": [
        "Hành động 1 cần làm để học hỏi kênh/bài viết này",
        "Hành động 2...",
        "Hành động 3..."
    ]
}

Tuyệt đối không trả lời ngoài định dạng JSON. Không thêm backticks markdown ```json ở đầu và cuối.
"""

class ContentLabAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            # Fallback to a mock response if no API key is provided
            self.llm = None
        else:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                temperature=0.3,
                google_api_key=api_key,
                max_output_tokens=8192
            )

    async def get_base64_image(self, image_url: str) -> str:
        if not image_url:
            return ""
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(image_url)
                resp.raise_for_status()
                return base64.b64encode(resp.content).decode('utf-8')
        except Exception as e:
            print(f"Error fetching image for LLM: {e}")
            return ""

    async def analyze_vibe(self, scraped_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.llm:
            # Mock mode if no API key
            return {
                "vibe_and_tone": "Phong cách chuyên nghiệp, tập trung vào số liệu (Mocked).",
                "visual_analysis": "Sử dụng màu sắc tương phản cao, text lớn để tăng CTR (Mocked).",
                "copywriting_hooks": "Tiêu đề gây tò mò, hứa hẹn giải quyết một pain-point cụ thể (Mocked).",
                "target_audience": "Người làm marketing, chủ doanh nghiệp (Mocked).",
                "actionable_marketing_ideas": ["Thử nghiệm thumbnail có khuôn mặt biểu cảm", "Sử dụng con số lẻ trong tiêu đề"]
            }

        # Prepare Text Content
        title = scraped_data.get("title", "")
        desc = scraped_data.get("description", "")
        content = scraped_data.get("content", "")
        thumbnail_url = scraped_data.get("thumbnail_url", "")
        platform = scraped_data.get("platform", "website")

        text_payload = f"Platform: {platform}\nTitle: {title}\nDescription: {desc}\n\nMain Content / Transcript:\n{content[:5000]}"

        messages = [
            HumanMessage(content=SYSTEM_PROMPT)
        ]

        # Prepare Multimodal Message
        user_content = []
        user_content.append({"type": "text", "text": text_payload})

        if thumbnail_url:
            b64_image = await self.get_base64_image(thumbnail_url)
            if b64_image:
                user_content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}
                })

        messages.append(HumanMessage(content=user_content))

        print(f"[ContentLab] Analyzing Vibe for {platform} content...")
        try:
            response = await self.llm.ainvoke(messages)
            raw_text = response.content.strip()
            # Clean up markdown if any
            if raw_text.startswith("```json"):
                raw_text = raw_text.split("```json")[1].rsplit("```", 1)[0].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1].rsplit("```", 1)[0].strip()
            return json.loads(raw_text, strict=False)
        except Exception as e:
            print(f"Error in ContentLabAgent: {e}")
            return {
                "error": str(e),
                "vibe_and_tone": f"Không thể phân tích. Chi tiết lỗi từ AI: {str(e)}",
                "visual_analysis": "Không thể phân tích.",
                "copywriting_hooks": "Không thể phân tích.",
                "target_audience": "Không thể phân tích.",
                "actionable_marketing_ideas": []
            }
