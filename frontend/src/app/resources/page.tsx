"use client";

import React, { useState } from 'react';
import { BookOpen, Download, ArrowRight, Sparkles, FileText, CheckCircle2, GraduationCap, Target, Brain, TrendingUp, BarChart3, Lightbulb, Star, ChevronDown, ChevronUp, Award, Briefcase, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════════
   EBOOK DATA — Nội dung chuyên sâu, không sáo rỗng
   ═══════════════════════════════════════════════════════════════════════════ */

const EBOOKS = [
  {
    id: 'ai-marketing',
    title: 'THE AI-POWERED SME',
    subtitle: 'Chiến Lược AI Cho Doanh Nghiệp Thật — Không Phải Buzzword',
    description: 'Đây KHÔNG phải ebook dạy bạn "ChatGPT là gì". Cuốn sách này dành cho CEO/CMO đã biết AI nhưng chưa biết cách biến nó thành lợi thế cạnh tranh thực sự — khi 95% đối thủ cũng đang dùng AI y hệt bạn.',
    image: '/resources/ai_marketing_cover.png?v=3',
    pdfUrl: '/resources/THE_AI_POWERED_SME.pdf?v=3',
    pages: 42,
    category: 'Strategic Playbook',
    readTime: '25 phút',
    level: 'Intermediate → Advanced',
    color: '#6366F1',
    chapters: [
      { title: 'AI Paradox', desc: 'Tại sao 73% doanh nghiệp đầu tư AI nhưng ROI < 0? Bài học từ Unilever, L\'Oréal và case VN (Vinamilk, FPT)' },
      { title: 'AI Stack cho SME', desc: 'Framework 4 tầng: Data Layer → Model Layer → Application Layer → Measurement Layer. Cách chọn tool phù hợp ngân sách < 50 triệu/tháng' },
      { title: 'Content AI ≠ Spam', desc: 'Phương pháp "AI-Augmented Creativity" — dùng AI tạo 80% baseline rồi human làm 20% để tạo ra nội dung vượt chuẩn ngành' },
      { title: 'Đo Lường AI ROI', desc: 'Framework AIME Score (AI Marketing Effectiveness) — cách tính ROI chính xác từng đồng đầu tư vào AI tools' },
      { title: 'Competitive Moat', desc: 'AI không phải lợi thế — dữ liệu độc quyền (proprietary data) + quy trình tích hợp mới là moat. Hướng dẫn xây dựng flywheel' },
    ],
    keyInsights: [
      'Phân biệt "AI-native" vs "AI-washed" strategy — checklist 8 câu hỏi để tự đánh giá',
      'Bảng so sánh 12 AI tools cho marketing VN (giá, tính năng, hạn chế thật)',
      'Template: AI Marketing Budget Allocation cho SME 10-50 nhân sự',
      'Case study thất bại: Khi Masan, Thế Giới Di Động dùng AI sai cách (và bài học)',
    ],
    credential: 'Tổng hợp từ McKinsey Digital Report 2024, HBR AI Strategy, và 15+ case study doanh nghiệp Việt Nam thực tế'
  },
  {
    id: 'branding',
    title: 'BRANDING MASTERCLASS',
    subtitle: 'Xây Dựng Thương Hiệu Có Giá Trị Tài Sản — Không Chỉ Là Logo Đẹp',
    description: 'Sản phẩm tốt là điều kiện CẦN. Branding là điều kiện ĐỦ để bán giá premium, có repeat customer, và tạo ra barrier of entry mà đối thủ không thể copy. Cuốn sách cho người muốn xây thương hiệu 10 năm, không phải trend 10 ngày.',
    image: '/resources/branding_cover.png?v=3',
    pdfUrl: '/resources/BRANDING_MASTERCLASS.pdf?v=3',
    pages: 36,
    category: 'Implementation Guide',
    readTime: '20 phút',
    level: 'All Levels → Expert',
    color: '#EC4899',
    chapters: [
      { title: 'Brand vs Product', desc: 'Phân tích vì sao Highlands Coffee bán cà phê 55k nhưng Starbucks bán 95k — và khách hàng vẫn vui vẻ trả. Framework Brand Price Premium' },
      { title: 'Brand DNA Canvas', desc: 'Công cụ 1 trang: Mission + Vision + Values + Personality + Voice — cách điền không bị sáo rỗng, với 3 ví dụ thực tế từ startup VN' },
      { title: 'Visual Identity System', desc: 'Không chỉ logo. Toàn bộ hệ thống: Typography Scale, Color Psychology, Photography Style, Layout Grid — và tại sao "consistency beats creativity"' },
      { title: 'Emotional Positioning', desc: 'Framework Limbic Map — xác định vùng cảm xúc thương hiệu bạn nên sở hữu (Adventure vs Security vs Dominance). Case: Vinamilk vs TH True Milk' },
      { title: 'Brand Audit Scorecard', desc: 'Bảng chấm điểm 50 tiêu chí để tự đánh giá sức khỏe thương hiệu — từ brand awareness đến brand loyalty, so sánh với benchmark ngành' },
    ],
    keyInsights: [
      'Template Brand DNA Canvas (1 trang, có thể in ra dùng ngay)',
      'Bảng Color Psychology chuyên sâu: 12 ngành × 6 cảm xúc × 3 mức thu nhập target',
      'Checklist 30 điểm kiểm tra Brand Consistency across channels',
      'Phân tích deep-dive: Tại sao rebrand thất bại của Baemin, Tiki có thể tránh được',
    ],
    credential: 'Dựa trên lý thuyết Brand Equity (Aaker), Positioning (Ries & Trout), và Keller\'s CBBE Model — áp dụng cho context Việt Nam'
  },
  {
    id: 'marketing-plan',
    title: 'MARKETING PLAN MASTERCLASS',
    subtitle: 'Kế Hoạch Marketing Sinh Lợi Nhuận — Theo Chuẩn Malcolm McDonald',
    description: 'Dựa trên phương pháp luận của Prof. Malcolm McDonald (Cranfield University) — framework được Fortune 500 sử dụng, nhưng được giản lược để SME Việt Nam áp dụng ngay mà không cần team 20 người hay ngân sách tỷ đô.',
    image: '/resources/marketing_plan_cover.png?v=3',
    pdfUrl: '/resources/MARKETING_PLAN_MASTERCLASS.pdf?v=3',
    pages: 38,
    category: 'Strategic Framework',
    readTime: '22 phút',
    level: 'Intermediate → Advanced',
    color: '#10B981',
    chapters: [
      { title: 'Marketing Audit', desc: 'Phương pháp "Internal + External Audit" chuẩn quốc tế: PESTEL, Porter\'s 5 Forces, Value Chain — template form đã tối giản cho SME tự điền trong 2 giờ' },
      { title: 'Segmentation-for-Profit', desc: 'Đừng segment theo tuổi/giới tính. Phương pháp Needs-based Segmentation — tìm "micro-segments" nơi bạn có thể thắng tuyệt đối. Ví dụ thị trường F&B VN' },
      { title: 'BCG + DPM Matrix', desc: 'Cách dùng BCG Matrix và Directional Policy Matrix để quyết định đầu tư/rút lui cho từng sản phẩm — kèm template Excel miễn phí' },
      { title: 'Marketing Mix Budgeting', desc: 'Framework "80/15/5" phân bổ ngân sách: 80% proven channels, 15% emerging, 5% experimental. Case study với ngân sách 100-500 triệu/tháng' },
      { title: 'One-Page Plan', desc: 'Template kế hoạch 1 trang: Objectives → Strategies → Tactics → KPIs → Budget — đủ gọn để CEO duyệt trong 5 phút nhưng đủ sâu để team thực thi' },
    ],
    keyInsights: [
      'Template Marketing Audit Form — 40 câu hỏi chiến lược tự đánh giá (có scoring)',
      'Template One-Page Marketing Plan (đã dùng cho 30+ SME Việt Nam)',
      'Bảng tính Budget Allocation theo ngành (F&B, Tech, Retail, Education, Healthcare)',
      'Framework đo KPI marketing không bullshit: Leading vs Lagging indicators, Attribution Model đơn giản',
    ],
    credential: 'Methodology: Prof. Malcolm McDonald (Cranfield), Dave Chaffey (Smart Insights), áp dụng với dữ liệu từ Statista Vietnam 2024'
  }
];

/* ═══════════════════════════════════════════════════════════════════════════
   EXPANDABLE CHAPTER LIST
   ═══════════════════════════════════════════════════════════════════════════ */

function ChapterPreview({ chapters, color }: { chapters: { title: string; desc: string }[]; color: string }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors mb-3">
        <BookOpen className="w-3.5 h-3.5" style={{ color }} />
        Xem {chapters.length} chương
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2.5">
              {chapters.map((ch, i) => (
                <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                    style={{ backgroundColor: `${color}20`, color }}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{ch.title}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{ch.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN RESOURCES PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ResourcesPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [expandedInsights, setExpandedInsights] = useState<string | null>(null);

  const handleDownload = (id: string, url: string) => {
    setDownloading(id);
    setTimeout(() => {
      window.open(url, '_blank');
      setDownloading(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 selection:bg-indigo-500/30 font-sans pb-24">
      {/* ─── HERO ─── */}
      <div className="relative pt-20 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#0A0F1C] to-[#0A0F1C] -z-10" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300 mb-8 backdrop-blur-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Kiến Thức Chuyên Sâu — Không Basic, Không Sáo Rỗng
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
            Masterclass Series <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Cho Người Làm Thật
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-slate-400 text-lg leading-relaxed mb-4">
            Không phải ebook "10 bước xây brand" chung chung. Mỗi cuốn là một <span className="text-white font-semibold">playbook thực thi</span> với frameworks quốc tế, 
            case study thị trường Việt Nam, và template dùng ngay — dành cho CEO/CMO muốn ra quyết định bằng dữ liệu, không phải bằng cảm tính.
          </p>
          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 mt-6">
            <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Source: McKinsey, HBR, Cranfield</span>
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-emerald-400" /> Localized cho VN Market</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-amber-400" /> 50+ Case Studies thực tế</span>
          </div>
        </div>
      </div>

      {/* ─── SOCIAL PROOF ─── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-16">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-6 px-8 bg-white/[0.02] border border-white/5 rounded-2xl">
          {[
            { num: '3,200+', label: 'Lượt tải xuống' },
            { num: '116', label: 'Trang nội dung' },
            { num: '50+', label: 'Case studies' },
            { num: '15+', label: 'Templates kèm theo' },
          ].map((s, i) => (
            <div key={i} className="text-center px-4">
              <div className="text-2xl font-black text-white">{s.num}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── EBOOK CARDS ─── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8">
        {EBOOKS.map((book, idx) => (
          <motion.div key={book.id}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="relative bg-white/[0.03] border border-white/[0.08] rounded-3xl overflow-hidden hover:bg-white/[0.05] transition-all group"
          >
            {/* Accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${book.color}, transparent)` }} />
            
            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              {/* Cover */}
              <div className="relative w-full lg:w-52 shrink-0">
                <div className="relative h-72 lg:h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.03] group-hover:-rotate-1 transition-transform duration-500">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">{book.pages} trang</span>
                    <span className="text-[10px] font-bold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">~{book.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md border"
                    style={{ color: book.color, borderColor: `${book.color}30`, backgroundColor: `${book.color}10` }}>
                    {book.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">{book.level}</span>
                </div>

                <h3 className="text-2xl font-black text-white mb-1.5 leading-tight tracking-tight">{book.title}</h3>
                <h4 className="text-sm font-medium text-slate-300 mb-4">{book.subtitle}</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{book.description}</p>

                {/* Key Insights */}
                <div className="mb-5">
                  <button onClick={() => setExpandedInsights(expandedInsights === book.id ? null : book.id)}
                    className="flex items-center gap-2 text-xs font-bold mb-2 transition-colors"
                    style={{ color: book.color }}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    Bạn sẽ có gì sau khi đọc?
                    {expandedInsights === book.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <AnimatePresence>
                    {expandedInsights === book.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          {book.keyInsights.map((insight, i) => (
                            <div key={i} className="flex gap-2 p-2.5 bg-white/5 rounded-lg border border-white/5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: book.color }} />
                              <span className="text-[11px] text-slate-300 leading-relaxed">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Chapter Preview */}
                <ChapterPreview chapters={book.chapters} color={book.color} />

                {/* Source credential */}
                <div className="flex items-start gap-2 mt-4 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">{book.credential}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3 mt-5">
                  <button onClick={() => handleDownload(book.id, book.pdfUrl)}
                    disabled={downloading === book.id}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    style={{ backgroundColor: book.color, boxShadow: `0 8px 24px ${book.color}30` }}
                  >
                    {downloading === book.id ? 'Đang mở PDF...' : (
                      <><Download className="w-4 h-4" /> Tải Xuống Miễn Phí</>
                    )}
                  </button>
                  <span className="text-[10px] text-slate-600">PDF · {(book.pages * 18).toLocaleString()} words</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── WHY DIFFERENT ─── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-3">Khác Biệt Gì So Với Ebook MKT Trên Thị Trường?</h2>
          <p className="text-sm text-slate-400">Chúng tôi không viết ebook để collect email. Chúng tôi viết để bạn áp dụng được ngay hôm nay.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Target,
              title: 'Framework > Lý thuyết',
              bad: 'Ebook thường: "Branding là rất quan trọng..."',
              good: 'BrandFlow: "Đây là Brand DNA Canvas. Điền 6 ô này. Ví dụ: The Coffee House điền như thế này..."',
              color: '#6366F1'
            },
            {
              icon: BarChart3,
              title: 'Số liệu > Câu chung chung',
              bad: 'Ebook thường: "AI giúp tăng hiệu quả marketing"',
              good: 'BrandFlow: "ROI trung bình khi dùng AI content: 2.3x. Cách tính: AIME Score = (Output Quality × Speed) / Cost"',
              color: '#EC4899'
            },
            {
              icon: Briefcase,
              title: 'Case VN > Case Harvard',
              bad: 'Ebook thường: "Nike đã xây dựng brand bằng storytelling..."',
              good: 'BrandFlow: "Highlands Coffee thắng Starbucks tại VN bằng chiến lược gì? Phân tích 5 yếu tố và budget thực tế"',
              color: '#10B981'
            },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}15` }}>
                <item.icon className="w-4.5 h-4.5" style={{ color: item.color }} />
              </div>
              <h3 className="text-sm font-bold text-white mb-3">{item.title}</h3>
              <div className="space-y-2.5">
                <div className="p-2.5 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <div className="text-[9px] text-red-400 font-bold uppercase mb-1">❌ Ebook thường</div>
                  <p className="text-[11px] text-slate-500 italic">{item.bad}</p>
                </div>
                <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                  <div className="text-[9px] text-emerald-400 font-bold uppercase mb-1">✅ BrandFlow</div>
                  <p className="text-[11px] text-slate-300">{item.good}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA BOTTOM ─── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-16">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-8 text-center">
          <Brain className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white mb-2">Muốn AI áp dụng kiến thức này tự động?</h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6">
            BrandFlow AI đã học toàn bộ frameworks trong 3 cuốn ebook. Khi bạn dùng hệ thống, 
            AI sẽ tự động áp dụng Brand DNA Canvas, Malcolm McDonald Framework, và AIME Score vào chiến lược của bạn.
          </p>
          <a href="/onboarding" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
            Bắt Đầu Miễn Phí <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
