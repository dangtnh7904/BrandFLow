"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const DASHBOARD_DATA = [
  { sbu: 'Sữa chua sấy', kpi: 'Thị phần phân khúc', now: '12%', next: '35%' },
  { sbu: 'Sữa chua sấy', kpi: 'LN / Nhân sự', now: '120 triệu/năm', next: '300 triệu/năm' },
  { sbu: 'Trái cây sấy', kpi: 'Tăng trưởng thực', now: '10%', next: '8% (Duy trì)' },
  { sbu: 'Trái cây sấy', kpi: 'LN / Nhân sự', now: '180 triệu/năm', next: '220 triệu/năm' },
];

export default function PageC4Dashboard() {
  const COLUMNS = [
    { key: 'sbu', header: 'SBU/Đơn vị', className: 'bg-white font-medium text-slate-700' },
    { key: 'kpi', header: 'KPI Đo lường', className: 'bg-slate-50 text-slate-700' },
    { key: 'now', header: 'Chỉ số Hiện Tại (Now)', align: 'center' as const, headerClassName: 'bg-purple-100 text-purple-900', className: 'bg-purple-50 text-purple-600 font-semibold border-x border-white' },
    { key: 'next', header: 'Mục tiêu (+5 Năm)', align: 'center' as const, headerClassName: 'bg-emerald-100 text-emerald-900', className: 'bg-emerald-50 text-emerald-700 font-bold' },
  ];

  return (
    <B2BPageTemplate
      title="Bảng KPI Chiến lược theo SBU (Dashboard)"
      description="Bảng điều khiển (Dashboard) đặt các mục tiêu KPI cạnh nhau."
    >
      <div className="space-y-6">
        <InstructionAlert className="!bg-[#fdf4ff] !border-fuchsia-400 !text-fuchsia-800">
           Dashboard tổng hợp này kết nối các SBU độc lập vào một nền tảng theo dõi duy nhất tại trụ sở chính.
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={DASHBOARD_DATA} />
        </div>
        <WizardNavigation prevLink="/planning/c3-issues" prevLabel="Về C.3" />
      </div>
      <MascotChatbot 
        formName="C.4 Dashboard Chiến lược"
        purpose="Trạm kiểm soát cuối cùng. Toàn bộ hiệu suất, rủi ro và KPIs nén vào một chỗ."
        sections={[
          { title: 'Ma trận Điều hành', explanation: 'Chỉ cần nhìn cột Trạng thái đỏ hay xanh là biết giám đốc chi nhánh đó có đang hoàn thành nhiệm vụ không.' }
        ]}
      />
    </B2BPageTemplate>
  );
}
