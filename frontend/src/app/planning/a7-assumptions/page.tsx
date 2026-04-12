"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const ASSUMP_DATA = [
  { core: 'Xu hướng "Clean Label" tăng 15%/năm', logic: 'Thị hiếu tiêu dùng không đảo chiều', action: 'Giảm chi phí R&D dòng sản phẩm mới' },
  { core: 'Giá nguyên liệu sữa tươi ổn định', logic: 'Biên độ dao động < 5%', action: 'Tìm kiếm nhà cung cấp dự phòng' },
];

export default function PageA7Assumptions() {
  const COLUMNS = [
    { key: 'core', header: 'Giả định cốt lõi', className: 'bg-white font-medium text-slate-700' },
    { key: 'logic', header: 'Điều kiện Logic', className: 'bg-slate-50 text-slate-600' },
    { key: 'action', header: 'Hành động loại bỏ nếu sai', className: 'bg-rose-50 text-rose-700 font-semibold' },
  ];

  return (
    <>
    <B2BPageTemplate
      title="Các giả định (Assumptions)"
      description="Danh sách ngắn gọn các giả định cốt lõi tác động trực tiếp đến kế hoạch."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Nếu một giả định không xảy ra mà kế hoạch vẫn có thể thực hiện được, thì loại bỏ giả định đó khỏi danh sách.
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <PastelTable columns={COLUMNS} data={ASSUMP_DATA} />
        </div>
        <WizardNavigation prevLink="/planning/a6-portfolio" prevLabel="Về A.6" nextLink="/planning/a8-strategies" nextLabel="Tiếp tục: A.8 Mục tiêu & Chiến lược" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="Các giả định"
      purpose="Bảo hiểm rủi ro cho kế hoạch của bạn. Khi kế hoạch thất bại, đổ lỗi cho giả định sai!"
      sections={[
        { title: 'Giả định là gì?', explanation: 'Là những biến số bạn không kiểm soát được nhưng tin là nó sẽ giữ nguyên. VD: Lạm phát dưới 5%, Không có Covid.' }
      ]}
    />
    </>
  );
}
