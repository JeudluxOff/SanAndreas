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
import { legalStore } from '@/lib/legal-store';
import { notifyDraftChange } from '@/contexts/AdminContext';

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

    // Subscribe to legalStore to refresh views when legal data changes
    legalStore.subscribe(() => {
      this.notify();
    });
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

  private async fetchFromServer(retries = 1) {
    if (this.isSyncing && retries === 1) return;
    this.isSyncing = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const res = await fetch('/api/government', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const serverData = await res.json();
        this.data = serverData;
        this.saveLocally();
        this.notify();
      }
      this.isSyncing = false; // Successfully finished or server error
    } catch (e: any) {
      // Silently handle network errors - app will work with local data
      if (retries > 0 && e.name !== 'AbortError') {
        // Schedule retry without locking up
        setTimeout(() => {
          this.isSyncing = false; // Unlock to allow retry
          this.fetchFromServer(retries - 1);
        }, 2000);
      } else {
        this.isSyncing = false; // Final unlock
        // App will continue working with cached localStorage data
      }
    }
  }

  private async saveToServer() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      await fetch('/api/government', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (e) {
      // Silently handle network errors - data is already saved locally
      clearTimeout(0);
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

  public notify() {
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
  getEmployees() {
    const govEmployees = this.data.employees;

    // Include Legal Staff from legalStore
    const legalStaff = legalStore.getStaff().map(s => ({
      name: s.name,
      role: s.role,
      service: 'Cabinet Juridique (JUSTICE)',
      grade: s.role === 'Associé' ? 'Associé Principal' : 'Auxiliaire de Justice',
      status: s.status === 'Actif' ? 'En service' : 'Indisponible',
      email: s.email,
      joinDate: new Date(s.joined_at).toLocaleDateString(),
      image: s.avatar ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.avatar}` : undefined,
      description: `Membre du Cabinet Noxwood & Partner. Dernière activité: ${new Date(s.last_active).toLocaleString()}`
    }));

    return [...govEmployees, ...legalStaff];
  }
  updateEmployees(employees: GovEmployee[]) {
    this.data.employees = employees;
    this.save();
  }

  updateEmployee(oldName: string, updates: Partial<GovEmployee>) {
    const index = this.data.employees.findIndex(e => e.name === oldName);
    if (index !== -1) {
      this.data.employees[index] = { ...this.data.employees[index], ...updates };
      this.save();
      return true;
    }
    return false;
  }

  // Notifications
  getNotifications() { return this.data.notifications; }
  
  // Announcements
  getGlobalAnnouncements() { return this.data.globalAnnouncements; }

  // Calendar
  getCalendarEvents() {
    const govEvents = this.data.calendarEvents;

    // Include Legal Hearings from legalStore
    const legalEvents = legalStore.getHearings().map((h, i) => ({
      id: 9000 + i, // Fake IDs for merged calendar
      time: new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `[AUDIENCE] ${h.title}`,
      type: h.type === 'Pénal' ? 'Justice' : 'Administratif',
      date: new Date(h.date).toLocaleDateString(),
      participants: 2,
      location: h.location,
      service: 'JUSTICE'
    }));

    return [...govEvents, ...legalEvents];
  }

  // Messages
  getMessages(channelId: string) {
    return this.data.messages.filter(m => m.channel_id === channelId);
  }
  createMessage(msg: GovMessage) {
    this.data.messages.push(msg);
    this.save();
    notifyDraftChange({
      type: 'government',
      action: 'create',
      entityType: 'Message',
      entityId: msg.id,
      entityName: `Message in ${msg.channel_id}`,
      changes: msg,
      userId: msg.sender_id,
      userName: msg.sender_name || 'System'
    });
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
    notifyDraftChange({
      type: 'government',
      action: 'create',
      entityType: 'AuditLog',
      entityId: log.id,
      entityName: log.action,
      changes: log,
      userId: log.user_id,
      userName: log.user_name
    });
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

    // Include Legal Documents and Evidence from legalStore
    const legalDocs = legalStore.getDocuments().map(d => ({
      id: d.id,
      title: d.title,
      content: d.content,
      type: d.category,
      date: new Date(d.created_at).toLocaleDateString(),
      status: d.status,
      author: 'Cabinet N&P',
      archived: d.status === 'Archivé',
      acl: [],
      service_name: 'Cabinet Juridique',
      service_id: 'JUSTICE'
    }));

    const legalEvidence = legalStore.getCases().flatMap(c => legalStore.getEvidence(c.id)).map(e => ({
      id: e.id,
      title: `[PREUVE] ${e.name}`,
      content: e.content,
      type: 'Pièce à Conviction',
      date: new Date(e.uploaded_at).toLocaleDateString(),
      status: e.confidentiality === 'Scellé' ? 'Scellée' : 'Déposée',
      author: e.uploaded_by,
      archived: false,
      acl: e.confidentiality === 'Scellé' ? ['ADMIN_ONLY'] : [],
      service_name: 'Cabinet Juridique',
      service_id: 'JUSTICE'
    }));

    return [...govDocs, ...legalDocs, ...legalEvidence];
  }

  createDocument(serviceId: string, doc: GovDocument) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.documents = [doc, ...(ws.documents || [])];
      this.save();
      notifyDraftChange({
        type: 'government',
        action: 'create',
        entityType: 'Document',
        entityId: doc.id,
        entityName: doc.title,
        changes: doc,
        userId: 'system',
        userName: 'System'
      });
    }
  }

  updateDocument(serviceId: string, updatedDoc: GovDocument) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      ws.documents = ws.documents.map(d => d.id === updatedDoc.id ? updatedDoc : d);
      this.save();
      notifyDraftChange({
        type: 'government',
        action: 'update',
        entityType: 'Document',
        entityId: updatedDoc.id,
        entityName: updatedDoc.title,
        changes: updatedDoc,
        userId: 'system',
        userName: 'System'
      });
    }
  }

  deleteDocument(serviceId: string, docId: string) {
    const ws = this.getWorkspace(serviceId);
    if (ws) {
      const doc = ws.documents.find(d => d.id === docId);
      ws.documents = ws.documents.filter(d => d.id !== docId);
      this.save();
      if (doc) {
        notifyDraftChange({
          type: 'government',
          action: 'delete',
          entityType: 'Document',
          entityId: docId,
          entityName: doc.title,
          changes: { id: docId },
          userId: 'system',
          userName: 'System'
        });
      }
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

    // Check Legal Store
    const legalCase = legalStore.getCase(id);
    if (legalCase) {
      return {
        id: legalCase.id,
        title: legalCase.title,
        status: legalCase.status,
        archived: legalCase.status === 'Archivé',
        acl: [],
        priority: 'Normale',
        creationDate: new Date(legalCase.created_at).toLocaleDateString(),
        description: legalCase.description,
        progress: legalCase.progression || 0,
        service_name: 'Cabinet Juridique',
        service_id: 'JUSTICE',
        owner: 'Victoria Partner'
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

  // Stats Helpers
  getTotalDossiersCount() {
    return this.getGlobalDossiers().filter(d => !d.archived).length;
  }

  getTotalDocumentsCount() {
    return this.getGlobalDocuments().filter(d => !d.archived).length;
  }

  getPendingValidationsCount() {
    return this.getGlobalDocuments().filter(d => d.status === 'À valider' || d.status === 'En relecture').length;
  }
}

export const governmentStore = new GovernmentStoreManager();
