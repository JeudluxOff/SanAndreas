import React from 'react';
import { legalStore } from '@/lib/legal-store';

export const useLegalStore = () => {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    return legalStore.subscribe(() => {
      setTick(t => t + 1);
    });
  }, []);

  return legalStore;
};
