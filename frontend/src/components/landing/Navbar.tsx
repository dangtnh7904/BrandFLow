"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/50 dark:bg-[#0B1120]/50 backdrop-blur-lg border-b ultra-thin-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <BrandFlowLogo className="w-10 h-10" />
          <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-cyan-500">
            Brand<span className="text-cyan-500">F</span>low
          </span>
        </Link>
 
 <div className="hidden md:flex items-center space-x-8">
 <Link href="#services" className="text-sm font-medium text-linear-text-muted hover:text-foreground transition-colors">{t('landing_nav.services')}</Link>
 <Link href="#pricing" className="text-sm font-medium text-linear-text-muted hover:text-foreground transition-colors">{t('landing_nav.pricing')}</Link>
 <Link href="#about" className="text-sm font-medium text-linear-text-muted hover:text-foreground transition-colors">{t('landing_nav.about')}</Link>
 </div>

 <div className="flex items-center space-x-3 sm:space-x-4">
 <div className="hidden sm:flex bg-background/50 rounded-full p-1 border ultra-thin-border h-9 items-center">
   <button 
     onClick={toggleLanguage}
     className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center ${language === 'en' ? "bg-linear-surface text-cyan-400 shadow-sm border border-cyan-500/20" : "text-linear-text-muted hover:text-foreground"}`}
   >🇺🇸 EN</button>
   <button 
     onClick={toggleLanguage}
     className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center ${language === 'vi' ? "bg-linear-surface text-cyan-400 shadow-sm border border-cyan-500/20" : "text-linear-text-muted hover:text-foreground"}`}
   >🇻🇳 VI</button>
 </div>
 <ThemeToggle />
 <Link href="/onboarding" className="text-sm font-medium text-foreground hover:text-blue-600 transition-colors hidden sm:block">
 {t('landing_nav.login')}
 </Link>
 <Link href="/onboarding">
 <motion.button 
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 className="flex items-center px-5 py-2.5 rounded-full gradient-ai-bg text-sm font-semibold"
 >
 {t('landing_nav.start_free')} <ArrowRight className="w-4 h-4 ml-2" />
 </motion.button>
 </Link>
 </div>
 </div>
 </nav>
 );
}
