"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ExecutiveSummaryPage() {
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      title="1. Tóm tắt Điều hành (Executive Summary)"
      description="Khái quát về doanh nghiệp, bối cảnh thị trường, mục tiêu chính và định hướng chiến lược chủ đạo."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Bản tóm tắt toàn bộ Kế hoạch Marketing. Điểm lại các ý chính để ban giám đốc hoặc nhà đầu tư có thể nắm bắt nhanh.
        </InstructionAlert>
        
        <div className="bento-card p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-linear-text-muted">Đang tải dữ liệu Tóm tắt Điều hành từ Agent 0...</p>
        </div>
      </div>
    </B2BPageTemplate>
  );
}
