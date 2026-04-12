"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import ScoringMatrix from '@/components/b2b/ScoringMatrix';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function PageA5Swot() {
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      title={t('a5.title' as TranslationKey) as string || "Phân tích SWOT & Năng lực cạnh tranh"}
      description={t('a5.desc' as TranslationKey) as string || "Đánh giá năng lực cốt lõi so với đối thủ cạnh tranh hàng đầu để định hướng phân bổ trọng số chiến lược."}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
          <p className="text-sm text-blue-900 font-medium">
            <strong>{t('a5.alert_title' as TranslationKey) as string || "Hướng dẫn:"}</strong> {t('a5.alert_desc' as TranslationKey) as string || "Chỉ nhập các Yếu tố Thành công Cốt lõi (KSF) tác động trực tiếp đến quyết định mua hàng. Tổng trọng số phải luôn khóa ở mức 100%. Điểm số được giới hạn khắt khe từ 1 đến 10."}
          </p>
        </div>
        
        <ScoringMatrix />
      </div>
    </B2BPageTemplate>
  );
}
