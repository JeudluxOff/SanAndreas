import React, { createContext, useState, useContext, useEffect } from 'react';

// Global notifier function that stores will use
let globalDraftNotifier: ((change: Omit<DraftChange, 'id' | 'timestamp'>) => void) | null = null;

export function notifyDraftChange(change: Omit<DraftChange, 'id' | 'timestamp'>) {
  if (globalDraftNotifier) {
    globalDraftNotifier(change);
  }
}

export interface DraftChange {
  id: string;
  type: 'government' | 'legal';
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  entityName: string;
  changes: Record<string, any>;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface AdminContextType {
  draftChanges: DraftChange[];
  pendingPublications: number;
  addDraftChange: (change: Omit<DraftChange, 'id' | 'timestamp'>) => void;
  removeDraftChange: (id: string) => void;
  clearDraftChanges: () => void;
  getDraftChangesByType: (type: 'government' | 'legal') => DraftChange[];
  publishDrafts: (type: 'government' | 'legal' | 'all') => Promise<void>;
  hasPendingChanges: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [draftChanges, setDraftChanges] = useState<DraftChange[]>([]);

  const addDraftChange = (change: Omit<DraftChange, 'id' | 'timestamp'>) => {
    const newChange: DraftChange = {
      ...change,
      id: `DRAFT-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setDraftChanges(prev => [newChange, ...prev]);
  };

  // Register the global notifier on mount
  useEffect(() => {
    globalDraftNotifier = addDraftChange;
    return () => {
      globalDraftNotifier = null;
    };
  }, []);

  const removeDraftChange = (id: string) => {
    setDraftChanges(draftChanges.filter(c => c.id !== id));
  };

  const clearDraftChanges = () => {
    setDraftChanges([]);
  };

  const getDraftChangesByType = (type: 'government' | 'legal') => {
    return draftChanges.filter(c => c.type === type);
  };

  const publishDrafts = async (type: 'government' | 'legal' | 'all') => {
    const changesToPublish = type === 'all' 
      ? draftChanges 
      : draftChanges.filter(c => c.type === type);

    try {
      const response = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes: changesToPublish })
      });

      if (response.ok) {
        setDraftChanges(draftChanges.filter(c => !changesToPublish.includes(c)));
      } else {
        throw new Error('Publication failed');
      }
    } catch (error) {
      console.error('Publication error:', error);
      throw error;
    }
  };

  const hasPendingChanges = () => draftChanges.length > 0;

  return (
    <AdminContext.Provider value={{
      draftChanges,
      pendingPublications: draftChanges.length,
      addDraftChange,
      removeDraftChange,
      clearDraftChanges,
      getDraftChangesByType,
      publishDrafts,
      hasPendingChanges
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
