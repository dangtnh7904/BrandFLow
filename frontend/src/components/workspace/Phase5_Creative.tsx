"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, FileText, Image as ImageIcon, Wand2, Type, Layout } from 'lucide-react';

export default function Phase5_Creative({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window && (window as any).__DEMO_MODE__) {
      const timers = [
        setTimeout(() => setStep(1), 500), // Show copy
        setTimeout(() => setStep(2), 1000), // Show colors
        setTimeout(() => setStep(3), 1500), // Show typography
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setStep(3); // Fully loaded if not demo
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col p-6 max-w-[90rem] mx-auto z-10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Creative & Design Studio
          </h2>
          <p className="text-linear-text-muted mt-1">Multi-modal content generation & brand identity</p>
        </div>
        <button 
          id="btn-next-phase5"
          onClick={onNext}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center group"
        >
          Deploy Custom Agent
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* Left: Copywriting Lab */}
        <div className="col-span-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-pink-400" />
            Copywriting Lab
          </h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {step >= 1 && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider bg-pink-500/10 px-2 py-1 rounded">Facebook Post</span>
                  <span className="text-xs text-slate-400">Target: Housewives, 25-45</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  "Mọi căn bếp không chỉ là nơi thưởng thức món ngon, mà còn là nơi câu chuyện yêu thương được kể bằng những góc phẳng gỗ mộc mạc..."
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[10px] text-slate-500 border border-slate-600/50 px-2 py-0.5 rounded-full">#BepNhaMoc</span>
                  <span className="text-[10px] text-slate-500 border border-slate-600/50 px-2 py-0.5 rounded-full">#Noithatgo</span>
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-1 rounded">PR Article (Intro)</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-2">Bếp Nhà Mộc - Bồi Giữ Giá Trị Truyền Thống Trong Từng Thớ Gỗ</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Trước làn sóng của hàng loạt xu hướng nội thất hiện đại, việc tìm về với thiên nhiên và những giá trị gốc rễ đang trở thành một sự lựa chọn...
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Design Studio */}
        <div className="col-span-7 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-purple-400" />
            Brand Identity Generator
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Colors */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center"><Palette className="w-4 h-4 mr-1.5"/> Color Palette</h4>
              {step >= 2 && (
                <div className="flex gap-3">
                  {[
                    { c: 'bg-[#5c4033]', n: 'Moc Brown' },
                    { c: 'bg-[#8b5a2b]', n: 'Oak' },
                    { c: 'bg-[#2e8b57]', n: 'Leaf Green' },
                    { c: 'bg-[#f5f5dc]', n: 'Beige' },
                  ].map((color, i) => (
                    <motion.div 
                      key={i} 
                      initial={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay: i*0.1}}
                      className="group cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-full ${color.c} shadow-lg ring-2 ring-white/10 group-hover:ring-white/30 transition-all`} />
                      <p className="text-[10px] text-center mt-2 text-slate-500">{color.n}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Typography */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center"><Type className="w-4 h-4 mr-1.5"/> Typography</h4>
              {step >= 3 && (
                <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-3 bg-slate-800/40 p-3 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Primary / Headings</span>
                    <p className="text-2xl font-serif text-slate-200">Playfair Display</p>
                  </div>
                  <div className="h-px w-full bg-slate-700/50" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Secondary / Body</span>
                    <p className="text-base font-sans text-slate-300">Inter / Roboto</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Moodboard */}
            <div className="col-span-2 mt-2">
               <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center"><ImageIcon className="w-4 h-4 mr-1.5"/> Moodboard & Layouts</h4>
               {step >= 3 && (
                 <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid grid-cols-3 gap-3">
                   <div className="h-24 bg-slate-800 rounded-lg overflow-hidden relative group">
                     <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-all" style={{backgroundImage: "url('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"}}></div>
                   </div>
                   <div className="h-24 bg-slate-800 rounded-lg overflow-hidden relative group">
                     <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-all" style={{backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"}}></div>
                   </div>
                   <div className="h-24 bg-slate-800 rounded-lg border border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-xs">
                     <Wand2 className="w-4 h-4 mr-1" /> Generating...
                   </div>
                 </motion.div>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
