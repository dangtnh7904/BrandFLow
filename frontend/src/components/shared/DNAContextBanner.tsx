"use client";

import React from 'react';
import { Dna, Wallet, Lightbulb, Target, AlertTriangle, ArrowRight } from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function DNAContextBanner() {
  const { language } = useLanguage();
  const { brandDNA, wizardAnswers, extractedAnswers, businessIntent } = useFormStore();

  const brandName = brandDNA?.brand_name || wizardAnswers?.company_name || extractedAnswers?.company_name;
  const tone = brandDNA?.tone_of_voice || wizardAnswers?.tone_of_voice || extractedAnswers?.tone_of_voice;
  const usps = brandDNA?.core_usps || wizardAnswers?.core_usps || extractedAnswers?.core_usps;
  const industry = brandDNA?.industry || wizardAnswers?.selectedIndustry || extractedAnswers?.industry;

  const hasDNA = brandName || tone || (usps && usps.length > 0);

  if (!hasDNA) {
    return (
      <div className="w-full mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-400">
            {language === 'vi'
              ? 'Chưa có dữ liệu Brand DNA — Kết quả AI sẽ chung chung hơn.'
              : 'No Brand DNA data yet — AI outputs will be generic.'}
          </p>
          <p className="text-xs text-linear-text-muted mt-0.5">
            {language === 'vi'
              ? 'Hãy tải tài liệu doanh nghiệp lên tại Workspace để AI hiểu rõ thương hiệu của bạn.'
              : 'Upload your business documents in the Workspace so AI understands your brand.'}
          </p>
        </div>
        <Link
          href="/workspace"
          className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
        >
          {language === 'vi' ? 'Thiết lập' : 'Setup'} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  return (
    <div className="w-full mb-6 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <Dna className="w-4 h-4 text-cyan-500" />
        <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
          Brand DNA {language === 'vi' ? 'Đang hoạt động' : 'Active'}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-linear-text-muted">
        {brandName && (
          <span>
            <span className="text-foreground font-semibold">{brandName}</span>
            {industry && <span className="ml-1 opacity-60">· {industry}</span>}
          </span>
        )}
        {tone && (
          <span>
            {language === 'vi' ? 'Giọng văn' : 'Tone'}: <span className="text-foreground font-medium">{typeof tone === 'string' ? tone.substring(0, 40) : tone}</span>
          </span>
        )}
        {usps && usps.length > 0 && (
          <span>
            USP: <span className="text-foreground font-medium">{usps.slice(0, 2).join(', ')}</span>
            {usps.length > 2 && <span className="opacity-60"> +{usps.length - 2}</span>}
          </span>
        )}
        {businessIntent.mode && (
          <span className="flex items-center gap-1">
            {businessIntent.mode === 'budget_first' ? (
              <><Wallet className="w-3 h-3 text-emerald-500" /> <span className="text-emerald-400 font-medium">{formatVND(businessIntent.budget || 0)} VNĐ</span></>
            ) : (
              <><Lightbulb className="w-3 h-3 text-violet-500" /> <span className="text-violet-400 font-medium">{language === 'vi' ? 'Ý tưởng' : 'Idea'}</span></>
            )}
          </span>
        )}
        {businessIntent.businessGoal && (
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3 text-cyan-500" />
            <span className="text-foreground font-medium truncate max-w-48">{businessIntent.businessGoal}</span>
          </span>
        )}
      </div>
    </div>
  );
}
