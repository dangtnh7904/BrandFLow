"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Link as LinkIcon, FileText, CheckCircle2, Globe, Share2, Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Screen1_Source({ onNext }: { onNext: (path: 'wizard' | 'dashboard') => void }) {
  const { t } = useLanguage();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  
  // UI States for dynamic fields
  const [isDragging, setIsDragging] = useState(false);
  const [socialLinks, setSocialLinks] = useState(['']);
  const [webLinks, setWebLinks] = useState(['']);

  const CARDS = [
    {
      id: 'upload',
      title: t('screen1.upload'),
      description: t('screen1.upload_desc'),
      icon: UploadCloud,
    },
    {
      id: 'web',
      title: t('screen1.web'),
      description: t('screen1.web_desc'),
      icon: LinkIcon,
    },
    {
      id: 'questionnaire',
      title: t('screen1.form'),
      description: t('screen1.form_desc'),
      icon: FileText,
    }
  ];

  const toggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleProceed = () => {
    if (selectedSources.includes('questionnaire')) {
       onNext('wizard');
    } else {
       onNext('dashboard');
    }
  };

  const updateArray = (arr: string[], setArr: any, index: number, val: string) => {
     const newArr = [...arr];
     newArr[index] = val;
     setArr(newArr);
  };
  const addToArray = (arr: string[], setArr: any) => {
     if (arr.length < 5) setArr([...arr, '']);
  };
  const removeFromArray = (arr: string[], setArr: any, index: number) => {
     if (arr.length > 1) {
        const newArr = [...arr];
        newArr.splice(index, 1);
        setArr(newArr);
     }
  };

  return (
    <div className="flex flex-col items-center p-8 max-w-5xl mx-auto w-full h-full overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 shrink-0"
      >
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">{t('screen1.title')}</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">{t('screen1.desc')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8 shrink-0">
        {CARDS.map((card, idx) => {
          const isSelected = selectedSources.includes(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => toggleSource(card.id)}
              className={cn(
                "relative group flex flex-col p-6 rounded-2xl cursor-pointer transition-all duration-300 border ultra-thin-border backdrop-blur-md shadow-sm",
                isSelected 
                  ? "bg-emerald-50 border-emerald-500/50 shadow-md scale-[1.02]" 
                  : "bg-white hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", isSelected ? "bg-emerald-100" : "bg-slate-100 group-hover:bg-slate-200")}>
                <card.icon className={cn("w-6 h-6", isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600")} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
              
              {isSelected && (
                <div className="absolute top-4 right-4 text-emerald-500">
                   <CheckCircle2 className="w-5 h-5 animate-in fade-in" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="w-full flex-1 flex flex-col items-center">
         <AnimatePresence mode="popLayout">
            {selectedSources.includes('upload') && (
               <motion.div 
                 key="upload-zone"
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="w-full mb-6 overflow-hidden"
               >
                 <div 
                   className={cn("w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors h-48", isDragging ? "bg-emerald-50 border-emerald-400" : "bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100")}
                   onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                   onDragLeave={() => setIsDragging(false)}
                   onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
                 >
                     <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                     <p className="text-slate-800 font-bold mb-1">{t('screen1.upload_zone')}</p>
                     <p className="text-xs text-slate-500">{t('screen1.upload_zone_desc')}</p>
                 </div>
               </motion.div>
            )}

            {selectedSources.includes('web') && (
               <motion.div 
                 key="web-zone"
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="w-full mb-6 overflow-hidden"
               >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                    {/* Social Logic */}
                    <div>
                        <label className="text-sm font-bold text-slate-800 flex items-center mb-4">
                           <Share2 className="w-4 h-4 mr-2 text-blue-500" /> {t('screen1.social')}
                        </label>
                        <div className="space-y-3">
                           {socialLinks.map((link, idx) => (
                             <div key={idx} className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={link}
                                  onChange={(e) => updateArray(socialLinks, setSocialLinks, idx, e.target.value)}
                                  placeholder="Đường dẫn Facebook, LinkedIn..." 
                                  className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500/50 shadow-sm" 
                                />
                                {socialLinks.length > 1 && (
                                   <button onClick={() => removeFromArray(socialLinks, setSocialLinks, idx)} className="px-3 rounded-lg bg-white text-slate-400 hover:text-red-500 border border-slate-300 shadow-sm"><X className="w-4 h-4" /></button>
                                )}
                             </div>
                           ))}
                           {socialLinks.length < 5 && (
                             <button onClick={() => addToArray(socialLinks, setSocialLinks)} className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center"><Plus className="w-3 h-3 mr-1" /> {t('screen1.social_btn')}</button>
                           )}
                        </div>
                    </div>

                    {/* Web Logic */}
                    <div>
                        <label className="text-sm font-bold text-slate-800 flex items-center mb-4">
                           <Globe className="w-4 h-4 mr-2 text-emerald-500" /> {t('screen1.website')}
                        </label>
                        <div className="space-y-3">
                           {webLinks.map((link, idx) => (
                             <div key={idx} className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={link}
                                  onChange={(e) => updateArray(webLinks, setWebLinks, idx, e.target.value)}
                                  placeholder="Domain chính hoặc chiến dịch LP..." 
                                  className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500/50 shadow-sm" 
                                />
                                {webLinks.length > 1 && (
                                   <button onClick={() => removeFromArray(webLinks, setWebLinks, idx)} className="px-3 rounded-lg bg-white text-slate-400 hover:text-red-500 border border-slate-300 shadow-sm"><X className="w-4 h-4" /></button>
                                )}
                             </div>
                           ))}
                           {webLinks.length < 5 && (
                             <button onClick={() => addToArray(webLinks, setWebLinks)} className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 flex items-center"><Plus className="w-3 h-3 mr-1" /> {t('screen1.website_btn')}</button>
                           )}
                        </div>
                    </div>
                 </div>
               </motion.div>
            )}
         </AnimatePresence>

         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md mt-auto pt-8 pb-4"
         >
           <button 
              onClick={handleProceed}
              disabled={selectedSources.length === 0}
              className={cn(
                "w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300",
                selectedSources.length > 0 
                  ? "gradient-ai-bg text-white hover:scale-[1.02]" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              )}
           >
             {t('screen1.btn')}
           </button>
         </motion.div>
      </div>
    </div>
  );
}
