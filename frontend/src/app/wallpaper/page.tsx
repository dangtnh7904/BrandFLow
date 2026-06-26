"use client";

import React from 'react';
import Image from 'next/image';
import { Sparkles, Globe, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WallpaperPage() {
  return (
    <div className="min-h-screen bg-[#060B14] flex flex-col items-center justify-center relative overflow-hidden text-white font-sans selection:bg-cyan-500/30">
      
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-cyan-600/20 blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />

      {/* Main Wallpaper Container (Aspect Ratio 9:16 optimized for mobile) */}
      <div className="w-full max-w-md h-[100dvh] mx-auto relative flex flex-col items-center justify-between py-16 px-8 z-10">
        
        {/* Header: BrandFlow Logo & Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center w-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              BrandFlow
            </h1>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">AI Marketing Strategy Engine</span>
          </div>
        </motion.div>

        {/* Center: QR Code Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full flex flex-col items-center my-8"
        >
          <div className="relative group">
            {/* Glow behind QR */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            {/* QR Container */}
            <div className="relative bg-white p-4 rounded-3xl shadow-2xl flex flex-col items-center justify-center">
              <Image 
                src="/linkedin_qr.png" 
                alt="Mạnh Đinh LinkedIn QR" 
                width={220} 
                height={220} 
                className="rounded-xl"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white p-1">
                <div className="w-full h-full bg-[#0A66C2] rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Mạnh Đinh</h2>
            <p className="text-sm font-semibold text-cyan-400">Founder & CEO</p>
            <p className="text-xs text-slate-400 mt-2">Quét mã để kết nối với tôi trên LinkedIn</p>
          </div>
        </motion.div>

        {/* Footer: Taglines / Decorative */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full grid grid-cols-2 gap-4 mt-auto"
        >
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm">
            <Target className="w-5 h-5 text-purple-400 mb-2" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">10-Min Strategy</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm">
            <Activity className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Data Driven AI</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
