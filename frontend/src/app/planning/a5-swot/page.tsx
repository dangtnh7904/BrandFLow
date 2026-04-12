"use client";

import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

const KSF_DATA = [
  { ksf: 'Hàm lượng dinh dưỡng', weight: '35%', our_score: 9, comp_score: 7, issue: 'Cần truyền thông mạnh về lợi khuẩn' },
  { ksf: 'Bao bì/Hình thức', weight: '25%', our_score: 8, comp_score: 8, issue: 'Duy trì phong cách thiết kế tối giản' },
  { ksf: 'Hương vị, độ tơi xốp', weight: '25%', our_score: 9, comp_score: 7, issue: 'Điểm mạnh cốt lõi cần giữ vững' },
  { ksf: 'Mức giá hợp lý', weight: '15%', our_score: 6, comp_score: 9, issue: 'Cần ra mắt túi zip dung tích nhỏ (15g)' },
];

export default function PageA5Swot() {
  const { t } = useLanguage();
  const COLUMNS = [
    { key: 'ksf', header: 'Yếu tố thành công (CSFs)', className: 'bg-white font-medium text-slate-700' },
    { key: 'weight', header: 'Trọng số', align: 'center' as const, className: 'bg-slate-100 font-semibold' },
    { key: 'our_score', header: 'Điểm SBU (1-10)', align: 'center' as const, headerClassName: 'bg-[#eecbff] text-purple-900', className: 'bg-purple-50 text-purple-600 font-bold border-r border-white' },
    { key: 'comp_score', header: 'Điểm Đối thủ', align: 'center' as const, headerClassName: 'bg-[#ffdec2] text-orange-900', className: 'bg-orange-50 text-orange-600 font-bold' },
    { key: 'issue', header: 'Vấn đề then chốt rút ra', className: 'bg-white text-slate-600 border-l border-slate-100' },
  ];

  return (
    <>
    <B2BPageTemplate
      title={t('a5.title' as TranslationKey) as string || "Phân tích SWOT & Năng lực cạnh tranh"}
      description={t('a5.desc' as TranslationKey) as string || "Đánh giá năng lực cốt lõi so với đối thủ cạnh tranh hàng đầu để định hướng phân bổ trọng số chiến lược."}
    >
      <div className="space-y-6">
        <InstructionAlert>
          {t('a5.alert_desc' as TranslationKey) as string || "Bạn phải lặp lại Form này cho MỖI phân khúc khách hàng/sản phẩm quan trọng."}
        </InstructionAlert>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
           <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-widest">Phân khúc: Mẹ bỉm sữa & Trẻ em</h3>
           <PastelTable 
             columns={COLUMNS} 
             data={KSF_DATA}
             footerContent={
               <tr>
                 <td className="px-4 py-3 text-right">Tổng cộng:</td>
                 <td className="px-4 py-3 text-center text-slate-200">100%</td>
                 <td className="px-4 py-3 text-center text-purple-200">8.30</td>
                 <td className="px-4 py-3 text-center text-orange-200">7.65</td>
                 <td className="px-4 py-3"></td>
               </tr>
             }
           />
        </div>
        <WizardNavigation prevLink="/planning/a4-market" prevLabel="Về A.4" nextLink="/planning/a6-portfolio" nextLabel="Tiếp: A.6 Ma trận" />
      </div>
    </B2BPageTemplate>
    <MascotChatbot 
      formName="Phân tích SWOT"
      purpose="Giúp bạn soi chiếu sức mạnh của mình cạnh tranh thế nào so với thủ lĩnh thị trường."
      sections={[
        { title: 'CSF là gì?', explanation: 'Key Success Factors: Bán thuốc thì CSF là uy tín. Bán thời trang CSF là Trendy. Hãy liệt kê CSF cốt Tử của ngành.' }
      ]}
    />
    </>
  );
}
