import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ShieldAlert, Bot, ArrowRight, Sparkles, Target, BarChart3, Cpu, Zap } from 'lucide-react';

const AGENT_STYLES = {
  SYSTEM: { 
    name: 'HỆ THỐNG', icon: Cpu, 
    bg: 'bg-[#0075FF]', ring: 'ring-[#0075FF]/30', 
    bubbleBg: 'bg-gradient-to-r from-[#0075FF]/20 to-[#111C44] border border-[#0075FF]/30',
    textColor: 'text-[#88b6ff]', labelColor: 'text-[#0075FF]',
    align: 'justify-center',
  },
  CMO: { 
    name: 'CMO', icon: Sparkles, 
    bg: 'bg-emerald-500', ring: 'ring-emerald-500/30', 
    bubbleBg: 'bg-[#1B254B] border border-emerald-500/20',
    textColor: 'text-white', labelColor: 'text-emerald-400',
    align: 'justify-start',
  },
  CFO: { 
    name: 'CFO', icon: ShieldAlert, 
    bg: 'bg-amber-500', ring: 'ring-amber-500/30', 
    bubbleBg: 'bg-[#0B1437] border border-amber-500/20',
    textColor: 'text-white', labelColor: 'text-amber-400',
    align: 'justify-end',
  },
  PERSONA: { 
    name: 'PERSONA', icon: Target, 
    bg: 'bg-purple-500', ring: 'ring-purple-500/30', 
    bubbleBg: 'bg-[#1B254B] border border-purple-500/20',
    textColor: 'text-white', labelColor: 'text-purple-400',
    align: 'justify-start',
  },
};

function TypingIndicator({ agent }) {
  const style = AGENT_STYLES[agent] || AGENT_STYLES.SYSTEM;
  return (
    <div className={`flex w-full ${style.align} animate-fadeIn`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${style.bg} shadow-lg`}>
          <style.icon size={14} className="text-white" />
        </div>
        <div className="bg-[#1B254B] rounded-2xl px-5 py-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#A0AEC0] animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-[#A0AEC0] animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-[#A0AEC0] animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg, idx }) {
  const style = AGENT_STYLES[msg.sender] || AGENT_STYLES.SYSTEM;
  const isSystem = msg.sender === 'SYSTEM';
  const isCFO = msg.sender === 'CFO';

  return (
    <div className={`flex w-full ${style.align} animate-slideUp`} style={{ animationDelay: `${idx * 80}ms` }}>
      <div className={`max-w-[85%] flex ${isCFO ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center ${style.bg} shadow-lg shrink-0 ${!isSystem ? 'ring-4 ' + style.ring : ''}`}>
          <style.icon size={16} className="text-white" />
        </div>
        <div className={`flex flex-col ${isCFO ? 'items-end' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-black uppercase tracking-widest ${style.labelColor}`}>{style.name}</span>
            {msg.role && msg.role !== style.name && <span className="text-[10px] text-[#A0AEC0] font-medium">• {msg.role}</span>}
          </div>
          <div className={`px-5 py-3.5 text-sm leading-relaxed rounded-2xl ${style.bubbleBg} ${style.textColor} ${isSystem ? 'rounded-xl italic text-center' : isCFO ? 'rounded-tr-sm' : 'rounded-tl-sm'} shadow-lg`}>
            {msg.text}
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineStep({ label, icon: Icon, isActive, isDone, step }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${isActive ? 'bg-[#0075FF]/20 border border-[#0075FF]/50 shadow-[0_0_20px_rgba(0,117,255,0.2)]' : isDone ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-[#0B1437] border border-[#1B254B] opacity-40'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-500 ${isActive ? 'bg-[#0075FF] text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-[#1B254B] text-[#A0AEC0]'}`}>
        {isDone ? '✓' : step}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[11px] font-black uppercase tracking-wider truncate ${isActive ? 'text-[#0075FF]' : isDone ? 'text-emerald-400' : 'text-[#A0AEC0]'}`}>{label}</div>
      </div>
      <Icon size={14} className={`${isActive ? 'text-[#0075FF] animate-spin' : isDone ? 'text-emerald-400' : 'text-[#1B254B]'}`} />
    </div>
  );
}

export default function ScreenSimulation({ iteration, feedback, isReady, error, onComplete, agentLogs, onFallback, onRetry }) {
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState([]);
  const [activeAgent, setActiveAgent] = useState('SYSTEM');
  const [showDoneBtn, setShowDoneBtn] = useState(false);
  const [typingAgent, setTypingAgent] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (error) return; // Dừng progress nếu có lỗi
    if (progress >= 100) return;
    const timer = setInterval(() => {
      setProgress(p => {
        if (!isReady && p >= 85) return 85; 
        if (isReady && p >= 100) return 100;
        return p + (isReady ? 5 : 0.8);
      });
    }, 150);
    return () => clearInterval(timer);
  }, [isReady, progress]);

  useEffect(() => {
    if (isReady) return;
    setMessages([]);
    setProgress(0);
    setShowDoneBtn(false);
    setCurrentStep(0);
    const loadingMsgs = iteration === 1 ? [
      { sender: 'SYSTEM', role: 'Neural Control', text: '🧠 Khởi tạo Neural Synergy Chamber... Thiết lập đa nhân.', delay: 400, step: 1 },
      { sender: 'SYSTEM', role: 'ChromaDB', text: '📡 Trích xuất Brand DNA & Đối soát dữ liệu RAG...', delay: 1800, step: 1 },
      { sender: 'CMO', role: 'Marketing Strategy', text: '👋 CMO đã online. Đang phác thảo chiến lược sơ bộ...', delay: 3500, step: 2 },
    ] : [
      { sender: 'SYSTEM', role: 'Neural Control', text: `📋 Nhận Feedback: "${feedback}". Đang tái cấu trúc...`, delay: 500, step: 2 },
      { sender: 'CMO', role: 'Marketing Strategy', text: '🔄 Đang cập nhật roadmap theo yêu cầu của Sếp...', delay: 2000, step: 2 },
    ];
    let timers = [];
    loadingMsgs.forEach(msg => {
      timers.push(setTimeout(() => { setTypingAgent(msg.sender); setActiveAgent(msg.sender); setCurrentStep(msg.step); }, msg.delay - 600));
      timers.push(setTimeout(() => { setTypingAgent(null); setMessages(prev => [...prev, msg]); setActiveAgent(msg.sender); }, msg.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [isReady, iteration, feedback]);

  useEffect(() => {
    if (!isReady) return;
    if (error) { setShowDoneBtn(false); return; }
    let timers = [];
    let delayOffset = 800;
    if (agentLogs && agentLogs.length > 0) {
      agentLogs.forEach((log) => {
        const sender = log.agent === 'PERSONA' ? 'PERSONA' : log.agent;
        timers.push(setTimeout(() => { 
          setTypingAgent(sender); setActiveAgent(sender);
          if (sender === 'CMO') setCurrentStep(2);
          else if (sender === 'SYSTEM') setCurrentStep(3);
          else if (sender === 'CFO') setCurrentStep(4);
          else if (sender === 'PERSONA') setCurrentStep(4);
        }, delayOffset));
        timers.push(setTimeout(() => { setTypingAgent(null); setMessages(prev => [...prev, { sender, role: log.role || 'Expert', text: log.message }]); setActiveAgent(sender); }, delayOffset + 1200));
        delayOffset += 2800;
      });
    }
    timers.push(setTimeout(() => { setTypingAgent(null); setProgress(100); setCurrentStep(5); setActiveAgent('SYSTEM'); setMessages(prev => [...prev, { sender: 'SYSTEM', role: 'Hệ thống', text: '✅ Các Agent đã thông qua. Kế hoạch đã sẵn sàng!' }]); setShowDoneBtn(true); }, delayOffset + 1000));
    return () => timers.forEach(clearTimeout);
  }, [isReady, agentLogs, error]);

  const endOfMessagesRef = useRef(null);
  useEffect(() => { endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typingAgent]);

  const pipelineSteps = [
    { label: 'KHỞI TẠO NEURAL', icon: Cpu },
    { label: 'MASTER PLANNER (AI)', icon: Sparkles },
    { label: 'KIỂM TOÁN TÀI CHÍNH', icon: BarChart3 },
    { label: 'PERSONA VALIDATION', icon: Target },
    { label: 'XUẤT BẢN', icon: Zap },
  ];

  return (
    <div className="h-full bg-transparent flex flex-col lg:flex-row items-stretch justify-center p-4 md:p-6 gap-6 font-sans">
      <div className="w-full lg:w-[320px] flex flex-col items-center justify-center shrink-0">
        <h3 className="text-white font-black text-xl mb-1 tracking-tight">Strategy Chamber</h3>
        <p className="text-[#A0AEC0] text-[10px] font-mono uppercase mb-8 opacity-60">Neural Synergy v1.2</p>
        
        <div className="relative w-64 h-64 mx-auto mb-10">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="#1B254B" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
            {activeAgent === 'CMO' && <line x1="10" y1="50" x2="50" y2="10" stroke="#10b981" strokeWidth="2.5" className="animate-pulse" />}
            {activeAgent === 'CFO' && <line x1="90" y1="50" x2="50" y2="10" stroke="#f59e0b" strokeWidth="2.5" className="animate-pulse" />}
            {activeAgent === 'PERSONA' && <line x1="50" y1="90" x2="10" y2="50" stroke="#a855f7" strokeWidth="2.5" className="animate-pulse" />}
            {activeAgent === 'SYSTEM' && <path d="M50,10 L90,50 L50,90 L10,50 Z" stroke="#0075FF" strokeWidth="1.5" className="animate-pulse" opacity="0.4" />}
          </svg>
          <div className={`absolute top-0 left-1/2 -ml-8 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shadow-xl transition-all duration-500 ${activeAgent === 'SYSTEM' ? 'bg-[#0075FF] border-[#0075FF] ring-8 ring-[#0075FF]/20 scale-110 z-20' : 'bg-[#111C44] border-[#1B254B] z-10'}`}><Cpu className="text-white" size={20}/><span className="text-[7px] font-black text-white uppercase mt-1">SYS</span></div>
          <div className={`absolute top-1/2 left-0 -mt-8 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shadow-xl transition-all duration-500 ${activeAgent === 'CMO' ? 'bg-emerald-500 border-emerald-500 ring-8 ring-emerald-500/20 scale-110 z-20' : 'bg-[#111C44] border-[#1B254B] z-10'}`}><Sparkles className="text-white" size={20}/><span className="text-[7px] font-black text-white uppercase mt-1">CMO</span></div>
          <div className={`absolute top-1/2 right-0 -mt-8 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shadow-xl transition-all duration-500 ${activeAgent === 'CFO' ? 'bg-amber-500 border-amber-500 ring-8 ring-amber-500/20 scale-110 z-20' : 'bg-[#111C44] border-[#1B254B] z-10'}`}><ShieldAlert className="text-white" size={20}/><span className="text-[7px] font-black text-white uppercase mt-1">CFO</span></div>
          <div className={`absolute bottom-0 left-1/2 -ml-8 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shadow-xl transition-all duration-500 ${activeAgent === 'PERSONA' ? 'bg-purple-500 border-purple-500 ring-8 ring-purple-500/20 scale-110 z-20' : 'bg-[#111C44] border-[#1B254B] z-10'}`}><Target className="text-white" size={20}/><span className="text-[7px] font-black text-white uppercase mt-1">UX</span></div>
        </div>

        <div className="w-full space-y-2 mb-8">{pipelineSteps.map((step, i) => <PipelineStep key={i} label={step.label} icon={step.icon} step={i + 1} isActive={currentStep === i + 1} isDone={currentStep > i + 1} />)}</div>

        <div className="w-full px-2">
          <div className="flex justify-between text-[10px] text-[#A0AEC0] font-mono mb-2 uppercase tracking-tighter">
            <span>{error ? 'System Error' : 'Neural Loading'}</span>
            <span className={error ? 'text-rose-400' : progress >= 100 ? 'text-emerald-400' : 'text-[#0075FF]'}>{error ? 'FAILED' : `${Math.round(progress)}%`}</span>
          </div>
          <div className="w-full h-2 bg-[#0B1437] rounded-full overflow-hidden border border-[#1B254B]">
            <div className={`h-full transition-all duration-500 ${error ? 'bg-rose-500' : progress >= 100 ? 'bg-emerald-500' : 'bg-[#0075FF]'}`} style={{width: `${error ? 100 : progress}%`}}></div>
          </div>
          
          {error && (
            <div className="mt-6 flex flex-col space-y-4 animate-fadeIn">
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="text-rose-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-semibold text-rose-300 leading-relaxed">{error}</p>
              </div>
              
              <button onClick={onFallback} className="w-full py-3 border border-[#0075FF]/40 text-[#0075FF] hover:bg-[#0075FF]/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                Dùng Dữ Liệu Mẫu (Mock) <ArrowRight className="inline ml-1" size={14} />
              </button>
              
              <button onClick={onRetry} className="w-full py-3.5 bg-gradient-to-r from-[#1B254B] to-[#25326b] hover:from-[#25326b] hover:to-[#36499c] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center hover:scale-[1.02] transition-all"> 
                Quay Trở Lại
              </button>
            </div>
          )}

          {!error && showDoneBtn && <button onClick={onComplete} className="mt-8 w-full py-4 bg-gradient-to-r from-[#0075FF] to-[#0055c4] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center hover:scale-[1.02] transition-all"> Xem bản kế hoạch v{iteration} <ArrowRight className="ml-2" size={16} /></button>}
        </div>
      </div>

      <div className="flex-1 min-h-[500px] h-[650px] bg-[#111C44] rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-[#1B254B]">
        <div className="bg-[#0B1437] px-6 py-4 border-b border-[#1B254B] flex items-center justify-between">
          <h2 className="text-white font-black text-xs tracking-widest uppercase flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live Board</h2>
          <span className="text-[10px] text-[#A0AEC0] font-mono">SECURE SYNERGY CONNECTION</span>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {messages.map((msg, idx) => <ChatBubble key={idx} msg={msg} idx={idx} />)}
          {typingAgent && <TypingIndicator agent={typingAgent} />}
          <div ref={endOfMessagesRef} className="h-2" />
        </div>
        <div className="bg-[#0B1437]/50 px-6 py-3 border-t border-[#1B254B] text-center"><span className="text-[9px] text-[#A0AEC0] font-mono uppercase tracking-[0.2em]">{typingAgent ? 'Sychronizing Neural Patterns...' : 'Encrypted Link Active'}</span></div>
      </div>
    </div>
  );
}
