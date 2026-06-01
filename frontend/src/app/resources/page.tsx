"use client";

import React, { useState } from 'react';
import { BookOpen, Download, Star, ArrowRight, Layers, Sparkles, FileText } from 'lucide-react';
import Image from 'next/image';

const EBOOKS = [
  {
    id: 'ai-marketing',
    title: 'THE AI-POWERED SME',
    subtitle: 'Định Hình Lại Cuộc Chơi Marketing Trong Kỷ Nguyên AI',
    description: 'Sự thật tàn khốc về AI trong Marketing: AI không tạo ra chiến lược, nó chỉ khuếch đại chiến lược. Cuốn sách giúp C-Level đặt AI vào đúng vị trí của nó.',
    image: '/resources/ai_marketing_cover.png?v=3',
    pdfUrl: '/resources/THE_AI_POWERED_SME.pdf?v=3',
    pages: 42,
    category: 'Ebook Chiến Lược'
  },
  {
    id: 'branding',
    title: 'BRANDING MASTERCLASS',
    subtitle: 'Từ Sản Phẩm Tốt Trở Thành Thương Hiệu Sống Mãi',
    description: 'Sản phẩm tốt chỉ là điều kiện cần để bước vào sân chơi. Branding là nghệ thuật khắc sâu một cảm xúc duy nhất vào tâm trí khách hàng.',
    image: '/resources/branding_cover.png?v=3',
    pdfUrl: '/resources/BRANDING_MASTERCLASS.pdf?v=3',
    pages: 36,
    category: 'Guideline Thực Thi'
  },
  {
    id: 'marketing-plan',
    title: 'MARKETING PLAN MASTERCLASS',
    subtitle: 'Xây Dựng Kế Hoạch Marketing Có Lợi Nhuận Trong Kỷ Nguyên Số',
    description: 'Dựa trên phương pháp luận chuẩn quốc tế của Giáo sư Malcolm McDonald. Từ Audit thị trường, Phân khúc theo Nhu cầu, đến Ma trận BCG/DPM và Template kế hoạch 1 trang.',
    image: '/resources/marketing_plan_cover.png?v=3',
    pdfUrl: '/resources/MARKETING_PLAN_MASTERCLASS.pdf?v=3',
    pages: 38,
    category: 'Framework Chiến Lược'
  }
];

export default function ResourcesPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (id: string, url: string) => {
    setDownloading(id);
    setTimeout(() => {
      // Trigger download
      window.open(url, '_blank');
      setDownloading(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 selection:bg-indigo-500/30 font-sans pb-24">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4 md:px-8 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0F172A] to-[#0F172A] -z-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Premium Resources for C-Level
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Kho Tri Thức <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Doanh Nghiệp Tinh Hoa</span>
          </h1>
          <p className="max-w-2xl text-slate-400 text-lg leading-relaxed mb-10">
            Tập hợp những tài liệu chiến lược, framework và masterclass độc quyền được thiết kế dành riêng cho các nhà lãnh đạo SME muốn định hình lại cuộc chơi.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Featured Masterclasses</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {EBOOKS.map((book) => (
            <div key={book.id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.07] transition-all duration-300 flex flex-col md:flex-row gap-8 backdrop-blur-sm">
              
              {/* Cover Image Container */}
              <div className="relative w-full md:w-48 h-64 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500">
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase">
                    {book.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {book.pages} Trang
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {book.title}
                </h3>
                <h4 className="text-sm font-medium text-slate-300 mb-4">
                  {book.subtitle}
                </h4>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                  {book.description}
                </p>

                <button 
                  onClick={() => handleDownload(book.id, book.pdfUrl)}
                  disabled={downloading === book.id}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-200 px-6 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {downloading === book.id ? (
                    "Đang nén File PDF..."
                  ) : (
                    <>
                      Tải Xuống PDF <Download className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
