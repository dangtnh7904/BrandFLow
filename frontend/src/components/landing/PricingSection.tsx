"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PricingSection() {
  const { t } = useLanguage();

  const TIERS = [
    {
      name: t('landing_pricing.tier1_name'),
      price: t('landing_pricing.tier1_price'),
      description: t('landing_pricing.tier1_desc'),
      features: [
        t('landing_pricing.tier1_f1'),
        t('landing_pricing.tier1_f2'),
        t('landing_pricing.tier1_f3'),
        t('landing_pricing.tier1_f4')
      ],
      cta: t('landing_pricing.tier1_cta'),
      link: "/dashboard",
      popular: false
    },
    {
      name: t('landing_pricing.tier2_name'),
      price: t('landing_pricing.tier2_price'),
      period: t('landing_pricing.tier2_period'),
      description: t('landing_pricing.tier2_desc'),
      features: [
        t('landing_pricing.tier2_f1'),
        t('landing_pricing.tier2_f2'),
        t('landing_pricing.tier2_f3'),
        t('landing_pricing.tier2_f4'),
        t('landing_pricing.tier2_f5')
      ],
      cta: t('landing_pricing.tier2_cta'),
      link: "/dashboard",
      popular: true
    },
    {
      name: t('landing_pricing.tier3_name'),
      price: t('landing_pricing.tier3_price'),
      description: t('landing_pricing.tier3_desc'),
      features: [
        t('landing_pricing.tier3_f1'),
        t('landing_pricing.tier3_f2'),
        t('landing_pricing.tier3_f3'),
        t('landing_pricing.tier3_f4')
      ],
      cta: t('landing_pricing.tier3_cta'),
      link: "#",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          {t('landing_pricing.title')}
        </h2>
        <p className="text-linear-text-muted text-lg max-w-2xl mx-auto">
          {t('landing_pricing.desc')}
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
            className={`bento-card flex flex-col transition-transform duration-300 ${tier.popular ? '!overflow-visible border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative md:scale-105 z-10' : 'hover:-translate-y-1'}`}
          >
            {tier.popular && (
              <>
                <div className="absolute top-0 right-8 transform -translate-y-1/2 z-20">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    {t('landing_pricing.tier2_badge')}
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
