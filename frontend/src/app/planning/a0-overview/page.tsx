"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React, { useEffect, useState } from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { Target, TrendingUp, ShieldAlert, Dna, CheckCircle2, XCircle, BarChart3, Sparkles, Loader2 } from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';

export default function PageA0Overview() {
  const { localData, saveStatus } = useAutoSaveForm('a0-overview', { });
  const brandDNA = useFormStore((s: any) => s.brandDNA);
  const intakeAnalysis = useFormStore((s: any) => s.intakeAnalysis);
  
  const [advisorData, setAdvisorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAdvisor = async () => {
      setIsLoading(true);
      try {
        const industry = intakeAnalysis?.industry || brandDNA?.industry || "F&B";
        const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${API}/api/v1/industry-advisor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ industry, brand_dna: brandDNA, wizard_answers: {} }),
        });
        if (res.ok) {
          const data = await res.json();
          setAdvisorData(data);
        }
      } catch (e) {
        console.warn("Industry Advisor unavailable:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdvisor();
  }, [brandDNA, intakeAnalysis]);

  const models = advisorData?.models;

  return (
    <>
      <B2BPageTemplate
      saveStatus={saveStatus}
        title="Tổng quan Phần A: Chiến Lược (Strategy)"
        description="Chào mừng bạn đến với giai đoạn nền tảng nhất của lộ trình. Phần này giúp định hình bức tranh lớn trước khi hành động."
      >
        <div className="space-y-6">

          {/* Model Advisor Panel */}
          {isLoading ? (
            <div className="bento-card p-8 flex items-center justify-center gap-3 text-linear-text-muted">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang phân tích ngành & quy mô doanh nghiệp...</span>
            </div>
          ) : models ? (
            <div className="bg-gradient-to-r from-background to-linear-surface border border-cyan-500/20 rounded-xl overflow-hidden shadow-lg">
              {/* Header */}
              <div className="p-6 border-b border-linear-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center text-xl">
                    {models.industry_icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">Model Advisor</h2>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Auto-detected</span>
                    </div>
                    <p className="text-sm text-linear-text-muted">
                      {models.industry_display} • {models.size_label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Model Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recommended Models */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Frameworks Được Khuyến Nghị ({models.use?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {models.use?.map((m: any) => (
                      <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{m.name}</p>
                          <p className="text-xs text-linear-text-muted mt-0.5">{m.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skipped Models */}
                <div>
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Không Áp Dụng ({models.skip?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {models.skip?.map((m: any) => (
                      <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10 opacity-70">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground line-through decoration-red-400/30">{m.name}</p>
                          <p className="text-xs text-linear-text-muted mt-0.5">{m.reason}</p>
                        </div>
                      </div>
                    ))}
                    {models.skip?.length === 0 && (
                      <p className="text-sm text-linear-text-muted italic p-3">Ở quy mô Enterprise, tất cả model đều phù hợp.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* KPIs & Benchmarks */}
              {(models.focus_kpis?.length > 0 || Object.keys(models.benchmark || {}).length > 0) && (
                <div className="px-6 pb-6 pt-0">
                  <div className="bg-linear-surface/50 rounded-xl p-4 border border-linear-border">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      KPIs Trọng tâm & Benchmark Ngành
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {models.focus_kpis?.map((kpi: string) => (
                        <span key={kpi} className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                          {kpi.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                    {Object.keys(models.benchmark || {}).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        {Object.entries(models.benchmark).map(([key, val]: [string, any]) => (
                          <div key={key} className="bg-background rounded-lg p-3 text-center border border-linear-border">
                            <p className="text-xs text-linear-text-muted uppercase">{key.replace(/_/g, ' ')}</p>
                            <p className="text-lg font-bold text-foreground mt-1">{val}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Original Overview Cards */}
          <div className="bg-gradient-to-r from-background to-linear-surface border-b border-linear-border rounded-xl p-8 text-cyan-400 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <h2 className="text-2xl font-bold mb-3 relative z-10">Mục tiêu của Phần A là gì?</h2>
             <p className="text-linear-text-muted leading-relaxed max-w-3xl relative z-10 text-lg">
               Chúng ta sẽ cùng nhau trả lời 3 câu hỏi lớn nhất: <br/>
               <strong>1. Chúng ta là ai?</strong> (Sứ mệnh)<br/>
               <strong>2. Chúng ta đang đứng ở đâu?</strong> (Hiệu suất & SWOT)<br/>
               <strong>3. Chúng ta muốn đi tới đâu?</strong> (Mục tiêu & Ngân sách)
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Đích đến rõ ràng</h3>
                <p className="text-sm text-linear-text-muted">Form A.1 sẽ giúp bạn xác định Sứ mệnh, ngăn chặn việc kinh doanh lan man.</p>
             </div>
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Nhìn lại 3 năm</h3>
                <p className="text-sm text-linear-text-muted">Form A.2 & A.3 bóc tách hiệu suất quá khứ làm bàn đạp cho tương lai.</p>
             </div>
             <div className="bento-card p-6 flex flex-col flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Trận đồ Cạnh tranh</h3>
                <p className="text-sm text-linear-text-muted">Giúp bạn biết đâu là tử huyệt của đối thủ thông qua Ma trận SWOT và Market Map.</p>
             </div>
          </div>
          
          <div className="bg-linear-surface/30 backdrop-blur-sm border border-linear-border rounded-xl p-6 flex items-center justify-between">
             <div>
               <h3 className="font-bold text-foreground text-lg mb-1">Bạn đã sẵn sàng chưa?</h3>
               <p className="text-linear-text-muted text-sm">Quá trình này có thể tốn khoảng 30 phút. Bạn có thể sử dụng AI Assistant ở góc phải để phân tích nhanh.</p>
             </div>
             <WizardNavigation nextLink="/planning/a1-mission" nextLabel="Bắt đầu A.1 Tuyên bố Sứ mệnh" />
          </div>
        </div>
      </B2BPageTemplate>
      
          </>
  );
}
