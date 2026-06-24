"use client";

import React from 'react';
import ActivePlansCard from '@/components/dashboard/ActivePlansCard';
import BrandAssetsCard from '@/components/dashboard/BrandAssetsCard';
import FinancialRiskAlert from '@/components/dashboard/FinancialRiskAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">{t('dashboard_home.title')}</h1>
        <p className="text-slate-500">{t('dashboard_home.desc')}</p>
      </header>

      {/* Vercel Style: Precise Bento Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
        
        {/* Large Span Card */}
        <ActivePlansCard />
        
        {/* Module Cards */}
        <BrandAssetsCard />
        <FinancialRiskAlert />

        {/* Placeholder Component */}
        <div className="bento-card col-span-1 md:col-span-1 lg:col-span-2 row-span-1 flex items-center justify-center bg-white border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{t('dashboard_home.connecting')}</p>
        </div>

      </div>
    </div>
  );
}
