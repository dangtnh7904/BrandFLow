"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, ChevronRight, Activity, ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

import { useFormStore } from '@/store/useFormStore';

export default function Screen3_Dashboard({ onGoToHub, onGoToNext }: { onGoToHub: () => void, onGoToNext: () => void }) {
 const { t, language } = useLanguage();
 const intakeAnalysis = useFormStore(state => state.intakeAnalysis);
 const [loading, setLoading] = useState(true);
 const [loadingTextIndex, setLoadingTextIndex] = useState(0);
 const [isFocusExpanded, setIsFocusExpanded] = useState(false);

 const loadingTexts = [
 t('dashboard.loading1'),
 t('dashboard.loading2'),
 t('dashboard.loading3'),
 t('dashboard.loading4')
 ];

 useEffect(() => {
   let minTimePassed = false;
   const timer = setTimeout(() => { minTimePassed = true; }, 3500);

   const interval = setInterval(() => {
     setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
   }, 800);

   const isDemo = typeof window !== 'undefined' && (window as any).__DEMO_MODE__;
   const checkInterval = setInterval(() => {
     if ((minTimePassed && intakeAnalysis) || isDemo) {
       setLoading(false);
       clearInterval(checkInterval);
       clearInterval(interval);
     }
   }, 100);

   // Tự động thoát loading nếu quá 60s
   const timeoutFallback = setTimeout(() => {
     setLoading(false);
     clearInterval(checkInterval);
     clearInterval(interval);
   }, 60000);

   return () => {
     clearInterval(interval);
     clearInterval(checkInterval);
     clearTimeout(timer);
     clearTimeout(timeoutFallback);
   };
 }, [intakeAnalysis]);

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto text-center">
 <div className="relative w-24 h-24 mb-8">
 <div className="absolute inset-0 border-4 border-linear-border rounded-full"></div>
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
 className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-cyan-400 rounded-full"
 ></motion.div>
 <div className="absolute inset-0 flex items-center justify-center">
 <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
 </div>
 </div>
 <h2 className="text-xl font-bold text-foreground mb-2">{t('dashboard.loading_title')}</h2>
 <motion.p 
 key={loadingTextIndex}
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -5 }}
 className="text-sm font-bold text-cyan-400 tracking-widest uppercase"
 >
 {loadingTexts[loadingTextIndex]}
 </motion.p>
 </div>
 );
 }

 const audit = intakeAnalysis?.strategic_marketing_audit || {};
 const visualDNA = intakeAnalysis?.visual_brand_dna || {};
 const expertAnalysis = intakeAnalysis?.expert_business_analysis;
 
 const trustScore = audit.trust_score || 85;
 const competitivePositioning = audit.competitive_positioning || (language === 'vi' ? 'Thương hiệu lâu đời, có nền tảng tốt nhưng đang có dấu hiệu già hóa tệp khách hàng. Cần xây dựng hình ảnh năng động hơn.' : 'Established brand with good foundation but signs of aging customer base. Needs dynamic facelift.');

 const visualArchetype = visualDNA.visual_archetype || (language === 'vi' ? 'Tối giản, Chuyên nghiệp' : 'Minimal, Pro');
 const primaryColors = visualDNA.primary_colors || ["#0F172A", "#06b6d4", "#3b82f6"];
 const moodboardKeywords = visualDNA.moodboard_keywords || ["Corporate", "Trust", "Innovation"];

 const weaknesses = audit.macro_environment_pestle?.slice(0, 2) || [
     language === 'vi' ? 'Chưa tối ưu hóa trải nghiệm mượt mà trên môi trường Digital' : 'Digital UX requires further seamless integration',
     language === 'vi' ? 'Cần đồng bộ lại thông điệp tại hệ thống điểm bán lẻ' : 'POS messaging consistency can be unified'
 ];

 const radar2 = audit.core_competences?.slice(0, 2) || [
     language === 'vi' ? 'Giải quyết nỗi đau giá cao của khách hàng' : 'Solve high-price customer pain point',
     language === 'vi' ? 'Mở rộng danh sách cơ sở dữ liệu CRM' : 'Expand CRM database targeting'
 ];

 const focusObjective = audit.marketing_objectives?.[0] || t('dashboard.focus_2');
 const allObjectives = audit.marketing_objectives || [focusObjective];

 return (
 <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-[#0B1120] relative">
 {/* Enhance Visuals: Background Ambient Glows */}
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

 <div className="flex flex-col w-full max-w-5xl mx-auto p-8 min-h-full relative z-10">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-10"
 >
 <div className="inline-flex items-center px-4 py-2 rounded-full border border-linear-border bg-linear-surface/50 backdrop-blur-sm mb-4 shadow-sm">
 <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse mr-3 shrink-0" />
 <span className="text-xs font-semibold text-foreground tracking-wide uppercase">AI Research Completed</span>
 </div>
 <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
 {language === 'vi' ? 'Phân tích' : 'Brand'}{' '}
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
 {language === 'vi' ? 'DNA' : 'DNA'}
 </span>
 </h2>
 <p className="text-linear-text-muted text-lg max-w-2xl">{t('dashboard.desc')}</p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 {/* Module 1: Sức Khỏe Thương hiệu (Hero Scorecard) */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="md:col-span-3 bento-card p-8 flex flex-col md:flex-row items-center gap-8 bg-background border-linear-border"
 >
 <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
 <svg className="absolute inset-0 w-full h-full -rotate-90">
 <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="8" />
 <motion.circle 
 cx="80" cy="80" r="70" 
 fill="none" 
 stroke="#06b6d4" 
 strokeWidth="8" 
 strokeDasharray="440"
 initial={{ strokeDashoffset: 440 }}
 animate={{ strokeDashoffset: 440 - (440 * 75) / 100 }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 strokeLinecap="round"
 />
 </svg>
 <div className="text-center absolute">
 <span className="block text-4xl font-black text-foreground">{trustScore}</span>
 <span className="text-[10px] uppercase font-bold text-blue-600 tracking-widest">{t('dashboard.score')}</span>
 </div>
 </div>
 <div>
 <h3 className="text-xs font-bold text-linear-text-muted uppercase tracking-widest mb-2">{language === 'vi' ? 'Thực trạng Doanh thu & Cạnh tranh (Market Reality)' : 'Revenue & Market Reality'}</h3>
 <p className="text-lg text-foreground leading-relaxed font-medium">
 {competitivePositioning}
 </p>
 </div>
 </motion.div>

 {/* Module 2: Visual Brand DNA */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="bento-card p-6 border-linear-border"
 >
 <h3 className="text-xs font-bold text-linear-text-muted uppercase tracking-widest mb-4">🎨 Visual Brand DNA</h3>
 <div className="flex items-center mb-6">
 <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mr-4 shadow-sm border border-orange-100">
 <Shield className="w-6 h-6 text-orange-600" />
 </div>
 <div>
 <p className="text-lg font-bold text-foreground">{visualArchetype}</p>
 <p className="text-xs text-linear-text-muted">{language === 'vi' ? 'Khung thiết kế (Archetype)' : 'Archetype'}</p>
 </div>
 </div>
 
 <div className="mb-4">
 <p className="text-[10px] text-linear-text-muted font-bold uppercase tracking-wider mb-2">{language === 'vi' ? 'Bảng màu đề xuất' : 'Suggested Palette'}</p>
 <div className="flex space-x-2">
 {primaryColors.map((color: string, idx: number) => {
   const hexColor = color.split(' ')[0];
   return (
    <div key={idx} className="w-8 h-8 rounded-full border border-linear-border shadow-sm flex items-center justify-center relative group cursor-pointer" style={{ backgroundColor: hexColor }}>
      <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white font-medium px-2 py-1 rounded absolute -top-8 whitespace-nowrap shadow-md z-20 pointer-events-none transition-opacity">{color}</span>
    </div>
   );
 })}
 </div>
 </div>
 
 <div className="space-y-2 flex flex-wrap gap-2">
 {moodboardKeywords.map((kw: string, idx: number) => (
   <span key={idx} className="inline-block px-3 py-1 bg-linear-surface border border-linear-border rounded-full text-xs font-medium text-linear-text-muted shadow-sm">{kw}</span>
 ))}
 </div>
 </motion.div>

 {/* Module 3: Opportunities & Refinements */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="bento-card p-6 border-linear-border"
 >
 <h3 className="text-xs font-bold text-linear-text-muted uppercase tracking-widest mb-4">🔍 Market Audit</h3>
 
 <div className="mb-4">
 <h4 className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-2">{language === 'vi' ? 'Điểm chưa hoàn thiện (Weaknesses)' : 'Areas for Refinement'}</h4>
 <ul className="space-y-2">
 {weaknesses.map((w: string, idx: number) => (
   <li key={idx} className="flex items-start text-sm text-foreground"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 shrink-0"></div> {w}</li>
 ))}
 </ul>
 </div>
 
 <div>
 <h4 className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">{t('dashboard.radar_2')}</h4>
 <ul className="space-y-2">
 {radar2.map((r: string, idx: number) => (
   <li key={idx} className="flex items-start text-sm text-foreground"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></div> {r}</li>
 ))}
 </ul>
 </div>
 </motion.div>

 {/* Module 4: 90-Day Focus */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="bento-card p-6 border-linear-border relative overflow-hidden bg-background cursor-pointer hover:border-blue-400 transition-colors"
 onClick={() => setIsFocusExpanded(!isFocusExpanded)}
 >
 <h3 className="text-xs font-bold text-linear-text-muted uppercase tracking-widest mb-4 flex justify-between items-center">
   <span>{t('dashboard.focus')}</span>
   <span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{isFocusExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Xem chi tiết' : 'Expand')}</span>
 </h3>
 
 <div className="flex items-start mb-4 relative z-10 flex-col">
 <p className="text-sm font-bold text-foreground mb-2">{t('dashboard.focus_1')}</p>
 
 {!isFocusExpanded ? (
   <p className="text-[1.3rem] font-black text-blue-600 leading-snug line-clamp-2" title={focusObjective}>{focusObjective}</p>
 ) : (
   <div className="space-y-3 mt-2 w-full pb-4">
     {allObjectives.map((obj: string, i: number) => (
       <div key={i} className="flex items-start p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
         <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 mr-3">{i+1}</div>
         <p className="text-sm font-bold text-blue-800">{obj}</p>
       </div>
     ))}
   </div>
 )}
 
 {!isFocusExpanded && <Activity className="w-6 h-6 text-blue-600 opacity-50 absolute right-0 bottom-0 mb-1" />}
 </div>

 {/* Pure SVG Sparkline */}
 <div className="absolute bottom-0 left-0 w-full h-16 opacity-30 pointer-events-none">
 <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
 <motion.path 
 d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,2 L100,30 Z" 
 fill="url(#sparklineGradient)" 
 />
 <motion.path 
 d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,2" 
 fill="none" 
 stroke="#06b6d4" 
 strokeWidth="1.5"
 initial={{ pathLength: 0 }}
 animate={{ pathLength: 1 }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 />
 <defs>
 <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
 <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
 </linearGradient>
 </defs>
 </svg>
 </div>
 </motion.div>
 
 {expertAnalysis && (
   <motion.div 
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.45 }}
     className="md:col-span-3 bento-card p-8 border-linear-border bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-[#0B1120] text-white relative overflow-hidden shadow-lg mt-2"
   >
     <div className="absolute top-0 right-0 p-8 opacity-10">
       <Activity className="w-40 h-40 text-cyan-400" />
     </div>
     <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6 flex items-center">
       <Zap className="w-4 h-4 mr-2" />
       {language === 'vi' ? 'Đánh giá Chuyên gia (Expert Analysis)' : 'Expert Business Analysis'}
     </h3>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
       <div className="space-y-6">
         <div>
           <h4 className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider mb-2 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>{language === 'vi' ? 'Sức khỏe Tài chính' : 'Financial Health'}</h4>
           <p className="text-sm text-slate-300 leading-relaxed">{expertAnalysis.financial_health}</p>
         </div>
         <div>
           <h4 className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-2 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>{language === 'vi' ? 'Nút thắt Vận hành' : 'Operational Bottlenecks'}</h4>
           <p className="text-sm text-slate-300 leading-relaxed">{expertAnalysis.operational_bottlenecks}</p>
         </div>
       </div>
       <div className="space-y-6">
         <div>
           <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>{language === 'vi' ? 'Định giá Thương hiệu' : 'Brand Equity'}</h4>
           <p className="text-sm text-slate-300 leading-relaxed">{expertAnalysis.brand_equity_assessment}</p>
         </div>
         <div className="p-5 bg-blue-900/30 rounded-xl border border-blue-500/30 backdrop-blur-sm shadow-inner">
           <h4 className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mb-2">{language === 'vi' ? 'Đề xuất Chiến lược' : 'Strategic Recommendation'}</h4>
           <p className="text-sm text-blue-50 font-medium leading-relaxed">{expertAnalysis.strategic_recommendation}</p>
         </div>
       </div>
     </div>
   </motion.div>
 )}

 </div>

 {/* Module 5: CTA */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5 }}
 className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-8 border-t border-linear-border/50"
 >
  <button 
  id='btn-next-phase3-dashboard' onClick={onGoToNext}
  className="group relative px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-1 w-full sm:w-auto justify-center overflow-hidden"
  >
  {/* Shine effect */}
  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
  <span className="relative z-10 flex items-center">
  🚀 {language === 'vi' ? 'Tiếp tục — Chọn Tính Năng' : 'Continue — Select Feature'} <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
  </span>
  </button>
 </motion.div>
 </div>
 </div>
 );
}
