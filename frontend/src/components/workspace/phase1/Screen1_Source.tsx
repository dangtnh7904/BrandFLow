"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Link as LinkIcon, FileText, CheckCircle2, Globe, Share2, Plus, X, ShieldCheck, Lock, Server } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Screen1_Source({ onNext }: { onNext: (path: 'wizard' | 'dashboard') => void }) {
  const { t, language } = useLanguage();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  
  // UI States for dynamic fields
  const [isDragging, setIsDragging] = useState(false);
  const [socialLinks, setSocialLinks] = useState(['']);
  const [webLinks, setWebLinks] = useState(['']);

  // Upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Upload trực tiếp tới backend (bypass Next.js proxy body size limit)
  const BACKEND_URL = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : 'http://127.0.0.1:8000';

  const handleUpload = async (filesToUpload: File[]) => {
    setUploadStatus('uploading');
    setUploadError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      filesToUpload.forEach(file => formData.append('files', file));

      // Try full upload first (saves to ChromaDB), fallback to test-upload (extract only)
      let res: Response;
      try {
        res = await fetch(`${BACKEND_URL}/api/v1/onboarding/upload`, {
          method: 'POST',
          body: formData,
        });
      } catch {
        // Backend unreachable on direct port, fallback to Next.js proxy
        res = await fetch('/api/v1/onboarding/upload', {
          method: 'POST',
          body: formData,
        });
      }

      // Fallback: if ChromaDB/AI pipeline unavailable, use extract-only endpoint
      if (!res.ok && (res.status === 500 || res.status === 503)) {
        const fallbackForm = new FormData();
        filesToUpload.forEach(file => fallbackForm.append('files', file));
        try {
          res = await fetch(`${BACKEND_URL}/api/v1/onboarding/test-upload`, {
            method: 'POST',
            body: fallbackForm,
          });
        } catch {
          res = await fetch('/api/v1/onboarding/test-upload', {
            method: 'POST',
            body: fallbackForm,
          });
        }
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Upload thất bại' }));
        throw new Error(err.detail || `Lỗi ${res.status}`);
      }

      const data = await res.json();
      
      // Combine extracted text segments to save for later gap analysis
      let fullText = "";
      Object.keys(data).forEach(key => {
        if (key !== 'status' && key !== 'message' && typeof data[key] === 'object') {
           if (data[key].cleaned_text) fullText += data[key].cleaned_text + "\n";
        }
      });
      if (!fullText && data.data && data.data.text) fullText = data.data.text;
      
      if (typeof window !== 'undefined') {
          localStorage.setItem('bf_doc_text', fullText);
      }
      
      setUploadResult(data.data || data);
      setUploadStatus('success');
    } catch (err: any) {
      setUploadError(err.message || 'Lỗi kết nối máy chủ khi upload.');
      setUploadStatus('error');
    }
  };

  const CARDS = [
    {
      id: 'upload',
      title: t('screen1.upload'),
      description: t('screen1.upload_desc'),
      icon: UploadCloud,
    },
    {
      id: 'web',
      title: t('screen1.web'),
      description: t('screen1.web_desc'),
      icon: LinkIcon,
    },
    {
      id: 'questionnaire',
      title: t('screen1.form'),
      description: t('screen1.form_desc'),
      icon: FileText,
    }
  ];

  const toggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleProceed = () => {
    // Luôn luôn hướng user tới màn hình Wizard (Câu hỏi Lãnh đạo) thay vì cho phép bỏ qua để đảm bảo quy trình phân tích Gaps
    onNext('wizard');
  };

  const updateArray = (arr: string[], setArr: any, index: number, val: string) => {
     const newArr = [...arr];
     newArr[index] = val;
     setArr(newArr);
  };
  const addToArray = (arr: string[], setArr: any) => {
     if (arr.length < 5) setArr([...arr, '']);
  };
  const removeFromArray = (arr: string[], setArr: any, index: number) => {
     if (arr.length > 1) {
        const newArr = [...arr];
        newArr.splice(index, 1);
        setArr(newArr);
     }
  };

  return (
    <div className="w-full h-full overflow-y-auto relative">
      <div className="flex flex-col items-center p-8 max-w-5xl mx-auto w-full min-h-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 shrink-0"
      >
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">{t('screen1.title')}</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">{t('screen1.desc')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8 shrink-0">
        {CARDS.map((card, idx) => {
          const isSelected = selectedSources.includes(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => toggleSource(card.id)}
              className={cn(
                "relative group flex flex-col p-6 rounded-2xl cursor-pointer transition-all duration-300 border ultra-thin-border backdrop-blur-md shadow-sm",
                isSelected 
                  ? "bg-blue-50 border-blue-500/50 shadow-md scale-[1.02]" 
                  : "bg-white hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", isSelected ? "bg-blue-100" : "bg-slate-100 group-hover:bg-slate-200")}>
                <card.icon className={cn("w-6 h-6", isSelected ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
              
              {isSelected && (
                <div className="absolute top-4 right-4 text-blue-500">
                   <CheckCircle2 className="w-5 h-5 animate-in fade-in" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="w-full flex-1 flex flex-col items-center">
         <AnimatePresence mode="popLayout">
            {selectedSources.includes('upload') && (
               <motion.div 
                 key="upload-zone"
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="w-full mb-6 overflow-hidden"
               >
                 <div 
                   className={cn("w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer", isDragging ? "bg-blue-50 border-blue-400" : "bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100", uploadStatus === 'uploading' ? "pointer-events-none opacity-60" : "")}
                   onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                   onDragLeave={() => setIsDragging(false)}
                   onDrop={(e) => {
                     e.preventDefault();
                     setIsDragging(false);
                     const droppedFiles = Array.from(e.dataTransfer.files);
                     if (droppedFiles.length > 0) {
                       setFiles(prev => [...prev, ...droppedFiles]);
                       handleUpload(droppedFiles);
                     }
                   }}
                   onClick={() => fileInputRef.current?.click()}
                 >
                     <input 
                       ref={fileInputRef}
                       type="file" 
                       multiple 
                       accept=".pdf,.docx,.txt,.csv"
                       className="hidden"
                       onChange={(e) => {
                         const selected = Array.from(e.target.files || []);
                         if (selected.length > 0) {
                           setFiles(prev => [...prev, ...selected]);
                           handleUpload(selected);
                         }
                         e.target.value = '';
                       }}
                     />
                     {uploadStatus === 'uploading' ? (
                       <div className="flex flex-col items-center">
                         <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
                         <p className="text-blue-600 font-bold text-sm">Đang tải lên & phân tích...</p>
                       </div>
                     ) : (
                       <>
                         <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                         <p className="text-slate-800 font-bold mb-1">{t('screen1.upload_zone')}</p>
                         <p className="text-xs text-slate-500">{t('screen1.upload_zone_desc')}</p>
                       </>
                     )}
                 </div>

                 {/* Uploaded Files List */}
                 {files.length > 0 && (
                   <div className="mt-3 space-y-2">
                     {files.map((file, idx) => (
                       <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                         <div className="flex items-center gap-3 min-w-0">
                           <FileText className="w-5 h-5 text-red-500 shrink-0" />
                           <div className="min-w-0">
                             <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                             <p className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2 shrink-0">
                           {uploadStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                           {uploadStatus === 'error' && <span className="text-[10px] text-rose-500 font-bold">Lỗi</span>}
                           <button onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter((_, i) => i !== idx)); }} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50">
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Upload Result Preview */}
                 {uploadResult && (
                   <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                     <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                       <CheckCircle2 className="w-4 h-4" /> Phân tích hoàn tất
                     </p>
                     {/* ChromaDB upload: {message: "..."} */}
                     {uploadResult.message && (
                       <p className="text-[11px] text-slate-600">{uploadResult.message}</p>
                     )}
                     {/* Test-upload: {filename: {cleaned_text: "..."}} */}
                     {!uploadResult.message && typeof uploadResult === 'object' && (
                       Object.entries(uploadResult).filter(([key]) => key !== 'status').map(([filename, data]: [string, any]) => (
                         <div key={filename} className="mb-2">
                           <p className="text-[11px] font-semibold text-slate-700">{filename}</p>
                           <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{typeof data === 'object' ? data.cleaned_text?.substring(0, 300) : String(data).substring(0, 300)}...</p>
                         </div>
                       ))
                     )}
                   </div>
                 )}

                 {uploadError && (
                   <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
                     <p className="text-xs font-bold text-rose-600">{uploadError}</p>
                   </div>
                 )}
                 
                 {/* ENTERPRISE SECURITY AUDIT & TRUST BADGE */}
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 px-6 py-5 rounded-xl border ultra-thin-border bg-gradient-to-b from-white to-slate-50/50 shadow-sm w-full"
                 >
                     <p className="text-[13px] leading-relaxed text-slate-600 mb-5 text-center">
                        <Lock className="w-3.5 h-3.5 inline-block mr-1.5 text-slate-400 mb-0.5" />
                        {language === 'vi' 
                          ? <span>Tài liệu nội bộ được bảo vệ bởi chuẩn <b>Mã hóa Đầu cuối</b>. Nhằm đảm bảo tuyệt mật, hệ thống sẽ <b>tiêu hủy file gốc vĩnh viễn</b> khỏi máy chủ ngay sau khi phân tích. Trí tuệ Nhân tạo tuyệt đối không sử dụng Dữ liệu của bạn để tự huấn luyện.</span>
                          : <span>Internal documents are protected by <b>End-to-End Encryption</b>. For absolute privacy, original files are <b>permanently destroyed</b> from servers after analysis. Our AI strictly does not train on your confidential data.</span>}
                     </p>
                     <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise Privacy</span>
                        <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-500" /> AES-256 Encrypted</span>
                        <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-emerald-500" /> Zero Retention</span>
                     </div>
                 </motion.div>

               </motion.div>
            )}

            {selectedSources.includes('web') && (
               <motion.div 
                 key="web-zone"
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="w-full mb-6 overflow-hidden"
               >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                    {/* Social Logic */}
                    <div>
                        <label className="text-sm font-bold text-slate-800 flex items-center mb-4">
                           <Share2 className="w-4 h-4 mr-2 text-blue-500" /> {t('screen1.social')}
                        </label>
                        <div className="space-y-3">
                           {socialLinks.map((link, idx) => (
                             <div key={idx} className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={link}
                                  onChange={(e) => updateArray(socialLinks, setSocialLinks, idx, e.target.value)}
                                  placeholder="Đường dẫn Facebook, LinkedIn..." 
                                  className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500/50 shadow-sm" 
                                />
                                {socialLinks.length > 1 && (
                                   <button onClick={() => removeFromArray(socialLinks, setSocialLinks, idx)} className="px-3 rounded-lg bg-white text-slate-400 hover:text-red-500 border border-slate-300 shadow-sm"><X className="w-4 h-4" /></button>
                                )}
                             </div>
                           ))}
                           {socialLinks.length < 5 && (
                             <button onClick={() => addToArray(socialLinks, setSocialLinks)} className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center"><Plus className="w-3 h-3 mr-1" /> {t('screen1.social_btn')}</button>
                           )}
                        </div>
                    </div>

                    {/* Web Logic */}
                    <div>
                        <label className="text-sm font-bold text-slate-800 flex items-center mb-4">
                           <Globe className="w-4 h-4 mr-2 text-blue-500" /> {t('screen1.website')}
                        </label>
                        <div className="space-y-3">
                           {webLinks.map((link, idx) => (
                             <div key={idx} className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={link}
                                  onChange={(e) => updateArray(webLinks, setWebLinks, idx, e.target.value)}
                                  placeholder="Domain chính hoặc chiến dịch LP..." 
                                  className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500/50 shadow-sm" 
                                />
                                {webLinks.length > 1 && (
                                   <button onClick={() => removeFromArray(webLinks, setWebLinks, idx)} className="px-3 rounded-lg bg-white text-slate-400 hover:text-red-500 border border-slate-300 shadow-sm"><X className="w-4 h-4" /></button>
                                )}
                             </div>
                           ))}
                           {webLinks.length < 5 && (
                             <button onClick={() => addToArray(webLinks, setWebLinks)} className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center"><Plus className="w-3 h-3 mr-1" /> {t('screen1.website_btn')}</button>
                           )}
                        </div>
                    </div>
                 </div>
               </motion.div>
            )}
         </AnimatePresence>

         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md mt-auto pt-8 pb-4"
         >
           <button 
              onClick={handleProceed}
              disabled={selectedSources.length === 0}
              className={cn(
                "w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300",
                selectedSources.length > 0 
                  ? "gradient-ai-bg text-white hover:scale-[1.02]" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              )}
           >
             {t('screen1.btn')}
           </button>
         </motion.div>
      </div>
      </div>
    </div>
  );
}
