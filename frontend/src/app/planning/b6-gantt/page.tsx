"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const GANTT_DATA = [
  { name: 'On-air TVC Mascot ruột', t8: true, t9: true, t10: false, t11: false, t12: false },
  { name: 'Sampling siêu thị', t8: true, t9: true, t10: false, t11: false, t12: false },
  { name: 'Ra mắt túi zip mini 15g', t8: true, t9: true, t10: false, t11: false, t12: false },
  { name: 'Flash Sale Mega Cuối năm', t8: false, t9: false, t10: false, t11: false, t12: true },
];

export default function PageB6Gantt() {
  const { localData, saveStatus } = useAutoSaveForm('b6-gantt', { items: GANTT_DATA });
  const COLUMNS = [
    { key: 'name', header: 'Chiến dịch / Hành động', className: 'bg-white font-medium text-slate-800', width: '250px' },
    { key: 't8', header: 'Tháng 8', align: 'center' as const, render: (r: any) => r.t8 ? <div className="h-6 w-full bg-indigo-400 rounded-sm"></div> : null, className: 'border-l border-white bg-slate-50' },
    { key: 't9', header: 'Tháng 9', align: 'center' as const, render: (r: any) => r.t9 ? <div className="h-6 w-full bg-indigo-400 rounded-sm"></div> : null, className: 'border-l border-white bg-slate-50' },
    { key: 't10', header: 'Tháng 10', align: 'center' as const, render: (r: any) => r.t10 ? <div className="h-6 w-full bg-indigo-400 rounded-sm"></div> : null, className: 'border-l border-white bg-slate-50' },
    { key: 't11', header: 'Tháng 11', align: 'center' as const, render: (r: any) => r.t11 ? <div className="h-6 w-full bg-indigo-400 rounded-sm"></div> : null, className: 'border-l border-white bg-slate-50' },
    { key: 't12', header: 'Tháng 12', align: 'center' as const, render: (r: any) => r.t12 ? <div className="h-6 w-full bg-emerald-400 rounded-sm"></div> : null, className: 'border-l border-white bg-slate-50' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Bảng lập kế hoạch hoạt động (Gantt Chart)"
      description="Lịch biểu trực quan các chiến dịch tiếp thị."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Biểu đồ Gantt theo tháng/tuần đánh dấu thời gian bắt đầu và kết thúc của các chiến dịch lớn.
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 min-h-[300px] flex items-center justify-center">
           <span className="text-slate-400">--- Interactive Gantt Chart Area ---</span>
        </div>
        <WizardNavigation prevLink="/planning/b5-pnl" prevLabel="Về B.5" nextLink="/planning/c0-overview" nextLabel="Hoàn thành Phần B! 👉 Sang Phần C" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="B.6 Tactical Gantt"
      purpose="Bảng chấm công tập thể. Treo lên tường để không ai biện minh là quên lịch."
      sections={[
        { title: 'Biểu đồ Gantt', explanation: 'Thanh ngang trực quan hóa tiến độ công việc theo từng tháng để biết task nào đang trễ hạn.' }
      ]}
    />
    </>
  );
}
