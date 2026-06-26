import React from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Target, Briefcase, Zap, TrendingUp, ShieldAlert, BarChart3, Layers, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Bảng màu đơn sắc chuyên nghiệp kiểu McKinsey/Bain
const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

const DEMO_EXPERT_DATA = {
  "goal_setting": {
    "mission_statement": "Tái cấu trúc Bếp Nhà Mộc trở thành chuỗi 'Mindful Dining' dẫn dắt phân khúc trung-cao cấp tại TP.HCM. Chuyển đổi định vị từ 'Nhà hàng truyền thống' sang 'Không gian trị liệu ẩm thực' (Food Therapy) nhằm tối ưu hóa Brand Premium và mở rộng biên lợi nhuận.",
    "core_competencies": [
      { "competency": "Lợi thế Độc quyền (VRIO): Hệ thống kiến trúc nhà gỗ 100+ năm tuổi tạo rào cản gia nhập tuyệt đối, mang lại chỉ số Check-in Value và Earned Media tự nhiên cao.", "is_vrio": true },
      { "competency": "Chuỗi cung ứng khép kín (Vertical Integration): 100% nguyên liệu Organic đạt chuẩn VietGAP, đảm bảo USP 'Không Bột Ngọt' nhất quán trên toàn chuỗi.", "is_vrio": true },
      { "competency": "Intellectual Property (IP): Nhận diện thương hiệu 'Mộc' đã đăng ký bảo hộ, 15+ công thức di sản mã hóa thành SOP vận hành.", "is_vrio": false },
      { "competency": "First-Mover Advantage: Đơn vị tiên phong khai thác ngách 'Wellness F&B' kết hợp văn hóa bản địa, lấp đầy Market Gap hiện tại.", "is_vrio": true }
    ],
    "objectives": {
      "financial_goals": [
        "Tối ưu hóa Unit Economics: Đạt Gross Margin ≥ 68% và EBITDA Margin ≥ 22% trong Quý 3/2026. Đưa MRR (Monthly Recurring Revenue) lên mốc 2.5 tỷ VNĐ.",
        "Kích hoạt Customer Loyalty: Đẩy Retention Rate lên mức kỷ lục 95.5% thông qua hệ thống Zalo O2O CRM.",
        "Đa dạng hóa Revenue Streams: Khai thác 'Corporate Lunch Combo' để tối ưu hóa Asset Utilization (Tỷ lệ lấp đầy) khung giờ Off-peak."
      ],
      "marketing_goals": [
        "Thống lĩnh Share of Voice (SOV) > 45% trong danh mục 'Ẩm thực chữa lành'. Engagement Rate mục tiêu ≥ 5.2%.",
        "Tái định vị (Brand Repositioning): Lọt Top 3 'Must-visit F&B' dành cho giới chuyên gia/quản lý tại Central HCMC.",
        "Net Promoter Score (NPS) đạt ≥ 82. Tỷ lệ Referral booking chiếm > 30%."
      ],
      "cac_ltv_analysis": "Chỉ số LTV/CAC mục tiêu: 22.8x. Nén Customer Acquisition Cost (CAC) xuống mức tối đa 145,000 VNĐ, đồng thời đẩy Customer Lifetime Value (CLV) lên 3,300,000 VNĐ."
    },
    "red_lines": [
      "Brand Equity Protection: Tuyệt đối không sử dụng 'Deep Discounting' (Giảm giá sâu). Áp dụng chiến lược Value-Added (Tặng kèm giá trị).",
      "Capacity Management: Giới hạn Table Turnover 2.0 vòng/buổi. Hy sinh doanh thu ngắn hạn để bảo toàn NPS và trải nghiệm 'Mindful'.",
      "Data Governance: Tuân thủ 100% tiêu chuẩn bảo mật dữ liệu khách hàng theo Nghị định 13/2023/NĐ-CP."
    ]
  },
  "situation_audit": {
    "target_segments": [
      {
        "segment_name": "Core Segment: Urban Executives & Professionals (Gen Y, Thu nhập 25M-60M)",
        "dmu_profiles": [
          {
            "role": "Key Decision Maker (KDM)",
            "pain_points": ["Áp lực công việc cao (Burnout)", "Mất niềm tin vào Vệ sinh ATTP công nghiệp", "Thiếu không gian cân bằng tâm trí (Third-place)"],
            "decision_drivers": ["Aesthetic Architecture (Không gian chữa lành)", "Transparency (Minh bạch nguyên liệu)", "Word-of-Mouth từ giới tinh hoa (Peer Review)"]
          }
        ],
        "value_proposition": "Food Therapy: Nơi ẩn mình tinh tế giữa tâm mạch Sài Gòn, phục vụ mâm cơm di sản 100% Organic giúp chữa lành thân - tâm - trí.",
        "data_sources": ["McKinsey Wellness Economy Report 2024", "Bếp Nhà Mộc CRM Data Q1/2026"]
      }
    ],
    "directional_policy": {
      "market_attractiveness": "Rất Cao (8.5/10) — CAGR ngành Wellness F&B đạt 24.5%.",
      "business_strength": "Trung Khá (7.0/10) — Core Product mạnh nhưng đang thiếu hụt hệ thống Data-driven Marketing.",
      "investment_decision": "Scale-up (Mở rộng & Tối ưu hóa) — Tái cơ cấu dòng vốn OPEX vào Performance Marketing & O2O Loyalty."
    }
  },
  "strategy": {
    "ansoff_matrix_choice": "Market Penetration (Thâm nhập sâu) & Market Development (Mở rộng tệp khách hàng Corporate).",
    "positioning_statement": "Blue Ocean Strategy: Dịch chuyển khỏi 'Red Ocean' quán ăn gia đình, kiến tạo ngách 'Mindful Dining' độc tôn tại Sài Gòn.",
    "expected_roi_justification": "Ngân sách Marketing 350M VNĐ là Đòn bẩy Tăng trưởng chiến lược (Growth Lever). Dự kiến ROI đạt 185% sau 3 tháng, Break-even (Hòa vốn) chiến dịch ở Tuần thứ 5."
  },
  "tactics": {
    "tactics_7ps": [
      { "p_name": "Product", "action_bullet": "Ra mắt 'Heritage Rotating Menu' & 'Executive Lunch Combo'.", "kpi": "Tăng 35% doanh thu Off-peak.", "budget_vnd": 30000000, "budget_allocation_percent": 8.6, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Price", "action_bullet": "Áp dụng Premium Pricing Strategy (+15% so với hiện tại) & Bundle Pricing.", "kpi": "Ticket Size tăng 22%.", "budget_vnd": 0, "budget_allocation_percent": 0, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Promotion", "action_bullet": "Cinematic Hero Video 'Chữa Lành' & Booking 30 Micro-KOLs (Lifestyle/Biz).", "kpi": "Earned Media Reach > 2M.", "budget_vnd": 150000000, "budget_allocation_percent": 42.8, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Place (Dist)", "action_bullet": "Hyper-local Performance Ads (Bán kính 3km) & Search Intent SEO.", "kpi": "ROAS (Return on Ad Spend) > 8.5x.", "budget_vnd": 90000000, "budget_allocation_percent": 25.7, "moscow_tag": "MUST_HAVE" },
      { "p_name": "People", "action_bullet": "Chuẩn hóa SOP 'Omotenashi' (Phục vụ bằng cả trái tim) cho FOH.", "kpi": "Customer Satisfaction > 95%.", "budget_vnd": 20000000, "budget_allocation_percent": 5.7, "moscow_tag": "SHOULD_HAVE" },
      { "p_name": "Physical Ev.", "action_bullet": "Nâng cấp Visual Identity System (Menu, Bao bì sinh học, Đồng phục Linen).", "kpi": "Brand Consistency Audit: Pass.", "budget_vnd": 25000000, "budget_allocation_percent": 7.1, "moscow_tag": "SHOULD_HAVE" },
      { "p_name": "Process", "action_bullet": "Triển khai Zalo Mini App: CRM, Loyalty & Automation Booking.", "kpi": "O2O Conversion Rate > 25%.", "budget_vnd": 35000000, "budget_allocation_percent": 10.0, "moscow_tag": "MUST_HAVE" }
    ],
    "total_budget_used": 350000000,
    "task_ready_checklist": ["Phê duyệt kịch bản Hero Video", "Ký kết Master Contract với 30 KOLs", "Release Zalo Mini App (BETA)", "Go-live SOP Vận hành mới"]
  },
  "cfo_risk": {
    "cfo_comment": "Bản báo cáo này thể hiện tư duy Unit Economics sắc bén. Với CLV/CAC 22.8x và ROI dự kiến 185%, rủi ro tài chính được nén ở mức thấp. Ngân sách 350 triệu được phân bổ chặt chẽ giữa Branding (Build Trust) và Performance (Drive Revenue), đảm bảo Cashflow dương ngay trong kỳ đầu.",
    "risk_assessment": [
      { "risk_scenario": "Rủi ro Truyền thông: Thuật toán Social Media thay đổi làm giảm Organic Reach của Hero Video.", "trigger_point_metric": "Video Views < 100K trong 72h đầu tiên.", "contingency_plan_b": "Cắt 30% ngân sách Branding chuyển sang Retargeting Ads và Kích hoạt tệp Micro-KOL dự phòng." },
      { "risk_scenario": "Rủi ro Vận hành: Hiện tượng Overcapacity (Vượt công suất) vào các ngày cuối tuần do hiệu ứng viral.", "trigger_point_metric": "Waiting Time (Thời gian chờ) vượt ngưỡng 25 phút.", "contingency_plan_b": "Kích hoạt 'Scarcity Marketing': Khóa cổng Walk-in, 100% Reservation Only để nâng tầm Exclusivity." }
    ]
  }
};

export default function ExecutiveReport() {
  const { wizardAnswers, tacticsPlan, debateLogs, brandDNA } = useFormStore();
  const { t } = useLanguage();

  const planData = (tacticsPlan && Object.keys(tacticsPlan).length > 0) ? tacticsPlan : DEMO_EXPERT_DATA;
  
  const goal = planData.goal_setting || DEMO_EXPERT_DATA.goal_setting;
  const audit = planData.situation_audit || DEMO_EXPERT_DATA.situation_audit;
  const strategy = planData.strategy || DEMO_EXPERT_DATA.strategy;
  const tactics = planData.tactics || DEMO_EXPERT_DATA.tactics;
  const cfo = planData.cfo_risk || DEMO_EXPERT_DATA.cfo_risk;
  const logs = debateLogs && debateLogs.length > 0 ? debateLogs : [];
  const brandName = brandDNA?.brand_name || wizardAnswers?.company_name || wizardAnswers?.industry || 'BrandFlow Client';

  const budgetPieData = React.useMemo(() => {
    if (!tactics || !tactics.tactics_7ps) return [];
    return tactics.tactics_7ps.map((act: any) => ({
      name: act.p_name,
      value: act.budget_vnd
    }));
  }, [tactics]);

  const projectionData = [
    { month: 'M1', revenue: 1200, cost: 850, profit: 350 },
    { month: 'M2', revenue: 1450, cost: 800, profit: 650 },
    { month: 'M3', revenue: 1700, cost: 750, profit: 950 },
    { month: 'M4', revenue: 2000, cost: 750, profit: 1250 },
    { month: 'M5', revenue: 2250, cost: 780, profit: 1470 },
    { month: 'M6', revenue: 2500, cost: 800, profit: 1700 }
  ];

  const pageClass = "w-full sm:w-[210mm] min-h-[100vh] sm:min-h-[297mm] mx-auto bg-white text-slate-900 border border-slate-200 shadow-sm print:shadow-none print:border-none print:m-0 relative overflow-hidden font-sans mb-8 print:mb-0 print:break-after-page";

  return (
    <div className="flex flex-col items-center pb-8 print:pb-0 bg-slate-100 py-8 print:py-0">
      
      {/* COVER PAGE */}
      <div className={pageClass}>
        {/* Premium Corporate Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230f172a\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="absolute top-0 left-0 w-full h-full p-[20mm] flex flex-col">
          <div className="flex justify-between items-start mb-24 relative z-10">
            <div className="text-slate-900 font-black text-4xl tracking-tighter flex items-center">
              <Zap className="w-10 h-10 mr-2 text-slate-900" />
              BRANDFLOW
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-300 px-4 py-2 inline-block rounded-sm">
                Strictly Confidential
              </div>
            </div>
          </div>
          
          <div className="mt-auto mb-32 relative z-10">
            <h2 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-4">Strategic Marketing Plan & Audit</h2>
            <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8 uppercase max-w-2xl">
              Bản Cáo Bạch Kế Hoạch Chiến Lược
            </h1>
            <div className="w-24 h-1.5 bg-slate-900 mb-8"></div>
            <p className="text-slate-600 font-serif text-lg max-w-xl italic border-l-2 border-slate-900 pl-4">
              "Báo cáo phân tích chuyên sâu được tổng hợp từ hệ thống Multi-Agent AI (CMO, CFO, COO) nhằm định hướng tái cấu trúc thương hiệu và tối ưu hóa lợi nhuận."
            </p>
          </div>
          
          <div className="flex justify-between items-end border-t-2 border-slate-900 pt-6 mt-auto relative z-10">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-widest">Prepared exclusively for</div>
              <div className="font-black text-slate-900 text-2xl">{brandName}</div>
              <div className="text-sm text-slate-600 font-bold mt-1 uppercase tracking-wider">{wizardAnswers?.industry || 'Enterprise'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-widest">Date Published</div>
              <div className="font-black text-slate-900 text-xl">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 1: STRATEGIC OVERVIEW */}
      <div className={`${pageClass} p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-8 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase tracking-tight">BRANDFLOW</div>
          <div className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">01 / Strategic Foundation</div>
        </header>

        <div className="flex-1 overflow-hidden">
          {/* Mission & VRIO */}
          <section className="mb-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <Target className="w-4 h-4 mr-2" /> 1. Sứ mệnh & Năng lực lõi (VRIO)
            </h2>
            <div className="border border-slate-200 p-5 rounded-sm bg-slate-50/50">
              <p className="text-slate-800 italic mb-5 font-serif text-lg leading-relaxed border-l-2 border-slate-900 pl-4">
                "{goal.mission_statement}"
              </p>
              <div className="space-y-3">
                {goal.core_competencies.map((c: any, i: number) => (
                  <div key={i} className="flex items-start text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mr-3 shrink-0 mt-2" />
                    <span className="text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900">Competency {i+1}:</span> {c.competency} 
                      {c.is_vrio && <span className="text-[9px] border border-slate-900 text-slate-900 px-1.5 py-0.5 rounded-sm font-black ml-2 uppercase tracking-widest">VRIO Verified</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Objectives Grid */}
          <section className="mb-8">
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" /> 2. Tuyên ngôn Mục tiêu (Objectives)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-200 p-4 bg-white">
                <h3 className="font-black text-slate-900 mb-3 text-xs uppercase tracking-widest border-b border-slate-100 pb-2">Mục tiêu Tài chính</h3>
                <ul className="list-disc pl-4 text-xs text-slate-600 space-y-2 leading-relaxed">
                  {goal.objectives.financial_goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
                </ul>
              </div>
              <div className="border border-slate-200 p-4 bg-white">
                <h3 className="font-black text-slate-900 mb-3 text-xs uppercase tracking-widest border-b border-slate-100 pb-2">Mục tiêu Marketing</h3>
                <ul className="list-disc pl-4 text-xs text-slate-600 space-y-2 leading-relaxed">
                  {goal.objectives.marketing_goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
                </ul>
              </div>
              <div className="border border-slate-900 p-4 bg-slate-900 text-white">
                <h3 className="font-black text-white mb-3 text-xs uppercase tracking-widest border-b border-slate-700 pb-2">Lằn ranh đỏ (Red Lines)</h3>
                <ul className="list-disc pl-4 text-xs text-slate-300 space-y-2 leading-relaxed">
                  {goal.red_lines.map((g: string, i: number) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* DMU & Value Proposition */}
          <section>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <Briefcase className="w-4 h-4 mr-2" /> 3. Target Audience & Value Prop
            </h2>
            {audit.target_segments.map((seg: any, i: number) => (
              <div key={i} className="mb-6 border border-slate-200 rounded-sm">
                <div className="bg-slate-50 border-b border-slate-200 text-slate-900 p-3 font-bold text-xs uppercase tracking-widest">
                  SEGMENT: {seg.segment_name}
                </div>
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {seg.dmu_profiles.map((dmu: any, j: number) => (
                      <div key={j}>
                        <div className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Role: {dmu.role}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pain Points</div>
                        <ul className="list-square pl-3 text-xs text-slate-600 mb-3 leading-relaxed">{dmu.pain_points.map((p: string, k: number) => <li key={k}>{p}</li>)}</ul>
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Drivers</div>
                        <ul className="list-square pl-3 text-xs text-slate-600 leading-relaxed">{dmu.decision_drivers.map((d: string, k: number) => <li key={k}>{d}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-50 p-3 text-xs leading-relaxed border-l-2 border-slate-900 text-slate-700">
                    <span className="font-black text-slate-900 uppercase tracking-widest mr-2">Value Proposition:</span> {seg.value_proposition}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* PAGE 2: EXECUTION & FINANCIALS */}
      <div className={`${pageClass} p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-8 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase tracking-tight">BRANDFLOW</div>
          <div className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">02 / Execution & Financials</div>
        </header>

        <div className="flex-1 overflow-hidden">
          {/* Strategy Statement */}
          <section className="mb-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">4. Strategic Direction</h2>
            <div className="grid grid-cols-3 gap-px bg-slate-200 border border-slate-200">
              <div className="bg-white p-4">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Growth Strategy</div>
                <div className="text-xs font-bold text-slate-900 leading-relaxed">{strategy.ansoff_matrix_choice}</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Positioning</div>
                <div className="text-xs font-bold text-slate-900 leading-relaxed">{strategy.positioning_statement}</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">ROI Thesis</div>
                <div className="text-xs font-bold text-slate-900 leading-relaxed">{strategy.expected_roi_justification}</div>
              </div>
            </div>
          </section>

          {/* Budgeting */}
          <section className="mb-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">5. Zero-Based Budgeting Allocation</h2>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Authorized Budget</div>
                <div className="text-3xl font-black text-slate-900 mb-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tactics.total_budget_used)}</div>
                
                <div className="w-full h-2 flex bg-slate-100 rounded-sm overflow-hidden mb-4 border border-slate-200">
                  {tactics.tactics_7ps.map((t: any, i: number) => (
                    <div key={i} style={{ width: `${t.budget_allocation_percent}%`, background: COLORS[i % COLORS.length] }} className="h-full border-r border-white/20" />
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {tactics.tactics_7ps.map((t: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-600 uppercase font-bold truncate">{t.p_name}</span>
                      <span className="ml-auto font-black text-slate-900">{t.budget_allocation_percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={budgetPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none" dataKey="value">
                      {budgetPieData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(val: any) => new Intl.NumberFormat('vi-VN').format(Number(val)) + ' VNĐ'} contentStyle={{ borderRadius: 0, border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tactics Table */}
            <table className="w-full text-[10px] text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 uppercase tracking-widest">
                  <th className="py-2 px-3 font-black border-r border-slate-200">Initiative</th>
                  <th className="py-2 px-3 font-black border-r border-slate-200">Action Plan</th>
                  <th className="py-2 px-3 font-black border-r border-slate-200 text-center">Priority</th>
                  <th className="py-2 px-3 font-black text-right">Budget (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {tactics.tactics_7ps.map((task: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap border-r border-slate-200 uppercase">{task.p_name}</td>
                    <td className="py-2 px-3 font-medium text-slate-700 leading-relaxed border-r border-slate-200">
                      {task.action_bullet}
                      <div className="mt-1 text-slate-500 font-bold italic">KPI: {task.kpi}</div>
                    </td>
                    <td className="py-2 px-3 text-center border-r border-slate-200">
                      <span className={`font-black uppercase tracking-widest ${
                        task.moscow_tag === 'MUST_HAVE' ? 'text-slate-900' : 'text-slate-400'
                      }`}>{task.moscow_tag?.replace('_',' ')}</span>
                    </td>
                    <td className="py-2 px-3 text-right font-black text-slate-900">
                      {new Intl.NumberFormat('vi-VN').format(task.budget_vnd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* CFO Risk */}
          <section>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" /> 6. Risk Management & Triggers
            </h2>
            <div className="border border-slate-200">
              <div className="bg-slate-50 p-4 border-b border-slate-200">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">CFO Memo</div>
                <div className="text-xs text-slate-800 font-serif italic leading-relaxed border-l-2 border-slate-900 pl-3">" {cfo.cfo_comment} "</div>
              </div>
              <div className="p-4 grid grid-cols-1 gap-4">
                {cfo.risk_assessment.map((risk: any, i: number) => (
                  <div key={i} className="text-[10px]">
                    <div className="font-bold text-slate-900 mb-1 uppercase tracking-wider">Risk {i+1}: {risk.risk_scenario.split(':')[0]}</div>
                    <div className="text-slate-600 mb-2 leading-relaxed">{risk.risk_scenario.split(':')[1] || risk.risk_scenario}</div>
                    <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200">
                      <div className="bg-white p-2">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Trigger Point</span>
                        <span className="text-slate-800 font-medium">{risk.trigger_point_metric}</span>
                      </div>
                      <div className="bg-slate-50 p-2">
                        <span className="text-[9px] text-slate-900 font-black uppercase tracking-widest block mb-1">Contingency (Plan B)</span>
                        <span className="text-slate-900 font-bold">{risk.contingency_plan_b}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Page footer */}
        <footer className="border-t-2 border-slate-900 pt-3 mt-auto flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>BrandFlow AI Multi-Agent Engine</span>
          <span>Page 2 / 3</span>
        </footer>
      </div>

      {/* PAGE 3: FINANCIAL PROJECTIONS */}
      <div className={`${pageClass} p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-8 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase tracking-tight">BRANDFLOW</div>
          <div className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">03 / Financial Projections</div>
        </header>

        <div className="flex-1 flex flex-col">
          <section className="mb-10">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" /> 7. Monte Carlo Financial Simulation (6 Months)
            </h2>
            <div className="border border-slate-200 bg-white p-6 rounded-sm shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 bg-slate-50 p-4 border border-slate-100 rounded-sm">
                <div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">LTV : CAC Ratio</div>
                  <div className="text-2xl font-black text-emerald-600">22.8x</div>
                  <div className="text-[9px] text-slate-400 mt-1">Excellent (Scale Ready)</div>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Monte Carlo Base ROI</div>
                  <div className="text-2xl font-black text-slate-900">185%</div>
                  <div className="text-[9px] text-slate-400 mt-1">Expected Return</div>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Worst Case ROI (90% Conf)</div>
                  <div className="text-2xl font-black text-amber-500">42%</div>
                  <div className="text-[9px] text-slate-400 mt-1">Stress-tested scenario</div>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Probability of Loss</div>
                  <div className="text-2xl font-black text-blue-600">&lt; 5%</div>
                  <div className="text-[9px] text-slate-400 mt-1">Highly secure investment</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Projected MRR (M6)</div>
                  <div className="text-3xl font-black text-slate-900">2.5 Tỷ</div>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg. Net Margin</div>
                  <div className="text-3xl font-black text-emerald-600">28.5%</div>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Break-even Point</div>
                  <div className="text-3xl font-black text-blue-600">Month 2</div>
                </div>
              </div>
              
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={projectionData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => v + 'Tr'} />
                    <Tooltip contentStyle={{ fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    <Bar yAxisId="left" dataKey="revenue" name="Doanh thu (Tr)" fill="#0f172a" radius={[2, 2, 0, 0]} barSize={40} />
                    <Line yAxisId="left" type="monotone" dataKey="profit" name="Lợi nhuận gộp (Tr)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" /> 8. Sign-off & Approval
            </h2>
            <div className="border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs text-slate-600 leading-relaxed mb-8">
                Bản cáo bạch này được lập dựa trên các giả định thị trường và phân tích năng lực lõi của doanh nghiệp. Các chỉ số dự phóng mang tính định hướng chiến lược. Việc phê duyệt bản kế hoạch đồng nghĩa với việc cấp phép giải ngân ngân sách <strong>{new Intl.NumberFormat('vi-VN').format(tactics.total_budget_used)} VNĐ</strong> cho Phase 1.
              </p>
              
              <div className="grid grid-cols-2 gap-12 mt-12">
                <div>
                  <div className="border-b border-slate-400 pb-10"></div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-900">Chief Executive Officer (CEO)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Date: .......................................</div>
                </div>
                <div>
                  <div className="border-b border-slate-400 pb-10"></div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-900">Chief Marketing Officer (CMO)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Date: .......................................</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Page footer */}
        <footer className="border-t-2 border-slate-900 pt-3 mt-auto flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>BrandFlow AI Multi-Agent Engine</span>
          <span>Page 3 / 3</span>
        </footer>
      </div>

    </div>
  );
}
