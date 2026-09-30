"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, PenSquare, Palette, Share2, Calculator, CheckCircle2, Zap, ArrowRight, Activity, Smartphone, Hash, Heart, MessageCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

const mockDelays = {
  content: 1500,
  design: 1200,
  agent: 1800,
  tactics: 2000
};

export default function Phase3_Tactics({ onNext, onBack, globalBudget }: { onNext: () => void, onBack: () => void, globalBudget: string }) {
  const { language } = useLanguage();
  const [activePanel, setActivePanel] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState<Record<number, boolean>>({});

  const { brandDNA, wizardAnswers } = useFormStore();
  const isBepNhaMoc = brandDNA?.brand_name?.includes('Nhà Mộc') || wizardAnswers?.company_name?.includes('Nhà Mộc');

  const contentMock = isBepNhaMoc ? {
    headline: "CÓ NHỮNG NGÀY CHỈ THÈM MỘT BÁT CANH CUA RAU ĐAY...",
    body: "Thành phố dạo này hay đổ mưa chiều. Những lúc kẹt xe giữa dòng người hối hả, bạn có chợt thấy sống mũi cay cay khi nhớ về mùi khói bếp thân thuộc?\n\nỞ Bếp Nhà Mộc, chúng tôi không có những món sơn hào hải vị xa hoa. Chúng tôi chỉ có:\n✨ Nồi cá lóc kho tộ keo sệt, đậm đà vị mắm nhỉ.\n✨ Bát canh cua đồng nấu rau đay mồng tơi ngọt thanh, mát ruột.\n✨ Niêu cơm gạo lứt dẻo bùi, ủ ấm trong lớp lá chuối.",
    hashtags: "#BepNhaMoc #Comnha #ChuaLanh"
  } : {
    headline: "GIẢI PHÁP TỐI ƯU CHO DOANH NGHIỆP CỦA BẠN",
    body: "Khám phá cách dịch vụ của chúng tôi có thể giúp bạn tiết kiệm 40% chi phí vận hành trong khi vẫn duy trì chất lượng vượt trội.\n\nSứ mệnh của chúng tôi là mang lại giá trị bền vững cho khách hàng.",
    hashtags: "#BusinessGrowth #Optimize"
  };

  const designMock = isBepNhaMoc ? {
    primaryColors: ["#4A5D23", "#8B4513", "#F5DEB3"],
    archetype: "The Caregiver & The Innocent",
    keywords: ["Mộc mạc", "Ấm áp", "Chữa lành", "Di sản", "Xanh"]
  } : {
    primaryColors: ["#0EA5E9", "#1E293B", "#F8FAFC"],
    archetype: "The Innovator & The Sage",
    keywords: ["Hiện đại", "Tối giản", "Công nghệ", "Đột phá", "Tốc độ"]
  };

  const planMock = isBepNhaMoc ? [
    { name: "Zalo Mini App (Loyalty)", phase: "M1-M2", lead: "@TechLead", budget: "65,000,000đ", status: "Ready" },
    { name: "Hero Video: Mùi Khói Bếp", phase: "M1", lead: "@CreativeDir", budget: "50,000,000đ", status: "Drafting" },
    { name: "30 Lifestyle Micro-KOLs", phase: "M2-M3", lead: "@PRManager", budget: "100,000,000đ", status: "Planning" },
    { name: "Corporate Lunch Activation", phase: "M3", lead: "@GrowthHacker", budget: "30,000,000đ", status: "Queued" }
  ] : [
    { name: "Setup Omni-channel Hub", phase: "Month 1", lead: "@TechLead", budget: "30%", status: "Ready" },
    { name: "Produce Hero Video", phase: "Month 2", lead: "@CreativeDir", budget: "40%", status: "Drafting" },
    { name: "PR Articles Deployment", phase: "Month 3", lead: "@PRManager", budget: "30%", status: "Planning" }
  ];

  useEffect(() => {
    if (!hasGenerated[activePanel]) {
      setIsGenerating(true);
      const delay = activePanel === 0 ? mockDelays.content : activePanel === 1 ? mockDelays.design : activePanel === 2 ? mockDelays.agent : mockDelays.tactics;
      
      const timer = setTimeout(() => {
        setIsGenerating(false);
        setHasGenerated(prev => ({...prev, [activePanel]: true}));
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [activePanel]);

  const tabs = [
    { id: 0, title: "Content Lab", icon: PenSquare, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    { id: 1, title: "Design Studio", icon: Palette, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { id: 2, title: "Agent Persona", icon: Bot, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
    { id: 3, title: "Action Plan", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" }
  ];

  return (
    <div className="h-full w-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto z-10 relative overflow-hidden">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 shrink-0 gap-4">
        <div>
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Zap className="w-4 h-4 text-blue-400 animate-pulse mr-2" />
            <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Multi-Agent Engine</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 font-heading tracking-tight drop-shadow-sm">
            Tactical Execution Hub
          </h2>
          <p className="text-linear-text-muted mt-2 font-medium">Chiến thuật chi tiết được tự động xây dựng dựa trên kết quả Debate</p>
        </div>
        <button 
          id="btn-next-phase3" 
          onClick={onNext} 
          className="group relative px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center">
            Chuyển sang Execution <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex space-x-2 md:space-x-4 mb-6 shrink-0 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((tab) => {
          const isActive = activePanel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className={`
                flex items-center px-5 py-3 rounded-xl transition-all duration-300 whitespace-nowrap shrink-0 border
                ${isActive ? `glassbox-card ${tab.border} shadow-lg scale-105` : 'bg-linear-surface/30 border-transparent hover:bg-linear-surface/50 opacity-60 hover:opacity-100'}
              `}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${isActive ? tab.bg : 'bg-slate-800/50'}`}>
                <tab.icon className={`w-4 h-4 ${isActive ? tab.color : 'text-slate-400'}`} />
              </div>
              <span className={`font-bold ${isActive ? 'text-foreground' : 'text-slate-400'}`}>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── Dynamic Content Area ── */}
      <div className="flex-1 glassbox-card p-6 overflow-hidden relative flex flex-col border border-linear-border/30 bg-slate-900/40">
        <AnimatePresence mode="wait">
          
          {/* TAB 0: CONTENT LAB */}
          {activePanel === 0 && (
            <motion.div key="p0" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col relative">
              <div className="absolute top-0 right-0 flex items-center text-pink-400/80 text-xs font-bold tracking-widest uppercase bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20 z-10">
                <PenSquare className="w-3 h-3 mr-2" /> ContentStrategist Active
              </div>
              
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-pink-500 animate-spin mb-4" />
                  <p className="text-pink-400 font-bold tracking-widest uppercase text-sm animate-pulse">Generating Social Copy...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full pt-8">
                  {/* Left: AI Generation View */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500" /> AI Draft
                    </h3>
                    <div className="glassbox-card !p-6 flex-1 bg-slate-900/60 border-pink-500/20 shadow-lg shadow-pink-500/5">
                      <h4 className="text-xl font-bold text-white mb-4 leading-snug">{contentMock.headline}</h4>
                      <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{contentMock.body}</div>
                      <div className="mt-4 text-pink-400 font-medium text-sm">{contentMock.hashtags}</div>
                    </div>
                  </div>

                  {/* Right: Social Mockup */}
                  <div className="flex flex-col gap-4 items-center justify-center h-full">
                    <div className="w-full max-w-sm rounded-3xl bg-white overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
                      <div className="p-4 border-b flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                           {brandDNA?.logo_url && <img src={brandDNA.logo_url} className="w-full h-full object-cover" alt="Logo" />}
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold text-sm">{isBepNhaMoc ? 'Bếp Nhà Mộc' : 'Brand Name'}</p>
                          <p className="text-slate-500 text-xs">Sponsored</p>
                        </div>
                      </div>
                      <div className="p-4 text-slate-800 text-sm whitespace-pre-wrap">
                        <span className="font-bold">{contentMock.headline}</span>{"\n\n"}
                        {contentMock.body.length > 100 ? contentMock.body.substring(0, 100) + '...' : contentMock.body}
                        <span className="text-blue-600 block mt-1">{contentMock.hashtags}</span>
                      </div>
                      <div className="w-full aspect-video bg-slate-100 flex items-center justify-center border-y">
                        <Palette className="w-10 h-10 text-slate-300" />
                      </div>
                      <div className="p-3 flex justify-between items-center bg-slate-50">
                        <div className="flex gap-4">
                          <Heart className="w-5 h-5 text-slate-600" />
                          <MessageCircle className="w-5 h-5 text-slate-600" />
                          <Share2 className="w-5 h-5 text-slate-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 1: DESIGN STUDIO */}
          {activePanel === 1 && (
            <motion.div key="p1" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col relative">
              <div className="absolute top-0 right-0 flex items-center text-purple-400/80 text-xs font-bold tracking-widest uppercase bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 z-10">
                <Palette className="w-3 h-3 mr-2" /> BrandDesigner Active
              </div>
              
              {isGenerating ? (
                 <div className="flex-1 flex flex-col items-center justify-center">
                   <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mb-4" />
                   <p className="text-purple-400 font-bold tracking-widest uppercase text-sm animate-pulse">Extracting Brand DNA...</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full pt-8">
                  {/* Left: Colors & Typography */}
                  <div className="flex flex-col gap-6">
                    <div className="glassbox-card !p-6 flex-1 bg-slate-900/60 border-purple-500/20 shadow-lg shadow-purple-500/5">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" /> Brand Palette
                      </h3>
                      <div className="flex gap-4">
                        {designMock.primaryColors.map((color, i) => (
                          <motion.div 
                            key={i} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: i * 0.1}}
                            className="flex-1 flex flex-col group"
                          >
                            <div 
                              className="w-full aspect-square rounded-2xl shadow-lg border border-white/10 transition-transform group-hover:-translate-y-2 relative overflow-hidden" 
                              style={{backgroundColor: color}}
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                            </div>
                            <span className="text-xs font-bold mt-3 text-slate-300 text-center uppercase tracking-wider">{color}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="glassbox-card !p-6 flex-1 flex flex-col justify-center items-center text-center bg-slate-900/60 border-purple-500/20">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Archetype DNA</h3>
                      <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-heading">
                        {designMock.archetype}
                      </div>
                    </div>
                  </div>

                  {/* Right: Moodboard Keywords */}
                  <div className="glassbox-card !p-6 h-full flex flex-col bg-slate-900/60 border-purple-500/20">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500" /> Vibe & Keywords
                    </h3>
                    <div className="flex flex-wrap gap-3 content-start">
                      {designMock.keywords.map((kw, i) => (
                        <motion.span 
                          key={i} initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}} transition={{delay: i * 0.05}}
                          className="px-5 py-2.5 bg-slate-800 rounded-xl text-sm font-bold text-slate-200 border border-slate-700 shadow-sm hover:border-purple-500/50 transition-colors"
                        >
                          #{kw}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: AGENT PERSONA */}
          {activePanel === 2 && (
            <motion.div key="p2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center relative">
              {isGenerating ? (
                 <div className="flex-1 flex flex-col items-center justify-center w-full h-full">
                   <div className="w-24 h-24 relative mb-6">
                      <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
                      <Bot className="w-12 h-12 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                   </div>
                   <div className="w-64 bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                      <motion.div initial={{width: "0%"}} animate={{width: "100%"}} transition={{duration: mockDelays.agent/1000, ease: "linear"}} className="h-full bg-cyan-500"></motion.div>
                   </div>
                   <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm">Injecting Brand Persona...</p>
                 </div>
              ) : (
                <>
                 <div className="relative w-48 h-48 mb-10">
                   <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[40px] animate-pulse" />
                   <motion.div animate={{rotate:360}} transition={{duration:20, repeat:Infinity, ease:"linear"}} className="absolute inset-0 border border-dashed border-cyan-500/40 rounded-full" />
                   <motion.div animate={{rotate:-360}} transition={{duration:30, repeat:Infinity, ease:"linear"}} className="absolute inset-4 border border-blue-400/20 rounded-full" />
                   <div className="absolute inset-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                     <Bot className="w-12 h-12 text-cyan-400" />
                   </div>
                 </div>
                 
                 <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 font-heading text-center">
                   {isBepNhaMoc ? "Bếp Nhà Mộc Agent Activated" : "Brand Agent Activated"}
                 </h3>
                 
                 <div className="glassbox-card !p-6 max-w-xl text-center bg-slate-900/60 border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                   <p className="text-slate-300 leading-relaxed font-medium">
                     {isBepNhaMoc 
                       ? "Persona injected. Tone & Manner: \"Tâm tình, thủ thỉ, chân thành, dùng từ ngữ mang đậm chất văn học và hoài niệm.\" Ready for tasks." 
                       : "Persona injected. Tone & Manner configured. Ready for tasks."}
                   </p>
                 </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB 3: ACTION PLAN */}
          {activePanel === 3 && (
            <motion.div key="p3" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col relative">
              <div className="absolute top-0 right-0 flex items-center text-emerald-400/80 text-xs font-bold tracking-widest uppercase bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 z-10">
                <Activity className="w-3 h-3 mr-2" /> Task Engine Active
              </div>
              
              {isGenerating ? (
                 <div className="flex-1 flex flex-col items-center justify-center">
                   <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                   <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm animate-pulse">Compiling Tactical Plan...</p>
                 </div>
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mt-8">
                  <div className="space-y-4">
                    {planMock.map((task, i) => (
                      <motion.div 
                        initial={{x: -20, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: i * 0.1}}
                        key={i} className="glassbox-card !p-4 hover:border-emerald-500/40 transition-colors group bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100 mb-1">{task.name}</h4>
                            <div className="flex gap-3 text-xs text-slate-400">
                              <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> {task.phase}</span>
                              <span className="flex items-center"><Bot className="w-3 h-3 mr-1" /> {task.lead}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 sm:justify-end">
                           <div className="text-right">
                             <div className="text-xs text-slate-500 mb-1">Allocated Budget</div>
                             <div className="font-bold text-emerald-400">{task.budget}</div>
                           </div>
                           <div className={`px-3 py-1 text-xs font-bold rounded-full border ${task.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : task.status === 'Drafting' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                             {task.status}
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
