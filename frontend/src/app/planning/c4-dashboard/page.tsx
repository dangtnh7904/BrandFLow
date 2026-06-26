"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React, { useState, useEffect } from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { AlertTriangle, TrendingDown, RefreshCw, Zap, TrendingUp, CheckCircle2, Factory } from 'lucide-react';

const NORMAL_DATA = [
  { month: 'T1', 'Thực đơn Chữa lành': 120, 'Giao hàng O2O (Zalo Mini App)': 85, profit: 45 },
  { month: 'T2', 'Thực đơn Chữa lành': 135, 'Giao hàng O2O (Zalo Mini App)': 90, profit: 52 },
  { month: 'T3', 'Thực đơn Chữa lành': 160, 'Giao hàng O2O (Zalo Mini App)': 95, profit: 60 },
  { month: 'T4', 'Thực đơn Chữa lành': 180, 'Giao hàng O2O (Zalo Mini App)': 110, profit: 75 },
  { month: 'T5', 'Thực đơn Chữa lành': 210, 'Giao hàng O2O (Zalo Mini App)': 120, profit: 90 },
  { month: 'T6', 'Thực đơn Chữa lành': 250, 'Giao hàng O2O (Zalo Mini App)': 140, profit: 110 },
];

const SHOCK_DATA = [
  { month: 'T1', 'Thực đơn Chữa lành': 120, 'Giao hàng O2O (Zalo Mini App)': 85, profit: 45 },
  { month: 'T2', 'Thực đơn Chữa lành': 135, 'Giao hàng O2O (Zalo Mini App)': 90, profit: 52 },
  { month: 'T3', 'Thực đơn Chữa lành': 160, 'Giao hàng O2O (Zalo Mini App)': 95, profit: 60 },
  { month: 'T4', 'Thực đơn Chữa lành': 90, 'Giao hàng O2O (Zalo Mini App)': 60, profit: 15 }, // bão giá nguyên liệu hữu cơ
  { month: 'T5', 'Thực đơn Chữa lành': 60, 'Giao hàng O2O (Zalo Mini App)': 45, profit: -10 }, // Đáy
  { month: 'T6', 'Thực đơn Chữa lành': 45, 'Giao hàng O2O (Zalo Mini App)': 30, profit: -25 }, 
];

const RECOVERY_DATA = [
  { month: 'T1', 'Thực đơn Chữa lành': 120, 'Giao hàng O2O (Zalo Mini App)': 85, profit: 45 },
  { month: 'T2', 'Thực đơn Chữa lành': 135, 'Giao hàng O2O (Zalo Mini App)': 90, profit: 52 },
  { month: 'T3', 'Thực đơn Chữa lành': 160, 'Giao hàng O2O (Zalo Mini App)': 95, profit: 60 },
  { month: 'T4', 'Thực đơn Chữa lành': 90, 'Giao hàng O2O (Zalo Mini App)': 60, profit: 15 }, // Shock
  { month: 'T5', 'Thực đơn Chữa lành': 140, 'Giao hàng O2O (Zalo Mini App)': 110, profit: 35 }, // Recovery Start
  { month: 'T6', 'Thực đơn Chữa lành': 280, 'Giao hàng O2O (Zalo Mini App)': 190, profit: 130 }, // Corporate Lunch Pivot Success
];

export default function PageC4Dashboard() {
  const { saveStatus } = useAutoSaveForm('c4-dashboard', { items: [] });
  const [isBepNhaMoc, setIsBepNhaMoc] = useState(false);
  const [scenario, setScenario] = useState<'normal' | 'shock' | 'recovery'>('normal');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('brandflow_user_id');
      if (user === 'bepnhamoc_001') setIsBepNhaMoc(true);
    }
  }, []);

  const chartData = scenario === 'normal' ? NORMAL_DATA : scenario === 'shock' ? SHOCK_DATA : RECOVERY_DATA;

  const simulateShock = () => setScenario('shock');
  const triggerAIPivot = () => {
    setScenario('recovery');
  };

  return (
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Execution Tracking & War-Room"
      description="Bảng điều khiển trực tiếp dành cho C-Level theo dõi hiệu quả thực thi Kế hoạch Marketing."
    >
      <div className="space-y-6">
        {/* Header Actions */}
        {isBepNhaMoc && (
          <div className="flex justify-between items-center bg-[#0F172A] p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Factory className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Demo Workspace</div>
                <div className="text-lg font-black text-white">Bếp Nhà Mộc - F&B / Mindful Dining</div>
              </div>
            </div>
            {scenario === 'normal' && (
              <button onClick={simulateShock} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-bold border border-red-500/20 flex items-center gap-2 transition-all">
                <AlertTriangle className="w-4 h-4" /> Mô phỏng Yếu tố ngoại cảnh
              </button>
            )}
          </div>
        )}

        {/* Shock Alert & AI Intervention Panel */}
        <AnimatePresence mode="wait">
          {scenario === 'shock' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="bg-gradient-to-r from-red-500/10 to-[#0F172A] border-l-4 border-l-red-500 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-red-400 mb-2">CẢNH BÁO: Hiệu quả kế hoạch lao dốc (Tháng 4)</h3>
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                      <strong>Phân tích nguyên nhân (Ngoại cảnh):</strong> Giá nguyên liệu Sữa chua nguyên chất nhập khẩu tăng 35% do bão giá nguyên liệu hữu cơ (Organic) tăng 40%. Đồng thời, đối thủ A vừa tung chương trình khuyến mãi mua 1 tặng 1 ở mọi hệ thống siêu thị.
                    </p>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-black/40 p-3 rounded-xl border border-red-500/20">
                        <div className="text-xs text-red-400 font-bold">Doanh số Thực đơn Chữa lành</div>
                        <div className="text-2xl font-black text-white">📉 -50%</div>
                      </div>
                      <div className="flex-1 bg-black/40 p-3 rounded-xl border border-red-500/20">
                        <div className="text-xs text-red-400 font-bold">Biên lợi nhuận gộp</div>
                        <div className="text-2xl font-black text-white">🚨 -75%</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[300px] shrink-0 bg-slate-900 rounded-xl border border-blue-500/30 p-4 shadow-[0_0_20px_rgba(59,130,246,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <div className="text-xs font-bold text-blue-400 uppercase">AI CMO Đề Xuất</div>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-4">
                      Kế hoạch B2C hiện tại không còn khả thi về lợi nhuận. Đề xuất: Dịch chuyển ngay lập tức ngân sách sang kênh <strong>B2B Phục vụ Doanh nghiệp (Corporate Lunch)</strong> và tung sản phẩm "Hộp quà mix Bếp Nhà Mộc" biên độ LN cao.
                    </p>
                    <button onClick={triggerAIPivot} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors">
                      Áp dụng Chiến lược Pivoting mới
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {scenario === 'recovery' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <div>
                  <h3 className="text-sm font-black text-emerald-400">Chiến lược B2B Pivot đã được kích hoạt thành công</h3>
                  <p className="text-xs text-emerald-500/80">Hệ thống đã tự động điều chỉnh KPIs, Ngân sách và Kế hoạch truyền thông tập trung vào khối Doanh nghiệp.</p>
                </div>
              </div>
              <button onClick={() => setScenario('normal')} className="text-xs font-bold text-emerald-500 hover:underline">
                Reset Demo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bento-card p-6 h-[400px]">
            <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Doanh số theo SBU (Đơn vị: Triệu VNĐ)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="Thực đơn Chữa lành" stroke="#F43F5E" strokeWidth={4} dot={{ r: 4, fill: '#F43F5E' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Giao hàng O2O (Zalo Mini App)" stroke="#EAB308" strokeWidth={4} dot={{ r: 4, fill: '#EAB308' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bento-card p-6 h-[400px]">
            <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Lợi nhuận ròng (Net Profit)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={scenario === 'shock' ? '#EF4444' : '#10B981'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={scenario === 'shock' ? '#EF4444' : '#10B981'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="profit" stroke={scenario === 'shock' ? '#EF4444' : '#10B981'} fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </B2BPageTemplate>
  );
}

