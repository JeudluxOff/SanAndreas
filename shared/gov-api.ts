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
  archived: boolean;
}

export interface GovDossier {
  id: string;
  title: string;
  status: string;
  archived: boolean;
}

export interface GovEmployee {
  name: string;
  role: string;
  service: string;
  grade: string;
  status: string;
  email: string;
  joinDate: string;
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
  time: string;
  title: string;
  type: string;
}

export interface GovernmentStore {
  workspaces: Record<string, GovWorkspace>;
  employees: GovEmployee[];
  globalAnnouncements: GovAnnouncement[];
  calendarEvents: GovCalendarEvent[];
  notifications: GovNotification[];
}
