"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import LiveCommandCenter from './LiveCommandCenter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* Left Column (Content & CTA) */}
        <div className="w-full lg:w-[55%] flex flex-col items-start text-left z-20 mt-10 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full border border-linear-border bg-linear-surface/50 backdrop-blur-sm mb-6 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse mr-3 shrink-0" />
            <span className="text-sm font-semibold text-foreground tracking-wide">{t('landing_hero.badge')}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[32px] min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.3] md:leading-[1.1] mb-6"
          >
            <span className="whitespace-nowrap">{t('landing_hero.title_1')}</span> <br />
            <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400">
              {t('landing_hero.title_2')}
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-linear-text-muted mb-10 max-w-xl leading-relaxed space-y-4 text-pretty"
          >
            <p>
              {t('landing_hero.desc')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/workspace" className="w-full sm:w-auto">
              <button className="flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-200 w-full group">
                {t('landing_hero.btn_start')} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="flex items-center justify-center px-8 py-4 rounded-xl border border-linear-border bg-linear-surface hover:bg-linear-surface/80 text-foreground font-semibold backdrop-blur-sm transition-all duration-200 w-full sm:w-auto group shadow-sm z-20 relative hover:text-cyan-500">
              <Zap className="w-5 h-5 mr-2 text-cyan-500" /> {t('landing_hero.btn_demo')}
            </button>
          </motion.div>
        </div>

        {/* Right Column (Live UI Visuals) */}
        <div className="w-full lg:w-[45%] relative h-[500px] lg:h-[600px] flex items-center justify-center z-10 mt-12 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full relative flex justify-center perspective-[1000px]"
          >
            {/* The Live Command Center panel floating in 3D-ish space */}
            <div className="hover:-translate-y-2 transition-transform duration-500">
              <LiveCommandCenter />
            </div>
            
          </motion.div>
        </div>

      </div>
    </section>
  );
}
