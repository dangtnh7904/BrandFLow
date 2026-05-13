"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, TerminalSquare, AlertCircle, RefreshCw, 
  ImageIcon, Briefcase, Download, 
  Activity, Type, Network, Settings,
  LineChart, PenTool, Send, MousePointer2, CheckCircle2, FileText
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function DesignStudioPage() {
  const { t } = useLanguage();
  const [promptData, setPromptData] = useState({
    userPrompt: '',
    creativeMode: 'balanced'
  });

  const masterDNA = {
    brand_name: "TechNova",
    goal: "Launch a new automated retail store",
    industry: "Tech B2B",
    core_usps: ["Đổi trả AI tự động", "Cửa hàng không người bán"],
    target_audience: "Gen Z (18-24), yêu thích công nghệ.",
    tone_of_voice: "Nhanh nhẹn, Đột phá."
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // Old DALL-E Results
  const [blocks, setBlocks] = useState<any[]>([]); // New Behance Layout Blocks
  const [error, setError] = useState<string | null>(null);

  const [agentLogs, setAgentLogs] = useState<{id: number, time: string, agent: string, text: string, type: 'info' | 'success' | 'warn'}[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'visuals' | 'case-study'>('visuals');

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
      setBlocks([]);
      setAgentLogs([]);

      setActiveAgent('System');
      addLog("System", "Initiating Design Network...", "info");
      await sleep(800);
      
      const payload = {
        brand_name: masterDNA.brand_name,
        goal: masterDNA.goal,
        industry: masterDNA.industry,
        core_usps: masterDNA.core_usps,
        target_audience_insights: [masterDNA.target_audience],
        target_audience: masterDNA.target_audience,
        tone_of_voice: masterDNA.tone_of_voice,
        strict_rules: [],
        custom_prompt: promptData.userPrompt || ""
      };

      setActiveAgent('Creative Agent');
      addLog("Creative Agent", "Đang xử lý song song DALL-E Visuals & Behance Layout...", "info");

      // Chạy song song 2 luồng: Generate Assets (Old) và Generate Case Study (New)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const [assetsRes, caseStudyRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/design/generate-assets`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        }).then(res => res.json()),
        fetch(`${API_URL}/api/v1/design/generate-case-study`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        }).then(res => res.json())
      ]);

      if (assetsRes.status === "error") throw new Error("Lỗi sinh Visual Assets: " + assetsRes.message);
      if (caseStudyRes.status === "error") throw new Error("Lỗi sinh Case Study: " + caseStudyRes.message);

      setActiveAgent('System');
      addLog("System", "Render thành công 2 luồng.", "success");
      setActiveAgent('Done');
      
      setResult(assetsRes.data);
      setBlocks(caseStudyRes.data.blocks);
    } catch (err: any) {
      setError(err.message || "Failed to generate");
      addLog("System", `Lỗi: ${err.message}`, "warn");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('behance-export-canvas');
      if (!element) return;
      
      addLog("System", "Đang kết xuất PDF độ phân giải cao...", "warn");
      
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, { 
         scale: 2, // Retina quality
         useCORS: true,
         backgroundColor: "#f8fafc" // slate-50
      });
      const imgData = canvas.toDataURL('image/png');
      
      // Xuất dưới dạng 1 trang cuộn dài đặc trưng của Behance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`BrandBook_${masterDNA.brand_name.replace(/\s+/g, '_')}.pdf`);
      
      addLog("System", "Xuất PDF thành công!", "success");
    } catch (err: any) {
      addLog("System", `Lỗi xuất PDF: ${err.message}`, "warn");
    }
  };

  // ---- BLOCK RENDERING LOGIC (SEAMLESS BEHANCE STYLE) ----
  const renderBlock = (block: any) => {
    const { type, props } = block;

    if (type === 'HeroBlock' || type === 'GridHeroBlock') {
      return (
        <div className="w-full min-h-[600px] flex flex-col items-center justify-center relative p-16 overflow-hidden" style={{ backgroundColor: props.background_color || props.primary_color || '#0f172a' }}>
          {props.image_url && <img src={props.image_url} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0"></div>
          <h1 className="text-6xl md:text-8xl font-black text-white text-center z-10 tracking-tighter uppercase drop-shadow-2xl">{props.title}</h1>
          <p className="text-xl md:text-3xl text-white/90 mt-6 text-center max-w-3xl z-10 font-light tracking-wide">{props.subtitle}</p>
        </div>
      );
    }

    if (type === 'MissionBlock' || type === 'DNAFeaturesBlock') {
      return (
        <div className="py-24 px-12 bg-white text-slate-900 flex flex-col items-center">
           <div className="max-w-4xl w-full">
             <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight" style={{ color: props.accent_color || '#0f172a' }}>{props.headline || "Core Features"}</h2>
             {props.body_text && <p className="text-slate-600 text-xl md:text-2xl leading-relaxed font-light mb-12 border-l-4 pl-6" style={{ borderColor: props.accent_color || '#cbd5e1' }}>{props.body_text}</p>}
             {props.features && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mt-8">
                 {props.features.map((f: any, i: number) => (
                   <div key={i} className="flex flex-col group">
                     <div className="w-12 h-1 mb-6 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: props.accent_color || '#0f172a' }}></div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">{f.title}</h3>
                     <p className="text-lg text-slate-500 leading-relaxed">{f.desc}</p>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      );
    }

    if (type === 'PaletteBlock') {
      return (
        <div className="py-24 px-12 bg-slate-50 flex flex-col items-center">
          <div className="max-w-4xl w-full">
             <div className="flex items-center gap-4 mb-12">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Color Palette</h2>
               <div className="flex-1 h-px bg-slate-300"></div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-0 shadow-2xl rounded-2xl overflow-hidden">
                {props.colors && props.colors.map((color: string, i: number) => (
                   <div 
                     key={i} 
                     className="aspect-[3/4] relative group cursor-pointer flex flex-col justify-end p-6 transition-transform hover:-translate-y-2 hover:z-10" 
                     style={{backgroundColor: color}}
                     onClick={() => copyToClipboard(color)}
                   >
                      <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 text-center">
                        <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">{copiedColor === color ? 'COPIED' : color}</span>
                      </div>
                   </div>
                ))}
             </div>
             <p className="text-lg text-slate-500 mt-10 max-w-2xl font-light">{props.description}</p>
          </div>
        </div>
      );
    }

    if (type === 'TypographyBlock') {
      return (
        <div className="py-24 px-12 bg-white text-slate-900 flex flex-col items-center">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-16">
             <div className="flex flex-col justify-center">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase mb-8">Typography</h2>
               <p className="text-lg text-slate-500 leading-relaxed font-light mb-8">{props.rationale}</p>
             </div>
             <div className="space-y-12">
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-4 font-bold">Primary Font</div>
                  <div className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter truncate">{props.heading_font || "Inter"}</div>
                  <div className="text-3xl text-slate-300 font-black mt-2">Aa Bb Cc</div>
                </div>
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-4 font-bold">Secondary Font</div>
                  <div className="text-4xl text-slate-700 font-medium truncate">{props.body_font || "Roboto"}</div>
                  <div className="text-2xl text-slate-400 font-medium mt-2">Aa Bb Cc</div>
                </div>
             </div>
          </div>
        </div>
      );
    }

    if (type === 'GalleryBlock' || type === 'AppMockupBlock') {
      return (
        <div className="w-full aspect-video bg-slate-900 relative flex flex-col items-center justify-center overflow-hidden">
           {props.screen_url || (props.images && props.images[0]?.url) ? (
             <img src={props.screen_url || props.images[0].url} className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105" />
           ) : (
             <div className="text-center p-12 max-w-lg">
                <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                <div className="text-slate-400 font-mono text-lg mb-2">{props.app_name || "Visual Asset Layout"}</div>
                <div className="text-slate-500 text-sm">{props.screen_prompt || (props.images && props.images[0]?.prompt)}</div>
             </div>
           )}
        </div>
      );
    }

    return <div className="py-12 bg-red-50 text-red-500 text-center font-mono text-sm border-y border-red-200">System Error: Unmapped Block Type ({type})</div>;
  };

  return (
    <div className="w-full h-[100vh] flex flex-col overflow-hidden relative z-10 py-6 px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 text-foreground">
          <div className="w-12 h-12 bg-linear-surface/30 backdrop-blur-md rounded-2xl flex items-center justify-center border ultra-thin-border shadow-inner">
            <Palette className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Design Studio</h1>
            <p className="text-linear-text-muted mt-1 text-sm font-medium">Visual Identity & Case Study Generator</p>
          </div>
        </div>
        
        {/* TABS HEADER (Luôn hiển thị) */}
        <div className="flex bg-linear-surface border border-linear-border rounded-lg p-1">
           <button onClick={() => setActiveTab('visuals')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'visuals' ? 'bg-cyan-500 text-white shadow-md' : 'text-linear-text-muted hover:text-foreground'}`}>Visual Assets (DALL-E)</button>
           <button onClick={() => setActiveTab('case-study')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'case-study' ? 'bg-cyan-500 text-white shadow-md' : 'text-linear-text-muted hover:text-foreground'}`}>Behance Case Study</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pb-2">
        
        {/* ================= COLUMN 1: THE INPUT ================= */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6">
          <motion.div className="bento-card p-5 relative overflow-hidden flex flex-col shrink-0">
            <div className="flex items-center mb-5 pb-3 border-b border-linear-border/50">
              <Network className="w-4 h-4 mr-2 text-indigo-400" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">DNA Sync</h2>
              <div className="ml-auto flex items-center">
                <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-2"></span>
                <span className="text-[10px] text-indigo-400 font-mono">LIVE</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1">Industry</div>
                <div className="text-sm font-medium text-foreground">{masterDNA.industry}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1">Goal</div>
                <div className="text-xs text-foreground bg-linear-surface p-2 rounded border border-linear-border/50">{masterDNA.goal}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-cyan-400 uppercase mb-1">Custom Prompt (Yêu cầu riêng)</div>
                <textarea 
                  className="w-full bg-linear-surface/50 p-3 rounded-lg border border-cyan-500/30 text-sm text-foreground focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none h-24 placeholder-slate-500 shadow-inner"
                  placeholder="Ví dụ: Thiết kế mang hơi hướng công nghệ tương lai, dùng tone màu Dark Green..."
                  value={promptData.userPrompt}
                  onChange={(e) => setPromptData({...promptData, userPrompt: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 w-full py-3.5 rounded-xl flex items-center justify-center font-bold text-white transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Palette className="w-4 h-4 mr-2" />} 
              Auto-Generate Full Suite
            </button>
            
            <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 text-red-400 p-3 rounded-lg flex items-start text-xs shadow-sm mt-4"
                  >
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ================= COLUMN 2: CANVAS (Old DALL-E or New Behance) ================= */}
        <div className="lg:col-span-6 flex flex-col overflow-y-auto no-scrollbar pb-6 relative rounded-xl border-x border-linear-border/30 px-2 select-none">
           {!loading && !result && blocks.length === 0 && (
              <div className="w-full h-full p-10 flex flex-col items-center justify-center min-h-[500px]">
                 <ImageIcon className="w-12 h-12 text-linear-text-muted opacity-50 mb-4" />
                 <h3 className="text-xl font-bold text-foreground mb-2">
                    {activeTab === 'visuals' ? 'Visual Assets Canvas' : 'Behance Case Study Canvas'}
                 </h3>
                 <p className="text-sm text-linear-text-muted text-center max-w-sm">
                    {activeTab === 'visuals' 
                       ? 'Nhấn nút "Auto-Generate Full Suite" ở cột trái để AI DALL-E vẽ Logo và các ấn phẩm nhận diện.' 
                       : 'Nhấn nút "Auto-Generate Full Suite" ở cột trái để hệ thống AI lên khung layout phong cách Behance chuẩn quốc tế.'}
                 </p>
              </div>
           )}

           {loading && (
              <div className="w-full h-full p-10 flex flex-col items-center justify-center min-h-[500px]">
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                    <RefreshCw className="w-8 h-8 text-cyan-400" />
                 </motion.div>
                 <h3 className="text-lg font-bold text-cyan-400 mt-4 animate-pulse">Rendering DALL-E & Behance Layout...</h3>
              </div>
           )}

           {/* TAB: VISUALS (OLD) */}
           {!loading && result && activeTab === 'visuals' && (
              <div className="flex flex-col gap-6">
                  {/* Master Logo Box */}
                  <div className="bento-card p-0 overflow-hidden relative border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                     <div className="p-4 border-b border-linear-border flex justify-between items-center bg-linear-surface/50">
                        <div className="flex items-center font-bold text-sm text-foreground">
                          <Briefcase className="w-4 h-4 text-cyan-500 mr-2" /> Master Brand Logo
                        </div>
                        <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Vectorized
                        </span>
                     </div>
                     <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 relative">
                        <img src={result.logo_url} alt="Logo" className="w-[60%] h-[60%] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-500" />
                     </div>
                  </div>

                  {/* Fanpage Avatar & Banner Mockup */}
                  <div className="bento-card p-0 overflow-hidden relative">
                     <div className="p-4 border-b border-linear-border flex justify-between items-center bg-linear-surface/50">
                        <div className="flex items-center font-bold text-sm text-foreground">
                          <ImageIcon className="w-4 h-4 text-cyan-500 mr-2" /> Fanpage Mockup
                        </div>
                     </div>
                     <div className="aspect-[21/9] bg-slate-100 dark:bg-slate-900 relative">
                        <img src={result.banner_url} alt="Cover" className="absolute inset-0 w-full h-[60%] object-cover opacity-60 dark:opacity-40" />
                        <div className="absolute left-6 bottom-4 flex items-end">
                           <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-background overflow-hidden relative shadow-lg z-10">
                              <img src={result.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                           </div>
                           <div className="ml-4 mb-2 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-linear-border">
                              <div className="text-sm font-bold text-foreground">{masterDNA.brand_name}</div>
                              <div className="text-[10px] text-linear-text-muted">{masterDNA.industry || 'Category'}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Brand Guidelines (Text) */}
                  {result.guidelines && (
                     <div className="bento-card p-6 relative overflow-hidden group">
                        <div className="flex items-center font-bold text-sm text-foreground mb-4 border-b border-linear-border/50 pb-3">
                           <Type className="w-4 h-4 text-cyan-500 mr-2" /> Brand Identity Guidelines
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                           <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                              {result.guidelines}
                           </pre>
                        </div>
                     </div>
                  )}
              </div>
           )}

           {/* TAB: CASE STUDY (NEW) */}
           {!loading && blocks.length > 0 && activeTab === 'case-study' && (
              <div className="flex flex-col gap-6 w-full">
                  
                  {/* SEAMLESS BEHANCE CANVAS WRAPPER */}
                  <div id="behance-export-canvas" className="w-full bg-slate-50 shadow-2xl flex flex-col overflow-hidden max-w-[1400px] mx-auto rounded-none relative">
                    {blocks.map((block) => (
                         <div key={block.id} className="relative transition-all duration-300 w-full group">
                            {/* Hover Outline specifically for HITL inside the canvas */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/30 z-50 pointer-events-none transition-colors"></div>
                            {renderBlock(block)}
                         </div>
                    ))}
                  </div>
                  
                  <div className="pt-10 pb-20 flex justify-center border-t border-linear-border/30 mt-4">
                     <button onClick={handleExportPDF} className="flex items-center px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all font-bold text-sm">
                        <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                        Download High-Res PDF (Client Ready)
                     </button>
                  </div>
              </div>
           )}

        </div>

        {/* ================= COLUMN 3: AGENT LOGS ================= */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6 relative pointer-events-none">
           <div className="bento-card p-0 flex flex-col flex-1 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] relative overflow-hidden group">
              <div className="p-4 border-b border-linear-border flex justify-between items-center bg-linear-surface/80 backdrop-blur-md shrink-0">
                 <div className="flex items-center">
                   <TerminalSquare className="w-4 h-4 text-cyan-500 mr-2" />
                   <h4 className="font-bold text-sm text-foreground tracking-wide">Multimodal Refiner</h4>
                 </div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
              </div>

              <div className="flex-1 bg-linear-surface/30 p-5 overflow-y-auto no-scrollbar flex flex-col gap-3 relative">
                 <div className="h-full overflow-y-auto flex flex-col justify-end text-xs font-mono text-foreground font-medium leading-relaxed gap-2 pb-2">
                    {agentLogs.map(log => (
                       <div key={log.id} className={`p-2 rounded bg-background/50 border ${log.type === 'warn' ? 'border-amber-500/30 text-amber-400' : log.type === 'success' ? 'border-cyan-500/30 text-cyan-400' : 'border-linear-border text-linear-text-muted'}`}>
                          <div className="opacity-50 text-[9px] mb-1">[{log.time}] {log.agent}</div> 
                          <div>{log.text}</div>
                       </div>
                    ))}
                    <div ref={logsEndRef} />
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
