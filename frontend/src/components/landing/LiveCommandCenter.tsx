"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, LineChart, Target, Terminal, CheckCircle2, Megaphone, PenTool } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type LogEntry = {
  id: string;
  data: {
    agent: string;
    text: string;
    icon: any;
    color: string;
    bg: string;
  };
};

export default function LiveCommandCenter() {
  const { t } = useLanguage();
  
  const NOTIFICATIONS = [
    { agent: t('landing_live.agent1'), text: t('landing_live.msg1'), icon: LineChart, color: "text-blue-500", bg: "bg-blue-500/10" },
    { agent: t('landing_live.agent2'), text: t('landing_live.msg2'), icon: PenTool, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { agent: t('landing_live.agent3'), text: t('landing_live.msg3'), icon: Megaphone, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { agent: t('landing_live.agent4'), text: t('landing_live.msg4'), icon: BrainCircuit, color: "text-emerald-500", bg: "bg-emerald-500/10" }
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIndexRef = useRef(0);
  
  // Rotating Steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(stepInterval);
  }, []);

  // Friendly Notification Logs with stable IDs
  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogs((prev) => {
        // Prevent accidental duplicates in strict mode / hot reload
        if (prev.length > 0 && prev[prev.length - 1].data.text === NOTIFICATIONS[logIndexRef.current].text) {
          logIndexRef.current = (logIndexRef.current + 1) % NOTIFICATIONS.length;
        }
        
        const newLog = { 
          id: Math.random().toString(36).substring(2, 9), 
          data: NOTIFICATIONS[logIndexRef.current] 
        };
        
        const newLogs = [...prev, newLog];
        logIndexRef.current = (logIndexRef.current + 1) % NOTIFICATIONS.length;
        
        if (newLogs.length > 2) newLogs.shift();
        return newLogs;
      });
    }, 2200);
    return () => clearInterval(logInterval);
  }, [t]);

  return (
    <div className="w-full max-w-lg bento-card p-6 flex flex-col gap-6 relative overflow-hidden bg-linear-surface/80 backdrop-blur-xl border border-linear-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-10">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-linear-border/50 pb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-cyan-500" />
          <span className="font-bold text-sm tracking-widest text-foreground uppercase">{t('landing_live.agent_cortex')}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">{t('landing_live.online')}</span>
        </div>
      </div>

      {/* Agents Status */}
      <div className="space-y-4">
        <AgentStatusRow 
          name={t('landing_live.agent1')}
          icon={<LineChart className="w-4 h-4" />}
          isActive={activeStep === 0} 
          isDone={activeStep > 0} 
          color="bg-blue-500"
          processingText={t('landing_live.processing')}
        />
        <AgentStatusRow 
          name={t('landing_live.agent2')}
          icon={<Target className="w-4 h-4" />}
          isActive={activeStep === 1} 
          isDone={activeStep > 1} 
          color="bg-cyan-500"
          processingText={t('landing_live.processing')}
        />
        <AgentStatusRow 
          name={t('landing_live.agent3')}
          icon={<Terminal className="w-4 h-4" />}
          isActive={activeStep === 2} 
          isDone={activeStep > 2 || activeStep === 3} 
          color="bg-indigo-500"
          processingText={t('landing_live.processing')}
        />
      </div>

      {/* Friendly Notification Feed */}
      <div className="bg-linear-surface/40 rounded-xl p-3 min-h-[170px] overflow-hidden relative border border-linear-border shadow-inner flex flex-col justify-end">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-linear-surface/90 to-transparent z-10 pointer-events-none" />
        <AnimatePresence mode="popLayout">
          {logs.map((log) => {
            const Icon = log.data.icon;
            return (
              <motion.div 
                layout
                key={log.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className="flex items-center gap-3 p-3 bg-local-surface dark:bg-slate-900 rounded-lg border ultra-thin-border shadow-sm mb-2 z-0 shrink-0"
              >
                <div className={`p-2 rounded-lg shrink-0 ${log.data.bg}`}>
                  <Icon className={`w-4 h-4 ${log.data.color}`} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${log.data.color}`}>{log.data.agent}</span>
                  <span className="text-[11px] sm:text-xs text-foreground font-semibold line-clamp-2">{log.data.text}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}

function AgentStatusRow({ name, icon, isActive, isDone, color, processingText }: { name: string, icon: React.ReactNode, isActive: boolean, isDone: boolean, color: string, processingText: string }) {
  return (
    <div className={`p-3 rounded-xl border transition-all duration-300 flex flex-col gap-2 ${isActive ? 'bg-linear-surface shadow-md border-cyan-500/30' : 'bg-transparent border-transparent opacity-60'}`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${isActive ? 'text-foreground' : 'text-linear-text-muted'}`}>
          <div className={`p-1.5 rounded-lg ${isActive ? `${color}/10 text-${color.split('-')[1]}-500` : 'bg-linear-surface border border-linear-border'}`}>
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">{name}</span>
        </div>
        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        {isActive && !isDone && (
          <span className="text-[10px] font-mono text-cyan-500 animate-pulse font-bold tracking-wider">{processingText}</span>
        )}
      </div>

      {isActive && (
        <div className="h-1 w-full bg-linear-border rounded-full overflow-hidden mt-1">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4.5, ease: "linear" }}
            className={`h-full ${color}`}
          />
        </div>
      )}
    </div>
  );
}
