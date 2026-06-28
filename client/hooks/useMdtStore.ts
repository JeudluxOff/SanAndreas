import { useState, useEffect } from 'react';
import { mdtStore } from '@/lib/mdt-store';

export const useMdtStore = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mdtStore.subscribe(() => {
      setTick(t => t + 1);
    });
  }, []);

  return mdtStore;
};
