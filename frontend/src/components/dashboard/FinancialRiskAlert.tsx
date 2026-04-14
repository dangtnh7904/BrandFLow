import React from 'react';
import { AlertOctagon, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FinancialRiskAlert() {
 const { t } = useLanguage();
 return (
 <div className="bento-card col-span-1 md:col-span-1 lg:col-span-1 row-span-1 bg-gradient-to-br from-red-500/10 to-orange-500/5 border-red-500/20 hover:border-red-500/40">
 <div className="flex flex-col h-full justify-between">
 <div className="flex items-start justify-between">
 <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
 <AlertOctagon className="w-5 h-5" />
 </div>
 <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
 {t('dashboard_home.risk_warn')}
 </span>
 </div>

 <div className="mt-4">
 <h3 className="text-foreground text-lg font-bold mb-1">{t('dashboard_home.risk_title')}</h3>
 <p className="text-linear-text-muted text-xs leading-relaxed mb-4">
 {t('dashboard_home.risk_desc')}
 </p>
 
 <button className="flex items-center text-xs font-semibold text-red-600 hover:text-red-500 transition-colors">
 {t('dashboard_home.risk_btn')} <ArrowUpRight className="w-3 h-3 ml-1" />
 </button>
 </div>
 </div>
 </div>
 );
}
