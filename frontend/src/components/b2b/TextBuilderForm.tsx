"use client";

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function TextBuilderForm() {
  const [directions, setDirections] = useState<string[]>(['Expand market share in APAC', 'Invest 20% budget in GenAI R&D']);
  
  return (
    <div className="space-y-8">
      <div className="bento-card border-none bg-white/5 shadow-sm p-6 relative overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 relative z-10">Định nghĩa Doanh nghiệp & Vai trò</h3>
        <div className="space-y-4 relative z-10">
           <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Vai trò Công ty</label>
             <input type="text" className="w-full px-4 py-2 bg-black/20 text-white border border-white/10 rounded-md focus:bg-black/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" placeholder="Nhập vai trò tổng quát của công ty..." defaultValue="Nhà cung cấp Giải pháp Tiếp thị Tự động Hàng đầu" />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Năng lực Cốt lõi</label>
             <textarea rows={3} className="w-full px-4 py-2 bg-black/20 text-white border border-white/10 rounded-md focus:bg-black/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" placeholder="Mô tả năng lực cốt lõi..." defaultValue="Động cơ tính toán tài chính độc quyền, Thuật toán tranh luận Agent thời gian thực, Xác thực dữ liệu chống ảo giác." />
           </div>
        </div>
      </div>

      <div className="bento-card border-none bg-white/5 shadow-sm p-6 relative overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 relative z-10">Định hướng Tương lai</h3>
        <div className="space-y-3 relative z-10">
           {directions.map((dir, idx) => (
             <div key={idx} className="flex items-center space-x-2">
               <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
               <input type="text" className="flex-1 px-4 py-2 bg-black/20 text-white border border-white/10 rounded-md focus:bg-black/40 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" defaultValue={dir} onBlur={(e) => {
                 const newArr = [...directions];
                 newArr[idx] = e.target.value;
                 setDirections(newArr);
               }} />
               <button onClick={() => setDirections(directions.filter((_, i) => i !== idx))} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
             </div>
           ))}
           <button onClick={() => setDirections([...directions, ''])} className="mt-2 flex items-center px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 rounded-md hover:bg-cyan-500/20 transition-colors">
              <Plus className="w-4 h-4 mr-1" /> Thêm định hướng
           </button>
        </div>
      </div>
    </div>
  );
}
