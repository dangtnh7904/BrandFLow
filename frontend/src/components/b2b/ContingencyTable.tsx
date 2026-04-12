"use client";

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const RISK_DATA = [
  { id: 1, event: "Chi phí Ads (CAC) tăng vọt > 30%", prob: "High", impact: "High", trigger: "CPC > $2.5 trong 3 ngày", action: "Chuyển 50% ngân sách sang SEO" },
  { id: 2, event: "Đối thủ ra mắt sản phẩm copy", prob: "Medium", impact: "High", trigger: "Báo cáo nội bộ phát hiện", action: "Kích hoạt USP Campaign dự phòng" },
  { id: 3, event: "Rớt hạng từ khóa SEO chính", prob: "Low", impact: "Medium", trigger: "Traffic giảm 20% / tuần", action: "Push backlink tier 2 & cập nhật nội dung" },
];

export default function ContingencyTable() {
  return (
    <div className="bento-card border-none bg-white/5 shadow-sm overflow-hidden p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white text-lg">B5. Risk Matrix & Contingency</h3>
          <p className="text-sm text-slate-400">Quản lý rủi ro và các kịch bản kích hoạt dự phòng (Risk Triggers)</p>
        </div>
        <div className="flex items-center text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-md text-sm font-medium border border-orange-500/20">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Phòng thủ Chủ động Active
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-black/20 border-b border-white/10">
             <tr>
                <th className="py-3 px-4 font-semibold text-slate-300 border-r border-white/10">Sự kiện Rủi ro</th>
                <th className="py-3 px-4 font-semibold text-center text-slate-300 w-28 border-r border-white/10">Xác suất</th>
                <th className="py-3 px-4 font-semibold text-center text-slate-300 w-28 border-r border-white/10">Ảnh hưởng</th>
                <th className="py-3 px-4 font-semibold text-red-300 border-r border-white/10 bg-red-500/10">Điểm G (Trigger Point)</th>
                <th className="py-3 px-4 font-semibold border-r border-white/10 bg-blue-500/10 text-blue-300">Hành động Ứng phó</th>
             </tr>
          </thead>
          <tbody>
              {RISK_DATA.map(row => (
               <tr key={row.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                 <td className="py-3 px-4 border-r border-white/10 font-medium text-slate-200">{row.event}</td>
                 <td className="py-3 px-4 border-r border-white/10 text-center">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${row.prob === 'High' ? 'bg-red-500/20 text-red-400' : row.prob === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                     {row.prob}
                   </span>
                 </td>
                 <td className="py-3 px-4 border-r border-white/10 text-center">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${row.impact === 'High' ? 'bg-red-500/20 text-red-400' : row.impact === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                     {row.impact}
                   </span>
                 </td>
                 <td className="py-3 px-4 border-r border-white/10 text-red-400 bg-red-500/5 text-sm">{row.trigger}</td>
                 <td className="py-3 px-4 border-r border-white/10 text-blue-400 bg-blue-500/5 font-medium"><ShieldCheck className="inline-block w-4 h-4 mr-1 mb-0.5" /> {row.action}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
