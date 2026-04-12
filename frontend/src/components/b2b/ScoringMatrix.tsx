"use client";

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const KSF_DATA = [
  { id: 1, factor: "Chất lượng sản phẩm (Chống lỗi)", weight: 40, myScore: 8, compScore: 7 },
  { id: 2, factor: "Dịch vụ hỗ trợ 24/7", weight: 30, myScore: 9, compScore: 9 },
  { id: 3, factor: "Giá cả cạnh tranh", weight: 30, myScore: 6, compScore: 8 },
];

export default function ScoringMatrix() {
  const [data, setData] = useState(KSF_DATA);

  const handleWeightChange = (id: number, val: string) => {
    setData(data.map(d => d.id === id ? { ...d, weight: Number(val) || 0 } : d));
  };

  const totalWeight = data.reduce((acc, curr) => acc + curr.weight, 0);
  const isValid = totalWeight === 100;

  const myCalculatedScore = data.reduce((acc, curr) => acc + (curr.myScore * (curr.weight / 100)), 0);
  const compCalculatedScore = data.reduce((acc, curr) => acc + (curr.compScore * (curr.weight / 100)), 0);

  return (
    <div className="bento-card border border-slate-200 bg-white shadow-sm overflow-hidden p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">A5. SWOT Scoring Matrix</h3>
          <p className="text-sm font-medium text-slate-500">Đánh giá Năng lực Cạnh tranh (Weighted Key Success Factors)</p>
        </div>
        {!isValid && (
          <div className="flex items-center text-red-700 bg-red-50 px-3 py-1.5 rounded-md text-sm font-bold border border-red-200">
            <AlertCircle className="w-4 h-4 mr-2" />
            Lỗi tỷ trọng: Tổng Weight phải bằng 100 (Hiện tại: {totalWeight})
          </div>
        )}
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 border-b border-slate-200">
             <tr>
                <th className="py-3 px-4 font-bold text-slate-700 border-r border-slate-200">Key Success Factor</th>
                <th className="py-3 px-4 font-bold text-center text-slate-700 w-24 border-r border-slate-200">Weight (%)</th>
                <th className="py-3 px-4 font-bold text-center w-32 border-r border-slate-200 bg-purple-50 text-purple-700">Our Score (1-10)</th>
                <th className="py-3 px-4 font-bold text-center w-32 bg-orange-50 text-orange-700">Competitor (1-10)</th>
             </tr>
          </thead>
          <tbody>
             {data.map(row => (
               <tr key={row.id} className="border-b border-slate-200">
                 <td className="py-2 px-4 border-r border-slate-200 text-slate-800 font-semibold">{row.factor}</td>
                 <td className="py-2 px-2 border-r border-slate-200">
                   <input type="number" className="w-full text-center font-semibold py-1.5 bg-slate-50 text-slate-900 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none" defaultValue={row.weight} onBlur={(e) => handleWeightChange(row.id, e.target.value)} />
                 </td>
                 <td className="py-2 px-4 border-r border-slate-200 text-center font-bold text-purple-700 bg-purple-50">{row.myScore}</td>
                 <td className="py-2 px-4 text-center font-bold text-orange-700 bg-orange-50">{row.compScore}</td>
               </tr>
             ))}
             <tr className="bg-slate-100/50 text-slate-900 font-bold text-base">
                 <td className="py-3 px-4 text-right">Weighted Total:</td>
                 <td className={`py-3 px-4 text-center border-l border-slate-200 ${!isValid ? 'text-red-600' : 'text-blue-600'}`}>{totalWeight}%</td>
                 <td className="py-3 px-4 text-center border-l border-slate-200 text-purple-700">{myCalculatedScore.toFixed(2)}</td>
                 <td className="py-3 px-4 text-center border-l border-slate-200 text-orange-700">{compCalculatedScore.toFixed(2)}</td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
