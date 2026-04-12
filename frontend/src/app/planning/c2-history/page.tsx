"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const PORT_DATA = [
  { bcg: 'Ngôi sao (Star)', sbu: 'Sữa chua sấy lạnh', rev: '45 tỷ', target: '120 tỷ' },
  { bcg: 'Bò sữa (Cash Cow)', sbu: 'Trái cây sấy dẻo', rev: '200 tỷ', target: '250 tỷ' },
  { bcg: 'Dấu hỏi (Question)', sbu: 'Nước ép đóng chai', rev: '15 tỷ', target: '50 tỷ' },
];

export default function PageC2History() {
  const { localData, saveStatus } = useAutoSaveForm('c2-history', { items: PORT_DATA });
  const COLUMNS = [
    { key: 'bcg', header: 'Phân loại SBU (BCG)', className: 'bg-white font-bold text-slate-700' },
    { key: 'sbu', header: 'Tên Đơn vị kinh doanh', className: 'bg-slate-50 text-slate-600' },
    { key: 'rev', header: 'Doanh thu hiện tại', align: 'right' as const, className: 'bg-indigo-50 text-indigo-700 font-semibold border-x border-white' },
    { key: 'target', header: 'Mục tiêu (+3 năm)', align: 'right' as const, headerClassName: 'bg-emerald-100 text-emerald-900', className: 'bg-emerald-50 text-emerald-700 font-bold' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Tóm tắt Lịch sử & Danh mục (Portfolio Summary)"
      description="Biểu đồ danh mục đầu tư (Matrix) đặt tất cả các SBU lên cùng một ma trận."
    >
      <div className="space-y-6">
        <InstructionAlert className="!bg-[#fdf4ff] !border-fuchsia-400 !text-fuchsia-800">
           Bức tranh tương lai sử dụng ma trận BCG (Bò sữa, Ngôi sao, Tiền mặt...) để điều tiết dòng tiền giữa các SBU.
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/c1-direction" prevLabel="Về C.1" nextLink="/planning/c3-issues" nextLabel="Tiếp tục: C.3 Phân tích Vấn đề" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="C.2 Lịch sử Danh mục"
      purpose="Để Ban lãnh đạo thấy được quá trình tiến hóa của các dự án."
      sections={[
        { title: 'Vì sao cần xem lại?', explanation: 'Nếu dự án 3 năm liên tiếp dậm chân tại chỗ, đã đến lúc HQ phải ra tay can thiệp.' }
      ]}
    />
    </>
  );
}
