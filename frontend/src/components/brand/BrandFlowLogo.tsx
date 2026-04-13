"use client";

import React from 'react';
import { motion, type Variants } from 'framer-motion';

export function BrandFlowLogo({ className = "w-48 h-48" }: { className?: string }) {
 // Glow effect colors based on the theme request
 const ELECTRIC_BLUE = "#3B82F6";
 const NEON_CYAN = "#06B6D4";

 const pathVariants: Variants = {
 hidden: { pathLength: 0, opacity: 0 },
 visible: { 
 pathLength: 1, 
 opacity: 1,
 transition: { duration: 2, ease: "easeInOut" as const, repeat: Infinity, repeatType: "reverse" as const }
 }
 };

 const pointVariants: Variants = {
 hidden: { scale: 0, opacity: 0 },
 visible: { 
 scale: 1, 
 opacity: 1,
 transition: { duration: 0.5 }
 },
 hover: { 
 scale: 1.5,
 boxShadow: `0px 0px 10px ${NEON_CYAN}`,
 transition: { duration: 0.2 }
 }
 };

 const pulseCore: Variants = {
 hidden: { scale: 0.8, opacity: 0.5 },
 visible: {
 scale: 1.1,
 opacity: 1,
 transition: { duration: 1.5, ease: "easeInOut" as const, repeat: Infinity, repeatType: "reverse" as const }
 }
 };

 // Node coordinates forming a brain/flow structure
 const nodes = [
 { cx: 50, cy: 50, r: 8 }, // Core
 { cx: 20, cy: 30, r: 4 }, // Top left
 { cx: 25, cy: 70, r: 5 }, // Bottom left
 { cx: 80, cy: 35, r: 5 }, // Top right
 { cx: 75, cy: 75, r: 6 }, // Bottom right
 { cx: 50, cy: 15, r: 4 }, // Top
 { cx: 50, cy: 85, r: 4 } // Bottom
 ];

 const lines = [
 { x1: 50, y1: 50, x2: 20, y2: 30 },
 { x1: 50, y1: 50, x2: 25, y2: 70 },
 { x1: 50, y1: 50, x2: 80, y2: 35 },
 { x1: 50, y1: 50, x2: 75, y2: 75 },
 { x1: 50, y1: 50, x2: 50, y2: 15 },
 { x1: 50, y1: 50, x2: 50, y2: 85 },
 
 // Outer connections
 { x1: 20, y1: 30, x2: 50, y2: 15 },
 { x1: 80, y1: 35, x2: 50, y2: 15 },
 { x1: 25, y1: 70, x2: 50, y2: 85 },
 { x1: 75, y1: 75, x2: 50, y2: 85 }
 ];

 return (
 <div className={`relative flex items-center justify-center ${className}`}>
 {/* Background glow */}
 <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
 
 <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
 <defs>
 <filter id="glow">
 <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
 <feMerge>
 <feMergeNode in="coloredBlur"/>
 <feMergeNode in="SourceGraphic"/>
 </feMerge>
 </filter>
 <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stopColor={ELECTRIC_BLUE} stopOpacity="0.8" />
 <stop offset="100%" stopColor={NEON_CYAN} stopOpacity="0.8" />
 </linearGradient>
 </defs>

 {/* Lines */}
 {lines.map((line, idx) => (
 <motion.line
 key={`line-${idx}`}
 x1={line.x1} y1={line.y1}
 x2={line.x2} y2={line.y2}
 stroke="url(#lineGrad)"
 strokeWidth="1.5"
 variants={pathVariants}
 initial="hidden"
 animate="visible"
 style={{ filter: 'url(#glow)' }}
 />
 ))}

 {/* Nodes */}
 {nodes.map((node, idx) => {
 const isCore = idx === 0;
 return (
 <motion.circle
 key={`node-${idx}`}
 cx={node.cx}
 cy={node.cy}
 r={node.r}
 fill={isCore ? NEON_CYAN : ELECTRIC_BLUE}
 variants={isCore ? pulseCore : pointVariants}
 initial="hidden"
 animate="visible"
 whileHover={isCore ? undefined : "hover"}
 style={{ filter: 'url(#glow)' }}
 className="cursor-pointer"
 />
 );
 })}

 {/* Floating Data Packets */}
 <motion.circle
 r="2"
 fill="#FFFFFF"
 initial={{ cx: 20, cy: 30, opacity: 0 }}
 animate={{ 
 cx: [20, 50, 80], 
 cy: [30, 50, 35],
 opacity: [0, 1, 0]
 }}
 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
 style={{ filter: 'url(#glow)' }}
 />
 
 <motion.circle
 r="2"
 fill="#FFFFFF"
 initial={{ cx: 25, cy: 70, opacity: 0 }}
 animate={{ 
 cx: [25, 50, 75], 
 cy: [70, 50, 75],
 opacity: [0, 1, 0]
 }}
 transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
 style={{ filter: 'url(#glow)' }}
 />
 </svg>
 </div>
 );
}
