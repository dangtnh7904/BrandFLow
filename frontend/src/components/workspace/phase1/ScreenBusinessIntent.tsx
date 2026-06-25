"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Lightbulb, ArrowRight, Target, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

const TIMELINES = [
  { id: '3_months', label_vi: '3 tháng', label_en: '3 months' },
  { id: '6_months', label_vi: '6 tháng', label_en: '6 months' },
  { id: '12_months', label_vi: '1 năm', label_en: '1 year' },
];

const BUDGET_PRESETS = [
  { value: 50_000_000, label: '50 triệu' },
  { value: 100_000_000, label: '100 triệu' },
  { value: 300_000_000, label: '300 triệu' },
  { value: 500_000_000, label: '500 triệu' },
  { value: 1_000_000_000, label: '1 tỷ' },
];

export default function ScreenBusinessIntent({ onNext }: { onNext: () => void }) {
  const { language } = useLanguage();
  const { businessIntent, setBusinessIntent } = useFormStore();
  const [mode, setMode] = useState<'budget_first' | 'idea_first' | null>(businessIntent.mode);
  const [budget, setBudget] = useState<number>(businessIntent.budget || 0);
  const [idea, setIdea] = useState(businessIntent.idea || '');
  const [goal, setGoal] = useState(businessIntent.businessGoal || '');
  const [timeline, setTimeline] = useState(businessIntent.timeline || '3_months');
  const [customBudget, setCustomBudget] = useState('');

  const canProceed = mode && goal.trim().length > 10 && (
    mode === 'budget_first' ? budget > 0 : idea.trim().length > 10
  );

  const handleProceed = () => {
    setBusinessIntent({
      mode,
      budget: mode === 'budget_first' ? budget : undefined,
      idea: mode === 'idea_first' ? idea : undefined,
      businessGoal: goal,
      timeline,
    });
    onNext();
  };

  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' VNĐ';

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col items-center p-8 max-w-4xl mx-auto w-full min-h-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-linear-border bg-linear-surface/50 backdrop-blur-sm mb-4 shadow-sm">
            <Target className="w-4 h-4 text-cyan-500 mr-2" />
            <span className="text-xs font-semibold text-foreground tracking-wide uppercase">
              {language === 'vi' ? 'Xác định Mục tiêu' : 'Define Your Goal'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
            {language === 'vi' ? 'Bạn cần BrandFlow ' : 'How can BrandFlow '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              {language === 'vi' ? 'giúp gì?' : 'help you?'}
            </span>
          </h2>
          <p className="text-linear-text-muted max-w-xl mx-auto text-sm">
            {language === 'vi'
              ? 'Cho hệ thống biết bạn đang ở tình huống nào để AI đưa ra chiến lược phù hợp nhất.'
              : 'Tell us your situation so our AI can deliver the most relevant strategy.'}
          </p>
        </motion.div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
          {/* Budget-first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            id="mode-budget-first"
            onClick={() => setMode('budget_first')}
            className={`relative group flex flex-col p-7 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-xl overflow-hidden ${
              mode === 'budget_first'
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.12)]'
                : 'bg-linear-surface hover:bg-linear-surface/80 border-linear-border hover:border-emerald-500/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
              mode === 'budget_first'
                ? 'bg-emerald-500/20 border border-emerald-500/40'
                : 'bg-linear-surface/60 border border-linear-border'
            }`}>
              <Wallet className={`w-7 h-7 ${mode === 'budget_first' ? 'text-emerald-400' : 'text-linear-text-muted'}`} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {language === 'vi' ? 'Tôi có Ngân sách' : 'I Have a Budget'}
            </h3>
            <p className="text-xs text-linear-text-muted leading-relaxed">
              {language === 'vi'
                ? '"Tôi có một khoản ngân sách cụ thể, hãy cho tôi biết cần triển khai những gì để đạt hiệu quả tối đa."'
                : '"I have a specific budget — tell me what to do to maximize results."'}
            </p>
            {mode === 'budget_first' && (
              <div className="absolute top-5 right-5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </motion.div>

          {/* Idea-first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setMode('idea_first')}
            className={`relative group flex flex-col p-7 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-xl overflow-hidden ${
              mode === 'idea_first'
                ? 'bg-violet-500/10 border-violet-500/50 shadow-[0_0_25px_rgba(139,92,246,0.12)]'
                : 'bg-linear-surface hover:bg-linear-surface/80 border-linear-border hover:border-violet-500/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
              mode === 'idea_first'
                ? 'bg-violet-500/20 border border-violet-500/40'
                : 'bg-linear-surface/60 border border-linear-border'
            }`}>
              <Lightbulb className={`w-7 h-7 ${mode === 'idea_first' ? 'text-violet-400' : 'text-linear-text-muted'}`} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {language === 'vi' ? 'Tôi có Ý tưởng' : 'I Have an Idea'}
            </h3>
            <p className="text-xs text-linear-text-muted leading-relaxed">
              {language === 'vi'
                ? '"Tôi có một ý tưởng kinh doanh hoặc sản phẩm, hãy cho tôi biết cần đầu tư bao nhiêu và lộ trình thực hiện."'
                : '"I have a business idea or product — tell me how much it costs and the roadmap to execute."'}
            </p>
            {mode === 'idea_first' && (
              <div className="absolute top-5 right-5">
                <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Dynamic Input Section */}
        <AnimatePresence mode="wait">
          {mode && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="w-full space-y-6 overflow-hidden"
            >
              <div className="p-6 rounded-2xl bg-linear-surface/60 border border-linear-border backdrop-blur-md space-y-6">

                {/* Budget Input (Budget-first mode) */}
                {mode === 'budget_first' && (
                  <div>
                    <label className="text-sm font-bold text-foreground flex items-center mb-3">
                      <Wallet className="w-4 h-4 mr-2 text-emerald-500" />
                      {language === 'vi' ? 'Ngân sách Marketing (VNĐ)' : 'Marketing Budget (VND)'}
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {BUDGET_PRESETS.map((p) => (
                        <button
                          key={p.value}
                          id={`btn-budget-${p.value}`}
                          onClick={() => { setBudget(p.value); setCustomBudget(''); }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            budget === p.value
                              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                              : 'bg-linear-surface border border-linear-border text-linear-text-muted hover:border-emerald-500/30'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={language === 'vi' ? 'Hoặc nhập số tiền cụ thể...' : 'Or enter exact amount...'}
                        value={customBudget}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          setCustomBudget(raw ? new Intl.NumberFormat('vi-VN').format(Number(raw)) : '');
                          if (raw) setBudget(Number(raw));
                        }}
                        className="w-full bg-background border border-linear-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      />
                      {budget > 0 && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-emerald-500 font-medium">
                          {formatVND(budget)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Idea Input (Idea-first mode) */}
                {mode === 'idea_first' && (
                  <div>
                    <label className="text-sm font-bold text-foreground flex items-center mb-3">
                      <Lightbulb className="w-4 h-4 mr-2 text-violet-500" />
                      {language === 'vi' ? 'Mô tả Ý tưởng Kinh doanh' : 'Describe Your Business Idea'}
                    </label>
                    <textarea
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder={language === 'vi'
                        ? 'VD: Tôi muốn mở chuỗi cà phê healthy kết hợp không gian coworking cho freelancer tại TP.HCM, phân khúc tầm trung...'
                        : 'E.g., I want to launch a healthy coffee chain with coworking space for freelancers in HCMC...'}
                      rows={4}
                      className="w-full bg-background border border-linear-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
                    />
                  </div>
                )}

                {/* Business Goal (both modes) */}
                <div>
                  <label className="text-sm font-bold text-foreground flex items-center mb-3">
                    <Target className="w-4 h-4 mr-2 text-cyan-500" />
                    {language === 'vi' ? 'Mục tiêu Kinh doanh cụ thể' : 'Specific Business Objective'}
                  </label>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={language === 'vi'
                      ? 'VD: Tăng 30% doanh thu quý 3, mở rộng thêm 2 chi nhánh, xây dựng nhận diện thương hiệu trên TikTok...'
                      : 'E.g., Increase Q3 revenue by 30%, expand 2 branches, build brand presence on TikTok...'}
                    rows={3}
                    className="w-full bg-background border border-linear-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none"
                  />
                </div>

                {/* Timeline */}
                <div>
                  <label className="text-sm font-bold text-foreground flex items-center mb-3">
                    <Clock className="w-4 h-4 mr-2 text-amber-500" />
                    {language === 'vi' ? 'Thời gian triển khai' : 'Implementation Timeline'}
                  </label>
                  <div className="flex gap-3">
                    {TIMELINES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTimeline(t.id)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                          timeline === t.id
                            ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                            : 'bg-linear-surface border border-linear-border text-linear-text-muted hover:border-amber-500/30'
                        }`}
                      >
                        {language === 'vi' ? t.label_vi : t.label_en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Proceed Button */}
              <motion.button
                id="btn-proceed-intent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleProceed}
                disabled={!canProceed}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  canProceed
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.01]'
                    : 'bg-linear-surface border border-linear-border text-linear-text-muted cursor-not-allowed opacity-50'
                }`}
              >
                {language === 'vi' ? 'Tiếp tục Thiết lập Chiến lược' : 'Continue to Strategy Setup'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

