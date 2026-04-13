# Code Map (BrandFlow Frontend UI)

This map tracks the organization of the Next.js B2B Marketing Planning interface.

## Components (`frontend/src/components/b2b/`)
- `MascotChatbot.tsx`: The global AI Mascot component responsible for delivering contextual explanations and handling the dynamic `/api/agent` query.
- `WizardNavigation.tsx`: Navigation component placed at the end of each form to guide users logically to the next phase.
- `InstructionAlert.tsx`: Alert bubbles used for phase warnings.
- `B2BPageTemplate.tsx`: Reusable layout wrapper for all Planning forms.
- `PastelTable.tsx`: Styled Tailwind CSS table used to render Marketing Data logic.

## Pages (`frontend/src/app/planning/`)
### Phase A: Kế hoạch Chiến lược (Dài hạn)
- `a0-overview/`: Phase A Landing Page / Dashboard.
- `a1-mission/`: Form 1 (Tuyên bố sứ mệnh).
- `a2-performance/`: Form 2 (Hiệu suất 3 năm).
- `a3-revenue/`: Form 3 (Dự phóng Doanh thu).
- `a4-market/`: Form 4 (Bản đồ thị trường).
- `a5-swot/`: Form 5 (Phân tích SWOT).
- `a6-portfolio/`: Form 6 (Ma trận DPM).
- `a7-assumptions/`: Form 7 (Giả định).
- `a8-strategies/`: Form 8-11 (Mục tiêu và Chiến thuật 4P).
- `a9-budget/`: Form 12 (Ngân sách hợp nhất).

### Phase B: Kế hoạch Vận hành (Ngắn hạn 1 năm)
- `b0-overview/`: Phase B Landing Page / Dashboard.
- `b1-objectives/`: Form 13 (Mục tiêu doanh số).
- `b2-action/`: Form 15 (Kế hoạch hành động chi tiết).
- `b3-budget/`: Form 16 (Hồ sơ ngân sách).
- `b4-contingency/`: Form 18 (Kế hoạch dự phòng).
- `b5-pnl/`: Form 19 (Lãi Lỗ dự phóng ngắn hạn).
- `b6-gantt/`: Form 20 (Gantt Chart Lịch biểu).

### Phase C: Portfolio Summary (Tập đoàn)
- `c0-overview/`: Phase C Landing Page / Dashboard.
- `c1-direction/`: Form 14 (Tuyên bố định hướng).
- `c2-history/`: Form 21 (Lịch sử SBU).
- `c3-issues/`: Form 22 (Phân tích vấn đề chiến lược).
- `c4-dashboard/`: Form 23 (Dashboard ma trận Portfolio).

## Backend Integration
- `api/agent/route.ts`: Maps to external LLM providers (Groq `llama-3.1-8b-instant` / OpenAI). Serves as the AI brain for the `MascotChatbot`.
- `app/agents/planner/agents_core.py`: Python backend logic for advanced generative flows (LangChain/Groq).

## Database Layer (NEW)
### Core (`app/core/`)
- `database.py`: SQLAlchemy engine + session factory. SQLite (dev) → PostgreSQL (prod) via `DATABASE_URL` env var. WAL mode, connection pooling, FastAPI dependency.

### Models (`app/models/`)
- `models.py`: ORM models — `User` → `Project` → `FormData` hierarchy. UUID-based IDs, JSON column for flexible form data, version field for optimistic concurrency, multi-tenant ready.

### Schemas (`app/schemas/`)
- `form_schemas.py`: Pydantic request/response schemas for Form CRUD API (UserCreate/Out, ProjectCreate/Update/Out, FormDataSave/Out, BulkSave, AllFormsOut).

### Services (`app/services/`)
- `form_crud.py`: CRUD service layer — tenant-isolated queries (user_id filter), optimistic locking, bulk save. Functions: `get_or_create_user`, `create/get/list/update/delete_project`, `save/get/get_all/bulk_save/delete_form`.

### API Routes (`app/api/`)
- `form_routes.py`: FastAPI router `prefix=/api/v1/forms`. Endpoints:
  - `POST /users` — Create/upsert user
  - `GET /users/me` — Current user info
  - `POST /projects` — Create project
  - `GET /projects` — List user projects
  - `GET /projects/{id}` — Project detail + filled forms progress
  - `PUT /projects/{id}` — Update project
  - `DELETE /projects/{id}` — Delete project + all form data
  - `PUT /projects/{id}/forms/{form_key}` — Save/update form (upsert)
  - `GET /projects/{id}/forms/{form_key}` — Load form data
  - `GET /projects/{id}/forms` — Load all forms
  - `POST /projects/{id}/forms/bulk` — Batch save multiple forms
  - `DELETE /projects/{id}/forms/{form_key}` — Delete form data

### Database File
- `brandflow.db`: SQLite dev database (auto-created, gitignored). Switch to PostgreSQL by setting `DATABASE_URL` in `.env`.
