"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import VisualDashboards from '@/components/b2b/VisualDashboards';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PageA6Portfolio() {
 const { t } = useLanguage();
 return (
 <B2BPageTemplate
 title={t('a6.title' as any)}
 description={t('a6.desc' as any)}
 >
 <div className="space-y-6">
 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
 <p className="text-sm text-blue-900 font-medium">
 <strong>{t('a6.strategy' as any)}</strong> {t('a6.strategy_desc' as any)}
 </p>
 </div>
 
 <div className="max-w-4xl">
 <VisualDashboards />
 </div>
 </div>
 </B2BPageTemplate>
 );
}
