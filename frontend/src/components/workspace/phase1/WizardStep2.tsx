import { Sparkles, Globe, ShieldCheck, Target, Award, BarChart3, Crosshair, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { industryQuestions } from './industryQuestions';
import { useFormStore } from '@/store/useFormStore';
import DynamicQuestionRenderer from './DynamicQuestionRenderer';

 export default function WizardStep2() {
  const { t } = useLanguage();
  
  const wizardAnswers = useFormStore(state => state.wizardAnswers);
  const setWizardAnswer = useFormStore(state => state.setWizardAnswer);
  const extractedAnswers = useFormStore(state => state.extractedAnswers);
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

  const audit = (extractedAnswers?.strategic_marketing_audit as unknown as Record<string, any> | null) ?? null;

  return (
  <div className="space-y-12">
  
  <div className="text-center mb-8">
  <h2 className="text-2xl font-bold text-foreground mb-2">{t('wizard.step2_title')}</h2>
  <p className="text-linear-text-muted text-sm max-w-lg mx-auto">{t('wizard.step2_desc')}</p>
  </div>

  {/* Hiển thị Deep Dive Audit 2024 nếu có từ AI */}
  {audit && (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="mb-6 p-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg flex items-center gap-4 text-white">
        <Sparkles className="w-8 h-8 shrink-0" />
        <div>
          <h3 className="font-black text-xl mb-1">BrandFlow Strategic Audit 2024</h3>
          <p className="text-sm text-blue-100">
            Hệ thống AI đã quét và phân tích sâu tài liệu của bạn theo mô hình Quản trị Chiến lược chuẩn xác.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PESTLE */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-blue-500/30 transition-colors">
          <h4 className="text-sm uppercase text-blue-400 font-black mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" /> Vĩ mô (PESTLE)
          </h4>
          <ul className="space-y-3">
            {Array.isArray(audit.macro_environment_pestle) && audit.macro_environment_pestle.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Competences & Objectives */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-emerald-500/30 transition-colors">
            <h4 className="text-sm uppercase text-emerald-400 font-black mb-4 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2" /> Năng lực Cốt lõi (VRIO)
            </h4>
            <ul className="space-y-3">
              {Array.isArray(audit.core_competences) && audit.core_competences.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-purple-500/30 transition-colors">
            <h4 className="text-sm uppercase text-purple-400 font-black mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" /> Mục tiêu MKT (Ansoff)
            </h4>
            <ul className="space-y-3">
              {Array.isArray(audit.marketing_objectives) && audit.marketing_objectives.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Positioning & Trust */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 rounded-2xl border border-amber-500/20 shadow-xl">
            <h4 className="text-sm uppercase text-amber-500 font-black mb-3 flex items-center">
              <Crosshair className="w-5 h-5 mr-2" /> Vị thế Cạnh tranh
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {audit.competitive_positioning}
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 rounded-2xl border border-cyan-500/20 shadow-xl flex items-center justify-between">
            <div>
              <h4 className="text-sm uppercase text-cyan-400 font-black mb-2 flex items-center">
                <Award className="w-5 h-5 mr-2" /> Điểm Niềm Tin (Trust Score)
              </h4>
              <p className="text-xs text-slate-400">Đánh giá độ tín nhiệm của thương hiệu dựa trên tín hiệu dữ liệu</p>
            </div>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {audit.trust_score}<span className="text-2xl text-cyan-500/50">/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {hasQuestions && (
    <div className="max-w-4xl mx-auto relative mb-12">
      {!audit && extractedAnswers && Object.keys(extractedAnswers).length > 0 && (
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
      
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px bg-linear-border flex-1"></div>
        <span className="text-xs font-bold text-linear-text-muted uppercase tracking-widest">Bổ sung thông tin khảo sát</span>
        <div className="h-px bg-linear-border flex-1"></div>
      </div>

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
