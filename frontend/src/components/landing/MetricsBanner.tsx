"use client";

import React from 'react';
import { motion } from 'framer-motion';

const METRICS = [
 { value: "124+ Tỷ", label: "VNĐ Doanh thu sinh ra" },
 { value: "5 Triệu+", label: "Lượt hiển thị AI Search" },
 { value: "312,407", label: "Giờ tự động hoá" },
 { value: "10,000+", label: "Campaign Tối ưu" },
];

export default function MetricsBanner() {
 return (
 <section className="border-y ultra-thin-border bg-linear-surface/30">
 <div className="max-w-7xl mx-auto px-6 py-12">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {METRICS.map((metric, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: idx * 0.1 }}
 className="text-center"
 >
 <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
 {metric.value}
 </h3>
 <p className="text-xs uppercase tracking-widest text-linear-text-muted font-semibold">
 {metric.label}
 </p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
