"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const MATRIX_DATA = [
  { level: 'Tổng Khối lượng', past: '150 tấn', now: '200 tấn', target: '400 tấn', note: 'Động lực chính cho tăng trưởng' },
  { level: 'Thị phần Tổng', past: '12%', now: '15%', target: '25%', note: 'Khai thác thị trường tỉnh' },
  { level: 'Tỷ trọng: Mẹ & Bé', past: '60%', now: '65%', target: '70%', note: 'Phân khúc lõi' },
  { level: 'Tỷ trọng: Văn phòng', past: '40%', now: '35%', target: '30%', note: 'Duy trì doanh thu ổn định' },
  { level: 'SP: Vị Nguyên bản', past: '100%', now: '80%', target: '60%', note: 'Sản phẩm nền tảng' },
  { level: 'SP: Vị Trái cây', past: '0%', now: '20%', target: '40%', note: 'Sản phẩm mở rộng biên LN' },
];

const FOUR_P_DATA = [
  { p: 'Sản phẩm (Product)', content: 'Phát triển bao bì mini 15g; Thiết kế nhận diện tối giản, hiện đại.', cost: '2.5 tỷ VNĐ (R&D + Design)' },
  { p: 'Giá (Price)', content: 'Giữ giá niêm yết Premium; Chiết khấu sâu cho nhà phân phối.', cost: 'N/A (Điều chỉnh biên LN)' },
  { p: 'Phân phối (Place)', content: 'Mở rộng lên 80% độ phủ tại các chuỗi hệ thống Mẹ & Bé.', cost: '4.5 tỷ VNĐ (Trade Mkt)' },
  { p: 'Xúc tiến (Promo)', content: 'TVC hoạt hình giáo dục lợi khuẩn; Tài trợ sự kiện gia đình.', cost: '8.0 tỷ VNĐ' },
];

export default function PageA8Strategies() {
  const { localData, saveStatus } = useAutoSaveForm('a8-strategies', { items: MATRIX_DATA });
  const MATRIX_COLS = [
    { key: 'level', header: 'Cấp độ Mục tiêu', className: 'bg-white font-medium text-slate-700' },
    { key: 'past', header: 'Năm ngoái (t-1)', align: 'center' as const, className: 'bg-slate-50 text-slate-500' },
    { key: 'now', header: 'Năm nay (t0)', align: 'center' as const, headerClassName: 'bg-purple-100 text-purple-900', className: 'bg-purple-50 text-purple-700 font-semibold border-x border-white' },
    { key: 'target', header: 'Mục tiêu (t+3)', align: 'center' as const, headerClassName: 'bg-emerald-100 text-emerald-900', className: 'bg-emerald-50 text-emerald-600 font-bold' },
    { key: 'note', header: 'Ghi chú', className: 'bg-white text-slate-600' },
  ];

  const FOUR_P_COLS = [
    { key: 'p', header: 'Chiến thuật 4P', className: 'bg-slate-50 font-bold text-slate-800' },
    { key: 'content', header: 'Nội dung triển khai chiến lược', className: 'bg-white text-slate-700' },
    { key: 'cost', header: 'Chi phí ước tính (3 năm)', align: 'right' as const, className: 'bg-rose-50 text-rose-700 font-semibold border-l border-white' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Mục tiêu và Chiến lược Marketing (Form 8-11)"
      description="Thiết lập bảng so sánh chi tiết các chỉ số mục tiêu và Chiến lược 4Ps."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Phần này bao gồm Form 8, 9, 10 (Gộp Mục tiêu) và Form 11 (Chiến lược 4Ps).
        </InstructionAlert>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-widest">Ma trận Mục tiêu (Khối lượng, Phân khúc, Sản phẩm)</h3>
           <PastelTable columns={MATRIX_COLS} data={localData.items} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-widest">Chiến lược Marketing 4P & Ước tính chi phí</h3>
           <PastelTable columns={FOUR_P_COLS} data={FOUR_P_DATA} />
        </div>
        <WizardNavigation prevLink="/planning/a7-assumptions" prevLabel="Về A.7" nextLink="/planning/a9-budget" nextLabel="Tiếp tục: A.9 Ngân sách" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="Mục tiêu & Chiến lược"
      purpose="Đây là linh hồn của Marketing. Chỗ phân chia súng đạn (4P) ra chiến trường."
      sections={[
        { title: 'Chiến thuật 4P', explanation: 'Product (Bán cái gì), Price (Bán bao nhiêu), Place (Bán ở đâu) và Promo (Chạy ads thế nào).' }
      ]}
    />
    </>
  );
}
