import React from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CheckCircle2, AlertTriangle, Target, Briefcase, Zap, TrendingUp, ShieldAlert } from 'lucide-react';

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

// Dữ liệu DEMO chuẩn chuyên gia được dán cứng để in luôn
const DEMO_EXPERT_DATA = {
  "goal_setting": {
    "mission_statement": "To empower B2B tech companies with AI-driven marketing automation.",
    "core_competencies": [
      {
        "competency": "Động cơ AI tự động hóa workflow 5 bước (Bản quyền thuật toán Llama)",
        "is_vrio": true
      },
      {
        "competency": "Data pipeline realtime độc quyền từ 100+ nguồn SaaS",
        "is_vrio": false
      }
    ],
    "objectives": {
      "financial_goals": [
        "Đạt mốc MRR $50,000 với biên lợi nhuận ròng 35% trong 12 tháng",
        "Giảm thời gian hoàn vốn (Payback Period) xuống dưới 4 tháng"
      ],
      "marketing_goals": [
        "Giảm Customer Acquisition Cost (CAC) xuống dưới $200",
        "Tăng tỷ lệ LTV:CAC lên mức chuẩn 3:1"
      ]
    },
    "red_lines": [
      "Không bao giờ sử dụng scraping dữ liệu trái phép (vi phạm GDPR/PDPA)",
      "Không tham gia vào cuộc chiến phá giá dưới mức Gross Margin 60%"
    ]
  },
  "situation_audit": {
    "target_segments": [
      {
        "segment_name": "SME B2B Tech Startups",
        "dmu_profiles": [
          {
            "role": "Decider",
            "pain_points": [
              "Ngân sách marketing hạn hẹp (<$5k/tháng), không đủ thuê senior CMO",
              "Burn rate cao do chạy quảng cáo sai tệp B2B"
            ],
            "decision_drivers": [
              "Thời gian triển khai (Time-to-value) cực ngắn",
              "Chứng minh được ROI ngay trong quý đầu"
            ]
          },
          {
            "role": "User",
            "pain_points": [
              "Phải dùng quá nhiều tool rời rạc (Hubspot, Canva, GPT)",
              "Quy trình duyệt content quá chậm"
            ],
            "decision_drivers": [
              "Giao diện All-in-one tối giản",
              "AI viết đúng văn phong B2B chuyên ngành"
            ]
          }
        ],
        "value_proposition": "Thay vì nuôi team Marketing 5 người tốn $10k/tháng, BrandFlow cung cấp AI Agency tự động hóa với chi phí 10%, ra chiến lược trong 30 phút."
      }
    ],
    "benchmarks": [
      {
        "factor_name": "Tự động hóa lập kế hoạch",
        "our_score": 9,
        "industry_benchmark_score": 4,
        "weight_percentage": 40.0
      },
      {
        "factor_name": "Cá nhân hóa nội dung B2B",
        "our_score": 7,
        "industry_benchmark_score": 8,
        "weight_percentage": 30.0
      }
    ],
    "tows_strategic_options": [
      "SO: Tận dụng thuật toán AI lõi để đánh bại tốc độ của Agency truyền thống trong phân khúc SME.",
      "ST: Tập trung định vị Niche B2B để né các ông lớn AI Content chung chung như Jasper."
    ]
  },
  "strategy": {
    "ansoff_matrix_choice": "Market Penetration (Thâm nhập thị trường): Dành giật tập SME Tech từ Agency truyền thống bằng lợi thế giá và tốc độ.",
    "positioning_statement": "Với SME Tech B2B, BrandFlow là nền tảng AI Marketing duy nhất (POP: tính năng tự động hóa) sở hữu lõi tư duy McKinsey (POD: Quản trị chiến lược & Rủi ro ROI).",
    "expected_roi_justification": "Với LTV dự kiến đạt $2400 và khống chế CAC ở mức $200 qua kênh Webinar, hệ số LTV:CAC = 12, dòng tiền siêu dương."
  },
  "tactics": {
    "tactics_7ps": [
      {
        "p_name": "Product",
        "action_bullet": "Ra mắt Workspace với quy trình 5 bước AI tự động chốt ngân sách",
        "kpi": "20% user trial hoàn thành 1 bản kế hoạch",
        "budget_vnd": 50000000,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Promotion",
        "action_bullet": "Tổ chức chuỗi Webinar B2B 'Growth Hacking cho SaaS'",
        "kpi": "Thu hút 500 MQLs, tỷ lệ chuyển SQL 10%",
        "budget_vnd": 30000000,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Physical Evidence",
        "action_bullet": "Public Case Study chứng minh ROI từ startup đã dùng BrandFlow",
        "kpi": "Đạt 1,000 lượt tải whitepaper tháng 1",
        "budget_vnd": 10000000,
        "moscow_tag": "SHOULD_HAVE"
      },
      {
        "p_name": "Price",
        "action_bullet": "Gói Early Bird Lifetime Deal thu hồi vốn lưu động",
        "kpi": "Bán 100 gói $299 trong 2 tuần",
        "budget_vnd": 10000000,
        "moscow_tag": "COULD_HAVE"
      }
    ],
    "total_budget_used": 100000000
  },
  "cfo_risk": {
    "cfo_comment": "Kế hoạch rất tham vọng nhưng tôi lo về phễu chốt sale từ Webinar. Nếu CAC vượt $200, dòng tiền sẽ âm ngay quý 2.",
    "risk_assessment": [
      {
        "risk_scenario": "Webinar thu hút sai tệp rác thay vì B2B",
        "trigger_point_metric": "Tỷ lệ MQL to SQL < 2% sau 2 Webinar",
        "contingency_plan_b": "Cắt $30M Promo, đập vào Account-Based Marketing (ABM) trực tiếp qua LinkedIn."
      },
      {
        "risk_scenario": "User Trial bỏ cuộc vì giao diện phức tạp",
        "trigger_point_metric": "Tỷ lệ Churn trong 7 ngày trial > 60%",
        "contingency_plan_b": "Điều động ngay team Customer Success gọi điện 1-1 hỗ trợ onboard."
      }
    ]
  }
};

export default function ExecutiveReport() {
  const { wizardAnswers, tacticsPlan } = useFormStore();
  const { t } = useLanguage();

  // Dùng Demo Data nếu tacticsPlan trống (chưa chạy backend)
  const planData = (tacticsPlan && Object.keys(tacticsPlan).length > 0) ? tacticsPlan : DEMO_EXPERT_DATA;
  
  const goal = planData.goal_setting;
  const audit = planData.situation_audit;
  const strategy = planData.strategy;
  const tactics = planData.tactics;
  const cfo = planData.cfo_risk;

  const dynamicTasks = React.useMemo(() => {
    if (!tactics || !tactics.tactics_7ps) return [];
    return tactics.tactics_7ps.map((act: any) => ({
      name: `[${act.p_name}] ${act.action_bullet}`,
      cost: act.budget_vnd,
      value: act.budget_vnd
    }));
  }, [tactics]);

  const pageClass = "w-[210mm] h-[297mm] mx-auto bg-white text-slate-900 shadow-2xl print:shadow-none print:m-0 relative overflow-hidden font-sans report-container print:break-after-page mb-8 print:mb-0";

  return (
    <div className="flex flex-col items-center pb-8 print:pb-0 bg-slate-100 dark:bg-[#0B1120] py-8">
      
      {/* =======================
          PAGE 1: COVER PAGE
          ======================= */}
      <div className={pageClass}>
        <div className="absolute top-0 left-0 w-full h-[60%]">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000')" }}></div>
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
          <div className="absolute top-10 left-10 text-white font-black text-4xl tracking-tighter flex items-center">
            <Zap className="w-8 h-8 text-cyan-400 mr-2" />
            BrandFlow<span className="text-cyan-400">.</span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-white p-[20mm] flex flex-col justify-end">
          <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400 mb-8 rounded-full"></div>
          <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-3">Tài liệu Tuyệt mật / Internal Use Only</h2>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 uppercase">
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
      <div className={`${pageClass} p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-6 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase">BrandFlow</div>
          <div className="text-slate-500 font-medium text-xs tracking-widest uppercase">01 / Định vị & Mục tiêu (Strategic Planning)</div>
        </header>

        <div className="flex-1 overflow-hidden">
          {/* Mission & VRIO */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center mb-3"><Target className="w-5 h-5 mr-2 text-blue-600"/> Sứ mệnh & Năng lực lõi (VRIO)</h2>
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
              <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase flex items-center"><TrendingUp className="w-4 h-4 mr-1 text-blue-600"/> Mục tiêu tài chính</h3>
              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.objectives.financial_goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
            </div>
            <div className="border border-rose-200 rounded-lg p-4 bg-rose-50/50">
              <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase flex items-center"><ShieldAlert className="w-4 h-4 mr-1 text-rose-600"/> Lằn ranh đỏ (Red Lines)</h3>
              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.red_lines.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          </div>

          {/* DMU & Value Proposition */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center mb-3"><Briefcase className="w-5 h-5 mr-2 text-blue-600"/> Decision-Making Unit (DMU) & Value Proposition</h2>
            {audit.target_segments.map((seg: any, i: number) => (
              <div key={i} className="mb-4">
                <div className="bg-slate-900 text-white p-3 rounded-t-lg font-bold text-sm">Segment: {seg.segment_name}</div>
                <div className="border border-t-0 border-slate-200 rounded-b-lg p-4 bg-white">
                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <div className="bg-blue-50 text-blue-900 p-3 rounded border border-blue-100 text-sm">
                    <span className="font-bold">Value Proposition:</span> {seg.value_proposition}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* =======================
          PAGE 3: TACTICS & CFO RISK
          ======================= */}
      <div className={`${pageClass} p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-6 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase">BrandFlow</div>
          <div className="text-slate-500 font-medium text-xs tracking-widest uppercase">02 / Thực thi & Quản trị Rủi ro (Tactics & Risk)</div>
        </header>

        <div className="flex-1 overflow-hidden">
          {/* Strategy Statement */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Tuyên bố Định vị (STP & Ansoff)</h2>
            <div className="bg-slate-900 p-4 rounded-lg text-white text-sm space-y-3">
              <p><span className="text-cyan-400 font-bold uppercase text-[11px] block">Chiến lược cốt lõi:</span> {strategy.ansoff_matrix_choice}</p>
              <p><span className="text-cyan-400 font-bold uppercase text-[11px] block">Tuyên bố định vị:</span> {strategy.positioning_statement}</p>
              <p><span className="text-cyan-400 font-bold uppercase text-[11px] block">Biện luận ROI:</span> {strategy.expected_roi_justification}</p>
            </div>
          </section>

          {/* 7Ps Tactics */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Ngân sách & Chiến thuật (Zero-Based Budgeting)</h2>
            
            <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-sm font-bold text-slate-500 uppercase">Tổng ngân sách duyệt</span>
              <span className="text-2xl font-black text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tactics.total_budget_used)}</span>
            </div>

            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-800 uppercase text-xs bg-slate-50">
                  <th className="py-2 px-2 font-black">Chữ P</th>
                  <th className="py-2 px-2 font-black">Hành động cốt lõi</th>
                  <th className="py-2 px-2 font-black">KPI Cam kết</th>
                  <th className="py-2 px-2 font-black text-right">Ngân sách</th>
                </tr>
              </thead>
              <tbody>
                {tactics.tactics_7ps.map((task: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="py-3 px-2 font-bold text-blue-600 whitespace-nowrap">{task.p_name}</td>
                    <td className="py-3 px-2 font-medium text-slate-800">{task.action_bullet}</td>
                    <td className="py-3 px-2 text-slate-600 italic text-xs">{task.kpi}</td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900 whitespace-nowrap">
                      {new Intl.NumberFormat('vi-VN').format(task.budget_vnd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
