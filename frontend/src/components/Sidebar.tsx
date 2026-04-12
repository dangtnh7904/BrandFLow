"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { motion } from 'framer-motion';
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
  PenSquare
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
      { id: "a1", label: { en: "Mission", vi: "Sứ mệnh" }, href: "/planning/a1-mission" },
      { id: "a3", label: { en: "Revenue", vi: "Doanh thu" }, href: "/planning/a3-revenue" },
      { id: "a5", label: { en: "SWOT Matrix", vi: "Phân tích SWOT" }, href: "/planning/a5-swot" },
      { id: "a6", label: { en: "Portfolio Matrix", vi: "Ma trận Định vị" }, href: "/planning/a6-portfolio" },
    ]
  },
  {
    title: { en: "Phase B - Operations", vi: "Phần B - Vận hành" },
    items: [
      { id: "b3", label: { en: "Action Plans", vi: "Kế hoạch Hành động" }, href: "/planning/b3-action" },
      { id: "b5", label: { en: "Contingency", vi: "Kế hoạch Dự phòng" }, href: "/planning/b5-contingency" },
      { id: "b7", label: { en: "Tactical Gantt", vi: "Tiến độ Gantt" }, href: "/planning/b7-gantt" },
    ]
  },
  {
    title: { en: "Phase C - Summary", vi: "Phần C - Tổng hợp" },
    items: [
      { id: "c1", label: { en: "Strategic Direction", vi: "Định hướng Chiến lược" }, href: "/planning/c1-direction" },
      { id: "c2", label: { en: "Executive Matrix", vi: "Ma trận Tổng hợp" }, href: "/planning/c2-matrix" },
    ]
  }
];

const MENU_ITEMS = [
  { id: 'dashboard', langKey: 'sidebar.dashboard', icon: LayoutDashboard, href: '/dashboard', group: 'main' },
  { id: 'daily-content', langKey: 'sidebar.daily_content', icon: PenSquare, href: '/daily-content', group: 'main' },
  { id: 'workspace', langKey: 'sidebar.workspace', icon: MessageSquare, href: '/workspace', group: 'main' },
  { id: 'b2b', langKey: 'b2b.title', icon: Briefcase, href: '/planning', group: 'main' },
  { id: 'assets', langKey: 'sidebar.assets', icon: FolderGit2, href: '/assets', group: 'system' },
  { id: 'agents', langKey: 'sidebar.agents', icon: Network, href: '/agents', group: 'system' },
  { id: 'settings', langKey: 'sidebar.settings', icon: Settings, href: '/settings', group: 'system' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { t, language, toggleLanguage } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside 
       initial={false}
       animate={{ width: isCollapsed ? 80 : 256 }}
       className="border-r ultra-thin-border bg-white/30 backdrop-blur-md flex flex-col py-6 h-screen sticky top-0 overflow-hidden shrink-0"
    >
      <div className={cn("flex items-center mb-10 pt-2", isCollapsed ? "justify-center px-0" : "px-6")}>
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 rounded-lg gradient-ai-bg flex items-center justify-center shrink-0">
             <Sparkles className="w-4 h-4 text-white" />
           </div>
           {!isCollapsed && <h2 className="text-xl font-bold tracking-tight text-slate-800 ml-3 whitespace-nowrap">BrandFlow</h2>}
        </Link>
      </div>

      <nav className="flex-1 px-3 overflow-x-hidden overflow-y-auto no-scrollbar min-h-0">
        <div className="mb-6">
          {!isCollapsed && <h3 className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3 whitespace-nowrap">{t('sidebar.menu' as TranslationKey) || 'Menu'}</h3>}
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
                          ? "bg-slate-100 text-slate-900 shadow-sm" 
                          : "text-linear-text-muted hover:text-slate-800 hover:bg-slate-50"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 shrink-0", active ? "text-blue-600" : "text-linear-text-muted", !isCollapsed && "w-4 h-4 mr-3")} />
                      {!isCollapsed && <span className="whitespace-nowrap">{t(item.langKey as TranslationKey)}</span>}
                      {active && !isCollapsed && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute left-0 w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>
                  </Link>

                   {/* B2B Expanded Navigation */}
                  {!isCollapsed && item.id === 'b2b' && pathname.startsWith('/planning') && (
                     <div className="ml-4 mt-2 mb-4 space-y-4 border-l border-slate-200 pl-3">
                        {B2B_SECTIONS.map((section, idx) => (
                          <div key={idx} className="space-y-1 text-left">
                             <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 truncate">
                               {section.title[language] as string}
                             </div>
                             {section.items.map(sub => (
                               <Link key={sub.id} href={sub.href}>
                                  <div className={cn(
                                     "text-xs py-1.5 px-3 rounded-md transition-colors truncate mb-1",
                                     pathname === sub.href 
                                        ? "bg-blue-50 text-blue-700 font-semibold" 
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
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
                       "flex items-center py-2 rounded-lg transition-colors cursor-pointer text-sm font-medium text-linear-text-muted hover:text-slate-800 hover:bg-slate-50",
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
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "flex items-center justify-center rounded-lg bg-slate-100 border ultra-thin-border text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all shrink-0",
                isCollapsed ? "w-10 h-10 mb-2 mt-2" : "h-10 w-10"
              )}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            {!isCollapsed && (
               <div className="flex flex-1 bg-slate-100 rounded-lg p-1 border ultra-thin-border h-10">
                 <button 
                   onClick={toggleLanguage}
                   className={cn("flex-1 text-xs font-bold rounded-md transition-all flex items-center justify-center", language === 'en' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                 >🇺🇸 EN</button>
                 <button 
                   onClick={toggleLanguage}
                   className={cn("flex-1 text-xs font-bold rounded-md transition-all flex items-center justify-center", language === 'vi' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                 >🇻🇳 VI</button>
               </div>
            )}
         </div>
      </div>
    </motion.aside>
  );
}
