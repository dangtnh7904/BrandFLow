"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';

const MATRIX_DATA = [
  { level: 'Tổng Doanh Thu', past: '1.2 tỷ', now: '1.8 tỷ', target: '3 tỷ', note: 'Mục tiêu sau 90 ngày Launching' },
  { level: 'Khách quay lại (Retention)', past: '15%', now: '35%', target: '50%', note: 'Hệ sinh thái Mini App' },
  { level: 'Tỷ trọng: Gen Z', past: '30%', now: '50%', target: '60%', note: 'Khách hàng mục tiêu chính' },
  { level: 'Tỷ trọng: Khách văn phòng', past: '50%', now: '40%', target: '35%', note: 'Business Lunch' },
  { level: 'SP: Cơm niêu gia đình', past: '80%', now: '70%', target: '60%', note: 'Món lõi truyền thống' },
  { level: 'SP: Combo Trưa bã mía', past: '0%', now: '15%', target: '25%', note: 'Thêm dòng SP mới thân thiện' },
];

const FOUR_P_DATA = [
  { p: 'Sản phẩm (Product)', content: 'Phát triển gói Business Lunch hộp bã mía thân thiện môi trường; Tặng kèm thẻ chánh niệm.', cost: '30 triệu VNĐ (R&D)' },
  { p: 'Giá (Price)', content: 'Premium Pricing (250k-400k/người); Không giảm giá sâu, áp dụng Scarcity Marketing.', cost: 'N/A' },
  { p: 'Phân phối (Place)', content: 'Booking qua Zalo Mini App; Phân phối trực tiếp tại cửa hàng.', cost: '20 triệu VNĐ' },
  { p: 'Xúc tiến (Promo)', content: 'Brand Film Cinematic "Về Nhà Ăn Cơm"; Tương tác Influencer đa kênh TikTok/Facebook.', cost: '90 triệu VNĐ' },
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
                        {isLaunching && <span className="animate-pulse w-2 h-2 rounded-full bg-linear-surface "></span>}
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
