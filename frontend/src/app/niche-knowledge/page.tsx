"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Search, FileText, Database, ArrowRight, Loader2, Sparkles, BookOpen } from 'lucide-react';

export default function NicheKnowledgePage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    setAnswer('');
    
    // Giả lập call API xuống memory_rag.py
    setTimeout(() => {
      setAnswer(`[BrandFlow RAG] Dựa trên kho tri thức ngành, thông tin về "${query}" được tìm thấy như sau:\n\nĐang trong giai đoạn thử nghiệm API cục bộ. Đây là kết quả sinh ngẫu nhiên từ VectorDB (ChromaDB) để đảm bảo mô hình hoạt động.\n\nTham khảo:\n[1] Báo cáo thị trường 2026.pdf`);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Niche Knowledge Hub</h1>
              <p className="text-slate-500">Kho Tri Thức Ngành (RAG Vector Database)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Upload Column */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Huấn luyện AI
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Tải lên các tài liệu chuyên ngành (PDF, DOCX) để hệ thống học và cập nhật vào ChromaDB.
            </p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group">
              <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2" />
              <div className="text-sm font-medium text-slate-700">Kéo thả file vào đây</div>
              <div className="text-xs text-slate-500 mt-1">hoặc click để chọn file</div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase">Tài liệu đã học</div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-700 flex-1 truncate">Báo_cáo_ngành_FnB_2026.pdf</span>
                <span className="text-xs text-slate-400">12 MB</span>
              </div>
            </div>
          </div>

          {/* Search Column */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-500" />
              Truy vấn Thông tin Ngành
            </h2>
            
            <form onSubmit={handleSearch} className="mb-6 relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hỏi AI bất kỳ điều gì về dữ liệu ngành..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button 
                type="submit"
                disabled={isSearching || !query}
                className="absolute right-2 top-2 bottom-2 bg-emerald-500 text-white rounded-lg px-3 hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center transition-colors"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-6 flex flex-col">
              {!answer && !isSearching ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">RAG Engine sẵn sàng trả lời.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {answer && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {answer}
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
