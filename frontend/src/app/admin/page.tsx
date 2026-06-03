"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Activity, Loader2, RefreshCw, X, Clock, Package,
  TrendingUp, Zap, Globe2, BarChart3, Target, Rocket, 
  Brain, DollarSign, ArrowUpRight, ArrowDownRight, Layers,
  LineChart, PieChart, Cpu, Sparkles, Award, CalendarDays,
  UserPlus, Repeat, Crown, Timer
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/* ═══════════════════════════════════════════════════════════════════════════
   SPARKLINE — Mini SVG chart
   ═══════════════════════════════════════════════════════════════════════════ */

function Sparkline({ data, color, height = 32 }: { data: number[]; color: string; height?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  const id = `sg-${color.replace('#', '')}-${data.length}`;
  
  return (
    <svg width={w} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${w},${height}`} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CARD — Metric card with optional sparkline
   ═══════════════════════════════════════════════════════════════════════════ */

function KPICard({ icon: Icon, label, value, subtitle, trend, trendUp, color, sparkData, badge }: {
  icon: any; label: string; value: string; subtitle?: string; trend?: string; trendUp?: boolean; color: string; sparkData?: number[]; badge?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative bg-linear-surface border border-linear-border rounded-2xl p-5 overflow-hidden group hover:border-opacity-60 transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : trendUp === false ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
            {trendUp === true && <ArrowUpRight className="w-3 h-3" />}
            {trendUp === false && <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
        {badge && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{badge}</span>
        )}
      </div>
      <div className="text-2xl font-black text-foreground tracking-tight">{value}</div>
      <div className="text-[11px] text-linear-text-muted font-medium mt-0.5">{label}</div>
      {subtitle && <div className="text-[10px] text-linear-text-muted/60 mt-0.5">{subtitle}</div>}
      {sparkData && sparkData.length > 1 && (
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
  const [dailyGrowth, setDailyGrowth] = useState<any[]>([]);
  const [hourlyHeatmap, setHourlyHeatmap] = useState<any[]>([]);
  const [featureCategories, setFeatureCategories] = useState<any[]>([]);
  const [engagement, setEngagement] = useState<any>(null);
  const [growth, setGrowth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'agents' | 'audit'>('overview');
  const router = useRouter();

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

  const fetchAuditData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('brandflow_token');
      const isAdmin = localStorage.getItem('brandflow_is_admin');
      if (!token || isAdmin !== 'true') { router.push('/login'); return; }
      const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };

      const endpoints = [
        { url: '/api/v1/audit/visitors/summary', setter: (d: any) => setSummary(d) },
        { url: '/api/v1/audit/visitors?limit=50', setter: (d: any) => setVisitors(d) },
        { url: '/api/v1/audit/funnel-stats', setter: (d: any) => setFunnelStats(d || []) },
        { url: '/api/v1/audit/daily-growth?days=14', setter: (d: any) => setDailyGrowth(d || []) },
        { url: '/api/v1/audit/hourly-heatmap', setter: (d: any) => setHourlyHeatmap(d || []) },
        { url: '/api/v1/audit/feature-categories', setter: (d: any) => setFeatureCategories(d || []) },
        { url: '/api/v1/audit/engagement-stats', setter: (d: any) => setEngagement(d) },
        { url: '/api/v1/audit/growth-metrics', setter: (d: any) => setGrowth(d) },
      ];

      const results = await Promise.allSettled(
        endpoints.map(ep => fetch(`${API_URL}${ep.url}`, { headers }).then(r => r.ok ? r.json() : Promise.reject()))
      );

      results.forEach((r, i) => {
        if (r.status === 'fulfilled') endpoints[i].setter(r.value.data);
      });

      // Require at least summary
      if (results[0].status !== 'fulfilled') throw new Error('Không thể tải dữ liệu audit.');
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAuditData(); }, [fetchAuditData]);

  // Derived data
  const totalUsers = summary?.unique_visitors || 0;
  const totalVisits = summary?.total_visits || 0;
  const dailyGrowthSorted = useMemo(() => [...dailyGrowth].reverse(), [dailyGrowth]);

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
              <p className="text-[11px] text-linear-text-muted">Real-time Analytics & Investor Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400">Live</span>
            </div>
            <button onClick={fetchAuditData} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-linear-surface border border-linear-border rounded-lg hover:bg-background transition-colors text-sm font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1440px] mx-auto px-6 flex gap-1">
          {([
            { key: 'overview' as const, icon: BarChart3, label: 'Overview' },
            { key: 'growth' as const, icon: TrendingUp, label: 'Growth & Traction' },
            { key: 'agents' as const, icon: Brain, label: 'AI & Features' },
            { key: 'audit' as const, icon: Shield, label: 'Audit Log' },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${activeTab === tab.key ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-linear-text-muted hover:text-foreground hover:bg-white/5'}`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
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
                
                {/* Real KPIs from DB */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  <KPICard icon={Users} label="Total Users" value={totalUsers.toLocaleString()} color="#06B6D4"
                    trend={growth ? `${growth.wow_user_growth_pct > 0 ? '+' : ''}${growth.wow_user_growth_pct}% WoW` : undefined}
                    trendUp={growth?.wow_user_growth_pct > 0}
                    sparkData={dailyGrowthSorted.map(d => d.active_users)} />
                  <KPICard icon={Activity} label="Total API Calls" value={totalVisits.toLocaleString()} color="#10B981"
                    trend={growth ? `${growth.wow_visit_growth_pct > 0 ? '+' : ''}${growth.wow_visit_growth_pct}% WoW` : undefined}
                    trendUp={growth?.wow_visit_growth_pct > 0}
                    sparkData={dailyGrowthSorted.map(d => d.visits)} />
                  <KPICard icon={UserPlus} label="New Users Today" value={(engagement?.new_today || 0).toString()} color="#F59E0B"
                    subtitle={`${engagement?.new_this_week || 0} this week`} />
                  <KPICard icon={Zap} label="Active Today" value={(engagement?.active_today || 0).toString()} color="#8B5CF6" />
                  <KPICard icon={Repeat} label="Returning Users" value={`${engagement?.returning_pct || 0}%`} color="#EC4899"
                    subtitle={`${engagement?.returning_users || 0} users`} />
                  <KPICard icon={Crown} label="Power Users" value={(engagement?.power_users || 0).toString()} color="#F97316"
                    subtitle={`${engagement?.power_user_pct || 0}% of total`} badge=">10 visits" />
                </div>

                {/* Engagement + Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KPICard icon={BarChart3} label="Avg. Visits / User" value={(engagement?.avg_visits_per_user || 0).toString()} color="#06B6D4" />
                  <KPICard icon={Timer} label="Peak Hour" value={engagement?.peak_hour != null ? `${engagement.peak_hour}:00` : 'N/A'} color="#10B981"
                    subtitle={engagement?.peak_hour_count ? `${engagement.peak_hour_count} calls` : ''} />
                  <KPICard icon={Shield} label="Active Accounts" value={(summary?.active_accounts || 0).toString()} color="#8B5CF6" />
                  <div className="bg-linear-surface border border-linear-border p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-linear-text-muted mb-3">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px] font-bold uppercase">SOC 2 Status</span>
                    </div>
                    <div className="text-xl font-black text-emerald-500 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Monitoring
                    </div>
                  </div>
                </div>

                {/* Daily Activity Chart */}
                {dailyGrowthSorted.length > 0 && (
                  <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                      <CalendarDays className="w-4 h-4 text-cyan-400" /> Daily Activity (Real Data)
                    </h3>
                    <div className="flex items-end gap-2 h-[180px]">
                      {dailyGrowthSorted.map((d, i) => {
                        const maxV = Math.max(...dailyGrowthSorted.map(x => x.visits), 1);
                        const pct = (d.visits / maxV) * 100;
                        const dayLabel = d.day?.slice(5) || '';
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[9px] font-bold text-foreground">{d.visits}</span>
                            {d.new_users > 0 && <span className="text-[8px] text-emerald-400">+{d.new_users}</span>}
                            <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(pct, 3)}%` }}
                              transition={{ duration: 0.6, delay: i * 0.03 }}
                              className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 relative group cursor-help"
                            >
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {d.active_users} DAU
                              </div>
                            </motion.div>
                            <span className="text-[8px] text-linear-text-muted font-mono">{dayLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-6 mt-3 pt-3 border-t border-linear-border/30 text-[10px] text-linear-text-muted">
                      <span>📊 <span className="font-bold text-cyan-400">Bar height</span> = API calls</span>
                      <span>👤 Hover = DAU</span>
                      <span className="text-emerald-400">+N = New users</span>
                    </div>
                  </div>
                )}

                {/* Hourly Heatmap */}
                {hourlyHeatmap.length > 0 && (
                  <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                      <Timer className="w-4 h-4 text-orange-400" /> Activity Heatmap by Hour (Real Data)
                    </h3>
                    <div className="flex gap-1">
                      {Array.from({ length: 24 }, (_, h) => {
                        const entry = hourlyHeatmap.find(e => e.hour === h);
                        const count = entry?.count || 0;
                        const maxCount = Math.max(...hourlyHeatmap.map(e => e.count), 1);
                        const intensity = count / maxCount;
                        return (
                          <div key={h} className="flex-1 flex flex-col items-center gap-1 group cursor-help">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: h * 0.02 }}
                              className="w-full aspect-square rounded-md border border-linear-border/30 relative"
                              style={{ backgroundColor: `rgba(6,182,212,${Math.max(intensity * 0.9, 0.05)})` }}
                            >
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {count} calls
                              </div>
                            </motion.div>
                            <span className="text-[8px] text-linear-text-muted">{h}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-[10px] text-linear-text-muted">
                      <span>Low</span>
                      <div className="flex gap-0.5">
                        {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                          <div key={o} className="w-4 h-3 rounded-sm" style={{ backgroundColor: `rgba(6,182,212,${o})` }} />
                        ))}
                      </div>
                      <span>High</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════ TAB: GROWTH & TRACTION ═══════════ */}
            {activeTab === 'growth' && (
              <motion.div key="growth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* WoW Growth Cards */}
                {growth && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KPICard icon={UserPlus} label="New Users (This Week)" value={growth.new_users_this_week.toString()} color="#10B981"
                      trend={`${growth.wow_user_growth_pct > 0 ? '+' : ''}${growth.wow_user_growth_pct}% WoW`} trendUp={growth.wow_user_growth_pct > 0} />
                    <KPICard icon={UserPlus} label="New Users (Last Week)" value={growth.new_users_last_week.toString()} color="#64748B" />
                    <KPICard icon={Activity} label="Visits (This Week)" value={growth.visits_this_week.toLocaleString()} color="#06B6D4"
                      trend={`${growth.wow_visit_growth_pct > 0 ? '+' : ''}${growth.wow_visit_growth_pct}% WoW`} trendUp={growth.wow_visit_growth_pct > 0} />
                    <KPICard icon={Activity} label="Visits (Last Week)" value={growth.visits_last_week.toLocaleString()} color="#64748B" />
                  </div>
                )}

                {/* Cumulative Users */}
                {growth?.cumulative_users?.length > 0 && (
                  <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> Cumulative User Growth (Real Data)
                    </h3>
                    <div className="flex items-end gap-3 h-[180px]">
                      {growth.cumulative_users.map((d: any, i: number) => {
                        const maxT = Math.max(...growth.cumulative_users.map((x: any) => x.total), 1);
                        const pct = (d.total / maxT) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] font-black text-foreground">{d.total}</span>
                            <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(pct, 4)}%` }}
                              transition={{ duration: 0.6, delay: i * 0.08 }}
                              className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400" />
                            <span className="text-[8px] text-linear-text-muted font-mono">{d.day?.slice(5)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tier Conversion (original logic preserved) */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-linear-border/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-amber-400" /> Tier Conversion Breakdown
                    </h3>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20">Projection</span>
                  </div>
                  <div className="p-6">
                    {(() => {
                      const total = totalUsers || 1;
                      const totalPaid = Math.round(total * 0.10);
                      const ent = Math.max(1, Math.round(totalPaid * 0.15));
                      const pro = Math.max(0, totalPaid - ent);
                      const free = total - totalPaid;
                      return (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-black/20 rounded-xl border border-linear-border">
                              <div className="text-[10px] text-linear-text-muted mb-1 uppercase font-bold">Total</div>
                              <div className="text-3xl font-black">{total}</div>
                            </div>
                            <div className="p-4 bg-black/20 rounded-xl border border-linear-border">
                              <div className="text-[10px] text-linear-text-muted mb-1 uppercase font-bold">Free</div>
                              <div className="text-3xl font-black text-slate-400">{free}</div>
                            </div>
                            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                              <div className="text-[10px] text-emerald-400 mb-1 uppercase font-bold">Paid</div>
                              <div className="text-3xl font-black text-emerald-500">{totalPaid}</div>
                            </div>
                            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex flex-col items-center justify-center">
                              <div className="text-[10px] text-amber-400 mb-1 uppercase font-bold">Conversion</div>
                              <div className="text-4xl font-black text-amber-500">{((totalPaid/total)*100).toFixed(1)}%</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {[
                              { label: `Free (${free})`, pct: ((free/total)*100).toFixed(1), cls: 'bg-slate-500', text: 'text-slate-400' },
                              { label: `Pro (${pro})`, pct: ((pro/total)*100).toFixed(1), cls: 'bg-blue-500', text: 'text-blue-400' },
                              { label: `Enterprise (${ent})`, pct: ((ent/total)*100).toFixed(1), cls: 'bg-purple-500', text: 'text-purple-400' },
                            ].map((t, i) => (
                              <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold"><span className={t.text}>{t.label}</span><span className={t.text}>{t.pct}%</span></div>
                                <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ duration: 1 }} className={`${t.cls} h-2.5 rounded-full`} />
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

            {/* ═══════════ TAB: AI & FEATURES ═══════════ */}
            {activeTab === 'agents' && (
              <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* Feature Usage from Real Data */}
                {featureCategories.length > 0 && (
                  <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-linear-border/50">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" /> Feature Usage Breakdown (Real Data)
                      </h3>
                    </div>
                    <div className="divide-y divide-linear-border/30">
                      {featureCategories.map((cat, idx) => {
                        const maxCalls = featureCategories[0]?.count || 1;
                        const pct = (cat.count / maxCalls) * 100;
                        return (
                          <div key={idx} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xs font-black text-purple-400">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-foreground mb-1.5">{cat.category}</div>
                              <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: idx * 0.05 }}
                                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-black text-foreground">{cat.count.toLocaleString()}</div>
                              <div className="text-[10px] text-linear-text-muted">calls</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Funnel Stats */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-linear-border/50">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-500" /> API Endpoint Funnel (Real Data)
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {funnelStats.slice(0, 15).map((stat, idx) => {
                      const maxUsage = Math.max(...funnelStats.map(s => s.usage_count), 1);
                      const pct = Math.round((stat.usage_count / maxUsage) * 100);
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="font-mono text-blue-400 truncate max-w-[70%]">{stat.path}</span>
                            <span className="text-foreground">{stat.usage_count} calls</span>
                          </div>
                          <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                              className="bg-gradient-to-r from-amber-500 to-orange-400 h-2 rounded-full" />
                          </div>
                        </div>
                      );
                    })}
                    {funnelStats.length === 0 && <div className="text-center py-6 text-linear-text-muted text-sm">No data yet</div>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ TAB: AUDIT LOG ═══════════ */}
            {activeTab === 'audit' && (
              <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <KPICard icon={Users} label="Tổng Số Khách" value={(summary?.unique_visitors || 0).toString()} color="#3B82F6" />
                  <KPICard icon={Activity} label="Tổng Lượt Truy Cập" value={(summary?.total_visits || 0).toString()} color="#10B981" />
                  <KPICard icon={Shield} label="Tài Khoản Active" value={(summary?.active_accounts || 0).toString()} color="#8B5CF6" />
                  <div className="bg-linear-surface border border-linear-border p-5 rounded-2xl">
                    <div className="flex items-center gap-2 text-linear-text-muted mb-3">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px] font-bold uppercase">SOC 2</span>
                    </div>
                    <div className="text-xl font-black text-emerald-500 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Monitoring
                    </div>
                  </div>
                </div>

                <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-linear-border/50 bg-black/10">
                    <h2 className="text-sm font-bold">50 Phiên Truy Cập Gần Nhất</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[10px] uppercase bg-black/20 text-linear-text-muted">
                        <tr>
                          <th className="px-6 py-3">Visitor Key</th>
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
                            <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-bold">{v.visits_count || 0}</span></td>
                            <td className="px-6 py-3 text-linear-text-muted text-xs whitespace-nowrap">{v.last_seen_at ? new Date(v.last_seen_at + 'Z').toLocaleString() : 'N/A'}</td>
                          </tr>
                        ))}
                        {visitors.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-linear-text-muted">Chưa có dữ liệu truy cập</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" style={{ position: 'fixed' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-linear-background border border-linear-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-amber-500" /> Chi Tiết Phiên</h3>
                <p className="font-mono text-sm text-linear-text-muted mt-1">{selectedUser.visitor_key}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-black/20 rounded-lg transition-colors text-linear-text-muted hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            {(() => {
              const d = getMockUserDetails(selectedUser);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl border border-slate-500/20"><div className="text-sm text-slate-400 mb-1">Free</div><div className="text-2xl font-black text-slate-300">{d.free}</div></div>
                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20"><div className="text-sm text-blue-400 mb-1">Pro</div><div className="text-2xl font-black text-blue-500">{d.pro}</div></div>
                    <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20"><div className="text-sm text-purple-400 mb-1">Premium</div><div className="text-2xl font-black text-purple-500">{d.premium}</div></div>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-emerald-400" /> Usage Distribution</h4>
                    <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden flex">
                      {d.free > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(d.free/d.total)*100}%` }} className="bg-slate-500 h-4" />}
                      {d.pro > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(d.pro/d.total)*100}%` }} className="bg-blue-500 h-4" />}
                      {d.premium > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(d.premium/d.total)*100}%` }} className="bg-purple-500 h-4" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-amber-400" /> Recent Activity</h4>
                    <div className="space-y-3">
                      {d.timestamps.map((t: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-linear-border">
                          <div>
                            <div className="font-mono text-sm text-blue-400">{t.path}</div>
                            <div className="text-xs text-linear-text-muted mt-1">{t.time}</div>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${t.tier === 'Enterprise' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : t.tier === 'Pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>{t.tier}</span>
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
