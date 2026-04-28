"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Lightbulb, Target, Rocket, Compass, Anchor, Zap, Shield, Sparkles, 
  TrendingUp, Users, Crown, Key, Star, Heart, Flame, Flag, 
  CheckCircle2, Store, Crosshair, Monitor, TrendingDown
} from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICONS = [
  { icon: Lightbulb, color: "text-amber-500" },
  { icon: Target, color: "text-rose-500" },
  { icon: Rocket, color: "text-purple-500" },
  { icon: Compass, color: "text-blue-500" },
  { icon: Anchor, color: "text-cyan-500" },
  { icon: Zap, color: "text-yellow-500" },
  { icon: Shield, color: "text-emerald-500" },
  { icon: Sparkles, color: "text-indigo-500" },
  { icon: TrendingUp, color: "text-teal-500" },
  { icon: Users, color: "text-orange-500" },
  { icon: Crown, color: "text-pink-500" },
  { icon: Key, color: "text-slate-500" },
];

export interface DynamicQuestionRendererProps {
  title: string;
  questions: any[];
  wizardAnswers: Record<string, any>;
  onAnswerChange: (questionId: string, answer: string, type: string) => void;
}

export default function DynamicQuestionRenderer({ title, questions, wizardAnswers, onAnswerChange }: DynamicQuestionRendererProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-10 mb-10">
      <h3 className="text-2xl font-bold text-foreground flex items-center border-b border-linear-border pb-4">
        <Sparkles className="w-6 h-6 mr-3 text-cyan-500" />
        {title}
      </h3>
      
      <div className="grid gap-10">
        {questions.map((q: any, i: number) => {
          // Determine style based on index
          const styleType = i % 4; // 0: Cards, 1: Pills, 2: Rows, 3: Minimal

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={q.id} 
              className="space-y-4"
            >
              <div>
                <h4 className="font-bold text-lg text-foreground leading-snug">{q.question}</h4>
                {q.type === 'checkbox' && <p className="text-xs text-blue-500 mt-1 font-medium">* Có thể chọn nhiều đáp án</p>}
              </div>

              {/* Style 0: CARDS (giống Archetypes) */}
              {styleType === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {q.options.map((opt: string, idx: number) => {
                    const isChecked = q.type === 'checkbox' 
                      ? (Array.isArray(wizardAnswers[q.id]) && wizardAnswers[q.id].includes(opt))
                      : wizardAnswers[q.id] === opt;
                    
                    const iconObj = ICONS[idx % ICONS.length];
                    const Icon = iconObj.icon;

                    return (
                      <div 
                        key={idx}
                        onClick={() => onAnswerChange(q.id, opt, q.type)}
                        className={cn(
                          "relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2",
                          isChecked 
                            ? "bg-blue-50/50 dark:bg-blue-500/10 border-blue-500 shadow-sm scale-[1.02]" 
                            : "bg-linear-surface border-linear-border hover:bg-linear-surface/80 hover:border-cyan-500/40"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", isChecked ? "bg-blue-100 dark:bg-blue-900/50" : "bg-slate-100 dark:bg-slate-800")}>
                          <Icon className={cn("w-5 h-5", isChecked ? "text-blue-600" : iconObj.color)} />
                        </div>
                        <h3 className="text-foreground font-semibold text-sm leading-relaxed">{opt}</h3>
                        {isChecked && <CheckCircle2 className="absolute top-5 right-5 w-5 h-5 text-blue-600" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Style 1: PILLS (giống Nỗi đau KH) */}
              {styleType === 1 && (
                <div className="flex flex-wrap gap-3">
                  {q.options.map((opt: string, idx: number) => {
                    const isChecked = q.type === 'checkbox' 
                      ? (Array.isArray(wizardAnswers[q.id]) && wizardAnswers[q.id].includes(opt))
                      : wizardAnswers[q.id] === opt;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => onAnswerChange(q.id, opt, q.type)}
                        className={cn(
                          "px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 border shadow-sm flex items-center",
                          isChecked
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-cyan-500/30 scale-[1.02]"
                            : "bg-linear-surface text-foreground border-linear-border hover:border-cyan-400/50 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                        )}
                      >
                        {isChecked && <CheckCircle2 className="w-4 h-4 mr-2" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Style 2: ROWS (giống Thách thức) */}
              {styleType === 2 && (
                <div className="grid grid-cols-1 gap-3">
                  {q.options.map((opt: string, idx: number) => {
                    const isChecked = q.type === 'checkbox' 
                      ? (Array.isArray(wizardAnswers[q.id]) && wizardAnswers[q.id].includes(opt))
                      : wizardAnswers[q.id] === opt;
                    
                    const iconObj = ICONS[(idx + 4) % ICONS.length];
                    const Icon = iconObj.icon;

                    return (
                      <div 
                        key={idx}
                        onClick={() => onAnswerChange(q.id, opt, q.type)}
                        className={cn(
                          "relative p-4 rounded-xl cursor-pointer transition-all duration-200 border flex items-center group",
                          isChecked 
                            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400 dark:border-emerald-500/50 shadow-sm" 
                            : "bg-linear-surface border-linear-border hover:bg-linear-surface/80 hover:border-emerald-500/30"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center mr-4 transition-colors", isChecked ? "bg-emerald-100 dark:bg-emerald-900/50" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700")}>
                           <Icon className={cn("w-5 h-5", isChecked ? "text-emerald-600" : "text-linear-text-muted group-hover:text-foreground")} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-foreground font-medium text-sm">{opt}</h3>
                        </div>
                        <div className={cn("w-5 h-5 rounded-full border-2 ml-4 flex items-center justify-center", isChecked ? "border-emerald-500 bg-emerald-500" : "border-slate-300 dark:border-slate-600 group-hover:border-emerald-400")}>
                          {isChecked && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Style 3: MINIMAL (mặc định cũ nhưng đẹp hơn) */}
              {styleType === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt: string, idx: number) => {
                    const isChecked = q.type === 'checkbox' 
                      ? (Array.isArray(wizardAnswers[q.id]) && wizardAnswers[q.id].includes(opt))
                      : wizardAnswers[q.id] === opt;
                    
                    return (
                      <div 
                        key={idx} 
                        onClick={() => onAnswerChange(q.id, opt, q.type)}
                        className={cn(
                          "relative flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200 group",
                          isChecked 
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-sm" 
                            : "border-linear-border hover:border-purple-300 dark:hover:border-purple-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <div className={cn(
                          "flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center transition-colors",
                          q.type === 'checkbox' ? "w-5 h-5 rounded border-2" : "w-5 h-5 rounded-full border-2",
                          isChecked ? "border-purple-500 bg-purple-500" : "border-slate-300 dark:border-slate-600 group-hover:border-purple-400"
                        )}>
                          {isChecked && (
                            q.type === 'checkbox' 
                              ? <CheckCircle2 className="w-4 h-4 text-white" />
                              : <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          isChecked ? "text-purple-900 dark:text-purple-100" : "text-foreground"
                        )}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
