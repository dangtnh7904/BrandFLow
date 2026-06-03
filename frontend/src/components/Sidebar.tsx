"use client";

import React, { useState } from 'react';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, MessageSquare, Briefcase, FolderGit2, Settings,
  Sparkles, Network, PanelLeftClose, PenSquare, Palette, Shield,
  ChevronRight, Zap, ArrowRight, BookOpen
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ═══════════════════════════════════════════════════════════════════════════
   B2B SECTIONS — Collapsed by default to reduce cognitive load
   ═══════════════════════════════════════════════════════════════════════════ */

const B2B_SECTIONS = [
  {
    title: { en: "Phase A - Strategy", vi: "Phần A - Chiến lược" },
    items: [
      { id: "a0", label: { en: "Overview Phase A", vi: "🚩 Tổng quan Phần A" }, href: "/planning/a0-overview" },
      { id: "a1", label: { en: "A.1 Mission", vi: "A.1 Tuyên bố Sứ mệnh" }, href: "/planning/a1-mission" },
      { id: "a2", label: { en: "A.2 Performance", vi: "A.2 Hiệu suất SBU" }, href: "/planning/a2-performance" },
      { id: "a3", label: { en: "A.3 Projections", vi: "A.3 Tóm tắt Dự báo" }, href: "/planning/a3-revenue" },
      { id: "a4", label: { en: "A.4 Market Overview", vi: "A.4 Tổng quan Thị trường" }, href: "/planning/a4-market" },
      { id: "a5", label: { en: "A.5 SWOT Matrix", vi: "A.5 Phân tích SWOT" }, href: "/planning/a5-swot" },
      { id: "a6", label: { en: "A.6 Portfolio Matrix", vi: "A.6 Ma trận Danh mục" }, href: "/planning/a6-portfolio" },
      { id: "a7", label: { en: "A.7 Assumptions", vi: "A.7 Các Giả định" }, href: "/planning/a7-assumptions" },
      { id: "a8", label: { en: "A.8 Strategies", vi: "A.8 Mục tiêu & Chiến lược" }, href: "/planning/a8-strategies" },
      { id: "a9", label: { en: "A.9 Budget 3-5 Yrs", vi: "A.9 Ngân sách 3-5 Năm" }, href: "/planning/a9-budget" },
    ]
  },
  {
    title: { en: "Phase B - Operations", vi: "Phần B - Vận hành" },
    items: [
      { id: "b0", label: { en: "Overview Phase B", vi: "🚩 Tổng quan Phần B" }, href: "/planning/b0-overview" },
      { id: "b1", label: { en: "B.1 Objectives", vi: "B.1 Mục tiêu Vận hành" }, href: "/planning/b1-objectives" },
      { id: "b2", label: { en: "B.2 Action Plans", vi: "B.2 Kế hoạch Hành động" }, href: "/planning/b2-action" },
      { id: "b3", label: { en: "B.3 Marketing Budget", vi: "B.3 Ngân sách Marketing" }, href: "/planning/b3-budget" },
      { id: "b4", label: { en: "B.4 Contingency Plan", vi: "B.4 Kế hoạch Dự phòng" }, href: "/planning/b4-contingency" },
      { id: "b5", label: { en: "B.5 P&L Report", vi: "B.5 Báo cáo Lãi Lỗ" }, href: "/planning/b5-pnl" },
      { id: "b6", label: { en: "B.6 Tactical Gantt", vi: "B.6 Tiến độ Gantt" }, href: "/planning/b6-gantt" },
    ]
  },
  {
    title: { en: "Phase C - Summary", vi: "Phần C - Tổng hợp h/q" },
    items: [
      { id: "c0", label: { en: "Overview Phase C", vi: "🚩 Tổng quan Phần C" }, href: "/planning/c0-overview" },
      { id: "c1", label: { en: "C.1 Strategic Direction", vi: "C.1 Tuyên bố Định hướng" }, href: "/planning/c1-direction" },
      { id: "c2", label: { en: "C.2 Portfolio History", vi: "C.2 Lịch sử Danh mục" }, href: "/planning/c2-history" },
      { id: "c3", label: { en: "C.3 Issues Analysis", vi: "C.3 Phân tích Vấn đề" }, href: "/planning/c3-issues" },
      { id: "c4", label: { en: "C.4 Exec Matrix", vi: "C.4 Dashboard Chiến lược" }, href: "/planning/c4-dashboard" },
    ]
  },
  {
    title: { en: "Phase D - Report Output", vi: "Phần D - Báo cáo Output" },
    items: [
      { id: "d0", label: { en: "D.0 Marketing Plan Report", vi: "📊 Báo cáo Marketing Plan" }, href: "/planning/d0-report" },
    ]
  }
];

/* ═══════════════════════════════════════════════════════════════════════════
   QUICK ACTIONS — Solve "Where do I start?" instantly
   ═══════════════════════════════════════════════════════════════════════════ */

const QUICK_ACTIONS = [
  { icon: Zap, label: { en: "Quick Start", vi: "Bắt đầu nhanh" }, href: "/onboarding", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { icon: PenSquare, label: { en: "Create Content", vi: "Tạo nội dung" }, href: "/daily-content", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Palette, label: { en: "Design", vi: "Thiết kế" }, href: "/design-studio", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MENU — Simplified grouping: Core tools only, system items hidden
   ═══════════════════════════════════════════════════════════════════════════ */

const MENU_ITEMS = [
  { id: 'workspace', langKey: 'sidebar.workspace', icon: MessageSquare, href: '/onboarding', group: 'core', desc: { en: 'AI Interview', vi: 'Phỏng vấn AI' } },
  { id: 'daily-content', langKey: 'sidebar.daily_content', icon: PenSquare, href: '/daily-content', group: 'core', desc: { en: 'Posts & Captions', vi: 'Bài viết & Caption' } },
  { id: 'design-studio', langKey: 'sidebar.design_studio', icon: Palette, href: '/design-studio', group: 'core', desc: { en: 'Logo & Branding', vi: 'Logo & Nhận diện' } },
  { id: 'content-lab', langKey: 'sidebar.content_lab', icon: Sparkles, href: '/content-lab', group: 'core', desc: { en: 'Advanced AI', vi: 'AI nâng cao' } },
  { id: 'b2b', langKey: 'b2b.title', icon: Briefcase, href: '/planning', group: 'advanced', desc: { en: 'Marketing Plan', vi: 'Kế hoạch MKT' } },
  { id: 'dashboard', langKey: 'sidebar.dashboard', icon: LayoutDashboard, href: '/dashboard', group: 'advanced', desc: { en: 'Analytics', vi: 'Phân tích' } },
  { id: 'agents', langKey: 'sidebar.agents', icon: Network, href: '/agents', group: 'system', desc: { en: 'Agent Builder', vi: 'Xây Agent' } },
  { id: 'assets', langKey: 'sidebar.assets', icon: FolderGit2, href: '/assets', group: 'system', desc: { en: 'Files', vi: 'Tài liệu' } },
  { id: 'settings', langKey: 'sidebar.settings', icon: Settings, href: '/settings', group: 'system', desc: { en: 'Config', vi: 'Cấu hình' } },
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   COLLAPSIBLE SECTION — For B2B sub-navigation
   ═══════════════════════════════════════════════════════════════════════════ */

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-linear-text-muted mb-1.5 px-1 py-1 hover:text-foreground transition-colors rounded">
        <span className="truncate">{title}</span>
        <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSystem, setShowSystem] = useState(false);

  // Auto-expand the B2B section that contains the current page
  const currentB2BSection = B2B_SECTIONS.findIndex(s => s.items.some(i => pathname === i.href));

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('brandflow_is_admin') === 'true');
    }
  }, []);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed top-0 left-0 h-screen w-72 bg-slate-50/95 dark:bg-[#0B1120]/95 backdrop-blur-xl border-r border-linear-border/50 flex flex-col z-[100] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-linear-border/30">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={onClose}>
            <BrandFlowLogo className="w-9 h-9 shrink-0" />
            <h2 className="text-lg font-bold tracking-tight text-foreground ml-2.5">
              Brand<span className="text-cyan-500">F</span>low
            </h2>
          </Link>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-linear-surface transition-colors text-linear-text-muted hover:text-foreground">
            <PanelLeftClose className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* ─── Quick Actions — "Bạn muốn làm gì?" ─── */}
        <div className="px-4 pt-4 pb-2">
          <div className="text-[9px] font-bold text-linear-text-muted uppercase tracking-widest mb-2 px-1">
            {language === 'vi' ? 'Bắt đầu từ đây' : 'Start Here'}
          </div>
          <div className="flex gap-2">
            {QUICK_ACTIONS.map((qa, i) => (
              <Link key={i} href={qa.href} onClick={onClose} className={`flex-1 flex flex-col items-center p-2.5 rounded-xl border ${qa.bg} hover:scale-[1.03] transition-all`}>
                <qa.icon className={`w-4 h-4 ${qa.color} mb-1`} />
                <span className={`text-[9px] font-bold ${qa.color}`}>{qa.label[language]}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Main Navigation ─── */}
        <nav className="flex-1 px-3 pt-3 overflow-y-auto no-scrollbar min-h-0">
          
          {/* Core Tools */}
          <div className="mb-4">
            <h3 className="text-[9px] font-bold text-linear-text-muted uppercase tracking-widest px-3 mb-2">
              {language === 'vi' ? 'Công cụ chính' : 'Core Tools'}
            </h3>
            <ul className="space-y-0.5">
              {MENU_ITEMS.filter(n => n.group === 'core').map(item => {
                const active = pathname.startsWith(item.href) || (item.id === 'workspace' && pathname.startsWith('/workspace'));
                return (
                  <li key={item.id}>
                    <Link href={item.href} onClick={onClose}>
                      <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-lg transition-colors cursor-pointer relative",
                          active 
                            ? "bg-linear-surface text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.1)]" 
                            : "text-linear-text-muted hover:text-foreground hover:bg-linear-surface/70"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4 mr-3 shrink-0", active ? "text-cyan-400" : "text-linear-text-muted")} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{t(item.langKey as TranslationKey)}</div>
                          <div className="text-[9px] text-linear-text-muted/60 truncate">{item.desc[language]}</div>
                        </div>
                        {active && <div className="absolute left-0 w-[3px] h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />}
                      </motion.div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Advanced — B2B Planning */}
          <div className="mb-4">
            <h3 className="text-[9px] font-bold text-linear-text-muted uppercase tracking-widest px-3 mb-2">
              {language === 'vi' ? 'Nâng cao' : 'Advanced'}
            </h3>
            <ul className="space-y-0.5">
              {MENU_ITEMS.filter(n => n.group === 'advanced').map(item => {
                const active = pathname.startsWith(item.href) || (item.id === 'b2b' && pathname.startsWith('/planning'));
                return (
                  <li key={item.id}>
                    <Link href={item.href} onClick={item.id === 'b2b' ? undefined : onClose}>
                      <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-lg transition-colors cursor-pointer",
                          active ? "bg-linear-surface text-cyan-400" : "text-linear-text-muted hover:text-foreground hover:bg-linear-surface/70"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4 mr-3 shrink-0", active ? "text-cyan-400" : "text-linear-text-muted")} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{t(item.langKey as TranslationKey)}</div>
                          <div className="text-[9px] text-linear-text-muted/60 truncate">{item.desc[language]}</div>
                        </div>
                      </motion.div>
                    </Link>

                    {/* B2B Sub-nav — Collapsible sections */}
                    {item.id === 'b2b' && pathname.startsWith('/planning') && (
                      <div className="ml-4 mt-1.5 mb-3 border-l border-linear-border/50 pl-2.5 space-y-0.5">
                        {B2B_SECTIONS.map((section, idx) => (
                          <CollapsibleSection key={idx} title={section.title[language] as string} defaultOpen={idx === currentB2BSection}>
                            {section.items.map(sub => (
                              <Link key={sub.id} href={sub.href} onClick={onClose}>
                                <div className={cn(
                                  "text-[11px] py-1.5 px-2.5 rounded-md transition-colors truncate mb-0.5",
                                  pathname === sub.href 
                                    ? "bg-cyan-500/10 text-cyan-400 font-semibold" 
                                    : "text-linear-text-muted hover:text-foreground hover:bg-linear-surface/70"
                                )}>
                                  {sub.label[language] as string}
                                </div>
                              </Link>
                            ))}
                          </CollapsibleSection>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* System — Hidden by default */}
          <div className="mb-4">
            <button onClick={() => setShowSystem(!showSystem)}
              className="flex items-center gap-1.5 text-[9px] font-bold text-linear-text-muted uppercase tracking-widest px-3 mb-2 hover:text-foreground transition-colors w-full"
            >
              <span>{language === 'vi' ? 'Hệ thống' : 'System'}</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${showSystem ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {showSystem && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="space-y-0.5 overflow-hidden"
                >
                  {MENU_ITEMS.filter(n => n.group === 'system').map(item => (
                    <li key={item.id}>
                      <Link href={item.href} onClick={onClose}>
                        <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
                          className="flex items-center py-2 px-3 rounded-lg transition-colors cursor-pointer text-linear-text-muted hover:text-foreground hover:bg-linear-surface/70"
                        >
                          <item.icon className="w-4 h-4 mr-3 shrink-0 text-linear-text-muted" />
                          <span className="text-sm font-medium truncate">{t(item.langKey as TranslationKey)}</span>
                        </motion.div>
                      </Link>
                    </li>
                  ))}
                  {isAdmin && (
                    <li>
                      <Link href="/admin" onClick={onClose}>
                        <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex items-center py-2 px-3 rounded-lg transition-colors cursor-pointer text-sm font-bold text-amber-500/90 hover:text-amber-400 hover:bg-linear-surface/70",
                            pathname === '/admin' ? "bg-amber-500/10 text-amber-500" : ""
                          )}
                        >
                          <Shield className="w-4 h-4 mr-3 shrink-0 text-amber-500" />
                          <span className="truncate">{language === 'vi' ? 'Quản Trị' : 'Admin'}</span>
                        </motion.div>
                      </Link>
                    </li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-linear-border/30 shrink-0 space-y-2">
          {/* Resources link */}
          <Link href="/resources" onClick={onClose} className="flex items-center gap-2 px-3 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-lg hover:bg-indigo-500/10 transition-colors">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-medium text-indigo-400">Masterclass Ebooks</span>
            <ArrowRight className="w-3 h-3 text-indigo-400/50 ml-auto" />
          </Link>

          {/* Compliance badges */}
          <div className="flex gap-2">
            <div className="flex-1 px-2 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[9px] font-bold text-emerald-500">SOC 2</span>
            </div>
            <div className="flex-1 px-2 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
              <span className="text-[9px] font-bold text-indigo-500">Zero Retention</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
