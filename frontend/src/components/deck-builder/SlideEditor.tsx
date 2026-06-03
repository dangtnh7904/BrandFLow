"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Download, FileText, Presentation,
  Loader2, Type, Palette, MousePointer2, ZoomIn, ZoomOut,
  LayoutTemplate, Sparkles, ExternalLink
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface SlideElement {
  type: string;
  content: string;
  style: {
    color: string;
    fontSize: number;
    fontWeight: string;
    textAlign: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface SlideData {
  slide_id: string;
  slide_number: number;
  layout: string;
  background: {
    type: string;
    color: string;
    dark_mode: boolean;
  };
  elements: SlideElement[];
}

interface SlideEditorProps {
  slides: SlideData[];
  onSlidesChange?: (slides: SlideData[]) => void;
  brandName?: string;
  templateType?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE RENDERER — renders a single slide as a beautiful card
   ═══════════════════════════════════════════════════════════════════════════ */

function SlideCanvas({ slide, scale = 1, isEditing = false, onElementClick }: {
  slide: SlideData;
  scale?: number;
  isEditing?: boolean;
  onElementClick?: (elementIndex: number) => void;
}) {
  const bg = slide.background;
  const bgStyle: React.CSSProperties = bg.type === 'gradient'
    ? { background: bg.color }
    : { backgroundColor: bg.color || '#FFFFFF' };

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        ...bgStyle,
        width: `${960 * scale}px`,
        height: `${540 * scale}px`,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {slide.elements.map((elem, idx) => {
        const s = elem.style;
        const posStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: `${s.w}%`,
          height: `${s.h}%`,
          color: s.color,
          fontSize: `${Math.max(8, s.fontSize * scale)}px`,
          fontWeight: s.fontWeight === 'bold' ? 700 : s.fontWeight === 'light' ? 300 : 400,
          textAlign: s.textAlign as any,
          lineHeight: 1.3,
          display: 'flex',
          alignItems: elem.type === 'heading' || elem.type === 'subheading' ? 'center' : 'flex-start',
          justifyContent: s.textAlign === 'center' ? 'center' : s.textAlign === 'right' ? 'flex-end' : 'flex-start',
          cursor: isEditing ? 'pointer' : 'default',
          transition: 'outline 0.15s ease',
          padding: `${2 * scale}px`,
        };

        // Element-specific rendering
        if (elem.type === 'divider') {
          return (
            <div
              key={idx}
              style={{
                ...posStyle,
                height: `${Math.max(2, 2 * scale)}px`,
                backgroundColor: s.color,
                alignItems: undefined,
                justifyContent: undefined,
              }}
            />
          );
        }

        if (elem.type === 'color_swatch') {
          const lines = elem.content.split('\n');
          return (
            <div
              key={idx}
              onClick={() => onElementClick?.(idx)}
              style={{
                ...posStyle,
                backgroundColor: s.color,
                borderRadius: `${8 * scale}px`,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: `${8 * scale}px`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
              className={isEditing ? 'hover:outline hover:outline-2 hover:outline-cyan-400 hover:outline-offset-2' : ''}
            >
              <span style={{ 
                color: '#FFFFFF', 
                fontSize: `${Math.max(8, 11 * scale)}px`, 
                fontWeight: 700,
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                textAlign: 'center',
              }}>
                {lines[0]}
              </span>
              {lines[1] && (
                <span style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: `${Math.max(7, 9 * scale)}px`,
                  fontFamily: 'monospace',
                  marginTop: `${2 * scale}px`,
                }}>
                  {lines[1]}
                </span>
              )}
            </div>
          );
        }

        if (elem.type === 'image_placeholder') {
          return (
            <div
              key={idx}
              onClick={() => onElementClick?.(idx)}
              style={{
                ...posStyle,
                backgroundColor: bg.dark_mode ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                borderRadius: `${12 * scale}px`,
                border: `${Math.max(1, 1.5 * scale)}px dashed ${bg.dark_mode ? 'rgba(255,255,255,0.15)' : '#CBD5E1'}`,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: `${4 * scale}px`,
              }}
              className={isEditing ? 'hover:outline hover:outline-2 hover:outline-cyan-400 hover:outline-offset-2' : ''}
            >
              <span style={{ fontSize: `${Math.max(16, 28 * scale)}px` }}>
                {elem.content.match(/^[\u{1F300}-\u{1FAF8}]/u)?.[0] || '🖼️'}
              </span>
              <span style={{ 
                color: bg.dark_mode ? 'rgba(255,255,255,0.5)' : '#64748B',
                fontSize: `${Math.max(7, 10 * scale)}px`, 
                fontWeight: 600,
              }}>
                {elem.content.replace(/^[\u{1F300}-\u{1FAF8}]\s*/u, '')}
              </span>
            </div>
          );
        }

        if (elem.type === 'badge') {
          return (
            <div
              key={idx}
              onClick={() => onElementClick?.(idx)}
              style={{
                ...posStyle,
                alignItems: 'center',
              }}
              className={isEditing ? 'hover:outline hover:outline-2 hover:outline-cyan-400 hover:outline-offset-2' : ''}
            >
              <span style={{
                letterSpacing: `${1.5 * scale}px`,
                textTransform: 'uppercase',
                fontSize: `${Math.max(7, s.fontSize * scale)}px`,
                fontWeight: 700,
                opacity: 0.9,
              }}>
                {elem.content}
              </span>
            </div>
          );
        }

        // Default text elements
        return (
          <div
            key={idx}
            onClick={() => onElementClick?.(idx)}
            style={{
              ...posStyle,
              letterSpacing: elem.type === 'heading' ? `-${0.5 * scale}px` : '0px',
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
            }}
            className={isEditing ? 'hover:outline hover:outline-2 hover:outline-cyan-400 hover:outline-offset-2' : ''}
          >
            <span>{elem.content}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SLIDE EDITOR COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SlideEditor({ slides, onSlidesChange, brandName = "Brand", templateType = "brand_guideline" }: SlideEditorProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const totalSlides = slides.length;
  const active = slides[currentSlide];

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide(Math.max(0, Math.min(idx, totalSlides - 1)));
    setSelectedElement(null);
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentSlide, goToSlide]);

  /* ─── Export: PDF ─── */
  const handleExportPDF = async () => {
    setIsExporting('pdf');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [960, 540] });
      
      for (let i = 0; i < totalSlides; i++) {
        setCurrentSlide(i);
        await new Promise(r => setTimeout(r, 300)); // Wait for render
        
        const el = canvasRef.current?.querySelector('.slide-main-canvas') as HTMLElement;
        if (!el) continue;
        
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, 960, 540);
      }
      
      pdf.save(`${brandName.replace(/\s+/g, '_')}_BrandDeck.pdf`);
    } catch (err: any) {
      console.error('PDF Export error:', err);
      alert('Lỗi xuất PDF: ' + err.message);
    } finally {
      setIsExporting(null);
    }
  };

  /* ─── Export: PPTX ─── */
  const handleExportPPTX = async () => {
    setIsExporting('pptx');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
      
      const res = await fetch(`${API_URL}/api/v1/design/export-pptx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ slides, brand_name: brandName }),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandName.replace(/\s+/g, '_')}_BrandDeck.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('PPTX Export error:', err);
      alert('Lỗi xuất PPTX: ' + err.message);
    } finally {
      setIsExporting(null);
    }
  };

  /* ─── Export: Canva deeplink ─── */
  const handleOpenCanva = () => {
    window.open(`https://www.canva.com/design/create?width=1920&height=1080&type=presentation`, '_blank');
  };

  if (!active) {
    return <div className="text-center text-linear-text-muted py-20">Không có slide nào.</div>;
  }

  const templateLabels: Record<string, string> = {
    brand_guideline: "Brand Guideline",
    pitch_deck: "Pitch Deck",
    proposal: "Marketing Proposal",
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ─── TOOLBAR ─── */}
      <div className="flex items-center justify-between px-2 py-2 bg-linear-surface/50 backdrop-blur-xl border border-linear-border/50 rounded-xl">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-foreground tracking-wide uppercase">
            {templateLabels[templateType] || templateType}
          </span>
          <span className="text-[10px] text-linear-text-muted bg-linear-surface px-2 py-0.5 rounded-full border border-linear-border">
            {totalSlides} slides
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom */}
          <div className="flex items-center gap-1 bg-linear-surface border border-linear-border rounded-lg px-1">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 text-linear-text-muted hover:text-foreground transition-colors">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 text-linear-text-muted hover:text-foreground transition-colors">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-px h-6 bg-linear-border/50" />

          {/* Export buttons */}
          <button
            onClick={handleExportPDF}
            disabled={!!isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all disabled:opacity-50"
          >
            {isExporting === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            PDF
          </button>
          <button
            onClick={handleExportPPTX}
            disabled={!!isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-all disabled:opacity-50"
          >
            {isExporting === 'pptx' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Presentation className="w-3.5 h-3.5" />}
            PPTX
          </button>
          <button
            onClick={handleOpenCanva}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Canva
          </button>
        </div>
      </div>

      {/* ─── MAIN AREA: Thumbnails + Canvas ─── */}
      <div className="flex flex-1 gap-4 min-h-0">

        {/* Slide Thumbnails */}
        <div className="w-[140px] shrink-0 flex flex-col gap-2 overflow-y-auto no-scrollbar pr-1">
          {slides.map((s, idx) => (
            <button
              key={s.slide_id}
              onClick={() => goToSlide(idx)}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                currentSlide === idx
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'border-linear-border/50 hover:border-linear-border opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-full aspect-[16/9] overflow-hidden">
                <SlideCanvas slide={s} scale={0.14} />
              </div>
              <div className={`absolute bottom-0 left-0 right-0 px-2 py-1 text-[9px] font-bold ${
                currentSlide === idx ? 'bg-cyan-500 text-white' : 'bg-black/60 text-white/80'
              }`}>
                {idx + 1}. {s.layout}
              </div>
            </button>
          ))}
        </div>

        {/* Main Canvas */}
        <div ref={canvasRef} className="flex-1 flex flex-col items-center justify-center overflow-auto no-scrollbar bg-[repeating-conic-gradient(rgba(0,0,0,0.03)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] rounded-xl border border-linear-border/30 p-4">
          
          <div className="slide-main-canvas rounded-lg overflow-hidden shadow-2xl" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
            <SlideCanvas 
              slide={active} 
              scale={1} 
              isEditing={true}
              onElementClick={(idx) => setSelectedElement(idx)}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => goToSlide(currentSlide - 1)}
              disabled={currentSlide === 0}
              className="p-2 rounded-full bg-linear-surface border border-linear-border hover:bg-background disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {currentSlide + 1} <span className="text-linear-text-muted font-normal">/ {totalSlides}</span>
            </span>
            <button
              onClick={() => goToSlide(currentSlide + 1)}
              disabled={currentSlide >= totalSlides - 1}
              className="p-2 rounded-full bg-linear-surface border border-linear-border hover:bg-background disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
