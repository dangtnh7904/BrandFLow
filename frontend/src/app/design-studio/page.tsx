"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Sparkles, TerminalSquare, AlertCircle, RefreshCw, 
  CheckCircle2, Image as ImageIcon, Briefcase, Download, 
  ArrowRight, Activity, ChevronRight, Type, Check, Hash, Network, Settings,
  LineChart, BrainCircuit, PenTool
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function DesignStudioPage() {
  const { t } = useLanguage();
  // --------- STATE: INPUT FORM ---------
  const [promptData, setPromptData] = useState({
    userPrompt: '',
    creativeMode: 'balanced' // strict, balanced, wild
  });

  // --------- MOCK: BACKEND MASTER DNA ---------
  const masterDNA = {
    industry: "Công nghệ Bán lẻ (Tech Retail)",
    usps: "1. Đổi trả AI tự động\n2. Cửa hàng không người bán",
    audience: "Gen Z (18-24), yêu thích công nghệ.",
    tone: "Nhanh nhẹn, Đột phá."
  };

  // --------- STATE: PROCESSING & RESULTS ---------
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // --------- STATE: AGENTS BRAIN LOGS ---------
  const [agentLogs, setAgentLogs] = useState<{id: number, time: string, agent: string, text: string, type: 'info' | 'success' | 'warn'}[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // --------- STATE: REVISE ---------
  const [feedbackInput, setFeedbackInput] = useState("");
  const [revising, setRevising] = useState(false);
  
  // --------- STATE: UI INTERACT ---------
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentLogs]);

  const addLog = (agent: string, text: string, type: 'info'|'success'|'warn' = 'info') => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    setAgentLogs(prev => [...prev, { id: Date.now() + Math.random(), time, agent, text, type }]);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setAgentLogs([]);

      // Start Simulation Logs
      setActiveAgent('System');
      addLog("System", "Initiating Neural Design Network...", "info");
      await sleep(800);
      
      setActiveAgent('Market Agent');
      addLog("Market Agent", `Phân tích dữ liệu ngành: ${masterDNA.industry || 'Chung'}...`, "info");
      await sleep(1500);
      addLog("Market Agent", "Trích xuất Insight màu sắc phong thủy dựa trên tâm lý học Khách hàng mục tiêu.", "success");
      await sleep(1200);
      
      let finalTone = masterDNA.tone;
      if (promptData.creativeMode === 'wild') finalTone += " (PHÁ CÁCH: Hãy cực kỳ sáng tạo, vượt ra khỏi quy chuẩn ngành)";
      else if (promptData.creativeMode === 'strict') finalTone += " (NGHIÊM TÚC: Bám sát 100% Core DNA, không phiêu lưu)";

      setActiveAgent('Creative Agent');
      addLog("Creative Agent", "Kích hoạt mô hình Generative. Rasterizing DNA...", "info");

      const payload = {
        industry: masterDNA.industry,
        core_usps: masterDNA.usps.split('\n').filter(x => x.trim() !== ''),
        target_audience_insights: masterDNA.audience.split('\n').filter(x => x.trim() !== ''),
        tone_of_voice: finalTone,
        strict_rules: promptData.userPrompt ? ["CẢNH BÁO TỪ USER: " + promptData.userPrompt] : ["Tuân thủ nguyên tắc thị giác cơ bản."]
      };

      const response = await fetch("http://localhost:8000/api/v1/design/generate-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Lỗi kết nối hoặc API Key bị thiếu");
      const resData = await response.json();
      if (resData.status === "error") throw new Error(resData.message);

      setActiveAgent('Copywriter Agent');
      addLog("Copywriter Agent", "Sáng tạo Slogan phù hợp với nhận diện...", "success");
      await sleep(1000);
      
      setActiveAgent('Creative Agent');
      addLog("Creative Agent", "DALL-E 3 Rendering Hoàn tất.", "success");
      
      setActiveAgent('System');
      addLog("System", "Xuất Visual Asset về Canvas.", "info");

      setActiveAgent('Done');
      setResult(resData.data);
    } catch (err: any) {
      setError(err.message || "Failed to generate assets");
      addLog("System", `Lỗi sinh Logo: ${err.message}`, "warn");
    } finally {
      setLoading(false);
    }
  };

  const handleRevise = async () => {
    if (!feedbackInput.trim() || !result) return;
    try {
      setRevising(true);
      setError(null);
      addLog("System", "Tiếp nhận Feedback, tái cấu trúc tham số...", "warn");

      const payload = {
        original_request: {
          industry: masterDNA.industry,
          core_usps: masterDNA.usps.split('\n'),
          target_audience_insights: masterDNA.audience.split('\n'),
          tone_of_voice: "Updated config",
          strict_rules: []
        }, // Simplified for revise
        original_output: result,
        user_feedback: feedbackInput
      };

      const response = await fetch("http://localhost:8000/api/v1/design/revise-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Lỗi kết nối hoặc API Key bị thiếu");
      const resData = await response.json();
      if (resData.status === "error") throw new Error(resData.message);

      addLog("Creative Agent", "Đã cập nhật lại mảng thiết kế thành công.", "success");
      setResult(resData.data);
      setFeedbackInput("");
    } catch (err: any) {
      setError(err.message || "Failed to revise assets");
      addLog("System", `Lỗi revise: ${err.message}`, "warn");
    } finally {
      setRevising(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="w-full h-[100vh] flex flex-col overflow-hidden relative z-10 py-6 px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 text-foreground">
          <div className="w-12 h-12 bg-linear-surface/30 backdrop-blur-md rounded-2xl flex items-center justify-center border ultra-thin-border shadow-inner">
            <Palette className="w-6 h-6 text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{t('design_studio.title')}</h1>
            <p className="text-linear-text-muted mt-1 text-sm font-medium">{t('design_studio.desc')}</p>
          </div>
        </div>
      </div>

      {/* 3-COLUMN BENTO BOX GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pb-2">
        
        {/* ================================================== */}
        {/* COLUMN 1: THE INPUT (Form) (3/12) */}
        {/* ================================================== */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bento-card p-5 relative overflow-hidden flex flex-col shrink-0"
          >
            <div className="flex items-center mb-5 pb-3 border-b border-linear-border/50">
              <Network className="w-4 h-4 mr-2 text-indigo-400" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">{t('design_studio.agent0_title')}</h2>
              <div className="ml-auto flex items-center">
                <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-2"></span>
                <span className="text-[10px] text-indigo-400 font-mono">{t('design_studio.synced')}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1">{t('design_studio.ind_lbl')}</div>
                <div className="text-sm font-medium text-foreground">{masterDNA.industry}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1">{t('design_studio.usps_lbl')}</div>
                <div className="text-xs text-foreground whitespace-pre-line">{masterDNA.usps}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1">{t('design_studio.aud_lbl')}</div>
                <div className="text-xs text-foreground bg-linear-surface p-2 rounded border border-linear-border/50">{masterDNA.audience}</div>
              </div>
            </div>

            <div className="flex items-center mb-4 mt-2">
              <Settings className="w-4 h-4 mr-2 text-cyan-400" />
              <h2 className="text-sm font-bold text-foreground">{t('design_studio.overrides_title')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-linear-text-muted mb-2">{t('design_studio.add_msg')}</label>
                <textarea 
                  rows={4}
                  placeholder={t('design_studio.add_msg_ph')}
                  className="w-full bg-linear-surface/50 border border-linear-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-medium resize-none shadow-inner"
                  value={promptData.userPrompt}
                  onChange={e => setPromptData({...promptData, userPrompt: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-linear-text-muted mb-2">{t('design_studio.direction')}</label>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setPromptData({...promptData, creativeMode: 'strict'})}
                    className={`text-left px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer ${promptData.creativeMode === 'strict' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-linear-surface/30 border-linear-border text-linear-text-muted hover:bg-linear-surface/60'}`}
                  >
                    {t('design_studio.dir_1')}
                  </button>
                  <button 
                    onClick={() => setPromptData({...promptData, creativeMode: 'balanced'})}
                    className={`text-left px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer ${promptData.creativeMode === 'balanced' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-linear-surface/30 border-linear-border text-linear-text-muted hover:bg-linear-surface/60'}`}
                  >
                    {t('design_studio.dir_2')}
                  </button>
                  <button 
                    onClick={() => setPromptData({...promptData, creativeMode: 'wild'})}
                    className={`text-left px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer ${promptData.creativeMode === 'wild' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-linear-surface/30 border-linear-border text-linear-text-muted hover:bg-linear-surface/60'}`}
                  >
                    {t('design_studio.dir_3')}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 w-full py-3.5 rounded-xl flex items-center justify-center font-bold text-white transition-all overflow-hidden relative group cursor-pointer disabled:cursor-not-allowed border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400"
            >
              {loading ? (
                <span className="flex items-center text-sm">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> {t('design_studio.btn_rendering')}
                </span>
              ) : (
                <span className="flex items-center text-sm relative z-10">
                  <Palette className="w-4 h-4 mr-2" /> {t('design_studio.btn_design')}
                </span>
              )}
            </button>
            <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-start text-xs shadow-sm mt-4"
                  >
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ================================================== */}
        {/* COLUMN 2: THE CANVAS (Preview & Mini Brand Book) (6/12) */}
        {/* ================================================== */}
        <div className="lg:col-span-6 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6 relative">
           
           {/* DEFAULT EMPTY STATE */}
           {!loading && !result && (
              <div className="w-full h-full bento-card p-10 flex flex-col items-center justify-center min-h-[500px]">
                 <div className="w-24 h-24 rounded-full border border-dashed border-linear-border bg-linear-surface/30 flex items-center justify-center mb-6 shadow-inner">
                    <ImageIcon className="w-8 h-8 text-linear-text-muted opacity-50" />
                 </div>
                 <h3 className="text-xl font-bold text-foreground mb-2">{t('design_studio.canvas_empty')}</h3>
                 <p className="text-sm text-linear-text-muted text-center max-w-sm">
                    {t('design_studio.canvas_empty_desc')}
                 </p>
              </div>
           )}

           {/* LOADING FOG STATE */}
           {loading && (
              <div className="w-full h-full bento-card p-10 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] mix-blend-overlay"></div>
                 {/* Glass wipe effect scanner */}
                 <motion.div 
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent blur-xl"
                 />
                 
                 <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="w-20 h-20 mb-6 rounded-full border-2 border-dashed border-cyan-500/30 border-t-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] z-10 relative bg-background flex items-center justify-center"
                 >
                    <Palette className="w-6 h-6 text-cyan-400 opacity-50 absolute" />
                 </motion.div>
                 <h3 className="text-lg font-bold text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] z-10 relative">{t('design_studio.canvas_loading')}</h3>
                 <p className="text-xs text-linear-text-muted mt-2 max-w-sm text-center z-10 relative">
                   {t('design_studio.canvas_loading_desc')}
                 </p>
              </div>
           )}

           {/* RESULT REVEAL */}
           {!loading && result && (
              <motion.div 
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6"
              >
                  {/* Master Logo Box */}
                  <div className="bento-card p-0 overflow-hidden relative">
                     <div className="p-4 border-b border-linear-border flex justify-between items-center bg-linear-surface/50">
                        <div className="flex items-center font-bold text-sm text-foreground">
                          <Briefcase className="w-4 h-4 text-cyan-500 mr-2" /> {t('design_studio.master_logo')}
                        </div>
                        <div className="flex items-center space-x-2">
                           <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center">
                             <CheckCircle2 className="w-3 h-3 mr-1" /> {t('design_studio.vectorized')}
                           </span>
                           <button className="p-1 hover:bg-linear-surface rounded transition text-linear-text-muted hover:text-cyan-400" title="Tạo lại riêng phần này">
                              <RefreshCw className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     </div>
                     <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 relative">
                        <img src={result.logo_url} alt="Logo" className="w-[60%] h-[60%] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-500" />
                     </div>
                  </div>

                  {/* Brand Guidelines: Colors & Typo grid */}
                  <div className="grid grid-cols-2 gap-4">
                     {/* Color Palette */}
                     <div className="bento-card p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-3">
                           <div className="text-xs font-bold text-linear-text-muted uppercase tracking-wider">{t('design_studio.palette')}</div>
                           <button className="text-linear-text-muted hover:text-cyan-400 transition" title="Tạo lại Bảng màu" onClick={handleRevise}>
                              <RefreshCw className="w-3.5 h-3.5" />
                           </button>
                        </div>
                        <div className="flex h-16 w-full rounded-lg overflow-hidden border border-linear-border shadow-inner">
                           {result.visual_language.primary_colors.map((color: string, i: number) => (
                              <div 
                                key={i} 
                                className="flex-1 relative group cursor-pointer" 
                                style={{backgroundColor: color}}
                                onClick={() => copyToClipboard(color)}
                              >
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-mono font-bold text-white tracking-tighter backdrop-blur-sm">
                                   {copiedColor === color ? 'COPIED!' : color}
                                 </div>
                              </div>
                           ))}
                        </div>
                        <p className="text-[10px] text-linear-text-muted mt-2 line-clamp-1">{result.visual_language.mood}</p>
                     </div>

                     {/* Typography */}
                     <div className="bento-card p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-3">
                           <div className="text-xs font-bold text-linear-text-muted uppercase tracking-wider">{t('design_studio.typo')}</div>
                           <button className="text-linear-text-muted hover:text-cyan-400 transition" title="Đổi Font chữ">
                              <Type className="w-3.5 h-3.5" />
                           </button>
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between border-b border-linear-border/50 pb-2">
                              <span className="text-[10px] text-linear-text-muted">Heading</span>
                              <span className="text-sm font-bold text-foreground">Playfair Display</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] text-linear-text-muted">Body</span>
                              <span className="text-xs text-foreground font-medium">Inter Light</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Fanpage Avatar & Banner Mockup */}
                  <div className="bento-card p-0 overflow-hidden relative">
                     <div className="p-4 border-b border-linear-border flex justify-between items-center bg-linear-surface/50">
                        <div className="flex items-center font-bold text-sm text-foreground">
                          <ImageIcon className="w-4 h-4 text-cyan-500 mr-2" /> {t('design_studio.mockup')}
                        </div>
                     </div>
                     <div className="aspect-[21/9] bg-slate-100 dark:bg-slate-900 relative">
                        {/* Cover image */}
                        <img src={result.banner_url} alt="Cover" className="absolute inset-0 w-full h-[60%] object-cover opacity-60 dark:opacity-40" />
                        
                        {/* Mock Avatar overlaps cover */}
                        <div className="absolute left-6 bottom-4 flex items-end">
                           <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-background overflow-hidden relative shadow-lg z-10">
                              <img src={result.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                           </div>
                           <div className="ml-4 mb-2 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-linear-border">
                              <div className="text-sm font-bold text-foreground">Brand Name</div>
                              <div className="text-[10px] text-linear-text-muted">{masterDNA.industry || 'Category'}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* REVISE/FEEDBACK BOX */}
                  <div className="bento-card p-4 relative group overflow-hidden border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                     <div className="flex bg-linear-surface border border-linear-border rounded-lg p-1">
                        <input 
                           type="text"
                           placeholder={t('design_studio.revise_ph')}
                           className="flex-1 bg-transparent px-3 text-sm focus:outline-none text-foreground placeholder-linear-text-muted font-medium"
                           value={feedbackInput}
                           onChange={e => setFeedbackInput(e.target.value)}
                           disabled={revising}
                           onKeyDown={(e) => e.key === 'Enter' && handleRevise()}
                        />
                        <button 
                           onClick={handleRevise}
                           disabled={revising || !feedbackInput.trim()}
                           className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded drop-shadow hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {revising ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : <RefreshCw className="w-3.5 h-3.5 mr-1" />} {t('design_studio.btn_revise')}
                        </button>
                     </div>
                  </div>

                  {/* ===================== CALL TO ACTION B2B ===================== */}
                  <div className="mt-4 mb-10 pt-4 border-t border-linear-border">
                     <Link href="/workspace">
                        <button className="w-full py-5 rounded-2xl flex items-center justify-center font-bold text-white text-lg transition-all overflow-hidden relative group cursor-pointer bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 border-[rgba(255,255,255,0.1)] border shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                          <span className="flex items-center relative z-10 tracking-wide">
                            <Download className="w-5 h-5 mr-3" />
                            {t('design_studio.export_btn')}
                          </span>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                     </Link>
                     <p className="text-center text-xs text-linear-text-muted flex items-center justify-center mt-3">
                        <Activity className="w-3.5 h-3.5 mr-1 text-emerald-400" /> {t('design_studio.export_desc')}
                     </p>
                  </div>

              </motion.div>
           )}

        </div>

        {/* ================================================== */}
        {/* COLUMN 3: THE AGENTS' BRAIN (Console Simulation) (3/12) */}
        {/* ================================================== */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6 relative">
           <div className="bento-card p-0 flex flex-col flex-1 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] relative overflow-hidden group">
              <div className="p-4 border-b border-linear-border flex justify-between items-center bg-linear-surface/80 backdrop-blur-md shrink-0">
                 <div className="flex items-center">
                   <TerminalSquare className="w-4 h-4 text-cyan-500 mr-2" />
                   <h4 className="font-bold text-sm text-foreground tracking-wide">{t('design_studio.agents_cortex')}</h4>
                 </div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" title={t('design_studio.system_online')}></div>
              </div>

              {/* Visual Nodes UI */}
              <div className="flex-1 bg-linear-surface/30 shadow-inner p-5 overflow-y-auto no-scrollbar flex flex-col gap-2 relative transition-colors duration-500">
                 
                 {/* Market Agent Node */}
                 <div className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-500 z-10 ${activeAgent === 'Market Agent' ? 'border-cyan-500/50 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-105' : 'border-linear-border bg-linear-surface/80'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors ${activeAgent === 'Market Agent' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-linear-surface text-linear-text-muted border border-linear-border'}`}>
                             <LineChart className="w-4 h-4" />
                          </div>
                          <span className={`font-bold text-sm tracking-wide ${activeAgent === 'Market Agent' ? 'text-cyan-700 dark:text-cyan-300' : 'text-foreground/80'}`}>Market Agent</span>
                       </div>
                       {activeAgent === 'Market Agent' && <span className="flex w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />}
                    </div>
                    <div className={`pl-11 text-[11px] font-mono line-clamp-1 h-4 ${activeAgent === 'Market Agent' ? 'text-cyan-600 dark:text-cyan-400' : 'text-linear-text-muted'}`}>
                       {agentLogs.filter(l => l.agent === 'Market Agent').pop()?.text || "Standby for DNA..."}
                    </div>
                 </div>

                 {/* Connector */}
                 <div className="w-0.5 h-6 mx-auto bg-linear-border relative overflow-hidden shrink-0 transition-colors">
                    {loading && <motion.div animate={{y: ["-100%", "200%"]}} transition={{repeat: Infinity, duration: 1.5}} className="w-full h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent absolute" />}
                 </div>

                 {/* Creative Agent Node */}
                 <div className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-500 z-10 ${activeAgent === 'Creative Agent' ? 'border-indigo-500/50 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-105' : 'border-linear-border bg-linear-surface/80'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors ${activeAgent === 'Creative Agent' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-linear-surface text-linear-text-muted border border-linear-border'}`}>
                             <Palette className="w-4 h-4" />
                          </div>
                          <span className={`font-bold text-sm tracking-wide ${activeAgent === 'Creative Agent' ? 'text-indigo-700 dark:text-indigo-300' : 'text-foreground/80'}`}>Creative Agent</span>
                       </div>
                       {activeAgent === 'Creative Agent' && <RefreshCw className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-spin" />}
                    </div>
                    <div className={`pl-11 text-[11px] font-mono line-clamp-1 h-4 ${activeAgent === 'Creative Agent' ? 'text-indigo-600 dark:text-indigo-400' : 'text-linear-text-muted'}`}>
                       {agentLogs.filter(l => l.agent === 'Creative Agent').pop()?.text || "Awaiting Blueprint..."}
                    </div>
                 </div>

                 {/* Connector */}
                 <div className="w-0.5 h-6 mx-auto bg-linear-border relative overflow-hidden shrink-0 transition-colors">
                    {loading && <motion.div animate={{y: ["-100%", "200%"]}} transition={{repeat: Infinity, duration: 1.5, delay: 0.5}} className="w-full h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent absolute" />}
                 </div>

                 {/* Copywriter Agent Node */}
                 <div className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-500 z-10 ${activeAgent === 'Copywriter Agent' ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-105' : 'border-linear-border bg-linear-surface/80'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors ${activeAgent === 'Copywriter Agent' ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-linear-surface text-linear-text-muted border border-linear-border'}`}>
                             <PenTool className="w-4 h-4" />
                          </div>
                          <span className={`font-bold text-sm tracking-wide ${activeAgent === 'Copywriter Agent' ? 'text-amber-700 dark:text-amber-300' : 'text-foreground/80'}`}>Copywriter Agent</span>
                       </div>
                       {activeAgent === 'Copywriter Agent' && <Type className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />}
                    </div>
                    <div className={`pl-11 text-[11px] font-mono line-clamp-1 h-4 ${activeAgent === 'Copywriter Agent' ? 'text-amber-600 dark:text-amber-400' : 'text-linear-text-muted'}`}>
                       {agentLogs.filter(l => l.agent === 'Copywriter Agent').pop()?.text || "Analyzing Tone..."}
                    </div>
                 </div>

                 {/* Tiny Terminal Footer for "Hacker feel" */}
                 <div className="mt-auto pt-4 border-t border-linear-border transition-colors">
                    <div className="text-[9px] text-linear-text-muted mb-1 flex items-center font-bold">
                       <TerminalSquare className="w-3 h-3 mr-1" /> {t('design_studio.raw_log')}
                    </div>
                    <div className="h-16 overflow-y-hidden flex flex-col justify-end text-[10px] font-mono text-foreground font-medium leading-tight">
                       {agentLogs.slice(-3).map(log => (
                          <div key={log.id} className="truncate">
                             <span className="opacity-50 text-emerald-600 dark:text-emerald-400">[{log.time}]</span> <span className={log.type === 'warn' ? 'text-amber-500 font-bold' : log.type === 'success' ? 'text-blue-600 dark:text-blue-400' : 'text-inherit'}>{log.text}</span>
                          </div>
                       ))}
                    </div>
                 </div>

              </div>
              
              {/* Neon Line decorative */}
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-border overflow-hidden">
                 <motion.div 
                   animate={{ x: ["-100%", "200%"] }}
                   transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                   className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                 />
              </div>
           </div>

           {/* Metrics mini box */}
           <div className="flex gap-4 h-24">
              <div className="flex-1 bento-card p-3 flex flex-col justify-center items-center relative overflow-hidden group">
                 <div className="text-[10px] text-linear-text-muted font-bold uppercase tracking-widest z-10">{t('design_studio.time_saved')}</div>
                 <div className="text-xl font-bold text-foreground mt-1 z-10">34 <span className="text-xs text-linear-text-muted font-medium ml-1">hrs</span></div>
                 <Hash className="absolute -bottom-4 -right-2 w-16 h-16 text-linear-surface/50 group-hover:text-linear-border transition-colors -rotate-12" />
              </div>
              <div className="flex-1 bento-card p-3 flex flex-col justify-center items-center relative overflow-hidden group">
                 <div className="text-[10px] text-linear-text-muted font-bold uppercase tracking-widest z-10">{t('design_studio.cost_roi')}</div>
                 <div className="text-xl font-bold text-emerald-400 mt-1 z-10">+480<span className="text-xs text-emerald-500 font-medium">%</span></div>
                 <Activity className="absolute -bottom-4 -right-2 w-16 h-16 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
