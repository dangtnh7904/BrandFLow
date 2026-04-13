"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Send, CheckCircle2, Lock, ArrowRight, PenSquare, Image as ImageIcon } from 'lucide-react';

export default function DailyContentPage() {
 const [topic, setTopic] = useState('');
 const [tone, setTone] = useState('Chuyên nghiệp');
 const [platform, setPlatform] = useState('Facebook');
 const [isGenerating, setIsGenerating] = useState(false);
 const [generatedContent, setGeneratedContent] = useState<string | null>(null);

 const handleGenerate = () => {
 setIsGenerating(true);
 // Mock API call
 setTimeout(() => {
 setGeneratedContent(`🚀 Khám phá sức mạnh của việc tối ưu hóa quy trình với AI!\n\nBạn có biết rằng 70% doanh nghiệp vừa và nhỏ đang lãng phí hàng giờ mỗi tuần cho các tác vụ thủ công không? Đã đến lúc chuyển đổi số! \n\n🔹 Giảm thiểu sai sót\n🔹 Tiết kiệm 30% ngân sách vận hành\n🔹 Thúc đẩy năng suất đội ngũ\n\nBạn đã sẵn sàng để ứng dụng AI vào doanh nghiệp của mình chưa?\n\n#DigitalTransformation #AI #SME #BusinessGrowth`);
 setIsGenerating(false);
 }, 2000);
 };

 return (
 <div className="p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto no-scrollbar">
 <header className="mb-8">
 <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-4 shadow-sm">
 <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
 <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Free & SME Edition</span>
 </div>
 <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">Tạo Bài Viết Hằng Ngày</h1>
 <p className="text-linear-text-muted max-w-2xl text-base">Công cụ Content AI cấp tốc dành riêng cho doanh nghiệp nhỏ. Chọn chủ đề, giọng văn và nền tảng, hệ thống sẽ lo phần còn lại.</p>
 </header>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
 {/* Configuration Panel */}
 <div className="lg:col-span-4 space-y-6">
 <div className="bg-linear-surface rounded-2xl border border-linear-border p-6 shadow-sm">
 <h2 className="text-lg font-semibold text-foreground flex items-center mb-5">
 <PenSquare className="w-5 h-5 mr-2 text-blue-500" />
 Thiết lập nội dung
 </h2>

 <div className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-foreground mb-2">Chủ đề bài viết</label>
 <textarea 
 value={topic}
 onChange={(e) => setTopic(e.target.value)}
 placeholder="VD: Ra mắt tính năng mới giúp tối ưu hóa chi phí..."
 className="w-full bg-background border border-linear-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all resize-none h-28 text-foreground placeholder:text-slate-400"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-foreground mb-2">Nền tảng</label>
 <div className="grid grid-cols-3 gap-2">
 {['Facebook', 'LinkedIn', 'Instagram'].map((p) => (
 <button 
 key={p}
 onClick={() => setPlatform(p)}
 className={`py-2.5 px-2 text-[11px] sm:text-xs font-semibold rounded-lg border transition-all ${
 platform === p 
 ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
 : 'bg-linear-surface border-linear-border text-linear-text-muted hover:bg-linear-surface/80 dark:hover:bg-slate-800'
 }`}
 >
 {p}
 </button>
 ))}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-foreground mb-2">Giọng văn (Tone)</label>
 <select 
 value={tone}
 onChange={(e) => setTone(e.target.value)}
 className="w-full bg-background border border-linear-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-foreground "
 >
 <option>Chuyên nghiệp</option>
 <option>Hài hước, gần gũi</option>
 <option>Truyền cảm hứng</option>
 <option>Trang trọng</option>
 </select>
 </div>

 <button 
 onClick={handleGenerate}
 disabled={!topic || isGenerating}
 className={`w-full mt-2 py-3.5 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300 ${
 topic && !isGenerating 
 ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]' 
 : 'bg-slate-300 text-linear-text-muted cursor-not-allowed'
 }`}
 >
 {isGenerating ? (
 <span className="flex items-center">
 <Sparkles className="w-4 h-4 mr-2 animate-spin" /> Đang tạo content...
 </span>
 ) : (
 <span className="flex items-center">
 <Sparkles className="w-4 h-4 mr-2" /> Tạo Bài Viết
 </span>
 )}
 </button>
 </div>
 </div>

 {/* Upsell Banner for Free Users */}
 <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
 <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
 <h3 className="text-white font-bold mb-2 flex items-center">
 <Lock className="w-4 h-4 text-cyan-400 mr-2" /> B2B Workspace (Advanced)
 </h3>
 <p className="text-linear-text-muted text-sm mb-5 leading-relaxed">
 Nâng cấp để kết nối content này với hệ thống tối ưu ngân sách dựa trên AI Agents chuyên sâu.
 </p>
 <div className="text-cyan-400 text-sm font-semibold flex items-center group-hover:text-cyan-300 transition-colors">
 Tới Workspace <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
 </div>
 </div>
 </div>

 {/* Result Panel */}
 <div className="lg:col-span-8">
 <div className="bg-linear-surface rounded-2xl border border-linear-border p-6 md:p-8 shadow-sm h-full min-h-[500px] flex flex-col relative overflow-hidden">
 <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center justify-between pb-4 border-b border-linear-border ">
 <span>Kết quả sinh tự động</span>
 {generatedContent && (
 <span className="flex items-center text-[11px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider">
 <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Hoàn thành
 </span>
 )}
 </h2>

 {generatedContent ? (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="flex-1 flex flex-col"
 >
 <div className="flex-1 bg-background hover:bg-linear-surface/50 /30 rounded-xl p-5 border border-linear-border mb-6">
 <div className="prose prose-slate dark:prose-invert max-w-none text-foreground text-sm md:text-base leading-[1.8] whitespace-pre-wrap">
 {generatedContent}
 </div>
 </div>
 <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
 <button className="w-full sm:w-auto flex-1 py-3.5 px-4 bg-linear-surface hover:bg-linear-surface/80 dark:hover:bg-slate-700 text-foreground font-semibold rounded-xl border border-linear-border transition-colors flex items-center justify-center shadow-sm">
 <Copy className="w-4 h-4 mr-2" /> Sao chép văn bản
 </button>
 <button className="w-full sm:w-auto flex-1 py-3.5 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-semibold rounded-xl border border-blue-200 dark:border-blue-800/60 transition-colors flex items-center justify-center shadow-sm">
 <Send className="w-4 h-4 mr-2" /> Đăng trực tiếp (Beta)
 </button>
 </div>
 </motion.div>
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center text-linear-text-muted text-center">
 <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 border border-linear-border /50 shadow-sm relative">
 <div className="absolute inset-0 bg-blue-400/5 rounded-full animate-ping" />
 <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
 </div>
 <h3 className="text-linear-text-muted font-medium mb-2">Chưa có nội dung nào</h3>
 <p className="max-w-[300px] text-sm leading-relaxed">
 Vui lòng điền thông tin chủ đề bên trái và nhấn nút Tạo Bài Viết để AI bắt đầu quá trình sinh content.
 </p>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
