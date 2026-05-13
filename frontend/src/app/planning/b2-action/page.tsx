"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { Target, Compass, Globe, Clock, Users, Wrench } from 'lucide-react';

const ACTION_DATA = [
  { obj: 'Trực quan hóa công dụng lợi khuẩn', tactic: 'Sản xuất TVC hoạt hình: 1 Mascot duy nhất vươn tay chỉ trực diện vào đồ họa đường ruột đang tiêu hóa tốt.', owner: 'Creative Team', deadline: 'Tuần 3, Tháng 8', cost: '300,000,000' },
  { obj: 'Tăng tương tác điểm bán', tactic: 'Tổ chức booth dùng thử, chụp hình check-in cùng Mascot đơn.', owner: 'Trade Mkt', deadline: 'Tháng 9', cost: '150,000,000' },
];

export default function PageB2Action() {
  const { localData, saveStatus } = useAutoSaveForm<any>('b2-action', { items: [] });
  
  const COLUMNS = [
    { key: 'obj', header: 'Mục tiêu phụ', className: 'bg-linear-surface font-medium text-linear-text-muted', width: '200px' },
    { key: 'tactic', header: 'Hành động / Chiến thuật', className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
    { key: 'owner', header: 'Trách nhiệm', align: 'center' as const, headerClassName: 'bg-sky-100 dark:bg-sky-900/30 text-sky-900 dark:text-sky-400', className: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 font-semibold' },
    { key: 'deadline', header: 'Deadline', align: 'center' as const, className: 'bg-linear-surface text-linear-text-muted' },
    { key: 'cost', header: 'Chi phí (VNĐ)', align: 'right' as const, className: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold border-l border-white dark:border-slate-800' },
  ];

  // Mock data for AI mappings if not yet populated
  const plan_5w1h = localData?.plan_5w1h || {
    why: "Chiếm lĩnh 25% thị phần qua hệ thống Mẹ & Bé.",
    what: "Ra mắt sản phẩm Bao bì Mini 15g.",
    where: "Kênh chuỗi MT (Mẹ & Bé) và Kênh TMĐT.",
    when: "Quý 3 - Quý 4 năm nay.",
    who: "Marketing Dept phối hợp cùng Trade Sales.",
    how: "Chiến dịch Omni-channel O2O (Online to Offline)."
  };

  const dist_channels = localData?.distribution_channels || {
    gt_strategy: "Bao phủ 8,000 điểm tạp hóa cấp 2. Tập trung Visibility (Hanger/Wobbler).",
    mt_strategy: "Chiết khấu 30% cho Top 3 chuỗi Mẹ & Bé. Triển khai kệ hàng đầu end-cap."
  };

  const crm_plan = localData?.omnichannel_crm_plan || [
    "Xây dựng Zalo Mini App để quét QR tích điểm thẻ VIP.",
    "Tự động hóa Email Marketing nhắc lịch mua lại (30 ngày)."
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Kế hoạch Hành động Chi tiết (5W1H & IMC)"
      description="Trái tim của kế hoạch thực thi, tích hợp tư duy 5W1H, Phân phối GT/MT và Omnichannel CRM."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Phân rã Mục tiêu thành các Hành động chi tiết, phối hợp Ma trận IMC và Quản trị Quan hệ Khách hàng (CRM) từ dữ liệu AI.
        </InstructionAlert>

        {/* 5W1H Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bento-card p-6 border-indigo-500/20 shadow-sm shadow-indigo-500/5 col-span-1 lg:col-span-2">
             <h3 className="text-sm font-semibold text-indigo-400 mb-6 uppercase tracking-widest flex items-center">
               <Compass className="w-4 h-4 mr-2" /> Khung Chiến Lược 5W1H
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { k: 'Why', v: plan_5w1h.why, icon: Target, color: 'text-rose-500 bg-rose-500/10' },
                  { k: 'What', v: plan_5w1h.what, icon: Wrench, color: 'text-amber-500 bg-amber-500/10' },
                  { k: 'Where', v: plan_5w1h.where, icon: Globe, color: 'text-emerald-500 bg-emerald-500/10' },
                  { k: 'When', v: plan_5w1h.when, icon: Clock, color: 'text-cyan-500 bg-cyan-500/10' },
                  { k: 'Who', v: plan_5w1h.who, icon: Users, color: 'text-purple-500 bg-purple-500/10' },
                  { k: 'How', v: plan_5w1h.how, icon: Compass, color: 'text-indigo-500 bg-indigo-500/10' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-linear-border flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground uppercase">{item.k}</h4>
                      <p className="text-xs text-linear-text-muted mt-1 leading-relaxed">{item.v}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Channels & CRM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bento-card p-6 border-emerald-500/20 shadow-sm shadow-emerald-500/5">
             <h3 className="text-sm font-semibold text-emerald-500 mb-4 uppercase tracking-widest">Chiến lược Kênh Phân phối</h3>
             <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mb-1">General Trade (GT)</h4>
                  <p className="text-sm text-emerald-600/80 dark:text-emerald-300/80">{dist_channels.gt_strategy}</p>
                </div>
                <div className="bg-sky-50 dark:bg-sky-500/10 p-4 rounded-xl border border-sky-500/20">
                  <h4 className="font-bold text-sky-700 dark:text-sky-400 text-sm mb-1">Modern Trade (MT)</h4>
                  <p className="text-sm text-sky-600/80 dark:text-sky-300/80">{dist_channels.mt_strategy}</p>
                </div>
             </div>
          </div>

          <div className="bento-card p-6 border-purple-500/20 shadow-sm shadow-purple-500/5 bg-gradient-to-br from-linear-background to-purple-500/5">
             <h3 className="text-sm font-semibold text-purple-500 mb-6 uppercase tracking-widest text-center">Phễu Hành Trình Khách Hàng (Customer Journey Funnel)</h3>
             <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-1">
                {crm_plan.map((plan: string, idx: number) => {
                  // Funnel sizing logic
                  const widthClass = idx === 0 ? "w-full" : 
                                     idx === 1 ? "w-[90%]" : 
                                     idx === 2 ? "w-[80%]" : "w-[70%]";
                  const colors = [
                    "bg-purple-500/20 border-purple-500/30 text-purple-700 dark:text-purple-300",
                    "bg-purple-500/40 border-purple-500/50 text-purple-800 dark:text-purple-200",
                    "bg-purple-500/60 border-purple-500/70 text-white font-semibold",
                    "bg-purple-600 border-purple-700 text-white font-bold shadow-lg shadow-purple-500/30"
                  ];
                  const phaseLabel = idx === 0 ? "Nhận thức" : idx === 1 ? "Cân nhắc" : idx === 2 ? "Mua hàng" : "Giữ chân (Retention)";
                  
                  return (
                    <div key={idx} className={`${widthClass} ${colors[idx % colors.length]} p-3 border-2 transition-all hover:scale-[1.02] cursor-default`} 
                         style={{
                           clipPath: idx === 0 ? 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' :
                                     idx === crm_plan.length - 1 ? 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)' : 
                                     'polygon(5% 0, 95% 0, 95% 100%, 5% 100%)',
                           borderRadius: idx === 0 ? '8px 8px 0 0' : idx === crm_plan.length - 1 ? '0 0 12px 12px' : '0'
                         }}>
                      <div className="text-center">
                        <span className="block text-[10px] uppercase tracking-wider opacity-80 mb-0.5">{phaseLabel}</span>
                        <p className="text-xs text-balance px-4">{plan}</p>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
        
        {/* Tactics Table */}
        <div className="bento-card p-6">
           <h3 className="text-sm font-semibold text-linear-text-muted mb-4 uppercase tracking-widest">Bảng Kế Hoạch 7Ps</h3>
           <PastelTable columns={COLUMNS} data={localData.items || ACTION_DATA} />
        </div>

        <WizardNavigation prevLink="/planning/b1-objectives" prevLabel="Về B.1" nextLink="/planning/b3-budget" nextLabel="Tiếp tục: B.3 Ngân sách Marketing" />
      </div>
    </B2BPageTemplate>
    </>
  );
}
