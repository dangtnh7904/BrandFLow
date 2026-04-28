import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import clsx from 'clsx';

interface InstructionAlertProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function InstructionAlert({ title, children, className }: InstructionAlertProps) {
  const { language } = useLanguage();
  const displayTitle = title || (language === 'vi' ? 'Hướng dẫn' : 'Instruction');
  return (
    <div className={clsx("print-hide bg-cyan-500/10 border-l-[3px] border-cyan-500/50 p-4 rounded-r-xl text-foreground text-sm flex gap-3 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] backdrop-blur-md relative overflow-hidden", className)}>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
      <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
      <div>
        <strong className="block font-bold mb-1 text-cyan-400 uppercase tracking-widest text-xs">{displayTitle}:</strong>
        <div className="text-linear-text-muted leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}
