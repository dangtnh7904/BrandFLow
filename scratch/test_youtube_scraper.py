import asyncio
import os
import sys

# Add project root to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.services.scraper import ContentScraper

async def main():
    # Video ID to test: "hwP7WQkmECE" (Git in 100 Seconds by Fireship)
    video_id = "hwP7WQkmECE"
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    
    print(f"--- 1. Test cào video bình thường (Dùng YouTube Transcript API): {video_url} ---")
    try:
        data = await ContentScraper.scrape_url(video_url)
        print("✅ Thành công!")
        print(f"Tiêu đề: {data.get('title')}")
        print(f"Tác giả: {data.get('author')}")
        print(f"Độ dài transcript: {len(data.get('content', ''))} ký tự")
        print(f"Mẫu nội dung: {data.get('content', '')[:200]}...")
    except Exception as e:
        print(f"❌ Thất bại: {e}")
        
    print("\n" + "="*50 + "\n")
    
    print(f"--- 2. Test trực tiếp phương án dự phòng (Tải audio + Transcribe qua Gemini 1.5): {video_url} ---")
    try:
        # Gọi trực tiếp hàm dự phòng để đảm bảo code hoạt động tốt
        transcript_text = await ContentScraper.transcribe_youtube_audio(video_id)
        print("✅ Thành công!")
        print(f"Độ dài transcript thu được: {len(transcript_text)} ký tự")
        print(f"Mẫu nội dung: {transcript_text[:300]}...")
    except Exception as e:
        print(f"❌ Thất bại phương án dự phòng: {e}")
        
    print("\n" + "="*50 + "\n")
    
    # Test a channel
    channel_url = "https://www.youtube.com/@Fireship"
    print(f"--- 3. Test cào kênh YouTube: {channel_url} ---")
    try:
        data = await ContentScraper.scrape_url(channel_url)
        print("✅ Thành công!")
        print(f"Tên kênh: {data.get('title')}")
        print(f"Mô tả: {data.get('description')[:150]}...")
        print(f"Độ dài nội dung: {len(data.get('content', ''))} ký tự")
        print(f"Mẫu nội dung: {data.get('content', '')[:200]}...")
    except Exception as e:
        print(f"❌ Thất bại: {e}")

if __name__ == "__main__":
    asyncio.run(main())
