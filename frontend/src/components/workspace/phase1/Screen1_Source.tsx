"use client";

import React, { useState } from 'react';
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

 return (
 <div className="w-full h-full overflow-y-auto">
 <div className="flex flex-col items-center p-8 max-w-5xl mx-auto w-full min-h-full">
 <motion.div 
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-center mb-8 shrink-0"
 >
 <h2 className="text-3xl font-bold text-foreground tracking-tight mb-3">{t('screen1.title')}</h2>
 <p className="text-linear-text-muted max-w-xl mx-auto text-sm">{t('screen1.desc')}</p>
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
 "relative group flex flex-col p-6 rounded-3xl cursor-pointer transition-all duration-500 border backdrop-blur-xl shadow-sm overflow-hidden",
 isSelected 
 ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.02]" 
 : "bg-linear-surface hover:bg-linear-surface/80 border-linear-border hover:border-cyan-500/30"
 )}
 >
 <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10", isSelected ? "bg-cyan-500/20 border border-cyan-500/30" : "bg-linear-surface/50 border border-linear-border dark:bg-slate-800 border border-linear-border group-hover:border-cyan-500/30")}>
 <card.icon className={cn("w-6 h-6", isSelected ? "text-cyan-400" : "text-linear-text-muted group-hover:text-cyan-500/70")} />
 </div>
 <h3 className="text-lg font-bold text-foreground mb-2">{card.title}</h3>
 <p className="text-xs text-linear-text-muted leading-relaxed">{card.description}</p>
 
 {isSelected && (
 <div className="absolute top-4 right-4 text-cyan-400">
 <CheckCircle2 className="w-5 h-5 animate-in fade-in" />
 </div>
 )}
 {isSelected && <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>}
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
 className={cn("w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-300 h-48 backdrop-blur-md relative overflow-hidden", isDragging ? "bg-cyan-500/10 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.1)]" : "bg-linear-surface/50 border-linear-border hover:border-cyan-500/50")}
 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
 onDragLeave={() => setIsDragging(false)}
 onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
 >
 <UploadCloud className="w-10 h-10 text-linear-text-muted mb-3" />
 <p className="text-foreground font-bold mb-1">{t('screen1.upload_zone')}</p>
 <p className="text-xs text-linear-text-muted">{t('screen1.upload_zone_desc')}</p>
 </div>
 
 {/* ENTERPRISE SECURITY AUDIT & TRUST BADGE */}
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="mt-6 px-6 py-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent shadow-sm w-full relative overflow-hidden"
 >
 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
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

 {selectedSources.includes('web') && (
 <motion.div 
 key="web-zone"
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="w-full mb-6 overflow-hidden"
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-3xl bento-card shadow-sm mt-4">
 {/* Social Logic */}
 <div>
 <label className="text-sm font-bold text-foreground flex items-center mb-4">
 <Share2 className="w-4 h-4 mr-2 text-cyan-400" /> {t('screen1.social')}
 </label>
 <div className="space-y-3">
 {socialLinks.map((link, idx) => (
 <div key={idx} className="flex gap-2">
 <input 
 type="text" 
 value={link}
 onChange={(e) => updateArray(socialLinks, setSocialLinks, idx, e.target.value)}
 placeholder="Đường dẫn Facebook, LinkedIn..." 
 className="flex-1 bg-background border border-linear-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-sm" 
 />
 {socialLinks.length > 1 && (
 <button onClick={() => removeFromArray(socialLinks, setSocialLinks, idx)} className="px-3 rounded-xl bg-background text-linear-text-muted hover:text-red-500 border border-linear-border shadow-sm"><X className="w-4 h-4" /></button>
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
 <label className="text-sm font-bold text-foreground flex items-center mb-4">
 <Globe className="w-4 h-4 mr-2 text-cyan-400" /> {t('screen1.website')}
 </label>
 <div className="space-y-3">
 {webLinks.map((link, idx) => (
 <div key={idx} className="flex gap-2">
 <input 
 type="text" 
 value={link}
 onChange={(e) => updateArray(webLinks, setWebLinks, idx, e.target.value)}
 placeholder="Domain chính hoặc chiến dịch LP..." 
 className="flex-1 bg-background border border-linear-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-sm" 
 />
 {webLinks.length > 1 && (
 <button onClick={() => removeFromArray(webLinks, setWebLinks, idx)} className="px-3 rounded-xl bg-background text-linear-text-muted hover:text-red-500 border border-linear-border shadow-sm"><X className="w-4 h-4" /></button>
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
 "w-full py-4 rounded-xl font-bold shadow-lg transition-all duration-300 transform",
 selectedSources.length > 0 
 ? "gradient-ai-bg text-white hover:scale-[1.02] hover:shadow-cyan-500/20" 
 : "bg-linear-surface/50 border border-linear-border dark:bg-slate-800 text-linear-text-muted cursor-not-allowed border border-linear-border opacity-50"
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
