import os
import asyncio
import time
from dotenv import load_dotenv

load_dotenv()
if "GOOGLE_API_KEY" not in os.environ and "GEMINI_API_KEY" in os.environ:
    os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]

from app.agents.content_lab.agent import ContentLabAgent

async def run_test():
    agent = ContentLabAgent()
    if not agent.llm:
        print("Error: LLM not initialized. Check API Key.")
        return

    scraped_data = {
        "title": "Laptop 20 triệu cân Minecraft, Capcut...",
        "content": "Đây là bài viết đánh giá laptop chơi game Minecraft và edit video bằng phần mềm Capcut mượt mà trong tầm giá 20 triệu đồng. Cấu hình máy cần có CPU dòng H, RAM 16GB và card đồ họa rời NVIDIA RTX 3050 hoặc RTX 4050...",
        "platform": "youtube"
    }
    business_context = {
        "industry": "Công nghệ & Máy tính",
        "target_audience": "Học sinh, sinh viên, người làm sáng tạo nội dung bán chuyên"
    }

    print("Starting Vibe Analysis with ContentLabAgent...")
    start_time = time.time()
    try:
        result = await agent.analyze_vibe(scraped_data, business_context)
        elapsed = time.time() - start_time
        print(f"Analysis completed successfully in {elapsed:.2f} seconds!")
        import pprint
        pprint.pprint(result)
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"Analysis failed after {elapsed:.2f} seconds. Error: {e}")

if __name__ == "__main__":
    asyncio.run(run_test())
