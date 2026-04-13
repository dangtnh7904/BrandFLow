"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../ThemeToggle';
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
 { id: "a1", label: "A1. Sứ mệnh & Định nghĩa", href: "/planning/a1-mission" },
 { id: "a3", label: "A3. Dự phóng Doanh thu", href: "/planning/a3-revenue" },
 { id: "a5", label: "A5. Phân tích SWOT", href: "/planning/a5-swot" },
 { id: "a6", label: "A6. Ma trận Danh mục", href: "/planning/a6-portfolio" },
 ]
 },
 {
 title: "Phần B - Vận hành",
 icon: LayoutDashboard,
 items: [
 { id: "b3", label: "B3. Ma trận Hành động", href: "/planning/b3-action" },
 { id: "b5", label: "B5. Phương án Dự phòng", href: "/planning/b5-contingency" },
 { id: "b7", label: "B7. Tiến độ Gantt", href: "/planning/b7-gantt" },
 ]
 },
 {
 title: "Phần C - Tổng hành dinh",
 icon: BarChart2,
 items: [
 { id: "c1", label: "C1. Định hướng Tập đoàn", href: "/planning/c1-direction" },
 { id: "c2", label: "C2. Ma trận Tập đoàn", href: "/planning/c2-matrix" },
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
 <div className="w-6 h-6 bg-cyan-500/10 border border-cyan-500/30 rounded-md mr-2 flex items-center justify-center shrink-0">
 <span className="text-cyan-400 text-xs font-bold">HQ</span>
 </div>
 Kế hoạch Doanh nghiệp
 </span>
 )}
 {isCollapsed && (
 <div className="w-6 h-6 bg-cyan-500/10 border border-cyan-500/30 rounded-md mx-auto flex items-center justify-center shrink-0">
 <span className="text-cyan-400 text-xs font-bold">HQ</span>
 </div>
 )}
 <button onClick={() => setIsCollapsed(!isCollapsed)} className={cn("text-linear-text-muted hover:text-cyan-400 transition-colors", isCollapsed ? "absolute right-0 left-0 mx-auto mt-14 hidden" : "")}>
 {isCollapsed ? null : <PanelLeftClose className="w-4 h-4" />}
 </button>
 </div>

 {isCollapsed && (
 <button onClick={() => setIsCollapsed(false)} className="mx-auto mt-4 text-linear-text-muted hover:text-cyan-400 transition-colors">
 <PanelLeftOpen className="w-5 h-5" />
 </button>
 )}

 <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 overflow-x-hidden">
 {SECTIONS.map((section) => (
 <div key={section.title} className="mb-2">
 {!isCollapsed ? (
 <button 
 onClick={() => toggleSection(section.title)}
 className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground hover:bg-linear-surface/80 rounded-md transition-colors"
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
 ? 'bg-cyan-500/10 text-cyan-400 font-medium' 
 : 'text-linear-text-muted hover:text-foreground hover:bg-linear-surface/80'
 )}
 title={item.label}
 >
 <FileText className={cn("w-3.5 h-3.5 mr-2 shrink-0", isActive ? 'text-cyan-400' : 'text-linear-text-muted')} />
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

 <div className={cn("p-4 border-t border-linear-border", isCollapsed ? "flex justify-center flex-col items-center gap-4" : "flex justify-between items-center")}>
 <Link href="/dashboard" className="flex items-center text-xs text-linear-text-muted hover:text-cyan-400 transition-colors whitespace-nowrap" title="Bật Môi trường AI">
 &larr; {!isCollapsed && "Trợ lý AI"}
 </Link>
 <ThemeToggle />
 </div>
 </motion.div>
 );
}
