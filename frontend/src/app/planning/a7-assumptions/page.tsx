"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';

const ASSUMP_DATA = [
  { core: 'Xu hướng "Clean Label" tăng 15%/năm', logic: 'Thị hiếu tiêu dùng không đảo chiều', action: 'Giảm chi phí R&D dòng sản phẩm mới' },
  { core: 'Giá nguyên liệu sữa tươi ổn định', logic: 'Biên độ dao động < 5%', action: 'Tìm kiếm nhà cung cấp dự phòng' },
];

export default function PageA7Assumptions() {
  const { localData, saveStatus } = useAutoSaveForm('a7-assumptions', { items: [] });
  const COLUMNS = [
    { key: 'core', header: 'Giả định cốt lõi', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 'logic', header: 'Điều kiện Logic', className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
    { key: 'action', header: 'Hành động loại bỏ nếu sai', className: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Các giả định (Assumptions)"
      description="Danh sách ngắn gọn các giả định cốt lõi tác động trực tiếp đến kế hoạch."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Nếu một giả định không xảy ra mà kế hoạch vẫn có thể thực hiện được, thì loại bỏ giả định đó khỏi danh sách.
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/a6-portfolio" prevLabel="Về A.6" nextLink="/planning/a8-strategies" nextLabel="Tiếp tục: A.8 Mục tiêu & Chiến lược" />
      </div>
    </B2BPageTemplate>
        </>
  );
}
