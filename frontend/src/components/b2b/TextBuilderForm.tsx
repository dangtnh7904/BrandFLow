"use client";

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function TextBuilderForm() {
  const [directions, setDirections] = useState<string[]>(['Expand market share in APAC', 'Invest 20% budget in GenAI R&D']);
  
  return (
    <div className="space-y-8">
      <div className="bento-card border border-slate-200 bg-white shadow-sm p-6 relative overflow-hidden">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2 relative z-10">Định nghĩa Doanh nghiệp & Vai trò</h3>
        <div className="space-y-4 relative z-10">
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Vai trò Công ty</label>
             <input type="text" className="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" placeholder="Nhập vai trò tổng quát của công ty..." defaultValue="Nhà cung cấp Giải pháp Tiếp thị Tự động Hàng đầu" />
           </div>
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Năng lực Cốt lõi</label>
             <textarea rows={3} className="w-full px-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" placeholder="Mô tả năng lực cốt lõi..." defaultValue="Động cơ tính toán tài chính độc quyền, Thuật toán tranh luận Agent thời gian thực, Xác thực dữ liệu chống ảo giác." />
           </div>
        </div>
      </div>

      <div className="bento-card border border-slate-200 bg-white shadow-sm p-6 relative overflow-hidden">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2 relative z-10">Định hướng Tương lai</h3>
        <div className="space-y-3 relative z-10">
           {directions.map((dir, idx) => (
             <div key={idx} className="flex items-center space-x-2">
               <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
               <input type="text" className="flex-1 px-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" defaultValue={dir} onBlur={(e) => {
                 const newArr = [...directions];
                 newArr[idx] = e.target.value;
                 setDirections(newArr);
               }} />
               <button onClick={() => setDirections(directions.filter((_, i) => i !== idx))} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
             </div>
           ))}
           <button onClick={() => setDirections([...directions, ''])} className="mt-2 flex items-center px-4 py-2 text-sm font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-md transition-colors">
              <Plus className="w-4 h-4 mr-1" /> Thêm định hướng
           </button>
        </div>
      </div>
    </div>
  );
}
