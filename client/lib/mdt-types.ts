// ─── MDT Service IDs ──────────────────────────────────────────────────────────
export type MdtServiceId = 'USSS' | 'LSPD' | 'LSSD' | 'FIB' | 'LSFD' | 'SAMS';

// ─── MDT Roles ────────────────────────────────────────────────────────────────
export type MdtRole = 'agent' | 'supervisor' | 'admin' | 'mdt_admin';

// ─── MDT Permissions ──────────────────────────────────────────────────────────
export type MdtPermission =
  | 'view_dashboard'
  | 'view_dispatch' | 'manage_dispatch'
  | 'view_units' | 'manage_units'
  | 'view_effectifs' | 'manage_effectifs'
  | 'view_citizens' | 'edit_citizens'
  | 'view_vehicles' | 'edit_vehicles'
  | 'view_properties' | 'edit_properties'
  | 'view_weapons' | 'edit_weapons'
  | 'view_reports' | 'create_reports' | 'edit_reports' | 'validate_reports'
  | 'view_fines' | 'create_fines' | 'edit_fines'
  | 'view_investigations' | 'create_investigations' | 'edit_investigations'
  | 'view_warrants' | 'create_warrants' | 'validate_warrants'
  | 'view_ballistics' | 'edit_ballistics'
  | 'view_lab' | 'edit_lab'
  | 'view_seizures' | 'create_seizures'
  | 'view_bolo' | 'create_bolo' | 'edit_bolo'
  | 'view_gangs' | 'edit_gangs'
  | 'view_evidence' | 'upload_evidence'
  | 'view_announcements' | 'create_announcements'
  | 'view_complaints' | 'manage_complaints'
  | 'view_depositions' | 'create_depositions'
  | 'view_penal_code'
  | 'view_service_hours' | 'manage_service_hours'
  | 'mdt_settings';

// ─── Grades by Service ────────────────────────────────────────────────────────
export const SERVICE_RANKS: Record<MdtServiceId, string[]> = {
  USSS: [
    'Probationary',
    'Field Agent',
    'Senior Field Agent',
    'Special Agent',
    'Senior Special Agent',
    'Deputy Supervisor',
    'Senior Supervisor',
    'Assistant Chief Officer',
    'Chief',
  ],
  LSPD: [
    'Cadet',
    'Officer I',
    'Officer II',
    'Officer III',
    'Detective',
    'Detective II',
    'Sergeant',
    'Lieutenant',
    'Captain',
    'Commander',
    'Deputy Chief',
    'Chief of Police',
  ],
  LSSD: [
    'Trainee',
    'Deputy Sheriff',
    'Senior Deputy',
    'Detective Deputy',
    'Corporal',
    'Sergeant',
    'Lieutenant',
    'Captain',
    'Commander',
    'Undersheriff',
    'Sheriff',
  ],
  FIB: [
    'Analyst',
    'Field Agent',
    'Senior Field Agent',
    'Special Agent',
    'Senior Special Agent',
    'Team Lead',
    'Supervisory Special Agent',
    'Assistant Director',
    'Director',
  ],
  LSFD: [
    'Probie',
    'Firefighter',
    'Firefighter II',
    'Engineer',
    'Captain',
    'Battalion Chief',
    'Deputy Chief',
    'Fire Chief',
  ],
  SAMS: [
    'Intern',
    'EMT',
    'Advanced EMT',
    'Paramedic',
    'Senior Paramedic',
    'Supervisor',
    'Chief Medical Officer',
  ],
};

// ─── Service Metadata ─────────────────────────────────────────────────────────
export const MDT_SERVICES: Record<MdtServiceId, {
  label: string;
  shortLabel: string;
  color: string;
  accentColor: string;
  bg: string;
  border: string;
}> = {
  USSS: {
    label: 'United States Secret Service',
    shortLabel: 'USSS',
    color: '#3B82F6',
    accentColor: '#1D4ED8',
    bg: '#0F172A',
    border: '#1E40AF',
  },
  LSPD: {
    label: 'Los Santos Police Department',
    shortLabel: 'LSPD',
    color: '#2563EB',
    accentColor: '#1E40AF',
    bg: '#0F172A',
    border: '#1D4ED8',
  },
  LSSD: {
    label: 'Los Santos Sheriff Department',
    shortLabel: 'LSSD',
    color: '#D97706',
    accentColor: '#B45309',
    bg: '#0F172A',
    border: '#92400E',
  },
  FIB: {
    label: 'Federal Investigation Bureau',
    shortLabel: 'FIB',
    color: '#DC2626',
    accentColor: '#B91C1C',
    bg: '#0F172A',
    border: '#991B1B',
  },
  LSFD: {
    label: 'Los Santos Fire Department',
    shortLabel: 'LSFD',
    color: '#EA580C',
    accentColor: '#C2410C',
    bg: '#0F172A',
    border: '#9A3412',
  },
  SAMS: {
    label: 'San Andreas Medical Services',
    shortLabel: 'SAMS',
    color: '#16A34A',
    accentColor: '#15803D',
    bg: '#0F172A',
    border: '#166534',
  },
};

// ─── MDT Agent ────────────────────────────────────────────────────────────────
export interface MdtAgent {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  matricule: string;
  callsign: string;
  service: MdtServiceId;
  rank: string;
  mdtRole: MdtRole;
  permissions: MdtPermission[];
  status: 'En service' | 'Hors service' | 'En pause' | 'Suspendu';
  avatar?: string;
  phone?: string;
  email?: string;
  joinedAt?: string;
  badgeNumber?: string;
}

// ─── MDT User (extends the auth User for MDT context) ─────────────────────────
export interface MdtUser {
  id: string;
  username: string;
  name: string;
  service: MdtServiceId;
  rank: string;
  callsign: string;
  mdtRole: MdtRole;
  permissions: MdtPermission[];
  status: 'En service' | 'Hors service' | 'En pause';
  matricule?: string;
  avatar?: string;
}

// ─── MDT Role Permission Map ──────────────────────────────────────────────────
const BASE_AGENT_PERMS: MdtPermission[] = [
  'view_dashboard',
  'view_dispatch',
  'view_units',
  'view_citizens',
  'view_vehicles',
  'view_properties',
  'view_weapons',
  'view_reports', 'create_reports',
  'view_fines', 'create_fines',
  'view_bolo', 'create_bolo',
  'view_gangs',
  'view_evidence', 'upload_evidence',
  'view_announcements',
  'view_depositions', 'create_depositions',
  'view_penal_code',
  'view_service_hours',
];

const SUPERVISOR_PERMS: MdtPermission[] = [
  ...BASE_AGENT_PERMS,
  'manage_dispatch',
  'manage_units',
  'view_effectifs',
  'edit_citizens', 'edit_vehicles', 'edit_properties', 'edit_weapons',
  'edit_reports', 'validate_reports',
  'edit_fines',
  'view_investigations', 'create_investigations',
  'view_warrants', 'create_warrants',
  'view_ballistics',
  'view_lab',
  'view_seizures', 'create_seizures',
  'edit_bolo',
  'edit_gangs',
  'create_announcements',
  'view_complaints',
  'manage_service_hours',
];

const ADMIN_PERMS: MdtPermission[] = [
  ...SUPERVISOR_PERMS,
  'manage_effectifs',
  'edit_investigations',
  'validate_warrants',
  'edit_ballistics',
  'edit_lab',
  'manage_complaints',
  'mdt_settings',
];

const MDT_ADMIN_PERMS: MdtPermission[] = [
  ...ADMIN_PERMS,
];

export const MDT_ROLE_PERMISSIONS: Record<MdtRole, MdtPermission[]> = {
  agent: BASE_AGENT_PERMS,
  supervisor: SUPERVISOR_PERMS,
  admin: ADMIN_PERMS,
  mdt_admin: MDT_ADMIN_PERMS,
};

// ─── Recent Activity ──────────────────────────────────────────────────────────
export interface MdtActivity {
  id: string;
  type: 'report' | 'warrant' | 'bolo' | 'seizure' | 'fine' | 'announcement' | 'service';
  title: string;
  service: MdtServiceId;
  author: string;
  timestamp: string;
}
