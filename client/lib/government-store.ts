import {
  GovernmentStore,
  GovWorkspace,
  GovEmployee,
  GovEmployeeV2,
  GovHRHistoryEntry,
  GovTask,
  GovAnnouncement,
  GovDocument,
  GovDossier,
  GovNotification,
  GovMessage,
  GovAuditLog,
  GovLocation
} from '@shared/gov-api';
import { notifyDraftChange } from '@/contexts/AdminContext';

const STORE_KEY = 'gov_intranet_store';
const SYNC_INTERVAL = 5000; // Poll every 5 seconds

const SEED_EMPLOYEES_V2: GovEmployeeV2[] = [
  {
    id: 'emp-admin',
    username: 'admin',
    firstName: 'Systeme',
    lastName: 'Administrateur',
    matricule: 'ADM-001',
    grade: 'Administrateur',
    functionTitle: 'Administrateur Global',
    roleTechnique: 'admin',
    primaryDivision: 'cabinet_gouverneur',
    secondaryDivisions: [],
    permissions: ['create_documents','edit_documents','validate_documents','publish_announcements','create_cases','edit_cases','archive_cases','manage_employees','edit_divisions','view_logs','manage_settings','activate_emergency_mode'],
    status: 'actif',
    email: 'admin@gov.sa',
    phone: '555-0001',
    joinedAt: '2023-01-01',
    lastLogin: '2026-06-28',
    notes: 'Compte administrateur principal',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-governor',
    username: 'governor',
    firstName: 'Ethan',
    lastName: 'Hunt',
    matricule: 'GOV-001',
    avatar: 'https://cdn.builder.io/api/v1/image/assets%2F4e331a0ce80644199f9cae8c33fdc854%2F825f5b55d529428f974a0a1f35c96f2c?format=webp&width=800&height=1200',
    grade: 'Gouverneur',
    functionTitle: 'Gouverneur de San Andreas',
    roleTechnique: 'governor',
    primaryDivision: 'cabinet_gouverneur',
    secondaryDivisions: [],
    permissions: ['create_documents','edit_documents','validate_documents','publish_announcements','create_cases','edit_cases','archive_cases','manage_employees','edit_divisions','view_logs','manage_settings','activate_emergency_mode'],
    status: 'actif',
    email: 'governor@gov.sa',
    phone: '555-0010',
    joinedAt: '2023-03-15',
    lastLogin: '2026-06-28',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-rh',
    username: 'rh',
    firstName: 'Marie',
    lastName: 'Dupont',
    matricule: 'RH-001',
    grade: 'Responsable',
    functionTitle: 'Directrice des Ressources Humaines',
    roleTechnique: 'hr',
    primaryDivision: 'ressources_humaines',
    secondaryDivisions: ['administration_generale'],
    permissions: ['manage_employees','edit_divisions','view_logs','create_documents','edit_documents'],
    status: 'actif',
    email: 'rh@gov.sa',
    phone: '555-0020',
    joinedAt: '2023-06-01',
    lastLogin: '2026-06-27',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-sec-securite',
    username: 'sec_securite',
    firstName: 'Jackson',
    lastName: 'Teller',
    matricule: 'SEC-001',
    grade: 'Directeur',
    functionTitle: 'Secretaire a la Securite',
    roleTechnique: 'manager',
    primaryDivision: 'securite_publique',
    secondaryDivisions: ['lspd', 'lssd'],
    permissions: ['create_documents','edit_documents','validate_documents','create_cases','edit_cases','archive_cases','view_logs'],
    status: 'actif',
    email: 'securite@gov.sa',
    phone: '555-0030',
    joinedAt: '2023-04-10',
    lastLogin: '2026-06-28',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-press',
    username: 'press',
    firstName: 'Lamar',
    lastName: 'Davis',
    matricule: 'PR-001',
    grade: 'Responsable',
    functionTitle: 'Attache de Presse',
    roleTechnique: 'employee',
    primaryDivision: 'presse',
    secondaryDivisions: [],
    permissions: ['publish_announcements','create_documents','edit_documents'],
    status: 'actif',
    email: 'presse@gov.sa',
    phone: '555-0040',
    joinedAt: '2023-09-01',
    lastLogin: '2026-06-27',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-sec-sante',
    username: 'sec_sante',
    firstName: 'Julian',
    lastName: 'Frost',
    matricule: 'SAN-001',
    grade: 'Directeur',
    functionTitle: 'Secretaire a la Sante',
    roleTechnique: 'manager',
    primaryDivision: 'sante',
    secondaryDivisions: ['sams'],
    permissions: ['create_documents','edit_documents','validate_documents','create_cases','edit_cases','view_logs'],
    status: 'actif',
    email: 'sante@gov.sa',
    phone: '555-0050',
    joinedAt: '2023-05-20',
    lastLogin: '2026-06-26',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-sec-tresor',
    username: 'sec_tresor',
    firstName: 'Franklin',
    lastName: 'Clinton',
    matricule: 'TRE-001',
    grade: 'Directeur',
    functionTitle: 'Secretaire au Tresor',
    roleTechnique: 'manager',
    primaryDivision: 'tresor_economie',
    secondaryDivisions: [],
    permissions: ['create_documents','edit_documents','validate_documents','create_cases','edit_cases','view_logs'],
    status: 'actif',
    email: 'tresor@gov.sa',
    phone: '555-0060',
    joinedAt: '2023-07-01',
    lastLogin: '2026-06-28',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-agent-lspd',
    username: 'agent_lspd',
    firstName: 'Mike',
    lastName: 'Torres',
    matricule: 'LSPD-042',
    grade: 'Agent',
    functionTitle: 'Agent de terrain LSPD',
    roleTechnique: 'employee',
    primaryDivision: 'lspd',
    secondaryDivisions: [],
    permissions: ['create_documents','create_cases'],
    status: 'actif',
    email: 'torres@lspd.sa',
    phone: '555-0070',
    joinedAt: '2024-01-15',
    lastLogin: '2026-06-28',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-agent-fib',
    username: 'agent_fib',
    firstName: 'Sarah',
    lastName: 'Connor',
    matricule: 'FIB-007',
    grade: 'Superviseur',
    functionTitle: 'Agent Special FIB',
    roleTechnique: 'manager',
    primaryDivision: 'fib',
    secondaryDivisions: ['interieur'],
    permissions: ['create_documents','edit_documents','create_cases','edit_cases','archive_cases','view_logs'],
    status: 'actif',
    email: 'connor@fib.sa',
    phone: '555-0080',
    joinedAt: '2023-11-01',
    lastLogin: '2026-06-27',
    gradeHistory: [],
    hrHistory: []
  },
  {
    id: 'emp-suspendu',
    username: 'suspendu_test',
    firstName: 'Jean',
    lastName: 'Probleme',
    matricule: 'SUS-001',
    grade: 'Employe',
    functionTitle: 'Agent suspendu',
    roleTechnique: 'employee',
    primaryDivision: 'administration_generale',
    secondaryDivisions: [],
    permissions: [],
    status: 'suspendu',
    email: 'suspendu@gov.sa',
    joinedAt: '2024-03-01',
    lastLogin: '2026-05-01',
    notes: 'Suspendu pour faute professionnelle',
    gradeHistory: [],
    hrHistory: [{ id: 'hr-1', date: '2026-05-01', author: 'Marie Dupont', action: 'Suspension', oldValue: 'actif', newValue: 'suspendu' }]
  }
];

const INITIAL_DATA: GovernmentStore = {
  workspaces: {},
  employees: [],
  employeesV2: SEED_EMPLOYEES_V2,
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
    try {
      const parsed = saved ? JSON.parse(saved) : null;
      // Validate that parsed data has workspaces structure
      if (parsed && parsed.workspaces) {
        this.data = parsed;
        // Ensure employeesV2 exists (migration from old data)
        if (!this.data.employeesV2 || this.data.employeesV2.length === 0) {
          this.data.employeesV2 = SEED_EMPLOYEES_V2;
        }
      } else {
        this.data = INITIAL_DATA;
      }
    } catch (error) {
      console.warn('Failed to parse stored government data, using defaults:', error);
      this.data = INITIAL_DATA;
    }
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
    return this.data.employees;
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
    return this.data.calendarEvents;
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
    return this.data.auditLogs.sort((a, b) =>
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

  // ===== Employees V2 =====
  getEmployeesV2(): GovEmployeeV2[] {
    return this.data.employeesV2 || SEED_EMPLOYEES_V2;
  }

  getEmployeeById(id: string): GovEmployeeV2 | undefined {
    return this.getEmployeesV2().find(e => e.id === id);
  }

  getEmployeeByUsername(username: string): GovEmployeeV2 | undefined {
    return this.getEmployeesV2().find(e => e.username === username);
  }

  createEmployeeV2(employee: GovEmployeeV2): boolean {
    const existing = this.getEmployeesV2();
    if (existing.find(e => e.username === employee.username)) return false;
    if (existing.find(e => e.matricule === employee.matricule)) return false;
    this.data.employeesV2 = [employee, ...existing];
    this.save();
    return true;
  }

  updateEmployeeV2(id: string, updates: Partial<GovEmployeeV2>, author?: string): boolean {
    const employees = this.getEmployeesV2();
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) return false;

    const old = employees[index];
    const updated = { ...old, ...updates };

    // Security: cannot remove last active admin
    if (old.roleTechnique === 'admin' && updates.roleTechnique && updates.roleTechnique !== 'admin') {
      const activeAdmins = employees.filter(e => e.roleTechnique === 'admin' && e.status === 'actif');
      if (activeAdmins.length <= 1) return false;
    }

    if (old.roleTechnique === 'admin' && updates.status && (updates.status === 'suspendu' || updates.status === 'archive')) {
      const activeAdmins = employees.filter(e => e.roleTechnique === 'admin' && e.status === 'actif');
      if (activeAdmins.length <= 1) return false;
    }

    employees[index] = updated;
    this.data.employeesV2 = employees;
    this.save();
    return true;
  }

  addHRHistoryEntry(employeeId: string, entry: GovHRHistoryEntry): void {
    const employees = this.getEmployeesV2();
    const index = employees.findIndex(e => e.id === employeeId);
    if (index === -1) return;
    if (!employees[index].hrHistory) employees[index].hrHistory = [];
    employees[index].hrHistory!.unshift(entry);
    this.data.employeesV2 = employees;
    this.save();
  }

  suspendEmployee(id: string, author: string): boolean {
    const emp = this.getEmployeeById(id);
    if (!emp) return false;
    if (emp.roleTechnique === 'admin') {
      const activeAdmins = this.getEmployeesV2().filter(e => e.roleTechnique === 'admin' && e.status === 'actif');
      if (activeAdmins.length <= 1) return false;
    }
    const success = this.updateEmployeeV2(id, { status: 'suspendu' });
    if (success) {
      this.addHRHistoryEntry(id, {
        id: `hr-${Date.now()}`,
        date: new Date().toISOString(),
        author,
        action: 'Suspension',
        oldValue: emp.status,
        newValue: 'suspendu'
      });
    }
    return success;
  }

  archiveEmployeeV2(id: string, author: string): boolean {
    const emp = this.getEmployeeById(id);
    if (!emp) return false;
    if (emp.roleTechnique === 'admin') {
      const activeAdmins = this.getEmployeesV2().filter(e => e.roleTechnique === 'admin' && e.status === 'actif');
      if (activeAdmins.length <= 1) return false;
    }
    const success = this.updateEmployeeV2(id, { status: 'archive' });
    if (success) {
      this.addHRHistoryEntry(id, {
        id: `hr-${Date.now()}`,
        date: new Date().toISOString(),
        author,
        action: 'Archivage',
        oldValue: emp.status,
        newValue: 'archive'
      });
    }
    return success;
  }

  isUsernameAvailable(username: string): boolean {
    return !this.getEmployeesV2().find(e => e.username === username);
  }

  isMatriculeAvailable(matricule: string): boolean {
    return !this.getEmployeesV2().find(e => e.matricule === matricule);
  }
}

export const governmentStore = new GovernmentStoreManager();
