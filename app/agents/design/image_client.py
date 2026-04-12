import os
from openai import AsyncOpenAI
from typing import Optional

class DalleClient:
    """
    Client kết nối OpenAI để gọi mô hình DALL-E 3 sinh ảnh.
    """
    def __init__(self):
        api_key = os.environ.get("OPENAI_API_KEY")
        self.enabled = bool(api_key)
        if self.enabled:
            self.client = AsyncOpenAI(api_key=api_key)
        else:
            self.client = None

    async def generate_image(self, prompt: str, size: str = "1024x1024", quality: str = "standard") -> Optional[str]:
        """
        Gửi prompt đến DALL-E 3 và trả về URL của bức ảnh.
        """
        if not self.enabled:
            print("⚠️ [DalleClient] Không tìm thấy OPENAI_API_KEY. Trả về ảnh mặc định.")
            # Fallback URL để test UI nếu không có key
            return "https://via.placeholder.com/1024x1024.png?text=Missing+OpenAI+Key"

        try:
            print(f"🖼️ [DalleClient] Đang vẽ ảnh DALL-E 3 với cấu hình {size}...")
            # Cắt bớt prompt nếu quá dài (DALL-E 3 giới hạn 4000 chars)
            safe_prompt = prompt[:4000]

            response = await self.client.images.generate(
                model="dall-e-3",
                prompt=safe_prompt,
                size=size,
                quality=quality,
                n=1,
            )
            image_url = response.data[0].url
            print(f"   ✅ [DalleClient] Vẽ thành công: {image_url[:50]}...")
            return image_url
            
        except Exception as e:
            print(f"   🔴 [DalleClient] Lỗi khi gọi DALL-E: {e}")
            return "https://via.placeholder.com/1024x1024.png?text=DALL-E+Error"
