"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

const DPM_DATA = [
  { segment: 'Mẹ & Trẻ em', attr: 'Cao', pos: 'Mạnh', decision: 'Đầu tư mạnh để tăng trưởng' },
  { segment: 'Dân văn phòng', attr: 'Trung bình', pos: 'Khá', decision: 'Duy trì & Quản lý chọn lọc' },
];

export default function PageA6Portfolio() {
  const { localData, saveStatus } = useAutoSaveForm('a6-portfolio', { items: DPM_DATA });
  const { t } = useLanguage();
  const COLUMNS = [
    { key: 'segment', header: 'Phân khúc', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 'attr', header: 'Sức hấp dẫn thị trường', align: 'center' as const, className: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 font-semibold' },
    { key: 'pos', header: 'Vị thế cạnh tranh', align: 'center' as const, className: 'bg-cyan-500/10 text-cyan-400 font-semibold border-l border-white dark:border-slate-800' },
    { key: 'decision', header: 'Quyết định đầu tư', className: 'bg-linear-surface text-linear-text-muted' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title={t('a6.title' as TranslationKey) as string || "Ma trận Danh mục đầu tư (DPM)"}
      description={t('a6.desc' as TranslationKey) as string || "Tóm tắt danh mục dựa trên kết quả SWOT."}
    >
      <div className="space-y-6">
        <InstructionAlert>
          {t('a6.strategy' as TranslationKey) as string || "Xuất ra một ma trận trực quan với trục tung/hoành phân loại các phân khúc."}
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        
        {/* Placeholder for visual 2x2 or 3x3 matrix */}
        <div className="bento-card p-6 min-h-[300px] flex items-center justify-center">
           <span className="text-linear-text-muted">--- DPM / GE Matrix Interactive Chart ---</span>
        </div>
        <WizardNavigation prevLink="/planning/a5-swot" prevLabel="Về A.5" nextLink="/planning/a7-assumptions" nextLabel="Tiếp tục: A.7 Giả định" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="Ma trận Danh mục"
      purpose="Quyết định ai được nuôi tiếp, ai bị chôn đi."
      sections={[
        { title: 'GE Matrix nôm na', explanation: 'Trục ngang là độ mạnh của bạn, trục dọc là sức hấp dẫn của thị trường. Nhóm đỉnh cao sẽ được đổ dồn tiền marketing.' }
      ]}
    />
    </>
  );
}
