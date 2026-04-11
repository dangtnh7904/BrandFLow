"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-3 py-1.5 rounded-full bg-transparent border ultra-thin-border mb-8"
        >
          <Bot className="w-4 h-4 text-cyan-400 mr-2" />
          <span className="text-xs font-semibold text-linear-text-muted uppercase tracking-wider">Tiên phong Mạng Lưới AI Agency</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight mb-6"
        >
          Định nghĩa lại Digital Marketing <br className="hidden md:block" />
          với <span className="gradient-ai-text">Dữ Liệu và AI.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-linear-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          BrandFlow thay thế mô hình agency truyền thông truyền thống bằng mạng lưới AI Agents chuyên biệt. Tối ưu hóa AEO, xây dựng thương hiệu, và triển khai chiến dịch với tốc độ tức thì.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link href="/dashboard">
            <button className="flex items-center px-8 py-4 rounded-full gradient-ai-bg text-base font-semibold w-full sm:w-auto justify-center">
              Dùng thử miễn phí <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </Link>
          <button className="flex items-center px-8 py-4 rounded-full bg-transparent border ultra-thin-border hover:bg-zinc-100 transition-colors text-foreground text-base font-semibold w-full sm:w-auto justify-center">
            <Zap className="w-5 h-5 mr-2 text-cyan-500" /> Xem Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
