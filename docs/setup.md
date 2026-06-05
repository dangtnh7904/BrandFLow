# Hướng Dẫn Cài Đặt & Triển Khai (Setup & Deployment Guide)

Tài liệu này hướng dẫn cách thiết lập, chạy môi trường Local và triển khai (Deploy) dự án BrandFlow lên Production.

## 1. Môi trường Local (Phát triển)

### 1.1 Backend (FastAPI)
1. Cài đặt Python 3.10+
2. Tạo Virtual Environment và cài đặt thư viện:
   ```bash
   python -m venv venv
   source venv/bin/activate  # (hoặc `venv\Scripts\activate` trên Windows)
   pip install -r requirements.txt
   ```
3. Khởi tạo file `.env` từ `.env.example` (Đảm bảo có `GROQ_API_KEY` và `GEMINI_API_KEY`).
4. Khởi chạy Server Backend:
   ```bash
   python main.py
   # hoặc: uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### 1.2 Frontend (Next.js)
1. Di chuyển vào thư mục frontend: `cd frontend`
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Tạo file `.env.local` ở trong thư mục `frontend`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Chạy Frontend Server:
   ```bash
   npm run dev
   ```

---

## 2. Triển khai lên Production (Deploy)

### 2.1 Lỗi Thường Gặp trên Production
**"Failed to fetch" hoặc "Network Error" ở Frontend:**
- **Nguyên nhân:** Khi build production (Vercel/Netlify/VPS), nếu không cấu hình biến môi trường, frontend sẽ mặc định trỏ về `http://localhost:8000`. Trình duyệt của người dùng (từ máy họ) sẽ cố gọi `localhost` và chắc chắn bị lỗi `failed to fetch`.
- **Cách khắc phục:**
  - Trên bảng điều khiển của Vercel (hoặc nơi host frontend), hãy thêm biến môi trường (Environment Variable) tên là `NEXT_PUBLIC_API_URL` và gán bằng URL của Backend thật. (Ví dụ: `https://api.brandflow.vn`).
  - Trong backend `.env`, cần cấu hình `BRANDFLOW_FRONTEND_URLS=https://brandflow.vn` để mở khóa CORS cho frontend gọi tới.

**"Lỗi Upload File không phân tích được gì":**
- **Nguyên nhân:** Do API `/upload` chưa được kích hoạt ở backend trong các phiên bản trước. (Đã được khắc phục trong phiên bản hiện tại bằng `onboarding_routes`).
- Đảm bảo server backend có quyền ghi (write permission) vào thư mục `temp_uploads` để có thể nhận file tải lên trước khi đưa qua trình AI đọc.

### 2.2 Các bước Deploy Backend
1. Đảm bảo cấu hình biến môi trường trên server production đầy đủ:
   ```env
   GROQ_API_KEY=xxx
   GEMINI_API_KEY=yyy
   BRANDFLOW_FRONTEND_URLS=https://ten-mien-frontend-cua-ban.com
   ```
2. Không chạy bằng `python main.py` mà hãy dùng Gunicorn/Uvicorn để chạy đa luồng:
   ```bash
   gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```
3. Chắc chắn mở port 8000 (hoặc cấu hình Nginx Reverse Proxy trỏ từ domain 443 HTTPS về port 8000).

### 2.3 Các bước Deploy Frontend
1. Build Frontend:
   ```bash
   npm run build
   ```
2. Chạy Frontend Production:
   ```bash
   npm start
   ```
   *(Lưu ý: Nếu deploy Vercel thì chỉ cần liên kết Git, nhập biến `NEXT_PUBLIC_API_URL` và Vercel sẽ tự làm mọi thứ).*

---
## 3. Lưu Ý Cho Đội Ngũ Thực Thi (Team)
- Luôn kiểm tra kỹ Network tab trên DevTools (F12) của trình duyệt. Nếu thấy API URL gọi vào `localhost:8000` khi đang ở trên mạng, tức là frontend build thiếu biến `NEXT_PUBLIC_API_URL`.
- Kể từ bản v2, hệ thống sử dụng thêm Groq (LLaMA3) làm Intake Agent, do đó `GROQ_API_KEY` là bắt buộc phải có để tính năng Upload File / Phân tích DNA hoạt động mượt mà.
