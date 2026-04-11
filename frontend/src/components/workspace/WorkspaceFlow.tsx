"use client";

import React, { useState } from 'react';
import Phase1_Ingestion from './Phase1_Ingestion';
import Phase2_Debate from './Phase2_Debate';
import Phase3_Tactics from './Phase3_Tactics';
import Phase4_Execution from './Phase4_Execution';

export default function WorkspaceFlow() {
  const [currentStage, setCurrentStage] = useState(1);
  const [globalBudget, setGlobalBudget] = useState('100000000');

  const goToState = (stage: number) => {
    setCurrentStage(stage);
  };

  const handlePhase1Next = (data: any) => {
    if (data.budget) setGlobalBudget(data.budget);
    setCurrentStage(2);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Global Stage Indicator */}
      <div className="w-full bg-linear-surface/80 border-b ultra-thin-border backdrop-blur-md px-6 py-3 flex items-center justify-between shrink-0">
        <h1 className="font-semibold text-white tracking-tight">Campaign Engine</h1>
        <div className="flex items-center space-x-12">
           {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`flex items-center text-xs font-semibold uppercase tracking-widest transition-colors ${currentStage === s ? 'text-cyan-400' : currentStage > s ? 'text-emerald-400 cursor-pointer' : 'text-linear-text-muted'}`}
                   onClick={() => currentStage > s && goToState(s)}
              >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border ${currentStage === s ? 'border-cyan-400 bg-cyan-400/10' : currentStage > s ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10'}`}>
                     {s}
                  </span>
                  Stage {s}
              </div>
           ))}
        </div>
      </div>

      {/* Dynamic Render based on Stage */}
      <div className="flex-1 w-full h-full overflow-hidden relative">
        {currentStage === 1 && <Phase1_Ingestion onNext={handlePhase1Next} />}
        {currentStage === 2 && <Phase2_Debate onNext={() => goToState(3)} onBack={() => goToState(1)} />}
        {currentStage === 3 && <Phase3_Tactics onNext={() => goToState(4)} onBack={() => goToState(2)} globalBudget={globalBudget} />}
        {currentStage === 4 && <Phase4_Execution onBack={() => goToState(3)} />}
      </div>
    </div>
  );
}
