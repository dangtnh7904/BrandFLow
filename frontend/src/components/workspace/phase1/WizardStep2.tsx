import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { industryQuestions } from './industryQuestions';
import { useFormStore } from '@/store/useFormStore';
import DynamicQuestionRenderer from './DynamicQuestionRenderer';

 export default function WizardStep2() {
  const { t } = useLanguage();
  
  const { wizardAnswers, setWizardAnswer, extractedAnswers } = useFormStore();
  const selectedIndustry = wizardAnswers['selectedIndustry'] || null;

  const getQuestions = () => {
    if (!selectedIndustry) return { founder: [], product: [] };
    const keyMap: Record<string, string> = { fb: 'fnb', tech: 'tech', edu: 'edu', cosmetics: 'cosmetics', other: '' };
    const ind = (industryQuestions as any)[keyMap[selectedIndustry]] || {};
    return {
      founder: ind.founder || [],
      product: ind.product || []
    };
  };

  const { founder, product } = getQuestions();
  const hasQuestions = founder.length > 0 || product.length > 0;

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
  <h2 className="text-2xl font-bold text-foreground mb-2">{t('wizard.step2_title')}</h2>
  <p className="text-linear-text-muted text-sm max-w-lg mx-auto">{t('wizard.step2_desc')}</p>
  </div>

  {hasQuestions && (
    <div className="max-w-4xl mx-auto relative mb-12">
      {extractedAnswers && Object.keys(extractedAnswers).length > 0 && (
        <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-emerald-500 mt-1 shrink-0" />
          <div>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-base mb-1">AI đã tự động phân tích tài liệu của bạn!</p>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
              Các trường thông tin tìm thấy trong file tải lên đã được điền sẵn bên dưới. Bạn có thể thay đổi hoặc chọn thêm.
            </p>
          </div>
        </div>
      )}
      
      <DynamicQuestionRenderer 
        title="THÔNG TIN FOUNDER" 
        questions={founder} 
        wizardAnswers={wizardAnswers} 
        onAnswerChange={handleAnswerChange} 
      />
      
      <DynamicQuestionRenderer 
        title="SẢN PHẨM & KHÁCH HÀNG" 
        questions={product} 
        wizardAnswers={wizardAnswers} 
        onAnswerChange={handleAnswerChange} 
      />
    </div>
  )}

  </div>
  );
}
