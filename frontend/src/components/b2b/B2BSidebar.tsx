"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, FileText, BarChart2, Briefcase, LayoutDashboard, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SECTIONS = [
  {
    title: "Phần A - Chiến lược",
    icon: Briefcase,
    items: [
      { id: "a0", label: "A0. Tổng quan Phần A", href: "/planning/a0-overview" },
      { id: "a1", label: "A1. Tuyên bố Sứ mệnh", href: "/planning/a1-mission" },
      { id: "a2", label: "A2. Hiệu suất SBU", href: "/planning/a2-performance" },
      { id: "a3", label: "A3. Tóm tắt Dự báo", href: "/planning/a3-revenue" },
      { id: "a4", label: "A4. Tổng quan Thị trường", href: "/planning/a4-market" },
      { id: "a5", label: "A5. Phân tích SWOT", href: "/planning/a5-swot" },
      { id: "a6", label: "A6. Ma trận Danh mục", href: "/planning/a6-portfolio" },
      { id: "a7", label: "A7. Các Giả định", href: "/planning/a7-assumptions" },
      { id: "a8", label: "A8. Mục tiêu & Chiến lược", href: "/planning/a8-strategies" },
      { id: "a9", label: "A9. Ngân sách 3-5 Năm", href: "/planning/a9-budget" },
    ]
  },
  {
    title: "Phần B - Vận hành",
    icon: LayoutDashboard,
    items: [
      { id: "b0", label: "B0. Tổng quan Phần B", href: "/planning/b0-overview" },
      { id: "b1", label: "B1. Mục tiêu Vận hành", href: "/planning/b1-objectives" },
      { id: "b2", label: "B2. Kế hoạch Hành động", href: "/planning/b2-action" },
      { id: "b3", label: "B3. Ngân sách Marketing", href: "/planning/b3-budget" },
      { id: "b4", label: "B4. Kế hoạch Dự phòng", href: "/planning/b4-contingency" },
      { id: "b5", label: "B5. Báo cáo Lãi Lỗ", href: "/planning/b5-pnl" },
      { id: "b6", label: "B6. Tiến độ Gantt", href: "/planning/b6-gantt" },
    ]
  },
  {
    title: "Phần C - Tổng hành dinh",
    icon: BarChart2,
    items: [
      { id: "c0", label: "C0. Tổng quan Phần C", href: "/planning/c0-overview" },
      { id: "c1", label: "C1. Tuyên bố Định hướng", href: "/planning/c1-direction" },
      { id: "c2", label: "C2. Lịch sử Danh mục", href: "/planning/c2-history" },
      { id: "c3", label: "C3. Phân tích Vấn đề", href: "/planning/c3-issues" },
      { id: "c4", label: "C4. Dashboard Chiến lược", href: "/planning/c4-dashboard" },
    ]
  }
];

export default function B2BSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Phần A - Chiến lược": true,
    "Phần B - Vận hành": true,
  });
  const pathname = usePathname();

  const toggleSection = (title: string) => {
    if (isCollapsed) return; // Prevent toggling when collapsed
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="bg-background border-r border-linear-border h-full flex flex-col shrink-0 relative overflow-hidden"
    >
      <div className="h-14 border-b border-linear-border px-4 flex items-center justify-between shrink-0">
        {!isCollapsed && (
          <span className="font-bold tracking-tight text-foreground flex items-center whitespace-nowrap">
            <div className="w-6 h-6 bg-slate-800 rounded-md mr-2 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">HQ</span>
            </div>
            Kế hoạch Doanh nghiệp
          </span>
        )}
        {isCollapsed && (
          <div className="w-6 h-6 bg-slate-800 rounded-md mx-auto flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">HQ</span>
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={cn("text-linear-text-muted hover:text-linear-text-muted transition-colors", isCollapsed ? "absolute right-0 left-0 mx-auto mt-14 hidden" : "")}>
          {isCollapsed ? null : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {isCollapsed && (
        <button onClick={() => setIsCollapsed(false)} className="mx-auto mt-4 text-linear-text-muted hover:text-linear-text-muted transition-colors">
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      )}

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 overflow-x-hidden">
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-2">
            {!isCollapsed ? (
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground hover:bg-slate-100 dark:bg-slate-800/30 rounded-md transition-colors"
                title={section.title}
              >
                <div className="flex items-center">
                  <section.icon className="w-4 h-4 mr-2 text-linear-text-muted shrink-0" />
                  <span className="whitespace-nowrap">{section.title}</span>
                </div>
                {openSections[section.title] ? <ChevronDown className="w-4 h-4 text-linear-text-muted shrink-0" /> : <ChevronRight className="w-4 h-4 text-linear-text-muted shrink-0" />}
              </button>
            ) : (
              <div className="flex justify-center mb-4" title={section.title}>
                <section.icon className="w-5 h-5 text-linear-text-muted shrink-0" />
              </div>
            )}

            <AnimatePresence>
              {!isCollapsed && openSections[section.title] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-1 space-y-1"
                >
                  {section.items.map(item => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-1.5 ml-5 text-sm rounded-md transition-colors",
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-linear-text-muted hover:text-slate-900 hover:bg-slate-100 dark:bg-slate-800/30'
                        )}
                        title={item.label}
                      >
                        <FileText className={cn("w-3.5 h-3.5 mr-2 shrink-0", isActive ? 'text-blue-500' : 'text-linear-text-muted')} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className={cn("p-4 border-t border-linear-border", isCollapsed ? "flex justify-center flex-col items-center gap-4" : "")}>
        <Link href="/dashboard" className="flex items-center text-xs text-linear-text-muted hover:text-slate-900 transition-colors whitespace-nowrap" title="Bật Môi trường AI">
          &larr; {!isCollapsed && "Trợ lý AI"}
        </Link>
      </div>
    </motion.div>
  );
}
