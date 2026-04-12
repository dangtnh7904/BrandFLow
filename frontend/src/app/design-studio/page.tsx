"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, AlertCircle, RefreshCw, CheckCircle2, Image as ImageIcon, Briefcase, Zap, AlertTriangle, Send } from 'lucide-react';

const MOCK_DNA = {
  "industry": "Mỹ phẩm Chăm sóc da Hữu cơ Hạng sang",
  "core_usps": [
    "Chiết xuất 100% thảo mộc rừng rậm Amazon",
    "Thuần chay, Không thử nghiệm trên động vật"
  ],
  "target_audience_insights": [
    "Phụ nữ 30-45 tuổi, có thu nhập rất cao",
    "Yêu thiên nhiên nhưng rất sành điệu và kén chọn thẩm mỹ"
  ],
  "tone_of_voice": "Quyến rũ, Mỏng manh, Sang trọng, Thượng lưu",
  "strict_rules": [
    "KHÔNG dùng font chữ béo hoặc quá rối rắm",
    "KHÔNG dùng màu chói (Neon). BẮT BUỘC dùng tone đất (Earth tone) phối với Vàng Gold",
    "Phải có khoảng trắng (Negative Space) rộng để tạo cảm giác đắt tiền"
  ]
};

export default function DesignStudioPage() {
  const [dnaInput, setDnaInput] = useState(JSON.stringify(MOCK_DNA, null, 2));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [revising, setRevising] = useState(false);

  const generateAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const payload = JSON.parse(dnaInput);

      const response = await fetch("http://localhost:8000/api/v1/design/generate-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối hoặc API Key bị thiếu");
      }

      const resData = await response.json();
      if (resData.status === "error") {
        throw new Error(resData.message);
      }

      setResult(resData.data);
    } catch (err: any) {
      setError(err.message || "Failed to generate assets");
    } finally {
      setLoading(false);
    }
  };

  const reviseAssets = async () => {
    if (!feedbackInput.trim() || !result) return;
    try {
      setRevising(true);
      setError(null);

      const payload = {
        original_request: JSON.parse(dnaInput),
        original_output: result,
        user_feedback: feedbackInput
      };

      const response = await fetch("http://localhost:8000/api/v1/design/revise-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối hoặc API Key bị thiếu");
      }

      const resData = await response.json();
      if (resData.status === "error") {
        throw new Error(resData.message);
      }

      setResult(resData.data);
      setFeedbackInput("");
    } catch (err: any) {
      setError(err.message || "Failed to revise assets");
    } finally {
      setRevising(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar relative bg-slate-50">

      {/* Header Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 rounded-b-[40px] shadow-xl z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col px-8 py-10 max-w-7xl mx-auto w-full min-h-full">

        {/* Title Area */}
        <div className="mb-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 mb-2"
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Palette className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">AI Design Studio</h1>
              <p className="text-blue-200 mt-1">Autonomous Brand Asset Generation with DALL-E 3</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: DNA DNA Configurator */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-fuchsia-500" />
                  Brand DNA Input
                </h2>
              </div>

              <p className="text-sm text-slate-500 mb-4">
                Chỉnh sửa DNA doanh nghiệp dưới dạng JSON để AI phân tích và dịch thành ngôn ngữ hình ảnh.
              </p>

              <div className="relative group">
                <textarea
                  className="w-full h-80 bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-inner transition-all resize-none"
                  value={dnaInput}
                  onChange={e => setDnaInput(e.target.value)}
                  spellCheck={false}
                />
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setDnaInput(JSON.stringify(MOCK_DNA, null, 2))}
                    className="px-2 py-1 bg-white/10 text-white rounded text-[10px] uppercase font-bold hover:bg-white/20"
                  >Reset Mẫu</button>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={generateAssets}
                  disabled={loading}
                  className="w-full py-4 rounded-xl flex items-center justify-center font-bold text-white transition-all overflow-hidden relative group cursor-pointer disabled:cursor-not-allowed"
                  style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)' }}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Đang phân tích & vẽ...
                    </span>
                  ) : (
                    <span className="flex items-center relative z-10">
                      <Zap className="w-5 h-5 mr-2" />
                      Khởi Tạo Bộ Nhận Diện
                    </span>
                  )}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start shadow-sm"
                >
                  <AlertTriangle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Visual Result */}
          <div className="lg:col-span-8 flex flex-col">

            {loading || revising ? (
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 shadow-sm border border-slate-200 border-dashed flex-1 flex flex-col items-center justify-center text-slate-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="w-24 h-24 mb-6 rounded-full border-4 border-dashed border-slate-300 border-t-fuchsia-500"
                />
                <h3 className="text-xl font-bold text-slate-700 animate-pulse">AI Agent đang suy luận...</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-md text-center">
                  Quá trình này bao gồm việc dịch DNA sang Visual Language, chèn Guardrails và gọi DALL-E 3 để kết xuất hình ảnh. Quá trình mất khoảng 15-30 giây.
                </p>
              </div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-8"
              >
                {/* Visual Tokens Board */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-wrap lg:flex-nowrap gap-6 items-center">
                  <div className="flex-1 shrink-0">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Visual Language</p>
                    <h3 className="text-xl font-bold text-slate-800">{result.visual_language.visual_style}</h3>
                    <p className="text-sm text-slate-500 mt-1">{result.visual_language.mood}</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200 hidden lg:block"></div>
                  <div className="flex gap-2">
                    {result.visual_language.primary_colors.map((color: string, idx: number) => (
                      <div key={idx} className="flex flex-col items-center group">
                        <div
                          className="w-12 h-12 rounded-full shadow-inner border border-slate-200 hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] font-mono text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Logo */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group flex flex-col h-full">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 text-slate-400 mr-2" />
                        <h4 className="font-bold text-slate-700">Official Logo</h4>
                      </div>
                      <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Generated
                      </span>
                    </div>
                    <div className="aspect-square bg-slate-100 flex items-center justify-center p-8 relative overflow-hidden flex-1">
                      <img src={result.logo_url} alt="Logo" className="w-full h-full object-contain rounded-xl shadow-lg border border-slate-200 group-hover:scale-[1.02] transition-transform duration-500" />
                       <div className="absolute bottom-2 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 backdrop-blur-sm p-2 flex text-[9px] font-mono rounded shadow-lg border border-slate-200 line-clamp-2 max-h-12 overflow-hidden text-slate-600">
                               &gt; {result.logo_prompt}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fanpage Avatar */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group flex flex-col h-full">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center">
                        <ImageIcon className="w-4 h-4 text-slate-400 mr-2" />
                        <h4 className="font-bold text-slate-700">Fanpage Avatar</h4>
                      </div>
                    </div>
                    <div className="aspect-square bg-slate-100 flex items-center justify-center p-8 relative overflow-hidden flex-1">
                      <img src={result.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-[50px] shadow-lg border-4 border-white group-hover:scale-[1.02] transition-transform duration-500" />
                      <div className="absolute bottom-2 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 backdrop-blur-sm p-2 flex text-[9px] font-mono rounded shadow-lg border border-slate-200 line-clamp-2 max-h-12 overflow-hidden text-slate-600">
                               &gt; {result.fanpage_avatar_prompt}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banner */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group lg:col-span-2">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center">
                        <ImageIcon className="w-4 h-4 text-slate-400 mr-2" />
                        <h4 className="font-bold text-slate-700">Cover Banner (16:9)</h4>
                      </div>
                      <a href={result.banner_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                        Mở Full Size HD
                      </a>
                    </div>
                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                      <img src={result.banner_url} alt="Banner" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                      <div className="absolute bottom-2 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 backdrop-blur-sm p-3 flex text-[10px] font-mono rounded-lg shadow-lg border border-slate-200 line-clamp-3 overflow-hidden text-slate-600">
                               &gt; {result.banner_prompt}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Box */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col gap-4 mt-2">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center">
                     <AlertCircle className="w-5 h-5 mr-2 text-fuchsia-500" />
                     Feedback / Yêu cầu chỉnh sửa
                   </h3>
                   <p className="text-sm text-slate-500">Nếu bạn chưa ưng ý (hoặc khách hàng phàn nàn), hãy viết rõ yêu cầu sửa đổi ở đây. AI sẽ phân tích lại định hướng và vẽ mới hoàn toàn.</p>
                   <div className="flex gap-4">
                      <input 
                        type="text"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all font-medium text-slate-700"
                        placeholder="VD: Không thích tone đất nữa, hãy đổi sang biển cả thiên nhiên màu xanh mint..."
                        value={feedbackInput}
                        onChange={e => setFeedbackInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && reviseAssets()}
                        disabled={revising}
                      />
                      <button 
                        onClick={reviseAssets}
                        disabled={revising || !feedbackInput.trim()}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center shadow-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         {revising ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                         {revising ? "Đang xử lý..." : "Sinh lại"}
                      </button>
                   </div>
                </div>

              </motion.div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 shadow-sm border border-slate-200 border-dashed flex-1 flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Palette className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Trạm Dịch Thuật Thị Giác</h3>
                <p className="text-sm text-slate-400 mt-2 text-center max-w-sm">
                  Hãy nhấn Khởi Tạo để hệ thống tự động suy luận Tone, Style, Colors và gửi tín hiệu cho DALL-E 3 vẽ bộ nhận diện.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
