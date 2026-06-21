"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Target, Brain, Shield, Rocket, DollarSign, 
  CheckCircle2, Users, Lightbulb, Zap, TrendingUp, Presentation
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function InternalPitchGuide() {
  return (
    <div className="w-full bg-[#030712] rounded-[32px] border border-white/10 p-8 md:p-12 text-left relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10 max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center border-b border-white/10 pb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            BrandFlow Master Guide
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Tài liệu huấn luyện nội bộ dành cho team Business & Tech. Nắm bắt toàn bộ "linh hồn" của sản phẩm để có thể giới thiệu và pitching BrandFlow với bất kỳ ai, ở bất cứ đâu.
          </p>
        </motion.div>

        {/* 1. Elevator Pitch */}
        <motion.section variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute left-0 top-0 w-1 h-full bg-amber-500" />
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Presentation className="w-6 h-6 text-amber-500" /> 1. Lời Khai Phá (Elevator Pitch - 60s)
          </h2>
          <div className="space-y-4 text-white/80 leading-relaxed text-lg font-medium">
            <p>
              "Chào bạn. Hãy tưởng tượng một doanh nghiệp nhỏ (SME) muốn làm marketing bài bản. Họ có hai lựa chọn: Một là tự làm và loay hoay đốt tiền vì thiếu chuyên môn. Hai là thuê agency với chi phí lên tới hàng chục triệu mỗi tháng."
            </p>
            <p>
              "98% doanh nghiệp Việt Nam là SME, và họ đang mắc kẹt ở lựa chọn thứ nhất. Đó là lý do chúng tôi xây dựng <strong className="text-amber-400">BrandFlow - AI Marketing Strategy Engine</strong>. Nó đóng vai trò như một Giám đốc Marketing (CMO) thực thụ."
            </p>
            <p>
              "Thay vì mất 4 tuần làm việc với agency, người dùng chỉ cần dành 10 phút trả lời các câu hỏi cơ bản, hệ thống sẽ tự động xuất ra một bản kế hoạch marketing hoàn chỉnh, chuẩn xác từng đồng ngân sách nhờ cơ chế AI tranh luận chéo và tính toán tự động."
            </p>
          </div>
        </motion.section>

        {/* 2. Giá trị Cốt Lõi */}
        <motion.section variants={fadeUp}>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-400" /> 2. Trái tim của Sản Phẩm (Core Mechanics)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0f172a]/50 border border-blue-500/20 rounded-2xl p-6 hover:bg-[#0f172a] transition-colors">
              <Brain className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Cross-Debate AI</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                BrandFlow không dùng 1 con AI để trả lời tất cả. Chúng tôi cho 3 AI Agent đóng vai <strong>CMO</strong>, <strong>CFO</strong> và <strong>Khách Hàng</strong> để tranh luận với nhau, nhằm tìm ra chiến lược thực dụng nhất, loại bỏ hoàn toàn sự "ảo tưởng" của AI thông thường.
              </p>
            </div>
            <div className="bg-[#0f172a]/50 border border-emerald-500/20 rounded-2xl p-6 hover:bg-[#0f172a] transition-colors">
              <Zap className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Math Engine (Tính Toán)</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Mọi chiến lược sinh ra đều được ánh xạ bằng những con số tài chính cụ thể. Chạy bao nhiêu tiền Facebook Ads, thu về bao nhiêu Lead, CAC là bao nhiêu? Engine tự động phân bổ chuẩn xác ngân sách cho từng nền tảng.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 3. Đối Tượng Khách Hàng */}
        <motion.section variants={fadeUp}>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-pink-400" /> 3. Chân dung Khách Hàng (Target Audience)
          </h2>
          <div className="bg-pink-500/5 border border-pink-500/20 rounded-2xl p-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold mb-1">Chủ doanh nghiệp SME & Startup</h4>
                  <p className="text-white/60 text-sm">Họ giỏi sản phẩm nhưng yếu về Marketing. Họ cần bản đồ chỉ dẫn cụ thể (Playbook) để không đốt tiền chạy quảng cáo vô ích.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold mb-1">Marketing Agency & Freelancer</h4>
                  <p className="text-white/60 text-sm">Họ cần BrandFlow như một công cụ đắc lực để tiết kiệm 85% thời gian làm Proposal (đề xuất) cho khách hàng của họ. Đây là tập khách sẵn sàng mua gói Enterprise.</p>
                </div>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* 4. Rào cản bảo vệ (Moats) */}
        <motion.section variants={fadeUp}>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" /> 4. Lợi thế Cạnh Tranh (The 5 Moats)
          </h2>
          <p className="text-white/60 mb-6 font-medium">Khi bị hỏi: "Tại sao không dùng ChatGPT cho nhanh?", đây là câu trả lời của bạn:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "1. Quy trình chuyên sâu G-STIC được tích hợp cứng (Hard-coded).",
              "2. Cơ chế AI tranh luận loại bỏ sự sai lệch (Hallucination).",
              "3. Động cơ Toán học (Math Engine) quản trị rủi ro tài chính.",
              "4. Dữ liệu văn hóa địa phương (Local Insights) của Việt Nam.",
              "5. Vòng lặp dữ liệu (Flywheel) càng dùng càng thông minh."
            ].map((moat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm font-medium text-white/80 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                {moat}
              </div>
            ))}
          </div>
        </motion.section>

        {/* 5. GTM & Business Model */}
        <motion.section variants={fadeUp} className="bg-gradient-to-r from-purple-900/40 to-[#030712] border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
            <Rocket className="w-6 h-6 text-purple-400" /> 5. Kiếm tiền & Tăng trưởng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Mô Hình Doanh Thu
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                SaaS Subscription (Thuê bao). Miễn phí tạo dự án đầu tiên để thu hút (Freemium). Trả phí theo gói tháng (500k - 1.5M/tháng) để mở khóa các tính năng như Xuất PDF, Gen Content hàng ngày, Giám sát sức khỏe.
              </p>
            </div>
            <div>
              <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Go-To-Market
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Đánh trực tiếp vào Cộng đồng Khởi nghiệp và Doanh nghiệp vừa nhỏ thông qua chiến lược Product-Led Growth. Tặng tài khoản cho sinh viên/vườn ươm để tạo Viral. Sau đó tiếp cận kênh B2B Direct Sales.
              </p>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
