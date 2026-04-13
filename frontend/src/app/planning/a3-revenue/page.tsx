"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import VisualDashboards from '@/components/b2b/VisualDashboards';
import FinancialDataGrid from '@/components/b2b/FinancialDataGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

export default function PageA3Revenue() {
 const { t } = useLanguage();

 return (
 <B2BPageTemplate
 title={t('a3.title' as TranslationKey) as string || "Dự phóng Doanh thu & Chỉ số Tài chính"}
 description={t('a3.desc' as TranslationKey) as string || "Tính toán và trực quan hóa kỳ vọng P&L cùng với tăng trưởng biên lợi nhuận gộp trong dài hạn."}
 >
 <div className="space-y-6">
 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
 <p className="text-sm text-blue-900 font-medium">
 <strong>{t('a3.alert_title' as TranslationKey) as string || "Mục tiêu Tài chính:"}</strong> {t('a3.alert_desc' as TranslationKey) as string || "Các biểu đồ dưới đây mô phỏng đầu ra của toán cốt lõi. Số liệu dự phóng được tính toán dựa trên các tham số cơ sở của Năm t0."}
 </p>
 </div>
 
 <FinancialDataGrid />
 
 <div className="mt-8 border-t border-linear-border pt-8">
 <VisualDashboards />
 </div>
 </div>
 </B2BPageTemplate>
 );
}
