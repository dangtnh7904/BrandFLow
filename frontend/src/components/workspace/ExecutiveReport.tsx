import React from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Briefcase, Zap, TrendingUp, ShieldAlert, BarChart3, Layers, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Bảng màu kết hợp sự chuyên nghiệp của BrandFlow (Slate) và dấu ấn Bếp Nhà Mộc (Amber/Wood/Emerald)
const COLORS = ['#d97706', '#0f172a', '#10b981', '#334155', '#f59e0b', '#475569', '#059669'];

const DEMO_EXPERT_DATA = {
  "goal_setting": {
    "mission_statement": "Kiến tạo Bếp Nhà Mộc thành 'Thánh địa Mindful Dining' (Ẩm thực chánh niệm) tiên phong tại Sài Gòn phồn hoa. Không chỉ bán một bữa ăn, chúng ta trao đi 'Liệu pháp Chữa Lành' qua mâm cơm di sản và không gian 100+ năm tuổi để giải tỏa hội chứng Burnout của giới trẻ thành thị.",
    "core_competencies": [
      { "competency": "Lợi thế Độc quyền (VRIO): Kiến trúc nhà cổ Bắc Bộ nguyên bản tạo ra 'Môi trường trị liệu' tĩnh lặng tuyệt đối, rào cản gia nhập hoàn hảo.", "is_vrio": true },
      { "competency": "Chuỗi cung ứng Vertical Integration: Nguồn cung 100% Organic khép kín, công thức di sản 3 đời hoàn toàn không sử dụng bột ngọt (No MSG).", "is_vrio": true },
      { "competency": "Intellectual Property (IP): Bộ nhận diện 'Mộc' đã đăng ký bảo hộ, quy trình chuẩn hóa (SOPs) sẵn sàng cho lộ trình nhượng quyền (Franchise).", "is_vrio": false },
      { "competency": "First-Mover Advantage: Khai phá đại dương xanh trong ngách 'Wellness Dining', kết hợp ẩm thực hoài niệm và mô hình O2O Loyalty.", "is_vrio": true }
    ],
    "objectives": {
      "financial_goals": [
        "Vượt đỉnh trì trệ (1.2 tỷ). Tăng trưởng Net Revenue lên mốc 1.8 tỷ VNĐ/tháng (+50%) trong Quý 1, hướng tới 2.5 tỷ vào Quý 2.",
        "Tối ưu hóa Food Cost (Giá vốn) xuống dưới 28%, đẩy Gross Margin lên mức 71.8%.",
        "EBITDA dự phóng đạt 23.1% (Xuất sắc) tương đương 1.25 tỷ VNĐ/quý thông qua tối ưu hóa vận hành khung giờ thấp điểm."
      ],
      "marketing_goals": [
        "Thống lĩnh Share of Voice (SOV) ngách 'Ẩm thực chữa lành'. Lọt Top 3 điểm check-in Cinematic nhất Q1/Q3.",
        "Xây dựng tệp khách hàng trung thành: Thu thập 15,000+ First-Party Data qua Zalo Mini App. Nâng Retention Rate từ 15% lên 45%.",
        "Tối ưu hóa phễu chuyển đổi (Funnel): Giảm CAC (Chi phí thu hút 1 khách mới) từ 250,000đ xuống dưới 40,000đ."
      ],
      "cac_ltv_analysis": "Chiến lược Unit Economics: Tối đa hóa LTV (Life-Time Value) bằng mô hình thẻ thành viên 'Hạt Gạo'. Tỷ lệ LTV:CAC kỳ vọng đạt ngưỡng > 5:1."
    },
    "red_lines": [
      "Brand Equity Protection: Tuyệt đối KHÔNG chạy đua 'Deep Discounting' (Giảm giá sâu) hay cạnh tranh về giá trên các nền tảng Food Delivery.",
      "Service Quality Ceiling: Giới hạn tối đa 50 khách/tối để bảo toàn tính độc quyền (Exclusivity) và sự tĩnh lặng của không gian.",
      "Authenticity First: Không thỏa hiệp với chất lượng nguyên liệu. Mọi chiến dịch quảng cáo phải dựa trên sự thật (Truth in Advertising)."
    ]
  },
  "situation_audit": {
    "target_segments": [
      {
        "segment_name": "Core Segment: Urban Healers (Gen Z/Y, 22-35 tuổi, Thu nhập Khá+)",
        "dmu_profiles": [
          {
            "role": "Decider (Người chốt deal)",
            "pain_points": ["Hội chứng Burnout do KPI/Deadline", "Ám ảnh thực phẩm bẩn, chán ngán Fastfood", "Cần không gian trốn áp lực MXH"],
            "decision_drivers": ["Kiến trúc Cinematic để check-in chữa lành", "Cam kết 100% Organic, No MSG", "Storytelling thương hiệu chân thật"]
          }
        ],
        "value_proposition": "Food Therapy: Mâm cơm nhà chuẩn vị di sản trong không gian nhà gỗ mộc mạc, giúp xoa dịu áp lực phố thị và tái tạo năng lượng.",
        "data_sources": ["Phân tích Sentiment Analysis trên 500+ Google Reviews", "Báo cáo nội bộ AI Intake Agent"]
      }
    ],
    "directional_policy": {
      "market_attractiveness": "Rất Cao (8.5/10) — Xu hướng Mindful Dining đang tăng trưởng 45% YoY.",
      "business_strength": "Mạnh (7.5/10) — Sở hữu 'Concept lõi' cực mạnh nhưng cần Rebranding để thoát mác 'quán cơm bình dân'.",
      "investment_decision": "Invest & Grow (Ô Star) — Rót vốn mạnh vào Digital Transformation và O2O."
    }
  },
  "strategy": {
    "ansoff_matrix_choice": "Tái định vị (Market Penetration) & Khai phá (Product Development - Eco Lunch).",
    "positioning_statement": "Blue Ocean Strategy: Bếp Nhà Mộc là 'Điểm trú ẩn tâm lý' duy nhất kết hợp Ẩm thực di sản và Trị liệu không gian tại trung tâm Sài Gòn.",
    "expected_roi_justification": "Ngân sách đầu tư 350M VNĐ. Incremental Revenue dự kiến: +600M VNĐ/tháng. ROI ước tính 71.4% sau 60 ngày triển khai."
  },
  "tactics": {
    "tactics_7ps": [
      { "p_name": "Product", "action_bullet": "Quy hoạch Menu: Giữ Cơm Niêu làm Core, Launch 'Corporate Eco Lunch' lấp khung giờ vắng.", "kpi": "Tăng 25% doanh thu 11h-14h.", "budget_vnd": 30000000, "budget_allocation_percent": 8.6, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Price", "action_bullet": "Áp dụng Premium Pricing (+15%) tương xứng với định vị mới. Không giảm giá.", "kpi": "Gross Margin > 70%.", "budget_vnd": 0, "budget_allocation_percent": 0, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Promotion", "action_bullet": "Cinematic Brand Film 'Về nhà ăn cơm' & Phủ sóng 30+ Micro-Influencers Lifestyle.", "kpi": "3M+ Views, 2000+ Bookings.", "budget_vnd": 150000000, "budget_allocation_percent": 42.8, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Place", "action_bullet": "Chạy Performance Lead Gen (Tặng tráng miệng khi Booking). O2O Conversion.", "kpi": "CAC < 40K VNĐ.", "budget_vnd": 90000000, "budget_allocation_percent": 25.7, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Physical Evid.", "action_bullet": "Rebranding Visuals: Bao bì Eco bã mía, Đồng phục Linen thêu tay.", "kpi": "Nâng cấp Perceived Value.", "budget_vnd": 45000000, "budget_allocation_percent": 12.9, "moscow_tag": "SHOULD_HAVE" },
      { "p_name": "Process", "action_bullet": "Launch Zalo Mini App 'Hạt Gạo' (Loyalty & Real-time Booking).", "kpi": "Retention > 45%.", "budget_vnd": 35000000, "budget_allocation_percent": 10.0, "moscow_tag": "MUST_HAVE" }
    ],
    "total_budget_used": 350000000,
    "task_ready_checklist": ["Duyệt Storyboard 'Về nhà ăn cơm'", "Chốt Hợp đồng 3 Farm vệ tinh", "Launch Zalo App Phase 1", "Sản xuất bao bì Eco mới"]
  },
  "cfo_risk": {
    "cfo_comment": "Từ góc độ Quản trị tài chính: Đòn bẩy 350 triệu VNĐ (tương đương 6.4% mục tiêu doanh thu) là mức đầu tư tối ưu. Đã ép giảm chi phí Brand Film xuống 50M để dồn lực cho Performance Ads kéo dòng tiền nóng. Burn Rate hoàn toàn an toàn.",
    "risk_assessment": [
      { "risk_scenario": "Rủi ro Vận hành: Quá tải công suất bếp (Overload) do Marketing quá hiệu quả.", "trigger_point_metric": "Thời gian lên món (TAT) > 25 phút.", "contingency_plan_b": "Kích hoạt Scarcity Mode: Chỉ nhận khách Booking Zalo, ngưng Walk-in giờ vàng." },
      { "risk_scenario": "Rủi ro Chuỗi cung ứng: Đứt gãy nguồn rau hữu cơ, giá nguyên liệu leo thang.", "trigger_point_metric": "Food Cost vọt lên > 32% (so với chuẩn 28%).", "contingency_plan_b": "Ký hợp đồng bao tiêu (Farming Contract) 12 tháng với 3 Farm vệ tinh." }
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

  const pageClass = "w-full sm:w-[210mm] min-h-[100vh] sm:min-h-[297mm] mx-auto bg-white text-slate-900 border border-slate-200 shadow-sm print:shadow-none print:border-none print:m-0 relative overflow-hidden font-sans mb-8 print:mb-0 print:break-after-page";

  return (
    <div className="flex flex-col items-center pb-8 print:pb-0 bg-slate-100 py-8">
      
      {/* COVER PAGE */}
      <div className={pageClass}>
        <div className="absolute top-0 left-0 w-full h-full p-[20mm] flex flex-col">
          <div className="flex justify-between items-start mb-24">
            <div className="text-slate-900 font-black text-3xl tracking-tighter flex items-center">
              <Zap className="w-8 h-8 mr-2 text-slate-900" />
              BRANDFLOW
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-300 px-3 py-1 inline-block rounded-sm">
                Confidential Report
              </div>
            </div>
          </div>
          
          <div className="mt-auto mb-32">
            <h2 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-4">Strategic Marketing Plan</h2>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 uppercase max-w-2xl">
              Bản Cáo Bạch Kế Hoạch Chiến Lược
            </h1>
            <div className="w-16 h-1 bg-slate-900 mb-8"></div>
          </div>
          
          <div className="flex justify-between items-end border-t border-slate-300 pt-6 mt-auto">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-widest">Prepared for</div>
              <div className="font-black text-slate-900 text-xl">{brandName}</div>
              <div className="text-sm text-slate-600 font-medium mt-1">{wizardAnswers.industry || 'Enterprise'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-widest">Date Published</div>
              <div className="font-bold text-slate-900 text-lg">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
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
          <span>Internal Use Only</span>
        </footer>
      </div>

    </div>
  );
}
