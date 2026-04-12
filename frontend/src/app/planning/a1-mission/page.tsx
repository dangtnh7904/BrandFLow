"use client";

import React, { useState, useEffect } from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import MascotChatbot from '@/components/b2b/MascotChatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { useFormStore } from '@/store/useFormStore';

export default function PageA1Mission() {
  const { t } = useLanguage();
  
  // ── Database Store Connection ──────────────────────────────────────
  const formKey = 'a1-mission';
  const { forms, saveStatus, updateForm, initializeProject } = useFormStore();
  
  // State cục bộ (tránh lag khi gõ)
  const [localData, setLocalData] = useState({
    role: "Đơn vị mũi nhọn tạo lợi nhuận, khai thác phân khúc ăn vặt cao cấp.",
    business_def: "Giải pháp dinh dưỡng tiện lợi, bảo toàn vi chất và lợi khuẩn.",
    purpose: "Biến bữa ăn nhẹ thành hành động chăm sóc sức khỏe chủ động.",
    competency: "Công nghệ sấy thăng hoa âm 40°C khép kín, giữ 98% cấu trúc.",
    directions: [
      { type: 'will_do', text: 'Phủ sóng kênh siêu thị.' },
      { type: 'never_do', text: 'Dùng hương liệu nhân tạo.' }
    ]
  });

  // Khởi tạo DB khi mở trang lần đầu
  useEffect(() => {
    initializeProject();
  }, []);

  // Lôi data từ Server đắp vào State cục bộ sau khi Load xong
  useEffect(() => {
    if (forms[formKey]) {
      setLocalData(forms[formKey]);
    }
  }, [forms]);

  // Bộ đếm 1 giây sau khi User ngừng gõ -> Lưu lên DB (Debounce Auto-save)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Vì tránh loop load lần đầu do object ref, ta chỉ gọi updateForm khi thực sự có localData mới
      updateForm(formKey, localData);
    }, 1000);
    return () => clearTimeout(handler);
  }, [localData, formKey]);

  // Hàm helper cập nhật Field
  const handleFieldChange = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleDirectionChange = (idx: number, type: string, text: string) => {
    const newArr = [...localData.directions];
    newArr[idx] = { type, text };
    setLocalData(prev => ({ ...prev, directions: newArr }));
  };

  return (
    <>
      <B2BPageTemplate
        title={t('a1.title' as TranslationKey) as string || "Sứ mệnh & Định nghĩa"}
        description={t('a1.desc' as TranslationKey) as string || "Xác định tuyên ngôn sứ mệnh cốt lõi, vai trò và các định hướng bao trùm cho doanh nghiệp."}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
            <InstructionAlert className="mb-0 border-0 flex-1">
              Bản tóm tắt định hướng, bao gồm 5 yếu tố: Vai trò, Định nghĩa kinh doanh, Mục đích, Năng lực, và Định hướng.
            </InstructionAlert>
            
            {/* Trạng thái Auto-Save DB */}
            <div className="flex items-center space-x-2 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold shrink-0">
              {saveStatus === 'saving' && <><Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" /><span className="text-blue-600">Đang lưu lên DB...</span></>}
              {saveStatus === 'saved' && <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-600">Đã lưu tự động</span></>}
              {saveStatus === 'idle' && <><Save className="w-3.5 h-3.5 text-slate-400" /><span className="text-slate-500">Đang đồng bộ</span></>}
              {saveStatus === 'error' && <><span className="text-rose-600">Lỗi kết nối Server</span></>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2">1. Định vị & Năng lực</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vai trò của doanh nghiệp (Role)</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                    value={localData?.role || ""} onChange={e => handleFieldChange('role', e.target.value)} />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá trị mang lại</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                    value={localData?.business_def || ""} onChange={e => handleFieldChange('business_def', e.target.value)} />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mục đích (Brand Purpose)</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                    value={localData?.purpose || ""} onChange={e => handleFieldChange('purpose', e.target.value)} />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Luật chơi độc quyền (Năng lực khác biệt)</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none" 
                    value={localData?.competency || ""} onChange={e => handleFieldChange('competency', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
               
               <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2 relative z-10">2. Định hướng Tương lai (Future Direction)</h3>
               <p className="text-sm text-slate-500 mb-5 relative z-10">Những việc sẽ làm, có thể làm, và những ranh giới không bao giờ vượt qua.</p>
               
               <div className="space-y-3 relative z-10">
                 {(localData.directions || []).map((dir, idx) => (
                   <div key={idx} className="flex items-start space-x-3">
                     <select 
                       className={clsx(
                         "px-3 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg outline-none transition-colors",
                         dir.type === 'will_do' ? 'bg-emerald-50 text-emerald-700' :
                         dir.type === 'might_do' ? 'bg-amber-50 text-amber-700' :
                         'bg-rose-50 text-rose-700'
                       )}
                       value={dir.type}
                       onChange={(e) => handleDirectionChange(idx, e.target.value, dir.text)}
                     >
                       <option value="will_do">Sẽ làm</option>
                       <option value="might_do">Có thể làm</option>
                       <option value="never_do">Không bao giờ</option>
                     </select>

                     <input type="text" className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                       value={dir.text} onChange={(e) => handleDirectionChange(idx, dir.type, e.target.value)} />
                     
                     <button onClick={() => {
                        const newArr = localData.directions.filter((_, i) => i !== idx);
                        setLocalData(prev => ({...prev, directions: newArr}));
                     }} className="p-2.5 mt-0.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
                 
                 <button onClick={() => {
                    const newArr = [...localData.directions, { type: 'will_do', text: '' }];
                    setLocalData(prev => ({...prev, directions: newArr}));
                 }} className="mt-4 flex items-center px-4 py-2.5 text-sm font-semibold text-emerald-600 border border-dashed border-emerald-200 bg-emerald-50/50 rounded-lg hover:bg-emerald-50 transition-colors w-full justify-center">
                    <Plus className="w-4 h-4 mr-1.5" /> Thêm định hướng
                 </button>
               </div>
            </div>
          </div>
          
          <WizardNavigation nextLink="/planning/a2-performance" nextLabel="A.2 Đánh giá Hiệu suất SBU" />
        </div>
      </B2BPageTemplate>
      
      <MascotChatbot 
        formName="Tuyên bố Sứ mệnh"
        purpose="Mục đích của Form này là giúp bạn và đội ngũ xác định rõ 'Lý do tồn tại' của dự án/công ty trước khi bắt đầu lập kế hoạch tài chính!"
        sections={[
          { title: 'Vai trò (Role)', explanation: 'Ví dụ nếu công ty bạn là một cái cây, vai trò của nó là tạo ra bóng mát hay sinh ra quả ngọt? Ở đây, SBU của bạn sinh ra để mang về lợi nhuận hay để lan tỏa thương hiệu?' },
          { title: 'Định nghĩa Kinh doanh', explanation: 'Đừng nói bạn bán Giày. Hãy nói bạn bán "Sức khỏe đôi chân và sự tự tin khi chạy vấp đá không té". Bán giải pháp thay vì bán sản phẩm vật lý.' },
          { title: 'Luật chơi độc quyền', explanation: 'Công nghệ bảo mật, máy móc công nghiệp độc quyền, hay công thức pha chế bí truyền của bạn là gì? Thứ mà đối thủ không thể copy được.' },
        ]}
      />
    </>
  );
}
