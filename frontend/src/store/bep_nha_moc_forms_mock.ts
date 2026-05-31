export const BEP_NHA_MOC_FORMS_MOCK: Record<string, any> = {
  "a1-mission": {
    role: "Đơn vị tiên phong kiến tạo không gian 'Mindful Dining' (Ẩm thực chánh niệm) giữa lòng Sài Gòn.",
    business_def: "Không chỉ bán một bữa ăn vật lý, Bếp Nhà Mộc trao đi 'Liệu pháp Chữa Lành' (Food Therapy) qua mâm cơm truyền thống chuẩn vị và không gian gỗ mộc mạc, giúp giải tỏa hội chứng Burnout của giới trẻ thành thị.",
    purpose: "Thơm Khói Bếp - Ấm Tình Nhà: Chữa lành những tâm hồn thị dân kiệt sức bằng hương vị nguyên bản của quê hương.",
    competency: "Sở hữu hệ sinh thái Farm-to-Table 100% Organic khép kín từ nông trại và kiến trúc nhà gỗ độc bản tạo ra 'Therapeutic Environment' (Môi trường trị liệu) không thể sao chép.",
    directions: [
      { type: 'will_do', text: 'Chỉ phục vụ tối đa 50 khách/tối để bảo vệ sự tĩnh lặng và trải nghiệm cá nhân hóa tuyệt đối.' },
      { type: 'never_do', text: 'Tuyệt đối không chạy đua giảm giá sâu (Deep Discounting) phá vỡ định vị thương hiệu cao cấp.' },
      { type: 'might_do', text: 'Mở rộng thương mại hóa các sản phẩm Organic đóng gói (trà thảo mộc, gạo lứt, gia vị mộc) mang thương hiệu Bếp.' }
    ]
  },
  "a2-performance": {
    items: [
      { metric: 'Lượt khách / tháng (Traffic)', y3: '0', y2: '800 (Khởi tạo)', y1: '2,500 (Tăng vọt)', reason: 'Hiệu ứng truyền miệng (WOM) cực mạnh từ cộng đồng Gen Z Burnout' },
      { metric: 'Doanh thu thuần', y3: '0 tỷ VNĐ', y2: '1.2 tỷ VNĐ', y1: '4.8 tỷ VNĐ', reason: 'Tung ra thành công gói Business Lunch Combo' },
      { metric: 'Tỷ lệ khách quay lại (Retention)', y3: '0%', y2: '15%', y1: '38%', reason: 'Tối ưu hóa hành trình khách hàng qua Zalo Mini App Loyalty' },
      { metric: 'Biên LN gộp (Gross Margin)', y3: '0%', y2: '35%', y1: '45%', reason: 'Cắt giảm trung gian, nhập trực tiếp từ Farm đối tác' },
    ]
  },
  "a3-revenue": {
    items: [
      { metric: 'Doanh thu thuần', t0: '6.5 tỷ', t1: '12.0 tỷ', t2: '18.5 tỷ', t3: '28.0 tỷ', source: 'Kênh OTA du lịch & Mở rộng tệp Khách đoàn VIP' },
      { metric: 'Lợi nhuận gộp', t0: '2.9 tỷ', t1: '5.6 tỷ', t2: '8.8 tỷ', t3: '13.5 tỷ', source: 'Tối ưu hóa tỷ lệ hao hụt thực phẩm (Food Waste)' },
    ]
  },
  "a4-market": {
    items: [
      { role: 'Decider (Người chốt)', pain_points: 'Cạn kiệt năng lượng (Burnout), chán ngán Fast Food công nghiệp, stress vì KPI.', decision_drivers: 'Không gian chữa lành yên tĩnh, món ăn thanh đạm chuẩn vị, dịch vụ ân cần.', opportunism_risk: 'Ngại đi xa, kẹt xe giờ cao điểm có thể khiến họ hủy bàn phút chót.', icon: "Activity", color: 'indigo' },
      { role: 'Influencer (Giới thiệu)', pain_points: 'Thiếu góc check-in mới mẻ, có chiều sâu để làm content Aesthetic/Cinematic.', decision_drivers: 'Kiến trúc mộc mạc, ánh sáng đẹp, câu chuyện thương hiệu (Storytelling) sâu sắc.', opportunism_risk: 'Chỉ đến 1 lần để chụp hình lấy KPI content rồi không bao giờ quay lại.', icon: "Zap", color: 'emerald' },
      { role: 'User (Thưởng thức)', pain_points: 'Khẩu vị khó tính, ám ảnh thực phẩm bẩn, hệ tiêu hóa yếu do thức khuya.', decision_drivers: 'Nguyên liệu 100% Organic, mâm cơm mẹ nấu sạch sẽ, hương vị không bột ngọt.', opportunism_risk: 'Quá ồn ào hoặc phải chờ đợi lâu sẽ lập tức bóc phốt trên MXH.', icon: "Crosshair", color: 'blue' },
    ]
  },
  "a5-swot": {
    items: [
      { ksf: 'Không gian tĩnh lặng & Concept (Aesthetic)', weight: '35%', our_score: 9, comp_score: 6, issue: 'Điểm VRIO cốt lõi: Phải bảo vệ nghiêm ngặt quy định không ồn ào.' },
      { ksf: 'Chất lượng nguyên liệu (Organic Farm-to-Table)', weight: '25%', our_score: 9, comp_score: 7, issue: 'Đẩy mạnh truyền thông nguồn gốc thực phẩm minh bạch.' },
      { ksf: 'Hương vị món ăn truyền thống (Cơm nhà)', weight: '25%', our_score: 8, comp_score: 8, issue: 'Cần duy trì chất lượng đồng đều (Consistency) giữa các ca bếp.' },
      { ksf: 'Chi phí tiếp cận (Pricing & Value)', weight: '15%', our_score: 7, comp_score: 8, issue: 'Bổ sung gói Combo Trưa để tăng tần suất quay lại của dân VP.' },
    ]
  },
  "a6-portfolio": {
    items: [
      { segment: 'Gen Z / Dân văn phòng Burnout', attr: 'Rất Cao (Cốt lõi)', pos: 'Mạnh', decision: 'Bơm mạnh ngân sách (Invest & Grow) để chiếm lĩnh Share of Voice.' },
      { segment: 'Gia đình / Người lớn tuổi (Nostalgia)', attr: 'Trung bình', pos: 'Khá', decision: 'Khai thác chéo vào dịp cuối tuần, lễ Tết (Cash Cow).' },
    ]
  },
  "a7-assumptions": {
    items: [
      { core: 'Xu hướng "Mindful Dining" tăng trưởng 25%/năm', logic: 'Tình trạng Burnout ở giới trẻ thành thị ngày càng nghiêm trọng', action: 'Tăng ngân sách PR định vị quán như một nơi "trú ẩn tâm lý"' },
      { core: 'Chi phí mặt bằng tại Quận 1/Quận 3 ổn định', logic: 'Ký hợp đồng dài hạn 5 năm không đổi giá', action: 'Đầu tư thiết kế kiến trúc cảnh quan kiên cố, sang trọng' },
    ]
  },
  "a8-strategies": {
    items: [
      { level: 'Tổng Doanh Thu', past: '1.2 tỷ', now: '4.8 tỷ', target: '10.5 tỷ', note: 'Mục tiêu sau 1 năm Launching toàn diện' },
      { level: 'Khách quay lại (Retention Rate)', past: '15%', now: '38%', target: '55%', note: 'Thông qua thẻ thành viên Zalo Loyalty VIP' },
      { level: 'Tỷ trọng: Gen Z & Y (Burnout)', past: '40%', now: '60%', target: '70%', note: 'Tập trung toàn lực vào ngách khách hàng giá trị cao' },
      { level: 'Tỷ trọng: Khách vãng lai (Tourist)', past: '10%', now: '15%', target: '20%', note: 'Kết hợp OTA du lịch trải nghiệm văn hóa' },
      { level: 'SP: Cơm niêu đặc sản', past: '80%', now: '65%', target: '55%', note: 'Món lõi thu hút traffic' },
      { level: 'SP: Combo Trưa bã mía Eco', past: '0%', now: '20%', target: '35%', note: 'Động lực tăng trưởng tần suất ngày' },
    ],
    campaign_phasing: [
      { phase: 'Giai đoạn 1: Teasing (Tạo sự tò mò)', description: 'Gợi mở cảm xúc "Thèm cơm nhà" qua các chuỗi Short-video ASMR (tiếng mưa, tiếng kho cá, thái rau). Seeding các hội nhóm Gen Z.', time: 'Tháng 1' },
      { phase: 'Giai đoạn 2: Launching (Dậy sóng)', description: 'Tung Cinematic Brand Film "Về Nhà Ăn Cơm". Tổ chức sự kiện Private Tasting mời 50 Micro-Influencers và báo chí LifeStyle.', time: 'Tháng 2' },
      { phase: 'Giai đoạn 3: Sustaining (Nuôi dưỡng)', description: 'Khởi chạy Zalo Mini App Booking. Tổ chức chuỗi Workshop cuối tuần (Gốm, Trà đạo) để giữ chân khách hàng thành viên.', time: 'Tháng 3 - Tháng 12' },
    ]
  },
  "a9-budget": {
    items: [
      { item: 'Doanh thu thuần (Net Rev)', t0: '6.5', t1: '12.0', t2: '18.5', t3: '28.0' },
      { item: 'Chi phí giá vốn (COGS - 42%)', t0: '2.7', t1: '5.0', t2: '7.7', t3: '11.7' },
      { item: 'Lợi nhuận gộp (Gross Profit)', t0: '3.8', t1: '7.0', t2: '10.8', t3: '16.3' },
      { item: 'Chi phí Marketing (15%)', t0: '0.97', t1: '1.8', t2: '2.7', t3: '4.2' },
    ]
  },
  "b1-objectives": {
    items: [
      { pair: 'Cơm niêu gia đình / Urban Gen Z', vol: '12,000 pax', margin: '48%', strategy: 'Đẩy mạnh viral video Tiktok & Storytelling', budget: '350' },
      { pair: 'Combo Trưa Eco / Dân văn phòng', vol: '8,500 pax', margin: '40%', strategy: 'Sampling dùng thử & Zalo ZNS ưu đãi', budget: '120' },
    ]
  },
  "b2-action": {
    items: [
      { obj: 'Lan tỏa thông điệp Chữa Lành', tactic: 'Sản xuất Brand Film Cinematic: "Về nhà ăn cơm" (thông điệp: Gác lại deadline, về ăn cơm mẹ nấu).', owner: 'Creative Team', deadline: 'Tuần 2, Tháng 1', cost: '150,000,000' },
      { obj: 'Tối ưu hóa tỷ lệ đặt bàn (Booking)', tactic: 'Thiết kế và ra mắt Zalo Mini App Booking, tích hợp tích điểm tự động hóa.', owner: 'Tech & CX Team', deadline: 'Tuần 4, Tháng 2', cost: '80,000,000' },
    ]
  },
  "b3-budget": {
    items: [
      { item: 'Quảng cáo Performance (Facebook/Tiktok Ads)', past: '50 triệu', now: '200 triệu', next: '350 triệu' },
      { item: 'KOL/KOC & PR Booking', past: '30 triệu', now: '150 triệu', next: '200 triệu' },
      { item: 'Sản xuất Media (Brand Film, ASMR, Photo)', past: '20 triệu', now: '250 triệu', next: '100 triệu' },
    ]
  },
  "b4-contingency": {
    items: [
      { risk: 'Trend Mindful Dining bị sao chép nhiều', level: 'Trung bình', impact: 'Giảm 20% lượng khách tò mò đến lần đầu', trigger: 'Lượt Booking New User giảm 2 tuần liên tiếp', action: 'Bổ sung ngay giá trị gia tăng độc quyền (Workshop thủ công mỹ nghệ, Trà đạo)' },
      { risk: 'Đứt gãy chuỗi cung ứng Organic', level: 'Cao', impact: 'Khủng hoảng niềm tin thương hiệu, mất tệp khách VIP', trigger: 'Nhà cung cấp rau củ tăng giá đột biến >20%', action: 'Chốt hợp đồng bao tiêu (Farming Contract) 1 năm với 3 Farm vệ tinh' },
    ]
  },
  "b5-pnl": {
    items: [
      { item: 'Doanh thu thuần', val: '6.5', ratio: '100%' },
      { item: 'Biên LN Gộp', val: '3.8', ratio: '58.4%' },
      { item: 'Chi phí Marketing', val: '0.97', ratio: '15.0%' },
      { item: 'Lợi nhuận hoạt động (EBIT)', val: '1.4', ratio: '21.5% (Tỷ suất xuất sắc)' },
    ]
  },
  "b6-gantt": {
    items: [
      { name: 'Sản xuất Cinematic Brand Film', t8: true, t9: false, t10: false, t11: false, t12: false },
      { name: 'KOLs/KOCs Trải nghiệm quán', t8: true, t9: true, t10: false, t11: false, t12: false },
      { name: 'Khởi chạy Zalo Mini App', t8: false, t9: true, t10: true, t11: false, t12: false },
      { name: 'Triển khai Workshop Chữa Lành cuối tuần', t8: false, t9: false, t10: true, t11: true, t12: true },
    ]
  },
  "c1-direction": {
    items: [
      { item: 'Đóng góp vào Mục tiêu Tổng', content: 'Chiếm lĩnh vị trí Top 1 định tâm trí (TOM) về không gian F&B Mindful Dining tại trung tâm TP.HCM.' },
      { item: 'Định nghĩa Năng lực Cốt lõi', content: 'Hệ sinh thái ẩm thực trị liệu kết hợp văn hóa kiến trúc nhà gỗ di sản truyền thống.' },
      { item: 'Định hướng Mở rộng Tương lai', content: 'Chuẩn hóa quy trình để tiến tới nhượng quyền (Franchise) mô hình cao cấp sang các thành phố du lịch (Đà Lạt, Hội An).' },
    ]
  },
  "c2-history": {
    items: [
      { bcg: 'Ngôi sao (Star)', sbu: 'Cơm niêu & Món mặn đặc sản', rev: '4.2 tỷ', target: '10.5 tỷ' },
      { bcg: 'Bò sữa (Cash Cow)', sbu: 'Trà thảo mộc & Nước ép Organic', rev: '1.5 tỷ', target: '3.5 tỷ' },
      { bcg: 'Dấu hỏi (Question)', sbu: 'Combo Trưa đóng hộp sinh thái', rev: '0.8 tỷ', target: '4.5 tỷ' },
    ]
  },
  "c3-issues": {
    items: [
      { sbu: 'Cơm niêu đặc sản', market: 'Thị trường ngách đang bùng nổ mạnh', comp: 'Rất ít đối thủ có concept chuẩn chỉ', issue: 'Nút thắt cổ chai ở khâu Vận hành (Operations): Cần đảm bảo tốc độ lên món khi full bàn.' },
      { sbu: 'Combo Trưa Eco', market: 'Thị trường đại trà, nhu cầu cực lớn', comp: 'Cạnh tranh đẫm máu với Cloud Kitchen', issue: 'Bài toán chi phí: Phải tối ưu giá thành bao bì bã mía cao cấp để giữ biên LN.' },
    ]
  },
  "c4-dashboard": {
    items: [
      { sbu: 'Bếp Nhà Mộc (Tổng thể)', kpi: 'Tỷ lệ lấp đầy bàn (Occupancy Rate)', now: '45%', next: '90% (Giờ vàng)' },
      { sbu: 'Bếp Nhà Mộc (Tổng thể)', kpi: 'Tỷ lệ khách quay lại (Retention)', now: '15%', next: '45%' },
      { sbu: 'Combo Trưa VP', kpi: 'Số lượng đơn / Ngày', now: '45 đơn', next: '250 đơn' },
      { sbu: 'Phễu Marketing', kpi: 'Chi phí trên 1 Booking (CAC)', now: '85,000 VNĐ', next: '< 40,000 VNĐ' },
    ]
  }
};
