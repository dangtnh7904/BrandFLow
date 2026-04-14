"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Send, CheckCircle2, Lock, ArrowRight, PenSquare, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DailyContentPage() {
  const { t } = useLanguage();
 const [topic, setTopic] = useState('');
 const [tone, setTone] = useState('Chuyên nghiệp');
 const [platform, setPlatform] = useState('Facebook');
 const [isGenerating, setIsGenerating] = useState(false);
 const [generatedContent, setGeneratedContent] = useState<string | null>(null);

 const handleGenerate = () => {
 setIsGenerating(true);
 // Mock API call
 setTimeout(() => {
 setGeneratedContent(`🚀 Khám phá sức mạnh của việc tối ưu hóa quy trình với AI!\n\nBạn có biết rằng 70% doanh nghiệp vừa và nhỏ đang lãng phí hàng giờ mỗi tuần cho các tác vụ thủ công không? Đã đến lúc chuyển đổi số! \n\n🔹 Giảm thiểu sai sót\n🔹 Tiết kiệm 30% ngân sách vận hành\n🔹 Thúc đẩy năng suất đội ngũ\n\nBạn đã sẵn sàng để ứng dụng AI vào doanh nghiệp của mình chưa?\n\n#DigitalTransformation #AI #SME #BusinessGrowth`);
 setIsGenerating(false);
 }, 2000);
 };

 return (
  <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col h-[calc(100vh)] overflow-hidden">
  <header className="mb-6 shrink-0 mt-4 md:mt-0">
  <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-4 shadow-sm">
  <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">{t('daily_content.badge')}</span>
  </div>
  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">{t('daily_content.title')}</h1>
  <p className="text-linear-text-muted max-w-2xl text-base">{t('daily_content.desc')}</p>
  </header>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 pb-6">
  {/* Configuration Panel */}
  <div className="lg:col-span-4 space-y-6 overflow-y-auto no-scrollbar pr-1 pb-10">
  <div className="bg-linear-surface rounded-2xl border border-linear-border p-6 shadow-sm">
  <h2 className="text-lg font-semibold text-foreground flex items-center mb-5">
  <PenSquare className="w-5 h-5 mr-2 text-blue-500" />
  {t('daily_content.config_title')}
  </h2>

  <div className="space-y-5">
  <div>
  <label className="block text-sm font-medium text-foreground mb-2">{t('daily_content.topic')}</label>
  <textarea 
  value={topic}
  onChange={(e) => setTopic(e.target.value)}
  placeholder={t('daily_content.topic_ph')}
  className="w-full bg-background border border-linear-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all resize-none h-28 text-foreground placeholder:text-slate-400"
  />
  </div>

  <div>
  <label className="block text-sm font-medium text-foreground mb-2">{t('daily_content.platform')}</label>
  <div className="grid grid-cols-3 gap-2">
  {['Facebook', 'LinkedIn', 'Instagram'].map((p) => (
  <button 
  key={p}
  onClick={() => setPlatform(p)}
  className={`py-2.5 px-2 text-[11px] sm:text-xs font-semibold rounded-lg border transition-all ${
  platform === p 
  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
  : 'bg-linear-surface border-linear-border text-linear-text-muted hover:bg-linear-surface/80 dark:hover:bg-slate-800'
  }`}
  >
  {p}
  </button>
  ))}
  </div>
  </div>

  <div>
  <label className="block text-sm font-medium text-foreground mb-2">{t('daily_content.tone')}</label>
  <select 
  value={tone}
  onChange={(e) => setTone(e.target.value)}
  className="w-full bg-background border border-linear-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-foreground "
  >
  <option value="Chuyên nghiệp">{t('daily_content.tone_1')}</option>
  <option value="Hài hước, gần gũi">{t('daily_content.tone_2')}</option>
  <option value="Truyền cảm hứng">{t('daily_content.tone_3')}</option>
  <option value="Trang trọng">{t('daily_content.tone_4')}</option>
  </select>
  </div>

  <button 
  onClick={handleGenerate}
  disabled={!topic || isGenerating}
  className={`w-full mt-2 py-3.5 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300 ${
  topic && !isGenerating 
  ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]' 
  : 'bg-slate-300 text-linear-text-muted cursor-not-allowed'
  }`}
  >
  {isGenerating ? (
  <span className="flex items-center">
  <Sparkles className="w-4 h-4 mr-2 animate-spin" /> {t('daily_content.btn_generating')}
  </span>
  ) : (
  <span className="flex items-center">
  <Sparkles className="w-4 h-4 mr-2" /> {t('daily_content.btn_generate')}
  </span>
  )}
  </button>
  </div>
  </div>

  {/* Upsell Banner for Free Users */}
  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
  <h3 className="text-white font-bold mb-2 flex items-center">
  <Lock className="w-4 h-4 text-cyan-400 mr-2" /> {t('daily_content.upsell_title')}
  </h3>
  <p className="text-linear-text-muted text-sm mb-5 leading-relaxed">
  {t('daily_content.upsell_desc')}
  </p>
  <div className="text-cyan-400 text-sm font-semibold flex items-center group-hover:text-cyan-300 transition-colors">
  {t('daily_content.upsell_btn')} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
  </div>
  </div>
  </div>

  {/* Result Panel */}
  <div className="lg:col-span-8 h-full flex flex-col min-h-0 pb-10">
  <div className="bg-linear-surface rounded-2xl border border-linear-border p-6 md:p-8 shadow-sm h-full flex flex-col relative overflow-hidden">
  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center justify-between pb-4 border-b border-linear-border shrink-0">
  <span>{t('daily_content.result_title')}</span>
  {generatedContent && (
  <span className="flex items-center text-[11px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider">
  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {t('daily_content.result_done')}
  </span>
  )}
  </h2>

  {generatedContent ? (
  <motion.div 
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="flex-1 flex flex-col min-h-0"
  >
  <div className="flex-1 overflow-y-auto no-scrollbar bg-background hover:bg-linear-surface/50 /30 rounded-xl p-5 border border-linear-border mb-6">
  <div className="prose prose-slate dark:prose-invert max-w-none text-foreground text-sm md:text-base leading-[1.8] whitespace-pre-wrap">
  {generatedContent}
  </div>
  </div>
  <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto shrink-0">
  <button className="w-full sm:w-auto flex-1 py-3.5 px-4 bg-linear-surface hover:bg-linear-surface/80 dark:hover:bg-slate-700 text-foreground font-semibold rounded-xl border border-linear-border transition-colors flex items-center justify-center shadow-sm">
  <Copy className="w-4 h-4 mr-2" /> {t('daily_content.btn_copy')}
  </button>
  <button className="w-full sm:w-auto flex-1 py-3.5 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-semibold rounded-xl border border-blue-200 dark:border-blue-800/60 transition-colors flex items-center justify-center shadow-sm">
  <Send className="w-4 h-4 mr-2" /> {t('daily_content.btn_post')}
  </button>
  </div>
  </motion.div>
  ) : (
  <div className="flex-1 flex flex-col items-center justify-center text-linear-text-muted text-center py-10">
  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 border border-linear-border /50 shadow-sm relative shrink-0">
  <div className="absolute inset-0 bg-blue-400/5 rounded-full animate-ping" />
  <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
  </div>
  <h3 className="text-linear-text-muted font-medium mb-2">{t('daily_content.empty_title')}</h3>
  <p className="max-w-[300px] text-sm leading-relaxed">
  {t('daily_content.empty_desc')}
  </p>
  </div>
  )}
  </div>
  </div>
  </div>
  </div>
 );
}
