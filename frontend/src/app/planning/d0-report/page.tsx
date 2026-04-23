"use client";

import React, { useEffect, useState } from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import PastelTable from '@/components/b2b/PastelTable';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

// ── Types ──
interface MarketingPlanData {
  company: { name: string; hq_location: string; mission: string };
  plan_year: string;
  objective: string;
  authors: { name: string; email: string }[];
  marketing_leaders: { name: string; title: string; bio: string }[];
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  initiatives: { name: string; description: string; goal: string; metrics: string }[];
  target_market: {
    industries: { name: string; description: string }[];
    buyer_personas: { name: string; description: string }[];
    competitors: { name: string; compete: string; win: string }[];
  };
  market_strategy: { product: string; price: string; promotion: string; people: string; process: string; services: string[] };
  budget: { expenses: { name: string; amount: number }[]; total: number; currency: string };
  marketing_channels: { name: string; purpose: string; metrics: string; target_value: number }[];
  marketing_technology: { name: string; category: string; description: string }[];
}

const CHART_COLORS = ['#667eea', '#764ba2', '#00d2ff', '#f093fb', '#43e97b', '#e94560', '#f7971e'];

export default function MarketingPlanReport() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<MarketingPlanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Try Next.js API route (reads from ../data/)
      try {
        const res = await fetch('/api/marketing-plan-data');
        if (res.ok) { setData(await res.json()); setLoading(false); return; }
      } catch (_) {}
      // Try FastAPI backend
      try {
        const res = await fetch('http://localhost:8000/api/marketing-plan/sample');
        if (res.ok) { setData(await res.json()); setLoading(false); return; }
      } catch (_) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Failed to load marketing plan data.</p>
      </div>
    );
  }

  const budgetChartData = data.budget.expenses.map(e => ({ name: e.name, value: e.amount }));
  const channelChartData = data.marketing_channels.map(c => ({ name: c.name, target: c.target_value }));

  return (
    <B2BPageTemplate
      title={language === 'vi' ? 'Báo cáo Marketing Plan' : 'Marketing Plan Report'}
      description={language === 'vi'
        ? `${data.company.name} — Kế hoạch Marketing ${data.plan_year}`
        : `${data.company.name} — Marketing Plan FY ${data.plan_year}`
      }
    >
      <div className="space-y-8">

        {/* ── Overview Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: language === 'vi' ? 'Tổng ngân sách' : 'Total Budget', value: `$${(data.budget.total / 1000).toFixed(0)}K`, color: 'from-blue-500 to-indigo-600' },
            { label: language === 'vi' ? 'Sáng kiến' : 'Initiatives', value: data.initiatives.length, color: 'from-purple-500 to-fuchsia-600' },
            { label: language === 'vi' ? 'Kênh Marketing' : 'Channels', value: data.marketing_channels.length, color: 'from-cyan-500 to-teal-500' },
            { label: language === 'vi' ? 'Đối thủ' : 'Competitors', value: data.target_market.competitors.length, color: 'from-rose-500 to-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</p>
              <p className={`text-3xl font-extrabold mt-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Company & Objective ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-3">
            {language === 'vi' ? 'Tổng quan doanh nghiệp' : 'Business Summary'}
          </h3>
          <p className="text-sm text-slate-600 mb-1"><span className="font-semibold">{data.company.name}</span> — {data.company.hq_location}</p>
          <p className="text-sm text-slate-500 mb-4"><span className="font-medium">{language === 'vi' ? 'Sứ mệnh' : 'Mission'}:</span> {data.company.mission}</p>
          <p className="text-sm text-slate-600 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <span className="font-semibold text-blue-700">{language === 'vi' ? 'Mục tiêu' : 'Objective'}:</span> {data.objective}
          </p>
        </div>

        {/* ── Marketing Leaders ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Đội ngũ lãnh đạo Marketing' : 'Marketing Leaders'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.marketing_leaders.map((leader, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {leader.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">{leader.name}</p>
                  <p className="text-xs text-blue-600 font-medium">{leader.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SWOT Analysis ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Phân tích SWOT' : 'SWOT Analysis'}
          </h3>
          <div className="grid grid-cols-2 gap-[2px] bg-slate-200 rounded-lg overflow-hidden">
            {[
              { key: 'strengths' as const, label: language === 'vi' ? 'Điểm mạnh' : 'Strengths', icon: '💪', headerBg: 'bg-emerald-500', cellBg: 'bg-emerald-50', dotColor: 'bg-emerald-400' },
              { key: 'weaknesses' as const, label: language === 'vi' ? 'Điểm yếu' : 'Weaknesses', icon: '⚠️', headerBg: 'bg-rose-500', cellBg: 'bg-rose-50', dotColor: 'bg-rose-400' },
              { key: 'opportunities' as const, label: language === 'vi' ? 'Cơ hội' : 'Opportunities', icon: '🌟', headerBg: 'bg-blue-500', cellBg: 'bg-blue-50', dotColor: 'bg-blue-400' },
              { key: 'threats' as const, label: language === 'vi' ? 'Thách thức' : 'Threats', icon: '🔥', headerBg: 'bg-amber-500', cellBg: 'bg-amber-50', dotColor: 'bg-amber-400' },
            ].map(cell => (
              <div key={cell.key} className={`${cell.cellBg} p-4`}>
                <h4 className={`text-sm font-bold mb-3 flex items-center gap-2`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${cell.headerBg} text-white text-xs`}>{cell.icon}</span>
                  {cell.label}
                </h4>
                <ul className="space-y-2">
                  {data.swot[cell.key].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <span className={`w-1.5 h-1.5 rounded-full ${cell.dotColor} mt-1.5 shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Business Initiatives ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Sáng kiến kinh doanh' : 'Business Initiatives'}
          </h3>
          <div className="space-y-4">
            {data.initiatives.map((ini, i) => (
              <div key={i} className="relative pl-5 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-lg" />
                <h4 className="font-semibold text-sm text-slate-800 mb-1">{language === 'vi' ? 'Sáng kiến' : 'Initiative'} {i + 1}: {ini.name}</h4>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">{ini.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">🎯 {ini.goal}</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">📈 {ini.metrics}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Target Market ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Thị trường mục tiêu' : 'Target Market'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {data.target_market.industries.map((ind, i) => (
              <div key={i} className="p-4 rounded-lg bg-cyan-50 border border-cyan-100">
                <h4 className="font-semibold text-sm text-cyan-800">{ind.name}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ind.description}</p>
              </div>
            ))}
          </div>

          <h4 className="text-sm font-bold text-slate-700 mb-3">{language === 'vi' ? 'Chân dung khách hàng' : 'Buyer Personas'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.target_market.buyer_personas.map((bp, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 border border-purple-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {bp.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-purple-800">{bp.name}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{bp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Competitive Analysis ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Phân tích đối thủ' : 'Competitive Analysis'}
          </h3>
          <PastelTable
            columns={[
              { key: 'name', header: language === 'vi' ? 'Đối thủ' : 'Competitor', className: 'bg-white font-semibold text-slate-700' },
              { key: 'compete', header: language === 'vi' ? 'Cách cạnh tranh' : 'How They Compete', className: 'bg-orange-50 text-slate-600' },
              { key: 'win', header: language === 'vi' ? 'Cách chúng ta thắng' : 'How We Win', className: 'bg-emerald-50 text-emerald-700' },
            ]}
            data={data.target_market.competitors}
          />
        </div>

        {/* ── Market Strategy (5P) ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Chiến lược thị trường (5P)' : 'Market Strategy (5P)'}
          </h3>
          <div className="space-y-3">
            {[
              { key: 'product' as const, label: 'Product', icon: '📦', vi: 'Sản phẩm' },
              { key: 'price' as const, label: 'Price', icon: '💲', vi: 'Giá cả' },
              { key: 'promotion' as const, label: 'Promotion', icon: '📣', vi: 'Xúc tiến' },
              { key: 'people' as const, label: 'People', icon: '👤', vi: 'Con người' },
              { key: 'process' as const, label: 'Process', icon: '⚙️', vi: 'Quy trình' },
            ].map(item => (
              <details key={item.key} className="group rounded-lg border border-slate-200 overflow-hidden" open={item.key === 'product'}>
                <summary className="flex items-center gap-2 px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700">
                  <span>{item.icon}</span>
                  <span>{language === 'vi' ? item.vi : item.label}</span>
                  <span className="ml-auto text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 py-3 text-sm text-slate-600 leading-relaxed bg-white">
                  {data.market_strategy[item.key]}
                </div>
              </details>
            ))}
          </div>
          {data.market_strategy.services.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">{language === 'vi' ? 'Dịch vụ' : 'Services'}</p>
              <div className="flex flex-wrap gap-2">
                {data.market_strategy.services.map((s, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Budget: Table + Pie Chart ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Ngân sách Marketing' : 'Marketing Budget'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PastelTable
                columns={[
                  { key: 'name', header: language === 'vi' ? 'Khoản chi' : 'Expense', className: 'bg-white font-medium text-slate-700' },
                  { key: 'amount_fmt', header: language === 'vi' ? 'Số tiền' : 'Amount', align: 'right' as const, headerClassName: 'bg-emerald-100 text-emerald-900', className: 'bg-emerald-50 text-emerald-700 font-bold' },
                ]}
                data={data.budget.expenses.map(e => ({ ...e, amount_fmt: `$${e.amount.toLocaleString()}` }))}
                footerContent={
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-800">TOTAL</td>
                    <td className="px-4 py-3 text-right font-extrabold text-emerald-700">${data.budget.total.toLocaleString()}</td>
                  </tr>
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={budgetChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {budgetChartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Marketing Channels: Table + Bar Chart ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Kênh Marketing' : 'Marketing Channels'}
          </h3>
          <PastelTable
            columns={[
              { key: 'name', header: language === 'vi' ? 'Kênh' : 'Channel', className: 'bg-white font-semibold text-slate-700' },
              { key: 'purpose', header: language === 'vi' ? 'Mục đích' : 'Purpose', className: 'bg-white text-slate-600' },
              { key: 'metrics', header: language === 'vi' ? 'Đo lường' : 'Metrics', className: 'bg-white text-slate-600' },
              { key: 'target_fmt', header: 'Target', align: 'right' as const, headerClassName: 'bg-cyan-100 text-cyan-900', className: 'bg-cyan-50 text-cyan-700 font-bold' },
            ]}
            data={data.marketing_channels.map(c => ({ ...c, target_fmt: c.target_value.toLocaleString() }))}
          />
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={channelChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip formatter={(val: number) => val.toLocaleString()} />
                <Bar dataKey="target" radius={[6, 6, 0, 0]}>
                  {channelChartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Marketing Technology ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {language === 'vi' ? 'Công nghệ Marketing' : 'Marketing Technology'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.marketing_technology.map((tech, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg shrink-0">
                  🔧
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">{tech.name}</p>
                  <p className="text-[10px] text-cyan-600 font-medium uppercase tracking-wider">{tech.category}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </B2BPageTemplate>
  );
}
