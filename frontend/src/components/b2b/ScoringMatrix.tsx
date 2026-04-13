"use client";

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ScoringMatrix() {
 const { language } = useLanguage();
 
 const [data, setData] = useState([
 { id: 1, factor: language === 'vi' ? "Chất lượng sản phẩm (Chống lỗi)" : "Product Quality (Bug-free)", weight: 40, myScore: 8, compScore: 7 },
 { id: 2, factor: language === 'vi' ? "Dịch vụ hỗ trợ 24/7" : "24/7 Support Service", weight: 30, myScore: 9, compScore: 9 },
 { id: 3, factor: language === 'vi' ? "Giá cả cạnh tranh" : "Competitive Pricing", weight: 30, myScore: 6, compScore: 8 },
 ]);

 const handleWeightChange = (id: number, val: string) => {
 setData(data.map(d => d.id === id ? { ...d, weight: Number(val) || 0 } : d));
 };

 const totalWeight = data.reduce((acc, curr) => acc + curr.weight, 0);
 const isValid = totalWeight === 100;

 const myCalculatedScore = data.reduce((acc, curr) => acc + (curr.myScore * (curr.weight / 100)), 0);
 const compCalculatedScore = data.reduce((acc, curr) => acc + (curr.compScore * (curr.weight / 100)), 0);

 return (
 <div className="bento-card border border-linear-border bg-linear-surface shadow-sm overflow-hidden p-6 relative">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="font-bold text-foreground text-lg">A5. SWOT Scoring Matrix</h3>
 <p className="text-sm font-medium text-linear-text-muted">{language === 'vi' ? 'Đánh giá Năng lực Cạnh tranh (Weighted Key Success Factors)' : 'Competitive Capability Assessment (Weighted KSFs)'}</p>
 </div>
 {!isValid && (
 <div className="flex items-center text-red-700 bg-red-50 px-3 py-1.5 rounded-md text-sm font-bold border border-red-200">
 <AlertCircle className="w-4 h-4 mr-2" />
 {language === 'vi' ? `Lỗi tỷ trọng: Tổng Weight phải bằng 100 (Hiện tại: ${totalWeight})` : `Weight Error: Total must equal 100 (Current: ${totalWeight})`}
 </div>
 )}
 </div>

 <div className="overflow-x-auto mt-4">
 <table className="w-full text-sm text-left border border-linear-border rounded-lg overflow-hidden">
 <thead className="bg-background border-b border-linear-border">
 <tr>
 <th className="py-3 px-4 font-bold text-foreground border-r border-linear-border">Key Success Factor</th>
 <th className="py-3 px-4 font-bold text-center text-foreground w-24 border-r border-linear-border">{language === 'vi' ? 'Trọng số' : 'Weight'} (%)</th>
 <th className="py-3 px-4 font-bold text-center w-32 border-r border-linear-border bg-purple-50 text-purple-700">{language === 'vi' ? 'Điểm của ta' : 'Our Score'} (1-10)</th>
 <th className="py-3 px-4 font-bold text-center w-32 bg-orange-50 text-orange-700">{language === 'vi' ? 'Đối thủ' : 'Competitor'} (1-10)</th>
 </tr>
 </thead>
 <tbody>
 {data.map(row => (
 <tr key={row.id} className="border-b border-linear-border">
 <td className="py-2 px-4 border-r border-linear-border text-foreground font-semibold">{row.factor}</td>
 <td className="py-2 px-2 border-r border-linear-border">
 <input type="number" className="w-full text-center font-semibold py-1.5 bg-background text-foreground border border-linear-border rounded focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none" defaultValue={row.weight} onBlur={(e) => handleWeightChange(row.id, e.target.value)} />
 </td>
 <td className="py-2 px-4 border-r border-linear-border text-center font-bold text-purple-700 bg-purple-50">{row.myScore}</td>
 <td className="py-2 px-4 text-center font-bold text-orange-700 bg-orange-50">{row.compScore}</td>
 </tr>
 ))}
 <tr className="bg-linear-surface/50 border border-linear-border/50 text-foreground font-bold text-base">
 <td className="py-3 px-4 text-right">{language === 'vi' ? 'Tổng Điểm Có Trọng Số:' : 'Weighted Total:'}</td>
 <td className={`py-3 px-4 text-center border-l border-linear-border ${!isValid ? 'text-red-600' : 'text-blue-600'}`}>{totalWeight}%</td>
 <td className="py-3 px-4 text-center border-l border-linear-border text-purple-700">{myCalculatedScore.toFixed(2)}</td>
 <td className="py-3 px-4 text-center border-l border-linear-border text-orange-700">{compCalculatedScore.toFixed(2)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
}
