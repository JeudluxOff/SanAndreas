import { useState, useEffect } from 'react';
import { governmentStore } from '@/lib/government-store';

export const useGovernmentStore = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return governmentStore.subscribe(() => {
      setTick(t => t + 1);
    });
  }, []);

  return governmentStore;
};
