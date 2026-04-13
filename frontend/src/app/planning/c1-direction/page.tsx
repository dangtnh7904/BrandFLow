"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

const DIR_DATA = [
  { item: 'Đóng góp mục tiêu', content: 'Tổng doanh thu 500 tỷ trong 3 năm.' },
  { item: 'Định nghĩa kinh doanh', content: 'Hệ sinh thái thực phẩm xanh, sạch, bản địa.' },
  { item: 'Hướng đi tương lai', content: 'Chiếm lĩnh nội địa, chuẩn bị tiêu chuẩn xuất khẩu.' },
];

export default function PageC1Direction() {
  const { localData, saveStatus } = useAutoSaveForm('c1-direction', { items: DIR_DATA });
  const { t } = useLanguage();
  const COLUMNS = [
    { key: 'item', header: 'Yếu tố Cấp Tập đoàn (HQ)', className: 'bg-linear-surface font-medium text-linear-text-muted w-1/3' },
    { key: 'content', header: 'Nội dung', className: 'bg-slate-50 dark:bg-slate-800/50 text-foreground font-semibold' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title={t('c1.title' as TranslationKey) as string || "Định hướng Tập đoàn / HQ"}
      description={t('c1.desc' as TranslationKey) as string || "Hợp nhất sứ mệnh và các định hướng chiến lược trên toàn bộ các thương hiệu vệ tinh."}
    >
      <div className="space-y-6">
        <InstructionAlert className="!bg-[#fdf4ff] !border-fuchsia-400 !text-fuchsia-800">
           <strong>{t('c1.alert_title' as TranslationKey) as string || "Cấp độ HQ:"}</strong> {t('c1.alert_desc' as TranslationKey) as string || "Tuyên bố định hướng này quyết định việc phân chia ngân sách cho các đơn vị bên dưới."}
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        <WizardNavigation prevLink="/planning/c0-overview" prevLabel="Về C.0 Tổng quan" nextLink="/planning/c2-history" nextLabel="Tiếp tục: C.2 Lịch sử Danh mục" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="C.1 Tuyên bố Định hướng"
      purpose="Bản tóm tắt dành cho Giám đốc điều hành Tập đoàn. Đọc một phát hiểu ngay công ty con này sẽ đi về đâu."
      sections={[
        { title: 'Tại sao cần đọc lướt?', explanation: 'Ở cấp HQ, họ không có thời gian quan tâm bạn chạy ads nào. Họ chỉ cần biết hướng đi (Tấn công/Phòng thủ/Thoái vốn) và Cốt lõi.' }
      ]}
    />
    </>
  );
}
