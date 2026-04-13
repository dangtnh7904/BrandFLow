"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import TextBuilderForm from '@/components/b2b/TextBuilderForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function PageC1Direction() {
 const { t } = useLanguage();

 return (
 <B2BPageTemplate
 title={t('c1.title' as TranslationKey) as string || "Định hướng Tập đoàn / HQ"}
 description={t('c1.desc' as TranslationKey) as string || "Hợp nhất sứ mệnh và các định hướng chiến lược trên toàn bộ các thương hiệu vệ tinh."}
 >
 <div className="space-y-6">
 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
 <p className="text-sm text-blue-900 font-medium">
 <strong>{t('c1.alert_title' as TranslationKey) as string || "Cấp độ HQ:"}</strong> {t('c1.alert_desc' as TranslationKey) as string || "Chức năng này đại diện cho chiến lược của công ty mẹ (Parent Group). Các sứ mệnh của thương hiệu con (A1) phải kế thừa và đồng bộ hóa với giá trị gốc này."}
 </p>
 </div>
 
 <TextBuilderForm />
 </div>
 </B2BPageTemplate>
 );
}
