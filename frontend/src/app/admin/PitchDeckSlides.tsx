"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Activity, Sparkles, Shield, Layers, Brain, Code, Target,
  TrendingUp, Globe2, DollarSign, Crown, Award, Lock, Zap, Network, Crosshair, ArrowRight, CheckCircle2
} from 'lucide-react';

/* --- ANIMATION VARIANTS --- */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function PitchDeckSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <SlideCover key="cover" />,
    <SlideProblem key="problem" />,
    <SlideSolution key="solution" />,
    <SlideMarket key="market" />,
    <SlideProduct key="product" />,
    <SlideTraction key="traction" />,
    <SlideBusinessModel key="model" />,
    <SlideMoats key="moats" />,
    <SlideGoToMarket key="gtm" />,
    <SlideRoadmap key="roadmap" />,
    <SlideTeam key="team" />,
    <SlideAsk key="ask" />
  ];

  const pitchScripts = [
    "Xin chào các nhà đầu tư. Tôi là [Tên bạn], Founder của BrandFlow. Chúng tôi mang đến một giải pháp giúp các doanh nghiệp lập chiến lược marketing cấp độ chuyên gia chỉ trong 10 phút, không cần thuê CMO, và không cần phụ thuộc vào agency.",
    "Hãy nhìn vào thực tế thị trường hiện nay. 98% doanh nghiệp ở Việt Nam là các doanh nghiệp vừa và nhỏ (SME). Nỗi đau lớn nhất của họ là 'mù marketing'. Họ không có đủ ngân sách 30-50 triệu mỗi tháng để thuê một agency bài bản. Nếu tự làm, họ đốt tiền chạy quảng cáo vô tội vạ vì thiếu tư duy chiến lược. Những công cụ AI hiện tại như ChatGPT thì chỉ giỏi viết content, nhưng lại quá 'nông' để thiết kế một bản kế hoạch kinh doanh có hệ thống.",
    "Đó là lý do BrandFlow ra đời. Chúng tôi mô phỏng lại toàn bộ quy trình làm việc của một team marketing chuyên nghiệp. Với BrandFlow, quá trình định vị thương hiệu và lập kế hoạch chiến thuật - vốn mất 2 đến 4 tuần của agency - nay được rút gọn xuống chỉ còn 10 phút. Chúng tôi giải quyết triệt để điểm yếu của AI bằng cấu trúc *Kiểm duyệt chéo (Mandatory Debate)* và *Math Engine*, giúp các con số ngân sách luôn chính xác tuyệt đối.",
    "Tại sao chúng tôi làm điều này bây giờ? Chi phí xử lý của AI đã giảm 10 lần trong vòng 1 năm qua, tạo ra một thời điểm vàng. Thị trường công cụ Marketing cho SME tại Đông Nam Á đạt quy mô hơn 300 triệu USD, nhưng hiện tại chưa có một nền tảng chuyên biệt nào được thiết kế tối ưu, hiểu rõ ngôn ngữ và hành vi của người Việt như BrandFlow.",
    "Sản phẩm của chúng tôi không nằm trên giấy. Nó đã được xây dựng và đang hoạt động. Khác với một chatbot thông thường, BrandFlow sở hữu kiến trúc 4 bước rõ ràng: Từ phân tích dữ liệu, tranh luận chiến lược, lập ngân sách cho tới thực thi nội dung. Nền tảng tự động xuất ra 19 biểu mẫu quản trị chuẩn mực, từ SWOT, định vị thương hiệu đến biểu đồ phân bổ ngân sách.",
    "Dù chỉ mới ra mắt phiên bản Private Beta vào tháng 5 vừa qua, chúng tôi đã thu hút hơn 45 người dùng đầu tiên. Họ đã tạo ra hơn 120 bản kế hoạch thực tế, với thời gian trung bình chỉ 8 phút cho một bản. Quan trọng hơn, chỉ số đo lường sự hài lòng (NPS) của chúng tôi đạt 62, một con số rất tích cực trong mảng B2B.",
    "Chúng tôi áp dụng mô hình SaaS Freemium. Khách hàng cá nhân có thể trải nghiệm miễn phí, trong khi các SME sẽ trả mức phí dao động từ 500 ngàn đến 1.5 triệu đồng mỗi tháng. Với chi phí vận hành AI (LLM cost) rất thấp, biên lợi nhuận gộp của chúng tôi duy trì ở mức ấn tượng, từ 83 đến 88%.",
    "Nhiều người hỏi, điều gì ngăn khách hàng dùng luôn ChatGPT? Câu trả lời nằm ở 5 rào cản bảo vệ (Moats) của BrandFlow. Chúng tôi có luồng công việc chuyên biệt cho marketing, có cơ chế AI tranh luận độc quyền, có bộ tính toán toán học độc lập, vòng lặp dữ liệu lớn, và sự am hiểu sâu sắc về thị trường nội địa. Đây là những thứ mà một mô hình ngôn ngữ chung chung không bao giờ làm được.",
    "Về kế hoạch tiếp cận thị trường, chúng tôi không tốn tiền chạy quảng cáo đại trà. Chúng tôi sử dụng chiến lược Product-Led Growth - cấp công cụ miễn phí cho các cộng đồng khởi nghiệp và sinh viên để tạo hiệu ứng truyền miệng. Sau đó, BrandFlow sẽ kết hợp với các trung tâm đào tạo doanh nghiệp và các nền tảng thương mại điện tử để bán chéo sản phẩm.",
    "Nhìn về tương lai, trong 12 tháng tới, mục tiêu của chúng tôi là đạt 1,000 người dùng trả phí. Sang năm thứ hai, BrandFlow sẽ mở rộng ra thị trường Đông Nam Á thông qua hệ thống đại lý đa quốc gia (White-label) và phát triển các mạng lưới Agent chuyên biệt cho từng nền tảng như TikTok, Shopee.",
    "Tôi rất tự hào về đội ngũ của mình. Chúng tôi là sự kết hợp giữa các kỹ sư AI dạn dày kinh nghiệm và các chuyên gia marketing từng thực chiến tại nhiều startup và agency lớn. Chúng tôi sở hữu lợi thế 'unfair advantage' trong việc kết hợp công nghệ lõi và tư duy kinh doanh.",
    "Để đạt được mục tiêu đó, hôm nay chúng tôi tìm kiếm [Số tiền gọi vốn] cho vòng Pre-Seed. Nguồn vốn này sẽ cung cấp cho chúng tôi [Số tháng] runway, tập trung 60% vào nâng cấp hạ tầng AI, 40% vào chi phí phát triển khách hàng. BrandFlow không chỉ là một công cụ, chúng tôi là tương lai của quy trình làm việc tự động trong marketing. Xin cảm ơn các anh chị đã lắng nghe, và tôi rất sẵn lòng giải đáp mọi câu hỏi."
  ];

  const next = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center pb-20 px-4">
      {/* Presentation Container (16:9 Aspect Ratio) */}
      <div className="w-full aspect-[16/9] bg-[#030712] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)] relative group">
        
        {/* Global Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-50" />

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full absolute inset-0"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <button onClick={prev} className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 shadow-2xl">
          <ChevronLeft className="w-8 h-8 -ml-1" />
        </button>
        <button onClick={next} className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 shadow-2xl">
          <ChevronRight className="w-8 h-8 -mr-1" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 bg-black/60 backdrop-blur-2xl px-6 py-4 rounded-full border border-white/10 shadow-2xl">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i === currentSlide ? 'w-12 bg-white' : 'w-2 bg-white/20 hover:bg-white/50'}`} 
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between w-full max-w-[1300px]">
        <div className="text-white/40 text-sm font-medium tracking-widest uppercase">
          BrandFlow Investor Pitch Deck • V2.0
        </div>
        <div className="text-white/40 text-sm font-bold tracking-widest font-mono">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      </div>

      {/* Speaker Notes */}
      <div className="w-full max-w-[1300px] mt-6 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
        <h3 className="text-amber-500 text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Kịch Bản Thuyết Trình (Speaker Notes)
        </h3>
        <p className="text-white/80 text-lg leading-relaxed font-medium">
          {pitchScripts[currentSlide]}
        </p>
      </div>
    </div>
  );
}

/* =========================================
   SLIDE COMPONENTS (HIGH FIDELITY)
   ========================================= */

function SlideCover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/20 blur-[120px] mix-blend-screen" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 w-full max-w-5xl">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold mb-12 tracking-[0.2em] uppercase backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]" />
          Pre-Seed Pitch • Tháng 6/2026
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-[9rem] font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-none drop-shadow-2xl">
          BrandFlow<span className="text-amber-500">.</span>
        </motion.h1>
        
        <motion.h2 variants={fadeUp} className="text-4xl font-medium text-white/70 mb-12 max-w-4xl mx-auto leading-tight tracking-tight">
          Hệ sinh thái AI Đa Đặc Vụ (Multi-Agent). <br/>
          <span className="text-white font-bold">Giảm 85% thời gian & chi phí hoạch định Marketing.</span>
        </motion.h2>
        
        <motion.div variants={scaleIn} className="flex justify-center">
          <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function SlideProblem() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-600/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#030712] to-transparent z-0" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-12 gap-20 relative z-10 items-center">
        <motion.div variants={fadeUp} className="col-span-5 relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/20 to-red-600/5 border border-rose-500/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(225,29,72,0.2)]">
            <Activity className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
            Rào cản năng lực <br/> & Tối ưu chi phí <br/><span className="text-rose-500">SME Marketing.</span>
          </h2>
          <p className="text-white/50 text-xl leading-relaxed">
            Hơn 90% doanh nghiệp SME gặp khó khăn trong việc xây dựng chiến lược Go-To-Market bài bản do thiếu hụt nhân sự cấp cao và ngân sách hạn chế.
          </p>
        </motion.div>
        
        <div className="col-span-7 space-y-6">
          {[
            { num: '01', title: 'Khoảng trống năng lực (Resource Gap)', desc: 'Ngân sách không đủ cho đội ngũ In-house chuyên sâu hoặc CMO. Tự thực thi thiếu framework dẫn đến ROI thấp.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop' },
            { num: '02', title: 'Mô hình Agency thiếu linh hoạt', desc: 'Chi phí đắt đỏ (30-200M/chiến dịch), chu kỳ hoạch định kéo dài (2-4 tuần). Khó thích ứng nhanh với biến động thị trường.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop' },
            { num: '03', title: 'Sự phân mảnh của GenAI thế hệ đầu', desc: 'Các LLMs cơ bản chỉ tập trung tạo nội dung (Content). Thiếu tư duy chiến lược hệ thống và kiểm soát rủi ro tài chính.', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=500&auto=format&fit=crop' }
          ].map((item, i) => (
            <motion.div variants={fadeUp} key={i} className="flex gap-6 items-center bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all group overflow-hidden relative">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 group-hover:opacity-40 transition-opacity mix-blend-overlay">
                <img src={item.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#030712] to-transparent" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-black text-2xl shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-lg z-10">
                {item.num}
              </div>
              <div className="z-10 pr-10">
                <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{item.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SlideSolution() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-12 gap-20 relative z-10 items-center">
        <motion.div variants={fadeUp} className="col-span-5 relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
            Hệ sinh thái <br/> Multi-Agent <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">hoàn chỉnh.</span>
          </h2>
          <p className="text-white/50 text-xl leading-relaxed">
            BrandFlow triển khai kiến trúc AI đa đặc vụ, mô phỏng chính xác luồng vận hành của một phòng Marketing tiêu chuẩn quốc tế.
          </p>
        </motion.div>
        
        <div className="col-span-7 grid grid-cols-1 gap-6">
          {[
            { icon: Layers, title: 'Multi-Agent Pipeline', desc: 'Chuỗi 5 AI Agents đóng vai trò CMO, CFO, Design và Content hoạt động đồng bộ nối tiếp nhau, tạo ra Output hoàn chỉnh.', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop' },
            { icon: Shield, title: 'Cross-Audit (Thẩm định chéo)', desc: 'Cơ chế tranh biện bắt buộc giữa các mô hình đảm bảo tính logic chặt chẽ, loại bỏ hoàn toàn cảm tính trong ra quyết định.', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500&auto=format&fit=crop' },
            { icon: Code, title: 'Anti-Hallucination Finance', desc: 'Tích hợp Math Engine độc lập bằng Python để nội suy và tính toán dòng tiền, P&L, đảm bảo tính khả thi tài chính 100%.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop' }
          ].map((item, i) => (
            <motion.div variants={fadeUp} key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex gap-6 hover:bg-white/10 transition-all duration-500 overflow-hidden relative group">
              {/* Image Blur Background inside card */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity mix-blend-luminosity">
                <img src={item.img} alt="" className="w-full h-full object-cover scale-110" />
                <div className="absolute inset-0 bg-[#030712]/80" />
              </div>

              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg">
                <item.icon className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="relative z-10">
                <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">{item.title}</h4>
                <p className="text-white/60 text-base leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SlideProduct() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      {/* Background Image full */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2564&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]" />
      </div>
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 w-full text-center mb-16">
        <motion.h2 variants={fadeUp} className="text-5xl font-black text-white tracking-tighter mb-6">
          Sản Phẩm Đã Hoàn Thiện <span className="text-cyan-500 text-3xl align-top bg-cyan-500/10 px-4 py-1 rounded-full ml-4">LIVE</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-white/60 text-xl max-w-4xl mx-auto">
          Hệ thống tự động xuất 19 biểu mẫu quản trị chuẩn McKinsey (SWOT, Phân bổ ngân sách, P&L, Timeline) tạo ra giá trị trực tiếp cho khách hàng.
        </motion.p>
      </motion.div>
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 grid grid-cols-5 gap-6">
        {[
          { icon: Layers, name: 'Intake', role: 'Data Extraction', color: 'bg-blue-500', shadow: 'shadow-blue-500/50', delay: 0 },
          { icon: Brain, name: 'Strategy', role: 'G-STIC Framework', color: 'bg-purple-500', shadow: 'shadow-purple-500/50', delay: 0.1 },
          { icon: Code, name: 'Math', role: 'Financial Control', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50', delay: 0.2 },
          { icon: Sparkles, name: 'Design', role: 'Brand Guidelines', color: 'bg-amber-500', shadow: 'shadow-amber-500/50', delay: 0.3 },
          { icon: Target, name: 'Content', role: 'Copywriting Lab', color: 'bg-rose-500', shadow: 'shadow-rose-500/50', delay: 0.4 },
        ].map((agent, i) => (
          <motion.div variants={fadeUp} key={i} className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 text-center hover:bg-white/10 transition-all duration-300 relative group">
            {/* Connection Lines (Except last) */}
            {i < 4 && (
              <div className="absolute top-1/2 -right-3 w-6 h-[2px] bg-white/20 z-0">
                <ChevronRight className="absolute -right-2 -top-2 w-4 h-4 text-white/50" />
              </div>
            )}
            
            <div className={`w-24 h-24 mx-auto rounded-3xl ${agent.color} flex items-center justify-center mb-6 shadow-2xl ${agent.shadow} group-hover:scale-110 transition-transform duration-500 relative z-10`}>
              <agent.icon className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-white font-black text-2xl mb-2 tracking-tight">{agent.name}</h4>
            <p className="text-sm text-white/50 uppercase tracking-widest font-bold">{agent.role}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function SlideTraction() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 text-center mb-16">
        <motion.div variants={scaleIn} className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 mb-8 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
          <TrendingUp className="w-10 h-10 text-amber-400" />
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-6xl font-black text-white tracking-tighter mb-4">
          Market Validation
        </motion.h2>
        <motion.div variants={fadeUp} className="text-amber-400/80 font-bold tracking-[0.3em] uppercase text-xl">
          Private Beta — 45 Ngày
        </motion.div>
      </motion.div>
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 grid grid-cols-3 gap-8">
        {[
          { label: 'Doanh Nghiệp', value: '112', sub: 'Đăng ký Beta' },
          { label: 'Tỉ lệ Retention', value: '40%', sub: 'Active sau 30 ngày' },
          { label: 'NPS Score', value: '62', sub: 'Mức độ hài lòng' },
          { label: 'Kế hoạch tạo ra', value: '120+', sub: 'Master Plans' },
          { label: 'Thời gian TB', value: '8 min', sub: 'So với 2 tuần truyền thống' },
          { label: 'API Calls', value: '4.5K', sub: 'Tương tác hệ thống lõi' },
        ].map((k, i) => (
          <motion.div variants={fadeUp} key={i} className="bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-md border border-white/10 rounded-[32px] p-10 text-center hover:border-amber-500/40 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[4rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter leading-none mb-4 group-hover:from-amber-300 group-hover:to-amber-600 transition-all drop-shadow-md">
              {k.value}
            </div>
            <div className="text-xl font-bold text-white mb-2">{k.label}</div>
            <div className="text-sm text-white/40 uppercase tracking-widest">{k.sub}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function SlideMarket() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-blue-600/10 blur-[150px] rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 gap-24 relative z-10 items-center">
        <motion.div variants={fadeUp}>
          <div className="w-20 h-20 rounded-3xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            <Globe2 className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
            Cơ Hội <br/> Thị Trường Tỷ Đô.
          </h2>
          <p className="text-white/60 text-xl leading-relaxed mb-8">
            Quy mô thị trường MarTech đang tăng trưởng theo cấp số nhân. Thời điểm chín muồi (Timing) với chi phí xử lý AI giảm 10x tạo cơ hội vàng để chiếm lĩnh thị trường Đông Nam Á.
          </p>
        </motion.div>
        
        <div className="space-y-16 pl-16 border-l-2 border-white/10 relative">
          <div className="absolute top-0 bottom-0 left-[-2px] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50" />
          
          <motion.div variants={fadeUp} className="relative group">
            <div className="absolute -left-[76px] top-4 w-6 h-6 rounded-full bg-[#030712] border-4 border-white/20 group-hover:border-blue-500 transition-colors z-10" />
            <div className="text-base text-blue-400 font-bold mb-2 tracking-widest uppercase flex items-center gap-4">
              TAM <span className="text-white/30 font-normal">Global B2B SaaS</span>
            </div>
            <div className="text-[5rem] font-black text-white/50 tracking-tighter leading-none">$136B</div>
          </motion.div>

          <motion.div variants={fadeUp} className="relative group">
            <div className="absolute -left-[76px] top-4 w-6 h-6 rounded-full bg-[#030712] border-4 border-white/40 group-hover:border-blue-400 transition-colors z-10" />
            <div className="text-base text-blue-400 font-bold mb-2 tracking-widest uppercase flex items-center gap-4">
              SAM <span className="text-white/30 font-normal">SEA Marketing Tech</span>
            </div>
            <div className="text-[6rem] font-black text-white/70 tracking-tighter leading-none">$4.2B</div>
          </motion.div>

          <motion.div variants={fadeUp} className="relative group">
            <div className="absolute -left-[80px] top-4 w-8 h-8 rounded-full bg-blue-500 border-[6px] border-[#030712] shadow-[0_0_30px_rgba(59,130,246,0.8)] z-10" />
            <div className="text-base text-blue-400 font-black mb-2 tracking-widest uppercase flex items-center gap-4">
              SOM <span className="text-white/80 font-normal">SME Việt Nam (3 năm)</span>
            </div>
            <div className="text-[7rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-tighter leading-none drop-shadow-2xl">
              $150M
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function SlideBusinessModel() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <DollarSign className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Mô Hình SaaS & Lợi Nhuận</h2>
          <p className="text-white/50 text-xl">Pricing Strategy dựa trên Product-Led Growth</p>
        </motion.div>
        
        <div className="grid grid-cols-4 gap-8 mb-16">
          {[
            { tier: 'FREE', price: '0đ', desc: 'Trải nghiệm PLG. Giới hạn 2 kế hoạch.', style: 'bg-white/5 border-white/10 text-white/50' },
            { tier: 'PLUS', price: '499K', desc: 'SME. Content Lab, Xuất Excel/PDF.', style: 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' },
            { tier: 'PRO', price: '1.49M', desc: 'In-house. Design Studio, Dashboard.', style: 'bg-amber-900/20 border-amber-500/30 text-amber-400', pop: true },
            { tier: 'ENTERPRISE', price: 'Custom', desc: 'Agency. White-label, API, Custom SLA.', style: 'bg-purple-900/20 border-purple-500/30 text-purple-400' },
          ].map((t, i) => (
            <motion.div variants={fadeUp} key={i} className={`rounded-[32px] p-8 border backdrop-blur-xl relative ${t.style} ${t.pop ? 'scale-105 shadow-[0_0_40px_rgba(245,158,11,0.2)]' : ''}`}>
              {t.pop && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>}
              <div className="text-sm font-black mb-6 tracking-widest uppercase opacity-80">{t.tier}</div>
              <div className="text-5xl font-black mb-2 tracking-tighter">{t.price}</div>
              <div className="text-xs opacity-60 uppercase tracking-widest mb-8">/ tháng</div>
              <div className="text-base opacity-80 leading-relaxed font-medium">{t.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-12 max-w-4xl mx-auto pt-10 border-t border-white/10 text-center">
          <div>
            <div className="text-sm text-emerald-400 uppercase font-black mb-4 tracking-widest">Biên Lợi Nhuận Gộp (Gross Margin)</div>
            <div className="text-[4rem] font-black text-white tracking-tighter leading-none">83<span className="text-5xl text-white/40">-88%</span></div>
          </div>
          <div>
            <div className="text-sm text-emerald-400 uppercase font-black mb-4 tracking-widest">Chi phí AI / User / Tháng</div>
            <div className="text-[4rem] font-black text-white tracking-tighter leading-none"><span className="text-5xl text-white/40">&lt;</span> $1.2<span className="text-3xl text-white/40">/mo</span></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SlideMoats() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 grid grid-cols-12 gap-20 items-center">
        <motion.div variants={fadeUp} className="col-span-5 relative">
          <div className="w-20 h-20 rounded-3xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <Lock className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
            Lợi Thế <br/> Cạnh Tranh <br/><span className="text-purple-500">Unfair Moats.</span>
          </h2>
          <p className="text-white/50 text-xl leading-relaxed">
            Chúng tôi không xây dựng một "ChatGPT Wrapper". BrandFlow sở hữu 4 lớp rào cản công nghệ và mô hình ngăn chặn đối thủ.
          </p>
        </motion.div>
        
        <div className="col-span-7 grid grid-cols-2 gap-8">
          {[
            { i: Layers, t: 'Vertical Workflow', d: 'Kiến trúc quy trình đóng gói riêng cho Marketing B2B, không phải một UI chat chung chung.' },
            { i: Brain, t: 'Mandatory Debate', d: 'Thuật toán tranh biện bắt buộc giữa các Agent, triệt tiêu 95% ảo giác giá trị của AI.' },
            { i: Code, t: 'Proprietary Math', d: 'Động cơ nội suy tài chính P&L bằng engine độc lập, đảm bảo ROI thực tế.' },
            { i: Database, t: 'Data Flywheel', d: 'Càng dùng nhiều, Brand DNA Vault của khách hàng càng trở thành tài sản khó từ bỏ.' }
          ].map((item, i) => (
            <motion.div variants={fadeUp} key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <item.i className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">{item.t}</h4>
              <p className="text-base text-white/50 leading-relaxed font-medium">{item.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Icon Fallback
const Database = ({className}: {className?: string}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;

function SlideGoToMarket() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 text-center mb-20">
        <motion.div variants={fadeUp} className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-500/30 mb-8 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
          <Zap className="w-10 h-10 text-cyan-400" />
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-5xl font-black text-white tracking-tighter mb-4">Chiến Lược Go-to-Market</motion.h2>
        <motion.p variants={fadeUp} className="text-cyan-400 font-bold uppercase tracking-widest text-lg">Tăng trưởng thông minh (PLG) thay vì đốt tiền Paid Ads</motion.p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 flex gap-12 justify-center max-w-6xl mx-auto w-full">
        <motion.div variants={fadeUp} className="flex-1 bg-gradient-to-b from-cyan-900/40 to-transparent border border-cyan-500/30 rounded-[40px] p-12 relative backdrop-blur-xl">
          <div className="absolute -top-5 left-12 bg-cyan-500 text-black font-black text-sm px-6 py-2 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.5)]">Phase 1 (Mouth-to-Mouth)</div>
          <h4 className="text-4xl font-black text-white mb-8 mt-4">Product-Led Growth</h4>
          <ul className="space-y-6 text-white/70">
            <li className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-cyan-400 shrink-0" /> 
              <span className="text-lg leading-relaxed">Cung cấp bộ công cụ Free Tools (Brand DNA Scanner) tạo viral loop mạnh mẽ trong giới SME.</span>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-cyan-400 shrink-0" /> 
              <span className="text-lg leading-relaxed">Hợp tác cấp phát miễn phí cho các tổ chức khởi nghiệp, vườn ươm, và trường đại học.</span>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className="flex-1 bg-gradient-to-b from-blue-900/40 to-transparent border border-blue-500/30 rounded-[40px] p-12 relative backdrop-blur-xl">
          <div className="absolute -top-5 left-12 bg-blue-500 text-white font-black text-sm px-6 py-2 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.5)]">Phase 2 (Scale)</div>
          <h4 className="text-4xl font-black text-white mb-8 mt-4">B2B Partnerships</h4>
          <ul className="space-y-6 text-white/70">
            <li className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-blue-400 shrink-0" /> 
              <span className="text-lg leading-relaxed">Tích hợp bán chéo (Cross-sell) qua hệ sinh thái E-commerce (Shopify, Haravan, KiotViet).</span>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-blue-400 shrink-0" /> 
              <span className="text-lg leading-relaxed">Xây dựng Affiliate network mạnh mẽ thông qua các KOLs/Experts trong mảng Marketing.</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SlideRoadmap() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 text-center mb-24">
        <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Lộ Trình Phát Triển <span className="text-emerald-500">(Roadmap)</span></h2>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-transparent -translate-x-1/2 opacity-30" />
        
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-20 relative">
          
          <motion.div variants={fadeUp} className="flex items-center w-full">
            <div className="w-1/2 pr-16 text-right">
              <div className="text-emerald-500 font-black text-xl mb-2 tracking-widest uppercase">Q3 - 2026</div>
              <h4 className="text-4xl font-black text-white mb-4">Product/Market Fit</h4>
              <p className="text-white/50 text-lg leading-relaxed">Ra mắt bản Commercial. Đạt 1,000 người dùng trả phí đầu tiên (MRR $5K).</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 border-[6px] border-[#030712] z-10 relative shadow-[0_0_30px_rgba(16,185,129,1)]" />
            <div className="w-1/2 pl-16" />
          </motion.div>
          
          <motion.div variants={fadeUp} className="flex items-center w-full">
            <div className="w-1/2 pr-16" />
            <div className="w-8 h-8 rounded-full bg-[#030712] border-[6px] border-emerald-500/50 z-10 relative" />
            <div className="w-1/2 pl-16 text-left">
              <div className="text-emerald-500/80 font-black text-xl mb-2 tracking-widest uppercase">Q4 - 2026</div>
              <h4 className="text-4xl font-black text-white mb-4">Ecosystem Expansion</h4>
              <p className="text-white/50 text-lg leading-relaxed">Mở API Access. Tích hợp trực tiếp luồng triển khai với Facebook Ads & Google Ads API.</p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp} className="flex items-center w-full">
            <div className="w-1/2 pr-16 text-right">
              <div className="text-white/40 font-black text-xl mb-2 tracking-widest uppercase">Q1+Q2 - 2027</div>
              <h4 className="text-4xl font-black text-white/80 mb-4">Series A & SEA Scale</h4>
              <p className="text-white/40 text-lg leading-relaxed">Phát hành bản White-label Enterprise. Đạt MRR $50K. Bắt đầu mở rộng thị trường Đông Nam Á.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#030712] border-[6px] border-white/20 z-10 relative" />
            <div className="w-1/2 pl-16" />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

function SlideTeam() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 text-center mb-20">
        <motion.h2 variants={fadeUp} className="text-6xl font-black text-white tracking-tighter mb-6">Đội Ngũ Sáng Lập</motion.h2>
        <motion.p variants={fadeUp} className="text-blue-400 font-bold uppercase tracking-widest text-lg">
          Core Tech (AI) <span className="text-white/50 mx-4">x</span> Domain Knowledge (Marketing)
        </motion.p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 grid grid-cols-2 gap-16 max-w-5xl mx-auto w-full">
        <motion.div variants={fadeUp} className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[40px] p-12 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-40 h-40 rounded-full mb-8 overflow-hidden border-4 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" alt="CEO" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          <h4 className="text-3xl font-black text-white mb-2">Technical Founder</h4>
          <div className="text-base font-bold text-blue-400 uppercase tracking-widest mb-6">CEO & AI Architect</div>
          <p className="text-white/60 text-lg leading-relaxed font-medium">Kinh nghiệm 5 năm xây dựng LLM Pipelines. Nguyên Lead Data Engineer tại các kỳ lân công nghệ. Chuyên gia tối ưu hoá kiến trúc AI Agent.</p>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[40px] p-12 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-40 h-40 rounded-full mb-8 overflow-hidden border-4 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop" alt="CMO" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          <h4 className="text-3xl font-black text-white mb-2">Domain Expert</h4>
          <div className="text-base font-bold text-amber-400 uppercase tracking-widest mb-6">CMO & Product Lead</div>
          <p className="text-white/60 text-lg leading-relaxed font-medium">Cựu Marketing Director tại Top 3 Global Agency. Quản lý portfolio ngân sách &gt;$2M/năm. Nắm giữ DNA của thị trường và insight khách hàng.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SlideAsk() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-32 relative bg-[#030712] overflow-hidden">
      {/* Heavy Graphic Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#030712]/90 to-amber-900/40" />
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 gap-24 relative z-10 items-center">
        <motion.div variants={fadeUp}>
          <h3 className="text-2xl font-black text-amber-500 mb-8 uppercase tracking-widest flex items-center gap-4">
            <Crown className="w-8 h-8" /> Đầu Tư Pre-Seed
          </h3>
          <div className="text-[10rem] font-black text-white mb-6 tracking-tighter drop-shadow-2xl leading-none">
            $150K
          </div>
          <div className="text-3xl text-white/80 font-bold mb-4 tracking-tight">Runway: 15 Tháng</div>
          
          <div className="mt-12 space-y-6">
            <div className="text-base font-black text-amber-500 uppercase tracking-widest mb-6">Mục Tiêu 12 Tháng Tới:</div>
            <div className="flex items-center gap-6 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Award className="w-5 h-5 text-amber-400" /></div>
              <span className="text-xl">Đạt <strong>5,000 users</strong>, 500 paid subscribers.</span>
            </div>
            <div className="flex items-center gap-6 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Award className="w-5 h-5 text-amber-400" /></div>
              <span className="text-xl">MRR <strong className="text-emerald-400">$15,000</strong> (Điểm hòa vốn - Breakeven).</span>
            </div>
            <div className="flex items-center gap-6 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Award className="w-5 h-5 text-amber-400" /></div>
              <span className="text-xl">Sẵn sàng gọi <strong>Seed ($1M+)</strong> scale ra ĐNÁ.</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={staggerContainer} className="space-y-10">
          <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-2xl shadow-2xl">
            <div className="text-base font-black text-white mb-8 uppercase tracking-widest">Phân bổ nguồn vốn</div>
            <div className="space-y-8">
              {[
                { label: 'Engineering & AI Infra', pct: 60, color: 'bg-amber-500', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.8)]' },
                { label: 'Customer Acquisition (CAC)', pct: 40, color: 'bg-emerald-500', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.8)]' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-lg mb-3 font-bold">
                    <span className="text-white">{item.label}</span>
                    <span className="text-white/60">{item.pct}%</span>
                  </div>
                  <div className="h-4 w-full bg-[#030712] rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.2, ease: "easeOut" }}
                      className={`h-full ${item.color} ${item.shadow} relative`}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-[40px] p-12 text-center shadow-[0_20px_50px_rgba(245,158,11,0.3)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <h4 className="text-base font-black text-black/60 mb-4 uppercase tracking-widest relative z-10">Kỳ Vọng ROI (2029)</h4>
            <div className="flex items-end justify-center gap-8 relative z-10">
              <div className="text-left">
                <div className="text-black/80 font-bold text-xl mb-1">Exit Valuation</div>
                <div className="text-6xl font-black text-white drop-shadow-md">$15.0M</div>
              </div>
              <div className="text-[5rem] font-black text-black drop-shadow-xl leading-none">10x</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
