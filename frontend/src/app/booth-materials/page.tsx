"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Hexagon, BrainCircuit, FileText, Download, Sparkles,
  ChevronRight, Zap, Shield, BarChart3, Users, Palette, PenTool,
  Monitor, Printer, QrCode, ArrowRight, ArrowDown, CheckCircle2,
  Globe, Mail, Layers, Target, TrendingUp, Activity,
  Database, Network, Loader2, type LucideIcon
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   BRAND TOKENS
   ═══════════════════════════════════════════════════════════════ */
const B = {
  navy: '#0B1120', surface: '#0F172A', blue: '#2563EB', cyan: '#06B6D4',
  white: '#FFFFFF', muted: '#8496AE', red: '#EF4444', emerald: '#10B981',
  grad: 'linear-gradient(135deg, #2563EB, #06B6D4)',
};

/* ═══════════════════════════════════════════════════════════════
   PRINT DIMENSIONS (mm → px at 3.78px/mm ≈ 96dpi screen reference)
   We render at a fixed px size, then html2canvas scales ×3 for 300dpi
   ═══════════════════════════════════════════════════════════════ */
const PRINT = {
  standee:     { w: 800, h: 2000, label: 'Standee 80×200cm', pdfW: 800, pdfH: 2000 },
  infographic: { w: 842, h: 1191, label: 'Infographic A3',   pdfW: 842, pdfH: 1191 },
  onepager:    { w: 595, h: 842,  label: 'One Pager A4',     pdfW: 595, pdfH: 842  },
  logo:        { w: 842, h: 595,  label: 'Logo Guide A4-L',  pdfW: 842, pdfH: 595  },
};

/* ═══════════════════════════════════════════════════════════════
   LOGO (print-safe: no box-shadow glow, solid bg)
   ═══════════════════════════════════════════════════════════════ */
function Logo({ size = 40, showText = true, dark = false }: { size?: number; showText?: boolean; dark?: boolean }) {
  const fs = size < 30 ? 14 : size < 50 ? 20 : size < 70 ? 32 : 48;
  
  const ELECTRIC_BLUE = "#3B82F6";
  const NEON_CYAN = "#06B6D4";

  const leftLines = [
    { d: "M 15 35 C 30 35, 35 20, 50 20" },
    { d: "M 8 45 C 25 45, 30 40, 45 40" },
    { d: "M 8 55 C 25 55, 30 60, 45 60" },
    { d: "M 15 65 C 30 65, 35 80, 50 80" }
  ];

  const networkLines = [
    { x1: 50, y1: 20, x2: 80, y2: 50 },
    { x1: 50, y1: 20, x2: 65, y2: 50 },
    { x1: 50, y1: 20, x2: 45, y2: 40 },
    { x1: 50, y1: 80, x2: 80, y2: 50 },
    { x1: 50, y1: 80, x2: 65, y2: 50 },
    { x1: 50, y1: 80, x2: 45, y2: 60 },
    { x1: 80, y1: 50, x2: 65, y2: 50 },
    { x1: 80, y1: 50, x2: 45, y2: 40 },
    { x1: 80, y1: 50, x2: 45, y2: 60 },
    { x1: 45, y1: 40, x2: 65, y2: 50 },
    { x1: 45, y1: 40, x2: 45, y2: 60 },
    { x1: 45, y1: 60, x2: 65, y2: 50 },
  ];

  const nodes = [
    { cx: 50, cy: 20, r: 3.5 },
    { cx: 50, cy: 80, r: 3.5 },
    { cx: 80, cy: 50, r: 4 },
    { cx: 65, cy: 50, r: 3 },
    { cx: 45, cy: 40, r: 3 },
    { cx: 45, cy: 60, r: 3 },
    { cx: 15, cy: 35, r: 3 },
    { cx: 8, cy: 45, r: 2.5 },
    { cx: 8, cy: 55, r: 2.5 },
    { cx: 15, cy: 65, r: 3 }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.15 }}>
      <div style={{ width: size, height: size, position: 'relative' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="logoLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ELECTRIC_BLUE} stopOpacity="0.9" />
              <stop offset="100%" stopColor={NEON_CYAN} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {leftLines.map((line, idx) => (
            <path key={`ll-${idx}`} d={line.d} stroke="url(#logoLineGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          ))}
          {networkLines.map((line, idx) => (
            <line key={`nl-${idx}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={NEON_CYAN} strokeOpacity="0.6" strokeWidth="1.2" />
          ))}
          {nodes.map((node, idx) => (
            <circle key={`nd-${idx}`} cx={node.cx} cy={node.cy} r={node.r} fill={NEON_CYAN} />
          ))}
        </svg>
      </div>
      {showText && (
        <span style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900,
          fontSize: fs, letterSpacing: '-0.02em', color: dark ? '#0F172A' : '#fff',
        }}>
          Brand<span style={{ color: B.cyan }}>Flow</span>
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRINT-SAFE METRIC BOX (solid colors, no gradients on text)
   ═══════════════════════════════════════════════════════════════ */
function PMetric({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '18px 12px', borderRadius: 16,
      background: '#0F172A', border: '2px solid rgba(6,182,212,0.25)',
    }}>
      <span style={{
        fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900,
        fontSize: 36, color: B.cyan, lineHeight: 1,
      }}>{value}</span>
      <span style={{
        fontSize: 9, color: '#64748b', textTransform: 'uppercase',
        letterSpacing: '0.1em', fontWeight: 700, marginTop: 6, textAlign: 'center',
      }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRINT-SAFE PHASE STEP (infographic)
   ═══════════════════════════════════════════════════════════════ */
function PPhase({ num, title, desc, highlight = false }: { num: string; title: string; desc: string; highlight?: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: 16, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: highlight ? B.grad : '#0F172A',
        border: highlight ? `2px solid ${B.cyan}` : '1px solid rgba(148,163,184,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 900, fontSize: 14,
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      }}>
        {highlight ? '⚡' : num}
      </div>
      <div style={{
        flex: 1, padding: '14px 18px', borderRadius: 12,
        background: highlight ? 'rgba(6,182,212,0.1)' : 'rgba(15,23,42,0.5)',
        border: highlight ? '2px solid rgba(6,182,212,0.3)' : '1px solid rgba(148,163,184,0.08)',
      }}>
        <div style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700,
          fontSize: 14, color: highlight ? B.cyan : '#fff', marginBottom: 4,
        }}>{title}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>{desc}</div>
        {highlight && (
          <div style={{
            marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 20, fontSize: 9, fontWeight: 700,
            background: 'rgba(6,182,212,0.15)', color: B.cyan, border: '1px solid rgba(6,182,212,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            🛡️ ANTI-HALLUCINATION ENGINE
          </div>
        )}
      </div>
    </div>
  );
}

/* print arrow connector */
function PArrow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0', marginLeft: 20 }}>
      <div style={{ width: 2, height: 20, background: B.grad }} />
      <ArrowDown style={{ width: 14, height: 14, color: B.cyan, marginTop: -4 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ PRINT CANVAS — STANDEE  (80×200cm ratio)
   Professional Design: Oversized typography, SVG vectors, asymmetric layout
   ═══════════════════════════════════════════════════════════════ */
function PrintStandee() {
  const { w, h } = PRINT.standee;
  return (
    <div id="print-standee" style={{
      width: w, height: h, background: '#030712',
      fontFamily: 'var(--font-inter), sans-serif', color: '#fff', overflow: 'hidden',
      position: 'relative',
    }}>
      {/* ── BACKGROUND GRAPHICS ── */}
      {/* 1. Blueprint Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', backgroundPosition: 'center center', zIndex: 0
      }} />

      {/* 2. Abstract Geometric Vectors */}
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0B1120" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Large sweeping diagonal slash */}
        <polygon points="0,0 800,0 800,400 0,600" fill="url(#blueGrad)" />
        <polygon points="0,450 800,250 800,260 0,460" fill="#06B6D4" />
        
        {/* Glowing Data Nodes Overlay */}
        <circle cx="650" cy="350" r="150" fill="url(#cyanGrad)" />
        <circle cx="650" cy="350" r="8" fill="#fff" />
        <circle cx="650" cy="350" r="30" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Tiny Data Nodes scattered across blueprint */}
        <circle cx="100" cy="800" r="4" fill="#06B6D4" opacity="0.6" />
        <circle cx="100" cy="800" r="12" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
        <line x1="100" y1="800" x2="250" y2="750" stroke="#06B6D4" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
        <circle cx="250" cy="750" r="3" fill="#3B82F6" opacity="0.8" />
        
        <circle cx="700" cy="1500" r="5" fill="#3B82F6" opacity="0.5" />
        <circle cx="700" cy="1500" r="20" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        <line x1="700" y1="1500" x2="600" y2="1650" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
        <circle cx="600" cy="1650" r="3" fill="#06B6D4" opacity="0.8" />
        <circle cx="600" cy="1650" r="15" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
        
        {/* Giant Watermark Hexagon */}
        <g transform="translate(-100, 1200) scale(4) rotate(15)" opacity="0.08">
          <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" fill="none" stroke="#fff" strokeWidth="4" />
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="#06B6D4" strokeWidth="2" />
        </g>
      </svg>

      {/* 3. Vertical Typography Watermark */}
      <div style={{
        position: 'absolute', right: -120, top: '40%', transform: 'rotate(-90deg)',
        fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 160, fontWeight: 900,
        color: 'transparent', WebkitTextStroke: '3px rgba(255,255,255,0.1)', letterSpacing: '0.1em',
        whiteSpace: 'nowrap', zIndex: 0
      }}>
        SYSTEM V2.0
      </div>

      {/* ── FOREGROUND CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', padding: '60px' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Logo size={100} />
            <div style={{ marginTop: 24, fontSize: 18, color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              AI Multi-Agent Marketing OS
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
            DOC.REF: B2B-MKT-26<br/>
            STATUS: ACTIVE<br/>
            [ 45° 21' N / 12° 11' E ]
          </div>
        </div>

        {/* HERO TYPOGRAPHY */}
        <div style={{ marginTop: 120 }}>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900, fontSize: 72, lineHeight: 1.1, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
            <span style={{ color: '#fff' }}>Phòng Marketing</span><br/>
            <span style={{ color: B.cyan }}>Vận Hành Bởi AI</span>
          </h1>
          <div style={{ width: 120, height: 8, background: '#06B6D4', marginTop: 30, marginBottom: 30 }} />
          <p style={{ fontSize: 24, color: '#cbd5e1', maxWidth: 500, lineHeight: 1.5, fontWeight: 300 }}>
            Tự động hóa toàn bộ quy trình lên chiến lược Marketing B2B. Loại bỏ hoàn toàn sự ảo giác tài chính nhờ <strong style={{ color: '#fff', fontWeight: 700 }}>Math Engine độc quyền.</strong>
          </p>
        </div>

        {/* FEATURES GRID - Asymmetric */}
        <div style={{ marginTop: 80, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: 'rgba(6,182,212,0.3)' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {[
              { num: '01', title: '5 AI Agents Chuyên Biệt', desc: 'Intake, Strategy, Design, Content giao tiếp và phân tích chéo như một đội ngũ thực sự.', icon: '⚡' },
              { num: '02', title: 'Python Math Engine', desc: 'Tính toán Weighted SWOT, phủ quyết các đề xuất AI không khả thi về mặt tài chính.', icon: '🛡️' },
              { num: '03', title: 'Master Blueprint PDF', desc: 'Xuất bản kế hoạch dưới dạng báo cáo thuyết trình đầu tư chuyên nghiệp trong vài phút.', icon: '📄' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 40, alignItems: 'flex-start', paddingLeft: 80, position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 4, width: 50, height: 50, borderRadius: '50%',
                  background: '#0F172A', border: '2px solid #06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900, fontSize: 18, color: '#06B6D4'
                }}>
                  {f.num}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.5, maxWidth: 480 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HIGHLIGHT METRICS */}
        {/* HIGHLIGHT METRICS - PURE FINTECH ELEGANCE */}
        <div style={{ marginTop: 80, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          
          {/* Conversion */}
          <div style={{ position: 'relative', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
            
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 }}>Conversion Rate</div>
              <div style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 140, fontWeight: 900, lineHeight: 1,
                background: 'linear-gradient(135deg, #fff 20%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 20px 40px rgba(6,182,212,0.4))'
              }}>
                10%
              </div>
              <div style={{ fontSize: 16, color: '#64748b', marginTop: 30, maxWidth: 300, margin: '30px auto 0' }}>Tỷ lệ chuyển đổi trung bình B2B</div>
            </div>

            {/* Glowing Floor Vector */}
            <svg width="100%" height="100" style={{ position: 'absolute', bottom: 0, left: 0 }}>
              <path d="M0,100 Q150,0 300,100 Z" fill="rgba(6,182,212,0.1)" />
              <path d="M0,100 Q150,40 300,100 Z" fill="rgba(6,182,212,0.2)" />
            </svg>
          </div>

          {/* Time Saved */}
          <div style={{ position: 'relative', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
            
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 }}>Time Saved</div>
              <div style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 140, fontWeight: 900, lineHeight: 1,
                background: 'linear-gradient(135deg, #fff 20%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 20px 40px rgba(37,99,235,0.4))'
              }}>
                85%
              </div>
              <div style={{ fontSize: 16, color: '#64748b', marginTop: 30, maxWidth: 300, margin: '30px auto 0' }}>Rút ngắn quy trình hoạch định truyền thống</div>
            </div>

            {/* Glowing Floor Vector */}
            <svg width="100%" height="100" style={{ position: 'absolute', bottom: 0, left: 0 }}>
              <path d="M0,100 Q150,0 300,100 Z" fill="rgba(37,99,235,0.1)" />
              <path d="M0,100 Q150,40 300,100 Z" fill="rgba(37,99,235,0.2)" />
            </svg>
          </div>

        </div>

        {/* FOOTER */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40 }}>
          <div style={{ display: 'flex', gap: 30 }}>
            <div style={{ width: 140, height: 140, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <QRCodeSVG value="http://brandflowhust.vercel.app" style={{ width: 120, height: 120, color: '#030712' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>brandflow.ai</div>
              <div style={{ fontSize: 18, color: '#06B6D4' }}>contact@brandflow.ai</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 10 }}>Powered by LLaMA-3.3-70B</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 40, height: 40, border: '1px solid #334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>in</div>
            <div style={{ width: 40, height: 40, border: '1px solid #334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>fb</div>
          </div>
        </div>

      </div>
      
      {/* Vinyl Glare Overlay for Print */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0) 60%)', pointerEvents: 'none', zIndex: 100 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ PRINT CANVAS — INFOGRAPHIC (A3 ratio)
   Professional Design: Flowchart, data nodes, premium tech aesthetic
   ═══════════════════════════════════════════════════════════════ */
function PrintInfographic() {
  const { w, h } = PRINT.infographic;
  return (
    <div id="print-infographic" style={{
      width: w, height: h, background: '#050B14',
      fontFamily: 'var(--font-inter), sans-serif', color: '#fff',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative', padding: '60px'
    }}>
      {/* ── BACKGROUND ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(6,182,212,0.1) 0%, transparent 50%), radial-gradient(circle at 100% 80%, rgba(37,99,235,0.1) 0%, transparent 50%)',
        zIndex: 0
      }} />
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Abstract Flow lines */}
        <path d={`M 120 200 C 120 500, 720 400, 720 700 C 720 900, 120 800, 120 1100`} fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeDasharray="12 12" opacity="0.3" />
        <path d={`M 720 200 C 720 400, 120 500, 120 800 C 120 1000, 720 900, 720 1100`} fill="none" stroke="url(#lineGrad)" strokeWidth="2" opacity="0.1" />
      </svg>

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 30 }}>
        <Logo size={60} />
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900, fontSize: 48, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
            System Architecture
          </h1>
          <div style={{ fontSize: 16, color: '#06B6D4', letterSpacing: '0.1em', marginTop: 8 }}>
            AI-DRIVEN B2B MARKETING WORKFLOW
          </div>
        </div>
      </div>

      {/* ── FLOWCHART CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 40 }}>
        
        {/* Node 1 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 30, width: '80%' }}>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 0.8, alignSelf: 'center' }}>01</div>
          <div style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 20, flex: 1, backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Goal Setting & Constraints</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>CMO AI thiết lập Sứ mệnh cốt lõi và <strong>Red Lines</strong> (Lằn ranh đỏ) — Những nguyên tắc doanh nghiệp tuyệt đối không được vi phạm.</p>
          </div>
        </div>

        {/* Node 2 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 30, width: '80%', alignSelf: 'flex-end' }}>
          <div style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 20, flex: 1, backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Situation Audit (Gap Analysis)</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>Phân tệp khách hàng theo Needs-based Audience. Gán trọng số Critical Success Factors.</p>
          </div>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 0.8, alignSelf: 'center' }}>02</div>
        </div>

        {/* Node MATH ENGINE */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
          <div style={{ padding: '34px', background: 'linear-gradient(180deg, #0F172A 0%, #083344 100%)', border: '3px solid #06B6D4', borderRadius: 30, textAlign: 'center', width: '92%', position: 'relative', boxShadow: '0 0 60px rgba(6,182,212,0.3), inset 0 0 30px rgba(6,182,212,0.15)' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: '#06B6D4', color: '#030712', padding: '6px 24px', borderRadius: 20, fontWeight: 900, fontSize: 14, letterSpacing: '0.15em', boxShadow: '0 0 20px rgba(6,182,212,0.8)' }}>
              CORE PROCESSING
            </div>
            <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 44, fontWeight: 900, color: '#fff', margin: '20px 0 12px 0', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>PYTHON MATH ENGINE</h2>
            <p style={{ fontSize: 16, color: '#e2e8f0', maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>
              Thuật toán mô hình tĩnh tĩnh toán Weighted SWOT Score & Financial Metrics. <strong>Phủ quyết tuyệt đối mọi sự ảo giác tính toán của AI.</strong>
            </p>
          </div>
        </div>

        {/* Node 3 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 30, width: '80%' }}>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 0.8, alignSelf: 'center' }}>03</div>
          <div style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 20, flex: 1, backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Strategy & Tactical Budgeting</h3>
        {/* Node 4 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 30, width: '80%', alignSelf: 'flex-end' }}>
          <div style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 20, flex: 1, backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Cross-functional Review</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>CFO AI rà soát Downside Risk. Persona AI soát lỗi &quot;ngáo giá trị&quot; (Value Hallucination) trước khi chốt.</p>
          </div>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 0.8, alignSelf: 'center' }}>04</div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
            <QRCodeSVG value="http://brandflowhust.vercel.app" style={{ width: 48, height: 48, color: '#030712' }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>brandflow.ai</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Quét mã QR để trải nghiệm Demo</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#06B6D4', fontWeight: 700, letterSpacing: '0.05em' }}>OUTPUT: MASTER BLUEPRINT PDF</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Báo cáo chuẩn thuyết trình, Agency white-label.</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ PRINT CANVAS — ONE PAGER (A4 ratio)
   Professional Design: Dark Tech Holographic
   ═══════════════════════════════════════════════════════════════ */
function PrintOnePager() {
  const { w, h } = PRINT.onepager;
  return (
    <div id="print-onepager" style={{
      width: w, height: h, background: '#020617',
      fontFamily: 'var(--font-inter), sans-serif', color: '#fff',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
    }}>
      {/* ── BACKGROUND GEOMETRY ── */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }} />
      
      {/* Massive Glowing Orbs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-20%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-20%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={40} dark={false} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#06B6D4', letterSpacing: '0.3em', textTransform: 'uppercase' }}>PRODUCT SPECIFICATION</div>
          <div style={{ fontSize: 9, color: '#64748b', marginTop: 4, letterSpacing: '0.1em' }}>DOC.REF: B2B-MKT-26 / A4</div>
        </div>
      </div>

      {/* ── HERO TYPOGRAPHY ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '10px 40px 0', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#fff' }}>Hệ Điều Hành</span><br/>
          <span style={{ 
            background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Marketing B2B</span>
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 16, maxWidth: 400, lineHeight: 1.6 }}>
          Tự động hóa toàn bộ quy trình lên chiến lược Marketing B2B với 5 AI Agents chuyên biệt và Python Math Engine độc quyền chống ảo giác.
        </p>
      </div>

      {/* ── MASSIVE METRICS (Like Standee) ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '24px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        
        {/* Metric 1 */}
        <div style={{ position: 'relative', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#06B6D4', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Conversion Rate</div>
          <div style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 64, fontWeight: 900, lineHeight: 1,
            background: 'linear-gradient(135deg, #fff 20%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>10<span style={{ fontSize: 32, opacity: 0.8 }}>%</span></div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>Tỷ lệ chuyển đổi trung bình B2B</div>
          <svg width="100%" height="40" style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <path d="M0,40 Q100,0 200,40 Z" fill="rgba(6,182,212,0.1)" />
            <path d="M0,40 Q100,20 200,40 Z" fill="rgba(6,182,212,0.2)" />
          </svg>
        </div>

        {/* Metric 2 */}
        <div style={{ position: 'relative', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#3B82F6', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Time Saved</div>
          <div style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 64, fontWeight: 900, lineHeight: 1,
            background: 'linear-gradient(135deg, #fff 20%, #3B82F6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>85<span style={{ fontSize: 32, opacity: 0.8 }}>%</span></div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>Rút ngắn quy trình hoạch định</div>
          <svg width="100%" height="40" style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <path d="M0,40 Q100,0 200,40 Z" fill="rgba(37,99,235,0.1)" />
            <path d="M0,40 Q100,20 200,40 Z" fill="rgba(37,99,235,0.2)" />
          </svg>
        </div>

      </div>

      {/* ── CORE FEATURES (Glassmorphism Cards) ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        
        {/* Feature 1 */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', background: 'rgba(15,23,42,0.6)', padding: '16px 24px', borderRadius: 16, borderLeft: '4px solid #06B6D4', boxShadow: '0 0 20px rgba(6,182,212,0.15)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4', fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-space-grotesk), sans-serif' }}>01</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 2 }}>5 AI Agents Chuyên Biệt</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Intake, Strategy, Design, Content giao tiếp và phân tích chéo như một đội ngũ Agency B2B thực sự.</div>
          </div>
        </div>

        {/* Feature 2 */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', background: 'rgba(15,23,42,0.6)', padding: '16px 24px', borderRadius: 16, borderLeft: '4px solid #3B82F6', boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-space-grotesk), sans-serif' }}>02</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Python Math Engine</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Mô hình tĩnh kiểm toán tài chính (CAC, ROI, CPL), phủ quyết tuyệt đối các đề xuất AI gây rủi ro ngân sách.</div>
          </div>
        </div>

        {/* Feature 3 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', background: 'rgba(15,23,42,0.6)', padding: '24px 30px', borderRadius: 20, borderLeft: '4px solid #10B981' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-space-grotesk), sans-serif' }}>03</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Master Blueprint PDF</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Xuất bản toàn bộ kế hoạch (Content, Ads, Metrics) thành tài liệu thuyết trình B2B chuyên nghiệp trong 4 phút.</div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '30px 50px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: 100, height: 100, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
            <QRCodeSVG value="http://brandflowhust.vercel.app" style={{ width: '100%', height: '100%', color: '#020617' }} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>brandflow.ai</div>
            <div style={{ fontSize: 14, color: '#06B6D4', marginTop: 4 }}>contact@brandflow.ai</div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#64748b', textAlign: 'right' }}>
          POWERED BY<br/>
          <strong style={{ color: '#fff' }}>LLaMA-3.3-70B</strong>
        </div>
      </div>

      {/* Premium Glossy Paper Glare Overlay for Print */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none', zIndex: 100 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ PRINT CANVAS — LOGO GUIDELINES (A4 Landscape)
   ═══════════════════════════════════════════════════════════════ */
function PrintLogoGuide() {
  const { w, h } = PRINT.logo;
  return (
    <div id="print-logo" style={{
      width: w, height: h, background: B.navy,
      padding: '40px 50px', fontFamily: 'var(--font-inter), sans-serif', color: '#fff',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: B.cyan, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>
        BrandFlow — Brand Identity Guidelines
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, flex: 1 }}>
        {/* Left: Logo + Variants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Primary Logo */}
          <div style={{ padding: '40px 30px', borderRadius: 16, background: '#0F172A', border: '1px solid rgba(148,163,184,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo size={70} />
          </div>
          {/* Variants Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Full', bg: '#0F172A', dark: false },
              { label: 'Icon Only', bg: '#0F172A', dark: false, iconOnly: true },
              { label: 'Mono White', bg: '#1e293b', dark: false },
              { label: 'On Light', bg: '#f8fafc', dark: true },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 12,
                  background: v.bg, border: '1px solid rgba(148,163,184,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8,
                }}>
                  <Logo size={28} showText={!('iconOnly' in v && v.iconOnly)} dark={v.dark} />
                </div>
                <span style={{ fontSize: 8, color: '#64748b', fontWeight: 600, marginTop: 4, textTransform: 'uppercase' }}>{v.label}</span>
              </div>
            ))}
          </div>
          {/* Usage Rules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['Không xoay', 'Không kéo giãn', 'Không đổi màu', 'Không nền rối'].map((r, i) => (
              <div key={i} style={{ padding: '8px 6px', borderRadius: 10, textAlign: 'center', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                <div style={{ fontSize: 16, marginBottom: 4, color: '#f87171' }}>✕</div>
                <div style={{ fontSize: 8, color: '#94a3b8' }}>{r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Colors + Typography */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Color Palette */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.cyan, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Color Palette</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, borderRadius: 12, overflow: 'hidden' }}>
              {[
                { hex: '#2563EB', name: 'Primary Blue' },
                { hex: '#06B6D4', name: 'Cyan' },
                { hex: '#0B1120', name: 'Navy' },
                { hex: '#0F172A', name: 'Surface' },
                { hex: '#10B981', name: 'Success' },
                { hex: '#EF4444', name: 'Alert' },
              ].map((c, i) => (
                <div key={i} style={{ aspectRatio: '1', background: c.hex, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 6 }}>
                  <div style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace' }}>{c.hex}</div>
                  <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.5)' }}>{c.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.cyan, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Typography</div>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: '#0F172A', border: '1px solid rgba(148,163,184,0.08)', marginBottom: 10 }}>
              <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>Heading</div>
              <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em' }}>Space Grotesk</div>
              <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 16, color: '#64748b', marginTop: 2 }}>Aa Bb Cc Dd 0123456789</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: '#0F172A', border: '1px solid rgba(148,163,184,0.08)' }}>
              <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>Body</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>Inter</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>Aa Bb Cc Dd 0123456789</div>
            </div>
          </div>

          {/* Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#0F172A', border: '1px solid rgba(148,163,184,0.06)' }}>
              <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Clear Space</div>
              <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4 }}>Min = icon height × 0.5</div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#0F172A', border: '1px solid rgba(148,163,184,0.06)' }}>
              <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Min Size</div>
              <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4 }}>Icon: 8mm · Full: 40mm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#64748b' }}>
        <span>BrandFlow Brand Identity Guidelines v1.0</span>
        <span>© 2026 BrandFlow AI. Confidential.</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PDF EXPORT ENGINE — html-to-image (×3 scale) + jsPDF
   ═══════════════════════════════════════════════════════════════ */
async function exportToPDF(elementId: string, filename: string, pdfW: number, pdfH: number) {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found');

  // Ensure element is visible for capture
  const prev = el.style.display;
  el.style.display = 'flex';
  
  // WAIT FOR BROWSER TO COMPUTE LAYOUT AND PAINT CSS FILTERS
  await new Promise(r => setTimeout(r, 150));

  // We use html-to-image which natively supports CSS filters, text gradients, etc.
  const { toPng } = await import('html-to-image');
  const { jsPDF } = await import('jspdf');

  const imgData = await toPng(el, {
    pixelRatio: 3, // 3× for ~300dpi equivalent
    cacheBust: true,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left'
    }
  });

  el.style.display = prev;

  // Create PDF with exact dimensions (pt = points, 1pt ≈ 1/72 inch)
  const orientation = pdfW > pdfH ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format: [pdfW, pdfH],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH, undefined, 'FAST');
  pdf.save(filename);
}


/* ═══════════════════════════════════════════════════════════════
   TAB BUTTON
   ═══════════════════════════════════════════════════════════════ */
function TabBtn({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: LucideIcon; label: string;
}) {
  return (
    <button onClick={onClick}
      className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${active
        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MOCKUP WRAPPERS (For Web Preview only, not for PDF)
   ═══════════════════════════════════════════════════════════════ */
function StandeeMockup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))', paddingBottom: 40 }}>
      {/* Top Clip */}
      <div style={{ width: 810, height: 24, background: 'linear-gradient(to bottom, #e2e8f0, #94a3b8)', borderTopLeftRadius: 6, borderTopRightRadius: 6, border: '1px solid #64748b', borderBottom: 'none', position: 'relative', zIndex: 2, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.7)' }} />
      
      {/* Banner Content */}
      <div style={{ position: 'relative', zIndex: 1, boxShadow: '0 0 10px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
         {children}
         {/* Subtle plastic/vinyl glare overlay */}
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0) 60%)', pointerEvents: 'none' }} />
      </div>

      {/* Bottom Base */}
      <div style={{ width: 860, height: 70, background: 'linear-gradient(to bottom, #cbd5e1, #475569)', position: 'relative', zIndex: 2, borderTop: '3px solid #f1f5f9', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.3), 0 20px 25px rgba(0,0,0,0.5)' }}>
         {/* Base detail */}
         <div style={{ position: 'absolute', top: 15, left: 30, right: 30, height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 10 }} />
         <div style={{ position: 'absolute', top: 35, left: '50%', transform: 'translateX(-50%)', width: 100, height: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 10 }} />
         
         {/* Feet (Left and Right) */}
         <div style={{ position: 'absolute', bottom: -16, left: 150, width: 70, height: 24, background: 'linear-gradient(to bottom, #64748b, #1e293b)', borderRadius: 4, transform: 'perspective(150px) rotateX(40deg)', border: '1px solid #334155', boxShadow: '0 10px 15px rgba(0,0,0,0.5)' }} />
         <div style={{ position: 'absolute', bottom: -16, right: 150, width: 70, height: 24, background: 'linear-gradient(to bottom, #64748b, #1e293b)', borderRadius: 4, transform: 'perspective(150px) rotateX(40deg)', border: '1px solid #334155', boxShadow: '0 10px 15px rgba(0,0,0,0.5)' }} />
      </div>
    </div>
  );
}

function PaperMockup({ children, landscape = false }: { children: React.ReactNode, landscape?: boolean }) {
  return (
    <div style={{ 
      position: 'relative',
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
      padding: '20px',
    }}>
      <div style={{ 
        position: 'relative', zIndex: 1, 
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
        borderRadius: 2, overflow: 'hidden'
      }}>
        {children}
        {/* Paper texture/glare overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }} />
      </div>
      
      {/* Curved shadow effect simulating page curl */}
      <div style={{ position: 'absolute', bottom: 35, left: 40, right: 40, top: 40, boxShadow: '0 25px 30px rgba(0,0,0,0.6)', borderRadius: '100px / 15px', zIndex: 0 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ MAIN PAGE — Dual Mode: Web Preview + Print Export
   ═══════════════════════════════════════════════════════════════ */
type TabKey = 'standee' | 'infographic' | 'onepager' | 'logo';

export default function BoothMaterialsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('standee');
  const [exporting, setExporting] = useState<TabKey | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState(0); // 0-4

  const exportConfig: Record<TabKey, { id: string; file: string; w: number; h: number }> = {
    standee:     { id: 'print-standee',     file: 'BrandFlow_Standee_80x200cm.pdf',    w: PRINT.standee.pdfW,     h: PRINT.standee.pdfH },
    infographic: { id: 'print-infographic',  file: 'BrandFlow_Infographic_A3.pdf',      w: PRINT.infographic.pdfW, h: PRINT.infographic.pdfH },
    onepager:    { id: 'print-onepager',     file: 'BrandFlow_OnePager_A4.pdf',         w: PRINT.onepager.pdfW,    h: PRINT.onepager.pdfH },
    logo:        { id: 'print-logo',         file: 'BrandFlow_LogoGuidelines_A4L.pdf',  w: PRINT.logo.pdfW,        h: PRINT.logo.pdfH },
  };

  const handleExport = useCallback(async (tab: TabKey) => {
    setExporting(tab);
    try {
      const cfg = exportConfig[tab];
      await exportToPDF(cfg.id, cfg.file, cfg.w, cfg.h);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Lỗi xuất PDF: ' + err.message);
    } finally {
      setExporting(null);
    }
  }, []);

  const handleExportAll = useCallback(async () => {
    setExportingAll(true);
    setExportProgress(0);
    const allTabs: TabKey[] = ['standee', 'infographic', 'onepager', 'logo'];
    for (let i = 0; i < allTabs.length; i++) {
      const tab = allTabs[i];
      setExporting(tab);
      setExportProgress(i + 1);
      try {
        const cfg = exportConfig[tab];
        await exportToPDF(cfg.id, cfg.file, cfg.w, cfg.h);
        // Small delay between exports to avoid browser choking
        await new Promise(r => setTimeout(r, 500));
      } catch (err: any) {
        console.error(`Export ${tab} error:`, err);
      }
    }
    setExporting(null);
    setExportingAll(false);
    setExportProgress(0);
  }, []);

  const tabs: { key: TabKey; label: string; icon: LucideIcon; spec: string }[] = [
    { key: 'standee', label: 'Standee', icon: Monitor, spec: '80×200cm' },
    { key: 'infographic', label: 'Infographic', icon: Network, spec: 'A3' },
    { key: 'onepager', label: 'One Pager', icon: FileText, spec: 'A4' },
    { key: 'logo', label: 'Logo & Brand', icon: Hexagon, spec: 'A4 Landscape' },
  ];

  const currentSpec = tabs.find(t => t.key === activeTab)!;

  return (
    <div className="w-full min-h-screen flex flex-col relative z-10 py-5 px-5 lg:px-6">

      {/* ═══ HIDDEN PRINT CANVASES — rendered offscreen for PDF capture ═══ */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, opacity: 1 }}
        aria-hidden="true">
        <PrintStandee />
        <PrintInfographic />
        <PrintOnePager />
        <PrintLogoGuide />
      </div>

      {/* ── HEADER ── */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))',
              borderColor: 'rgba(6,182,212,0.2)', boxShadow: '0 4px 20px rgba(6,182,212,0.1)',
            }}>
            <Printer className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h1 className="page-title">Booth Materials</h1>
            <p className="page-desc text-[11px]">Ấn phẩm in ấn · Print-ready PDF Export · 300 DPI</p>
          </div>
        </div>
        <div className="flex bg-linear-surface border border-linear-border rounded-xl p-1 gap-0.5 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <TabBtn key={tab.key} active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)} icon={tab.icon} label={tab.label} />
          ))}
        </div>
      </div>

      {/* ── EXPORT TOOLBAR ── */}
      <div className="mb-4 rounded-xl overflow-hidden"
        style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)' }}>
        {/* Top row: status + export-all */}
        <div className="p-3 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(6,182,212,0.1)' }}>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Print-Ready · {currentSpec.spec}
              </span>
              <p className="text-[10px] text-slate-400">
                Kích thước chuẩn in · Không animation · Solid colors · ×3 Scale (~300 DPI)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport(activeTab)}
              disabled={exporting !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
              style={{ background: B.grad }}
            >
              {exporting === activeTab && !exportingAll ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xuất...</>
              ) : (
                <><Download className="w-3.5 h-3.5" /> Xuất PDF ({currentSpec.spec})</>
              )}
            </button>
            <button
              onClick={handleExportAll}
              disabled={exporting !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              style={{
                background: exportingAll ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.25)',
                color: B.cyan,
              }}
            >
              {exportingAll ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xuất {exportProgress}/4...</>
              ) : (
                <><Layers className="w-3.5 h-3.5" /> Xuất Tất Cả (4 PDF)</>
              )}
            </button>
          </div>
        </div>

        {/* Bottom row: 4 individual export cards */}
        <div className="px-3 pb-3 grid grid-cols-4 gap-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            const isExporting = exporting === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (!exportingAll) handleExport(tab.key);
                }}
                disabled={exporting !== null}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all disabled:opacity-50"
                style={{
                  background: isActive ? 'rgba(6,182,212,0.1)' : 'rgba(15,23,42,0.3)',
                  border: isActive ? '1px solid rgba(6,182,212,0.25)' : '1px solid rgba(148,163,184,0.06)',
                }}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <tab.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                )}
                <div className="min-w-0">
                  <div className={`text-[11px] font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {tab.label}
                  </div>
                  <div className="text-[9px] text-slate-500">{tab.spec} · PDF</div>
                </div>
                <Download className={`w-3 h-3 ml-auto shrink-0 ${isActive ? 'text-cyan-500' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PREVIEW CANVAS — Scaled-down view of the print canvas ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Print spec badge */}
            <div className="mb-4 flex items-center gap-2 text-[10px] text-slate-400">
              <span className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/30 font-mono font-bold">
                {PRINT[activeTab].w} × {PRINT[activeTab].h} pt
              </span>
              <span>·</span>
              <span>{currentSpec.spec}</span>
              <span>·</span>
              <span>×3 Scale = ~300 DPI</span>
            </div>

            {/* Scaled Preview Container */}
            <div className="w-full flex justify-center mt-4" style={{ perspective: '1500px' }}>
              <div style={{
                transform: activeTab === 'standee'
                  ? 'scale(0.4)' : activeTab === 'logo' ? 'scale(0.65)' : 'scale(0.55)',
                transformOrigin: 'top center',
              }}>
                {activeTab === 'standee' && (
                  <StandeeMockup>
                    <PrintStandee />
                  </StandeeMockup>
                )}
                {activeTab === 'infographic' && (
                  <PaperMockup>
                    <PrintInfographic />
                  </PaperMockup>
                )}
                {activeTab === 'onepager' && (
                  <PaperMockup>
                    <PrintOnePager />
                  </PaperMockup>
                )}
                {activeTab === 'logo' && (
                  <PaperMockup landscape>
                    <PrintLogoGuide />
                  </PaperMockup>
                )}
              </div>
            </div>

            {/* Export buttons grid */}
            <div className="mt-8 w-full max-w-[700px]">
              {/* Individual exports */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {tabs.map(tab => {
                  const isExporting = exporting === tab.key;
                  const done = exportingAll && exportProgress > (['standee', 'infographic', 'onepager', 'logo'].indexOf(tab.key));
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleExport(tab.key)}
                      disabled={exporting !== null}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50"
                      style={{
                        background: 'rgba(15,23,42,0.6)',
                        border: activeTab === tab.key ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(148,163,184,0.08)',
                      }}
                    >
                      {isExporting ? (
                        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                      ) : done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <tab.icon className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="text-[11px] font-bold text-white">{tab.label}</span>
                      <span className="text-[9px] text-slate-500">{tab.spec}</span>
                      <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: B.cyan }}>
                        <Download className="w-3 h-3" /> PDF
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Export All */}
              <button
                onClick={handleExportAll}
                disabled={exporting !== null}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: B.grad, boxShadow: '0 8px 30px rgba(6,182,212,0.2)' }}
              >
                {exportingAll ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Đang xuất tất cả... ({exportProgress}/4)</>
                ) : (
                  <><Layers className="w-5 h-5" /> Xuất Tất Cả 4 PDF — Standee + Infographic + One Pager + Logo</>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
