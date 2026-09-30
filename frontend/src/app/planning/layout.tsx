"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, Activity, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PLAN_SECTIONS = [
  { id: 'overview', title: 'Tổng Quan', icon: LayoutDashboard, path: '/planning/a0-overview' },
  { id: 'mission', title: 'A.1 Sứ Mệnh', icon: Target, path: '/planning/a1-mission' },
  { id: 'performance', title: 'A.2 Hiệu Suất', icon: Activity, path: '/planning/a2-performance' },
  { id: 'revenue', title: 'A.3 Doanh Thu', icon: FileText, path: '/planning/a3-revenue' },
  { id: 'market', title: 'A.4 Thị Trường', icon: Activity, path: '/planning/a4-market' },
  { id: 'swot', title: 'A.5 SWOT', icon: FileText, path: '/planning/a5-swot' },
  { id: 'portfolio', title: 'A.6 Danh Mục', icon: LayoutDashboard, path: '/planning/a6-portfolio' },
];

export default function PlanningLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex w-full h-full">
      {/* ── Sub Navigation Sidebar ── */}
      <div className="w-72 shrink-0 border-r border-linear-border/50 bg-slate-900/40 hidden lg:flex flex-col relative z-20">
        <div className="p-6 border-b border-linear-border/50">
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-heading tracking-tight mb-2">
            Strategic Planning
          </h2>
          <p className="text-xs text-slate-400 font-medium">12 bước chuẩn hóa kế hoạch tiếp thị đa kênh.</p>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {PLAN_SECTIONS.map((section, idx) => {
              const isActive = pathname.startsWith(section.path);
              const Icon = section.icon;
              
              return (
                <Link key={section.id} href={section.path}>
                  <div className={`
                    flex items-center justify-between p-3 rounded-xl transition-all group relative overflow-hidden
                    ${isActive ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-white/5 border border-transparent'}
                  `}>
                    {isActive && <motion.div layoutId="activePlanTab" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-r-full" />}
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-bold ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {section.title}
                      </span>
                    </div>
                    {isActive ? (
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-slate-600 opacity-50" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-linear-border/50">
             <div className="px-3 mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tiến độ</span>
                <span className="text-xs font-bold text-emerald-400">25%</span>
             </div>
             <div className="w-full bg-slate-800 rounded-full h-1.5 px-3">
               <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full w-1/4 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             </div>
          </div>
        </div>
      </div>
      
      {/* ── Main Content Area ── */}
      <div className="flex-1 w-full h-full relative z-10 overflow-hidden bg-slate-950/20">
        {children}
      </div>
    </div>
  );
}
