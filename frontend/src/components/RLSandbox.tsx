// src/components/RLSandbox.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { getRelevantRules, saveRule, getAllRules, clearRules, DistilledRule } from '../mocks/mockKnowledgeBase';
import { runExecutorAgent, runLearnerAgent } from '../mocks/agentServices';

export default function RLSandbox() {
 const [task, setTask] = useState('');
 const [isExecuting, setIsExecuting] = useState(false);
 const [executorOutput, setExecutorOutput] = useState('');
 const [appliedRules, setAppliedRules] = useState<DistilledRule[]>([]);
 
 const [feedback, setFeedback] = useState('');
 const [clarifyingQuestion, setClarifyingQuestion] = useState<string | null>(null);
 const [feedbackContext, setFeedbackContext] = useState<string>('');
 const [isLearning, setIsLearning] = useState(false);
 const [systemLog, setSystemLog] = useState('');
 
 const [knowledgeBase, setKnowledgeBase] = useState<DistilledRule[]>([]);

 // Load KB on mount
 useEffect(() => {
 refreshKB();
 }, []);

 const refreshKB = async () => {
 const rules = await getAllRules();
 setKnowledgeBase(rules);
 };

 const handleRunExecutor = async () => {
 if (!task.trim()) return;
 
 setIsExecuting(true);
 setExecutorOutput('');
 setSystemLog('Agent is retrieving context rules from Knowledge Base...');
 
 try {
 // 1. Fetch relevant rules via RAG (Mock)
 const relevantRules = await getRelevantRules(task);
 setAppliedRules(relevantRules);
 
 setSystemLog(`Agent is generating output with ${relevantRules.length} rules injected...`);
 
 // 2. Run Executor
 const output = await runExecutorAgent(task, relevantRules);
 setExecutorOutput(output);
 setSystemLog('Execution completed. Awaiting user feedback.');
 
 } catch (error) {
 console.error(error);
 setSystemLog('Error during execution.');
 } finally {
 setIsExecuting(false);
 }
 };

 const handleSendFeedback = async () => {
 if (!feedback.trim() || !executorOutput) return;
 
 setIsLearning(true);
 setSystemLog(clarifyingQuestion ? 'Learner Agent is analyzing your clarification...' : 'Learner Agent is analyzing feedback and original output...');
 
 try {
 const fullFeedback = feedbackContext ? `${feedbackContext} DETAILS: ${feedback}` : feedback;
 
 // 1. Run Learner Agent
 const distilledResult = await runLearnerAgent(executorOutput, fullFeedback) as any;
 
 if (distilledResult.needs_clarification) {
 setClarifyingQuestion(distilledResult.clarifying_question);
 setFeedbackContext(fullFeedback);
 setFeedback('');
 setSystemLog('Learner Agent needs more clarification.');
 return;
 }
 
 setSystemLog(`Rule distilled: "${distilledResult.distilled_rule}". Saving to DB...`);
 
 // 2. Save to Vector DB (Mock)
 await saveRule({
 trigger_keywords: distilledResult.trigger_keywords,
 distilled_rule: distilledResult.distilled_rule
 });
 
 setSystemLog('Rule saved to Knowledge Base successfully! Ready for next task.');
 
 // Clear feedback and refresh KB
 setFeedback('');
 setClarifyingQuestion(null);
 setFeedbackContext('');
 await refreshKB();
 
 } catch (error) {
 console.error(error);
 setSystemLog('Error during distillation.');
 } finally {
 setIsLearning(false);
 }
 };

 const handleClearKB = async () => {
 await clearRules();
 await refreshKB();
 setSystemLog('Knowledge Base cleared.');
 }

 return (
 <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background min-h-screen text-foreground">
 
 <div className="flex justify-between items-center bg-linear-surface p-4 rounded-lg shadow-sm border border-linear-border">
 <div>
 <h1 className="text-2xl font-bold text-foreground">RL Loop Testing Sandbox</h1>
 <p className="text-sm text-linear-text-muted">Test the Knowledge Distillation flow locally</p>
 </div>
 <div className="text-xs bg-linear-surface/50 border border-linear-border px-3 py-1.5 rounded-full text-linear-text-muted font-mono flex items-center gap-2">
 {isExecuting && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
 {isLearning && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
 {(!isExecuting && !isLearning) && <span className="w-2 h-2 rounded-full bg-slate-400"></span>}
 <span>System Status: {isExecuting ? "Executing..." : isLearning ? "Learning..." : "Idle"}</span>
 </div>
 </div>

 {systemLog && (
 <div className="bg-linear-surface border-l-4 border-indigo-500 p-4 shadow-sm text-sm text-indigo-700 animate-pulse font-medium">
 <span className="font-bold text-indigo-900 mr-2">[LOG]</span> {systemLog}
 </div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* LEFT COLUMN: Task & Feedback Loop */}
 <div className="lg:col-span-2 space-y-6">
 
 {/* Section A: Task Input */}
 <section className="bg-linear-surface p-5 rounded-lg shadow-sm border border-linear-border">
 <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
 <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">A</span> 
 Executor Agent Task
 </h2>
 <textarea 
 className="w-full border border-linear-border rounded p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
 rows={3}
 placeholder="E.g., Write a PR post launching our new B2B product..."
 value={task}
 onChange={(e) => setTask(e.target.value)}
 disabled={isExecuting || isLearning}
 />
 <button 
 onClick={handleRunExecutor}
 disabled={!task.trim() || isExecuting || isLearning}
 className="mt-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
 >
 {isExecuting && (
 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 )}
 Run Executor
 </button>
 </section>

 {/* Section B: Result & Feedback */}
 <section className={`bg-linear-surface p-5 rounded-lg shadow-sm border border-linear-border transition-opacity duration-300 ${!executorOutput ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
 <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
 <span className="bg-slate-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">B</span> 
 Output & Human Feedback
 </h2>
 
 <div className="bg-background border border-linear-border rounded p-4 mb-5 text-sm whitespace-pre-wrap text-foreground min-h-[100px] font-mono leading-relaxed">
 {executorOutput || "Waiting for execution..."}
 </div>

 <div>
 {clarifyingQuestion && (
 <div className="bg-amber-50 border border-amber-200 p-4 mb-4 rounded-md text-sm text-amber-800 shadow-sm relative">
 <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500 rounded-l-md"></div>
 <span className="font-bold mr-2 text-amber-900">🤖 Learner Agent:</span> 
 {clarifyingQuestion}
 </div>
 )}
 <label className="block text-sm font-medium text-foreground mb-2">
 {clarifyingQuestion ? "Your Clarification:" : "Your Correction / Feedback:"}
 </label>
 <textarea 
 className="w-full border border-linear-border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
 rows={3}
 placeholder={clarifyingQuestion ? "E.g., Quá dài, cần cắt ngắn bớt phần giới thiệu và tập trung vào Call-to-action." : "E.g., Too formal. Use 'You' instead of 'The customer'. Never use the word 'synergy'."}
 value={feedback}
 onChange={(e) => setFeedback(e.target.value)}
 disabled={isLearning}
 />
 <button 
 onClick={handleSendFeedback}
 disabled={!feedback.trim() || isLearning}
 className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
 >
 {isLearning && (
 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 )}
 Send to Learner Agent
 </button>
 </div>
 </section>

 </div>

 {/* RIGHT COLUMN: Knowledge Base Monitor */}
 <div className="lg:col-span-1">
 <section className="bg-linear-surface p-5 rounded-lg shadow-sm border border-linear-border h-full flex flex-col">
 <div className="flex justify-between items-center mb-4 pb-2 border-b border-linear-border">
 <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
 <span className="bg-purple-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">C</span> 
 Mock Vector DB
 </h2>
 <button onClick={handleClearKB} className="text-xs text-linear-text-muted hover:text-red-500 transition-colors">
 Clear DB
 </button>
 </div>
 
 <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
 {knowledgeBase.length === 0 ? (
 <div className="text-center text-sm text-linear-text-muted py-12 px-4 italic border-2 border-dashed border-linear-border rounded-lg">
 No rules learned yet. Run an execution and provide feedback to start teaching the agent!
 </div>
 ) : (
 knowledgeBase.slice().reverse().map((rule) => (
 <div key={rule.id} className="bg-linear-surface border border-linear-border rounded p-4 text-sm shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-purple-300 transition-colors">
 <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500"></div>
 <div className="font-semibold text-foreground mb-2 leading-tight">
 "{rule.distilled_rule}"
 </div>
 <div className="flex flex-wrap gap-1.5 mt-2">
 {rule.trigger_keywords.map((kw, idx) => (
 <span key={idx} className="bg-linear-surface/50 border border-linear-border text-linear-text-muted px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase">
 {kw}
 </span>
 ))}
 </div>
 <div className="text-[10px] text-linear-text-muted mt-3 pt-2 border-t border-slate-50 flex justify-between">
 <span>ID: {rule.id.split('_')[1]}</span>
 <span>{new Date(rule.timestamp).toLocaleTimeString()}</span>
 </div>
 </div>
 ))
 )}
 </div>
 </section>
 </div>

 </div>
 </div>
 );
}
