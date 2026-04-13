"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, LineChart, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { BrandFlowLogo } from '../brand/BrandFlowLogo';

export default function HeroSection() {
 return (
 <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-background">
 {/* Background Glows */}
 <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

 <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 relative z-10">
 
 {/* Left Column (Content & CTA) */}
 <div className="w-full lg:w-[55%] flex flex-col items-start text-left z-20 mt-10 lg:mt-0">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="inline-flex items-center px-4 py-2 rounded-full border border-linear-border bg-linear-surface/50 backdrop-blur-sm mb-6 shadow-sm"
 >
 <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse mr-3 shrink-0" />
 <span className="text-sm font-semibold text-foreground tracking-wide">BrandFlow Multi-Agent System</span>
 </motion.div>

 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.1 }}
 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
 >
 Tuyệt đối chính xác. <br className="hidden sm:block" />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400">
 Hoàn toàn tự động.
 </span>
 </motion.h1>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.2 }}
 className="text-lg md:text-xl text-linear-text-muted mb-10 max-w-xl leading-relaxed space-y-4"
 >
 <p>
 Mỗi chiến lược marketing đều được thẩm định bởi "Math Engine" chống ảo giác tài chính, đảm bảo ngân sách quảng cáo của bạn luôn được kiểm soát tuyệt đối bằng dữ liệu thực.
 </p>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.3 }}
 className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
 >
 <Link href="/workspace" className="w-full sm:w-auto">
 <button className="flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-200 w-full group">
 TRUY CẬP HỆ THỐNG <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
 </button>
 </Link>
 <button className="flex items-center justify-center px-8 py-4 rounded-xl border border-linear-border bg-linear-surface hover:bg-linear-border/50 text-foreground font-semibold backdrop-blur-sm transition-all duration-200 w-full sm:w-auto group">
 <Zap className="w-5 h-5 mr-2 text-cyan-500 group-hover:fill-cyan-500/20 transition-colors" /> Phân tích ngân sách
 </button>
 </motion.div>
 </div>

 {/* Right Column (Visuals & Brand Logo) */}
 <div className="w-full lg:w-[45%] relative h-[500px] lg:h-[600px] flex items-center justify-center z-10 mt-12 lg:mt-0">
 
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.7, delay: 0.4 }}
 className="w-full max-w-md relative"
 >
 {/* The Logo embedded in the center */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
 <BrandFlowLogo className="w-56 h-56 md:w-72 md:h-72 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]" />
 </div>

 {/* Bento box elements floating around the logo representing Agents */}
 <motion.div 
 animate={{ y: [0, -10, 0] }}
 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
 className="absolute -top-16 -left-8 bento-card w-48 p-4 z-20 border-blue-500/30 dark:border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
 >
 <div className="flex items-center gap-3 mb-2">
 <BrainCircuit className="w-5 h-5 text-blue-500" />
 <span className="text-sm font-bold">Content Agent</span>
 </div>
 <div className="h-1.5 w-full bg-linear-border rounded-full overflow-hidden">
 <div className="h-full bg-blue-500 w-[85%] rounded-full" />
 </div>
 </motion.div>

 <motion.div 
 animate={{ y: [0, 10, 0] }}
 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
 className="absolute top-4 -right-12 bento-card w-48 p-4 z-20 border-cyan-500/30 dark:border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
 >
 <div className="flex items-center gap-3 mb-2">
 <Target className="w-5 h-5 text-cyan-500" />
 <span className="text-sm font-bold">SEO Agent</span>
 </div>
 <div className="h-1.5 w-full bg-linear-border rounded-full overflow-hidden">
 <div className="h-full bg-cyan-500 w-[92%] rounded-full" />
 </div>
 </motion.div>

 <motion.div 
 animate={{ y: [0, -8, 0] }}
 transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
 className="absolute -bottom-8 left-12 bento-card w-56 p-4 z-20 border-indigo-500/30 dark:border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
 >
 <div className="flex items-center gap-3 mb-2">
 <LineChart className="w-5 h-5 text-indigo-500" />
 <span className="text-sm font-bold">Math Engine</span>
 </div>
 <p className="text-xs text-linear-text-muted mt-1">RoAS Optimization: +24%</p>
 </motion.div>

 {/* Connecting SVG Lines (Faux connections behind the cards) */}
 <svg className="absolute inset-0 w-full h-full -z-10" style={{ pointerEvents: 'none' }}>
 <path d="M 0,0 L 200,200" stroke="currentColor" className="text-linear-border/30 dark:text-linear-border/10" strokeWidth="1" strokeDasharray="4 4" fill="none" />
 <path d="M 400,50 L 200,200" stroke="currentColor" className="text-linear-border/30 dark:text-linear-border/10" strokeWidth="1" strokeDasharray="4 4" fill="none" />
 <path d="M 100,400 L 200,200" stroke="currentColor" className="text-linear-border/30 dark:text-linear-border/10" strokeWidth="1" strokeDasharray="4 4" fill="none" />
 </svg>
 
 </motion.div>
 </div>
 </div>
 </section>
 );
}
