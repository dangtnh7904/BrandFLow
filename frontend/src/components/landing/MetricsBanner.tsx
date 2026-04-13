"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const METRICS = [
  { value: 124, suffix: "+", label: "Tỷ VNĐ Doanh thu sinh ra" },
  { value: 5, suffix: "M+", label: "Lượt hiển thị AI Search" },
  { value: 312, suffix: "k", label: "Giờ làm việc tự động hoá" },
  { value: 10, suffix: "k+", label: "Campaign Tối ưu" },
];

function AnimatedCounter({ end, suffix }: { end: number, suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000; // 2s duration

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end]);

  return <>{count}{suffix}</>;
}

export default function MetricsBanner() {
  return (
    <section className="relative -mt-16 z-30 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-linear-surface/80 backdrop-blur-xl border ultra-thin-border rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
        >
          {/* Subtle glowing lines inside */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {METRICS.map((metric, idx) => (
              <div 
                key={idx}
                className="text-center flex flex-col items-center justify-center relative"
              >
                {/* Separator for desktop */}
                {idx > 0 && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-linear-border/50" />}
                
                <h3 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 dark:from-white dark:to-slate-400">
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                </h3>
                <p className="text-xs md:text-sm uppercase tracking-widest text-linear-text-muted font-bold max-w-[150px]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
