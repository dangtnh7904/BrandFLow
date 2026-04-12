"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const MAP_DATA = [
  { point: 'Kênh MT (Siêu thị)', ratio: '40%', segments: 'Dân văn phòng, Gia đình', decisions: 'Kệ hàng, Thiết kế bao bì hiện đại/tối giản' },
  { point: 'Chuỗi Mẹ & Bé', ratio: '35%', segments: 'Phụ nữ có con nhỏ', decisions: 'Lời khuyên từ nhân viên bán hàng' },
  { point: 'Kênh Online', ratio: '25%', segments: 'Giới trẻ, Gen Z', decisions: 'Review chân thực, Livestream' },
];

export default function PageA4Market() {
  const { localData, saveStatus } = useAutoSaveForm('a4-market', { items: MAP_DATA });
  const COLUMNS = [
    { key: 'point', header: 'Điểm luân chuyển / Kênh', className: 'bg-white font-medium text-slate-700' },
    { key: 'ratio', header: 'Tỷ trọng', align: 'center' as const, headerClassName: 'bg-indigo-100 text-indigo-900', className: 'bg-indigo-50 font-bold text-indigo-600' },
    { key: 'segments', header: 'Phân khúc mục tiêu', className: 'bg-slate-50 text-slate-700' },
    { key: 'decisions', header: 'Điểm quyết định mua hàng', className: 'bg-white text-slate-600 text-sm' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Tổng quan & Bản đồ Thị trường"
      description="Vẽ bức tranh toàn cảnh về cách thị trường vận hành."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Bản đồ thị trường (Market Map): Xác định điểm quyết định mua hàng và phân khúc khách hàng then chốt.
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/a3-revenue" prevLabel="Về A.3" nextLink="/planning/a5-swot" nextLabel="Tiếp tục: A.5 SWOT" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="Bản đồ Thị trường"
      purpose="Xác định những điểm nghẽn và động cơ khiến ví tiền của khách hàng mở ra."
      sections={[
        { title: 'Điểm quyết định mua', explanation: 'Người mua ở siêu thị (MT) sẽ nhìn vào Bao bì. Người mua Online lại tin vào Review. Đừng tốn tiền làm Review cho gian hàng siêu thị!' }
      ]}
    />
    </>
  );
}
