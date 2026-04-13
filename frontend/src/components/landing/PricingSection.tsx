"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const TIERS = [
 {
 name: "Free",
 price: "0 VNĐ",
 description: "Trải nghiệm cơ bản sức mạnh của AI trong việc lập kế hoạch.",
 features: [
 "Sử dụng Dashboard Cơ Bản",
 "Giới hạn 10 câu lệnh (Prompts) / ngày",
 "Tiếp cận 1 AI Agent (Strategy)",
 "Không bao gồm xuất file nâng cao"
 ],
 cta: "Bắt đầu miễn phí",
 link: "/dashboard",
 popular: false
 },
 {
 name: "Pro (Gemini-style)",
 price: "499.000 VNĐ",
 period: "/tháng",
 description: "Dành cho chuyên gia Marketing cần bộ công cụ tự động hóa toàn diện.",
 features: [
 "Tất cả tính năng của gói Free",
 "Không giới hạn câu lệnh",
 "Tiếp cận Mạng lưới 5 AI Agents",
 "Tối ưu hóa AEO/SEO tự động",
 "Xuất báo cáo PDF & Asset thương hiệu"
 ],
 cta: "Nâng cấp Pro",
 link: "/dashboard",
 popular: true
 },
 {
 name: "Agency Enterprise",
 price: "Tuỳ chọn",
 description: "Giải pháp thiết kế riêng, bảo mật dữ liệu cấp doanh nghiệp.",
 features: [
 "LLM được huấn luyện riêng (Custom Data)",
 "Đảm bảo an toàn tài chính (Math Engine Block)",
 "Tích hợp API và CRM",
 "Hỗ trợ chuyên gia 24/7"
 ],
 cta: "Liên hệ tư vấn",
 link: "#",
 popular: false
 }
];

export default function PricingSection() {
 return (
 <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 relative">
 <div className="text-center mb-16">
 <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
 Giải pháp cho mọi quy mô
 </h2>
 <p className="text-linear-text-muted text-lg max-w-2xl mx-auto">
 Dùng thử miễn phí ngay hôm nay hoặc mở khóa sức mạnh toàn diện của Mạng Lưới AI Agents.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {TIERS.map((tier, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`bento-card flex flex-col transition-transform duration-300 ${tier.popular ? '!overflow-visible border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative scale-105 z-10' : 'hover:-translate-y-1'}`}
            >
              {tier.popular && (
                <>
                  <div className="absolute top-0 right-8 transform -translate-y-1/2 z-20">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                      Khuyên dùng
                    </span>
                  </div>
                  {/* Subtle inner glow for popular tier */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none rounded-2xl" />
                </>
              )}

              <div className="mb-8 relative z-10">
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <p className="text-sm text-linear-text-muted h-10">{tier.description}</p>
              </div>
              
              <div className="mb-8 relative z-10">
                <div className="flex items-end">
                  <span className="text-4xl font-black text-foreground">{tier.price}</span>
                  {tier.period && <span className="text-linear-text-muted ml-1 mb-1">{tier.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className={`w-5 h-5 mr-3 shrink-0 ${tier.popular ? 'text-cyan-400' : 'text-linear-text-muted'}`} />
                    <span className="text-sm text-linear-text-muted">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href={tier.link} className="w-full relative z-10">
                <button 
                  className={`w-full py-3 rounded-xl font-semibold transition-all group overflow-hidden relative ${
                    tier.popular 
                    ? 'gradient-ai-bg shadow-lg shadow-cyan-500/20 text-white' 
                    : 'bg-transparent border ultra-thin-border text-foreground hover:bg-linear-surface/80'
                  }`}
                >
                  {/* Sweep animation for popular button */}
                  {tier.popular && (
                    <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />
                  )}
                  <span className="relative z-10">{tier.cta}</span>
                </button>
              </Link>
            </motion.div>
 ))}
 </div>
 </section>
 );
}
