"use client";

import React, { useState } from 'react';
import { Calculator, ArrowLeft, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TASKS_EN = [
  { id: 't1', name: 'Setup LinkedIn Insights Tag', month: 1, duration: 1, type: 'setup', pct: 5 },
  { id: 't2', name: 'Publish Q3 Whitepaper', month: 1, duration: 2, type: 'content', pct: 35 },
  { id: 't3', name: 'B2B Retargeting Ads', month: 2, duration: 2, type: 'ads', pct: 35 },
  { id: 't4', name: 'SEO & AEO Onpage Optimization', month: 1, duration: 3, type: 'seo', pct: 15 },
  { id: 't5', name: 'Risk Contingency Fund', month: 1, duration: 3, type: 'contingency', pct: 10 }
];

const TASKS_VI = [
  { id: 't1', name: 'Setup LinkedIn Insights Tag', month: 1, duration: 1, type: 'setup', pct: 5 },
  { id: 't2', name: 'Phát hành Whitepaper Q3', month: 1, duration: 2, type: 'content', pct: 35 },
  { id: 't3', name: 'Chạy Ads Retargeting B2B', month: 2, duration: 2, type: 'ads', pct: 35 },
  { id: 't4', name: 'SEO & AEO Onpage Optimization', month: 1, duration: 3, type: 'seo', pct: 15 },
  { id: 't5', name: 'Quỹ Dự phòng rủi ro', month: 1, duration: 3, type: 'contingency', pct: 10 }
];

import { useLanguage } from '@/contexts/LanguageContext';

const SlotMachineTicker = ({ exactValue, isCalculating, baseBudget }: { exactValue: string, isCalculating: boolean, baseBudget: number }) => {
  const [displayValue, setDisplayValue] = useState('---');

  React.useEffect(() => {
    if (isCalculating) {
      let animationFrameId: number;
      const tick = () => {
        // Generate a random number around the base budget scale to simulate crunching
        const randomNum = Math.floor(Math.random() * baseBudget);
        setDisplayValue(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(randomNum));
        // Throttle slightly to make it readable as a matrix/slot roll
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(tick);
        }, 30);
      };
      animationFrameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(animationFrameId);
    } else if (exactValue) {
      setDisplayValue(exactValue);
    }
  }, [isCalculating, exactValue, baseBudget]);

  return (
    <span className={`font-mono transition-all duration-200 inline-block ${isCalculating ? 'text-indigo-400 opacity-80 scale-105' : 'text-blue-600'}`}>
      {displayValue}
    </span>
  );
};

export default function Phase3_Tactics({ onNext, onBack, globalBudget }: { onNext: () => void, onBack: () => void, globalBudget: string }) {
  const { language, t } = useLanguage();
  const TASKS = language === 'vi' ? TASKS_VI : TASKS_EN;
  const [exactCosts, setExactCosts] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setIsCalculated(false);
    setTimeout(() => {
      const budgetNum = parseInt(globalBudget) || 100000000;
      const newCosts: Record<string, string> = {};
      
      TASKS.forEach(t => {
        const cost = (budgetNum * (t.pct / 100));
        newCosts[t.id] = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cost);
      });
      
      setExactCosts(newCosts);
      setIsCalculating(false);
      setIsCalculated(true);
      
      // Trigger snap flash over the table area
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
    }, 1500);
  };

  const getGanttColor = (type: string) => {
    switch(type) {
      case 'setup': return 'bg-zinc-500';
      case 'content': return 'bg-purple-500';
      case 'ads': return 'bg-cyan-500';
      case 'seo': return 'bg-blue-500';
      case 'contingency': return 'bg-orange-500';
      default: return 'bg-white/20';
    }
  };

  const budgetNum = parseInt(globalBudget) || 100000000;

  return (
    <div className="w-full h-full overflow-y-auto relative">
      <div className="flex flex-col p-8 max-w-6xl mx-auto w-full min-h-full">
      {/* Screen Flash Overlay */}
      {flash && (
        <motion.div 
           initial={{ opacity: 0.8 }}
           animate={{ opacity: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="absolute inset-0 bg-blue-100 z-50 pointer-events-none mix-blend-overlay"
        />
      )}

      <button onClick={onBack} className="absolute left-8 top-8 text-slate-500 hover:text-slate-800 transition-colors flex items-center text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm z-10">
         <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="mb-8 text-center mt-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('workspace_phase3.title' as any) as string}</h2>
        <p className="text-slate-700 font-medium">{t('workspace_phase3.desc' as any) as string}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gantt Chart UI */}
        <div className="bento-card bg-white shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">{t('workspace_phase3.touchpoints' as any) as string}</h3>
          
          <div className="w-full">
            <div className="grid grid-cols-4 text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
              <div className="col-span-1">{t('workspace_phase3.task' as any) as string}</div>
              <div className="text-center">{t('workspace_phase3.m1' as any) as string}</div>
              <div className="text-center">{t('workspace_phase3.m2' as any) as string}</div>
              <div className="text-center">{t('workspace_phase3.m3' as any) as string}</div>
            </div>

            <div className="space-y-4">
              {TASKS.map(task => (
                <div key={task.id} className="grid grid-cols-4 items-center gap-2">
                  <div className="col-span-1 text-xs text-slate-700 font-medium truncate pr-2" title={task.name}>{task.name}</div>
                  <div className="col-span-3 grid grid-cols-3 gap-1 relative h-6 bg-slate-50 rounded-md overflow-hidden p-1 shadow-inner border border-slate-100">
                     {/* Transparent grid lines */}
                     <div className="border-r border-slate-200 h-full"></div>
                     <div className="border-r border-slate-200 h-full"></div>
                     <div className="h-full"></div>
                     
                     {/* Gantt Bar */}
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`absolute top-1 bottom-1 rounded-sm ${getGanttColor(task.type)} shadow-sm opacity-90`}
                        style={{ 
                          left: `calc(${((task.month - 1) / 3) * 100}% + 4px)`, 
                          width: `calc(${((task.duration) / 3) * 100}% - 8px)` 
                        }}
                     />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budgeting Grid Math Hook */}
        <div className="bento-card flex flex-col bg-white shadow-sm border border-slate-200 relative overflow-hidden">
          {/* Subtle math engine crunching glow effect */}
          {isCalculating && (
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-0 border-2 border-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)] rounded-3xl pointer-events-none" 
             />
          )}

          <div className="mb-6 flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-800">{t('workspace_phase3.alloc' as any) as string}</h3>
             <span className="text-xs bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-slate-800 font-bold">{t('workspace_phase3.total' as any) as string} {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(budgetNum)}</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-2 font-medium">{t('workspace_phase3.task' as any) as string}</th>
                  <th className="py-3 px-2 font-medium text-center">CFO %</th>
                  <th className="py-3 px-2 font-medium text-right text-blue-600">Exact Cost (Math Engine)</th>
                </tr>
              </thead>
              <tbody>
                {TASKS.map(task => (
                  <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 text-slate-700 truncate max-w-[150px] font-medium">{task.name}</td>
                    <td className="py-3 px-2 text-center font-bold text-blue-600">{task.pct}%</td>
                    <td className="py-3 px-2 text-right font-bold h-10 align-middle">
                      <SlotMachineTicker 
                         exactValue={exactCosts[task.id]} 
                         isCalculating={isCalculating} 
                         baseBudget={budgetNum} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col space-y-3 z-10">
              <button 
                onClick={handleCalculate}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all ${isCalculated ? 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100' : 'gradient-ai-bg shadow-sm hover:shadow-md'}`}
             >
                {isCalculating ? (
                   <span className="animate-pulse flex items-center"><Calculator className="w-4 h-4 mr-2" /> {t('workspace_phase3.running' as any) as string}</span>
                ) : isCalculated ? (
                   <><CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" /> {t('workspace_phase3.recalculate' as any) as string}</>
                ) : (
                   <><Calculator className="w-4 h-4 mr-2" /> {t('workspace_phase3.run_engine' as any) as string}</>
                )}
             </button>

             {isCalculated && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                >
                   <button 
                      onClick={onNext}
                      className="w-full py-3 rounded-xl gradient-ai-bg text-white font-bold flex items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                   >
                      {t('workspace_phase3.approve_btn' as any) as string} <ArrowRight className="w-4 h-4 ml-2" />
                   </button>
                </motion.div>
             )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
