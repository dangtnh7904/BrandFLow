"use client";

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIChatInput() {
 const [prompt, setPrompt] = useState('');

 return (
 <div className="flex flex-col h-full bg-background border-r border-linear-border">
 <div className="p-6 border-b border-linear-border flex items-center justify-between bg-linear-surface">
 <h2 className="text-lg font-bold text-foreground flex items-center">
 <Bot className="w-5 h-5 mr-2 text-cyan-500" />
 Brand Architect AI
 </h2>
 <span className="px-2 py-1 bg-linear-surface/50 border border-linear-border border border-linear-border rounded-md text-[10px] font-bold text-linear-text-muted uppercase tracking-wider">
 Strategic Mode
 </span>
 </div>

 <div className="flex-1 overflow-y-auto p-6 space-y-6">
 {/* Placeholder Chat History */}
 <div className="flex items-start gap-4">
 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
 <span className="text-indigo-700 text-xs font-bold">U</span>
 </div>
 <div className="text-sm font-medium text-foreground leading-relaxed bg-linear-surface p-3 rounded-2xl rounded-tl-none border border-linear-border shadow-sm">
 I need a high-impact social media post for our Q3 product launch focusing on sustainable materials.
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-sm">
 <Sparkles className="w-4 h-4 text-white" />
 </div>
 <div className="text-sm font-medium text-foreground leading-relaxed bg-linear-surface p-3 rounded-2xl rounded-tl-none border border-purple-200 shadow-sm">
 I've drafted a compelling post that emphasizes your commitment to zero-waste packaging and sustainable sourcing. I'm also generating a visual asset to match. Check the preview canvas!
 </div>
 </div>
 </div>

 <div className="p-4 border-t border-linear-border bg-linear-surface">
 <div className="relative flex items-center">
 <button className="absolute left-3 text-linear-text-muted hover:text-linear-text-muted transition-colors">
 <Paperclip className="w-4 h-4" />
 </button>
 
 <input 
 type="text" 
 value={prompt}
 onChange={(e) => setPrompt(e.target.value)}
 className="w-full bg-background border border-linear-border shadow-sm rounded-xl py-3 pl-10 pr-12 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
 placeholder="Describe the campaign asset you want to create..."
 />

 <motion.button 
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 className="absolute right-2 p-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md"
 >
 <Send className="w-4 h-4 text-white" />
 </motion.button>
 </div>
 </div>
 </div>
 );
}
