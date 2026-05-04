"use client";

import React, { useState, useEffect } from 'react';

export default function SystemIntro() {
  const [stage, setStage] = useState<'intro' | 'zoom' | 'hidden'>('intro');

  useEffect(() => {
    // Hold the "hello" screen for 2.5 seconds, then zoom out
    const zoomTimer = setTimeout(() => {
      setStage('zoom');
    }, 2500);

    const hideTimer = setTimeout(() => {
      setStage('hidden');
    }, 4000);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (stage === 'hidden') return null;

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#070B14] transition-opacity duration-1000 ${
        stage === 'zoom' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient Gradient Background - Mimicking the iOS Hello Screen but with BrandFlow Tone */}
      <div 
        className={`absolute inset-0 transition-transform duration-[1500ms] ease-in-out ${
          stage === 'zoom' ? 'scale-[2]' : 'scale-100'
        }`}
      >
        {/* Top ambient glow (Deep Blue/Purple tinted) */}
        <div className="absolute top-[-20%] left-[-20%] right-[-20%] h-[60vh] bg-gradient-to-b from-[#1E293B]/60 via-[#0F172A]/40 to-transparent blur-[100px] pointer-events-none opacity-90" />
        
        {/* Bottom ambient glow (Cyan/Teal tinted) */}
        <div className="absolute bottom-[-20%] left-[-20%] right-[-20%] h-[60vh] bg-gradient-to-t from-[#06b6d4]/40 via-[#0284c7]/30 to-transparent blur-[120px] pointer-events-none opacity-90" />
        
        {/* Central soft glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Screen Content - The elegant text */}
      <div 
        className={`relative z-10 w-full h-full flex flex-col items-center justify-center px-6 transition-all duration-[1200ms] ease-in-out ${
          stage === 'zoom' ? 'scale-[4] opacity-0 blur-xl' : 'scale-100 opacity-100 blur-0'
        }`}
      >
        {/* Greeting / Brand Text */}
        <div className="flex flex-col items-center justify-center text-center">
          <h1 
            className="text-6xl sm:text-8xl md:text-9xl text-[#E2E8F0] tracking-tight animate-[fadeIn_1.5s_ease-out_forwards]"
            style={{
              fontFamily: "'Dancing Script', 'Brush Script MT', 'Great Vibes', 'Playfair Display', cursive",
              fontWeight: 400,
              textShadow: "0 4px 20px rgba(255, 255, 255, 0.1)"
            }}
          >
            BrandFlow
          </h1>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
      `}} />
    </div>
  );
}
