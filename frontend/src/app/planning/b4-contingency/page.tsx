"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';

const CONT_DATA = [
  { risk: 'Phí sàn TikTok tăng', level: 'TB', impact: 'Giảm 15% biên LN Online', trigger: 'CPO > 25%', action: 'Dịch chuyển 50% ngân sách sang kênh mầm non' },
  { risk: 'Đối thủ giảm giá sốc', level: 'Cao', impact: 'Mất 5% thị phần ngắn hạn', trigger: 'Chênh lệch giá > 30%', action: 'Tung gói Combo tặng kèm, không giảm giá lẻ' },
];

export default function PageB4Contingency() {
  const { localData, saveStatus } = useAutoSaveForm('b4-contingency', { items: CONT_DATA });
  const COLUMNS = [
    { key: 'risk', header: 'Giả định rủi ro', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 'level', header: 'Mức độ', align: 'center' as const, className: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border-x border-white dark:border-slate-800' },
    { key: 'impact', header: 'Tác động tài chính', className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
    { key: 'trigger', header: 'Điểm kích hoạt', align: 'center' as const, headerClassName: 'bg-rose-100 dark:bg-rose-900/30 text-rose-900 dark:text-rose-400', className: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold border-x border-white dark:border-slate-800' },
    { key: 'action', header: 'Hành động dự phòng thực tế', className: 'bg-cyan-500/10 text-cyan-400' },
  ];

  return (
    <B2BPageTemplate
      saveStatus={saveStatus}
      title="Kế hoạch Dự phòng (Contingency Plan)"
      description="Đánh giá rủi ro (Downside risk assessment) để trả lời câu hỏi 'Điều gì xảy ra nếu...?'"
    >
      <div className="space-y-6">
        <InstructionAlert>
          Lập kế hoạch hành động "Backup" cho các giả định rủi ro có khả năng xảy ra cao nhất, kèm điểm kích hoạt (Trigger point) rõ ràng.
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/b3-budget" prevLabel="Về B.3" nextLink="/planning/b5-pnl" nextLabel="Tiếp tục: B.5 Lãi lỗ" />
      </div>
      <MascotChatbot 
        formName="B.4 Kế hoạch Dự phòng"
        purpose="Phao cứu sinh. Đừng để đến khi đắm thuyền mới đi tìm xem phao giấu ở đâu."
        sections={[
          { title: 'Điểm kích hoạt (Trigger)', explanation: 'Khi nào thì dùng dự phòng? Ví dụ: Khi doanh thu rớt dưới 80% mục tiêu trong 2 tháng liên tiếp thì bật chế độ tiết kiệm.' }
        ]}
      />
    </B2BPageTemplate>
  );
}
