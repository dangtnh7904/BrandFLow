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
  const { language } = useLanguage();
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

  const getAgentColor = (agent: string) => {
    if (agent === 'CMO') return 'text-purple-700 bg-purple-50 border-purple-200';
    if (agent === 'Customer') return 'text-blue-700 bg-blue-50 border-blue-200';
    if (agent === 'CFO') return 'text-orange-700 bg-orange-50 border-orange-200';
  };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case 'rejected':
        return <span className="flex items-center text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded ml-3 border border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejected - Misaligned Insight</span>;
      case 'warning':
        return <span className="flex items-center text-[10px] uppercase font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded ml-3 border border-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" /> Warning - High Cost</span>;
      case 'approved':
        return <span className="flex items-center text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-3 border border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-8 max-w-4xl mx-auto w-full relative">
      <button onClick={onBack} className="absolute left-8 top-8 text-slate-500 hover:text-slate-800 transition-colors flex items-center text-sm">
         <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
      </button>

      <div className="mb-10 text-center mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{language === 'vi' ? 'Giai đoạn 2: Bàn phản biện Chiến lược' : 'Stage 2: Strategic Debate Board'}</h2>
        <p className="text-slate-500">{language === 'vi' ? 'Các AI Agent đang đưa ra phản biện chiến lược trực tuyến dựa trên Profile.' : 'AI Agents are conducting real-time strategic counter-arguments based on the Master Profile.'}</p>
      </div>

      {!isLocked ? (
        <div className="space-y-4 mb-24">
          {messages.map((msg, idx) => {
            if (!msg) return null;
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={idx} 
                className={`p-4 rounded-2xl border border-slate-200 bg-white shadow-sm`}
              >
                <div className="flex items-center mb-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getAgentColor(msg.agent)}`}>
                    {msg.agent} Agent
                  </div>
                  {getStatusBadge(msg.type)}
                </div>
                <p className="text-slate-800 text-sm leading-relaxed">{msg.text}</p>
              </motion.div>
            );
          })}
          {messages.length < (language === 'vi' ? MOCK_DEBATE_VI.length : MOCK_DEBATE_EN.length) && (
            <div className="text-linear-text-muted text-sm flex items-center ml-2 animate-pulse">
              <Bot className="w-4 h-4 mr-2" /> {language === 'vi' ? 'Các trợ lý đang nhập...' : 'Agents are typing...'}
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-card border-emerald-200 text-center py-16 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <FileText className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{language === 'vi' ? 'Strategic Blueprint đã được Khóa' : 'Strategic Blueprint Locked'}</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            {language === 'vi' ? 'Tất cả các Agents đã đồng thuận 100%. Chiến lược 3 tháng tập trung vào LinkedIn Whitepapers và SEO tự nhiên đã được thiết lập.' : 'All Agents have reached 100% consensus. The 3-month strategy prioritizing LinkedIn Whitepapers and Organic SEO is firmly established.'}
          </p>
          <button 
             onClick={onNext}
             className="px-8 py-3 rounded-xl gradient-ai-bg font-semibold shadow-md"
          >
             {language === 'vi' ? 'Chuyển sang Lập Ngân sách (Tactics)' : 'Proceed to Tactical Budgeting'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
