"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const ISSUES_DATA = [
  { sbu: 'Sữa chua sấy', market: 'Tăng trưởng nhanh (40%)', comp: 'Khốc liệt về giá, đa dạng đối thủ', issue: 'Mở rộng dung tích nhỏ để tối ưu giá dùng thử.' },
  { sbu: 'Trái cây sấy', market: 'Bão hòa, tăng trưởng chậm', comp: 'Dẫn đầu thị phần, ít biến động', issue: 'Tối ưu hóa chuỗi cung ứng logistics lạnh chung.' },
];

export default function PageC3Issues() {
  const COLUMNS = [
    { key: 'sbu', header: 'Tên SBU', className: 'bg-white font-bold text-slate-800' },
    { key: 'market', header: 'Đặc điểm Thị trường', className: 'bg-slate-50 text-slate-600 border-l border-white' },
    { key: 'comp', header: 'Đặc điểm Cạnh tranh', className: 'bg-slate-50 text-slate-600 border-l border-white' },
    { key: 'issue', header: 'Vấn đề Chiến lược Then chốt', className: 'bg-rose-50 text-rose-700 font-medium border-l border-white' },
  ];

  return (
    <>
    <B2BPageTemplate
      title="Bảng Phân tích Vấn đề (Major Issues)"
      description="Tạo bảng so sánh chéo (cross-reference) vấn đề để HQ dễ dàng ra quyết định."
    >
      <div className="space-y-6">
        <InstructionAlert className="!bg-[#fdf4ff] !border-fuchsia-400 !text-fuchsia-800">
           Mang tất cả các Đặc thù Thị trường và Vấn đề Then chốt (từ SWOT của từng SBU) nhập lên HQ để tìm kiếm điểm cộng hưởng (Synergy).
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={ISSUES_DATA} />
        </div>
        <WizardNavigation prevLink="/planning/c2-history" prevLabel="Về C.2" nextLink="/planning/c4-dashboard" nextLabel="Tiếp tục: C.4 Bảng điều khiển" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="C.3 Phân tích Vấn đề"
      purpose="Mổ xẻ các khoảng trống giữa Kỳ vọng của HQ và Khả năng thực chiến của SBU."
      sections={[
        { title: 'Gap Analysis', explanation: 'Khoảng trống năng lực là thứ nguy hiểm nhất. VD HQ giao mục tiêu tăng trưởng M&A nhưng SBU chưa từng mua bán bao giờ.' }
      ]}
    />
    </>
  );
}
