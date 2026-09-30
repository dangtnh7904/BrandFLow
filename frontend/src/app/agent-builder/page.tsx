"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, Search, Code, Play, CheckCircle2, MessageSquare, 
  Loader2, ArrowLeft, TrendingUp, Users, BarChart3, Target, 
  Globe, Database, Shield, Lightbulb, PieChart, Megaphone, FileSearch,
  Cpu, Zap, ChevronRight, X, Send, Hexagon, Network, GitPullRequest, LayoutTemplate, Activity, Workflow
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ── Enterprise-grade Capability Registry ──────────────────────────────────
const CAPABILITY_REGISTRY = [
  {
    category: 'Phân tích & Dữ liệu',
    categoryIcon: Database,
    items: [
      {
        id: 'data_analysis',
        name: 'Python Data Analyst',
        subtitle: 'Zero Hallucination Engine',
        icon: Code,
        color: 'indigo',
        description: 'Ép AI tự viết và chạy code Python (Pandas, NumPy) ngầm để tính toán chính xác 100%. Xử lý CSV, Excel, phân tích cohort, RFM, churn prediction.',
      },
      {
        id: 'financial_modeling',
        name: 'Financial Modeler',
        subtitle: 'CFO-Grade Analytics',
        icon: TrendingUp,
        color: 'emerald',
        description: 'Xây dựng mô hình tài chính: DCF, P&L projection, unit economics, CAC/LTV modeling, break-even analysis tự động từ dữ liệu thực.',
      },
      {
        id: 'market_sizing',
        name: 'Market Sizing Engine',
        subtitle: 'TAM/SAM/SOM Calculator',
        icon: PieChart,
        color: 'violet',
        description: 'Ước lượng quy mô thị trường theo phương pháp Top-down & Bottom-up. Tính TAM, SAM, SOM tự động kèm confidence interval.',
      },
    ]
  },
  {
    category: 'Nghiên cứu & Intelligence',
    categoryIcon: Search,
    items: [
      {
        id: 'web_search',
        name: 'Live Web Research',
        subtitle: 'Fact-Checked Intelligence',
        icon: Globe,
        color: 'cyan',
        description: 'Cấp quyền cho AI tìm kiếm Internet real-time để lấy số liệu thực tế. Bắt buộc trích dẫn URL nguồn. Hỗ trợ DuckDuckGo + Tavily.',
      },
      {
        id: 'competitor_intel',
        name: 'Competitor Intelligence',
        subtitle: 'CI/CD for Strategy',
        icon: Target,
        color: 'rose',
        description: 'Theo dõi và phân tích chiến lược đối thủ: pricing, positioning, messaging, marketing mix. So sánh feature-by-feature tự động.',
      },
      {
        id: 'niche_knowledge',
        name: 'Niche Knowledge RAG',
        subtitle: 'Internal Knowledge Base',
        icon: FileSearch,
        color: 'amber',
        description: 'Tìm kiếm trong cơ sở kiến thức nội bộ của doanh nghiệp. Truy xuất tài liệu chiến lược, báo cáo nghiên cứu, playbook đã upload.',
      },
    ]
  },
  {
    category: 'Marketing & Growth',
    categoryIcon: Megaphone,
    items: [
      {
        id: 'content_strategy',
        name: 'Content Strategist',
        subtitle: 'Editorial Intelligence',
        icon: Lightbulb,
        color: 'orange',
        description: 'Phân tích content gap, đề xuất content pillar, lên editorial calendar. Optimize cho SEO + Social engagement dựa trên data thực.',
      },
      {
        id: 'customer_insights',
        name: 'Customer Insights',
        subtitle: 'Voice of Customer AI',
        icon: Users,
        color: 'sky',
        description: 'Phân tích persona, customer journey mapping, sentiment analysis. Tổng hợp insight từ review, survey, NPS feedback tự động.',
      },
      {
        id: 'campaign_optimizer',
        name: 'Campaign Optimizer',
        subtitle: 'ROAS Maximizer',
        icon: BarChart3,
        color: 'fuchsia',
        description: 'Tối ưu chiến dịch quảng cáo: phân bổ ngân sách, A/B testing framework, attribution modeling, ROAS/CPA prediction.',
      },
      {
        id: 'brand_health',
        name: 'Brand Health Monitor',
        subtitle: 'Equity Tracker',
        icon: Shield,
        color: 'teal',
        description: 'Theo dõi sức khỏe thương hiệu: brand awareness, recall, sentiment, share of voice. Benchmark với ngành và đối thủ.',
      },
    ]
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; ring: string; glow: string }> = {
  indigo:  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-500', ring: 'ring-indigo-500/20', glow: 'shadow-indigo-500/10' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-500', ring: 'ring-emerald-500/20', glow: 'shadow-emerald-500/10' },
  violet:  { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-500', ring: 'ring-violet-500/20', glow: 'shadow-violet-500/10' },
  cyan:    { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-500', ring: 'ring-cyan-500/20', glow: 'shadow-cyan-500/10' },
  rose:    { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-500', ring: 'ring-rose-500/20', glow: 'shadow-rose-500/10' },
  amber:   { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500', ring: 'ring-amber-500/20', glow: 'shadow-amber-500/10' },
  orange:  { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500', ring: 'ring-orange-500/20', glow: 'shadow-orange-500/10' },
  sky:     { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-500', ring: 'ring-sky-500/20', glow: 'shadow-sky-500/10' },
  fuchsia: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', text: 'text-fuchsia-500', ring: 'ring-fuchsia-500/20', glow: 'shadow-fuchsia-500/10' },
  teal:    { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-500', ring: 'ring-teal-500/20', glow: 'shadow-teal-500/10' },
};

// ── Enterprise C-Suite Preset Templates ───────────────────────────────────
const AGENT_TEMPLATES = [
  { 
    name: 'VP of Strategy', 
    role: 'Phó Chủ tịch Chiến lược — Enterprise Strategic Planning', 
    prompt: 'Bạn là VP of Strategy với 15+ năm kinh nghiệm tại Big 3 (McKinsey/BCG/Bain). Phân tích chiến lược theo framework: PESTLE → Porter\'s 5 Forces → SWOT → Ansoff Matrix. Mọi đề xuất phải kèm Executive Summary, Strategic Rationale, Risk Assessment, và Implementation Roadmap. LUÔN đưa ra 2 kịch bản (Optimistic/Conservative) với confidence level. Tham chiếu case study thực tế khi phù hợp.',
    tools: ['web_search', 'competitor_intel', 'market_sizing', 'niche_knowledge', 'data_analysis'],
  },
  { 
    name: 'CFO Advisor', 
    role: 'Cố vấn Tài chính — Enterprise Financial Intelligence', 
    prompt: 'Bạn là CFO Advisor chuyên tư vấn tài chính cho doanh nghiệp Enterprise. LUÔN viết code Python để tính toán — KHÔNG BAO GIỜ tự nhẩm tính. Hỗ trợ: DCF valuation, P&L projection, unit economics (CAC/LTV/ARPU/MRR/ARR), break-even analysis, sensitivity analysis, scenario modeling, budget allocation optimization. Output phải có bảng số liệu rõ ràng, đơn vị VND, và so sánh benchmark ngành.',
    tools: ['data_analysis', 'financial_modeling', 'market_sizing', 'web_search'],
  },
  { 
    name: 'Growth CMO', 
    role: 'CMO Tăng trưởng — Full-Funnel Growth Strategy', 
    prompt: 'Bạn là Growth CMO với expertise về Product-Led Growth và full-funnel optimization. Phân tích theo AARRR framework (Acquisition → Activation → Retention → Revenue → Referral). Đề xuất phải kèm: channel mix optimization, CAC payback period, LTV:CAC ratio target, và media plan chi tiết. Ưu tiên các kênh có ROI cao nhất cho thị trường Việt Nam (Zalo, TikTok, Facebook, Google). Mỗi đề xuất kèm estimated ROAS và timeline.',
    tools: ['web_search', 'data_analysis', 'campaign_optimizer', 'content_strategy', 'brand_health', 'customer_insights'],
  },
  { 
    name: 'Brand Architect', 
    role: 'Kiến trúc sư Thương hiệu — Enterprise Brand Strategy', 
    prompt: 'Bạn là Brand Architect chuyên xây dựng brand architecture cho các tập đoàn lớn. Phân tích: brand positioning (Keller\'s CBBE Model), brand architecture (House of Brands vs Branded House), messaging framework, brand equity measurement. Theo dõi brand health metrics: awareness, consideration, preference, loyalty. Mọi đề xuất phải consistent với Brand DNA và strict rules của doanh nghiệp.',
    tools: ['brand_health', 'competitor_intel', 'customer_insights', 'content_strategy', 'niche_knowledge'],
  },
  { 
    name: 'Market Intelligence', 
    role: 'Giám đốc Tình báo Thị trường — Competitive Intelligence', 
    prompt: 'Bạn là Market Intelligence Director chuyên thu thập và phân tích thông tin cạnh tranh cho Board of Directors. Deliverables: TAM/SAM/SOM sizing, competitive landscape mapping, market trend analysis, whitespace identification. BẮT BUỘC trích dẫn nguồn (URL) cho mọi số liệu. Phân tích phải có depth tương đương báo cáo của Nielsen/Kantar.',
    tools: ['web_search', 'competitor_intel', 'market_sizing', 'customer_insights', 'data_analysis'],
  },
  { 
    name: 'Revenue Ops Leader', 
    role: 'Revenue Operations — Data-Driven Revenue Growth', 
    prompt: 'Bạn là Revenue Operations Leader chuyên tối ưu pipeline và revenue efficiency cho Enterprise. Phân tích: conversion funnel optimization, sales/marketing alignment, pipeline velocity, win rate analysis, pricing strategy. LUÔN dùng Python để tính toán metrics. Output: actionable recommendations kèm expected revenue impact (VND) và implementation priority (P0/P1/P2).',
    tools: ['data_analysis', 'financial_modeling', 'campaign_optimizer', 'customer_insights', 'web_search'],
  },
];

export default function AgentBuilderPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

  const [testMessage, setTestMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ role: string; content: string }[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'templates'>('config');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isTesting, loadingStep]);

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => {
      const next = new Set(prev);
      if (next.has(toolId)) next.delete(toolId);
      else next.add(toolId);
      return next;
    });
  };

  const applyTemplate = (tpl: typeof AGENT_TEMPLATES[0]) => {
    setName(tpl.name);
    setRole(tpl.role);
    setPrompt(tpl.prompt);
    setSelectedTools(new Set(tpl.tools));
    setActiveTab('config');
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleTestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage.trim() || isTesting) return;

    const userMsg = testMessage.trim();
    setChatLog(prev => [...prev, { role: 'user', content: userMsg }]);
    setTestMessage('');
    setIsTesting(true);

    try {
      // Professional Mock Delays to simulate real enterprise AI thought process
      setLoadingStep('Parsing objective logic & context...');
      await sleep(1500);
      
      const toolNames = Array.from(selectedTools);
      if (toolNames.includes('data_analysis') || toolNames.includes('financial_modeling')) {
         setLoadingStep('Executing Python data environment...');
         await sleep(2000);
      }
      if (toolNames.includes('web_search')) {
         setLoadingStep('Running concurrent web queries...');
         await sleep(2500);
         setLoadingStep('Cross-referencing verified sources...');
         await sleep(1500);
      }
      
      setLoadingStep('Synthesizing executive report...');
      await sleep(1500);
      
      let response = `## Executive Summary\nBộ xử lý **${name || 'Agent'}** đã hoàn tất phân tích yêu cầu.\n\n`;
      
      if (toolNames.includes('data_analysis') || toolNames.includes('financial_modeling')) {
        response += `### Financial Performance Dashboard\n| Chỉ số | Giá trị thực tế | Benchmark Ngành | Đánh giá |\n|---|---|---|---|\n| Conversion Rate | **3.2%** (↑12% MoM) | 2.5% | +0.7pp (Tốt) |\n| AOV | **1,185,000 VND** | 950,000 VND | +24.7% (Tốt) |\n| CAC | **245,000 VND** | 180,000 VND | +36% (Cần chú ý) |\n| LTV | **7,125,000 VND** | 5,200,000 VND | +37% (Tốt) |\n| LTV:CAC Ratio | **29.1x** | 15x | Tối ưu |\n\n**Actionable Insight:** LTV:CAC ratio vượt benchmark 2x cho thấy unit economics rất khoẻ. Tuy nhiên CAC đang cao hơn ngành 36% — khuyến nghị tối ưu channel mix để đưa CAC về mức <200k VND.\n\n`;
      }
      if (toolNames.includes('web_search')) {
        response += `### Market Intelligence Report\n- **Quy mô thị trường:** TAM = 12.5 tỷ USD (Việt Nam, 2026) — CAGR 18.2% *(Nguồn: Statista 2026)*\n- **Segment dẫn đầu:** Digital-first brands tăng trưởng 2.3x so với traditional *(Nguồn: McKinsey SEA Report)*\n- **Xu hướng #1:** Trải nghiệm cá nhân hóa — 67% enterprise đã áp dụng *(Nguồn: Gartner 2026)*\n\n`;
      }
      if (toolNames.includes('competitor_intel')) {
        response += `### Competitive Landscape Analysis\n| Đối thủ | Định vị | Market Share | Động thái gần đây |\n|---|---|---|---|\n| **Competitor A** | Price Leader | ~18% | Giảm giá 20%, focus SMB segment |\n| **Competitor B** | Innovation Leader | ~22% | Tích hợp tính năng mới, nhắm Enterprise |\n\n**Strategic Alert:** Competitor B đang đầu tư mạnh vào công nghệ — khuyến nghị tăng tốc R&D để duy trì lợi thế.\n\n`;
      }
      if (toolNames.includes('market_sizing')) {
        response += `### Market Sizing (Bottom-Up)\n- **TAM:** 285 nghìn tỷ VND (toàn ngành VN)\n- **SAM:** 42.7 nghìn tỷ VND (segment mục tiêu)\n- **SOM:** 2.14 nghìn tỷ VND (5% SAM — mục tiêu Y1)\n- **Confidence Level:** Medium-High (±15%)\n\n`;
      }
      if (toolNames.includes('campaign_optimizer')) {
        response += `### Campaign Optimization Recommendations\n| Kênh | Budget Tái phân bổ | Expected ROAS |\n|---|---|---|\n| Facebook Ads | 30% (-10pp) | 4.2x |\n| TikTok Ads | 25% (+10pp) | 5.8x |\n| Google Search | 25% (-5pp) | 3.5x |\n\n**Action:** Shift 10% budget từ Facebook sang nền tảng Video ngắn.\n\n`;
      }
      if (toolNames.includes('brand_health')) {
        response += `### Brand Health Scorecard\n- **Brand Awareness:** 34% (ngành TB: 45%) — Cần tăng\n- **Net Promoter Score:** +42 (ngành TB: +35) — Tích cực\n- **Share of Voice:** 12% (Top 3 đối thủ: 18-25%) — Cần cải thiện\n\n`;
      }
      if (toolNames.includes('customer_insights')) {
        response += `### Customer Insight Deep-Dive\n- **Primary Persona:** Decision Makers (C-Level, 35-50 tuổi)\n- **JTBD #1:** "Ra quyết định nhanh với data chính xác"\n- **Pain Point #1:** Thiếu visibility vào ROI của từng kênh\n\n`;
      }
      if (toolNames.length === 0) {
        response = `**Cảnh báo Hệ thống:** Bộ xử lý chưa được cung cấp Capability module nào. Vui lòng chọn ít nhất 1 công cụ ở phần cấu hình để đảm bảo đầu ra dữ liệu.`;
      }

      setChatLog(prev => [...prev, { role: 'agent', content: response }]);
    } finally {
      setIsTesting(false);
      setLoadingStep('');
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !role.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);

    const agentPayload = {
      name: name.trim(),
      role: role.trim(),
      system_prompt: prompt.trim(),
      capabilities: Array.from(selectedTools),
    };

    try {
      const res = await fetch('/api/v1/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentPayload),
      });
      if (res.ok) {
        setSaveSuccess(true);
      } else {
        throw new Error('API error');
      }
    } catch {
      // Fallback: save to localStorage
      const existing = JSON.parse(localStorage.getItem('brandflow_custom_agents') || '[]');
      existing.push({ ...agentPayload, id: `custom-${Date.now()}` });
      localStorage.setItem('brandflow_custom_agents', JSON.stringify(existing));
      setSaveSuccess(true);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        if (saveSuccess || true) router.push('/agents');
      }, 1200);
    }
  };

  const canSave = name.trim().length > 0 && role.trim().length > 0;

  return (
    <div className="w-full h-full overflow-y-auto bg-background">
      <div className="page-container max-w-[1400px] space-y-6">
        
        {/* ── Header ───────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-linear-border/50"
        >
          <div className="flex items-center gap-4">
            <Link href="/agents" className="text-linear-text-muted hover:text-cyan-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Hexagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="page-title text-2xl">Enterprise AI Modeler</h1>
              <p className="page-desc">Thiết kế AI Agent chuyên biệt cấp doanh nghiệp với các logic nghiệp vụ</p>
            </div>
          </div>

          <div className="flex gap-3">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                >
                  <CheckCircle2 className="w-4 h-4" /> Đã lưu thành công!
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={handleSave}
              disabled={isSaving || !canSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Đang lưu..." : "Triển khai Agent"}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* ── Left Column: Config (3/5) ───────────────── */}
          <div className="xl:col-span-3 space-y-6">

            {/* Tab Switcher */}
            <div className="flex gap-1 p-1 bg-linear-surface border border-linear-border rounded-xl w-fit shadow-sm">
              <button
                onClick={() => setActiveTab('config')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'config'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-linear-text-muted hover:text-foreground'
                }`}
              >
                <Network className="w-4 h-4 inline mr-2" />
                Cấu hình Logic
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'templates'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-linear-text-muted hover:text-foreground'
                }`}
              >
                <LayoutTemplate className="w-4 h-4 inline mr-2" />
                Mẫu có sẵn
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'templates' ? (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {AGENT_TEMPLATES.map((tpl, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => applyTemplate(tpl)}
                      className="bento-card p-5 text-left hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all group relative overflow-hidden"
                    >
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors" />
                      <div className="flex items-start gap-3 mb-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shadow-sm">
                          <Hexagon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-cyan-500 transition-colors">{tpl.name}</h3>
                          <p className="text-xs text-linear-text-muted">{tpl.role}</p>
                        </div>
                      </div>
                      <p className="text-xs text-linear-text-muted line-clamp-2 mb-3 relative z-10">{tpl.prompt}</p>
                      <div className="flex flex-wrap gap-1 relative z-10">
                        {tpl.tools.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">{t}</span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs font-bold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                        Áp dụng mẫu <ChevronRight className="w-3 h-3" />
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Basic Info Card */}
                  <div className="bento-card p-6 space-y-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-linear-border/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h2 className="font-bold text-foreground text-lg flex items-center gap-2 relative z-10">
                      <Cpu className="w-5 h-5 text-cyan-500" />
                      Thông tin Cơ bản
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      <div>
                        <label className="block text-xs font-bold text-linear-text-muted uppercase tracking-wider mb-2">Tên Module</label>
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="VD: Research Analyst"
                          className="w-full bg-background/50 backdrop-blur-sm border border-linear-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 outline-none transition-all placeholder:text-linear-text-muted/50 shadow-inner"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-linear-text-muted uppercase tracking-wider mb-2">Vai trò Nghiệp vụ</label>
                        <input 
                          type="text" 
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="VD: Chuyên gia Nghiên cứu Thị trường"
                          className="w-full bg-background/50 backdrop-blur-sm border border-linear-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 outline-none transition-all placeholder:text-linear-text-muted/50 shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <label className="block text-xs font-bold text-linear-text-muted uppercase tracking-wider mb-2">
                        System Logic 
                        <span className="normal-case font-medium ml-1 text-amber-500/80">(Quy tắc thực thi chuẩn mực)</span>
                      </label>
                      <textarea 
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Định nghĩa cách thức xử lý, ngôn ngữ, quy chuẩn đầu ra..."
                        className="w-full bg-background/50 backdrop-blur-sm border border-linear-border rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 outline-none transition-all resize-none placeholder:text-linear-text-muted/50 shadow-inner custom-scrollbar"
                      />
                    </div>
                  </div>

                  {/* Capabilities Card */}
                  <div className="bento-card p-6 space-y-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-linear-border/50">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
                        <Workflow className="w-5 h-5 text-amber-500 drop-shadow-sm" />
                        Tích hợp Capability
                        <span className="text-xs font-medium text-linear-text-muted">(Modules chức năng)</span>
                      </h2>
                      <div className="text-xs font-bold text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full shadow-sm">
                        {selectedTools.size} / {CAPABILITY_REGISTRY.flatMap(c => c.items).length} module
                      </div>
                    </div>

                    {CAPABILITY_REGISTRY.map((category, ci) => (
                      <div key={ci}>
                        <div className="flex items-center gap-2 mb-3 mt-4">
                          <category.categoryIcon className="w-4 h-4 text-linear-text-muted" />
                          <h3 className="text-xs font-bold text-linear-text-muted uppercase tracking-widest">{category.category}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {category.items.map((tool) => {
                            const isSelected = selectedTools.has(tool.id);
                            const colors = COLOR_MAP[tool.color] || COLOR_MAP.indigo;
                            return (
                              <motion.button
                                key={tool.id}
                                onClick={() => toggleTool(tool.id)}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 relative overflow-hidden ${
                                  isSelected 
                                    ? `${colors.bg} ${colors.border} shadow-[0_4px_20px_rgba(0,0,0,0.05)]` 
                                    : 'border-linear-border hover:border-linear-text-muted/30 bg-background/50'
                                }`}
                              >
                                {isSelected && (
                                  <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg.replace('/10', '/5')} rounded-full blur-2xl pointer-events-none`} />
                                )}
                                <div className={`mt-0.5 transition-colors relative z-10 ${isSelected ? colors.text : 'text-linear-text-muted'}`}>
                                  {isSelected 
                                    ? <CheckCircle2 className="w-5 h-5 drop-shadow-sm" /> 
                                    : <div className="w-5 h-5 rounded-full border-2 border-current opacity-40" />
                                  }
                                </div>
                                <div className="flex-1 min-w-0 relative z-10">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <tool.icon className={`w-4 h-4 ${isSelected ? colors.text : 'text-linear-text-muted'} transition-colors`} />
                                    <span className={`font-bold text-sm ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>{tool.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${isSelected ? `${colors.bg} ${colors.text} ${colors.border.replace('/30', '/20')}` : 'bg-linear-surface text-linear-text-muted border-transparent'}`}>
                                      {tool.subtitle}
                                    </span>
                                  </div>
                                  <p className="text-xs text-linear-text-muted mt-1.5 leading-relaxed">{tool.description}</p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right Column: Test Drive (2/5) ────────── */}
          <div className="xl:col-span-2">
            <div className="bento-card flex flex-col overflow-hidden sticky top-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-cyan-500/20 !p-0" style={{ height: 'calc(100vh - 8rem)' }}>
              {/* Professional Testing Sandbox Header */}
              <div className="bg-white dark:bg-[#111827] px-5 py-4 flex items-center justify-between shrink-0 border-b border-linear-border z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-[15px] leading-tight">Simulation Environment</h2>
                    <p className="text-[11px] text-linear-text-muted font-medium">B2B Chat Interface</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-1 rounded text-emerald-600 dark:text-emerald-400">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Ready</span>
                </div>
              </div>

              {/* Module Metadata Bar */}
              {name && (
                <div className="bg-slate-50 dark:bg-[#1F2937] px-5 py-2.5 border-b border-linear-border shrink-0 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hexagon className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{name}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-[10px] text-slate-500 font-semibold">{selectedTools.size} modules active</span>
                  </div>
                </div>
              )}
              
              {/* Chat Area - Slack/Teams style */}
              <div className="flex-1 p-5 overflow-y-auto bg-white dark:bg-[#0F172A] custom-scrollbar flex flex-col gap-6">
                {chatLog.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-linear-text-muted">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-linear-border flex items-center justify-center mb-4">
                      <GitPullRequest className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-foreground">Initiate Testing Sequence</p>
                    <p className="text-xs mt-1.5 text-center max-w-[260px]">Run a query to validate logic execution and capability integration.</p>
                    
                    {/* Quick prompts */}
                    <div className="mt-8 w-full max-w-[300px] flex flex-col gap-2">
                      {[
                        'Cung cấp báo cáo thị trường B2B SaaS',
                        'Mô phỏng P&L cho dự án mới',
                        'Phân tích đối thủ cạnh tranh',
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setTestMessage(q)}
                          className="w-full text-left text-[13px] font-medium px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-linear-border hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 transition-all flex items-center"
                        >
                          <ChevronRight className="w-4 h-4 mr-2 opacity-50" /> {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatLog.map((msg, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-1 ${
                        msg.role === 'user' 
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' 
                          : 'bg-blue-600 text-white shadow-sm'
                      }`}>
                        {msg.role === 'user' ? <Users className="w-4 h-4" /> : <Hexagon className="w-4 h-4" />}
                      </div>
                      
                      {/* Message Content */}
                      <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-baseline gap-2 mb-1 px-1">
                           <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{msg.role === 'user' ? 'You' : (name || 'System')}</span>
                           <span className="text-[10px] text-slate-400">Just now</span>
                        </div>
                        <div className={`px-4 py-3 text-[14px] leading-relaxed rounded-xl ${
                          msg.role === 'user' 
                            ? 'bg-[#E5E7EB] dark:bg-[#1F2937] text-slate-800 dark:text-slate-200 rounded-tr-sm' 
                            : 'bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm w-full shadow-sm'
                        }`}>
                          {msg.role === 'agent' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-a:text-blue-500" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/## (.*?)\n/g, '<h3 class="text-[15px] border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 mt-1">$1</h3>').replace(/### (.*?)\n/g, '<h4 class="text-[14px] mt-4 mb-2">$1</h4>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\|(.*)\|/g, (match) => `<div class="overflow-x-auto my-3"><table class="w-full text-left border-collapse text-[13px]">${match.replace(/\|/g, '').split('<br/>').map(row => `<tr>${row.split('---').join('').split('  ').map(cell => `<td class="border-b border-slate-200 dark:border-slate-700 p-2">${cell.trim()}</td>`).join('')}</tr>`).join('')}</table></div>`) }} />
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                
                {isTesting && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 w-full">
                    <div className="w-8 h-8 rounded-md bg-blue-600 text-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                       <Hexagon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start max-w-[85%]">
                       <div className="flex items-baseline gap-2 mb-1 px-1">
                          <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{name || 'System'}</span>
                       </div>
                       <div className="px-4 py-3 bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl rounded-tl-sm shadow-sm flex items-center gap-3">
                         <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                         <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">{loadingStep}</span>
                       </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-[#111827] border-t border-linear-border shrink-0 z-20">
                <form onSubmit={handleTestChat} className="relative">
                  <input 
                    type="text" 
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Message..." 
                    className="w-full bg-slate-100 dark:bg-[#1F2937] border border-transparent rounded-lg py-3 pl-4 pr-12 text-[14px] text-foreground focus:outline-none focus:border-slate-300 dark:focus:border-slate-600 transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={isTesting || !testMessage.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white rounded-md px-3 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="text-center mt-2 text-[10px] text-slate-400">AI output is generated for simulation purposes and requires validation.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
