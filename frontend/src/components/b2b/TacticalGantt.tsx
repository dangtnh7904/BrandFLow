"use client";

import React from 'react';
import { Calendar } from 'lucide-react';

const TASKS = [
  { id: 1, name: "Giai đoạn Nghiên cứu Thị trường", startMonth: 1, endMonth: 2, owner: "Strategy Team", budget: "$15,000", color: "bg-purple-500" },
  { id: 2, name: "Phát triển Sản phẩm (Beta)", startMonth: 2, endMonth: 5, owner: "Product Team", budget: "$80,000", color: "bg-blue-500" },
  { id: 3, name: "Chiến dịch Marketing Tiền ra mắt", startMonth: 4, endMonth: 6, owner: "Marketing", budget: "$45,000", color: "bg-emerald-500" },
  { id: 4, name: "Ra mắt Chính thức & Go-to-market", startMonth: 6, endMonth: 8, owner: "Sales & MKT", budget: "$120,000", color: "bg-orange-500" },
  { id: 5, name: "Đánh giá Hậu ra mắt", startMonth: 9, endMonth: 12, owner: "Data Team", budget: "$10,000", color: "bg-slate-500" }
];

export default function TacticalGantt() {
  const MONTHS = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'];

  return (
    <div className="space-y-8">
      {/* Action Plan Matrix (B3) */}
      <div className="bento-card border-none bg-white/5 shadow-sm overflow-hidden p-6">
         <h3 className="font-semibold text-white text-lg mb-4">B3. Ma trận Hành động</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-white/10 rounded-lg overflow-hidden">
               <thead className="bg-black/20 border-b border-white/10">
                  <tr>
                     <th className="py-3 px-4 font-semibold text-slate-300">Mục tiêu</th>
                     <th className="py-3 px-4 font-semibold text-slate-300">Chiến thuật / Hành động Chính</th>
                     <th className="py-3 px-4 font-semibold text-slate-300 w-32 border-l border-white/10">Phụ trách</th>
                     <th className="py-3 px-4 font-semibold text-slate-300 w-32 text-right border-l border-white/10">Ngân sách</th>
                  </tr>
               </thead>
               <tbody>
                  {TASKS.map(t => (
                     <tr key={t.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-slate-200 font-medium">{t.name}</td>
                        <td className="py-3 px-4 text-slate-400 truncate max-w-xs cursor-pointer hover:text-cyan-400 transition-colors">Nhấp để mở xem chi tiết chiến thuật này...</td>
                        <td className="py-3 px-4 text-slate-400 border-l border-white/10">
                           <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold text-slate-300">{t.owner}</span>
                        </td>
                        <td className="py-3 px-4 text-right text-purple-300 font-mono border-l border-white/10">{t.budget}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* 12-Month Gantt Chart (B7) */}
      <div className="bento-card border-none bg-white/5 shadow-sm overflow-hidden p-6">
         <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white text-lg flex items-center">
               <Calendar className="w-5 h-5 mr-2 text-slate-400" />
               B7. Biểu đồ Gantt 12 Tháng
            </h3>
         </div>
         
         <div className="overflow-x-auto">
            <div className="min-w-[800px]">
               {/* Gantt Header - Months */}
               <div className="flex border-b border-white/10 pb-2">
                  <div className="w-48 shrink-0 font-semibold text-slate-500 text-xs uppercase tracking-wider pl-2">Giai đoạn / Nhiệm vụ</div>
                  <div className="flex-1 grid grid-cols-12 gap-1 text-center">
                     {MONTHS.map(m => (
                        <div key={m} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{m}</div>
                     ))}
                  </div>
               </div>
               
               {/* Gantt Body */}
               <div className="mt-4 space-y-4">
                  {TASKS.map(task => (
                     <div key={task.id} className="flex items-center">
                        <div className="w-48 shrink-0 pr-4">
                           <p className="text-sm font-medium text-slate-200 truncate" title={task.name}>{task.name}</p>
                           <p className="text-xs text-slate-500">{task.owner}</p>
                        </div>
                        <div className="flex-1 grid grid-cols-12 gap-1 relative h-8 bg-black/20 rounded-md border border-white/5 p-1">
                           {/* Grid Lines */}
                           {Array.from({length: 11}).map((_, i) => (
                              <div key={i} className="border-r border-white/5 h-full col-span-1 border-dashed"></div>
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
