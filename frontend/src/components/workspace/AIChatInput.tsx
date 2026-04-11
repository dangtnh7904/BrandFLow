"use client";

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIChatInput() {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="flex flex-col h-full bg-linear-surface/50 border-r ultra-thin-border">
      <div className="p-6 border-b ultra-thin-border flex items-center justify-between">
        <h2 className="text-lg font-medium text-white flex items-center">
          <Bot className="w-5 h-5 mr-2 text-cyan-400" />
          Brand Architect AI
        </h2>
        <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-linear-text-muted uppercase tracking-wider">
          Strategic Mode
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Placeholder Chat History */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
            <span className="text-indigo-400 text-xs font-bold">U</span>
          </div>
          <div className="text-sm text-linear-text-muted leading-relaxed">
            I need a high-impact social media post for our Q3 product launch focusing on sustainable materials.
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full gradient-ai-bg flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm text-white leading-relaxed">
            I've drafted a compelling post that emphasizes your commitment to zero-waste packaging and sustainable sourcing. I'm also generating a visual asset to match. Check the preview canvas!
          </div>
        </div>
      </div>

      <div className="p-4 border-t ultra-thin-border bg-linear-bg">
        <div className="relative flex items-center">
          <button className="absolute left-3 text-linear-text-muted hover:text-white transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>
          
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-sm text-white placeholder:text-linear-text-muted focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
            placeholder="Describe the campaign asset you want to create..."
          />

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 p-1.5 gradient-ai-bg rounded-lg flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
