"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle, Database, Shield, Zap, Terminal } from 'lucide-react';

export default function Phase6_AgentDeploy({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window && (window as any).__DEMO_MODE__) {
      const timers = [
        setTimeout(() => setStep(1), 300),
        setTimeout(() => setStep(2), 600),
        setTimeout(() => setStep(3), 900),
        setTimeout(() => setStep(4), 1200),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setStep(4);
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col p-6 max-w-5xl mx-auto z-10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            Personal Agent Deployment
          </h2>
          <p className="text-linear-text-muted mt-1">Training custom AI with Bếp Nhà Mộc's DNA</p>
        </div>
        <button 
          id="btn-next-phase6"
          onClick={onNext}
          className={`px-6 py-2.5 rounded-lg font-bold transition-all flex items-center ${step >= 4 ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
        >
          View Final Report
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Left: Agent Config */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mr-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Mộc Assistant</h3>
              <p className="text-sm text-emerald-400">Status: {step >= 4 ? 'Online & Ready' : 'Training...'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center text-sm font-semibold text-slate-300 mb-2">
                <Database className="w-4 h-4 mr-2 text-blue-400" /> Knowledge Base Integration
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-slate-400">
                  <CheckCircle className={`w-3 h-3 mr-2 ${step >= 1 ? 'text-emerald-500' : 'text-slate-600'}`} />
                  Ingesting Product Catalog (Tables, Chairs, Cabinets)
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <CheckCircle className={`w-3 h-3 mr-2 ${step >= 2 ? 'text-emerald-500' : 'text-slate-600'}`} />
                  Learning Brand Voice (Mộc mạc, Chân thành)
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center text-sm font-semibold text-slate-300 mb-2">
                <Shield className="w-4 h-4 mr-2 text-purple-400" /> Behavior Guardrails
              </div>
              <div className="flex items-center text-xs text-slate-400">
                <CheckCircle className={`w-3 h-3 mr-2 ${step >= 3 ? 'text-emerald-500' : 'text-slate-600'}`} />
                Tone: Warm, welcoming, respectful
              </div>
              <div className="flex items-center text-xs text-slate-400 mt-2">
                <CheckCircle className={`w-3 h-3 mr-2 ${step >= 3 ? 'text-emerald-500' : 'text-slate-600'}`} />
                Prohibited: Over-promising delivery times
              </div>
            </div>
          </div>
        </div>

        {/* Right: Agent Terminal / Testing */}
        <div className="bg-black/80 border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="flex items-center text-teal-400 font-mono text-sm mb-4">
            <Terminal className="w-4 h-4 mr-2" /> Agent Test Console
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {step >= 3 && (
              <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="self-end bg-slate-800 text-slate-300 px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[80%]">
                Bên bạn có nhận làm tủ bếp bằng gỗ sồi không? Báo giá cho mình với.
              </motion.div>
            )}
            
            {step >= 4 && (
              <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="self-start bg-emerald-900/40 border border-emerald-800/50 text-emerald-100 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] leading-relaxed">
                Dạ, chào anh/chị. Bếp Nhà Mộc chuyên thi công tủ bếp gỗ sồi Nga và sồi Mỹ nguyên khối với thiết kế mộc mạc, đề cao giá trị tự nhiên. 
                <br/><br/>
                Anh/chị có thể cho Mộc xin thêm kích thước sơ bộ của gian bếp để Mộc tư vấn và gửi bảng dự toán chi tiết nhất nhé. Mộc cảm ơn ạ! 🌿
              </motion.div>
            )}

            {step < 4 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center text-slate-500">
                  <Zap className={`w-8 h-8 mb-2 ${step >= 2 ? 'text-teal-500 animate-pulse' : ''}`} />
                  <span className="text-xs font-mono uppercase tracking-widest">
                    {step < 2 ? 'Initializing Core...' : 'Vectorizing DNA...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
