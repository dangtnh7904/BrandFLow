"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, XCircle, AlertTriangle, FileText, ArrowLeft, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function Phase2_Debate({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const activeDebate = language === 'vi' ? MOCK_DEBATE_VI : MOCK_DEBATE_EN;
    let i = 0;
    const interval = setInterval(() => {
      if (i < activeDebate.length) {
        setMessages(prev => [...prev, activeDebate[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsLocked(true), 1500);
      }
    }, 1200); // Slightly slower, calmer
    return () => clearInterval(interval);
  }, [language]);

  const getAgentTheme = (agent: string, type: string) => {
    if (type === 'warning') return { bg: 'bg-red-50 dark:bg-red-500/10 backdrop-blur-md', border: 'border-red-200 dark:border-red-500/30', text: 'text-red-700 dark:text-red-400', iconBg: 'bg-red-100 dark:bg-red-500/20' };
    if (agent === 'CMO') return { bg: 'bg-blue-50 dark:bg-blue-500/10 backdrop-blur-md', border: 'border-blue-200 dark:border-blue-500/30', text: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-100 dark:bg-blue-500/20' };
    if (agent === 'Customer') return { bg: 'bg-cyan-50 dark:bg-cyan-500/10 backdrop-blur-md', border: 'border-cyan-200 dark:border-cyan-500/30', text: 'text-cyan-700 dark:text-cyan-300', iconBg: 'bg-cyan-100 dark:bg-cyan-500/20' };
    if (agent === 'CFO') return { bg: 'bg-orange-50 dark:bg-orange-500/10 backdrop-blur-md', border: 'border-orange-200 dark:border-orange-500/30', text: 'text-orange-700 dark:text-orange-300', iconBg: 'bg-orange-100 dark:bg-orange-500/20' };
    return { bg: 'bg-linear-surface dark:bg-slate-800/40 backdrop-blur-md', border: 'border-linear-border', text: 'text-foreground', iconBg: 'bg-linear-surface/50 border border-linear-border dark:bg-slate-800/50' };
  };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case 'rejected':
        return <span className="flex items-center text-[10px] uppercase font-bold text-red-600 bg-red-100/50 dark:bg-red-900/30 px-2 py-1 rounded-md ml-3 border border-red-200 dark:border-red-800/50"><XCircle className="w-3 h-3 mr-1" /> {t('workspace_phase2.rejected' as any) as string}</span>;
      case 'warning':
        return (
          <span className="flex items-center text-[10px] uppercase font-bold text-orange-600 bg-orange-100/50 dark:bg-orange-900/30 px-3 py-1 rounded-md ml-3 border border-orange-200 dark:border-orange-800/50">
            <AlertTriangle className="w-3 h-3 mr-1" /> {t('workspace_phase2.warning' as any) as string}
          </span>
        );
      case 'approved':
        return <span className="flex items-center text-[10px] uppercase font-bold text-cyan-600 bg-cyan-100/50 dark:bg-cyan-900/30 px-2 py-1 rounded-md ml-3 border border-cyan-200 dark:border-cyan-800/50"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('workspace_phase2.approved' as any) as string}</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto relative bg-transparent">
      <div className="flex flex-col p-8 max-w-4xl mx-auto w-full min-h-full">
        <button onClick={onBack} className="absolute left-8 top-8 text-linear-text-muted hover:text-foreground transition-colors flex items-center text-sm font-semibold bento-card !py-2 !px-4 !rounded-lg !shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="mb-12 text-center mt-8">
          <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="inline-flex items-center justify-center p-3 rounded-2xl bg-linear-surface border border-linear-border mb-6 shadow-xl">
            <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
          </motion.div>
          <h2 className="text-3xl font-bold text-foreground mb-3 font-heading tracking-tight">{t('workspace_phase2.title' as any) as string}</h2>
          <p className="text-linear-text-muted font-medium max-w-2xl mx-auto">{t('workspace_phase2.desc' as any) as string}</p>
        </div>

        {!isLocked ? (
          <div className="space-y-6 mb-24 relative">
            {/* Animated SVG Neural Data Line */}
            <div className="absolute left-[39px] top-6 bottom-10 w-0.5 z-0 flex justify-center">
              <div className="w-full h-full bg-linear-border rounded-full opacity-50 absolute"></div>
              <motion.div 
               className="w-1 h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent absolute top-0 rounded-full blur-[1px]"
               animate={{ top: ['0%', '100%'] }}
               transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
              />
            </div>

            {messages.map((msg, idx) => {
              if (!msg) return null;
              const theme = getAgentTheme(msg.agent, msg.type);
              const isWarning = msg.type === 'warning';

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  key={idx} 
                  className="relative z-10 flex ml-4 pr-4 group"
                >
                  {/* Agent Icon Node with glowing dot */}
                  <div className="relative">
                    <div className={`w-12 h-12 shrink-0 rounded-xl ${theme.iconBg} border border-linear-border flex items-center justify-center mr-6 shadow-md relative z-10 backdrop-blur-md`}>
                      <Bot className={`w-6 h-6 ${theme.text}`} />
                    </div>
                    {/* Node connection pip */}
                    <div className={`absolute top-1/2 -left-4 w-4 h-[2px] ${theme.border} z-0`}></div>
                  </div>

                  {/* Agent Persona Card - Bento Style */}
                  <div className={`flex-1 p-5 rounded-2xl border ${theme.border} ${theme.bg} shadow-sm relative transition-all duration-300 hover:shadow-md`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className={`text-sm font-black tracking-wide uppercase ${theme.text} flex items-center`}>
                          <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse opacity-70"></span>
                          {msg.agent} Agent
                        </span>
                        {getStatusBadge(msg.type)}
                      </div>
                      <span className="text-[10px] text-linear-text-muted font-mono">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                    </div>
                    <p className="text-foreground text-[15px] leading-relaxed font-medium">{msg.text}</p>
                    {isWarning && (
                       <div className="absolute inset-0 border border-orange-500/50 rounded-2xl animate-pulse pointer-events-none"></div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            
            {messages.length < (language === 'vi' ? MOCK_DEBATE_VI.length : MOCK_DEBATE_EN.length) && (
              <div className="relative z-10 flex ml-4 pr-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-linear-surface border border-linear-border flex items-center justify-center mr-6">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-cyan-500" 
                  />
                </div>
                <div className="text-cyan-500 text-sm flex items-center font-bold tracking-widest uppercase">
                  {t('workspace_phase2.analyzing' as any) as string}
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bento-card text-center py-16 relative overflow-hidden mt-6 border-cyan-500/30"
          >
            {/* Ambient Tech Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto rounded-2xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center mb-6 backdrop-blur-md"
            >
              <FileText className="w-10 h-10 text-cyan-400" />
            </motion.div>
            
            <h3 className="text-3xl font-black text-foreground mb-4 font-heading">{t('workspace_phase2.locked_title' as any) as string}</h3>
            <p className="text-linear-text-muted max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              {t('workspace_phase2.locked_desc' as any) as string}
            </p>
            
            <button 
              onClick={onNext}
              className="px-10 py-4 rounded-xl gradient-ai-bg font-bold shadow-xl hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center mx-auto"
            >
              Cấp Quyền Thực Thi Chiến Lược
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
