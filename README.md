# BrandFlow 2.0 - B2B Deterministic Marketing Strategy Engine

BrandFlow là hệ thống Multi-Agent AI chuyên dụng để thiết kế, phản biện, và lập kế hoạch Marketing B2B bài bản dựa trên quy trình 10 bước chuẩn B2B.

## 🧠 Kiến trúc Mạng Đa tác vụ (Multi-Agent DAG)

Để ngăn chặn tuyệt đối hiện tượng AI bị "ảo giác toán học" và vi phạm nguyên tắc "Chiến lược đi trước, Chiến thuật đi sau" (Strategy First), BrandFlow 2.0 phân tách hệ thống thành 5 Giai đoạn nối tiếp (Sequential/Deterministic Pipeline) đan xen giữa LLM và Code logic thuần:

1. **Phase 1 (Goal Setting)**: Trí tuệ CMO thiết lập Sứ mệnh cốt lõi và các lằn ranh đỏ (Red lines) doanh nghiệp tuyệt đối không được vi phạm.
2. **Phase 2 (Situation Audit)**: CMO chia tệp khách hàng theo Needs-based Audience (Pain-points & Động lực), chọn và gán trọng số cho bộ Critical Success Factors (CSFs).
3. **Python Math Engine (Toán học độc lập)**: Code Python thuần (`math_engine.py`) tiến hành nhân chia tính toán tổng điểm Cạnh tranh (Weighted SWOT Score) và Khoảng trống doanh thu (Gap Analysis). *Cắt đứt sự ảo giác của AI trong việc cộng trừ tiền tệ*.
4. **Phase 3 (Strategy Formulation)**: CMO dùng số liệu Gap Analysis chọn chiến lược vĩ mô Ansoff (Thâm nhập thị trường, Đa dạng hóa...).
5. **Phase 4 (Tactical & Budgeting)**: CMO bung bảng khối lượng công việc, gắn tag MoSCoW. Ngay lập tức, Python Interceptor thực hiện chức năng "Kiểm toán viên" chém bỏ hoặc cắt giảm (ép giá) nhóm công việc `COULD_HAVE` nếu vượt ngân sách gốc.
6. **Phase 5 (Cross-functional Review)**: Giám đốc Tài chính AI (CFO) thiết lập phương án dự phòng (Downside Risk) cho các nhánh rủi ro. Khách hàng ảo (Persona) soát lỗi "Ngáo giá trị" của bảng chiến thuật. 

## 🚀 Khởi động Fullstack bằng 1-Click

Để rút ngắn thời gian khởi động môi trường Test:
1. Đảm bảo cấu hình file `.env` dựa trên file mẫu `.env.example`:
   - Chuẩn bị API key (`GROQ_API_KEY`)
   - `BRANDFLOW_FRONTEND_URLS="http://localhost:3000"`
2. Chạy file **`start_fullstack.bat`** (Windows) từ thư mục gốc. 
   - Tab 1: Boot thuật toán Backend (FastAPI - Port 8000).
   - Tab 2: Boot giao diện Frontend (Next.js - Port 3000).

## 🧰 Tech Stack
* **Backend**: Python 3.9+, FastAPI, LangChain, Groq LLM (LLAMA-3.3-70B & 8B).
* **Frontend**: Next.js, TailwindCSS (Light Theme), Lucide Icons.
* **Vector Database**: ChromaDB (Lưu trữ luật chơi và Identity Guidelines).
