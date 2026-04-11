"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Download, Trash2, FolderGit2, Search, Image as ImageIcon, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MOCK_FILES = [
  { id: 1, name: "brand_guidelines_2024.pdf", size: "4.2 MB", type: "pdf", date: "Oct 12, 2024" },
  { id: 2, name: "q3_financial_report.xlsx", size: "1.1 MB", type: "excel", date: "Sep 30, 2024" },
  { id: 3, name: "logo_master_vector.svg", size: "845 KB", type: "image", date: "Aug 15, 2024" },
  { id: 4, name: "competitor_swot_analysis.pdf", size: "2.5 MB", type: "pdf", date: "Oct 05, 2024" },
  { id: 5, name: "product_deck_v2.pptx", size: "12 MB", type: "deck", date: "Oct 20, 2024" }
];

export default function AssetsPage() {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
             <FolderGit2 className="w-6 h-6 mr-3 text-emerald-400" />
             {t('assets.title')}
           </h2>
           <p className="text-linear-text-muted">{t('assets.desc')}</p>
        </div>
        <div className="relative w-64 hidden md:block">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
           <input type="text" placeholder="Tìm kiếm tệp..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-1">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`bento-card border-dashed flex flex-col items-center justify-center p-8 text-center transition-colors h-64 ${isDragging ? 'bg-emerald-500/10 border-emerald-500/50' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-emerald-400">
               <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-white font-bold mb-2">{t('assets.upload_title')}</h3>
            <p className="text-xs text-linear-text-muted mb-4">{t('assets.upload_desc')}</p>
            <button className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-semibold hover:bg-emerald-500/30 transition-colors">
               Duyệt máy tính
            </button>
          </motion.div>
          
          <div className="mt-6 bento-card bg-black/20 overflow-hidden relative">
             <h4 className="text-sm font-semibold text-white mb-2 relative z-10">Lõi Context Vector RAG</h4>
             <p className="text-xs text-linear-text-muted mb-4 relative z-10">Dung lượng nhúng đang được hệ thống AI sử dụng.</p>
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-emerald-500 w-1/3"></div>
             </div>
             <p className="text-[10px] text-right mt-2 text-emerald-400 font-mono relative z-10">34% / 100MB Quota</p>
          </div>
        </div>

        {/* File Manager Grid */}
        <div className="lg:col-span-2">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_FILES.map((file, idx) => (
                <motion.div 
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bento-card p-4 flex flex-col group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  <div className="flex items-start justify-between mb-4">
                     <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                        {file.type === 'pdf' && <FileText className="w-5 h-5 text-red-400" />}
                        {file.type === 'image' && <ImageIcon className="w-5 h-5 text-cyan-400" />}
                        {file.type === 'excel' && <Briefcase className="w-5 h-5 text-emerald-400" />}
                        {file.type === 'deck' && <FileText className="w-5 h-5 text-orange-400" />}
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button className="text-slate-400 hover:text-white"><Download className="w-4 h-4" /></button>
                        <button className="text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-white truncate mb-1" title={file.name}>{file.name}</p>
                     <div className="flex justify-between items-center text-xs text-linear-text-muted">
                        <span>{file.size}</span>
                        <span>{file.date}</span>
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
