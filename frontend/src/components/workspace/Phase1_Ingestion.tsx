"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Screen1_Source from './phase1/Screen1_Source';
import ScreenBusinessIntent from './phase1/ScreenBusinessIntent';
import Screen2_Wizard from './phase1/Screen2_Wizard';
import Screen3_Dashboard from './phase1/Screen3_Dashboard';
import Screen4_ObjectiveSetting from './phase1/Screen4_ObjectiveSetting';
import ScreenFeatureSelector from './phase1/ScreenFeatureSelector';
import { useFormStore } from '@/store/useFormStore';
import AmbientParticles from '@/components/AmbientParticles';

export default function Phase1_Ingestion({ onGoToHub, onGoToWorkspace }: { onGoToHub: () => void, onGoToWorkspace: () => void }) {
  // 1 = Source Selection, 1.5 = Business Intent, 2 = Wizard Form, 3 = DNA Dashboard, 3.5 = Feature Selector, 4 = Campaign Objective Setting
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [intentNextPath, setIntentNextPath] = useState<'wizard' | 'dashboard'>('wizard');
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
 <Screen3_Dashboard onGoToHub={onGoToHub} onGoToNext={() => setCurrentScreen(1.5)} />
 </motion.div>
 )}

 {currentScreen === 1.5 && (
 <motion.div 
 key="screen-intent"
 initial={{ opacity: 0, x: 50 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -50 }}
 transition={{ duration: 0.4 }}
 className="absolute inset-0"
 >
 <ScreenBusinessIntent onNext={() => setCurrentScreen(3.5)} />
 </motion.div>
 )}

 {/* NEW: Feature Selector Screen — appears after Business Intent */}
 {currentScreen === 3.5 && (
 <motion.div 
 key="screen-feature-selector"
 initial={{ opacity: 0, x: 50 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -50 }}
 transition={{ duration: 0.4 }}
 className="absolute inset-0 z-50 bg-black/50 backdrop-blur-md"
 >
 <ScreenFeatureSelector 
   onBack={() => setCurrentScreen(1.5)} 
   onGoToCampaign={() => setCurrentScreen(4)} 
 />
 </motion.div>
 )}

 {currentScreen === 4 && (
 <motion.div 
 key="screen4"
 initial={{ opacity: 0, x: 50 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -50 }}
 transition={{ duration: 0.4 }}
 className="absolute inset-0 z-50 bg-black/50 backdrop-blur-md"
 >
 <Screen4_ObjectiveSetting onBack={() => setCurrentScreen(3.5)} onGoToWorkspace={onGoToWorkspace} />
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
