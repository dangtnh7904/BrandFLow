"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Screen1_Source from './phase1/Screen1_Source';
import Screen2_Wizard from './phase1/Screen2_Wizard';
import Screen3_Dashboard from './phase1/Screen3_Dashboard';
import { useFormStore } from '@/store/useFormStore';
import AmbientParticles from '@/components/AmbientParticles';

export default function Phase1_Ingestion({ onGoToHub, onGoToWorkspace }: { onGoToHub: () => void, onGoToWorkspace: () => void }) {
  // 1 = Selection, 2 = Wizard Form, 3 = Analysis Dashboard
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3>(1);
  const generateAndSaveDNA = useFormStore(state => state.generateAndSaveDNA);

  const goToDashboard = async () => {
    // Kích hoạt trích xuất Brand DNA chạy ngầm khi vào Dashboard
    generateAndSaveDNA();
    setCurrentScreen(3);
  };

 return (
 <div className="w-full h-full relative overflow-hidden bg-transparent">
 <div className="absolute inset-0 pointer-events-none z-0">
    <AmbientParticles />
 </div>
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
 <Screen1_Source onNext={(path) => path === 'wizard' ? setCurrentScreen(2) : goToDashboard()} />
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
 <Screen2_Wizard onBack={() => setCurrentScreen(1)} onComplete={goToDashboard} />
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
 <Screen3_Dashboard onGoToHub={onGoToHub} onGoToWorkspace={onGoToWorkspace} />
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
