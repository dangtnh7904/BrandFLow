"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Terminal, BrainCircuit, LineChart, Send, CheckCircle, Database, ClipboardList, Brain, Calculator, Sparkles, FileEdit } from 'lucide-react';

const CursorSVG = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))'}}>
    <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 00-.85.36z" fill="white" stroke="black" strokeWidth="1.5"/>
  </svg>
);

export default function DemoSolutionsPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'sol1';
  
  const [phase, setPhase] = useState(-1);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [inputText, setInputText] = useState("");
  const [activeProductStep, setActiveProductStep] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  
  const moveCursor = async (x: number, y: number, duration = 800) => {
    return new Promise<void>(resolve => {
      const startX = cursorPos.x < 0 ? window.innerWidth / 2 : cursorPos.x;
      const startY = cursorPos.y < 0 ? window.innerHeight : cursorPos.y;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCursorPos({ x: startX + (x - startX) * ease, y: startY + (y - startY) * ease });
        if (progress < 1) requestAnimationFrame(animate); else resolve();
      };
      requestAnimationFrame(animate);
    });
  };
  
  const clickCursor = async () => {
    setIsClicking(true); await sleep(150); setIsClicking(false); await sleep(200);
  };

  const typeText = async (text: string) => {
    for (let i = 0; i <= text.length; i++) {
      setInputText(text.slice(0, i));
      await sleep(30 + Math.random() * 40);
    }
    await sleep(300);
  };

  useEffect(() => {
    let isCancelled = false;

    const runSol1 = async () => {
      setPhase(0);
      setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight });
      await sleep(500);
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        await moveCursor(rect.left + 50, rect.top + rect.height / 2, 800);
        await clickCursor();
        await typeText("Mở quán cafe specialty tại Quận 1, bán cho Gen Z");
      }
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        await moveCursor(rect.left + rect.width / 2, rect.top + rect.height / 2, 400);
        await clickCursor();
      }
      setCursorPos({ x: -100, y: -100 });
      setPhase(1); 
      await sleep(6000);
    };

    const runSol2 = async () => {
      setPhase(2); 
      await sleep(10000);
    };

    const runSol3 = async () => {
      setPhase(3); 
      await sleep(10000);
    };

    const runProduct = async () => {
      setPhase(4);
      await sleep(1000);
      // Sequentially highlight the 5 pillars
      for(let i=0; i<5; i++) {
        if(isCancelled) return;
        setActiveProductStep(i);
        await sleep(2500); // 2.5s per pillar
      }
      setActiveProductStep(5); // all active
      await sleep(3000);
    };

    if (mode === 'sol1') runSol1();
    else if (mode === 'sol2') runSol2();
    else if (mode === 'sol3') runSol3();
    else if (mode === 'product') runProduct();

    return () => { isCancelled = true; };
  }, [mode]);

  return (
    <div className="min-h-screen bg-[#021024] text-white font-sans overflow-hidden relative">
      <div 
        style={{
          position: 'fixed', left: cursorPos.x, top: cursorPos.y, zIndex: 99999,
          pointerEvents: 'none', transition: 'transform 0.1s',
          transform: `translate(-4px, -4px) scale(${isClicking ? 0.8 : 1})`,
          opacity: cursorPos.y < 0 ? 0 : 1
        }}
      >
        <CursorSVG />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0c3166] via-[#021024] to-[#021024] opacity-50 pointer-events-none" />

      {/* SOL 1 */}
      {mode === 'sol1' && (
         <div className="relative w-full h-screen flex flex-col items-center justify-center p-12">
            {/* Same as before */}
            {phase === 0 && (
            <div className="w-full max-w-3xl scale-up-center relative">
               <h1 className="text-5xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                 Giải quyết: SME Không Có Marketing
               </h1>
               <div className="relative">
                 <input 
                   ref={inputRef} type="text" value={inputText} readOnly
                   className="w-full bg-slate-900/80 border border-cyan-500 rounded-2xl py-6 pl-8 pr-32 text-2xl text-white shadow-[0_0_50px_rgba(6,182,212,0.3)] glassmorphism outline-none"
                   placeholder="Nhập 1 câu ý tưởng..."
                 />
                 <button ref={btnRef} className="absolute right-3 top-3 bottom-3 bg-cyan-600 rounded-xl px-8 font-bold flex items-center gap-2">
                   <Send className="w-5 h-5" /> Generate
                 </button>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-white/[0.02] uppercase whitespace-nowrap pointer-events-none z-0">
                 NO AGENCY NEEDED
               </div>
            </div>
          )}
          {phase === 1 && (
            <div className="w-full max-w-5xl scale-up-center">
              <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] glassmorphism relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <CheckCircle className="text-emerald-400" /> Master Strategy Generated
                </h2>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { t: 'Brand DNA', c: 'Vision & Mission' },
                    { t: 'Target Audience', c: 'Gen Z, 18-24' },
                    { t: 'Budget Alloc', c: '50M / Month' }
                  ].map((x, i) => (
                    <div key={i} className={`bg-slate-800 p-6 rounded-2xl border border-slate-700 fade-in delay-${i*100}`}>
                      <h3 className="text-slate-400 text-sm">{x.t}</h3>
                      <p className="text-2xl font-bold text-white mt-2">{x.c}</p>
                    </div>
                  ))}
                  <div className="col-span-3 h-32 bg-slate-800 rounded-2xl border border-slate-700 mt-2 fade-in delay-300 relative overflow-hidden">
                     <div className="absolute inset-y-0 left-0 bg-emerald-500/20 w-1/3 border-r border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">Phase 1: Launching</div>
                     <div className="absolute inset-y-0 left-1/3 bg-cyan-500/20 w-2/3 flex items-center justify-center text-cyan-400 font-bold">Phase 2: Scale</div>
                  </div>
                </div>
              </div>
            </div>
          )}
         </div>
      )}

      {/* SOL 2 */}
      {mode === 'sol2' && (
         <div className="relative w-full h-screen flex flex-col items-center justify-center p-12">
            {phase === 2 && (
            <div className="w-full max-w-4xl flip-in-3d">
               <h1 className="text-5xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                 Giải quyết: Thuê Agency Đắt Đỏ
               </h1>
               <div className="bg-slate-900/90 border border-slate-700 p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-3xl relative overflow-hidden glassmorphism">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg">
                      <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-mono text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase tracking-widest">Mandatory Debate System</span>
                  </div>
                  <span className="px-4 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-full font-bold animate-pulse border border-purple-500/50">
                    EXPERT REASONING
                  </span>
                </div>

                <div className="space-y-6 font-sans text-xl">
                  <div className="flex gap-4 items-start slide-in-left">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
                      <span className="font-bold text-purple-400">CMO</span>
                    </div>
                    <div>
                      <div className="text-slate-200 bg-slate-800/80 p-5 rounded-2xl rounded-tl-none border border-slate-700">
                        Nên đốt 100% ngân sách vào TikTok Ads 3 ngày đầu để phủ sóng.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start justify-end slide-in-right delay-200">
                    <div className="text-right">
                      <div className="text-slate-200 bg-cyan-900/30 p-5 rounded-2xl rounded-tr-none border border-cyan-500/30 text-left inline-block">
                        <span className="text-cyan-400 font-bold">X CFO Phản đối.</span> Đốt tiền Ads mà không có tệp Lookalike là lãng phí. ROAS dự kiến âm 60%. Đề nghị dồn 80% vào Local SEO & Maps để ăn khách tự nhiên xung quanh bán kính 2km.
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shrink-0">
                      <span className="font-bold text-cyan-400">CFO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
         </div>
      )}

      {/* SOL 3 */}
      {mode === 'sol3' && (
         <div className="relative w-full h-screen flex flex-col items-center justify-center p-12">
             {phase === 3 && (
            <div className="w-full max-w-6xl h-[600px] flex flex-col items-center">
              <h1 className="text-5xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                 Giải quyết: AI Ảo Giác Số Liệu
               </h1>
              <div className="w-full flex gap-8 h-full">
                {/* Code Panel */}
                <div className="w-1/2 h-full bg-[#0D1117] border border-slate-800 rounded-3xl p-6 font-mono text-sm overflow-hidden shadow-2xl relative slide-in-left">
                   <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
                   <div className="flex items-center gap-2 mb-4">
                     <Database className="text-blue-400 w-5 h-5"/>
                     <span className="text-blue-400 font-bold">Python Math Engine</span>
                   </div>
                   <div className="text-slate-300 space-y-2 opacity-80 code-scroll">
                     <p><span className="text-pink-400">import</span> pandas <span className="text-pink-400">as</span> pd</p>
                     <p><span className="text-pink-400">def</span> <span className="text-blue-300">calc_roi</span>(budget, cpa):</p>
                     <p className="pl-4">expected_users = budget / cpa</p>
                     <p className="pl-4">margin = <span className="text-orange-300">0.35</span></p>
                     <p className="pl-4"><span className="text-pink-400">return</span> expected_users * margin * <span className="text-orange-300">100000</span></p>
                     <br/>
                     <p>budget_total = <span className="text-orange-300">50000000</span></p>
                     <p>local_cpa = <span className="text-orange-300">25000</span></p>
                     <p className="text-emerald-400 font-bold">&gt; running solver...</p>
                     <p className="text-emerald-400 font-bold">&gt; calculating LTV...</p>
                     <p className="text-emerald-400 font-bold">&gt; Anti-hallucination layer: PASS</p>
                   </div>
                </div>

                {/* UI Panel */}
                <div className="w-1/2 h-full bg-slate-900/90 border border-slate-700 rounded-3xl p-8 glassmorphism shadow-2xl slide-in-right delay-200">
                   <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
                     <LineChart className="text-emerald-400 w-8 h-8" /> 100% Data Backed
                   </h2>
                   <div className="space-y-6">
                      <div className="bg-slate-800 p-5 rounded-2xl border-l-4 border-l-blue-500">
                        <div className="text-slate-400 text-sm">Total Approved Budget</div>
                        <div className="text-4xl font-bold text-white mt-1">50,000,000 đ</div>
                      </div>
                      <div className="bg-slate-800 p-5 rounded-2xl border-l-4 border-l-emerald-500">
                        <div className="text-slate-400 text-sm">Target CPA (Cost Per Acquisition)</div>
                        <div className="text-4xl font-bold text-white mt-1">25,000 đ</div>
                      </div>
                      <div className="bg-slate-800 p-5 rounded-2xl border-l-4 border-l-purple-500">
                        <div className="text-slate-400 text-sm">Contribution Margin</div>
                        <div className="text-4xl font-bold text-white mt-1">35%</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
         </div>
      )}

      {/* PRODUCT SLIDE: 5 Pillars */}
      {mode === 'product' && phase === 4 && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center px-12 perspective-[2000px]">
           <h1 className="text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(100,200,255,0.5)] fade-in">
             The Marketing OS
           </h1>
           
           <div className="flex items-center justify-center gap-6 w-full max-w-[1800px]">
             {[
               { id: 0, title: 'Intake', subtitle: 'Data Extraction', icon: ClipboardList },
               { id: 1, title: 'Strategy', subtitle: 'G-STIC Framework', icon: Brain },
               { id: 2, title: 'Math', subtitle: 'Financial Control', icon: Calculator },
               { id: 3, title: 'Design', subtitle: 'Brand Guidelines', icon: Sparkles },
               { id: 4, title: 'Content', subtitle: 'Copywriting Lab', icon: FileEdit }
             ].map((pillar) => {
               const isActive = activeProductStep === pillar.id || activeProductStep === 5;
               const isPast = activeProductStep > pillar.id;
               return (
                 <div 
                   key={pillar.id}
                   className={`
                     relative w-64 h-80 rounded-3xl border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                     flex flex-col
                     ${isActive ? 'scale-110 border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.4)] z-10 bg-gradient-to-b from-[#0a2046] to-[#041028]' : 'scale-90 border-[#1a386b] opacity-60 bg-[#061530]'}
                     ${activeProductStep === -1 ? 'translate-y-[100px] opacity-0' : 'translate-y-0'}
                   `}
                   style={{
                     transitionDelay: activeProductStep === -1 ? `${pillar.id * 100}ms` : '0ms'
                   }}
                 >
                    {/* Header */}
                    <div className={`
                      h-16 flex items-center justify-center rounded-t-3xl border-b transition-colors duration-500
                      ${isActive ? 'bg-[#0f2c5e] border-cyan-500/50' : 'bg-[#0a1e45] border-[#1a386b]'}
                    `}>
                       <h3 className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                         {pillar.title}
                       </h3>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                       {/* Icon Glow */}
                       {isActive && (
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full" />
                       )}
                       
                       <pillar.icon 
                         className={`w-24 h-24 mb-6 transition-all duration-500 ${isActive ? 'text-cyan-300 filter drop-shadow-[0_0_10px_rgba(103,232,249,0.8)]' : 'text-[#4770ab]'}`} 
                         strokeWidth={isActive ? 1.5 : 1}
                       />
                       
                       <p className={`text-center font-semibold text-lg transition-colors duration-500 ${isActive ? 'text-cyan-100' : 'text-[#4770ab]'}`}>
                         {pillar.subtitle}
                       </p>
                    </div>

                    {/* Connecting Line (except last) */}
                    {pillar.id < 4 && (
                      <div className={`
                        absolute top-1/2 -right-6 w-6 h-[2px] -translate-y-1/2 transition-colors duration-500
                        ${isPast ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]' : 'bg-[#1a386b]'}
                      `} />
                    )}
                 </div>
               );
             })}
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .glassmorphism { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
        .slide-in-left { animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .slide-in-right { animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .scale-up-center { animation: scaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform-origin: center; }
        .flip-in-3d { animation: flipIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform-origin: center; perspective: 1000px; }
        .code-scroll p { animation: typeCode 0.1s steps(40, end) forwards; opacity: 0; }
        .code-scroll p:nth-child(1) { animation-delay: 0.1s; }
        .code-scroll p:nth-child(2) { animation-delay: 0.2s; }
        .code-scroll p:nth-child(3) { animation-delay: 0.3s; }
        .code-scroll p:nth-child(4) { animation-delay: 0.4s; }
        .code-scroll p:nth-child(5) { animation-delay: 0.5s; }
        .code-scroll p:nth-child(7) { animation-delay: 0.6s; }
        .code-scroll p:nth-child(8) { animation-delay: 0.7s; }
        .code-scroll p:nth-child(9) { animation-delay: 1.5s; }
        .code-scroll p:nth-child(10) { animation-delay: 2.0s; }
        .code-scroll p:nth-child(11) { animation-delay: 2.5s; }

        .delay-100 { animation-delay: 0.2s; }
        .delay-200 { animation-delay: 0.4s; }
        .delay-300 { animation-delay: 0.6s; }
        
        @keyframes typeCode { to { opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.8) translateY(20px); opacity: 0; filter: blur(10px); } to { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); } }
        @keyframes flipIn { from { transform: rotateX(-30deg) translateY(50px) scale(0.9); opacity: 0; } to { transform: rotateX(0deg) translateY(0) scale(1); opacity: 1; } }
      `}} />
    </div>
  );
}
