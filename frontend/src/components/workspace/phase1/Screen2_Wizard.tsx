"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, X, Server } from 'lucide-react';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useFormStore } from '@/store/useFormStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Screen2_Wizard({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // New GAP logic states
  const [showGapModal, setShowGapModal] = useState(false);
  const [missingGaps, setMissingGaps] = useState<any[]>([]);
  const [gapAnswers, setGapAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string|null>(null);

  const BACKEND_URL = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : 'http://127.0.0.1:8000';

  const runGapAnalysis = async () => {
     setIsAnalyzing(true);
     setErrorStatus(null);
     try {
        const fullText = typeof window !== 'undefined' ? localStorage.getItem('bf_doc_text') || "" : "";
        const gapRes = await fetch(`${BACKEND_URL}/api/v1/planning/analyze-gaps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ document_text: fullText || "No context provided" })
        });
        const gapData = await gapRes.json();
        
        if (gapData.status === 'success' && gapData.data?.missing_gaps?.length > 0) {
            setMissingGaps(gapData.data.missing_gaps);
            setShowGapModal(true);
        } else {
            await handleGenerateForms();
        }
     } catch (err: any) {
         setErrorStatus("Lỗi kết nối phân tích Gap.");
     } finally {
         setIsAnalyzing(false);
     }
  };

  const handleGenerateForms = async () => {
    setIsGenerating(true);
    setErrorStatus(null);
    try {
      if (!useFormStore.getState().projectId) {
         await useFormStore.getState().initializeProject();
      }
      const fullText = typeof window !== 'undefined' ? localStorage.getItem('bf_doc_text') || "" : "";
      
      const p_id = useFormStore.getState().projectId || "default_project";
      const u_id = typeof window !== 'undefined' ? localStorage.getItem('brandflow_user_id') || "default_user" : "default_user";

      const res = await fetch(`${BACKEND_URL}/api/v1/planning/generate-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_text: fullText,
          gap_answers: gapAnswers,
          project_id: p_id,
          user_id: u_id
        })
      });
      if (!res.ok) throw new Error("Lỗi API Generate Forms");
      await useFormStore.getState().loadAllForms();
      setShowGapModal(false);
      onComplete(); // -> proceed to dashboard (Screen 3)
    } catch (err) {
      setErrorStatus("Lỗi khi sinh 23 form.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setDirection(1);
      setStep(step + 1);
    } else {
      runGapAnalysis();
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
    <>
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
         <div className="max-w-4xl mx-auto w-full flex justify-between items-center relative">
            {errorStatus && <p className="absolute -top-8 right-0 text-xs text-rose-500 font-bold bg-white px-3 py-1 rounded shadow-sm border border-rose-100">{errorStatus}</p>}
            <button onClick={handlePrev} disabled={isAnalyzing} className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center shadow-sm disabled:opacity-50">
               <ArrowLeft className="w-4 h-4 mr-2" /> {step === 1 ? t('wizard.back_hall') : t('wizard.prev_step')}
            </button>
            <button onClick={handleNext} disabled={isAnalyzing} className={cn("px-8 py-3 rounded-xl font-bold flex items-center shadow-md transition-all hover:shadow-lg hover:scale-[1.02] text-white", step === 3 ? "gradient-ai-bg disabled:opacity-75 disabled:grayscale-[0.5]" : "gradient-ai-bg")}>
               {isAnalyzing && step === 3 ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : null}
               {isAnalyzing && step === 3 ? "Đang rà soát lỗ hổng..." : step === 3 ? t('wizard.complete') : t('wizard.next_step')} {(!isAnalyzing || step !== 3) && <ArrowRight className="w-4 h-4 ml-2 text-white" />}
            </button>
         </div>
      </div>
    </div>
      
      {/* GAP ANALYSIS UI MODAL */}
      <AnimatePresence>
        {showGapModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
             >
                <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white flex justify-between items-center shrink-0">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                         <h3 className="text-xl font-bold text-slate-800 tracking-tight">AI đề xuất bổ sung thông tin</h3>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">Bạn vừa nạp xong ý tưởng (Form Lãnh đạo), tuy nhiên AI thấy trong tài liệu kinh doanh còn trống vài chi tiết sau:</p>
                   </div>
                   <button onClick={() => setShowGapModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-colors">
                     <X className="w-5 h-5" />
                   </button>
                </div>
                
                <div className="p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar bg-slate-50/50">
                   {missingGaps.map((gap, idx) => (
                      <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-center gap-3 mb-4">
                            <span className={cn(
                               "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                               gap.priority === 'critical' ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-amber-100 text-amber-700 border border-amber-200"
                            )}>
                               Mức {gap.priority}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                               <Server className="w-3 h-3 inline pb-0.5 mr-1" /> Nhóm {gap.group}
                            </span>
                         </div>
                         <p className="text-slate-800 font-semibold mb-4 text-[15px] leading-relaxed">{gap.question}</p>
                         <textarea 
                            className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-3 text-[14px] text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-h-[100px] resize-y placeholder:text-slate-400"
                            placeholder="Nhập thông tin tại đây (có thể bỏ qua để AI tự phỏng đoán)..."
                            value={gapAnswers[gap.field] || ""}
                            onChange={(e) => setGapAnswers(prev => ({ ...prev, [gap.field]: e.target.value }))}
                         />
                      </div>
                   ))}
                </div>
                
                <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-4">
                   <button 
                      onClick={() => { setShowGapModal(false); onComplete(); }} 
                      className="flex-1 py-3.5 font-bold rounded-xl text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                   >
                      Bỏ qua & Đi tiếp
                   </button>
                   <button 
                      onClick={handleGenerateForms} 
                      disabled={isGenerating} 
                      className="flex-[2] py-3.5 font-bold rounded-xl text-white gradient-ai-bg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale-[0.5] disabled:cursor-not-allowed"
                   >
                      {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                      {isGenerating ? "Hệ thống AI đang khởi tạo 23 Form (Mất ~10s)..." : "Xác nhận & Khởi tạo 23 Form"}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
