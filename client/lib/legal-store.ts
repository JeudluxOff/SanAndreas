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
  CaseType,
  CaseStatus,
  ConfidentialityLevel,
  StaffMember,
  CabinetSettings
} from '@shared/api';

const STORE_KEY = 'hc_legal_store';

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
    name: 'Harrington & Cole',
    address: '15, Rue de la Paix, Los Santos',
    vat_number: 'SA-FR-123456789',
    iban: 'SA00 1234 5678 9012 3456 7890 123',
    phone: '+SA 555-0199',
    admin_id: 'admin_avocat',
    audit_retention_days: 365
  },
  staff: [
    { id: 'admin_avocat', name: 'Julian Harrington', role: 'Associé', email: 'j.harrington@hc.sa', status: 'Actif', joined_at: '2020-01-01', last_active: new Date().toISOString() },
    { id: 'avocat_victoria', name: 'Victoria Cole', role: 'Associée', email: 'v.cole@hc.sa', status: 'Actif', joined_at: '2020-01-01', last_active: new Date().toISOString() },
    { id: 'avocat_marcus', name: 'Marcus Vane', role: 'Avocat Senior', email: 'm.vane@hc.sa', status: 'Actif', joined_at: '2021-05-15', last_active: new Date().toISOString() },
    { id: 'avocat_elena', name: 'Elena Rossi', role: 'Avocate', email: 'e.rossi@hc.sa', status: 'Actif', joined_at: '2022-03-10', last_active: new Date().toISOString() },
    { id: 'staff_thomas', name: 'Thomas Miller', role: 'Comptable', email: 't.miller@hc.sa', status: 'Actif', joined_at: '2023-01-05', last_active: new Date().toISOString() },
    { id: 'staff_sarah', name: 'Sarah Jenkins', role: 'Secrétaire', email: 's.jenkins@hc.sa', status: 'Actif', joined_at: '2022-11-20', last_active: new Date().toISOString() },
    { id: 'staff_lucas', name: 'Lucas Dupont', role: 'Juriste', email: 'l.dupont@hc.sa', status: 'Actif', joined_at: '2023-06-01', last_active: new Date().toISOString() }
  ],
  clients: [
    { id: 'cli-001', name: 'Martin Madrazo', email: 'm.madrazo@lafuente.sa', type: 'Individu', created_at: '2024-01-15' },
    { id: 'cli-002', name: 'Union Depository', email: 'contact@ud.sa', type: 'Entreprise', created_at: '2024-02-20' },
    { id: 'cli-003', name: 'Thornton Duggan', email: 't.duggan@diamond.sa', type: 'Individu', created_at: '2024-03-10' },
    { id: 'cli-004', name: 'Gouvernement SA', email: 'admin@gov.sa', type: 'Entreprise', created_at: '2024-01-01' },
    { id: 'cli-005', name: 'Mairie de Los Santos', email: 'mayor@ls.sa', type: 'Entreprise', created_at: '2024-01-05' },
    { id: 'cli-006', name: 'Fleeca Bank', email: 'support@fleeca.sa', type: 'Entreprise', created_at: '2024-04-12' },
    { id: 'cli-007', name: 'Ammu-Nation', email: 'sales@ammu-nation.sa', type: 'Entreprise', created_at: '2024-03-25' },
    { id: 'cli-008', name: 'LS Customs', email: 'hao@lscustoms.sa', type: 'Entreprise', created_at: '2024-02-28' },
    { id: 'cli-009', name: "Benny's Motorworks", email: 'benny@bennys.sa', type: 'Entreprise', created_at: '2024-04-05' },
    { id: 'cli-010', name: 'Ballas Gang', type: 'Individu', created_at: '2024-05-01' },
  ],
  cases: [
    {
      id: "HC-2024-001",
      title: "État de SA vs. Madrazo",
      client_id: "cli-001",
      type: "Pénal",
      status: "En cours",
      confidentiality: "Confidentiel",
      lead_id: "avocat_victoria",
      members: [
        { user_id: "avocat_victoria", name: "Victoria Cole", role: "Associée", avatar: "Victoria" },
        { user_id: "avocat_marcus", name: "Marcus Vane", role: "Avocat Senior", avatar: "Marcus" },
        { user_id: "avocat_elena", name: "Elena Rossi", role: "Avocate", avatar: "Elena" }
      ],
      created_at: "2024-05-15T09:00:00Z",
      updated_at: "2024-05-24T09:42:00Z"
    },
    {
      id: "HC-2024-002",
      title: "Fusion UD & Fleeca",
      client_id: "cli-002",
      type: "Affaires",
      status: "En cours",
      confidentiality: "Secret",
      lead_id: "admin_avocat",
      members: [
        { user_id: "admin_avocat", name: "Julian Harrington", role: "Associé", avatar: "Julian" }
      ],
      created_at: "2024-05-10T10:00:00Z",
      updated_at: "2024-05-22T14:30:00Z"
    },
    {
      id: "HC-2024-003",
      title: "V. Duggan - Succession",
      client_id: "cli-003",
      type: "Civil",
      status: "En attente",
      confidentiality: "Normal",
      lead_id: "avocat_marcus",
      members: [
        { user_id: "avocat_marcus", name: "Marcus Vane", role: "Avocat Senior", avatar: "Marcus" }
      ],
      created_at: "2024-05-12T11:00:00Z",
      updated_at: "2024-05-12T11:00:00Z"
    },
    {
      id: "HC-2024-004",
      title: "Mairie LS - Urbanisme",
      client_id: "cli-005",
      type: "Admin",
      status: "En cours",
      confidentiality: "Normal",
      lead_id: "avocat_elena",
      members: [
        { user_id: "avocat_elena", name: "Elena Rossi", role: "Avocate", avatar: "Elena" }
      ],
      created_at: "2024-05-01T09:00:00Z",
      updated_at: "2024-05-20T16:00:00Z"
    },
    {
      id: "HC-2024-005",
      title: "Scellé - Affaire 402",
      client_id: "cli-010",
      type: "Pénal",
      status: "Scellé",
      confidentiality: "Scellé",
      lead_id: "admin_avocat",
      members: [
        { user_id: "admin_avocat", name: "Julian Harrington", role: "Associé", avatar: "Julian" }
      ],
      created_at: "2024-04-15T10:00:00Z",
      updated_at: "2024-04-15T10:00:00Z"
    },
    {
      id: "HC-2024-006",
      title: "Fleeca Bank - Cyber-fraude",
      client_id: "cli-006",
      type: "Pénal",
      status: "En cours",
      confidentiality: "Secret",
      lead_id: "avocat_victoria",
      members: [
        { user_id: "avocat_victoria", name: "Victoria Cole", role: "Associée", avatar: "Victoria" }
      ],
      created_at: "2024-05-18T14:00:00Z",
      updated_at: "2024-05-18T14:00:00Z"
    },
    {
      id: "HC-2024-007",
      title: "Litige Contractuel Ammunation",
      client_id: "cli-007",
      type: "Civil",
      status: "En cours",
      confidentiality: "Normal",
      lead_id: "avocat_marcus",
      members: [
        { user_id: "avocat_marcus", name: "Marcus Vane", role: "Avocat Senior", avatar: "Marcus" }
      ],
      created_at: "2024-05-05T08:30:00Z",
      updated_at: "2024-05-05T08:30:00Z"
    },
    {
      id: "HC-2024-008",
      title: "Redépôt de Bilan LS Custom",
      client_id: "cli-008",
      type: "Affaires",
      status: "En cours",
      confidentiality: "Confidentiel",
      lead_id: "admin_avocat",
      members: [
        { user_id: "admin_avocat", name: "Julian Harrington", role: "Associé", avatar: "Julian" }
      ],
      created_at: "2024-05-02T10:00:00Z",
      updated_at: "2024-05-02T10:00:00Z"
    },
    {
      id: "HC-2024-009",
      title: "Recours Permis de Construire",
      client_id: "cli-009",
      type: "Admin",
      status: "En attente",
      confidentiality: "Normal",
      lead_id: "avocat_elena",
      members: [
        { user_id: "avocat_elena", name: "Elena Rossi", role: "Avocate", avatar: "Elena" }
      ],
      created_at: "2024-05-20T11:00:00Z",
      updated_at: "2024-05-20T11:00:00Z"
    },
    {
      id: "HC-2024-010",
      title: "Défense Criminelle - Ballas",
      client_id: "cli-010",
      type: "Pénal",
      status: "En cours",
      confidentiality: "Secret",
      lead_id: "avocat_victoria",
      members: [
        { user_id: "avocat_victoria", name: "Victoria Cole", role: "Associée", avatar: "Victoria" }
      ],
      created_at: "2024-05-22T16:00:00Z",
      updated_at: "2024-05-22T16:00:00Z"
    }
  ],
  documents: [
    {
      id: "HC-2024-001",
      case_id: "HC-2024-001",
      title: "Conclusions de défense",
      category: "Conclusions",
      status: "Signé",
      current_version: 3,
      versions: [
        { version: 1, file_url: "#", created_at: "2024-05-16T10:00:00Z", created_by: "avocat_victoria" },
        { version: 2, file_url: "#", created_at: "2024-05-18T14:00:00Z", created_by: "avocat_marcus" },
        { version: 3, file_url: "#", created_at: "2024-05-24T09:42:00Z", created_by: "avocat_victoria", change_note: "Validation finale Madrazo" }
      ],
      signatures: [
        { user_id: "avocat_victoria", signed_at: "2024-05-24T10:00:00Z", role: "Associée" }
      ],
      created_at: "2024-05-16T10:00:00Z",
      updated_at: "2024-05-24T09:42:00Z"
    }
  ],
  evidence: [
    {
      id: "EVI-882-01",
      case_id: "HC-2024-001",
      name: "Vidéo CCTV - Union Depository",
      type: "Vidéo",
      file_url: "#",
      confidentiality: "Secret",
      uploaded_by: "avocat_marcus",
      uploaded_at: "2024-05-20T14:30:00Z",
      to_produce_at_hearing: true
    }
  ],
  tasks: [
    {
      id: "TSK-001",
      case_id: "HC-2024-001",
      title: "Vérification Conflits Duggan",
      priority: "Critique",
      status: "Todo",
      due_date: "2024-05-25T10:00:00Z",
      assigned_to: "admin_avocat",
      created_at: "2024-05-23T09:00:00Z"
    }
  ],
  hearings: [
    {
      id: "HR-001",
      case_id: "HC-2024-001",
      title: "Audience Préliminaire",
      date: "2024-05-26T09:00:00Z",
      location: "Cour Supérieure de Los Santos",
      judge: "Hon. J. Miller",
      type: "Pénal",
      status: "Confirmé"
    }
  ],
  invoices: [
    {
      id: "INV-2024-001",
      case_id: "HC-2024-003",
      client_id: "cli-003",
      amount: 12400,
      currency: "SA$",
      status: "En retard",
      due_date: "2024-05-09T00:00:00Z",
      created_at: "2024-04-24T00:00:00Z",
      items: [{ description: "Honoraires Ouverture Dossier & Audit", amount: 12400 }]
    }
  ],
  auditLogs: [],
  conflictChecks: [],
  messages: []
};

class LegalStoreManager {
  private data: LegalStore;

  constructor() {
    const saved = localStorage.getItem(STORE_KEY);
    this.data = saved ? JSON.parse(saved) : INITIAL_DATA;
  }

  private save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
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
        user_name: 'System', // Will be enriched by page
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
        user_name: 'System', // Will be enriched by page
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
