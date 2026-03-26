# 🚀 BrandFlow — AI Marketing Strategy Engine

> **BrandFlow** là hệ thống Multi-Agent AI chạy **100% local** giúp các thương hiệu tự động hóa việc lập chiến lược marketing, kiểm soát ngân sách và xây dựng "Brand DNA" từ tài liệu nội bộ.

---

## ✨ Tính Năng Nổi Bật

| Tính năng | Mô tả |
|---|---|
| 🧠 **Multi-Agent AI** | CMO (MasterPlanner) + CFO tự động thương lượng tối ưu ngân sách |
| 📚 **Long-Term Memory (RAG)** | Lưu quy chuẩn ngành & bài học vào ChromaDB, tự động áp dụng cho lần sau |
| 🧬 **Brand DNA Extraction** | Upload PDF/DOCX/IMG → LLM trích xuất USPs, Tone of Voice, Target Audience |
| 📊 **Dashboard Trực Quan** | Giao diện Next.js hiển thị Action Plan, KPI, Budget Allocation |
| 🔄 **Vòng Lặp Hội Tụ** | Graph tự động chạy tối đa 3 vòng để kế hoạch không vượt ngân sách |

---

## 🏗️ Kiến Trúc Hệ Thống

```
BrandFlow/
├── 🐍 Backend (FastAPI + LangGraph)
│   ├── main.py               # FastAPI app, API endpoints
│   ├── agents_core.py        # Định nghĩa CMO & CFO agents (LCEL chains)
│   ├── workflow_graph.py     # LangGraph state machine (planner ↔ cfo loop)
│   ├── memory_rag.py         # ChromaDB + Ollama RAG memory system
│   ├── document_processor.py # OCR + Semantic Chunking pipeline
│   ├── schemas.py            # Pydantic request schemas
│   └── requirements.txt
│
└── 🖥️ Frontend (Next.js 16 + TypeScript)
    └── brandflow-ui/
        └── src/
            ├── app/page.tsx           # Dashboard chính
            └── components/            # StatCards, ActionPlanList, Charts...
```

### Luồng Xử Lý Chiến Lược

```
[User Input: Goal + Budget]
        │
        ▼
   ┌─────────────┐     feedback     ┌──────────────┐
   │ MasterPlanner│ ◄──────────────  │     CFO      │
   │   (CMO AI)   │ ──────────────► │  (Budget AI)  │
   └─────────────┘   master_plan   └──────────────┘
        │                                  │
        │ (is_approved = True)             │
        ▼                                  │
   [✅ Approved Plan]  ◄──────────────────┘
```

---

## 🛠️ Yêu Cầu Hệ Thống

- **Python** 3.10+
- **Node.js** 18+ & npm
- **[Ollama](https://ollama.com/)** đang chạy local với model:
  - `ollama pull llama3.2` — LLM chính cho các agents
  - `ollama pull nomic-embed-text` — Embedding cho RAG memory
- **Tesseract OCR** (tuỳ chọn, cho tính năng upload ảnh/PDF scan)

---

## ⚙️ Cài Đặt & Chạy

### 1. Backend (Python / FastAPI)

```bash
# Clone repo
git clone <your-repo-url>
cd BrandFlow

# Tạo và kích hoạt môi trường ảo
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Cài dependencies
pip install fastapi uvicorn langchain-ollama langgraph chromadb \
            langchain-community langchain-text-splitters \
            unstructured pytesseract pdf2image python-docx \
            tenacity pydantic

# Chạy server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API Docs tự động tại: **http://localhost:8000/docs**

### 2. Frontend (Next.js)

```bash
cd brandflow-ui

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

### 3. Chạy Strategy Engine (CLI)

```bash
# Kích hoạt thẳng từ terminal (không cần giao diện)
python workflow_graph.py
```

---

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/v1/onboarding/presets` | Nạp bộ quy chuẩn ngành (F&B, Spa, B2B) vào ChromaDB |
| `POST` | `/api/v1/onboarding/interview` | Sinh Brand Guidelines từ Q&A phỏng vấn |
| `POST` | `/api/v1/onboarding/upload` | Upload tài liệu → OCR → ChromaDB → Trả Brand DNA JSON |

### Ví dụ Request

```bash
# Nạp preset ngành F&B
curl -X POST http://localhost:8000/api/v1/onboarding/presets \
  -H "Content-Type: application/json" \
  -d '{"industry": "F&B"}'

# Upload tài liệu brand
curl -X POST http://localhost:8000/api/v1/onboarding/upload \
  -F "file=@brand_guideline.pdf"
```

---

## 🧠 Hệ Thống Bộ Nhớ Dài Hạn (RAG)

BrandFlow sử dụng **ChromaDB** + **Ollama Embeddings** để ghi nhớ:
- Quy chuẩn ngành (F&B, Spa & Beauty, B2B Tech)
- Brand Guidelines được trích xuất từ tài liệu upload
- Bài học rút ra từ các kế hoạch bị từ chối

Dữ liệu được persist tại thư mục `./chroma_db/`.

---

## 🖥️ Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — REST API framework
- [LangChain](https://python.langchain.com/) + [LangGraph](https://langchain-ai.github.io/langgraph/) — Multi-agent orchestration
- [Ollama](https://ollama.com/) (`llama3.2`) — Local LLM inference
- [ChromaDB](https://www.trychroma.com/) — Vector database cho RAG
- [Tenacity](https://tenacity.readthedocs.io/) — Retry logic cho LLM calls

**Frontend**
- [Next.js 16](https://nextjs.org/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) — Biểu đồ ngân sách & KPI
- [Lucide React](https://lucide.dev/) — Icons

---

## 📝 Ghi Chú Phát Triển

- **Agents chạy stateless**: Mỗi vòng lặp CMO/CFO nhận đầy đủ context qua prompt, không dùng `ConversationBufferMemory`.
- **Python tự tính tiền**: Thay vì tin LLM tính toán số học, `workflow_graph.py` dùng Python để cộng chi phí — tránh sai số.
- **Force Convergence**: Sau tối đa **3 vòng lặp** CFO vẫn từ chối → hệ thống dừng và yêu cầu can thiệp con người.
- **ChromaDB persist**: Dữ liệu RAG được lưu lâu dài, không mất khi restart server.

---

## 📄 License

MIT License — Dự án cá nhân, vui lòng ghi nguồn khi sử dụng lại.
