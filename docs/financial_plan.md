# BRANDFLOW — KẾ HOẠCH TÀI CHÍNH CHI TIẾT
## Realistic Financial Plan — Pre-Seed Stage
> **Cập nhật:** Tháng 6/2026
> **Giai đoạn:** Private Beta → Public Launch → Growth
> **Triết lý:** Bottom-up projection, bám sát data thực tế từ beta, benchmarks ngành SaaS B2B SME

---

## 📌 TÓM TẮT TÌNH HÌNH HIỆN TẠI (Baseline — Tháng 6/2026)

| Metric | Số liệu thực tế | Nguồn |
|---|---|---|
| Beta users | ~45 tài khoản | Internal data |
| Kế hoạch đã tạo | ~120 bản | Internal data |
| Thời gian/kế hoạch | ~8 phút | Internal data |
| Retention (quay lại tạo kế hoạch thứ 2+) | ~40% | Internal data |
| NPS | 62 | Khảo sát beta |
| Paid users hiện tại | 0 (chưa thu phí) | Chưa launch pricing |
| MRR hiện tại | $0 | Pre-revenue |
| Team size | 1 founder (full-time) | — |
| Burn rate hiện tại | ~$190–400/tháng | Chỉ LLM API + hosting |

> **⚠️ Lưu ý quan trọng:** BrandFlow hiện đang ở trạng thái **pre-revenue**. Mọi con số dự phóng dưới đây đều dựa trên assumptions rõ ràng và có thể điều chỉnh khi có data thực tế.

---

## 1. CẤU TRÚC GIÁ — PRICING TIERS

### Bảng giá chính thức (dự kiến)

| | FREE | PLUS | PRO | ENTERPRISE |
|---|:---:|:---:|:---:|:---:|
| **Giá/tháng** | **0đ** | **480,000đ** (~$19) | **4,990,000đ** (~$199) | **Liên hệ** (~$190+) |
| **Giá/năm** (giảm 17%) | 0đ | 4,990,000đ (~$190) | 14,900,000đ (~$1990) | Custom |
| **Target** | Solo founder, dùng thử | SME nhỏ, freelancer | SME trung bình, agency nhỏ | Agency, corporate |

### ARPU Assumptions (Blended)

| Giai đoạn | ARPU dự kiến | Giải thích |
|---|---|---|
| Year 1 (H2/2026 – H1/2027) | **$55/tháng** | Phần lớn PLUS ($19), ít PRO |
| Year 2 (H2/2027 – H1/2028) | **$65/tháng** | Mix PLUS/PRO tăng, 1-2 Enterprise |
| Year 3 (H2/2028 – H1/2029) | **$80/tháng** | PRO chiếm tỷ trọng lớn hơn, Enterprise bắt đầu đóng góp |

> **Tại sao ARPU Year 1 chỉ $55 như pitch deck?**
> Vì giai đoạn đầu, phần lớn user convert sẽ chọn gói rẻ nhất (PLUS). Tỷ lệ PLUS:PRO dự kiến là 80:20 trong Year 1. ARPU = 0.8 × $19 + 0.2 × $199 = **$55**. Nhưng khi tính cả churn và downgrade, con số thực tế sẽ thấp hơn → vẫn đảm bảo dòng tiền tốt.

---

## 2. MÔ HÌNH TĂNG TRƯỞNG NGƯỜI DÙNG — BOTTOM-UP

### Assumptions cốt lõi

| Assumption | Giá trị | Benchmark ngành |
|---|---|---|
| Freemium → Paid conversion rate | **3%** | Benchmark B2B Freemium: 2.6–3.7% (FirstPageSage 2025) |
| Monthly churn (paid) | **6%** | SME B2B SaaS: 3–7% monthly (Agile Growth Labs) |
| Monthly churn (free) | **12%** | Free users rời bỏ nhanh hơn |
| Organic growth (free signups/tháng) | Bắt đầu 50, tăng dần | Community-led growth, content marketing |
| Paid marketing CAC | **$20–30** | Content + community (thấp hơn paid ads) |

### Dự phóng tăng trưởng theo quý — Year 1

> **Year 1 = Q3/2026 → Q2/2027** (bắt đầu tính từ Public Launch dự kiến tháng 7/2026)

| Metric | Q3/2026 | Q4/2026 | Q1/2027 | Q2/2027 |
|---|---:|---:|---:|---:|
| **Free signups mới/tháng** | 50 | 80 | 120 | 180 |
| **Free users tích lũy (cuối quý)** | 130 | 280 | 530 | 920 |
| **Free → Paid conversions/tháng** | 2 | 4 | 6 | 10 |
| **Paid users mới/quý** | 5 | 10 | 18 | 30 |
| **Churn paid/quý** (~18% quarterly) | 0 | 1 | 3 | 6 |
| **Paid users (cuối quý)** | 5 | 14 | 29 | 53 |
| **MRR (cuối quý)** | $110 | $308 | $638 | $1,166 |

### Dự phóng Year 1 → Year 3

| | Year 1 (EOY) | Year 2 (EOY) | Year 3 (EOY) |
|---|---:|---:|---:|
| **Free users tích lũy** | ~920 | ~3,500 | ~10,000 |
| **Paid users (active)** | **53** | **180** | **500** |
| **ARPU** | $22 | $28 | $35 |
| **MRR (cuối năm)** | **$1,166** | **$5,040** | **$17,500** |
| **ARR (cuối năm)** | **$13,992** | **$60,480** | **$210,000** |
| **Revenue cả năm** | **~$16,000** | **~$130,000** | **~$330,000** |

> **⚠️ So sánh với pitch deck:** Pitch deck ghi ARR Year 3 = $3.84M (8,000 paid users). Con số đó là **best-case scenario với funding đầy đủ và mọi thứ thuận lợi**. Bảng trên là **base case thực tế cho 1-person team có funding giới hạn**.

---

## 3. CHI PHÍ VẬN HÀNH CHI TIẾT — COST STRUCTURE

### 3.1 Chi phí hiện tại (Pre-funding, tháng 6/2026)

| Hạng mục | Chi phí/tháng (VNĐ) | Chi phí/tháng (USD) | Ghi chú |
|---|---:|---:|---|
| LLM API (Gemini Flash + Groq) | 2,500,000 | ~$100 | 45 users × ~8 requests/tháng, Gemini Flash ~$0.10/M input tokens |
| Cloud hosting (VPS/Railway) | 1,250,000 | ~$50 | Basic VPS hoặc free tier |
| Domain + SSL | 125,000 | ~$5 | |
| ChromaDB hosting | 0 | $0 | Self-hosted |
| **Tổng hiện tại** | **~3,875,000** | **~$155** | |

### 3.2 Chi phí sau Public Launch (không funding) — Q3-Q4/2026

| Hạng mục | Chi phí/tháng (VNĐ) | Chi phí/tháng (USD) | % |
|---|---:|---:|---:|
| LLM API (scale lên ~200 users) | 5,000,000 | ~$190 | 25% |
| Cloud infrastructure (upgraded) | 3,750,000 | ~$150 | 19% |
| Marketing (content creation tools) | 2,500,000 | ~$100 | 13% |
| SaaS tools (analytics, email) | 1,250,000 | ~$50 | 6% |
| Founder living cost (part-time) | 7,500,000 | ~$300 | 38% |
| **Tổng (bootstrapped)** | **~20,000,000** | **~$800** | 100% |

### 3.3 Chi phí sau Pre-Seed Funding — Year 1

| Hạng mục | Chi phí/tháng (VNĐ) | Chi phí/tháng (USD) | % |
|---|---:|---:|---:|
| **Nhân sự** | | | |
| └─ Founder (full-time) | 15,000,000 | $600 | 12% |
| └─ AI/ML Engineer (junior-mid) | 20,000,000 | $800 | 16% |
| └─ Product Designer (part-time/freelance) | 7,500,000 | $300 | 6% |
| └─ Growth/Content Marketer (part-time) | 7,500,000 | $300 | 6% |
| **Subtotal Nhân sự** | **50,000,000** | **$2,000** | **40%** |
| **Hạ tầng** | | | |
| └─ LLM API (Gemini Flash + Groq) | 10,000,000 | $400 | 8% |
| └─ Cloud (AWS/GCP credited) | 5,000,000 | $200 | 4% |
| └─ CDN, monitoring, backup | 2,500,000 | $100 | 2% |
| **Subtotal Hạ tầng** | **17,500,000** | **$700** | **14%** |
| **Marketing & Growth** | | | |
| └─ Content production (video, blog) | 7,500,000 | $300 | 6% |
| └─ Community events, webinar | 2,500,000 | $100 | 2% |
| └─ Paid acquisition (small budget) | 5,000,000 | $200 | 4% |
| **Subtotal Marketing** | **15,000,000** | **$600** | **12%** |
| **Vận hành** | | | |
| └─ SaaS tools (Mixpanel, SendGrid, etc.) | 3,750,000 | $150 | 3% |
| └─ Legal & Accounting | 2,500,000 | $100 | 2% |
| └─ Miscellaneous/Buffer | 5,000,000 | $200 | 4% |
| **Subtotal Vận hành** | **11,250,000** | **$450** | **9%** |
| | | | |
| **🔥 TỔNG BURN RATE/THÁNG** | **~93,750,000** | **~$3,750** | **100%** |
| **TỔNG BURN RATE/NĂM** | **~1,125,000,000** | **~$45,000** | |

> **Tại sao burn thấp hơn pitch deck ($5K-7.5K/tháng)?**
> - Lương team tại Việt Nam thấp hơn đáng kể so với global benchmark
> - Sử dụng Gemini Flash + Groq (chi phí thấp nhất thị trường)
> - Founder chấp nhận lương thấp giai đoạn đầu
> - Tận dụng startup credits từ GCP/AWS

---

## 4. UNIT ECONOMICS — PHÂN TÍCH ĐƠN VỊ

### 4.1 Chi phí LLM per user (chi tiết)

**Giả định cho 1 lần tạo kế hoạch marketing:**

| Stage | Model | Input tokens | Output tokens | Cost/lần |
|---|---|---:|---:|---:|
| Stage 1: Profiling | Gemini Flash | ~3,000 | ~5,000 | $0.002 |
| Stage 2: Strategic Debate | Gemini Flash (3 agents × 2 rounds) | ~15,000 | ~25,000 | $0.012 |
| Stage 3: Tactical & Budget | Gemini Flash + Math Engine | ~8,000 | ~15,000 | $0.007 |
| Stage 4: Micro-execution | Groq (Llama) | ~2,000 | ~4,000 | $0.001 |
| **Tổng/kế hoạch** | | **~28,000** | **~49,000** | **~$0.022** |

**Chi phí LLM per user/tháng (ước tính):**

| Tier | Kế hoạch/tháng (avg) | LLM cost/user/tháng |
|---|---:|---:|
| FREE | 2 | $0.044 |
| PLUS | 8 | $0.176 |
| PRO | 20 | $0.440 |

> **Kết luận:** LLM cost per user cực thấp nhờ dùng Gemini Flash ($0.10/M input) + Groq. Gross margin rất cao trên LLM cost alone.

### 4.2 Unit Economics tổng hợp

| Metric | Year 1 | Year 2 | Year 3 | Benchmark |
|---|---:|---:|---:|---|
| **ARPU (monthly)** | $22 | $28 | $35 | — |
| **LLM cost/user/tháng** | $0.18 | $0.25 | $0.35 | Tăng theo usage |
| **Infra cost/user/tháng** | $3.50 | $1.50 | $0.80 | Giảm nhờ economies of scale |
| **COGS/user/tháng** | $3.68 | $1.75 | $1.15 | — |
| **Gross Profit/user/tháng** | $18.32 | $26.25 | $33.85 | — |
| **Gross Margin** | **83%** | **94%** | **97%** | Traditional SaaS: 80-90% |
| **CAC** | $25 | $20 | $15 | Community-led: $15-25 |
| **LTV (12 months, adj. churn)** | $132 | $224 | $350 | Tính với 6% monthly churn → ~50% annual retention |
| **LTV/CAC** | **5.3x** | **11.2x** | **23.3x** | Healthy: >3x |
| **Payback period** | 1.4 tháng | 0.8 tháng | 0.4 tháng | Healthy: <12 tháng |

> **⚠️ Cảnh báo về Gross Margin:**
> - Year 1 infra cost/user cao vì **fixed cost chia cho ít users** (VPS, monitoring chạy dù 5 hay 500 users)
> - Gross margin 83% Year 1 nhưng sẽ tăng nhanh khi scale vì LLM cost rất thấp và infra cost gần như cố định
> - **AI SaaS thực tế thường có GM 50-60%** do agentic workflow gọi nhiều LLM calls. BrandFlow đạt 83%+ vì dùng Gemini Flash (rẻ nhất thị trường) và Math Engine bằng Python (zero LLM cost)

### 4.3 Phân tích LTV với churn thực tế

**Monthly churn 6% → Annual retention rate:**
- Sau 12 tháng: (1 - 0.06)^12 = **47.5% users còn lại**
- Average lifetime = 1/0.06 = **16.7 tháng**
- **LTV = ARPU × Average Lifetime = $55 × 16.7 = $918** (Year 1 cohort, lý thuyết)

**Nhưng thực tế cần discount:**
- Không phải user nào cũng trả full ARPU mỗi tháng (downgrade, pause)
- **Adjusted LTV ≈ $330** (discount ~64% cho rủi ro)

---

## 5. DỰ PHÓNG P&L — 3 NĂM

### 5.1 Bảng P&L theo năm

| | Year 1 | Year 2 | Year 3 |
|---|---:|---:|---:|
| **REVENUE** | | | |
| Subscription Revenue | $16,000 | $130,000 | $330,000 |
| One-time / Add-ons | $0 | $2,000 | $8,000 |
| **Total Revenue** | **$16,000** | **$37,000** | **$128,000** |
| | | | |
| **COGS (Cost of Goods Sold)** | | | |
| LLM API costs | $1,200 | $4,000 | $10,000 |
| Cloud infrastructure | $2,400 | $4,800 | $7,200 |
| **Total COGS** | **$3,600** | **$8,800** | **$17,200** |
| **Gross Profit** | **$2,900** | **$28,200** | **$110,800** |
| **Gross Margin** | **45%** | **76%** | **87%** |
| | | | |
| **OPERATING EXPENSES** | | | |
| Salaries & Benefits | $24,000 | $36,000 | $60,000 |
| Marketing & Growth | $7,200 | $12,000 | $18,000 |
| SaaS tools & Services | $1,800 | $3,000 | $4,800 |
| Legal & Accounting | $1,200 | $2,000 | $3,000 |
| Office & Miscellaneous | $2,400 | $3,000 | $4,200 |
| **Total OpEx** | **$36,600** | **$56,000** | **$90,000** |
| | | | |
| **EBITDA** | **-$33,700** | **-$27,800** | **+$20,800** |
| **EBITDA Margin** | **-518%** | **-75%** | **+16%** |

> **Gross Margin thực tế (45% Year 1) thấp hơn nhiều so với "83-88%" trong pitch deck.** Đó là vì pitch deck tính Gross Margin chỉ trên biến phí (LLM + infra variable), còn P&L thực tế phải tính cả **fixed infrastructure** vào COGS. Khi scale lên 500 users, GM sẽ tiệm cận 87%.

### 5.2 Dòng tiền theo tháng — Year 1 (Chi tiết)

| Tháng | Free Users (tích lũy) | Paid Users | MRR | Cumulative Revenue | Monthly Burn | Cumulative Loss |
|---:|---:|---:|---:|---:|---:|---:|
| 1 (Jul 2026) | 50 | 1 | $55 | $55 | $3,750 | -$3,728 |
| 2 | 95 | 2 | $110 | $165 | $3,750 | -$7,434 |
| 3 | 130 | 5 | $275 | $440 | $3,750 | -$11,074 |
| 4 | 175 | 7 | $385 | $825 | $3,750 | -$14,670 |
| 5 | 225 | 9 | $495 | $1,320 | $3,750 | -$18,222 |
| 6 | 280 | 14 | $770 | $2,090 | $3,750 | -$21,664 |
| 7 | 350 | 18 | $990 | $3,080 | $3,750 | -$25,018 |
| 8 | 425 | 22 | $1,210 | $4,290 | $3,750 | -$28,284 |
| 9 | 530 | 29 | $1,595 | $5,885 | $3,750 | -$31,396 |
| 10 | 650 | 36 | $1,980 | $7,865 | $3,750 | -$34,354 |
| 11 | 780 | 44 | $2,420 | $10,285 | $3,750 | -$37,136 |
| 12 | 920 | 53 | $2,915 | $13,200 | $3,750 | -$39,636 |

> **Cumulative Loss Year 1 ≈ -$30,000** (cần funding để cover)

---

## 6. PHÂN TÍCH BREAKEVEN

### Điểm hòa vốn — khi nào BrandFlow tự nuôi được?

**Burn rate cố định (không tăng team):** $3,750/tháng

**MRR cần để breakeven:** $3,750

**Số paid users cần:** $3,750 ÷ $55 (ARPU Y1) = **~68 paid users**

Hoặc với ARPU Year 2 ($28): **$3,750 ÷ $28 = ~134 paid users**

| Scenario | Paid users cần | Free users cần (3% conversion) | Thời gian dự kiến |
|---|---:|---:|---|
| **Conservative** (ARPU $55, burn $3,750) | 68 | 2,200 | **Tháng 10–12** (Q4/2026) |
| **Base** (ARPU $65, burn $3,750) | 58 | 1,900 | **Tháng 8–10** (Q1/2027) |
| **Optimistic** (ARPU $80, burn $3,750) | 47 | 1,500 | **Tháng 6–8** (Q4/2026) |

> **⚠️ Thực tế:** Khi scale lên, burn sẽ tăng (thêm người, thêm infra). Breakeven thực tế có thể muộn hơn 2-4 tháng so với bảng trên nếu tuyển thêm team.

### Breakeven theo scenario burn tăng dần:

| Scenario | Burn/tháng | Paid users cần | Thời gian |
|---|---:|---:|---|
| Solo founder (hiện tại) | $800 | 15 | **Tháng 10-12** |
| +1 engineer | $2,500 | 45 | **Tháng 15-18** |
| Full team (plan) | $3,750 | 170 | **Tháng 20-24** |
| Aggressive hiring | $6,000 | 273 | **Tháng 24-30** |

---

## 7. FUNDING & RUNWAY

### 7.1 Pre-Seed Ask: $50,000 – $100,000

> **Tại sao giảm xuống $50K-100K thay vì $100K-150K trong pitch deck?**
> - Burn rate thực tế ($3,750/tháng) thấp hơn nhiều so với dự kiến ban đầu ($7K-10K)
> - Với $50K, đã có **13 tháng runway** — đủ để chứng minh PMF
> - Gọi vừa phải, giữ equity tốt hơn cho Seed round

### 7.2 Phân bổ vốn (Base case: $75,000)

| Hạng mục | Tỷ lệ | Số tiền | Mục đích cụ thể |
|---|---:|---:|---|
| Engineering & Product | 40% | $30,000 | Hire 1 AI engineer part-time (12 tháng × $800) + designer freelance |
| Go-to-Market | 25% | $18,750 | Content marketing, community events, partnership activation |
| Infrastructure | 15% | $11,250 | Cloud, LLM API reserves, monitoring (12 tháng × $700 + buffer) |
| Operations & Buffer | 20% | $15,000 | Legal, accounting, contingency, founder compensation |

### 7.3 Runway Analysis

| Funding Amount | Monthly Burn | Runway | Đủ tới breakeven? |
|---:|---:|---:|---|
| **$50,000** | $3,750 | **13 tháng** | ⚠️ Tight — cần đạt breakeven hoặc raise Seed trước tháng 13 |
| **$75,000** | $3,750 | **20 tháng** | ✅ Thoải mái — đủ thời gian validate PMF + approach breakeven |
| **$100,000** | $3,750 | **27 tháng** | ✅ Rất thoải mái — có thể hiring thêm hoặc tăng marketing spend |
| **$100,000** | $5,000 (burn tăng) | **20 tháng** | ✅ Nếu muốn tuyển aggressive hơn |

### 7.4 Milestones gắn với funding

| Timeline | Milestone | Metric cụ thể | Ý nghĩa |
|---|---|---|---|
| +3 tháng (T10/2026) | Public Launch + First Revenue | 200 free users, 10 paid, MRR $220 | Chứng minh "có người trả tiền" |
| +6 tháng (T1/2027) | Product-Market Fit Signal | 500 free, 30 paid, MRR $660, NPS>50 | PMF nếu >40% retention + NPS>50 |
| +9 tháng (T4/2027) | Growth Momentum | 700 free, 50 paid, MRR $1,100 | Đủ data để plan Seed round |
| +12 tháng (T7/2027) | Seed-Ready | 1,000 free, 80 paid, MRR $1,760 | Có thể pitch Seed round |
| +15 tháng (T10/2027) | Approaching Breakeven | 2,000 free, 130 paid, MRR $3,640 | Gần tự nuôi được |

---

## 8. PHÂN TÍCH CHI PHÍ LLM CHI TIẾT — SENSITIVITY

### Giá LLM hiện tại (tháng 6/2026)

| Provider | Model | Input/M tokens | Output/M tokens | Ghi chú |
|---|---|---:|---:|---|
| Google Gemini | Flash/Lite | $0.10 | $0.40 | BrandFlow primary |
| Google Gemini | Pro 3.x | $2.00 | $12.00 | Backup cho complex tasks |
| Groq | Llama (budget) | $0.05-0.10 | $0.08-0.40 | BrandFlow secondary |
| Groq | Llama 70B+ | $0.59 | $0.79 | Content generation |

### Chi phí LLM theo scale

| Paid Users | Free Users (est.) | Total requests/tháng | LLM cost/tháng | LLM cost/paid user |
|---:|---:|---:|---:|---:|
| 10 | 200 | 500 | $11 | $1.10 |
| 50 | 800 | 2,500 | $55 | $1.10 |
| 100 | 1,500 | 5,000 | $110 | $1.10 |
| 500 | 5,000 | 25,000 | $550 | $1.10 |
| 1,000 | 10,000 | 50,000 | $1,100 | $1.10 |

> **Kết luận:** LLM cost scales linearly và rất thấp (~$1.10/paid user/tháng). Đây là lợi thế lớn vì dùng Gemini Flash + Groq. **Rủi ro tăng giá LLM thấp** vì trend thị trường đang giảm giá mạnh.

### Sensitivity Analysis — LLM cost tăng 3x

| Scenario | LLM cost/user/tháng | Impact trên Gross Margin |
|---|---:|---|
| Current (Gemini Flash) | $0.18 | GM = 83% |
| LLM giá tăng 2x | $0.36 | GM = 82% (tác động rất nhỏ) |
| LLM giá tăng 3x | $0.54 | GM = 81% |
| Chuyển sang Gemini Pro | $2.50 | GM = 72% (vẫn healthy) |

> **LLM cost không phải rủi ro lớn** đối với BrandFlow vì chiếm tỷ trọng rất nhỏ trong tổng cost structure. Rủi ro lớn hơn là **tuyển người** và **marketing spend**.

---

## 9. SCENARIO PLANNING — 3 KỊCH BẢN

### Kịch bản A: Conservative (Probability: 50%)
*Không raise được funding, bootstrapped*

| | Year 1 | Year 2 | Year 3 |
|---|---:|---:|---:|
| Team | 1 founder | 1 founder + 1 part-time | 2 full-time |
| Paid users (EOY) | 25 | 80 | 200 |
| MRR (EOY) | $550 | $2,240 | $7,000 |
| ARR (EOY) | $6,600 | $26,880 | $84,000 |
| Burn/tháng | $800 | $1,500 | $3,000 |
| Cash position | Tự nuôi | Tự nuôi | Profitable |
| Breakeven | **Tháng 12** | Đã breakeven | Growing |

### Kịch bản B: Base Case (Probability: 35%)
*Raise $75K Pre-Seed, team 3-4 người*

| | Year 1 | Year 2 | Year 3 |
|---|---:|---:|---:|
| Team | 3 people | 4 people | 6 people |
| Paid users (EOY) | 53 | 180 | 500 |
| MRR (EOY) | $1,166 | $5,040 | $17,500 |
| ARR (EOY) | $13,992 | $60,480 | $210,000 |
| Burn/tháng | $3,750 | $5,500 | $8,000 |
| Breakeven | **Tháng 18-20** | Gần breakeven | **Profitable** |

### Kịch bản C: Optimistic (Probability: 15%)
*Raise $150K, product-led growth viral, 1 Enterprise deal*

| | Year 1 | Year 2 | Year 3 |
|---|---:|---:|---:|
| Team | 4 people | 7 people | 12 people |
| Paid users (EOY) | 100 | 500 | 2,000 |
| MRR (EOY) | $2,800 | $17,500 | $80,000 |
| ARR (EOY) | $33,600 | $210,000 | $960,000 |
| Burn/tháng | $6,000 | $12,000 | $25,000 |
| Breakeven | **Tháng 22-24** | **Tháng 15-18** | Profitable |
| Seed Round | — | $500K-1M | — |

---

## 10. RỦI RO TÀI CHÍNH & BIỆN PHÁP GIẢM THIỂU

| # | Rủi ro | Xác suất | Tác động | Biện pháp giảm thiểu |
|---|---|:---:|:---:|---|
| 1 | **Không raise được funding** | 40% | Cao | Bootstrapped path (Scenario A) vẫn khả thi — breakeven tháng 12 |
| 2 | **Churn cao hơn dự kiến (>8%/tháng)** | 30% | Cao | Focus on activation metrics, onboarding improvement, NPS monitoring |
| 3 | **Conversion rate thấp (<2%)** | 25% | Trung bình | A/B test pricing, add trial period, improve free→paid value gap |
| 4 | **LLM provider tăng giá** | 10% | Thấp | Multi-provider strategy, caching, model routing đã implement |
| 5 | **Competitor lớn (Canva, HubSpot) enter** | 20% | Trung bình | Vertical depth + Vietnam localization = moat thời gian 12-18 tháng |
| 6 | **Founder burnout (1-person team)** | 35% | Rất cao | Tìm co-founder, chia sẻ equity, tham gia accelerator |
| 7 | **Quy định pháp lý AI thay đổi** | 15% | Trung bình | SOC2 compliance đã có (docs/soc2_policies), data privacy by design |

---

## 11. KPI DASHBOARD — THEO DÕI HÀNG THÁNG

### North Star Metric: **Số bản kế hoạch marketing được tạo/tháng**

| KPI Category | Metric | Target Q3/2026 | Target Q4/2026 | Target Q1/2027 |
|---|---|---:|---:|---:|
| **Growth** | Free signups/tháng | 50 | 80 | 120 |
| **Growth** | Paid users (cumulative) | 5 | 14 | 29 |
| **Revenue** | MRR | $110 | $308 | $638 |
| **Revenue** | ARPU | $55 | $55 | $22 |
| **Retention** | Monthly churn (paid) | <8% | <7% | <6% |
| **Retention** | NPS | >55 | >58 | >60 |
| **Engagement** | Plans created/user/tháng | 2.5 | 3.0 | 3.5 |
| **Engagement** | Activation rate (first plan within 24h) | 40% | 50% | 60% |
| **Efficiency** | LLM cost/paid user | <$1.50 | <$1.20 | <$1.10 |
| **Efficiency** | CAC | <$30 | <$25 | <$20 |

---

## 12. SEED ROUND READINESS — CHECKLIST

### Criteria để sẵn sàng gọi Seed ($500K-$1M)

| # | Criteria | Target | Status |
|---|---|---|:---:|
| 1 | MRR | >$10,000 | 🔲 |
| 2 | Paid users | >300 | 🔲 |
| 3 | Monthly growth rate | >15% MoM | 🔲 |
| 4 | Churn | <5% monthly | 🔲 |
| 5 | NPS | >60 | ✅ (đã đạt 62) |
| 6 | LTV/CAC | >5x | 🔲 |
| 7 | Product completion | Full feature set | ✅ |
| 8 | Team | ≥3 core members | 🔲 |
| 9 | B2B traction | ≥1 Enterprise pilot | 🔲 |
| 10 | Data moat | >5,000 plans created | 🔲 |

**Thời gian dự kiến đạt Seed-ready:** Q2-Q3/2028 (Base case) hoặc Q4/2027 (Optimistic)

---

## 📋 PHỤ LỤC

### A. Nguồn tham khảo Benchmarks

| Benchmark | Nguồn | Giá trị sử dụng |
|---|---|---|
| Freemium conversion 2.6-3.7% | FirstPageSage 2025 | Conversion rate |
| B2B SME churn 3-7%/tháng | Agile Growth Labs, ChartMogul | Churn modeling |
| Vietnam junior AI engineer: 15-30M VNĐ/tháng | SecondTalent, JT1 2026 | Salary planning |
| Gemini Flash: $0.10/M input tokens | Google AI Official Pricing | LLM cost |
| Groq Llama: $0.05-0.10/M input tokens | Groq Official Pricing | LLM cost |
| Pre-seed VN: $25K-500K, 18-24 months runway | Peony, Zabella 2025 | Funding sizing |

### B. Các giả định có thể thay đổi

| Giả định | Giá trị hiện tại | Khi nào cần cập nhật |
|---|---|---|
| Freemium → Paid conversion | 3% | Sau 3 tháng Public Launch |
| Monthly churn | 6% | Sau có 50+ paid users |
| ARPU | $22 | Sau có 30+ paid users data |
| Organic growth rate | 50 signups/tháng ban đầu | Sau 2 tháng marketing |
| Burn rate | $3,750/tháng (with funding) | Khi tuyển thêm người |

### C. Disclaimer

> Tài liệu này là kế hoạch tài chính dự kiến, không phải cam kết. Mọi con số đều là ước tính dựa trên assumptions tốt nhất tại thời điểm viết (tháng 6/2026). Kế hoạch sẽ được cập nhật hàng quý khi có data thực tế.

---

*📊 BrandFlow Financial Plan v1.0 — Realistic, Data-Driven, Founder-Honest*
