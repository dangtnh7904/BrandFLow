"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, DollarSign, Lightbulb, ChevronRight, ArrowLeft, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

export default function Screen4_ObjectiveSetting({ onBack, onGoToWorkspace }: { onBack: () => void, onGoToWorkspace: () => void }) {
  const { t, language } = useLanguage();
  const setWizardAnswer = useFormStore(state => state.setWizardAnswer);
  
  const [objectives, setObjectives] = useState("Thương hiệu: Bếp Nhà Mộc\nTôi muốn xây dựng chiến lược truyền thông cực kỳ chi tiết về không gian ẩm thực chữa lành (Mindful Dining). Đối tượng là Gen Z và dân văn phòng đang kiệt sức (Burnout/Toxic Productivity). Cần kế hoạch cho PR, Social Media, Influencer, với mục tiêu bùng nổ doanh thu.");
  const [budget, setBudget] = useState("140,000,000");

  const handleContinue = () => {
    // Save to store
    setWizardAnswer('campaign_objectives', objectives);
    // Budget is stored as a number/string in wizardAnswers
    setWizardAnswer('budget', budget);
    
    // Proceed to workspace
    onGoToWorkspace();
  };

  // Format currency while typing
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue) {
      setBudget(new Intl.NumberFormat('vi-VN').format(parseInt(rawValue)));
    } else {
      setBudget('');
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-y-auto custom-scrollbar flex items-center justify-center relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-linear-surface/80 backdrop-blur-xl border border-linear-border rounded-2xl shadow-2xl p-6 md:p-10 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center">
              <Target className="w-8 h-8 text-blue-500 mr-3" />
              {language === 'vi' ? 'Thiết lập Mục tiêu & Ngân sách' : 'Objective & Budget Setting'}
            </h2>
            <p className="text-linear-text-muted">
              {language === 'vi' 
                ? 'Xác định rõ mong muốn của bạn để các Giám đốc ảo (AI Agents) có cơ sở lập chiến lược chính xác nhất.' 
                : 'Define your requirements so our AI Agents can formulate the most accurate strategy.'}
            </p>
          </div>
          <button onClick={onBack} className="p-2 rounded-full hover:bg-linear-surface/80 transition-colors text-linear-text-muted">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center">
                <Target className="w-4 h-4 mr-2 text-cyan-500" />
                {language === 'vi' ? 'Yêu cầu & Mục tiêu Chiến dịch' : 'Campaign Objectives & Requirements'}
              </label>
              <textarea 
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder={language === 'vi' ? 'VD: Tôi muốn thu hút thêm khách hàng Gen Z đến quán vào buổi tối, tăng 30% doanh thu...' : 'Ex: I want to attract more Gen Z customers...'}
                className="w-full h-40 bg-background/50 border border-linear-border rounded-xl p-4 text-sm md:text-base text-foreground focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                {language === 'vi' ? 'Ngân sách Dự kiến (VND)' : 'Estimated Budget (VND)'}
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={budget}
                  onChange={handleBudgetChange}
                  placeholder="50,000,000"
                  className="w-full bg-background/50 border border-linear-border rounded-xl py-4 pl-12 pr-4 text-lg font-bold text-foreground focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-linear-text-muted font-bold">₫</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: AI Recommendations */}
          <div className="lg:col-span-1">
            <div className="h-full bg-gradient-to-br from-blue-900/40 to-slate-900/80 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lightbulb className="w-24 h-24 text-amber-400" />
              </div>
              
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center relative z-10">
                <Lightbulb className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Hệ thống Khuyến nghị' : 'System Recommendations'}
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div className="p-4 bg-background/40 rounded-lg border border-white/5">
                  <h4 className="text-xs text-slate-400 mb-1">{language === 'vi' ? 'Dành riêng cho:' : 'Tailored for:'}</h4>
                  <p className="font-bold text-cyan-300">Bếp Nhà Mộc</p>
                </div>
                
                <p className="text-sm text-slate-300 leading-relaxed">
                  {language === 'vi' 
                    ? 'Dựa trên Brand DNA phân tích, Bếp Nhà Mộc mang đậm nét văn hóa chữa lành. Để tối ưu hóa, hệ thống đề xuất tập trung vào tệp khách hàng Gen Z và dân văn phòng mệt mỏi.'
                    : 'Based on your Brand DNA, the healing culture is strong. We recommend targeting Gen Z and stressed office workers.'}
                </p>
                
                <div className="pt-2">
                  <h4 className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">
                    {language === 'vi' ? 'Mức ngân sách tối ưu:' : 'Optimal Budget Range:'}
                  </h4>
                  <div className="text-xl font-bold text-white flex items-baseline">
                    45,000,000 <span className="text-xs text-slate-400 ml-1">VNĐ</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'vi' ? 'Đủ để chạy 1 chiến dịch Micro-Influencer (30M) và quà tặng (10M).' : 'Sufficient for a Micro-Influencer campaign.'}
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    setObjectives("Tôi muốn tăng mức độ nhận diện thương hiệu với tệp Gen Z và dân văn phòng, sử dụng các video review mang tính chất chữa lành (healing).");
                    setBudget("45,000,000");
                  }}
                  className="w-full mt-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/50 rounded-lg text-xs font-bold text-blue-200 transition-colors"
                >
                  {language === 'vi' ? 'Áp dụng Khuyến nghị này' : 'Apply this Recommendation'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 pt-6 border-t border-linear-border flex justify-end">
          <button 
            onClick={handleContinue}
            disabled={!objectives || !budget}
            className="group relative px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10 flex items-center">
              {language === 'vi' ? 'Tiến hành Họp Chiến lược' : 'Start Strategic Meeting'} <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
