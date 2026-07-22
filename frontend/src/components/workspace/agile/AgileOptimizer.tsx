import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, BarChart3, Clock, PlayCircle, ShieldAlert, Sparkles, TrendingDown, Target, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';

interface PivotResponse {
  status_analysis: string;
  root_cause_hypothesis: string;
  pivot_strategy: string;
  actionable_tactics: Array<{
    name: string;
    description: string;
    expected_impact: string;
  }>;
  message_angle_shift: string;
}

export default function AgileOptimizer() {
  const [campaignName, setCampaignName] = useState('Chiến dịch Cuộc thi HUST Startup');
  const [remainingDays, setRemainingDays] = useState(5);
  const [currentKpis, setCurrentKpis] = useState('{"nguon_don": 20, "muc_tieu": 100, "ti_le_chuyen_doi": "2%"}');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PivotResponse | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      let parsedKpis = {};
      try {
        parsedKpis = JSON.parse(currentKpis);
      } catch (e) {
        throw new Error("KPI data must be valid JSON format");
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('access_token');
      
      const res = await fetch(`${API_URL}/api/agile/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          campaign_name: campaignName,
          current_kpis: parsedKpis,
          remaining_days: remainingDays,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data.data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi kết nối hệ thống');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
          <Activity className="w-8 h-8 text-rose-500" />
          Agile Campaign Optimizer
        </h1>
        <p className="text-linear-text-muted mt-2">
          Theo dõi tiến độ chiến dịch và nhận đề xuất xoay chuyển chiến lược (Pivot) từ AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bento-card border border-linear-border bg-linear-surface/30 backdrop-blur-md">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" /> Nhập liệu Chiến dịch
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-linear-text-muted mb-1">Tên chiến dịch</label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full bg-background border border-linear-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-linear-text-muted mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Số ngày còn lại
                </label>
                <input 
                  type="number" 
                  value={remainingDays}
                  onChange={(e) => setRemainingDays(parseInt(e.target.value) || 0)}
                  className="w-full bg-background border border-linear-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-linear-text-muted mb-1 flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" /> Chỉ số KPI hiện tại (JSON)
                </label>
                <textarea 
                  rows={4}
                  value={currentKpis}
                  onChange={(e) => setCurrentKpis(e.target.value)}
                  className="w-full bg-background border border-linear-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>Đang phân tích dữ liệu...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Kích hoạt Agile Pivot</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-2">
          {result ? (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Status & Root Cause */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <h3 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" /> Phân tích hiện trạng
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">{result.status_analysis}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                    <h3 className="text-sm font-bold text-rose-500 mb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Giả thuyết nguyên nhân
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">{result.root_cause_hypothesis}</p>
                  </div>
                </div>

                {/* Pivot Strategy */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <h3 className="text-base font-black text-foreground mb-3 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-cyan-400" /> Hướng xoay chuyển (Pivot Strategy)
                  </h3>
                  <p className="text-lg font-medium text-cyan-100 leading-relaxed relative z-10">
                    {result.pivot_strategy}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-cyan-500/20">
                    <h4 className="text-sm font-bold text-linear-text-muted mb-2">Đề xuất đổi mới Content Angle:</h4>
                    <p className="text-sm text-emerald-400 font-medium italic">"{result.message_angle_shift}"</p>
                  </div>
                </div>

                {/* Actionable Tactics */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-emerald-400" /> Hành động cần làm ngay
                  </h3>
                  {result.actionable_tactics.map((tactic, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={idx}
                      className="p-4 rounded-2xl bg-linear-surface/30 border border-linear-border hover:border-cyan-500/30 transition-all flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{tactic.name}</h4>
                        <p className="text-sm text-linear-text-muted mb-2">{tactic.description}</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Kỳ vọng: {tactic.expected_impact}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-dashed border-linear-border/50">
              <Activity className="w-16 h-16 text-linear-text-muted/30 mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Chưa có dữ liệu phân tích</h3>
              <p className="text-sm text-linear-text-muted max-w-md">
                Nhập số liệu KPI và thời gian còn lại của chiến dịch ở cột bên trái để AI đề xuất phương án tối ưu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
