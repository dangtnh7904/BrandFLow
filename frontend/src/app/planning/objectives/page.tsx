"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ObjectivesPage() {
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      title="3. Mục tiêu Marketing (Marketing Objectives)"
      description="Các mục tiêu kinh doanh và marketing cụ thể trong ngắn hạn, trung hạn và dài hạn."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Xác định rõ ràng doanh nghiệp muốn đạt được điều gì (Doanh thu, thị phần, mức độ nhận diện thương hiệu).
        </InstructionAlert>
        
        <div className="bento-card p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-linear-text-muted">Đang hiển thị Mục tiêu Marketing...</p>
        </div>
      </div>
    </B2BPageTemplate>
  );
}
