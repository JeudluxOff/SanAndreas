import {
  Case,
  LegalDocument,
  Evidence,
  Task,
  Hearing,
  Invoice,
  AuditLog,
  ConflictCheck,
  Client,
  Message,
  StaffMember,
  CabinetSettings,
  NotificationSettings
} from '@shared/api';
import { governmentStore } from '@/lib/government-store';
import { toast } from 'sonner';

const STORE_KEY = 'hc_legal_store';
const SYNC_INTERVAL = 5000; // Poll every 5 seconds

interface LegalStore {
  clients: Client[];
  cases: Case[];
  documents: LegalDocument[];
  evidence: Evidence[];
  tasks: Task[];
  hearings: Hearing[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  conflictChecks: ConflictCheck[];
  messages: Message[];
  staff: StaffMember[];
  settings: CabinetSettings;
}

const INITIAL_DATA: LegalStore = {
  settings: {
    name: 'Noxwood & Partner',
    address: '15, Rue de la Paix, Los Santos',
    vat_number: 'SA-FR-123456789',
    iban: 'SA00 1234 5678 9012 3456 7890 123',
    phone: '+SA 555-0199',
    admin_id: 'admin_avocat',
    audit_retention_days: 365
  },
  staff: [
    { id: 'admin_avocat', name: 'Julian Noxwood', role: 'Associé', email: 'j.noxwood@np.sa', status: 'Actif', joined_at: '2020-01-01', last_active: new Date().toISOString() },
    { id: 'avocat_victoria', name: 'Victoria Partner', role: 'Associée', email: 'v.partner@np.sa', status: 'Actif', joined_at: '2020-01-01', last_active: new Date().toISOString() },
    { id: 'avocat_marcus', name: 'Marcus Vane', role: 'Avocat Senior', email: 'm.vane@np.sa', status: 'Actif', joined_at: '2021-05-15', last_active: new Date().toISOString() },
    { id: 'avocat_elena', name: 'Elena Rossi', role: 'Avocate', email: 'e.rossi@np.sa', status: 'Actif', joined_at: '2022-03-10', last_active: new Date().toISOString() },
    { id: 'staff_thomas', name: 'Thomas Miller', role: 'Comptable', email: 't.miller@np.sa', status: 'Actif', joined_at: '2023-01-05', last_active: new Date().toISOString() },
    { id: 'staff_sarah', name: 'Sarah Jenkins', role: 'Secrétaire', email: 's.jenkins@np.sa', status: 'Actif', joined_at: '2022-11-20', last_active: new Date().toISOString() },
    { id: 'staff_lucas', name: 'Lucas Dupont', role: 'Juriste', email: 'l.dupont@np.sa', status: 'Actif', joined_at: '2023-06-01', last_active: new Date().toISOString() }
  ],
  clients: [],
  cases: [],
  documents: [],
  evidence: [],
  tasks: [],
  hearings: [],
  invoices: [],
  auditLogs: [],
  conflictChecks: [],
  messages: []
};

class LegalStoreManager {
  private data: LegalStore;
  private listeners: (() => void)[] = [];
  private isSyncing = false;

  constructor() {
    const saved = localStorage.getItem(STORE_KEY);
    this.data = saved ? JSON.parse(saved) : INITIAL_DATA;
    this.initSync();
  }

  private async initSync() {
    // Stop any existing sync if we are reloading (HMR)
    if ((window as any).__legal_store_sync_interval) {
      clearInterval((window as any).__legal_store_sync_interval);
    }

    // Small delay to ensure server is ready during dev HMR
    setTimeout(async () => {
      await this.fetchFromServer();
      (window as any).__legal_store_sync_interval = setInterval(() => this.fetchFromServer(), SYNC_INTERVAL);
    }, 1000);
  }

  private async fetchFromServer(retries = 3) {
    if (this.isSyncing && retries === 3) return;
    this.isSyncing = true;
    try {
      const res = await fetch('/api/legal');
      if (res.ok) {
        const serverData = await res.json() as LegalStore;

        // Detect new items for notifications if this is not the first load
        if (this.data.cases.length > 0) {
          const newCases = serverData.cases.filter(sc => !this.data.cases.some(c => c.id === sc.id));
          newCases.forEach(c => this.triggerNotification('dossiers', 'Nouveau Dossier (Sync)', `Dossier: ${c.title}`));

          const newDocs = serverData.documents.filter(sd => !this.data.documents.some(d => d.id === sd.id));
          newDocs.forEach(d => this.triggerNotification('documents', 'Nouveau Document (Sync)', `Doc: ${d.title}`));

          const newEvidence = serverData.evidence.filter(se => !this.data.evidence.some(e => e.id === se.id));
          newEvidence.forEach(e => this.triggerNotification('evidence', 'Nouvelle Preuve (Sync)', `Preuve: ${e.name}`));

          const newHearings = serverData.hearings.filter(sh => !this.data.hearings.some(h => h.id === sh.id));
          newHearings.forEach(h => this.triggerNotification('hearings', 'Nouvelle Audience (Sync)', `Audience: ${h.title}`));

          const newTasks = serverData.tasks.filter(st => !this.data.tasks.some(t => t.id === st.id));
          newTasks.forEach(t => this.triggerNotification('tasks', 'Nouvelle Tâche (Sync)', `Tâche: ${t.title}`));

          const newInvoices = serverData.invoices.filter(si => !this.data.invoices.some(i => i.id === si.id));
          newInvoices.forEach(inv => this.triggerNotification('invoices', 'Nouvelle Facture (Sync)', `Montant: ${inv.amount} ${inv.currency}`));
        }

        // Simple merge: prefer server data for now to ensure all users see same thing
        this.data = serverData;
        this.saveLocally();
        this.notify();
      } else {
        console.warn(`Legal Sync: Server returned ${res.status}`);
      }
      this.isSyncing = false;
    } catch (e) {
      if (retries > 0) {
        setTimeout(() => {
          this.isSyncing = false;
          this.fetchFromServer(retries - 1);
        }, 1000);
      } else {
        console.error("Legal Sync error after retries:", e);
        this.isSyncing = false;
      }
    }
  }

  private async saveToServer() {
    try {
      await fetch('/api/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data)
      });
    } catch (e) {
      console.error("Save error:", e);
    }
  }

  private saveLocally() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
  }

  private save() {
    this.saveLocally();
    this.saveToServer();
    this.notify();
    // Notify governmentStore to refresh its global views that include legal data
    governmentStore.notify();
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

  private triggerNotification(type: keyof NotificationSettings, title: string, description: string) {
    const settings = this.getNotificationSettings();
    if (settings[type]) {
      toast(title, {
        description,
        style: {
          background: '#0a0f18',
          color: '#fff',
          border: '1px solid rgba(193, 164, 97, 0.2)',
        },
        duration: 5000,
      });
    }
  }

  // Clients
  getClients() { return this.data.clients; }
  getClient(id: string) { return this.data.clients.find(c => c.id === id); }
  createClient(client: Client) {
    this.data.clients.unshift(client);
    this.save();
  }

  // Cases
  getCases() { return this.data.cases; }
  getCase(id: string) { return this.data.cases.find(c => c.id === id); }
  createCase(newCase: Case) {
    this.data.cases.unshift(newCase);
    this.save();
    this.triggerNotification('dossiers', 'Nouveau Dossier', `Le dossier "${newCase.title}" a été créé.`);
  }
  updateCase(updated: Case) {
    const idx = this.data.cases.findIndex(c => c.id === updated.id);
    if (idx !== -1) {
      this.data.cases[idx] = updated;
      this.save();
    }
  }

  // Documents
  getDocuments(caseId?: string) {
    if (caseId) return this.data.documents.filter(d => d.case_id === caseId);
    return this.data.documents;
  }
  createDocument(doc: LegalDocument) {
    this.data.documents.unshift(doc);
    this.save();
    this.triggerNotification('documents', 'Nouveau Document', `Un nouveau document "${doc.title}" a été ajouté.`);
  }
  updateDocument(updated: LegalDocument) {
    const idx = this.data.documents.findIndex(d => d.id === updated.id);
    if (idx !== -1) {
      this.data.documents[idx] = updated;
      this.save();
    }
  }

  // Evidence
  getEvidence(caseId: string) {
    return this.data.evidence.filter(e => e.case_id === caseId);
  }
  addEvidence(evi: Evidence) {
    this.data.evidence.unshift(evi);
    this.save();
    this.triggerNotification('evidence', 'Nouvelle Preuve', `Une pièce à conviction "${evi.name}" a été déposée.`);
  }

  // Tasks
  getTasks(caseId?: string, userId?: string) {
    let tasks = this.data.tasks;
    if (caseId) tasks = tasks.filter(t => t.case_id === caseId);
    if (userId) tasks = tasks.filter(t => t.assigned_to === userId);
    return tasks;
  }
  createTask(task: Task) {
    this.data.tasks.unshift(task);
    this.save();
    this.triggerNotification('tasks', 'Nouvelle Tâche', `La tâche "${task.title}" a été assignée.`);
  }
  updateTask(updated: Task) {
    const idx = this.data.tasks.findIndex(t => t.id === updated.id);
    if (idx !== -1) {
      this.data.tasks[idx] = updated;
      this.save();
    }
  }

  // Hearings
  getHearings() { return this.data.hearings; }
  createHearing(h: Hearing) {
    this.data.hearings.unshift(h);
    this.save();
    this.triggerNotification('hearings', 'Nouvelle Audience', `Une audience "${h.title}" a été programmée le ${new Date(h.date).toLocaleDateString()}.`);
  }
  updateHearing(updated: Hearing) {
    const idx = this.data.hearings.findIndex(h => h.id === updated.id);
    if (idx !== -1) {
      this.data.hearings[idx] = updated;
      this.save();
    }
  }
  deleteHearing(id: string, userId: string) {
    const idx = this.data.hearings.findIndex(h => h.id === id);
    if (idx !== -1) {
      const h = this.data.hearings[idx];
      this.data.hearings.splice(idx, 1);
      this.save();
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Suppression d\'audience',
        target_type: 'Hearing',
        target_id: id,
        metadata: { title: h.title }
      });
    }
  }

  // Invoices
  getInvoices() { return this.data.invoices; }
  createInvoice(inv: Invoice) {
    this.data.invoices.unshift(inv);
    this.save();
    this.triggerNotification('invoices', 'Nouvelle Facture', `Une facture de ${inv.amount} ${inv.currency} a été générée.`);
  }
  updateInvoice(updated: Invoice) {
    const idx = this.data.invoices.findIndex(i => i.id === updated.id);
    if (idx !== -1) {
      this.data.invoices[idx] = updated;
      this.save();
    }
  }

  deleteInvoice(id: string, userId: string, reason: string) {
    const idx = this.data.invoices.findIndex(i => i.id === id);
    if (idx !== -1) {
      const inv = this.data.invoices[idx];
      this.data.invoices.splice(idx, 1);
      this.save();
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Suppression de facture',
        target_type: 'Invoice',
        target_id: id,
        metadata: { amount: inv.amount, reason }
      });
    }
  }

  // Messages
  getMessages(channelId: string) {
    return this.data.messages.filter(m => m.channel_id === channelId);
  }
  createMessage(msg: Message) {
    this.data.messages.push(msg);
    this.save();
  }

  // Audit
  logAction(log: AuditLog) {
    this.data.auditLogs.unshift(log);
    this.save();
  }
  getAuditLogs() { return this.data.auditLogs; }

  // Conflict Check
  performConflictCheck(query: string, userId: string): ConflictCheck {
    const matches = this.data.clients
      .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
      .map(c => c.name);
    
    const check: ConflictCheck = {
      id: `CC-${Date.now()}`,
      timestamp: new Date().toISOString(),
      query,
      result: matches.length > 0 ? 'Fail' : 'Pass',
      matched_entities: matches,
      performed_by: userId
    };
    
    this.data.conflictChecks.unshift(check);
    this.save();
    return check;
  }

  // Staff
  getStaff() { return this.data.staff; }
  addStaff(member: StaffMember) {
    this.data.staff.push(member);
    this.save();
  }
  updateStaff(member: StaffMember) {
    const idx = this.data.staff.findIndex(s => s.id === member.id);
    if (idx !== -1) {
      this.data.staff[idx] = member;
      this.save();
    }
  }

  // Settings
  getSettings() { return this.data.settings; }
  getNotificationSettings() {
    return this.data.settings.notification_settings || {
      dossiers: true,
      documents: true,
      evidence: true,
      hearings: true,
      tasks: true,
      invoices: true
    };
  }
  updateNotificationSettings(settings: NotificationSettings) {
    this.data.settings.notification_settings = settings;
    this.save();
  }
  updateSettings(settings: CabinetSettings) {
    this.data.settings = settings;
    this.save();
  }

  // Case Actions
  sealCase(id: string, userId: string) {
    const dossier = this.getCase(id);
    if (dossier) {
      dossier.status = 'Scellé';
      dossier.confidentiality = 'Scellé';
      dossier.sealed_at = new Date().toISOString();
      dossier.sealed_by = userId;
      this.updateCase(dossier);
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Scellement du dossier',
        target_type: 'Case',
        target_id: id
      });
    }
  }

  closeCase(id: string, userId: string) {
    const dossier = this.getCase(id);
    if (dossier) {
      dossier.status = 'Clos';
      this.updateCase(dossier);
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Clôture du dossier',
        target_type: 'Case',
        target_id: id
      });
    }
  }

  archiveCase(id: string, userId: string) {
    const dossier = this.getCase(id);
    if (dossier) {
      dossier.status = 'Archivé';
      this.updateCase(dossier);
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Archivage du dossier',
        target_type: 'Case',
        target_id: id
      });
    }
  }

  deleteCase(id: string, userId: string) {
    const idx = this.data.cases.findIndex(c => c.id === id);
    if (idx !== -1) {
      const title = this.data.cases[idx].title;
      this.data.cases.splice(idx, 1);
      this.save();
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Suppression du dossier',
        target_type: 'Case',
        target_id: id,
        metadata: { title }
      });
    }
  }

  archiveDocument(id: string, userId: string) {
    const doc = this.data.documents.find(d => d.id === id);
    if (doc) {
      doc.status = 'Archivé';
      this.updateDocument(doc);
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Archivage du document',
        target_type: 'Document',
        target_id: id,
        metadata: { title: doc.title }
      });
    }
  }

  deleteDocument(id: string, userId: string) {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx !== -1) {
      const title = this.data.documents[idx].title;
      this.data.documents.splice(idx, 1);
      this.save();
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Suppression du document',
        target_type: 'Document',
        target_id: id,
        metadata: { title }
      });
    }
  }

  deleteEvidence(id: string, userId: string) {
    const idx = this.data.evidence.findIndex(e => e.id === id);
    if (idx !== -1) {
      const name = this.data.evidence[idx].name;
      this.data.evidence.splice(idx, 1);
      this.save();
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Suppression de preuve',
        target_type: 'Evidence',
        target_id: id,
        metadata: { name }
      });
    }
  }
}

export const legalStore = new LegalStoreManager();
