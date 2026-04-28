"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ControlEvaluationPage() {
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      title="7. Kiểm soát và Đánh giá (Control & Evaluation)"
      description="Hệ thống chỉ tiêu đánh giá (KPI), tần suất theo dõi và phương án điều chỉnh."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Đảm bảo kế hoạch được theo dõi xuyên suốt và có điều chỉnh kịp thời nếu kết quả không đạt như kỳ vọng.
        </InstructionAlert>
        
        <div className="bento-card p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-linear-text-muted">Đang hiển thị Dashboard Kiểm soát & Đánh giá...</p>
        </div>
      </div>
    </B2BPageTemplate>
  );
}
