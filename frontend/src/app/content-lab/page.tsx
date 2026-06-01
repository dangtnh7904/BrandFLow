"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';
import { Loader2, Plus, PlaySquare, Globe, MessageSquare, PieChart, Send, Sparkles, BrainCircuit, Search, ChevronRight, Trash2, RefreshCw } from 'lucide-react';

export default function ContentLabPage() {
  const { t } = useLanguage();
  const { wizardAnswers, brandDNA, extractedAnswers } = useFormStore();
  
  const [urlInput, setUrlInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [sources, setSources] = useState<any[]>([]);
  const [selectedSourceIdx, setSelectedSourceIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'chat'>('report');

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsIngesting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
      const res = await fetch(`${API_URL}/api/content-lab/ingest`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ url: urlInput }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP Error ${res.status}`);
      }
      
      const data = await res.json();
      if (data.status === 'success') {
        const newSrc = data.data;
        setSources((prev) => {
          const next = [...prev, newSrc];
          setSelectedSourceIdx(next.length - 1);
          return next;
        });
        setUrlInput('');
      } else {
        alert("Lỗi: " + (data.detail || data.message));
      }
    } catch (err: any) {
      alert(`Lỗi Ingest: ${err.message || 'Lỗi kết nối Server'}`);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleAnalyzeVibe = async (targetIdx: number | null = selectedSourceIdx) => {
    const idx = targetIdx !== null ? targetIdx : (selectedSourceIdx !== null ? selectedSourceIdx : (sources.length > 0 ? 0 : null));
    if (idx === null || sources.length === 0) return;
    
    setIsAnalyzing(true);
    const targetSource = sources[idx];
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
      const res = await fetch(`${API_URL}/api/content-lab/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          scraped_data: targetSource,
          business_context: wizardAnswers,
          brand_dna: brandDNA,
          extracted_answers: extractedAnswers
        }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP Error ${res.status}`);
      }
      
      const data = await res.json();
      if (data.status === 'success') {
        setSources((prev) => {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            report: data.report
          };
          return next;
        });
      } else {
        alert("Lỗi: " + (data.detail || data.message));
      }
    } catch (err: any) {
      alert(`Lỗi Analyze: ${err.message || 'Lỗi kết nối Server'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteSource = (idxToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSources((prev) => {
      const next = prev.filter((_, idx) => idx !== idxToDelete);
      if (selectedSourceIdx === idxToDelete) {
        setSelectedSourceIdx(next.length > 0 ? Math.max(0, idxToDelete - 1) : null);
      } else if (selectedSourceIdx !== null && selectedSourceIdx > idxToDelete) {
        setSelectedSourceIdx(selectedSourceIdx - 1);
      }
      return next;
    });
  };

  const activeSource = selectedSourceIdx !== null && sources[selectedSourceIdx] ? sources[selectedSourceIdx] : null;
  const currentReport = activeSource ? activeSource.report : null;

  return (
    <div className="h-[calc(100vh-64px)] w-full flex p-2 md:p-6 gap-4 bg-transparent overflow-hidden">
      {/* LEFT PANE: Sources */}
      <div className="w-1/3 min-w-[320px] max-w-[400px] border border-linear-border/50 rounded-2xl bg-linear-surface/60 backdrop-blur-2xl flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50"></div>
        
        <div className="p-5 border-b border-linear-border/30 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-cyan-400" /> Content Sources
            </h2>
            <p className="text-xs text-linear-text-muted mt-1">Quản lý các tư liệu cần phân tích.</p>
          </div>
        </div>
        
        <div className="p-5 border-b border-linear-border/30 bg-black/5 dark:bg-white/5">
          <form onSubmit={handleIngest} className="flex flex-col gap-3">
            <input 
              type="url"
              placeholder="Paste Youtube or Website URL..."
              className="w-full px-4 py-2.5 text-sm bg-background/50 border border-linear-border/50 rounded-xl text-foreground placeholder:text-linear-text-muted focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-sm transition-all"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={isIngesting}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md shadow-cyan-500/20"
            >
              {isIngesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              {isIngesting ? "Đang xử lý dữ liệu..." : "Thêm Source"}
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {sources.length === 0 ? (
            <div className="text-center text-sm text-linear-text-muted mt-12 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-linear-surface border border-linear-border flex items-center justify-center mb-4 opacity-50">
                <Search className="w-6 h-6" />
              </div>
              <p>Chưa có dữ liệu.</p>
              <p className="text-xs mt-1">Dán URL vào ô trên để bắt đầu.</p>
            </div>
          ) : (
            sources.map((src, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedSourceIdx(idx)}
                className={`group p-3 border rounded-xl shadow-sm backdrop-blur-md transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  selectedSourceIdx === idx 
                    ? 'bg-background/90 border-cyan-500/50 shadow-cyan-500/5' 
                    : 'bg-background/40 hover:bg-background/80 border-linear-border/50 hover:border-cyan-500/30'
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 transition-opacity ${
                  selectedSourceIdx === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}></div>
                
                {/* Delete Button */}
                <button 
                  onClick={(e) => handleDeleteSource(idx, e)}
                  className="absolute right-2 top-2 p-1.5 rounded-lg text-linear-text-muted hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-20"
                  title="Xóa Source"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-start gap-3 pl-1">
                  {src.thumbnail_url && (
                    <img src={src.thumbnail_url} alt="thumbnail" className="w-16 h-16 object-cover rounded-lg shadow-sm border border-linear-border/30" />
                  )}
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-linear-text-muted mb-1 tracking-wider uppercase">
                      {src.platform === 'youtube' ? <PlaySquare className="w-3.5 h-3.5 text-red-500" /> : <Globe className="w-3.5 h-3.5 text-blue-500" />}
                      <span>{src.platform}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-cyan-400 transition-colors pr-6">{src.title || "Untitled Document"}</h4>
                    <p className="text-xs text-linear-text-muted line-clamp-1 mt-1">{src.description || src.content?.substring(0, 80) + "..."}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANE: Analysis / Chat */}
      <div className="flex-1 flex flex-col bg-linear-surface/60 backdrop-blur-2xl border border-linear-border/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
        
        {/* Animated Tabs */}
        <div className="flex border-b border-linear-border/30 px-6 pt-5 gap-8 bg-black/5 dark:bg-white/5">
          <button 
            className={`pb-4 px-2 text-sm font-bold tracking-wide flex items-center transition-all relative ${activeTab === 'report' ? 'text-cyan-400' : 'text-linear-text-muted hover:text-foreground'}`}
            onClick={() => setActiveTab('report')}
          >
            <PieChart className="w-4 h-4 mr-2" /> MARKETING REPORT
            {activeTab === 'report' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-t-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            )}
          </button>
          <button 
            className={`pb-4 px-2 text-sm font-bold tracking-wide flex items-center transition-all relative ${activeTab === 'chat' ? 'text-cyan-400' : 'text-linear-text-muted hover:text-foreground'}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> NOTEBOOK CHAT
            {activeTab === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-t-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar relative">
          {/* Subtle Background Elements in the Workspace */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          {sources.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-linear-text-muted relative z-10">
              <div className="w-24 h-24 mb-6 rounded-3xl bg-linear-surface border border-linear-border/50 flex items-center justify-center shadow-lg transform rotate-3">
                <BrainCircuit className="w-12 h-12 text-cyan-500/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Content Intelligence</h3>
              <p className="max-w-md text-center text-sm">Vui lòng nạp tối thiểu một Source ở cột bên trái để Hệ thống Agent bắt đầu đọc hiểu và bóc tách dữ liệu chiến lược.</p>
            </div>
          ) : activeTab === 'report' ? (
            <div className="max-w-5xl mx-auto w-full relative z-10">
              {!currentReport ? (
                <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-700">
                  <div className="w-20 h-20 mb-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Sparkles className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Dữ liệu đã sẵn sàng</h2>
                  <p className="text-linear-text-muted mb-8 text-center max-w-lg">
                    {activeSource ? `Sẵn sàng phân tích nguồn: "${activeSource.title}"` : "Hệ thống Multi-Agent đã sẵn sàng đọc hiểu và phân tích chiến lược."}
                  </p>
                  <button 
                    onClick={() => handleAnalyzeVibe(selectedSourceIdx)}
                    disabled={isAnalyzing}
                    className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Đang dùng AI phân tích Vibe...</>
                    ) : (
                      <>Khởi chạy Phân tích Chiến lược <ChevronRight className="w-5 h-5 ml-2" /></>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex justify-between items-center border-b border-linear-border/20 pb-4">
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">Báo cáo Phân tích Vibe Marketing</h1>
                      <p className="text-xs text-linear-text-muted flex items-center gap-1">
                        <span>Nguồn: </span>
                        <span className="font-semibold text-foreground/80 truncate max-w-md">"{activeSource?.title}"</span>
                      </p>
                    </div>
                    {/* Re-analyze Button */}
                    <button
                      onClick={() => handleAnalyzeVibe(selectedSourceIdx)}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all disabled:opacity-50 shadow-sm"
                      title="Phân tích lại nguồn này"
                    >
                      {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      Phân tích lại
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Vibe & Tone */}
                    <div className="group relative p-6 bg-background/50 backdrop-blur-xl border border-linear-border/60 rounded-2xl shadow-lg hover:border-cyan-500/30 hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><PieChart className="w-20 h-20" /></div>
                      <h3 className="text-xs uppercase tracking-widest text-linear-text-muted font-bold mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Vibe & Tone Định Vị
                      </h3>
                      {currentReport.vibe_summary ? (
                        <div className="relative z-10 flex-1 flex flex-col gap-3">
                          <p className="text-sm font-semibold text-cyan-400 leading-relaxed">"{currentReport.vibe_summary}"</p>
                          <div className="flex flex-wrap gap-2">
                            {currentReport.vibe_keywords?.map((kw: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 font-semibold uppercase tracking-wider">{kw}</span>
                            ))}
                          </div>
                          <div className="h-px w-full bg-linear-border/30 my-1"></div>
                          <p className="text-sm text-foreground/90 leading-relaxed">{currentReport.vibe_analysis}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed relative z-10">{currentReport.vibe_and_tone}</p>
                      )}
                    </div>
 
                    {/* Visuals */}
                    <div className="group relative p-6 bg-background/50 backdrop-blur-xl border border-linear-border/60 rounded-2xl shadow-lg hover:border-pink-500/30 hover:shadow-pink-500/5 transition-all duration-300 flex flex-col">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-20 h-20" /></div>
                      <h3 className="text-xs uppercase tracking-widest text-linear-text-muted font-bold mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-pink-500 mr-2 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span> Phân Tích Hình Ảnh (Visuals)
                      </h3>
                      {currentReport.visual_style ? (
                        <div className="relative z-10 flex-1 flex flex-col gap-3">
                          <p className="text-sm font-semibold text-pink-400 flex items-center"><Sparkles className="w-3.5 h-3.5 mr-1.5" /> Style: {currentReport.visual_style}</p>
                          <div className="flex flex-wrap gap-2">
                            {currentReport.visual_colors?.map((color: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 rounded-md bg-pink-500/10 border border-pink-500/30 text-[11px] text-pink-300 font-semibold uppercase tracking-wider">{color}</span>
                            ))}
                          </div>
                          <div className="h-px w-full bg-linear-border/30 my-1"></div>
                          <p className="text-sm text-foreground/90 leading-relaxed">{currentReport.visual_analysis}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed relative z-10">{currentReport.visual_analysis}</p>
                      )}
                    </div>
 
                    {/* Copywriting */}
                    <div className="group relative p-6 bg-background/50 backdrop-blur-xl border border-linear-border/60 rounded-2xl shadow-lg hover:border-orange-500/30 hover:shadow-orange-500/5 transition-all duration-300 flex flex-col">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><MessageSquare className="w-20 h-20" /></div>
                      <h3 className="text-xs uppercase tracking-widest text-linear-text-muted font-bold mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-orange-400 mr-2 shadow-[0_0_8px_rgba(251,146,60,0.8)]"></span> Kỹ Thuật Copywriting & Hooks
                      </h3>
                      <div className="relative z-10 flex-1">
                        {Array.isArray(currentReport.copywriting_hooks) ? (
                          <ul className="space-y-3">
                            {currentReport.copywriting_hooks.map((hook: string, i: number) => (
                              <li key={i} className="flex items-start text-sm text-foreground/90 bg-linear-surface/40 p-2.5 rounded-lg border border-linear-border/30"><span className="text-orange-400 mr-2.5 mt-0.5">✦</span> <span className="leading-relaxed">{hook}</span></li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-foreground leading-relaxed">{currentReport.copywriting_hooks}</p>
                        )}
                      </div>
                    </div>
 
                    {/* Audience */}
                    <div className="group relative p-6 bg-background/50 backdrop-blur-xl border border-linear-border/60 rounded-2xl shadow-lg hover:border-blue-500/30 hover:shadow-blue-500/5 transition-all duration-300 flex flex-col">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Globe className="w-20 h-20" /></div>
                      <h3 className="text-xs uppercase tracking-widest text-linear-text-muted font-bold mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> Chân Dung Khách Hàng
                      </h3>
                      <div className="relative z-10 flex-1">
                        {Array.isArray(currentReport.target_audience) ? (
                          <ul className="space-y-3">
                            {currentReport.target_audience.map((aud: string, i: number) => (
                              <li key={i} className="flex items-center text-sm text-foreground/90 bg-linear-surface/40 p-2.5 rounded-lg border border-linear-border/30"><span className="text-blue-400 mr-2.5">👤</span> <span className="leading-relaxed font-medium">{aud}</span></li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-foreground leading-relaxed">{currentReport.target_audience}</p>
                        )}
                      </div>
                    </div>
                  </div>
 
                  <div className="relative p-8 bg-gradient-to-br from-linear-surface to-background border border-linear-border/60 rounded-2xl shadow-xl mt-8 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] group-hover:bg-cyan-500/10 transition-colors"></div>
                    <h3 className="text-sm uppercase tracking-widest text-cyan-400 font-bold mb-6 flex items-center relative z-10">
                       <BrainCircuit className="w-5 h-5 mr-2" /> Bài Học & Đề Xuất Thực Thi (Learning Actions)
                    </h3>
                    <ul className="space-y-4 relative z-10">
                      {(currentReport.learning_actions || currentReport.actionable_marketing_ideas || []).map((idea: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-foreground/90 group/item bg-background/40 p-4 rounded-xl border border-linear-border/40 hover:border-cyan-500/30 transition-colors shadow-sm">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mr-4 text-cyan-400 font-bold group-hover/item:bg-cyan-500 group-hover/item:text-white group-hover/item:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all">{i+1}</span>
                          <span className="mt-1.5 leading-relaxed">{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            }
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between max-w-4xl mx-auto w-full relative z-10">
              <div className="flex-1 overflow-y-auto p-4 mb-20 space-y-6">
                <div className="flex justify-center mb-8">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium px-4 py-1.5 rounded-full backdrop-blur-sm">
                    Phiên trò chuyện đã được kết nối với Dữ liệu Source
                  </div>
                </div>
                
                {/* AI Chat Bubble */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-background/80 backdrop-blur-md border border-linear-border/50 rounded-2xl rounded-tl-none p-5 max-w-[85%] shadow-sm">
                    <p className="text-sm text-foreground leading-relaxed">Xin chào! Tôi đã đọc xong nội dung từ các Source. Bạn có muốn đào sâu thêm về kỹ thuật kể chuyện (storytelling) hay cách thức triển khai kịch bản tương tự cho sản phẩm của bạn không?</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                <div className="max-w-3xl mx-auto mb-3 flex flex-wrap gap-2 justify-center">
                   <button 
                     onClick={() => setChatInput(`Hãy viết lại nội dung bài này theo phong cách ${brandDNA?.tone_of_voice || 'chuyên nghiệp'} của thương hiệu ${wizardAnswers?.company_name || 'chúng tôi'}.`)}
                     className="text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-colors"
                   >
                     ✨ Viết lại theo Brand DNA
                   </button>
                   <button 
                     onClick={() => setChatInput(`Trích xuất 3 ý tưởng nội dung từ đây phù hợp với USP: ${brandDNA?.core_usps?.join(', ') || wizardAnswers?.core_usps?.join(', ') || 'sản phẩm chất lượng'}.`)}
                     className="text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-colors"
                   >
                     💡 Ý tưởng phù hợp USP
                   </button>
                   <button 
                     onClick={() => setChatInput(`Đánh giá xem bài này có phù hợp với tệp khách hàng: ${wizardAnswers?.target_audience || 'khách hàng mục tiêu'} hay không?`)}
                     className="text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                   >
                     🎯 Kiểm tra khớp Target Audience
                   </button>
                </div>
                
                <div className="relative max-w-3xl mx-auto shadow-2xl">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Hỏi AI về chiến thuật của nội dung này..." 
                    className="w-full bg-linear-surface/80 backdrop-blur-xl border border-linear-border/80 rounded-full py-4 pl-6 pr-16 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-linear-text-muted"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
