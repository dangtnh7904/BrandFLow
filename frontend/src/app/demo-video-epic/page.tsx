"use client";
import React, { useEffect, useState } from 'react';
import Phase1_Ingestion from '@/components/workspace/Phase1_Ingestion';
import WorkspaceFlow from '@/components/workspace/WorkspaceFlow';

const CursorSVG = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))'}}>
    <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 00-.85.36z" fill="white" stroke="black" strokeWidth="1.5"/>
  </svg>
);

export default function EpicDemoVideoPage() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [cameraClass, setCameraClass] = useState("camera-start");
  const [currentPhase, setCurrentPhase] = useState<'onboarding' | 'workspace'>('onboarding');

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const moveCursor = async (x: number, y: number, duration = 800) => {
    return new Promise<void>(resolve => {
      const startX = cursorPos.x < 0 ? window.innerWidth / 2 : cursorPos.x;
      const startY = cursorPos.y < 0 ? window.innerHeight : cursorPos.y;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCursorPos({ x: startX + (x - startX) * ease, y: startY + (y - startY) * ease });
        if (progress < 1) requestAnimationFrame(animate); else resolve();
      };
      requestAnimationFrame(animate);
    });
  };

  const clickCursor = async () => {
    setIsClicking(true); await sleep(150); setIsClicking(false); await sleep(200);
  };

  const simulateClick = async (id: string, customDur = 800) => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      await moveCursor(rect.left + rect.width / 2, rect.top + rect.height / 2, customDur);
      await clickCursor();
      el.click();
      return true;
    }
    return false;
  };

  // Fake Uploading the File bypassing OS Dialog
  const triggerFakeUpload = async () => {
    try {
      const res = await fetch('/BepNhaMoc_BrandFlow.docx');
      const blob = await res.blob();
      const file = new File([blob], 'BepNhaMoc_BrandFlow.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    (window as any).__DEMO_MODE__ = true; // Speed up typing animations

    const runEpicFlow = async () => {
      await sleep(1000);
      setCameraClass("camera-focus-upload");

      // 1. Click Upload Card
      await simulateClick('card-upload', 1000);
      await sleep(500);

      // 2. Trigger Fake File Selection
      await triggerFakeUpload();
      await sleep(500);

      // 3. Click Do Upload
      await simulateClick('btn-do-upload', 800);
      
      // 4. Wait for AI Extraction to finish and Dashboard to show up
      await sleep(5000);
      setCameraClass("camera-zoom-out");
      
      // Give time to read Brand DNA
      await sleep(3000);

      // 5. Click Next on Dashboard to go to Feature Selector
      await simulateClick('btn-next-phase3-dashboard', 1000);
      await sleep(1500);

      // 6. Click Campaign Feature
      await simulateClick('feature-campaign', 1000);
      await sleep(1500);

      // 7. Click Continue on Objective Setting
      await simulateClick('btn-next-phase4-objective', 1000);
      await sleep(1000);

      // 8. Transition to Workspace Flow (Debate)
      setCurrentPhase('workspace');
      setCameraClass("camera-focus-debate");
      await sleep(1000);

      // 9. Debate takes ~12s
      await sleep(12000);

      // 10. Click Next Phase 2 (Go to Tactics Hub)
      await simulateClick('btn-next-phase2', 1000);
      setCameraClass("camera-flip-tactics");
      
      // 11. Wait for Tactics Hub to cycle through Content, Design, Agent, Tactics (4 panels, ~4s each = 16s)
      await sleep(16000);

      // 12. Click Next Phase 3 (Go to Execution)
      await simulateClick('btn-next-phase3', 1000);
      setCameraClass("camera-zoom-out-execution");
      
      // 13. Wait for Math Engine to run and show Export button (10s)
      await sleep(10000);
      
      // 14. Click Export PDF
      await simulateClick('btn-export-pdf', 1000);
      await sleep(2000);
    };

    runEpicFlow();
    return () => { isCancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative perspective-[2000px]">
      
      <div className={`w-full h-screen transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${cameraClass}`}>
        {currentPhase === 'onboarding' ? (
          <Phase1_Ingestion onGoToHub={() => {}} onGoToWorkspace={() => setCurrentPhase('workspace')} />
        ) : (
          <WorkspaceFlow />
        )}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] mix-blend-overlay" />
      </div>

      <div 
        style={{
          position: 'fixed', left: cursorPos.x, top: cursorPos.y, zIndex: 99999,
          pointerEvents: 'none', transition: 'transform 0.1s',
          transform: `translate(-4px, -4px) scale(${isClicking ? 0.8 : 1})`,
          opacity: cursorPos.y < 0 ? 0 : 1
        }}
      >
        <CursorSVG />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .camera-start {
          transform: scale(0.95) translateY(20px); opacity: 0; filter: blur(10px);
          animation: enterStart 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes enterStart {
          to { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
        }

        .camera-focus-upload {
          transform: scale(1.05) translateY(-20px);
          box-shadow: 0 0 50px rgba(59, 130, 246, 0.2);
        }

        .camera-zoom-out {
          transform: scale(0.95);
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.2);
        }

        .camera-focus-debate {
          transform: scale(1.05) translateY(-20px);
          box-shadow: 0 0 50px rgba(16, 185, 129, 0.2);
        }

        .camera-flip-tactics {
          transform: rotateY(-5deg) rotateX(2deg) scale(0.95);
          box-shadow: -20px 20px 60px rgba(6, 182, 212, 0.2);
        }

        .camera-zoom-out-execution {
          transform: rotateY(0deg) rotateX(0deg) scale(1);
          box-shadow: 0 0 100px rgba(139, 92, 246, 0.2);
        }
      `}} />
    </div>
  );
}
