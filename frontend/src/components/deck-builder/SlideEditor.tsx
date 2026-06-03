"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, FileText, Presentation,
  Loader2, Type, Palette as PaletteIcon, ZoomIn, ZoomOut,
  LayoutTemplate, ExternalLink, AlignLeft, AlignCenter, AlignRight,
  Bold, Minus, Plus, Trash2, Copy, RotateCcw, Move, PenLine,
  Pipette, Image as ImageIcon
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
   GOOGLE FONTS PRESETS
   ═══════════════════════════════════════════════════════════════════════════ */

const FONT_OPTIONS = [
  "Inter", "Montserrat", "Playfair Display", "Poppins", "Roboto", 
  "Lora", "Raleway", "Open Sans", "Oswald", "Merriweather",
  "Nunito", "DM Sans", "Space Grotesk", "Outfit", "Sora"
];

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE CANVAS — Renders a single slide with optional editing
   ═══════════════════════════════════════════════════════════════════════════ */

function SlideCanvas({ slide, scale = 1, isEditing = false, selectedIdx, editingIdx, onElementClick, onElementDoubleClick, onContentChange, onDragStart }: {
  slide: SlideData;
  scale?: number;
  isEditing?: boolean;
  selectedIdx?: number | null;
  editingIdx?: number | null;
  onElementClick?: (idx: number, e: React.MouseEvent) => void;
  onElementDoubleClick?: (idx: number) => void;
  onContentChange?: (idx: number, content: string) => void;
  onDragStart?: (idx: number, e: React.MouseEvent) => void;
}) {
  const bg = slide.background;
  const bgStyle: React.CSSProperties = bg.type === 'gradient'
    ? { background: bg.color }
    : { backgroundColor: bg.color || '#FFFFFF' };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        ...bgStyle,
        width: `${960 * scale}px`,
        height: `${540 * scale}px`,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onElementClick) {
          // Click on canvas background = deselect
          onElementClick(-1, e);
        }
      }}
    >
      {slide.elements.map((elem, idx) => {
        const s = elem.style;
        const isSelected = selectedIdx === idx;
        const isInlineEditing = editingIdx === idx;

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
          cursor: isEditing ? (isInlineEditing ? 'text' : 'pointer') : 'default',
          padding: `${2 * scale}px`,
          outline: isSelected ? '2px solid #06B6D4' : 'none',
          outlineOffset: isSelected ? '2px' : '0',
          zIndex: isSelected ? 50 : 'auto',
          boxShadow: isSelected ? '0 0 0 1px rgba(6,182,212,0.3), 0 4px 12px rgba(6,182,212,0.15)' : 'none',
        };

        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          onElementClick?.(idx, e);
        };
        const handleDblClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          onElementDoubleClick?.(idx);
        };
        const handleMouseDown = (e: React.MouseEvent) => {
          if (isSelected && !isInlineEditing && scale === 1) {
            onDragStart?.(idx, e);
          }
        };

        // ── Divider ──
        if (elem.type === 'divider') {
          return (
            <div
              key={idx} onClick={handleClick}
              style={{ ...posStyle, height: `${Math.max(2, 2 * scale)}px`, backgroundColor: s.color, alignItems: undefined, justifyContent: undefined }}
            />
          );
        }

        // ── Color Swatch ──
        if (elem.type === 'color_swatch') {
          const lines = elem.content.split('\n');
          return (
            <div key={idx} onClick={handleClick} onDoubleClick={handleDblClick} onMouseDown={handleMouseDown}
              style={{ ...posStyle, backgroundColor: s.color, borderRadius: `${8 * scale}px`, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: `${8 * scale}px`, boxShadow: isSelected ? posStyle.boxShadow : '0 4px 20px rgba(0,0,0,0.15)' }}
              className={isEditing && !isSelected ? 'hover:outline hover:outline-2 hover:outline-cyan-400/50 hover:outline-offset-1' : ''}
            >
              <span style={{ color: '#FFF', fontSize: `${Math.max(8, 11 * scale)}px`, fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)', textAlign: 'center' }}>{lines[0]}</span>
              {lines[1] && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: `${Math.max(7, 9 * scale)}px`, fontFamily: 'monospace', marginTop: `${2 * scale}px` }}>{lines[1]}</span>}
            </div>
          );
        }

        // ── Image Placeholder ──
        if (elem.type === 'image_placeholder') {
          return (
            <div key={idx} onClick={handleClick} onMouseDown={handleMouseDown}
              style={{ ...posStyle, backgroundColor: bg.dark_mode ? 'rgba(255,255,255,0.08)' : '#F1F5F9', borderRadius: `${12 * scale}px`, border: `${Math.max(1, 1.5 * scale)}px dashed ${bg.dark_mode ? 'rgba(255,255,255,0.15)' : '#CBD5E1'}`, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: `${4 * scale}px` }}
              className={isEditing && !isSelected ? 'hover:outline hover:outline-2 hover:outline-cyan-400/50 hover:outline-offset-1' : ''}
            >
              <span style={{ fontSize: `${Math.max(16, 28 * scale)}px` }}>{elem.content.match(/^[\u{1F300}-\u{1FAF8}]/u)?.[0] || '🖼️'}</span>
              <span style={{ color: bg.dark_mode ? 'rgba(255,255,255,0.5)' : '#64748B', fontSize: `${Math.max(7, 10 * scale)}px`, fontWeight: 600 }}>{elem.content.replace(/^[\u{1F300}-\u{1FAF8}]\s*/u, '')}</span>
            </div>
          );
        }

        // ── Badge ──
        if (elem.type === 'badge') {
          return (
            <div key={idx} onClick={handleClick} onDoubleClick={handleDblClick} onMouseDown={handleMouseDown}
              style={{ ...posStyle, alignItems: 'center' }}
              className={isEditing && !isSelected ? 'hover:outline hover:outline-2 hover:outline-cyan-400/50 hover:outline-offset-1' : ''}
            >
              {isInlineEditing ? (
                <span contentEditable suppressContentEditableWarning
                  style={{ letterSpacing: `${1.5 * scale}px`, textTransform: 'uppercase', fontSize: `${Math.max(7, s.fontSize * scale)}px`, fontWeight: 700, outline: 'none', minWidth: '20px', display: 'inline-block' }}
                  onBlur={(e) => onContentChange?.(idx, e.currentTarget.textContent || '')}
                >{elem.content}</span>
              ) : (
                <span style={{ letterSpacing: `${1.5 * scale}px`, textTransform: 'uppercase', fontSize: `${Math.max(7, s.fontSize * scale)}px`, fontWeight: 700, opacity: 0.9 }}>{elem.content}</span>
              )}
            </div>
          );
        }

        // ── Default Text Elements ──
        return (
          <div key={idx} onClick={handleClick} onDoubleClick={handleDblClick} onMouseDown={handleMouseDown}
            style={{ ...posStyle, letterSpacing: elem.type === 'heading' ? `-${0.5 * scale}px` : '0px', whiteSpace: 'pre-wrap', overflow: 'hidden' }}
            className={isEditing && !isSelected ? 'hover:outline hover:outline-2 hover:outline-cyan-400/50 hover:outline-offset-1' : ''}
          >
            {isInlineEditing ? (
              <span contentEditable suppressContentEditableWarning
                style={{ outline: 'none', minWidth: '20px', display: 'inline-block', width: '100%' }}
                onBlur={(e) => onContentChange?.(idx, e.currentTarget.textContent || '')}
              >{elem.content}</span>
            ) : (
              <span>{elem.content}</span>
            )}
          </div>
        );
      })}

      {/* Selection resize handles (visual only for now) */}
      {isSelected && selectedIdx != null && selectedIdx >= 0 && scale === 1 && (() => {
        const sel = slide.elements[selectedIdx];
        if (!sel) return null;
        const s = sel.style;
        const handles = [
          { x: s.x, y: s.y, cursor: 'nw-resize' },
          { x: s.x + s.w, y: s.y, cursor: 'ne-resize' },
          { x: s.x, y: s.y + s.h, cursor: 'sw-resize' },
          { x: s.x + s.w, y: s.y + s.h, cursor: 'se-resize' },
        ];
        return handles.map((h, i) => (
          <div key={`handle-${i}`} style={{
            position: 'absolute', left: `calc(${h.x}% - 4px)`, top: `calc(${h.y}% - 4px)`,
            width: '8px', height: '8px', backgroundColor: '#06B6D4', border: '1.5px solid white',
            borderRadius: '2px', cursor: h.cursor, zIndex: 60, boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }} />
        ));
      })()}
    </div>
  );
}

const isSelected = false; // hoisted for JSX guard above

/* ═══════════════════════════════════════════════════════════════════════════
   PROPERTIES PANEL — Right sidebar for selected element
   ═══════════════════════════════════════════════════════════════════════════ */

function PropertiesPanel({ element, slideBackground, onUpdate, onSlideBackgroundChange, onDelete, onDuplicate }: {
  element: SlideElement | null;
  slideBackground: SlideData['background'];
  onUpdate: (patch: Partial<SlideElement['style']>) => void;
  onSlideBackgroundChange: (color: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  if (!element) {
    // Slide-level properties
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="text-[10px] font-bold text-linear-text-muted uppercase tracking-widest">Slide Background</div>
        <div className="flex items-center gap-2">
          <label className="relative w-10 h-10 rounded-lg border-2 border-linear-border cursor-pointer overflow-hidden group">
            <div className="w-full h-full" style={{ backgroundColor: slideBackground.color.startsWith('linear') ? '#0F172A' : slideBackground.color }} />
            <input type="color" className="absolute inset-0 opacity-0 cursor-pointer"
              value={slideBackground.color.startsWith('linear') ? '#0F172A' : slideBackground.color}
              onChange={(e) => onSlideBackgroundChange(e.target.value)}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
              <Pipette className="w-4 h-4 text-white" />
            </div>
          </label>
          <span className="text-xs text-linear-text-muted font-mono">{slideBackground.color.startsWith('linear') ? 'gradient' : slideBackground.color}</span>
        </div>
        <div className="text-[10px] text-linear-text-muted mt-4">Click vào element trên slide để chỉnh sửa.<br/>Double-click để sửa text.</div>
      </div>
    );
  }

  const s = element.style;

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto no-scrollbar">
      {/* Element type badge */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded">{element.type}</span>
        <div className="flex gap-1">
          <button onClick={onDuplicate} className="p-1.5 text-linear-text-muted hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-colors" title="Nhân bản">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 text-linear-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Xóa">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── TEXT COLOR ── */}
      <div>
        <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1.5">Màu chữ</div>
        <div className="flex items-center gap-2">
          <label className="relative w-8 h-8 rounded-lg border border-linear-border cursor-pointer overflow-hidden">
            <div className="w-full h-full" style={{ backgroundColor: s.color }} />
            <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={s.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
            />
          </label>
          <input type="text" className="flex-1 bg-linear-surface border border-linear-border rounded-lg px-2 py-1.5 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={s.color} onChange={(e) => onUpdate({ color: e.target.value })}
          />
        </div>
      </div>

      {/* ── FONT SIZE ── */}
      <div>
        <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1.5">Cỡ chữ</div>
        <div className="flex items-center gap-1">
          <button onClick={() => onUpdate({ fontSize: Math.max(8, s.fontSize - 2) })} className="p-1.5 bg-linear-surface border border-linear-border rounded-md hover:bg-background transition-colors">
            <Minus className="w-3 h-3 text-foreground" />
          </button>
          <input type="number" min={8} max={120}
            className="w-14 bg-linear-surface border border-linear-border rounded-md px-2 py-1.5 text-center text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={s.fontSize} onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 16 })}
          />
          <button onClick={() => onUpdate({ fontSize: Math.min(120, s.fontSize + 2) })} className="p-1.5 bg-linear-surface border border-linear-border rounded-md hover:bg-background transition-colors">
            <Plus className="w-3 h-3 text-foreground" />
          </button>
        </div>
      </div>

      {/* ── FONT WEIGHT ── */}
      <div>
        <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1.5">Độ đậm</div>
        <div className="flex gap-1">
          {(['light', 'normal', 'bold'] as const).map(w => (
            <button key={w} onClick={() => onUpdate({ fontWeight: w })}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-md border transition-all ${s.fontWeight === w ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' : 'bg-linear-surface border-linear-border text-linear-text-muted hover:text-foreground'}`}
            >
              {w === 'light' ? 'Light' : w === 'normal' ? 'Regular' : 'Bold'}
            </button>
          ))}
        </div>
      </div>

      {/* ── TEXT ALIGN ── */}
      <div>
        <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1.5">Căn lề</div>
        <div className="flex gap-1">
          {([
            { val: 'left', icon: AlignLeft },
            { val: 'center', icon: AlignCenter },
            { val: 'right', icon: AlignRight },
          ] as const).map(({ val, icon: Icon }) => (
            <button key={val} onClick={() => onUpdate({ textAlign: val })}
              className={`flex-1 py-1.5 flex items-center justify-center rounded-md border transition-all ${s.textAlign === val ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' : 'bg-linear-surface border-linear-border text-linear-text-muted hover:text-foreground'}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* ── POSITION ── */}
      <div>
        <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1.5 flex items-center gap-1">
          <Move className="w-3 h-3" /> Vị trí (%)
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            { label: 'X', key: 'x' as const },
            { label: 'Y', key: 'y' as const },
            { label: 'W', key: 'w' as const },
            { label: 'H', key: 'h' as const },
          ]).map(({ label, key }) => (
            <div key={key} className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-linear-text-muted w-3">{label}</span>
              <input type="number" min={0} max={100} step={1}
                className="flex-1 bg-linear-surface border border-linear-border rounded px-1.5 py-1 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500 w-full"
                value={Math.round(s[key])} onChange={(e) => onUpdate({ [key]: parseFloat(e.target.value) || 0 })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK COLOR PRESETS ── */}
      <div>
        <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1.5">Preset Colors</div>
        <div className="flex flex-wrap gap-1.5">
          {['#FFFFFF', '#000000', '#0F172A', '#1E293B', '#475569', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'].map(c => (
            <button key={c} onClick={() => onUpdate({ color: c })}
              className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${s.color === c ? 'border-cyan-400 ring-1 ring-cyan-400/50' : 'border-linear-border/50'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SLIDE EDITOR — Phase 2: Full Canva-like editing
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SlideEditor({ slides: initialSlides, onSlidesChange, brandName = "Brand", templateType = "brand_guideline" }: SlideEditorProps) {
  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [editingElement, setEditingElement] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ idx: number; startX: number; startY: number; origX: number; origY: number } | null>(null);
  
  const totalSlides = slides.length;
  const active = slides[currentSlide];

  // Sync back to parent
  useEffect(() => { onSlidesChange?.(slides); }, [slides]);

  const updateSlides = useCallback((fn: (prev: SlideData[]) => SlideData[]) => {
    setSlides(prev => fn(prev));
  }, []);

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide(Math.max(0, Math.min(idx, totalSlides - 1)));
    setSelectedElement(null);
    setEditingElement(null);
  }, [totalSlides]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingElement !== null) return; // Don't intercept while editing text
      if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
      if (e.key === 'Delete' && selectedElement !== null) handleDeleteElement();
      if (e.key === 'Escape') { setSelectedElement(null); setEditingElement(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentSlide, goToSlide, selectedElement, editingElement]);

  /* ─── Element Manipulation ─── */

  const handleElementClick = useCallback((idx: number, _e: React.MouseEvent) => {
    if (idx === -1) {
      setSelectedElement(null);
      setEditingElement(null);
    } else {
      setSelectedElement(idx);
      setEditingElement(null);
    }
  }, []);

  const handleElementDoubleClick = useCallback((idx: number) => {
    const elem = active?.elements[idx];
    if (!elem) return;
    // Only text types are editable
    const editableTypes = ['heading', 'subheading', 'body', 'badge', 'icon_text', 'bullet_list', 'font_sample'];
    if (editableTypes.includes(elem.type)) {
      setSelectedElement(idx);
      setEditingElement(idx);
    }
  }, [active]);

  const handleContentChange = useCallback((idx: number, content: string) => {
    updateSlides(prev => {
      const next = [...prev];
      const slide = { ...next[currentSlide] };
      const elements = [...slide.elements];
      elements[idx] = { ...elements[idx], content };
      slide.elements = elements;
      next[currentSlide] = slide;
      return next;
    });
    setEditingElement(null);
  }, [currentSlide, updateSlides]);

  const handleStyleUpdate = useCallback((patch: Partial<SlideElement['style']>) => {
    if (selectedElement === null) return;
    updateSlides(prev => {
      const next = [...prev];
      const slide = { ...next[currentSlide] };
      const elements = [...slide.elements];
      elements[selectedElement] = {
        ...elements[selectedElement],
        style: { ...elements[selectedElement].style, ...patch }
      };
      slide.elements = elements;
      next[currentSlide] = slide;
      return next;
    });
  }, [currentSlide, selectedElement, updateSlides]);

  const handleSlideBackgroundChange = useCallback((color: string) => {
    updateSlides(prev => {
      const next = [...prev];
      next[currentSlide] = {
        ...next[currentSlide],
        background: { type: 'solid', color, dark_mode: isColorDark(color) }
      };
      return next;
    });
  }, [currentSlide, updateSlides]);

  const handleDeleteElement = useCallback(() => {
    if (selectedElement === null) return;
    updateSlides(prev => {
      const next = [...prev];
      const slide = { ...next[currentSlide] };
      slide.elements = slide.elements.filter((_, i) => i !== selectedElement);
      next[currentSlide] = slide;
      return next;
    });
    setSelectedElement(null);
    setEditingElement(null);
  }, [currentSlide, selectedElement, updateSlides]);

  const handleDuplicateElement = useCallback(() => {
    if (selectedElement === null) return;
    updateSlides(prev => {
      const next = [...prev];
      const slide = { ...next[currentSlide] };
      const original = slide.elements[selectedElement];
      const clone = JSON.parse(JSON.stringify(original));
      clone.style.x = Math.min(90, clone.style.x + 3);
      clone.style.y = Math.min(90, clone.style.y + 3);
      slide.elements = [...slide.elements, clone];
      next[currentSlide] = slide;
      return next;
    });
  }, [currentSlide, selectedElement, updateSlides]);

  /* ─── Drag to Reposition ─── */

  const handleDragStart = useCallback((idx: number, e: React.MouseEvent) => {
    if (editingElement === idx) return;
    e.preventDefault();
    const elem = active?.elements[idx];
    if (!elem) return;
    setIsDragging(true);
    dragRef.current = { idx, startX: e.clientX, startY: e.clientY, origX: elem.style.x, origY: elem.style.y };
  }, [active, editingElement]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      if (!dragRef.current || !canvasRef.current) return;
      const canvasEl = canvasRef.current.querySelector('.slide-main-canvas') as HTMLElement;
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();
      const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
      const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
      const newX = Math.max(0, Math.min(95, dragRef.current.origX + dx));
      const newY = Math.max(0, Math.min(95, dragRef.current.origY + dy));
      
      updateSlides(prev => {
        const next = [...prev];
        const slide = { ...next[currentSlide] };
        const elements = [...slide.elements];
        elements[dragRef.current!.idx] = {
          ...elements[dragRef.current!.idx],
          style: { ...elements[dragRef.current!.idx].style, x: newX, y: newY }
        };
        slide.elements = elements;
        next[currentSlide] = slide;
        return next;
      });
    };
    const handleUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, currentSlide, updateSlides]);

  /* ─── Export: PDF ─── */
  const handleExportPDF = async () => {
    setIsExporting('pdf');
    setSelectedElement(null); setEditingElement(null);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [960, 540] });
      const savedSlide = currentSlide;
      for (let i = 0; i < totalSlides; i++) {
        setCurrentSlide(i);
        await new Promise(r => setTimeout(r, 350));
        const el = canvasRef.current?.querySelector('.slide-main-canvas') as HTMLElement;
        if (!el) continue;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 960, 540);
      }
      pdf.save(`${brandName.replace(/\s+/g, '_')}_BrandDeck.pdf`);
      setCurrentSlide(savedSlide);
    } catch (err: any) { alert('Lỗi xuất PDF: ' + err.message); }
    finally { setIsExporting(null); }
  };

  /* ─── Export: PPTX ─── */
  const handleExportPPTX = async () => {
    setIsExporting('pptx');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
      const res = await fetch(`${API_URL}/api/v1/design/export-pptx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify({ slides, brand_name: brandName }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${brandName.replace(/\s+/g, '_')}_BrandDeck.pptx`; a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) { alert('Lỗi xuất PPTX: ' + err.message); }
    finally { setIsExporting(null); }
  };

  const handleOpenCanva = () => window.open('https://www.canva.com/design/create?width=1920&height=1080&type=presentation', '_blank');

  if (!active) return <div className="text-center text-linear-text-muted py-20">Không có slide nào.</div>;

  const selectedElem = selectedElement !== null && selectedElement >= 0 ? active.elements[selectedElement] : null;
  const templateLabels: Record<string, string> = { brand_guideline: "Brand Guideline", pitch_deck: "Pitch Deck", proposal: "Marketing Proposal" };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* ─── TOOLBAR ─── */}
      <div className="flex items-center justify-between px-3 py-2 bg-linear-surface/50 backdrop-blur-xl border border-linear-border/50 rounded-xl shrink-0">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-foreground tracking-wide uppercase">{templateLabels[templateType] || templateType}</span>
          <span className="text-[10px] text-linear-text-muted bg-linear-surface px-2 py-0.5 rounded-full border border-linear-border">{totalSlides} slides</span>
          {selectedElem && (
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
              <PenLine className="w-3 h-3" /> Editing
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-linear-surface border border-linear-border rounded-lg px-1">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 text-linear-text-muted hover:text-foreground transition-colors"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-[10px] font-mono font-bold text-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 text-linear-text-muted hover:text-foreground transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
          </div>
          <div className="w-px h-6 bg-linear-border/50" />
          <button onClick={handleExportPDF} disabled={!!isExporting} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all disabled:opacity-50">
            {isExporting === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />} PDF
          </button>
          <button onClick={handleExportPPTX} disabled={!!isExporting} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-all disabled:opacity-50">
            {isExporting === 'pptx' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Presentation className="w-3.5 h-3.5" />} PPTX
          </button>
          <button onClick={handleOpenCanva} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-all">
            <ExternalLink className="w-3.5 h-3.5" /> Canva
          </button>
        </div>
      </div>

      {/* ─── MAIN: Thumbnails + Canvas + Properties ─── */}
      <div className="flex flex-1 gap-3 min-h-0">

        {/* Slide Thumbnails */}
        <div className="w-[130px] shrink-0 flex flex-col gap-2 overflow-y-auto no-scrollbar pr-1">
          {slides.map((s, idx) => (
            <button key={s.slide_id} onClick={() => goToSlide(idx)}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${currentSlide === idx ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-linear-border/50 hover:border-linear-border opacity-70 hover:opacity-100'}`}
            >
              <div className="w-full aspect-[16/9] overflow-hidden">
                <SlideCanvas slide={s} scale={0.13} />
              </div>
              <div className={`absolute bottom-0 left-0 right-0 px-2 py-1 text-[9px] font-bold ${currentSlide === idx ? 'bg-cyan-500 text-white' : 'bg-black/60 text-white/80'}`}>
                {idx + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Main Canvas */}
        <div ref={canvasRef} className={`flex-1 flex flex-col items-center justify-center overflow-auto no-scrollbar bg-[repeating-conic-gradient(rgba(0,0,0,0.03)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] rounded-xl border border-linear-border/30 p-4 ${isDragging ? 'cursor-grabbing' : ''}`}>
          <div className="slide-main-canvas rounded-lg overflow-hidden shadow-2xl" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
            <SlideCanvas 
              slide={active} scale={1} isEditing={true}
              selectedIdx={selectedElement} editingIdx={editingElement}
              onElementClick={handleElementClick}
              onElementDoubleClick={handleElementDoubleClick}
              onContentChange={handleContentChange}
              onDragStart={handleDragStart}
            />
          </div>
          <div className="flex items-center gap-4 mt-5">
            <button onClick={() => goToSlide(currentSlide - 1)} disabled={currentSlide === 0} className="p-2 rounded-full bg-linear-surface border border-linear-border hover:bg-background disabled:opacity-30 transition-all">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-sm font-bold text-foreground tabular-nums">{currentSlide + 1} <span className="text-linear-text-muted font-normal">/ {totalSlides}</span></span>
            <button onClick={() => goToSlide(currentSlide + 1)} disabled={currentSlide >= totalSlides - 1} className="p-2 rounded-full bg-linear-surface border border-linear-border hover:bg-background disabled:opacity-30 transition-all">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-[220px] shrink-0 bg-linear-surface/60 backdrop-blur-xl border border-linear-border/50 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-linear-border/30 flex items-center gap-2 shrink-0 bg-black/5 dark:bg-white/5">
            <PaletteIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Properties</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <PropertiesPanel
              element={selectedElem}
              slideBackground={active.background}
              onUpdate={handleStyleUpdate}
              onSlideBackgroundChange={handleSlideBackgroundChange}
              onDelete={handleDeleteElement}
              onDuplicate={handleDuplicateElement}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Utility ─── */
function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
}
