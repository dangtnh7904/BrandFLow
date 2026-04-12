"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const ACTION_DATA = [
  { obj: 'Trực quan hóa công dụng lợi khuẩn', tactic: 'Sản xuất TVC hoạt hình: 1 Mascot duy nhất vươn tay chỉ trực diện vào đồ họa đường ruột đang tiêu hóa tốt.', owner: 'Creative Team', deadline: 'Tuần 3, Tháng 8', cost: '300,000,000' },
  { obj: 'Tăng tương tác điểm bán', tactic: 'Tổ chức booth dùng thử, chụp hình check-in cùng Mascot đơn.', owner: 'Trade Mkt', deadline: 'Tháng 9', cost: '150,000,000' },
];

export default function PageB2Action() {
  const COLUMNS = [
    { key: 'obj', header: 'Mục tiêu phụ', className: 'bg-white font-medium text-slate-700', width: '200px' },
    { key: 'tactic', header: 'Hành động / Chiến thuật', className: 'bg-slate-50 text-slate-700' },
    { key: 'owner', header: 'Trách nhiệm', align: 'center' as const, headerClassName: 'bg-sky-100 text-sky-900', className: 'bg-sky-50 text-sky-700 font-semibold' },
    { key: 'deadline', header: 'Deadline', align: 'center' as const, className: 'bg-white text-slate-600' },
    { key: 'cost', header: 'Chi phí (VNĐ)', align: 'right' as const, className: 'bg-rose-50 text-rose-700 font-bold border-l border-white' },
  ];

  return (
    <>
    <B2BPageTemplate
      title="Kế hoạch Hành động Chi tiết"
      description="Trái tim của kế hoạch thực thi, phân bổ task cho từng đội ngũ."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Phân rã Mục tiêu thành các Hành động chi tiết, gán người chịu trách nhiệm, deadline và chi phí.
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={ACTION_DATA} />
        </div>
        <WizardNavigation prevLink="/planning/b1-objectives" prevLabel="Về B.1" nextLink="/planning/b3-budget" nextLabel="Tiếp tục: B.3 Ngân sách Marketing" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="B.2 Kế hoạch Hành động"
      purpose="Không có kế hoạch hành động, mục tiêu chỉ là điều ước. Gán ngay cái tên vào từng việc!"
      sections={[
        { title: 'Ai chịu trách nhiệm?', explanation: 'Một việc mà 2 người chịu trách nhiệm là không ai chịu trách nhiệm cả. Ghi rành rọt tên người cầm trịch vào đây.' }
      ]}
    />
    </>
  );
}
