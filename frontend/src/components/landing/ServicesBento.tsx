"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Megaphone, PenTool, BarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ServicesBento() {
  const { t } = useLanguage();

  const SERVICES = [
    {
      icon: Search,
      title: t('landing_services.s1_title'),
      description: t('landing_services.s1_desc'),
      colSpan: "col-span-1 md:col-span-2",
      accent: "text-cyan-400"
    },
    {
      icon: Megaphone,
      title: t('landing_services.s2_title'),
      description: t('landing_services.s2_desc'),
      colSpan: "col-span-1",
      accent: "text-cyan-400"
    },
    {
      icon: PenTool,
      title: t('landing_services.s3_title'),
      description: t('landing_services.s3_desc'),
      colSpan: "col-span-1",
      accent: "text-blue-400"
    },
    {
      icon: BarChart,
      title: t('landing_services.s4_title'),
      description: t('landing_services.s4_desc'),
      colSpan: "col-span-1 md:col-span-2",
      accent: "text-blue-500"
    }
  ];

  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-6">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          {t('landing_services.title_1')} <span className="gradient-ai-text">{t('landing_services.title_2')}</span>
        </h2>
        <p className="text-linear-text-muted text-lg max-w-2xl">
          {t('landing_services.desc')}
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
            className={service.colSpan}
          >
            <SpotlightCard className="h-full p-8 w-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-linear-surface/50 border ultra-thin-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <service.icon className={`w-6 h-6 ${service.accent}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-linear-text-muted leading-relaxed relative z-10">{service.description}</p>
              </div>
              
              <div className="mt-8 relative z-10 w-full flex items-center justify-start">
                <span className="text-xs font-semibold text-zinc-400 group-hover:text-cyan-500 transition-colors cursor-pointer flex items-center">
                  {t('landing_services.connect')} <span className="ml-1 group-hover:translate-x-1 transition-transform">&gt;</span>
                </span>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bento-card relative overflow-hidden group ${className}`}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0 rounded-2xl"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6,182,212,0.1), transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
