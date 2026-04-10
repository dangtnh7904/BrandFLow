# 🚀 BrandFlow — AI Marketing Strategy Engine (v8.0: 4-Stage Executive Flow)

> **BrandFlow** là hệ thống Multi-Agent AI chuyên nghiệp ứng dụng tư duy **Quy hoạch 4 Giai đoạn (4-Stage Planning)**, tuân thủ nghiêm ngặt G-STIC, và sử dụng cơ chế Tranh luận Bắt buộc (Mandatory Debate) để tự động lập chiến lược marketing hoàn chỉnh.

---

## ✨ Tính Năng Nổi Bật (Cập nhật Kiến trúc Mới)

| Tính năng | Mô tả |
|---|---|
| 🧠 **Hệ thống 4 Giai Đoạn** | Profiling → Chiến lược (Strategic) → Vận hành (Tactical) → Xử lý Cục bộ (Micro-execution). |
| ⚖️ **Mandatory Debate (Tranh luận chéo)** | Customer Persona và CFO kiểm duyệt bắt buộc từng bản nháp của CMO, loại bỏ kế hoạch sai Insight. |
| 💰 **Anti-Hallucination Finance** | CFO bị tước quyền tính tiền thật, chỉ được lập **Tỷ lệ (%)**. `Math Engine` độc lập bằng Python sẽ tính toán ra VND và tạo báo cáo Excel chính xác 100%. |
| 📊 **12 Forms & 7 Forms Chuẩn MKT** | Bản kế hoạch không còn sơ sài. Hệ thống xuất báo cáo Markdown chuyên sâu (Sứ mệnh, SWOT, Ma trận DPM, Gantt Chart, Dự phóng P&L). |
| 🎯 **Single Source of Truth** | Mọi điểm chạm truyền thông đều bị ép phải soi chiếu lại `Master Brand Profile` sinh ra ở Đầu vào. |
| 🖥️ **Executive Dashboard (Frontend)** | Giao diện 4 Trụ Cột hiển thị UI/UX như một bảng báo cáo lãnh đạo cấp C-level thực thụ. |

---

## 🏗️ Kiến Trúc Hệ Thống mới: 4-Stage Executive Flow

**Triết lý:** Phân rã luồng công việc để tiết kiệm Token Context (Token Optimization), tách biệt AI sáng tạo và tính toán bằng toán học thuần túy.

```
[User Input: Ngành, Mục tiêu, Ngân sách...]
     │
     ▼
┌───────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 1: AUTO-PROFILING (CMO)                         │
│ Tổng hợp Brand DNA, USP và sinh ra [Persona Prompt]       │
└──────────────────────┬────────────────────────────────────┘
                       │ Master Brand Profile
                       ▼
┌───────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 2: STRATEGIC DEBATE (6-12 Tháng)                │
│ 1. CMO đúc 12 Forms Chiến Lược (G-STIC, SWOT, Định vị)    │
│ 2. Customer Persona kiểm duyệt Insight / CFO Check Căn bản│
└──────────────────────┬────────────────────────────────────┘
                       │ Strategic Blueprint
                       ▼
┌───────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 3: TACTICAL CAMPAIGN & EXACT BUDGETING (1-3 Th) │
│ 1. CMO lên Lịch trình Touchpoints (7 Forms Vận hành)      │
│ 2. CFO chỉ định % Ngân sách (Ép trích 10-15% Rủi ro)      │
│ 3. [MATH ENGINE] nhân % với Tổng Ngân Sách = Tiền VNĐ     │
└──────────────────────┬────────────────────────────────────┘
                       │ (API /api/v1/planning/intake)
                       ▼
┌───────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 4: MICRO-EXECUTION (API riêng biệt)             │
│ User gọi lệnh sinh bài post/Tiktok dựa cứng vào Brand DNA │
│ Persona chấm điểm mức độ hấp dẫn (1-10)                   │
└───────────────────────────────────────────────────────────┘
```

---

## 📋 Hướng Dẫn Sử Dụng

### 1. Khởi động Backend (FastAPI)

Mở Terminal 1 (Tại thư mục gốc BrandFlow):
```bash
# Kích hoạt môi trường (Windows)
.\venv\Scripts\activate  

# Cài đặt thư viện mới (Pandas, Openpyxl cho Excel)
pip install -r requirements.txt

# Khởi động Sever
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Docs có thể xem tại: **http://localhost:8000/docs**

### 2. Khởi động Frontend (React + Vite)

Mở Terminal 2:
```bash
cd frontend

# Khởi động giao diện Dashboard
npm run dev
```
Truy cập: **http://localhost:5173**

### 3. Quy trình Trải nghiệm trên UI:
1. Mở màn hình **Tạo Dự Án (Upload/Intake)**.
2. Nhập thông tin, Tên Chiến Dịch, Ngân sách tổng.
3. Chờ AI chạy xong `4-Stage Flow` và chiêm ngưỡng giao diện báo cáo **4 Trụ Cột (4 Pillars)**.
4. Nếu chưa ưng ý thông điệp, dùng Hộp Chỉ Thị AI (CEO Directives) để hạ lệnh Tái cơ cấu (Re-Plan).

### 4. Tính năng Xuất Báo Cáo
- **Excel Report**: File `.xlsx` chứa dự phóng P&L và Ngân sách chi tiết được Math Engine tự động xuất ra trong thư mục `./outputs`.
- **Kanban / PDF**: Có thể ấn nút Export từ giao diện React.

---

## 💻 Micro-execute API (Giai đoạn 4)
Để thử nghiệm tính năng tạo mảnh Content rời rạc tuân thủ Brand DNA chuẩn, dùng Postman hoặc Terminal gọi:
```bash
POST /api/v1/planning/micro-execute
Body (JSON):
{
  "brand_dna": "Vẻ đẹp thuần khiết",
  "usp": "100% Thuần chay",
  "persona_prompt": "Bạn là nữ 25t...",
  "command": "Viết kịch bản Tiktok giới thiệu Son dưỡng"
}
```

---

## 📝 Nhật Ký Cập Nhật (Gần nhất)
- **Cập nhật Prompts (`agents_core.py`)**: Tối ưu token, bổ sung yêu cầu định tính (Bắt buộc bình luận Tại sao?). CFO bị tước quyền tính toán tiền.
- **Pipeline Mới (`workflow_graph.py`)**: Chia hệ thống thành 4 giai đoạn cắt lớp rõ rệt.
- **Frontend Dashboard mới**: Áp dụng thư viện `marked.js` render Markdown trực tiếp. Tách Dashboard thành 4 Trụ hiển thị dữ liệu Master Plan và Phản hồi CFO sinh động.

---
*Phát triển bởi đội ngũ BrandFlow AI.*
