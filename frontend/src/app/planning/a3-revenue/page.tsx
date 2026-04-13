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

const FIN_DATA = [
  { metric: 'Doanh thu thuần', t0: '60 tỷ', t1: '80 tỷ', t2: '100 tỷ', t3: '120 tỷ', source: 'Sản phẩm mới (Mix hạt)' },
  { metric: 'Lợi nhuận gộp', t0: '25.2 tỷ', t1: '34.4 tỷ', t2: '44 tỷ', t3: '54 tỷ', source: 'Tăng độ phủ phân khúc Mẹ & Bé' },
];

export default function PageA3Revenue() {
  const { localData, saveStatus } = useAutoSaveForm('a3-revenue', { items: FIN_DATA });
  const { t } = useLanguage();
  const FIN_COLUMNS = [
    { key: 'metric', header: 'Hạng mục dự báo', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 't0', header: 'Năm t0 (Nay)', align: 'center' as const, headerClassName: 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-400', className: 'bg-purple-50 dark:bg-purple-500/10 font-semibold text-purple-700 dark:text-purple-400' },
    { key: 't1', header: 'Năm t+1', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
    { key: 't2', header: 'Năm t+2', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
    { key: 't3', header: 'Năm t+3', align: 'center' as const, headerClassName: 'bg-cyan-500/10 text-cyan-400', className: 'bg-cyan-500/10 font-bold text-cyan-400' },
    { key: 'source', header: 'Nguồn tăng trưởng', className: 'bg-linear-surface text-linear-text-muted text-xs' },
  ];

  return (
    <>
    <B2BPageTemplate
      saveStatus={saveStatus}
      title={t('a3.title' as TranslationKey) as string || "Dự phóng Doanh thu & Chỉ số Tài chính"}
      description={t('a3.desc' as TranslationKey) as string || "Tính toán và trực quan hóa kỳ vọng P&L dài hạn."}
    >
      <div className="space-y-6">
        <InstructionAlert className="!bg-cyan-500/10 border-cyan-500 !text-cyan-400">
           <strong>{t('a3.alert_title' as TranslationKey) as string || "Mục tiêu Tài chính:"}</strong> {t('a3.alert_desc' as TranslationKey) as string || "Bảng tóm tắt trực quan để người đọc nắm bắt ngay kết quả tài chính (từ Form 3)."}
        </InstructionAlert>

        <div className="bento-card p-6">
           <h3 className="text-sm font-semibold text-linear-text-muted mb-4 uppercase tracking-widest">Dự báo (Projections)</h3>
           <PastelTable columns={FIN_COLUMNS} data={localData.items} />
        </div>

        {/* Charts Mock */}
        <div className="bento-card p-6 min-h-[350px] flex flex-col">
           <h3 className="text-sm font-semibold text-linear-text-muted mb-4 uppercase tracking-widest text-center">Biểu đồ Doanh Thu Cột/Đường</h3>
           <div className="flex-1 flex items-center justify-center border-2 border-dashed border-linear-border rounded-lg">
             <span className="text-linear-text-muted">--- Chart Area ---</span>
           </div>
        </div>
        
        <WizardNavigation 
          prevLink="/planning/a2-performance" prevLabel="A.2 Hiệu suất SBU" 
          nextLink="/planning/a4-market" nextLabel="A.4 Bản đồ Thị trường" 
        />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="Dự phóng Doanh thu"
      purpose="Bảng tiêu chuẩn dành cho CEO nhìn vào để biết tiền vào bằng chừng nào, tiền ra bằng mức nào."
      sections={[
        { title: 'Tương lai là thứ không ai biết', explanation: 'Chính xác! Các số liệu t+1, t+2 chỉ mang tính giả thực tế. Nhưng bạn cần điền đầy đủ và tự hỏi: "Nếu nỗ lực hết sức, khả thi để đạt mốc này không?"' }
      ]}
    />
    </>
  );
}
