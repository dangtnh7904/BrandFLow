"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* Left Column (Content & CTA) */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-20 mt-10 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mb-6 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse mr-3 shrink-0" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide">BrandFlow 2.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
          >
            Tự động hóa <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              quy trình doanh nghiệp
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed"
          >
            Tối ưu hóa chiến dịch marketing và quản lý hiệu suất nền tảng của bạn thông qua sức mạnh của AI, giảm thiểu thao tác thủ công và tối đa hóa ROI.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/workspace" className="w-full sm:w-auto">
              <button className="flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200 w-full group">
                ENTER WORKSPACE <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="flex items-center justify-center px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold backdrop-blur-sm transition-all duration-200 w-full sm:w-auto group">
              <Zap className="w-5 h-5 mr-2 text-cyan-500 group-hover:fill-cyan-500/20 transition-colors" /> Xem Demo
            </button>
          </motion.div>
        </div>

        {/* Right Column (Visuals & 3D Placeholder) */}
        <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[600px] flex items-center justify-center z-10 mt-12 lg:mt-0">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute top-0 lg:top-10 left-0 lg:-left-4 w-full max-w-lg h-[400px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-900/10 transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10 overflow-hidden"
          >
            {/* Mac-style top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/40 dark:border-slate-800/80 bg-white/50 dark:bg-slate-800/50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
            
            {/* Mock Dashboard UI */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm" />
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-700/70 rounded-md" />
                <div className="h-3 w-5/6 bg-slate-200/70 dark:bg-slate-700/70 rounded-md" />
                <div className="h-3 w-4/6 bg-slate-200/70 dark:bg-slate-700/70 rounded-md" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="h-28 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30">
                   <div className="relative w-16 h-16">
                     <svg className="w-full h-full text-blue-500" viewBox="0 0 36 36">
                       <path className="stroke-current text-blue-200 dark:text-blue-900/50" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                       <path className="stroke-current text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" strokeWidth="3" strokeDasharray="75, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">75%</div>
                   </div>
                </div>
                
                <div className="h-28 bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-900/10 rounded-xl flex flex-col justify-end p-4 border border-cyan-200/50 dark:border-cyan-800/30 overflow-hidden">
                  <div className="w-full flex items-end justify-between gap-1.5 md:gap-2 h-16">
                    <div className="w-full bg-cyan-400/60 dark:bg-cyan-500/60 h-[40%] rounded-t-sm" />
                    <div className="w-full bg-cyan-400/80 dark:bg-cyan-500/80 h-[60%] rounded-t-sm" />
                    <div className="w-full bg-cyan-500 dark:bg-cyan-400 h-[100%] rounded-t-sm shadow-[0_0_10px_rgba(6,182,212,0.3)] relative">
                       <div className="absolute top-0 inset-x-0 h-1 bg-white/40" />
                    </div>
                    <div className="w-full bg-cyan-400/60 dark:bg-cyan-500/60 h-[70%] rounded-t-sm" />
                    <div className="w-full bg-cyan-400/40 dark:bg-cyan-500/40 h-[30%] rounded-t-sm" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3D Canvas Placeholder Box */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="absolute -bottom-10 -right-10 w-[450px] h-[500px] border-2 border-dashed border-blue-400/60 bg-blue-500/5 backdrop-blur-md rounded-2xl z-30 flex items-center justify-center p-6 text-center shadow-lg pointer-events-none max-w-[100vw]"
          >
            <div className="text-blue-500 dark:text-blue-400 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 border border-blue-300 dark:border-blue-700/50">
                <Bot className="w-8 h-8 opacity-70" />
              </div>
              <p className="font-mono text-sm font-semibold tracking-wide bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-md">
                Placeholder cho {'<Canvas 3D>'}
              </p>
              <p className="text-xs mt-3 opacity-60 max-w-[220px] leading-relaxed">
                Khu vực này được bảo lưu riêng cho việc tích hợp mascot 3D trong tương lai.
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
