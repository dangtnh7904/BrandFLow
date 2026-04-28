"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SituationAnalysisPage() {
  const { t } = useLanguage();

  return (
    <B2BPageTemplate
      title="2. Tổng quan Tình hình (Situation Analysis)"
      description="Phân tích khách hàng, đối thủ cạnh tranh, đối tác và môi trường vĩ mô (SWOT)."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Tổng hợp các phân tích về môi trường vi mô và vĩ mô, cơ hội và thách thức của doanh nghiệp trên thị trường.
        </InstructionAlert>
        
        <div className="bento-card p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-linear-text-muted">Đang tổng hợp số liệu Tổng quan Tình hình...</p>
        </div>
      </div>
    </B2BPageTemplate>
  );
}
