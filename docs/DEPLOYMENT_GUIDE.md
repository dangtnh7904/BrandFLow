# 🚀 BrandFlow — Hướng Dẫn Triển Khai (Deployment Guide)

> **Tài liệu nội bộ** — Dành cho Dev Team  
> **Cập nhật:** 2026-06-05  
> **Tác giả:** BrandFlow Engineering

---

## Mục lục

1. [Tổng quan Kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Yêu cầu Môi trường](#2-yêu-cầu-môi-trường)
3. [Chạy Local (Development)](#3-chạy-local-development)
4. [Deploy Backend (Railway)](#4-deploy-backend-railway)
5. [Deploy Frontend (Vercel)](#5-deploy-frontend-vercel)
6. [Cấu hình Environment Variables](#6-cấu-hình-environment-variables)
7. [Checklist Trước Khi Go-Live](#7-checklist-trước-khi-go-live)
8. [Xử Lý Sự Cố (Troubleshooting)](#8-xử-lý-sự-cố-troubleshooting)
9. [Lưu Ý Bảo Mật](#9-lưu-ý-bảo-mật)

---

## 1. Tổng quan Kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                       INTERNET                              │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
   ┌─────────▼──────────┐     ┌──────────▼──────────────┐
   │   FRONTEND (Vercel) │     │  BACKEND (Railway)      │
   │   Next.js 15        │────▶│  FastAPI + Gunicorn     │
   │   Port: 443 (HTTPS) │     │  Port: 8000             │
   │                     │     │                         │
   │   Rewrites:         │     │  Routers:               │
   │   /api/v1/* → BE    │     │  ├─ /api/v1/auth        │
   │                     │     │  ├─ /api/v1/onboarding  │
   │   Direct calls:     │     │  ├─ /api/v1/planning    │
   │   /api/content-lab  │     │  ├─ /api/v1/design      │
   │   /api/v1/design    │     │  ├─ /api/v1/agents      │
   └─────────────────────┘     │  ├─ /api/content-lab    │
                               │  └─ /api/v1/audit       │
                               │                         │
                               │  Database: SQLite       │
                               │  AI: Gemini + Groq      │
                               └─────────────────────────┘
```

**Luồng dữ liệu:**
- Frontend gọi API theo 2 kiểu:
  - **Qua Next.js Rewrites** (cấu hình trong `next.config.ts`): `/api/v1/*` → proxy tới Backend
  - **Gọi trực tiếp**: Một số trang (Content Lab, Design Studio, Daily Content) gọi thẳng `${NEXT_PUBLIC_API_URL}/api/...`

---

## 2. Yêu cầu Môi trường

### Backend (Python)
| Phần mềm | Phiên bản tối thiểu |
|---|---|
| Python | 3.11+ |
| pip | 23.0+ |
| SQLite | 3.35+ (có sẵn trong Python) |

### Frontend (Node.js)
| Phần mềm | Phiên bản tối thiểu |
|---|---|
| Node.js | 18.17+ (khuyến nghị 20 LTS) |
| npm | 9.0+ |

### API Keys (BẮT BUỘC)
| Key | Mục đích | Lấy ở đâu |
|---|---|---|
| `GEMINI_API_KEY` | LLM chính (Gemini Pro) | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GROQ_API_KEY` | LLM phụ (Llama/Mixtral qua Groq) | [Groq Console](https://console.groq.com/keys) |

---

## 3. Chạy Local (Development)

### Cách 1: Script tự động (Windows)
```bash
# Từ thư mục gốc BrandFlow/
start_fullstack.bat
```
Script này tự động:
- Tạo `temp_uploads/` nếu chưa có
- Bật Backend (port 8000)
- Bật Frontend (port 3000)
- Mở browser tại `http://localhost:3000`

### Cách 2: Chạy tay (mọi OS)

**Terminal 1 — Backend:**
```bash
cd BrandFlow/
pip install -r requirements.txt
python main.py
# → API chạy tại http://localhost:8000
# → Swagger UI: http://localhost:8000/docs
```

**Terminal 2 — Frontend:**
```bash
cd BrandFlow/frontend/
npm install
npm run dev
# → App chạy tại http://localhost:3000
```

### Cách 3: Docker
```bash
cd BrandFlow/
docker-compose up --build
# → Backend chạy tại http://localhost:8000
# Frontend vẫn cần chạy riêng (chưa có Docker cho FE)
```

> ⚠️ **LƯU Ý:** Khi chạy local, file `.env` ở thư mục gốc phải có `GEMINI_API_KEY` và `GROQ_API_KEY`.

---

## 4. Deploy Backend (Railway)

### 4.1. Kết nối Repository

1. Đăng nhập [Railway](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Chọn repo `BrandFlow`
4. Railway tự detect `Dockerfile` → sẽ build từ đó

### 4.2. Cấu hình Railway

**Settings → General:**
- **Root Directory:** `/` (thư mục gốc, nơi có `Dockerfile`)
- **Build Command:** (để trống — dùng Dockerfile)
- **Start Command:** (để trống — dùng CMD trong Dockerfile)

**Settings → Networking:**
- **Generate Domain** → lấy URL dạng: `https://brandflow-production-XXXX.up.railway.app`
- Ghi nhớ URL này → sẽ dùng cho Frontend

### 4.3. Environment Variables (Railway)

Vào **Variables** tab, thêm:

```env
# === BẮT BUỘC ===
GEMINI_API_KEY=AIzaSy...your_key...
GROQ_API_KEY=gsk_...your_key...

# === DATABASE ===
# Option A: SQLite (dùng cho demo/staging)
DATABASE_URL=sqlite:///./brandflow.db

# Option B: PostgreSQL (khuyến nghị cho production)
# DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/dbname

# === CORS — Cho phép Frontend truy cập ===
BRANDFLOW_FRONTEND_URLS=https://your-frontend.vercel.app

# === BẢO MẬT ===
JWT_SECRET_KEY=your_random_secret_key_at_least_32_chars
BRANDFLOW_AUDIT_ADMIN_TOKEN=your_admin_token_for_audit_dashboard
```

### 4.4. Kiểm tra Backend đã Live

Truy cập: `https://your-railway-url.up.railway.app/docs`

- ✅ Thấy Swagger UI → Backend hoạt động
- ❌ Lỗi 502/503 → Kiểm tra Railway Logs

> ⚠️ **LƯU Ý QUAN TRỌNG:**  
> - Railway free tier có giới hạn $5/tháng usage. Vượt mức sẽ bị tạm dừng.
> - SQLite trên Railway **sẽ mất dữ liệu** khi redeploy (vì container stateless). Nếu cần dữ liệu bền, dùng PostgreSQL (Railway cung cấp add-on miễn phí).
> - Thư mục `temp_uploads/` cũng bị xóa khi redeploy → file upload chỉ tồn tại tạm thời.

---

## 5. Deploy Frontend (Vercel)

### 5.1. Kết nối Repository

1. Đăng nhập [Vercel](https://vercel.com)
2. **Add New Project** → Import GitHub repo
3. ⚠️ **Framework Preset:** chọn **Next.js**
4. ⚠️ **Root Directory:** nhập `frontend` (KHÔNG để trống!)

### 5.2. Environment Variables (Vercel)

Vào **Settings → Environment Variables**, thêm:

```env
# === BẮT BUỘC — URL Backend API ===
NEXT_PUBLIC_API_URL=https://brandflow-production-XXXX.up.railway.app

# === OPTIONAL — OAuth (nếu dùng đăng nhập Social) ===
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

> ⚠️ **QUAN TRỌNG:**  
> - `NEXT_PUBLIC_API_URL` **KHÔNG có dấu `/` ở cuối** → ✅ `https://abc.railway.app` | ❌ `https://abc.railway.app/`
> - Biến bắt đầu bằng `NEXT_PUBLIC_` mới được truy cập ở client-side (browser)
> - Sau khi thêm/sửa biến → phải **Redeploy** (vào Deployments → chọn latest → Redeploy)

### 5.3. Kiểm tra Frontend đã Live

Truy cập URL Vercel → Mở DevTools (F12) → Tab **Network**:
- Kiểm tra các request API có đúng URL Backend không
- Nếu thấy `localhost:8000` → env chưa được set đúng → cần Redeploy

---

## 6. Cấu hình Environment Variables

### Bảng tổng hợp tất cả ENV

| Biến | Đặt ở đâu | Bắt buộc | Mô tả |
|---|---|---|---|
| `GEMINI_API_KEY` | Backend (Railway) | ✅ | API key Google Gemini |
| `GROQ_API_KEY` | Backend (Railway) | ✅ | API key Groq Cloud |
| `DATABASE_URL` | Backend (Railway) | ✅ | Connection string DB |
| `BRANDFLOW_FRONTEND_URLS` | Backend (Railway) | ⚠️ Khuyến nghị | Danh sách domain FE (CORS). Mặc định `*` nếu không set |
| `JWT_SECRET_KEY` | Backend (Railway) | ⚠️ Khuyến nghị | Secret cho JWT token. Nếu không set, dùng default (KHÔNG an toàn) |
| `BRANDFLOW_AUDIT_ADMIN_TOKEN` | Backend (Railway) | ❌ Optional | Token xem Admin Dashboard |
| `NEXT_PUBLIC_API_URL` | Frontend (Vercel) | ✅ | URL Backend API đầy đủ |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Frontend (Vercel) | ❌ Optional | Google OAuth client ID |
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | Frontend (Vercel) | ❌ Optional | Facebook OAuth app ID |

### Cách CORS hoạt động

File `main.py` (dòng 92-106):
```python
raw_origins = os.environ.get("BRANDFLOW_FRONTEND_URLS", "*")
if raw_origins == "*":
    allowed_origins = ["*"]      # Cho phép mọi domain (dev mode)
else:
    allowed_origins = [origin.strip() for origin in raw_origins.split(",")]
```

**Ví dụ set nhiều domain:**
```env
BRANDFLOW_FRONTEND_URLS=https://brandflow.vercel.app,https://brandflow.com,https://staging.brandflow.com
```

---

## 7. Checklist Trước Khi Go-Live

### Backend ✅
- [ ] `GEMINI_API_KEY` đã set trên Railway
- [ ] `GROQ_API_KEY` đã set trên Railway  
- [ ] `DATABASE_URL` đã set (SQLite hoặc PostgreSQL)
- [ ] `BRANDFLOW_FRONTEND_URLS` đã set với domain Vercel
- [ ] Truy cập `/docs` thấy Swagger UI
- [ ] Truy cập `/health` trả về `{"status": "ok"}`
- [ ] Thư mục `temp_uploads/` được tạo tự động (kiểm tra logs)

### Frontend ✅
- [ ] `NEXT_PUBLIC_API_URL` đã set trên Vercel (KHÔNG có `/` cuối)
- [ ] Root Directory set thành `frontend`
- [ ] Framework Preset là `Next.js`
- [ ] Đã Redeploy SAU KHI thêm env vars
- [ ] Mở DevTools → Network → API requests gọi đúng Railway URL
- [ ] Không thấy `localhost:8000` trong bất kỳ request nào

### Tích hợp ✅
- [ ] Onboarding (phỏng vấn AI) hoạt động
- [ ] Upload file `.docx` / `.pdf` hoạt động
- [ ] Planning pages load dữ liệu
- [ ] Design Studio gọi được API generate
- [ ] Content Lab ingest URL hoạt động
- [ ] Daily Content generate nội dung hoạt động
- [ ] Export Full Report (d0-report) render đúng

---

## 8. Xử Lý Sự Cố (Troubleshooting)

### 🔴 "Failed to Fetch" trên mọi trang

**Nguyên nhân:** Frontend gọi API sai URL (thường là `localhost:8000`)

**Cách sửa:**
1. Mở DevTools (F12) → Network → xem URL request
2. Nếu thấy `localhost` → `NEXT_PUBLIC_API_URL` chưa được set trên Vercel
3. Set biến → **Redeploy** trên Vercel (quan trọng!)

---

### 🔴 CORS Error (Access-Control-Allow-Origin)

**Nguyên nhân:** Backend không cho phép domain Frontend

**Cách sửa:**
1. Trên Railway, thêm biến: `BRANDFLOW_FRONTEND_URLS=https://your-frontend.vercel.app`
2. Hoặc set thành `*` (tạm thời, không an toàn cho production)
3. **Redeploy** Backend trên Railway

---

### 🔴 Backend trả về 500 Internal Server Error

**Nguyên nhân thường gặp:**
1. `GEMINI_API_KEY` hoặc `GROQ_API_KEY` sai/hết hạn
2. API key hết quota
3. Module Python thiếu (kiểm tra Railway build logs)

**Cách sửa:**
1. Kiểm tra Railway **Logs** tab → tìm error message
2. Thử gọi `/health` endpoint → nếu OK thì backend sống
3. Thử gọi `/api/v1/system-info` → kiểm tra AI pipeline available

---

### 🔴 Upload file lỗi / Timeout

**Nguyên nhân:**
- File quá lớn (>100MB)
- Railway free tier timeout sau 30 giây

**Cách sửa:**
- Giảm kích thước file
- Nâng cấp Railway plan (trả phí) để tăng timeout
- `next.config.ts` đã set `bodySizeLimit: "110mb"` — OK về phía Frontend

---

### 🔴 Dữ liệu bị mất sau khi Redeploy

**Nguyên nhân:** SQLite lưu trên filesystem container → bị xóa khi build lại

**Cách sửa (khuyến nghị cho Production):**
1. Dùng **PostgreSQL** thay vì SQLite
2. Railway cung cấp add-on PostgreSQL miễn phí:
   - Railway Dashboard → Add Plugin → PostgreSQL
   - Copy `DATABASE_URL` từ plugin → paste vào env vars
   - Format: `postgresql+psycopg2://user:pass@host:port/dbname`

---

### 🟡 Một số tính năng chạy chậm

**Nguyên nhân:** API Gemini/Groq có latency 3-15 giây cho mỗi request

**Lưu ý:**
- Onboarding Interview: ~5-10 giây/câu hỏi
- Planning Execute: ~10-30 giây (nhiều agent chạy song song)
- Design Generate: ~15-30 giây (gọi DALL-E + LLM)
- Content Lab Analyze: ~10-20 giây

---

## 9. Lưu Ý Bảo Mật

### ❗ KHÔNG BAO GIỜ commit API keys vào Git
- File `.env` đã nằm trong `.gitignore`
- Luôn set API keys qua Dashboard của Railway/Vercel
- Nếu lỡ commit → **NGAY LẬP TỨC** revoke key cũ và tạo key mới

### ❗ CORS Production
- KHÔNG để `BRANDFLOW_FRONTEND_URLS=*` trên production
- Set chính xác domain: `BRANDFLOW_FRONTEND_URLS=https://brandflow.vercel.app`

### ❗ JWT Secret
- Set `JWT_SECRET_KEY` với chuỗi random dài ≥ 32 ký tự
- Không dùng default secret trên production

### ❗ Rate Limiting
- Backend đã có rate limit: 200 requests/phút/IP (cấu hình trong `main.py`)
- Đủ cho demo/staging. Production cần điều chỉnh theo traffic

---

## Phụ Lục: Danh Sách API Endpoints

### System
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/v1/system-info` | Thông tin hệ thống + AI pipeline status |

### Authentication
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/auth/register` | Đăng ký tài khoản |
| POST | `/api/v1/auth/login` | Đăng nhập |
| GET | `/api/v1/users/me/tier` | Thông tin tier người dùng |

### Onboarding
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/onboarding/interview` | Phỏng vấn AI |
| POST | `/api/v1/onboarding/upload` | Upload file (docx/pdf/xlsx) |
| POST | `/api/v1/onboarding/upload-url` | Crawl URL |
| POST | `/api/v1/onboarding/extract-summary` | Trích xuất Brand DNA |

### Planning (B2B)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/planning/intake` | Intake Agent phân tích |
| POST | `/api/v1/planning/wizard/submit` | Submit plan wizard |
| POST | `/api/v1/planning/execute` | Thực thi marketing plan |
| POST | `/api/v1/planning/refine` | Tinh chỉnh kết quả |
| GET | `/api/v1/planning/contracts/week1` | Lấy contract templates |

### Design
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/design/generate-assets` | Sinh visual assets |
| POST | `/api/v1/design/generate-case-study` | Sinh Behance case study |
| POST | `/api/v1/design/generate-deck` | Sinh brand deck |

### Content Lab
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/content-lab/ingest` | Crawl & ingest URL |
| POST | `/api/content-lab/analyze` | Phân tích vibe content |
| POST | `/api/content-lab/generate` | Sinh nội dung |
| GET | `/api/content-lab/trends` | Lấy trending topics |

---

> 📌 **Liên hệ:** Nếu gặp vấn đề không giải quyết được, liên hệ Tech Lead qua Slack channel `#brandflow-dev`.
