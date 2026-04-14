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
 <div className="w-full h-full overflow-y-auto">
 <div className="flex flex-col p-8 max-w-4xl mx-auto w-full min-h-full">
 <div className="mb-8 border-b border-linear-border pb-6">
 <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
 <Settings className="w-6 h-6 mr-3 text-linear-text-muted" />
 {t('settings.title')}
 </h2>
 <p className="text-linear-text-muted">{t('settings.desc')}</p>
 </div>

 <div className="space-y-8">
 {/* Profile Section */}
 <section>
 <h3 className="text-sm font-bold uppercase tracking-widest text-linear-text-muted mb-4 flex items-center"><User className="w-4 h-4 mr-2" /> {t('settings.profile')}</h3>
 <div className="bento-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-linear-surface border border-linear-border shadow-sm">
 <div>
 <label className="block text-xs font-bold text-linear-text-muted mb-2 uppercase">{t('settings.org_name')}</label>
 <input type="text" defaultValue="BrandFlow Team Alpha" placeholder={t('settings.org_name_ph')} className="w-full bg-background border border-linear-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:border-slate-400 focus:bg-white transition-colors" />
 </div>
 <div>
 <label className="block text-xs font-bold text-linear-text-muted mb-2 uppercase">{t('settings.admin_email')}</label>
 <input type="email" defaultValue="admin@brandflow.ai" placeholder={t('settings.admin_email_ph')} className="w-full bg-linear-surface/50 border border-linear-border border border-linear-border rounded-lg px-4 py-2.5 text-linear-text-muted outline-none" disabled />
 </div>
 </div>
 </section>

 {/* Integrations & API Section */}
 <section>
 <h3 className="text-sm font-bold uppercase tracking-widest text-linear-text-muted mb-4 flex items-center"><Key className="w-4 h-4 mr-2" /> {t('settings.security')}</h3>
 <div className="bento-card p-6 bg-linear-surface border border-linear-border shadow-sm relative overflow-hidden">
 <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
 <div className="mb-4">
 <label className="block text-xs font-bold text-linear-text-muted mb-2 uppercase">OpenAI Secret Key</label>
 <div className="flex shadow-sm rounded-lg overflow-hidden border border-linear-border">
 <input 
 type="password" 
 value={apiKey} 
 onChange={e => setApiKey(e.target.value)}
 className="flex-1 bg-background px-4 py-2.5 text-foreground outline-none focus:bg-white font-mono text-sm border-r border-linear-border" 
 />
 <button className="bg-linear-surface/50 border border-linear-border hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-foreground transition-colors">Kiểm tra Kết nối</button>
 </div>
 <p className="text-xs text-linear-text-muted mt-2 flex items-center"><Shield className="w-3 h-3 mr-1" /> Chìa khóa được mã hóa cục bộ. Tuyệt đối không chia sẻ cho bên thứ 3.</p>
 </div>
 
 <div className="flex items-center justify-between py-3 mt-4 border-t border-linear-border">
 <div>
 <p className="text-sm font-bold text-foreground">Anthropic Claude</p>
 <p className="text-xs text-linear-text-muted">Kích hoạt Sonnet 3.5 cho xử lý logic phức tạp.</p>
 </div>
 <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500">
 <span className="inline-block h-4 w-4 transform translate-x-5 rounded-full bg-linear-surface transition" />
 </button>
 </div>
 </div>
 </section>

 {/* Billing Section */}
 <section>
 <h3 className="text-sm font-bold uppercase tracking-widest text-linear-text-muted mb-4 flex items-center"><CreditCard className="w-4 h-4 mr-2" /> {t('settings.billing')}</h3>
 <div className="bento-card p-6 bg-linear-surface border border-linear-border shadow-sm relative overflow-hidden">
 <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
 <div className="flex justify-between items-start mb-6">
 <div>
 <h4 className="text-lg font-bold text-foreground mb-1">Gói Tối ưu (Pro)</h4>
 <p className="text-sm text-cyan-600 font-bold">$99.00 / tháng</p>
 </div>
 <span className="px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">Hoạt động</span>
 </div>

 <div>
 <div className="flex justify-between items-end mb-2">
 <span className="text-sm font-bold text-foreground">Định mức sử dụng AI hàng tháng</span>
 <span className="text-xs font-mono font-semibold text-linear-text-muted">450k / 1M Tokens</span>
 </div>
 <div className="h-2 w-full bg-linear-surface/50 border border-linear-border rounded-full overflow-hidden shadow-inner border border-linear-border">
 <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-[45%]"></div>
 </div>
 </div>

 <div className="mt-6 pt-6 border-t border-linear-border flex justify-end">
 <button className="text-xs font-bold text-linear-text-muted px-4 py-2 bg-linear-surface/50 border border-linear-border border border-linear-border rounded-lg hover:bg-slate-200 transition-colors">Quản lý Đăng ký</button>
 </div>
 </div>
 </section>

 <div className="pt-4 flex justify-end">
 <button 
 onClick={handleSave}
 className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center border ${isSaved ? 'bg-blue-500 border-blue-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02]'}`}
 >
 {isSaved ? <><CheckCircle2 className="w-4 h-4 mr-2" /> {t('common.save')}</> : t('settings.save_profile')}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
