import re
import httpx
from bs4 import BeautifulSoup
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Dict, Any, Optional

class ContentScraper:
    @staticmethod
    def is_youtube_url(url: str) -> bool:
        return "youtube.com" in url or "youtu.be" in url

    @staticmethod
    def is_youtube_channel(url: str) -> bool:
        return bool(re.search(r'(?:youtube\.com\/(?:@|channel\/|c\/|user\/))', url))

    @staticmethod
    def extract_youtube_id(url: str) -> Optional[str]:
        # Matches v=ID or youtu.be/ID
        regex = r"(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/\s]{11})"
        match = re.search(regex, url)
        return match.group(1) if match else None

    @staticmethod
    async def get_youtube_data(url: str) -> Dict[str, Any]:
        video_id = ContentScraper.extract_youtube_id(url)
        if not video_id:
            raise ValueError("Không thể trích xuất ID video từ URL.")

        data = {
            "platform": "youtube",
            "url": url,
            "title": "",
            "description": "",
            "thumbnail_url": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            "author": "",
            "content": ""
        }

        # 1. Fetch metadata using oEmbed (very stable)
        try:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
            async with httpx.AsyncClient() as client:
                resp = await client.get(oembed_url)
                if resp.status_code == 200:
                    oembed_data = resp.json()
                    data["title"] = oembed_data.get("title", "")
                    data["author"] = oembed_data.get("author_name", "")
        except Exception as e:
            print(f"Error fetching oEmbed: {e}")

        # 2. Fetch transcript
        try:
            # Try getting Vietnamese first, then English
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            try:
                transcript = transcript_list.find_transcript(['vi', 'en'])
            except:
                # If neither available, get the first available and translate to 'vi' or just fetch it
                transcript = transcript_list.find_transcript(['vi']) if 'vi' in [t.language_code for t in transcript_list] else transcript_list.find_generated_transcript(['en'])
            
            transcript_data = transcript.fetch()
            # Combine transcript text
            full_text = " ".join([item['text'] for item in transcript_data])
            data["content"] = full_text
        except Exception as e:
            data["content"] = f"(Không thể lấy transcript tự động từ Youtube cho video này. Vui lòng dựa vào tiêu đề và hình ảnh để phân tích. Chi tiết lỗi: {e})"

        return data

    @staticmethod
    async def get_youtube_channel_data(url: str) -> Dict[str, Any]:
        data = {
            "platform": "youtube",
            "url": url,
            "title": "",
            "description": "",
            "thumbnail_url": "",
            "author": "",
            "content": ""
        }
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(url, timeout=15.0)
                import json
                match = re.search(r'var ytInitialData = (\{.*?\});<\/script>', resp.text)
                if match:
                    yt_data = json.loads(match.group(1))
                    metadata = yt_data.get('metadata', {}).get('channelMetadataRenderer', {})
                    data["title"] = metadata.get('title', 'Kênh Youtube')
                    data["author"] = metadata.get('title', '')
                    data["description"] = metadata.get('description', '')
                    avatars = metadata.get('avatar', {}).get('thumbnails', [])
                    if avatars:
                        data["thumbnail_url"] = avatars[-1].get('url', '') # Get highest res
                    
                    data["content"] = f"Đây là Kênh YouTube (YouTube Channel). Tên kênh: {data['title']}.\n\nMô tả kênh:\n{data['description']}\n\n(Hệ thống sẽ phân tích Vibe và định vị thương hiệu của kênh dựa trên Mô tả và Avatar)."
                else:
                    data["content"] = "(Không thể trích xuất metadata từ kênh này, có thể cấu trúc trang đã thay đổi.)"
        except Exception as e:
            data["content"] = f"(Lỗi khi lấy dữ liệu kênh Youtube: {e})"
            
        return data

    @staticmethod
    async def get_website_data(url: str) -> Dict[str, Any]:
        data = {
            "platform": "website",
            "url": url,
            "title": "",
            "description": "",
            "thumbnail_url": "",
            "author": "",
            "content": ""
        }

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(url, headers=headers, timeout=15.0)
                resp.raise_for_status()
                
                soup = BeautifulSoup(resp.text, 'html.parser')
                
                # Extract Title
                title_tag = soup.find('title')
                data["title"] = title_tag.text.strip() if title_tag else ""
                
                # Extract Meta tags
                og_image = soup.find("meta", property="og:image")
                if og_image:
                    data["thumbnail_url"] = og_image.get("content", "")
                    
                og_desc = soup.find("meta", property="og:description") or soup.find("meta", name="description")
                if og_desc:
                    data["description"] = og_desc.get("content", "")
                
                # Extract main content (simplified text extraction)
                # Remove script, style, nav, footer, header tags
                for element in soup(["script", "style", "nav", "footer", "header", "aside"]):
                    element.decompose()
                
                # Try to find article or main tag first
                main_content = soup.find("article") or soup.find("main") or soup.body
                if main_content:
                    text = main_content.get_text(separator='\n', strip=True)
                    # Simple heuristic: filter out very short lines (often menus)
                    lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 20]
                    data["content"] = "\n".join(lines)
                
        except Exception as e:
            data["content"] = f"(Lỗi khi lấy dữ liệu trang web: {e})"

        return data

    @staticmethod
    async def scrape_url(url: str) -> Dict[str, Any]:
        if ContentScraper.is_youtube_channel(url):
            return await ContentScraper.get_youtube_channel_data(url)
        elif ContentScraper.is_youtube_url(url):
            return await ContentScraper.get_youtube_data(url)
        else:
            return await ContentScraper.get_website_data(url)
