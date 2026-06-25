export const getDelay = (ms: number) => typeof window !== 'undefined' && (window as any).__DEMO_MODE__ ? Math.max(500, ms / 3) : ms;
