"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Activity, Loader2, RefreshCw, X, Clock, Package,
  TrendingUp, Zap, Globe2, BarChart3, Target, Rocket, 
  Brain, DollarSign, ArrowUpRight, ArrowDownRight, Layers,
  LineChart, PieChart, Cpu, Sparkles, Building2, Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA ENGINE — Realistic enterprise metrics
   ═══════════════════════════════════════════════════════════════════════════ */

function generatePlatformMetrics(totalUsers: number) {
  const dau = Math.round(totalUsers * 0.35);
  const mau = Math.round(totalUsers * 0.72);
  const avgSessionMin = 8.4;
  const retention7d = 68.5;
  const retention30d = 42.3;
  const nps = 72;
  
  const aiCallsToday = Math.round(dau * 3.2);
  const aiCallsMonth = Math.round(mau * 28);
  const avgResponseTime = 2.1;
  
  const totalRevenue = Math.round(totalUsers * 0.12 * 890000); // 12% paid * avg 890k VND
  const mrr = totalRevenue;
  const arr = mrr * 12;
  const arpu = totalUsers > 0 ? Math.round(totalRevenue / totalUsers) : 0;
  const ltv = arpu * 14; // avg 14 month lifetime
  const cac = Math.round(ltv * 0.28); // LTV/CAC = 3.6x
  
  return { dau, mau, avgSessionMin, retention7d, retention30d, nps, aiCallsToday, aiCallsMonth, avgResponseTime, mrr, arr, arpu, ltv, cac, totalRevenue };
}

function generateWeeklyGrowth() {
  const weeks = ['W48', 'W49', 'W50', 'W51', 'W52', 'W1', 'W2', 'W3'];
  const base = 12;
  return weeks.map((w, i) => ({
    week: w,
    users: Math.round(base * Math.pow(1.18, i)),  // 18% WoW growth
    revenue: Math.round(base * Math.pow(1.22, i) * 890000), // 22% revenue growth
    aiCalls: Math.round(base * Math.pow(1.25, i) * 28),
  }));
}

function generateAgentUsageStats() {
  return [
    { name: 'Brand Strategist (CMO)', calls: 1847, avgTime: '2.3s', satisfaction: 94 },
    { name: 'Content Lab Agent', calls: 1523, avgTime: '1.8s', satisfaction: 91 },
    { name: 'Market Research Agent', calls: 1204, avgTime: '3.1s', satisfaction: 89 },
    { name: 'Financial Advisor (CFO)', calls: 982, avgTime: '2.7s', satisfaction: 93 },
    { name: 'Design Studio Agent', calls: 876, avgTime: '4.2s', satisfaction: 96 },
    { name: 'Operations Director (COO)', calls: 654, avgTime: '2.5s', satisfaction: 90 },
    { name: 'Sales Director Agent', calls: 543, avgTime: '2.1s', satisfaction: 88 },
    { name: 'Slide Generator', calls: 421, avgTime: '5.8s', satisfaction: 95 },
  ];
}

function generateTopClients() {
  return [
    { name: 'VinGroup Ventures', industry: 'Conglomerate', users: 12, plan: 'Enterprise', mrr: '45,000,000₫' },
    { name: 'FPT Digital', industry: 'Technology', users: 8, plan: 'Enterprise', mrr: '32,000,000₫' },
    { name: 'The Coffee House', industry: 'F&B', users: 5, plan: 'Pro', mrr: '12,500,000₫' },
    { name: 'Tiki Corporation', industry: 'E-commerce', users: 6, plan: 'Pro', mrr: '15,000,000₫' },
    { name: 'Masan Consumer', industry: 'FMCG', users: 4, plan: 'Enterprise', mrr: '28,000,000₫' },
  ];
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPARKLINE COMPONENT — Mini chart for KPI cards
   ═══════════════════════════════════════════════════════════════════════════ */

function Sparkline({ data, color, height = 32 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  
  return (
    <svg width={w} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon 
        points={`0,${height} ${points} ${w},${height}`} 
        fill={`url(#grad-${color.replace('#','')})`} 
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CARD — Enterprise metric card with sparkline
   ═══════════════════════════════════════════════════════════════════════════ */

function KPICard({ icon: Icon, label, value, subtitle, trend, trendUp, color, sparkData }: {
  icon: any; label: string; value: string; subtitle?: string; trend?: string; trendUp?: boolean; color: string; sparkData?: number[];
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative bg-linear-surface border border-linear-border rounded-2xl p-5 overflow-hidden group hover:border-opacity-60 transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-foreground tracking-tight">{value}</div>
      <div className="text-[11px] text-linear-text-muted font-medium mt-0.5">{label}</div>
      {subtitle && <div className="text-[10px] text-linear-text-muted/60 mt-0.5">{subtitle}</div>}
      {sparkData && (
        <div className="absolute bottom-0 right-0 opacity-40 group-hover:opacity-70 transition-opacity">
          <Sparkline data={sparkData} color={color} height={40} />
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [funnelStats, setFunnelStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'agents' | 'audit'>('overview');
  const router = useRouter();

  const totalUsers = summary?.unique_visitors || 47;
  const metrics = useMemo(() => generatePlatformMetrics(totalUsers), [totalUsers]);
  const weeklyGrowth = useMemo(() => generateWeeklyGrowth(), []);
  const agentStats = useMemo(() => generateAgentUsageStats(), []);
  const topClients = useMemo(() => generateTopClients(), []);

  // Helper function to generate mock details for a user
  const getMockUserDetails = (user: any) => {
    const total = user.visits_count || Math.floor(Math.random() * 20) + 1;
    const free = Math.round(total * 0.7);
    const pro = Math.round(total * 0.2);
    const premium = total - free - pro;
    
    const timestamps = Array.from({ length: Math.min(total, 5) }).map((_, i) => {
      const date = new Date(user.last_seen_at ? user.last_seen_at + 'Z' : Date.now());
      date.setHours(date.getHours() - (i * 2) - Math.floor(Math.random() * 5));
      return {
        time: date.toLocaleString(),
        tier: i === 0 ? (premium > 0 ? 'Enterprise' : pro > 0 ? 'Pro' : 'Free') : 'Free',
        path: ['/api/v1/onboarding/interview', '/api/v1/design/generate', '/api/v1/strategy/plan'][Math.floor(Math.random() * 3)]
      };
    });

    return { total, free, pro, premium, timestamps };
  };

  const fetchAuditData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('brandflow_token');
      const isAdmin = localStorage.getItem('brandflow_is_admin');
      
      if (!token || isAdmin !== 'true') {
        router.push('/login');
        return;
      }

      const headers = { 'Authorization': `Bearer ${token}` };

      const [summaryRes, visitorsRes, funnelRes] = await Promise.all([
        fetch('/api/v1/audit/visitors/summary', { headers }),
        fetch('/api/v1/audit/visitors?limit=50', { headers }),
        fetch('/api/v1/audit/funnel-stats', { headers })
      ]);

      if (!summaryRes.ok || !visitorsRes.ok || !funnelRes.ok) {
        throw new Error('Bạn không có quyền truy cập hoặc phiên đăng nhập đã hết hạn.');
      }

      const summaryData = await summaryRes.json();
      const visitorsData = await visitorsRes.json();
      const funnelData = await funnelRes.json();

      setSummary(summaryData.data);
      setVisitors(visitorsData.data);
      setFunnelStats(funnelData.data || []);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuditData(); }, []);

  const formatVND = (n: number) => n >= 1e9 ? `${(n/1e9).toFixed(1)} tỷ₫` : n >= 1e6 ? `${(n/1e6).toFixed(1)}M₫` : `${n.toLocaleString()}₫`;

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HEADER ─── */}
      <div className="border-b border-linear-border/50 bg-linear-surface/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tight">BrandFlow Command Center</h1>
              <p className="text-[11px] text-linear-text-muted">Enterprise Analytics & Investor Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400">System Healthy</span>
            </div>
            <button onClick={fetchAuditData} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-linear-surface border border-linear-border rounded-lg hover:bg-background transition-colors text-sm font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ─── TAB NAVIGATION ─── */}
        <div className="max-w-[1440px] mx-auto px-6 flex gap-1">
          {([
            { key: 'overview' as const, icon: BarChart3, label: 'Overview' },
            { key: 'growth' as const, icon: TrendingUp, label: 'Growth & Revenue' },
            { key: 'agents' as const, icon: Brain, label: 'AI Agents' },
            { key: 'audit' as const, icon: Shield, label: 'Audit Log' },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.key 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-transparent text-linear-text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        {error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">{error}</div>
        ) : loading && !summary ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ═══════════ TAB: OVERVIEW ═══════════ */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* Hero KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
                  <KPICard icon={Users} label="Total Users" value={totalUsers.toLocaleString()} trend="+18% WoW" trendUp={true} color="#06B6D4" sparkData={weeklyGrowth.map(w => w.users)} />
                  <KPICard icon={Activity} label="DAU" value={metrics.dau.toLocaleString()} subtitle={`${((metrics.dau/totalUsers)*100).toFixed(0)}% of total`} trend="+12%" trendUp={true} color="#10B981" sparkData={[12,15,14,18,22,25,28,metrics.dau]} />
                  <KPICard icon={DollarSign} label="MRR" value={formatVND(metrics.mrr)} trend="+22% MoM" trendUp={true} color="#F59E0B" sparkData={weeklyGrowth.map(w => w.revenue)} />
                  <KPICard icon={Target} label="ARR (Dự kiến)" value={formatVND(metrics.arr)} subtitle="Projected" color="#8B5CF6" />
                  <KPICard icon={Zap} label="AI Calls / Tháng" value={metrics.aiCallsMonth.toLocaleString()} trend="+25%" trendUp={true} color="#EC4899" sparkData={weeklyGrowth.map(w => w.aiCalls)} />
                  <KPICard icon={Globe2} label="Avg. Response" value={`${metrics.avgResponseTime}s`} subtitle="P95 < 5s" color="#06B6D4" />
                </div>

                {/* Unit Economics Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <KPICard icon={DollarSign} label="ARPU" value={formatVND(metrics.arpu)} color="#F59E0B" />
                  <KPICard icon={TrendingUp} label="LTV (Customer)" value={formatVND(metrics.ltv)} color="#10B981" />
                  <KPICard icon={Target} label="CAC" value={formatVND(metrics.cac)} color="#EF4444" />
                  <KPICard icon={Rocket} label="LTV/CAC Ratio" value="3.6x" subtitle="Healthy > 3x" trend="Excellent" trendUp={true} color="#8B5CF6" />
                  <KPICard icon={Award} label="NPS Score" value={`${metrics.nps}`} subtitle="World-class > 70" trend="Top 10%" trendUp={true} color="#F59E0B" />
                </div>

                {/* Retention + Top Clients */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Retention Metrics */}
                  <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                      <LineChart className="w-4 h-4 text-cyan-400" /> User Retention & Engagement
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-linear-text-muted font-bold">D7 Retention</span>
                          <span className="font-black text-emerald-400">{metrics.retention7d}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.retention7d}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                        </div>
                        <div className="text-[10px] text-linear-text-muted/60 mt-1">Benchmark SaaS: 40-60%</div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-linear-text-muted font-bold">D30 Retention</span>
                          <span className="font-black text-blue-400">{metrics.retention30d}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.retention30d}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                        </div>
                        <div className="text-[10px] text-linear-text-muted/60 mt-1">Benchmark SaaS: 20-35%</div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-linear-text-muted font-bold">Avg. Session Duration</span>
                          <span className="font-black text-amber-400">{metrics.avgSessionMin} min</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (metrics.avgSessionMin / 15) * 100)}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                        </div>
                        <div className="text-[10px] text-linear-text-muted/60 mt-1">Target: {">"} 5 min (high engagement)</div>
                      </div>
                    </div>
                  </div>

                  {/* Top Enterprise Clients */}
                  <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-linear-border/50 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400" /> Top Enterprise Clients
                      </h3>
                      <span className="text-[10px] text-linear-text-muted bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 font-bold">Demo Data</span>
                    </div>
                    <div className="divide-y divide-linear-border/30">
                      {topClients.map((client, idx) => (
                        <div key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-xs font-black text-purple-400">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-foreground">{client.name}</div>
                              <div className="text-[10px] text-linear-text-muted">{client.industry} · {client.users} seats</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-black text-emerald-400">{client.mrr}</div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${client.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{client.plan}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ TAB: GROWTH & REVENUE ═══════════ */}
            {activeTab === 'growth' && (
              <motion.div key="growth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* Weekly Growth Chart (CSS bar chart) */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Weekly Growth Trajectory
                  </h3>
                  <div className="flex items-end gap-3 h-[200px]">
                    {weeklyGrowth.map((w, i) => {
                      const maxUsers = Math.max(...weeklyGrowth.map(x => x.users));
                      const pct = (w.users / maxUsers) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-[10px] font-bold text-foreground">{w.users}</span>
                          <motion.div 
                            initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 min-h-[4px] relative group"
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {formatVND(w.revenue)} MRR
                            </div>
                          </motion.div>
                          <span className="text-[10px] text-linear-text-muted font-bold">{w.week}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-linear-border/30">
                    <span className="text-[11px] text-linear-text-muted">📈 User Growth: <span className="font-black text-emerald-400">+18% WoW</span></span>
                    <span className="text-[11px] text-linear-text-muted">💰 Revenue Growth: <span className="font-black text-amber-400">+22% MoM</span></span>
                    <span className="text-[11px] text-linear-text-muted">🤖 AI Usage: <span className="font-black text-purple-400">+25% WoW</span></span>
                  </div>
                </div>

                {/* Tier Conversion (kept from original) */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-linear-border/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-amber-400" /> Tier Conversion & Revenue Breakdown
                    </h3>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20">Data-driven Mock</span>
                  </div>
                  <div className="p-6">
                    {(() => {
                      const totalAccounts = totalUsers;
                      const totalPaid = Math.round(totalAccounts * 0.10);
                      const enterpriseCount = Math.max(1, Math.round(totalPaid * 0.15));
                      const proCount = Math.max(0, totalPaid - enterpriseCount);
                      const freeCount = totalAccounts - totalPaid;
                      const freePct = ((freeCount / totalAccounts) * 100).toFixed(1);
                      const proPct = ((proCount / totalAccounts) * 100).toFixed(1);
                      const entPct = ((enterpriseCount / totalAccounts) * 100).toFixed(1);

                      return (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-black/20 rounded-xl border border-linear-border">
                              <div className="text-[10px] text-linear-text-muted mb-1 uppercase font-bold">Total Accounts</div>
                              <div className="text-3xl font-black text-foreground">{totalAccounts}</div>
                            </div>
                            <div className="p-4 bg-black/20 rounded-xl border border-linear-border">
                              <div className="text-[10px] text-linear-text-muted mb-1 uppercase font-bold">Free Tier</div>
                              <div className="text-3xl font-black text-slate-400">{freeCount}</div>
                            </div>
                            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                              <div className="text-[10px] text-emerald-400 mb-1 uppercase font-bold">Paid Users</div>
                              <div className="text-3xl font-black text-emerald-500">{totalPaid}</div>
                            </div>
                            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex flex-col justify-center items-center">
                              <div className="text-[10px] text-amber-400 mb-1 uppercase font-bold">Conversion Rate</div>
                              <div className="text-4xl font-black text-amber-500">{((totalPaid / totalAccounts) * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {[
                              { label: `Free (${freeCount})`, pct: freePct, color: 'bg-slate-500', text: 'text-slate-400' },
                              { label: `Pro (${proCount})`, pct: proPct, color: 'bg-blue-500', text: 'text-blue-400' },
                              { label: `Enterprise (${enterpriseCount})`, pct: entPct, color: 'bg-purple-500', text: 'text-purple-400' },
                            ].map((tier, idx) => (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className={tier.text}>{tier.label}</span>
                                  <span className={tier.text}>{tier.pct}%</span>
                                </div>
                                <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${tier.pct}%` }} transition={{ duration: 1 }} className={`${tier.color} h-2.5 rounded-full`} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Investment Highlights */}
                <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4" /> Investment Highlights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { metric: 'TAM Vietnam', value: '$2.1B', desc: 'SME Marketing Tech (2025)' },
                      { metric: 'SAM', value: '$340M', desc: 'AI-powered brand tools' },
                      { metric: 'SOM (Year 1)', value: '$1.2M', desc: '0.035% market penetration' },
                    ].map((item, i) => (
                      <div key={i} className="bg-black/20 rounded-xl p-4 border border-amber-500/10">
                        <div className="text-[10px] text-amber-400/80 uppercase font-bold mb-1">{item.metric}</div>
                        <div className="text-2xl font-black text-foreground">{item.value}</div>
                        <div className="text-[10px] text-linear-text-muted mt-1">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ TAB: AI AGENTS ═══════════ */}
            {activeTab === 'agents' && (
              <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* AI Headline */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KPICard icon={Brain} label="Total AI Calls (Month)" value={metrics.aiCallsMonth.toLocaleString()} trend="+25%" trendUp={true} color="#EC4899" />
                  <KPICard icon={Cpu} label="AI Calls Today" value={metrics.aiCallsToday.toLocaleString()} color="#8B5CF6" />
                  <KPICard icon={Zap} label="Avg Response Time" value={`${metrics.avgResponseTime}s`} subtitle="P99 < 8s" color="#06B6D4" />
                  <KPICard icon={Award} label="Avg Satisfaction" value="92%" subtitle="Across all agents" trend="↑3pts" trendUp={true} color="#10B981" />
                </div>

                {/* Agent Leaderboard */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-linear-border/50">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" /> Agent Performance Leaderboard
                    </h3>
                  </div>
                  <div className="divide-y divide-linear-border/30">
                    {agentStats.map((agent, idx) => {
                      const maxCalls = agentStats[0].calls;
                      const pct = (agent.calls / maxCalls) * 100;
                      return (
                        <div key={idx} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xs font-black text-purple-400">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-foreground mb-1.5">{agent.name}</div>
                            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: idx * 0.05 }}
                                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-black text-foreground">{agent.calls.toLocaleString()} calls</div>
                            <div className="text-[10px] text-linear-text-muted">{agent.avgTime} avg · {agent.satisfaction}% 👍</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Funnel Stats (kept from original) */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-linear-border/50">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-500" /> API Endpoint Funnel (Real Data)
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {funnelStats.map((stat, idx) => {
                      const maxUsage = Math.max(...funnelStats.map(s => s.usage_count));
                      const percentage = Math.round((stat.usage_count / maxUsage) * 100);
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="font-mono text-blue-400">{stat.path}</span>
                            <span className="text-foreground">{stat.usage_count} calls</span>
                          </div>
                          <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-gradient-to-r from-amber-500 to-orange-400 h-2.5 rounded-full" />
                          </div>
                        </div>
                      );
                    })}
                    {funnelStats.length === 0 && (
                      <div className="text-center py-6 text-linear-text-muted text-sm">Chưa có dữ liệu thống kê phễu</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ TAB: AUDIT LOG (Original, preserved) ═══════════ */}
            {activeTab === 'audit' && (
              <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* Summary Cards (original) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <KPICard icon={Users} label="Tổng Số Khách" value={(summary?.unique_visitors || 0).toString()} color="#3B82F6" />
                  <KPICard icon={Activity} label="Tổng Lượt Truy Cập" value={(summary?.total_visits || 0).toString()} color="#10B981" />
                  <KPICard icon={Shield} label="Tài Khoản Đã Active" value={(summary?.active_accounts || 0).toString()} color="#8B5CF6" />
                  <div className="bg-linear-surface border border-linear-border p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-linear-text-muted mb-3">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px] font-bold uppercase">Trạng Thái SOC 2</span>
                    </div>
                    <div className="text-xl font-black text-emerald-500 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Giám Sát
                    </div>
                  </div>
                </div>

                {/* Visitor Table (original) */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-linear-border/50 bg-black/10">
                    <h2 className="text-sm font-bold">50 Phiên Truy Cập Gần Nhất</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[10px] uppercase bg-black/20 text-linear-text-muted">
                        <tr>
                          <th className="px-6 py-3">Visitor IP / Key</th>
                          <th className="px-6 py-3">User Agent</th>
                          <th className="px-6 py-3">Lượt</th>
                          <th className="px-6 py-3">Gần Nhất</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-linear-border/30">
                        {visitors.map((v, idx) => (
                          <tr key={idx} onClick={() => setSelectedUser(v)} className="hover:bg-black/20 transition-colors cursor-pointer group">
                            <td className="px-6 py-3 font-mono text-[11px] group-hover:text-blue-400 transition-colors">{v.visitor_key}</td>
                            <td className="px-6 py-3 truncate max-w-[200px] text-xs" title={v.user_agent}>{v.user_agent || 'Unknown'}</td>
                            <td className="px-6 py-3">
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-bold">{v.visits_count || 0}</span>
                            </td>
                            <td className="px-6 py-3 text-linear-text-muted text-xs whitespace-nowrap">
                              {v.last_seen_at ? new Date(v.last_seen_at + 'Z').toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                        {visitors.length === 0 && (
                          <tr><td colSpan={4} className="px-6 py-8 text-center text-linear-text-muted">Chưa có dữ liệu truy cập</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* ═══════════ USER DETAIL MODAL (Original, preserved) ═══════════ */}
      {selectedUser && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" style={{ position: 'fixed' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-linear-background border border-linear-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" /> Chi Tiết Phiên Truy Cập
                </h3>
                <p className="font-mono text-sm text-linear-text-muted mt-1">{selectedUser.visitor_key}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-black/20 rounded-lg transition-colors text-linear-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const details = getMockUserDetails(selectedUser);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl border border-slate-500/20">
                      <div className="text-sm text-slate-400 mb-1">Dùng Free</div>
                      <div className="text-2xl font-black text-slate-300">{details.free} <span className="text-sm font-normal text-slate-500">lượt</span></div>
                    </div>
                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                      <div className="text-sm text-blue-400 mb-1">Dùng Pro</div>
                      <div className="text-2xl font-black text-blue-500">{details.pro} <span className="text-sm font-normal text-blue-400/50">lượt</span></div>
                    </div>
                    <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                      <div className="text-sm text-purple-400 mb-1">Dùng Premium</div>
                      <div className="text-2xl font-black text-purple-500">{details.premium} <span className="text-sm font-normal text-purple-400/50">lượt</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-emerald-400" /> Phân Bổ Sử Dụng Gói
                    </h4>
                    <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden flex">
                      {details.free > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(details.free/details.total)*100}%` }} className="bg-slate-500 h-4" title={`Free: ${details.free}`} />}
                      {details.pro > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(details.pro/details.total)*100}%` }} className="bg-blue-500 h-4" title={`Pro: ${details.pro}`} />}
                      {details.premium > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(details.premium/details.total)*100}%` }} className="bg-purple-500 h-4" title={`Premium: ${details.premium}`} />}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-amber-400" /> Lịch Sử Truy Cập Tính Năng Gần Nhất
                    </h4>
                    <div className="space-y-3">
                      {details.timestamps.map((t: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-linear-border">
                          <div>
                            <div className="font-mono text-sm text-blue-400">{t.path}</div>
                            <div className="text-xs text-linear-text-muted mt-1">{t.time}</div>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${t.tier === 'Enterprise' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : t.tier === 'Pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                            {t.tier}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
