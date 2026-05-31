import React from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CheckCircle2, AlertTriangle, Target, Briefcase, Zap, TrendingUp, ShieldAlert } from 'lucide-react';
import { EducationTooltip } from '@/components/ui/EducationTooltip';

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

// Dữ liệu DEMO chuẩn chuyên gia được dán cứng để in luôn
const DEMO_EXPERT_DATA = {
  "goal_setting": {
    "mission_statement": "Kiến tạo Bếp Nhà Mộc thành 'Thánh địa Mindful Dining' tiên phong tại Sài Gòn – Nơi chữa lành tâm hồn thị dân thông qua nghệ thuật Ẩm thực Việt di sản, không gian kiến trúc mộc mạc nguyên bản và chuỗi cung ứng Farm-to-Table 100% hữu cơ.",
    "core_competencies": [
      {
        "competency": "Lợi thế Độc quyền (VRIO): Không gian kiến trúc nhà gỗ cổ truyền mang âm hưởng hoài niệm, tạo ra 'Therapeutic Environment' (Môi trường trị liệu tâm lý) không thể sao chép giữa lòng thành phố.",
        "is_vrio": true
      },
      {
        "competency": "Lợi thế Cạnh tranh: Hệ sinh thái nguyên liệu 100% Organic khép kín từ nông trại địa phương, đảm bảo tính nguyên bản và độ tươi ngon tuyệt đối cho thực đơn.",
        "is_vrio": false
      }
    ],
    "objectives": {
      "financial_goals": [
        "Vượt điểm hòa vốn (Break-even), tăng trưởng doanh thu từ 1.2 tỷ lên mốc 1.8 tỷ VNĐ/tháng (+50%) trong 90 ngày đầu tiên triển khai.",
        "Tối ưu hóa phễu khách hàng trung thành, đẩy tỷ lệ Retention Rate (Quay lại) từ 15% lên mức tiêu chuẩn vàng 35% thông qua hệ sinh thái Mini App."
      ],
      "marketing_goals": [
        "Thống lĩnh Share of Voice (SOV) ngách ẩm thực chữa lành, đạt 5 triệu lượt Organic Reach trên đa nền tảng (TikTok, Instagram).",
        "Định vị Top 5 điểm đến F&B 'Must-visit' về concept Aesthetic & Mindful Dining tại khu vực Quận 1/Quận 3."
      ],
      "cac_ltv_analysis": "Mục tiêu chiến lược: Khống chế Customer Acquisition Cost (CAC) < 40,000 VNĐ/khách. Thông qua Zalo Loyalty, dự kiến đẩy Life-Time Value (LTV) lên mức 2,500,000 VNĐ/khách/năm. Tỷ lệ LTV:CAC đạt ngưỡng 62:1, đảm bảo biên lợi nhuận ròng và dòng tiền siêu dương."
    },
    "red_lines": [
      "Nguyên tắc Vàng: Tuyệt đối không chạy đua 'Deep Discounting' (Giảm giá sâu) làm phá vỡ Định vị Thương hiệu (Brand Equity) cao cấp.",
      "Lằn ranh Dịch vụ: Không bao giờ nhồi nhét khách vượt quá công suất thiết kế (Tối đa 100 pax/buổi) để bảo vệ trọn vẹn trải nghiệm 'Chữa Lành'."
    ]
  },
  "situation_audit": {
    "target_segments": [
      {
        "segment_name": "Urban Healers (Gen Z) & Mindful Professionals (Gen Y)",
        "dmu_profiles": [
          {
            "role": "Decider (Người ra quyết định chốt địa điểm)",
            "pain_points": [
              "Chịu hội chứng Burnout (Cạn kiệt sức lực) từ văn hóa 'Toxic Productivity' chốn công sở, khao khát một chốn ẩn náu an tĩnh.",
              "Mất niềm tin vào thực phẩm đại trà, ám ảnh với 'Clean Eating' nhưng lại chán ngán với các thực đơn Healthy nhạt nhẽo."
            ],
            "decision_drivers": [
              "Không gian Aesthetic giàu tính kể chuyện (Storytelling), nhiều góc check-in đậm chất Cinematic hoài niệm.",
              "Trải nghiệm cá nhân hóa tinh tế, âm nhạc ASMR tần số thấp giúp xoa dịu hệ thần kinh."
            ]
          }
        ],
        "value_proposition": "Bếp Nhà Mộc không bán một bữa ăn vật lý. Chúng tôi trao cho khách hàng một 'Liệu pháp Chữa Lành' (Food Therapy) – một tấm vé quay về góc bếp tuổi thơ bình yên với mâm cơm nhà chuẩn vị, rũ bỏ hoàn toàn áp lực phố thị ngoài kia.",
        "data_sources": [
          "Báo cáo Insight F&B 2025: Sự bùng nổ của xu hướng Mindful Dining sau khủng hoảng kinh tế.",
          "Phân tích Dữ liệu CRM nội bộ Bếp Nhà Mộc (Q4/2024 - Q1/2025)."
        ]
      }
    ],
    "directional_policy": {
      "market_attractiveness": "Rất Cao (High) - Nhu cầu 'Chữa lành tâm lý' (Mental Healing) đang trở thành xu hướng chi tiêu không thể thiếu của tệp khách hàng trung và thượng lưu.",
      "business_strength": "Khá (Medium-High) - Concept mộc mạc sở hữu lõi văn hóa mạnh, nhưng điểm nghẽn nằm ở nút thắt vận hành và hệ thống CSKH số hóa.",
      "investment_decision": "Invest & Grow (Chiến lược Tấn công) - Bơm vốn mạnh tay vào Rebranding đa kênh và Chuyển đổi số toàn diện."
    }
  },
  "strategy": {
    "ansoff_matrix_choice": "Market Penetration (Thâm nhập thị trường sâu): Tận dụng lợi thế Tiên phong để đánh chiếm toàn bộ tệp khách hàng Gen Y/Z đang săn lùng không gian Mindful Dining tại lõi trung tâm thành phố.",
    "positioning_statement": "Bỏ lại sau lưng thị trường 'Quán ăn gia đình' truyền thống đang Đỏ lửa (Red Ocean), Bếp Nhà Mộc tự thiết lập một Đại dương Xanh (Blue Ocean): Là chốn về duy nhất trao đi trải nghiệm 'Ẩm thực Việt Chữa Lành' (POD) dành riêng cho thị dân mệt mỏi.",
    "expected_roi_justification": "Luận điểm đầu tư: Khoản ngân sách 350 triệu VNĐ không phải chi phí, mà là Đòn bẩy Tăng trưởng. Dự kiến mang về 600 triệu VNĐ doanh thu bù đắp ngay trong tháng 2 (ROI > 70%), đồng thời xây đắp tệp Data Khách hàng khổng lồ qua Zalo Loyalty làm tài sản sinh lời dài hạn."
  },
  "tactics": {
    "tactics_7ps": [
      {
        "p_name": "Product (Sản phẩm)",
        "action_bullet": "R&D và tung ra 'Thực Đơn Ký Ức' & Gói Business Lunch Combo đóng hộp bã mía Eco-friendly cao cấp.",
        "kpi": "Tăng 25% doanh thu khung giờ thấp điểm (11h-14h), tối ưu hóa công suất bếp.",
        "budget_vnd": 30000000,
        "budget_allocation_percent": 8.6,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Promotion (Truyền thông)",
        "action_bullet": "Bùng nổ truyền thông với Cinematic Brand Film 'Hương Vị Chữa Lành' & Chiến dịch KOLs/Micro-Influencers đa nền tảng.",
        "kpi": "Tạo ra 3M+ lượt xem tự nhiên, 50+ UGC chất lượng cao, mang về 2000+ Bookings mới.",
        "budget_vnd": 150000000,
        "budget_allocation_percent": 42.8,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Place (Phân phối)",
        "action_bullet": "Bơm ngân sách Performance Ads (Facebook/Tiktok Ads) tập trung chuyển đổi trực tiếp về Zalo Mini App Booking.",
        "kpi": "Tối ưu CAC < 40k VNĐ. Mang về doanh thu trực tiếp 600 triệu VNĐ.",
        "budget_vnd": 90000000,
        "budget_allocation_percent": 25.7,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Physical Evidence (Giao diện Không gian)",
        "action_bullet": "Nâng cấp toàn diện Nhận diện Thị giác (Menu gỗ, Bao bì Kraft nguyên bản, Đồng phục Linen, Art Concept Fanpage).",
        "kpi": "Thăng hạng Perceived Value (Giá trị cảm nhận), tạo cơ sở thiết lập Premium Pricing (+15% giá menu).",
        "budget_vnd": 45000000,
        "budget_allocation_percent": 12.9,
        "moscow_tag": "SHOULD_HAVE"
      },
      {
        "p_name": "Process (Quy trình Vận hành)",
        "action_bullet": "Phát triển Zalo Mini App Loyalty - Số hóa trải nghiệm khách hàng (Tích điểm 'Hạt Gạo', Automation Marketing, Khảo sát tự động).",
        "kpi": "Bứt phá Tỷ lệ Retention Rate từ 15% lên 35%, giảm phụ thuộc vào Ads.",
        "budget_vnd": 35000000,
        "budget_allocation_percent": 10.0,
        "moscow_tag": "COULD_HAVE"
      }
    ],
    "total_budget_used": 350000000,
    "task_ready_checklist": [
      "Duyệt kịch bản phân cảnh (Storyboard) và chốt Casting diễn viên cho Cinematic Brand Film.",
      "Ký NDA và hợp đồng với 30 Micro-Influencer thuộc hệ sinh thái Lifestyle/Food Reviewer.",
      "Chốt thiết kế UI/UX luồng Booking và nghiệm thu mã nguồn Zalo Mini App Loyalty.",
      "Ký duyệt bản in Test (Proofing) bộ bao bì bã mía thân thiện môi trường."
    ]
  },
  "cfo_risk": {
    "cfo_comment": "Từ góc độ Quản trị Tài chính (CFO), khoản đầu tư 350 triệu là một nước cờ táo bạo nhưng có kiểm soát. Việc tôi kiên quyết ép giảm chi phí Brand Film từ 80 triệu xuống 50 triệu và tái phân bổ 30 triệu sang phễu Performance Ads là để chốt chặn rủi ro Sunk-cost (Chi phí chìm). Kế hoạch này đạt độ an toàn dòng tiền cao, nhưng yêu cầu Giám đốc Vận hành (COO) phải giám sát chặt chẽ năng lực chịu tải của nhà bếp.",
    "risk_assessment": [
      {
        "risk_scenario": "Rủi ro Truyền thông: Brand Film rơi vào 'vùng chết' thuật toán, không tạo ra chuyển đổi Booking như kỳ vọng.",
        "trigger_point_metric": "Tín hiệu cảnh báo: Số lượng Booking qua Zalo < 50 lượt sau 72 giờ lên sóng video Hero.",
        "contingency_plan_b": "Kế hoạch Ứng phó (Plan B): Dừng lập tức ngân sách Boost Video. Xoay trục (Pivot) dồn toàn lực sang Performance Ads chạy thẳng offer 'Tặng Chè Khúc Bạch Mộc' để kéo dòng tiền nóng."
      },
      {
        "risk_scenario": "Rủi ro Vận hành: Hiện tượng 'Vỡ trận' do bùng nổ traffic vào các ngày cao điểm (Cuối tuần), gây sụp đổ trải nghiệm khách hàng.",
        "trigger_point_metric": "Tín hiệu cảnh báo: Tỷ lệ khiếu nại dịch vụ (Service Complaint Rate) vượt mốc 5% tổng số bàn/ngày.",
        "contingency_plan_b": "Kế hoạch Ứng phó (Plan B): Kích hoạt ngay chiến thuật Scarcity Marketing (Marketing Khan hiếm). Đóng cổng Walk-in, cấu hình Zalo Booking chỉ nhận tối đa 100 khách/buổi để bảo vệ tuyệt đối định vị 'Không gian Chữa Lành'."
      }
    ]
  }
};

export default function ExecutiveReport() {
  const { wizardAnswers, tacticsPlan } = useFormStore();
  const { t } = useLanguage();

  // Dùng Demo Data nếu tacticsPlan trống (chưa chạy backend)
  const planData = (tacticsPlan && Object.keys(tacticsPlan).length > 0) ? tacticsPlan : DEMO_EXPERT_DATA;
  
  const goal = planData.goal_setting || DEMO_EXPERT_DATA.goal_setting;
  const audit = planData.situation_audit || DEMO_EXPERT_DATA.situation_audit;
  const strategy = planData.strategy || DEMO_EXPERT_DATA.strategy;
  const tactics = planData.tactics || DEMO_EXPERT_DATA.tactics;
  const cfo = planData.cfo_risk || DEMO_EXPERT_DATA.cfo_risk;

  const dynamicTasks = React.useMemo(() => {
    if (!tactics || !tactics.tactics_7ps) return [];
    return tactics.tactics_7ps.map((act: any) => ({
      name: `[${act.p_name}] ${act.action_bullet}`,
      cost: act.budget_vnd,
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
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000')" }}></div>
          <div className="absolute inset-0 bg-slate-900/60"></div>
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
              <div className="font-bold text-slate-800 text-lg">{wizardAnswers.industry || 'B2B Enterprise SaaS'}</div>
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

          {/* Objectives & Red lines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
              <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase flex items-center"><TrendingUp className="w-4 h-4 mr-1 text-blue-600"/> Mục tiêu tài chính</h3>
              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.objectives.financial_goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
              {goal.objectives.cac_ltv_analysis && (
                <div className="text-xs bg-blue-100 text-blue-900 p-2 rounded mt-2 border border-blue-200">
                  <span className="font-bold uppercase mb-1 text-[10px] tracking-wider flex items-center">
                    CAC/LTV Analysis
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
            </div>
            <div className="border border-rose-200 rounded-lg p-4 bg-rose-50/50">
              <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase flex items-center"><ShieldAlert className="w-4 h-4 mr-1 text-rose-600"/> Lằn ranh đỏ (Red Lines)</h3>
              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.red_lines.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          </div>

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
            
            <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-sm font-bold text-slate-500 uppercase">Tổng ngân sách duyệt</span>
              <span className="text-2xl font-black text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tactics.total_budget_used)}</span>
            </div>

            <div className="w-full overflow-x-auto"><table className="w-full min-w-[500px] text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-800 uppercase text-xs bg-slate-50">
                  <th className="py-2 px-2 font-black">Chữ P</th>
                  <th className="py-2 px-2 font-black">Hành động cốt lõi</th>
                  <th className="py-2 px-2 font-black">KPI Cam kết</th>
                  <th className="py-2 px-2 font-black text-right">Phân bổ (%)</th>
                  <th className="py-2 px-2 font-black text-right">Ngân sách</th>
                </tr>
              </thead>
              <tbody>
                {tactics.tactics_7ps.map((task: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="py-3 px-2 font-bold text-blue-600 whitespace-nowrap">{task.p_name}</td>
                    <td className="py-3 px-2 font-medium text-slate-800">{task.action_bullet}</td>
                    <td className="py-3 px-2 text-slate-600 italic text-xs">{task.kpi}</td>
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

    </div>
  );
}
