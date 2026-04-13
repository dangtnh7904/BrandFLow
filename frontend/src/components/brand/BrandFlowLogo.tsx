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
      transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
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
      transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
    }
  };

  const leftLines = [
    { d: "M 15 35 C 30 35, 35 20, 50 20" },
    { d: "M 8 45 C 25 45, 30 40, 45 40" },
    { d: "M 8 55 C 25 55, 30 60, 45 60" },
    { d: "M 15 65 C 30 65, 35 80, 50 80" }
  ];

  const networkLines = [
    { x1: 50, y1: 20, x2: 80, y2: 50 }, // T to R
    { x1: 50, y1: 20, x2: 65, y2: 50 }, // T to C
    { x1: 50, y1: 20, x2: 45, y2: 40 }, // T to MidTop
    
    { x1: 50, y1: 80, x2: 80, y2: 50 }, // B to R
    { x1: 50, y1: 80, x2: 65, y2: 50 }, // B to C
    { x1: 50, y1: 80, x2: 45, y2: 60 }, // B to MidBot

    { x1: 80, y1: 50, x2: 65, y2: 50 }, // R to C
    { x1: 80, y1: 50, x2: 45, y2: 40 }, // R to MidTop (cross line)
    { x1: 80, y1: 50, x2: 45, y2: 60 }, // R to MidBot (cross line)
    
    { x1: 45, y1: 40, x2: 65, y2: 50 }, // MidTop to C
    { x1: 45, y1: 40, x2: 45, y2: 60 }, // MidTop to MidBot

    { x1: 45, y1: 60, x2: 65, y2: 50 }, // MidBot to C
  ];

  const nodes = [
    { cx: 50, cy: 20, r: 3.5 }, // T
    { cx: 50, cy: 80, r: 3.5 }, // B
    { cx: 80, cy: 50, r: 4 }, // R
    { cx: 65, cy: 50, r: 3 }, // C
    { cx: 45, cy: 40, r: 3 }, // MidTop
    { cx: 45, cy: 60, r: 3 }, // MidBot
    { cx: 15, cy: 35, r: 3 }, // Left1
    { cx: 8, cy: 45, r: 2.5 }, // Left2
    { cx: 8, cy: 55, r: 2.5 }, // Left3
    { cx: 15, cy: 65, r: 3 }  // Left4
  ];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background glow */}
      <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={ELECTRIC_BLUE} stopOpacity="0.9" />
            <stop offset="100%" stopColor={NEON_CYAN} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Dynamic Sweep Lines (Left) */}
        {leftLines.map((line, idx) => (
          <motion.path
            key={`leftLine-${idx}`}
            d={line.d}
            stroke="url(#lineGrad)"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            style={{ filter: 'url(#glow)' }}
          />
        ))}

        {/* Network Connections (Right) */}
        {networkLines.map((line, idx) => (
          <motion.line
            key={`netLine-${idx}`}
            x1={line.x1} y1={line.y1}
            x2={line.x2} y2={line.y2}
            stroke={NEON_CYAN}
            strokeOpacity="0.6"
            strokeWidth="1.2"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            style={{ filter: 'url(#glow)' }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const isRightEdge = idx === 2; // R
          return (
            <motion.circle
              key={`node-${idx}`}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={NEON_CYAN}
              variants={isRightEdge ? pulseCore : pointVariants}
              initial="hidden"
              animate="visible"
              whileHover={isRightEdge ? undefined : "hover"}
              style={{ filter: 'url(#glow)' }}
              className="cursor-pointer"
            />
          );
        })}

        {/* Floating Ambient Sparks */}
        <motion.circle
          r="1.5"
          fill="#FFFFFF"
          initial={{ cx: 20, cy: 30, opacity: 0 }}
          animate={{ 
            cx: [20, 50, 75], 
            cy: [30, 50, 45],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ filter: 'url(#glow)' }}
        />
        
        <motion.circle
          r="1"
          fill={NEON_CYAN}
          initial={{ cx: 10, cy: 60, opacity: 0 }}
          animate={{ 
            cx: [10, 45, 65], 
            cy: [60, 60, 50],
            opacity: [0, 0.8, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
          style={{ filter: 'url(#glow)' }}
        />
      </svg>
    </div>
  );
}
