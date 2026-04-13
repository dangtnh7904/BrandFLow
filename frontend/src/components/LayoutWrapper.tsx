"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import AmbientParticles from "./AmbientParticles";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isLandingPage = pathname === "/";

 if (isLandingPage) {
 return <main className="w-full h-full min-h-screen">{children}</main>;
 }

  return (
  <div className="flex text-foreground h-screen w-full relative overflow-hidden bg-slate-50 dark:bg-transparent">
    
    {/* LỚP TẦNG 1: The Abyss / The Clean Room (Base Radial Gradient Layer) - CROSSFADE OPACITY DO GRADIENT KHÔNG TRANSITION ĐƯỢC */}
    <div className="absolute inset-0 z-0 w-full h-full transition-opacity duration-700 opacity-100 dark:opacity-0 bg-[radial-gradient(circle_at_top_left,_#F0F9FF_0%,_#F8FAFC_100%)]" />
    <div className="absolute inset-0 z-0 w-full h-full transition-opacity duration-700 opacity-0 dark:opacity-100 bg-[radial-gradient(circle_at_top_left,_#0B1120_0%,_#020617_100%)]" />

    {/* LỚP TẦNG 2: The Grid (Structural Layer) */}
    <div className="absolute inset-0 z-0 pointer-events-none opacity-10 dark:opacity-[0.04] transition-opacity duration-500">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <pattern id="structural-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-cyan-600 dark:text-cyan-400" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#structural-grid)" />
      </svg>
    </div>

    {/* LỚP TẦNG 3: Chiều sâu (Ambient Glow) */}
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-400/20 dark:bg-cyan-500/15 rounded-full blur-[150px] transition-colors duration-500" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-400/20 dark:bg-blue-600/15 rounded-full blur-[150px] transition-colors duration-500" />
    </div>

    {/* LỚP TẦNG 4: Sự sống (Micro-motion WebGL Data Dust) */}
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60 dark:opacity-100">
      <AmbientParticles />
    </div>

    {/* LỚP GIAO DIỆN (UI LAYER) */}
    <div className="z-20 shrink-0 border-r border-linear-border/50 bg-white/70 dark:bg-[#0B1120]/40 backdrop-blur-xl transition-colors duration-500">
      <Sidebar />
    </div>
    
    <main className="flex-1 overflow-y-auto w-full relative z-10">
      {children}
    </main>
  </div>
  );
}
