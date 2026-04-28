"use client";

import React, { useEffect } from 'react';
import { Coffee, Laptop, BookOpen, Sparkles, LayoutGrid, CheckCircle2, Globe, Activity, Search, Zap, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFormStore } from '@/store/useFormStore';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

const INDUSTRIES = [
 { id: 'fb', key: 'ind_fb', icon: Coffee, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30' },
 { id: 'tech', key: 'ind_tech', icon: Laptop, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/30' },
 { id: 'edu', key: 'ind_edu', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/30' },
 { id: 'cosmetics', key: 'ind_cosmetics', icon: Sparkles, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-500/10', border: 'border-pink-200 dark:border-pink-500/30' },
 { id: 'other', key: 'ind_other', icon: LayoutGrid, color: 'text-linear-text-muted', bg: 'bg-background dark:bg-slate-800', border: 'border-linear-border dark:border-slate-700' },
];

export default function WizardStep1({ onNext }: { onNext?: () => void }) {
 const { t } = useLanguage();
 const { runMarketResearch, marketResearchStatus, marketResearchData, extractedAnswers, wizardAnswers, setWizardAnswer, setWizardAnswers } = useFormStore();
 
 const selectedIndustry = wizardAnswers['selectedIndustry'] || null;
 const setSelectedIndustry = (ind: string) => setWizardAnswer('selectedIndustry', ind);

 useEffect(() => {
   if (selectedIndustry && extractedAnswers && Object.keys(extractedAnswers).length > 0) {
     const keyMap: Record<string, string> = { fb: 'fnb', tech: 'tech', edu: 'edu', cosmetics: 'cosmetics', other: '' };
     const mappedInd = keyMap[selectedIndustry];
     
     if (mappedInd) {
       const prefilled: Record<string, any> = {};
       for (const [key, value] of Object.entries(extractedAnswers)) {
         prefilled[`${mappedInd}_${key}`] = value;
       }
       setWizardAnswers(prefilled);
     }
   }
 }, [selectedIndustry, extractedAnswers, setWizardAnswers]);

 return (
 <div className="space-y-12">
 <div className="text-center mb-8">
 <h2 className="text-2xl font-bold text-foreground mb-2">{t('wizard.step1_title')}</h2>
 <p className="text-linear-text-muted text-sm max-w-lg mx-auto">{t('wizard.step1_desc')}</p>
 </div>

 <AnimatePresence mode="wait">
 {(!selectedIndustry || selectedIndustry === 'other') ? (
   <motion.div 
     key="industry-grid"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0, scale: 0.95 }}
     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
   >
     {INDUSTRIES.map((ind) => {
       const isSelected = selectedIndustry === ind.id;
       const Icon = ind.icon;
       return (
         <div 
           key={ind.id}
           onClick={() => {
             setSelectedIndustry(ind.id);
             if (ind.id !== 'other') {
               runMarketResearch(ind.id);
             }
           }}
           className={cn(
             "relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2",
             isSelected 
               ? `${ind.bg} ${ind.border} shadow-sm scale-105` 
               : "bg-linear-surface border-linear-border hover:bg-linear-surface/80 hover:border-cyan-500/30"
           )}
         >
           <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", isSelected ? ind.bg : "bg-linear-surface/50 border border-linear-border")}>
             <Icon className={cn("w-6 h-6", isSelected ? ind.color : "text-linear-text-muted")} />
           </div>
           <h3 className={cn("font-bold text-lg mb-1", isSelected ? "text-foreground" : "text-foreground")}>
             {t(`wizard.${ind.key}` as any)}
           </h3>
           {isSelected && <CheckCircle2 className={cn("absolute top-6 right-6 w-6 h-6", ind.color)} />}
         </div>
       )
     })}
   </motion.div>
 ) : (
   <motion.div 
     key="scanner-ui"
     initial={{ opacity: 0, scale: 0.9, y: 20 }}
     animate={{ opacity: 1, scale: 1, y: 0 }}
     exit={{ opacity: 0, scale: 0.95, y: -20 }}
     transition={{ type: "spring", stiffness: 300, damping: 25 }}
     className="p-8 bg-[#0B1120] rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group min-h-[400px]"
   >
     {/* Background Effects */}
     <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
     <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-500 opacity-70" />
     
     <div className="relative z-10">
       <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800/80">
         <div className="flex items-center gap-4">
           {marketResearchStatus === 'running' ? (
             <div className="relative flex h-10 w-10 items-center justify-center">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-30"></span>
               <div className="relative inline-flex rounded-full h-10 w-10 bg-cyan-500/20 items-center justify-center border border-cyan-500/50">
                 <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
               </div>
             </div>
           ) : marketResearchStatus === 'done' ? (
             <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
               <CheckCircle2 className="w-5 h-5 text-emerald-400" />
             </div>
           ) : (
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
               <Globe className="w-5 h-5 text-slate-500" />
             </div>
           )}
           
           <div>
             <h3 className="font-bold text-white text-lg tracking-wide uppercase flex items-center gap-2">
               Autonomous Market Researcher
               {marketResearchStatus === 'running' && <span className="flex gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay: '0ms'}}></span>
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay: '150ms'}}></span>
                 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay: '300ms'}}></span>
               </span>}
             </h3>
             <p className="text-sm text-slate-400 mt-1">
               {marketResearchStatus === 'running' ? "Đang quét dữ liệu toàn cầu thời gian thực..." : 
                marketResearchStatus === 'done' ? "Trinh sát Thị trường Hoàn tất" : 
                "Chờ kích hoạt hệ thống"}
             </p>
           </div>
         </div>
         
         <button 
           onClick={(e) => { e.stopPropagation(); setWizardAnswer('selectedIndustry', ''); }}
           className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
         >
           Đổi Ngành
         </button>
       </div>

       {marketResearchStatus === 'running' && (
         <div className="space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
               <Globe className="w-5 h-5 text-blue-500 animate-spin-slow" />
               <div>
                 <div className="text-xs text-slate-500">Nguồn dữ liệu</div>
                 <div className="text-sm text-slate-300 font-mono">Google, G2, MXH</div>
               </div>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
               <Search className="w-5 h-5 text-purple-500 animate-pulse" />
               <div>
                 <div className="text-xs text-slate-500">Trạng thái Phân tích</div>
                 <div className="text-sm text-slate-300 font-mono">Đang trích xuất...</div>
               </div>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
               <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
               <div>
                 <div className="text-xs text-slate-500">Mục tiêu</div>
                 <div className="text-sm text-slate-300 font-mono">Insight Đối thủ & TT</div>
               </div>
             </div>
           </div>
           
           <div className="space-y-2">
             <div className="flex justify-between text-xs font-mono">
               <span className="text-cyan-400">Đang đồng bộ hóa dữ liệu ngầm...</span>
               <span className="text-slate-500">60%</span>
             </div>
             <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
               <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full animate-[pulse_1.5s_ease-in-out_infinite] relative" style={{width: '60%'}}>
                 <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
               </div>
             </div>
             <p className="text-slate-500 text-xs italic mt-2 text-center">AI đang tổng hợp và phân tích 100,000+ điểm dữ liệu từ thị trường của bạn.</p>
           </div>
         </div>
       )}

       {marketResearchStatus === 'done' && marketResearchData && (
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="grid grid-cols-1 lg:grid-cols-12 gap-6"
         >
           {/* TAM SAM SOM Section */}
           <div className="lg:col-span-5 space-y-4">
             <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 h-full hover:border-cyan-500/30 transition-colors">
               <h4 className="text-xs uppercase text-cyan-500 font-bold mb-4 flex items-center">
                 <Target className="w-4 h-4 mr-2" /> Chỉ số Vĩ mô (Dự phóng)
               </h4>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                   <div className="text-xs text-slate-400 mb-1">TAM</div>
                   <div className="text-lg font-bold text-white tracking-tight">{marketResearchData.tam_sam_som?.TAM || "---"}</div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                   <div className="text-xs text-slate-400 mb-1">SAM</div>
                   <div className="text-lg font-bold text-blue-400 tracking-tight">{marketResearchData.tam_sam_som?.SAM || "---"}</div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                   <div className="text-xs text-slate-400 mb-1">SOM Mục tiêu</div>
                   <div className="text-lg font-bold text-emerald-400 tracking-tight">{marketResearchData.tam_sam_som?.SOM || "---"}</div>
                 </div>
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                   <div className="text-xs text-slate-400 mb-1">Tăng trưởng CAGR</div>
                   <div className="text-lg font-bold text-purple-400 tracking-tight">{marketResearchData.tam_sam_som?.CAGR || "---"}</div>
                 </div>
               </div>
             </div>
           </div>

           {/* Market Gap & Competitors */}
           <div className="lg:col-span-7 space-y-4">
             <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors">
               <h4 className="text-xs uppercase text-blue-500 font-bold mb-3 flex items-center">
                 <Globe className="w-4 h-4 mr-2" /> Khoảng trống thị trường (Market Gap)
               </h4>
               <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl">{marketResearchData.market_gap}</p>
             </div>

             <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-colors">
               <h4 className="text-xs uppercase text-purple-500 font-bold mb-4 flex items-center">
                 <Activity className="w-4 h-4 mr-2" /> Phân tích Đối thủ Chính
               </h4>
               <div className="space-y-4">
                 {marketResearchData.competitors?.map((comp: any, i: number) => (
                   <div key={i} className="flex gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                     <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-400 font-bold">
                       #{i+1}
                     </div>
                     <div>
                       <div className="font-bold text-white text-sm mb-2">{comp.name || `Đối thủ ${i+1}`}</div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                         <div className="text-slate-400"><span className="text-emerald-400 font-bold">Mạnh:</span> {comp.strengths}</div>
                         <div className="text-slate-400"><span className="text-rose-400 font-bold">Yếu:</span> {comp.pain_points}</div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>

           {/* Continue Button */}
           <div className="lg:col-span-12 mt-6 flex justify-end border-t border-slate-800/80 pt-6">
             <button 
               onClick={onNext}
               className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center gap-2"
             >
               Tiếp tục & Bắt đầu lập chiến lược <span className="text-xl">→</span>
             </button>
           </div>
         </motion.div>
       )}
     </div>
   </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
