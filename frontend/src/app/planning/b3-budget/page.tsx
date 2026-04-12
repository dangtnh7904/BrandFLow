"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const BUDGET_DATA = [
  { item: 'Quảng cáo số (Ads)', past: '800 triệu', now: '1.2 tỷ', next: '1.5 tỷ' },
  { item: 'Khuyến mãi (Trade)', past: '500 triệu', now: '800 triệu', next: '1.0 tỷ' },
  { item: 'Sản xuất Media (TVC)', past: '200 triệu', now: '400 triệu', next: '800 triệu' },
];

export default function PageB3Budget() {
  const COLUMNS = [
    { key: 'item', header: 'Hạng mục chi phí', className: 'bg-white font-medium text-slate-700' },
    { key: 'past', header: 'Năm ngoái', align: 'right' as const, className: 'bg-slate-50 text-slate-500' },
    { key: 'now', header: 'Ước tính năm nay', align: 'right' as const, headerClassName: 'bg-purple-100 text-purple-900', className: 'bg-purple-50 text-purple-700 font-semibold border-x border-white' },
    { key: 'next', header: 'Ngân sách năm tới', align: 'right' as const, headerClassName: 'bg-emerald-100 text-emerald-900', className: 'bg-emerald-50 text-emerald-700 font-bold' },
  ];

  return (
    <>
    <B2BPageTemplate
      title="Tổng hợp Ngân sách Marketing"
      description="Liệt kê ngân sách chi tiết phân bổ theo các mảng hoạt động."
    >
      <div className="space-y-6">
        <InstructionAlert>
          So sánh chi phí marketing của năm ngoái, năm nay và ngân sách cấp cho năm tới.
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={BUDGET_DATA} />
        </div>
        <WizardNavigation prevLink="/planning/b2-action" prevLabel="Về B.2" nextLink="/planning/b4-contingency" nextLabel="Tiếp tục: B.4 Dự phòng" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="B.3 Ngân sách Marketing"
      purpose="Tiền không tự sinh ra. Trình bày xem team marketing của bạn định đốt bao nhiêu để đổi lại số doanh thu đã hứa?"
      sections={[
        { title: 'Tỷ lệ % Ngân sách', explanation: 'Hiểu xem bạn đang đổ dồn bao nhiêu tiền vào việc gì trong tổng ngân sách.' }
      ]}
    />
    </>
  );
}
