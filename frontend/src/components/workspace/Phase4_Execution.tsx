"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calculator, Download, CheckCircle, Terminal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Phase4_Execution({ onBack, onNext }: { onBack: () => void, onNext?: () => void }) {
  const { language } = useLanguage();
  const [step, setStep] = useState(0); 

  useEffect(() => {
    if (window && (window as any).__DEMO_MODE__) {
      const timers = [
        setTimeout(() => setStep(1), 500), // Show python code
        setTimeout(() => setStep(2), 1000), // Show generated numbers
        setTimeout(() => setStep(3), 1500), // Show export PDF
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setStep(3);
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col p-6 max-w-7xl mx-auto z-10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
            Execution & Math Engine
          </h2>
          <p className="text-linear-text-muted mt-1">Đảm bảo P&L dương và xuất báo cáo hoàn chỉnh</p>
        </div>
        <button 
          id="btn-next-phase4"
          onClick={onNext}
          className={`px-6 py-2.5 rounded-lg font-bold flex items-center transition-all ${step >= 3 ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
        >
          Creative & Design <Download className="ml-2 w-4 h-4 hidden" />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Left: Math Engine Terminal */}
        <div className="bg-black/80 border border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <div className="flex items-center text-cyan-400 font-mono text-sm mb-4">
            <Terminal className="w-4 h-4 mr-2" /> Math Engine / cashflow.py
          </div>
          
          <div className="flex-1 overflow-hidden">
            <AnimatePresence>
              {step >= 1 && (
                <motion.pre initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap">
{`def optimize_marketing_budget(total_budget: float, target_roas: float):
    print("Initiating Monte Carlo Simulation...")
    
    allocations = {
        'brand_awareness': 0.3 * total_budget,
        'performance_ads': 0.5 * total_budget,
        'retention': 0.2 * total_budget
    }
    
    cac = calculate_cac(allocations['performance_ads'])
    ltv = calculate_ltv(allocations['retention'])
    
    if (ltv / cac) < 3.0:
        adjust_allocations(allocations, target_ratio=3.0)
        
    return {
        'optimized_allocations': allocations,
        'projected_revenue': sum(allocations.values()) * target_roas,
        'status': 'PROFITABLE'
    }`}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Output & Export */}
        <div className="flex flex-col gap-6">
          <div className="bg-linear-surface/60 backdrop-blur-md border border-linear-border rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-center relative overflow-hidden">
             {step >= 2 ? (
               <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="text-center">
                 <Calculator className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-white mb-2">Target P&L Secured</h3>
                 <div className="flex justify-center items-center space-x-8 mt-6">
                   <div>
                     <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">Est. Revenue</p>
                     <p className="text-3xl font-bold text-emerald-400 mt-1">1.8 Tỷ</p>
                   </div>
                   <div className="w-px h-12 bg-slate-700" />
                   <div>
                     <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">CAC / LTV</p>
                     <p className="text-3xl font-bold text-blue-400 mt-1">1:4.2</p>
                   </div>
                 </div>
               </motion.div>
             ) : (
               <div className="flex flex-col items-center justify-center text-slate-500 h-full">
                 <Calculator className="w-12 h-12 mb-4 opacity-50 animate-pulse" />
                 <p className="font-mono">Waiting for Math Engine...</p>
               </div>
             )}
          </div>

          <AnimatePresence>
            {step >= 3 && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-orange-500/50 rounded-3xl p-6 shadow-xl flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-orange-500/30">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Master Plan 2026</h4>
                    <p className="text-sm text-orange-200">128 pages • Brand Guideline • Content Matrix</p>
                  </div>
                </div>
                <CheckCircle className="w-8 h-8 text-orange-400" />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
