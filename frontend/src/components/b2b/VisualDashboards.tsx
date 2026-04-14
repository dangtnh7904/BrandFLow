"use client";

import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const REVENUE_DATA = [
 { year: 'Năm 1', revenue: 120, profit: 24 },
 { year: 'Năm 2', revenue: 165, profit: 38 },
 { year: 'Năm 3', revenue: 250, profit: 65 },
 { year: 'Năm 4', revenue: 420, profit: 110 },
];

const MATRIX_DATA = [
 { name: 'Sản phẩm A', attract: 80, position: 75, size: 400, fill: '#3b82f6' },
 { name: 'Sản phẩm B', attract: 30, position: 20, size: 200, fill: '#ef4444' },
 { name: 'Dịch vụ C', attract: 90, position: 40, size: 600, fill: '#10b981' },
];

export default function VisualDashboards() {
 const { t } = useLanguage();
 return (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Revenue & Profit Combo Chart */}
 <div className="bento-card bg-linear-surface border border-linear-border shadow-sm p-6">
 <h3 className="font-semibold text-foreground mb-6 text-lg">{t('a6.revenue_title' as any)}</h3>
 <div className="h-80 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
 <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
 <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
 <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
 <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#0f172a'}} />
 <Legend wrapperStyle={{paddingTop: '20px'}} />
 <Bar yAxisId="left" dataKey="revenue" name="Doanh thu ($k)" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
 <Line yAxisId="right" type="monotone" dataKey="profit" name="Lợi nhuận ($k)" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Portfolio Matrix (Scatter Plot) */}
 <div className="bento-card bg-linear-surface border border-linear-border shadow-sm p-6">
 <h3 className="font-semibold text-foreground mb-6 text-lg">{t('a6.matrix_title' as any)}</h3>
 <div className="h-80 w-full relative">
 
 {/* Matrix Background quadrants */}
 <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 ml-14 mb-8">
 <div className="border-r border-b border-linear-border border-dashed bg-blue-50 dark:bg-blue-500/100/10 flex items-start justify-end p-2 text-xs font-bold text-linear-text-muted">Invest/Grow</div>
 <div className="border-b border-linear-border border-dashed bg-slate-50 dark:bg-slate-800/500/10 flex items-start justify-end p-2 text-xs font-bold text-linear-text-muted">Selectivity</div>
 <div className="border-r border-linear-border border-dashed bg-orange-50 dark:bg-orange-500/100/10 flex items-start justify-end p-2 text-xs font-bold text-linear-text-muted">Protect</div>
 <div className="bg-red-50 dark:bg-red-500/100/10 flex items-start justify-end p-2 text-xs font-bold text-linear-text-muted">Harvest/Divest</div>
 </div>

 <ResponsiveContainer width="100%" height="100%">
 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
 <XAxis type="number" dataKey="position" name="Năng lực Cạnh tranh" domain={[0, 100]} label={{ value: 'Năng lực Cạnh tranh (Mạnh -> Cạnh tranh)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} reversed />
 <YAxis type="number" dataKey="attract" name="Sức hấp dẫn Thị trường" domain={[0, 100]} label={{ value: 'Sức hấp dẫn Thị trường (Cao -> Thấp)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
 <ZAxis type="number" dataKey="size" range={[100, 1000]} name="Quy mô" />
 <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '10px', color: '#0f172a', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}} />
 {MATRIX_DATA.map((entry, index) => (
 <Scatter key={index} name={entry.name} data={[entry]} fill={entry.fill} shape="circle" />
 ))}
 </ScatterChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 );
}
