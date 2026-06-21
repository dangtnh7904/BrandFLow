"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Zap, DollarSign, Users, Target, Activity, CheckCircle2, 
  PieChart, Crown, Award, PlayCircle, BookOpen, RefreshCw, Hexagon,
  Search, MessageSquare, MonitorSmartphone, ArrowRight
} from 'lucide-react';

/* --- ANIMATION VARIANTS --- */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function BusinessModelOnePager() {
  return (
    <div className="bg-[#030712] p-8 lg:p-12 font-sans min-h-screen text-white w-full overflow-x-auto relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-emerald-900/20 to-transparent blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <motion.div variants={container} initial="hidden" animate="show" className="min-w-[1200px] max-w-[1500px] mx-auto bg-black/40 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden pb-12 relative z-10">
        
        {/* HEADER */}
        <div className="text-center pt-16 pb-10 relative border-b border-white/5">
          <motion.div variants={scaleIn} className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <Hexagon className="w-12 h-12 text-white" fill="currentColor" />
            </div>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-emerald-500 font-black text-2xl tracking-[0.3em] uppercase mb-4">BRANDFLOW</motion.h1>
          <motion.h2 variants={fadeUp} className="text-[4rem] font-black text-white uppercase tracking-tighter mb-6 drop-shadow-2xl leading-none">
            Mô Hình Kinh Doanh Toàn Diện
          </motion.h2>
          <motion.div variants={fadeUp} className="inline-block border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md rounded-full py-3 px-8">
            <p className="text-emerald-300 font-bold uppercase tracking-widest text-sm">
              Đồng hành cùng doanh nghiệp trên hành trình xây dựng chiến lược Marketing chuyên nghiệp!
            </p>
          </motion.div>
        </div>

        {/* 5 CORE VALUES */}
        <motion.div variants={fadeUp} className="mx-12 my-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex justify-between divide-x divide-white/10 shadow-2xl">
          {[
            { icon: Target, title: 'HIỂU ĐÚNG', desc: 'Bằng dữ liệu, không cảm tính', color: 'text-cyan-400' },
            { icon: Brain, title: 'CHIẾN LƯỢC SÂU', desc: 'G-STIC, SWOT, P&L chuẩn', color: 'text-purple-400' },
            { icon: Zap, title: 'TỐC ĐỘ & TỐI ƯU', desc: '10 phút thay vì mất 4 tuần', color: 'text-amber-400' },
            { icon: DollarSign, title: 'CHÍNH XÁC', desc: 'Ngân sách bằng Math Engine', color: 'text-emerald-400' },
            { icon: Users, title: 'ĐỒNG HÀNH', desc: 'Hệ sinh thái & Cộng đồng', color: 'text-blue-400' }
          ].map((item, i) => (
            <div key={i} className="flex-1 flex items-center gap-5 px-8 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors shadow-lg">
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <div>
                <h3 className="text-base font-black text-white mb-1 uppercase tracking-widest">{item.title}</h3>
                <p className="text-xs text-white/50 uppercase tracking-wider font-bold">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* FUNNEL STEPS */}
        <div className="px-12 space-y-6">
          
          {/* STEP 1: HÚT PHỄU */}
          <motion.div variants={fadeUp} className="flex gap-6 group">
            {/* Left Sidebar */}
            <div className="w-[300px] shrink-0 bg-gradient-to-b from-[#0A4D3C] to-[#052E23] rounded-[32px] p-8 relative flex flex-col justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover" />
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#052E23] border-t border-r border-emerald-500/30 rotate-45 z-10" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-black font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.6)]">1</div>
                <h2 className="text-3xl font-black text-amber-400 uppercase tracking-tighter drop-shadow-md">Hút Phễu</h2>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 relative z-10">Công Cụ AI Miễn Phí</h3>
              <p className="text-sm text-emerald-100/70 leading-relaxed font-medium relative z-10">Bộ 7 công cụ AI nền tảng giúp doanh nghiệp hiểu đúng, làm đúng chiến lược ngay từ bước đầu tiên.</p>
            </div>
            
            {/* Right Content */}
            <div className="flex-1 border border-white/10 rounded-[32px] p-8 relative bg-white/[0.02] backdrop-blur-md shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-black text-white uppercase tracking-widest text-sm bg-emerald-500/20 text-emerald-400 px-6 py-2 rounded-full border border-emerald-500/30">
                  Bộ 7 Công Cụ Khởi Động BrandFlow
                </h4>
              </div>
              <div className="flex gap-4 items-stretch flex-1">
                {/* 7 Tools */}
                {[
                  { icon: Search, title: 'Brand DNA', desc: 'Quét cốt lõi' },
                  { icon: MessageSquare, title: 'Interview', desc: 'Tìm Insight' },
                  { icon: PieChart, title: 'SWOT Gen', desc: 'Đánh giá chung' },
                  { icon: Target, title: 'Competitor', desc: 'Radar đối thủ' },
                  { icon: Zap, title: 'Idea Lab', desc: 'Gợi ý Content' },
                  { icon: DollarSign, title: 'Budget Calc', desc: 'Cân ngân sách' },
                  { icon: Activity, title: 'Healthcheck', desc: 'Đo sức khỏe' }
                ].map((tool, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center text-center bg-[#030712]/50 rounded-2xl border border-white/5 p-4 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center mb-4">{i+1}</div>
                    <tool.icon className="w-8 h-8 text-emerald-400 mb-4" />
                    <h5 className="text-xs font-black text-white mb-2 uppercase tracking-wide">{tool.title}</h5>
                    <p className="text-[10px] text-white/50 leading-relaxed uppercase font-bold">{tool.desc}</p>
                  </div>
                ))}
                
                {/* App Feature */}
                <div className="w-[240px] shrink-0 border-l border-white/10 pl-6 ml-2 flex flex-col">
                  <h5 className="text-sm font-black text-emerald-400 uppercase text-center mb-4 tracking-widest">App BrandFlow</h5>
                  <div className="flex-1 bg-gradient-to-t from-emerald-900/40 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                    <MonitorSmartphone className="w-16 h-16 text-emerald-400 mb-4" />
                    <div className="space-y-2 w-full">
                      <div className="bg-black/50 rounded-lg p-2 text-[10px] font-bold text-white flex items-center gap-2 border border-white/5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Theo dõi sức khỏe</div>
                      <div className="bg-black/50 rounded-lg p-2 text-[10px] font-bold text-white flex items-center gap-2 border border-white/5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Dashboard Analytics</div>
                      <div className="bg-black/50 rounded-lg p-2 text-[10px] font-bold text-white flex items-center gap-2 border border-white/5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Export PDF chuyên gia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STEP 2: CHUYỂN ĐỔI */}
          <motion.div variants={fadeUp} className="flex gap-6 group">
            <div className="w-[300px] shrink-0 bg-gradient-to-b from-[#8B6B00] to-[#4A3900] rounded-[32px] p-8 relative flex flex-col justify-center border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=500&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover" />
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#4A3900] border-t border-r border-amber-500/30 rotate-45 z-10" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-black font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.6)]">2</div>
                <h2 className="text-3xl font-black text-amber-400 uppercase tracking-tighter drop-shadow-md">Chuyển Đổi</h2>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 relative z-10">Cộng Đồng Chuyên Môn</h3>
              <p className="text-sm text-amber-100/70 leading-relaxed font-medium relative z-10">Tham gia hệ sinh thái để được đồng hành, học hỏi và nhận nhiều đặc quyền chuyên sâu.</p>
            </div>
            
            <div className="flex-1 border border-white/10 rounded-[32px] p-8 relative bg-white/[0.02] backdrop-blur-md shadow-2xl flex flex-col">
              <div className="flex gap-10 h-full">
                <div className="flex-1">
                  <h4 className="font-black text-white uppercase tracking-widest mb-8 text-sm bg-amber-500/20 inline-block text-amber-400 px-6 py-2 rounded-full border border-amber-500/30">
                    Trở Thành Thành Viên BrandFlow
                  </h4>
                  <div className="grid grid-cols-5 gap-4">
                    {[
                      { icon: Users, title: 'Kết nối đồng hành', desc: 'cùng chung chí hướng' },
                      { icon: MessageSquare, title: 'Hỏi & Đáp', desc: 'cùng chuyên gia' },
                      { icon: BookOpen, title: 'Kho tài liệu', desc: 'độc quyền thành viên' },
                      { icon: Crown, title: 'Ưu đãi đặc biệt', desc: 'khi mua gói SaaS' },
                      { icon: Award, title: 'Quà tặng & Minigame', desc: 'thi đua hàng tháng' }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center text-center bg-[#030712]/50 rounded-2xl border border-white/5 p-4 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all">
                        <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                          <item.icon className="w-7 h-7 text-amber-400" />
                        </div>
                        <h5 className="text-xs font-black text-white mb-2 uppercase">{item.title}</h5>
                        <p className="text-[10px] text-white/50 uppercase font-bold">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-[340px] shrink-0 border-l border-white/10 pl-10 flex flex-col justify-center">
                  <h4 className="text-center font-black text-emerald-400 uppercase tracking-widest mb-6 text-sm">
                    Cộng Đồng BrandFlow VN
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#030712]/80 rounded-2xl p-4 border border-white/5 text-center">
                      <div className="text-3xl font-black text-amber-400 mb-1">112+</div>
                      <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">SME Users</div>
                    </div>
                    <div className="bg-[#030712]/80 rounded-2xl p-4 border border-white/5 text-center">
                      <div className="text-3xl font-black text-amber-400 mb-1">120+</div>
                      <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Plans Done</div>
                    </div>
                    <div className="bg-[#030712]/80 rounded-2xl p-4 border border-white/5 text-center">
                      <div className="text-3xl font-black text-emerald-400 mb-1">62</div>
                      <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">NPS Score</div>
                    </div>
                    <div className="bg-[#030712]/80 rounded-2xl p-4 border border-white/5 text-center">
                      <div className="text-3xl font-black text-emerald-400 mb-1">40%</div>
                      <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Retention</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STEP 3: BÁN HÀNG */}
          <motion.div variants={fadeUp} className="flex gap-6 group">
            <div className="w-[300px] shrink-0 bg-gradient-to-b from-[#1E3A8A] to-[#0F172A] rounded-[32px] p-8 relative flex flex-col justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop')] opacity-20 mix-blend-overlay bg-cover" />
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0F172A] border-t border-r border-blue-500/30 rotate-45 z-10" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-[#0F172A] font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.6)]">3</div>
                <h2 className="text-3xl font-black text-amber-400 uppercase tracking-tighter drop-shadow-md">Bán Hàng</h2>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 relative z-10">Sản Phẩm Lõi (SaaS)</h3>
              <p className="text-sm text-blue-100/70 leading-relaxed font-medium relative z-10">Ứng dụng Multi-Agent AI giải quyết triệt để nỗi đau "mù marketing", tạo nguồn thu subscription dài hạn.</p>
            </div>
            
            <div className="flex-1 border border-white/10 rounded-[32px] p-8 relative bg-white/[0.02] backdrop-blur-md shadow-2xl">
              <h4 className="font-black text-white uppercase tracking-widest mb-8 text-sm bg-blue-600/30 inline-block text-blue-400 px-6 py-2 rounded-full border border-blue-500/30">
                Hệ Sinh Thái AI Marketing Engine
              </h4>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { name: 'AI Strategy Engine', desc: 'CMO Ảo, xuất G-STIC Plan 10 phút.', tier: 'PLUS', color: 'from-emerald-900/60 to-emerald-900/20 border-emerald-500/50 text-emerald-400' },
                  { name: 'Content Lab Pro', desc: 'Viết nội dung tự động theo DNA.', tier: 'PRO', color: 'from-blue-900/60 to-blue-900/20 border-blue-500/50 text-blue-400', pop: true },
                  { name: 'Design Studio', desc: 'Tự động hóa Visual Mockups (Beta).', tier: 'PRO', color: 'from-amber-900/60 to-amber-900/20 border-amber-500/50 text-amber-400' },
                  { name: 'White-label API', desc: 'Dành riêng cho Agency/Corp lớn.', tier: 'ENTERPRISE', color: 'from-purple-900/60 to-purple-900/20 border-purple-500/50 text-purple-400' }
                ].map((prod, i) => (
                  <div key={i} className={`rounded-[24px] p-6 border flex flex-col justify-between bg-gradient-to-b ${prod.color.split(' ').slice(0,2).join(' ')} ${prod.color.split(' ')[2]} relative ${prod.pop ? 'scale-105 shadow-2xl z-10' : ''}`}>
                    {prod.pop && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>}
                    <div>
                      <div className={`inline-block px-3 py-1 rounded bg-black/50 text-[10px] font-black tracking-widest uppercase mb-4 border ${prod.color.split(' ')[2]} ${prod.color.split(' ')[3]}`}>
                        Gói {prod.tier}
                      </div>
                      <h5 className="text-lg font-black text-white mb-2 leading-tight">{prod.name}</h5>
                      <p className="text-xs text-white/70 leading-relaxed font-medium">{prod.desc}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-white/50 tracking-widest">Khám phá</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><ArrowRight className="w-4 h-4 text-white" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* STEP 4: GIỮ CHÂN */}
          <motion.div variants={fadeUp} className="flex gap-6 group">
            <div className="w-[300px] shrink-0 bg-gradient-to-b from-[#4C1D95] to-[#2E1065] rounded-[32px] p-8 relative flex flex-col justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop')] opacity-20 mix-blend-overlay bg-cover" />
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#2E1065] border-t border-r border-purple-500/30 rotate-45 z-10" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-[#2E1065] font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.6)]">4</div>
                <h2 className="text-2xl font-black text-amber-400 uppercase tracking-tighter leading-tight drop-shadow-md">Giữ Chân &<br/>Giá Trị</h2>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 relative z-10">Data Flywheel</h3>
              <p className="text-sm text-purple-100/70 leading-relaxed font-medium relative z-10">Trang bị giá trị liên tục, khóa chặt người dùng vào hệ sinh thái để duy trì MRR bền vững.</p>
            </div>
            
            <div className="flex-1 border border-white/10 rounded-[32px] p-8 relative bg-white/[0.02] backdrop-blur-md shadow-2xl">
              <h4 className="font-black text-white uppercase tracking-widest mb-8 text-sm bg-purple-600/30 inline-block text-purple-400 px-6 py-2 rounded-full border border-purple-500/30">
                Chương Trình Đào Tạo & Phát Triển Cùng BrandFlow
              </h4>
              <div className="grid grid-cols-3 gap-8">
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-purple-400 font-black text-sm uppercase tracking-widest">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center"><PlayCircle className="w-5 h-5" /></div>
                    Zoom Đào Tạo
                  </div>
                  <div className="bg-[#030712]/50 border border-white/5 rounded-2xl p-6 flex-1 hover:border-purple-500/30 transition-all">
                    <ul className="space-y-4 text-xs text-white/70 font-medium">
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> Đào tạo kiến thức Marketing cốt lõi.</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> Hỏi đáp AMA trực tiếp cùng CMO.</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> Cập nhật thuật toán AI & Use case.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-purple-400 font-black text-sm uppercase tracking-widest">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center"><Users className="w-5 h-5" /></div>
                    Cộng Đồng Local
                  </div>
                  <div className="bg-[#030712]/50 border border-white/5 rounded-2xl p-6 flex-1 hover:border-purple-500/30 transition-all">
                    <ul className="space-y-4 text-xs text-white/70 font-medium">
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> Thảo luận Case Study thực chiến.</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> Thử thách Marketing 21-30 ngày.</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> Truyền cảm hứng và networking B2B.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-purple-400 font-black text-sm uppercase tracking-widest">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center"><RefreshCw className="w-5 h-5" /></div>
                    Vòng Lặp Flywheel
                  </div>
                  <div className="bg-[#030712]/50 border border-white/5 rounded-2xl p-6 flex-1 hover:border-purple-500/30 transition-all relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 border-4 border-purple-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <ul className="space-y-4 text-xs text-white/70 font-medium relative z-10">
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> Trí tuệ AI cá nhân hóa theo thời gian.</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> Nhắc nhở & theo dõi tự động.</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Tăng vọt Switching Cost.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
}
