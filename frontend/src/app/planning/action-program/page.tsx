"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ActionProgramPage() {
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      title="5. Chương trình Hành động (Marketing Action Program)"
      description="Chiến lược 4P/7P bao gồm Sản phẩm, Dịch vụ, Định giá, Truyền thông và Phân phối."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Các hành động chi tiết và chiến thuật cụ thể để thực thi chiến lược.
        </InstructionAlert>
        
        <div className="bento-card p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-linear-text-muted">Đang tải Chương trình Hành động...</p>
        </div>
      </div>
    </B2BPageTemplate>
  );
}
