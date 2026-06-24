import React from 'react';
import { Target, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ActivePlansCard() {
  const { t } = useLanguage();
  return (
    <div className="bento-card col-span-1 md:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-between group cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-slate-900 text-lg font-bold tracking-tight mb-2 flex items-center">
            <Target className="w-5 h-5 mr-2 text-cyan-600" />
            {t('dashboard_home.active_plans')}
          </h3>
          <p className="text-slate-500 text-sm">{t('dashboard_home.active_desc')}</p>
        </div>
        <div className="p-2 rounded-full bg-slate-100 group-hover:bg-cyan-50 transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
        </div>
      </div>

      <div className="space-y-3">
        {[
          { name: "Q3 Launch Campaign", budget: "$45,000", roi: "+24%", status: t('dashboard_home.plan_status1') },
          { name: "Brand Awareness", budget: "$12,000", roi: "+12%", status: t('dashboard_home.plan_status2') }
        ].map((plan, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 group-hover:border-slate-300 transition-colors shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mr-4">
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{plan.name}</h4>
                <span className="text-xs font-semibold text-cyan-600">{plan.status}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">{plan.budget}</div>
              <div className="text-xs font-semibold text-blue-600 flex items-center justify-end">
                <TrendingUp className="w-3 h-3 mr-1" />
                {plan.roi}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
