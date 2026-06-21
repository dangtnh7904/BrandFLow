"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Cpu, Layers } from 'lucide-react';

export default function VideoDemoPage() {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto flex flex-col items-center">
      <div className="w-full mb-10">
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Platform Demo</h1>
        <p className="text-linear-text-muted">High-fidelity demonstration of BrandFlow AI Multi-Agent architecture.</p>
      </div>

      <div className="w-full aspect-video bg-[#050505] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center group cursor-pointer">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Play Button */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300"
        >
          <Play className="w-10 h-10 text-white ml-2" fill="currentColor" />
        </motion.div>

        {/* HUD Elements */}
        <div className="absolute top-6 left-6 flex gap-4">
          <div className="px-3 py-1.5 rounded bg-black/40 backdrop-blur border border-white/10 text-xs font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Live System
          </div>
          <div className="px-3 py-1.5 rounded bg-black/40 backdrop-blur border border-white/10 text-xs font-bold text-white/50 tracking-widest uppercase">
            V 2.0.4
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter mb-1 drop-shadow-md">BrandFlow Master Demo</h3>
            <p className="text-sm text-white/60 font-medium">Full AI Marketing Pipeline (Intake → CFO Audit → Blueprint)</p>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center text-white/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center text-white/50">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center text-white/50">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full mt-12">
        {[
          { title: 'Intake & Strategy', time: '02:15', desc: 'Agent phân tích thị trường & định vị' },
          { title: 'CFO Cross-Audit', time: '05:30', desc: 'Tranh biện tài chính và tối ưu ROI' },
          { title: 'Export Blueprint', time: '08:45', desc: 'Xuất báo cáo PDF & Dashboard GTM' }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-xl bg-[#0B1120]/50 border border-white/5 hover:border-cyan-500/30 hover:bg-[#0B1120] transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-white tracking-tight">{item.title}</h4>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">{item.time}</span>
            </div>
            <p className="text-sm text-linear-text-muted leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
