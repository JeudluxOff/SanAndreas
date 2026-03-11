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
import { toast } from 'sonner';
import { notifyDraftChange } from '@/contexts/AdminContext';
import { compareNames, findSimilarMatches } from './fuzzy-match';

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
    { id: 'reed_noxwood', name: 'Reed Noxwood', role: 'Associé', email: 'r.noxwood@np.sa', status: 'Actif', joined_at: '2018-01-01', last_active: new Date().toISOString(), matricule: 'RN-01', callsign: 'A-1' },
    { id: 'admin_avocat', name: 'Julian Noxwood', role: 'Associé', email: 'j.noxwood@np.sa', status: 'Actif', joined_at: '2020-01-01', last_active: new Date().toISOString(), matricule: 'JN-01', callsign: 'A-2' },
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

  private async fetchFromServer(retries = 0) {
    if (this.isSyncing && retries === 0) return;
    this.isSyncing = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const res = await fetch('/api/legal', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

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

      // Improved merge: use timestamp-based conflict resolution per entity
      // "Last-write-wins" strategy: keep the most recently updated version of each entity
      this.data = this.mergeDataWithTimestamps(this.data, serverData);
      this.saveLocally();
      this.notify();
      this.isSyncing = false;
    } catch (e: any) {
      this.isSyncing = false;
      // Silently handle network errors - app will work with local data
      // Retry once with exponential backoff if not an abort
      if (retries === 0 && e.name !== 'AbortError') {
        setTimeout(() => {
          this.fetchFromServer(1);
        }, 3000);
      }
      // Otherwise fail silently - app continues with cached localStorage data
    }
  }

  /**
   * Merge local and server data using timestamp-based conflict resolution
   * For each entity: keep the version with the latest updated_at timestamp
   */
  private mergeDataWithTimestamps(local: LegalStore, server: LegalStore): LegalStore {
    // Helper to merge arrays of entities with timestamps
    const mergeEntities = <T extends { id: string; updated_at?: string }>(
      localItems: T[],
      serverItems: T[]
    ): T[] => {
      const merged: Map<string, T> = new Map();

      // Add local items
      localItems.forEach(item => merged.set(item.id, item));

      // Merge server items (server wins if timestamps are equal or newer)
      serverItems.forEach(serverItem => {
        const localItem = merged.get(serverItem.id);
        if (!localItem) {
          // New item from server
          merged.set(serverItem.id, serverItem);
        } else {
          // Existing item: compare timestamps
          const localTime = new Date(localItem.updated_at || 0).getTime();
          const serverTime = new Date(serverItem.updated_at || 0).getTime();

          if (serverTime >= localTime) {
            // Server version is newer or equal (server wins on tie)
            merged.set(serverItem.id, serverItem);
          }
          // Otherwise keep local version (local is newer)
        }
      });

      return Array.from(merged.values());
    };

    return {
      ...local,
      clients: mergeEntities(local.clients, server.clients),
      cases: mergeEntities(local.cases, server.cases),
      documents: mergeEntities(local.documents, server.documents),
      evidence: mergeEntities(local.evidence, server.evidence),
      tasks: mergeEntities(local.tasks, server.tasks),
      hearings: mergeEntities(local.hearings, server.hearings),
      invoices: mergeEntities(local.invoices, server.invoices),
      staff: mergeEntities(local.staff, server.staff),
      // Audit logs and conflict checks: always append server versions (immutable)
      auditLogs: [...new Map([
        ...local.auditLogs.map(l => [l.id, l]),
        ...server.auditLogs.map(l => [l.id, l])
      ]).values()],
      conflictChecks: [...new Map([
        ...local.conflictChecks.map(c => [c.id, c]),
        ...server.conflictChecks.map(c => [c.id, c])
      ]).values()],
      messages: mergeEntities(local.messages, server.messages),
      settings: server.settings // Settings are global, server wins
    };
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

    // Auto-create client user account
    this.createClientUserAccount(client.id, client.name);

    notifyDraftChange({
      type: 'legal',
      action: 'create',
      entityType: 'Client',
      entityId: client.id,
      entityName: client.name,
      changes: client,
      userId: 'system',
      userName: 'System'
    });
  }

  private createClientUserAccount(clientId: string, clientName: string) {
    const registeredClientUsers = JSON.parse(localStorage.getItem('sa_client_users') || '{}');

    const email = `${clientName.toLowerCase().replace(/\s+/g, '.')}@client.fr`;
    const password = 'test123';

    registeredClientUsers[email] = {
      user: {
        id: clientId,
        username: email,
        name: clientName,
        client_id: clientId,
        is_client: true
      },
      password: password
    };

    localStorage.setItem('sa_client_users', JSON.stringify(registeredClientUsers));
  }

  updateClient(updated: Client) {
    const idx = this.data.clients.findIndex(c => c.id === updated.id);
    if (idx !== -1) {
      this.data.clients[idx] = updated;
      this.save();
      notifyDraftChange({
        type: 'legal',
        action: 'update',
        entityType: 'Client',
        entityId: updated.id,
        entityName: updated.name,
        changes: updated,
        userId: 'system',
        userName: 'System'
      });
    }
  }

  deleteClient(id: string, userId: string) {
    const idx = this.data.clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      const client = this.data.clients[idx];
      this.data.clients.splice(idx, 1);
      this.save();

      // Remove associated user account
      this.deleteClientUserAccount(id, client.name);

      // Force logout if this client is currently logged in
      this.notifyClientDeleted(id);

      notifyDraftChange({
        type: 'legal',
        action: 'delete',
        entityType: 'Client',
        entityId: id,
        entityName: client.name,
        changes: { id },
        userId,
        userName: 'System'
      });
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: userId,
        user_name: 'System',
        action: 'Suppression client',
        target_type: 'Client',
        target_id: id,
        metadata: { name: client.name }
      });
    }
  }

  private deleteClientUserAccount(clientId: string, clientName: string) {
    const registeredClientUsers = JSON.parse(localStorage.getItem('sa_client_users') || '{}');

    // Find and remove the user account matching this client
    const email = `${clientName.toLowerCase().replace(/\s+/g, '.')}@client.fr`;
    if (registeredClientUsers[email]) {
      delete registeredClientUsers[email];
      localStorage.setItem('sa_client_users', JSON.stringify(registeredClientUsers));
    }
  }

  private notifyClientDeleted(clientId: string) {
    // Dispatch event so AuthContext can check and logout
    (window as any).__clientDeletedEvent = clientId;
    window.dispatchEvent(new Event('clientDeleted'));
  }

  getClientCredentials(clientId: string) {
    const registeredClientUsers = JSON.parse(localStorage.getItem('sa_client_users') || '{}');

    // Find credentials by clientId
    for (const email in registeredClientUsers) {
      if (registeredClientUsers[email].user.client_id === clientId) {
        return {
          email,
          password: registeredClientUsers[email].password
        };
      }
    }
    return null;
  }

  updateClientCredentials(clientId: string, oldEmail: string, newEmail: string, newPassword: string) {
    const registeredClientUsers = JSON.parse(localStorage.getItem('sa_client_users') || '{}');

    // Get the old user data
    const oldUserData = registeredClientUsers[oldEmail];
    if (!oldUserData) return false;

    // Delete old entry
    delete registeredClientUsers[oldEmail];

    // Create new entry with updated email and password
    registeredClientUsers[newEmail] = {
      user: {
        ...oldUserData.user,
        username: newEmail
      },
      password: newPassword
    };

    localStorage.setItem('sa_client_users', JSON.stringify(registeredClientUsers));
    return true;
  }

  // Cases
  getCases() { return this.data.cases; }
  getCase(id: string) { return this.data.cases.find(c => c.id === id); }
  createCase(newCase: Case) {
    this.data.cases.unshift(newCase);
    this.save();
    this.triggerNotification('dossiers', 'Nouveau Dossier', `Le dossier "${newCase.title}" a été créé.`);
    notifyDraftChange({
      type: 'legal',
      action: 'create',
      entityType: 'Case',
      entityId: newCase.id,
      entityName: newCase.title,
      changes: newCase,
      userId: 'system',
      userName: 'System'
    });
  }
  updateCase(updated: Case) {
    const idx = this.data.cases.findIndex(c => c.id === updated.id);
    if (idx !== -1) {
      this.data.cases[idx] = updated;
      this.save();
      notifyDraftChange({
        type: 'legal',
        action: 'update',
        entityType: 'Case',
        entityId: updated.id,
        entityName: updated.title,
        changes: updated,
        userId: 'system',
        userName: 'System'
      });
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
    notifyDraftChange({
      type: 'legal',
      action: 'create',
      entityType: 'Document',
      entityId: doc.id,
      entityName: doc.title,
      changes: doc,
      userId: 'system',
      userName: 'System'
    });
  }
  updateDocument(updated: LegalDocument) {
    const idx = this.data.documents.findIndex(d => d.id === updated.id);
    if (idx !== -1) {
      this.data.documents[idx] = updated;
      this.save();
      notifyDraftChange({
        type: 'legal',
        action: 'update',
        entityType: 'Document',
        entityId: updated.id,
        entityName: updated.title,
        changes: updated,
        userId: 'system',
        userName: 'System'
      });
    }
  }

  // Document Sharing
  shareDocumentWithClient(docId: string, clientIds: string[], lawyerId: string) {
    const doc = this.data.documents.find(d => d.id === docId);
    if (doc) {
      // Initialize shared_with array if it doesn't exist
      if (!doc.shared_with) {
        doc.shared_with = [];
      }

      // Add new client IDs that aren't already there
      clientIds.forEach(clientId => {
        if (!doc.shared_with!.includes(clientId)) {
          doc.shared_with!.push(clientId);
        }
      });

      doc.shared_at = new Date().toISOString();
      doc.shared_by = lawyerId;

      this.updateDocument(doc);

      // Log the action
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: lawyerId,
        user_name: 'System',
        action: 'Partage document avec client(s)',
        target_type: 'Document',
        target_id: docId,
        metadata: {
          doc_title: doc.title,
          client_ids: clientIds,
          client_count: clientIds.length
        }
      });

      return true;
    }
    return false;
  }

  unshareDocumentFromClient(docId: string, clientId: string, lawyerId: string) {
    const doc = this.data.documents.find(d => d.id === docId);
    if (doc && doc.shared_with) {
      const idx = doc.shared_with.indexOf(clientId);
      if (idx !== -1) {
        doc.shared_with.splice(idx, 1);
        this.updateDocument(doc);

        // Log the action
        this.logAction({
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user_id: lawyerId,
          user_name: 'System',
          action: 'Retrait partage document client',
          target_type: 'Document',
          target_id: docId,
          metadata: {
            doc_title: doc.title,
            client_id: clientId
          }
        });

        return true;
      }
    }
    return false;
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
    notifyDraftChange({
      type: 'legal',
      action: 'create',
      entityType: 'Task',
      entityId: task.id,
      entityName: task.title,
      changes: task,
      userId: 'system',
      userName: 'System'
    });
  }
  updateTask(updated: Task) {
    const idx = this.data.tasks.findIndex(t => t.id === updated.id);
    if (idx !== -1) {
      this.data.tasks[idx] = updated;
      this.save();
      notifyDraftChange({
        type: 'legal',
        action: 'update',
        entityType: 'Task',
        entityId: updated.id,
        entityName: updated.title,
        changes: updated,
        userId: 'system',
        userName: 'System'
      });
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

  // Client Messaging (private messages between lawyer and client)
  createClientMessage(message: Message) {
    // Ensure message has required client messaging fields
    const clientMsg: Message = {
      ...message,
      type: 'client',
      is_read: false,
      id: message.id || `MSG-${Date.now()}`,
      timestamp: message.timestamp || new Date().toISOString()
    };

    this.data.messages.push(clientMsg);
    this.save();

    // Log the action if it's from a lawyer
    if (message.sender_id !== message.client_id) {
      this.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: message.sender_id,
        user_name: message.sender_name || 'System',
        action: 'Message client envoyé',
        target_type: 'Message',
        target_id: clientMsg.id,
        metadata: {
          client_id: message.client_id,
          content_preview: message.content.substring(0, 100)
        }
      });
    }
  }

  getClientMessages(clientId: string) {
    return this.data.messages
      .filter(m => m.type === 'client' && m.client_id === clientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  markClientMessageAsRead(messageId: string) {
    const msg = this.data.messages.find(m => m.id === messageId);
    if (msg) {
      msg.is_read = true;
      this.save();
      return true;
    }
    return false;
  }

  // Audit
  logAction(log: AuditLog) {
    this.data.auditLogs.unshift(log);
    this.save();
  }
  getAuditLogs() { return this.data.auditLogs; }

  // Conflict Check
  performConflictCheck(query: string, userId: string): ConflictCheck {
    const matches: string[] = [];

    // Check client names with fuzzy matching (threshold: 0.6 = 60% similar)
    const clientNames = this.data.clients.map(c => c.name);
    const similarClients = findSimilarMatches(query, clientNames, 0.6);
    matches.push(...similarClients.map(m => m.match));

    // Check case parties/opponents (if available)
    for (const caseItem of this.data.cases) {
      if (compareNames(query, caseItem.title, 0.65)) {
        matches.push(caseItem.title);
      }
    }

    // Deduplicate matches
    const uniqueMatches = Array.from(new Set(matches));

    const check: ConflictCheck = {
      id: `CC-${Date.now()}`,
      timestamp: new Date().toISOString(),
      query,
      result: uniqueMatches.length > 0 ? 'Fail' : 'Pass',
      matched_entities: uniqueMatches,
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
  removeStaff(userId: string) {
    const idx = this.data.staff.findIndex(s => s.id === userId);
    if (idx !== -1) {
      this.data.staff.splice(idx, 1);
      this.save();
    }
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
