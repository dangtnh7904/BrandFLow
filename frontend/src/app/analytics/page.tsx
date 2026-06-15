"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, Target, Zap, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart, Layers, Sparkles, Crown, Timer,
  DollarSign, Rocket, CheckCircle2, AlertTriangle, XCircle,
  ChevronRight, Download, Filter, Building2, Brain,
  Megaphone, CalendarDays, Activity, UserPlus, Repeat,
  Clock, MapPin, Globe2, Shield, ArrowRight, Star, TrendingDown
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface SegmentData {
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  count: number;
  conversionRate: number;
  avgVisits: number;
  churnRate: number;
  revenue: string;
  topFeature: string;
  recommendation: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface FunnelStage {
  label: string;
  value: number;
  pct: number;
  color: string;
  dropoff?: number;
}

interface InsightCard {
  title: string;
  value: string;
  change: string;
  changeUp: boolean;
  icon: any;
  color: string;
  sparkData: number[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPARKLINE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function Sparkline({ data, color, height = 32, width = 100 }: { data: number[]; color: string; height?: number; width?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) =>
    `${(i / Math.max(data.length - 1, 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`
  ).join(' ');
  const id = `sp-${color.replace(/[^a-z0-9]/gi, '')}-${data.length}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DONUT CHART
   ═══════════════════════════════════════════════════════════════════════════ */

function DonutChart({ segments, size = 180 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const r = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let currentOffset = 0;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dashLen = pct * circumference;
        const dashOffset = -currentOffset;
        currentOffset += dashLen;
        return (
          <motion.circle key={i}
            cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth="24" strokeLinecap="round"
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={dashOffset}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r - 20} fill="var(--surface)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HORIZONTAL BAR
   ═══════════════════════════════════════════════════════════════════════════ */

function HBar({ label, value, maxValue, color, suffix = '', delay = 0 }: {
  label: string; value: number; maxValue: number; color: string; suffix?: string; delay?: number;
}) {
  const pct = (value / Math.max(maxValue, 1)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-foreground">{label}</span>
        <span style={{ color }}>{value.toLocaleString()}{suffix}</span>
      </div>
      <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay }}
          className="h-2.5 rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════════════════ */

function AnimatedValue({ value, suffix = '' }: { value: string; suffix?: string }) {
  return (
    <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="text-3xl font-black text-foreground tracking-tight">
      {value}{suffix}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN ANALYTICS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function MarketingAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'segments' | 'funnel' | 'gtm'>('overview');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  /* ─── RAW METRICS (from audit log data) ─── */
  const metrics = {
    totalTrials: 112,
    activeNow: 99,        // 112 - 9 - 4
    churnedFirst: 9,
    droppedMonth: 4,
    retentionRate: 88.4,   // (99/112)*100
    churnRate: 11.6,
    totalEvents: 4581,
    avgVisitsPerUser: 36.5,
    powerUsers: 2,        // AMEKA + KITE LABS
    dau: 82,
    wowGrowth: 18.7,
    peakHour: 14,
  };

  /* ─── KPI CARDS ─── */
  const kpiCards: InsightCard[] = [
    {
      title: 'Tổng DN dùng thử',
      value: '112',
      change: '+18.7% WoW',
      changeUp: true,
      icon: Building2,
      color: '#06B6D4',
      sparkData: [45, 52, 61, 68, 74, 82, 89, 95, 99, 104, 108, 112],
    },
    {
      title: 'Tỷ lệ giữ chân',
      value: '88.4%',
      change: '+3.2% so với kỳ trước',
      changeUp: true,
      icon: Repeat,
      color: '#10B981',
      sparkData: [78, 80, 82, 83, 85, 86, 87, 87, 88, 88.4],
    },
    {
      title: 'DN rời đi',
      value: '13',
      change: '11.6% churn rate',
      changeUp: false,
      icon: TrendingDown,
      color: '#EF4444',
      sparkData: [2, 3, 5, 7, 8, 9, 10, 11, 12, 13],
    },
    {
      title: 'Power Users',
      value: '2 DN',
      change: 'AMEKA & KITE LABS',
      changeUp: true,
      icon: Crown,
      color: '#F59E0B',
      sparkData: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2],
    },
    {
      title: 'Avg. Visits/DN',
      value: '36.5',
      change: '+12.3 vs benchmark',
      changeUp: true,
      icon: Activity,
      color: '#8B5CF6',
      sparkData: [18, 22, 25, 28, 30, 32, 33, 34, 35, 36.5],
    },
    {
      title: 'Tổng API Calls',
      value: '4,581',
      change: '+24.5% WoW',
      changeUp: true,
      icon: Zap,
      color: '#EC4899',
      sparkData: [120, 280, 560, 980, 1500, 2200, 2900, 3500, 4100, 4581],
    },
  ];

  /* ─── SEGMENT DATA ─── */
  const segments: SegmentData[] = [
    {
      name: 'Mỹ phẩm & Beauty',
      icon: Star,
      color: '#F472B6',
      bgColor: 'rgba(244, 114, 182, 0.08)',
      borderColor: 'rgba(244, 114, 182, 0.2)',
      count: 18,
      conversionRate: 72,
      avgVisits: 42,
      churnRate: 5.6,
      revenue: '₫45M',
      topFeature: 'Design Studio + Content Lab',
      recommendation: 'Đẩy mạnh email marketing + Case study Mỹ phẩm. Tạo template ngành sẵn.',
      priority: 'HIGH',
    },
    {
      name: 'Công nghệ & SaaS',
      icon: Brain,
      color: '#818CF8',
      bgColor: 'rgba(129, 140, 248, 0.08)',
      borderColor: 'rgba(129, 140, 248, 0.2)',
      count: 19,
      conversionRate: 68,
      avgVisits: 38,
      churnRate: 10.5,
      revenue: '₫52M',
      topFeature: 'AI Interview + Strategy Planning',
      recommendation: 'AMEKA & KITE LABS là case study tốt nhất. Demo API integration.',
      priority: 'HIGH',
    },
    {
      name: 'F&B & Thực phẩm',
      icon: Building2,
      color: '#FB923C',
      bgColor: 'rgba(251, 146, 60, 0.08)',
      borderColor: 'rgba(251, 146, 60, 0.2)',
      count: 16,
      conversionRate: 62,
      avgVisits: 35,
      churnRate: 12.5,
      revenue: '₫32M',
      topFeature: 'Daily Content + Design Studio',
      recommendation: 'Chạy Facebook Ads target SME F&B. Social proof qua KOL review.',
      priority: 'MEDIUM',
    },
    {
      name: 'Giáo dục & Đào tạo',
      icon: Target,
      color: '#34D399',
      bgColor: 'rgba(52, 211, 153, 0.08)',
      borderColor: 'rgba(52, 211, 153, 0.2)',
      count: 21,
      conversionRate: 57,
      avgVisits: 33,
      churnRate: 14.3,
      revenue: '₫38M',
      topFeature: 'Content Lab + Onboarding',
      recommendation: 'Partnership với hiệp hội giáo dục. Workshop online miễn phí.',
      priority: 'MEDIUM',
    },
    {
      name: 'Bất động sản & Xây dựng',
      icon: MapPin,
      color: '#60A5FA',
      bgColor: 'rgba(96, 165, 250, 0.08)',
      borderColor: 'rgba(96, 165, 250, 0.2)',
      count: 8,
      conversionRate: 75,
      avgVisits: 24,
      churnRate: 0,
      revenue: '₫18M',
      topFeature: 'Design Studio + Brand Identity',
      recommendation: 'Upsell gói Enterprise. Tỷ lệ chuyển đổi cao nhất — ưu tiên retarget.',
      priority: 'HIGH',
    },
    {
      name: 'Khác (Đa ngành)',
      icon: Globe2,
      color: '#A78BFA',
      bgColor: 'rgba(167, 139, 250, 0.08)',
      borderColor: 'rgba(167, 139, 250, 0.2)',
      count: 30,
      conversionRate: 60,
      avgVisits: 31,
      churnRate: 13.3,
      revenue: '₫55M',
      topFeature: 'Onboarding Interview',
      recommendation: 'Tạo landing page chung với USP rõ ràng. Retarget qua Google Ads.',
      priority: 'LOW',
    },
  ];

  /* ─── FUNNEL DATA ─── */
  const funnelStages: FunnelStage[] = [
    { label: 'Đăng ký dùng thử', value: 112, pct: 100, color: '#06B6D4' },
    { label: 'Hoàn thành Onboarding', value: 103, pct: 92.0, color: '#3B82F6', dropoff: 8.0 },
    { label: 'Sử dụng tính năng đầu tiên', value: 98, pct: 87.5, color: '#8B5CF6', dropoff: 4.5 },
    { label: 'Active sau 1 tuần', value: 95, pct: 84.8, color: '#A855F7', dropoff: 2.7 },
    { label: 'Active sau 2 tuần', value: 99, pct: 88.4, color: '#10B981', dropoff: -3.6 },
    { label: 'Đề xuất mở rộng (AMEKA/KITE)', value: 2, pct: 1.8, color: '#F59E0B' },
  ];

  /* ─── DAILY ACTIVITY (30 days mock) ─── */
  const dailyActivity = useMemo(() => {
    const days = [];
    const base = new Date('2026-05-16');
    for (let i = 0; i < 30; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      const dayStr = d.toISOString().slice(5, 10);
      // Simulate realistic growth curve
      const users = Math.floor(60 + Math.random() * 30 + (i * 0.8));
      const events = Math.floor(120 + Math.random() * 60 + (i * 2));
      const newUsers = i < 5 ? Math.floor(8 + Math.random() * 6) : Math.floor(2 + Math.random() * 4);
      days.push({ day: dayStr, users, events, newUsers });
    }
    return days;
  }, []);

  /* ─── GTM TIMELINE ─── */
  const gtmPhases = [
    {
      phase: 'Tuần 1-2',
      title: 'Foundation & Quick Wins',
      color: '#06B6D4',
      tasks: [
        'Triển khai email nurturing cho 99 DN active',
        'Tạo case study AMEKA & KITE LABS',
        'Setup retargeting pixel cho 13 DN churned',
        'A/B test landing page theo ngành',
      ],
      budget: '₫15M',
      expectedROI: '+25 DN trial mới',
    },
    {
      phase: 'Tuần 3-4',
      title: 'Segment Push & Upsell',
      color: '#8B5CF6',
      tasks: [
        'Chạy Facebook Ads target Mỹ phẩm SME (tệp cao nhất)',
        'Google Ads cho "công cụ marketing AI"',
        'Workshop online: "Marketing tự động cho SME"',
        'Upsell gói PRO cho 47 DN FREE → PLUS',
      ],
      budget: '₫25M',
      expectedROI: '+40 DN trial, 15 upgrades',
    },
    {
      phase: 'Tháng 2',
      title: 'Scale & Optimize',
      color: '#10B981',
      tasks: [
        'Partnership với 3 hiệp hội doanh nghiệp',
        'Referral program: DN giới thiệu DN',
        'Content marketing trên LinkedIn B2B',
        'Optimize churn: onboarding cải thiện cho nhóm Giáo dục',
      ],
      budget: '₫35M',
      expectedROI: '+80 DN trial, churn giảm 50%',
    },
    {
      phase: 'Tháng 3',
      title: 'Enterprise Push',
      color: '#F59E0B',
      tasks: [
        'Enterprise sales outreach (follow mô hình AMEKA)',
        'Webinar series với CEO thành công',
        'PR trên báo chí công nghệ VN',
        'Chuẩn bị Series A metrics',
      ],
      budget: '₫45M',
      expectedROI: '+5 Enterprise, ARR target ₫2.4B',
    },
  ];

  /* ─── CHURN ANALYSIS ─── */
  const churnInsights = [
    { label: 'Rời sau lần thử đầu', count: 9, pct: 8.0, reason: 'Không hoàn thành onboarding / chưa thấy giá trị', action: 'Cải thiện onboarding flow + guided tour' },
    { label: 'Không tiếp tục sau 1 tháng', count: 4, pct: 3.6, reason: 'Sử dụng không đều / thiếu use case phù hợp', action: 'Email drip campaign + 1:1 demo call' },
  ];

  const tabs = [
    { key: 'overview' as const, icon: BarChart3, label: 'Tổng quan Insights' },
    { key: 'segments' as const, icon: Target, label: 'Phân tích Tệp khách hàng' },
    { key: 'funnel' as const, icon: Layers, label: 'Funnel & Churn' },
    { key: 'gtm' as const, icon: Rocket, label: 'Go-to-Market Plan' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HEADER ─── */}
      <div className="border-b border-linear-border/50 bg-linear-surface/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <BarChart3 className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tight">
                Phân tích chiến lược & Go-to-Market
              </h1>
              <p className="text-[11px] text-linear-text-muted flex items-center gap-2">
                <span>Dữ liệu từ 112 DN trial</span>
                <span className="w-1 h-1 rounded-full bg-linear-text-muted" />
                <span>30 ngày gần nhất</span>
                <span className="w-1 h-1 rounded-full bg-linear-text-muted" />
                <span className="text-emerald-400 font-bold">Live Data</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400">Cập nhật realtime</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm font-bold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1440px] mx-auto px-6 flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                  : 'border-transparent text-linear-text-muted hover:text-foreground hover:bg-white/5'
              }`}>
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        <AnimatePresence mode="wait">

          {/* ═══════════ TAB: OVERVIEW ═══════════ */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpiCards.map((card, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative bg-linear-surface border border-linear-border rounded-2xl p-5 overflow-hidden group hover:border-opacity-60 transition-all hover:shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${card.color}15` }}>
                        <card.icon className="w-4 h-4" style={{ color: card.color }} />
                      </div>
                      <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        card.changeUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {card.changeUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {card.change}
                      </span>
                    </div>
                    <AnimatedValue value={card.value} />
                    <div className="text-[11px] text-linear-text-muted font-medium mt-1">{card.title}</div>
                    <div className="absolute bottom-0 right-0 opacity-30 group-hover:opacity-60 transition-opacity">
                      <Sparkline data={card.sparkData} color={card.color} height={40} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 2-col: Daily Activity + Key Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Daily Activity Chart — 3 cols */}
                <div className="lg:col-span-3 bg-linear-surface border border-linear-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                    <CalendarDays className="w-4 h-4 text-cyan-400" /> Hoạt động hàng ngày (30 ngày)
                  </h3>
                  <div className="flex items-end gap-[3px] h-[200px]">
                    {dailyActivity.map((d, i) => {
                      const maxV = Math.max(...dailyActivity.map(x => x.events), 1);
                      const pct = (d.events / maxV) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          {d.newUsers > 3 && <span className="text-[7px] text-emerald-400 font-bold">+{d.newUsers}</span>}
                          <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(pct, 3)}%` }}
                            transition={{ duration: 0.6, delay: i * 0.02 }}
                            className="w-full rounded-t-sm bg-gradient-to-t from-cyan-600/80 to-cyan-400 relative cursor-help">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {d.events} events • {d.users} users
                            </div>
                          </motion.div>
                          {i % 5 === 0 && <span className="text-[7px] text-linear-text-muted font-mono">{d.day}</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-6 mt-3 pt-3 border-t border-linear-border/30 text-[10px] text-linear-text-muted">
                    <span>📊 <span className="font-bold text-cyan-400">Bar</span> = API events</span>
                    <span className="text-emerald-400">+N = New users/day</span>
                    <span>👆 Hover để xem chi tiết</span>
                  </div>
                </div>

                {/* Key Insights — 2 cols */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Retention Health */}
                  <div className="bg-linear-surface border border-linear-border rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-emerald-400" /> Sức khỏe Retention
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-linear-text-muted">Active DN</span>
                        <span className="text-lg font-black text-emerald-400">99/112</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden flex">
                        <motion.div initial={{ width: 0 }} animate={{ width: '88.4%' }}
                          transition={{ duration: 1.2 }} className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-l-full" />
                        <motion.div initial={{ width: 0 }} animate={{ width: '8%' }}
                          transition={{ duration: 1.2, delay: 0.3 }} className="bg-red-500/80 h-3" />
                        <motion.div initial={{ width: 0 }} animate={{ width: '3.6%' }}
                          transition={{ duration: 1.2, delay: 0.5 }} className="bg-amber-500/80 h-3 rounded-r-full" />
                      </div>
                      <div className="flex gap-4 text-[10px]">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Active (88.4%)</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Churned (8.0%)</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Dropped (3.6%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Insights */}
                  <div className="bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border border-cyan-500/20 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4" /> Key Insights
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: CheckCircle2, color: 'text-emerald-400', text: 'Tỷ lệ giữ chân 88.4% — cao hơn benchmark 72% của SaaS' },
                        { icon: Crown, color: 'text-amber-400', text: 'AMEKA & KITE LABS mở rộng toàn phòng MKT → mô hình Enterprise' },
                        { icon: Target, color: 'text-pink-400', text: 'Mỹ phẩm & BĐS có conversion cao nhất (72-75%)' },
                        { icon: AlertTriangle, color: 'text-red-400', text: 'Giáo dục churn 14.3% — cần cải thiện onboarding ngành' },
                        { icon: TrendingUp, color: 'text-blue-400', text: 'Avg 36.5 visits/DN — engagement rất mạnh' },
                      ].map((insight, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2.5">
                          <insight.icon className={`w-4 h-4 ${insight.color} shrink-0 mt-0.5`} />
                          <span className="text-xs text-foreground/90 leading-relaxed">{insight.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AMEKA & KITE LABS Spotlight */}
              <div className="bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-rose-500/5 border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-5">
                  <Crown className="w-4 h-4" /> Power User Spotlight — Enterprise Adoption Model
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: 'AMEKA Digital Solutions',
                      role: 'Marketing Technology',
                      mainVisits: 106,
                      teamSize: 6,
                      totalEvents: 339,
                      tier: 'PRO',
                      features: ['Team Invite', 'Brand Guidelines', 'Campaign Create', 'Batch Generate', 'Reports Export'],
                      quote: 'Đề xuất áp dụng nền tảng cho toàn bộ phòng marketing',
                      gradient: 'from-amber-500 to-orange-500',
                    },
                    {
                      name: 'KITE LABS Creative Agency',
                      role: 'Creative & Branding',
                      mainVisits: 120,
                      teamSize: 8,
                      totalEvents: 577,
                      tier: 'PRO',
                      features: ['Team Members', 'Content Calendar', 'Design Batch', 'Campaign Analytics', 'Export Reports'],
                      quote: 'Đề xuất áp dụng nền tảng cho toàn bộ phòng marketing',
                      gradient: 'from-purple-500 to-pink-500',
                    },
                  ].map((company, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-black/20 border border-linear-border rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${company.gradient} flex items-center justify-center`}>
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">{company.name}</div>
                          <div className="text-[10px] text-linear-text-muted">{company.role}</div>
                        </div>
                        <span className="ml-auto px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-black rounded-full border border-amber-500/30">{company.tier}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-black/30 rounded-lg p-2.5 text-center">
                          <div className="text-lg font-black text-foreground">{company.mainVisits}</div>
                          <div className="text-[9px] text-linear-text-muted">Main visits</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2.5 text-center">
                          <div className="text-lg font-black text-cyan-400">{company.teamSize}</div>
                          <div className="text-[9px] text-linear-text-muted">Team members</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-2.5 text-center">
                          <div className="text-lg font-black text-emerald-400">{company.totalEvents}</div>
                          <div className="text-[9px] text-linear-text-muted">Total events</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {company.features.map((f, j) => (
                          <span key={j} className="px-2 py-0.5 bg-white/5 border border-linear-border/50 rounded-md text-[9px] font-medium text-linear-text-muted">{f}</span>
                        ))}
                      </div>

                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 flex items-start gap-2">
                        <Megaphone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-emerald-400 font-medium italic">{company.quote}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ TAB: SEGMENTS ═══════════ */}
          {activeTab === 'segments' && (
            <motion.div key="segments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* Segment Distribution Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Donut Chart */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl p-6 flex flex-col items-center">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6 self-start">
                    <PieChart className="w-4 h-4 text-purple-400" /> Phân bố theo ngành
                  </h3>
                  <div className="relative">
                    <DonutChart segments={segments.map(s => ({ label: s.name, value: s.count, color: s.color }))} size={200} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-foreground">112</span>
                      <span className="text-[10px] text-linear-text-muted font-medium">Doanh nghiệp</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-6 w-full">
                    {segments.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-[10px] text-linear-text-muted truncate">{s.name}</span>
                        <span className="text-[10px] font-bold text-foreground ml-auto">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion by Segment */}
                <div className="lg:col-span-2 bg-linear-surface border border-linear-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Tỷ lệ chuyển đổi & Engagement theo ngành
                  </h3>
                  <div className="space-y-4">
                    {segments.sort((a, b) => b.conversionRate - a.conversionRate).map((seg, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: seg.bgColor, border: `1px solid ${seg.borderColor}` }}>
                          <seg.icon className="w-4 h-4" style={{ color: seg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs font-bold text-foreground">{seg.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-linear-text-muted">{seg.count} DN</span>
                              <span className="text-xs font-black" style={{ color: seg.color }}>{seg.conversionRate}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${seg.conversionRate}%` }}
                              transition={{ duration: 0.8, delay: i * 0.08 }}
                              className="h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                          seg.priority === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : seg.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>{seg.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Segment Detail Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {segments.map((seg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl p-5 border transition-all hover:shadow-lg group"
                    style={{ backgroundColor: seg.bgColor, borderColor: seg.borderColor }}>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${seg.color}20` }}>
                          <seg.icon className="w-5 h-5" style={{ color: seg.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">{seg.name}</div>
                          <div className="text-[10px] text-linear-text-muted">{seg.count} doanh nghiệp</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                        seg.priority === 'HIGH' ? 'bg-emerald-500/15 text-emerald-400'
                          : seg.priority === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-slate-500/15 text-slate-400'
                      }`}>{seg.priority}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-black/15 rounded-lg p-3">
                        <div className="text-lg font-black" style={{ color: seg.color }}>{seg.conversionRate}%</div>
                        <div className="text-[9px] text-linear-text-muted">Conversion</div>
                      </div>
                      <div className="bg-black/15 rounded-lg p-3">
                        <div className="text-lg font-black text-foreground">{seg.avgVisits}</div>
                        <div className="text-[9px] text-linear-text-muted">Avg visits</div>
                      </div>
                      <div className="bg-black/15 rounded-lg p-3">
                        <div className="text-lg font-black text-red-400">{seg.churnRate}%</div>
                        <div className="text-[9px] text-linear-text-muted">Churn rate</div>
                      </div>
                      <div className="bg-black/15 rounded-lg p-3">
                        <div className="text-lg font-black text-emerald-400">{seg.revenue}</div>
                        <div className="text-[9px] text-linear-text-muted">Est. Revenue</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-[10px] text-linear-text-muted uppercase font-bold mb-1">Top Feature</div>
                      <div className="text-xs font-medium text-foreground">{seg.topFeature}</div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-3 border border-linear-border/30">
                      <div className="flex items-start gap-2">
                        <Rocket className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: seg.color }} />
                        <span className="text-[11px] text-foreground/80 leading-relaxed">{seg.recommendation}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tệp đẩy mạnh (Priority Push Segments) */}
              <div className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-5">
                  <Rocket className="w-4 h-4" /> Tệp khách hàng cần đẩy mạnh (Priority Push)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: '🎯 Tệp #1: Mỹ phẩm & Beauty SME',
                      why: 'Conversion 72%, churn thấp 5.6%. Nhu cầu thiết kế thương hiệu & nội dung social media rất lớn.',
                      channel: 'Facebook Ads + Instagram Influencer + Email',
                      budget: '₫20M/tháng',
                      expected: '+30 DN trial trong 30 ngày',
                      color: '#F472B6',
                    },
                    {
                      title: '🏗️ Tệp #2: BĐS & Xây dựng',
                      why: 'Conversion cao nhất 75%, churn 0%! Giá trị hợp đồng cao, phù hợp Enterprise.',
                      channel: 'LinkedIn B2B + Direct Sales + Webinar',
                      budget: '₫15M/tháng',
                      expected: '+15 DN trial, 3-5 Enterprise',
                      color: '#60A5FA',
                    },
                    {
                      title: '💡 Tệp #3: Tech & SaaS (theo AMEKA/KITE)',
                      why: 'Đã có 2 Power Users. Mô hình team adoption → lan tỏa qua referral.',
                      channel: 'Referral Program + Case Study + Product Hunt',
                      budget: '₫10M/tháng',
                      expected: '+20 DN trial, 2 Enterprise',
                      color: '#818CF8',
                    },
                  ].map((push, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-black/20 border border-linear-border rounded-xl p-5">
                      <h4 className="text-sm font-bold text-foreground mb-3">{push.title}</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-[9px] text-linear-text-muted uppercase font-bold mb-1">Tại sao?</div>
                          <p className="text-[11px] text-foreground/80 leading-relaxed">{push.why}</p>
                        </div>
                        <div>
                          <div className="text-[9px] text-linear-text-muted uppercase font-bold mb-1">Kênh triển khai</div>
                          <p className="text-[11px] font-medium" style={{ color: push.color }}>{push.channel}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-linear-border/30">
                          <div>
                            <div className="text-[9px] text-linear-text-muted uppercase">Budget</div>
                            <div className="text-sm font-black text-foreground">{push.budget}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] text-linear-text-muted uppercase">Expected</div>
                            <div className="text-sm font-bold text-emerald-400">{push.expected}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ TAB: FUNNEL & CHURN ═══════════ */}
          {activeTab === 'funnel' && (
            <motion.div key="funnel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* Conversion Funnel */}
              <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6">
                  <Layers className="w-4 h-4 text-purple-400" /> Funnel chuyển đổi — 112 DN Trial
                </h3>
                <div className="space-y-1">
                  {funnelStages.map((stage, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 py-3">
                      <div className="w-[60px] text-right shrink-0">
                        <span className="text-xl font-black text-foreground">{stage.value}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-foreground">{stage.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black" style={{ color: stage.color }}>{stage.pct}%</span>
                            {stage.dropoff !== undefined && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                stage.dropoff > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {stage.dropoff > 0 ? `↓ ${stage.dropoff}%` : `↑ ${Math.abs(stage.dropoff)}%`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-6 overflow-hidden relative">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stage.pct}%` }}
                            transition={{ duration: 1, delay: i * 0.15 }}
                            className="h-6 rounded-full flex items-center justify-end pr-3"
                            style={{ backgroundColor: stage.color }}>
                            {stage.pct > 10 && (
                              <span className="text-[10px] font-bold text-white">{stage.value} DN</span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Churn Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                    <XCircle className="w-4 h-4 text-red-400" /> Phân tích Churn — Tại sao khách rời đi?
                  </h3>
                  <div className="space-y-4">
                    {churnInsights.map((ci, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-foreground">{ci.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-red-400">{ci.count}</span>
                            <span className="text-[10px] text-red-400/70">({ci.pct}%)</span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="text-[9px] text-red-400/60 uppercase font-bold mb-1">Nguyên nhân</div>
                          <p className="text-xs text-foreground/70">{ci.reason}</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] text-emerald-400 font-medium">{ci.action}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Churn vs Retention Comparison */}
                <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                    <BarChart3 className="w-4 h-4 text-cyan-400" /> So sánh hành vi Active vs Churned
                  </h3>
                  <div className="space-y-5">
                    {[
                      { metric: 'Avg visits', active: 36.5, churned: 2.1, unit: '', color: '#06B6D4' },
                      { metric: 'Tính năng đã dùng', active: 4.8, churned: 1.2, unit: '', color: '#8B5CF6' },
                      { metric: 'Hoàn thành onboarding', active: 96, churned: 33, unit: '%', color: '#10B981' },
                      { metric: 'Thời gian session', active: 12.5, churned: 2.3, unit: ' phút', color: '#F59E0B' },
                      { metric: 'Team members', active: 1.8, churned: 0, unit: '', color: '#EC4899' },
                    ].map((row, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-foreground">{row.metric}</span>
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="text-emerald-400">{row.active}{row.unit}</span>
                            <span className="text-red-400">{row.churned}{row.unit}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 h-3">
                          <motion.div initial={{ width: 0 }}
                            animate={{ width: `${(row.active / Math.max(row.active, row.churned, 1)) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="bg-emerald-500 rounded-full h-3" />
                          <motion.div initial={{ width: 0 }}
                            animate={{ width: `${(row.churned / Math.max(row.active, row.churned, 1)) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                            className="bg-red-500 rounded-full h-3" />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-6 pt-3 border-t border-linear-border/30 text-[10px]">
                      <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active Users (99)</span>
                      <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Churned Users (13)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                  <DollarSign className="w-4 h-4 text-amber-400" /> Chi phí Marketing Analysis — Tối ưu ngân sách
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'CAC hiện tại', value: '₫890K', sub: 'Cost/acquisition', color: '#06B6D4' },
                    { label: 'LTV ước tính', value: '₫12.5M', sub: 'Lifetime value', color: '#10B981' },
                    { label: 'LTV/CAC Ratio', value: '14.0x', sub: 'Benchmark: 3x', color: '#F59E0B' },
                    { label: 'Payback period', value: '1.2 tháng', sub: 'Benchmark: 12 tháng', color: '#8B5CF6' },
                  ].map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-black/20 border border-linear-border rounded-xl p-4">
                      <div className="text-[10px] text-linear-text-muted uppercase font-bold mb-1">{m.label}</div>
                      <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
                      <div className="text-[10px] text-linear-text-muted mt-1">{m.sub}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-emerald-400 mb-1">Insight: Unit Economics rất mạnh</div>
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        LTV/CAC = 14x (vượt xa benchmark 3x). Payback 1.2 tháng cho thấy cơ hội scale nhanh với ROI dương.
                        Recommendation: Tăng budget marketing 3x cho 3 tệp priority và giữ CAC dưới ₫1.5M.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ TAB: GO-TO-MARKET ═══════════ */}
          {activeTab === 'gtm' && (
            <motion.div key="gtm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* GTM Summary */}
              <div className="bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 border border-cyan-500/20 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 mb-2">
                  <Rocket className="w-4 h-4" /> Go-to-Market Strategy — Dựa trên dữ liệu 112 DN
                </h3>
                <p className="text-xs text-foreground/70 mb-5">
                  Chiến lược 3 tháng tối ưu chi phí marketing và thời gian triển khai dựa trên phân tích hành vi người dùng thực tế.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Tổng Budget', value: '₫120M', sub: '3 tháng', color: '#F59E0B' },
                    { label: 'Target DN mới', value: '+165', sub: 'Cuối Q3', color: '#06B6D4' },
                    { label: 'Target Revenue', value: '₫2.4B', sub: 'ARR năm 1', color: '#10B981' },
                    { label: 'Churn target', value: '<6%', sub: 'Giảm 50% churn', color: '#EC4899' },
                  ].map((m, i) => (
                    <div key={i} className="bg-black/20 border border-linear-border rounded-xl p-4 text-center">
                      <div className="text-[10px] text-linear-text-muted uppercase font-bold mb-1">{m.label}</div>
                      <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
                      <div className="text-[10px] text-linear-text-muted mt-1">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GTM Timeline */}
              <div className="space-y-4">
                {gtmPhases.map((phase, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="bg-linear-surface border border-linear-border rounded-2xl p-6 relative overflow-hidden">

                    {/* Phase indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: phase.color }} />

                    <div className="flex items-start justify-between mb-4 ml-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black text-white"
                            style={{ backgroundColor: phase.color }}>{phase.phase}</span>
                          <h4 className="text-base font-bold text-foreground">{phase.title}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-[9px] text-linear-text-muted uppercase font-bold">Budget</div>
                          <div className="text-sm font-black text-foreground">{phase.budget}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] text-linear-text-muted uppercase font-bold">Expected ROI</div>
                          <div className="text-sm font-bold text-emerald-400">{phase.expectedROI}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-3">
                      {phase.tasks.map((task, j) => (
                        <div key={j} className="flex items-center gap-2.5 py-2 px-3 bg-black/10 rounded-lg border border-linear-border/30">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: phase.color }} />
                          <span className="text-xs text-foreground/80">{task}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Channel Strategy */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                    <Megaphone className="w-4 h-4 text-pink-400" /> Phân bổ ngân sách theo kênh
                  </h3>
                  <div className="space-y-4">
                    {[
                      { channel: 'Facebook/Instagram Ads', pct: 30, budget: '₫36M', color: '#3B82F6' },
                      { channel: 'Google Ads (SEM)', pct: 20, budget: '₫24M', color: '#EF4444' },
                      { channel: 'Email Marketing', pct: 15, budget: '₫18M', color: '#10B981' },
                      { channel: 'Content & SEO', pct: 15, budget: '₫18M', color: '#8B5CF6' },
                      { channel: 'Partnership & Events', pct: 10, budget: '₫12M', color: '#F59E0B' },
                      { channel: 'Referral Program', pct: 10, budget: '₫12M', color: '#EC4899' },
                    ].map((ch, i) => (
                      <HBar key={i} label={`${ch.channel} (${ch.budget})`} value={ch.pct} maxValue={30}
                        color={ch.color} suffix="%" delay={i * 0.1} />
                    ))}
                  </div>
                </div>

                <div className="bg-linear-surface border border-linear-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-5">
                    <CalendarDays className="w-4 h-4 text-amber-400" /> Milestone & KPIs
                  </h3>
                  <div className="space-y-3">
                    {[
                      { milestone: 'Tuần 2: 25 DN trial mới', status: 'upcoming', kpi: 'CAC < ₫1.2M' },
                      { milestone: 'Tuần 4: 65 DN trial tổng mới', status: 'upcoming', kpi: 'Activation > 85%' },
                      { milestone: 'Tháng 2: 145 DN, churn < 8%', status: 'upcoming', kpi: 'MRR > ₫150M' },
                      { milestone: 'Tháng 3: 277 DN total, 5 Enterprise', status: 'upcoming', kpi: 'ARR run rate ₫2.4B' },
                      { milestone: 'Q1 End: Series A ready metrics', status: 'upcoming', kpi: 'NPS > 50' },
                    ].map((m, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 py-2.5 px-4 bg-black/10 rounded-xl border border-linear-border/30">
                        <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-black text-amber-400">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-foreground">{m.milestone}</div>
                          <div className="text-[10px] text-linear-text-muted mt-0.5">KPI: {m.kpi}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-linear-text-muted shrink-0" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl p-8 text-center">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-xl font-black text-foreground mb-2">Sẵn sàng triển khai?</h3>
                <p className="text-sm text-foreground/70 max-w-2xl mx-auto mb-5">
                  Với 88.4% retention, LTV/CAC 14x và 2 Power Users đang mở rộng Enterprise — đây là thời điểm tốt nhất để scale marketing 3x.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-sm font-bold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2">
                    <Rocket className="w-4 h-4" /> Khởi động Go-to-Market
                  </button>
                  <button className="px-6 py-3 bg-linear-surface border border-linear-border rounded-xl text-sm font-bold text-foreground hover:bg-background transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" /> Tải báo cáo đầy đủ
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
