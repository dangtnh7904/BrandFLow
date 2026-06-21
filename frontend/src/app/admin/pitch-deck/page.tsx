"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Layers, BookOpen } from 'lucide-react';
import PitchDeckSlides from '../PitchDeckSlides';
import BusinessModelOnePager from '../BusinessModelOnePager';
import InternalPitchGuide from '../InternalPitchGuide';

export default function PitchDeckPage() {
  const [pitchTab, setPitchTab] = useState<'12-slide' | 'onepager' | 'guide'>('12-slide');

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HEADER ─── */}
      <div className="border-b border-linear-border/50 bg-linear-surface/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tight">Pitch Deck & Business Model</h1>
              <p className="text-[11px] text-linear-text-muted">BrandFlow Investor Presentation</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div key="pitch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 pb-20">
            <div className="flex justify-center gap-4 mb-8 pt-4">
              <button 
                onClick={() => setPitchTab('12-slide')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${pitchTab === '12-slide' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105' : 'bg-linear-surface border border-linear-border text-linear-text-muted hover:text-foreground'}`}
              >
                <Rocket className="w-4 h-4 inline-block mr-2 -mt-0.5" /> 12-Slide Pitch Deck
              </button>
              <button 
                onClick={() => setPitchTab('onepager')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${pitchTab === 'onepager' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105' : 'bg-linear-surface border border-linear-border text-linear-text-muted hover:text-foreground'}`}
              >
                <Layers className="w-4 h-4 inline-block mr-2 -mt-0.5" /> Business Model One-Pager
              </button>
              <button 
                onClick={() => setPitchTab('guide')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${pitchTab === 'guide' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105' : 'bg-linear-surface border border-linear-border text-linear-text-muted hover:text-foreground'}`}
              >
                <BookOpen className="w-4 h-4 inline-block mr-2 -mt-0.5" /> Hướng Dẫn Nội Bộ
              </button>
            </div>

            {pitchTab === '12-slide' && <PitchDeckSlides />}
            {pitchTab === 'onepager' && <BusinessModelOnePager />}
            {pitchTab === 'guide' && <InternalPitchGuide />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
