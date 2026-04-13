"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import TacticalGantt from '@/components/b2b/TacticalGantt';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function PageB3Action() {
 const { t } = useLanguage();

 return (
 <B2BPageTemplate
 title={t('b3.title' as TranslationKey) as string || "Kế hoạch Hành động"}
 description={t('b3.desc' as TranslationKey) as string || "Thiết lập mục tiêu chiến thuật rõ ràng, chỉ định người phụ trách và quản lý ngân sách bao trùm."}
 >
 <div className="space-y-6">
 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
 <p className="text-sm text-blue-900 font-medium">
 <strong>{t('b3.alert_title' as TranslationKey) as string || "Quy tắc Thực thi:"}</strong> {t('b3.alert_desc' as TranslationKey) as string || "Mỗi chiến thuật phải có người chịu trách nhiệm rõ ràng và giới hạn ngân sách (budget cap). Danh sách này được liên kết trực tiếp với tiến độ B7 Gantt."}
 </p>
 </div>
 
 <div className="opacity-95">
 {/* Reusing the Matrix from TacticalGantt Blueprint */}
 <TacticalGantt />
 </div>
 </div>
 </B2BPageTemplate>
 );
}
