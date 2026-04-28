"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GrowthDirectionPage() {
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      title="8. Định hướng Tăng trưởng (Growth Direction)"
      description="Định hướng phát triển trong tương lai, mở rộng thị trường, và phát triển bền vững."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Để bản kế hoạch có tính tổng thể và dài hạn, vạch ra các chiến lược tăng trưởng, mở rộng tệp khách hàng và xây dựng cộng đồng.
        </InstructionAlert>
        
        <div className="bento-card p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-linear-text-muted">Đang phân tích Định hướng Tăng trưởng...</p>
        </div>
      </div>
    </B2BPageTemplate>
  );
}
