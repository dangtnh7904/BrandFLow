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

export default function Screen3_Dashboard({ onComplete }: { onComplete: () => void }) {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingTexts = [
    t('dashboard.loading1'),
    t('dashboard.loading2'),
    t('dashboard.loading3'),
    t('dashboard.loading4')
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 800);

      setTimeout(() => {
        setLoading(false);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto text-center">
         <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-cyan-400 rounded-full"
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
         </div>
         <h2 className="text-xl font-bold text-slate-800 mb-2">{t('dashboard.loading_title')}</h2>
         <motion.p 
            key={loadingTextIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm font-medium text-cyan-600"
         >
            {loadingTexts[loadingTextIndex]}
         </motion.p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col w-full max-w-5xl mx-auto p-8 min-h-full">
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('dashboard.title')}</h2>
        <p className="text-slate-500">{t('dashboard.desc')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Module 1: Sức Khỏe Thương hiệu (Hero Scorecard) */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="md:col-span-3 bento-card p-8 flex flex-col md:flex-row items-center gap-8 bg-slate-50 border-slate-200"
        >
           <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <motion.circle 
                     cx="80" cy="80" r="70" 
                     fill="none" 
                     stroke="#10b981" 
                     strokeWidth="8" 
                     strokeDasharray="440"
                     initial={{ strokeDashoffset: 440 }}
                     animate={{ strokeDashoffset: 440 - (440 * 75) / 100 }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     strokeLinecap="round"
                  />
               </svg>
               <div className="text-center absolute">
                  <span className="block text-4xl font-black text-slate-800">85</span>
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-widest">{t('dashboard.score')}</span>
               </div>
           </div>
           <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{language === 'vi' ? 'Đánh giá Vị thế (Executive Audit)' : 'Executive Status'}</h3>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                 {language === 'vi' ? 'Thương hiệu lâu đời, có nền tảng tốt nhưng đang có dấu hiệu già hóa tệp khách hàng. Cần xây dựng hình ảnh năng động hơn.' : 'Established brand with good foundation but signs of aging customer base. Needs dynamic facelift.'}
              </p>
           </div>
        </motion.div>

        {/* Module 2: Visual Brand DNA */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bento-card p-6 border-slate-200"
        >
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">🎨 Visual Brand DNA</h3>
           <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mr-4 shadow-sm border border-orange-100">
                 <Shield className="w-6 h-6 text-orange-600" />
              </div>
               <div>
                 <p className="text-lg font-bold text-slate-800">{language === 'vi' ? 'Tối giản, Chuyên nghiệp' : 'Minimal, Pro'}</p>
                 <p className="text-xs text-slate-500">{language === 'vi' ? 'Khung thiết kế (Archetype)' : 'Archetype'}</p>
              </div>
           </div>
           
           <div className="mb-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">{language === 'vi' ? 'Bảng màu đề xuất' : 'Suggested Palette'}</p>
              <div className="flex space-x-2">
                 <div className="w-6 h-6 rounded-full border border-slate-300" style={{ backgroundColor: "#0F172A" }}></div>
                 <div className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: "#10B981" }}></div>
                 <div className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: "#F8FAFC" }}></div>
              </div>
           </div>
           
           <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 mr-2 mb-2 shadow-sm">Corporate</span>
              <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 mr-2 mb-2 shadow-sm">Trust</span>
              <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 mr-2 mb-2 shadow-sm">Innovation</span>
           </div>
        </motion.div>

        {/* Module 3: Opportunities & Refinements */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="bento-card p-6 border-slate-200"
        >
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">🔍 Market Audit</h3>
           
           <div className="mb-4">
              <h4 className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-2">{language === 'vi' ? 'Điểm chưa hoàn thiện (Weaknesses)' : 'Areas for Refinement'}</h4>
              <ul className="space-y-2">
                 <li className="flex items-start text-sm text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 shrink-0"></div> {language === 'vi' ? 'Chưa tối ưu hóa trải nghiệm mượt mà trên môi trường Digital' : 'Digital UX requires further seamless integration'}</li>
                 <li className="flex items-start text-sm text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 shrink-0"></div> {language === 'vi' ? 'Cần đồng bộ lại thông điệp tại hệ thống điểm bán lẻ' : 'POS messaging consistency can be unified'}</li>
              </ul>
           </div>
           
           <div>
              <h4 className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">{t('dashboard.radar_2')}</h4>
              <ul className="space-y-2">
                 <li className="flex items-start text-sm text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></div> {language === 'vi' ? 'Giải quyết nỗi đau giá cao của khách hàng' : 'Solve high-price customer pain point'}</li>
                 <li className="flex items-start text-sm text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></div> {language === 'vi' ? 'Mở rộng danh sách cơ sở dữ liệu CRM' : 'Expand CRM database targeting'}</li>
              </ul>
           </div>
        </motion.div>

        {/* Module 4: 90-Day Focus */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="bento-card p-6 border-slate-200 relative overflow-hidden bg-slate-50"
        >
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t('dashboard.focus')}</h3>
           
           <div className="flex items-end mb-4">
              <div>
                 <p className="text-sm font-bold text-slate-800 mb-1">{t('dashboard.focus_1')}</p>
                 <p className="text-2xl font-black text-blue-600">{t('dashboard.focus_2')}</p>
              </div>
              <Activity className="w-6 h-6 text-blue-600 opacity-50 ml-auto" />
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
                    stroke="#10b981" 
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                 />
                 <defs>
                    <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                       <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                 </defs>
              </svg>
           </div>
        </motion.div>
      </div>

      {/* Module 5: CTA */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
         className="flex justify-end"
      >
         <button 
            onClick={onComplete}
            className="px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center gradient-ai-bg text-white hover:shadow-lg hover:scale-105"
         >
            {t('dashboard.btn')} <ChevronRight className="w-5 h-5 ml-2" />
         </button>
      </motion.div>
    </div>
    </div>
  );
}
