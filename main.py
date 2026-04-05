import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':

    sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import HTMLResponse
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from schemas import PresetRequest, InterviewRequest, RawInputRequest, RefineRequest
from memory_rag import inject_industry_presets, generate_guideline_from_qa, analyze_and_extract_dna
from intake_agent import analyze_raw_input, check_required_info, extract_document_summary
from workflow_graph import run_pipeline, run_refinement_pipeline
from document_processor import DocumentIngestor
from pydantic import BaseModel
import os
import uuid
import asyncio
from mock_manager import parse_mock_md

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

@app.post("/api/v1/onboarding/upload-url")
def onboarding_upload_url(request: UrlRequestCustom):
    """
    Nhận tập hợp URL, bóc tách nội dung HTML và lưu rải rác vào ChromaDB.
    """
    if not request.urls:
        raise HTTPException(status_code=400, detail="Không có URL nào gửi lên.")
    try:
        ingestor = DocumentIngestor()
        count = 0
        for url in request.urls:
            raw_text = ingestor.ingest_url(url)
            ingestor.process_and_store_text(raw_text=raw_text, filename=url, category="brand_guidelines")
            count += 1
        return {"status": "success", "message": f"Đã lưu thành công {count} URL vào ChromaDB."}
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

@app.post("/api/v1/onboarding/extract-summary")
async def onboarding_extract_summary(files: List[UploadFile] = File(...)):
    """
    Nhận file, đọc nội dung và trả về tóm tắt ngắn gọn thông qua Gemini.
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    try:
        temp_dir = "./temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        from document_processor import DocumentIngestor
        ingestor = DocumentIngestor()
        
        combined_text = ""
        for file in files:
            unique_filename = f"{uuid.uuid4()}_{file.filename}"
            temp_file_path = os.path.join(temp_dir, unique_filename)
            
            with open(temp_file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            raw_text = ingestor.ingest_file(temp_file_path)
            combined_text += raw_text + "\n"
            
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                
        # Phân tích qua LLM Gemini
        summary_data = extract_document_summary(combined_text)
        return {"status": "success", "data": summary_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/planning/intake")
async def process_intake(request: RawInputRequest):
    """
    Intake Agent: Bóc tách ngôn ngữ tự nhiên, kiểm tra ràng buộc ngân sách/ngành hàng.
    Nếu đủ thì chạy Multi-Agent AI (Planner -> CFO -> Persona).
    """
    try:
        raw_text = request.raw_text
        
        # --- SECRET MOCK MODE INTERCEPTOR ---
        secret_keywords = ["hương viên trà quán", "mã demo 1"]
        if any(keyword in raw_text.lower() for keyword in secret_keywords):
            print("🕵️‍♂️ [MOCK MODE] Kích hoạt dữ liệu giả lập an toàn do có nhắc tới từ khóa...")
            await asyncio.sleep(5)  # Trễ 5s giả lập AI thinking để hiện Loading Spinner trên UI
            
            mock_file = "mock_data/huong_vien_tra.md"
            mock_result = parse_mock_md(mock_file)
            
            plan = mock_result["final_plan"]
            
            if isinstance(plan, str):
                import json
                try:
                    plan = json.loads(plan)
                except json.JSONDecodeError:
                    plan = {}
            
            # Tính lại cost thực tế theo plan mock
            actual_cost = 0
            for phase in plan.get("activity_and_financial_breakdown", []):
                for act in phase.get("activities", []):
                    actual_cost += int(act.get("cost_vnd", 0))
                    
            print("✅ Đủ thông tin, bắt đầu gọi MasterPlanner (MOCK MODE)...")
            
            campaign_name = plan.get("executive_summary", {}).get("campaign_name", "Chiến dịch (Mock)")
            full_mock_logs = [
                {"agent": "CMO", "role": "Giám đốc Marketing", "message": f"Chào các vị lãnh đạo và khách hàng! Giám đốc Marketing xin phép trình bày tóm tắt kế hoạch '{campaign_name}'.\n\nChiến dịch sẽ đi qua 3 giai đoạn: Khơi Hương (Teasing), Tỏa Trà (Traffic), và Lưu Phai (Loyalty). Trọng tâm lớn nhất nằm ở tháng 6, chúng ta sẽ mạnh tay book 3 Mega-TikToker tới thưởng trà và làm video review. Mức đầu tư cho riêng hạng mục KOL này là 30 triệu đồng. Tổng ngân sách tôi xin duyệt là {actual_cost + 5000000:,} VND. Mọi người có ý kiến gì không?"},
                {"agent": "SYSTEM", "role": "Hệ thống Kiểm toán", "message": f"Cảnh báo tự động: Hệ thống ghi nhận ngân sách Marketing đề xuất đã cao hơn so với hạn mức hiện tại. Cần các sếp và đại diện khách hàng vào phiên tòa phản biện để điều chỉnh lại cấu trúc vốn."}
            ]
            full_mock_logs.extend(mock_result["agent_logs"])

            return {
                "status": "success",
                "is_approved": True,
                "iteration_count": 2,
                "actual_total_cost": actual_cost,
                "plan": plan,
                "agent_logs": full_mock_logs
            }
        # ------------------------------------

        # 1. Bóc tách
        parsed_data = analyze_raw_input(raw_text)
        
        # Override budget nếu Frontend gửi lên giá trị cố định
        if request.budget and request.budget >= 1000000:
            parsed_data["budget"] = request.budget
        
        # 2. Kiểm tra
        check_result = check_required_info(parsed_data)
        
        # 3. Trả về câu hỏi nếu thiếu thông tin
        if check_result.get("status") == "clarification_needed":
            return check_result
            
        # 4. Đủ thông tin -> Gọi Pipeline tuyến tính (v7)
        print("✅ Đủ thông tin, bắt đầu gọi Pipeline Deterministic...")
        
        result = run_pipeline(
            goal=parsed_data.get("goal", request.raw_text),
            industry=parsed_data.get("industry", "General"),
            budget=parsed_data.get("budget", 0),
            target_audience=parsed_data.get("target_audience", ""),
            constraints=parsed_data.get("special_constraints", ""),
        )
        
        return {
            "status": "success",
            "is_approved": True,
            "iteration_count": 1,
            "actual_total_cost": result.get("actual_total_cost", 0),
            "plan": result["final_plan"],
            "agent_logs": result["agent_logs"]
        }
    except Exception as e:
        print(f"🔴 [INTAKE] Lỗi hệ thống nghiêm trọng: {e}")
        # Trả về payload JSON chuẩn để Frontend xử lý được (tắt loading, hiện thông báo lỗi)
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "message": "Hệ thống AI đang quá tải hoặc gặp sự cố, vui lòng thử lại sau giây lát.",
            "debug_info": str(e)
        })

@app.post("/api/v1/planning/refine")
async def process_refine(request: RefineRequest):
    """
    Endpoint mới: Nhận phản hồi từ user và plan cũ, chạy lại refinement pipeline.
    """
    try:
        print(f"\n[REFINE API] Receive feedback: {request.feedback}")
        
        result = run_refinement_pipeline(
            previous_plan=request.previous_plan,
            feedback=request.feedback,
            budget=request.budget
        )
        
        return {
            "status": "success",
            "is_approved": True,
            "actual_total_cost": result.get("actual_total_cost", 0),
            "plan": result["final_plan"],
            "agent_logs": result["agent_logs"]
        }
    except Exception as e:
        print(f"🔴 [REFINE API] Lỗi xử lý feedback: {e}")
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "message": "AI gặp sự cố khi đang phân tích lại kế hoạch. Vui lòng thử lại.",
            "debug_info": str(e)
        })

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
