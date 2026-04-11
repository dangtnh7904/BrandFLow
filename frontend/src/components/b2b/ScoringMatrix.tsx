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
    <div className="bento-card border-none bg-white/5 shadow-sm overflow-hidden p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white text-lg">A5. SWOT Scoring Matrix</h3>
          <p className="text-sm text-slate-400">Đánh giá Năng lực Cạnh tranh (Weighted Key Success Factors)</p>
        </div>
        {!isValid && (
          <div className="flex items-center text-red-400 bg-red-500/10 px-3 py-1.5 rounded-md text-sm font-medium border border-red-500/20">
            <AlertCircle className="w-4 h-4 mr-2" />
            Lỗi tỷ trọng: Tổng Weight phải bằng 100 (Hiện tại: {totalWeight})
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-black/20 border-b border-white/10">
             <tr>
                <th className="py-3 px-4 font-semibold text-slate-300 border-r border-white/10">Key Success Factor</th>
                <th className="py-3 px-4 font-semibold text-center text-slate-300 w-24 border-r border-white/10">Weight (%)</th>
                <th className="py-3 px-4 font-semibold text-center w-32 border-r border-white/10 bg-purple-500/10 text-purple-400">Our Score (1-10)</th>
                <th className="py-3 px-4 font-semibold text-center w-32 border-r border-white/10 bg-orange-500/10 text-orange-400">Competitor (1-10)</th>
             </tr>
          </thead>
          <tbody>
             {data.map(row => (
               <tr key={row.id} className="border-b border-white/10">
                 <td className="py-2 px-4 border-r border-white/10 text-slate-200">{row.factor}</td>
                 <td className="py-2 px-2 border-r border-white/10">
                   <input type="number" className="w-full text-center py-1.5 bg-black/20 text-white border border-white/10 rounded focus:bg-black/40 focus:ring-1 focus:ring-purple-500 outline-none" defaultValue={row.weight} onBlur={(e) => handleWeightChange(row.id, e.target.value)} />
                 </td>
                 <td className="py-2 px-4 border-r border-white/10 text-center font-semibold text-purple-300 bg-purple-500/5">{row.myScore}</td>
                 <td className="py-2 px-4 border-r border-white/10 text-center font-semibold text-orange-300 bg-orange-500/5">{row.compScore}</td>
               </tr>
             ))}
             <tr className="bg-black/40 text-white font-bold text-base">
                 <td className="py-3 px-4 text-right">Weighted Total:</td>
                 <td className={`py-3 px-4 text-center border-l border-white/10 ${!isValid ? 'text-red-400' : 'text-emerald-400'}`}>{totalWeight}%</td>
                 <td className="py-3 px-4 text-center border-l border-white/10 text-purple-300">{myCalculatedScore.toFixed(2)}</td>
                 <td className="py-3 px-4 text-center border-l border-white/10 text-orange-300">{compCalculatedScore.toFixed(2)}</td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
