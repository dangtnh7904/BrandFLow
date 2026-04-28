"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ImplementationPage() {
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      title="6. Kế hoạch Triển khai (Implementation Plan)"
      description="Biến toàn bộ chiến lược thành các đầu việc thực tế, phân công, tiến độ và ngân sách."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Kế hoạch hành động chi tiết (Gantt chart), phân bổ nhân sự và ngân sách Marketing.
        </InstructionAlert>
        
        <div className="bento-card p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-linear-text-muted">Đang tải Kế hoạch Triển khai (Gantt & Budget)...</p>
        </div>
      </div>
    </B2BPageTemplate>
  );
}
