"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Link as LinkIcon, FileText, CheckCircle2, Globe, Share2, Plus, X, ShieldCheck, Lock, Server, Loader2, AlertCircle } from 'lucide-react';
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

  // File upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'partial' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  // Web crawl states
  const [crawlStatus, setCrawlStatus] = useState<'idle' | 'crawling' | 'success' | 'partial' | 'error'>('idle');
  const [crawlMessage, setCrawlMessage] = useState('');
  const [crawlResults, setCrawlResults] = useState<Array<{url: string; status: string; char_count?: number; error?: string}>>([]);

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
    },
  ];

  const toggleSource = (id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleProceed = () => {
    if (selectedSources.includes('questionnaire')) {
      onNext('wizard');
    } else {
      onNext('dashboard');
    }
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

  // Chuẩn hóa URL: tự thêm https:// nếu thiếu
  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  };

  // Gộp tất cả URL hợp lệ từ cả 2 ô nhập
  const getAllValidUrls = (): string[] => {
    const all = [...socialLinks, ...webLinks]
      .map(normalizeUrl)
      .filter(u => u.length > 0);
    return [...new Set(all)]; // bỏ trùng
  };

  // Gọi API crawl URL và lưu vào ChromaDB
  const handleCrawl = async () => {
    const urls = getAllValidUrls();
    if (urls.length === 0) return;
    setCrawlStatus('crawling');
    setCrawlMessage('');
    setCrawlResults([]);
    try {
      const res = await fetch('http://localhost:8000/api/v1/onboarding/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
        throw new Error(err.detail || `Lỗi ${res.status}`);
      }
      const data = await res.json();
      // Backend hiện trả về {status, message} — hiển thị thành công
      const results = Array.isArray(data.results) ? data.results : urls.map(u => ({ url: u, status: 'success' }));
      setCrawlResults(results);
      const ok = results.filter((r: any) => r.status === 'success').length;
      const fail = results.length - ok;
      if (fail === 0) {
        setCrawlStatus('success');
        setCrawlMessage(language === 'vi' ? `Đã thu thập và lưu ${ok} trang web vào bộ não.` : `Crawled and saved ${ok} URL(s) successfully.`);
      } else if (ok > 0) {
        setCrawlStatus('partial');
        setCrawlMessage(language === 'vi' ? `${ok} trang thành công, ${fail} trang thất bại.` : `${ok} succeeded, ${fail} failed.`);
      } else {
        setCrawlStatus('error');
        setCrawlMessage(language === 'vi' ? 'Tất cả URL đều thất bại.' : 'All URLs failed.');
      }
    } catch (err: any) {
      setCrawlStatus('error');
      setCrawlMessage(err.message || (language === 'vi' ? 'Lỗi kết nối. Vui lòng thử lại.' : 'Connection error. Please try again.'));
    }
  };

  // ─── File Upload Handlers ─────────────────────────────────────────────────
  const MAX_FILE_SIZE_MB = 100;

  const addFiles = (incoming: FileList | File[]) => {
    const fileArray = Array.from(incoming);
    let blocked = false;
    const valid = fileArray.filter(f => {
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setUploadMessage(
          language === 'vi'
            ? `File "${f.name}" vượt quá ${MAX_FILE_SIZE_MB}MB.`
            : `File "${f.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`
        );
        setUploadStatus('error');
        blocked = true;
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...valid.filter(f => !existing.has(f.name))];
    });
    if (valid.length > 0 && !blocked) {
      setUploadStatus('idle');
      setUploadMessage('');
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadStatus('idle');
    setUploadMessage('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploadStatus('uploading');
    setUploadMessage('');
    try {
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append('files', f));
      formData.append('tenant_id', 'default');

      const res = await fetch('http://localhost:8000/api/v1/onboarding/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
        throw new Error(err.detail || `Lỗi ${res.status}`);
      }

      const data = await res.json();

      // Phân biệt success / partial / error từ server
      const serverStatus = (data.status as string) || 'success';
      if (serverStatus === 'error') {
        setUploadStatus('error');
      } else if (serverStatus === 'partial') {
        setUploadStatus('partial');
      } else {
        setUploadStatus('success');
      }

      // Tạo message chi tiết từng file
      if (Array.isArray(data.results) && data.results.length > 0) {
        const lines: string[] = [data.message || ''];
        data.results.forEach((r: any) => {
          if (r.status === 'success') {
            const chars = r.char_count ? ` · ${(r.char_count / 1000).toFixed(1)}k ký tự` : '';
            const pages = r.pages ? ` · ${r.pages} trang` : '';
            const sheets = r.sheets ? ` · ${r.sheets} sheet` : '';
            lines.push(`✅ ${r.filename}${chars}${pages}${sheets} [${r.method}]`);
          } else {
            lines.push(`❌ ${r.filename}: ${r.error}`);
          }
        });
        setUploadMessage(lines.join('\n'));
      } else {
        setUploadMessage(
          data.message ||
          (language === 'vi'
            ? `Đã xử lý ${selectedFiles.length} tài liệu.`
            : `Processed ${selectedFiles.length} file(s).`)
        );
      }
    } catch (err: any) {
      setUploadStatus('error');
      setUploadMessage(
        err.message ||
        (language === 'vi'
          ? 'Đã xảy ra lỗi khi tải lên. Vui lòng thử lại.'
          : 'Upload failed. Please try again.')
      );
    }
  };


  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExt = (name: string) => name.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <div className="w-full h-full overflow-y-auto relative">
      <div className="flex flex-col items-center p-8 max-w-5xl mx-auto w-full min-h-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 shrink-0"
        >
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-3">{t('screen1.title')}</h2>
          <p className="text-linear-text-muted max-w-xl mx-auto text-sm">{t('screen1.desc')}</p>
        </motion.div>

        {/* Source Cards */}
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
                  "relative group flex flex-col p-6 rounded-3xl cursor-pointer transition-all duration-500 border backdrop-blur-xl shadow-sm overflow-hidden",
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.02]"
                    : "bg-linear-surface hover:bg-linear-surface/80 border-linear-border hover:border-cyan-500/30"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10",
                  isSelected
                    ? "bg-cyan-500/20 border border-cyan-500/30"
                    : "bg-linear-surface/50 border border-linear-border dark:bg-slate-800 group-hover:border-cyan-500/30"
                )}>
                  <card.icon className={cn("w-6 h-6", isSelected ? "text-cyan-400" : "text-linear-text-muted group-hover:text-cyan-500/70")} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-xs text-linear-text-muted leading-relaxed">{card.description}</p>

                {isSelected && (
                  <div className="absolute top-4 right-4 text-cyan-400">
                    <CheckCircle2 className="w-5 h-5 animate-in fade-in" />
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Zones */}
        <div className="w-full flex-1 flex flex-col items-center">
          <AnimatePresence mode="popLayout">

            {/* ─── UPLOAD ZONE ─── */}
            {selectedSources.includes('upload') && (
              <motion.div
                key="upload-zone"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mb-6 overflow-hidden"
              >
                {/* Hidden native file input */}
                <input
                  id="file-upload-input"
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt,.md,.csv,.xlsx,.xls,.html,.htm"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {/* Drop Zone */}
                <div
                  className={cn(
                    "w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-h-48 backdrop-blur-md relative overflow-hidden cursor-pointer",
                    isDragging
                      ? "bg-cyan-500/10 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                      : "bg-linear-surface/50 border-linear-border hover:border-cyan-500/50 hover:bg-cyan-500/5"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                >
                  <motion.div
                    animate={{ scale: isDragging ? 1.15 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <UploadCloud className={cn("w-10 h-10 mb-3 transition-colors", isDragging ? "text-cyan-400" : "text-linear-text-muted")} />
                  </motion.div>
                  <p className="text-foreground font-bold mb-1">
                    {isDragging
                      ? (language === 'vi' ? 'Thả file vào đây...' : 'Drop files here...')
                      : t('screen1.upload_zone')}
                  </p>
                  <p className="text-xs text-linear-text-muted">
                    {language === 'vi'
                      ? 'Hỗ trợ: PDF, DOCX, TXT, MD, CSV, XLSX, XLS, HTML — tối đa 100MB/file'
                      : 'Supports: PDF, DOCX, TXT, MD, CSV, XLSX, XLS, HTML — max 100MB/file'}
                  </p>
                  <p className="text-xs text-cyan-500/70 mt-2 font-medium">
                    {language === 'vi' ? 'hoặc nhấp để chọn file' : 'or click to browse files'}
                  </p>
                </div>

                {/* Selected Files */}
                <AnimatePresence>
                  {selectedFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-4 space-y-2"
                    >
                      <p className="text-xs font-bold text-linear-text-muted uppercase tracking-wider mb-3">
                        {language === 'vi'
                          ? `${selectedFiles.length} tài liệu đã chọn`
                          : `${selectedFiles.length} file(s) selected`}
                      </p>

                      {selectedFiles.map((file, idx) => (
                        <motion.div
                          key={`${file.name}-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-linear-surface/70 border border-linear-border hover:border-cyan-500/30 transition-all"
                        >
                          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-black text-cyan-400">{getFileExt(file.name)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-linear-text-muted">{formatFileSize(file.size)}</p>
                          </div>
                          {uploadStatus === 'success'
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            : (
                              <button
                                onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-linear-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                        </motion.div>
                      ))}

                      {/* Upload Button */}
                      {uploadStatus !== 'success' && uploadStatus !== 'partial' && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                          disabled={uploadStatus === 'uploading'}
                          className={cn(
                            "w-full mt-3 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                            uploadStatus === 'uploading'
                              ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 cursor-not-allowed"
                              : "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.01]"
                          )}
                        >
                          {uploadStatus === 'uploading' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {language === 'vi' ? 'Đang tải lên & phân tích...' : 'Uploading & analyzing...'}
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              {language === 'vi'
                                ? `Tải lên ${selectedFiles.length} tài liệu`
                                : `Upload ${selectedFiles.length} file(s)`}
                            </>
                          )}
                        </motion.button>
                      )}

                      {/* Status Message */}
                      <AnimatePresence>
                        {(uploadStatus === 'success' || uploadStatus === 'partial' || uploadStatus === 'error') && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={cn(
                              "flex items-start gap-2 p-3 rounded-xl text-sm font-medium mt-2",
                              uploadStatus === 'success'
                                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                                : uploadStatus === 'partial'
                                ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                                : "bg-red-500/10 border border-red-500/30 text-red-400"
                            )}
                          >
                            {uploadStatus === 'success'
                              ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                              : uploadStatus === 'partial'
                              ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                            <span className="whitespace-pre-line">{uploadMessage}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enterprise Security Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 px-6 py-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent shadow-sm w-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                  <p className="text-[13px] leading-relaxed text-linear-text-muted mb-5 text-center relative z-10">
                    <Lock className="w-3.5 h-3.5 inline-block mr-1.5 text-linear-text-muted mb-0.5" />
                    {language === 'vi'
                      ? <span>Tài liệu nội bộ được bảo vệ bởi chuẩn <b>Mã hóa Đầu cuối</b>. Nhằm đảm bảo tuyệt mật, hệ thống sẽ <b>tiêu hủy file gốc vĩnh viễn</b> khỏi máy chủ ngay sau khi phân tích. Trí tuệ Nhân tạo tuyệt đối không sử dụng Dữ liệu của bạn để tự huấn luyện.</span>
                      : <span>Internal documents are protected by <b>End-to-End Encryption</b>. For absolute privacy, original files are <b>permanently destroyed</b> from servers after analysis. Our AI strictly does not train on your confidential data.</span>}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-bold text-linear-text-muted uppercase tracking-widest relative z-10">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-cyan-500" /> Enterprise Privacy</span>
                    <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-cyan-500" /> AES-256 Encrypted</span>
                    <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-cyan-500" /> Zero Retention</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ─── WEB LINKS ZONE ─── */}
            {selectedSources.includes('web') && (
              <motion.div
                key="web-zone"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mb-6 overflow-hidden"
              >
                <div className="p-8 rounded-3xl bento-card shadow-sm mt-4 space-y-6">

                  {/* URL inputs grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Social Links */}
                    <div>
                      <label className="text-sm font-bold text-foreground flex items-center mb-4">
                        <Share2 className="w-4 h-4 mr-2 text-cyan-400" />
                        {language === 'vi' ? 'Fanpage / Mạng xã hội' : 'Fanpage / Social Media'}
                        <span className="ml-2 text-[10px] text-linear-text-muted font-normal border border-linear-border rounded px-1.5 py-0.5">tuỳ chọn</span>
                      </label>
                      <div className="space-y-3">
                        {socialLinks.map((link, idx) => (
                          <div key={idx} className="flex gap-2">
                            <div className="relative flex-1">
                              <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-linear-text-muted pointer-events-none" />
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => { updateArray(socialLinks, setSocialLinks, idx, e.target.value); setCrawlStatus('idle'); }}
                                placeholder="facebook.com/yourpage"
                                className="w-full bg-background border border-linear-border rounded-xl pl-9 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-sm"
                              />
                            </div>
                            {socialLinks.length > 1 && (
                              <button onClick={() => removeFromArray(socialLinks, setSocialLinks, idx)} className="px-3 rounded-xl bg-background text-linear-text-muted hover:text-red-500 border border-linear-border shadow-sm"><X className="w-4 h-4" /></button>
                            )}
                          </div>
                        ))}
                        {socialLinks.length < 5 && (
                          <button onClick={() => addToArray(socialLinks, setSocialLinks)} className="text-xs font-semibold text-cyan-600 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                            <Plus className="w-3 h-3" /> {language === 'vi' ? 'Thêm fanpage' : 'Add fanpage'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Website Links */}
                    <div>
                      <label className="text-sm font-bold text-foreground flex items-center mb-4">
                        <Globe className="w-4 h-4 mr-2 text-cyan-400" />
                        {language === 'vi' ? 'Website doanh nghiệp' : 'Company Website'}
                        <span className="ml-2 text-[10px] text-emerald-400 font-normal border border-emerald-500/30 rounded px-1.5 py-0.5">khuyến nghị</span>
                      </label>
                      <div className="space-y-3">
                        {webLinks.map((link, idx) => (
                          <div key={idx} className="flex gap-2">
                            <div className="relative flex-1">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-linear-text-muted pointer-events-none" />
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => { updateArray(webLinks, setWebLinks, idx, e.target.value); setCrawlStatus('idle'); }}
                                placeholder="yourcompany.com"
                                className="w-full bg-background border border-linear-border rounded-xl pl-9 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-sm"
                              />
                            </div>
                            {webLinks.length > 1 && (
                              <button onClick={() => removeFromArray(webLinks, setWebLinks, idx)} className="px-3 rounded-xl bg-background text-linear-text-muted hover:text-red-500 border border-linear-border shadow-sm"><X className="w-4 h-4" /></button>
                            )}
                          </div>
                        ))}
                        {webLinks.length < 5 && (
                          <button onClick={() => addToArray(webLinks, setWebLinks)} className="text-xs font-semibold text-cyan-600 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                            <Plus className="w-3 h-3" /> {language === 'vi' ? 'Thêm trang web' : 'Add website'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* URL preview count */}
                  {getAllValidUrls().length > 0 && (
                    <p className="text-xs text-linear-text-muted">
                      {language === 'vi'
                        ? `${getAllValidUrls().length} URL sẽ được thu thập`
                        : `${getAllValidUrls().length} URL(s) will be crawled`}
                    </p>
                  )}

                  {/* Crawl Button */}
                  {crawlStatus !== 'success' && crawlStatus !== 'partial' && (
                    <motion.button
                      onClick={handleCrawl}
                      disabled={crawlStatus === 'crawling' || getAllValidUrls().length === 0}
                      className={cn(
                        "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                        crawlStatus === 'crawling'
                          ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 cursor-not-allowed"
                          : getAllValidUrls().length === 0
                          ? "bg-linear-surface/50 border border-linear-border text-linear-text-muted cursor-not-allowed opacity-50"
                          : "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.01]"
                      )}
                    >
                      {crawlStatus === 'crawling' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {language === 'vi' ? 'Đang thu thập dữ liệu web...' : 'Crawling web data...'}
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          {language === 'vi'
                            ? `Thu thập ${getAllValidUrls().length} trang web`
                            : `Crawl ${getAllValidUrls().length} URL(s)`}
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Per-URL Results */}
                  <AnimatePresence>
                    {crawlResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        {crawlResults.map((r, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "flex items-start gap-2 p-3 rounded-xl text-xs",
                              r.status === 'success'
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                            )}
                          >
                            {r.status === 'success'
                              ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              : <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                            <div className="min-w-0">
                              <p className="font-medium truncate">{r.url}</p>
                              {r.char_count && <p className="text-[10px] opacity-70">{(r.char_count / 1000).toFixed(1)}k ký tự</p>}
                              {r.error && <p className="text-[10px] opacity-80">{r.error}</p>}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status summary */}
                  <AnimatePresence>
                    {(crawlStatus === 'success' || crawlStatus === 'partial' || crawlStatus === 'error') && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl text-sm font-medium",
                          crawlStatus === 'success'
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : crawlStatus === 'partial'
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                            : "bg-red-500/10 border border-red-500/30 text-red-400"
                        )}
                      >
                        {crawlStatus === 'success'
                          ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                          : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{crawlMessage}</span>
                        {(crawlStatus === 'error' || crawlStatus === 'partial') && (
                          <button
                            onClick={() => { setCrawlStatus('idle'); setCrawlResults([]); setCrawlMessage(''); }}
                            className="ml-auto text-xs underline opacity-70 hover:opacity-100"
                          >
                            {language === 'vi' ? 'Thử lại' : 'Retry'}
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Warning for social media */}
                  <p className="text-[11px] text-linear-text-muted flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    {language === 'vi'
                      ? 'Lưu ý: Facebook và Instagram thường chặn crawler. Website doanh nghiệp sẽ cho kết quả tốt nhất.'
                      : 'Note: Facebook & Instagram often block crawlers. Company websites work best.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Proceed Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md mt-auto pt-8 pb-4"
          >
            <button
              onClick={handleProceed}
              disabled={selectedSources.length === 0}
              className={cn(
                "w-full py-4 rounded-xl font-bold shadow-lg transition-all duration-300 transform",
                selectedSources.length > 0
                  ? "gradient-ai-bg text-white hover:scale-[1.02] hover:shadow-cyan-500/20"
                  : "bg-linear-surface/50 border border-linear-border dark:bg-slate-800 text-linear-text-muted cursor-not-allowed opacity-50"
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
