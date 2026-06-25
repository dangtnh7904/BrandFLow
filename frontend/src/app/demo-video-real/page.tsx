"use client";
import React, { useEffect, useState } from 'react';
import Phase1_Ingestion from '@/components/workspace/Phase1_Ingestion';
import WorkspaceFlow from '@/components/workspace/WorkspaceFlow';
import './vfx.css';

export default function DemoRealVideoPage() {
  const [cameraClass, setCameraClass] = useState("camera-start");
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [vfxPhase, setVfxPhase] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Enhanced safeClick with retry logic to ensure elements are found and clicked
  const safeClick = async (id: string, retries = 30) => {
    return new Promise<void>((resolve) => {
      let attempts = 0;
      const tryClick = () => {
        const el = document.getElementById(id);
        if (el) {
          console.log(`[Demo Script] Clicking element: ${id}`);
          el.click();
          resolve();
        } else {
          attempts++;
          if (attempts < retries) {
            setTimeout(tryClick, 100);
          } else {
            console.warn(`[Demo Script] WARNING: Element not found: ${id}`);
            resolve(); // Resolve anyway to avoid hanging the script
          }
        }
      };
      tryClick();
    });
  };

  const smoothScroll = async (id: string, amount: number, duration: number) => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = el.scrollTop;
    const startTime = performance.now();
    
    return new Promise<void>(resolve => {
      const animateScroll = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing function (easeInOutCubic)
        const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        el.scrollTop = start + amount * ease;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(animateScroll);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    (window as any).__DEMO_MODE__ = true;

    const runFlow = async () => {
      // INTRO & UPLOAD (0s - 15s)
      await sleep(2000);
      setCameraClass("camera-focus-debate");
      await safeClick('card-upload');
      
      await sleep(2000);
      await safeClick('demo-inject-file');
      
      // PREVIEW FILE CONTENT
      await sleep(1500);
      await safeClick('demo-injected-file-row');
      
      await sleep(1500);
      await smoothScroll('preview-scroll-container', 800, 3000); // Scroll down to show content
      await sleep(1500);
      await safeClick('btn-close-preview');

      await sleep(1000);
      setVfxPhase("laser-scan"); // Trigger laser scan when uploading
      await safeClick('btn-do-upload');
      
      await sleep(6000);
      setVfxPhase(null);
      await safeClick('btn-proceed-phase1');

      // BUSINESS INTENT (15s - 30s)
      await sleep(3000);
      await safeClick('mode-budget-first');
      await sleep(3000);
      await safeClick('btn-budget-100000000'); 
      await sleep(4000);
      await safeClick('btn-proceed-intent');

      // DASHBOARD (30s - 50s)
      setVfxPhase("energy-sphere"); // Trigger DNA extraction pulse
      await sleep(10000); // 10s looking at the dashboard
      setVfxPhase(null);
      setCameraClass("camera-flip-tactics");
      await safeClick('btn-next-phase3-dashboard');

      // FEATURE SELECTOR (50s - 65s)
      await sleep(5000);
      await safeClick('feature-campaign');
      await sleep(5000);
      await safeClick('btn-next-phase4-objective');

      // TRANSITION TO WORKSPACE (65s - 70s)
      await sleep(3000);
      setShowWorkspace(true);
      setVfxPhase("hologram"); // Glitch transition
      await sleep(2000);
      setVfxPhase("matrix"); // Start matrix background for Debate

      // PHASE 2: DEBATE (70s - 90s)
      setCameraClass("camera-zoom-out-execution");
      await sleep(20000); // Allow 20s to read debate
      await safeClick('btn-next-phase2');

      // PHASE 3: TACTICS (90s - 105s)
      await sleep(15000);
      await safeClick('btn-next-phase3');

      // PHASE 4: EXECUTION (105s - 120s)
      setCameraClass("camera-focus-debate");
      await sleep(15000);
      await safeClick('btn-next-phase4');

      // PHASE 5: CREATIVE (120s - 135s)
      setCameraClass("camera-start");
      await sleep(15000);
      await safeClick('btn-next-phase5');

      // PHASE 6: AGENT DEPLOY (135s - 150s)
      setVfxPhase("ripple");
      setCameraClass("camera-zoom-out-execution");
      await sleep(15000);
      setVfxPhase("matrix");
      await safeClick('btn-next-phase6');

      // PHASE 7: REPORT (150s - 170s)
      await sleep(15000);
      await safeClick('btn-export-final');

    };

    runFlow();
    return () => { isCancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative perspective-[2000px]">
      
      {vfxPhase === 'matrix' && <div className="vfx-matrix-stream" />}

      <div className={`w-full h-screen transition-all duration-[3000ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${cameraClass}`}>
        {!showWorkspace ? (
          <Phase1_Ingestion onGoToHub={() => {}} onGoToWorkspace={() => setShowWorkspace(true)} />
        ) : (
          <WorkspaceFlow />
        )}
        
        {/* Overlays */}
        {vfxPhase === 'laser-scan' && <div className="vfx-laser-scan" />}
        {vfxPhase === 'energy-sphere' && <div className="vfx-energy-sphere" />}
        {vfxPhase === 'hologram' && <div className="vfx-hologram" />}
        {vfxPhase === 'ripple' && <div className="vfx-ripple-wave" />}

        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,255,255,0.1)] mix-blend-overlay" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .camera-start {
          transform: scale(0.98) translateY(10px);
          opacity: 0;
          animation: enterStart 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes enterStart {
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .camera-focus-debate {
          transform: scale(1.02);
          box-shadow: 0 0 120px rgba(16, 185, 129, 0.2);
        }
        .camera-flip-tactics {
          transform: rotateY(-2deg) rotateX(1deg) scale(0.98);
          box-shadow: -20px 20px 80px rgba(6, 182, 212, 0.2);
        }
        .camera-zoom-out-execution {
          transform: rotateY(0deg) rotateX(0deg) scale(1);
          box-shadow: 0 0 150px rgba(139, 92, 246, 0.2);
        }
      `}} />
    </div>
  );
}
