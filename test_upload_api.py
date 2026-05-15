import httpx
import asyncio

async def test_upload():
    async with httpx.AsyncClient(timeout=60.0) as client:
        with open("Expert.docx", "rb") as f:
            files = {'files': ("Expert.docx", f, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
            response = await client.post("http://localhost:8000/api/v1/onboarding/upload", files=files)
            print(response.status_code)
            print(response.json())

asyncio.run(test_upload())
