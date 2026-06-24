"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Screen1_Source from './phase1/Screen1_Source';
import Screen2_Wizard from './phase1/Screen2_Wizard';
import Screen3_Dashboard from './phase1/Screen3_Dashboard';

export default function Phase1_Ingestion({ onNext }: { onNext: (data: any) => void }) {
  // 1 = Selection, 2 = Wizard Form, 3 = Analysis Dashboard
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3>(() => {
     if (typeof window !== 'undefined') {
        return parseInt(localStorage.getItem('bf_phase1_screen') || '1') as 1|2|3;
     }
     return 1;
  });

  const goScreen = (scr: 1|2|3) => {
     setCurrentScreen(scr);
     if (typeof window !== 'undefined') {
        localStorage.setItem('bf_phase1_screen', scr.toString());
     }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-black/20">
      <AnimatePresence mode="wait">
        {currentScreen === 1 && (
          <motion.div 
            key="screen1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
             <Screen1_Source onNext={(path) => goScreen(path === 'wizard' ? 2 : 3)} />
          </motion.div>
        )}
        
        {currentScreen === 2 && (
          <motion.div 
            key="screen2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 overflow-y-auto"
          >
             <Screen2_Wizard onBack={() => goScreen(1)} onComplete={() => goScreen(3)} />
          </motion.div>
        )}

        {currentScreen === 3 && (
          <motion.div 
            key="screen3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-md"
          >
             <Screen3_Dashboard onComplete={() => onNext({ budget: "100000000" })} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
