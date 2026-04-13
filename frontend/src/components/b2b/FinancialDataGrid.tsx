"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FinancialDataGrid() {
 const { language } = useLanguage();

 const MOCK_DATA = [
 { metric: language === 'vi' ? "Sản lượng (Units)" : "Volume (Units)", tMinus1: 1200, t0: 1500, tPlus3: 3500 },
 { metric: language === 'vi' ? "Doanh thu ($)" : "Revenue ($)", tMinus1: 120000, t0: 165000, tPlus3: 420000 },
 { metric: language === 'vi' ? "Chi phí vốn - COGS ($)" : "Cost of Goods Sold - COGS ($)", tMinus1: 80000, t0: 105000, tPlus3: 240000 },
 ];

 const formatCurrency = (val: number, metric: string) => {
 if (metric.includes('$')) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
 return val.toLocaleString('en-US');
 };

 const calculateGrossMargin = (data: any[]) => {
 const revIndex = data.findIndex(d => d.metric.includes('Revenue') || d.metric.includes('Doanh thu'));
 const cogsIndex = data.findIndex(d => d.metric.includes('COGS'));
 if (revIndex === -1 || cogsIndex === -1) return null;

 const rev = data[revIndex];
 const cogs = data[cogsIndex];

 return {
 metric: language === 'vi' ? "Biên lợi nhuận gộp (%)" : "Gross Margin (%)",
 tMinus1: ((rev.tMinus1 - cogs.tMinus1) / rev.tMinus1) * 100,
 t0: ((rev.t0 - cogs.t0) / rev.t0) * 100,
 tPlus3: ((rev.tPlus3 - cogs.tPlus3) / rev.tPlus3) * 100,
 };
 };

 const marginData = calculateGrossMargin(MOCK_DATA);

 return (
 <div className="bento-card border border-linear-border bg-linear-surface shadow-sm overflow-hidden">
 <div className="p-4 border-b border-linear-border bg-background">
 <h3 className="font-bold text-foreground">{language === 'vi' ? 'Dự phóng Tài chính (Kế hoạch 3 năm)' : 'Financial Projections (3-Year Plan)'}</h3>
 </div>
 <div className="overflow-x-auto w-full">
 <table className="w-full text-sm text-left border-collapse">
 <thead className="bg-background border-b border-linear-border">
 <tr>
 <th className="py-3 px-4 font-bold text-linear-text-muted">{language === 'vi' ? 'Chỉ số Tài chính' : 'Financial Metric'}</th>
 <th className="py-3 px-4 font-bold text-linear-text-muted text-right w-32 border-l border-linear-border">{language === 'vi' ? 'Năm (t-1)' : 'Year (t-1)'}</th>
 <th className="py-3 px-4 font-bold text-purple-700 text-right w-32 border-l border-linear-border bg-purple-50">{language === 'vi' ? 'Năm Hiện tại (t0)' : 'Current Year (t0)'}</th>
 <th className="py-3 px-4 font-bold text-blue-700 text-right w-32 border-l border-linear-border bg-blue-50">{language === 'vi' ? 'Dự phóng (t+3)' : 'Projection (t+3)'}</th>
 </tr>
 </thead>
 <tbody>
 {MOCK_DATA.map((row, idx) => (
 <tr key={idx} className="border-b border-linear-border hover:bg-linear-surface/80 transition-colors">
 <td className="py-3 px-4 font-semibold text-foreground">{row.metric}</td>
 <td className="py-3 px-4 text-right text-linear-text-muted border-l border-linear-border">{formatCurrency(row.tMinus1, row.metric)}</td>
 <td className="py-3 px-4 text-right text-purple-700 border-l border-linear-border font-bold bg-purple-50">{formatCurrency(row.t0, row.metric)}</td>
 <td className="py-3 px-4 text-right text-blue-700 border-l border-linear-border font-bold bg-blue-50">{formatCurrency(row.tPlus3, row.metric)}</td>
 </tr>
 ))}
 
 {/* Summary Footer Row */}
 {marginData && (
 <tr className="bg-linear-surface/50 border border-linear-border text-foreground font-bold">
 <td className="py-4 px-4">{marginData.metric}</td>
 <td className="py-4 px-4 text-right border-l border-linear-border text-foreground">{marginData.tMinus1.toFixed(1)}%</td>
 <td className="py-4 px-4 text-right border-l border-linear-border text-purple-700">{marginData.t0.toFixed(1)}%</td>
 <td className="py-4 px-4 text-right border-l border-linear-border text-blue-700">{marginData.tPlus3.toFixed(1)}%</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
}
