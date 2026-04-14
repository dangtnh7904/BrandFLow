"use client";

import React, { useState } from 'react';
import { Bot, Send, Sparkles, ShieldCheck, RefreshCw, ArrowLeft, CheckCircle, CheckSquare, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReactFlow, Background, Controls, MarkerType, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getRelevantRules, saveRule } from '@/mocks/mockKnowledgeBase';
import { runExecutorAgent, runLearnerAgent } from '@/mocks/agentServices';

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
 
 const [generatedOutput, setGeneratedOutput] = useState('');
 const [feedbackMode, setFeedbackMode] = useState(false);
 const [feedback, setFeedback] = useState('');
 const [clarifyingQuestion, setClarifyingQuestion] = useState<string | null>(null);
 const [feedbackContext, setFeedbackContext] = useState<string>('');
 const [isLearning, setIsLearning] = useState(false);
 const [showSuccessToast, setShowSuccessToast] = useState(false);

 const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
 const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

 const handleSend = async () => {
 if (!prompt.trim() || isGenerating) return;
 setIsGenerating(true);
 setShowCanvas(false);
 
 try {
 // 1. Fetch relevant rules (simulating Global knowledge retrieval)
 const relevantRules = await getRelevantRules(prompt);
 
 // 2. Run mock executor
 const output = await runExecutorAgent(prompt, relevantRules);
 setGeneratedOutput(output);
 setShowCanvas(true);
 } catch(e) {
 console.error(e);
 } finally {
 setIsGenerating(false);
 }
 };

 const handleSendFeedback = async () => {
 if (!feedback.trim() || !generatedOutput) return;
 
 setIsLearning(true);
 
 try {
 const fullFeedback = feedbackContext ? `${feedbackContext} DETAILS: ${feedback}` : feedback;
 const distilledResult = await runLearnerAgent(generatedOutput, fullFeedback) as any;
 
 if (distilledResult.needs_clarification) {
 setClarifyingQuestion(distilledResult.clarifying_question);
 setFeedbackContext(fullFeedback);
 setFeedback('');
 return;
 }
 
 await saveRule({
 trigger_keywords: distilledResult.trigger_keywords,
 distilled_rule: distilledResult.distilled_rule
 });
 
 setFeedback('');
 setClarifyingQuestion(null);
 setFeedbackContext('');
 setFeedbackMode(false);
 
 setShowSuccessToast(true);
 setTimeout(() => setShowSuccessToast(false), 3000);
 } catch (error) {
 console.error(error);
 } finally {
 setIsLearning(false);
 }
 };

 return (
 <div className="flex h-full w-full overflow-hidden relative bg-transparent border-t border-linear-border">
 
 {/* Left Pane: Chat Interface */}
 <div className="w-[450px] shrink-0 h-full bg-linear-surface border-r border-linear-border flex flex-col relative z-10 shadow-sm">
 <div className="p-4 border-b border-linear-border flex items-center justify-between">
 <button onClick={onBack} className="p-1.5 rounded bg-linear-surface/50 border border-linear-border text-linear-text-muted hover:text-foreground transition-colors">
 <ArrowLeft className="w-4 h-4" />
 </button>
 <span className="px-2 py-1 bg-blue-50 rounded-md text-[10px] text-blue-600 font-bold uppercase tracking-wider flex items-center border border-blue-100">
 <ShieldCheck className="w-3 h-3 mr-1" /> {language === 'vi' ? 'Sẵn sàng Thực thi' : 'Ready for Execution'}
 </span>
 </div>

 <div className="flex-1 overflow-y-auto p-6 space-y-6">
 <div className="flex items-start gap-4">
 <div className="w-8 h-8 rounded-full gradient-ai-bg flex items-center justify-center shrink-0">
 <Sparkles className="w-4 h-4 text-white" />
 </div>
 <div className="text-sm text-foreground leading-relaxed font-medium bg-linear-surface/50 border border-linear-border p-3 rounded-2xl rounded-tl-sm shadow-sm border border-linear-border">
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
 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
 <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
 </div>
 <div className="text-sm text-linear-text-muted leading-relaxed pt-1">
 {language === 'vi' ? 'Đang khởi tạo Node-Based Canvas...' : 'Generating operational nodes...'}
 </div>
 </div>
 )}
 </div>

 <div className="p-4 border-t border-linear-border bg-background">
 <div className="relative flex items-center">
 <input 
 type="text" 
 value={prompt}
 onChange={(e) => setPrompt(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
 className="w-full bg-linear-surface border border-linear-border rounded-xl py-3 pl-4 pr-12 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
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
 {generatedOutput ? (
 <div className="h-full flex flex-col bg-background relative">
 <div className="absolute top-4 left-4 right-4 z-10 flex gap-4">
 <div className="w-1/2 h-[300px] border border-linear-border rounded-xl bg-linear-surface shadow-sm overflow-hidden text-sm">
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
 </div>
 <div className="w-1/2 flex flex-col bg-linear-surface border border-linear-border rounded-xl shadow-sm text-sm p-4 overflow-auto">
 <div className="font-bold text-foreground mb-1">{language === 'vi' ? 'Bản nháp bài viết' : 'Draft'}</div>
 <div className="text-xs text-linear-text-muted font-medium mb-4">{language === 'vi' ? 'Mục tiêu: B2B C-Level' : 'Targeting: B2B C-Level'}</div>
 <div className="text-sm text-foreground leading-relaxed space-y-4 whitespace-pre-wrap font-mono flex-1">
 {generatedOutput}
 </div>
 </div>
 </div>
 
 <div className="flex-1 mt-[320px] overflow-auto px-4 pb-4">
 <div className="px-6 py-4 bg-linear-surface rounded-xl border border-linear-border flex justify-end space-x-3 shadow-sm mb-4">
 <button 
 onClick={() => setFeedbackMode(!feedbackMode)}
 className="px-4 py-2 rounded-lg text-xs font-semibold text-linear-text-muted bg-linear-surface border border-linear-border hover:bg-linear-surface/80 transition-colors shadow-sm"
 >
 {language === 'vi' ? 'Sửa / Cải thiện' : 'Edit / Improve'}
 </button>
 <button className="px-4 py-2 rounded-lg text-xs font-semibold text-white gradient-ai-bg">{language === 'vi' ? 'Gửi duyệt tới Integration' : 'Publish to Integration'}</button>
 </div>

 <AnimatePresence>
 {feedbackMode && (
 <motion.div 
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="border border-blue-200 rounded-xl bg-blue-50/50 p-6 shadow-sm mb-4"
 >
 <div className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-3">
 <BrainCircuit className="w-4 h-4 text-blue-600" /> 
 {language === 'vi' ? 'Dạy AI viết tốt hơn (Global DB)' : 'Teach AI to write better (Global DB)'}
 </div>
 
 {clarifyingQuestion && (
 <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4 rounded text-xs text-amber-800 font-medium">
 <span className="font-bold mr-2 text-amber-900">Agent:</span> 
 {clarifyingQuestion}
 </div>
 )}
 
 <textarea 
 className="w-full border border-linear-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-linear-surface shadow-sm"
 rows={3}
 placeholder={clarifyingQuestion ? "Giải thích kỹ hơn..." : "Ví dụ: Giọng điệu còn hơi cứng, bỏ chữ 'đột phá' đi."}
 value={feedback}
 onChange={(e) => setFeedback(e.target.value)}
 disabled={isLearning}
 />
 <div className="flex justify-end mt-3">
 <button 
 onClick={handleSendFeedback}
 disabled={!feedback.trim() || isLearning}
 className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-sm"
 >
 {isLearning ? (language === 'vi' ? "Đang đúc kết..." : "Distilling...") : (language === 'vi' ? "Gửi hướng dẫn" : "Send Feedback")}
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 <div className="absolute top-6 right-6 flex items-center space-x-3 pointer-events-none">
 <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl flex items-center text-blue-700 text-xs font-bold uppercase tracking-wider shadow-md pointer-events-auto">
 <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
 {language === 'vi' ? 'Node Graph Đồng bộ Thực thời' : 'Live State Sync'}
 </div>
 </div>
 </div>
 ) : (
 <div className="w-full h-full relative">
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
 </div>
 )}
 
 {/* Success Toast */}
 <AnimatePresence>
 {showSuccessToast && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 className="fixed bottom-6 right-6 bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center shadow-md z-50"
 >
 <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
 Luật mới đã được áp dụng vào Vector DB Chung!
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 ) : (
 <div className="h-full flex items-center justify-center flex-col opacity-50 relative z-10">
 <Bot className="w-16 h-16 text-slate-300 mb-4" />
 <p className="text-sm font-medium text-linear-text-muted">{language === 'vi' ? 'Mô hình Action Networks sẽ kích hoạt tại đây.' : 'Node-Based Flow will be rendered here.'}</p>
 </div>
 )}
 </div>
 
 </div>
 );
}
