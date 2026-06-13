import React from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertTriangle, Target, Briefcase, Zap, TrendingUp, ShieldAlert, BarChart3, Layers, MessageSquare, Users } from 'lucide-react';
import { EducationTooltip } from '@/components/ui/EducationTooltip';

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b', '#06b6d4'];

// Dữ liệu DEMO chuẩn Enterprise — CEO/CMO Grade (McKinsey-level depth)
const DEMO_EXPERT_DATA = {
  "goal_setting": {
    "mission_statement": "Kiến tạo Bếp Nhà Mộc thành 'Thánh địa Mindful Dining' tiên phong tại Sài Gòn — Nơi chữa lành tâm hồn thị dân thông qua nghệ thuật Ẩm thực Việt di sản, không gian kiến trúc mộc mạc nguyên bản và chuỗi cung ứng Farm-to-Table 100% hữu cơ. Mục tiêu trung hạn (3 năm): Trở thành chuỗi F&B 'Wellness Dining' đầu tiên tại Việt Nam có định giá Pre-Series A đạt ngưỡng 50 tỷ VNĐ.",
    "core_competencies": [
      {
        "competency": "Lợi thế Độc quyền (VRIO — Valuable, Rare, Inimitable, Organized): Không gian kiến trúc nhà gỗ cổ truyền 100+ năm tuổi mang âm hưởng hoài niệm, tạo ra 'Therapeutic Environment' (Môi trường trị liệu tâm lý) không thể sao chép giữa lòng thành phố — chi phí tái tạo ước tính > 5 tỷ VNĐ, rào cản gia nhập tuyệt đối.",
        "is_vrio": true
      },
      {
        "competency": "Chuỗi cung ứng Vertical Integration: Hệ sinh thái nguyên liệu 100% Organic khép kín từ 12 nông trại địa phương đạt chứng nhận VietGAP, đảm bảo truy xuất nguồn gốc 100% — giảm 25% chi phí COGS so với mua sỉ trung gian và tạo moat (hào phòng thủ) về chất lượng.",
        "is_vrio": true
      },
      {
        "competency": "Intellectual Property (IP) Thương hiệu: Bộ nhận diện 'Mộc' đã đăng ký bảo hộ sở hữu trí tuệ (NOIP), bao gồm 15+ công thức gia truyền được mã hóa thành SOP chuẩn, sẵn sàng cho việc nhượng quyền (Franchise Model).",
        "is_vrio": false
      },
      {
        "competency": "First-Mover Advantage trong ngách 'Wellness Dining': Chưa có đối thủ trực tiếp nào tại Sài Gòn kết hợp được 3 yếu tố: Ẩm thực di sản + Không gian trị liệu + Trải nghiệm số hóa (Digital-First CX). Cửa sổ cạnh tranh ước tính còn 18-24 tháng trước khi các chuỗi lớn (Golden Gate, Redsun) bắt đầu copy.",
        "is_vrio": true
      }
    ],
    "objectives": {
      "financial_goals": [
        "Vượt điểm hòa vốn (Break-even Point) trong Quý 1 triển khai. Tăng trưởng Revenue từ 1.2 tỷ lên mốc 1.8 tỷ VNĐ/tháng (+50% MoM), đạt Gross Margin ≥ 65% và EBITDA Margin ≥ 18%.",
        "Tối ưu hóa phễu khách hàng trung thành: Đẩy Retention Rate (Tỷ lệ quay lại) từ 15% hiện tại lên mức tiêu chuẩn vàng ngành F&B cao cấp là 35%. Monthly Recurring Revenue (MRR) từ tệp Loyal đạt 500 triệu VNĐ.",
        "Xây dựng tệp First-Party Data: Thu thập tối thiểu 15,000 Qualified Leads (dữ liệu có SĐT + hành vi tiêu dùng) trên Zalo Mini App, làm tài sản sinh lời cho Automation Marketing và nâng Valuation khi gọi vốn Pre-Series A."
      ],
      "marketing_goals": [
        "Thống lĩnh Share of Voice (SOV ≥ 40%) trong ngách 'Ẩm thực chữa lành' trên đa nền tảng: Đạt 5 triệu lượt Organic Reach (TikTok: 3M, Instagram: 1.5M, Facebook: 500K). Engagement Rate trung bình ≥ 4.5% (gấp đôi benchmark ngành F&B = 2.1%).",
        "Định vị Top 3 điểm đến F&B 'Must-visit' về concept Aesthetic & Mindful Dining tại khu vực Central HCMC (Quận 1/3) — đo lường qua: Google Reviews ≥ 4.8/5 (1000+ reviews), TripAdvisor Top 10, và Brand Recall Rate ≥ 65% trong tệp Gen Y/Z HCMC.",
        "Kích hoạt Brand Advocacy Engine: Đạt Net Promoter Score (NPS) ≥ 75 (World-Class). Tỷ lệ Referral (giới thiệu bạn bè) chiếm ≥ 20% tổng Booking mới, giảm phụ thuộc vào Paid Media dài hạn."
      ],
      "cac_ltv_analysis": "Chiến lược Unit Economics 3 tầng: (1) Acquisition — Khống chế CAC (Chi phí thu hút khách) < 40,000 VNĐ/khách thông qua phễu Organic-first + Referral Program (hiện tại CAC = 65,000 VNĐ → giảm 38%). (2) Monetization — Average Revenue Per User (ARPU) = 350,000 VNĐ/lần, tần suất 3.5 lần/quý → Annual Revenue Per User = 4,900,000 VNĐ. (3) Retention — Thông qua Zalo Loyalty tích điểm 'Hạt Gạo', dự kiến đẩy Life-Time Value (LTV) lên mức 12,500,000 VNĐ/khách (thời gian sống trung bình 2.5 năm). Tỷ lệ LTV:CAC = 312:1, Payback Period < 7 ngày — vượt xa ngưỡng an toàn 3:1 của SaaS và 5:1 của D2C F&B."
    },
    "red_lines": [
      "Brand Equity Protection: Tuyệt đối không chạy đua 'Deep Discounting' (giảm giá > 15%) hoặc Flash Sale phá vỡ Price Integrity. Mọi khuyến mãi phải dưới dạng Value-Add (tặng giá trị thêm) chứ không cắt giá — bảo vệ tuyệt đối Perceived Premium Positioning.",
      "Service Quality Ceiling: Không bao giờ nhồi nhét khách vượt quá công suất thiết kế 100 pax/buổi (≈ 200 pax/ngày). Tỷ lệ Table Turnover tối đa 2.5 vòng/buổi — hy sinh Revenue ngắn hạn để bảo toàn Net Promoter Score và trải nghiệm 'Chữa Lành'.",
      "Data Privacy Compliance: Tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân. Tất cả dữ liệu CRM trên Zalo Mini App phải được mã hóa AES-256 và có Consent Management Platform (CMP) trước khi kích hoạt Automation Marketing."
    ]
  },
  "situation_audit": {
    "target_segments": [
      {
        "segment_name": "Segment A: Urban Healers — Gen Z/Y Professionals (22-35 tuổi, thu nhập 15-40 triệu/tháng)",
        "dmu_profiles": [
          {
            "role": "Decider (Người ra quyết định chốt địa điểm — thường là nữ, 25-32 tuổi)",
            "pain_points": [
              "Hội chứng Burnout (Cạn kiệt sức lực) mãn tính từ văn hóa 'Toxic Productivity' — 68% Gen Y HCMC báo cáo mức stress trung bình-cao (Nguồn: Vietnam Happiness Index 2024).",
              "Mất niềm tin vào nguồn gốc thực phẩm sau các scandal an toàn vệ sinh thực phẩm — 74% sẵn sàng chi thêm 30% cho F&B có truy xuất nguồn gốc (Nguồn: Nielsen Vietnam 2024).",
              "'Decision Fatigue' (Mệt mỏi khi chọn lựa): Quá nhiều quán ăn mới mở nhưng thiếu POD (Point of Difference) rõ ràng — chỉ 12% F&B tại HCMC có Brand Story coherent (Nguồn: Nội bộ BrandFlow Research)."
            ],
            "decision_drivers": [
              "Không gian Aesthetic giàu tính kể chuyện (Storytelling), phải có tối thiểu 3 góc check-in đậm chất Cinematic hoài niệm — yếu tố 'Instagrammability' quyết định 65% lần đầu ghé thăm.",
              "Trải nghiệm cá nhân hóa tinh tế: Được gọi tên, nhớ món ưa thích, âm nhạc ASMR tần số thấp (432Hz) giúp xoa dịu hệ thần kinh.",
              "Social Proof mạnh: Reviews ≥ 4.8/5, được KOLs Lifestyle giới thiệu, xuất hiện trên TripAdvisor và Google Guides."
            ]
          },
          {
            "role": "Influencer (Người ảnh hưởng — đồng nghiệp, bạn bè, KOLs trên Social Media)",
            "pain_points": [
              "Áp lực phải 'Curate' trải nghiệm đẹp trên MXH — cần địa điểm đủ Aesthetic để duy trì Personal Branding trên Instagram/TikTok.",
              "Chán ngán các concept F&B 'sao chép' nhau (Industrial, Minimalist) — khao khát trải nghiệm độc bản, 'Only-Here' feeling."
            ],
            "decision_drivers": [
              "Yếu tố 'Shareability': Menu trình bày đẹp (Food Art), không gian có câu chuyện đủ sâu để viết caption 100+ từ.",
              "Brand Values alignment: Thương hiệu phải có lập trường rõ ràng về Sustainability, Wellness, và Heritage — phù hợp với hình ảnh 'Conscious Consumer'."
            ]
          }
        ],
        "value_proposition": "Bếp Nhà Mộc không bán một bữa ăn vật lý. Chúng tôi trao cho khách hàng một 'Liệu pháp Chữa Lành' (Food Therapy) — tấm vé quay về góc bếp tuổi thơ bình yên với mâm cơm nhà chuẩn vị di sản, rũ bỏ hoàn toàn áp lực phố thị ngoài kia. Đây là POD (Point of Difference) không thể sao chép vì nó gắn liền với không gian vật lý 100+ năm tuổi và chuỗi giá trị Farm-to-Table khép kín.",
        "data_sources": [
          "Nielsen Vietnam Consumer Confidence Report Q1/2025 — Xu hướng chi tiêu F&B segment Premium.",
          "Phân tích Dữ liệu CRM nội bộ Bếp Nhà Mộc (Q4/2024 - Q1/2025): 2,300 profiles, RFM Segmentation.",
          "Vietnam Happiness Index 2024 (UNDP & GSO): Báo cáo Burnout và xu hướng Mental Wellness.",
          "BrandFlow AI Market Scan: Social Listening 50,000+ mentions ngách 'Mindful Dining' tại HCMC."
        ]
      },
      {
        "segment_name": "Segment B: Corporate Wellness — B2B (Doanh nghiệp FDI, Startup, Agency có 20-200 nhân sự)",
        "dmu_profiles": [
          {
            "role": "Gatekeeper (HR Manager / Office Manager — Người sàng lọc vendor F&B cho sự kiện nội bộ)",
            "pain_points": [
              "Áp lực thiết kế Team Building & Company Dinner có ý nghĩa — 70% nhân sự chán ngán các buổi nhậu KTV truyền thống (Nguồn: HR Insider Vietnam 2024).",
              "Cần Vendor F&B có thể xuất hóa đơn VAT đỏ, ký hợp đồng B2B, và hỗ trợ logistics cho nhóm 30-80 người."
            ],
            "decision_drivers": [
              "Package 'All-in-one' rõ ràng: Menu + Không gian + MC/Workshop + Décor — không phải coordinate nhiều vendor.",
              "ROI chứng minh được cho HR Budget: Khảo sát Employee Satisfaction sau event ≥ 85% hài lòng."
            ]
          }
        ],
        "value_proposition": "Gói 'Corporate Healing Retreat' — Biến bữa ăn công ty từ 'nghĩa vụ xã giao' thành 'trải nghiệm gắn kết đội nhóm' thực sự. Bao gồm: Menu Ký Ức customized, Workshop nấu ăn di sản, và Mindfulness Tea Ceremony kết thúc — tất cả trong không gian nhà gỗ giúp nhân viên 'reset' sau những sprint căng thẳng.",
        "data_sources": [
          "HR Insider Vietnam Report 2024: Xu hướng Employee Experience & Retention.",
          "Dữ liệu nội bộ: 15 booking B2B từ Q4/2024, Average Deal Size 25 triệu VNĐ, Repeat Rate 60%."
        ]
      }
    ],
    "directional_policy": {
      "market_attractiveness": "Rất Cao (Score: 8.2/10) — TAM (Total Addressable Market) ngành F&B Wellness tại HCMC ước tính 3,500 tỷ VNĐ/năm (Nguồn: Euromonitor 2024). CAGR 22% giai đoạn 2024-2028. Nhu cầu 'Chữa lành tâm lý' (Mental Healing) đang trở thành xu hướng chi tiêu không thể thiếu — 45% dân số Gen Y/Z sẵn sàng chi thêm cho trải nghiệm 'Wellness' (McKinsey Global Wellness Survey 2024).",
      "business_strength": "Khá (Score: 6.8/10) — Concept mộc mạc sở hữu lõi văn hóa mạnh (VRIO-certified), Brand Awareness đạt 35% trong tệp target (cần đẩy lên 65%). Điểm nghẽn nằm ở: (1) Nút thắt vận hành — nhà bếp hiện chỉ chạy 70% công suất do thiếu SOP chuẩn hóa, (2) Hệ thống CSKH số hóa chưa hoàn thiện — chỉ 20% khách hàng được onboard vào Loyalty Program.",
      "investment_decision": "Invest & Grow (Ô 'Star' — Chiến lược Tấn công toàn diện) — Bơm vốn mạnh tay vào 3 trụ: (A) Rebranding đa kênh (Visual Identity + Content Ecosystem), (B) Chuyển đổi số CX (Zalo Mini App + CRM Automation), (C) Operational Excellence (SOP Kitchen + Staff Training Program). Timeline: 90 ngày sprint."
    }
  },
  "strategy": {
    "ansoff_matrix_choice": "Market Penetration (Thâm nhập thị trường sâu) kết hợp Product Development: (1) Penetration — Tận dụng First-Mover Advantage để đánh chiếm 100% tệp 'Conscious Diners' (ước tính 120,000 người tại HCMC Central) đang active trên Instagram/TikTok với hashtag #mindfulling #healingfood. Market Share mục tiêu: từ 2% lên 8% trong 12 tháng. (2) Product Dev — Launch 2 SKU mới: 'Thực Đơn Ký Ức' (Heritage Menu rotating hàng tháng) và 'Corporate Healing Retreat Package' (B2B) để mở rộng Average Revenue Per Account.",
    "positioning_statement": "Bỏ lại sau lưng thị trường 'Quán ăn gia đình' truyền thống đang Đỏ lửa cạnh tranh (Red Ocean — 35,000+ quán tại HCMC), Bếp Nhà Mộc thiết lập một Đại dương Xanh (Blue Ocean Strategy): Là chốn về duy nhất trao đi trải nghiệm 'Ẩm thực Việt Chữa Lành' (POD). Positioning Map: Trục X = Mức độ Premium (High), Trục Y = Tính trị liệu (Highest) — không overlap với bất kỳ competitor nào trong bán kính 5km.",
    "expected_roi_justification": "Luận điểm đầu tư (Investment Thesis): Khoản ngân sách 350 triệu VNĐ không phải chi phí (OPEX), mà là Đòn bẩy Tăng trưởng (Growth Lever). Dự kiến Incremental Revenue: +600 triệu VNĐ/tháng bắt đầu từ tháng thứ 2, tương đương ROI = 71.4% trong 60 ngày. Quy về NPV (Net Present Value) với Discount Rate 12%/năm: NPV = 4.2 tỷ VNĐ trong 12 tháng. Đồng thời xây đắp 2 tài sản vô hình sinh lời dài hạn: (A) Tệp First-Party Data 15,000+ profiles trên Zalo Loyalty — giá trị ước tính 75,000 VNĐ/profile = 1.125 tỷ VNĐ, (B) Brand Equity Premium cho phép tăng giá menu +15% mà không mất Volume — tương đương EBITDA impact +180 triệu/tháng."
  },
  "tactics": {
    "tactics_7ps": [
      {
        "p_name": "Product (Sản phẩm)",
        "action_bullet": "R&D và Launch 'Thực Đơn Ký Ức' (Heritage Rotating Menu) thay đổi hàng tháng theo mùa vụ nông sản + Gói Business Lunch Combo đóng hộp bã mía Eco-friendly cao cấp (giá 189K-259K). Phát triển thêm 'Healing Set Menu' cho segment Premium (giá 599K-899K, food pairing với trà thảo mộc Đà Lạt).",
        "kpi": "Tăng 25% doanh thu khung giờ thấp điểm (11h-14h). Set Menu Premium đóng góp ≥ 15% tổng Revenue. Menu Satisfaction Score ≥ 4.7/5.",
        "budget_vnd": 30000000,
        "budget_allocation_percent": 8.6,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Price (Chiến lược giá)",
        "action_bullet": "Áp dụng mô hình Tiered Pricing (Giá phân tầng): Basic Menu (150-250K), Heritage Menu (280-400K), Healing Premium Set (599-899K). Triển khai Dynamic Pricing nhẹ: +10% phụ thu Peak Hours (18h-20h Cuối tuần) để tối ưu Yield Management. Không bao giờ giảm giá — chỉ Value-Add (tặng Trà Mộc, Dessert di sản).",
        "kpi": "Average Check Size tăng từ 250K lên 320K (+28%). Gross Margin duy trì ≥ 65%. Không phát sinh Price Erosion.",
        "budget_vnd": 0,
        "budget_allocation_percent": 0,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Promotion (Truyền thông)",
        "action_bullet": "Phase 1 (Tháng 1): Cinematic Brand Film 'Hương Vị Chữa Lành' (4K, 3 phút) — kịch bản Emotional Storytelling, casting diễn viên chuyên nghiệp, quay tại location thực. Phase 2 (Tháng 2-3): Chiến dịch KOLs đa nền tảng — 5 Macro (500K+ followers) + 30 Micro-Influencers (10K-50K) thuộc hệ sinh thái Lifestyle/Wellness/Food. Phase 3 (Ongoing): UGC Engine — khuyến khích khách hàng tạo nội dung qua Hashtag Challenge #ChữaLànhBằngVị trên TikTok.",
        "kpi": "Brand Film: 3M+ lượt xem Organic. KOL Campaign: 50+ bài UGC chất lượng cao, Earned Media Value ≥ 500 triệu VNĐ. Tổng: 2000+ Bookings mới trong 90 ngày.",
        "budget_vnd": 150000000,
        "budget_allocation_percent": 42.8,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Place (Phân phối & Kênh)",
        "action_bullet": "Kênh Performance: Bơm ngân sách Meta Ads (Facebook/Instagram) + TikTok Ads tập trung chuyển đổi trực tiếp về Zalo Mini App Booking (CTA: 'Đặt bàn Chữa Lành'). Kênh Organic: SEO Local (Google My Business optimized), Partnerships với 5 Concierge Hotel 4-5 sao khu vực Quận 1/3 (Commission 8%). Kênh B2B: Direct Sales cho tệp Corporate qua LinkedIn + Email Automation.",
        "kpi": "Paid Channels: CAC < 40K VNĐ, ROAS ≥ 15x. Mang về doanh thu trực tiếp 600 triệu VNĐ. Organic: chiếm ≥ 40% tổng Booking sau 6 tháng.",
        "budget_vnd": 90000000,
        "budget_allocation_percent": 25.7,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "People (Con người)",
        "action_bullet": "Triển khai 'Mộc Academy' — Chương trình đào tạo nội bộ 40 giờ cho toàn bộ 25 nhân sự: Service Mindset (Tư duy phục vụ chữa lành), Brand Storytelling (Mỗi nhân viên là một Brand Ambassador), Upselling kỹ thuật (từ Basic → Heritage Menu). Tuyển thêm 1 F&B Manager có kinh nghiệm chuỗi + 1 Digital Marketing Executive full-time.",
        "kpi": "Employee Satisfaction Score ≥ 85%. Staff Turnover Rate < 15%/năm (benchmark ngành F&B = 35%). Upselling Rate tăng từ 10% lên 30%.",
        "budget_vnd": 20000000,
        "budget_allocation_percent": 5.7,
        "moscow_tag": "SHOULD_HAVE"
      },
      {
        "p_name": "Physical Evidence (Nhận diện & Không gian)",
        "action_bullet": "Nâng cấp toàn diện Visual Identity System: Menu gỗ khắc laser, Bao bì Kraft nguyên bản (đạt chứng nhận FSC), Đồng phục Linen tone đất, Art Direction Fanpage theo concept 'Nostalgic Cinematic'. Bổ sung 2 góc check-in mới: 'Góc Bếp Ngoại' (vintage kitchen) và 'Sân Giếng Xưa' (courtyard) — target 500+ UGC photos/tháng.",
        "kpi": "Perceived Value Score tăng, cho phép thiết lập Premium Pricing (+15% giá menu). Instagram Hashtag mentions ≥ 1,000/tháng. Google Photos contributions ≥ 300/tháng.",
        "budget_vnd": 25000000,
        "budget_allocation_percent": 7.1,
        "moscow_tag": "SHOULD_HAVE"
      },
      {
        "p_name": "Process (Quy trình & Công nghệ)",
        "action_bullet": "Phát triển Zalo Mini App 'Mộc Loyalty' — Hệ sinh thái số hóa toàn diện: (1) Đặt bàn Online (Real-time availability), (2) Tích điểm 'Hạt Gạo' (1 điểm = 10K chi tiêu, 100 điểm = 1 món quà di sản), (3) Automation Marketing (Birthday flow, Win-back flow 30 ngày, NPS Survey tự động sau 24h), (4) Menu QR interactivo kèm câu chuyện nguồn gốc từng nguyên liệu.",
        "kpi": "Mini App Adoption Rate ≥ 60% khách hàng. Retention Rate bứt phá từ 15% lên 35%. Automation Revenue chiếm ≥ 10% tổng Booking. Khảo sát NPS response rate ≥ 25%.",
        "budget_vnd": 35000000,
        "budget_allocation_percent": 10.0,
        "moscow_tag": "MUST_HAVE"
      }
    ],
    "total_budget_used": 350000000,
    "task_ready_checklist": [
      "[Owner: CMO] Duyệt kịch bản phân cảnh (Storyboard) và chốt Casting cho Cinematic Brand Film — Deadline: Tuần 1.",
      "[Owner: CMO] Ký NDA và hợp đồng với 5 Macro + 30 Micro-Influencer thuộc hệ sinh thái Lifestyle/Wellness — Deadline: Tuần 2.",
      "[Owner: CTO] Chốt thiết kế UI/UX luồng Booking và nghiệm thu Sprint 1 Zalo Mini App Loyalty — Deadline: Tuần 3.",
      "[Owner: COO] Hoàn thành Mộc Academy Batch 1 (40 giờ đào tạo cho 25 nhân sự) — Deadline: Tuần 4.",
      "[Owner: CFO] Ký duyệt bản in Test (Proofing) bộ bao bì Kraft FSC-certified — Deadline: Tuần 2.",
      "[Owner: CEO] Ký duyệt ngân sách 350 triệu VNĐ và Authorize Performance Ads account — Deadline: Tuần 1."
    ]
  },
  "cfo_risk": {
    "cfo_comment": "Từ góc độ Quản trị Tài chính (CFO Perspective): Khoản đầu tư 350 triệu VNĐ là một nước cờ táo bạo nhưng có kiểm soát — Budget Burn Rate ước tính 117 triệu/tháng, trong khi Expected Incremental Revenue = 600 triệu/tháng từ tháng 2, tạo ra Cash Flow Positive ngay trong 45 ngày. Việc tôi kiên quyết ép giảm chi phí Brand Film từ 80 triệu xuống 50 triệu và tái phân bổ 30 triệu sang phễu Performance Ads (CAC-optimized) là để chốt chặn rủi ro Sunk-cost và đảm bảo mỗi đồng tiền đều có Attribution Path đo lường được. Kế hoạch này đạt độ an toàn dòng tiền cao (Cash Runway ≥ 6 tháng), nhưng yêu cầu: (1) COO giám sát chặt năng lực chịu tải nhà bếp, (2) CMO phải báo cáo ROAS hàng tuần, (3) CEO sẵn sàng Authorize thêm 150 triệu nếu kích hoạt Scale-up Phase.",
    "risk_assessment": [
      {
        "risk_scenario": "Rủi ro Truyền thông (Probability: 25%, Impact: High): Brand Film rơi vào 'vùng chết' thuật toán TikTok/Instagram, không tạo ra chuyển đổi Booking như kỳ vọng. Root Cause: Kịch bản không đủ Emotional Hook hoặc timing lên sóng trùng với event lớn của đối thủ.",
        "trigger_point_metric": "Tín hiệu cảnh báo (Early Warning): Booking qua Zalo Mini App < 50 lượt sau 72 giờ lên sóng video Hero. Hoặc: Video Watch-Through Rate < 15% (benchmark: 25%). Hoặc: Comment Sentiment Negative > 10%.",
        "contingency_plan_b": "Plan B (Response Time: 24h): Dừng lập tức ngân sách Boost Video (cắt lỗ Sunk-cost). Xoay trục (Pivot) dồn toàn lực sang Performance Ads chạy thẳng offer 'Tặng Chè Khúc Bạch Mộc khi Booking qua Zalo' — target CPA < 35K. Song song: Re-edit Brand Film thành 3 clips ngắn 15-30s tối ưu cho Reels/TikTok và A/B test lại."
      },
      {
        "risk_scenario": "Rủi ro Vận hành (Probability: 35%, Impact: Critical): 'Vỡ trận' (Capacity Overflow) do bùng nổ traffic vào Peak Days (Thứ 6-CN), gây sụp đổ trải nghiệm khách hàng: Thời gian chờ > 45 phút, món ra chậm, staff quá tải → NPS sụt giảm nghiêm trọng, 1-star reviews lan tràn.",
        "trigger_point_metric": "Tín hiệu cảnh báo: (1) Service Complaint Rate vượt mốc 5% tổng số bàn/ngày, (2) Average Wait Time > 30 phút (hiện tại: 12 phút), (3) Google Review Rating giảm dưới 4.5/5 trong 7 ngày liên tiếp.",
        "contingency_plan_b": "Plan B (Response Time: Ngay lập tức): Kích hoạt chiến thuật Scarcity Marketing (Marketing Khan hiếm) — đóng cổng Walk-in 100%, cấu hình Zalo Booking chỉ nhận tối đa 80 khách/buổi (giảm 20% so với full capacity) để tạo urgency + bảo vệ trải nghiệm. Song song: CEO authorize budget thuê thêm 5 part-time staff + tăng ca bếp. COO triển khai Emergency SOP 'Peak Protocol'."
      },
      {
        "risk_scenario": "Rủi ro Cạnh tranh (Probability: 15%, Impact: Medium): Đối thủ lớn (Golden Gate, The Coffee House) nhận thấy ngách 'Wellness Dining' tiềm năng và launch concept tương tự với ngân sách Marketing gấp 10 lần, gây 'Noise Pollution' trong kênh truyền thông.",
        "trigger_point_metric": "Tín hiệu cảnh báo: (1) Đối thủ có > 3 bài PR/KOL về concept tương tự trong 1 tháng, (2) Share of Voice của Bếp Nhà Mộc giảm dưới 30% (hiện tại: 45%), (3) Branded Search Volume giảm > 15% MoM.",
        "contingency_plan_b": "Plan B (Response Time: 2 tuần): Accelerate Community Building — chuyển từ 'Brand Awareness' sang 'Brand Community'. Launch chương trình 'Mộc Insiders' (100 VIP members, access sớm menu mới, invite-only events). Tăng cường Content Moat: Series YouTube 'Bếp Ngoại Kể' (câu chuyện di sản ẩm thực) tạo Long-form Content mà đối thủ không thể copy nhanh. Chiến lược: 'They can copy the concept, but they can't copy the 100-year-old house.'"
      }
    ]
  }
};


export default function ExecutiveReport() {
  const { wizardAnswers, tacticsPlan, debateLogs, brandDNA } = useFormStore();
  const { t } = useLanguage();

  // Dùng Demo Data nếu tacticsPlan trống (chưa chạy backend)
  const planData = (tacticsPlan && Object.keys(tacticsPlan).length > 0) ? tacticsPlan : DEMO_EXPERT_DATA;
  
  const goal = planData.goal_setting || DEMO_EXPERT_DATA.goal_setting;
  const audit = planData.situation_audit || DEMO_EXPERT_DATA.situation_audit;
  const strategy = planData.strategy || DEMO_EXPERT_DATA.strategy;
  const tactics = planData.tactics || DEMO_EXPERT_DATA.tactics;
  const cfo = planData.cfo_risk || DEMO_EXPERT_DATA.cfo_risk;
  const logs = debateLogs && debateLogs.length > 0 ? debateLogs : [];
  const brandName = brandDNA?.brand_name || wizardAnswers?.company_name || wizardAnswers?.industry || 'Enterprise';

  const budgetPieData = React.useMemo(() => {
    if (!tactics || !tactics.tactics_7ps) return [];
    return tactics.tactics_7ps.map((act: any) => ({
      name: act.p_name,
      value: act.budget_vnd
    }));
  }, [tactics]);

  const pageClass = "w-full sm:w-[210mm] min-h-[100vh] sm:min-h-[297mm] mx-auto bg-white text-slate-900 shadow-2xl print:shadow-none print:m-0 relative overflow-hidden font-sans report-container print:break-after-page mb-8 print:mb-0";

  return (
    <div className="flex flex-col items-center pb-8 print:pb-0 bg-slate-100 dark:bg-[#0B1120] py-8">
      
      {/* =======================
          PAGE 1: COVER PAGE
          ======================= */}
      <div className={pageClass}>
        <div className="absolute top-0 left-0 w-full h-[60%]">
          <div className="w-full h-full bg-cover bg-center executive-report-cover"></div>
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
          <div className="absolute top-10 left-10 text-white font-black text-4xl tracking-tighter flex items-center">
            <Zap className="w-8 h-8 text-cyan-400 mr-2" />
            BrandFlow<span className="text-cyan-400">.</span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-white p-6 sm:p-[20mm] flex flex-col justify-end">
          <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400 mb-8 rounded-full"></div>
          <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-3">Tài liệu Tuyệt mật / Internal Use Only</h2>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 uppercase">
            Báo cáo Kế hoạch <br/><span className="text-blue-600">Chiến lược Toàn diện</span>
          </h1>
          
          <div className="flex justify-between items-end border-t border-slate-200 pt-6 mt-auto">
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Dành cho (Prepared for)</div>
              <div className="font-bold text-slate-800 text-lg">{brandName}</div>
              <div className="text-sm text-slate-500">{wizardAnswers.industry || ''}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Powered by</div>
              <div className="text-sm text-slate-600 font-semibold">BrandFlow AI Multi-Agent v2.0</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Ngày xuất bản (Date)</div>
              <div className="font-bold text-slate-800 text-lg">{new Date().toLocaleDateString('vi-VN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          PAGE 2: STRATEGIC OVERVIEW (Kotler Framework)
          ======================= */}
      <div className={`${pageClass} p-4 sm:p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-6 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase">BrandFlow</div>
          <div className="text-slate-500 font-medium text-xs tracking-widest uppercase">01 / Định vị & Mục tiêu (Strategic Planning)</div>
        </header>

        <div className="flex-1 overflow-hidden">
          {/* Mission & VRIO */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center mb-3">
              <Target className="w-5 h-5 mr-2 text-blue-600"/> 
              Sứ mệnh & Năng lực lõi 
              <EducationTooltip 
                title="Mô hình VRIO" 
                concept="Strategic Management Tool"
                explanation="VRIO (Value, Rarity, Inimitability, Organization) là mô hình phân tích năng lực lõi của doanh nghiệp. Một lợi thế cạnh tranh được gọi là VRIO khi nó mang lại Giá trị (V), Hiếm có (R), Khó sao chép (I), và Doanh nghiệp có Đủ năng lực tổ chức để khai thác (O)."
                example="Công thức pha chế độc quyền của Coca-Cola là một lợi thế VRIO vì nó tạo ra giá trị lớn, hiếm, không thể sao chép hợp pháp và Coca-Cola có hệ thống phân phối toàn cầu để khai thác nó."
              >
                <span>(VRIO)</span>
              </EducationTooltip>
            </h2>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-slate-700 italic mb-4 font-medium">"{goal.mission_statement}"</p>
              <div className="space-y-2">
                {goal.core_competencies.map((c: any, i: number) => (
                  <div key={i} className="flex items-start text-sm">
                    {c.is_vrio ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 mr-2 shrink-0 mt-0.5" />}
                    <span className="text-slate-800"><span className="font-bold">Năng lực {i+1}:</span> {c.competency} {c.is_vrio && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold ml-1">VRIO</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Objectives Grid: Financial + Marketing + Red Lines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
              <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase flex items-center"><TrendingUp className="w-4 h-4 mr-1 text-blue-600"/> Mục tiêu Tài chính</h3>
              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.objectives.financial_goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
            </div>
            <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/50">
              <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase flex items-center"><BarChart3 className="w-4 h-4 mr-1 text-emerald-600"/> Mục tiêu Marketing</h3>
              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.objectives.marketing_goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
            </div>
            <div className="border border-rose-200 rounded-lg p-4 bg-rose-50/50">
              <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase flex items-center"><ShieldAlert className="w-4 h-4 mr-1 text-rose-600"/> Lằn ranh đỏ</h3>
              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.red_lines.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          </div>

          {/* CAC/LTV Analysis */}
          {goal.objectives.cac_ltv_analysis && (
            <div className="text-xs bg-blue-100 text-blue-900 p-3 rounded-lg mb-6 border border-blue-200">
              <span className="font-bold uppercase mb-1 text-[10px] tracking-wider flex items-center">
                CAC/LTV Analysis (Unit Economics)
                <EducationTooltip 
                  title="Chỉ số CAC & LTV" 
                  concept="Unit Economics"
                  explanation="CAC (Customer Acquisition Cost) là chi phí để có được 1 khách hàng mới. LTV (Life-Time Value) là tổng doanh thu mà khách hàng đó mang lại trong suốt vòng đời. Tỷ lệ LTV:CAC lý tưởng để một doanh nghiệp Scale-up là từ 3:1 trở lên."
                  example="Nếu bạn bỏ ra 50k chạy Ads để có 1 khách (CAC=50k), và khách đó ăn ở quán bạn 5 lần, mỗi lần 100k (LTV=500k). Tỷ lệ LTV:CAC là 10:1 (Rất khỏe mạnh)."
                >
                  <span className="sr-only">Help</span>
                </EducationTooltip>
              </span>
              {goal.objectives.cac_ltv_analysis}
            </div>
          )}

          {/* Directional Policy Matrix */}
          <div className="mb-6 bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-indigo-900 uppercase mb-2 flex items-center">
              Directional Policy Matrix (GE-McKinsey)
              <EducationTooltip 
                title="Ma trận GE-McKinsey" 
                concept="Portfolio Analysis"
                explanation="Ma trận 9 ô đánh giá danh mục đầu tư dựa trên 2 trục: Sức hấp dẫn của thị trường (Market Attractiveness) và Sức mạnh cạnh tranh của doanh nghiệp (Business Strength). Giúp quyết định nên Đầu tư thêm (Invest), Giữ nguyên (Hold) hay Loại bỏ (Divest)."
              >
                <span className="sr-only">Help</span>
              </EducationTooltip>
            </h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-slate-500 block">Market Attractiveness</span><span className="font-bold">{audit.directional_policy?.market_attractiveness}</span></div>
              <div><span className="text-slate-500 block">Business Strength</span><span className="font-bold">{audit.directional_policy?.business_strength}</span></div>
              <div><span className="text-slate-500 block">Investment Decision</span><span className="font-bold text-indigo-700">{audit.directional_policy?.investment_decision}</span></div>
            </div>
          </div>
          
          {/* DMU & Value Proposition */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center mb-3">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600"/> 
              Decision-Making Unit (DMU)
              <EducationTooltip 
                title="Đơn vị Ra quyết định (DMU)" 
                concept="B2B & Complex B2C Sales"
                explanation="Trong mua hàng phức tạp, một quyết định mua không chỉ do 1 người. DMU bao gồm: Người khởi xướng (Initiator), Người ảnh hưởng (Influencer), Người quyết định (Decider), Người mua (Buyer) và Người sử dụng (User)."
              >
                <span className="sr-only">Help</span>
              </EducationTooltip>
               & Value Proposition
            </h2>
            {audit.target_segments.map((seg: any, i: number) => (
              <div key={i} className="mb-4">
                <div className="bg-slate-900 text-white p-3 rounded-t-lg font-bold text-sm">Segment: {seg.segment_name}</div>
                <div className="border border-t-0 border-slate-200 rounded-b-lg p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {seg.dmu_profiles.map((dmu: any, j: number) => (
                      <div key={j} className="bg-slate-50 p-3 rounded border border-slate-100">
                        <div className="font-bold text-blue-600 text-xs uppercase tracking-wider mb-2">Vai trò: {dmu.role}</div>
                        <div className="text-[11px] text-slate-500 font-bold">PAIN POINTS:</div>
                        <ul className="list-disc pl-3 text-xs text-slate-700 mb-2">{dmu.pain_points.map((p: string, k: number) => <li key={k}>{p}</li>)}</ul>
                        <div className="text-[11px] text-slate-500 font-bold">DECISION DRIVERS:</div>
                        <ul className="list-disc pl-3 text-xs text-slate-700">{dmu.decision_drivers.map((d: string, k: number) => <li key={k}>{d}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 text-blue-900 p-3 rounded border border-blue-100 text-sm mb-3">
                    <span className="font-bold">Value Proposition:</span> {seg.value_proposition}
                  </div>
                  {seg.data_sources && seg.data_sources.length > 0 && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="font-bold uppercase mb-1 block">Nguồn dữ liệu (Source of Truth):</span>
                      <ul className="list-disc pl-3 mt-1">
                        {seg.data_sources.map((src: string, k: number) => <li key={k}>{src}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* =======================
          PAGE 3: TACTICS & CFO RISK
          ======================= */}
      <div className={`${pageClass} p-4 sm:p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-6 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase">BrandFlow</div>
          <div className="text-slate-500 font-medium text-xs tracking-widest uppercase">02 / Thực thi & Quản trị Rủi ro (Tactics & Risk)</div>
        </header>

        <div className="flex-1 overflow-hidden">
          {/* Strategy Statement */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
              Tuyên bố Định vị (STP & Ansoff)
              <EducationTooltip 
                title="Ma trận Ansoff" 
                concept="Growth Strategy"
                explanation="Mô hình xác định chiến lược tăng trưởng gồm 4 hướng: Thâm nhập thị trường (Bán sản phẩm cũ cho TT cũ), Phát triển thị trường (Bán SP cũ cho TT mới), Phát triển sản phẩm (Bán SP mới cho TT cũ), và Đa dạng hóa (Bán SP mới cho TT mới)."
              >
                <span className="sr-only">Help</span>
              </EducationTooltip>
            </h2>
            <div className="bg-slate-900 p-4 rounded-lg text-white text-sm space-y-3">
              <p><span className="text-cyan-400 font-bold uppercase text-[11px] block">Chiến lược cốt lõi:</span> {strategy.ansoff_matrix_choice}</p>
              <p><span className="text-cyan-400 font-bold uppercase text-[11px] block">Tuyên bố định vị:</span> {strategy.positioning_statement}</p>
              <p><span className="text-cyan-400 font-bold uppercase text-[11px] block">Biện luận ROI:</span> {strategy.expected_roi_justification}</p>
            </div>
          </section>

          {/* 7Ps Tactics */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
              Ngân sách & Chiến thuật (Zero-Based Budgeting)
              <EducationTooltip 
                title="Lập Ngân sách Từ Con Số Không (ZBB)" 
                concept="Financial Management"
                explanation="Zero-Based Budgeting là phương pháp quản trị tài chính mà mọi chi phí cho kỳ mới phải được giải trình lại từ số 0, thay vì dựa vào ngân sách kỳ trước. Nó bắt buộc Marketer phải chứng minh được ROI của từng chiến thuật."
              >
                <span className="sr-only">Help</span>
              </EducationTooltip>
            </h2>
            
            {/* Budget Overview + Pie Chart */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="text-sm font-bold text-slate-500 uppercase block mb-1">Tổng ngân sách duyệt</span>
                <span className="text-2xl font-black text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tactics.total_budget_used)}</span>
                {tactics.tactics_7ps && (
                  <div className="mt-3 space-y-1">
                    {tactics.tactics_7ps.map((t: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-slate-600">{t.p_name}</span>
                        <span className="ml-auto font-bold text-slate-800">{t.budget_allocation_percent ? `${t.budget_allocation_percent}%` : '-'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full md:w-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={budgetPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                      {budgetPieData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(val: any) => new Intl.NumberFormat('vi-VN').format(Number(val)) + ' VNĐ'} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 7Ps Tactics Table */}
            <div className="w-full overflow-x-auto"><table className="w-full min-w-[500px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-800 uppercase text-xs bg-slate-50">
                  <th className="py-2 px-2 font-black">Chữ P</th>
                  <th className="py-2 px-2 font-black">Hành động cốt lõi</th>
                  <th className="py-2 px-2 font-black">KPI Cam kết</th>
                  <th className="py-2 px-2 font-black text-center">Ưu tiên</th>
                  <th className="py-2 px-2 font-black text-right">Phân bổ</th>
                  <th className="py-2 px-2 font-black text-right">Ngân sách</th>
                </tr>
              </thead>
              <tbody>
                {tactics.tactics_7ps.map((task: any, idx: number) => (
                  <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="py-3 px-2 font-bold text-blue-600 whitespace-nowrap">{task.p_name}</td>
                    <td className="py-3 px-2 font-medium text-slate-800">{task.action_bullet}</td>
                    <td className="py-3 px-2 text-slate-600 italic text-xs">{task.kpi}</td>
                    <td className="py-3 px-2 text-center">
                      {task.moscow_tag && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                        task.moscow_tag === 'MUST_HAVE' ? 'bg-red-50 text-red-700 border-red-200' :
                        task.moscow_tag === 'SHOULD_HAVE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>{task.moscow_tag?.replace('_',' ')}</span>}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-blue-600 whitespace-nowrap bg-blue-50/50">
                      {task.budget_allocation_percent ? `${task.budget_allocation_percent}%` : '-'}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900 whitespace-nowrap">
                      {new Intl.NumberFormat('vi-VN').format(task.budget_vnd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>

            {tactics.task_ready_checklist && tactics.task_ready_checklist.length > 0 && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-bold text-emerald-900 uppercase text-sm mb-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Task-Ready Checklist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-800">
                  {tactics.task_ready_checklist.map((task: string, k: number) => (
                    <div key={k} className="flex items-start bg-white p-2 rounded border border-emerald-100 shadow-sm">
                      <div className="w-4 h-4 rounded border-2 border-emerald-400 bg-white mr-3 shrink-0 mt-0.5 flex items-center justify-center"></div>
                      <span className="font-medium leading-snug">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* CFO Risk & Trigger Points */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center mb-3 text-rose-600">
              <AlertTriangle className="w-5 h-5 mr-2"/> Cảnh báo Rủi ro & Trigger Points từ CFO
            </h2>
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
              <div className="text-rose-900 font-bold italic mb-4 text-sm">" {cfo.cfo_comment} "</div>
              <div className="space-y-3">
                {cfo.risk_assessment.map((risk: any, i: number) => (
                  <div key={i} className="bg-white p-3 rounded shadow-sm border border-rose-100 text-sm">
                    <div className="font-bold text-slate-800 mb-1">Rủi ro: {risk.risk_scenario}</div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <div className="flex-1 bg-rose-50 p-2 rounded border border-rose-100">
                        <span className="text-[10px] text-rose-600 font-bold uppercase block mb-1">Trigger Point</span>
                        <span className="text-rose-900 font-medium text-xs">{risk.trigger_point_metric}</span>
                      </div>
                      <div className="flex-1 bg-blue-50 p-2 rounded border border-blue-100">
                        <span className="text-[10px] text-blue-600 font-bold uppercase block mb-1">Kế hoạch B (Pivot)</span>
                        <span className="text-blue-900 font-medium text-xs">{risk.contingency_plan_b}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =======================
          PAGE 4: AGENT DEBATE LOGS (Marketing Plan Integration)
          ======================= */}
      <div className={`${pageClass} p-4 sm:p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-6 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase">BrandFlow</div>
          <div className="text-slate-500 font-medium text-xs tracking-widest uppercase">03 / Biên bản Phản biện Chiến lược (Agent Debate)</div>
        </header>

        <div className="flex-1 overflow-hidden">
          {logs.length > 0 ? (
            <>
              <section className="mb-4">
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-600"/> Biên bản Phản biện Đa chiều
                </h2>
                <p className="text-sm text-slate-500 mb-4">Kế hoạch được phản biện bởi các Agent chuyên gia: CMO (Chiến lược), CFO (Tài chính), COO (Vận hành), Customer Reviewer (Trải nghiệm khách hàng).</p>
              </section>
              <div className="space-y-3">
                {logs.map((log: any, i: number) => {
                  const agentStyles: Record<string, {bg: string; border: string; accent: string; icon: string}> = {
                    'CMO': { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-700', icon: '📊' },
                    'CFO': { bg: 'bg-rose-50', border: 'border-rose-200', accent: 'text-rose-700', icon: '💰' },
                    'COO': { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'text-amber-700', icon: '⚙️' },
                    'CEO': { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'text-emerald-700', icon: '👔' },
                    'SYSTEM': { bg: 'bg-slate-50', border: 'border-slate-200', accent: 'text-slate-600', icon: '🔒' },
                    'PERSONA': { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'text-purple-700', icon: '🎭' },
                  };
                  const s = agentStyles[log.agent] || agentStyles.SYSTEM;
                  return (
                    <div key={i} className={`p-3 rounded-lg ${s.bg} border ${s.border}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-sm">{s.icon}</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${s.accent}`}>
                          {log.agent} {log.role ? `— ${log.role}` : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{log.message}</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-400 mb-2">Biên bản Phản biện</h3>
              <p className="text-sm text-slate-400 text-center max-w-md">
                Chạy Pipeline AI để xem biên bản phản biện đa chiều từ các Agent chuyên gia (CMO, CFO, COO, Customer Reviewer). Mỗi agent sẽ đánh giá kế hoạch từ góc nhìn chuyên môn của mình.
              </p>
            </div>
          )}
        </div>

        {/* Page footer */}
        <footer className="border-t border-slate-200 pt-3 mt-auto flex justify-between items-center text-[10px] text-slate-400">
          <span>Generated by BrandFlow AI Multi-Agent Strategy Engine v2.0</span>
          <span>© {new Date().getFullYear()} BrandFlow • Confidential</span>
        </footer>
      </div>

    </div>
  );
}
