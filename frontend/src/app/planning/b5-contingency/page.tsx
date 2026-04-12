"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import ContingencyTable from '@/components/b2b/ContingencyTable';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function PageB5Contingency() {
  const { localData, saveStatus } = useAutoSaveForm('b5-contingency', { });
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      saveStatus={saveStatus}
      title={t('b5.title' as TranslationKey) as string || "Kế hoạch Dự phòng rủi ro"}
      description={t('b5.desc' as TranslationKey) as string || "Lập sơ đồ các sự kiện rủi ro, xác định ngưỡng kích hoạt và thiết lập hành động ứng phó."}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
          <p className="text-sm text-blue-900 font-medium">
            <strong>{t('b5.alert_title' as TranslationKey) as string || "Giao thức Rủi ro:"}</strong> {t('b5.alert_desc' as TranslationKey) as string || "Một khi Điểm Kích Hoạt (Trigger Point) bị vi phạm trong quá trình vận hành, Hành động Dự phòng tương ứng phải được kích hoạt ngay lập tức mà không cần chờ phê duyệt."}
          </p>
        </div>
        
        <ContingencyTable />
      </div>
    </B2BPageTemplate>
  );
}
