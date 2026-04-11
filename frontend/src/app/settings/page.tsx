"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Key, CreditCard, Bell, Shield, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [apiKey, setApiKey] = useState('********************************');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8 border-b ultra-thin-border pb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Settings className="w-6 h-6 mr-3 text-slate-400" />
          {t('settings.title')}
        </h2>
        <p className="text-linear-text-muted">{t('settings.desc')}</p>
      </div>

      <div className="space-y-8">
         {/* Profile Section */}
         <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center"><User className="w-4 h-4 mr-2" /> {t('settings.profile')}</h3>
            <div className="bento-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-medium text-linear-text-muted mb-2 uppercase">{t('settings.org_name')}</label>
                  <input type="text" defaultValue="BrandFlow Team Alpha" placeholder={t('settings.org_name_ph')} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-white/30 transition-colors" />
               </div>
               <div>
                  <label className="block text-xs font-medium text-linear-text-muted mb-2 uppercase">{t('settings.admin_email')}</label>
                  <input type="email" defaultValue="admin@brandflow.ai" placeholder={t('settings.admin_email_ph')} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-slate-400 outline-none" disabled />
               </div>
            </div>
         </section>

         {/* Integrations & API Section */}
         <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center"><Key className="w-4 h-4 mr-2" /> {t('settings.security')}</h3>
            <div className="bento-card p-6 border-purple-500/10">
               <div className="mb-4">
                  <label className="block text-xs font-medium text-linear-text-muted mb-2 uppercase">OpenAI Secret Key</label>
                  <div className="flex">
                     <input 
                       type="password" 
                       value={apiKey} 
                       onChange={e => setApiKey(e.target.value)}
                       className="flex-1 bg-black/40 border border-white/10 rounded-l-lg px-4 py-2.5 text-white outline-none focus:border-purple-500/50 font-mono text-sm" 
                     />
                     <button className="bg-white/10 border border-l-0 border-white/10 rounded-r-lg px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors">Kiểm tra Kết nối</button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center"><Shield className="w-3 h-3 mr-1" /> Chìa khóa được mã hóa cục bộ. Tuyệt đối không chia sẻ cho bên thứ 3.</p>
               </div>
               
               <div className="flex items-center justify-between py-3 border-t ultra-thin-border">
                  <div>
                     <p className="text-sm font-semibold text-white">Anthropic Claude</p>
                     <p className="text-xs text-slate-500">Kích hoạt Sonnet 3.5 cho xử lý logic phức tạp.</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500">
                     <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                  </button>
               </div>
            </div>
         </section>

         {/* Billing Section */}
         <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center"><CreditCard className="w-4 h-4 mr-2" /> {t('settings.billing')}</h3>
            <div className="bento-card p-6 border-cyan-500/10">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h4 className="text-lg font-bold text-white mb-1">Gói Tối ưu (Pro)</h4>
                     <p className="text-sm text-cyan-400 font-medium">$99.00 / tháng</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-white/10 text-xs font-bold text-white">Hoạt động</span>
               </div>

               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-sm font-medium text-slate-300">Định mức sử dụng AI hàng tháng</span>
                     <span className="text-xs font-mono text-slate-400">450k / 1M Tokens</span>
                  </div>
                  <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-[45%]"></div>
                  </div>
               </div>

               <div className="mt-6 pt-6 border-t ultra-thin-border flex justify-end">
                  <button className="text-xs font-bold text-white px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Quản lý Đăng ký</button>
               </div>
            </div>
         </section>

         <div className="pt-4 flex justify-end">
            <button 
               onClick={handleSave}
               className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center ${isSaved ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white text-black hover:scale-105'}`}
            >
               {isSaved ? <><CheckCircle2 className="w-4 h-4 mr-2" /> {t('common.save')}</> : t('settings.save_profile')}
            </button>
         </div>
      </div>
    </div>
  );
}
