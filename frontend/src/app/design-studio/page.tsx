"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, TerminalSquare, AlertCircle, RefreshCw, 
  ImageIcon, Briefcase, Download, 
  Activity, Type, Network, Settings,
  LineChart, PenTool, Send, MousePointer2, CheckCircle2, FileText,
  Sparkles, Loader2, ChevronRight, Lightbulb, BarChart3, Clock,
  Quote, Layers, TrendingUp, ArrowRight, Info, Eye
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import dynamic from 'next/dynamic';

import { useFormStore } from '@/store/useFormStore';

const SlideEditor = dynamic(() => import('@/components/deck-builder/SlideEditor'), { ssr: false });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* ═══════════════════════════════════════════════════════════════════════════
   STEP INDICATOR — Guides user through the flow
   ═══════════════════════════════════════════════════════════════════════════ */

function StepIndicator({ steps, currentStep }: { steps: { label: string; done: boolean }[]; currentStep: number }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
            s.done ? 'bg-emerald-500/10 text-emerald-400' :
            i === currentStep ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30' :
            'bg-linear-surface text-linear-text-muted'
          }`}>
            {s.done ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[8px]">{i + 1}</span>}
            {s.label}
          </div>
          {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-linear-text-muted/30" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function DesignStudioPage() {
  const { t } = useLanguage();
  const { brandDNA, wizardAnswers, intakeAnalysis, extractedAnswers } = useFormStore();
  const [promptData, setPromptData] = useState({
    userPrompt: '',
    creativeMode: 'balanced'
  });

  // ── Build masterDNA by deeply merging: brandDNA (highest priority) > intakeAnalysis > wizardAnswers > extractedAnswers ──
  // intakeAnalysis contains the rich Strategic Audit from Intake Agent (PESTLE, VRIO, financial health, etc.)
  const intake = intakeAnalysis?.expert_business_analysis || intakeAnalysis || {};
  const masterDNA = {
    brand_name: brandDNA?.brand_name || intake?.brand_name || wizardAnswers?.company_name || extractedAnswers?.company_name || "Doanh nghiệp",
    goal: brandDNA?.positioning || intake?.strategic_recommendation || wizardAnswers?.goal || "Xây dựng thương hiệu mạnh",
    industry: wizardAnswers?.industry || extractedAnswers?.industry || intake?.industry || "General",
    core_usps: brandDNA?.core_usps || intake?.core_usps || wizardAnswers?.core_usps || extractedAnswers?.core_usps || [],
    target_audience: intake?.target_audience || wizardAnswers?.target_audience || extractedAnswers?.target_audience || "Khách hàng mục tiêu",
    tone_of_voice: brandDNA?.tone_of_voice || intake?.tone_of_voice || wizardAnswers?.tone_of_voice || extractedAnswers?.tone_of_voice || "Chuyên nghiệp",
    // NEW: Pass rich intake context to Design Agent for precision
    brand_personality: brandDNA?.brand_archetype || intake?.brand_personality || intake?.brand_archetype || "",
    color_palette: brandDNA?.color_palette || intake?.visual_identity?.color_palette || [],
    strict_rules: brandDNA?.strict_rules || intake?.strict_rules || intake?.brand_rules || [],
    financial_context: intake?.financial_health || "",
    competitive_insight: intake?.competitive_landscape || intake?.competitors || "",
    // Full intakeAnalysis for backend agents that accept it
    _full_intake: intakeAnalysis,
    _full_brand_dna: brandDNA,
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [agentLogs, setAgentLogs] = useState<{id: number, time: string, agent: string, text: string, type: 'info' | 'success' | 'warn'}[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'visuals' | 'case-study' | 'deck-builder'>('visuals');

  // Deck Builder State
  const [deckSlides, setDeckSlides] = useState<any[]>([]);
  const [deckTemplate, setDeckTemplate] = useState<'brand_guideline' | 'pitch_deck' | 'proposal'>('brand_guideline');
  const [deckLoading, setDeckLoading] = useState(false);
  const [deckError, setDeckError] = useState<string | null>(null);

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
      // Don't clear results/blocks — preserve old content while loading
      // so user can still view previous output on other tabs
      setAgentLogs([]);

      setActiveAgent('System');
      addLog("System", "Initiating Design Network...", "info");
      await sleep(800);
      
      // Build rich payload from masterDNA (now includes intakeAnalysis data)
      const payload = {
        brand_name: masterDNA.brand_name,
        goal: masterDNA.goal,
        industry: masterDNA.industry,
        core_usps: Array.isArray(masterDNA.core_usps) ? masterDNA.core_usps : [],
        target_audience_insights: [masterDNA.target_audience, masterDNA.brand_personality].filter(Boolean),
        target_audience: masterDNA.target_audience,
        tone_of_voice: masterDNA.tone_of_voice,
        strict_rules: Array.isArray(masterDNA.strict_rules) ? masterDNA.strict_rules : [],
        custom_prompt: promptData.userPrompt || "",
        // Pass full DNA context so backend agents can reference exact intake data
        brand_dna_context: masterDNA._full_brand_dna || undefined,
        business_context: masterDNA._full_intake ? {
          financial_health: masterDNA.financial_context,
          competitive_insight: typeof masterDNA.competitive_insight === 'string' ? masterDNA.competitive_insight : JSON.stringify(masterDNA.competitive_insight),
          brand_personality: masterDNA.brand_personality,
        } : undefined,
      };

      setActiveAgent('Creative Agent');
      addLog("Creative Agent", "Đang xử lý song song DALL-E Visuals & Behance Layout...", "info");

      const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const [assetsRes, caseStudyRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/design/generate-assets`, {
          method: "POST", headers, body: JSON.stringify(payload)
        }).then(async res => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.detail || `Lỗi HTTP ${res.status} từ API generate-assets`);
          }
          return res.json();
        }),
        fetch(`${API_URL}/api/v1/design/generate-case-study`, {
          method: "POST", headers, body: JSON.stringify(payload)
        }).then(async res => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.detail || `Lỗi HTTP ${res.status} từ API generate-case-study`);
          }
          return res.json();
        })
      ]);

      if (assetsRes.status === "error") throw new Error("Lỗi sinh Visual Assets: " + assetsRes.message);
      if (caseStudyRes.status === "error") throw new Error("Lỗi sinh Case Study: " + caseStudyRes.message);
      if (!assetsRes.data) throw new Error("API Visual Assets không trả về dữ liệu.");
      if (!caseStudyRes.data || !caseStudyRes.data.blocks) throw new Error("API Case Study không trả về blocks.");

      setActiveAgent('System');
      addLog("System", "Render thành công 2 luồng.", "success");
      addLog("System", `Visual Assets: Logo + Banner + Avatar + Guidelines`, "success");
      addLog("System", `Case Study: ${caseStudyRes.data.blocks.length} Behance blocks`, "success");
      setActiveAgent('Done');
      
      setResult(assetsRes?.data || null);
      setBlocks(caseStudyRes?.data?.blocks || []);
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

  // Generate Deck Slides
  const handleGenerateDeck = async () => {
    setDeckLoading(true);
    setDeckError(null);
    setDeckSlides([]);
    addLog("System", `Đang sinh ${deckTemplate === 'brand_guideline' ? 'Brand Guideline' : deckTemplate === 'pitch_deck' ? 'Pitch Deck' : 'Marketing Proposal'}...`, "info");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
      const res = await fetch(`${API_URL}/api/v1/design/generate-slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          template_type: deckTemplate,
          brand_name: masterDNA.brand_name,
          goal: masterDNA.goal,
          industry: masterDNA.industry,
          core_usps: Array.isArray(masterDNA.core_usps) ? masterDNA.core_usps : [],
          target_audience: masterDNA.target_audience,
          tone_of_voice: masterDNA.tone_of_voice,
          // Pass full DNA context for rich slide content
          brand_dna: masterDNA._full_brand_dna || undefined,
          business_context: masterDNA._full_intake ? {
            financial_health: masterDNA.financial_context,
            competitive_insight: typeof masterDNA.competitive_insight === 'string' ? masterDNA.competitive_insight : JSON.stringify(masterDNA.competitive_insight),
            brand_personality: masterDNA.brand_personality,
          } : undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.status === 'success' && data.data?.slides) {
        setDeckSlides(data.data.slides);
        addLog("System", `Sinh thành công ${data.data.slides.length} slides!`, "success");
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err: any) {
      setDeckError(err.message);
      addLog("System", `Lỗi: ${err.message}`, "warn");
    } finally {
      setDeckLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('behance-export-canvas');
      if (!element) return;
      
      addLog("System", "Đang kết xuất PDF độ phân giải cao...", "warn");
      
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, { 
         scale: 2, useCORS: true, backgroundColor: "#f8fafc"
      });
      const imgData = canvas.toDataURL('image/png');
      
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

  // ─── Determine flow step ───
  const hasData = !!(masterDNA.brand_name && masterDNA.brand_name !== 'Doanh nghiệp');
  const hasVisuals = !!result;
  const hasCaseStudy = blocks.length > 0;
  const hasDeck = deckSlides.length > 0;

  // ════════════════════════════════════════════════════════════════════
  // BLOCK RENDERING — Behance Case Study (Extended with new block types)
  // ════════════════════════════════════════════════════════════════════

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

    // ═══ NEW: StatsBlock ═══
    if (type === 'StatsBlock') {
      const stats = props.stats || [
        { value: '150+', label: 'Projects Completed' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '50M+', label: 'Revenue Generated' },
        { value: '12', label: 'Industry Awards' },
      ];
      return (
        <div className="py-20 px-12 flex flex-col items-center" style={{ backgroundColor: props.background_color || '#0f172a' }}>
          <div className="max-w-5xl w-full">
            {props.headline && <h2 className="text-3xl font-black text-white text-center mb-16 uppercase tracking-wider">{props.headline}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight" style={{ color: props.accent_color || '#06B6D4' }}>{s.value}</div>
                  <div className="text-sm text-white/60 font-medium uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ═══ NEW: TestimonialBlock ═══
    if (type === 'TestimonialBlock') {
      return (
        <div className="py-24 px-12 flex flex-col items-center" style={{ backgroundColor: props.background_color || '#f8fafc' }}>
          <div className="max-w-3xl w-full text-center">
            <Quote className="w-12 h-12 mx-auto mb-8 opacity-20" style={{ color: props.accent_color || '#0f172a' }} />
            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8" style={{ color: props.text_color || '#1e293b' }}>
              "{props.quote || 'Working with this brand was transformative for our business.'}"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              {props.avatar_url && <img src={props.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />}
              <div className="text-left">
                <div className="font-bold text-sm" style={{ color: props.text_color || '#1e293b' }}>{props.author || 'Client Name'}</div>
                <div className="text-xs opacity-60" style={{ color: props.text_color || '#1e293b' }}>{props.role || 'CEO, Company'}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ═══ NEW: TimelineBlock ═══
    if (type === 'TimelineBlock' || type === 'ProcessBlock') {
      const steps = props.steps || [
        { title: 'Discovery', desc: 'Nghiên cứu thị trường và đối thủ' },
        { title: 'Strategy', desc: 'Xây dựng chiến lược thương hiệu' },
        { title: 'Design', desc: 'Thiết kế hệ thống nhận diện' },
        { title: 'Launch', desc: 'Triển khai và đo lường' },
      ];
      return (
        <div className="py-24 px-12 bg-white flex flex-col items-center">
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-4xl font-black mb-16 tracking-tight" style={{ color: props.accent_color || '#0f172a' }}>
              {props.headline || 'Our Process'}
            </h2>
            <div className="space-y-0">
              {steps.map((step: any, i: number) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" 
                      style={{ backgroundColor: props.accent_color || '#0f172a' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    {i < steps.length - 1 && <div className="w-px flex-1 bg-slate-200 my-2" />}
                  </div>
                  <div className="pb-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-base text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ═══ NEW: BeforeAfterBlock ═══
    if (type === 'BeforeAfterBlock' || type === 'ComparisonBlock') {
      return (
        <div className="py-20 px-12 bg-slate-50 flex flex-col items-center">
          <div className="max-w-5xl w-full">
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center tracking-tight">{props.headline || 'Transformation'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 relative">
                <span className="absolute -top-3 left-6 bg-red-100 text-red-600 text-[10px] font-bold uppercase px-3 py-1 rounded-full">Before</span>
                {props.before_image ? <img src={props.before_image} alt="Before" className="w-full rounded-lg mb-4" /> : null}
                <p className="text-slate-500 text-sm leading-relaxed">{props.before_text || 'Previous state description'}</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border-2 relative" style={{ borderColor: props.accent_color || '#06B6D4' }}>
                <span className="absolute -top-3 left-6 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full" style={{ backgroundColor: props.accent_color || '#06B6D4' }}>After</span>
                {props.after_image ? <img src={props.after_image} alt="After" className="w-full rounded-lg mb-4" /> : null}
                <p className="text-slate-700 text-sm leading-relaxed font-medium">{props.after_text || 'Improved state description'}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Fallback
    return <div className="py-12 bg-amber-50 text-amber-600 text-center font-mono text-sm border-y border-amber-200">⚠ Block Type: {type} — Rendering as placeholder</div>;
  };

  // ════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════

  return (
    <div className="w-full h-[100vh] flex flex-col overflow-hidden relative z-10 py-5 px-5 lg:px-6">
      
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 text-foreground">
          <div className="w-11 h-11 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <Palette className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h1 className="page-title">Design Studio</h1>
            <p className="page-desc text-[11px]">AI-powered Visual Identity · Case Study · Brand Deck</p>
          </div>
        </div>
        
        {/* TABS */}
        <div className="flex bg-linear-surface border border-linear-border rounded-xl p-1 gap-0.5">
           <button onClick={() => setActiveTab('visuals')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'visuals' ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-linear-text-muted hover:text-foreground hover:bg-white/5'}`}>
             <ImageIcon className="w-3.5 h-3.5" /> Visuals
           </button>
           <button onClick={() => setActiveTab('case-study')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'case-study' ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-linear-text-muted hover:text-foreground hover:bg-white/5'}`}>
             <Layers className="w-3.5 h-3.5" /> Case Study
           </button>
           <button onClick={() => setActiveTab('deck-builder')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'deck-builder' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-linear-text-muted hover:text-foreground hover:bg-white/5'}`}>
              <Sparkles className="w-3.5 h-3.5" /> Brand Deck
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 pb-2">
        
        {/* ═══════════ COLUMN 1: INPUT PANEL ═══════════ */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-4">
          
          {/* Step Indicator */}
          <StepIndicator 
            currentStep={!hasData ? 0 : !(hasVisuals || hasCaseStudy) ? 1 : 2}
            steps={[
              { label: 'Brand DNA', done: hasData },
              { label: 'Generate', done: hasVisuals || hasCaseStudy },
              { label: 'Refine', done: false },
            ]}
          />

          {/* DNA Card */}
          <motion.div className="section-card p-5 flex flex-col shrink-0">
            <div className="flex items-center mb-4 pb-2.5 border-b border-linear-border/50">
              <Network className="w-4 h-4 mr-2 text-indigo-400" />
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">DNA Sync</h2>
              <div className="ml-auto flex items-center">
                <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-2"></span>
                <span className="text-[9px] text-indigo-400 font-mono">LIVE</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="text-[9px] font-bold text-linear-text-muted uppercase mb-0.5">Brand</div>
                  <div className="text-xs font-bold text-foreground truncate">{masterDNA.brand_name}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[9px] font-bold text-linear-text-muted uppercase mb-0.5">Industry</div>
                  <div className="text-xs font-medium text-foreground truncate">{masterDNA.industry}</div>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-linear-text-muted uppercase mb-0.5">Goal</div>
                <div className="text-[11px] text-foreground bg-linear-surface p-2 rounded border border-linear-border/50 line-clamp-2">{masterDNA.goal}</div>
              </div>
              {masterDNA.core_usps.length > 0 && (
                <div>
                  <div className="text-[9px] font-bold text-linear-text-muted uppercase mb-1">USPs</div>
                  <div className="flex flex-wrap gap-1">
                    {masterDNA.core_usps.slice(0, 4).map((usp: string, i: number) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded font-medium">{usp}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Prompt */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <div className="text-[9px] font-bold text-cyan-400 uppercase">Custom Prompt</div>
                <button 
                  onClick={() => {
                    const suggestion = `Thiết kế phong cách ${masterDNA.tone_of_voice || 'hiện đại'}, ngành ${masterDNA.industry || 'kinh doanh'}. Nổi bật: ${masterDNA.core_usps?.join(', ') || 'sáng tạo'}. Target: ${masterDNA.target_audience || 'đại chúng'}.`;
                    setPromptData({...promptData, userPrompt: suggestion});
                  }}
                  className="text-[9px] text-cyan-500 hover:text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded transition-colors"
                >
                  ✨ Auto-fill
                </button>
              </div>
              <textarea 
                className="w-full bg-linear-surface/50 p-2.5 rounded-lg border border-cyan-500/20 text-xs text-foreground focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none h-20 placeholder-slate-500 shadow-inner"
                placeholder="Ví dụ: Dark green, futuristic, tech-oriented..."
                value={promptData.userPrompt}
                onChange={(e) => setPromptData({...promptData, userPrompt: e.target.value})}
              ></textarea>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-4 w-full py-3 rounded-xl flex items-center justify-center font-bold text-white text-sm transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Palette className="w-4 h-4 mr-2" />} 
              Generate Full Suite
            </button>
            
            <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 text-red-400 p-2.5 rounded-lg flex items-start text-[11px] mt-3"
                  >
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Actions after generation */}
          {(hasVisuals || hasCaseStudy) && activeTab !== 'deck-builder' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bento-card p-4">
              <div className="text-[9px] font-bold text-emerald-400 uppercase mb-2">✅ Ready to explore</div>
              <div className="space-y-1.5">
                {hasVisuals && (
                  <button onClick={() => setActiveTab('visuals')} className={`w-full text-left text-[11px] p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'visuals' ? 'bg-cyan-500/10 text-cyan-400' : 'text-linear-text-muted hover:bg-white/5'}`}>
                    <ImageIcon className="w-3.5 h-3.5" /> Logo + Banner + Avatar
                  </button>
                )}
                {hasCaseStudy && (
                  <button onClick={() => setActiveTab('case-study')} className={`w-full text-left text-[11px] p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'case-study' ? 'bg-cyan-500/10 text-cyan-400' : 'text-linear-text-muted hover:bg-white/5'}`}>
                    <Layers className="w-3.5 h-3.5" /> Behance Case Study ({blocks.length} blocks)
                  </button>
                )}
                <button onClick={() => setActiveTab('deck-builder')} className="w-full text-left text-[11px] p-2 rounded-lg flex items-center gap-2 text-amber-400 hover:bg-amber-500/10 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" /> Generate Brand Deck →
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* ═══════════ COLUMN 2: CANVAS ═══════════ */}
        <div className="lg:col-span-6 flex flex-col overflow-y-auto no-scrollbar pb-4 relative rounded-xl border-x border-linear-border/30 px-2 select-none">
           
           {/* EMPTY STATE — Tab-specific */}
           {!loading && !result && blocks.length === 0 && activeTab !== 'deck-builder' && (
              <div className="w-full h-full p-10 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center border border-cyan-500/20">
                  {activeTab === 'visuals' ? <ImageIcon className="w-10 h-10 text-cyan-500/40" /> : <Layers className="w-10 h-10 text-cyan-500/40" />}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                   {activeTab === 'visuals' ? 'Visual Assets Canvas' : 'Behance Case Study'}
                </h3>
                <p className="text-sm text-linear-text-muted text-center max-w-md mb-6">
                   {activeTab === 'visuals' 
                      ? 'AI sẽ dùng DALL-E 3 để sinh Logo, Banner, Avatar và Brand Guidelines từ Brand DNA của bạn.' 
                      : 'AI sẽ sinh layout phong cách Behance chuyên nghiệp với Hero, Palette, Typography, Stats và nhiều hơn nữa.'}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-linear-text-muted/60">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~30-60s</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Dựa trên Brand DNA</span>
                </div>
              </div>
           )}

           {loading && (
              <div className="w-full h-full p-10 flex flex-col items-center justify-center min-h-[500px]">
                <div className="relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-16 h-16 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-500 flex items-center justify-center"
                  />
                  <Palette className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="text-base font-bold text-cyan-400 mt-6">AI đang thiết kế...</h3>
                <p className="text-xs text-linear-text-muted mt-2">DALL-E Visuals + Behance Layout chạy song song</p>
              </div>
           )}

           {/* TAB: VISUALS */}
           {!loading && result && activeTab === 'visuals' && (
              <div className="flex flex-col gap-5">
                  {/* Logo */}
                  <div className="bento-card p-0 overflow-hidden border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                     <div className="p-3.5 border-b border-linear-border flex justify-between items-center bg-linear-surface/50">
                        <div className="flex items-center font-bold text-xs text-foreground">
                          <Briefcase className="w-3.5 h-3.5 text-cyan-500 mr-2" /> Master Brand Logo
                        </div>
                        <span className="text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> AI Generated
                        </span>
                     </div>
                     <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 relative">
                        <img src={result.logo_url} alt="Logo" className="w-[60%] h-[60%] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-500" />
                     </div>
                  </div>

                  {/* Fanpage Mockup */}
                  <div className="bento-card p-0 overflow-hidden relative">
                     <div className="p-3.5 border-b border-linear-border flex justify-between items-center bg-linear-surface/50">
                        <div className="flex items-center font-bold text-xs text-foreground">
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-500 mr-2" /> Fanpage Mockup
                        </div>
                     </div>
                     <div className="aspect-[21/9] bg-slate-100 dark:bg-slate-900 relative">
                        <img src={result.banner_url} alt="Cover" className="absolute inset-0 w-full h-[60%] object-cover opacity-60 dark:opacity-40" />
                        <div className="absolute left-6 bottom-4 flex items-end">
                           <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-background overflow-hidden relative shadow-lg z-10">
                              <img src={result?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                           </div>
                           <div className="ml-4 mb-2 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-linear-border">
                              <div className="text-sm font-bold text-foreground">{masterDNA?.brand_name}</div>
                              <div className="text-[10px] text-linear-text-muted">{masterDNA?.industry || 'Category'}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Guidelines */}
                  {result?.guidelines && (
                     <div className="bento-card p-5 relative overflow-hidden">
                        <div className="flex items-center font-bold text-xs text-foreground mb-3 border-b border-linear-border/50 pb-2.5">
                           <Type className="w-3.5 h-3.5 text-cyan-500 mr-2" /> Brand Identity Guidelines
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                           <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                              {result.guidelines}
                           </pre>
                        </div>
                     </div>
                  )}
              </div>
           )}

           {/* TAB: CASE STUDY */}
           {!loading && blocks.length > 0 && activeTab === 'case-study' && (
              <div className="flex flex-col gap-5 w-full">
                  <div id="behance-export-canvas" className="w-full bg-slate-50 shadow-2xl flex flex-col overflow-hidden max-w-[1400px] mx-auto rounded-none relative">
                    {blocks.map((block) => (
                         <div key={block.id} className="relative transition-all duration-300 w-full group">
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/30 z-50 pointer-events-none transition-colors"></div>
                            {renderBlock(block)}
                         </div>
                    ))}
                  </div>
                  
                  <div className="pt-8 pb-16 flex justify-center border-t border-linear-border/30 mt-4">
                     <button onClick={handleExportPDF} className="flex items-center px-8 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all font-bold text-sm">
                        <FileText className="w-4 h-4 mr-2 text-cyan-400" />
                        Download High-Res PDF
                     </button>
                  </div>
              </div>
           )}

           {/* TAB: DECK BUILDER */}
           {activeTab === 'deck-builder' && (
             <div className="flex flex-col gap-5 w-full h-full">
               {deckSlides.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-700">
                   <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30 shadow-xl">
                     <Sparkles className="w-10 h-10 text-amber-400" />
                   </div>
                   <h2 className="text-xl font-bold text-foreground mb-2">Brand Deck Builder</h2>
                   <p className="text-linear-text-muted text-xs text-center max-w-lg mb-8">
                     AI tự sinh Brand Guideline, Pitch Deck, hoặc Proposal chuẩn enterprise.
                     Chỉnh sửa trực tiếp kiểu Canva và xuất PDF/PPTX.
                   </p>
                   
                   <div className="flex gap-3 mb-8">
                     {([
                       { key: 'brand_guideline' as const, icon: '🎨', label: 'Brand Guideline', desc: '8 slides nhận diện' },
                       { key: 'pitch_deck' as const, icon: '🚀', label: 'Pitch Deck', desc: '8 slides gọi vốn' },
                       { key: 'proposal' as const, icon: '📊', label: 'Proposal', desc: '7 slides chiến dịch' },
                     ]).map(tmpl => (
                       <button
                         key={tmpl.key}
                         onClick={() => setDeckTemplate(tmpl.key)}
                         className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[150px] ${
                           deckTemplate === tmpl.key
                             ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                             : 'border-linear-border/50 bg-background/50 hover:border-amber-500/30'
                         }`}
                       >
                         <span className="text-2xl mb-1.5">{tmpl.icon}</span>
                         <span className="text-[11px] font-bold text-foreground">{tmpl.label}</span>
                         <span className="text-[9px] text-linear-text-muted mt-0.5">{tmpl.desc}</span>
                       </button>
                     ))}
                   </div>
                   
                   <button
                     onClick={handleGenerateDeck}
                     disabled={deckLoading}
                     className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center disabled:opacity-50 disabled:hover:scale-100"
                   >
                     {deckLoading ? (
                       <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI đang thiết kế...</>
                     ) : (
                       <>Sinh Deck bằng AI <ChevronRight className="w-4 h-4 ml-2" /></>
                     )}
                   </button>
                   
                   {deckError && (
                     <div className="mt-4 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-xs flex items-center">
                       <AlertCircle className="w-4 h-4 mr-2" /> {deckError}
                     </div>
                   )}
                 </div>
               ) : (
                 <SlideEditor
                   slides={deckSlides}
                   onSlidesChange={setDeckSlides}
                   brandName={masterDNA.brand_name}
                   templateType={deckTemplate}
                 />
               )}
             </div>
           )}

        </div>

        {/* ═══════════ COLUMN 3: AGENT LOGS ═══════════ */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-4 relative">
           <div className="bento-card p-0 flex flex-col flex-1 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] relative overflow-hidden">
              <div className="p-3.5 border-b border-linear-border flex justify-between items-center bg-linear-surface/80 backdrop-blur-md shrink-0">
                 <div className="flex items-center">
                   <TerminalSquare className="w-3.5 h-3.5 text-cyan-500 mr-2" />
                   <h4 className="font-bold text-xs text-foreground tracking-wide">Agent Logs</h4>
                 </div>
                 <div className="flex items-center gap-2">
                   {agentLogs.length > 0 && (
                     <span className="text-[9px] text-linear-text-muted font-mono">{agentLogs.length} events</span>
                   )}
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                 </div>
              </div>

              <div className="flex-1 bg-linear-surface/30 p-4 overflow-y-auto no-scrollbar flex flex-col relative">
                 {agentLogs.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                     <TerminalSquare className="w-8 h-8 text-linear-text-muted/20 mb-3" />
                     <div className="text-[11px] text-linear-text-muted font-medium">Agent logs sẽ xuất hiện ở đây</div>
                     <div className="text-[9px] text-linear-text-muted/60 mt-1">Nhấn "Generate Full Suite" để bắt đầu</div>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-2">
                     {agentLogs.map(log => (
                       <div key={log.id} className={`p-2 rounded-lg text-[11px] font-mono border ${log.type === 'warn' ? 'border-amber-500/20 bg-amber-500/5 text-amber-400' : log.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-linear-border bg-background/50 text-linear-text-muted'}`}>
                          <div className="opacity-50 text-[8px] mb-0.5">[{log.time}] {log.agent}</div> 
                          <div className="font-medium">{log.text}</div>
                       </div>
                     ))}
                     <div ref={logsEndRef} />
                   </div>
                 )}
              </div>
           </div>

           {/* Quick Tips */}
           <div className="bento-card p-4 shrink-0">
             <div className="text-[9px] font-bold text-amber-400 uppercase mb-2 flex items-center gap-1">
               <Lightbulb className="w-3 h-3" /> Tips
             </div>
             <div className="space-y-1.5 text-[10px] text-linear-text-muted">
               <div className="flex items-start gap-1.5">
                 <span className="text-cyan-400 mt-0.5">•</span>
                 <span>Tab <b className="text-foreground">Visuals</b>: Logo + Banner từ DALL-E 3</span>
               </div>
               <div className="flex items-start gap-1.5">
                 <span className="text-cyan-400 mt-0.5">•</span>
                 <span>Tab <b className="text-foreground">Case Study</b>: Layout Behance + export PDF</span>
               </div>
               <div className="flex items-start gap-1.5">
                 <span className="text-amber-400 mt-0.5">•</span>
                 <span>Tab <b className="text-foreground">Brand Deck</b>: Slide editor + export PPTX</span>
               </div>
               <div className="flex items-start gap-1.5">
                 <span className="text-emerald-400 mt-0.5">•</span>
                 <span>Custom Prompt giúp kiểm soát phong cách thiết kế</span>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
