"""
=============================================================================
BrandFlow — Industry-Aware Marketing Model Matrix
=============================================================================
Hệ thống gợi ý Marketing Model theo Ngành & Quy mô doanh nghiệp.
Triết lý: THỰC DỤNG, không dập khuôn lý thuyết.
4 ngành: F&B, Tech, Education, Beauty
4 quy mô: micro, small, medium, enterprise
=============================================================================
"""

from typing import Dict, List, Optional, Any

# =============================================================================
# PHÂN LOẠI QUY MÔ DOANH NGHIỆP
# =============================================================================
SIZE_THRESHOLDS = {
    "micro":      {"max_headcount": 10,   "max_revenue_billion": 0.5,  "label": "Siêu nhỏ (< 10 người, < 500tr/năm)"},
    "small":      {"max_headcount": 50,   "max_revenue_billion": 5,    "label": "Nhỏ (10-50 người, 500tr-5tỷ/năm)"},
    "medium":     {"max_headcount": 200,  "max_revenue_billion": 50,   "label": "Vừa (50-200 người, 5-50tỷ/năm)"},
    "enterprise": {"max_headcount": 99999,"max_revenue_billion": 99999,"label": "Lớn (200+ người, > 50tỷ/năm)"},
}

# =============================================================================
# MA TRẬN MODEL THEO NGÀNH
# =============================================================================
INDUSTRY_MODEL_MATRIX: Dict[str, Dict] = {

    # ─────────────────────────── F&B ───────────────────────────
    "F&B": {
        "display_name": "Ẩm thực & Đồ uống (F&B)",
        "icon": "🍜",
        "sizes": {
            "micro": {
                "use": [
                    {"id": "local_seo", "name": "Local SEO & Google Maps", "reason": "90% khách tìm quán qua Google Maps / Zalo Map."},
                    {"id": "social_content", "name": "Social Content Calendar", "reason": "Facebook & TikTok là kênh organics mạnh nhất cho quán nhỏ."},
                    {"id": "menu_engineering", "name": "Menu Engineering (Stars/Dogs)", "reason": "Tối ưu lợi nhuận từng món, xác định món nào cần đẩy."},
                    {"id": "loyalty_program", "name": "Loyalty / Repeat Program", "reason": "Tăng Retention rẻ hơn 5x so với thu mới."},
                    {"id": "delivery_mix", "name": "Delivery Channel Mix", "reason": "Tối ưu tỷ trọng GrabFood vs ShopeeFood vs Dine-in."},
                ],
                "skip": [
                    {"id": "pestle_full", "name": "PESTLE Macro Analysis", "reason": "Quá rộng cho quán single-location, không actionable."},
                    {"id": "ansoff_diversification", "name": "Ansoff Diversification", "reason": "Quán mới cần tập trung, chưa nên đa dạng hóa."},
                    {"id": "bcg_matrix", "name": "BCG Matrix", "reason": "Cần ≥3 product lines để phân tích có ý nghĩa."},
                    {"id": "tvc_ooh", "name": "TVC / OOH Ads", "reason": "Ngân sách quá nhỏ, ROI không đo được."},
                    {"id": "enterprise_crm", "name": "Enterprise CRM", "reason": "Quá phức tạp, dùng Zalo OA là đủ."},
                ],
                "focus_kpis": ["footfall", "avg_ticket", "repeat_rate", "google_reviews", "food_cost_ratio"],
                "benchmark": {"food_cost": "28-35%", "occupancy": "55-70%", "repeat_rate": "20-30%", "avg_ticket": "80-150k"},
            },
            "small": {
                "use": [
                    {"id": "swot_lite", "name": "SWOT Lite (Focused)", "reason": "Đủ để xác định vị thế, không cần PESTLE đầy đủ."},
                    {"id": "local_seo", "name": "Local SEO & Google Maps", "reason": "Tối ưu cho từng chi nhánh."},
                    {"id": "social_ads", "name": "Facebook/TikTok Ads", "reason": "Đủ ngân sách để chạy Paid Ads tối ưu CPM."},
                    {"id": "menu_engineering", "name": "Menu Engineering", "reason": "Phân tích Contribution Margin từng dòng sản phẩm."},
                    {"id": "loyalty_program", "name": "Loyalty CRM (Zalo Mini App)", "reason": "Tích điểm, push notification tự động."},
                    {"id": "delivery_mix", "name": "Delivery Optimization", "reason": "Tăng tỷ trọng Online Revenue."},
                    {"id": "daypart_analysis", "name": "Daypart Analysis", "reason": "Phân tích khung giờ vàng, tối ưu Occupancy Rate."},
                ],
                "skip": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Chưa cần phân tích macro toàn diện ở quy mô này."},
                    {"id": "bcg_matrix", "name": "BCG Matrix", "reason": "Phù hợp hơn cho chuỗi 10+ cơ sở."},
                    {"id": "tvc_ooh", "name": "TVC / OOH", "reason": "Ngân sách chưa tối ưu cho ATL."},
                ],
                "focus_kpis": ["cac", "ltv", "delivery_ratio", "occupancy_rate", "food_cost_ratio", "avg_ticket"],
                "benchmark": {"food_cost": "25-32%", "occupancy": "60-80%", "repeat_rate": "25-40%", "avg_ticket": "100-250k"},
            },
            "medium": {
                "use": [
                    {"id": "swot_full", "name": "SWOT Full Analysis", "reason": "Cần đánh giá toàn diện để mở rộng chuỗi."},
                    {"id": "pestle_lite", "name": "PESTLE Lite (Industry Focus)", "reason": "Chỉ tập trung vào yếu tố S (Social) và T (Tech) của ngành."},
                    {"id": "ansoff_penetration", "name": "Ansoff Market Penetration", "reason": "Mở rộng thị phần trước khi đa dạng hóa."},
                    {"id": "social_ads", "name": "Omnichannel Ads", "reason": "Facebook + TikTok + Google đồng bộ."},
                    {"id": "menu_engineering", "name": "Menu Engineering + R&D", "reason": "Phát triển menu mới dựa trên data."},
                    {"id": "crm_automation", "name": "CRM Automation", "reason": "Zalo/Email automation, phân khúc khách VIP."},
                    {"id": "franchise_model", "name": "Franchise/Licensing Model", "reason": "Chuẩn hóa vận hành để nhân rộng."},
                ],
                "skip": [
                    {"id": "bcg_matrix", "name": "BCG Matrix", "reason": "Chỉ hữu ích khi có nhiều brand con."},
                ],
                "focus_kpis": ["same_store_growth", "franchise_roi", "brand_awareness", "nps", "cac", "ltv"],
                "benchmark": {"food_cost": "22-28%", "occupancy": "65-85%", "repeat_rate": "30-50%"},
            },
            "enterprise": {
                "use": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Chuỗi lớn chịu ảnh hưởng vĩ mô (thuế, quy định ATTP)."},
                    {"id": "bcg_matrix", "name": "BCG / GE Matrix", "reason": "Quản trị portfolio nhiều brand/concept."},
                    {"id": "ansoff_full", "name": "Ansoff Full (4 strategies)", "reason": "Chiến lược đa dạng hóa và mở rộng thị trường quốc tế."},
                    {"id": "balanced_scorecard", "name": "Balanced Scorecard", "reason": "KPIs 4 chiều cho board of directors."},
                    {"id": "enterprise_crm", "name": "Enterprise CDP/CRM", "reason": "Customer Data Platform tích hợp."},
                    {"id": "brand_architecture", "name": "Brand Architecture", "reason": "Master brand vs Sub-brands strategy."},
                ],
                "skip": [],
                "focus_kpis": ["revenue_per_sqm", "brand_equity_index", "franchise_satisfaction", "ebitda_margin"],
                "benchmark": {"food_cost": "20-25%", "occupancy": "70-90%"},
            },
        },
    },

    # ─────────────────────────── TECH ───────────────────────────
    "Tech": {
        "display_name": "Công nghệ & SaaS",
        "icon": "💻",
        "sizes": {
            "micro": {
                "use": [
                    {"id": "lean_canvas", "name": "Lean Canvas", "reason": "Xác định Problem-Solution Fit nhanh."},
                    {"id": "pirate_aarrr", "name": "AARRR Pirate Metrics", "reason": "Framework chuẩn cho startup: Acquisition → Revenue → Referral."},
                    {"id": "pmf_survey", "name": "Product-Market Fit Survey", "reason": "Đo lường 'must-have' score trước khi scale."},
                    {"id": "growth_hacking", "name": "Growth Hacking Playbook", "reason": "Tăng trưởng nhanh với chi phí thấp."},
                    {"id": "content_seo", "name": "Content SEO / AEO", "reason": "Inbound Marketing dài hạn, chi phí thấp."},
                ],
                "skip": [
                    {"id": "7ps_full", "name": "7Ps Marketing Mix", "reason": "Quá truyền thống cho digital product."},
                    {"id": "push_pull", "name": "Push/Pull Distribution", "reason": "Không áp dụng cho SaaS/App."},
                    {"id": "bcg_matrix", "name": "BCG Matrix", "reason": "Cần nhiều product lines."},
                    {"id": "tvc_ooh", "name": "TVC / OOH", "reason": "Startup cần measurable channels."},
                ],
                "focus_kpis": ["mrr", "churn_rate", "activation_rate", "trial_conversion", "nps"],
                "benchmark": {"churn": "<5%/month", "ltv_cac_ratio": ">3:1", "activation": "25-40%"},
            },
            "small": {
                "use": [
                    {"id": "pirate_aarrr", "name": "AARRR Metrics", "reason": "Mở rộng funnel đầy đủ."},
                    {"id": "saas_economics", "name": "SaaS Unit Economics", "reason": "MRR, ARR, Churn, LTV:CAC chuyên sâu."},
                    {"id": "product_led_growth", "name": "Product-Led Growth", "reason": "Freemium → Premium conversion."},
                    {"id": "content_seo", "name": "Content + SEO/AEO", "reason": "Xây dựng authority dài hạn."},
                    {"id": "social_ads", "name": "Performance Ads (Google/FB)", "reason": "Scale paid acquisition."},
                    {"id": "swot_lite", "name": "Competitive SWOT", "reason": "So sánh với 2-3 đối thủ trực tiếp."},
                ],
                "skip": [
                    {"id": "push_pull", "name": "Push/Pull Distribution", "reason": "Không phù hợp digital product."},
                    {"id": "7ps_full", "name": "7Ps Full", "reason": "Dùng AARRR thay thế hiệu quả hơn."},
                ],
                "focus_kpis": ["mrr", "arr", "churn", "ltv_cac", "payback_period", "nps"],
                "benchmark": {"churn": "<3%/month", "ltv_cac_ratio": ">4:1"},
            },
            "medium": {
                "use": [
                    {"id": "saas_economics", "name": "SaaS Unit Economics Advanced", "reason": "Cohort analysis, expansion revenue."},
                    {"id": "tech_adoption", "name": "Tech Adoption Lifecycle", "reason": "Crossing the chasm strategy."},
                    {"id": "abm", "name": "Account-Based Marketing", "reason": "Target enterprise accounts cụ thể."},
                    {"id": "content_seo", "name": "Content Marketing System", "reason": "Full funnel content."},
                    {"id": "swot_full", "name": "SWOT + Porter Five Forces", "reason": "Phân tích competitive landscape toàn diện."},
                    {"id": "crm_automation", "name": "Marketing Automation", "reason": "HubSpot/Salesforce nurture campaigns."},
                ],
                "skip": [
                    {"id": "push_pull", "name": "Push/Pull Traditional", "reason": "Dùng ABM + PLG thay thế."},
                ],
                "focus_kpis": ["arr", "net_revenue_retention", "expansion_mrr", "cac_payback", "nps"],
                "benchmark": {"nrr": ">110%", "ltv_cac_ratio": ">5:1"},
            },
            "enterprise": {
                "use": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Chịu ảnh hưởng quy định (GDPR, Cybersecurity)."},
                    {"id": "balanced_scorecard", "name": "Balanced Scorecard", "reason": "Board-level reporting."},
                    {"id": "bcg_matrix", "name": "BCG / Portfolio Matrix", "reason": "Quản trị multi-product portfolio."},
                    {"id": "abm", "name": "Enterprise ABM", "reason": "Land-and-expand strategy."},
                    {"id": "brand_architecture", "name": "Brand Architecture", "reason": "Multi-brand strategy."},
                    {"id": "ansoff_full", "name": "Ansoff Full", "reason": "M&A và international expansion."},
                ],
                "skip": [],
                "focus_kpis": ["arr", "rule_of_40", "gross_margin", "market_share"],
                "benchmark": {"rule_of_40": ">40%", "gross_margin": ">70%"},
            },
        },
    },

    # ─────────────────────────── EDUCATION ───────────────────────────
    "Edu": {
        "display_name": "Giáo dục & Đào tạo",
        "icon": "🎓",
        "sizes": {
            "micro": {
                "use": [
                    {"id": "enrollment_funnel", "name": "Enrollment Funnel", "reason": "Lead → Tư vấn → Đăng ký → Nhập học: chuỗi chuyển đổi đặc thù giáo dục."},
                    {"id": "social_content", "name": "Social Content + Edu SEO", "reason": "Parents/Students search Google trước khi chọn trường."},
                    {"id": "referral_program", "name": "Referral / Ambassador Program", "reason": "Word-of-mouth là kênh #1 trong giáo dục."},
                    {"id": "local_seo", "name": "Local SEO (School/Center)", "reason": "Phụ huynh tìm theo khu vực."},
                    {"id": "trial_class", "name": "Trial/Demo Class Strategy", "reason": "Trải nghiệm thử là bước chuyển đổi quan trọng nhất."},
                ],
                "skip": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Trung tâm nhỏ không chịu tác động macro đáng kể."},
                    {"id": "bcg_matrix", "name": "BCG Matrix", "reason": "Cần nhiều chương trình/brand con."},
                    {"id": "push_pull", "name": "Push/Pull Distribution", "reason": "Không áp dụng cho dịch vụ giáo dục."},
                    {"id": "ansoff_diversification", "name": "Ansoff Diversification", "reason": "Tập trung chất lượng trước khi mở rộng."},
                ],
                "focus_kpis": ["cpl", "show_up_rate", "enrollment_rate", "retention_term", "nps_parent"],
                "benchmark": {"cpl": "50-200k", "show_up_rate": "40-60%", "enrollment_conversion": "20-35%"},
            },
            "small": {
                "use": [
                    {"id": "enrollment_funnel", "name": "Enrollment Funnel Advanced", "reason": "Multi-touch attribution cho lead sources."},
                    {"id": "student_lifecycle", "name": "Student Lifecycle Management", "reason": "Onboarding → Learning → Re-enrollment → Alumni."},
                    {"id": "social_ads", "name": "Performance Ads (FB Lead Gen)", "reason": "Cost-per-Lead optimization."},
                    {"id": "swot_lite", "name": "Competitive SWOT", "reason": "So sánh với 2-3 trường/trung tâm cùng khu vực."},
                    {"id": "content_seo", "name": "Edu Content Marketing", "reason": "Blog/Video chia sẻ kiến thức xây trust."},
                    {"id": "crm_lite", "name": "CRM cho tư vấn viên", "reason": "Tracking lead pipeline, follow-up tự động."},
                ],
                "skip": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Chỉ cần theo dõi chính sách giáo dục (P) và công nghệ (T)."},
                    {"id": "7ps_full", "name": "7Ps Full", "reason": "Dùng Enrollment Funnel thay thế hiệu quả hơn."},
                ],
                "focus_kpis": ["cpl", "cost_per_enrollment", "student_retention", "course_completion", "nps"],
                "benchmark": {"cpl": "30-150k", "student_retention": "60-80%", "completion": "70-85%"},
            },
            "medium": {
                "use": [
                    {"id": "swot_full", "name": "SWOT Full + Porter", "reason": "Phân tích cạnh tranh toàn diện."},
                    {"id": "student_lifecycle", "name": "Student Lifecycle + Alumni", "reason": "Alumni network → referral engine."},
                    {"id": "ansoff_penetration", "name": "Ansoff Market Development", "reason": "Mở campus/chi nhánh mới."},
                    {"id": "brand_positioning", "name": "Brand Positioning Map", "reason": "Xác định vị thế trong tâm trí phụ huynh."},
                    {"id": "crm_automation", "name": "Marketing Automation", "reason": "Nurture campaigns cho đa kênh."},
                    {"id": "content_seo", "name": "Thought Leadership Content", "reason": "Xây dựng authority giáo dục."},
                ],
                "skip": [],
                "focus_kpis": ["brand_awareness", "market_share_local", "student_retention", "revenue_per_student"],
                "benchmark": {"student_retention": "70-90%", "nps": ">50"},
            },
            "enterprise": {
                "use": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Chịu ảnh hưởng chính sách giáo dục quốc gia."},
                    {"id": "balanced_scorecard", "name": "Balanced Scorecard", "reason": "Multi-campus management."},
                    {"id": "bcg_matrix", "name": "BCG Matrix", "reason": "Portfolio management cho nhiều chương trình."},
                    {"id": "ansoff_full", "name": "Ansoff Full", "reason": "Mở rộng quốc tế, online learning."},
                    {"id": "brand_architecture", "name": "Brand Architecture", "reason": "Quản trị nhiều sub-brands/programs."},
                ],
                "skip": [],
                "focus_kpis": ["total_enrollment", "revenue_per_student", "graduation_rate", "employer_satisfaction"],
                "benchmark": {},
            },
        },
    },

    # ─────────────────────────── BEAUTY ───────────────────────────
    "Beauty": {
        "display_name": "Làm đẹp & Mỹ phẩm",
        "icon": "💄",
        "sizes": {
            "micro": {
                "use": [
                    {"id": "influencer_micro", "name": "Micro-Influencer / KOC", "reason": "Trust-based marketing cực hiệu quả cho beauty."},
                    {"id": "social_content", "name": "Social Content (Before/After)", "reason": "Visual proof là yếu tố quyết định mua hàng."},
                    {"id": "loyalty_program", "name": "Loyalty / Membership Program", "reason": "Khách beauty quay lại đều đặn nếu hài lòng."},
                    {"id": "local_seo", "name": "Local SEO + Google Reviews", "reason": "Reviews 5 sao là social proof mạnh nhất."},
                    {"id": "treatment_mix", "name": "Treatment Mix Analysis", "reason": "Tối ưu dịch vụ nào mang lại margin cao nhất."},
                ],
                "skip": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Quá macro cho tiệm nhỏ."},
                    {"id": "bcg_matrix", "name": "BCG Matrix", "reason": "Cần nhiều dòng sản phẩm/dịch vụ."},
                    {"id": "ansoff_diversification", "name": "Ansoff Diversification", "reason": "Chưa phù hợp giai đoạn này."},
                    {"id": "enterprise_crm", "name": "Enterprise CRM", "reason": "Dùng booking app đơn giản là đủ."},
                ],
                "focus_kpis": ["rebooking_rate", "avg_ticket", "google_reviews", "referral_rate", "treatment_margin"],
                "benchmark": {"rebooking": "40-55%", "avg_ticket": "300-800k", "review_score": "4.5+"},
            },
            "small": {
                "use": [
                    {"id": "customer_journey", "name": "Customer Journey Map", "reason": "Discovery → Booking → Treatment → Review → Rebooking."},
                    {"id": "influencer_strategy", "name": "Influencer Strategy (KOL + KOC)", "reason": "Đa tầng influence cho brand awareness."},
                    {"id": "social_ads", "name": "Social Ads + Retargeting", "reason": "FB/IG Ads cho visual products."},
                    {"id": "swot_lite", "name": "Competitive SWOT", "reason": "So sánh với spa/salon cùng phân khúc."},
                    {"id": "loyalty_program", "name": "CRM + Membership Tiers", "reason": "VIP/Gold/Platinum tiers."},
                    {"id": "ecommerce_mix", "name": "E-commerce Channel Mix", "reason": "Shopee + TikTok Shop + Website."},
                ],
                "skip": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Chỉ cần theo dõi quy định mỹ phẩm (Legal)."},
                    {"id": "push_pull", "name": "Push/Pull Traditional", "reason": "Dùng Influencer + E-commerce thay thế."},
                ],
                "focus_kpis": ["cac", "ltv", "rebooking_rate", "social_engagement", "ecom_conversion"],
                "benchmark": {"rebooking": "45-65%", "ltv_cac_ratio": ">3:1"},
            },
            "medium": {
                "use": [
                    {"id": "swot_full", "name": "SWOT Full + Competitor Map", "reason": "Phân tích cạnh tranh toàn diện."},
                    {"id": "ansoff_penetration", "name": "Ansoff Product Development", "reason": "Mở rộng dòng sản phẩm/dịch vụ mới."},
                    {"id": "brand_positioning", "name": "Brand Positioning + Archetype", "reason": "Xây dựng brand equity vững chắc."},
                    {"id": "omnichannel", "name": "Omnichannel Strategy", "reason": "O2O: Online → Offline seamlessly."},
                    {"id": "crm_automation", "name": "CRM Automation + CDP", "reason": "Personalized campaigns at scale."},
                    {"id": "influencer_strategy", "name": "Full Influencer Ecosystem", "reason": "Macro + Micro + Nano influencer tiers."},
                ],
                "skip": [],
                "focus_kpis": ["brand_awareness", "market_share", "nps", "retention", "cltv"],
                "benchmark": {"retention": "50-70%", "nps": ">45"},
            },
            "enterprise": {
                "use": [
                    {"id": "pestle_full", "name": "PESTLE Full", "reason": "Quy định FDA/cosmetics, xu hướng xã hội."},
                    {"id": "bcg_matrix", "name": "BCG Matrix", "reason": "Portfolio nhiều brand/product lines."},
                    {"id": "balanced_scorecard", "name": "Balanced Scorecard", "reason": "Quản trị đa chiều."},
                    {"id": "ansoff_full", "name": "Ansoff Full", "reason": "Mở rộng quốc tế, M&A."},
                    {"id": "brand_architecture", "name": "Brand Architecture", "reason": "Multi-brand strategy."},
                ],
                "skip": [],
                "focus_kpis": ["brand_equity_index", "market_share", "gross_margin", "international_revenue"],
                "benchmark": {},
            },
        },
    },
}

# Mapping planning forms → model IDs
PLANNING_FORM_MODEL_MAP = {
    "a1-mission": {"required_models": [], "always_show": True, "label": "Tuyên bố Sứ mệnh"},
    "a2-performance": {"required_models": [], "always_show": True, "label": "Hiệu suất Kinh doanh"},
    "a3-revenue": {"required_models": [], "always_show": True, "label": "Phân tích Doanh thu"},
    "a4-market": {"required_models": ["pestle_full", "pestle_lite", "swot_full", "swot_lite"], "always_show": False, "label": "Phân tích Thị trường (PESTLE)"},
    "a5-swot": {"required_models": ["swot_full", "swot_lite"], "always_show": True, "label": "Ma trận SWOT"},
    "a6-portfolio": {"required_models": ["bcg_matrix", "ansoff_full", "ansoff_penetration"], "always_show": False, "label": "Portfolio / BCG Matrix"},
    "a7-assumptions": {"required_models": [], "always_show": True, "label": "Giả định Chiến lược"},
    "a8-strategies": {"required_models": [], "always_show": True, "label": "Chiến lược Cốt lõi"},
    "a9-budget": {"required_models": [], "always_show": True, "label": "Phân bổ Ngân sách"},
    "b1-objectives": {"required_models": [], "always_show": True, "label": "Mục tiêu Chi tiết"},
    "b2-action": {"required_models": [], "always_show": True, "label": "Chương trình Hành động"},
    "b3-budget": {"required_models": [], "always_show": True, "label": "Ngân sách Chi tiết"},
    "b5-pnl": {"required_models": [], "always_show": True, "label": "Dự phóng P&L"},
    "b6-gantt": {"required_models": [], "always_show": True, "label": "Gantt Timeline"},
    "c1-direction": {"required_models": [], "always_show": True, "label": "Định hướng Kiểm soát"},
    "c2-matrix": {"required_models": ["balanced_scorecard"], "always_show": False, "label": "Ma trận Kiểm soát"},
    "c4-dashboard": {"required_models": [], "always_show": True, "label": "Dashboard KPIs"},
}


# =============================================================================
# CORE FUNCTIONS
# =============================================================================

def detect_company_size(brand_dna: dict = None, wizard_answers: dict = None) -> str:
    """
    Tự động detect quy mô doanh nghiệp từ dữ liệu onboarding.
    Trả về: "micro", "small", "medium", "enterprise"
    """
    headcount = 0
    revenue_hint = 0  # tỷ VND

    sources = [brand_dna or {}, wizard_answers or {}]
    for src in sources:
        # Tìm headcount
        for key in ["headcount", "employees", "team_size", "so_nhan_su", "nhan_su"]:
            val = src.get(key)
            if val and isinstance(val, (int, float)):
                headcount = max(headcount, int(val))
            elif val and isinstance(val, str):
                # Parse "50 người" → 50
                import re
                nums = re.findall(r'\d+', str(val))
                if nums:
                    headcount = max(headcount, int(nums[0]))

        # Tìm revenue
        for key in ["revenue", "doanh_thu", "annual_revenue", "revenue_annual"]:
            val = src.get(key)
            if val and isinstance(val, (int, float)):
                revenue_hint = max(revenue_hint, val)
            elif val and isinstance(val, str):
                import re
                nums = re.findall(r'[\d.]+', str(val).replace(',', ''))
                if nums:
                    num = float(nums[0])
                    low_val = str(val).lower()
                    if "tỷ" in low_val or "ty" in low_val or "billion" in low_val:
                        revenue_hint = max(revenue_hint, num)
                    elif "triệu" in low_val or "trieu" in low_val or "million" in low_val:
                        revenue_hint = max(revenue_hint, num / 1000)
                    else:
                        # Assume VND raw
                        revenue_hint = max(revenue_hint, num / 1_000_000_000)

    # Classify
    if headcount >= 200 or revenue_hint >= 50:
        return "enterprise"
    elif headcount >= 50 or revenue_hint >= 5:
        return "medium"
    elif headcount >= 10 or revenue_hint >= 0.5:
        return "small"
    else:
        return "micro"


def normalize_industry(raw_industry: str) -> str:
    """Chuẩn hóa tên ngành về 4 nhóm chính."""
    if not raw_industry:
        return "F&B"
    
    low = raw_industry.lower().strip()
    
    fb_keywords = ["f&b", "fnb", "food", "ẩm thực", "nhà hàng", "quán", "cafe", "cà phê", 
                    "đồ uống", "bánh", "thực phẩm", "restaurant", "dining", "kitchen", "bếp"]
    tech_keywords = ["tech", "saas", "software", "phần mềm", "công nghệ", "app", "startup",
                     "digital", "platform", "fintech", "ai", "iot", "cloud"]
    edu_keywords = ["edu", "education", "giáo dục", "đào tạo", "training", "trường", "school",
                    "academy", "university", "learning", "khóa học", "course", "trung tâm"]
    beauty_keywords = ["beauty", "cosmetic", "mỹ phẩm", "làm đẹp", "spa", "salon", "skincare",
                       "thẩm mỹ", "nail", "hair", "makeup", "dược mỹ phẩm"]
    
    for kw in fb_keywords:
        if kw in low:
            return "F&B"
    for kw in tech_keywords:
        if kw in low:
            return "Tech"
    for kw in edu_keywords:
        if kw in low:
            return "Edu"
    for kw in beauty_keywords:
        if kw in low:
            return "Beauty"
    
    return "F&B"  # Default


def get_recommended_models(industry: str, company_size: str) -> dict:
    """
    Trả về bộ model phù hợp cho ngành + quy mô.
    Returns: {"use": [...], "skip": [...], "focus_kpis": [...], "benchmark": {...}}
    """
    industry = normalize_industry(industry)
    if company_size not in ["micro", "small", "medium", "enterprise"]:
        company_size = "small"
    
    matrix = INDUSTRY_MODEL_MATRIX.get(industry, INDUSTRY_MODEL_MATRIX["F&B"])
    size_config = matrix["sizes"].get(company_size, matrix["sizes"]["small"])
    
    return {
        "industry": industry,
        "industry_display": matrix["display_name"],
        "industry_icon": matrix["icon"],
        "company_size": company_size,
        "size_label": SIZE_THRESHOLDS[company_size]["label"],
        "use": size_config["use"],
        "skip": size_config["skip"],
        "focus_kpis": size_config["focus_kpis"],
        "benchmark": size_config.get("benchmark", {}),
    }


def get_visible_planning_forms(industry: str, company_size: str) -> List[dict]:
    """
    Trả về danh sách các form planning NÊN hiển thị cho doanh nghiệp này.
    Ẩn hẳn các form có model requirement không phù hợp.
    """
    models = get_recommended_models(industry, company_size)
    active_model_ids = {m["id"] for m in models["use"]}
    
    visible = []
    for form_key, form_config in PLANNING_FORM_MODEL_MAP.items():
        if form_config["always_show"]:
            visible.append({"key": form_key, "label": form_config["label"], "visible": True})
        else:
            # Check if any required model is in the active set
            required = set(form_config["required_models"])
            if required & active_model_ids:
                visible.append({"key": form_key, "label": form_config["label"], "visible": True})
            # else: hidden — don't add to list
    
    return visible


def get_industry_prompt_context(industry: str, company_size: str) -> str:
    """
    Tạo prompt context để inject vào LLM prompts.
    Ép LLM chỉ sử dụng các model phù hợp.
    """
    models = get_recommended_models(industry, company_size)
    
    use_list = "\n".join([f"  ✅ {m['name']}: {m['reason']}" for m in models["use"]])
    skip_list = "\n".join([f"  ❌ {m['name']}: {m['reason']}" for m in models["skip"]])
    kpi_list = ", ".join(models["focus_kpis"])
    benchmark_str = ", ".join([f"{k}: {v}" for k, v in models.get("benchmark", {}).items()])
    
    return f"""
===== INDUSTRY-SPECIFIC CONTEXT =====
Ngành: {models['industry_display']} ({models['industry']})
Quy mô: {models['size_label']} ({models['company_size']})

CÁC MODEL/FRAMEWORK BẮT BUỘC SỬ DỤNG:
{use_list}

CÁC MODEL/FRAMEWORK TUYỆT ĐỐI KHÔNG DÙNG (và lý do):
{skip_list}

KPIs TRỌNG TÂM: {kpi_list}
BENCHMARK NGÀNH: {benchmark_str}

QUY TẮC: 
- PHẢI tập trung vào các model trong danh sách "BẮT BUỘC".
- KHÔNG ĐƯỢC đề cập hay áp dụng model trong danh sách "TUYỆT ĐỐI KHÔNG DÙNG".
- Mọi đề xuất chiến lược phải gắn chặt với thực tế ngành và quy mô doanh nghiệp.
- Ưu tiên tính THỰC DỤNG, actionable, có thể triển khai ngay.
===== END INDUSTRY CONTEXT =====
"""
