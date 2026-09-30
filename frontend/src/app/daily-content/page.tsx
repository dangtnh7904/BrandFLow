"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Send, CheckCircle2, Lock, ArrowRight, PenSquare, Image as ImageIcon, Flame, Users, Briefcase, Music, MoreHorizontal, Heart, MessageCircle, Share2, Compass, ThumbsUp, Bookmark, Globe, ArrowLeft, Search, Camera, Video, PlusSquare, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

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
  const [trends, setTrends] = useState<string[]>(["Tối ưu dòng tiền", "Phát triển đội ngũ"]);

  // AI loading steps
  const AI_STEPS = [
    { label: 'Phân tích Brand DNA...' },
    { label: 'Sáng tạo nội dung...' },
    { label: 'Tối ưu cho ' + platform + '...' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, AI_STEPS.length - 1));
    }, 1200);

    setTimeout(() => {
      clearInterval(stepInterval);
      setGeneratedContent(`${topic.toUpperCase()}\n\nBạn đang gặp vấn đề với việc quản trị doanh nghiệp?\n\nTại ${brandName}, chúng tôi tin rằng lợi thế: "${coreUsps[0]}" chính là giải pháp tối ưu dành cho bạn.\n\nHãy bắt đầu xây dựng hệ thống tự vận hành ngay hôm nay!\n\n#${brandName.replace(/\s+/g, '')} #SME`);
      setIsGenerating(false);
      setLoadingStep(0);
    }, 3600);
  };

  // NATIVE PLATFORM MOCKUP RENDERERS
  const renderNativeUI = () => {
    if (!generatedContent) return null;

    const ProfilePic = ({ size = 10 }: { size?: number }) => (
      <div className={`w-${size} h-${size} rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-600 overflow-hidden`}>
        <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px]">{brandName.substring(0,2)}</span>
      </div>
    );

    switch(platform) {
      case 'Facebook':
        return (
          <div className="bg-[#f0f2f5] dark:bg-[#18191A] h-full flex flex-col relative w-full font-sans">
             {/* FB Header Navbar */}
             <div className="bg-white dark:bg-[#242526] px-4 py-3 flex justify-between items-center shadow-sm z-10 shrink-0">
                <div className="text-[#0866FF] font-bold text-2xl tracking-tighter">facebook</div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full bg-[#f0f2f5] dark:bg-[#3A3B3C] flex items-center justify-center"><Search className="w-4 h-4 text-black dark:text-[#E4E6EB]" /></div>
                   <div className="w-8 h-8 rounded-full bg-[#f0f2f5] dark:bg-[#3A3B3C] flex items-center justify-center"><Menu className="w-4 h-4 text-black dark:text-[#E4E6EB]" /></div>
                </div>
             </div>
             
             {/* FB Post Card */}
             <div className="bg-white dark:bg-[#242526] mt-2 pb-2">
                <div className="px-3 pt-3 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProfilePic size={10} />
                    <div>
                      <div className="font-bold text-[14px] text-black dark:text-[#E4E6EB] leading-tight flex items-center gap-1">{brandName} <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-2 h-2 text-white" /></div></div>
                      <div className="flex items-center text-[12px] text-[#65676B] dark:text-[#B0B3B8] gap-1">
                        <span>Vừa xong</span> • <Globe className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-[#65676B] dark:text-[#B0B3B8]">
                    <MoreHorizontal className="w-5 h-5" />
                    <X className="w-5 h-5" />
                  </div>
                </div>
                <div className="px-4 py-1 text-[14px] text-black dark:text-[#E4E6EB] whitespace-pre-wrap leading-snug">
                  {generatedContent}
                </div>
                <div className="w-full aspect-video bg-slate-100 dark:bg-[#18191A] flex items-center justify-center mt-2 border-y border-slate-200 dark:border-slate-800">
                  <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                </div>
                <div className="px-4 py-2">
                  <div className="flex justify-between items-center text-[13px] text-[#65676B] dark:text-[#B0B3B8] border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-[#0866FF] flex items-center justify-center"><ThumbsUp className="w-2.5 h-2.5 text-white fill-white"/></div> 12K</div>
                    <div className="flex gap-3"><span>432 bình luận</span><span>120 chia sẻ</span></div>
                  </div>
                  <div className="flex justify-between text-[#65676B] dark:text-[#B0B3B8] pt-1">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-100 dark:hover:bg-[#3A3B3C] rounded-md transition-colors"><ThumbsUp className="w-5 h-5" /> <span className="text-[13px] font-semibold">Thích</span></button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-100 dark:hover:bg-[#3A3B3C] rounded-md transition-colors"><MessageCircle className="w-5 h-5" /> <span className="text-[13px] font-semibold">Bình luận</span></button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-100 dark:hover:bg-[#3A3B3C] rounded-md transition-colors"><Share2 className="w-5 h-5" /> <span className="text-[13px] font-semibold">Chia sẻ</span></button>
                  </div>
                </div>
             </div>
          </div>
        );

      case 'Instagram':
        return (
          <div className="bg-white dark:bg-black h-full flex flex-col font-sans">
             {/* IG Header Navbar */}
             <div className="px-4 py-3 flex justify-between items-center shrink-0 border-b border-slate-100 dark:border-slate-900">
                <div className="font-['Billabong'] text-2xl font-bold tracking-tight text-black dark:text-white">Instagram</div>
                <div className="flex gap-4">
                   <Heart className="w-6 h-6 text-black dark:text-white" />
                   <MessageCircle className="w-6 h-6 text-black dark:text-white" />
                </div>
             </div>
            <div className="px-3 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
                  <div className="border-2 border-white dark:border-black rounded-full"><ProfilePic size={8} /></div>
                </div>
                <div className="font-semibold text-[13px] text-black dark:text-white flex items-center gap-1">{brandName.toLowerCase().replace(/\s/g, '')} <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-2 h-2 text-white" /></div></div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-black dark:text-white" />
            </div>
            <div className="w-full aspect-square bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
              <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-700" />
            </div>
            <div className="flex-1 flex flex-col pt-2 bg-white dark:bg-black">
              <div className="px-3 py-1 flex justify-between items-center text-black dark:text-white shrink-0">
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 hover:text-slate-500 transition-colors" />
                  <MessageCircle className="w-6 h-6 hover:text-slate-500" />
                  <Send className="w-6 h-6 hover:text-slate-500" />
                </div>
                <Bookmark className="w-6 h-6 hover:text-slate-500" />
              </div>
              <div className="px-3 py-1 text-[13px] font-bold text-black dark:text-white">12,432 likes</div>
              <div className="px-3 pb-2 text-[13px] text-black dark:text-white whitespace-pre-wrap leading-tight">
                <span className="font-bold mr-2">{brandName.toLowerCase().replace(/\s/g, '')}</span>
                {generatedContent}
              </div>
              <div className="px-3 text-[11px] text-slate-500 uppercase tracking-wide">2 HOURS AGO</div>
            </div>
          </div>
        );

      case 'TikTok':
        return (
          <div className="bg-black h-full flex flex-col relative text-white font-sans overflow-hidden">
            <div className="absolute top-0 inset-x-0 pt-4 pb-2 flex justify-between items-center px-4 z-20 text-white shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
              <div className="w-6 h-6 flex items-center justify-center"><Globe className="w-5 h-5" /></div>
              <div className="flex gap-4 font-bold text-[16px] tracking-tight">
                <span className="opacity-60">Following</span>
                <span className="relative">For You <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full" /></span>
              </div>
              <Search className="w-6 h-6" />
            </div>
            
            {/* Full Screen Video area */}
            <div className="absolute inset-0 bg-[#121212] flex items-center justify-center">
              <Play className="w-16 h-16 text-white/20 fill-white/20" />
            </div>

            <div className="absolute right-3 bottom-[90px] flex flex-col items-center gap-5 z-20">
              <div className="relative mb-2">
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white"><ProfilePic size={12} /></div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#FE2C55] rounded-full flex items-center justify-center shadow-md"><span className="text-white text-[14px] font-bold leading-none">+</span></div>
              </div>
              <div className="flex flex-col items-center gap-1"><Heart className="w-8 h-8 fill-white/90 drop-shadow-md" /><span className="text-[12px] font-semibold text-white drop-shadow-md">1.2M</span></div>
              <div className="flex flex-col items-center gap-1"><MessageCircle className="w-8 h-8 fill-white/90 drop-shadow-md" /><span className="text-[12px] font-semibold text-white drop-shadow-md">4321</span></div>
              <div className="flex flex-col items-center gap-1"><Bookmark className="w-8 h-8 fill-[#FACD00]/90 text-[#FACD00] drop-shadow-md" /><span className="text-[12px] font-semibold text-white drop-shadow-md">8.2K</span></div>
              <div className="flex flex-col items-center gap-1"><Share2 className="w-8 h-8 fill-white/90 drop-shadow-md" /><span className="text-[12px] font-semibold text-white drop-shadow-md">Share</span></div>
            </div>

            <div className="absolute bottom-[90px] left-0 right-[70px] px-3 z-20">
              <div className="font-bold text-[15px] mb-1 text-white drop-shadow-md">@{brandName.toLowerCase().replace(/\s/g, '')}</div>
              <div className="text-[14px] line-clamp-3 leading-snug text-white drop-shadow-md font-medium">{generatedContent}</div>
              <div className="font-bold text-[14px] mt-1 text-white drop-shadow-md">See translation</div>
              <div className="flex items-center gap-2 mt-3 text-[13px] font-semibold text-white drop-shadow-md">
                <Music className="w-4 h-4 animate-spin" /> <span>original sound - {brandName}</span>
              </div>
            </div>
            
            {/* TikTok Bottom Bar */}
            <div className="absolute bottom-0 inset-x-0 h-[70px] bg-black border-t border-white/20 flex justify-between items-center px-6 z-20 pb-4">
               <div className="flex flex-col items-center opacity-100"><Globe className="w-5 h-5 mb-1" /><span className="text-[10px]">Home</span></div>
               <div className="flex flex-col items-center opacity-60"><Users className="w-5 h-5 mb-1" /><span className="text-[10px]">Friends</span></div>
               <div className="w-11 h-7 bg-white rounded-xl flex items-center justify-center relative">
                  <div className="absolute -left-1 top-0 bottom-0 w-2 bg-[#20D5EC] rounded-l-xl -z-10" />
                  <div className="absolute -right-1 top-0 bottom-0 w-2 bg-[#FE2C55] rounded-r-xl -z-10" />
                  <PlusSquare className="w-4 h-4 text-black" />
               </div>
               <div className="flex flex-col items-center opacity-60"><MessageCircle className="w-5 h-5 mb-1" /><span className="text-[10px]">Inbox</span></div>
               <div className="flex flex-col items-center opacity-60"><div className="w-5 h-5 rounded-full border border-white/60 mb-1" /><span className="text-[10px]">Profile</span></div>
            </div>
          </div>
        );

      case 'LinkedIn':
        return (
          <div className="bg-[#E9E5DF] dark:bg-black h-full flex flex-col font-sans">
             {/* LI Header Navbar */}
             <div className="bg-white dark:bg-[#1D2226] px-3 py-2 flex justify-between items-center shadow-sm z-10 shrink-0">
                <div className="flex gap-3 items-center w-full">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"><ProfilePic size={8} /></div>
                  <div className="flex-1 bg-[#EEF3F8] dark:bg-[#38434F] rounded-md h-8 flex items-center px-3 gap-2">
                     <Search className="w-4 h-4 text-[#666666] dark:text-[#E9E5DF]" />
                     <span className="text-[13px] text-[#666666] dark:text-[#E9E5DF]">Search</span>
                  </div>
                  <MessageCircle className="w-6 h-6 text-[#666666] dark:text-[#E9E5DF]" />
                </div>
             </div>
            <div className="bg-white dark:bg-[#1D2226] flex-1 flex flex-col mt-2">
              <div className="px-4 py-3 flex items-start gap-3">
                <ProfilePic size={12} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px] text-black dark:text-white truncate">{brandName}</div>
                  <div className="text-[12px] text-[#666666] dark:text-[#E9E5DF] truncate">Marketing & Advertising • 1,234 followers</div>
                  <div className="text-[12px] text-[#666666] dark:text-[#E9E5DF] flex items-center gap-1">1h • <Globe className="w-3 h-3" /></div>
                </div>
                <div className="flex items-center gap-2 text-[#0A66C2] dark:text-[#70B5F9] font-semibold text-[14px]">
                  <PlusSquare className="w-4 h-4" /> Follow
                </div>
              </div>
              <div className="px-4 py-1 text-[14px] text-black dark:text-[#e9e9e9] whitespace-pre-wrap flex-1 overflow-y-auto no-scrollbar leading-relaxed">
                {generatedContent}
              </div>
              <div className="px-4 py-2 shrink-0">
                <div className="flex justify-between items-center text-[12px] text-[#666666] dark:text-[#E9E5DF] border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="flex items-center"><div className="bg-[#1485BD] rounded-full p-0.5 mr-1"><ThumbsUp className="w-2.5 h-2.5 fill-white text-white"/></div> 1,234</span>
                  <span>42 comments • 12 reposts</span>
                </div>
                <div className="flex justify-between text-[#666666] dark:text-[#E9E5DF] pt-2 pb-1">
                  <button className="flex flex-col items-center gap-1 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-1/4"><ThumbsUp className="w-5 h-5" /> <span className="text-[12px] font-semibold">Like</span></button>
                  <button className="flex flex-col items-center gap-1 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-1/4"><MessageCircle className="w-5 h-5" /> <span className="text-[12px] font-semibold">Comment</span></button>
                  <button className="flex flex-col items-center gap-1 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-1/4"><Share2 className="w-5 h-5" /> <span className="text-[12px] font-semibold">Repost</span></button>
                  <button className="flex flex-col items-center gap-1 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-1/4"><Send className="w-5 h-5 text-current transform -rotate-45" /> <span className="text-[12px] font-semibold">Send</span></button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Zalo':
        return (
          <div className="bg-[#E2E8F0] dark:bg-black h-full flex flex-col font-sans">
            <div className="bg-[#0068FF] text-white px-3 pt-4 pb-3 flex justify-between items-center shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <ArrowLeft className="w-6 h-6" />
                <div className="relative">
                   <div className="w-10 h-10 rounded-full bg-white text-[#0068FF] flex items-center justify-center font-bold text-sm border-2 border-white">{brandName.substring(0,2)}</div>
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0068FF]" />
                </div>
                <div>
                  <div className="font-bold text-[16px]">{brandName}</div>
                  <div className="text-[12px] opacity-80 mt-0.5">Vừa mới truy cập</div>
                </div>
              </div>
              <div className="flex gap-4">
                <Search className="w-6 h-6" />
                <Menu className="w-6 h-6" />
              </div>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-10 bg-[#E2E8F0] dark:bg-[#1E1E1E]">
              <div className="text-center text-[11px] font-bold text-slate-400 my-2 px-3 py-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-full self-center">10:45 Hôm nay</div>
              <div className="bg-white dark:bg-[#2C2C2C] rounded-[18px] overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-700 max-w-[88%] self-start relative">
                <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                  <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded text-[11px] font-semibold backdrop-blur-sm">Zalo Broadcast</div>
                </div>
                <div className="p-3.5 text-[15px] text-black dark:text-white whitespace-pre-wrap leading-relaxed">
                  {generatedContent}
                </div>
                <div className="p-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-center bg-slate-50 dark:bg-[#2C2C2C]">
                   <span className="text-[#0068FF] text-[15px] font-bold">Xem chi tiết</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#F3F4F6] dark:bg-[#2C2C2C] p-2 flex items-center gap-3 shrink-0 border-t border-slate-200 dark:border-slate-800 absolute bottom-0 inset-x-0 pb-6 z-20">
               <Smile className="w-6 h-6 text-slate-500" />
               <input type="text" placeholder="Tin nhắn..." className="flex-1 bg-white dark:bg-[#1E1E1E] rounded-full px-4 py-2 text-[15px] outline-none shadow-sm" disabled />
               <MoreHorizontal className="w-6 h-6 text-slate-500" />
               <Mic className="w-6 h-6 text-slate-500" />
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50 dark:bg-[#0B1120] relative">
      <div className="max-w-[1400px] mx-auto w-full h-full flex flex-col p-4 md:p-6 lg:p-8">
        <header className="shrink-0 mb-6 flex justify-between items-end">
          <div>
            <div className="page-badge bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Content Factory
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Content Automation</h1>
          </div>
        </header>

        {/* Responsive layout: Stack on mobile, side-by-side on lg desktop */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8 bg-transparent">
          
          {/* === COMPACT CONFIGURATION PANEL === */}
          <div className="lg:w-[450px] shrink-0 flex flex-col glassbox-card !p-5 shadow-sm border border-linear-border bg-white dark:bg-slate-900/60 z-10 h-full">
            <h2 className="text-base font-bold text-foreground flex items-center mb-4 shrink-0">
              <PenSquare className="w-4 h-4 mr-2 text-blue-500" /> Cấu hình Nội dung
            </h2>

            {/* Platform Selector (Compact Grid) */}
            <div className="grid grid-cols-5 gap-2 mb-4 shrink-0">
              {[
                { name: 'Facebook', icon: Users, color: 'text-blue-600' },
                { name: 'LinkedIn', icon: Briefcase, color: 'text-sky-700' },
                { name: 'TikTok', icon: Music, color: 'text-slate-900 dark:text-white' },
                { name: 'Instagram', icon: Heart, color: 'text-pink-600' },
                { name: 'Zalo', icon: MessageCircle, color: 'text-blue-500' },
              ].map((p) => (
                <button 
                  key={p.name} onClick={() => setPlatform(p.name)}
                  className={`flex flex-col items-center py-2 rounded-xl transition-all border ${
                    platform === p.name ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm ring-1 ring-blue-500' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <p.icon className={`w-4 h-4 mb-1 ${platform === p.name ? p.color : 'text-slate-400'}`} />
                  <span className={`text-[9px] font-bold ${platform === p.name ? 'text-foreground' : 'text-slate-500'}`}>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-200 dark:border-slate-700 mb-4 shrink-0">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center mb-2"><Sparkles className="w-3 h-3 mr-1"/> Trending & DNA</span>
              <div className="flex flex-wrap gap-2">
                {coreUsps.slice(0, 1).map((usp: string, idx: number) => (
                  <button key={`dna-${idx}`} onClick={() => setTopic(`Khẳng định: ${usp}`)} className="text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2.5 py-1.5 rounded-lg truncate max-w-[200px]">
                    {usp}
                  </button>
                ))}
                {trends.slice(0, 2).map((t_item, idx) => (
                  <button key={idx} onClick={() => setTopic(t_item)} className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 rounded-lg truncate max-w-[150px]">
                    #{t_item}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input - FLEX 1 to fill available space */}
            <div className="flex-1 flex flex-col mb-4 min-h-0">
              <textarea 
                value={topic} onChange={(e) => setTopic(e.target.value)}
                placeholder="Nhập chủ đề hoặc yêu cầu nội dung..."
                className="w-full h-full bg-slate-50 dark:bg-[#0B1120]/50 border border-linear-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner custom-scrollbar"
              />
            </div>

            {/* Tone Selector */}
            <div className="mb-4 shrink-0">
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-linear-border rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Chuyên nghiệp">Giọng điệu: Chuyên nghiệp</option>
                <option value="Hài hước, gần gũi">Giọng điệu: Gần gũi, Hài hước</option>
                <option value="Truyền cảm hứng">Giọng điệu: Truyền cảm hứng</option>
              </select>
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerate} disabled={!topic || isGenerating}
              className={`shrink-0 w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center transition-all ${
                topic && !isGenerating ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-md hover:shadow-lg' : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? "Đang xử lý..." : "Sinh Nội Dung (AI)"}
            </button>
          </div>

          {/* === RESULT PANEL: SMARTPHONE MOCKUP === */}
          <div className="flex-1 h-full flex flex-col items-center justify-center relative min-h-[700px] lg:min-h-0">
            <AnimatePresence mode="wait">
              {generatedContent ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full max-w-[370px] h-[780px] lg:h-full lg:max-h-[820px] flex flex-col py-2"
                >
                  {/* Phone Frame */}
                  <div className="relative bg-slate-800 dark:bg-black rounded-[3.5rem] p-[4px] shadow-2xl flex flex-col flex-1 min-h-0 ring-1 ring-white/10">
                    <div className="bg-white dark:bg-black rounded-[3.2rem] overflow-hidden flex flex-col h-full relative border-[4px] border-black dark:border-[#121212]">
                      
                      {/* Dynamic Island */}
                      <div className="absolute top-2 inset-x-0 h-7 bg-black rounded-full w-32 mx-auto z-50 flex justify-center items-center shadow-md">
                        <div className="w-12 h-1 bg-[#1a1a1a] rounded-full" />
                      </div>

                      {/* Status Bar Overlay */}
                      <div className={`absolute top-0 inset-x-0 px-7 pt-4 pb-1 flex justify-between items-center text-[12px] font-bold z-40 pointer-events-none ${platform === 'TikTok' ? 'text-white' : 'text-black dark:text-white'}`}>
                         <span>9:41</span>
                         <div className="flex items-center space-x-1.5 opacity-80">
                            <div className="w-4 h-3 flex items-end justify-between"><div className="w-0.5 h-1 bg-current"/><div className="w-0.5 h-1.5 bg-current"/><div className="w-0.5 h-2 bg-current"/><div className="w-0.5 h-2.5 bg-current"/></div>
                            <div className="w-4 h-2.5 rounded-sm border border-current flex items-center justify-end p-0.5"><div className="w-2.5 h-1.5 bg-current rounded-sm"/></div>
                         </div>
                      </div>

                      {/* NATIVE UI INJECTION */}
                      <div className={`flex-1 overflow-hidden relative w-full h-full pt-10 ${platform === 'TikTok' ? 'pt-0' : ''}`}>
                         {renderNativeUI()}
                      </div>

                      {/* Home Indicator */}
                      <div className={`absolute bottom-1 inset-x-0 w-full h-4 flex justify-center items-center z-40 pointer-events-none ${platform === 'TikTok' ? '' : 'bg-white dark:bg-black'}`}>
                         <div className={`w-1/3 h-[5px] rounded-full ${platform === 'TikTok' ? 'bg-white/50' : 'bg-black dark:bg-white/50'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Actions below phone */}
                  <div className="flex items-center gap-3 mt-4 shrink-0 px-2">
                    <button className="flex-1 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center transition-colors">
                      <Copy className="w-4 h-4 mr-2" /> Copy text
                    </button>
                    <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center transition-colors">
                      <Send className="w-4 h-4 mr-2" /> Đăng bài
                    </button>
                  </div>
                </motion.div>
              ) : isGenerating ? (
                /* Loading State inside Phone outline */
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center">
                   <div className="w-[370px] h-[780px] lg:h-[90%] border-[8px] border-cyan-500/20 rounded-[3.5rem] flex flex-col items-center justify-center relative bg-slate-50 dark:bg-slate-900/40 shadow-2xl backdrop-blur-sm">
                      <div className="absolute top-4 inset-x-0 h-7 bg-slate-200 dark:bg-slate-800 rounded-full w-32 mx-auto" />
                      <div className="px-10 w-full space-y-5">
                        {AI_STEPS.map((step, i) => (
                          <div key={i} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${i === loadingStep ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-sm scale-105' : i < loadingStep ? 'opacity-60' : 'opacity-30'}`}>
                            {i < loadingStep ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Sparkles className={`w-6 h-6 ${i === loadingStep ? 'text-cyan-500 animate-pulse' : 'text-slate-400'}`} />}
                            <span className={`text-sm font-bold ${i === loadingStep ? 'text-cyan-500' : 'text-slate-500 dark:text-slate-300'}`}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                </motion.div>
              ) : (
                /* Empty State */
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center max-w-sm h-full justify-center py-10">
                   <div className="w-[370px] h-[780px] lg:h-[90%] border-[8px] border-slate-200 dark:border-slate-800/80 rounded-[3.5rem] flex flex-col items-center justify-center relative bg-white dark:bg-[#0B1120]/40 shadow-xl">
                      <div className="absolute top-4 inset-x-0 h-7 bg-slate-100 dark:bg-slate-800 rounded-full w-32 mx-auto" />
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700">
                         <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="font-black text-lg text-foreground mb-2">Bản Xem Trước Trực Quan</h3>
                      <p className="text-sm text-slate-500 px-10 leading-relaxed">Nội dung sẽ hiển thị chính xác 100% theo chuẩn UI của {platform} tại đây.</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Required missing Lucide icons for native mockups
const X = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const Menu = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const Smile = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Mic = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
