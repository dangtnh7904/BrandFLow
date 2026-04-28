"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PenSquare, Palette, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function HubPage() {
  const { language } = useLanguage();

  const features = [
    {
      id: "daily-content",
      title: language === 'vi' ? 'Nội dung Hàng ngày' : 'Daily Content',
      desc: language === 'vi' 
        ? 'Tạo nhanh bài đăng mạng xã hội, kịch bản ngắn dựa trên Brand DNA có sẵn.' 
        : 'Generate quick social posts and short scripts based on your Brand DNA.',
      icon: PenSquare,
      color: 'from-pink-500 to-rose-500',
      shadow: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]',
      border: 'hover:border-rose-500/50',
      href: '/daily-content'
    },
    {
      id: "design-studio",
      title: language === 'vi' ? 'Studio Thiết kế' : 'Design Studio',
      desc: language === 'vi' 
        ? 'Thiết kế logo, banner, bộ nhận diện với công cụ tạo ảnh tự động bám sát DNA.' 
        : 'Design logos, banners, and identity assets using AI image generation aligned with your DNA.',
      icon: Palette,
      color: 'from-fuchsia-500 to-purple-600',
      shadow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]',
      border: 'hover:border-purple-500/50',
      href: '/design-studio'
    },
    {
      id: "workspace",
      title: language === 'vi' ? 'Kế hoạch Chiến lược' : 'Strategic Planning',
      desc: language === 'vi' 
        ? 'Workspace đa tác vụ: AI Tranh biện, lập chiến lược và xuất báo cáo toàn diện.' 
        : 'Multi-agent workspace: AI Debate, strategic frameworking, and comprehensive output.',
      icon: MessageSquare,
      color: 'from-blue-600 to-cyan-500',
      shadow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]',
      border: 'hover:border-cyan-500/50',
      href: '/workspace'
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-transparent p-6 overflow-hidden">
      
      {/* Decorative Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-linear-border bg-linear-surface/50 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
          <span className="text-sm font-semibold text-foreground tracking-wide">
            {language === 'vi' ? 'Bạn muốn làm gì tiếp theo?' : 'What would you like to do next?'}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
          Brand<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Flow</span> Hub
        </h1>
        <p className="text-linear-text-muted text-lg max-w-xl mx-auto">
          {language === 'vi' 
            ? 'Chọn một công cụ chuyên biệt để bắt đầu biến DNA thương hiệu của bạn thành kết quả thực tế.' 
            : 'Select a specialized tool to start turning your brand DNA into tangible results.'}
        </p>

        <Link href="/onboarding">
          <button className="mt-8 px-6 py-2.5 rounded-full border border-linear-border bg-linear-surface/80 hover:bg-linear-surface hover:text-cyan-400 hover:border-cyan-500/30 transition-all text-sm font-semibold text-linear-text-muted flex items-center mx-auto group">
            <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            {language === 'vi' ? 'Sửa đổi Input (Brand DNA)' : 'Edit Brand DNA Input'}
          </button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
        {features.map((feature, idx) => (
          <Link href={feature.href} key={feature.id} className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`h-full relative overflow-hidden rounded-3xl bg-linear-surface/40 backdrop-blur-xl border ultra-thin-border p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 ${feature.shadow} ${feature.border}`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-linear-text-muted flex-1 leading-relaxed">{feature.desc}</p>
              
              <div className="mt-8 flex items-center text-sm font-bold text-linear-text-muted group-hover:text-foreground transition-colors">
                <span className="uppercase tracking-widest">{language === 'vi' ? 'Khởi chạy' : 'Launch'}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 group-hover:text-cyan-400 transition-all duration-300" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
