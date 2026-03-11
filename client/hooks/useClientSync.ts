import React from 'react';
import { legalStore } from '@/lib/legal-store';

interface SyncStatus {
  isSyncing: boolean;
  lastSyncAt: string | null;
  error: string | null;
  syncCount: number;
}

const DEFAULT_SYNC_INTERVAL = 10000; // 10 seconds
const SYNC_STATUS_STORAGE_KEY = 'client_sync_status';

/**
 * Hook to manage real-time sync of client portal data with the server
 * Uses polling to fetch updates every N seconds
 */
export const useClientSync = (clientId?: string, syncIntervalMs = DEFAULT_SYNC_INTERVAL) => {
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus>({
    isSyncing: false,
    lastSyncAt: null,
    error: null,
    syncCount: 0
  });

  const syncTimeoutRef = React.useRef<NodeJS.Timeout>();
  const syncIntervalRef = React.useRef<NodeJS.Timeout>();

  // Perform manual sync
  const sync = React.useCallback(async () => {
    if (!clientId || syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      // Fetch client-specific data from server
      const response = await fetch(`/api/v2/clients/${clientId}/cases`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Sync failed with status ${response.status}`);
      }

      const serverCases = await response.json();

      // Get current local data
      const localCases = legalStore.getCases().filter(c => c.client_id === clientId);

      // Merge using timestamp-based conflict resolution
      const mergedCases = [...localCases];

      for (const serverCase of serverCases) {
        const localCaseIdx = mergedCases.findIndex(c => c.id === serverCase.id);

        if (localCaseIdx === -1) {
          // New case from server
          mergedCases.push(serverCase);
        } else {
          // Existing case - use newer version based on updated_at timestamp
          const localTime = new Date(mergedCases[localCaseIdx].updated_at || 0).getTime();
          const serverTime = new Date(serverCase.updated_at || 0).getTime();

          if (serverTime > localTime) {
            mergedCases[localCaseIdx] = serverCase;
          }
        }
      }

      // Update sync status
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: new Date().toISOString(),
        syncCount: prev.syncCount + 1,
        error: null
      }));
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      }));
    }
  }, [clientId, syncStatus.isSyncing]);

  // Auto-sync on interval
  React.useEffect(() => {
    if (!clientId) return;

    // Initial sync immediately
    sync();

    // Then sync periodically
    syncIntervalRef.current = setInterval(() => {
      sync();
    }, syncIntervalMs);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [clientId, syncIntervalMs, sync]);

  // Helper: Get human-readable time since last sync
  const getLastSyncText = React.useCallback((): string => {
    if (!syncStatus.lastSyncAt) return 'Never';

    const lastSync = new Date(syncStatus.lastSyncAt);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffMins === 0) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }, [syncStatus.lastSyncAt]);

  return {
    syncStatus,
    sync,
    getLastSyncText
  };
};

/**
 * Hook to get and format sync status for UI
 */
export const useSyncStatusText = (syncStatus: SyncStatus): string => {
  if (syncStatus.isSyncing) {
    return 'Syncing...';
  }
  if (syncStatus.error) {
    return `Error: ${syncStatus.error}`;
  }
  if (!syncStatus.lastSyncAt) {
    return 'Never synced';
  }

  const lastSync = new Date(syncStatus.lastSyncAt);
  const now = new Date();
  const diffMs = now.getTime() - lastSync.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);

  if (diffMins === 0) return 'Just now';
  if (diffMins === 1) return 'Last synced: 1 minute ago';
  if (diffMins < 60) return `Last synced: ${diffMins} minutes ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return 'Last synced: 1 hour ago';
  if (diffHours < 24) return `Last synced: ${diffHours} hours ago`;

  return `Last synced: ${lastSync.toLocaleDateString()}`;
};
