"use client";

import React, { useState } from 'react';
import { ShieldAlert, BarChart3, TrendingUp, MessageSquareText, Store, Crosshair, Monitor, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

const THREAT_OPTIONS = [
 { id: 'local', title: { en: 'Local Shops', vi: 'Đối thủ Địa phương' }, desc: { en: 'Direct physical competitors in your area.', vi: 'Đối thủ cạnh tranh trực tiếp trong khu vực.' }, icon: Store },
 { id: 'bigbox', title: { en: 'Big Box Retailers', vi: 'Chuỗi Bán lẻ Lớn' }, desc: { en: 'Massive chains with low prices.', vi: 'Các chuỗi bán lẻ khổng lồ với lợi thế giá rẻ.' }, icon: Crosshair },
 { id: 'online', title: { en: 'Online Discounters', vi: 'Cửa hàng Online' }, desc: { en: 'E-commerce racing to the bottom on price.', vi: 'Sàn thương mại điện tử cạnh tranh khốc liệt về giá.' }, icon: Monitor },
 { id: 'recession', title: { en: 'Economic Downturn', vi: 'Suy thoái Kinh tế' }, desc: { en: 'Overall reduction in consumer spending.', vi: 'Sự sụt giảm sức mua chung trên thị trường.' }, icon: TrendingDown },
];

const PAIN_POINTS = [
 { id: "p1", label: { en: "High Prices", vi: "Giá quá cao" } },
 { id: "p2", label: { en: "Poor Customer Service", vi: "Dịch vụ tồi" } },
 { id: "p3", label: { en: "Slow Delivery", vi: "Giao hàng chậm" } },
 { id: "p4", label: { en: "Complicated UX", vi: "Sử dụng phức tạp" } },
 { id: "p5", label: { en: "Lack of Customization", vi: "Thiếu cá nhân hóa" } },
 { id: "p6", label: { en: "Hidden Fees", vi: "Phí ẩn" } },
 { id: "p7", label: { en: "Unreliable Quality", vi: "Chất lượng kém" } },
 { id: "p8", label: { en: "Outdated Tech", vi: "Công nghệ lỗi thời" } }
];

export default function WizardStep3() {
 const { t, language } = useLanguage();
 const [primaryThreat, setPrimaryThreat] = useState<string | null>(null);
 const [selectedPains, setSelectedPains] = useState<string[]>([]);
 const [revenue, setRevenue] = useState(50000);
 const [objective, setObjective] = useState('steady');
 const [businessNote, setBusinessNote] = useState('');

 const togglePain = (id: string) => {
 setSelectedPains(prev => 
 prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
 );
 };

 const formatCurrency = (val: number) => {
 return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
 };

 return (
 <div className="space-y-12">
 <div className="text-center mb-8">
 <h2 className="text-2xl font-bold text-foreground mb-2">{t('wizard.step3_title')}</h2>
 <p className="text-linear-text-muted text-sm max-w-lg mx-auto">{t('wizard.step3_desc')}</p>
 </div>

 {/* Threat Selection */}
 <div>
 <label className="text-lg font-bold text-foreground flex items-center mb-6">
 <ShieldAlert className="w-5 h-5 mr-2 text-red-600" /> {t('wizard.step3_q1')}
 </label>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {THREAT_OPTIONS.map((option) => {
 const isSelected = primaryThreat === option.id;
 const Icon = option.icon;
 return (
 <div 
 key={option.id}
 onClick={() => setPrimaryThreat(option.id)}
 className={cn(
 "relative p-4 rounded-xl cursor-pointer transition-all duration-200 border flex items-start",
 isSelected 
 ? "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/50 shadow-sm scale-[1.02]" 
 : "bg-linear-surface border-linear-border hover:bg-linear-surface/80 hover:border-cyan-500/30 dark:hover:border-slate-600"
 )}
 >
 <Icon className={cn("w-6 h-6 mt-1", isSelected ? "text-red-500" : "text-linear-text-muted")} />
 <div className="ml-4">
 <h3 className="text-foreground font-bold mb-1">{option.title[language] as string}</h3>
 <p className="text-xs text-linear-text-muted">{option.desc[language] as string}</p>
 </div>
 </div>
 )
 })}
 </div>
 </div>

 {/* Pain Points */}
 <div className="pt-8 border-t border-linear-border">
 <div className="mb-6">
 <label className="block text-lg font-bold text-foreground">{t('wizard.step3_q2')}</label>
 <p className="text-xs text-linear-text-muted mt-1">{t('wizard.step3_q2_desc')}</p>
 </div>
 <div className="flex flex-wrap gap-3">
 {PAIN_POINTS.map((painObj) => {
 const isSelected = selectedPains.includes(painObj.id);
 return (
 <button
 key={painObj.id}
 onClick={() => togglePain(painObj.id)}
 className={cn(
 "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
 isSelected 
 ? "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/50 shadow-sm" 
 : "bg-linear-surface text-linear-text-muted border-linear-border hover:border-cyan-500/30"
 )}
 >
 {painObj.label[language] as string}
 </button>
 );
 })}
 </div>
 </div>

 {/* Revenue & Objectives */}
 <div className="pt-8 border-t border-linear-border">
 <div className="flex justify-between items-end mb-6">
 <label className="text-lg font-bold text-foreground flex items-center">
 <BarChart3 className="w-5 h-5 mr-2 text-blue-600" /> {t('wizard.step3_q3')}
 </label>
 <span className="text-2xl font-bold text-blue-600 font-mono tracking-tight">{formatCurrency(revenue)}</span>
 </div>
 
 <div className="relative pt-4 pb-8 mb-6">
 <input 
 type="range" 
 min="1000" 
 max="500000" 
 step="1000"
 value={revenue} 
 onChange={(e) => setRevenue(Number(e.target.value))}
 className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
 />
 <div className="flex justify-between items-center text-xs text-linear-text-muted mt-4">
 <span>$1k</span>
 <span>$250k</span>
 <span>$500k+</span>
 </div>
 </div>

 <div className="flex p-1 bg-linear-surface/50 border border-linear-border border border-linear-border rounded-xl">
 <button 
 onClick={() => setObjective('survival')}
 className={cn("flex-1 py-3 text-sm font-semibold rounded-lg transition-all", objective === 'survival' ? "bg-linear-surface text-foreground shadow-sm border border-linear-border" : "text-linear-text-muted hover:text-foreground")}
 >
 {t('wizard.step3_mode1')}
 </button>
 <button 
 onClick={() => setObjective('steady')}
 className={cn("flex-1 py-3 text-sm font-semibold rounded-lg transition-all", objective === 'steady' ? "bg-linear-surface text-foreground shadow-sm border border-linear-border" : "text-linear-text-muted hover:text-foreground")}
 >
 {t('wizard.step3_mode2')}
 </button>
 <button 
 onClick={() => setObjective('aggressive')}
 className={cn("flex-1 py-3 text-sm font-semibold rounded-lg transition-all", objective === 'aggressive' ? "bg-linear-surface text-foreground shadow-sm border border-linear-border" : "text-linear-text-muted hover:text-foreground")}
 >
 {t('wizard.step3_mode3')}
 </button>
 </div>
 </div>

 {/* Additional Chat Box */}
 <div className="pt-8 border-t border-linear-border">
 <label className="text-lg font-bold text-foreground flex items-center mb-4">
 <MessageSquareText className="w-5 h-5 mr-2 text-blue-500" /> {t('wizard.step3_note')}
 </label>
 <textarea
 rows={4}
 value={businessNote}
 onChange={(e) => setBusinessNote(e.target.value)}
 placeholder={t('wizard.step3_note_ph')}
 className="w-full px-4 py-3 bg-linear-surface text-foreground border border-linear-border rounded-xl shadow-sm focus:bg-white dark:focus:bg-[#0B1120] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500/50 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400"
 />
 </div>
 </div>
 );
}
