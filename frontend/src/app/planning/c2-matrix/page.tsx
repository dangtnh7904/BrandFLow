"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import VisualDashboards from '@/components/b2b/VisualDashboards';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function PageC2Matrix() {
  const { localData, saveStatus } = useAutoSaveForm('c2-matrix', { });
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      saveStatus={saveStatus}
      title={t('c2.title' as TranslationKey) as string || "Ma trận Tổng hợp HQ"}
      description={t('c2.desc' as TranslationKey) as string || "Dashboard cấp cao tổng hợp các chỉ số danh mục đầu tư và doanh thu trên toàn bộ hệ sinh thái của tập đoàn."}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
          <p className="text-sm text-blue-900 font-medium">
            <strong>{t('c2.alert_title' as TranslationKey) as string || "HQ Visualizer:"}</strong> {t('c2.alert_desc' as TranslationKey) as string || "Các biểu đồ phân tán và Dashboard ở cấp độ này tóm tắt các chỉ số tổng hợp toàn diện nhất từ tầng vận hành bên dưới."}
          </p>
        </div>
        
        <VisualDashboards />
      </div>
    </B2BPageTemplate>
  );
}
