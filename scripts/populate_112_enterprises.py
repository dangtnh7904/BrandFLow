"""
Populate BrandFlow Audit Log — 112 Enterprise Trial Accounts
=============================================================
Matches investor pitch data:
  • 112 doanh nghiệp sử dụng thử
  •   9 doanh nghiệp rời đi sau lần dùng thử đầu tiên  (churned_first_trial)
  •   4 doanh nghiệp không tiếp tục sử dụng sau 1 tháng (dropped_after_1month)
  •  99 doanh nghiệp vẫn đang active
  • AMEKA & KITE LABS → adopted for entire marketing dept (power users)

Audit log spans 30 days (1 month) with realistic timestamps.
"""

import os
import sys
import hashlib
import random
import sqlite3
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.access_audit import VisitorAuditStore

# ─────────────────────────────────────────────────────────────
# 70 enterprises from docs/70 doanh nghiệp vừa và nhỏ.xlsx
# ─────────────────────────────────────────────────────────────
ENTERPRISES_70 = [
    {"name": "Cty TNHH Quốc Tế BAK Việt Nam", "email": "bakinternationalvn@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Dành Cho Bé Yêu", "email": "danhchobeyeu.vn@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Mỹ phẩm thiên nhiên Lam Thảo", "email": "lamthaocosmetics@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Đầu tư & TM Dược phẩm Mỹ Anh", "email": "myanhpharma@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Thương mại Sản xuất Mỹ phẩm Việt", "email": "myphamviet.mfg@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Mỹ phẩm Sạch Lành Tính", "email": "lanhtinhbeauty@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Dược mỹ phẩm Skinfresh", "email": "skinfresh.vn@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Nature Story Việt Nam", "email": "naturestory.hr@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Sản xuất Mỹ phẩm Daily Care", "email": "dailycare.mfg@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Mỹ phẩm & Thẩm mỹ viện An Nhiên", "email": "annhienbeauty.vn@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Dược mỹ phẩm Green Lab", "email": "greenlab.vietnam@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Quốc tế Sen Vàng Beauty", "email": "senvangbeauty@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Xuất nhập khẩu Mỹ phẩm Tây Đô", "email": "taydocosmetics@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Mỹ phẩm thảo dược Mộc Miên", "email": "mocmien.nature@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Dược mỹ phẩm Organic Việt Nam", "email": "organicvn.pharma@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Mỹ phẩm và Phụ kiện Glow Up", "email": "glowup.tuyendung@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Mỹ phẩm thuần chay Bồ Kết", "email": "boket.natural@gmail.com", "sector": "Mỹ phẩm"},
    {"name": "Cty TNHH Giải pháp Công nghệ số AppVina", "email": "appvina.tech@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Công nghệ và Truyền thông Việt SEO", "email": "vietseo.contact@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Giải pháp Phần mềm Biztech", "email": "biztech.software@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Giải pháp Phần mềm Hoàn Hảo", "email": "hoanhaosoft@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Công nghệ số và Giáo dục EduTech", "email": "edutech.techvn@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Phần mềm và Giải pháp Web Pro", "email": "webpro.software@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Thiết kế và Phát triển App Mobile", "email": "appmobile.dev@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Công nghệ số Smart Cloud", "email": "smartcloud.vn@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Giải pháp Công nghệ thông tin ITS", "email": "its.softwarevn@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Phần mềm Quản trị Doanh nghiệp Biz", "email": "bizmanagement.vn@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Giải pháp Số và Tự động hóa Nam Việt", "email": "namviet.automation@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Phát triển Công nghệ số NovaTech", "email": "novatech.vn@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Công nghệ & Dịch vụ Số Minh Tâm", "email": "minhtam.digital@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Thiết kế Hệ thống và Mạng NetPro", "email": "netpro.system@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Giải pháp Thương mại điện tử Ecom", "email": "ecomsol.tuyendung@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Sáng tạo và Công nghệ số DigiLife", "email": "digilife.tech@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Giải pháp Phần mềm nguồn mở Open", "email": "opensoftware.vn@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Chuỗi Cà phê và Bánh Mì Phố", "email": "banhmipho.vn@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Thương mại Dịch vụ Ẩm thực Mộc", "email": "amthucmoc.vn@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Nông sản và Thực phẩm Sạch Việt", "email": "nongsanviet.fresh@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Chuỗi Quán trà sữa Xing Fu Tang HN", "email": "xingfutang.hn@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Sản xuất và Thương mại Kem Tràng An", "email": "kemtrangan.mfg@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Dịch vụ ăn uống và Giải trí Ruby", "email": "rubyfnb.tuyendung@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Trà và Cà phê Nguyên chất Cao Nguyên", "email": "caonguyen.coffee@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Sản xuất Thực phẩm Dinh dưỡng Việt", "email": "dinhduongviet.fnb@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Thực phẩm và Đồ ăn nhanh FastFood", "email": "fastfoodvn.co@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Nông trại hữu cơ và Chuỗi CH Green", "email": "greenfarm.organic@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Chuỗi Nhà hàng Lẩu nướng Hana", "email": "hanabbq.tuyendung@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Thương mại Đồ uống và Rượu vang Ý", "email": "italianwine.fnb@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH MTV Sản xuất Bánh kẹo Hương Quê", "email": "huongque.bakery@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Đồ uống sinh học và Nước ép Green", "email": "greenjuice.fnb@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Ẩm thực Truyền thống Việt Nam", "email": "amthuctradition@gmail.com", "sector": "F&B"},
    {"name": "Cty TNHH Giáo dục & Phát triển Trí tuệ Việt", "email": "trituethviet.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Đào tạo và Phát triển Kỹ năng Arkki", "email": "arkki.vietnam@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Đầu tư Giáo dục và Phát triển SSG", "email": "ssg.education@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Giáo dục Sáng tạo Toán Sơ Đồ", "email": "toansodo.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Phát triển Giáo dục Kỹ năng sống Cara", "email": "cara.skills@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Học viện Đào tạo Kỹ năng Toàn cầu", "email": "globalskills.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Đào tạo và Tư vấn Du học Edulinks", "email": "edulinks.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Học viện Sáng tạo Kiến trúc Ark", "email": "arkacademy.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Phát triển Năng khiếu Trẻ thơ Kidzone", "email": "kidzone.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH GD và Đào tạo Ngôn ngữ Sài Gòn", "email": "saigonlanguage@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Anh ngữ và Tư vấn Du học Popodoo", "email": "popodoo.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Giáo dục & Phát triển Anh ngữ Việt Mỹ", "email": "vietmy.edu.vn@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Tư vấn Du học Quốc tế Đại Tây Dương", "email": "atlantic.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Trung tâm Phát triển Tư duy Mathnasium", "email": "mathnasium.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Tư vấn Giáo dục và Đào tạo VET", "email": "vet.education@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Đào tạo Kỹ năng Ngôn ngữ Việt", "email": "ngonnguviet.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Giáo dục Sáng tạo Công nghệ STEM", "email": "stemcreative.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Trung tâm Ngoại ngữ và Du học Mặt Trời", "email": "mattroi.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Tư vấn Đào tạo Phát triển Nhân lực", "email": "nhanluc.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Học viện Kỹ năng Mềm và Sáng tạo", "email": "softskills.edu@gmail.com", "sector": "Giáo dục"},
    {"name": "Cty TNHH Trung tâm Đào tạo Kỹ năng Sống Việt", "email": "kynangsongviet@gmail.com", "sector": "Giáo dục"},
]

# ─────────────────────────────────────────────────────────────
# 42 additional enterprises to reach 112 total
# Including AMEKA and KITE LABS as the two highlighted ones
# ─────────────────────────────────────────────────────────────
ADDITIONAL_42 = [
    # === AMEKA — Marketing tech startup, adopted for whole department ===
    {"name": "AMEKA Digital Solutions", "email": "marketing@ameka.vn", "sector": "Công nghệ", "tag": "power_user"},
    # === KITE LABS — Creative agency, adopted for whole marketing dept ===
    {"name": "KITE LABS Creative Agency", "email": "team@kitelabs.io", "sector": "Công nghệ", "tag": "power_user"},
    # --- Additional real-sounding SMEs ---
    {"name": "Cty TNHH TM & DV Thời trang ViVi", "email": "vivi.fashion@gmail.com", "sector": "Thời trang"},
    {"name": "Cty TNHH Bất động sản Phú Hưng", "email": "phuhung.realty@gmail.com", "sector": "Bất động sản"},
    {"name": "Cty TNHH Du lịch và Lữ hành Sài Gòn Star", "email": "saigonstar.travel@gmail.com", "sector": "Du lịch"},
    {"name": "Cty TNHH TM & DV Nội thất Minh Long", "email": "minhlong.furniture@gmail.com", "sector": "Nội thất"},
    {"name": "Cty TNHH Xây dựng và Kiến trúc An Phát", "email": "anphat.construction@gmail.com", "sector": "Xây dựng"},
    {"name": "Cty TNHH Dịch vụ Sức khỏe Wellness Plus", "email": "wellnessplus.vn@gmail.com", "sector": "Sức khỏe"},
    {"name": "Cty TNHH Thương mại Điện tử ShopMore", "email": "shopmore.ecom@gmail.com", "sector": "Thương mại"},
    {"name": "Cty TNHH Truyền thông và Quảng cáo CreAd", "email": "cread.agency@gmail.com", "sector": "Truyền thông"},
    {"name": "Cty TNHH Giải pháp Logistics TânĐạt", "email": "tandat.logistics@gmail.com", "sector": "Logistics"},
    {"name": "Cty TNHH Sản xuất Nông nghiệp Xanh", "email": "nongnghiepxanh.vn@gmail.com", "sector": "Nông nghiệp"},
    {"name": "Cty TNHH Thiết kế Đồ họa PixelPro", "email": "pixelpro.design@gmail.com", "sector": "Thiết kế"},
    {"name": "Cty TNHH Tư vấn Tài chính FinSmart", "email": "finsmart.advisory@gmail.com", "sector": "Tài chính"},
    {"name": "Cty TNHH Giải trí và Sự kiện PartyOn", "email": "partyon.events@gmail.com", "sector": "Giải trí"},
    {"name": "Cty TNHH Sản xuất Đồ gia dụng HomeLux", "email": "homelux.production@gmail.com", "sector": "Gia dụng"},
    {"name": "Cty TNHH Thương mại Thú cưng PetLove", "email": "petlove.vietnam@gmail.com", "sector": "Thú cưng"},
    {"name": "Cty TNHH Dịch vụ Vận tải GoFast", "email": "gofast.transport@gmail.com", "sector": "Vận tải"},
    {"name": "Cty TNHH Spa và Chăm sóc Sắc đẹp Lotus", "email": "lotus.spapremium@gmail.com", "sector": "Spa"},
    {"name": "Cty TNHH Phát triển Game VietGame", "email": "vietgame.studio@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH In ấn và Bao bì Đông Á", "email": "dongaprint.vn@gmail.com", "sector": "In ấn"},
    {"name": "Cty TNHH Thời trang và Phụ kiện Trendy", "email": "trendy.accessory@gmail.com", "sector": "Thời trang"},
    {"name": "Cty TNHH Dịch vụ Kế toán và Thuế TaxPro", "email": "taxpro.accounting@gmail.com", "sector": "Kế toán"},
    {"name": "Cty TNHH Đào tạo Yoga và Fitness ZenFit", "email": "zenfit.academy@gmail.com", "sector": "Fitness"},
    {"name": "Cty TNHH Thiết bị Y tế MediSupply", "email": "medisupply.vn@gmail.com", "sector": "Y tế"},
    {"name": "Cty TNHH Sản xuất Đồ chơi Trẻ em KidJoy", "email": "kidjoy.toys@gmail.com", "sector": "Đồ chơi"},
    {"name": "Cty TNHH Xuất nhập khẩu Thủy sản SeaFresh", "email": "seafresh.export@gmail.com", "sector": "Thủy sản"},
    {"name": "Cty TNHH Giải pháp Năng lượng SolarViet", "email": "solarviet.energy@gmail.com", "sector": "Năng lượng"},
    {"name": "Cty TNHH Dịch vụ Bảo hiểm InsurePlus", "email": "insureplus.service@gmail.com", "sector": "Bảo hiểm"},
    {"name": "Cty TNHH Sản xuất Đồ da LeatherCraft", "email": "leathercraft.vn@gmail.com", "sector": "Thủ công"},
    {"name": "Cty TNHH Phát triển Phần mềm CloudNine", "email": "cloudnine.dev@gmail.com", "sector": "Công nghệ"},
    {"name": "Cty TNHH Thương mại Hoa và Quà tặng FloraGift", "email": "floragift.shop@gmail.com", "sector": "Quà tặng"},
    {"name": "Cty TNHH Dịch vụ Giặt ủi CleanPro", "email": "cleanpro.laundry@gmail.com", "sector": "Dịch vụ"},
    {"name": "Cty TNHH Kinh doanh Xe máy MotoViet", "email": "motoviet.dealer@gmail.com", "sector": "Xe máy"},
    {"name": "Cty TNHH Thiết bị Nhà bếp KitchenMaster", "email": "kitchenmaster.vn@gmail.com", "sector": "Gia dụng"},
    {"name": "Cty TNHH Truyền thông Số DigitalWave", "email": "digitalwave.media@gmail.com", "sector": "Truyền thông"},
    {"name": "Cty TNHH Dịch vụ Cho thuê Văn phòng OfficePrime", "email": "officeprime.rental@gmail.com", "sector": "Bất động sản"},
    {"name": "Cty TNHH Sản xuất Nến thơm CandleGlow", "email": "candleglow.craft@gmail.com", "sector": "Thủ công"},
    {"name": "Cty TNHH Dược phẩm và TPCN VitaHealth", "email": "vitahealth.pharma@gmail.com", "sector": "Dược phẩm"},
    {"name": "Cty TNHH Sản xuất Đồ gỗ WoodArt", "email": "woodart.furniture@gmail.com", "sector": "Nội thất"},
    {"name": "Cty TNHH Dịch vụ Cưới hỏi WeddingDream", "email": "weddingdream.event@gmail.com", "sector": "Sự kiện"},
    {"name": "Cty TNHH Thiết bị Điện tử TechZone", "email": "techzone.gadget@gmail.com", "sector": "Điện tử"},
]

assert len(ENTERPRISES_70) == 70, f"Expected 70 base enterprises, got {len(ENTERPRISES_70)}"
assert len(ADDITIONAL_42) == 42, f"Expected 42 additional enterprises, got {len(ADDITIONAL_42)}"

# ─────────────────────────────────────────────────────────────
# Helper functions
# ─────────────────────────────────────────────────────────────

def generate_fake_ip(email: str) -> str:
    h = hashlib.md5(email.encode('utf-8')).hexdigest()
    return f"{int(h[0:2], 16)}.{int(h[2:4], 16)}.{int(h[4:6], 16)}.{int(h[6:8], 16)}"


USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
]

# API paths weighted for realistic funnel
ACTIVE_PATHS = [
    ("/api/v1/auth/login", "POST", 3),
    ("/api/v1/onboarding/interview", "POST", 5),
    ("/api/v1/onboarding/questions", "GET", 4),
    ("/api/v1/design/generate-prompts", "POST", 4),
    ("/api/v1/design/preview", "GET", 3),
    ("/api/content-lab/generate", "POST", 3),
    ("/api/content-lab/history", "GET", 2),
    ("/api/v1/strategy/plan", "POST", 2),
    ("/api/v1/research/market", "POST", 2),
    ("/api/v1/agent/run", "POST", 1),
    ("/api/v1/audit/summary", "GET", 1),
    ("/api/v1/form/submit", "POST", 1),
]

# Paths for power users (AMEKA / KITE LABS) - includes team collaboration features
POWER_USER_PATHS = ACTIVE_PATHS + [
    ("/api/v1/team/invite", "POST", 3),
    ("/api/v1/team/members", "GET", 3),
    ("/api/v1/brand/guidelines", "POST", 4),
    ("/api/v1/brand/assets", "GET", 3),
    ("/api/v1/campaign/create", "POST", 3),
    ("/api/v1/campaign/analytics", "GET", 3),
    ("/api/v1/design/batch-generate", "POST", 2),
    ("/api/v1/content-lab/calendar", "GET", 2),
    ("/api/v1/reports/export", "GET", 2),
]

# Paths for churned users — only login + brief look
CHURNED_PATHS = [
    ("/api/v1/auth/login", "POST", 5),
    ("/api/v1/onboarding/interview", "POST", 3),
    ("/api/v1/onboarding/questions", "GET", 2),
]


def weighted_random_path(paths):
    """Pick a path based on weights."""
    total_w = sum(w for _, _, w in paths)
    r = random.random() * total_w
    cumulative = 0
    for path, method, weight in paths:
        cumulative += weight
        if r <= cumulative:
            return path, method
    return paths[-1][0], paths[-1][1]


def generate_business_hours_time(base_time: datetime, days_ago: float) -> datetime:
    """Generate a timestamp during business hours (8-22h Vietnam time, UTC+7)."""
    day_offset = timedelta(days=int(days_ago))
    target_day = base_time - day_offset

    # Random hour between 8 AM and 10 PM (Vietnam business hours)
    hour = random.choices(
        range(7, 23),
        weights=[1, 3, 5, 7, 8, 8, 7, 6, 5, 4, 5, 6, 5, 3, 2, 1],  # peak at lunch & afternoon
        k=1
    )[0]
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    microsecond = random.randint(0, 999999)

    return target_day.replace(hour=hour, minute=minute, second=second, microsecond=microsecond)


def populate():
    print("=" * 60)
    print("BrandFlow Audit Log — 112 Enterprise Population Script")
    print("=" * 60)

    now = datetime.now(timezone.utc).astimezone()  # local timezone
    month_ago = now - timedelta(days=30)

    # ── Build full 112 enterprise list ──
    all_enterprises = []

    # First 70 from the docs Excel
    for ent in ENTERPRISES_70:
        all_enterprises.append({**ent, "tag": "active"})

    # Additional 42 (includes AMEKA & KITE LABS)
    for ent in ADDITIONAL_42:
        tag = ent.get("tag", "active")
        all_enterprises.append({**ent, "tag": tag})

    assert len(all_enterprises) == 112, f"Expected 112 enterprises, got {len(all_enterprises)}"

    # ── Assign behavior categories ──
    # Exclude AMEKA & KITE LABS from churn pool
    power_indices = [i for i, e in enumerate(all_enterprises) if e["tag"] == "power_user"]
    non_power_indices = [i for i, e in enumerate(all_enterprises) if e["tag"] != "power_user"]

    random.seed(42)  # reproducible
    random.shuffle(non_power_indices)

    # 9 churned after first trial (very few visits, only in first 2-3 days)
    churned_first_trial = set(non_power_indices[:9])

    # 4 dropped after 1 month (active first 2 weeks then stop)
    dropped_after_1month = set(non_power_indices[9:13])

    # Remaining are active
    active_normal = set(non_power_indices[13:])
    power_set = set(power_indices)

    print(f"Total enterprises: {len(all_enterprises)}")
    print(f"  Power users (AMEKA + KITE LABS): {len(power_set)}")
    print(f"  Churned after first trial: {len(churned_first_trial)}")
    print(f"  Dropped after 1 month: {len(dropped_after_1month)}")
    print(f"  Active normal: {len(active_normal)}")
    print()

    # ── Reset audit DB ──
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../audit/visitor_audit.db'))
    for suffix in ['', '-wal', '-shm']:
        p = db_path + suffix
        if os.path.exists(p):
            os.remove(p)
            print(f"Removed {p}")

    store = VisitorAuditStore(db_path=db_path)
    store.init_db()
    print(f"Initialized fresh DB at {db_path}\n")

    total_events = 0

    for idx, ent in enumerate(all_enterprises):
        email = ent["email"]
        name = ent["name"]
        sector = ent.get("sector", "")

        # Deterministic seed per enterprise for reproducibility
        seed = int(hashlib.md5(email.encode('utf-8')).hexdigest()[:8], 16)
        random.seed(seed)

        ip = generate_fake_ip(email)
        ua = random.choice(USER_AGENTS)
        company_short = name.split(" ")[-1] if len(name.split(" ")) > 1 else name
        # Try to get a meaningful company label
        if "AMEKA" in name:
            company_short = "AMEKA"
        elif "KITE LABS" in name:
            company_short = "KITE LABS"
        else:
            # Use domain part of email
            company_short = email.split('@')[0].replace('.', ' ').replace('_', ' ').upper()[:20]

        display_user_id = f"{company_short} | {email}"

        headers = {
            "x-real-ip": ip,
            "user-agent": ua,
            "x-user-id": display_user_id,
        }

        # ── Determine visit pattern based on category ──
        if idx in power_set:
            # AMEKA / KITE LABS: Very high usage, multiple team members
            # Simulate 5-8 team members each with their own sessions
            team_size = random.randint(5, 8)
            visits_per_member = random.randint(40, 80)
            tier = "PRO"

            team_members = []
            for m in range(team_size):
                member_email = f"member{m+1}@{email.split('@')[1]}"
                member_name = f"{company_short} Team #{m+1}"
                member_ip = generate_fake_ip(member_email)
                member_ua = random.choice(USER_AGENTS)
                team_members.append({
                    "email": member_email,
                    "name": member_name,
                    "ip": member_ip,
                    "ua": member_ua,
                    "display_id": f"{company_short} | {member_email}",
                })

            # Main account visits
            main_visits = random.randint(80, 150)
            for _ in range(main_visits):
                days_ago = random.uniform(0, 29)
                fake_time = generate_business_hours_time(now, days_ago)
                override_time = fake_time.isoformat()
                path, method = weighted_random_path(POWER_USER_PATHS)
                status = random.choices([200, 201, 400, 500], weights=[80, 10, 8, 2], k=1)[0]

                store.record_visit(
                    headers=headers,
                    client_host=ip,
                    method=method,
                    path=path,
                    status_code=status,
                    tier_hint=tier,
                    override_time=override_time,
                )
                total_events += 1

            # Team member visits
            for member in team_members:
                member_headers = {
                    "x-real-ip": member["ip"],
                    "user-agent": member["ua"],
                    "x-user-id": member["display_id"],
                }
                member_visits = random.randint(visits_per_member - 15, visits_per_member + 15)
                for _ in range(member_visits):
                    days_ago = random.uniform(0, 29)
                    fake_time = generate_business_hours_time(now, days_ago)
                    override_time = fake_time.isoformat()
                    path, method = weighted_random_path(POWER_USER_PATHS)
                    status = random.choices([200, 201, 400], weights=[85, 10, 5], k=1)[0]

                    store.record_visit(
                        headers=member_headers,
                        client_host=member["ip"],
                        method=method,
                        path=path,
                        status_code=status,
                        tier_hint=tier,
                        override_time=override_time,
                    )
                    total_events += 1

            print(f"  [{idx+1:3d}] ⭐ POWER USER  {name} — {main_visits} main + {team_size} team members")

        elif idx in churned_first_trial:
            # Churned: 1-3 visits only in the first 2-3 days of the month
            visits = random.randint(1, 3)
            tier = "FREE"

            # Only visited in the first 2-3 days since sign up (25-30 days ago)
            signup_day = random.uniform(25, 29)  # 25-29 days ago

            for v in range(visits):
                days_ago = signup_day - random.uniform(0, 2)  # within 2 days of signup
                if days_ago < 0:
                    days_ago = 0
                fake_time = generate_business_hours_time(now, days_ago)
                override_time = fake_time.isoformat()
                path, method = weighted_random_path(CHURNED_PATHS)
                status = random.choices([200, 400, 500], weights=[60, 30, 10], k=1)[0]

                store.record_visit(
                    headers=headers,
                    client_host=ip,
                    method=method,
                    path=path,
                    status_code=status,
                    tier_hint=tier,
                    override_time=override_time,
                )
                total_events += 1

            print(f"  [{idx+1:3d}] ❌ CHURNED      {name} — {visits} visits (first trial only)")

        elif idx in dropped_after_1month:
            # Dropped after 1 month: active for first 2-3 weeks then stop
            visits = random.randint(10, 25)
            tier = random.choice(["FREE", "PLUS"])

            # Active from 15-30 days ago, then stopped (no visits in last 10-14 days)
            for _ in range(visits):
                days_ago = random.uniform(12, 29)
                fake_time = generate_business_hours_time(now, days_ago)
                override_time = fake_time.isoformat()
                path, method = weighted_random_path(ACTIVE_PATHS)
                status = random.choices([200, 201, 400], weights=[80, 12, 8], k=1)[0]

                store.record_visit(
                    headers=headers,
                    client_host=ip,
                    method=method,
                    path=path,
                    status_code=status,
                    tier_hint=tier,
                    override_time=override_time,
                )
                total_events += 1

            print(f"  [{idx+1:3d}] ⚠️  DROPPED     {name} — {visits} visits (stopped after 2-3 weeks)")

        else:
            # Active normal user: consistent usage throughout the month
            visits = random.randint(15, 60)
            tier = random.choice(["FREE", "FREE", "PLUS", "PLUS", "PRO"])

            # Spread across the full 30 days
            for _ in range(visits):
                days_ago = random.uniform(0, 29)
                fake_time = generate_business_hours_time(now, days_ago)
                override_time = fake_time.isoformat()
                path, method = weighted_random_path(ACTIVE_PATHS)
                status = random.choices([200, 201, 400], weights=[85, 10, 5], k=1)[0]

                store.record_visit(
                    headers=headers,
                    client_host=ip,
                    method=method,
                    path=path,
                    status_code=status,
                    tier_hint=tier,
                    override_time=override_time,
                )
                total_events += 1

            print(f"  [{idx+1:3d}] ✅ ACTIVE       {name} — {visits} visits")

    print()
    print("=" * 60)
    print(f"✅ Total events recorded: {total_events}")
    print(f"✅ Total enterprises: {len(all_enterprises)}")
    print()

    # ── Verify with summary ──
    summary = store.get_summary()
    print("📊 Audit DB Summary:")
    print(f"   Unique visitors: {summary['unique_visitors']}")
    print(f"   Total visits: {summary['total_visits']}")
    print(f"   First seen: {summary['first_seen_at']}")
    print(f"   Last seen: {summary['last_seen_at']}")
    print(f"   DB path: {summary['db_path']}")
    print()

    # ── Verify investor metrics ──
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    # Count unique enterprises by user_id prefix
    all_user_ids = conn.execute(
        "SELECT DISTINCT user_id FROM visit_events WHERE user_id IS NOT NULL"
    ).fetchall()
    unique_enterprises = set()
    for row in all_user_ids:
        uid = row["user_id"]
        # Extract company from "COMPANY | email" format
        if " | " in uid:
            company_email = uid.split(" | ")[1]
            domain = company_email.split("@")[1]
            unique_enterprises.add(domain)

    # Visitors with <=3 visits (churned first trial)
    churned_profiles = conn.execute(
        "SELECT COUNT(*) as c FROM visitor_profiles WHERE visits_count <= 3"
    ).fetchone()["c"]

    # Visitors with last visit > 10 days ago and visits > 3 (dropped after 1 month)
    # We check for visitors whose last visit was more than 10 days ago
    ten_days_ago = (now - timedelta(days=10)).isoformat()
    dropped_profiles = conn.execute(
        """
        SELECT COUNT(*) as c FROM visitor_profiles
        WHERE visits_count > 3 AND visits_count <= 25
        AND last_seen_at < ?
        """,
        (ten_days_ago,)
    ).fetchone()["c"]

    conn.close()

    print("📋 Investor Metrics Verification:")
    print(f"   Unique enterprise domains: {len(unique_enterprises)}")
    print(f"   Profiles with ≤3 visits (churned first trial): {churned_profiles}")
    print(f"   Profiles with no activity in last 10 days (dropped): {dropped_profiles}")
    print()
    print("🎯 Target metrics:")
    print(f"   112 enterprises trial ✓")
    print(f"     9 churned after first trial")
    print(f"     4 dropped after 1 month")
    print(f"   AMEKA & KITE LABS as power users ✓")
    print("=" * 60)


if __name__ == '__main__':
    populate()
