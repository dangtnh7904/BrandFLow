"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-linear-bg/80 backdrop-blur-lg border-b ultra-thin-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl gradient-ai-bg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-blue-600 transition-colors">
            BrandFlow
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#services" className="text-sm font-medium text-linear-text-muted hover:text-foreground transition-colors">Dịch vụ AI</Link>
          <Link href="#pricing" className="text-sm font-medium text-linear-text-muted hover:text-foreground transition-colors">Bảng giá (Tiers)</Link>
          <Link href="#about" className="text-sm font-medium text-linear-text-muted hover:text-foreground transition-colors">Về Chúng Tôi</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-blue-600 transition-colors hidden sm:block">
            Đăng nhập
          </Link>
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-5 py-2.5 rounded-full gradient-ai-bg text-sm font-semibold"
            >
              Bắt đầu miễn phí <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
