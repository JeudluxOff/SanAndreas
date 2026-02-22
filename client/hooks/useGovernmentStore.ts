import React from 'react';
import { governmentStore } from '@/lib/government-store';

export const useGovernmentStore = () => {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    return governmentStore.subscribe(() => {
      setTick(t => t + 1);
    });
  }, []);

  return governmentStore;
};
