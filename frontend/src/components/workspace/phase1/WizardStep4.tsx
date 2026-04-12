"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Target, PieChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PointData = { awareness: number; sales: number; retention: number };

export default function WizardStep4() {
  const { t } = useLanguage();
  const [points, setPoints] = useState<PointData>({
    awareness: 40,
    sales: 40,
    retention: 20
  });

  // Reference to avoid infinite loops during rapid sliding
  const isUpdating = useRef(false);

  const handleSliderChange = (key: keyof PointData, value: number) => {
    if (isUpdating.current) return;
    isUpdating.current = true;

    setPoints(prev => {
      const oldVal = prev[key];
      const diff = value - oldVal;

      const keys: (keyof PointData)[] = ['awareness', 'sales', 'retention'];
      const otherKeys = keys.filter(k => k !== key);
      
      let o1 = prev[otherKeys[0]];
      let o2 = prev[otherKeys[1]];

      if (diff > 0) {
        // We are increasing this slider, so we must decrease others
        // If we want to increase by X, can we? Max limit is 100
        let actualDiff = diff;
        if (o1 + o2 < actualDiff) {
            actualDiff = o1 + o2; // Cap the diff if not enough points
        }
        
        let split1 = Math.round(actualDiff / 2);
        let split2 = actualDiff - split1;

        if (o1 < split1) {
            split2 += (split1 - o1);
            split1 = o1;
        } else if (o2 < split2) {
            split1 += (split2 - o2);
            split2 = o2;
        }

        return {
            ...prev,
            [key]: oldVal + actualDiff,
            [otherKeys[0]]: o1 - split1,
            [otherKeys[1]]: o2 - split2
        };
      } else {
        // We are decreasing this slider, distribute the given points back
        const absDiff = Math.abs(diff);
        let split1 = Math.round(absDiff / 2);
        let split2 = absDiff - split1;

        return {
            ...prev,
            [key]: value,
            [otherKeys[0]]: o1 + split1,
            [otherKeys[1]]: o2 + split2
        };
      }
    });

    isUpdating.current = false;
  };

  const totalPoints = points.awareness + points.sales + points.retention;

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('wizard.step4_title')}</h2>
         <p className="text-slate-500 text-sm max-w-lg mx-auto">{t('wizard.step4_desc')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
         {/* Visual Pie Representation */}
         <div className="w-48 h-48 rounded-full border-8 border-slate-100 relative flex items-center justify-center shadow-lg overflow-hidden shrink-0 bg-white">
             <div className="text-center z-10 bg-white/90 p-4 rounded-full backdrop-blur-sm border border-slate-200 shadow-sm">
                <span className="block text-3xl font-black text-slate-800">{totalPoints}</span>
                <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">{t('wizard.step4_valid')}</span>
             </div>
             
             {/* Simple CSS conic gradient to represent the pie */}
             <div 
               className="absolute inset-0 opacity-40"
               style={{
                 background: `conic-gradient(#a855f7 0 ${(points.awareness)}%, #22d3ee ${(points.awareness)}% ${(points.awareness + points.sales)}%, #10b981 ${(points.awareness + points.sales)}% 100%)`
               }}
             />
         </div>

         {/* Sliders Area */}
         <div className="flex-1 w-full space-y-8">
            <div>
               <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center">
                    <div className="w-3 h-3 rounded-sm bg-purple-500 mr-2"></div> {t('wizard.step4_brand')}
                  </label>
                  <span className="text-lg font-mono font-bold text-purple-600">{points.awareness}</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={points.awareness} 
                 onChange={(e) => handleSliderChange('awareness', Number(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
               />
            </div>

            <div>
               <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center">
                    <div className="w-3 h-3 rounded-sm bg-blue-400 mr-2"></div> {t('wizard.step4_sales')}
                  </label>
                  <span className="text-lg font-mono font-bold text-blue-600">{points.sales}</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={points.sales} 
                 onChange={(e) => handleSliderChange('sales', Number(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-400"
               />
            </div>

            <div>
               <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center">
                    <div className="w-3 h-3 rounded-sm bg-blue-500 mr-2"></div> {t('wizard.step4_crm')}
                  </label>
                  <span className="text-lg font-mono font-bold text-blue-600">{points.retention}</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={points.retention} 
                 onChange={(e) => handleSliderChange('retention', Number(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
               />
            </div>
         </div>
      </div>

      <div className="bento-card bg-slate-50 border border-slate-200 p-6 text-center">
         <Target className="w-8 h-8 mx-auto text-slate-400 mb-3" />
         <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            {t('wizard.step4_note')}
         </p>
      </div>
    </div>
  );
}
