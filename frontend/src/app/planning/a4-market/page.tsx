"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { ShieldAlert, Crosshair, Zap, Activity } from 'lucide-react';
import clsx from 'clsx';

const MAP_DATA = [
  { role: 'Initiator (Khởi xướng)', pain_points: 'Hệ thống cũ chậm chạp', decision_drivers: 'Tăng hiệu suất', opportunism_risk: 'Muốn chứng tỏ năng lực cá nhân với sếp', icon: Zap, color: 'emerald' },
  { role: 'Decider (Quyết định)', pain_points: 'Chi phí cao, rủi ro', decision_drivers: 'ROI, Thời gian thu hồi vốn', opportunism_risk: 'Sợ sai lầm ảnh hưởng ghế giám đốc', icon: Activity, color: 'indigo' },
  { role: 'User (Sử dụng)', pain_points: 'Phần mềm mới khó học', decision_drivers: 'Dễ dùng, tiết kiệm thời gian', opportunism_risk: 'Ngại thay đổi thói quen cũ', icon: Crosshair, color: 'blue' },
];

export default function PageA4Market() {
  const { localData, saveStatus } = useAutoSaveForm('a4-market', { items: MAP_DATA });
  
  const items = localData?.items || MAP_DATA;

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Tổng quan & Bản đồ Thị trường"
      description="Phân tích động lực học của nhóm ra quyết định (Buying Center) theo lý thuyết Philip Kotler."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Trực quan hóa DMU (Decision Making Unit): Nắm bắt Nỗi đau (Pain Points), Động lực Quyết định, và đặc biệt là Rủi ro Trục lợi / Cảm tính (Opportunism Risk) để đánh đúng tâm lý.
        </InstructionAlert>
        
        <div className="bento-card p-8 border-amber-500/20 shadow-sm shadow-amber-500/5 bg-gradient-to-b from-linear-background to-linear-surface/30">
           <h3 className="text-base font-bold text-foreground mb-8 uppercase tracking-widest text-center flex items-center justify-center">
              Mạng lưới Quyền lực Khách hàng B2B (Buying Center)
           </h3>

           {/* Infographic Network layout */}
           <div className="relative max-w-4xl mx-auto">
             {/* Central Hub / Core Problem */}
             <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-800 items-center justify-center z-0 opacity-50"></div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               {items.map((node: any, idx: number) => {
                 const baseColor = node.color || 'emerald';
                 
                 // Tailwind dynamic classes approximation
                 const bgColor = baseColor === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 
                                 baseColor === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-500/10' : 
                                 'bg-blue-50 dark:bg-blue-500/10';
                 const textColor = baseColor === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 
                                   baseColor === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : 
                                   'text-blue-600 dark:text-blue-400';
                 const borderColor = baseColor === 'emerald' ? 'border-emerald-200 dark:border-emerald-500/30' : 
                                     baseColor === 'indigo' ? 'border-indigo-200 dark:border-indigo-500/30' : 
                                     'border-blue-200 dark:border-blue-500/30';
                 
                 const Icon = MAP_DATA[idx]?.icon || Zap;

                 return (
                   <div key={idx} className="relative group">
                     {/* Connecting Line to Center (desktop) */}
                     {idx === 0 && <div className="hidden md:block absolute top-1/2 right-0 w-8 h-[2px] bg-slate-200 dark:bg-slate-700 translate-x-full"></div>}
                     {idx === 2 && <div className="hidden md:block absolute top-1/2 left-0 w-8 h-[2px] bg-slate-200 dark:bg-slate-700 -translate-x-full"></div>}

                     <div className={clsx("p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-slate-900", borderColor)}>
                        {/* Node Header */}
                        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center mb-4", bgColor, textColor)}>
                           <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-1">{node.role}</h4>
                        
                        <div className="space-y-4 mt-6">
                           <div className="relative">
                              <span className="text-xs font-semibold uppercase tracking-wider text-linear-text-muted mb-1 block">Nỗi đau (Pain Points)</span>
                              <p className="text-sm text-foreground bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{node.pain_points}</p>
                           </div>
                           
                           <div className="relative">
                              <span className="text-xs font-semibold uppercase tracking-wider text-linear-text-muted mb-1 block">Động lực (Drivers)</span>
                              <p className="text-sm text-foreground bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{node.decision_drivers}</p>
                           </div>

                           {/* Warning Block */}
                           <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                              <div className="flex items-start space-x-2 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg border border-rose-200 dark:border-rose-500/30">
                                 <ShieldAlert className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                                 <div>
                                   <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-0.5">Rủi ro Trục lợi / Cảm tính</span>
                                   <p className="text-xs font-medium text-rose-700/80 dark:text-rose-300/80 leading-relaxed">{node.opportunism_risk}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>
        
        <WizardNavigation prevLink="/planning/a3-revenue" prevLabel="Về A.3" nextLink="/planning/a5-swot" nextLabel="Tiếp tục: A.5 SWOT" />
      </div>
    </B2BPageTemplate>
    </>
  );
}
