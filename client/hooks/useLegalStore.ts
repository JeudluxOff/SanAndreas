import React from 'react';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { initializeSync, getSyncClient, disconnectSync } from '@/lib/websocket-sync';

export const useLegalStore = () => {
  const [, setTick] = React.useState(0);
  const { user } = useAuth();
  const [wsInitialized, setWsInitialized] = React.useState(false);

  React.useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = legalStore.subscribe(() => {
      setTick(t => t + 1);
    });

    return unsubscribe;
  }, []);

  // Initialize WebSocket sync on mount
  React.useEffect(() => {
    if (user && !wsInitialized) {
      initializeSync(user.id, user.role)
        .then(() => {
          setWsInitialized(true);
          console.log('✓ Real-time sync initialized via WebSocket');

          // Listen to real-time events
          const syncClient = getSyncClient();

          // Listen to all sync events
          syncClient.on('all', (event) => {
            console.log('[SYNC]', event.type, event.data);

            // Handle different event types
            switch (event.type) {
              case 'case:created':
              case 'case:updated':
              case 'case:deleted':
                // Refresh cases
                legalStore.syncData();
                break;
              case 'document:created':
              case 'document:updated':
              case 'document:deleted':
                // Refresh documents
                legalStore.syncData();
                break;
              case 'client:created':
              case 'client:updated':
                // Refresh clients
                legalStore.syncData();
                break;
              case 'invoice:created':
              case 'invoice:updated':
                // Refresh invoices
                legalStore.syncData();
                break;
              case 'notification:new':
                // Handle new notification
                console.log('📬 New notification:', event.data);
                break;
            }
          });
        })
        .catch((error) => {
          console.warn('WebSocket initialization failed, falling back to polling:', error);
          // Fall back to polling if WebSocket fails
        });

      return () => {
        disconnectSync();
        setWsInitialized(false);
      };
    }
  }, [user, wsInitialized]);

  return legalStore;
};
