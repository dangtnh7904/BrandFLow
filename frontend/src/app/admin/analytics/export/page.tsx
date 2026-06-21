"use client";

import React from 'react';
import AnalyticsExportReport from '@/components/workspace/AnalyticsExportReport';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsExportPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Action Bar (Hidden when printing) */}
      <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50 print:hidden shadow-sm">
        <Link href="/admin/analytics" className="flex items-center text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'vi' ? 'Quay lại Analytics' : 'Back to Analytics'}
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 font-medium">
            {language === 'vi' ? 'Sử dụng phím tắt Ctrl+P để lưu file PDF' : 'Use Ctrl+P to save as PDF'}
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            {language === 'vi' ? 'In báo cáo (Export PDF)' : 'Print (Export PDF)'}
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div className="flex-1 overflow-auto bg-slate-100 py-8">
        <AnalyticsExportReport />
      </div>
    </div>
  );
}
