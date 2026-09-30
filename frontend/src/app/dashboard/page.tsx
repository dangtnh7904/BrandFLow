"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, Zap, TrendingUp, BarChart3, Bot, DollarSign, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ActivePlansCard from '@/components/dashboard/ActivePlansCard';
import BrandAssetsCard from '@/components/dashboard/BrandAssetsCard';
import FinancialRiskAlert from '@/components/dashboard/FinancialRiskAlert';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: "Ngân sách Còn lại", value: "85,400,000đ", trend: "-12% (Đã tối ưu)", icon: DollarSign, color: "text-emerald-400" },
    { label: "Dự phóng Doanh thu", value: "2.5 Tỷ", trend: "+18% vs Tháng trước", icon: TrendingUp, color: "text-blue-400" },
    { label: "Chiến dịch Đang chạy", value: "3", trend: "Hoạt động ổn định", icon: Target, color: "text-purple-400" },
    { label: "Tác vụ AI Xử lý (24h)", value: "142", trend: "Tiết kiệm 45 giờ làm việc", icon: Bot, color: "text-cyan-400" },
  ];

  const agentLogs = [
    { agent: "CFO", action: "Đã cắt giảm 15% ngân sách kênh Facebook Ads do ROAS < 2.0", time: "10 phút trước", color: "text-orange-400" },
    { agent: "CMO", action: "Phê duyệt 3 nội dung video ngắn cho nền tảng TikTok", time: "45 phút trước", color: "text-blue-400" },
    { agent: "Content", action: "Hoàn tất sinh kịch bản Hero Video 'Mùi Khói Bếp'", time: "2 giờ trước", color: "text-pink-400" },
    { agent: "Sales", action: "Đề xuất tích hợp Zalo Mini App để giữ chân tệp khách cũ", time: "3 giờ trước", color: "text-emerald-400" },
  ];

  if (!mounted) return null;

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar relative bg-transparent pb-10">
      {/* ── Background Glow ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 relative z-10">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">All Systems Nominal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-heading tracking-tight mb-2">
              Command Center
            </h1>
            <p className="text-slate-400 font-medium text-sm md:text-base">
              Tổng hợp toàn diện hoạt động kinh doanh, tài sản thương hiệu và hiệu suất Hệ thống AI.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="glassbox-card !px-5 !py-2.5 flex items-center gap-2 hover:bg-white/5 transition-colors group">
              <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold text-slate-200">Xuất Báo Cáo</span>
            </button>
            <button className="glassbox-card !px-5 !py-2.5 flex items-center gap-2 hover:bg-white/5 transition-colors group bg-blue-600/20 border-blue-500/30">
              <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-200">Tạo Chiến dịch Mới</span>
            </button>
          </div>
        </div>

        {/* ── High-Level Aggregation Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glassbox-card !p-5 flex flex-col justify-between group hover:border-slate-500/40 transition-colors relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-${stat.color.split('-')[1]}-500/10 rounded-bl-full pointer-events-none`} />
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl bg-slate-800/80 ${stat.color.replace('text-', 'bg-').replace('400', '500/20')} group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend.split(' ')[0]}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">{stat.trend.split(' ').slice(1).join(' ')}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Main Dashboard Layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Left Column: Aggregated Progress & ROI */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            
            {/* ROI & Budget Utilization Panel */}
            <div className="glassbox-card !p-6 flex flex-col md:flex-row gap-8 bg-gradient-to-br from-slate-900/80 to-slate-800/50">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" /> Tiến độ Giải ngân vs ROI
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-slate-200">Chiến dịch Mùa Hè</span>
                      <span className="text-cyan-400 font-mono">65% / 80% ROI</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-cyan-500 w-[65%]" />
                      <div className="h-full bg-blue-500 w-[15%]" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-slate-200">Zalo O2O Loyalty</span>
                      <span className="text-emerald-400 font-mono">30% / Đang test</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[30%]" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-slate-200">Brand Awareness Q3</span>
                      <span className="text-pink-400 font-mono">90% / Hoàn tất</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 w-[90%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                 <div className="text-center mb-6">
                   <div className="text-4xl font-black text-white mb-2">248%</div>
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average ROAS</div>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                   <span className="text-xs font-bold text-slate-300">Net Profit Của AI</span>
                   <span className="text-sm font-black text-emerald-400">+1.2 Tỷ</span>
                 </div>
              </div>
            </div>

            {/* Agent Activity Feed */}
            <div className="glassbox-card !p-0 overflow-hidden flex flex-col border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-transparent to-cyan-500/10">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Luồng thực thi AI Multi-Agent (Live)
                </h3>
                <span className="text-xs font-mono text-cyan-400/80 flex items-center gap-2 bg-cyan-500/10 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Đang giám sát
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6 bg-black/40">
                {agentLogs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    key={i} className="flex gap-5 group"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${log.color.replace('text-', 'bg-').replace('400', '500/20')} border border-white/10 shadow-lg`}>
                        <Bot className={`w-5 h-5 ${log.color}`} />
                      </div>
                      {i !== agentLogs.length - 1 && <div className="w-px h-full bg-white/10 my-2" />}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`text-xs font-black uppercase tracking-widest ${log.color}`}>{log.agent} Agent</span>
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {log.time}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors">{log.action}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Risk Alerts & Approvals */}
          <div className="flex flex-col gap-6">
            <FinancialRiskAlert />
            
            <div className="glassbox-card !p-6 flex-1 bg-gradient-to-b from-blue-900/40 to-slate-900/60 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px]" />
              
              <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Cần Phê Duyệt Khẩn Cấp
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 hover:bg-black/60 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-white">Zalo Mini App O2O</p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">High Priority</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">CFO Agent đề xuất tăng 15% ngân sách do tỷ lệ chuyển đổi đang vượt mức kỳ vọng.</p>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500">Ngân sách mới:</span>
                     <span className="font-bold text-blue-400">65,000,000đ</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-transform hover:-translate-y-0.5">
                    Phê duyệt
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold transition-colors">
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Assets Link */}
            <div className="glassbox-card !p-5 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-colors border-white/5 hover:border-white/20">
              <div className="flex items-center gap-4">
                 <div className="p-2 rounded-lg bg-pink-500/10">
                   <Target className="w-5 h-5 text-pink-400" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-200">Brand Assets Hub</h4>
                   <p className="text-xs text-slate-500">Truy cập 24 tài nguyên đã sinh</p>
                 </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>

          </div>
        </div>

        {/* ── Active Plans Detailed View ── */}
        <div className="mt-8">
          <ActivePlansCard />
        </div>

      </div>
    </div>
  );
}
