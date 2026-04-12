"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const PERF_DATA = [
  { metric: 'Khối lượng bán ra', y3: '50 tấn', y2: '85 tấn', y1: '150 tấn', reason: 'Nắm bắt xu hướng "healthy"' },
  { metric: 'Doanh thu thuần', y3: '15 tỷ VNĐ', y2: '25.5 tỷ VNĐ', y1: '45 tỷ VNĐ', reason: 'Mở rộng kênh đại lý' },
  { metric: 'Tỷ suất LN gộp (%)', y3: '35%', y2: '38%', y1: '42%', reason: 'Lợi thế quy mô (Scale)' },
  { metric: 'Biên LN gộp', y3: '5.25 tỷ', y2: '9.69 tỷ', y1: '18.9 tỷ', reason: 'Tối ưu chi phí sản xuất' },
];

export default function PageA2Performance() {
  const { localData, saveStatus } = useAutoSaveForm('a2-performance', { items: PERF_DATA });
  const COLUMNS = [
    { key: 'metric', header: 'Chỉ số (Cố định giá)', className: 'bg-white font-medium text-slate-700' },
    { key: 'y3', header: 'Năm t-3 (2023)', align: 'center' as const, className: 'bg-slate-50 text-slate-600' },
    { key: 'y2', header: 'Năm t-2 (2024)', align: 'center' as const, className: 'bg-slate-50 text-slate-600' },
    { key: 'y1', header: 'Năm ngoái (2025)', align: 'center' as const, headerClassName: 'text-indigo-900 bg-indigo-100', className: 'bg-indigo-50 font-bold text-indigo-700' },
    { key: 'reason', header: 'Nguyên nhân chính', className: 'bg-white text-slate-600 text-sm' },
  ];

  return (
    <>
      <B2BPageTemplate
      saveStatus={saveStatus}
        title="Hiệu suất SBU (3 Năm)"
        description="Tóm tắt hiệu suất của doanh nghiệp trong 3 năm liền kề."
      >
        <div className="space-y-6">
          <InstructionAlert>
            Bảng dữ liệu định lượng và phần bình luận giải thích lý do chính về hiệu suất trong giai đoạn vừa qua.
          </InstructionAlert>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-widest">Tóm tắt hiệu suất</h3>
             <PastelTable columns={COLUMNS} data={localData.items} />
          </div>
          <WizardNavigation 
            prevLink="/planning/a1-mission" prevLabel="A.1 Sứ mệnh" 
            nextLink="/planning/a3-revenue" nextLabel="A.3 Dự phóng Doanh thu" 
          />
        </div>
      </B2BPageTemplate>
      
      <MascotChatbot 
        formName="Hiệu suất SBU (3 Năm Trước)"
        purpose="Phần này giống như 'Sổ liên lạc' của doanh nghiệp trong 3 năm qua. Nó giúp phát hiện công ty đang đi lên hay đi lùi."
        sections={[
          { title: 'Tỷ suất Lợi nhuận', explanation: 'Bán 100k bạn lờ lãi được bao nhiêu tiền? Nếu con số này tăng lên mỗi năm, chứng tỏ bạn đang kinh doanh rất hiệu quả.' },
          { title: 'Nguyên nhân chính', explanation: 'Hãy viết ngắn gọn 1 lý do lớn nhất khiến doanh thu bạn nhảy vọt hoặc sụt giảm trong năm đó. Ví dụ: Chạy chiến dịch TikTok thành công.' }
        ]}
      />
    </>
  );
}
