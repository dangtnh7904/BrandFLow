"use client";

import React from 'react';
import { Download, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

import SaveIndicator from '@/components/b2b/SaveIndicator';

interface PageTemplateProps {
  title: string;
  description: string;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  children: React.ReactNode;
}

export default function B2BPageTemplate({ title, description, saveStatus, children }: PageTemplateProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full w-full">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center space-x-3">
          {saveStatus ? (
            <SaveIndicator status={saveStatus} />
          ) : (
            <button className="flex items-center px-4 py-2 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Save className="w-4 h-4 mr-2" />
              {t('b2b_tools.save_draft' as any)}
            </button>
          )}
          <button className="flex items-center px-4 py-2 border border-transparent rounded-md gradient-ai-bg text-sm font-bold text-white shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            {t('b2b_tools.export_pdf' as any)}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
