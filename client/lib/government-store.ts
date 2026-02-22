import {
  GovernmentStore,
  GovWorkspace,
  GovEmployee,
  GovTask,
  GovAnnouncement,
  GovDocument,
  GovDossier,
  GovNotification,
  GovMessage,
  GovAuditLog
} from '@shared/gov-api';
import { legalStore } from './legal-store';

const STORE_KEY = 'gov_intranet_store';
const SYNC_INTERVAL = 5000; // Poll every 5 seconds

const INITIAL_DATA: GovernmentStore = {
  workspaces: {},
  employees: [],
  globalAnnouncements: [],
  calendarEvents: [],
  notifications: [],
  messages: [],
  auditLogs: [],
  economyStats: [],
  healthStats: [],
  securityStats: [],
  justiceStats: [],
  mapLocations: [],
  news: [],
  priorities: [],
  emergencyMode: false
};

class GovernmentStoreManager {
  private data: GovernmentStore;
  private listeners: (() => void)[] = [];
  private isSyncing = false;

  constructor() {
    const saved = localStorage.getItem(STORE_KEY);
    this.data = saved ? JSON.parse(saved) : INITIAL_DATA;
    this.initSync();
  }

  public stopSync() {
    this.isSyncing = false;
    // Clearing interval if we had a ref, but let's use a simpler approach
  }

  private async initSync() {
    // Stop any existing sync if we are reloading (HMR)
    if ((window as any).__gov_store_sync_interval) {
      clearInterval((window as any).__gov_store_sync_interval);
    }

    // Small delay to ensure server is ready during dev HMR
    setTimeout(async () => {
      await this.fetchFromServer();
      (window as any).__gov_store_sync_interval = setInterval(() => this.fetchFromServer(), SYNC_INTERVAL);
    }, 1000);
  }

  private async fetchFromServer(retries = 3) {
    if (this.isSyncing && retries === 3) return;
    this.isSyncing = true;
    try {
      const res = await fetch('/api/government');
      if (res.ok) {
        const serverData = await res.json();
        this.data = serverData;
        this.saveLocally();
        this.notify();
      } else {
        console.warn(`Government Sync: Server returned ${res.status}`);
      }
      this.isSyncing = false; // Successfully finished
    } catch (e) {
      if (retries > 0) {
        // Schedule retry without locking up
        setTimeout(() => {
          this.isSyncing = false; // Unlock to allow retry
          this.fetchFromServer(retries - 1);
        }, 1000);
      } else {
        console.error("Government Sync error after retries:", e);
        this.isSyncing = false; // Final unlock
      }
    }
  }

  private async saveToServer() {
    try {
      await fetch('/api/government', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data)
      });
    } catch (e) {
      console.error("Government Save error:", e);
    }
  }

  private saveLocally() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
  }

  private save() {
    this.saveLocally();
    this.saveToServer();
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Workspaces
  getWorkspaces() { return this.data.workspaces; }
  getWorkspace(id: string) { return this.data.workspaces[id.toLowerCase()]; }
  
  updateWorkspace(id: string, workspace: GovWorkspace) {
    this.data.workspaces[id.toLowerCase()] = workspace;
    this.save();
  }

  // Employees
  getEmployees() { return this.data.employees; }
  updateEmployees(employees: GovEmployee[]) {
    this.data.employees = employees;
    this.save();
  }

  // Notifications
  getNotifications() { return this.data.notifications; }
  
  // Announcements
  getGlobalAnnouncements() { return this.data.globalAnnouncements; }

  // Calendar
  getCalendarEvents() { return this.data.calendarEvents; }

  // Messages
  getMessages(channelId: string) {
    return this.data.messages.filter(m => m.channel_id === channelId);
  }
  createMessage(msg: GovMessage) {
    this.data.messages.push(msg);
    this.save();
  }

  // Audit
  getAuditLogs() {
    const govLogs = this.data.auditLogs;

    // Include Legal Audit Logs
    const legalLogs = legalStore.getAuditLogs().map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      user_id: log.user_id,
      user_name: log.user_name,
      role: 'Avocat',
      service_id: 'JUSTICE',
      action: `[CABINET] ${log.action}`,
      metadata: log.metadata
    }));

    return [...govLogs, ...legalLogs].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  logAction(log: GovAuditLog) {
    this.data.auditLogs.unshift(log);
    this.save();
  }
  clearAuditLogs() {
    this.data.auditLogs = [];
    this.save();
  }

  // Emergency Mode
  getEmergencyMode() { return this.data.emergencyMode; }
  setEmergencyMode(mode: boolean) {
    this.data.emergencyMode = mode;
    this.save();
  }

  // Economy
  getEconomyStats() { return this.data.economyStats || []; }

  // Health
  getHealthStats() { return this.data.healthStats || []; }

  // Security
  getSecurityStats() { return this.data.securityStats || []; }

  // Justice
  getJusticeStats() { return this.data.justiceStats || []; }

  // Map
  getMapLocations() { return this.data.mapLocations || []; }
  updateMapLocations(locations: GovLocation[]) {
    this.data.mapLocations = locations;
    this.save();
  }

  // News
  getNews() { return this.data.news || []; }

  // Priorities
  getPriorities() { return this.data.priorities || []; }

  // Documents
  getGlobalDocuments() {
    const govDocs = Object.values(this.data.workspaces).flatMap(ws => (ws.documents || []).map(d => ({
      ...d,
      service_name: ws.name,
      service_id: Object.keys(this.data.workspaces).find(key => this.data.workspaces[key] === ws)?.toUpperCase()
    })));

    // Include Legal Documents from legalStore
    const legalDocs = legalStore.getDocuments().map(d => ({
      id: d.id,
      title: d.title,
      content: d.content,
      type: d.category,
      date: new Date(d.created_at).toLocaleDateString(),
      status: d.status,
      author: 'Cabinet H&C',
      archived: d.status === 'Archivé',
      acl: [],
      service_name: 'Cabinet Juridique',
      service_id: 'JUSTICE'
    }));

    return [...govDocs, ...legalDocs];
  }

  createDocument(serviceId: string, doc: GovDocument) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.documents = [doc, ...(ws.documents || [])];
      this.save();
    }
  }

  updateDocument(serviceId: string, updatedDoc: GovDocument) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.documents = ws.documents.map(d => d.id === updatedDoc.id ? updatedDoc : d);
      this.save();
    }
  }

  deleteDocument(serviceId: string, docId: string) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.documents = ws.documents.filter(d => d.id !== docId);
      this.save();
    }
  }

  // Dossiers
  getGlobalDossiers() {
    const govDossiers = Object.values(this.data.workspaces).flatMap(ws => (ws.dossiers || []).map(d => ({
      ...d,
      service_name: ws.name,
      service_id: Object.keys(this.data.workspaces).find(key => this.data.workspaces[key] === ws)?.toUpperCase()
    })));

    // Include Legal Dossiers from legalStore
    const legalDossiers = legalStore.getCases().map(c => ({
      id: c.id,
      title: c.title,
      status: c.status,
      archived: c.status === 'Archivé',
      acl: [],
      priority: 'Normale',
      creationDate: new Date(c.created_at).toLocaleDateString(),
      description: c.description,
      progress: c.progression || 0,
      service_name: 'Cabinet Juridique',
      service_id: 'JUSTICE'
    }));

    return [...govDossiers, ...legalDossiers];
  }

  getDossier(id: string) {
    for (const [wsKey, ws] of Object.entries(this.data.workspaces)) {
      const dossier = ws.dossiers?.find(d => d.id === id);
      if (dossier) return {
        ...dossier,
        service_name: ws.name,
        service_id: wsKey.toUpperCase(),
        owner: ws.staff?.[0]?.name || "Responsable Service"
      };
    }
    return null;
  }

  createDossier(serviceId: string, dossier: GovDossier) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.dossiers = [dossier, ...(ws.dossiers || [])];
      this.save();
    }
  }

  updateDossier(serviceId: string, updatedDossier: GovDossier) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.dossiers = ws.dossiers.map(d => d.id === updatedDossier.id ? updatedDossier : d);
      this.save();
    }
  }

  deleteDossier(serviceId: string, dossierId: string) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.dossiers = ws.dossiers.filter(d => d.id !== dossierId);
      this.save();
    }
  }

  createTask(serviceId: string, task: GovTask) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.tasks = [task, ...(ws.tasks || [])];
      this.save();
    }
  }

  updateTask(serviceId: string, updatedTask: GovTask) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.tasks = ws.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      this.save();
    }
  }

  deleteTask(serviceId: string, taskId: number) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.tasks = ws.tasks.filter(t => t.id !== taskId);
      this.save();
    }
  }

  toggleTaskStatus(serviceId: string, taskId: number) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.tasks = ws.tasks.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'pending' : (t.status === 'pending' ? 'in_progress' : 'completed');
          return { ...t, status: nextStatus };
        }
        return t;
      });
      this.save();
    }
  }

  archiveDocument(serviceId: string, docId: string) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.documents = ws.documents.map(d => d.id === docId ? { ...d, archived: !d.archived } : d);
      this.save();
    }
  }

  archiveDossier(serviceId: string, dossierId: string) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.dossiers = ws.dossiers.map(d => d.id === dossierId ? { ...d, archived: !d.archived } : d);
      this.save();
    }
  }
}

export const governmentStore = new GovernmentStoreManager();
