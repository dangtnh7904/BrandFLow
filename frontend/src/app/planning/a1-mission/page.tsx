"use client";

import React, { useState, useEffect } from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { useRef } from 'react';
import { useFormStore } from '@/store/useFormStore';

export default function PageA1Mission() {
  const { t } = useLanguage();
  
  // ── Database Store Connection ──────────────────────────────────────
  const formKey = 'a1-mission';
  const { forms, saveStatus, updateForm, initializeProject } = useFormStore();
  
  // State cục bộ (tránh lag khi gõ)
  const [localData, setLocalData] = useState({
    role: "",
    business_def: "",
    purpose: "",
    competency: "",
    directions: [] as { type: string; text: string }[]
  });
  const userHasEdited = useRef(false);

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
    if (!userHasEdited.current) return;
    const handler = setTimeout(() => {
      updateForm(formKey, localData);
    }, 1000);
    return () => clearTimeout(handler);
  }, [localData, formKey]);

  // Hàm helper cập nhật Field
  const handleFieldChange = (field: string, value: string) => {
    userHasEdited.current = true;
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleDirectionChange = (idx: number, type: string, text: string) => {
    userHasEdited.current = true;
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
          <div className="flex justify-between items-center bg-linear-surface p-3 rounded-lg border border-linear-border">
            <InstructionAlert className="mb-0 border-0 flex-1">
              Bản tóm tắt định hướng, bao gồm 5 yếu tố: Vai trò, Định nghĩa kinh doanh, Mục đích, Năng lực, và Định hướng.
            </InstructionAlert>
            
            {/* Trạng thái Auto-Save DB */}
            <div className="flex items-center space-x-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-linear-border rounded-full text-xs font-semibold shrink-0">
              {saveStatus === 'saving' && <><Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" /><span className="text-blue-600 dark:text-blue-400">Đang lưu lên DB...</span></>}
              {saveStatus === 'saved' && <><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /><span className="text-cyan-400">Đã lưu tự động</span></>}
              {saveStatus === 'idle' && <><Save className="w-3.5 h-3.5 text-linear-text-muted" /><span className="text-linear-text-muted">Đang đồng bộ</span></>}
              {saveStatus === 'error' && <><span className="text-rose-600 dark:text-rose-400">Lỗi kết nối Server</span></>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bento-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 border-b border-linear-border pb-2">1. Định vị & Năng lực</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-linear-text-muted mb-1.5">Vai trò của doanh nghiệp (Role)</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-linear-surface/50 text-foreground border border-linear-border rounded-lg focus:bg-linear-surface focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" 
                    value={localData?.role || ""} onChange={e => handleFieldChange('role', e.target.value)} />
                </div>

                <div className="pt-2 border-t border-linear-border">
                  <label className="block text-sm font-semibold text-linear-text-muted mb-1.5">Giá trị mang lại</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-linear-surface/50 text-foreground border border-linear-border rounded-lg focus:bg-linear-surface focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" 
                    value={localData?.business_def || ""} onChange={e => handleFieldChange('business_def', e.target.value)} />
                </div>

                <div className="pt-2 border-t border-linear-border">
                  <label className="block text-sm font-semibold text-linear-text-muted mb-1.5">Mục đích (Brand Purpose)</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-linear-surface/50 text-foreground border border-linear-border rounded-lg focus:bg-linear-surface focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" 
                    value={localData?.purpose || ""} onChange={e => handleFieldChange('purpose', e.target.value)} />
                </div>

                <div className="pt-2 border-t border-linear-border">
                  <label className="block text-sm font-semibold text-linear-text-muted mb-1.5">Luật chơi độc quyền (Năng lực khác biệt)</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 bg-linear-surface/50 text-foreground border border-linear-border rounded-lg focus:bg-linear-surface focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all resize-none" 
                    value={localData?.competency || ""} onChange={e => handleFieldChange('competency', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bento-card p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
               
               <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-linear-border pb-2 relative z-10">2. Định hướng Tương lai (Future Direction)</h3>
               <p className="text-sm text-linear-text-muted mb-5 relative z-10">Những việc sẽ làm, có thể làm, và những ranh giới không bao giờ vượt qua.</p>
               
               <div className="space-y-3 relative z-10">
                 {(localData.directions || []).map((dir, idx) => (
                   <div key={idx} className="flex items-start space-x-3">
                     <select 
                       className={clsx(
                         "px-3 py-2.5 text-sm font-semibold border border-linear-border rounded-lg outline-none transition-colors",
                         dir.type === 'will_do' ? 'bg-cyan-500/10 text-cyan-400' :
                         dir.type === 'might_do' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                         'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                       )}
                       value={dir.type}
                       onChange={(e) => handleDirectionChange(idx, e.target.value, dir.text)}
                     >
                       <option value="will_do">Sẽ làm</option>
                       <option value="might_do">Có thể làm</option>
                       <option value="never_do">Không bao giờ</option>
                     </select>

                     <input type="text" className="flex-1 px-4 py-2.5 bg-linear-surface/50 text-foreground border border-linear-border rounded-lg focus:bg-linear-surface focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" 
                       value={dir.text} onChange={(e) => handleDirectionChange(idx, dir.type, e.target.value)} />
                     
                     <button onClick={() => {
                        userHasEdited.current = true;
                        const newArr = localData.directions.filter((_, i) => i !== idx);
                        setLocalData(prev => ({...prev, directions: newArr}));
                     }} className="p-2.5 mt-0.5 text-linear-text-muted hover:text-rose-500 hover:bg-rose-50 dark:bg-rose-500/10 rounded-lg transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
                 
                 <button onClick={() => {
                    userHasEdited.current = true;
                    const newArr = [...localData.directions, { type: 'will_do', text: '' }];
                    setLocalData(prev => ({...prev, directions: newArr}));
                 }} className="mt-4 flex items-center px-4 py-2.5 text-sm font-semibold text-cyan-400 border border-dashed border-cyan-500/30 bg-cyan-500/10/50 rounded-lg hover:bg-cyan-500/10 transition-colors w-full justify-center">
                    <Plus className="w-4 h-4 mr-1.5" /> Thêm định hướng
                 </button>
               </div>
            </div>
          </div>
          
          <WizardNavigation nextLink="/planning/a2-performance" nextLabel="A.2 Đánh giá Hiệu suất SBU" />
        </div>
      </B2BPageTemplate>
      
          </>
  );
}
