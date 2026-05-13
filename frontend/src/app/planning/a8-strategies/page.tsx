"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';

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

const MOCK_PHASING = [
  { phase: 'Giai đoạn 1: Teasing (Tạo sóng)', description: 'Tạo sự tò mò trong cộng đồng B2B/BĐS, seeding trên các diễn đàn chuyên ngành và tổ chức các sự kiện kín (Private Event) cho giới thượng lưu/đối tác chiến lược.', time: 'Tháng 1 - Tháng 2' },
  { phase: 'Giai đoạn 2: Launching (Dậy sóng)', description: 'Bùng nổ truyền thông PR, ra mắt chính thức với Mega Event, phủ sóng Omnichannel và chốt sales với các chính sách chiết khấu khủng.', time: 'Tháng 3' },
  { phase: 'Giai đoạn 3: Sustaining (Giữ sóng)', description: 'Duy trì nhiệt bằng các chiến dịch CRM, chương trình thẻ thành viên VIP, và Content Marketing dài hạn để giữ chân khách hàng (Retention).', time: 'Tháng 4 - Tháng 12' },
];

export default function PageA8Strategies() {
  const { localData, saveStatus } = useAutoSaveForm<any>('a8-strategies', { items: [] });
  const MATRIX_COLS = [
    { key: 'level', header: 'Cấp độ Mục tiêu', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 'past', header: 'Năm ngoái (t-1)', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
    { key: 'now', header: 'Năm nay (t0)', align: 'center' as const, headerClassName: 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-400', className: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 font-semibold border-x border-white dark:border-slate-800' },
    { key: 'target', header: 'Mục tiêu (t+3)', align: 'center' as const, headerClassName: 'bg-cyan-500/10 text-cyan-400', className: 'bg-cyan-500/10 text-cyan-400 font-bold' },
    { key: 'note', header: 'Ghi chú', className: 'bg-linear-surface text-linear-text-muted' },
  ];

  const FOUR_P_COLS = [
    { key: 'p', header: 'Chiến thuật 4P', className: 'bg-slate-50 dark:bg-slate-800/50 font-bold text-foreground' },
    { key: 'content', header: 'Nội dung triển khai chiến lược', className: 'bg-linear-surface text-linear-text-muted' },
    { key: 'cost', header: 'Chi phí ước tính (3 năm)', align: 'right' as const, className: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold border-l border-white dark:border-slate-800' },
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
        
        <div className="bento-card p-8 border-cyan-500/20 shadow-sm shadow-cyan-500/5 bg-gradient-to-b from-linear-background to-linear-surface/30">
           <h3 className="text-base font-bold text-cyan-500 dark:text-cyan-400 mb-8 uppercase tracking-widest text-center">
             Biểu Đồ Nhịp Độ Chiến Dịch (Campaign Phasing Wave)
           </h3>
           
           <div className="relative flex flex-col md:flex-row items-end justify-between gap-4 md:gap-2 h-auto md:h-64 mt-12 mb-8">
              {(localData.campaign_phasing || MOCK_PHASING).map((step: any, idx: number) => {
                const isTeasing = idx === 0;
                const isLaunching = idx === 1;
                const isSustaining = idx === 2;
                
                // Cấu hình Wave theo Giai đoạn
                const heightClass = isLaunching ? "h-48 md:h-full" : (isSustaining ? "h-32 md:h-4/5" : "h-24 md:h-3/5");
                const colorClass = isLaunching ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105 z-10" : 
                                   (isSustaining ? "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-2 border-sky-500/30" : 
                                   "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700");
                
                const title = step.phase || (typeof step === 'string' ? step : `Phase ${idx+1}`);
                const desc = step.description || step;

                return (
                  <div key={idx} className={`relative flex-1 rounded-t-2xl p-4 md:p-6 transition-all duration-500 hover:brightness-110 flex flex-col justify-between ${heightClass} ${colorClass}`}>
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isLaunching ? 'bg-white/20 text-white' : 'bg-slate-200/50 dark:bg-slate-700/50'}`}>
                          {step.time || `T${idx+1}`}
                        </span>
                        {isLaunching && <span className="animate-pulse w-2 h-2 rounded-full bg-white"></span>}
                      </div>
                      <h4 className={`font-bold ${isLaunching ? 'text-lg md:text-xl' : 'text-base'} mb-2 line-clamp-2`}>{title}</h4>
                    </div>
                    
                    {/* Tooltip-like description on hover or fixed text */}
                    <p className={`text-xs md:text-sm leading-relaxed ${isLaunching ? 'text-cyan-50' : 'text-slate-600 dark:text-slate-400'} line-clamp-3 md:line-clamp-none`}>
                      {desc}
                    </p>
                  </div>
                );
              })}
           </div>
           
           {/* Trục X thời gian */}
           <div className="flex justify-between items-center px-4 py-2 border-t-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-bold text-linear-text-muted uppercase">
             <span>Khởi động (Tạo sóng)</span>
             <span className="text-cyan-500">Bùng nổ (Dậy sóng)</span>
             <span>Duy trì (Giữ sóng)</span>
           </div>
        </div>

        <div className="bento-card p-6">
           <h3 className="text-sm font-semibold text-linear-text-muted mb-4 uppercase tracking-widest">Ma trận Mục tiêu (Khối lượng, Phân khúc, Sản phẩm)</h3>
           <PastelTable columns={MATRIX_COLS} data={localData.items || MATRIX_DATA} />
        </div>

        <div className="bento-card p-6">
           <h3 className="text-sm font-semibold text-linear-text-muted mb-4 uppercase tracking-widest">Chiến lược Marketing 4P & Ước tính chi phí</h3>
           <PastelTable columns={FOUR_P_COLS} data={FOUR_P_DATA} />
        </div>
        <WizardNavigation prevLink="/planning/a7-assumptions" prevLabel="Về A.7" nextLink="/planning/a9-budget" nextLabel="Tiếp tục: A.9 Ngân sách" />
      </div>
    </B2BPageTemplate>
        </>
  );
}
