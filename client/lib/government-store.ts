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

  private async initSync() {
    await this.fetchFromServer();
    setInterval(() => this.fetchFromServer(), SYNC_INTERVAL);
  }

  private async fetchFromServer() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      const res = await fetch('/api/government');
      if (res.ok) {
        const serverData = await res.json();
        this.data = serverData;
        this.saveLocally();
        this.notify();
      }
    } catch (e) {
      console.error("Government Sync error:", e);
    } finally {
      this.isSyncing = false;
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
  getAuditLogs() { return this.data.auditLogs; }
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

  // Documents
  getGlobalDocuments() {
    return Object.values(this.data.workspaces).flatMap(ws => (ws.documents || []).map(d => ({
      ...d,
      service_name: ws.name,
      service_id: Object.keys(this.data.workspaces).find(key => this.data.workspaces[key] === ws)?.toUpperCase()
    })));
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
    return Object.values(this.data.workspaces).flatMap(ws => (ws.dossiers || []).map(d => ({
      ...d,
      service_name: ws.name,
      service_id: Object.keys(this.data.workspaces).find(key => this.data.workspaces[key] === ws)?.toUpperCase()
    })));
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
