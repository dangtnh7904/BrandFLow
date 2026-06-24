# BrandFlow — Pitch Deck Content
## AI Marketing Strategy Engine

> Tài liệu nội dung Pitch Deck 12 slides, dành cho fundraising round Pre-Seed / Seed.
> Cập nhật: Tháng 6/2026

---

## Slide 01 — Cover & Tagline

**Tên công ty:** BrandFlow

**Tagline:**
> "Chiến lược Marketing chuyên nghiệp trong 10 phút — không cần CMO, không cần agency."

**Logo & Visual:** Logo BrandFlow + hình ảnh Dashboard 4 Trụ Cột

**Bối cảnh một dòng:** BrandFlow là AI Marketing Strategy Engine giúp SME và startup Việt Nam tự lập kế hoạch marketing cấp chuyên gia — từ Brand DNA đến ngân sách chi tiết — chỉ bằng vài câu trả lời.

---

## Slide 02 — Problem

### Vấn đề đau đớn của thị trường

**1. SME Việt Nam "mù marketing" nhưng không đủ tiền thuê chuyên gia**
- 98% doanh nghiệp Việt Nam là SME. Phần lớn không có phòng marketing riêng.
- Thuê agency tối thiểu 15–50 triệu/tháng, chưa tính chi phí quảng cáo.
- Founder tự làm marketing → thiếu framework, lãng phí ngân sách, không đo lường được.

**2. Agency truyền thống chậm, đắt, và thiếu cá nhân hóa**
- Quy trình lập chiến lược mất 2–4 tuần, báo giá 30–200 triệu cho 1 bản kế hoạch.
- Output thường generic, copy-paste template, không bám sát DNA thương hiệu.
- Không có cơ chế kiểm duyệt chéo — kế hoạch dựa trên "cảm tính" của 1 account manager.

**3. Các tool AI hiện tại chỉ giải quyết bề mặt**
- ChatGPT/Gemini viết content tốt nhưng **không lập được chiến lược có cấu trúc** (G-STIC, SWOT, DPM, P&L).
- Không có anti-hallucination cho phần tài chính — AI thường "bịa" số liệu ngân sách.
- Không có cơ chế tranh luận/kiểm duyệt — output đầu tiên là output cuối cùng.

**Số liệu minh chứng:**
- 76% SME Việt Nam chi dưới 10 triệu/tháng cho marketing (Khảo sát VCCI 2025)
- Thị trường marketing services Việt Nam: ~$1.2B (2025), tăng trưởng 15–18%/năm

---

## Slide 03 — Solution

### BrandFlow — CMO ảo cho mọi doanh nghiệp

**Giải pháp cốt lõi:** Hệ thống Multi-Agent AI mô phỏng quy trình làm việc thực tế của một team marketing chuyên nghiệp (CMO + CFO + Customer Persona), tự động tranh luận và kiểm duyệt chéo để cho ra kế hoạch marketing đạt chuẩn doanh nghiệp.

**Quy trình 4 giai đoạn (tương đương 4 tuần của agency, BrandFlow làm trong ~10 phút):**

| Giai đoạn | Tương đương Agency | BrandFlow |
|---|---|---|
| 1. Brand Profiling | 3–5 ngày phỏng vấn, research | 2 phút trả lời survey thông minh |
| 2. Strategic Planning | 1–2 tuần brainstorm, SWOT | 3 phút — AI Debate (CMO vs Customer Persona vs CFO) |
| 3. Tactical & Budget | 1 tuần lên media plan, phân bổ ngân sách | 3 phút — Math Engine tính chính xác VNĐ |
| 4. Content Execution | Ongoing | Real-time — sinh nội dung bám cứng Brand DNA |

**3 đột phá kỹ thuật:**
1. **Mandatory Debate** — Customer Persona và CFO kiểm duyệt bắt buộc mọi đề xuất của CMO → loại bỏ kế hoạch sai insight
2. **Anti-Hallucination Finance** — CFO chỉ được lập tỷ lệ (%), Math Engine Python tính ra VNĐ chính xác 100%
3. **Single Source of Truth** — Mọi touchpoint truyền thông đều bị ép soi chiếu lại Master Brand Profile

**Demo:** [Live demo Dashboard 4 Trụ Cột — từ input đến output hoàn chỉnh]

---

## Slide 04 — Market Size

### Thị trường đủ lớn, timing hoàn hảo

**TAM (Total Addressable Market) — Toàn cầu:**
- Thị trường Marketing Automation & AI Marketing Tools toàn cầu: **$14.2B** (2025), dự kiến **$31.5B** (2030)
- CAGR: ~17.3%

**SAM (Serviceable Addressable Market) — Đông Nam Á:**
- SME Digital Marketing Tools tại Đông Nam Á: **$1.8B** (2025)
- Việt Nam chiếm ~18% → **$324M**
- Tập trung: AI-powered marketing planning + content automation

**SOM (Serviceable Obtainable Market) — Việt Nam, 3 năm đầu:**
- Target: SME và startup Việt Nam có ngân sách marketing 5–100 triệu/tháng
- ~850,000 doanh nghiệp SME đang hoạt động (GSO 2025)
- Penetration rate thực tế 0.5–1% trong 3 năm = **4,250–8,500 khách hàng**
- ARPU $30–100/tháng → **SOM = $1.5M–$10.2M ARR**

**Tại sao timing là bây giờ?**
- Chi phí LLM giảm 10x trong 18 tháng qua (Gemini Flash, Groq inference)
- SME Việt Nam đang ở giai đoạn chuyển đổi số mạnh nhất (hậu COVID)
- Chưa có giải pháp AI marketing planning "made for Vietnam" — chỉ có tool ngoại generic

---

## Slide 05 — Product

### Sản phẩm đã build, đang hoạt động

**Kiến trúc kỹ thuật:**

```
User Input → 4-Stage AI Pipeline → Executive Dashboard
     │              │                      │
  Survey        Multi-Agent            4 Pillars
  thông minh    Debate System          Report View
                     │
              Math Engine (Python)
              Anti-Hallucination
```

**Key Features đã hoàn thiện:**

| Feature | Mô tả | Status |
|---|---|---|
| 🧠 4-Stage AI Pipeline | Profiling → Strategic → Tactical → Micro-execution | ✅ Production |
| ⚖️ Mandatory Debate | CMO, Customer Persona, CFO kiểm duyệt chéo tự động | ✅ Production |
| 💰 Anti-Hallucination Finance | Math Engine Python, CFO chỉ lập tỷ lệ %, tính VND chính xác | ✅ Production |
| 📊 12 Forms chiến lược + 7 Forms vận hành | G-STIC, SWOT, Ma trận DPM, Gantt Chart, P&L | ✅ Production |
| 🖥️ Executive Dashboard | Giao diện 4 Trụ Cột, C-level report view | ✅ Production |
| 📄 Document Ingestion | Upload PDF/DOCX/URL, extract và lưu vào ChromaDB | ✅ Production |
| 📝 Content Lab | Sinh nội dung (post, TikTok script) bám cứng Brand DNA | ✅ Production |
| 🎨 Design Studio | AI-powered design generation | ✅ Production |
| 🔐 Tier System | FREE / PLUS / PRO với quota management | ✅ Production |
| 📈 Excel Export | Báo cáo P&L, ngân sách chi tiết tự động | ✅ Production |

**Tech Stack:** FastAPI (Python) + React/Next.js (Vite) + ChromaDB + Gemini/Groq LLM + LangChain

---

## Slide 06 — Traction

### Số liệu tăng trưởng — Thực tế, không phóng đại

> *BrandFlow bắt đầu phát triển từ Q1/2026. Hiện đang ở giai đoạn Private Beta, tập trung validate product-market fit.*

**Timeline phát triển:**

| Mốc | Thời gian | Kết quả |
|---|---|---|
| MVP hoàn thiện | Tháng 3/2026 | 4-Stage Pipeline chạy end-to-end, 36 regression tests PASS |
| Contract & API locked | Tháng 4/2026 | Orchestration contract v1, Quality Gate GO decision |
| Private Beta launch | Tháng 5/2026 | Mời nhóm SME và startup đầu tiên trải nghiệm |
| Hiện tại (Tháng 6/2026) | — | Đang thu thập feedback và iterate |

**Số liệu Private Beta (Tháng 5–6/2026):**

| Metric | Số liệu |
|---|---|
| Beta users đăng ký | ~45 tài khoản |
| Kế hoạch marketing đã được tạo | ~120 bản |
| Thời gian trung bình tạo 1 bản kế hoạch hoàn chỉnh | ~8 phút |
| Tỷ lệ user quay lại tạo bản thứ 2+ | ~40% |
| NPS (khảo sát nhanh beta users) | 62 |
| Ngành được test nhiều nhất | F&B, Tech startup, Thời trang |

**Chất lượng kỹ thuật đã kiểm chứng:**
- 36/36 regression tests PASS (tháng 4/2026)
- Quality Gate: anti-loop 100%, route determinism 100%, hard-check 100%
- Go/No-Go Report: **GO** — tất cả mandatory gates đã pass

**Feedback nổi bật từ beta users:**
> *"Lần đầu tiên tôi có một bản kế hoạch marketing có SWOT, có P&L, có timeline cụ thể — mà không tốn 30 triệu cho agency."*
> — Founder F&B startup, Hà Nội

> *"Phần tranh luận giữa CMO và Customer Persona rất hay. Nó chỉ ra những insight mà tôi tự làm thì bỏ qua."*
> — CEO công ty thời trang, TP.HCM

---

## Slide 07 — Business Model

### Kiếm tiền rõ ràng, unit economics khả thi

**Mô hình: SaaS Subscription (Freemium → Paid tiers)**

| Tier | Giá/tháng | Target | Tính năng chính |
|---|---|---|---|
| **FREE** | 0đ | Dùng thử, solo founder | 2 file/request, 6 file/ngày, 3 URL/ngày, output cơ bản |
| **PLUS** | 499K (~$20) | SME nhỏ, freelancer | 5 file/request, 30 file/ngày, 15 URL/ngày, Excel export, Content Lab |
| **PRO** | 1.49M (~$60) | SME trung bình, agency nhỏ | 15 file/request, 120 file/ngày, 80 URL/ngày, full features, API access |
| **Enterprise** | Custom | Agency, corporate | White-label, custom AI agents, SLA, dedicated support |

**Unit Economics (dự kiến tại scale 1,000 paid users):**

| Metric | Giá trị |
|---|---|
| Blended ARPU | ~$35/tháng |
| LLM cost/user/tháng | ~$2–4 (dùng Gemini Flash + Groq cho cost optimization) |
| Infra cost/user/tháng | ~$1–2 |
| Gross Margin | **~83–88%** |
| Estimated CAC | $15–25 (content marketing + community) |
| Target LTV (12-month retention) | $250–400 |
| LTV/CAC ratio | **10–16x** |

**Revenue streams bổ sung (Phase 2+):**
- Pay-per-use cho Micro-Execution API (content generation)
- Marketplace: Template chiến lược theo ngành (F&B, Fashion, Tech...)
- B2B White-label cho agency muốn tăng năng suất

---

## Slide 08 — Competition

### Lợi thế cạnh tranh bền vững

**Competitive Landscape:**

| Tiêu chí | ChatGPT / Gemini | Jasper / Copy.ai | Agency truyền thống | **BrandFlow** |
|---|---|---|---|---|
| Lập chiến lược có cấu trúc (G-STIC, SWOT, DPM) | ❌ | ❌ | ✅ (nhưng chậm) | ✅ |
| Anti-hallucination tài chính | ❌ | ❌ | ✅ (manual) | ✅ (automated) |
| Kiểm duyệt chéo (debate system) | ❌ | ❌ | ❌ | ✅ |
| Output Excel P&L, budget breakdown | ❌ | ❌ | ✅ | ✅ |
| Thời gian hoàn thành | Phút (nhưng không structured) | Phút (chỉ content) | 2–4 tuần | **~10 phút** |
| Giá | $20/tháng | $39–99/tháng | 15–200 triệu/dự án | **0–$60/tháng** |
| Localized cho VN | ❌ | ❌ | ✅ | ✅ |
| Tự sinh nội dung bám Brand DNA | Có thể nhưng thủ công | ✅ (content only) | ❌ | ✅ |

**Moat (Lợi thế cạnh tranh bền vững):**

1. **Vertical AI > Horizontal AI** — BrandFlow không phải chatbot viết content. Đây là hệ thống workflow chuyên biệt cho marketing strategy, khó replicate bằng prompt engineering đơn giản.

2. **Multi-Agent Debate Architecture** — Cơ chế tranh luận bắt buộc giữa CMO/CFO/Persona là IP cốt lõi. Tạo ra output quality vượt trội so với single-prompt tools.

3. **Math Engine tách biệt** — Tách hoàn toàn AI sáng tạo và tính toán tài chính. Đây là thiết kế kiến trúc, không phải feature — rất khó copy nhanh.

4. **Data flywheel** — Mỗi bản kế hoạch tạo ra enriches ChromaDB (industry knowledge). Càng nhiều user → càng giỏi theo ngành → retention tăng.

5. **Localization-first** — Xây từ đầu cho thị trường Việt Nam: ngôn ngữ, format tiền VNĐ, framework marketing phổ biến ở VN. Competitor ngoại phải adapt, BrandFlow native.

---

## Slide 09 — Go-to-Market

### Chiến lược tiếp cận thị trường thực tế

**Phase 1: Community-Led Growth (Q3–Q4/2026)**
- **Kênh chính:** LinkedIn, Facebook Groups (Startup Vietnam, SME Communities), TikTok (marketing education content)
- **Chiến thuật:** Tạo content giá trị miễn phí (case study, template marketing, so sánh AI tools) → drive traffic về FREE tier
- **Target:** 500 free users, 50 paid conversions
- **CAC mục tiêu:** <$15 (organic + content)

**Phase 2: Partnership & Referral (Q1/2027)**
- **Partnership với:** Incubators/accelerators (VIISA, Topica, Genesia), co-working spaces, business coaching communities
- **Referral program:** User giới thiệu → cả 2 được 1 tháng PLUS miễn phí
- **Target:** 2,000 free users, 200 paid

**Phase 3: B2B Outbound (Q2/2027)**
- **Target:** Agency nhỏ-vừa muốn scale (dùng BrandFlow để tăng năng suất lập kế hoạch)
- **Enterprise pilot:** White-label cho 2–3 agency lớn
- **Target:** 5,000 free users, 500 paid, 3 enterprise contracts

**Key Metrics để theo dõi:**

| Metric | Mục tiêu 6 tháng | Mục tiêu 12 tháng |
|---|---|---|
| Registered users | 1,000 | 5,000 |
| Paid subscribers | 80 | 500 |
| MRR | $2,800 | $17,500 |
| Churn rate (monthly) | <8% | <5% |
| NPS | >50 | >60 |

---

## Slide 10 — Team

### Tại sao chúng tôi là đúng người

**Core Team:**

**Đặng [Tên đầy đủ] — Founder & CEO**
- Sinh viên / Cựu sinh viên Đại học Bách khoa Hà Nội (HUST)
- Full-stack developer, kiến trúc sư chính của BrandFlow
- Thiết kế toàn bộ Multi-Agent Pipeline, Math Engine, và API architecture
- Kinh nghiệm: [Bổ sung kinh nghiệm cá nhân — internship, side projects, hackathon wins...]

**[Bổ sung team members khác nếu có]**

**Năng lực đã chứng minh:**
- Tự xây dựng toàn bộ hệ thống từ 0 đến production-ready trong ~4 tháng
- Kiến trúc Multi-Agent AI, Math Engine anti-hallucination — đều là thiết kế gốc, không fork từ framework có sẵn
- Quality engineering: 36 regression tests, Go/No-Go quality gate process
- Tech stack đa dạng: Python (FastAPI, LangChain), React/Next.js, ChromaDB, Gemini/Groq API

**Hiring Plan (với funding):**
- 1 AI/ML Engineer — tối ưu pipeline, fine-tune models
- 1 Product Designer — UX/UI cho onboarding và dashboard
- 1 Growth Marketer — go-to-market execution

---

## Slide 11 — Financials

### Dự phóng tài chính 3 năm — Bottom-Up, bám sát dữ liệu thực

> *Dự phóng xây dựng từ dưới lên (bottom-up) dựa trên: 45 beta users, conversion benchmark 3% (FirstPageSage 2025), churn 6%/tháng (benchmark B2B SME SaaS).*

**Revenue Projection (Base Case):**

| | Year 1 (2026–2027) | Year 2 (2027–2028) | Year 3 (2028–2029) |
|---|---|---|---|
| Free users (tích lũy) | 920 | 3,500 | 10,000 |
| Paid users (EOY) | 53 | 180 | 500 |
| Blended ARPU | $22 | $28 | $35 |
| **MRR (EOY)** | **$1,166** | **$5,040** | **$17,500** |
| **ARR (EOY)** | **$14,000** | **$60,500** | **$210,000** |

**Cost Structure (Year 1 — với Pre-Seed funding):**

| Hạng mục | Chi phí/tháng | % | Ghi chú |
|---|---|---|---|
| Nhân sự (3 người) | $2,000 | 53% | Founder $600 + Engineer $800 + Designer/Marketer PT $600 |
| LLM API (Gemini Flash + Groq) | $400 | 11% | ~$0.18/paid user/tháng — cực thấp nhờ Flash tier |
| Cloud infrastructure | $300 | 8% | VPS + CDN + monitoring |
| Marketing & Growth | $600 | 16% | Content, community events, paid ads nhỏ |
| Vận hành (tools, legal, buffer) | $450 | 12% | SaaS tools, accounting, contingency |
| **Tổng burn/tháng** | **~$3,750** | 100% | |

**Path to Profitability:**
- **Breakeven point:** ~170 paid users (MRR ≈ $3,750)
- **Dự kiến đạt breakeven:** Tháng 18–20 (Q4/2027 – Q1/2028)
- **Nếu bootstrapped (burn $800/tháng):** Breakeven chỉ cần **36 paid users** → tháng 10–12
- **Gross margin tại 500 users:** ~87% (LLM cost chỉ chiếm ~$0.35/user)

---

## Slide 12 — Unit Economics & Kịch bản

### Tại sao unit economics của BrandFlow khả thi

**Chi phí LLM per user — chi tiết token-by-token:**

> *BrandFlow dùng Gemini Flash ($0.10/M input tokens) + Groq Llama ($0.05/M) — rẻ nhất thị trường. Math Engine chạy bằng Python → zero LLM cost cho phần tài chính.*

| Metric | Giá trị | So sánh |
|---|---|---|
| LLM cost per kế hoạch (1 lần tạo) | **~$0.022** | 28K input + 49K output tokens qua 4 stages |
| LLM cost per paid user/tháng | **~$0.18** | Avg 8 kế hoạch/tháng (gói PLUS) |
| ARPU (Year 1) | **$22/tháng** | 80% PLUS ($20) + 20% PRO ($60) |
| **Gross Margin** | **83–87%** | Benchmark AI SaaS: 50–60%. BrandFlow cao hơn nhờ Flash tier |
| CAC (organic + content) | **$20–30** | Community-led, không chạy paid ads mạnh |
| LTV (adj. 6% monthly churn) | **$132** | 16.7 tháng avg lifetime × $22 ARPU, discount 64% |
| **LTV/CAC** | **5.3x → 11x** | Healthy benchmark: >3x |

**3 Kịch bản — Xác suất & Con số:**

| | 🐢 Conservative (50%) | 🎯 Base Case (35%) | 🚀 Optimistic (15%) |
|---|---|---|---|
| **Mô tả** | Bootstrapped, 1 founder | Raise $75K, team 3 người | Raise $150K, viral growth |
| **Paid users Year 3** | 200 | 500 | 2,000 |
| **ARR Year 3** | $84,000 | $210,000 | $960,000 |
| **Breakeven** | Tháng 12 | Tháng 18–20 | Tháng 22–24 |
| **Key risk** | Chậm tăng trưởng | Cần maintain momentum | Burn nhanh, cần Seed |

> **Tại sao 3 kịch bản quan trọng?** BrandFlow có thể tự nuôi (bootstrapped) từ tháng 12 nếu không raise được funding. Đây là "insurance" mà không phải startup nào cũng có — vì burn rate cực thấp ($800/tháng khi solo).

---

## Slide 13 — The Ask

### Raise: $50,000–$100,000 (Pre-Seed)

> *Gọi vừa đủ, burn thấp, giữ equity cho Seed round.*

**Dùng vào đâu (Base: $75,000):**

| Hạng mục | Tỷ lệ | Số tiền | Mục đích cụ thể |
|---|---|---|---|
| Engineering & Product | 40% | $30,000 | 1 AI engineer (12 tháng × $800) + designer freelance |
| Go-to-Market | 25% | $18,750 | Content marketing, community events, partnership |
| Infrastructure | 15% | $11,250 | Cloud, LLM API reserves, monitoring |
| Operations & Buffer | 20% | $15,000 | Legal, accounting, founder compensation, contingency |

**Runway:** 20 tháng với burn rate $3,750/tháng (hoặc 27 tháng nếu raise $100K)

**Milestones sau round này:**

| Timeline | Milestone | Metric cụ thể |
|---|---|---|
| +3 tháng | Public Launch + First Revenue | 200 free users, 10 paid, MRR $220 |
| +6 tháng | PMF Signal | 500 free, 30 paid, MRR $660, NPS>50 |
| +9 tháng | Growth Momentum | 700 free, 50 paid, MRR $1,100 |
| +12 tháng | Seed-Ready | 1,000 free, 80 paid, MRR $1,760 |
| +18 tháng | Approaching Breakeven | 2,000 free, 130+ paid, MRR $3,640 |

**Kỳ vọng Seed Round (18–24 tháng sau):**
- Raise: $500K–$1M
- Điều kiện: MRR >$10K, >300 paid users, <5% monthly churn
- Mục tiêu: Mở rộng team + bắt đầu B2B Enterprise + chuẩn bị SEA expansion

---

## Appendix — Thông tin bổ sung

### A. Liên kết nhanh
- **GitHub:** [Repository BrandFlow]
- **Live Demo:** [URL demo nếu có]
- **API Docs:** http://localhost:8000/docs

### B. Thuật ngữ
- **G-STIC:** Goals, Strategy, Tactics, Implementation, Control — framework marketing planning chuẩn
- **DPM (Directional Policy Matrix):** Ma trận phân tích danh mục sản phẩm/dịch vụ
- **Brand DNA:** Bộ nhận diện cốt lõi: sứ mệnh, tầm nhìn, USP, tone of voice, target persona
- **ChromaDB:** Vector database lưu trữ knowledge base thương hiệu

### C. Rủi ro chính & Giải pháp

| Rủi ro | Giải pháp |
|---|---|
| LLM cost tăng | Multi-provider strategy (Gemini + Groq + local models), caching layer |
| Competitor lớn copy | Vertical depth + localization + data flywheel = khó copy nhanh |
| Chậm PMF | Aggressive user interview, weekly iteration cycle |
| Team nhỏ | Lean operation, AI-assisted development, selective hiring |
