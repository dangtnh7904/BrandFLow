import React from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Briefcase, Zap, TrendingUp, ShieldAlert, BarChart3, Layers, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Bảng màu đơn sắc chuyên nghiệp kiểu McKinsey/Bain
const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

const DEMO_EXPERT_DATA = {
  "goal_setting": {
    "mission_statement": "Kiến tạo Bếp Nhà Mộc thành 'Thánh địa Mindful Dining' tiên phong tại Sài Gòn — Nơi chữa lành tâm hồn thị dân thông qua nghệ thuật Ẩm thực Việt di sản. Mục tiêu trung hạn (3 năm): Trở thành chuỗi F&B 'Wellness Dining' đầu tiên tại Việt Nam có định giá Pre-Series A đạt ngưỡng 50 tỷ VNĐ.",
    "core_competencies": [
      { "competency": "Lợi thế Độc quyền (VRIO): Không gian kiến trúc nhà gỗ cổ truyền 100+ năm tuổi mang âm hưởng hoài niệm, rào cản gia nhập tuyệt đối.", "is_vrio": true },
      { "competency": "Chuỗi cung ứng Vertical Integration: Hệ sinh thái nguyên liệu 100% Organic khép kín từ 12 nông trại địa phương đạt chứng nhận VietGAP.", "is_vrio": true },
      { "competency": "Intellectual Property (IP) Thương hiệu: Bộ nhận diện 'Mộc' đã đăng ký bảo hộ sở hữu trí tuệ, 15+ công thức gia truyền mã hóa thành SOP.", "is_vrio": false },
      { "competency": "First-Mover Advantage trong ngách 'Wellness Dining': Chưa có đối thủ trực tiếp nào kết hợp được Ẩm thực di sản + Không gian trị liệu.", "is_vrio": true }
    ],
    "objectives": {
      "financial_goals": [
        "Vượt điểm hòa vốn trong Quý 1. Tăng trưởng Revenue từ 1.2 tỷ lên mốc 1.8 tỷ VNĐ/tháng (+50% MoM), đạt Gross Margin ≥ 65% và EBITDA Margin ≥ 18%.",
        "Tối ưu hóa phễu khách hàng trung thành: Đẩy Retention Rate từ 15% lên mức tiêu chuẩn vàng 35%. MRR đạt 500 triệu VNĐ.",
        "Xây dựng tệp First-Party Data: Thu thập tối thiểu 15,000 Qualified Leads trên Zalo Mini App."
      ],
      "marketing_goals": [
        "Thống lĩnh Share of Voice (SOV ≥ 40%) trong ngách 'Ẩm thực chữa lành'. Đạt 5 triệu lượt Organic Reach. Engagement Rate trung bình ≥ 4.5%.",
        "Định vị Top 3 điểm đến F&B 'Must-visit' khu vực Central HCMC. Google Reviews ≥ 4.8/5, TripAdvisor Top 10.",
        "Đạt Net Promoter Score (NPS) ≥ 75. Tỷ lệ Referral chiếm ≥ 20% tổng Booking mới."
      ],
      "cac_ltv_analysis": "Chiến lược Unit Economics: Khống chế CAC < 40,000 VNĐ. Đẩy LTV lên mức 12,500,000 VNĐ/khách. Tỷ lệ LTV:CAC = 312:1."
    },
    "red_lines": [
      "Brand Equity Protection: Tuyệt đối không chạy đua 'Deep Discounting' hoặc Flash Sale. Chỉ áp dụng Value-Add.",
      "Service Quality Ceiling: Tỷ lệ Table Turnover tối đa 2.5 vòng/buổi — hy sinh Revenue ngắn hạn để bảo toàn NPS.",
      "Data Privacy Compliance: Tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu."
    ]
  },
  "situation_audit": {
    "target_segments": [
      {
        "segment_name": "Segment A: Urban Healers — Gen Z/Y Professionals (22-35 tuổi, thu nhập 15-40M)",
        "dmu_profiles": [
          {
            "role": "Decider (Người ra quyết định)",
            "pain_points": ["Hội chứng Burnout mãn tính", "Mất niềm tin vào nguồn gốc thực phẩm", "Decision Fatigue khi chọn quán ăn"],
            "decision_drivers": ["Không gian Aesthetic giàu Storytelling", "Trải nghiệm cá nhân hóa tinh tế", "Social Proof mạnh (Reviews, KOLs)"]
          }
        ],
        "value_proposition": "Food Therapy: Mâm cơm nhà chuẩn vị di sản trong không gian 100+ năm tuổi giúp xoa dịu áp lực phố thị.",
        "data_sources": ["Nielsen Vietnam 2024", "Phân tích CRM nội bộ Q1/2025"]
      }
    ],
    "directional_policy": {
      "market_attractiveness": "Rất Cao (8.2/10) — CAGR 22% ngành Wellness F&B.",
      "business_strength": "Khá (6.8/10) — Concept sở hữu lõi văn hóa mạnh nhưng Nút thắt vận hành bếp cần tối ưu.",
      "investment_decision": "Invest & Grow (Ô Star) — Bơm vốn mạnh tay vào Rebranding và Số hóa."
    }
  },
  "strategy": {
    "ansoff_matrix_choice": "Market Penetration kết hợp Product Development.",
    "positioning_statement": "Blue Ocean Strategy: Chốn về duy nhất trao đi trải nghiệm 'Ẩm thực Việt Chữa Lành' tại khu vực Central HCMC.",
    "expected_roi_justification": "Ngân sách 350M VNĐ là Đòn bẩy Tăng trưởng. Incremental Revenue dự kiến: +600M VNĐ/tháng. ROI 71.4% trong 60 ngày."
  },
  "tactics": {
    "tactics_7ps": [
      { "p_name": "Product", "action_bullet": "Launch 'Thực Đơn Ký Ức' (Heritage Rotating Menu) và Business Lunch Combo.", "kpi": "Tăng 25% doanh thu khung giờ thấp điểm.", "budget_vnd": 30000000, "budget_allocation_percent": 8.6, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Price", "action_bullet": "Áp dụng Tiered Pricing và Dynamic Pricing nhẹ (+10% Peak Hours).", "kpi": "Average Check Size tăng +28%.", "budget_vnd": 0, "budget_allocation_percent": 0, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Promotion", "action_bullet": "Cinematic Brand Film & KOL Campaign đa nền tảng.", "kpi": "3M+ lượt xem Organic. 2000+ Bookings mới.", "budget_vnd": 150000000, "budget_allocation_percent": 42.8, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Place", "action_bullet": "Performance Ads tối ưu CPA và Local SEO Partnerships.", "kpi": "CAC < 40K VNĐ, ROAS ≥ 15x.", "budget_vnd": 90000000, "budget_allocation_percent": 25.7, "moscow_tag": "MUST_HAVE" },
      { "p_name": "People", "action_bullet": "Mộc Academy: Service Mindset & Brand Storytelling Training.", "kpi": "Staff Turnover Rate < 15%/năm.", "budget_vnd": 20000000, "budget_allocation_percent": 5.7, "moscow_tag": "SHOULD_HAVE" },
      { "p_name": "Physical Evidence", "action_bullet": "Visual Identity System: Bao bì Kraft, Đồng phục Linen.", "kpi": "Instagram Mentions ≥ 1,000/tháng.", "budget_vnd": 25000000, "budget_allocation_percent": 7.1, "moscow_tag": "SHOULD_HAVE" },
      { "p_name": "Process", "action_bullet": "Zalo Mini App 'Mộc Loyalty' & Booking Automation.", "kpi": "Mini App Adoption ≥ 60%.", "budget_vnd": 35000000, "budget_allocation_percent": 10.0, "moscow_tag": "MUST_HAVE" }
    ],
    "total_budget_used": 350000000,
    "task_ready_checklist": ["Duyệt Storyboard Brand Film", "Ký HĐ KOLs", "Nghiệm thu Zalo App Sprint 1", "Chốt Mộc Academy Batch 1"]
  },
  "cfo_risk": {
    "cfo_comment": "Từ góc độ Tài chính: Đòn bẩy 350 triệu VNĐ hợp lý. Ép giảm ngân sách Brand Film từ 80M xuống 50M để bù cho Performance Ads. Đảm bảo Burn Rate kiểm soát.",
    "risk_assessment": [
      { "risk_scenario": "Rủi ro Truyền thông: Brand Film không tạo chuyển đổi do thuật toán.", "trigger_point_metric": "Booking qua App < 50 lượt sau 72h.", "contingency_plan_b": "Cắt Sunk-cost Boost video. Pivot toàn lực sang Performance Ads." },
      { "risk_scenario": "Rủi ro Vận hành: Capacity Overflow vào Peak Days.", "trigger_point_metric": "Average Wait Time > 30 phút.", "contingency_plan_b": "Kích hoạt Scarcity Marketing: Đóng cổng Walk-in 100%, giảm Booking cap." }
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
