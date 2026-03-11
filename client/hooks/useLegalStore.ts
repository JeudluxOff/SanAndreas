import React from 'react';
import { legalStore } from '@/lib/legal-store';

/**
 * Hook to use legal store with automatic re-renders on data changes
 * Hooks are always called in the same order - no conditional hooks
 */
export const useLegalStore = () => {
  // Always call hooks in the same order
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    // Subscribe to store changes for re-renders
    const unsubscribe = legalStore.subscribe(() => {
      setTick(t => t + 1);
    });

    return unsubscribe;
  }, []);

  return legalStore;
};
