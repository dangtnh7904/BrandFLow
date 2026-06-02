import re
import httpx
from bs4 import BeautifulSoup
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Dict, Any, Optional, List


class ContentScraper:
    @staticmethod
    def is_youtube_url(url: str) -> bool:
        return "youtube.com" in url or "youtu.be" in url

    @staticmethod
    def is_facebook_url(url: str) -> bool:
        return "facebook.com" in url or "fb.com" in url or "fb.watch" in url

    @staticmethod
    def is_ecommerce_url(url: str) -> bool:
        ecommerce_domains = ["shopee.vn", "lazada.vn", "tiki.vn", "sendo.vn", "tiktokshop"]
        return any(domain in url.lower() for domain in ecommerce_domains)

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
    async def transcribe_youtube_audio(video_id: str) -> str:
        import os
        import glob
        import asyncio
        import yt_dlp
        import google.generativeai as genai
        
        output_dir = "temp_uploads"
        os.makedirs(output_dir, exist_ok=True)
        
        url = f"https://www.youtube.com/watch?v={video_id}"
        outtmpl = os.path.join(output_dir, f"{video_id}.%(ext)s")
        
        ydl_opts = {
            'format': 'm4a/bestaudio/best',
            'outtmpl': outtmpl,
            'noplaylist': True,
            'quiet': True,
            'no_warnings': True,
            'extractor_args': {'youtube': {'player_client': ['android']}},
        }
        
        def download_audio():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                return ydl.prepare_filename(info)
                
        loop = asyncio.get_event_loop()
        try:
            print(f"Downloading YouTube audio for video_id: {video_id}...")
            filepath = await loop.run_in_executor(None, download_audio)
        except Exception as e:
            raise RuntimeError(f"Lỗi khi tải audio từ YouTube: {e}")
            
        if not os.path.exists(filepath):
            matches = glob.glob(os.path.join(output_dir, f"{video_id}.*"))
            if matches:
                filepath = matches[0]
            else:
                raise FileNotFoundError(f"Không tìm thấy file audio đã tải xuống cho video {video_id}")
                
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            # Cleanup local file first
            if os.path.exists(filepath):
                os.remove(filepath)
            raise ValueError("Không tìm thấy GEMINI_API_KEY trong biến môi trường.")
            
        genai.configure(api_key=api_key)
        
        # Upload file to Gemini API
        try:
            print(f"Uploading audio {filepath} to Gemini...")
            audio_file = await loop.run_in_executor(None, lambda: genai.upload_file(path=filepath))
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            raise RuntimeError(f"Lỗi khi tải file âm thanh lên Gemini API: {e}")
            
        try:
            print("Waiting for file processing to complete on Gemini...")
            while True:
                audio_file = await loop.run_in_executor(None, lambda: genai.get_file(audio_file.name))
                if audio_file.state.name == "ACTIVE":
                    break
                elif audio_file.state.name == "FAILED":
                    raise RuntimeError("File processing failed on Gemini")
                print("File is processing, waiting 2 seconds...")
                await asyncio.sleep(2)
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            try:
                await loop.run_in_executor(None, lambda: genai.delete_file(audio_file.name))
            except:
                pass
            raise RuntimeError(f"Lỗi khi chờ xử lý file trên Gemini: {e}")

        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            prompt = (
                "Bạn là một trợ lý AI chuyên nghiệp. Dưới đây là tệp âm thanh từ một video YouTube. "
                "Hãy nghe kỹ và chép lại toàn bộ lời thoại (transcript) của đoạn âm thanh này bằng chính ngôn ngữ nói của video. "
                "Yêu cầu: Chỉ trả về nội dung lời thoại dạng văn bản liên tục, không thêm bớt lời bình luận hay giải thích nào khác."
            )
            print("Transcribing audio using gemini-2.5-flash...")
            response = await loop.run_in_executor(None, lambda: model.generate_content([audio_file, prompt]))
            return response.text.strip()
        except Exception as e:
            raise RuntimeError(f"Lỗi trong quá trình xử lý transcribe bằng Gemini: {e}")
        finally:
            # Delete file from Gemini
            try:
                await loop.run_in_executor(None, lambda: genai.delete_file(audio_file.name))
                print("Deleted remote Gemini audio file.")
            except Exception as ex:
                print(f"Error deleting remote file: {ex}")
            # Delete local file
            try:
                if os.path.exists(filepath):
                    os.remove(filepath)
                    print(f"Deleted local audio file: {filepath}")
            except Exception as ex:
                print(f"Error deleting local file: {ex}")

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
            yt_api = YouTubeTranscriptApi()
            transcript_list = yt_api.list(video_id)
            try:
                transcript = transcript_list.find_transcript(['vi', 'en'])
            except:
                # If neither available, get the first available and translate to 'vi' or just fetch it
                transcript = transcript_list.find_transcript(['vi']) if 'vi' in [t.language_code for t in transcript_list] else transcript_list.find_generated_transcript(['en'])
            
            transcript_data = transcript.fetch()
            # Combine transcript text
            full_text = " ".join([item.text for item in transcript_data])
            data["content"] = full_text
        except Exception as e:
            print(f"Không thể lấy transcript tự động từ Youtube API: {e}. Thử phương án dự phòng (tải audio & chép lời bằng Gemini 1.5)...")
            try:
                transcript_text = await ContentScraper.transcribe_youtube_audio(video_id)
                data["content"] = transcript_text
                print("Lấy transcript thành công qua phương án dự phòng!")
            except Exception as fallback_err:
                print(f"Phương án dự phòng cũng thất bại: {fallback_err}")
                data["content"] = f"(Không thể lấy transcript từ Youtube cho video này.\nChi tiết lỗi ban đầu: {e}\nChi tiết lỗi dự phòng: {fallback_err})"

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
                    
                    base_content = f"Đây là Kênh YouTube (YouTube Channel). Tên kênh: {data['title']}.\n\nMô tả kênh:\n{data['description']}\n\n"
                    
                    # Trích xuất tối đa 5 Video ID gần nhất để lấy transcript (Deep Scrape)
                    video_ids = re.findall(r'{"videoId":"([a-zA-Z0-9_-]{11})"', resp.text)
                    unique_ids = list(dict.fromkeys(video_ids))[:5]
                    
                    if unique_ids:
                        base_content += "--- NỘI DUNG/KỊCH BẢN CỦA CÁC VIDEO GẦN ĐÂY NHẤT (DÙNG ĐỂ DEEP DIVE PHÂN TÍCH NHƯ NOTEBOOKLM) ---\n"
                        yt_api = YouTubeTranscriptApi()
                        for vid in unique_ids:
                            try:
                                t_list = yt_api.list(vid)
                                try:
                                    t = t_list.find_transcript(['vi', 'en'])
                                except:
                                    t = t_list.find_transcript(['vi']) if 'vi' in [x.language_code for x in t_list] else t_list.find_generated_transcript(['en'])
                                t_data = t.fetch()
                                full_text = " ".join([item.text for item in t_data])
                                base_content += f"\n[Nội dung Video ID: {vid}]:\n{full_text}\n"
                            except Exception as e:
                                base_content += f"\n[Video ID: {vid}]: (Không lấy được phụ đề)\n"
                    else:
                        base_content += "(Hệ thống không tìm thấy video nào để lấy kịch bản, chỉ có thể phân tích dựa trên Mô tả kênh)."
                        
                    data["content"] = base_content
                else:
                    data["content"] = "(Không thể trích xuất metadata từ kênh này, có thể cấu trúc trang đã thay đổi.)"
        except Exception as e:
            data["content"] = f"(Lỗi khi lấy dữ liệu kênh Youtube: {e})"
            
        return data

    @staticmethod
    def _extract_phones(text: str) -> List[str]:
        """Extract Vietnamese phone numbers from text."""
        patterns = re.findall(r'(?:(?:\+84|0)\d{9,10})', text)
        return list(set(patterns))[:5]

    @staticmethod
    def _extract_emails(text: str) -> List[str]:
        """Extract email addresses from text."""
        patterns = re.findall(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)
        return list(set(patterns))[:5]

    @staticmethod
    def _extract_social_links(soup) -> Dict[str, str]:
        """Extract social media links from HTML."""
        socials = {}
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            if 'facebook.com' in href and 'facebook' not in socials:
                socials['facebook'] = href
            elif 'instagram.com' in href and 'instagram' not in socials:
                socials['instagram'] = href
            elif 'tiktok.com' in href and 'tiktok' not in socials:
                socials['tiktok'] = href
            elif 'linkedin.com' in href and 'linkedin' not in socials:
                socials['linkedin'] = href
            elif 'youtube.com' in href and 'youtube' not in socials:
                socials['youtube'] = href
            elif 'zalo.me' in href and 'zalo' not in socials:
                socials['zalo'] = href
        return socials

    @staticmethod
    async def get_facebook_page_data(url: str) -> Dict[str, Any]:
        """Scrape Facebook fanpage — extract page info from public HTML."""
        data = {
            "platform": "facebook",
            "url": url,
            "title": "",
            "description": "",
            "thumbnail_url": "",
            "author": "",
            "content": ""
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
        }
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(url, headers=headers, timeout=15.0)
                soup = BeautifulSoup(resp.text, 'html.parser')
                
                # Extract from OG meta tags (most reliable for Facebook pages)
                og_title = soup.find("meta", property="og:title")
                og_desc = soup.find("meta", property="og:description")
                og_image = soup.find("meta", property="og:image")
                og_site = soup.find("meta", property="og:site_name")
                
                data["title"] = og_title.get("content", "") if og_title else ""
                data["description"] = og_desc.get("content", "") if og_desc else ""
                data["thumbnail_url"] = og_image.get("content", "") if og_image else ""
                data["author"] = og_site.get("content", "Facebook") if og_site else "Facebook"
                
                # Build content from available data
                content_parts = []
                content_parts.append(f"Đây là Fanpage Facebook: {data['title']}")
                if data['description']:
                    content_parts.append(f"Mô tả: {data['description']}")
                
                # Extract visible text (limited due to FB's JS rendering)
                for element in soup(["script", "style", "noscript"]):
                    element.decompose()
                body_text = soup.get_text(separator='\n', strip=True)
                # Filter meaningful lines
                lines = [l.strip() for l in body_text.split('\n') if len(l.strip()) > 30]
                if lines:
                    content_parts.append("\n--- NỘI DUNG TRANG ---")
                    content_parts.append("\n".join(lines[:50]))  # Limit to 50 lines
                
                # Extract contact info
                phones = ContentScraper._extract_phones(body_text)
                emails = ContentScraper._extract_emails(body_text)
                if phones:
                    content_parts.append(f"\nSố điện thoại: {', '.join(phones)}")
                if emails:
                    content_parts.append(f"Email: {', '.join(emails)}")
                
                data["content"] = "\n".join(content_parts)
                
        except Exception as e:
            data["content"] = f"(Lỗi khi lấy dữ liệu Facebook Fanpage: {e})"
        
        return data

    @staticmethod
    async def get_ecommerce_data(url: str) -> Dict[str, Any]:
        """Scrape ecommerce product pages (Shopee, Lazada, Tiki)."""
        data = {
            "platform": "ecommerce",
            "url": url,
            "title": "",
            "description": "",
            "thumbnail_url": "",
            "author": "",
            "content": ""
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(url, headers=headers, timeout=15.0)
                soup = BeautifulSoup(resp.text, 'html.parser')
                
                # OG meta (works for most ecommerce)
                og_title = soup.find("meta", property="og:title")
                og_desc = soup.find("meta", property="og:description")
                og_image = soup.find("meta", property="og:image")
                
                data["title"] = og_title.get("content", "") if og_title else (soup.find('title').text.strip() if soup.find('title') else "")
                data["description"] = og_desc.get("content", "") if og_desc else ""
                data["thumbnail_url"] = og_image.get("content", "") if og_image else ""
                
                # Detect platform
                platform_name = "Ecommerce"
                if "shopee" in url.lower():
                    platform_name = "Shopee"
                elif "lazada" in url.lower():
                    platform_name = "Lazada"
                elif "tiki" in url.lower():
                    platform_name = "Tiki"
                
                content_parts = [f"Đây là sản phẩm/shop trên {platform_name}: {data['title']}"]
                if data['description']:
                    content_parts.append(f"Mô tả: {data['description']}")
                
                # Try to extract price, rating from structured data (JSON-LD)
                for script in soup.find_all('script', type='application/ld+json'):
                    try:
                        import json
                        ld_data = json.loads(script.string)
                        if isinstance(ld_data, dict):
                            if ld_data.get('@type') == 'Product':
                                name = ld_data.get('name', '')
                                if name:
                                    content_parts.append(f"Tên sản phẩm: {name}")
                                offers = ld_data.get('offers', {})
                                if isinstance(offers, dict):
                                    price = offers.get('price', offers.get('lowPrice', ''))
                                    currency = offers.get('priceCurrency', 'VND')
                                    if price:
                                        content_parts.append(f"Giá: {price} {currency}")
                                rating = ld_data.get('aggregateRating', {})
                                if isinstance(rating, dict):
                                    content_parts.append(f"Đánh giá: {rating.get('ratingValue', '?')}/5 ({rating.get('reviewCount', '?')} reviews)")
                    except:
                        pass
                
                data["content"] = "\n".join(content_parts)
                data["platform"] = platform_name.lower()
                
        except Exception as e:
            data["content"] = f"(Lỗi khi lấy dữ liệu {url}: {e})"
        
        return data

    @staticmethod
    async def get_website_data(url: str) -> Dict[str, Any]:
        """Enhanced website scraper with structured metadata extraction."""
        data = {
            "platform": "website",
            "url": url,
            "title": "",
            "description": "",
            "thumbnail_url": "",
            "author": "",
            "content": "",
            "metadata": {}  # Structured metadata
        }

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(url, headers=headers, timeout=15.0)
                resp.raise_for_status()
                
                soup = BeautifulSoup(resp.text, 'html.parser')
                full_text = resp.text
                
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
                
                # ── ENHANCED: Extract structured metadata ──
                metadata = {}
                
                # Phone numbers
                phones = ContentScraper._extract_phones(full_text)
                if phones:
                    metadata["phones"] = phones
                
                # Emails  
                emails = ContentScraper._extract_emails(full_text)
                if emails:
                    metadata["emails"] = emails
                
                # Social links
                social_links = ContentScraper._extract_social_links(soup)
                if social_links:
                    metadata["social_links"] = social_links
                
                # Address (common Vietnamese patterns)
                for addr_tag in soup.find_all(['address', 'p', 'span', 'div'], class_=re.compile(r'address|location|dia-chi', re.I)):
                    addr_text = addr_tag.get_text(strip=True)
                    if len(addr_text) > 10 and len(addr_text) < 200:
                        metadata["address"] = addr_text
                        break
                
                # About/Introduction section
                about_section = soup.find(id=re.compile(r'about|gioi-thieu|ve-chung-toi', re.I)) or \
                                soup.find(class_=re.compile(r'about|gioi-thieu|ve-chung-toi', re.I))
                if about_section:
                    about_text = about_section.get_text(separator=' ', strip=True)[:1000]
                    metadata["about"] = about_text
                
                data["metadata"] = metadata
                
                # ── Main content extraction ──
                for element in soup(["script", "style", "nav", "footer", "header", "aside"]):
                    element.decompose()
                
                main_content = soup.find("article") or soup.find("main") or soup.body
                if main_content:
                    text = main_content.get_text(separator='\n', strip=True)
                    lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 20]
                    
                    # Prepend structured metadata to content for AI consumption
                    structured_prefix = ""
                    if metadata.get("phones"):
                        structured_prefix += f"Số điện thoại: {', '.join(metadata['phones'])}\n"
                    if metadata.get("emails"):
                        structured_prefix += f"Email: {', '.join(metadata['emails'])}\n"
                    if metadata.get("address"):
                        structured_prefix += f"Địa chỉ: {metadata['address']}\n"
                    if metadata.get("social_links"):
                        structured_prefix += f"Mạng xã hội: {', '.join([f'{k}: {v}' for k,v in metadata['social_links'].items()])}\n"
                    if metadata.get("about"):
                        structured_prefix += f"Giới thiệu: {metadata['about']}\n"
                    
                    data["content"] = structured_prefix + "\n".join(lines)
                
        except Exception as e:
            data["content"] = f"(Lỗi khi lấy dữ liệu trang web: {e})"

        return data

    @staticmethod
    async def scrape_url(url: str) -> Dict[str, Any]:
        """Smart URL router — detect platform and use appropriate scraper."""
        if ContentScraper.is_youtube_channel(url):
            return await ContentScraper.get_youtube_channel_data(url)
        elif ContentScraper.is_youtube_url(url):
            return await ContentScraper.get_youtube_data(url)
        elif ContentScraper.is_facebook_url(url):
            return await ContentScraper.get_facebook_page_data(url)
        elif ContentScraper.is_ecommerce_url(url):
            return await ContentScraper.get_ecommerce_data(url)
        else:
            return await ContentScraper.get_website_data(url)
