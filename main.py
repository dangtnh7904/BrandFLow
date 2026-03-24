import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import HTMLResponse
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from schemas import PresetRequest, InterviewRequest
from memory_rag import inject_industry_presets, generate_guideline_from_qa, analyze_and_extract_dna
from document_processor import DocumentIngestor
from pydantic import BaseModel
import os
import uuid

app = FastAPI(
    title="BrandFlow APIs",
    description="APIs for BrandFlow Memory and RAG Strategy Engine.",
    version="1.0.0"
)

# Thêm CORS Middleware để cho phép Frontend (Vite/NextJS) gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong thực tế nên để ["http://localhost:3000", "http://localhost:3001"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def home():
    html_content = """
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>BrandFlow PDF Tester</title>
        <style>
            body { font-family: Inter, Arial, sans-serif; margin: 40px; background-color: #f4f4f9; }
            .container { max-width: 900px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            h2 { color: #333; text-align: center; }
            input[type="file"] { margin: 15px 0; font-size: 16px; }
            button { background: #4CAF50; color: white; padding: 12px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; width: 100%; transition: 0.3s; }
            button:hover { background: #45a049; }
            pre { background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; max-height: 500px; overflow-y: auto; font-size: 15px; line-height: 1.5; }
            .loader { display: none; margin-top: 15px; color: #ff5722; font-weight: bold; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🚀 Trình Kiểm Tra Đọc PDF</h2>
            <p style="text-align: center; color: #666;">Tải lên các file PDF của bạn để xem code đọc chữ được đến đâu.</p>
            <form id="uploadForm">
                <input type="file" id="fileInput" name="files" multiple accept=".pdf,.txt,.docx" required />
                <br />
                <div style="display: flex; gap: 10px;">
                    <button type="submit" style="flex: 1;">🔍 Chỉ đọc thử Text</button>
                    <button type="button" id="btnStore" style="flex: 1; background: #ff9800;">💾 Lưu vào Bộ não (ChromaDB)</button>
                </div>
            </form>

            <div style="margin-top: 20px; padding: 10px; background: #e3f2fd; border-radius: 5px; border: 1px solid #90caf9; font-size: 14px;">
                <b>📊 Trạng thái Database:</b> <span id="dbStats">Đang tải...</span>
            </div>


            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #ddd;" />
            <h3 style="text-align: center; color: #333;">🔗 Hoặc Lấy Dữ Liệu Từ Website</h3>
            <form id="urlForm">
                <input type="url" id="urlInput" placeholder="Nhập link web (vd: https://vnexpress.net)" style="width: 100%; padding: 12px; font-size: 16px; margin: 10px 0; box-sizing: border-box; border-radius: 5px; border: 1px solid #ccc;" required />
                <button type="submit" style="background: #2196F3;">Tải dữ liệu Web</button>
            </form>

            <div class="loader" id="loader">⏳ Đang xử lý dữ liệu...</div>
            <h3 style="margin-top: 30px;">Kết quả:</h3>
            <pre id="result">Chưa có thông tin</pre>
        </div>
        <script>
            async function refreshStats() {
                try {
                    const response = await fetch('/api/v1/onboarding/stats');
                    const data = await response.json();
                    document.getElementById('dbStats').textContent = `${data.count} mảnh trí nhớ (Chunks)`;
                } catch (e) {
                    document.getElementById('dbStats').textContent = 'Lỗi';
                }
            }
            refreshStats();

            // Xử lý nốt Store
            document.getElementById('btnStore').addEventListener('click', async () => {
                const fileInput = document.getElementById('fileInput');
                if (fileInput.files.length === 0) return alert('Chọn file trước!');
                
                const formData = new FormData();
                for (let file of fileInput.files) formData.append('files', file);

                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang băm nhỏ và lưu vào ChromaDB dùng Ollama...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/upload', { method: 'POST', body: formData });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    refreshStats();
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi: ' + error.message;
                }
            });

            document.getElementById('uploadForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const fileInput = document.getElementById('fileInput');
                if (fileInput.files.length === 0) return;
                
                const formData = new FormData();
                for (let file of fileInput.files) {
                    formData.append('files', file);
                }

                
                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang chờ máy chủ xử lý...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/test-upload', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    if(data.data) {
                        document.getElementById('result').textContent = JSON.stringify(data.data, null, 2);
                    } else {
                        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi kết nối: ' + error.message;
                }
            });

            document.getElementById('urlForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const urlInput = document.getElementById('urlInput').value.trim();
                if (!urlInput) return;
                
                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang tải trang web và thu thập dữ liệu...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/test-url', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({urls: [urlInput]})
                    });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    if(data.data) {
                        document.getElementById('result').textContent = JSON.stringify(data.data, null, 2);
                    } else {
                        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi kết nối: ' + error.message;
                }
            });
        </script>
    </body>
    </html>
    """
    return html_content

@app.post("/api/v1/onboarding/presets")
async def onboarding_presets(request: PresetRequest):
    """
    Nạp bộ quy chuẩn ngành có sẵn (F&B, Spa_Beauty, B2B_Tech) vào hệ thống (ChromaDB).
    """
    try:
        result = inject_industry_presets(request.industry)
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/api/v1/onboarding/interview")
async def onboarding_interview(request: InterviewRequest):
    """
    Sinh ra quy tắc marketing (Brand Guidelines) từ kết quả phỏng vấn và lưu vào hệ thống (ChromaDB).
    """
    try:
        result = generate_guideline_from_qa(request.answers)
        if result.get("status") == "error":
             raise HTTPException(status_code=400, detail=result.get("message"))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/api/v1/onboarding/test-upload")
async def test_upload_extract_only(
    files: List[UploadFile] = File(...),
    force_ai: bool = Form(False)
):
    """
    API test: Nhận file và trả về text trích xuất được để kiểm tra nhận diện PDF, 
    KHÔNG lưu ChromaDB, KHÔNG gọi AI (tránh tốn token).
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    try:
        temp_dir = "./temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        
        ingestor = DocumentIngestor()
        results = {}
        
        for file in files:
            unique_filename = f"{uuid.uuid4()}_{file.filename}"
            temp_file_path = os.path.join(temp_dir, unique_filename)
            
            with open(temp_file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
                
            raw_text = ingestor.ingest_file(temp_file_path, force_ai=force_ai)
            cleaned_text = ingestor.clean_text(raw_text)
            
            results[file.filename] = {
                "cleaned_text": cleaned_text
            }
            
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                
        return {"status": "success", "data": results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý file: {str(e)}")

class UrlRequestCustom(BaseModel):
    urls: List[str]

@app.post("/api/v1/onboarding/test-url")
def test_url_extract_only(request: UrlRequestCustom):
    """
    API test: Nhận URL và trả về text thu thập được từ trang đích.
    """
    if not request.urls:
        raise HTTPException(status_code=400, detail="Không có URL nào được gửi lên.")

    try:
        ingestor = DocumentIngestor()
        results = {}
        for url in request.urls:
            raw_text = ingestor.ingest_url(url)
            cleaned_text = ingestor.clean_text(raw_text)
            results[url] = {
                "cleaned_text": cleaned_text
            }
        return {"status": "success", "data": results}
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý URL: {str(e)}")

@app.post("/api/v1/onboarding/upload")
async def onboarding_upload(files: List[UploadFile] = File(...)):
    """
    Nhận file, băm nhỏ và lưu vào ChromaDB (Bộ não thương hiệu).
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    try:
        temp_dir = "./temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        ingestor = DocumentIngestor()
        
        for file in files:
            unique_filename = f"{uuid.uuid4()}_{file.filename}"
            temp_file_path = os.path.join(temp_dir, unique_filename)
            
            with open(temp_file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # 1. Bóc tách
            raw_text = ingestor.ingest_file(temp_file_path)
            # 2. Lưu vào ChromaDB
            ingestor.process_and_store_text(raw_text=raw_text, filename=file.filename, category="brand_guidelines")

            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                
        return {"status": "success", "message": f"Đã lưu thành công {len(files)} tài liệu vào ChromaDB."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/onboarding/stats")
def get_db_stats():
    """Lấy thống kê số lượng bản ghi trong database."""
    try:
        from document_processor import DocumentIngestor
        ingestor = DocumentIngestor()
        from langchain_chroma import Chroma
        vectorstore = Chroma(
            collection_name="brandflow_memory",
            embedding_function=ingestor.embeddings,
            persist_directory=ingestor.persist_directory
        )
        return {"status": "success", "count": vectorstore._collection.count()}
    except Exception as e:
        return {"status": "error", "message": str(e), "count": 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True, 
        reload_excludes=["./temp_uploads/*", "./chroma_db/*"]
    )
