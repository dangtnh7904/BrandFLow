"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen, Star, CheckCircle2 } from 'lucide-react';

const EBOOKS = [
  {
    id: 1,
    title: "Branding Masterclass",
    desc: "Bí quyết định vị thương hiệu tinh gọn, khác biệt.",
    cover: "/resources/branding_cover.png",
    pdf: "/resources/BRANDING_MASTERCLASS.pdf"
  },
  {
    id: 2,
    title: "Marketing Plan Masterclass",
    desc: "Xây dựng kế hoạch Marketing sinh lời bền vững.",
    cover: "/resources/marketing_plan_cover.png",
    pdf: "/resources/MARKETING_PLAN_MASTERCLASS.pdf",
    featured: true
  },
  {
    id: 3,
    title: "The AI-Powered SME",
    desc: "Tự động hóa doanh nghiệp B2B với trí tuệ nhân tạo.",
    cover: "/resources/ai_marketing_cover.png",
    pdf: "/resources/THE_AI_POWERED_SME.pdf"
  }
];

export default function EbookLeadMagnet() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Background Glows (kept subtle for seamless integration) */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Star className="w-3.5 h-3.5 mr-2 fill-cyan-400" />
            Tài Nguyên Độc Quyền Dành Cho Lãnh Đạo
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Bộ 3 Cẩm Nang Thực Chiến <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Dành Cho CEO & CMO Enterprise
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Hệ thống kiến thức độc quyền giúp bạn tối ưu chi phí, tự động hóa quy trình và xây dựng đế chế kinh doanh trong kỷ nguyên AI. Tải miễn phí toàn bộ!
          </p>
        </div>

        {/* 3 Ebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 items-end mt-12">
          {EBOOKS.map((ebook, idx) => (
            <div key={ebook.id} className="flex flex-col items-center group">
              
              {/* 3D Ebook Mockup */}
              <div className="w-full max-w-[260px] flex justify-center perspective-[1200px] mb-8 relative">
                {ebook.featured && (
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-cyan-500/30 blur-[40px] rounded-full z-0 pointer-events-none" />
                )}
                <motion.div 
                  initial={{ rotateY: -15, rotateX: 5 }}
                  whileHover={{ rotateY: 0, rotateX: 0, scale: ebook.featured ? 1.1 : 1.05 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className={`relative transform-gpu preserve-3d cursor-pointer z-10 w-[220px] h-[300px] lg:w-[260px] lg:h-[350px] ${ebook.featured ? 'scale-105' : ''}`}
                >
                  {/* Ebook Cover - Clean Image Only */}
                  <div 
                    className="absolute inset-0 bg-[#1a2744] rounded-r-2xl rounded-l-md shadow-[15px_15px_40px_rgba(0,0,0,0.5),inset_2px_0_10px_rgba(255,255,255,0.1)] overflow-hidden bg-contain bg-no-repeat bg-center transition-all duration-300"
                    style={{ backgroundImage: `url('${ebook.cover}')` }}
                  >
                    {/* Spine */}
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-r from-slate-950/80 to-slate-800/20 shadow-[inset_-1px_0_2px_rgba(0,0,0,0.5)] z-10" />
                  </div>
                  
                  {/* Ebook Pages (Side view thickness) */}
                  <div className="absolute top-2 bottom-2 right-[-8px] w-[8px] bg-slate-200 rounded-r-sm transform-gpu origin-left translate-z-[-8px] rotate-y-90 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] flex flex-col justify-evenly z-0">
                     <div className="w-full h-px bg-slate-300"></div>
                     <div className="w-full h-px bg-slate-300"></div>
                     <div className="w-full h-px bg-slate-300"></div>
                     <div className="w-full h-px bg-slate-300"></div>
                  </div>
                </motion.div>
              </div>

              {/* Info & Buttons */}
              <div className="text-center flex flex-col items-center w-full px-4">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight h-14 flex items-center justify-center">{ebook.title}</h3>
                <p className="text-sm text-slate-400 mb-6 h-10">{ebook.desc}</p>
                
                <div className="flex flex-col w-full gap-3">
                  <a 
                    href={ebook.pdf} 
                    download 
                    className={`w-full py-3 px-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center ${ebook.featured ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/25 hover:-translate-y-1' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 hover:-translate-y-1'}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải Miễn Phí
                  </a>
                  <a 
                    href={ebook.pdf} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full py-3 px-4 bg-transparent hover:bg-slate-900 text-slate-300 hover:text-white font-medium rounded-xl transition-colors flex items-center justify-center text-sm"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Xem trước
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
