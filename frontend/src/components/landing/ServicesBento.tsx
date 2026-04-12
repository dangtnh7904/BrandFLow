"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Megaphone, PenTool, BarChart } from 'lucide-react';

const SERVICES = [
  {
    icon: Search,
    title: "AI SEO & AEO Expert",
    description: "Tối ưu hoá website để hiển thị hàng đầu trên các kết quả tìm kiếm AI như Gemini, ChatGPT và Google SGE.",
    colSpan: "col-span-1 md:col-span-2",
    accent: "text-purple-400"
  },
  {
    icon: Megaphone,
    title: "AI Media Buyer",
    description: "Quản lý và tự động tối ưu hoá ngân sách quảng cáo.",
    colSpan: "col-span-1",
    accent: "text-cyan-400"
  },
  {
    icon: PenTool,
    title: "AI Branding Designer",
    description: "Sáng tạo nhận diện thương hiệu nhất quán dựa trên dữ liệu thật.",
    colSpan: "col-span-1",
    accent: "text-blue-400"
  },
  {
    icon: BarChart,
    title: "Data & Strategy Controller",
    description: "Phân tích số liệu và chiến lược thời gian thực, không cảm tính, không bias.",
    colSpan: "col-span-1 md:col-span-2",
    accent: "text-orange-400"
  }
];

export default function ServicesBento() {
  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-6">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          Hệ sinh thái <span className="gradient-ai-text">AI Agents</span>
        </h2>
        <p className="text-linear-text-muted text-lg max-w-2xl">
          Nền tảng của chúng tôi cung cấp các bộ não AI riêng biệt cho từng mảng chuyên môn, xóa bỏ giới hạn của một nhân sự "full-stack" truyền thống.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(250px,auto)]">
        {SERVICES.map((service, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`bento-card ${service.colSpan} group`}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-transparent border ultra-thin-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className={`w-6 h-6 ${service.accent}`} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-linear-text-muted leading-relaxed">{service.description}</p>
            </div>
            
            <div className="mt-8">
              <span className="text-xs font-semibold text-zinc-400 group-hover:text-blue-600 transition-colors cursor-pointer flex items-center">
                Kết nối Agent &gt;
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
