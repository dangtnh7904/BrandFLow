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
 <div className="w-full h-full overflow-y-auto">
 <div className="flex flex-col p-8 max-w-6xl mx-auto w-full min-h-full">
 <div className="mb-8 flex justify-between items-end">
 <div>
 <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
 <FolderGit2 className="w-6 h-6 mr-3 text-blue-500" />
 {t('assets.title')}
 </h2>
 <p className="text-linear-text-muted">{t('assets.desc')}</p>
 </div>
 <div className="relative w-64 hidden md:block">
 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-linear-text-muted" />
 <input type="text" placeholder="Tìm kiếm tệp..." className="w-full bg-linear-surface border border-linear-border shadow-sm rounded-xl py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" />
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Upload Zone */}
 <div className="lg:col-span-1">
 <motion.div 
 whileHover={{ scale: 1.01 }}
 className={`bento-card border-dashed flex flex-col items-center justify-center p-8 text-center transition-colors h-64 ${isDragging ? 'bg-blue-50 border-blue-400' : 'border-linear-border bg-background hover:bg-linear-surface/80 hover:border-cyan-500/50'}`}
 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
 onDragLeave={() => setIsDragging(false)}
 onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
 >
 <div className="w-16 h-16 rounded-full bg-linear-surface border border-linear-border shadow-sm flex items-center justify-center mb-4 text-blue-500">
 <UploadCloud className="w-8 h-8" />
 </div>
 <h3 className="text-foreground font-bold mb-2">{t('assets.upload_title')}</h3>
 <p className="text-xs text-linear-text-muted mb-4">{t('assets.upload_desc')}</p>
 <button className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 shadow-sm rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
 Duyệt máy tính
 </button>
 </motion.div>
 
 <div className="mt-6 bento-card bg-linear-surface border border-linear-border shadow-sm overflow-hidden relative">
 <h4 className="text-sm font-bold text-foreground mb-2 relative z-10">Lõi Context Vector RAG</h4>
 <p className="text-xs text-linear-text-muted mb-4 relative z-10">Dung lượng nhúng đang được hệ thống AI sử dụng.</p>
 <div className="h-2 w-full bg-linear-surface/50 border border-linear-border border border-linear-border rounded-full overflow-hidden relative z-10">
 <div className="h-full bg-blue-500 w-1/3"></div>
 </div>
 <p className="text-[10px] text-right mt-2 text-blue-600 font-bold font-mono relative z-10">34% / 100MB Quota</p>
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
 className="bento-card p-4 flex flex-col group cursor-pointer bg-linear-surface border border-linear-border hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
 >
 <div className="flex items-start justify-between mb-4">
 <div className="w-10 h-10 rounded-lg bg-background border border-linear-border flex items-center justify-center">
 {file.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
 {file.type === 'image' && <ImageIcon className="w-5 h-5 text-cyan-500" />}
 {file.type === 'excel' && <Briefcase className="w-5 h-5 text-blue-500" />}
 {file.type === 'deck' && <FileText className="w-5 h-5 text-orange-500" />}
 </div>
 <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
 <button className="text-linear-text-muted hover:text-foreground bg-linear-surface/50 border border-linear-border hover:bg-slate-200 p-1.5 rounded-md transition-colors"><Download className="w-4 h-4" /></button>
 <button className="text-linear-text-muted hover:text-red-600 bg-linear-surface/50 border border-linear-border hover:bg-red-50 p-1.5 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
 </div>
 </div>
 <div>
 <p className="text-sm font-bold text-foreground truncate mb-1" title={file.name}>{file.name}</p>
 <div className="flex justify-between items-center text-xs font-semibold text-linear-text-muted">
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
 </div>
 );
}
