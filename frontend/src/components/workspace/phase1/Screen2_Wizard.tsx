"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Screen2_Wizard({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setDirection(1);
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const STEPS: TranslationKey[] = ["wizard.step_c1", "wizard.step_c2", "wizard.step_c3"];

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative">
      {/* Pinned Progress Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 pt-8 pb-4 px-8 w-full shadow-sm">
         <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between relative mb-2">
               <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200 -z-10"></div>
               <div className="absolute left-0 top-1/2 -mt-px h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
               
               {STEPS.map((label, idx) => {
                 const s = idx + 1;
                 const isActive = step >= s;
                 const isCurrent = step === s;
                 return (
                   <div key={s} className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300",
                        isActive ? "bg-blue-600 border-2 border-transparent text-white shadow-md" : "bg-white border-2 border-slate-300 text-slate-400 font-medium"
                      )}>
                         {isActive && !isCurrent ? <CheckCircle2 className="w-4 h-4 text-white" /> : s}
                      </div>
                      <span className={cn("text-[10px] uppercase tracking-widest mt-2 whitespace-nowrap hidden md:block font-medium", isActive ? "text-blue-700 font-bold" : "text-slate-400")}>{t(label)}</span>
                   </div>
                 );
               })}
            </div>
         </div>
      </div>

      {/* Form Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto px-8 py-10">
         <div className="max-w-4xl mx-auto w-full relative min-h-[500px]">
            <AnimatePresence custom={direction} mode="wait">
               <motion.div
                 key={step}
                 custom={direction}
                 variants={variants}
                 initial="enter"
                 animate="center"
                 exit="exit"
                 transition={{ duration: 0.3, ease: "easeInOut" }}
                 className="w-full"
               >
                  {step === 1 && <WizardStep1 />}
                  {step === 2 && <WizardStep2 />}
                  {step === 3 && <WizardStep3 />}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-6 flex justify-between items-center z-50">
         <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
            <button onClick={handlePrev} className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center shadow-sm">
               <ArrowLeft className="w-4 h-4 mr-2" /> {step === 1 ? t('wizard.back_hall') : t('wizard.prev_step')}
            </button>
            <button onClick={handleNext} className={cn("px-8 py-3 rounded-xl font-bold flex items-center shadow-md transition-all hover:shadow-lg hover:scale-[1.02] text-white", step === 3 ? "gradient-ai-bg" : "gradient-ai-bg")}>
               {step === 3 ? t('wizard.complete') : t('wizard.next_step')} <ArrowRight className="w-4 h-4 ml-2 text-white" />
            </button>
         </div>
      </div>
    </div>
  );
}
