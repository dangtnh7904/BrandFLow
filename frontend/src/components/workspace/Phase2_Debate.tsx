"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle2, XCircle, AlertTriangle, FileText, ArrowLeft, Activity, Scissors, TrendingDown, ShieldCheck, Cpu } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

// ... (Will include BudgetCutHighlight here, same as before)
function BudgetCutHighlight({ text }: { text: string }) {
  const cutPattern = /(Cắt hẳn|Ép giá|cut|reduce|cắt|giảm):\s*(.+?)(?:\s*\(-?([\d,.]+)\s*VND\))/gi;
  const matches = [...text.matchAll(cutPattern)];

  if (matches.length === 0) return <span>{text}</span>;

  let lastIndex = 0;
  const parts: React.ReactNode[] = [];

  matches.forEach((match, idx) => {
    const beforeText = text.slice(lastIndex, match.index);
    if (beforeText) parts.push(<span key={`before-${idx}`}>{beforeText}</span>);

    const action = match[1];
    const itemName = match[2];
    const amount = match[3];
    const isCut = action.toLowerCase().includes('cắt') || action.toLowerCase().includes('cut');

    parts.push(
      <span key={`cut-${idx}`} className="relative inline-flex items-center group cursor-help mx-1">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${
            isCut
              ? 'bg-red-500/15 text-red-400 border border-red-500/20'
              : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
          }`}
        >
          {isCut ? <XCircle className="w-3 h-3" /> : <Scissors className="w-3 h-3" />}
          <span className={isCut ? 'line-through decoration-red-500/80' : ''}>
            {itemName.trim()}
          </span>
          <span className="font-mono opacity-70">-{amount}đ</span>
        </motion.span>
      </span>
    );
    lastIndex = (match.index || 0) + match[0].length;
  });

  const remaining = text.slice(lastIndex);
  if (remaining) parts.push(<span key="remaining">{remaining}</span>);
  return <>{parts}</>;
}

export default function Phase2_Debate({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { t } = useLanguage();
  const { debateLogs, runDebateAndPlanning } = useFormStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const initDebate = async () => {
      setIsFetching(true);
      if (!debateLogs || debateLogs.length === 0) {
        await runDebateAndPlanning();
      }
      if (isMounted) setIsFetching(false);
    };
    initDebate();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (isFetching || !debateLogs || debateLogs.length === 0) return;

    let i = 0;
    const isDemo = typeof window !== 'undefined' && (window as any).__DEMO_MODE__;
    const intervalTime = isDemo ? 500 : 1800;
    const lockDelay = isDemo ? 1000 : 1500;

    const interval = setInterval(() => {
      if (i < debateLogs.length) {
        const log = debateLogs[i];
        const isBudgetCut = (log.message || '').match(/(Cắt hẳn|Ép giá|cut|reduce)/i);
        const type = (log.message || '').toLowerCase().includes("cảnh báo")
          ? 'warning'
          : isBudgetCut ? 'budget_cut' : 'proposal';

        setMessages(prev => {
          if (prev.length > i) return prev;
          return [...prev, {
            id: i,
            agent: log.agent || 'SYSTEM',
            type: log.type || type,
            text: log.message || ''
          }];
        });
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsLocked(true), lockDelay);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isFetching, debateLogs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const getAgentTheme = (agent: string, type: string) => {
    if (type === 'warning') return { bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-400', iconBg: 'bg-red-500/20', icon: AlertTriangle };
    if (type === 'budget_cut') return { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/20', icon: Scissors };
    if (agent === 'CMO') return { bg: 'bg-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400', iconBg: 'bg-blue-500/20', icon: Bot };
    if (agent === 'Customer') return { bg: 'bg-cyan-500/5', border: 'border-cyan-500/20', text: 'text-cyan-400', iconBg: 'bg-cyan-500/20', icon: Bot };
    if (agent === 'CFO') return { bg: 'bg-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400', iconBg: 'bg-orange-500/20', icon: TrendingDown };
    if (agent === 'COO') return { bg: 'bg-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-400', iconBg: 'bg-purple-500/20', icon: Bot };
    if (agent === 'SALES') return { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20', icon: Bot };
    return { bg: 'bg-slate-800/20', border: 'border-linear-border', text: 'text-foreground', iconBg: 'bg-slate-800/50 border border-linear-border', icon: ShieldCheck };
  };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case 'rejected': return <span className="flex items-center text-[9px] uppercase font-bold text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded ml-2 border border-red-800/50"><XCircle className="w-2.5 h-2.5 mr-1" /> REJECTED</span>;
      case 'warning': return <span className="flex items-center text-[9px] uppercase font-bold text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded ml-2 border border-orange-800/50"><AlertTriangle className="w-2.5 h-2.5 mr-1" /> WARNING</span>;
      case 'budget_cut': return <span className="flex items-center text-[9px] uppercase font-bold text-amber-400 bg-amber-900/30 px-1.5 py-0.5 rounded ml-2 border border-amber-800/50"><Scissors className="w-2.5 h-2.5 mr-1" /> CUT</span>;
      case 'approved': return <span className="flex items-center text-[9px] uppercase font-bold text-cyan-400 bg-cyan-900/30 px-1.5 py-0.5 rounded ml-2 border border-cyan-800/50"><CheckCircle2 className="w-2.5 h-2.5 mr-1" /> APPROVED</span>;
      default: return null;
    }
  };

  const currentMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const historyMsgs = messages.slice(0, -1);

  return (
    <div className="w-full h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] flex flex-col relative bg-transparent overflow-hidden">
      
      {/* Header */}
      <div className="flex-none p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-linear-text-muted hover:text-foreground transition-colors flex items-center text-sm font-semibold bento-card !py-2 !px-4 !rounded-lg !shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-slate-900/50 border border-slate-700/50 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
            <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Agent Network Active</span>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-heading tracking-tight">{t('workspace_phase2.title' as any) as string}</h2>
          <p className="text-linear-text-muted text-sm md:text-base font-medium max-w-2xl mx-auto">{t('workspace_phase2.desc' as any) as string}</p>
        </div>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Panel: Active Speaker Spotlight */}
        <div className="w-full lg:w-3/5 h-full flex flex-col relative">
          <div className="flex-1 bento-card border border-linear-border/50 relative overflow-hidden flex flex-col bg-slate-900/40 shadow-2xl rounded-2xl">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-3/4 h-3/4 bg-cyan-500/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-1/2 h-1/2 bg-blue-500/10 blur-[80px] rounded-full"></div>
            </div>

            <div className="p-4 border-b border-linear-border/40 bg-slate-900/60 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live Analysis Node</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-10">
              {isFetching ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-linear-surface border border-linear-border flex items-center justify-center shadow-lg relative overflow-hidden">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-transparent border-t-cyan-500 rounded-2xl"></motion.div>
                    <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
                  </div>
                  <div className="text-sm font-bold text-cyan-500 tracking-widest uppercase animate-pulse">Initializing Sub-Agents...</div>
                </div>
              ) : !currentMsg && !isLocked ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex space-x-2">
                    {[1, 2, 3].map(i => (
                      <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="w-3 h-3 rounded-full bg-cyan-500" />
                    ))}
                  </div>
                  <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">Awaiting Output...</div>
                </div>
              ) : currentMsg && !isLocked ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMsg.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${getAgentTheme(currentMsg.agent, currentMsg.type).iconBg} flex items-center justify-center border border-white/10 shadow-lg relative`}>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                        {React.createElement(getAgentTheme(currentMsg.agent, currentMsg.type).icon, { className: `w-7 h-7 ${getAgentTheme(currentMsg.agent, currentMsg.type).text}` })}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className={`text-xl font-black uppercase tracking-wider ${getAgentTheme(currentMsg.agent, currentMsg.type).text}`}>{currentMsg.agent} Agent</h3>
                          {getStatusBadge(currentMsg.type)}
                        </div>
                        <p className="text-xs font-mono text-slate-500">Executing evaluation protocol...</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      <div className={`text-lg md:text-xl font-medium leading-relaxed text-foreground whitespace-pre-wrap ${currentMsg.type === 'budget_cut' ? 'text-amber-100' : ''}`}>
                        <BudgetCutHighlight text={currentMsg.text} />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : isLocked ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full"
                >
                  <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Debate Concluded</h3>
                  <p className="text-slate-400 mb-8 max-w-sm">All sub-agents have reached consensus. The strategic plan is ready for final review.</p>
                  <button onClick={onNext} className="px-8 py-3 rounded-xl gradient-ai-bg font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center">
                    Proceed to Execution
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                  </button>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Panel: Debate Transcript */}
        <div className="w-full lg:w-2/5 h-64 lg:h-full flex flex-col bg-slate-900/30 border border-linear-border/40 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-3 border-b border-linear-border/30 bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Communication Log</span>
            <span className="text-[10px] font-mono text-slate-500">{historyMsgs.length} Entries</span>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
          >
            <AnimatePresence initial={false}>
              {historyMsgs.map((msg) => {
                const theme = getAgentTheme(msg.agent, msg.type);
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    className={`p-3 rounded-xl border ${theme.border} ${theme.bg} flex gap-3 opacity-60 hover:opacity-100 transition-opacity`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${theme.iconBg} flex items-center justify-center shrink-0`}>
                      {React.createElement(theme.icon, { className: \`w-4 h-4 \${theme.text}\` })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold uppercase ${theme.text}`}>{msg.agent}</span>
                        <span className="text-[9px] font-mono text-slate-600">Archived</span>
                      </div>
                      <div className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {historyMsgs.length === 0 && !isFetching && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                <Activity className="w-6 h-6 mb-2 opacity-50" />
                <p>No archived logs yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
