"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Phase1_Ingestion from '@/components/workspace/Phase1_Ingestion';

export default function OnboardingPage() {
  const router = useRouter();

  const handleGoToHub = () => {
    router.push('/hub');
  };

  const handleGoToWorkspace = () => {
    router.push('/workspace');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent">
      <Phase1_Ingestion onGoToHub={handleGoToHub} onGoToWorkspace={handleGoToWorkspace} />
    </div>
  );
}
