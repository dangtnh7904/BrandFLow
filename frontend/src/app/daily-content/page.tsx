"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Send, CheckCircle2, Lock, ArrowRight, PenSquare, Image as ImageIcon, Flame, Users, Briefcase, Music, MoreHorizontal, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DailyContentPage() {
  const { t } = useLanguage();
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Chuyên nghiệp');
  const [platform, setPlatform] = useState('Facebook');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // States for Google Trends
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchTrends = async () => {
      setIsLoadingTrends(true);
      try {
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
        if (isMounted) setTrends(["Tối ưu dòng tiền", "Thoát cảnh 'Khổ Chủ'", "Xây dựng đội ngũ", "AI cho SME"]);
      } finally {
        if (isMounted) setIsLoadingTrends(false);
      }
    };
    fetchTrends();
    return () => { isMounted = false; };
  }, [platform]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mock API call tailored for SME
    setTimeout(() => {
      setGeneratedContent(`🔥 LÀM SAO ĐỂ THOÁT CẢNH LÀM "KHỔ CHỦ" MÀ THỰC SỰ LÀM CHỦ? 🔥\n\nNhiều Founder/CEO của các doanh nghiệp SME đang rơi vào một cái bẫy vô hình: Khởi nghiệp để được tự do, nhưng cuối cùng lại làm việc 14 tiếng/ngày, kiêm luôn cả Sales, Marketing và... HR! 🤦‍♂️\n\nSự thật tàn nhẫn là: Doanh nghiệp của bạn sẽ KHÔNG THỂ 'Scale-up' nếu mọi quyết định nhỏ nhất đều phải chờ bạn duyệt.\n\n💡 3 BƯỚC ĐỂ "GIẢI PHÓNG" LÃNH ĐẠO:\n1️⃣ Quy trình hóa (SOP) mọi tác vụ lặp lại.\n2️⃣ Phân quyền rõ ràng (Trao quyền đi kèm trách nhiệm).\n3️⃣ Ứng dụng AI & Automation vào vận hành để giảm phụ thuộc vào con người.\n\n👇 Đừng để công ty trở thành "nhà tù" vô hình của chính bạn. Hãy bắt đầu xây dựng hệ thống tự vận hành ngay hôm nay!\n\nBạn đang mắc kẹt ở khâu nào nhất? Comment bên dưới để cùng thảo luận nhé! 👇\n\n#SME #QuanTriDoanhNghiep #FounderStory #Automation #ScaleUp`);
      setIsGenerating(false);
    }, 1500);
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
        {/* === CONFIGURATION PANEL === */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 overflow-y-auto no-scrollbar pr-1 pb-10">
          <div className="bg-linear-surface rounded-2xl border border-linear-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground flex items-center mb-5">
              <PenSquare className="w-5 h-5 mr-2 text-blue-500" />
              {t('daily_content.config_title')}
            </h2>

            <div className="space-y-6">
              
              {/* Platform Selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('daily_content.platform')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Facebook', icon: Users, color: 'text-blue-600', bgHover: 'hover:bg-blue-50' },
                    { name: 'LinkedIn', icon: Briefcase, color: 'text-sky-700', bgHover: 'hover:bg-sky-50' },
                    { name: 'TikTok', icon: Music, color: 'text-slate-900 dark:text-white', bgHover: 'hover:bg-slate-100 dark:hover:bg-slate-800' }
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
                {/* Phone Frame */}
                <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 dark:border-slate-950 shadow-2xl shadow-blue-500/20 overflow-hidden flex flex-col h-full">
                  {/* Notch */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 dark:bg-slate-950 rounded-b-2xl w-32 mx-auto z-20 flex justify-center items-end pb-1">
                    <div className="w-12 h-1.5 bg-slate-900 dark:bg-black rounded-full opacity-50" />
                  </div>

                  {/* App Header (Fake) */}
                  <div className="px-4 pt-10 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 shrink-0">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                           <span className="text-white font-bold text-sm">BF</span>
                        </div>
                        <div>
                           <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">CEO & Founder Community</h4>
                           <span className="text-[10px] text-slate-500 flex items-center">
                             Vừa xong • {platform} • <Users className="w-3 h-3 ml-1" />
                           </span>
                        </div>
                     </div>
                     <MoreHorizontal className="w-5 h-5 text-slate-400" />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-5 bg-white dark:bg-slate-900 relative">
                     <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-[1.6] whitespace-pre-wrap">
                       {generatedContent}
                     </div>
                  </div>

                  {/* Fake Actions */}
                  <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-around shrink-0 text-slate-500">
                     <button className="flex items-center space-x-1.5 hover:text-rose-500 transition-colors"><Heart className="w-5 h-5" /><span className="text-xs font-medium">Thích</span></button>
                     <button className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors"><MessageCircle className="w-5 h-5" /><span className="text-xs font-medium">Bình luận</span></button>
                     <button className="flex items-center space-x-1.5 hover:text-emerald-500 transition-colors"><Share2 className="w-5 h-5" /><span className="text-xs font-medium">Chia sẻ</span></button>
                  </div>
                </div>

                {/* Real Action Buttons below phone */}
                <div className="flex items-center gap-3 mt-6 shrink-0">
                  <button className="flex-1 py-3 px-4 bg-linear-surface hover:bg-linear-surface/80 dark:hover:bg-slate-800 text-foreground font-semibold rounded-xl border border-linear-border transition-colors flex items-center justify-center shadow-sm group">
                    <Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> {t('daily_content.btn_copy')}
                  </button>
                  <button className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center group hover:-translate-y-0.5">
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" /> {t('daily_content.btn_post')}
                  </button>
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
                  {/* Empty State Phone Wireframe */}
                  <div className="w-48 h-80 border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center relative bg-slate-50/50 dark:bg-slate-800/30">
                     <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-4" />
                     <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-2" />
                     <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-2" />
                     <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                </div>
                <h3 className="text-foreground font-semibold mb-2 text-lg">Bản Xem Trước (Preview)</h3>
                <p className="max-w-[300px] text-sm leading-relaxed">
                  Viết chủ đề hoặc chọn một Trend nóng hổi bên trái. AI sẽ thiết kế nội dung và hiển thị ngay trên chiếc điện thoại này.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}
