// Noxwood & Partner - Shared Types

export type LegalRole = 'Associé' | 'Avocat' | 'Juriste' | 'Secrétaire' | 'Comptable' | 'Stagiaire' | 'Auditeur';

export type CaseType = 'Pénal' | 'Civil' | 'Affaires' | 'Admin';
export type CaseStatus = 'Ouvert' | 'En cours' | 'En attente' | 'Clos' | 'Archivé' | 'Scellé';
export type ConfidentialityLevel = 'Normal' | 'Confidentiel' | 'Secret' | 'Scellé';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: 'Individu' | 'Entreprise';
  created_at: string;
}

export interface CaseMember {
  user_id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface InternalNote {
  id: string;
  author_id: string;
  author_name: string;
  content: string;
  timestamp: string;
}

export interface Case {
  id: string;
  title: string;
  client_id: string;
  type: CaseType;
  status: CaseStatus;
  confidentiality: ConfidentialityLevel;
  description?: string;
  lead_id: string;
  members: CaseMember[];
  progression?: number;
  step_description?: string;
  internal_notes?: InternalNote[];
  created_at: string;
  updated_at: string;
  sealed_at?: string;
  sealed_by?: string;
}

export type DocumentStatus = 'Brouillon' | 'Relecture' | 'Validé' | 'Signé' | 'Envoyé' | 'Archivé';
export type DocumentCategory = 'Convention' | 'Plainte' | 'Requête' | 'Courrier' | 'Conclusions';

export interface DocumentVersion {
  version: number;
  file_url: string;
  created_at: string;
  created_by: string;
  change_note?: string;
}

export interface LegalDocument {
  id: string; // Format: NP-YYYY-XXXX
  case_id: string;
  title: string;
  content?: string;
  category: DocumentCategory;
  status: DocumentStatus;
  current_version: number;
  versions: DocumentVersion[];
  signatures: {
    user_id: string;
    signed_at: string;
    role: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface Evidence {
  id: string;
  case_id: string;
  name: string;
  type: string;
  file_url: string;
  images?: string[];
  content?: string;
  confidentiality: ConfidentialityLevel;
  uploaded_by: string;
  uploaded_at: string;
  to_produce_at_hearing: boolean;
}

export interface Task {
  id: string;
  case_id: string;
  title: string;
  description?: string;
  priority: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  status: 'Todo' | 'In Progress' | 'Done';
  due_date: string;
  assigned_to: string; // user_id
  created_at: string;
}

export interface Hearing {
  id: string;
  case_id: string;
  title: string;
  date: string;
  location: string;
  judge: string;
  type: string;
  result?: string;
  status: 'Confirmé' | 'Reporté' | 'Terminé' | 'Annulé';
}

export interface Invoice {
  id: string;
  case_id: string;
  client_id: string;
  amount: number;
  currency: string;
  status: 'Brouillon' | 'Envoyé' | 'Payé' | 'Annulé' | 'En retard';
  due_date: string;
  created_at: string;
  items: {
    description: string;
    amount: number;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata?: any;
}

export interface ConflictCheck {
  id: string;
  timestamp: string;
  query: string;
  result: 'Pass' | 'Fail';
  matched_entities: string[];
  performed_by: string;
}

export interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: LegalRole;
  email: string;
  status: 'Actif' | 'Inactif' | 'Suspendu';
  joined_at: string;
  last_active: string;
  avatar?: string;
}

export interface CabinetSettings {
  name: string;
  address: string;
  logo?: string;
  vat_number: string;
  iban: string;
  phone: string;
  admin_id: string;
  audit_retention_days: number;
}
