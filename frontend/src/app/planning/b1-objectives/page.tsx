"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const OBJ_DATA = [
  { pair: 'Vị nguyên bản / Mẹ & Bé', vol: '130 tấn', margin: '42%', strategy: 'Đẩy mạnh Sampling & TVC', budget: '1,500' },
  { pair: 'Vị trái cây / Văn phòng', vol: '70 tấn', margin: '45%', strategy: 'Kích cầu qua KOC TikTok', budget: '800' },
];

export default function PageB1Objectives() {
  const COLUMNS = [
    { key: 'pair', header: 'Cặp Sản phẩm / Phân khúc', className: 'bg-white font-medium text-slate-700' },
    { key: 'vol', header: 'Mục tiêu Khối lượng', align: 'center' as const, className: 'bg-indigo-50 font-semibold text-indigo-700' },
    { key: 'margin', header: 'Mục tiêu Biên LN Gộp', align: 'center' as const, className: 'bg-emerald-50 font-bold text-emerald-700 border-l border-white' },
    { key: 'strategy', header: 'Chiến lược chính', className: 'bg-slate-50 text-slate-700' },
    { key: 'budget', header: 'Ngân sách (Triệu)', align: 'right' as const, headerClassName: 'bg-rose-100 text-rose-900', className: 'bg-rose-50 text-rose-700 font-bold' },
  ];

  return (
    <>
    <B2BPageTemplate
      title="Mục tiêu và Chiến lược Tổng thể (1 Năm)"
      description="Chiến lược và ngân sách phân bổ theo từng Sản phẩm / Phân khúc."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Bảng Mục tiêu Định lượng và Danh sách Chiến lược (đã gộp Form 1 & 2 của Kế hoạch Vận hành).
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={OBJ_DATA} />
        </div>
        <WizardNavigation prevLink="/planning/b0-overview" prevLabel="Về B.0 Tổng quan" nextLink="/planning/b2-action" nextLabel="Tiếp tục: B.2 Kế hoạch Hành động" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="B.1 Mục tiêu Vận hành"
      purpose="Giờ là lúc chẻ nhỏ giấc mơ 3 năm ở Phần A thành các mục tiêu 12 tháng. Phải rõ ràng để nhân viên hiểu họ cần làm gì ngay ngày mai!"
      sections={[
        { title: 'Tác động mong đợi', explanation: 'Chỉ số đo lường thành công là gì? Ví dụ: Tăng 20% lượng user mới.' }
      ]}
    />
    </>
  );
}
