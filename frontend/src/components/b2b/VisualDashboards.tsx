"use client";

import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue & Profit Combo Chart */}
      <div className="bento-card border-none bg-white/5 shadow-sm p-6">
        <h3 className="font-semibold text-white mb-6 text-lg">A3. Dự phóng Doanh thu & Lợi nhuận</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <YAxis yAxisId="left" orientation="left" stroke="#c084fc" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <YAxis yAxisId="right" orientation="right" stroke="#34d399" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', color: '#fff'}} />
              <Legend wrapperStyle={{paddingTop: '20px'}} />
              <Bar yAxisId="left" dataKey="revenue" name="Doanh thu ($k)" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
              <Line yAxisId="right" type="monotone" dataKey="profit" name="Lợi nhuận ($k)" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Portfolio Matrix (Scatter Plot) */}
      <div className="bento-card border-none bg-white/5 shadow-sm p-6">
        <h3 className="font-semibold text-white mb-6 text-lg">A6. Ma trận Trọng tâm</h3>
        <div className="h-80 w-full relative">
          
          {/* Matrix Background quadrants */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 ml-14 mb-8">
             <div className="border-r border-b border-white/10 border-dashed bg-blue-500/10 flex items-start justify-end p-2 text-xs font-bold text-slate-400">Invest/Grow</div>
             <div className="border-b border-white/10 border-dashed bg-slate-500/10 flex items-start justify-end p-2 text-xs font-bold text-slate-400">Selectivity</div>
             <div className="border-r border-white/10 border-dashed bg-orange-500/10 flex items-start justify-end p-2 text-xs font-bold text-slate-400">Protect</div>
             <div className="bg-red-500/10 flex items-start justify-end p-2 text-xs font-bold text-slate-400">Harvest/Divest</div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="position" name="Năng lực Cạnh tranh" domain={[0, 100]} label={{ value: 'Năng lực Cạnh tranh (Mạnh -> Cạnh tranh)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} reversed />
              <YAxis type="number" dataKey="attract" name="Sức hấp dẫn Thị trường" domain={[0, 100]} label={{ value: 'Sức hấp dẫn Thị trường (Cao -> Thấp)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
              <ZAxis type="number" dataKey="size" range={[100, 1000]} name="Quy mô" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', padding: '10px', color: '#fff'}} />
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
