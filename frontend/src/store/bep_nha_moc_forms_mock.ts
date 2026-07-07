export const BEP_NHA_MOC_FORMS_MOCK: Record<string, any> = {
  "a1-mission": {
    role: "Tiên phong kiến tạo không gian 'Mindful Dining' (Ẩm thực chánh niệm) chuẩn mực giữa lòng Sài Gòn phồn hoa.",
    business_def: "Vượt lên trên một mô hình nhà hàng vật lý truyền thống, Bếp Nhà Mộc cung cấp 'Therapeutic Dining Experience' (Trải nghiệm trị liệu qua ẩm thực). Khách hàng không chỉ mua một bữa ăn, mà họ đang trả tiền cho sự bình yên, không gian hoài niệm và khả năng tái tạo năng lượng sau chuỗi ngày Burnout.",
    purpose: "Thơm Khói Bếp - Ấm Tình Nhà: Chữa lành những tâm hồn thị dân kiệt sức bằng hương vị nguyên bản của quê hương, nơi thời gian như ngừng trôi sau cánh cửa gỗ.",
    competency: "Sở hữu hệ sinh thái khép kín Farm-to-Table 100% Organic, công thức di sản 3 đời không bột ngọt (No MSG), và một kiến trúc nhà cổ Bắc Bộ nguyên bản tạo ra VRIO (Value, Rare, Inimitable, Organized) không thể sao chép bằng tiền.",
    directions: [
      { type: 'will_do', text: 'Ứng dụng Scarcity Marketing: Giới hạn tối đa 50 khách/tối để bảo toàn tính độc quyền (Exclusivity) và sự tĩnh lặng của không gian chữa lành.' },
      { type: 'never_do', text: 'Tuyệt đối không áp dụng chiến lược Deep Discounting (Giảm giá sâu) hay gia nhập các cuộc chiến giá trên nền tảng Cloud Kitchen để bảo vệ Brand Equity.' },
      { type: 'might_do', text: 'Thương mại hóa hệ sinh thái sản phẩm Organic đóng gói (trà an thần, gạo lứt hữu cơ, gia vị mộc) dưới dạng quà tặng doanh nghiệp (B2B).' }
    ]
  },
  "a2-performance": {
    items: [
      { metric: 'Doanh thu thuần (Net Rev)', y3: '0.8 tỷ', y2: '1.2 tỷ', y1: '1.2 tỷ (Đi ngang)', reason: 'Stagnant (Đi ngang 18 tháng qua) do phụ thuộc tệp khách cũ >45 tuổi, chưa tiếp cận Gen Z/Y.' },
      { metric: 'Biên lợi nhuận gộp (Gross Margin)', y3: '35%', y2: '28%', y1: '21% (Báo động)', reason: 'Thấp hơn mức trung bình ngành F&B (25-30%) do đứt gãy chuỗi cung ứng hữu cơ và lãng phí nguyên liệu.' },
      { metric: 'Tỷ lệ khách quay lại (Retention)', y3: '12%', y2: '14%', y1: '15% (Chậm)', reason: 'Thiếu hệ sinh thái CRM (Zalo/Mini App) để remarketing tự động. Khách đến 1 lần rồi quên.' },
      { metric: 'Chi phí có 1 khách mới (CAC)', y3: '180,000đ', y2: '220,000đ', y1: '250,000đ (Quá cao)', reason: 'Đốt tiền vào các kênh Performance Ads truyền thống nhưng content mờ nhạt, thiếu Brand Story.' },
    ]
  },
  "a3-revenue": {
    items: [
      { metric: 'Doanh Thu Thuần', t0: '14.4 tỷ', t1: '21.6 tỷ', t2: '28.0 tỷ', t3: '35.0 tỷ', source: 'Đẩy mạnh Combo Trưa Văn Phòng (25%) & Tối đa hóa tỷ lệ lấp đầy cuối tuần (75%)' },
      { metric: 'EBITDA (Lợi nhuận HĐ)', t0: '1.8 tỷ', t1: '4.5 tỷ', t2: '6.5 tỷ', t3: '9.2 tỷ', source: 'Cắt giảm CAC thông qua O2O Loyalty & Tối ưu Food Cost (FC) xuống < 28%' },
    ]
  },
  "a4-market": {
    items: [
      { role: 'Urban Healers (Gen Z, 22-28T)', pain_points: 'Burnout vì KPI/Deadline, ám ảnh thực phẩm bẩn, thiếu không gian trốn áp lực mạng xã hội.', decision_drivers: 'Kiến trúc Cinematic/Aesthetic dễ làm content chữa lành, cam kết 100% Organic, Storytelling chân thật.', opportunism_risk: 'Đến 1 lần chụp hình lấy KPI rồi không quay lại nếu không có chương trình Loyalty phù hợp.', icon: "Zap", color: 'indigo' },
      { role: 'Mindful Professionals (Gen Y, 29-38T)', pain_points: 'Chán ngán Fastfood công nghiệp mặn chát, cần nơi tiếp đối tác hoặc ăn trưa lịch sự, yên tĩnh.', decision_drivers: 'Chất lượng nguyên liệu chuẩn vị nhà nấu (No MSG), phục vụ chuyên nghiệp, bao bì Eco-friendly.', opportunism_risk: 'Rất nhạy cảm với thời gian lên món (TAT - Turnaround Time) vào buổi trưa.', icon: "Briefcase", color: 'emerald' },
      { role: 'Modern Families (35-50T)', pain_points: 'Khó tìm nhà hàng an toàn vệ sinh 100% cho trẻ nhỏ, muốn tìm lại hương vị ký ức tuổi thơ.', decision_drivers: 'Công thức di sản 3 đời, không gian hoài niệm Nostalgia, dịch vụ ân cần (Caregiver).', opportunism_risk: 'Nếu quán quá đông đúc ồn ào sẽ lập tức phàn nàn và rời đi vĩnh viễn.', icon: "Users", color: 'amber' },
    ]
  },
  "a5-swot": {
    items: [
      { ksf: 'Kiến trúc Nhà Gỗ Di Sản & Aesthetic', weight: '35%', our_score: 9, comp_score: 6, issue: 'Điểm VRIO lõi: Cần có quy định nghiêm ngặt về "Không gian tĩnh" để bảo vệ trải nghiệm (Limit Noise).' },
      { ksf: 'Chất lượng Nguyên liệu (100% Organic, No MSG)', weight: '30%', our_score: 9, comp_score: 7, issue: 'Thiếu truyền thông minh bạch (Traceability) - Cần series video Farm-to-Table để educate khách hàng.' },
      { ksf: 'Độ nhận diện thương hiệu số (Digital Presence)', weight: '20%', our_score: 4, comp_score: 8, issue: 'Tử huyệt: Định vị mờ nhạt, bị đánh đồng với "quán cơm bình dân". Cần Rebranding gấp.' },
      { ksf: 'Hệ thống CRM & Customer Retention', weight: '15%', our_score: 3, comp_score: 7, issue: 'Tử huyệt: Đang rò rỉ (Churn) 85% khách hàng sau lần đầu. Phải build Zalo Mini App ngay.' },
    ]
  },
  "a6-portfolio": {
    items: [
      { segment: 'Cơm Niêu Đặc Sản & Món Mặn', attr: 'Rất Cao (Cash Cow)', pos: 'Mạnh', decision: 'Duy trì công thức lõi, tăng giá trị cộng thêm qua cách phục vụ (Theatrical serving) để upsell.' },
      { segment: 'Trà Thảo Mộc Chữa Lành (Organic)', attr: 'Cao (Star)', pos: 'Mạnh', decision: 'Đẩy mạnh truyền thông công dụng an thần, thiết kế bao bì mang về (Take-away) chuẩn eco.' },
      { segment: 'Combo Trưa Bã Mía (Eco Lunch)', attr: 'Cao (Question Mark)', pos: 'Trượt', decision: 'Bơm ngân sách để chiếm lĩnh tệp dân văn phòng, tối ưu hóa khung giờ vắng khách (11h-14h).' }
    ]
  },
  "a7-assumptions": {
    items: [
      { core: 'Xu hướng "Mindful Dining & Eat Clean" tăng 45% YoY', logic: 'Gen Y/Z thành thị sẵn sàng chi trả Premium (cao hơn 20%) cho thực phẩm minh bạch nguồn gốc và không gian trị liệu.', action: 'Tái định vị thương hiệu thành "Điểm trú ẩn tâm lý", tăng giá bán 15% để tái đầu tư.' },
      { core: 'Chi phí mặt bằng Q1/Q3 không biến động quá 10%', logic: 'Đã ký hợp đồng dài hạn 5 năm (Lock-in price).', action: 'Dồn toàn lực ngân sách vào Marketing O2O và Digital Transformation thay vì lo chi phí cố định.' },
    ]
  },
  "a8-strategies": {
    items: [
      { level: 'Total Revenue (Doanh thu tổng)', past: '14.4 tỷ', now: '21.6 tỷ', target: '28.0 tỷ', note: 'Mục tiêu sau 12 tháng Rebranding (Tăng 50%)' },
      { level: 'Customer Acquisition Cost (CAC)', past: '250,000đ', now: '120,000đ', target: '40,000đ', note: 'Tối ưu hóa bằng Viral Content và Referral (Word-of-mouth)' },
      { level: 'Retention Rate (Khách quay lại)', past: '15%', now: '35%', target: '50%', note: 'Khởi chạy hệ sinh thái Loyalty Zalo Mini App' },
      { level: 'Tỷ trọng Gen Z & Y (Urban Healers)', past: '20%', now: '55%', target: '70%', note: 'Dịch chuyển tệp khách hàng sang phân khúc giá trị cao' },
      { level: 'Food Cost (Giá vốn nguyên liệu)', past: '32%', now: '28%', target: '25%', note: 'Tối ưu hóa Waste Management và chốt Farming Contract' },
    ],
    campaign_phasing: [
      { phase: 'GĐ1: Nhen Lửa (Rebranding & Teasing)', description: 'Tung Cinematic Brand Film "Về Nhà Ăn Cơm". Thay đổi toàn bộ Visual Identity, POSM, và Uniform. Phủ sóng Short-video ASMR trên TikTok/Reels.', time: 'Tháng 1' },
      { phase: 'GĐ2: Bùng Vị (Traffic Generation & O2O)', description: 'Mời 30+ Micro-Influencers Lifestyle/Foodie đến trải nghiệm. Chạy Performance Ads hướng đến Lead Gen đặt bàn trước tặng Tráng miệng.', time: 'Tháng 2' },
      { phase: 'GĐ3: Giữ Lửa (Loyalty & Optimization)', description: 'Ra mắt Zalo Mini App "Hạt Gạo" (Tích điểm, Đặt bàn Real-time). Tung gói Corporate Eco Lunch lấp đầy khung giờ trưa.', time: 'Tháng 3 - Tháng 12' },
    ]
  },
  "a9-budget": {
    items: [
      { item: 'Doanh thu thuần (Net Rev)', t0: '1.2', t1: '1.8', t2: '2.5', t3: '3.2' },
      { item: 'Chi phí giá vốn (COGS - 28%)', t0: '0.33', t1: '0.50', t2: '0.70', t3: '0.89' },
      { item: 'Lợi nhuận gộp (Gross Profit)', t0: '0.87', t1: '1.30', t2: '1.80', t3: '2.31' },
      { item: 'Marketing Budget (Tối đa 15%)', t0: '0.18', t1: '0.27', t2: '0.37', t3: '0.48' },
    ]
  },
  "b1-objectives": {
    items: [
      { pair: 'Ẩm thực Trị liệu / Urban Gen Z', vol: '8,000 pax', margin: '65%', strategy: 'Đẩy mạnh viral video Tiktok (ASMR) & Storytelling "Trốn deadline"', budget: '180' },
      { pair: 'Eco Lunch / Mindful Professionals', vol: '12,500 pax', margin: '42%', strategy: 'Sampling dùng thử tại Office building & Zalo ZNS ưu đãi', budget: '100' },
    ]
  },
  "b2-action": {
    items: [
      { obj: 'Tái định vị (Brand Equity)', tactic: 'Sản xuất Cinematic Brand Film 90s: "Về nhà ăn cơm". Tối ưu định dạng dọc (Vertical) cho Reels/TikTok.', owner: 'Creative Team', deadline: 'Tuần 2, Tháng 1', cost: '50,000,000' },
      { obj: 'O2O Traffic Generation', tactic: 'KOLs/KOCs Campaign: Mời 30+ Nano & Micro Influencers (Lifestyle/Food) review không gian tĩnh lặng.', owner: 'PR & Media', deadline: 'Tuần 1, Tháng 2', cost: '100,000,000' },
      { obj: 'Customer Retention (LTV)', tactic: 'Triển khai Zalo Mini App Booking & Loyalty (Tích "Hạt Gạo", Tặng quà sinh nhật tự động).', owner: 'Tech & CX', deadline: 'Tuần 3, Tháng 2', cost: '35,000,000' },
    ]
  },
  "b3-budget": {
    items: [
      { item: 'Quảng cáo Performance (Fb/TikTok Lead Gen)', past: '50 triệu', now: '90 triệu', next: '120 triệu' },
      { item: 'KOL/KOC & Booking PR (Earned Media)', past: '10 triệu', now: '100 triệu', next: '150 triệu' },
      { item: 'Sản xuất Content (Brand Film, Photo, ASMR)', past: '15 triệu', now: '80 triệu', next: '50 triệu' },
    ]
  },
  "b4-contingency": {
    items: [
      { risk: 'Trend "Chữa Lành" bị bão hòa, copycat', level: 'Cao', impact: 'Giảm 25% lượng khách New User đến vì tò mò', trigger: 'Lượt Booking New User từ Ads giảm 2 tuần liên tiếp', action: 'Bổ sung giá trị gia tăng độc quyền: Khởi chạy chuỗi Workshop cuối tuần (Gốm, Trà đạo, Cắm hoa).' },
      { risk: 'Khủng hoảng vận hành do quá tải (Overload)', level: 'Nghiêm trọng', impact: 'Trải nghiệm khách hàng sụp đổ, bóc phốt trên MXH', trigger: 'TAT (Thời gian lên món) > 25 phút', action: 'Kích hoạt Scarcity Mode: Chỉ nhận khách Booking trước qua Zalo, ngưng nhận khách Walk-in giờ cao điểm.' },
    ]
  },
  "b5-pnl": {
    items: [
      { item: 'Doanh thu thuần mục tiêu (Q1)', val: '5.4', ratio: '100%' },
      { item: 'Biên LN Gộp (Gross Margin - 72%)', val: '3.88', ratio: '71.8%' },
      { item: 'Tổng Ngân sách Chiến dịch', val: '0.35', ratio: '6.4% (Tối ưu)' },
      { item: 'Lợi nhuận hoạt động dự phóng (EBIT)', val: '1.25', ratio: '23.1% (Xuất sắc)' },
    ]
  },
  "b6-gantt": {
    items: [
      { name: 'Sản xuất Brand Film & Rebranding Identity', t8: true, t9: false, t10: false, t11: false, t12: false },
      { name: 'KOLs/KOCs Campaign "Taste the Memories"', t8: false, t9: true, t10: true, t11: false, t12: false },
      { name: 'Performance Ads (Booking Lead Gen)', t8: false, t9: true, t10: true, t11: true, t12: true },
      { name: 'Khởi chạy Zalo Mini App & Eco Lunch', t8: false, t9: false, t10: true, t11: true, t12: true },
    ]
  },
  "c1-direction": {
    items: [
      { item: 'North Star Metric (Chỉ số cốt lõi)', content: 'Tối đa hóa Customer Lifetime Value (LTV) và Tỷ lệ Lấp đầy Bàn (Occupancy Rate) thông qua định vị phân khúc "Mindful Dining" cao cấp.' },
      { item: 'Lợi thế Cạnh tranh Bền vững (MOAT)', content: 'Khóa chặt nguồn cung nguyên liệu (Exclusive Farming Contracts) kết hợp Kiến trúc di sản không thể sao chép bằng vốn đơn thuần.' },
      { item: 'Chiến lược Rút lui / Mở rộng (Exit/Scale)', content: 'Đóng gói quy trình (SOPs) chuẩn hóa trong 18 tháng để tiến tới Franchise mô hình hoặc gọi vốn chuỗi (Series A).' },
    ]
  },
  "c2-history": {
    items: [
      { bcg: 'Ngôi sao (Star)', sbu: 'Trà Thảo Mộc Trị Liệu & Combo Trưa Eco', rev: '0.8 tỷ', target: '6.5 tỷ' },
      { bcg: 'Bò sữa (Cash Cow)', sbu: 'Cơm Niêu Gia Đình & Món Ký Ức', rev: '14.4 tỷ', target: '21.5 tỷ' },
      { bcg: 'Chó mực (Dog)', sbu: 'Các món xào/chiên ngập dầu (Cắt bỏ)', rev: '1.2 tỷ', target: '0 tỷ' },
    ]
  },
  "c3-issues": {
    items: [
      { sbu: 'Cơm Niêu (Core Product)', market: 'Ngách Casual Dining đang bùng nổ 25% YoY', comp: 'Ít đối thủ có câu chuyện đủ sâu', issue: 'Nút thắt cổ chai Vận Hành (Bottleneck): Tốc độ bếp cực hạn (Capacity) chỉ 120 pax/ca. Cần giải pháp công nghệ điều phối.' },
      { sbu: 'Combo Trưa Eco (Growth Engine)', market: 'Quy mô đại trà, TAM cực lớn (Dân VP)', comp: 'Đại dương đỏ (Red Ocean) Cloud Kitchen', issue: 'Bài toán Đơn giá (Unit Economics): Phải đàm phán giảm 15% giá bao bì bã mía để giữ biên lợi nhuận > 40%.' },
    ]
  },
  "c4-dashboard": {
    items: [
      { sbu: 'Bếp Nhà Mộc (Master)', kpi: 'Tỷ lệ lấp đầy bàn (Occupancy Rate)', now: '35% (Rất thấp)', next: '85% (Optimal)' },
      { sbu: 'Bếp Nhà Mộc (Master)', kpi: 'Tỷ lệ khách quay lại sau 30 ngày (D30 Retention)', now: '15%', next: '45% (Qua Zalo Mini App)' },
      { sbu: 'Eco Lunch Combo', kpi: 'Tốc độ tăng trưởng Đơn/Ngày (Velocity)', now: '30 đơn/ngày', next: '250 đơn/ngày' },
      { sbu: 'Performance Marketing', kpi: 'Chi phí thu hút 1 Booking (CAC)', now: '250,000đ', next: '< 40,000đ' },
    ]
  }
};
