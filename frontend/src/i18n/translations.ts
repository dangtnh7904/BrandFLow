export const translations = {
 // === COMMON ===
 common: {
 loading: { en: "Loading...", vi: "Đang tải..." },
 save: { en: "Save", vi: "Lưu" },
 cancel: { en: "Cancel", vi: "Hủy" },
 next: { en: "Next Step", vi: "Bước tiếp theo" },
 prev: { en: "Previous Step", vi: "Trở về trước" },
 },

 // === SIDEBAR (Main) ===
 sidebar: {
 dashboard: { en: "Dashboard", vi: "Bảng Điều Khiển" },
 daily_content: { en: "Daily Content", vi: "Tạo Content" },
 workspace: { en: "AI Workspace", vi: "Không gian làm việc" },
 agents: { en: "Network Agents", vi: "Mạng lưới Trợ lý AI" },
 assets: { en: "Brand Assets", vi: "Tài sản Thương hiệu" },
 history: { en: "Run History", vi: "Lịch sử Phân tích" },
 settings: { en: "Settings", vi: "Cài đặt Hệ thống" },
 activePlan: { en: "Enterprise Plan Active", vi: "Gói Doanh nghiệp Khả dụng" },
 usage: { en: "Usage", vi: "Sử dụng" },
 },

 // === B2B SIDEBAR ===
 b2b: {
 title: { en: "B2B Planning", vi: "Hoạch định B2B" },
 phase1: { en: "Data Ingestion", vi: "Nạp Dữ liệu" },
 phase2: { en: "Agent Debate", vi: "AI Thảo luận" },
 phase3: { en: "Budgeting", vi: "Định giá Ngân sách" },
 phase4: { en: "Blueprint", vi: "Bản đồ Chiến lược" },
 module_sources: { en: "Data Sources", vi: "Nguồn Dữ liệu" },
 module_metrics: { en: "Metrics Map", vi: "Bản đồ Chỉ số" },
 module_market: { en: "Market Reality", vi: "Thực tại Thị trường" },
 module_financials: { en: "Financial Baseline", vi: "Cơ sở Tài chính" },
 status_complete: { en: "Complete", vi: "Hoàn tất" },
 status_active: { en: "Active", vi: "Đang xử lý" },
 status_locked: { en: "Locked", vi: "Đã khóa" },
 },

 // === SYSTEM PAGES ===
 agents: {
 title: { en: "Network Agents", vi: "Mạng lưới Trợ lý AI" },
 desc: { en: "Manage and configure your specialized AI workforce.", vi: "Quản lý và tinh chỉnh nguồn lực đội ngũ AI chuyên biệt." },
 status_idle: { en: "Idle", vi: "Bình thường" },
 status_processing: { en: "Processing", vi: "Đang Cào Dữ liệu" },
 load: { en: "Cognitive Load", vi: "Tải trọng Logic" },
 },
 assets: {
 title: { en: "Brand Assets", vi: "Thư viện Tài sản" },
 desc: { en: "Central repository for your company's marketing collateral and brand guidelines.", vi: "Nơi lưu trữ trung tâm cho toàn bộ dữ kiện và bộ quy chuẩn thương hiệu." },
 upload_title: { en: "Upload Asset", vi: "Tải lên Dữ liệu" },
 upload_desc: { en: "Drag & drop brand assets here to expand AI knowledge base.", vi: "Kéo và thả tài liệu vào đây để mở rộng cơ sở tri thức cho hệ thống AI." },
 library: { en: "Asset Library", vi: "Kho Lưu trữ" },
 },
 settings: {
 title: { en: "System Settings", vi: "Cài đặt Cốt lõi" },
 desc: { en: "Configure your BrandFlow workspace and global preferences.", vi: "Thiết lập không gian làm việc BrandFlow và các tuỳ chọn toàn cục." },
 profile: { en: "Global Profile", vi: "Hồ sơ Toàn cục" },
 security: { en: "Security & API", vi: "Bảo mật & API" },
 billing: { en: "Billing", vi: "Thanh toán & Gói cước" },
 org_name: { en: "Organization Name", vi: "Tên Doanh nghiệp" },
 org_name_ph: { en: "Acme Corp", vi: "Tập đoàn Acme" },
 industry: { en: "Primary Industry", vi: "Ngành nghề Cốt lõi" },
 industry_ph: { en: "e.g., Enterprise Software", vi: "ví dụ: Phần mềm Doanh nghiệp" },
 admin_email: { en: "Admin Email", vi: "Email Quản trị" },
 admin_email_ph: { en: "admin@acme.com", vi: "admin@acme.com" },
 save_profile: { en: "Save Profile Preferences", vi: "Lưu tùy chọn Hồ sơ" },
 },

 // === WIZARD (Phase 1) ===
 screen1: {
 title: { en: "Initialize Brand Intelligence", vi: "Khởi tạo Trí tuệ Thương hiệu" },
 desc: { en: "Select one or multiple data ingestion methods to build your Master Brand Profile. We recommend combining document parsing with web link scraping.", vi: "Chọn một hoặc nhiều phương pháp nạp dữ liệu để xây dựng Hồ sơ Thương hiệu Gốc. Khuyến nghị kết hợp phân tích tài liệu và quét liên kết web." },
 upload: { en: "Internal File Upload", vi: "Tải Tệp Nội bộ" },
 upload_desc: { en: "Drag and drop your company profile or financial PDFs.", vi: "Kéo thả hồ sơ doanh nghiệp hoặc báo cáo tài chính PDF." },
 web: { en: "Web Links", vi: "Liên kết Trực tuyến" },
 web_desc: { en: "Provide URLs to your website or competitor social pages.", vi: "Cung cấp URL website hoặc kênh mạng xã hội đối thủ." },
 form: { en: "Fallback Questionnaire", vi: "Biểu mẫu Khảo sát" },
 form_desc: { en: "Manually input all strategic data via our wizard flow.", vi: "Nhập thủ công dữ liệu chiến lược qua trình hướng dẫn." },
 btn: { en: "Proceed to Analysis", vi: "Tiến hành Phân tích" },
 upload_zone: { en: "Drag and drop business documents here", vi: "Kéo và thả tài liệu doanh nghiệp vào đây" },
 upload_zone_desc: { en: "Supports PDF, DOCX, CSV up to 100MB per file.", vi: "Hỗ trợ PDF, DOCX, CSV. Dung lượng tối đa 100MB/tệp." },
 social: { en: "Social Media Channels", vi: "Kênh Mạng xã hội" },
 social_btn: { en: "Add Social Link", vi: "Thêm Mạng xã hội" },
 website: { en: "Website and Landing Pages", vi: "Website & Landing Page" },
 website_btn: { en: "Add Web Link", vi: "Thêm Liên kết Web" },
 },
 wizard: {
 back_hall: { en: "Back to Selection", vi: "Quay lại Sảnh" },
 next_step: { en: "Next Step", vi: "Bước tiếp theo" },
 prev_step: { en: "Previous Step", vi: "Trở về trước" },
 complete: { en: "Complete Ingestion", vi: "Hoàn tất Khảo sát" },
 
 // Step 1: Industry
 step1_title: { en: "Select Industry", vi: "Lĩnh vực Hoạt động" },
 step1_desc: { en: "Choose the primary industry your business operates in to calibrate the AI reasoning models.", vi: "Chọn lĩnh vực hoạt động cốt lõi của doanh nghiệp để hiệu chỉnh mô hình nhận thức AI." },
 ind_fb: { en: "Food & Beverage", vi: "F&B / Ẩm thực" },
 ind_tech: { en: "Technology & SaaS", vi: "Công nghệ & SaaS" },
 ind_edu: { en: "Education & EdTech", vi: "Giáo dục & EdTech" },
 ind_cosmetics: { en: "Cosmetics & Beauty", vi: "Mỹ phẩm & Làm đẹp" },
 ind_other: { en: "Other Industries", vi: "Lĩnh vực Khác" },

 // Step 2: Founder Persona
 step2_title: { en: "Founder Persona", vi: "Chân dung Founder" },
 step2_desc: { en: "Help us understand your leadership style and the personal vision driving your business.", vi: "Giúp hệ thống hiểu rõ phong cách quản trị và tầm nhìn cá nhân định hình doanh nghiệp của bạn." },
 step2_matrix: { en: "Management Archetype", vi: "Phong cách Quản trị" },
 step2_select: { en: "Select up to 2", vi: "Chọn tối đa 2" },
 step2_vision: { en: "Founder's Vision / Extra Info", vi: "Tầm nhìn / Lời nhắn nhủ thêm" },
 step2_vision_ph: { en: "Share your personal story, motivations, or any specific instructions here...", vi: "Chia sẻ câu chuyện khởi nghiệp, động lực cá nhân, hoặc bất kỳ lời nhắn nào bạn muốn..." },

 // Step 3: Business Profile
 step3_title: { en: "Business Profile", vi: "Hồ sơ Doanh nghiệp" },
 step3_desc: { en: "Detail your market challenges, revenue goals, and strategic resource distribution.", vi: "Cung cấp chi tiết về thách thức thị trường, mục tiêu doanh thu và phân bổ nguồn lực chiến lược." },
 step3_q1: { en: "Primary Market Threat", vi: "Mối đe dọa Thị trường" },
 step3_q2: { en: "Customer Pain Points", vi: "Điểm đau của Khách hàng" },
 step3_q2_desc: { en: "Select the major frustrations your target audience experiences.", vi: "Chọn những bức xúc lớn nhất mà tập khách hàng gặp phải với đối thủ trên thị trường." },
 step3_q3: { en: "Target Monthly Revenue", vi: "Mục tiêu Doanh thu Tháng" },
 step3_note: { en: "Additional Business Context", vi: "Thông tin Bổ sung " },
 step3_note_ph: { en: "Mention your unique selling points, specific competitors, or current campaigns...", vi: "Kể tên đối thủ cạnh tranh trực tiếp, USP của sản phẩm hoặc khó khăn hiện tại..." },
 step3_mode1: { en: "Survival Mode", vi: "Cầm cự Tồn tại" },
 step3_mode2: { en: "Steady Growth", vi: "Tăng trưởng Ổn định" },
 step3_mode3: { en: "Aggressive Expansion", vi: "Mở rộng Thần tốc" },

 // Step 4: Objectives
 step4_title: { en: "Determine Objectives", vi: "Xác định Mục tiêu" },
 step4_desc: { en: "Distribute your focus points across Brand Awareness, Sales, and Retention. You have 100 points total.", vi: "Phân bổ trọng số giữa Nhận diện Thương hiệu, Doanh số và Giữ chân Khách hàng. Bạn có tổng cộng 100 điểm." },
 step4_valid: { en: "Points", vi: "Điểm" },
 step4_brand: { en: "Brand Awareness", vi: "Nhận diện Thương hiệu" },
 step4_sales: { en: "Sales / Conversion", vi: "Doanh số / Chuyển đổi" },
 step4_crm: { en: "Customer Retention", vi: "Giữ chân Khách hàng" },
 step4_note: { en: "These 100 focus points will shape how the AI allocates your marketing budget and dictates the ultimate focus of your campaigns.", vi: "100 điểm trọng tâm này sẽ quyết định cách AI phân bổ ngân sách marketing và định hướng chiến lược cho các chiến dịch." },

 step_c1: { en: "Industry", vi: "Lĩnh vực" },
 step_c2: { en: "Founder", vi: "Founder" },
 step_c3: { en: "Business", vi: "Doanh nghiệp" },
 },
 dashboard: {
 loading1: { en: "CMO Agent is analyzing your market positioning...", vi: "Trợ lý CMO đang phân tích vị thế thị trường..." },
 loading2: { en: "Synthesizing competitive threats...", vi: "Tổng hợp biểu đồ đe dọa từ đối thủ..." },
 loading3: { en: "Calculating brand health vectors...", vi: "Tính toán vector Sức khỏe Thương hiệu..." },
 loading4: { en: "Finalizing Master Brand Profile...", vi: "Hoàn thiện Hồ sơ Thương hiệu Gốc..." },
 loading_title: { en: "Processing Data Source", vi: "Đang xử lý Nguồn dữ liệu" },
 title: { en: "Brand Health Dashboard", vi: "Tổng quan Sức khỏe Thương hiệu" },
 desc: { en: "Master Brand Profile successfully synthesized.", vi: "Hồ sơ Thương hiệu Gốc đã được tổng hợp thành công." },
 score: { en: "Score", vi: "Điểm" },
 summary: { en: "Executive Summary", vi: "Báo cáo Tóm lược" },
 summary_text: { en: "Your brand shows strong potential in the premium segment but faces high vulnerability from online discounters. Market positioning aligns well with modern consumer psychographics.", vi: "Thương hiệu của bạn thể hiện tiềm năng mạnh mẽ ở phân khúc cao cấp nhưng có rủi ro cao trước các đối thủ cạnh tranh về giá. Định vị thị trường bám sát với dữ liệu tâm lý học khách hàng hiện đại." },
 dna: { en: "Brand DNA", vi: "Nhận diện Cốt lõi" },
 radar: { en: "Threat & Opportunity Radar", vi: "Biểu đồ Nguy cơ & Cơ hội" },
 radar_1: { en: "Immediate Threats", vi: "Mối đe dọa Cấp bách" },
 radar_2: { en: "Untapped Opportunities", vi: "Cơ hội Chưa khai thác" },
 focus: { en: "The 90-Day Focus", vi: "Trọng tâm 90 Ngày" },
 focus_1: { en: "Steady Growth Revenue", vi: "Tăng trưởng Ổn định" },
 focus_2: { en: "Target Scaling", vi: "Mở rộng Tệp Khách" },
 btn: { en: "Initialize AI Marketing Team & Enter Workspace", vi: "Khởi động Nhóm Marketing AI & Đi tới Không gian làm việc" }
 },
 dashboard_home: {
 title: { en: "Platform Overview", vi: "Tổng quan Nền tảng" },
 desc: { en: "Welcome to the BrandFlow command center.", vi: "Chào mừng đến với trung tâm chỉ huy BrandFlow." },
 connecting: { en: "Analytics Engine Connecting...", vi: "Đang kết nối Module Phân tích..." },
 
 // Active Plans Card
 active_plans: { en: "Active Marketing Plans", vi: "Chiến dịch Đang chạy" },
 active_desc: { en: "Campaigns currently running and optimizing.", vi: "Các chiến dịch đang được triển khai & tối ưu." },
 plan_status1: { en: "Active", vi: "Đang chạy" },
 plan_status2: { en: "Scaling", vi: "Đang mở rộng" },

 // Brand Assets Card
 assets_title: { en: "Brand Identity", vi: "Tài sản Hình ảnh" },
 assets_desc: { en: "Core visual assets synchronized.", vi: "Đã đồng bộ trung tâm dữ liệu thị giác." },
 asset_c: { en: "Colors", vi: "Màu sắc" },
 asset_t: { en: "Typos", vi: "Phông chữ" },
 asset_l: { en: "Logos", vi: "Logo" },

 // Financial Risk Alert
 risk_warn: { en: "Warning", vi: "Cảnh báo" },
 risk_title: { en: "Financial Hallucination Risk", vi: "Rủi ro Sai lệch Tài chính" },
 risk_desc: { en: 'Agent "Tactical Budgeter" attempted to allocate $5,000 to an unverified channel. The Math Engine has blocked this transaction.', vi: 'Trợ lý "Lập ngân sách" vừa cố gắng phân bổ $5,000 vào một kênh chưa qua kiểm duyệt. Động cơ Toán học (Math Engine) đã chặn giao dịch này.' },
 risk_btn: { en: "Review Blocked Budget", vi: "Kiểm tra Ngân sách chặn" }
 },
 // === WORKSPACE FLOW ===
 flow: {
 engine: { en: "Campaign Engine", vi: "Trạm điều hành Chiến dịch" },
 stage: { en: "Stage", vi: "Giai đoạn" },
 },
 // === B2B PAGES ===
 b2b_tools: {
 save_draft: { en: "Save Draft", vi: "Lưu Bản nháp" },
 export_pdf: { en: "Export PDF", vi: "Xuất PDF" },
 },
 a1: {
 title: { en: "Mission & Definition", vi: "Sứ mệnh & Định nghĩa" },
 desc: { en: "Define the core mission statement, role, and overarching directions for the business.", vi: "Xác định tuyên ngôn sứ mệnh cốt lõi, vai trò và các định hướng bao trùm cho doanh nghiệp." },
 alert_title: { en: "Strategic Note:", vi: "Lưu ý Chiến lược:" },
 alert_desc: { en: "This document serves as the primary anchor. All subsequent campaigns and tactics must adhere to the Core Competencies defined here.", vi: "Tài liệu này đóng vai trò là mỏ neo chính. Tất cả các chiến dịch và chiến thuật tiếp theo phải bám sát vào Năng lực Lõi và Định hướng được xác định ở đây." },
 },
 a3: {
 title: { en: "Revenue Projection & Financial Metrics", vi: "Dự phóng Doanh thu & Chỉ số Tài chính" },
 desc: { en: "Calculate and visualize P&L expectations along with long-term gross margin growth.", vi: "Tính toán và trực quan hóa kỳ vọng P&L cùng với tăng trưởng biên lợi nhuận gộp trong dài hạn." },
 alert_title: { en: "Financial Goals:", vi: "Mục tiêu Tài chính:" },
 alert_desc: { en: "The charts below simulate the output of the core math engine. Projections are based on the baseline parameters from Year t0.", vi: "Các biểu đồ dưới đây mô phỏng đầu ra của toán cốt lõi. Số liệu dự phóng được tính toán dựa trên các tham số cơ sở của Năm t0." },
 },
 a5: {
 title: { en: "SWOT & Competitive Analysis", vi: "Phân tích SWOT & Năng lực cạnh tranh" },
 desc: { en: "Evaluate core competencies against top competitors to guide strategic weight allocation.", vi: "Đánh giá năng lực cốt lõi so với đối thủ cạnh tranh hàng đầu để định hướng phân bổ trọng số chiến lược." },
 alert_title: { en: "Instructions:", vi: "Hướng dẫn:" },
 alert_desc: { en: "Only input Key Success Factors (KSFs) that directly impact purchasing decisions. Total weight must always lock at 100%. Scores are strictly limited from 1 to 10.", vi: "Chỉ nhập các Yếu tố Thành công Cốt lõi (KSF) tác động trực tiếp đến quyết định mua hàng. Tổng trọng số phải luôn khóa ở mức 100%. Điểm số được giới hạn khắt khe từ 1 đến 10." },
 },
 a6: {
 title: { en: "Positioning & Focus Matrix", vi: "Ma trận Định vị & Trọng tâm" },
 desc: { en: "Evaluation of product/service categories based on Market Attractiveness and Competitive Strength.", vi: "Đánh giá các danh mục sản phẩm/dịch vụ dựa trên tiêu chí Sức hấp dẫn Thị trường và Năng lực Cạnh tranh." },
 strategy: { en: "Investment Strategy:", vi: "Chiến lược Đầu tư:" },
 strategy_desc: { en: "Products in the top-right require capital influx (Invest/Grow). Products in the bottom-left fall under conditional divestment (Harvest/Divest).", vi: "Sản phẩm ở góc trên cùng bên phải yêu cầu dòng vốn đầu tư (Invest/Grow). Sản phẩm ở khu vực dưới cùng bên trái nằm trong diện xem xét thoái vốn dự phòng (Harvest/Divest)." },
 revenue_title: { en: "A3. Revenue & Profit Projection", vi: "A3. Dự phóng Doanh thu & Lợi nhuận" },
 matrix_title: { en: "A6. Focus Matrix", vi: "A6. Ma trận Trọng tâm" },
 },
 b3: {
 title: { en: "Action Plan", vi: "Kế hoạch Hành động" },
 desc: { en: "Set clear tactical objectives, assign owners, and manage the overarching budget.", vi: "Thiết lập mục tiêu chiến thuật rõ ràng, chỉ định người phụ trách và quản lý ngân sách bao trùm." },
 alert_title: { en: "Execution Rules:", vi: "Quy tắc Thực thi:" },
 alert_desc: { en: "Each tactic must have a clear owner and a budget cap. This list is directly linked to the B7 Gantt schedule.", vi: "Mỗi chiến thuật phải có người chịu trách nhiệm rõ ràng và giới hạn ngân sách (budget cap). Danh sách này được liên kết trực tiếp với tiến độ B7 Gantt." },
 },
 b5: {
 title: { en: "Risk Contingency Plan", vi: "Kế hoạch Dự phòng rủi ro" },
 desc: { en: "Map out risk events, define trigger thresholds, and establish response actions.", vi: "Lập sơ đồ các sự kiện rủi ro, xác định ngưỡng kích hoạt và thiết lập hành động ứng phó." },
 alert_title: { en: "Risk Protocol:", vi: "Giao thức Rủi ro:" },
 alert_desc: { en: "Once a Trigger Point is breached during operations, its corresponding Contingency Action must be activated immediately without requiring approval.", vi: "Một khi Điểm Kích Hoạt (Trigger Point) bị vi phạm trong quá trình vận hành, Hành động Dự phòng tương ứng phải được kích hoạt ngay lập tức mà không cần chờ phê duyệt." },
 },
 b7: {
 title: { en: "Strategic Schedule (12-Month Gantt)", vi: "Bảng tiến độ chiến lược (12-Month Gantt)" },
 desc: { en: "Micro-execution schedule diagram illustrating all operational touchpoints throughout the fiscal year.", vi: "Biểu đồ tiến độ thực thi vi mô minh họa tất cả các điểm chạm vận hành trong suốt năm tài chính." },
 alert_title: { en: "Operational Check:", vi: "Kiểm tra Vận hành:" },
 alert_desc: { en: "Ensure all tactical touchpoints mapped below correspond directly to the approved budget in the Action Plan (B3).", vi: "Đảm bảo tất cả các điểm chạm chiến thuật được ánh xạ bên dưới có tương ứng trực tiếp với ngân sách đã được phê duyệt trong Bảng Kế hoạch Hành động (B3)." },
 },
 c1: {
 title: { en: "Group / HQ Direction", vi: "Định hướng Tập đoàn / HQ" },
 desc: { en: "Unify the mission and strategic directions across all satellite brands.", vi: "Hợp nhất sứ mệnh và các định hướng chiến lược trên toàn bộ các thương hiệu vệ tinh." },
 alert_title: { en: "HQ Level:", vi: "Cấp độ HQ:" },
 alert_desc: { en: "This function represents the strategy of the Parent Group. Satellite brand missions (A1) must inherit and synchronize with this core value.", vi: "Chức năng này đại diện cho chiến lược của công ty mẹ (Parent Group). Các sứ mệnh của thương hiệu con (A1) phải kế thừa và đồng bộ hóa với giá trị gốc này." },
 },
 c2: {
 title: { en: "HQ Synthesis Matrix", vi: "Ma trận Tổng hợp HQ" },
 desc: { en: "High-level dashboard summarizing portfolio and revenue metrics across the entire corporate ecosystem.", vi: "Dashboard cấp cao tổng hợp các chỉ số danh mục đầu tư và doanh thu trên toàn bộ hệ sinh thái của tập đoàn." },
 alert_title: { en: "HQ Visualizer:", vi: "HQ Visualizer:" },
 alert_desc: { en: "Scatter plots and Dashboards at this level summarize the most comprehensive aggregate metrics from the operational tiers below.", vi: "Các biểu đồ phân tán và Dashboard ở cấp độ này tóm tắt các chỉ số tổng hợp toàn diện nhất từ tầng vận hành bên dưới." },
 },
 // === WORKSPACE PHASE 2 ===
 workspace_phase2: {
 title: { en: "Strategic Debate Board", vi: "Ban Thảo luận Chiến lược" },
 desc: { en: "AI Agents are evaluating strategy based on the Master Profile. Dynamic constraints detect risk violations continuously.", vi: "Các AI Agent đang đưa ra phản biện chiến lược trực tuyến dựa trên Master Profile. Thẻ tự động quét vi phạm tài chính." },
 rejected: { en: "Rejected", vi: "Bác bỏ" },
 warning: { en: "Risk Warning", vi: "Cảnh báo rủi ro" },
 approved: { en: "Approved", vi: "Chấp thuận" },
 analyzing: { en: "Analyzing parameters...", vi: "Đang phân tích..." },
 locked_title: { en: "Strategic Blueprint Locked", vi: "Strategic Blueprint đã được Khóa" },
 locked_desc: { en: "All Agents have reached absolute consensus (100%). The 3-month strategy prioritizing LinkedIn Whitepapers and Organic SEO is firmly established and appended to Blockchain Logs.", vi: "Tất cả các Agents đã đồng thuận tuyệt đối (100%). Chiến lược 3 tháng tập trung vào LinkedIn Whitepapers và SEO tự nhiên đã được thiết lập chặt chẽ và lưu vào Blockchain Logs." },
 proceed: { en: "Proceed to Tactical Budgeting", vi: "Chuyển sang Lập Ngân sách (Tactics)" }
 },
 // === WORKSPACE PHASE 3 ===
 workspace_phase3: {
 title: { en: "Stage 3: Tactical Campaign & Exact Budgeting", vi: "Giai đoạn 3: Ngân sách & Chiến thuật" },
 desc: { en: "Generate Gantt scheduling and detailed budget distribution utilizing the Math Engine.", vi: "Lập trình Gantt và tính toán giải ngân chi tiết bằng Math Engine." },
 touchpoints: { en: "Tactical Touchpoints (1-3 Months)", vi: "Điểm chạm Chiến thuật (1-3 Tháng)" },
 task: { en: "Task", vi: "Nhiệm vụ" },
 m1: { en: "Month 1", vi: "Tháng 1" },
 m2: { en: "Month 2", vi: "Tháng 2" },
 m3: { en: "Month 3", vi: "Tháng 3" },
 alloc: { en: "Budget Allocation", vi: "Phân bổ Ngân sách" },
 total: { en: "Total:", vi: "Tổng:" },
 run_engine: { en: "Execute Number Crunching", vi: "Duyệt & Crunch Data Thực" },
 running: { en: "Running Math Engine...", vi: "Đang chạy mô phỏng Math Engine..." },
 recalculate: { en: "Recalculate", vi: "Tính toán lại" },
 approve_btn: { en: "Approve Budget & Enter Workspace", vi: "Duyệt Ngân Sách & Vào Workspace" }
 },
 // === SCREEN 1 PLACEHOLDERS ===
 screen1_ph: {
 social: { en: "Facebook, LinkedIn URLs...", vi: "Đường dẫn Facebook, LinkedIn..." },
 web: { en: "Primary domain or Campaign LP...", vi: "Domain chính hoặc chiến dịch LP..." },
 }
} as const;

// Typescript Magic for autocomplete
type Paths<T> = T extends object
 ? { [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}` }[keyof T]
 : never;

export type TranslationKey = Paths<typeof translations>;
