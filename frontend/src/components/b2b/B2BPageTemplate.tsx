"use client";

import React, { useState } from 'react';
import { Download, Save, X, Printer, FileText, Send, BrainCircuit, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SaveIndicator from './SaveIndicator';
import ExecutiveReport from '../workspace/ExecutiveReport';
import GlobalMarqueeAnnotator from '../GlobalMarqueeAnnotator';

interface PageTemplateProps {
  title: string;
  description: string;
  children: React.ReactNode;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  showFullReport?: boolean;
}

export default function B2BPageTemplate({ title, description, children, saveStatus, showFullReport = false }: PageTemplateProps) {
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
    <div className={previewMode === 'section' ? "fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex p-4 lg:p-8 print:p-0 print:bg-transparent print:backdrop-blur-none print:block" : "flex flex-col h-full w-full bg-[#0B1120] relative text-slate-200"}>
      
      {/* ── Background Ambient Glows ── */}
      {previewMode !== 'section' && (
        <>
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none z-0" />
        </>
      )}

      {/* ── NORMAL TOP HEADER (HUD Style) ── */}
      <div className={`print-hide sticky top-0 z-20 glassbox-card !rounded-none !border-t-0 !border-l-0 !border-r-0 border-b-white/10 px-8 py-5 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.1)] ${previewMode === 'section' ? 'hidden' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 font-heading tracking-tight drop-shadow-sm">{title}</h1>
            <p className="text-slate-400 font-medium text-sm mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 print-hide">
          {saveStatus && <SaveIndicator status={saveStatus} />}
          <button className="flex items-center px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold text-slate-200 transition-colors border border-white/5 hover:border-white/20 shadow-sm">
            <Save className="w-4 h-4 mr-2 text-slate-400" />
            {t('b2b_tools.save_draft' as any)}
          </button>
          
          <button 
            onClick={() => setPreviewMode('section')}
            className="flex items-center px-5 py-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-bold border border-blue-500/30 transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
          >
            <Download className="w-4 h-4 mr-2" />
            {language === 'vi' ? 'Tải PDF' : 'Download PDF'}
          </button>

          {showFullReport && (
          <button 
            onClick={() => setPreviewMode('full')}
            className="group relative px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all overflow-hidden flex items-center"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <FileText className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">{language === 'vi' ? 'Xuất Toàn bộ Báo cáo' : 'Export Full Report'}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-black/30 text-cyan-300 uppercase tracking-widest font-black relative z-10 border border-cyan-500/30">
              Premium
            </span>
          </button>
          )}
        </div>
      </div>

      {/* ── MAIN CONTAINER ── */}
      <div className={`flex-1 flex overflow-hidden print:p-0 print:bg-white print:overflow-visible relative z-10 ${previewMode === 'section' ? 'bg-slate-900 rounded-2xl shadow-2xl print:shadow-none print:rounded-none' : 'flex-col p-8 overflow-y-auto custom-scrollbar'}`}>
        
        {/* LEFT COLUMN: SECTION PREVIEW OR NORMAL VIEW */}
        <div className={`flex-1 flex flex-col min-w-0 print:border-none print:block ${previewMode === 'section' ? 'border-r border-slate-700' : ''}`}>
          
          {/* SECTION MODAL HEADER */}
          {previewMode === 'section' && (
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0 print:hidden">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {language === 'vi' ? 'Xem trước bản in (PDF)' : 'PDF Print Preview'}
                </h3>
                <p className="text-xs text-slate-400">
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
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Tải Xuống PDF' : 'Download PDF'}
                </button>
                <button 
                  onClick={() => setPreviewMode(null)}
                  className="p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION CONTENT AREA */}
          <div className={`flex-1 ${previewMode === 'section' ? 'overflow-auto p-4 lg:p-8 flex justify-center bg-slate-900/50 print:overflow-visible print:p-0 custom-scrollbar' : 'flex flex-col relative'}`}>
            <div 
              className={`transition-all duration-500 flex flex-col
              ${previewMode === 'section' 
                ? `w-[210mm] min-h-[297mm] mx-auto relative bg-white text-slate-900 shadow-[0_0_40px_rgba(0,0,0,0.5)] print:shadow-none p-[20mm] report-container print-section-view ${isRevising ? 'opacity-40 blur-[2px]' : 'opacity-100'}` 
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
            className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex p-4 lg:p-8 print:p-0 print:bg-transparent print:backdrop-blur-none print:block"
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

      {/* AI MARQUEE TOOL (Only visible during export preview) */}
      {previewMode !== null && <GlobalMarqueeAnnotator />}
    </div>
  );
}
