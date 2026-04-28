"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';

const BUDGET_DATA = [
  { item: 'Quảng cáo số (Ads)', past: '800 triệu', now: '1.2 tỷ', next: '1.5 tỷ' },
  { item: 'Khuyến mãi (Trade)', past: '500 triệu', now: '800 triệu', next: '1.0 tỷ' },
  { item: 'Sản xuất Media (TVC)', past: '200 triệu', now: '400 triệu', next: '800 triệu' },
];

export default function PageB3Budget() {
  const { localData, saveStatus } = useAutoSaveForm('b3-budget', { items: [] });
  const COLUMNS = [
    { key: 'item', header: 'Hạng mục chi phí', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 'past', header: 'Năm ngoái', align: 'right' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
    { key: 'now', header: 'Ước tính năm nay', align: 'right' as const, headerClassName: 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-400', className: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 font-semibold border-x border-white dark:border-slate-800' },
    { key: 'next', header: 'Ngân sách năm tới', align: 'right' as const, headerClassName: 'bg-cyan-500/10 text-cyan-400', className: 'bg-cyan-500/10 text-cyan-400 font-bold' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Tổng hợp Ngân sách Marketing"
      description="Liệt kê ngân sách chi tiết phân bổ theo các mảng hoạt động."
    >
      <div className="space-y-6">
        <InstructionAlert>
          So sánh chi phí marketing của năm ngoái, năm nay và ngân sách cấp cho năm tới.
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/b2-action" prevLabel="Về B.2" nextLink="/planning/b4-contingency" nextLabel="Tiếp tục: B.4 Dự phòng" />
      </div>
    </B2BPageTemplate>
        </>
  );
}
