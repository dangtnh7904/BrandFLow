"use client";

import React, { useState } from 'react';
import { Coffee, Laptop, BookOpen, Sparkles, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

const INDUSTRIES = [
 { id: 'fb', key: 'ind_fb', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
 { id: 'tech', key: 'ind_tech', icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
 { id: 'edu', key: 'ind_edu', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
 { id: 'cosmetics', key: 'ind_cosmetics', icon: Sparkles, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
 { id: 'other', key: 'ind_other', icon: LayoutGrid, color: 'text-linear-text-muted', bg: 'bg-background', border: 'border-linear-border' },
];

export default function WizardStep1() {
 const { t } = useLanguage();
 const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

 return (
 <div className="space-y-12">
 <div className="text-center mb-8">
 <h2 className="text-2xl font-bold text-foreground mb-2">{t('wizard.step1_title')}</h2>
 <p className="text-linear-text-muted text-sm max-w-lg mx-auto">{t('wizard.step1_desc')}</p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {INDUSTRIES.map((ind) => {
 const isSelected = selectedIndustry === ind.id;
 const Icon = ind.icon;
 return (
 <div 
 key={ind.id}
 onClick={() => setSelectedIndustry(ind.id)}
 className={cn(
 "relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2",
 isSelected 
 ? `${ind.bg} ${ind.border} shadow-sm scale-105` 
 : "bg-linear-surface border-linear-border hover:bg-linear-surface/80 hover:border-cyan-500/30"
 )}
 >
 <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", isSelected ? ind.bg : "bg-linear-surface/50 border border-linear-border")}>
 <Icon className={cn("w-6 h-6", isSelected ? ind.color : "text-linear-text-muted")} />
 </div>
 <h3 className={cn("font-bold text-lg mb-1", isSelected ? "text-foreground" : "text-foreground")}>
 {t(`wizard.${ind.key}` as any)}
 </h3>
 {isSelected && <CheckCircle2 className={cn("absolute top-6 right-6 w-6 h-6", ind.color)} />}
 </div>
 )
 })}
 </div>
 </div>
 );
}
