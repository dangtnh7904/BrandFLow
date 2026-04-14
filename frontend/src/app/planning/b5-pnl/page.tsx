"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const PNL_DATA = [
  { item: 'Doanh thu thuần', val: '60.0', ratio: '100%' },
  { item: 'Biên LN Gộp', val: '25.2', ratio: '42.0%' },
  { item: 'Chi phí Marketing', val: '3.5', ratio: '5.8%' },
  { item: 'Lợi nhuận hoạt động', val: '16.7', ratio: '27.8% (ROS)' },
];

export default function PageB5Pnl() {
  const { localData, saveStatus } = useAutoSaveForm('b5-pnl', { items: PNL_DATA });
  const COLUMNS = [
    { key: 'item', header: 'Hạng mục Tài chính', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 'val', header: 'Giá trị (Tỷ VNĐ)', align: 'right' as const, className: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold border-x border-white dark:border-slate-800' },
    { key: 'ratio', header: 'Tỷ lệ (% Doanh thu)', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Báo cáo Lãi Lỗ Dự phóng ngắn hạn (P&L)"
      description="Tổng hợp báo cáo lãi lỗ dựa trên chiến dịch 1 năm."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Báo cáo ROS và ROI ngắn hạn để trình ban giám đốc xét duyệt ngân sách.
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/b4-contingency" prevLabel="Về B.4" nextLink="/planning/b6-gantt" nextLabel="Tiếp tục: B.6 Gantt Chart" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="B.5 Báo cáo Lãi Lỗ (P&L)"
      purpose="Thước phim quay nhanh về dòng chảy của tiền trong suốt 12 tháng qua."
      sections={[
        { title: 'Đóng góp biên', explanation: 'Sau khi trừ đi mọi chi phí biến đổi, sản phẩm này thực sự đang làm giàu hay phá hoại công ty?' }
      ]}
    />
    </>
  );
}
