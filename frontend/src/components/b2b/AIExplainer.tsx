import React, { useState } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIExplainerProps {
  title: string;
  concept: string;
  example: string;
  buttonLabel?: string;
}

export default function AIExplainer({ title, concept, example, buttonLabel = "AI Giải thích phần này" }: AIExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center text-xs font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-emerald-100 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-full border border-emerald-200"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
          {buttonLabel}
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#f8fafc] to-[#f0fdf4] border border-emerald-200 rounded-xl p-5 shadow-sm relative"
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 p-1 text-linear-text-muted hover:text-linear-text-muted hover:bg-slate-100 dark:bg-slate-800/30 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center mb-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mr-3 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
             </div>
             <h4 className="font-bold text-foreground text-sm">Trợ lý Chiến lược AI giải thích: <span className="text-cyan-400">{title}</span></h4>
          </div>
          
          <div className="space-y-3 text-sm ml-11">
             <p className="text-linear-text-muted leading-relaxed font-medium">
               {concept}
             </p>
             <div className="bg-white/60 border border-emerald-100/50 p-3 rounded-lg text-linear-text-muted mt-2">
               <strong className="text-cyan-400 text-xs uppercase tracking-wider block mb-1">Ví dụ dễ hiểu:</strong>
               {example}
             </div>
             <button className="text-cyan-400 hover:text-cyan-400 text-xs font-bold pt-1 flex items-center group">
                Tự động điền phần này bằng AI của tôi <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
