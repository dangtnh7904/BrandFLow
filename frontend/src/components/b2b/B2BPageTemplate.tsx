"use client";

import React, { useState } from 'react';
import { Download, Save, X, Printer, FileText, Send, BrainCircuit, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SaveIndicator from './SaveIndicator';
import ExecutiveReport from '../workspace/ExecutiveReport';

interface PageTemplateProps {
  title: string;
  description: string;
  children: React.ReactNode;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

export default function B2BPageTemplate({ title, description, children, saveStatus }: PageTemplateProps) {
  const { language, t } = useLanguage();
  const [previewMode, setPreviewMode] = useState<'section' | 'full' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [isRevising, setIsRevising] = useState(false);

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    
    // Lưu lại lịch sử
    const newHistory: {role: 'user'|'ai', text: string}[] = [
      ...feedbackHistory, 
      { role: 'user', text: feedback }
    ];
    setFeedbackHistory(newHistory);
    setFeedback('');
    setIsRevising(true);

    // Giả lập AI processing
    setTimeout(() => {
      setFeedbackHistory([
        ...newHistory,
        { role: 'ai', text: language === 'vi' ? 'Đã ghi nhận yêu cầu và điều chỉnh bản báo cáo. Mời bạn kiểm tra lại!' : 'Revision complete. Please review the updated report!' }
      ]);
      setIsRevising(false);
    }, 2000);
  };
  
  React.useEffect(() => {
    if (previewMode === 'section') {
      document.body.classList.add('preview-mode');
    } else {
      document.body.classList.remove('preview-mode');
    }
    return () => document.body.classList.remove('preview-mode');
  }, [previewMode]);

  return (
    <div className={previewMode === 'section' ? "fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex p-4 lg:p-8 print:p-0 print:bg-white print:block" : "flex flex-col h-full w-full"}>
      
      {/* NORMAL TOP HEADER (Hidden in preview mode) */}
      <div className={`print-hide sticky top-0 z-10 bg-linear-surface/90 backdrop-blur-md border-b border-linear-border px-8 py-5 flex items-center justify-between shadow-sm ${previewMode === 'section' ? 'hidden' : ''}`}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-linear-text-muted mt-1">{description}</p>
        </div>
        <div className="flex items-center space-x-3 print-hide">
          {saveStatus && <SaveIndicator status={saveStatus} />}
          <button className="flex items-center px-4 py-2 border border-linear-border rounded-md bg-linear-surface text-sm font-medium text-foreground hover:bg-linear-surface/80 transition-colors shadow-sm">
            <Save className="w-4 h-4 mr-2" />
            {t('b2b_tools.save_draft' as any)}
          </button>
          
          <button 
            onClick={() => setPreviewMode('section')}
            className="flex items-center px-4 py-2 border border-linear-border rounded-md bg-white dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            {language === 'vi' ? 'Tải Xuống PDF' : 'Download PDF'}
          </button>

          <button 
            onClick={() => setPreviewMode('full')}
            className="flex items-center px-4 py-2 border border-transparent rounded-md gradient-ai-bg text-sm font-bold text-white shadow-sm hover:shadow-lg transition-all relative overflow-hidden group"
          >
            <FileText className="w-4 h-4 mr-2" />
            {language === 'vi' ? 'Export Full Report' : 'Export Full Report'}
            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-white/20 text-white uppercase tracking-widest font-bold border border-white/30">
              Premium
            </span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER (Section Preview Morphs here) */}
      <div className={`flex-1 flex overflow-hidden print:p-0 print:bg-white print:overflow-visible relative ${previewMode === 'section' ? 'bg-slate-100 rounded-2xl shadow-2xl print:shadow-none print:rounded-none' : 'flex-col p-8 overflow-y-auto'}`}>
        
        {/* LEFT COLUMN: SECTION PREVIEW OR NORMAL VIEW */}
        <div className={`flex-1 flex flex-col min-w-0 print:border-none print:block ${previewMode === 'section' ? 'border-r border-slate-200' : ''}`}>
          
          {/* SECTION MODAL HEADER */}
          {previewMode === 'section' && (
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0 print:hidden">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'vi' ? 'Xem trước bản in (PDF)' : 'PDF Print Preview'}
                </h3>
                <p className="text-xs text-slate-500">
                  {`Section: ${title}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    document.body.classList.add('printing-section');
                    setTimeout(() => {
                      window.print();
                      setTimeout(() => document.body.classList.remove('printing-section'), 500);
                    }, 50);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center shadow-md transition-all"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Tải Xuống PDF' : 'Download PDF'}
                </button>
                <button 
                  onClick={() => setPreviewMode(null)}
                  className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION CONTENT AREA */}
          <div className={`flex-1 ${previewMode === 'section' ? 'overflow-auto p-4 lg:p-8 flex justify-center bg-slate-200/50 print:overflow-visible print:p-0' : 'flex flex-col relative'}`}>
            <div 
              className={`transition-all duration-500 flex flex-col
              ${previewMode === 'section' 
                ? `w-[210mm] min-h-[297mm] mx-auto relative bg-white shadow-lg print:shadow-none p-[20mm] report-container print-section-view ${isRevising ? 'opacity-40 blur-[2px]' : 'opacity-100'}` 
                : 'max-w-6xl mx-auto w-full print:w-[210mm] print:mx-auto print:font-sans print:report-container print:p-[20mm] print-section-view flex-1 mb-20 print:mb-0'
              }`}
            >
              
              {/* DIRECT CSS INJECTION TO BYPASS BROWSER CACHE & FORCE AGGRESSIVE HIDING */}
              <style dangerouslySetInnerHTML={{__html: `
                .preview-mode .print-section-view button,
                .printing-section .print-section-view button {
                  display: none !important;
                }
                .preview-mode .print-section-view .print-hide,
                .printing-section .print-section-view .print-hide {
                  display: none !important;
                }
                /* Hide the first child of space-y-6 which is ALWAYS the InstructionAlert & AutoSave bar */
                .preview-mode .print-section-view .space-y-6 > div:first-child,
                .printing-section .print-section-view .space-y-6 > div:first-child {
                  display: none !important;
                }
                /* Flatten select dropdown arrows completely */
                .preview-mode .print-section-view select,
                .printing-section .print-section-view select {
                  background-image: none !important;
                  -webkit-appearance: none !important;
                  appearance: none !important;
                }
              `}} />

              {/* Synchronized Print Header */}
              <header className={`border-b-2 border-slate-900 pb-4 mb-8 justify-between items-end shrink-0 ${previewMode === 'section' ? 'flex' : 'hidden print:flex'}`}>
                <div className="text-xl font-black text-slate-900 uppercase tracking-tight">BrandFlow</div>
                <div className="text-slate-500 font-bold text-xs tracking-widest uppercase">{title}</div>
              </header>

              {/* LIVE REACT COMPONENTS */}
              <div className="flex-1">
                {children}
              </div>

              {/* Synchronized Print Footer */}
              <footer className={`border-t border-slate-200 justify-between items-center text-xs text-slate-400 bg-white shrink-0 ${previewMode === 'section' ? 'flex mt-12 pt-4' : 'hidden print:flex print-section-only-footer fixed bottom-[20mm] left-[20mm] right-[20mm] pt-4 z-50'}`}>
                <div>
                  <strong className="text-slate-500">BrandFlow AI System</strong><br/>
                  Generated by MasterPlanner & CFO Agents
                </div>
                <div className="text-right">
                  CONFIDENTIAL<br/>
                  Internal Use Only - {new Date().toLocaleDateString('vi-VN')}
                </div>
              </footer>

            </div>
          </div>
        </div>

        {/* SECTION AI REVISION ASSISTANT */}
        {previewMode === 'section' && (
          <div className="w-[400px] shrink-0 bg-white flex flex-col hidden lg:flex print:hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">{language === 'vi' ? 'AI Planner Trợ Lý' : 'AI Revision Assistant'}</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800">
                {language === 'vi' 
                  ? 'Chào bạn! Đây là bản xem trước. Bạn muốn tôi chỉnh sửa, nhận xét hay rút gọn phần nào trước khi xuất file không?' 
                  : 'Hello! This is the print preview. What would you like me to adjust before exporting?'}
              </div>
              
              {feedbackHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isRevising && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-tl-sm text-sm text-slate-500 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    {language === 'vi' ? 'Đang viết lại nội dung...' : 'Revising content...'}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="relative">
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={language === 'vi' ? "Yêu cầu chỉnh sửa..." : "Request an edit..."}
                  className="w-full border border-slate-300 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendFeedback();
                    }
                  }}
                />
                <button 
                  onClick={handleSendFeedback}
                  disabled={isRevising || !feedback.trim()}
                  className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ORIGINAL FULL REPORT MODAL */}
      <AnimatePresence>
        {previewMode === 'full' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex p-4 lg:p-8 print:p-0 print:bg-white print:block"
          >
            <div className="bg-slate-100 w-full h-full rounded-2xl shadow-2xl flex overflow-hidden print:shadow-none print:rounded-none">
              
              {/* LEFT COLUMN: PREVIEW */}
              <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 print:border-none print:block">
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0 print:hidden">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{language === 'vi' ? 'Xem trước bản in (PDF)' : 'PDF Print Preview'}</h3>
                    <p className="text-xs text-slate-500">BrandFlow Executive Strategy Report</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center shadow-md transition-all"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      {language === 'vi' ? 'Tải Xuống PDF' : 'Download PDF'}
                    </button>
                    <button 
                      onClick={() => setPreviewMode(null)}
                      className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto p-4 lg:p-8 flex justify-center print:overflow-visible print:p-0 bg-slate-200/50" id="print-root">
                  <div className={`transition-all duration-500 ${isRevising ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}>
                    <ExecutiveReport />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: AI REVISION ASSISTANT */}
              <div className="w-[400px] shrink-0 bg-white flex flex-col hidden lg:flex print:hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900">{language === 'vi' ? 'AI Planner Trợ Lý' : 'AI Revision Assistant'}</h3>
                  </div>
                  <button 
                    onClick={() => setPreviewMode(null)}
                    className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800">
                    {language === 'vi' 
                      ? 'Chào bạn! Đây là bản nháp báo cáo. Bạn muốn tôi chỉnh sửa phần nào trước khi xuất file không?' 
                      : 'Hello! This is the draft report. What would you like me to adjust before exporting?'}
                  </div>
                  
                  {feedbackHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  
                  {isRevising && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-tl-sm text-sm text-slate-500 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                        {language === 'vi' ? 'Đang viết lại báo cáo...' : 'Revising report...'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="relative">
                    <textarea 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={language === 'vi' ? "Yêu cầu chỉnh sửa..." : "Request an edit..."}
                      className="w-full border border-slate-300 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendFeedback();
                        }
                      }}
                    />
                    <button 
                      onClick={handleSendFeedback}
                      disabled={isRevising || !feedback.trim()}
                      className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
