"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, XCircle, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';

const MOCK_DEBATE_EN = [
  { agent: 'CMO', type: 'proposal', text: "Strategy Proposal: Boost Branding on LinkedIn and Youtube Ads. Budget allocation: 40% LinkedIn expert content, 60% Youtube." },
  { agent: 'Customer', type: 'rejected', text: "Customer insights show C-level execs rarely watch Youtube. Focus 70% on LinkedIn InMail and Industry Whitepapers." },
  { agent: 'CMO', type: 'proposal', text: "Agreed. Pivoting to 70% LinkedIn Whitepapers, 30% Google Search Ads (AEO) for deep conversions." },
  { agent: 'CFO', type: 'warning', text: "Google Search Ads (AEO) CPC is exceptionally high, exceeding the 5% threshold of our $100k budget. Recommend lowering bids or relying on long-term SEO." },
  { agent: 'CMO', type: 'proposal', text: "Revising matrix. Keeping Organic SEO/AEO (10%), 70% LinkedIn Ads, 20% Contingency fund." },
  { agent: 'Customer', type: 'approved', text: "Allocation is logical, aligns perfectly with B2B behavioral patterns." },
  { agent: 'CFO', type: 'approved', text: "Budget is secure, risk coefficient is fully covered." }
];

const MOCK_DEBATE_VI = [
  { agent: 'CMO', type: 'proposal', text: "Đề xuất Chiến lược: Đẩy mạnh Branding trên LinkedIn và Youtube Ads. Ngân sách phân bổ: 40% LinkedIn nội dung chuyên gia, 60% Youtube." },
  { agent: 'Customer', type: 'rejected', text: "Insights khách hàng cho thấy C-level ít thời gian xem Youtube. Tập trung 70% vào LinkedIn InMail và Báo cáo chuyên ngành (Whitepapers)." },
  { agent: 'CMO', type: 'proposal', text: "Đồng ý điều chỉnh. Chuyển sang 70% LinkedIn Whitepapers, 30% Google Search Ads (AEO) đánh từ khóa chuyển đổi sâu." },
  { agent: 'CFO', type: 'warning', text: "Chi phí Google Search Ads (AEO) hiện tại rất cao, vượt ngưỡng cho phép 5% của ngân sách 100tr. Đề xuất giảm thầu hoặc dùng SEO dài hạn." },
  { agent: 'CMO', type: 'proposal', text: "Đã rà soát lại. Giữ SEO/AEO tự nhiên (10%), 70% LinkedIn Ads, 20% Dự phòng (Contingency)." },
  { agent: 'Customer', type: 'approved', text: "Phân bổ hợp lý, tiếp cận đúng hành vi B2B." },
  { agent: 'CFO', type: 'approved', text: "Ngân sách an toàn, hệ số rủi ro đã được cover." }
];

import { useLanguage } from '@/contexts/LanguageContext';

export default function Phase2_Debate({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Simulate live debate streaming
    const activeDebate = language === 'vi' ? MOCK_DEBATE_VI : MOCK_DEBATE_EN;
    let i = 0;
    const interval = setInterval(() => {
      if (i < activeDebate.length) {
        setMessages(prev => {
          const newArray = [...prev, activeDebate[i]];
          // Keep it to only the current mock debate source
          return newArray;
        });
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsLocked(true), 1500);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAgentTheme = (agent: string, type: string) => {
    if (type === 'warning') return { bg: 'bg-white', border: 'border-red-500', text: 'text-red-700', iconBg: 'bg-red-100', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' };
    if (agent === 'CMO') return { bg: 'bg-white', border: 'border-purple-300', text: 'text-purple-800', iconBg: 'bg-purple-100', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' };
    if (agent === 'Customer') return { bg: 'bg-white', border: 'border-blue-300', text: 'text-blue-800', iconBg: 'bg-blue-100', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' };
    if (agent === 'CFO') return { bg: 'bg-white', border: 'border-orange-300', text: 'text-orange-800', iconBg: 'bg-orange-100', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' };
    return { bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-800', iconBg: 'bg-slate-100', glow: '' };
  };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case 'rejected':
        return <span className="flex items-center text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md ml-3 border border-red-200"><XCircle className="w-3 h-3 mr-1" /> {t('workspace_phase2.rejected' as any) as string}</span>;
      case 'warning':
        return (
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center text-[10px] uppercase font-bold text-white bg-red-500 px-3 py-1 rounded-md ml-3 shadow-md"
          >
            <AlertTriangle className="w-3 h-3 mr-1" /> {t('workspace_phase2.warning' as any) as string}
          </motion.span>
        );
      case 'approved':
        return <span className="flex items-center text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md ml-3 border border-blue-200"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('workspace_phase2.approved' as any) as string}</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto relative bg-slate-50">
      <div className="flex flex-col p-8 max-w-4xl mx-auto w-full min-h-full">
      <button onClick={onBack} className="absolute left-8 top-8 text-slate-500 hover:text-slate-800 transition-colors flex items-center text-sm font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
         <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="mb-10 text-center mt-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('workspace_phase2.title' as any) as string}</h2>
        <p className="text-slate-600 font-medium max-w-2xl mx-auto">{t('workspace_phase2.desc' as any) as string}</p>
      </div>

      {!isLocked ? (
        <div className="space-y-6 mb-24 relative">
          {/* Vertical connection line */}
          <div className="absolute left-[39px] top-4 bottom-10 w-0.5 bg-slate-200 z-0"></div>

          {messages.map((msg, idx) => {
            if (!msg) return null;
            const isLatest = idx === messages.length - 1;
            const theme = getAgentTheme(msg.agent, msg.type);
            const isWarning = msg.type === 'warning';

            return (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isWarning 
                  ? { opacity: 1, y: 0, scale: 1, boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.6)', '0 0 5px rgba(239,68,68,0.2)'] }
                  : { opacity: 1, y: 0, scale: 1, boxShadow: isLatest ? ['0 0 0px rgba(0,0,0,0)', theme.glow.replace('shadow-', '').replace('[','').replace(']','') || '0 0 0px rgba(0,0,0,0)', '0 0 0px rgba(0,0,0,0)'] : '0 0 0px rgba(0,0,0,0)' }
                }
                transition={isWarning 
                  ? { duration: 0.8, repeat: Infinity, repeatType: 'reverse' }
                  : { duration: 1.5, repeat: isLatest ? Infinity : 0 }
                }
                key={idx} 
                className={`relative z-10 flex ml-4 pr-4`}
              >
                {/* Agent Icon Node */}
                <div className={`w-12 h-12 shrink-0 rounded-xl ${theme.iconBg} border-2 ${theme.border} flex items-center justify-center mr-6 shadow-sm`}>
                   <Bot className={`w-6 h-6 ${theme.text}`} />
                </div>

                {/* Agent Persona Card */}
                <div className={`flex-1 p-5 rounded-2xl border-2 ${theme.border} ${theme.bg} shadow-sm relative`}>
                  {/* Speech arrow pointer */}
                  <div className={`absolute top-4 -left-[9px] w-4 h-4 ${theme.bg} border-l-2 border-b-2 ${theme.border} transform rotate-45`}></div>
                  
                  <div className="flex items-center mb-3">
                    <span className={`text-sm font-black tracking-wide uppercase ${theme.text}`}>
                      {msg.agent} Agent
                    </span>
                    {getStatusBadge(msg.type)}
                  </div>
                  <p className="text-slate-700 text-[15px] leading-relaxed font-medium">{msg.text}</p>
                </div>
              </motion.div>
            );
          })}
          {messages.length < (language === 'vi' ? MOCK_DEBATE_VI.length : MOCK_DEBATE_EN.length) && (
            <div className="relative z-10 flex ml-4 pr-4">
               <div className="w-12 h-12 shrink-0 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center mr-6 animate-pulse">
                   <div className="w-2 h-2 rounded-full bg-slate-400"></div>
               </div>
               <div className="text-slate-500 text-sm flex items-center font-bold animate-pulse pb-10">
                 {t('workspace_phase2.analyzing' as any) as string}
               </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-card border-blue-200 text-center py-20 bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden shadow-lg mt-10"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <FileText className="w-20 h-20 mx-auto text-blue-600 mb-6 drop-shadow-sm" />
          <h3 className="text-3xl font-black text-slate-800 mb-4">{t('workspace_phase2.locked_title' as any) as string}</h3>
          <p className="text-slate-700 max-w-xl mx-auto mb-10 text-lg leading-relaxed font-bold">
            {t('workspace_phase2.locked_desc' as any) as string}
          </p>
          <button 
             onClick={onNext}
             className="px-10 py-4 rounded-xl gradient-ai-bg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 text-lg"
          >
             {t('workspace_phase2.proceed' as any) as string}
          </button>
        </motion.div>
      )}
      </div>
    </div>
  );
}
