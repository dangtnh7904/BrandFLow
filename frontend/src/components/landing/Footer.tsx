"use client";

import React from 'react';
import Link from 'next/link';
import { BrandFlowLogo } from '../brand/BrandFlowLogo';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-transparent border-t ultra-thin-border pt-16 pb-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col items-start justify-start">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <BrandFlowLogo className="w-12 h-12" />
              <span className="text-xl font-bold tracking-tight text-foreground">
                Brand<span className="text-cyan-500">F</span>low
              </span>
            </Link>
            <p className="text-linear-text-muted text-sm leading-relaxed max-w-xs mb-8">
              {t('landing_footer.desc')}
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-4 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('landing_footer.col1_title')}</h4>
              <ul className="space-y-3 text-sm text-linear-text-muted">
                <li><Link href="#features" className="hover:text-cyan-500 transition-colors">{t('landing_footer.col1_l1')}</Link></li>
                <li><Link href="/onboarding" className="hover:text-cyan-500 transition-colors">{t('landing_footer.col1_l2')}</Link></li>
                <li><Link href="/planning/a1-mission" className="hover:text-cyan-500 transition-colors">{t('landing_footer.col1_l3')}</Link></li>
                <li><Link href="#pricing" className="hover:text-cyan-500 transition-colors">{t('landing_footer.col1_l4')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('landing_footer.col2_title')}</h4>
              <ul className="space-y-3 text-sm text-linear-text-muted">
                <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">{t('landing_footer.col2_l1')}</span></li>
                <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">{t('landing_footer.col2_l2')}</span></li>
                <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">{t('landing_footer.col2_l3')}</span></li>
                <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">{t('landing_footer.col2_l4')}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('landing_footer.col3_title')}</h4>
              <ul className="space-y-3 text-sm text-linear-text-muted">
                <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">{t('landing_footer.col3_l1')}</span></li>
                <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">{t('landing_footer.col3_l2')}</span></li>
                <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">{t('landing_footer.col3_l3')}</span></li>
                <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">{t('landing_footer.col3_l4')}</span></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="font-bold text-foreground mb-4">{t('landing_footer.nl_title')}</h4>
            <p className="text-sm text-linear-text-muted mb-4">{t('landing_footer.nl_desc')}</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t('landing_footer.nl_ph')} 
                className="w-full bg-linear-surface border ultra-thin-border rounded-l-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-cyan-500"
              />
              <button 
                type="submit" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-r-lg text-sm font-bold transition-colors"
              >
                {t('landing_footer.nl_btn')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-linear-text-muted text-sm">{t('landing_footer.copyright')}</p>
          <div className="flex gap-4">
            <span className="w-8 h-8 rounded-full bg-linear-surface border ultra-thin-border flex items-center justify-center text-linear-text-muted hover:text-cyan-500 transition-colors cursor-pointer cursor-pointer hover:border-cyan-500/50">
              {/* x/twitter icon placeholder */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </span>
            <span className="w-8 h-8 rounded-full bg-linear-surface border ultra-thin-border flex items-center justify-center text-linear-text-muted hover:text-cyan-500 transition-colors cursor-pointer hover:border-cyan-500/50">
              {/* github icon placeholder */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            </span>
            <span className="w-8 h-8 rounded-full bg-linear-surface border ultra-thin-border flex items-center justify-center text-linear-text-muted hover:text-cyan-500 transition-colors cursor-pointer hover:border-cyan-500/50">
              {/* linkedin icon placeholder */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
