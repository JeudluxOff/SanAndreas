// Government Space - Shared Types

export interface GovWorkspace {
  name: string;
  icon: string;
  color: string;
  members: number;
  activeDossiers: number;
  description: string;
  procedures: string[];
  staff: GovStaff[];
  tasks: GovTask[];
  announcements: GovAnnouncement[];
  documents: GovDocument[];
  dossiers: GovDossier[];
}

export interface GovStaff {
  name: string;
  role: string;
  role_short: string;
  status: string;
}

export interface GovTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  due: string;
}

export interface GovAnnouncement {
  id: number;
  title: string;
  text: string;
  date: string;
  author: string;
}

export interface GovDocument {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  author: string;
  archived: boolean;
  acl: string[];
}

export interface GovDossier {
  id: string;
  title: string;
  status: string;
  archived: boolean;
  acl: string[];
  priority?: string;
  creationDate?: string;
  deadline?: string;
  description?: string;
  progress?: number;
  participants?: { id: string, name: string, role: string }[];
}

export interface GovEmployee {
  name: string;
  role: string;
  service: string;
  grade: string;
  status: string;
  email: string;
  joinDate: string;
  image?: string;
  description?: string;
}

export interface GovNotification {
  id: number;
  type: string;
  text: string;
  time: string;
  priority: string;
  service_id: string;
}

export interface GovCalendarEvent {
  id: number;
  time: string;
  title: string;
  type: string;
  date: string;
  participants: number;
  location: string;
  service: string;
}

export interface GovMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  timestamp: string;
}

export interface GovAuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  role: string;
  service_id: string;
  action: string;
  metadata?: any;
}

export interface GovEconomyStat {
  label: string;
  value: string;
  trend: string;
  status: string;
}

export interface GovHealthStat {
  label: string;
  value: string;
  trend: string;
  status: string;
}

export interface GovSecurityStat {
  label: string;
  value: string;
  trend: string;
  status: string;
}

export interface GovJusticeStat {
  label: string;
  value: string;
  trend: string;
  status: string;
}

export interface GovernmentStore {
  workspaces: Record<string, GovWorkspace>;
  employees: GovEmployee[];
  globalAnnouncements: GovAnnouncement[];
  calendarEvents: GovCalendarEvent[];
  notifications: GovNotification[];
  messages: GovMessage[];
  auditLogs: GovAuditLog[];
  economyStats: GovEconomyStat[];
  healthStats: GovHealthStat[];
  securityStats: GovSecurityStat[];
  justiceStats: GovJusticeStat[];
  emergencyMode: boolean;
}
