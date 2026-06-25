"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, FileBarChart, Presentation, Mail } from 'lucide-react';

export default function Phase7_Report({ onExport }: { onExport: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window && (window as any).__DEMO_MODE__) {
      const timers = [
        setTimeout(() => setStep(1), 300),
        setTimeout(() => setStep(2), 600),
        setTimeout(() => setStep(3), 900),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setStep(3);
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 z-10 relative">
      <div className="max-w-2xl w-full text-center">
        <motion.div 
          initial={{scale: 0.8, opacity: 0}} 
          animate={{scale: 1, opacity: 1}} 
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-4xl font-bold text-white mb-4">Master Plan Generated</h2>
        <p className="text-lg text-slate-400 mb-12">
          BrandFlow has successfully analyzed Bếp Nhà Mộc's DNA, debated strategy, modeled financials, created brand assets, and deployed your custom AI agent.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {/* Action 1 */}
          <motion.div 
            initial={{y: 20, opacity: 0}} animate={step >= 1 ? {y: 0, opacity: 1} : {}} 
            className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-all cursor-pointer group"
          >
            <Presentation className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-slate-200 mb-1">Pitch Deck</h3>
            <p className="text-xs text-slate-500">12 Slides (PPTX)</p>
          </motion.div>

          {/* Action 2 */}
          <motion.div 
            initial={{y: 20, opacity: 0}} animate={step >= 2 ? {y: 0, opacity: 1} : {}} transition={{delay: 0.1}}
            onClick={onExport}
            id="btn-export-final"
            className="bg-gradient-to-b from-emerald-900/50 to-teal-900/50 p-6 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer group shadow-lg shadow-emerald-900/20"
          >
            <Download className="w-8 h-8 text-emerald-400 mx-auto mb-4 group-hover:-translate-y-1 transition-transform" />
            <h3 className="text-sm font-bold text-white mb-1">Executive Report</h3>
            <p className="text-xs text-emerald-500/70">Comprehensive PDF</p>
          </motion.div>

          {/* Action 3 */}
          <motion.div 
            initial={{y: 20, opacity: 0}} animate={step >= 3 ? {y: 0, opacity: 1} : {}} transition={{delay: 0.2}}
            className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-all cursor-pointer group"
          >
            <Mail className="w-8 h-8 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-slate-200 mb-1">Email C-Level</h3>
            <p className="text-xs text-slate-500">Share via Outlook</p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
