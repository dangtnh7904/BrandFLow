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
    <div className="bento-card border border-slate-200 bg-white shadow-sm overflow-hidden">
       <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-900">Dự phóng Tài chính (Kế hoạch 3 năm)</h3>
       </div>
       <div className="overflow-x-auto w-full">
         <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                  <th className="py-3 px-4 font-bold text-slate-600">Chỉ số Tài chính</th>
                  <th className="py-3 px-4 font-bold text-slate-600 text-right w-32 border-l border-slate-200">Năm (t-1)</th>
                  <th className="py-3 px-4 font-bold text-purple-700 text-right w-32 border-l border-slate-200 bg-purple-50">Năm Hiện tại (t0)</th>
                  <th className="py-3 px-4 font-bold text-blue-700 text-right w-32 border-l border-slate-200 bg-blue-50">Dự phóng (t+3)</th>
               </tr>
            </thead>
            <tbody>
               {MOCK_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                     <td className="py-3 px-4 font-semibold text-slate-800">{row.metric}</td>
                     <td className="py-3 px-4 text-right text-slate-600 border-l border-slate-200">{formatCurrency(row.tMinus1, row.metric)}</td>
                     <td className="py-3 px-4 text-right text-purple-700 border-l border-slate-200 font-bold bg-purple-50">{formatCurrency(row.t0, row.metric)}</td>
                     <td className="py-3 px-4 text-right text-blue-700 border-l border-slate-200 font-bold bg-blue-50">{formatCurrency(row.tPlus3, row.metric)}</td>
                  </tr>
               ))}
               
               {/* Summary Footer Row */}
               {marginData && (
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                     <td className="py-4 px-4">{marginData.metric}</td>
                     <td className="py-4 px-4 text-right border-l border-slate-200 text-slate-700">{marginData.tMinus1.toFixed(1)}%</td>
                     <td className="py-4 px-4 text-right border-l border-slate-200 text-purple-700">{marginData.t0.toFixed(1)}%</td>
                     <td className="py-4 px-4 text-right border-l border-slate-200 text-blue-700">{marginData.tPlus3.toFixed(1)}%</td>
                  </tr>
               )}
            </tbody>
         </table>
       </div>
    </div>
  );
}
