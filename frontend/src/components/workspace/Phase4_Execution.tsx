"use client";

import React, { useState } from 'react';
import { Bot, Send, Sparkles, CheckCircle, ShieldCheck, CheckSquare, RefreshCw, ArrowLeft, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRelevantRules, saveRule } from '@/mocks/mockKnowledgeBase';
import { runExecutorAgent, runLearnerAgent } from '@/mocks/agentServices';

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
                 {language === 'vi' ? 'Đang tạo nội dung chuẩn hóa...' : 'Generating compliant content...'}
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
              placeholder={language === 'vi' ? "Ví dụ: Viết một bài post LinkedIn cho tuần tới..." : "Ex: Write a LinkedIn post for next week..."}
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

      {/* Right Pane: Execution Canvas */}
      <div className="flex-1 h-full relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIj48L3JlY3Q+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgwLDAsMCwwLjA1KSI+PC9jaXJjbGU+PC9zdmc+')]">
        {showCanvas ? (
          <div className="h-full flex flex-col p-8 items-center justify-center">
            
            <div className="flex space-x-4 mb-6 w-full max-w-2xl">
               <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg flex items-center text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <CheckSquare className="w-4 h-4 mr-2" /> {language === 'vi' ? 'Tuân thủ Chiến lược Gốc' : 'Blueprint Compliant'}
               </div>
               <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg flex items-center text-blue-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 blink-animation"></span> 
                  {language === 'vi' ? 'Điểm Customer Agent: 9.5/10' : 'Customer Agent Score: 9.5/10'}
               </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">{language === 'vi' ? 'Bản nháp bài viết LinkedIn' : 'LinkedIn Post Draft'}</div>
                <div className="text-xs text-slate-500 font-medium">{language === 'vi' ? 'Mục tiêu: B2B C-Level' : 'Targeting: B2B C-Level'}</div>
              </div>
              <div className="p-6 text-sm text-slate-700 leading-relaxed font-medium space-y-4 whitespace-pre-wrap font-mono">
                {generatedOutput}
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
                 <button 
                  onClick={() => setFeedbackMode(!feedbackMode)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                 >
                   {language === 'vi' ? 'Sửa / Cải thiện' : 'Edit / Improve'}
                 </button>
                 <button className="px-4 py-2 rounded-lg text-xs font-semibold text-white gradient-ai-bg">{language === 'vi' ? 'Gửi duyệt tới Integration' : 'Publish to Integration'}</button>
              </div>

              {/* Feedback Mode UI */}
              <AnimatePresence>
                {feedbackMode && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-200 bg-blue-50/50 p-6"
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
                      className="w-full border border-slate-300 rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white"
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
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded text-xs font-medium transition-colors flex items-center gap-2"
                      >
                         {isLearning ? (language === 'vi' ? "Đang đúc kết..." : "Distilling...") : (language === 'vi' ? "Gửi hướng dẫn" : "Send Feedback")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Success Toast */}
            <AnimatePresence>
              {showSuccessToast && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center shadow-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  Luật mới đã được áp dụng vào Vector DB Chung!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center flex-col opacity-50">
             <Bot className="w-16 h-16 text-slate-300 mb-4" />
             <p className="text-sm font-medium text-slate-400">{language === 'vi' ? 'Tác vụ sẽ được hiển thị tại đây.' : 'Triggers will be rendered here.'}</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
