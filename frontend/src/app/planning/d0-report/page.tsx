"use client";

import React, { useState, useRef } from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';
import ExecutiveReport from '@/components/workspace/ExecutiveReport';
import { MessageSquare, Send, CheckCircle2, Clock, User, BrainCircuit, Lightbulb, ArrowRight, Star, ThumbsUp, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   COMMENT/FEEDBACK PANEL — CEO/CMO can annotate the report inline
   ═══════════════════════════════════════════════════════════════════ */

interface FeedbackItem {
  id: string;
  author: string;
  role: 'CEO' | 'CMO' | 'CFO' | 'User';
  text: string;
  timestamp: Date;
  section?: string;
  type: 'comment' | 'approval' | 'revision';
  aiReply?: string;
}

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CEO: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  CMO: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
  CFO: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
  User: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/30' },
};

const QUICK_FEEDBACKS = [
  { icon: ThumbsUp, label: 'Phê duyệt section này', type: 'approval' as const },
  { icon: Flag, label: 'Cần điều chỉnh', type: 'revision' as const },
  { icon: Lightbulb, label: 'Đề xuất bổ sung', type: 'comment' as const },
];

export default function MarketingPlanReport() {
  const { language } = useLanguage();
  const { brandDNA, wizardAnswers } = useFormStore();
  const brandName = brandDNA?.brand_name || wizardAnswers?.company_name || 'Enterprise';
  const reportRef = useRef<HTMLDivElement>(null);

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: '1',
      author: 'BrandFlow AI',
      role: 'CMO',
      text: 'Bản báo cáo đã được sinh tự động từ kết quả phỏng vấn Brand DNA và phiên tranh biện đa chiều giữa các AI Agent (CMO, CFO, COO, CEO). Mời bạn review từng section và để lại nhận xét.',
      timestamp: new Date(),
      type: 'comment',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [selectedRole, setSelectedRole] = useState<'CEO' | 'CMO' | 'CFO' | 'User'>('User');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  const handleSubmitFeedback = (type: 'comment' | 'approval' | 'revision' = 'comment') => {
    if (!newComment.trim() && type === 'comment') return;

    const item: FeedbackItem = {
      id: Date.now().toString(),
      author: selectedRole === 'User' ? 'Bạn' : `${selectedRole} Review`,
      role: selectedRole,
      text: newComment.trim() || (type === 'approval' ? 'Đã phê duyệt ✓' : 'Cần điều chỉnh nội dung section này.'),
      timestamp: new Date(),
      type,
    };

    setFeedbacks(prev => [...prev, item]);
    setNewComment('');

    // Simulate AI reply
    if (type !== 'approval') {
      setIsAiReplying(true);
      setTimeout(() => {
        const aiReply: FeedbackItem = {
          id: (Date.now() + 1).toString(),
          author: 'BrandFlow AI',
          role: 'CMO',
          text: type === 'revision'
            ? 'Đã ghi nhận yêu cầu điều chỉnh. Hệ thống sẽ tái phân tích và cập nhật section tương ứng trong vòng vài phút. Bạn sẽ nhận được notification khi hoàn tất.'
            : 'Cảm ơn nhận xét! Đề xuất đã được ghi nhận vào danh sách Backlog và sẽ được tích hợp vào phiên cập nhật tiếp theo của Marketing Plan.',
          timestamp: new Date(),
          type: 'comment',
        };
        setFeedbacks(prev => [...prev, aiReply]);
        setIsAiReplying(false);
      }, 1500);
    }
  };

  return (
    <B2BPageTemplate
      title={language === 'vi' ? 'Báo cáo Chiến lược Toàn diện' : 'Full Strategic Report'}
      description={language === 'vi' ? `${brandName} — Xem, nhận xét và phê duyệt báo cáo` : `${brandName} — Review, comment & approve`}
      showFullReport={true}
    >
      <div className="flex gap-6 min-h-0">
        {/* ══════ REPORT VIEW ══════ */}
        <div ref={reportRef} className={`flex-1 min-w-0 transition-all duration-300 ${showPanel ? '' : 'max-w-full'}`}>
          <ExecutiveReport />
        </div>

        {/* ══════ FEEDBACK PANEL ══════ */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="shrink-0 section-card flex flex-col h-[calc(100vh-200px)] sticky top-0"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-linear-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-cyan-500" />
                    {language === 'vi' ? 'Nhận xét & Phê duyệt' : 'Comments & Approval'}
                  </h3>
                  <span className="text-[10px] font-mono text-linear-text-muted bg-linear-surface px-2 py-0.5 rounded-md border border-linear-border">
                    {feedbacks.length} comments
                  </span>
                </div>
                {/* Role Selector */}
                <div className="flex gap-1.5">
                  {(['User', 'CEO', 'CMO', 'CFO'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        selectedRole === role
                          ? `${ROLE_COLORS[role].bg} ${ROLE_COLORS[role].text} ${ROLE_COLORS[role].border}`
                          : 'text-linear-text-muted border-transparent hover:border-linear-border'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {feedbacks.map((fb) => (
                  <motion.div
                    key={fb.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl border ${
                      fb.type === 'approval'
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : fb.type === 'revision'
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : fb.role === 'CMO' && fb.author === 'BrandFlow AI'
                        ? 'bg-blue-500/5 border-blue-500/20'
                        : 'bg-linear-surface border-linear-border/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {fb.author === 'BrandFlow AI' ? (
                          <BrainCircuit className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-linear-text-muted" />
                        )}
                        <span className="text-xs font-bold text-foreground">{fb.author}</span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${ROLE_COLORS[fb.role]?.bg} ${ROLE_COLORS[fb.role]?.text}`}>
                          {fb.role}
                        </span>
                      </div>
                      <span className="text-[9px] text-linear-text-muted font-mono flex items-center">
                        <Clock className="w-2.5 h-2.5 mr-0.5" />
                        {fb.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">{fb.text}</p>
                    {fb.type === 'approval' && (
                      <div className="flex items-center gap-1 mt-2 text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Approved</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isAiReplying && (
                  <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 animate-pulse">
                    <div className="flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                      <span className="text-xs font-bold text-blue-500">BrandFlow AI đang phản hồi...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-linear-border/30">
                <div className="flex gap-1.5 mb-2">
                  {QUICK_FEEDBACKS.map((qf, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setNewComment(qf.label);
                        handleSubmitFeedback(qf.type);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold text-linear-text-muted hover:text-foreground bg-linear-surface border border-linear-border hover:border-cyan-500/30 transition-all"
                    >
                      <qf.icon className="w-3 h-3" />
                      {qf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-linear-border/50">
                <div className="flex gap-2">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitFeedback()}
                    placeholder={language === 'vi' ? 'Viết nhận xét...' : 'Add a comment...'}
                    className="input-field flex-1 text-xs"
                  />
                  <button
                    onClick={() => handleSubmitFeedback()}
                    disabled={!newComment.trim()}
                    className="btn-primary px-3 py-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Panel Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-6 right-6 z-50 btn-primary w-12 h-12 rounded-full shadow-lg flex items-center justify-center print-hide"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    </B2BPageTemplate>
  );
}
