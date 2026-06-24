"use client";

import React, { useState } from 'react';
import { Lightbulb, Heart, Shield, Zap, Search, Globe, CheckCircle2, MessageSquareText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ARCHETYPES = [
  { id: 'innovator', title: { en: 'The Innovator', vi: 'Người Sáng tạo' }, desc: { en: 'Pushing boundaries and redefining the status quo.', vi: 'Phá vỡ giới hạn và tái định trạng.' }, icon: Lightbulb, color: 'text-amber-500' },
  { id: 'caregiver', title: { en: 'The Caregiver', vi: 'Người Chăm sóc' }, desc: { en: 'Nurturing, protecting, and putting customers first.', vi: 'Nuôi dưỡng, bảo vệ và đặt khách hàng lên hàng đầu.' }, icon: Heart, color: 'text-pink-500' },
  { id: 'hero', title: { en: 'The Hero', vi: 'Người Hùng' }, desc: { en: 'Overcoming challenges with courage and mastery.', vi: 'Vượt qua thử thách bằng lòng dũng cảm và bản lĩnh.' }, icon: Shield, color: 'text-blue-600' },
  { id: 'magician', title: { en: 'The Magician', vi: 'Phù thủy' }, desc: { en: 'Transforming situations with visionary power.', vi: 'Thay đổi cục diện bằng sức mạnh tầm nhìn.' }, icon: Zap, color: 'text-purple-500' },
  { id: 'sage', title: { en: 'The Sage', vi: 'Cố vấn triết gia' }, desc: { en: 'Seeking truth through wisdom and analytics.', vi: 'Tìm kiếm chân lý qua trí tuệ và phân tích.' }, icon: Search, color: 'text-blue-600' },
  { id: 'explorer', title: { en: 'The Explorer', vi: 'Nhà Thám hiểm' }, desc: { en: 'Discovering new frontiers and freedom.', vi: 'Khám phá những chân trời và tự do mới.' }, icon: Globe, color: 'text-orange-500' },
];

export default function WizardStep2() {
  const { t, language } = useLanguage();
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);
  const [visionText, setVisionText] = useState('');

  const toggleArchetype = (id: string) => {
    setSelectedArchetypes(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('wizard.step2_title')}</h2>
         <p className="text-slate-500 text-sm max-w-lg mx-auto">{t('wizard.step2_desc')}</p>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
           <label className="block text-sm font-bold text-slate-800">{t('wizard.step2_matrix')}</label>
           <span className="text-xs text-slate-500">{t('wizard.step2_select')}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {ARCHETYPES.map((arch) => {
             const isSelected = selectedArchetypes.includes(arch.id);
             return (
               <div 
                 key={arch.id}
                 onClick={() => toggleArchetype(arch.id)}
                 className={cn(
                   "relative p-4 rounded-xl cursor-pointer transition-all duration-200 border",
                   isSelected 
                     ? "bg-blue-50 border-blue-400 shadow-sm scale-[1.02]" 
                     : "bg-white border-slate-200 hover:bg-slate-50"
                 )}
               >
                 <arch.icon className={cn("w-6 h-6 mb-3", arch.color)} />
                 <h3 className="text-slate-900 font-bold mb-1">{arch.title[language] as string}</h3>
                 <p className="text-xs text-slate-500">{arch.desc[language] as string}</p>
                 {isSelected && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-blue-600" />}
               </div>
             )
           })}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <label className="text-lg font-bold text-slate-800 flex items-center mb-4">
           <MessageSquareText className="w-5 h-5 mr-2 text-blue-600" /> {t('wizard.step2_vision')}
        </label>
        <textarea
          rows={5}
          value={visionText}
          onChange={(e) => setVisionText(e.target.value)}
          placeholder={t('wizard.step2_vision_ph')}
          className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
