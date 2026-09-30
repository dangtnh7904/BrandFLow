"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ClipboardList, ShieldCheck, BarChart3, Award, Loader2, CheckCircle2, Circle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// PIPELINE PROGRESS BAR — 5-Step "Glass Box" for BrandFlow Pitching
// ═══════════════════════════════════════════════════════════════════
// Shows investors exactly which AI Agent is "thinking" at each step:
// 1. Chẩn đoán (Diagnosis)   - CMO Goal Setting
// 2. Hoạch định (Planning)   - CMO Strategy
// 3. Kiểm duyệt (Review)    - CFO Budget Firewall
// 4. Đối soát (Reconcile)    - Customer Persona Validator
// 5. Thẩm định (Validate)   - COO & Sales Review

export type PipelineStage = 0 | 1 | 2 | 3 | 4 | 5; // 0 = not started, 5 = all done

interface PipelineStep {
  id: number;
  label: string;
  agentName: string;
  icon: React.ElementType;
  color: string;
  glowColor: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  { id: 1, label: 'Chẩn đoán', agentName: 'CMO Agent', icon: Search, color: 'text-blue-400', glowColor: 'bg-blue-500' },
  { id: 2, label: 'Hoạch định', agentName: 'Strategy Agent', icon: ClipboardList, color: 'text-cyan-400', glowColor: 'bg-cyan-500' },
  { id: 3, label: 'Kiểm duyệt', agentName: 'CFO Firewall', icon: ShieldCheck, color: 'text-orange-400', glowColor: 'bg-orange-500' },
  { id: 4, label: 'Đối soát', agentName: 'Persona Validator', icon: BarChart3, color: 'text-purple-400', glowColor: 'bg-purple-500' },
  { id: 5, label: 'Thẩm định', agentName: 'COO & Sales', icon: Award, color: 'text-emerald-400', glowColor: 'bg-emerald-500' },
];

interface PipelineProgressProps {
  currentStage: PipelineStage;
  className?: string;
}

export default function PipelineProgress({ currentStage, className = '' }: PipelineProgressProps) {
  const progressPercent = currentStage === 0 ? 0 : ((currentStage) / PIPELINE_STEPS.length) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* ── Main Progress Container ── */}
      <div className="relative px-2 py-3">
        {/* Background track */}
        <div className="absolute top-1/2 left-8 right-8 h-[2px] -translate-y-1/2 bg-linear-border/50 rounded-full z-0" />
        
        {/* Animated fill line */}
        <motion.div
          className="absolute top-1/2 left-8 h-[2px] -translate-y-1/2 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full z-[1]"
          initial={{ width: '0%' }}
          animate={{ width: `calc(${progressPercent}% - 2rem)` }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Glow pulse on the leading edge */}
        {currentStage > 0 && currentStage < 5 && (
          <motion.div
            className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ${PIPELINE_STEPS[Math.min(currentStage, 4)].glowColor} z-[2] blur-[6px]`}
            style={{ left: `calc(${progressPercent}% - 1rem)` }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Step nodes */}
        <div className="relative z-10 flex items-center justify-between">
          {PIPELINE_STEPS.map((step) => {
            const isComplete = currentStage >= step.id;
            const isActive = currentStage === step.id;
            const isPending = currentStage < step.id;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center group relative">
                {/* Node circle */}
                <motion.div
                  className={`
                    relative w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-500
                    ${isComplete && !isActive
                      ? 'bg-emerald-500/20 border-emerald-500/50 border shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]'
                      : isActive
                      ? `bg-linear-surface border-2 ${step.color.replace('text-', 'border-')} shadow-lg`
                      : 'bg-linear-surface/50 border border-linear-border/50'
                    }
                  `}
                  animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                  transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                >
                  {isComplete && !isActive ? (
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className={`w-4 h-4 md:w-5 md:h-5 ${step.color}`} />
                    </motion.div>
                  ) : (
                    <StepIcon className="w-4 h-4 md:w-5 md:h-5 text-linear-text-muted/40" />
                  )}

                  {/* Active glow ring */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl border ${step.color.replace('text-', 'border-')} opacity-30`}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <span className={`
                  mt-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-center leading-tight
                  ${isActive ? step.color : isComplete ? 'text-emerald-400/80' : 'text-linear-text-muted/40'}
                `}>
                  {step.label}
                </span>

                {/* Tooltip with agent name */}
                <div className={`
                  absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg 
                  bg-slate-900/95 text-white text-[10px] font-semibold whitespace-nowrap 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                  pointer-events-none shadow-xl border border-slate-700/50 z-50
                `}>
                  {isActive ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {step.agentName} đang xử lý...
                    </span>
                  ) : isComplete ? (
                    <span>✅ {step.agentName} — Hoàn tất</span>
                  ) : (
                    <span className="text-slate-400">{step.agentName} — Chờ</span>
                  )}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900/95 rotate-45 border-r border-b border-slate-700/50" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active Agent Banner ── */}
      {currentStage > 0 && currentStage <= 5 && (
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2 py-1.5"
        >
          {currentStage < 5 ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-3.5 h-3.5"
              >
                <Loader2 className={`w-3.5 h-3.5 ${PIPELINE_STEPS[currentStage - 1].color}`} />
              </motion.div>
              <span className={`text-[11px] font-bold tracking-widest uppercase ${PIPELINE_STEPS[currentStage - 1].color}`}>
                {PIPELINE_STEPS[currentStage - 1].agentName} đang phân tích
              </span>
              <span className="text-[10px] text-linear-text-muted font-mono">
                ({currentStage}/{PIPELINE_STEPS.length})
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400">
                Pipeline hoàn tất — Sẵn sàng xuất báo cáo
              </span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
