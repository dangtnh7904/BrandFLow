"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, DollarSign, Lightbulb, ChevronRight, ArrowLeft, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

export default function Screen4_ObjectiveSetting({ onBack, onGoToWorkspace }: { onBack: () => void, onGoToWorkspace: () => void }) {
  const { t, language } = useLanguage();
  const { wizardAnswers, brandDNA, setWizardAnswer } = useFormStore();
  const isBepNhaMoc = brandDNA?.brand_name?.includes('Nhà Mộc') || wizardAnswers?.company_name?.includes('Nhà Mộc');
  
  const [objectives, setObjectives] = useState(isBepNhaMoc ? "Thương hiệu: Bếp Nhà Mộc\nTôi muốn xây dựng chiến lược truyền thông cực kỳ chi tiết về không gian ẩm thực chữa lành (Mindful Dining). Đối tượng là Gen Z và dân văn phòng đang kiệt sức (Burnout/Toxic Productivity). Cần kế hoạch cho PR, Social Media, Influencer, với mục tiêu bùng nổ doanh thu." : "");
  const [budget, setBudget] = useState("150,000,000");

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
            <div className="h-full bg-gradient-to-br from-blue-900/40 to-slate-900/80 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden shadow-inner flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Lightbulb className="w-24 h-24 text-amber-400" />
              </div>
              
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center relative z-10">
                <Lightbulb className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'AI CMO Đề xuất' : 'AI CMO Recommendations'}
              </h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-10">
                {isBepNhaMoc ? (
                  <>
                    {/* Package 1: The Master Plan */}
                    <div className="p-4 bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/80 rounded-xl transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Package 1: Aggressive Scale</h4>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">350M VNĐ</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        Thống lĩnh ngách 'Mindful Dining' tại TP.HCM. Kích hoạt Corporate Lunch Combo, Zalo Mini App và Booking 30 KOLs. (Mục tiêu: Đạt 2.5 Tỷ MRR).
                      </p>
                      <button 
                        onClick={() => {
                          setObjectives("Tái định vị (Brand Repositioning) thương hiệu Bếp Nhà Mộc lọt Top 3 'Must-visit F&B' dành cho giới chuyên gia/quản lý tại trung tâm TP.HCM. Tập trung vào 'Corporate Lunch' và triển khai Loyalty App.");
                          setBudget("350,000,000");
                        }}
                        className="w-full py-1.5 bg-emerald-500/10 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-lg text-[10px] font-bold text-emerald-300 transition-colors"
                      >
                        Áp dụng Gói này (Apply)
                      </button>
                    </div>

                    {/* Package 2: Retention Focus */}
                    <div className="p-4 bg-slate-900/60 border border-blue-500/30 hover:border-blue-500/80 rounded-xl transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">Package 2: O2O & Loyalty</h4>
                        <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">150M VNĐ</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        Tập trung giảm CAC bằng cách xây dựng hệ thống Zalo Mini App (CRM) và quay 1 Video Cinematic mộc mạc để tối ưu Word-of-Mouth.
                      </p>
                      <button 
                        onClick={() => {
                          setObjectives("Mục tiêu chính là nén chi phí thu hút khách (CAC) và giữ chân khách hàng cũ (Retention Rate) thông qua Zalo O2O CRM. Ngừng giảm giá, tập trung vào Value-added.");
                          setBudget("150,000,000");
                        }}
                        className="w-full py-1.5 bg-blue-500/10 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-[10px] font-bold text-blue-300 transition-colors"
                      >
                        Áp dụng Gói này (Apply)
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-slate-900/60 border border-amber-500/30 rounded-xl">
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      Hệ thống tự động phát hiện quy mô doanh nghiệp SME. Mức ngân sách phù hợp để chạy Pilot (Thử nghiệm) trên Digital là khoảng 50 Triệu VNĐ.
                    </p>
                    <button 
                      onClick={() => {
                        setObjectives("Tôi muốn chạy thử nghiệm các kênh Digital Marketing (Facebook/Tiktok) để đo lường CPA trước khi scale up.");
                        setBudget("50,000,000");
                      }}
                      className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-[10px] font-bold text-amber-300 transition-colors"
                    >
                      Dùng mẫu Pilot (50M)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 pt-6 border-t border-linear-border flex justify-end">
          <button 
            id='btn-next-phase4-objective' onClick={handleContinue}
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
