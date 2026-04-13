"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import TacticalGantt from '@/components/b2b/TacticalGantt';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function PageB7Gantt() {
  const { localData, saveStatus } = useAutoSaveForm('b7-gantt', { });
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      saveStatus={saveStatus}
      title={t('b7.title' as TranslationKey) as string || "Bảng tiến độ chiến lược (12-Month Gantt)"}
      description={t('b7.desc' as TranslationKey) as string || "Biểu đồ tiến độ thực thi vi mô minh họa tất cả các điểm chạm vận hành trong suốt năm tài chính."}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-md">
          <p className="text-sm text-blue-900 dark:text-blue-400 font-medium">
            <strong>{t('b7.alert_title' as TranslationKey) as string || "Kiểm tra Vận hành:"}</strong> {t('b7.alert_desc' as TranslationKey) as string || "Đảm bảo tất cả các điểm chạm chiến thuật được ánh xạ bên dưới có tương ứng trực tiếp với ngân sách đã được phê duyệt trong Bảng Kế hoạch Hành động (B3)."}
          </p>
        </div>
        
        <TacticalGantt />
      </div>
    </B2BPageTemplate>
  );
}
