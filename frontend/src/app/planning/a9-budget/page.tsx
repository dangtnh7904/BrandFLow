"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const PNL_DATA = [
  { item: 'Doanh thu thuần', t0: '60.0', t1: '80.0', t2: '100.0', t3: '120.0' },
  { item: 'Chi phí giá vốn (COGS)', t0: '34.8', t1: '45.6', t2: '56.0', t3: '66.0' },
  { item: 'Lợi nhuận gộp', t0: '25.2', t1: '34.4', t2: '44.0', t3: '54.0' },
  { item: 'Chi phí Marketing', t0: '3.5', t1: '4.5', t2: '5.5', t3: '6.5' },
];

export default function PageA9Budget() {
  const { localData, saveStatus } = useAutoSaveForm('a9-budget', { items: PNL_DATA });
  const COLUMNS = [
    { key: 'item', header: 'Hạng mục P&L', className: 'bg-white font-medium text-slate-700' },
    { key: 't0', header: 'Năm t0', align: 'right' as const, headerClassName: 'bg-purple-100 text-purple-900', className: 'bg-purple-50 text-purple-700 font-semibold' },
    { key: 't1', header: 'Năm t+1', align: 'right' as const, className: 'bg-emerald-50 text-emerald-600 font-semibold' },
    { key: 't2', header: 'Năm t+2', align: 'right' as const, className: 'bg-emerald-50/70 text-emerald-700 font-bold' },
    { key: 't3', header: 'Năm t+3', align: 'right' as const, headerClassName: 'bg-emerald-200 text-emerald-900', className: 'bg-emerald-100 text-emerald-800 font-black border-l border-white' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Ngân sách hợp nhất dự phóng (Đơn vị: Tỷ VNĐ)"
      description="Bảng dự phóng tài chính tổng hợp tất cả dòng doanh thu, chi phí và lợi nhuận cho chu kỳ."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Đầu ra phải khớp hoàn toàn với các quy ước, đầu mục doanh thu/chi phí tài chính tiêu chuẩn của công ty và tương thích với Tóm tắt tài chính ở Form 3.
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/a8-strategies" prevLabel="Về A.8" nextLink="/planning/b0-overview" nextLabel="Hoàn thành Phần A! 👉 Sang Phần B" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="Ngân sách tổng hợp"
      purpose="Kế toán và CFO sẽ nhảy vào 'soi' bảng này. Đảm bảo mọi thứ bạn hứa ở các Form trước không khiến công ty phá sản!"
      sections={[
        { title: 'COGS là gì?', explanation: 'Giá vốn hàng bán (Cost of Goods Sold). Chi phí cơ bản nhất để tạo ra sản phẩm (mua nguyên liệu, thuê nhân công sản xuất).' }
      ]}
    />
    </>
  );
}
