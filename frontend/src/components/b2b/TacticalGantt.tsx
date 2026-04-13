"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TacticalGantt() {
 const { language } = useLanguage();

 const TASKS = [
 { id: 1, name: language === 'vi' ? "Giai đoạn Nghiên cứu Thị trường" : "Market Research Phase", startMonth: 1, endMonth: 2, owner: "Strategy Team", budget: "$15,000", color: "bg-purple-500" },
 { id: 2, name: language === 'vi' ? "Phát triển Sản phẩm (Beta)" : "Product Development (Beta)", startMonth: 2, endMonth: 5, owner: "Product Team", budget: "$80,000", color: "bg-blue-500" },
 { id: 3, name: language === 'vi' ? "Chiến dịch Marketing Tiền ra mắt" : "Pre-launch Marketing Campaign", startMonth: 4, endMonth: 6, owner: "Marketing", budget: "$45,000", color: "bg-blue-500" },
 { id: 4, name: language === 'vi' ? "Ra mắt Chính thức & Go-to-market" : "Official Launch & Go-to-market", startMonth: 6, endMonth: 8, owner: "Sales & MKT", budget: "$120,000", color: "bg-orange-500" },
 { id: 5, name: language === 'vi' ? "Đánh giá Hậu ra mắt" : "Post-launch Evaluation", startMonth: 9, endMonth: 12, owner: "Data Team", budget: "$10,000", color: "bg-slate-500" }
 ];

 const MONTHS_VI = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'];
 const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 const MONTHS = language === 'vi' ? MONTHS_VI : MONTHS_EN;

 return (
 <div className="space-y-8">
 {/* Action Plan Matrix (B3) */}
 <div className="bento-card border border-linear-border bg-linear-surface shadow-sm overflow-hidden p-6">
 <h3 className="font-bold text-foreground text-lg mb-4">{language === 'vi' ? 'B3. Ma trận Hành động' : 'B3. Action Matrix'}</h3>
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left border border-linear-border rounded-lg overflow-hidden">
 <thead className="bg-background border-b border-linear-border">
 <tr>
 <th className="py-3 px-4 font-bold text-foreground">{language === 'vi' ? 'Mục tiêu' : 'Objective'}</th>
 <th className="py-3 px-4 font-bold text-foreground">{language === 'vi' ? 'Chiến thuật / Hành động Chính' : 'Key Tactics / Actions'}</th>
 <th className="py-3 px-4 font-bold text-foreground w-32 border-l border-linear-border">{language === 'vi' ? 'Phụ trách' : 'Owner'}</th>
 <th className="py-3 px-4 font-bold text-foreground w-32 text-right border-l border-linear-border">{language === 'vi' ? 'Ngân sách' : 'Budget'}</th>
 </tr>
 </thead>
 <tbody>
 {TASKS.map(t => (
 <tr key={t.id} className="border-b border-linear-border hover:bg-linear-surface/80 transition-colors">
 <td className="py-3 px-4 text-foreground font-bold">{t.name}</td>
 <td className="py-3 px-4 text-linear-text-muted font-medium truncate max-w-xs cursor-pointer hover:text-cyan-600 transition-colors">{language === 'vi' ? 'Nhấp để mở xem chi tiết chiến thuật này...' : 'Click to view tactic details...'}</td>
 <td className="py-3 px-4 text-linear-text-muted border-l border-linear-border">
 <span className="bg-linear-surface/50 border border-linear-border border border-linear-border px-2 py-1 rounded text-xs font-bold text-foreground">{t.owner}</span>
 </td>
 <td className="py-3 px-4 text-right text-purple-700 font-bold font-mono border-l border-linear-border">{t.budget}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* 12-Month Gantt Chart (B7) */}
 <div className="bento-card border border-linear-border bg-linear-surface shadow-sm overflow-hidden p-6">
 <div className="flex items-center justify-between mb-6">
 <h3 className="font-bold text-foreground text-lg flex items-center">
 <Calendar className="w-5 h-5 mr-2 text-linear-text-muted" />
 {language === 'vi' ? 'B7. Biểu đồ Gantt 12 Tháng' : 'B7. 12-Month Gantt Chart'}
 </h3>
 </div>
 
 <div className="overflow-x-auto">
 <div className="min-w-[800px]">
 {/* Gantt Header - Months */}
 <div className="flex border-b border-linear-border pb-2">
 <div className="w-48 shrink-0 font-bold text-linear-text-muted text-xs uppercase tracking-wider pl-2">{language === 'vi' ? 'Giai đoạn / Nhiệm vụ' : 'Phase / Task'}</div>
 <div className="flex-1 grid grid-cols-12 gap-1 text-center">
 {MONTHS.map(m => (
 <div key={m} className="text-xs font-bold text-linear-text-muted uppercase tracking-widest">{m}</div>
 ))}
 </div>
 </div>
 
 {/* Gantt Body */}
 <div className="mt-4 space-y-4">
 {TASKS.map(task => (
 <div key={task.id} className="flex items-center">
 <div className="w-48 shrink-0 pr-4">
 <p className="text-sm font-bold text-foreground truncate" title={task.name}>{task.name}</p>
 <p className="text-xs font-medium text-linear-text-muted">{task.owner}</p>
 </div>
 <div className="flex-1 grid grid-cols-12 gap-1 relative h-8 bg-background rounded-md border border-linear-border p-1">
 {/* Grid Lines */}
 {Array.from({length: 11}).map((_, i) => (
 <div key={i} className="border-r border-linear-border h-full col-span-1 border-dashed"></div>
 ))}
 
 {/* Gantt Bar */}
 <div 
 className={`absolute top-1 bottom-1 rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer ${task.color}`}
 style={{
 left: `calc(${(task.startMonth - 1) / 12 * 100}% + 4px)`,
 width: `calc(${(task.endMonth - task.startMonth + 1) / 12 * 100}% - 8px)`
 }}
 >
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
