export const GOV_DIVISIONS = {
  CABINET_GOUVERNEUR: 'cabinet_gouverneur',
  SECURITE_PUBLIQUE: 'securite_publique',
  LSPD: 'lspd',
  LSSD: 'lssd',
  FIB: 'fib',
  SANTE: 'sante',
  SAMS: 'sams',
  TRESOR_ECONOMIE: 'tresor_economie',
  INTERIEUR: 'interieur',
  PRESSE: 'presse',
  RESSOURCES_HUMAINES: 'ressources_humaines',
  ADMINISTRATION_GENERALE: 'administration_generale',
} as const;

export type GovDivisionId = typeof GOV_DIVISIONS[keyof typeof GOV_DIVISIONS];

export const GOV_DIVISION_LABELS: Record<GovDivisionId, string> = {
  cabinet_gouverneur: 'Cabinet du Gouverneur',
  securite_publique: 'Securite Publique',
  lspd: 'LSPD',
  lssd: 'LSSD',
  fib: 'FIB',
  sante: 'Sante',
  sams: 'SAMS',
  tresor_economie: 'Tresor / Economie',
  interieur: 'Interieur',
  presse: 'Presse',
  ressources_humaines: 'Ressources Humaines',
  administration_generale: 'Administration generale',
};

export const GOV_DIVISION_COLORS: Record<GovDivisionId, string> = {
  cabinet_gouverneur: 'bg-slate-900',
  securite_publique: 'bg-blue-700',
  lspd: 'bg-blue-600',
  lssd: 'bg-emerald-700',
  fib: 'bg-indigo-800',
  sante: 'bg-red-600',
  sams: 'bg-rose-500',
  tresor_economie: 'bg-amber-700',
  interieur: 'bg-slate-700',
  presse: 'bg-teal-600',
  ressources_humaines: 'bg-cyan-700',
  administration_generale: 'bg-gray-700',
};

export const GOV_GRADES = [
  'Employe',
  'Agent',
  'Superviseur',
  'Responsable',
  'Directeur',
  'Secretaire',
  'Gouverneur',
  'Administrateur',
] as const;

export type GovGrade = typeof GOV_GRADES[number];

export const GOV_ROLES_TECHNIQUES = [
  'employee',
  'manager',
  'secretary',
  'hr',
  'governor',
  'admin',
] as const;

export type GovRoleTechnique = typeof GOV_ROLES_TECHNIQUES[number];

export const GOV_ROLE_LABELS: Record<GovRoleTechnique, string> = {
  employee: 'Employe',
  manager: 'Responsable',
  secretary: 'Secretaire',
  hr: 'Ressources Humaines',
  governor: 'Gouverneur',
  admin: 'Administrateur',
};

export const GOV_PERMISSIONS = {
  CREATE_DOCUMENTS: 'create_documents',
  EDIT_DOCUMENTS: 'edit_documents',
  VALIDATE_DOCUMENTS: 'validate_documents',
  PUBLISH_ANNOUNCEMENTS: 'publish_announcements',
  CREATE_CASES: 'create_cases',
  EDIT_CASES: 'edit_cases',
  ARCHIVE_CASES: 'archive_cases',
  MANAGE_EMPLOYEES: 'manage_employees',
  EDIT_DIVISIONS: 'edit_divisions',
  VIEW_LOGS: 'view_logs',
  MANAGE_SETTINGS: 'manage_settings',
  ACTIVATE_EMERGENCY_MODE: 'activate_emergency_mode',
} as const;

export type GovPermission = typeof GOV_PERMISSIONS[keyof typeof GOV_PERMISSIONS];

export const GOV_PERMISSION_LABELS: Record<GovPermission, string> = {
  create_documents: 'Creer des documents',
  edit_documents: 'Modifier des documents',
  validate_documents: 'Valider des documents',
  publish_announcements: 'Publier des annonces',
  create_cases: 'Creer des dossiers',
  edit_cases: 'Modifier des dossiers',
  archive_cases: 'Archiver des dossiers',
  manage_employees: 'Gerer les employes',
  edit_divisions: 'Modifier les divisions',
  view_logs: 'Voir les logs',
  manage_settings: 'Gerer les parametres',
  activate_emergency_mode: 'Activer le mode urgence',
};

export const GOV_STATUSES = [
  'actif',
  'en_attente',
  'absent',
  'suspendu',
  'archive',
  'demissionnaire',
] as const;

export type GovEmployeeStatus = typeof GOV_STATUSES[number];

export const GOV_STATUS_LABELS: Record<GovEmployeeStatus, string> = {
  actif: 'Actif',
  en_attente: 'En attente',
  absent: 'Absent',
  suspendu: 'Suspendu',
  archive: 'Archive',
  demissionnaire: 'Demissionnaire',
};

export const GOV_STATUS_COLORS: Record<GovEmployeeStatus, string> = {
  actif: 'bg-emerald-500',
  en_attente: 'bg-amber-500',
  absent: 'bg-orange-500',
  suspendu: 'bg-red-600',
  archive: 'bg-slate-400',
  demissionnaire: 'bg-gray-500',
};

export const GOV_CHANNELS = [
  { id: 'annonces', name: 'Annonces officielles', division_id: null, type: 'announcement' },
  { id: 'cabinet_gouverneur', name: 'Cabinet du Gouverneur', division_id: GOV_DIVISIONS.CABINET_GOUVERNEUR, type: 'channel' },
  { id: 'securite_publique', name: 'Securite Publique', division_id: GOV_DIVISIONS.SECURITE_PUBLIQUE, type: 'channel' },
  { id: 'lspd', name: 'LSPD', division_id: GOV_DIVISIONS.LSPD, type: 'channel' },
  { id: 'lssd', name: 'LSSD', division_id: GOV_DIVISIONS.LSSD, type: 'channel' },
  { id: 'fib', name: 'FIB', division_id: GOV_DIVISIONS.FIB, type: 'channel' },
  { id: 'sante', name: 'Sante', division_id: GOV_DIVISIONS.SANTE, type: 'channel' },
  { id: 'sams', name: 'SAMS', division_id: GOV_DIVISIONS.SAMS, type: 'channel' },
  { id: 'tresor_economie', name: 'Tresor / Economie', division_id: GOV_DIVISIONS.TRESOR_ECONOMIE, type: 'channel' },
  { id: 'interieur', name: 'Interieur', division_id: GOV_DIVISIONS.INTERIEUR, type: 'channel' },
  { id: 'presse', name: 'Presse', division_id: GOV_DIVISIONS.PRESSE, type: 'channel' },
  { id: 'ressources_humaines', name: 'Ressources Humaines', division_id: GOV_DIVISIONS.RESSOURCES_HUMAINES, type: 'channel' },
  { id: 'administration_generale', name: 'Administration generale', division_id: GOV_DIVISIONS.ADMINISTRATION_GENERALE, type: 'channel' },
] as const;

export const DIVISION_TO_WORKSPACE_MAP: Record<GovDivisionId, string> = {
  cabinet_gouverneur: 'CABINET',
  securite_publique: 'SECURITE_PUBLIQUE',
  lspd: 'SECURITE_PUBLIQUE',
  lssd: 'SECURITE_PUBLIQUE',
  fib: 'SECURITE_INTERIEURE',
  sante: 'SANTE_HUMAINS',
  sams: 'SANTE_HUMAINS',
  tresor_economie: 'TRESOR_COMMERCE',
  interieur: 'SECURITE_INTERIEURE',
  presse: 'COMMUNICATION',
  ressources_humaines: 'ADMINISTRATION_GENERALE',
  administration_generale: 'ADMINISTRATION_GENERALE',
};
