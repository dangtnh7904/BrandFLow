import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Zap, TrendingUp, Users, Target, BarChart3, AlertTriangle, ArrowRight } from 'lucide-react';

// Bảng màu đơn sắc chuyên nghiệp kiểu McKinsey/Bain
const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

const DEMO_ANALYTICS_DATA = {
  brandName: "Bếp Nhà Mộc",
  industry: "F&B / Wellness Dining",
  dateRange: "Q1 2026 (Jan - Mar)",
  kpiSummary: [
    { label: "Total Revenue", value: "₫1.8B", growth: "+45%", trend: "up" },
    { label: "Customer Acquisition Cost", value: "₫38K", growth: "-15%", trend: "down" },
    { label: "Average Check Size", value: "₫320K", growth: "+28%", trend: "up" },
    { label: "Net Promoter Score", value: "72", growth: "+12", trend: "up" }
  ],
  funnelData: [
    { stage: "Impressions", users: 150000, conversion: "100%" },
    { stage: "Website Visits", users: 45000, conversion: "30%" },
    { stage: "App Downloads", users: 12000, conversion: "26%" },
    { stage: "First Booking", users: 4500, conversion: "37%" },
    { stage: "Repeat Booking", users: 1800, conversion: "40%" }
  ],
  segmentPerformance: [
    { name: "Segment A: Urban Healers", revenue: "₫1.2B", retention: "45%", cac: "₫42K", share: 65 },
    { name: "Segment B: Corporate B2B", revenue: "₫0.6B", retention: "60%", cac: "₫25K", share: 35 }
  ],
  insights: [
    "Corporate B2B Segment shows the highest retention rate (60%) but only accounts for 35% of total revenue. Recommendation: Reallocate 15% of performance ad budget to LinkedIn B2B campaigns.",
    "Significant drop-off (74%) observed between Website Visits and App Downloads. Recommendation: Optimize landing page CTA and introduce a 'Download to get 10% off' incentive.",
    "Average Check Size increased by 28% driven by the new 'Heritage Rotating Menu'. Recommendation: Standardize this menu and introduce a premium wine-pairing option."
  ],
  trendData: [
    { month: 'Jan', revenue: 1.2, cac: 45 },
    { month: 'Feb', revenue: 1.5, cac: 42 },
    { month: 'Mar', revenue: 1.8, cac: 38 }
  ]
};

export default function AnalyticsExportReport() {
  const data = DEMO_ANALYTICS_DATA;
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
                Confidential Analytics
              </div>
            </div>
          </div>
          
          <div className="mt-auto mb-32">
            <h2 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-4">Performance Intelligence</h2>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 uppercase max-w-2xl">
              Báo Cáo Phân Tích Hiệu Suất Kinh Doanh
            </h1>
            <div className="w-16 h-1 bg-slate-900 mb-8"></div>
          </div>
          
          <div className="flex justify-between items-end border-t border-slate-300 pt-6 mt-auto">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-widest">Prepared for</div>
              <div className="font-black text-slate-900 text-xl">{data.brandName}</div>
              <div className="text-sm text-slate-600 font-medium mt-1">{data.industry}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-widest">Reporting Period</div>
              <div className="font-bold text-slate-900 text-lg">{data.dateRange}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-widest">Generated On</div>
              <div className="font-bold text-slate-900 text-lg">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 1: EXECUTIVE DASHBOARD */}
      <div className={`${pageClass} p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-8 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase tracking-tight">BRANDFLOW</div>
          <div className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">01 / Executive Dashboard</div>
        </header>

        <div className="flex-1 overflow-hidden">
          
          {/* KPI Summary */}
          <section className="mb-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <Target className="w-4 h-4 mr-2" /> 1. Key Performance Indicators (KPIs)
            </h2>
            <div className="grid grid-cols-4 gap-px bg-slate-200 border border-slate-200">
              {data.kpiSummary.map((kpi, i) => (
                <div key={i} className="bg-white p-4">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{kpi.label}</div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{kpi.value}</div>
                  <div className="text-xs font-bold text-slate-500 flex items-center">
                    {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1 text-slate-900" /> : <TrendingUp className="w-3 h-3 mr-1 text-slate-400 rotate-180" />}
                    {kpi.growth} vs previous period
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Funnel Analysis */}
          <section className="mb-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" /> 2. Conversion Funnel Analysis
            </h2>
            <div className="border border-slate-200 p-6 bg-white">
              {data.funnelData.map((stage, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{stage.stage}</span>
                    <span className="text-xs font-black text-slate-900">{new Intl.NumberFormat('en-US').format(stage.users)} users</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-sm overflow-hidden flex relative">
                    <div 
                      className="h-full bg-slate-800 transition-all duration-1000" 
                      style={{ width: `${(stage.users / data.funnelData[0].users) * 100}%` }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-white mix-blend-difference">
                      Conv: {stage.conversion}
                    </div>
                  </div>
                  {i < data.funnelData.length - 1 && (
                    <div className="h-6 border-l-2 border-dashed border-slate-300 ml-4 my-1 flex items-center">
                      <span className="text-[9px] text-slate-400 font-bold ml-2">Drop-off: {Math.round((1 - data.funnelData[i+1].users / stage.users) * 100)}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Segment Performance */}
          <section>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2" /> 3. Audience Segment Performance
            </h2>
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 uppercase tracking-widest">
                  <th className="py-3 px-4 font-black border-r border-slate-200">Segment Name</th>
                  <th className="py-3 px-4 font-black border-r border-slate-200 text-right">Revenue</th>
                  <th className="py-3 px-4 font-black border-r border-slate-200 text-right">Retention</th>
                  <th className="py-3 px-4 font-black border-r border-slate-200 text-right">CAC</th>
                  <th className="py-3 px-4 font-black text-right">Rev Share</th>
                </tr>
              </thead>
              <tbody>
                {data.segmentPerformance.map((seg, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-200">{seg.name}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700 border-r border-slate-200">{seg.revenue}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700 border-r border-slate-200">{seg.retention}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700 border-r border-slate-200">{seg.cac}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">{seg.share}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

        </div>
        
        {/* Page footer */}
        <footer className="border-t-2 border-slate-900 pt-3 mt-auto flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>BrandFlow AI Analytics Engine</span>
          <span>Internal Use Only</span>
        </footer>
      </div>

      {/* PAGE 2: STRATEGIC INSIGHTS */}
      <div className={`${pageClass} p-[15mm] flex flex-col`}>
        <header className="border-b-2 border-slate-900 pb-3 mb-8 flex justify-between items-end shrink-0">
          <div className="text-xl font-black text-slate-900 uppercase tracking-tight">BRANDFLOW</div>
          <div className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">02 / Strategic Insights & Trends</div>
        </header>

        <div className="flex-1 overflow-hidden">
          
          {/* Revenue & CAC Trends */}
          <section className="mb-10">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" /> 4. Revenue & CAC Trends
            </h2>
            <div className="border border-slate-200 bg-white p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#0f172a', fontWeight: 'bold' }} tickFormatter={(val) => `₫${val}B`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} tickFormatter={(val) => `₫${val}K`} />
                  <Tooltip contentStyle={{ borderRadius: 0, border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Revenue (Billion VNĐ)" />
                  <Line yAxisId="right" type="monotone" dataKey="cac" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} name="CAC (Thousand VNĐ)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <div className="flex items-center"><div className="w-3 h-3 bg-slate-900 mr-2 rounded-sm" /> Revenue (Left Axis)</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-slate-400 mr-2 rounded-sm" /> CAC (Right Axis)</div>
            </div>
          </section>

          {/* AI Insights & Recommendations */}
          <section>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" /> 5. AI Generated Actionable Insights
            </h2>
            <div className="space-y-4">
              {data.insights.map((insight, i) => {
                const [finding, rec] = insight.split('Recommendation:');
                return (
                  <div key={i} className="border border-slate-200 bg-slate-50/50 p-5 rounded-sm">
                    <div className="flex items-start mb-3">
                      <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-black text-xs mr-3 shrink-0">
                        0{i+1}
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed font-medium">
                        {finding.trim()}
                      </div>
                    </div>
                    {rec && (
                      <div className="ml-9 border-l-2 border-slate-900 pl-4 py-1">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-1">Recommendation</span>
                        <div className="text-sm font-bold text-slate-900">{rec.trim()}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
        
        {/* Page footer */}
        <footer className="border-t-2 border-slate-900 pt-3 mt-auto flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>BrandFlow AI Analytics Engine</span>
          <span>Internal Use Only</span>
        </footer>
      </div>

    </div>
  );
}
