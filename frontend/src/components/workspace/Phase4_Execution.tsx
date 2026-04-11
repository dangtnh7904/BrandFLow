"use client";

import React, { useState } from 'react';
import { Bot, Send, Sparkles, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReactFlow, Background, Controls, MarkerType, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Objective: B2B C-Level MQLs' }, type: 'input', style: { border: '2px solid #10b981', borderRadius: '12px', background: '#ecfdf5', color: '#047857', fontWeight: 'bold', padding: '12px 24px', width: 250, boxShadow: '0 4px 6px -1px rgba(16,185,129,0.1)' } },
  { id: '2', position: { x: 50, y: 200 }, data: { label: 'Strategy: LinkedIn Whitepapers' }, style: { border: '2px solid #3b82f6', borderRadius: '12px', background: '#eff6ff', color: '#1d4ed8', padding: '12px 24px', width: 250, boxShadow: '0 4px 6px -1px rgba(59,130,246,0.1)' } },
  { id: '3', position: { x: 450, y: 200 }, data: { label: 'Strategy: SEO & AEO Onpage' }, style: { border: '2px solid #8b5cf6', borderRadius: '12px', background: '#f5f3ff', color: '#6d28d9', padding: '12px 24px', width: 250, boxShadow: '0 4px 6px -1px rgba(139,92,246,0.1)' } },
  { id: '4', position: { x: 50, y: 350 }, data: { label: 'Action: Run "Full-stack" Post' }, type: 'output', style: { border: '2px solid #f59e0b', borderRadius: '12px', background: '#fffbeb', color: '#b45309', padding: '12px 24px', width: 250, boxShadow: '0 4px 6px -1px rgba(245,158,11,0.2)' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#f59e0b', strokeWidth: 4, filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.8))' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
];

export default function Phase4_Execution({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleSend = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowCanvas(true);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full overflow-hidden relative bg-slate-50 border-t border-slate-200">
      
      {/* Left Pane: Chat Interface */}
      <div className="w-[450px] shrink-0 h-full bg-white border-r border-slate-200 flex flex-col relative z-10 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <button onClick={onBack} className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 bg-emerald-50 rounded-md text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center border border-emerald-100">
            <ShieldCheck className="w-3 h-3 mr-1" /> {language === 'vi' ? 'Sẵn sàng Thực thi' : 'Ready for Execution'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full gradient-ai-bg flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-100 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200">
              {language === 'vi' ? 'Tôi là Executor Agent. Kế hoạch đã được duyệt: LinkedIn Whitepapers & SEO. Bạn muốn chạy Campaign LinkedIn hôm nay thế nào?' : 'I am the Executor Agent. The blueprint is approved: LinkedIn Whitepapers & SEO. How would you like to run today\'s LinkedIn Campaign?'}
            </div>
          </div>

          {showCanvas && (
             <div className="flex items-start gap-4 flex-row-reverse">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                 <span className="text-blue-600 text-xs font-bold">U</span>
               </div>
               <div className="text-sm text-white leading-relaxed font-medium bg-blue-600 p-3 rounded-2xl rounded-tr-sm shadow-sm">
                 {prompt}
               </div>
             </div>
          )}

          {isGenerating && (
             <div className="flex items-start gap-4 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
               </div>
               <div className="text-sm text-slate-500 leading-relaxed pt-1">
                 {language === 'vi' ? 'Đang khởi tạo Node-Based Canvas...' : 'Generating operational nodes...'}
               </div>
             </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
              placeholder={language === 'vi' ? "Ví dụ: Lên kế hoạch post LinkedIn tuần tới..." : "Ex: Map out the LinkedIn post strategy..."}
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 p-1.5 gradient-ai-bg rounded-lg hover:shadow-md transition-shadow"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Pane: Execution Canvas using React Flow */}
      <div className="flex-1 h-full relative">
        {showCanvas ? (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="w-full h-full"
          >
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-right"
            >
              <Background color="#cbd5e1" gap={20} size={1} />
              <Controls />
            </ReactFlow>

            <div className="absolute top-6 right-6 flex items-center space-x-3 pointer-events-none">
                <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl flex items-center text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-md pointer-events-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                  {language === 'vi' ? 'Node Graph Đồng bộ Thực thời' : 'Live State Sync'}
                </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center flex-col opacity-50 relative z-10">
             <Bot className="w-16 h-16 text-slate-300 mb-4" />
             <p className="text-sm font-medium text-slate-400">{language === 'vi' ? 'Mô hình Action Networks sẽ kích hoạt tại đây.' : 'Node-Based Flow will be rendered here.'}</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
