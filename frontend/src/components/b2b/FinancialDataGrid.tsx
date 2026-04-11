"use client";

import React from 'react';

const MOCK_DATA = [
  { metric: "Sản lượng (Units)", tMinus1: 1200, t0: 1500, tPlus3: 3500 },
  { metric: "Doanh thu ($)", tMinus1: 120000, t0: 165000, tPlus3: 420000 },
  { metric: "Chi phí vốn - COGS ($)", tMinus1: 80000, t0: 105000, tPlus3: 240000 },
];

export default function FinancialDataGrid() {
  const formatCurrency = (val: number, metric: string) => {
     if (metric.includes('$')) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
     return val.toLocaleString('en-US');
  };

  const calculateGrossMargin = (data: any[]) => {
      const revIndex = data.findIndex(d => d.metric.includes('Revenue'));
      const cogsIndex = data.findIndex(d => d.metric.includes('COGS'));
      if (revIndex === -1 || cogsIndex === -1) return null;

      const rev = data[revIndex];
      const cogs = data[cogsIndex];

      return {
          metric: "Biên lợi nhuận gộp (%)",
          tMinus1: ((rev.tMinus1 - cogs.tMinus1) / rev.tMinus1) * 100,
          t0: ((rev.t0 - cogs.t0) / rev.t0) * 100,
          tPlus3: ((rev.tPlus3 - cogs.tPlus3) / rev.tPlus3) * 100,
      };
  };

  const marginData = calculateGrossMargin(MOCK_DATA);

  return (
    <div className="bento-card border-none bg-white/5 shadow-sm overflow-hidden">
       <div className="p-4 border-b border-white/10 bg-black/20">
          <h3 className="font-semibold text-white">Dự phóng Tài chính (Kế hoạch 3 năm)</h3>
       </div>
       <div className="overflow-x-auto w-full">
         <table className="w-full text-sm text-left">
            <thead className="bg-white/5 border-b border-white/10">
               <tr>
                  <th className="py-3 px-4 font-semibold text-slate-300">Chỉ số Tài chính</th>
                  <th className="py-3 px-4 font-semibold text-slate-300 text-right w-32 border-l border-white/10">Năm (t-1)</th>
                  <th className="py-3 px-4 font-semibold text-purple-300 text-right w-32 border-l border-white/10 bg-purple-500/10">Năm Hiện tại (t0)</th>
                  <th className="py-3 px-4 font-semibold text-emerald-300 text-right w-32 border-l border-white/10 bg-emerald-500/10">Dự phóng (t+3)</th>
               </tr>
            </thead>
            <tbody>
               {MOCK_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                     <td className="py-3 px-4 font-medium text-slate-200">{row.metric}</td>
                     <td className="py-3 px-4 text-right text-slate-400 border-l border-white/10">{formatCurrency(row.tMinus1, row.metric)}</td>
                     <td className="py-3 px-4 text-right text-purple-300 border-l border-white/10 font-semibold bg-purple-500/5">{formatCurrency(row.t0, row.metric)}</td>
                     <td className="py-3 px-4 text-right text-emerald-400 border-l border-white/10 font-bold bg-emerald-500/5">{formatCurrency(row.tPlus3, row.metric)}</td>
                  </tr>
               ))}
               
               {/* Summary Footer Row */}
               {marginData && (
                  <tr className="bg-black/40 text-white font-bold">
                     <td className="py-4 px-4">{marginData.metric}</td>
                     <td className="py-4 px-4 text-right border-l border-white/10">{marginData.tMinus1.toFixed(1)}%</td>
                     <td className="py-4 px-4 text-right border-l border-white/10">{marginData.t0.toFixed(1)}%</td>
                     <td className="py-4 px-4 text-right border-l border-white/10 text-emerald-400">{marginData.tPlus3.toFixed(1)}%</td>
                  </tr>
               )}
            </tbody>
         </table>
       </div>
    </div>
  );
}
