"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { industryQuestions } from './industryQuestions';
import { useFormStore } from '@/store/useFormStore';
import DynamicQuestionRenderer from './DynamicQuestionRenderer';
import { MessageSquareText } from 'lucide-react';

export default function WizardStep3() {
 const { t } = useLanguage();

 const { wizardAnswers, setWizardAnswer } = useFormStore();
 const selectedIndustry = wizardAnswers['selectedIndustry'] || null;

 const getQuestions = () => {
   if (!selectedIndustry) return { enterprise: [] };
   const keyMap: Record<string, string> = { fb: 'fnb', tech: 'tech', edu: 'edu', cosmetics: 'cosmetics', other: '' };
   const ind = (industryQuestions as any)[keyMap[selectedIndustry]] || {};
   return {
     enterprise: ind.enterprise || []
   };
 };

 const { enterprise } = getQuestions();
 const hasQuestions = enterprise.length > 0;

 const handleAnswerChange = (questionId: string, answer: string, type: string) => {
   if (type === 'checkbox') {
     const current = Array.isArray(wizardAnswers[questionId]) ? wizardAnswers[questionId] : [];
     if (current.includes(answer)) {
       setWizardAnswer(questionId, current.filter((a: string) => a !== answer));
     } else {
       setWizardAnswer(questionId, [...current, answer]);
     }
   } else {
     setWizardAnswer(questionId, answer);
   }
 };

 return (
 <div className="space-y-12">
 
  <div className="text-center mb-8">
  <h2 className="text-2xl font-bold text-foreground mb-2">{t('wizard.step3_title')}</h2>
  <p className="text-linear-text-muted text-sm max-w-lg mx-auto">{t('wizard.step3_desc')}</p>
  </div>

  {hasQuestions && (
    <div className="max-w-4xl mx-auto relative mb-12">
      <DynamicQuestionRenderer 
        title="THÔNG TIN DOANH NGHIỆP" 
        questions={enterprise} 
        wizardAnswers={wizardAnswers} 
        onAnswerChange={handleAnswerChange} 
      />
    </div>
  )}

  <div className="max-w-4xl mx-auto pt-8 border-t border-linear-border mt-8">
    <label className="text-lg font-bold text-foreground flex items-center mb-4">
      <MessageSquareText className="w-5 h-5 mr-2 text-blue-500" /> Chia sẻ thêm ý tưởng của bạn
    </label>
    <p className="text-xs text-linear-text-muted mb-4">Bạn có thể mô tả chi tiết hơn về sản phẩm, ý tưởng kinh doanh sắp tới, hoặc bất kỳ điều gì bạn muốn AI lưu ý khi lập chiến lược.</p>
    <textarea
      rows={5}
      value={wizardAnswers['additionalNotes'] || ''}
      onChange={(e) => setWizardAnswer('additionalNotes', e.target.value)}
      placeholder="Ví dụ: Tôi dự định ra mắt tính năng AI mới vào tháng tới và muốn nhắm tới đối tượng sinh viên..."
      className="w-full px-5 py-4 bg-linear-surface text-foreground border border-linear-border rounded-2xl shadow-sm focus:bg-white dark:focus:bg-[#0B1120] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500/50 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400"
    />
  </div>

  </div>
  );
}
