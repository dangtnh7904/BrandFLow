"use client";

import React from 'react';
import KanbanBoard from '@/components/workspace/KanbanBoard';
import PipelineProgress from '@/components/workspace/PipelineProgress';

export default function AgileOptimizerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Pipeline Progress at top */}
      <div className="w-full bg-linear-surface/40 border-b border-linear-border/50 backdrop-blur-sm px-4 md:px-8 pt-4 pb-2">
        <div className="max-w-6xl mx-auto">
          <PipelineProgress currentStage={3} />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <KanbanBoard />
      </div>
    </div>
  );
}
