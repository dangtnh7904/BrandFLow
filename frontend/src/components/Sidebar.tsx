"use client";

import React, { useState } from 'react';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare,
  Briefcase,
  FolderGit2, 
  Settings,
  Sparkles,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  PenSquare,
  Palette
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

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

const MENU_ITEMS = [
  { id: 'dashboard', langKey: 'sidebar.dashboard', icon: LayoutDashboard, href: '/dashboard', group: 'main' },
  { id: 'design-studio', langKey: 'sidebar.design_studio', icon: Palette, href: '/design-studio', group: 'main' },
  { id: 'daily-content', langKey: 'sidebar.daily_content', icon: PenSquare, href: '/daily-content', group: 'main' },
  { id: 'workspace', langKey: 'sidebar.workspace', icon: MessageSquare, href: '/workspace', group: 'main' },
  { id: 'b2b', langKey: 'b2b.title', icon: Briefcase, href: '/planning', group: 'main' },
  { id: 'assets', langKey: 'sidebar.assets', icon: FolderGit2, href: '/assets', group: 'system' },
  { id: 'agents', langKey: 'sidebar.agents', icon: Network, href: '/agents', group: 'system' },
  { id: 'settings', langKey: 'sidebar.settings', icon: Settings, href: '/settings', group: 'system' },
] as const;

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
 const pathname = usePathname();
 const { t, language, toggleLanguage } = useLanguage();
 const isCollapsed = false;

 return (
 <>
  {/* Overlay backdrop */}
  <AnimatePresence>
  {isOpen && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
      onClick={onClose}
    />
  )}
  </AnimatePresence>
  
 <motion.aside 
 initial={{ x: "-100%" }}
 animate={{ x: isOpen ? 0 : "-100%" }}
 transition={{ type: "spring", bounce: 0, duration: 0.4 }}
 className="fixed top-0 left-0 h-screen w-64 bg-slate-50/95 dark:bg-[#0B1120]/95 backdrop-blur-xl border-r border-linear-border/50 flex flex-col py-6 z-[100] shadow-2xl overflow-hidden shrink-0"
  >
      <div className={cn("flex items-center mb-10 pt-2", isCollapsed ? "justify-center px-0" : "px-6")}>
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <BrandFlowLogo className="w-10 h-10 shrink-0" />
          {!isCollapsed && (
            <h2 className="text-xl font-bold tracking-tight text-foreground ml-3 whitespace-nowrap">
              Brand<span className="text-cyan-500">F</span>low
            </h2>
          )}
        </Link>
      </div>

 <nav className="flex-1 px-3 overflow-x-hidden overflow-y-auto no-scrollbar min-h-0">
 <div className="mb-6">
 {!isCollapsed && <h3 className="text-linear-text-muted text-[10px] font-semibold uppercase tracking-widest px-3 mb-3 whitespace-nowrap">{t('sidebar.menu' as TranslationKey) || 'Menu'}</h3>}
 <ul className="space-y-1">
 {MENU_ITEMS.filter(n => n.group === 'main').map(item => {
 const active = pathname.startsWith(item.href);
 return (
 <li key={item.id}>
 <Link href={item.href}>
 <motion.div
 whileHover={{ x: isCollapsed ? 0 : 4 }}
 whileTap={{ scale: 0.98 }}
 title={t(item.langKey as TranslationKey)}
 className={cn(
 "flex items-center py-2 rounded-lg transition-colors cursor-pointer text-sm font-medium",
 isCollapsed ? "justify-center px-0" : "px-3",
 active 
 ? "bg-linear-surface text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
 : "text-linear-text-muted hover:text-foreground hover:bg-linear-surface/80"
 )}
 >
 <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", active ? "text-cyan-400" : "text-linear-text-muted group-hover:text-cyan-500/70", !isCollapsed && "w-4 h-4 mr-3")} />
 {!isCollapsed && <span className="whitespace-nowrap">{t(item.langKey as TranslationKey)}</span>}
 {active && !isCollapsed && (
 <motion.div 
 layoutId="active-indicator"
 className="absolute left-0 w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.2 }}
 />
 )}
 </motion.div>
 </Link>

 {/* B2B Expanded Navigation */}
 {!isCollapsed && item.id === 'b2b' && pathname.startsWith('/planning') && (
 <div className="ml-4 mt-2 mb-4 space-y-4 border-l border-linear-border pl-3">
 {B2B_SECTIONS.map((section, idx) => (
 <div key={idx} className="space-y-1 text-left">
 <div className="text-[10px] uppercase font-bold text-linear-text-muted mb-2 truncate">
 {section.title[language] as string}
 </div>
 {section.items.map(sub => (
 <Link key={sub.id} href={sub.href}>
 <div className={cn(
 "text-xs py-1.5 px-3 rounded-md transition-colors truncate mb-1",
 pathname === sub.href 
 ? "bg-cyan-500/10 text-cyan-400 font-semibold" 
 : "text-linear-text-muted hover:text-foreground hover:bg-linear-surface/80"
 )}>
 {sub.label[language] as string}
 </div>
 </Link>
 ))}
 </div>
 ))}
 </div>
 )}

 </li>
 );
 })}
 </ul>
 </div>

 <div className="mb-6">
 {!isCollapsed && <h3 className="text-linear-text-muted text-[10px] font-semibold uppercase tracking-widest px-3 mb-3 whitespace-nowrap">System</h3>}
 <ul className="space-y-1">
 {MENU_ITEMS.filter(n => n.group === 'system').map(item => (
 <li key={item.id}>
 <Link href={item.href}>
 <motion.div
 whileHover={{ x: isCollapsed ? 0 : 4 }}
 whileTap={{ scale: 0.98 }}
 title={t(item.langKey as TranslationKey)}
 className={cn(
 "flex items-center py-2 rounded-lg transition-colors cursor-pointer text-sm font-medium text-linear-text-muted hover:text-foreground hover:bg-linear-surface/80 group",
 isCollapsed ? "justify-center px-0" : "px-3"
 )}
 >
 <item.icon className={cn("w-5 h-5 text-linear-text-muted shrink-0", !isCollapsed && "w-4 h-4 mr-3")} />
 {!isCollapsed && <span className="whitespace-nowrap">{t(item.langKey as TranslationKey)}</span>}
 </motion.div>
 </Link>
 </li>
 ))}
 </ul>
 </div>
 </nav>

 <div className={cn("mt-auto pb-4 shrink-0 pt-2 bg-linear-surface/30 backdrop-blur-md relative z-10", isCollapsed ? "px-2" : "px-4")}>

 
 <div className={cn("flex gap-2 items-center", isCollapsed ? "flex-col" : "")}>
 <button 
 onClick={onClose}
 className="flex items-center justify-center rounded-lg bg-linear-surface/50 border ultra-thin-border text-linear-text-muted hover:text-foreground hover:bg-linear-surface transition-all shrink-0 h-10 w-10"
 title="Close Sidebar"
 >
 <PanelLeftClose className="w-5 h-5" />
 </button>
 </div>
 </div>
 </motion.aside>
 </>
 );
}
