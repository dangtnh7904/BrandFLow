import React, { useState } from 'react';
import { HelpCircle, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface EducationTooltipProps {
  title: string;
  concept: string;
  explanation: string;
  example?: string;
  children: React.ReactNode;
}

export function EducationTooltip({ title, concept, explanation, example, children }: EducationTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="inline-flex items-center gap-1 group relative">
      {children}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-linear-text-muted hover:text-amber-500 transition-colors ml-1 p-0.5 rounded-full hover:bg-amber-500/10 focus:outline-none"
        title="Tìm hiểu thuật ngữ này"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-linear-background border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 p-4 border-b border-amber-500/20 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{title}</h4>
                  <p className="text-amber-400 text-xs font-mono">{concept}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-1 uppercase tracking-wider">Ý nghĩa (Definition)</h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {explanation}
                </p>
              </div>
              
              {example && (
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <h5 className="text-xs font-semibold text-emerald-400 mb-1">Ví dụ thực tế:</h5>
                  <p className="text-sm text-slate-300 italic">
                    "{example}"
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-black/40 p-3 text-center text-xs text-slate-500 border-t border-white/5">
              BrandFlow Academy - Nâng tầm tư duy chiến lược
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
