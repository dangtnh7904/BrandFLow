import asyncio
import httpx
import re
import json

async def test():
    url = "https://www.youtube.com/@Fireship"
    async with httpx.AsyncClient(follow_redirects=True) as client:
        resp = await client.get(url, timeout=15.0)
        video_ids = re.findall(r'{"videoId":"([a-zA-Z0-9_-]{11})"', resp.text)
        # Unique preserve order
        unique_ids = list(dict.fromkeys(video_ids))
        print("Found video IDs:", unique_ids[:5])

asyncio.run(test())
