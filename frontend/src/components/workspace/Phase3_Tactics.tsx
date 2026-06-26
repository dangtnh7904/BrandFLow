"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, PenSquare, Palette, Share2, Calculator, CheckCircle2, Zap, ArrowRight, Activity, Terminal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

export default function Phase3_Tactics({ onNext, onBack, globalBudget }: { onNext: () => void, onBack: () => void, globalBudget: string }) {
  const { language } = useLanguage();
  const [activePanel, setActivePanel] = useState(0); // 0: Content, 1: Design, 2: Agent, 3: Tactics
  const [typedText, setTypedText] = useState("");

  const { brandDNA, wizardAnswers } = useFormStore();
  const isBepNhaMoc = brandDNA?.brand_name?.includes('Nhà Mộc') || wizardAnswers?.company_name?.includes('Nhà Mộc');

  const contentMock = isBepNhaMoc ? {
    headline: "CÓ NHỮNG NGÀY CHỈ THÈM MỘT BÁT CANH CUA RAU ĐAY...",
    body: "Thành phố dạo này hay đổ mưa chiều. Những lúc kẹt xe giữa dòng người hối hả, bạn có chợt thấy sống mũi cay cay khi nhớ về mùi khói bếp thân thuộc?\n\nỞ Bếp Nhà Mộc, chúng tôi không có những món sơn hào hải vị xa hoa. Chúng tôi chỉ có:\n✨ Nồi cá lóc kho tộ keo sệt, đậm đà vị mắm nhỉ.\n✨ Bát canh cua đồng nấu rau đay mồng tơi ngọt thanh, mát ruột.\n✨ Niêu cơm gạo lứt dẻo bùi, ủ ấm trong lớp lá chuối.\n\nHôm nay, gác lại những bộn bề, mời bạn ghé Bếp, ngồi xuống chiếc ghế gỗ sờn, nghe một bản nhạc Trịnh và thưởng thức mâm cơm 'như mẹ nấu'.",
    tiktok: "Góc quay POV mở cánh cửa gỗ bước vào quán. Ánh sáng vàng ấm, không gian ngập tràn cây xanh và đồ gốm.\nVoiceover: Níu Sài Gòn làm bạn mệt quá, thì đây là nơi mình thường đến để trốn."
  } : {
    headline: "GIẢI PHÁP TỐI ƯU CHO DOANH NGHIỆP CỦA BẠN",
    body: "Khám phá cách dịch vụ của chúng tôi có thể giúp bạn tiết kiệm 40% chi phí vận hành trong khi vẫn duy trì chất lượng vượt trội.\n\nSứ mệnh của chúng tôi là mang lại giá trị bền vững cho khách hàng.",
    tiktok: "Video hướng dẫn nhanh cách sử dụng sản phẩm."
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

  // Typing effect for Content Lab
  useEffect(() => {
    if (activePanel === 0) {
      const fullText = contentMock.headline + "\n\n" + contentMock.body;
      let i = 0;
      setTypedText("");
      const interval = setInterval(() => {
        setTypedText(prev => prev + fullText.charAt(i));
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [activePanel]);

  // Auto transition for demo purposes
  useEffect(() => {
    if (window && (window as any).__DEMO_MODE__) {
      const timers = [
        setTimeout(() => setActivePanel(1), 500), // Switch to Design after 500ms
        setTimeout(() => setActivePanel(2), 900), // Switch to Agent after 900ms
        setTimeout(() => setActivePanel(3), 1300), // Switch to Tactics after 1300ms
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, []);


  const tabs = [
    { id: 0, title: "Content Lab", icon: PenSquare, color: "text-pink-500" },
    { id: 1, title: "Design Studio", icon: Palette, color: "text-purple-500" },
    { id: 2, title: "Personal Agent", icon: Bot, color: "text-cyan-500" },
    { id: 3, title: "Tactics & Gantt", icon: Activity, color: "text-emerald-500" }
  ];

  return (
    <div className="h-full w-full flex flex-col p-6 max-w-7xl mx-auto z-10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Tactical Execution Hub
          </h2>
          <p className="text-linear-text-muted mt-1">Hệ thống Multi-Agent đang tự động xây dựng toàn bộ tài nguyên</p>
        </div>
        <button id="btn-next-phase3" onClick={onNext} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center transition-all shadow-lg shadow-blue-500/20">
          Chuyển sang Execution <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex items-center px-4 py-2 rounded-xl transition-all ${activePanel === tab.id ? 'bg-linear-surface border border-slate-600 shadow-md' : 'opacity-50 hover:opacity-100'}`}
          >
            <tab.icon className={`w-5 h-5 mr-2 ${tab.color}`} />
            <span className="font-semibold text-foreground">{tab.title}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 bg-linear-surface/40 backdrop-blur-md border border-linear-border rounded-3xl p-6 overflow-hidden relative shadow-2xl">
        <AnimatePresence mode="wait">
          {activePanel === 0 && (
            <motion.div key="p0" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full flex flex-col">
              <div className="flex items-center mb-4 text-pink-400 font-mono text-sm">
                <Terminal className="w-4 h-4 mr-2" /> [Agent: ContentStrategist] & [Agent: Copywriter] generating...
              </div>
              <div className="flex-1 bg-black/40 border border-slate-800 rounded-xl p-6 overflow-y-auto font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {typedText}<span className="animate-pulse">_</span>
              </div>
            </motion.div>
          )}

          {activePanel === 1 && (
            <motion.div key="p1" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full">
              <div className="flex items-center mb-6 text-purple-400 font-mono text-sm">
                <Terminal className="w-4 h-4 mr-2" /> [Agent: BrandDesigner] establishing visual identity...
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Primary Colors</h3>
                    <div className="flex space-x-4">
                      {designMock.primaryColors.map((color, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl shadow-lg border border-slate-700" style={{backgroundColor: color}} />
                          <span className="text-xs font-mono mt-2 text-slate-400">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Brand Archetype</h3>
                    <div className="px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300 font-semibold">
                      {designMock.archetype}
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 border border-slate-800 rounded-xl p-6 flex flex-wrap gap-2 content-start">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 w-full">Moodboard Keywords</h3>
                  {designMock.keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700">{kw}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === 2 && (
            <motion.div key="p2" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} className="h-full flex flex-col items-center justify-center">
               <div className="relative w-48 h-48 mb-8">
                 <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[40px] animate-pulse" />
                 <motion.div animate={{rotate:360}} transition={{duration:10, repeat:Infinity, ease:"linear"}} className="absolute inset-0 border-[4px] border-dashed border-cyan-500/50 rounded-full" />
                 <motion.div animate={{rotate:-360}} transition={{duration:15, repeat:Infinity, ease:"linear"}} className="absolute inset-4 border-[2px] border-blue-500/50 rounded-full" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Bot className="w-16 h-16 text-cyan-400" />
                 </div>
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">{isBepNhaMoc ? "Bếp Nhà Mộc Agent Activated" : "Brand Agent Activated"}</h3>
               <p className="text-slate-400 font-mono max-w-lg text-center">{isBepNhaMoc ? "Persona injected. Tone & Manner: \"Tâm tình, thủ thỉ, chân thành, dùng từ ngữ mang đậm chất văn học và hoài niệm.\" Ready for tasks." : "Persona injected. Tone & Manner configured. Ready for tasks."}</p>
            </motion.div>
          )}

          {activePanel === 3 && (
            <motion.div key="p3" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full flex flex-col">
              <div className="flex items-center mb-6 text-emerald-400 font-mono text-sm">
                <Terminal className="w-4 h-4 mr-2" /> [Agent: CMO & CFO] finalizing deployment tactics...
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                {isBepNhaMoc ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-900/50 text-[10px] uppercase tracking-widest text-emerald-500/70">
                        <th className="pb-2 font-medium">Initiative</th>
                        <th className="pb-2 font-medium text-center">Timeline</th>
                        <th className="pb-2 font-medium">Lead Agent</th>
                        <th className="pb-2 font-medium text-right">Budget</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-emerald-900/20">
                        <td className="py-3 text-emerald-100 flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Zalo Mini App (O2O Loyalty)</td>
                        <td className="py-3 text-center"><span className="px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 text-xs font-mono">M1-M2</span></td>
                        <td className="py-3 text-emerald-400 font-mono text-xs">@TechLead</td>
                        <td className="py-3 text-right text-emerald-100 font-mono">65M</td>
                      </tr>
                      <tr className="border-b border-emerald-900/20">
                        <td className="py-3 text-emerald-100 flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Hero Video: Mùi Khói Bếp</td>
                        <td className="py-3 text-center"><span className="px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 text-xs font-mono">M1</span></td>
                        <td className="py-3 text-emerald-400 font-mono text-xs">@CreativeDir</td>
                        <td className="py-3 text-right text-emerald-100 font-mono">50M</td>
                      </tr>
                      <tr className="border-b border-emerald-900/20">
                        <td className="py-3 text-emerald-100 flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> 30 Lifestyle Micro-KOLs</td>
                        <td className="py-3 text-center"><span className="px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 text-xs font-mono">M2-M3</span></td>
                        <td className="py-3 text-emerald-400 font-mono text-xs">@PRManager</td>
                        <td className="py-3 text-right text-emerald-100 font-mono">100M</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-emerald-100 flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> Corporate Lunch Activation</td>
                        <td className="py-3 text-center"><span className="px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 text-xs font-mono">M3</span></td>
                        <td className="py-3 text-emerald-400 font-mono text-xs">@GrowthHacker</td>
                        <td className="py-3 text-right text-emerald-100 font-mono">30M</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="space-y-4">
                    {['Setup Omni-channel Marketing Hub', 'Produce Hero Launch Video', 'Deploy Initial PR Articles'].map((task, i) => (
                      <div key={i} className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" />
                          <span className="font-semibold text-slate-200">{task}</span>
                        </div>
                        <span className="text-sm font-mono text-emerald-400">Month {i+1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
