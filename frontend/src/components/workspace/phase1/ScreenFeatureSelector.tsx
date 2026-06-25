"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  PenSquare, 
  Palette, 
  Megaphone, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  ArrowLeft,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';

interface Props {
  onBack: () => void;
  onGoToCampaign: () => void;
}

const FEATURES = [
  {
    id: "content",
    title: "Viết Content",
    desc: "Tạo bài đăng MXH, kịch bản video, email marketing dựa trên DNA thương hiệu.",
    icon: PenSquare,
    gradient: "from-pink-500 to-rose-500",
    glow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.25)]",
    route: "/daily-content",
  },
  {
    id: "design",
    title: "Thiết Kế",
    desc: "Studio thiết kế logo, banner, bộ nhận diện thương hiệu với AI.",
    icon: Palette,
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]",
    route: "/design-studio",
  },
  {
    id: "campaign",
    title: "Kế Hoạch Chiến Dịch",
    desc: "Lập kế hoạch chi tiết cho 1 chiến dịch riêng lẻ với AI đa tác tử (CMO, CFO, Persona).",
    icon: Megaphone,
    gradient: "from-amber-500 to-orange-500",
    glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]",
    route: "__campaign__", // special: continue current flow
    badge: "Multi-Agent AI",
  },
  {
    id: "longterm",
    title: "Kế Hoạch Marketing Dài Hạn",
    desc: "Xây dựng bản kế hoạch Marketing toàn diện theo chuẩn Malcolm McDonald (10 bước).",
    icon: BarChart3,
    gradient: "from-blue-600 to-cyan-500",
    glow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]",
    route: "/planning/a0-overview",
    badge: "Enterprise",
  },
  {
    id: "content-lab",
    title: "Content Lab",
    desc: "Phân tích nội dung đối thủ, tạo chiến lược nội dung dựa trên dữ liệu.",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-500",
    glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]",
    route: "/content-lab",
  },
];

export default function ScreenFeatureSelector({ onBack, onGoToCampaign }: Props) {
  const router = useRouter();
  const brandDNA = useFormStore((s: any) => s.brandDNA);
  const companyName = brandDNA?.company_name || "Doanh nghiệp";

  const handleSelect = (feature: typeof FEATURES[0]) => {
    if (feature.route === "__campaign__") {
      // Continue the current multi-agent flow (Screen4 → Workspace)
      onGoToCampaign();
    } else {
      router.push(feature.route);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-6 overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
          <span className="text-sm font-semibold text-cyan-400 tracking-wide">
            DNA đã sẵn sàng — {companyName}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
          Bạn muốn làm gì tiếp theo?
        </h1>
        <p className="text-linear-text-muted text-lg max-w-xl mx-auto">
          Chọn tính năng phù hợp. DNA thương hiệu sẽ được tự động áp dụng vào mọi module.
        </p>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl relative z-10">
        {FEATURES.map((feature, idx) => (
          <motion.button
            key={feature.id}
            id={`feature-${feature.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => handleSelect(feature)}
            className={`group relative text-left overflow-hidden rounded-2xl bg-linear-surface/40 backdrop-blur-xl border border-linear-border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 ${feature.glow}`}
          >
            {/* Badge */}
            {feature.badge && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                {feature.badge}
              </div>
            )}

            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-linear-text-muted flex-1 leading-relaxed">{feature.desc}</p>
            
            <div className="mt-5 flex items-center text-xs font-bold text-linear-text-muted group-hover:text-foreground transition-colors">
              <span className="uppercase tracking-widest">Khởi chạy</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1.5 group-hover:text-cyan-400 transition-all duration-300" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 relative z-10"
      >
        <button 
          onClick={onBack} 
          className="flex items-center text-sm text-linear-text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Quay lại DNA Dashboard
        </button>
      </motion.div>
    </div>
  );
}
