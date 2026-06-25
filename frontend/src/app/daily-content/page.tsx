"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Send, CheckCircle2, Lock, ArrowRight, PenSquare, Image as ImageIcon, Flame, Users, Briefcase, Music, MoreHorizontal, Heart, MessageCircle, Share2, Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';
import DNAContextBanner from '@/components/shared/DNAContextBanner';

export default function DailyContentPage() {
  const { t } = useLanguage();
  const { brandDNA, wizardAnswers, extractedAnswers } = useFormStore();
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Chuyên nghiệp');
  const [platform, setPlatform] = useState('Facebook');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Derive masterDNA
  const brandName = brandDNA?.brand_name || wizardAnswers?.company_name || extractedAnswers?.company_name || "Thương hiệu";
  const coreUsps = brandDNA?.core_usps || wizardAnswers?.core_usps || extractedAnswers?.core_usps || ["Sản phẩm chất lượng"];

  // States for Google Trends
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchTrends = async () => {
      setIsLoadingTrends(true);
      try {
        if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
          if (isMounted) {
            setTrends(["Tối ưu dòng tiền", "Thoát cảnh 'Khổ Chủ'", "Xây dựng đội ngũ", "AI cho SME"]);
            setIsLoadingTrends(false);
          }
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const res = await fetch(`${API_URL}/api/content-lab/trends?platform=${platform}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await res.json();
        if (isMounted && data.status === 'success' && data.data?.length > 0) {
          setTrends(data.data);
        } else {
          if (isMounted) setTrends(["Tối ưu dòng tiền", "Thoát cảnh 'Khổ Chủ'", "Xây dựng đội ngũ", "AI cho SME"]);
        }
      } catch (err) {
        console.error("Failed to fetch trends", err);
        if (isMounted) {
          setTrends(["Tối ưu dòng tiền", "Thoát cảnh 'Khổ Chủ'", "Xây dựng đội ngũ", "AI cho SME"]);
          setIsLoadingTrends(false);
        }
      } finally {
        if (isMounted) setIsLoadingTrends(false);
      }
    };
    fetchTrends();
    return () => { isMounted = false; };
  }, [platform]);

  // AI loading steps
  const AI_STEPS = [
    { label: 'Phân tích Brand DNA...', icon: '🧬' },
    { label: 'Đối sánh Trend thị trường...', icon: '📊' },
    { label: 'Sáng tạo nội dung...', icon: '✍️' },
    { label: 'Tối ưu hoá cho ' + platform + '...', icon: '🚀' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setLoadingStep(0);

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, AI_STEPS.length - 1));
    }, 2500);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('brandflow_token');
      
      const res = await fetch(`${API_URL}/api/content-lab/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          topic,
          format_type: 'Social Post',
          tone_of_voice: tone,
          platform,
          brand_dna: brandDNA || null,
          business_context: {
            company_name: brandName,
            core_usps: coreUsps,
            ...(wizardAnswers || {}),
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.data) {
          const d = data.data;
          // Compose display content from structured API response
          let display = '';
          if (d.hook) display += `${d.hook}\n\n`;
          if (d.content_body) display += `${d.content_body}\n\n`;
          if (d.call_to_action) display += `${d.call_to_action}\n\n`;
          if (d.hashtags?.length) display += d.hashtags.join(' ');
          
          // Store metadata for display
          (window as any).__bf_content_meta = {
            headline: d.headline || '',
            engagement_hooks: d.engagement_hooks || [],
            best_posting_time: d.best_posting_time || '',
            visual_suggestion: d.visual_suggestion || '',
            content_pillar: d.content_pillar || '',
            seo_keywords: d.seo_keywords || [],
            estimated_reading_time: d.estimated_reading_time || '',
          };
          
          setGeneratedContent(display.trim());
        } else {
          throw new Error('Invalid response');
        }
      } else {
        throw new Error('API error');
      }
    } catch (err) {
      console.error('Content generation error:', err);
      // Fallback mock with brand DNA
      setGeneratedContent(`🔥 ${topic.toUpperCase()} 🔥\n\nNhiều Founder/CEO của các doanh nghiệp đang rơi vào một cái bẫy vô hình: Khởi nghiệp để được tự do, nhưng cuối cùng lại làm việc 14 tiếng/ngày.\n\nSự thật tàn nhẫn là: Doanh nghiệp của bạn sẽ KHÔNG THỂ 'Scale-up' nếu thiếu đi một hệ thống vững chắc.\n\nTại ${brandName}, chúng tôi tin rằng lợi thế: "${coreUsps[0]}" chính là chìa khóa để giải quyết vấn đề này.\n\n💡 3 BƯỚC ĐỂ BỨT PHÁ:\n1️⃣ Quy trình hóa (SOP) mọi tác vụ lặp lại.\n2️⃣ Tập trung vào giá trị cốt lõi thay vì chạy theo số lượng.\n3️⃣ Ứng dụng AI & Automation vào vận hành để giảm phụ thuộc vào con người.\n\n👇 Hãy bắt đầu xây dựng hệ thống tự vận hành ngay hôm nay cùng ${brandName}!\n\nBạn đang mắc kẹt ở khâu nào nhất? Comment bên dưới để cùng thảo luận nhé! 👇\n\n#${brandName.replace(/\s+/g, '')} #QuanTriDoanhNghiep #ScaleUp`);
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setLoadingStep(0);
    }
  };

  return (
    <div className="page-container flex flex-col h-[calc(100vh)] overflow-hidden">
      <header className="page-header shrink-0">
        <div className="page-badge bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          {t('daily_content.badge')}
        </div>
        <h1 className="page-title">{t('daily_content.title')}</h1>
        <p className="page-desc max-w-2xl">{t('daily_content.desc')}</p>
      </header>

      <DNAContextBanner />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 pb-6">
        {/* === CONFIGURATION PANEL === */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 overflow-y-auto no-scrollbar pr-1 pb-10">
          <div className="section-card">
            <h2 className="text-lg font-semibold text-foreground flex items-center mb-5">
              <PenSquare className="w-5 h-5 mr-2 text-blue-500" />
              {t('daily_content.config_title')}
            </h2>

            <div className="space-y-6">
              
              {/* Platform Selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('daily_content.platform')}</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { name: 'Facebook', icon: Users, color: 'text-blue-600', bgHover: 'hover:bg-blue-50' },
                    { name: 'LinkedIn', icon: Briefcase, color: 'text-sky-700', bgHover: 'hover:bg-sky-50' },
                    { name: 'TikTok', icon: Music, color: 'text-slate-900 dark:text-white', bgHover: 'hover:bg-slate-100 dark:hover:bg-slate-800' },
                    { name: 'Instagram', icon: Heart, color: 'text-pink-600', bgHover: 'hover:bg-pink-50' },
                    { name: 'Zalo', icon: MessageCircle, color: 'text-blue-500', bgHover: 'hover:bg-blue-50' },
                  ].map((p) => (
                    <button 
                      key={p.name}
                      onClick={() => setPlatform(p.name)}
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${
                        platform === p.name 
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm scale-105' 
                        : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <p.icon className={`w-6 h-6 mb-1.5 ${platform === p.name ? p.color : 'text-slate-500'}`} />
                      <span className={`text-[11px] font-bold ${platform === p.name ? 'text-foreground' : 'text-slate-500'}`}>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('daily_content.topic')}</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('daily_content.topic_ph')}
                    className="relative w-full bg-background border border-linear-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-28 text-foreground placeholder:text-slate-400 shadow-inner"
                  />
                </div>
              </div>

              {/* DNA Suggestions */}
              <div>
                <label className="block text-xs font-bold text-cyan-500 mb-3 flex items-center uppercase tracking-wider">
                  <Compass className="w-4 h-4 mr-1.5" />
                  Gợi Ý Từ DNA Doanh Nghiệp
                </label>
                <div className="flex flex-wrap gap-2">
                   {coreUsps.slice(0, 3).map((usp: string, idx: number) => (
                     <button
                        key={`dna-${idx}`}
                        onClick={() => setTopic(`Làm nổi bật ưu điểm: ${usp} của ${brandName}`)}
                        className="text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 px-3.5 py-1.5 rounded-full hover:shadow-md hover:scale-105 transition-all text-left line-clamp-1 flex items-center"
                      >
                        ✨ {usp.substring(0, 30)}{usp.length > 30 ? '...' : ''}
                      </button>
                   ))}
                </div>
              </div>

              {/* Trending Tags Section */}
              <div>
                <label className="block text-xs font-bold text-amber-500 mb-3 flex items-center uppercase tracking-wider">
                  <Flame className="w-4 h-4 mr-1.5 animate-pulse" />
                  Gợi Ý Đang Hot (Google Trends)
                  {isLoadingTrends && <Sparkles className="w-3 h-3 ml-2 animate-spin text-amber-500" />}
                </label>
                <div className="flex flex-wrap gap-2">
                  {isLoadingTrends ? (
                    <span className="text-xs text-linear-text-muted italic flex items-center"><Sparkles className="w-3 h-3 mr-1 animate-spin" /> Đang phân tích từ AI...</span>
                  ) : trends.length > 0 ? (
                    trends.map((t_item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTopic(t_item)}
                        className="text-xs font-semibold bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-3.5 py-1.5 rounded-full hover:shadow-md hover:scale-105 transition-all text-left line-clamp-1 flex items-center"
                        title="Click để dùng chủ đề này"
                      >
                        <span className="opacity-50 mr-1">#</span>{t_item}
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-linear-text-muted italic">Không tìm thấy trend phù hợp</span>
                  )}
                </div>
              </div>

              {/* Tone Selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('daily_content.tone')}</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-background border border-linear-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-foreground font-medium"
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
                className={`w-full mt-4 py-4 rounded-xl text-white font-bold flex items-center justify-center transition-all duration-300 relative overflow-hidden group ${
                  topic && !isGenerating 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5' 
                  : 'bg-slate-300 dark:bg-slate-800 text-linear-text-muted cursor-not-allowed'
                }`}
              >
                {topic && !isGenerating && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />}
                <span className="relative flex items-center">
                  {isGenerating ? <Sparkles className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {isGenerating ? t('daily_content.btn_generating') : "Sáng Tạo Ngay"}
                </span>
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

        {/* === RESULT PANEL: SMARTPHONE MOCKUP === */}
        <div className="lg:col-span-7 xl:col-span-8 h-full flex flex-col items-center justify-start min-h-0 pb-10">
          
          <AnimatePresence mode="wait">
            {generatedContent ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-[400px] flex flex-col h-full"
              >
                {/* Phone Frame - High-End Titanium Look */}
                <div className="relative bg-black rounded-[3rem] p-[3px] shadow-[0_0_50px_rgba(59,130,246,0.3)] overflow-hidden flex flex-col h-full bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800">
                  <div className="bg-white dark:bg-[#0f172a] rounded-[2.8rem] overflow-hidden flex flex-col h-full relative">
                    
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-2 inset-x-0 h-7 bg-black rounded-full w-32 mx-auto z-20 flex justify-center items-center shadow-md">
                      <div className="w-1.5 h-1.5 bg-green-500/80 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-1 bg-slate-800 rounded-full" />
                    </div>

                    {/* Fake Status Bar */}
                    <div className="px-6 pt-3 pb-2 flex justify-between items-center text-[10px] font-medium text-slate-800 dark:text-slate-300 z-10 relative bg-white dark:bg-[#0f172a]">
                       <span>9:41</span>
                       <div className="flex items-center space-x-1.5">
                          <div className="w-4 h-3 flex items-end justify-between"><div className="w-0.5 h-1 bg-current"/><div className="w-0.5 h-1.5 bg-current"/><div className="w-0.5 h-2 bg-current"/><div className="w-0.5 h-2.5 bg-current"/></div>
                          <div className="w-3 h-3 rounded-sm border border-current flex items-center justify-center"><div className="w-2 h-1.5 bg-current"/></div>
                       </div>
                    </div>

                    {/* App Header (Fake Social) */}
                    <div className="px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-white dark:bg-[#0f172a] z-10 shrink-0">
                       <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md p-[2px]">
                             <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">{brandName.substring(0,2)}</span>
                             </div>
                          </div>
                          <div>
                             <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{brandName}</h4>
                             <span className="text-[10px] text-slate-500 flex items-center mt-0.5">
                               Ngay bây giờ • {platform} • <Users className="w-3 h-3 ml-1 text-slate-400" />
                             </span>
                          </div>
                       </div>
                       <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-[#0f172a] relative">
                       <div className="p-5 prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                         {generatedContent}
                       </div>
                    </div>

                    {/* Fake Actions */}
                    <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between shrink-0 text-slate-500">
                       <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors group"><Heart className="w-5 h-5 group-hover:scale-110 transition-transform" /><span className="text-xs font-semibold">Thích</span></button>
                       <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group"><MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /><span className="text-xs font-semibold">Bình luận</span></button>
                       <button className="flex items-center space-x-2 hover:text-emerald-500 transition-colors group"><Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" /><span className="text-xs font-semibold">Chia sẻ</span></button>
                    </div>
                    
                    {/* Home Indicator */}
                    <div className="w-full h-1 flex justify-center pb-2 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
                       <div className="w-1/3 h-1 bg-slate-800 dark:bg-slate-200 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Real Action Buttons below phone */}
                <div className="flex items-center gap-3 mt-6 shrink-0">
                  <button className="flex-1 py-3 px-4 bg-linear-surface hover:bg-linear-surface/80 dark:hover:bg-slate-800 text-foreground font-semibold rounded-xl border border-linear-border transition-colors flex items-center justify-center shadow-sm group">
                    <Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> {t('daily_content.btn_copy')}
                  </button>
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center group hover:-translate-y-0.5">
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" /> Duyệt & Đăng
                  </button>
                </div>
              </motion.div>
            ) : isGenerating ? (
              /* ═══ AI PROGRESS ANIMATION ═══ */
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-8">
                  <div className="w-[260px] h-[520px] border-[4px] border-cyan-500/30 rounded-[3rem] flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-[#0f172a] shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                    <div className="absolute top-2 inset-x-0 h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-28 mx-auto" />
                    
                    {/* Progress steps inside phone */}
                    <div className="px-8 w-full space-y-4">
                      {AI_STEPS.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0.3, x: -10 }}
                          animate={{ opacity: i <= loadingStep ? 1 : 0.3, x: 0 }}
                          transition={{ delay: i * 0.3, duration: 0.4 }}
                          className={`flex items-center gap-3 text-left p-2.5 rounded-xl transition-all ${
                            i === loadingStep
                              ? 'bg-cyan-500/10 border border-cyan-500/20 shadow-sm'
                              : i < loadingStep
                                ? 'opacity-60'
                                : ''
                          }`}
                        >
                          <span className="text-lg">{i < loadingStep ? '✅' : step.icon}</span>
                          <span className={`text-xs font-medium ${
                            i === loadingStep ? 'text-cyan-500' : i < loadingStep ? 'text-emerald-500' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </span>
                          {i === loadingStep && (
                            <div className="ml-auto flex gap-0.5">
                              <div className="w-1 h-1 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-1 h-1 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-1 h-1 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Bottom progress bar */}
                    <div className="absolute bottom-12 left-8 right-8">
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${((loadingStep + 1) / AI_STEPS.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-[9px] text-linear-text-muted mt-2 text-center">AI đang xử lý • ~10 giây</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center text-linear-text-muted text-center"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                  <div className="w-[260px] h-[520px] border-[4px] border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-[#0f172a] shadow-2xl">
                     <div className="absolute top-2 inset-x-0 h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-28 mx-auto" />
                     <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-6 drop-shadow-md" />
                     <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-700/50 rounded-full mb-3" />
                     <div className="w-5/6 h-3 bg-slate-200 dark:bg-slate-700/50 rounded-full mb-3" />
                     <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-700/50 rounded-full" />
                  </div>
                </div>
                <h3 className="text-foreground font-bold mb-2 text-xl tracking-tight">Bản Xem Trước Trực Quan</h3>
                <p className="max-w-[320px] text-sm leading-relaxed opacity-80">
                  Chọn gợi ý từ DNA hoặc Trend để AI tạo nội dung siêu tốc. Trải nghiệm xem trước y hệt bài đăng thực tế.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}
