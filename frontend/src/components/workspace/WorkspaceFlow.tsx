"use client";

import React, { useState } from 'react';
import Phase1_Ingestion from './Phase1_Ingestion';
import Phase2_Debate from './Phase2_Debate';
import Phase3_Tactics from './Phase3_Tactics';
import Phase4_Execution from './Phase4_Execution';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WorkspaceFlow() {
  const { t } = useLanguage();
  const [currentStage, setCurrentStage] = useState(1);
  const [globalBudget, setGlobalBudget] = useState('100000000');

  const goToState = (stage: number) => {
    setCurrentStage(stage);
  };

  const handlePhase1Next = (data: any) => {
    if (data.budget) setGlobalBudget(data.budget);
    setCurrentStage(2);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 dark:bg-slate-950/50 relative">
      
      {/* Global Stage Indicator - Compact & Glassmorphism */}
      <div className="w-full bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg px-4 md:px-6 py-2.5 flex items-center justify-between shrink-0 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mt-12 md:mt-0 sticky top-0 z-50 transition-all duration-300">
        
        {/* Left: Title & Status Indicator */}
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight text-sm md:text-base">
            {t('flow.engine' as any)}
          </h1>
          {/* Live Status Pill */}
          <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-emerald-100/50 cursor-default">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              Agents Standby
            </span>
          </div>
        </div>

        {/* Right: Stage Stepper */}
        <div className="flex items-center space-x-6 md:space-x-10 overflow-x-auto no-scrollbar py-1">
           {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`flex items-center text-[11px] md:text-xs font-semibold uppercase tracking-widest transition-all duration-300 group ${
                  currentStage === s 
                  ? 'text-blue-600 dark:text-blue-400 scale-[1.02]' 
                  : currentStage > s 
                    ? 'text-blue-500 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-[1px]' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}
                onClick={() => currentStage > s && goToState(s)}
              >
                  <span className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center mr-2 transition-all duration-300 shadow-sm ${
                    currentStage === s 
                      ? 'border border-blue-600 bg-blue-50/80 dark:bg-blue-900/30 ring-2 ring-blue-100 dark:ring-blue-900/50' 
                      : currentStage > s 
                        ? 'border border-blue-500 bg-blue-500/10 text-blue-700 group-hover:bg-blue-500/20 group-hover:shadow-md' 
                        : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}>
                     {s}
                  </span>
                  <span className="hidden md:inline-block">{t('flow.stage' as any)} {s}</span>
              </div>
           ))}
        </div>
      </div>

      {/* Dynamic Render based on Stage - Main Canvas */}
      <div className="flex-1 w-full h-full overflow-hidden relative">
        <div className="absolute inset-0 transition-opacity duration-300">
          {currentStage === 1 && <Phase1_Ingestion onNext={handlePhase1Next} />}
          {currentStage === 2 && <Phase2_Debate onNext={() => goToState(3)} onBack={() => goToState(1)} />}
          {currentStage === 3 && <Phase3_Tactics onNext={() => goToState(4)} onBack={() => goToState(2)} globalBudget={globalBudget} />}
          {currentStage === 4 && <Phase4_Execution onBack={() => goToState(3)} />}
        </div>
      </div>
    </div>
  );
}
