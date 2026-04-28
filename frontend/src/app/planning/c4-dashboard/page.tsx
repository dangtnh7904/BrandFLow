"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';

const DASHBOARD_DATA = [
  { sbu: 'Sữa chua sấy', kpi: 'Thị phần phân khúc', now: '12%', next: '35%' },
  { sbu: 'Sữa chua sấy', kpi: 'LN / Nhân sự', now: '120 triệu/năm', next: '300 triệu/năm' },
  { sbu: 'Trái cây sấy', kpi: 'Tăng trưởng thực', now: '10%', next: '8% (Duy trì)' },
  { sbu: 'Trái cây sấy', kpi: 'LN / Nhân sự', now: '180 triệu/năm', next: '220 triệu/năm' },
];

export default function PageC4Dashboard() {
  const { localData, saveStatus } = useAutoSaveForm('c4-dashboard', { items: [] });
  const COLUMNS = [
    { key: 'sbu', header: 'SBU/Đơn vị', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 'kpi', header: 'KPI Đo lường', className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
    { key: 'now', header: 'Chỉ số Hiện Tại (Now)', align: 'center' as const, headerClassName: 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-400', className: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border-x border-white dark:border-slate-800' },
    { key: 'next', header: 'Mục tiêu (+5 Năm)', align: 'center' as const, headerClassName: 'bg-cyan-500/10 text-cyan-400', className: 'bg-cyan-500/10 text-cyan-400 font-bold' },
  ];

  return (
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Bảng KPI Chiến lược theo SBU (Dashboard)"
      description="Bảng điều khiển (Dashboard) đặt các mục tiêu KPI cạnh nhau."
    >
      <div className="space-y-6">
        <InstructionAlert className="!bg-[#fdf4ff] !border-fuchsia-400 !text-fuchsia-800">
           Dashboard tổng hợp này kết nối các SBU độc lập vào một nền tảng theo dõi duy nhất tại trụ sở chính.
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/c3-issues" prevLabel="Về C.3" />
      </div>
          </B2BPageTemplate>
  );
}
