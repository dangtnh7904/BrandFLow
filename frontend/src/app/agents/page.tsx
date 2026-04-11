"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Network, BatteryCharging, BrainCircuit, Activity, Settings2, Plus, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AGENTS = [
  { id: 'cmo', name: 'Trợ lý CMO', role: 'Giám đốc Marketing', brain: 95, status: 'Hoạt động', color: 'from-purple-500 to-cyan-500', iconColor: 'text-cyan-400', skill: 'Bảng Chiến lược' },
  { id: 'cfo', name: 'Trợ lý CFO', role: 'Giám đốc Tài chính', brain: 88, status: 'Hoạt động', color: 'from-emerald-500 to-teal-500', iconColor: 'text-emerald-400', skill: 'Công cụ Tính toán' },
  { id: 'cro', name: 'Trợ lý CRO', role: 'Chuyên gia Chuyển đổi', brain: 76, status: 'Nghỉ ngơi', color: 'from-orange-500 to-amber-500', iconColor: 'text-amber-400', skill: 'A/B Testing' },
  { id: 'cdo', name: 'Trợ lý CDO', role: 'Giám đốc Dữ liệu', brain: 92, status: 'Đang xử lý', color: 'from-blue-500 to-indigo-500', iconColor: 'text-blue-400', skill: 'Lõi RAG Analytics' },
];

export default function AgentsPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full overflow-y-auto p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
             <Network className="w-6 h-6 mr-3 text-cyan-400" />
             {t('agents.title')}
           </h2>
           <p className="text-linear-text-muted">{t('agents.desc')}</p>
        </div>
        <button className="hidden md:flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition-colors">
           <Plus className="w-4 h-4 mr-2 text-cyan-400" /> Thuê Trợ lý mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {AGENTS.map((agent, i) => (
            <motion.div 
               key={agent.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ scale: 1.03, y: -5 }}
               className="bento-card p-6 flex flex-col relative overflow-hidden group border-white/10 hover:border-white/20 shadow-lg cursor-pointer transition-all duration-300"
            >
               {/* Background Glow */}
               <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${agent.color} rounded-full opacity-10 blur-[50px] group-hover:opacity-20 transition-opacity`}></div>
               
               <div className="flex justify-between items-start mb-6 z-10">
                  <div className="flex items-center">
                     <div className={`w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center mr-4 shadow-inner`}>
                        <BrainCircuit className={`w-6 h-6 ${agent.iconColor}`} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{agent.name}</h3>
                        <p className="text-xs text-linear-text-muted uppercase tracking-widest">{agent.role}</p>
                     </div>
                  </div>
                  <button className="text-slate-500 hover:text-white transition-colors">
                     <Settings2 className="w-5 h-5" />
                  </button>
               </div>

               <div className="space-y-4 flex-1 z-10">
                  <div>
                     <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-medium text-slate-400 flex items-center"><BatteryCharging className="w-3 h-3 mr-1" /> {t('agents.load')}</span>
                        <span className="text-xs font-mono text-white">{agent.brain}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${agent.color}`} style={{ width: `${agent.brain}%` }}></div>
                     </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                     <span className="bg-white/5 px-2 py-1 rounded text-slate-300 font-medium">Kỹ năng: {agent.skill}</span>
                     <span className={`px-2 py-1 rounded font-bold flex items-center ${agent.status === 'Hoạt động' ? 'text-emerald-400 bg-emerald-400/10' : agent.status === 'Đang xử lý' ? 'text-amber-400 bg-amber-400/10 animate-pulse' : 'text-slate-400 bg-white/5'}`}>
                        {agent.status === 'Hoạt động' ? <Activity className="w-3 h-3 mr-1" /> : agent.status === 'Đang xử lý' ? <Zap className="w-3 h-3 mr-1" /> : null}
                        {agent.status}
                     </span>
                  </div>
               </div>
            </motion.div>
         ))}

         {/* Add Agent Placeholder */}
         <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bento-card border-dashed border-white/20 bg-transparent flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors min-h-[220px]"
         >
            <div className="w-12 h-12 rounded-full border border-slate-600 flex items-center justify-center mb-3">
               <Plus className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-white">Mở khóa Trợ lý mới</p>
            <p className="text-xs text-linear-text-muted mt-1 px-4">Mở rộng nguồn nhân lực với các mô hình LLM chuyên biệt.</p>
         </motion.div>
      </div>
    </div>
  );
}
