"use client";

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TextBuilderForm() {
 const { language } = useLanguage();
 const [directions, setDirections] = useState<string[]>(['Expand market share in APAC', 'Invest 20% budget in GenAI R&D']);
 
 return (
 <div className="space-y-8">
 <div className="bento-card border border-linear-border bg-linear-surface shadow-sm p-6 relative overflow-hidden">
 <h3 className="text-lg font-bold text-foreground mb-4 border-b border-linear-border pb-2 relative z-10">{language === 'vi' ? 'Định nghĩa Doanh nghiệp & Vai trò' : 'Business Definition & Role'}</h3>
 <div className="space-y-4 relative z-10">
 <div>
 <label className="block text-sm font-bold text-foreground mb-1">{language === 'vi' ? 'Vai trò Công ty' : 'Company Role'}</label>
 <input type="text" className="w-full px-4 py-2 bg-background text-foreground border border-linear-border rounded-md focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" placeholder={language === 'vi' ? "Nhập vai trò tổng quát của công ty..." : "Enter overall company role..."} defaultValue={language === 'vi' ? "Nhà cung cấp Giải pháp Tiếp thị Tự động Hàng đầu" : "Leading Automated Marketing Solution Provider"} />
 </div>
 <div>
 <label className="block text-sm font-bold text-foreground mb-1">{language === 'vi' ? 'Năng lực Cốt lõi' : 'Core Competencies'}</label>
 <textarea rows={3} className="w-full px-4 py-2 bg-background text-foreground border border-linear-border rounded-md focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" placeholder={language === 'vi' ? "Mô tả năng lực cốt lõi..." : "Describe core competencies..."} defaultValue={language === 'vi' ? "Động cơ tính toán tài chính độc quyền, Thuật toán tranh luận Agent thời gian thực." : "Proprietary financial math engine, Realtime Agent debate algorithms."} />
 </div>
 </div>
 </div>

 <div className="bento-card border border-linear-border bg-linear-surface shadow-sm p-6 relative overflow-hidden">
 <h3 className="text-lg font-bold text-foreground mb-4 border-b border-linear-border pb-2 relative z-10">{language === 'vi' ? 'Định hướng Tương lai' : 'Future Directives'}</h3>
 <div className="space-y-3 relative z-10">
 {directions.map((dir, idx) => (
 <div key={idx} className="flex items-center space-x-2">
 <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
 <input type="text" className="flex-1 px-4 py-2 bg-background text-foreground border border-linear-border rounded-md focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" defaultValue={dir} onBlur={(e) => {
 const newArr = [...directions];
 newArr[idx] = e.target.value;
 setDirections(newArr);
 }} />
 <button onClick={() => setDirections(directions.filter((_, i) => i !== idx))} className="p-2 text-linear-text-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
 </div>
 ))}
 <button onClick={() => setDirections([...directions, ''])} className="mt-2 flex items-center px-4 py-2 text-sm font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-md transition-colors">
 <Plus className="w-4 h-4 mr-1" /> {language === 'vi' ? 'Thêm định hướng' : 'Add directive'}
 </button>
 </div>
 </div>
 </div>
 );
}
