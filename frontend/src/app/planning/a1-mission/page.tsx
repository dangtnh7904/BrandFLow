"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import TextBuilderForm from '@/components/b2b/TextBuilderForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function PageA1Mission() {
 const { t } = useLanguage();

 return (
 <B2BPageTemplate
 title={t('a1.title' as TranslationKey) as string || "Sứ mệnh & Định nghĩa"}
 description={t('a1.desc' as TranslationKey) as string || "Xác định tuyên ngôn sứ mệnh cốt lõi, vai trò và các định hướng bao trùm cho doanh nghiệp."}
 >
 <div className="space-y-6">
 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
 <p className="text-sm text-blue-900 font-medium">
 <strong>{t('a1.alert_title' as TranslationKey) as string || "Lưu ý Chiến lược:"}</strong> {t('a1.alert_desc' as TranslationKey) as string || "Tài liệu này đóng vai trò là mỏ neo chính. Tất cả các chiến dịch và chiến thuật tiếp theo phải bám sát vào Năng lực Lõi và Định hướng được xác định ở đây."}
 </p>
 </div>
 
 <TextBuilderForm />
 </div>
 </B2BPageTemplate>
 );
}
