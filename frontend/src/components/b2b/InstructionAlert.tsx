import React from 'react';
import { Lightbulb } from 'lucide-react';
import clsx from 'clsx';

interface InstructionAlertProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function InstructionAlert({ title = "Hướng dẫn", children, className }: InstructionAlertProps) {
  return (
    <div className={clsx("bg-blue-50/50 border-l-[3px] border-blue-400 p-4 rounded-r-lg text-blue-800 text-sm flex gap-3 shadow-sm", className)}>
      <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
      <div>
        <strong className="block font-semibold mb-1 text-blue-900">{title}:</strong>
        <div className="text-blue-800/90 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}
