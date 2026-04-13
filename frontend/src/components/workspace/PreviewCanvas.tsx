"use client";

import React from 'react';
import { Eye, Copy, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PreviewCanvas() {
 return (
 <div className="flex flex-col h-full bg-linear-bg">
 <div className="p-4 border-b ultra-thin-border flex items-center justify-between bg-linear-surface/30">
 <div className="flex items-center space-x-2">
 <Eye className="w-4 h-4 text-linear-text-muted" />
 <span className="text-sm font-medium text-linear-text-muted">Preview Canvas</span>
 </div>

 <div className="flex items-center space-x-2">
 <button className="p-2 rounded-lg text-linear-text-muted hover:text-white hover:bg-white/5 transition-colors">
 <RefreshCw className="w-4 h-4" />
 </button>
 <button className="p-2 rounded-lg text-linear-text-muted hover:text-white hover:bg-white/5 transition-colors">
 <Copy className="w-4 h-4" />
 </button>
 <button className="flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-linear-surface/5 border border-white/10 hover:bg-white/10 transition-colors">
 <Download className="w-3 h-3 mr-2" />
 Export
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIj48L2NpcmNsZT4KPC9zdmc+')]">
 
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease: "easeOut" }}
 className="max-w-2xl w-full bg-linear-surface border ultra-thin-border rounded-2xl shadow-2xl overflow-hidden"
 >
 {/* Mock Generated Asset */}
 <div className="aspect-[16/9] w-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border-b ultra-thin-border relative overflow-hidden">
 
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611080766175-47f6361aefd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
 
 <h1 className="text-4xl font-black text-white z-20 flex items-center">
 <span className="gradient-ai-text mr-3">SUSTAINABLE</span> FUTURE.
 </h1>
 </div>

 <div className="p-6">
 <h3 className="text-white text-lg font-bold mb-2">Q3 Launch: &quot;Eco-First&quot; Collection</h3>
 <p className="text-sm text-linear-text-muted mb-4 leading-relaxed">
 We&apos;re redefining what it means to build responsibly. Our new Q3 collection utilizes 100% upcycled materials, moving us closer to a zero-carbon footprint. Join the revolution. 🌱✨ #EcoFirst #SustainableTech
 </p>
 <div className="flex flex-wrap gap-2">
 <span className="px-2 py-1 bg-linear-surface/5 rounded-md text-[10px] text-cyan-400 font-medium">Platform: Instagram</span>
 <span className="px-2 py-1 bg-linear-surface/5 rounded-md text-[10px] text-purple-400 font-medium">Format: Post + Image</span>
 </div>
 </div>
 </motion.div>

 </div>
 </div>
 );
}
