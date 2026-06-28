export type Role =
  | 'gouverneur'
  | 'vice_gouverneur'
  | 'secretaire_etat_general'
  | 'secretaire_securite'
  | 'press_secretary'
  | 'secretaire_sante'
  | 'secretaire_justice'
  | 'secretaire_securite_interieure'
  | 'secretaire_tresor_commerce'
  | 'avocat'
  | 'admin';

export type ServiceID =
  | 'CABINET'
  | 'SECURITE_PUBLIQUE'
  | 'JUSTICE'
  | 'SANTE_HUMAINS'
  | 'SECURITE_INTERIEURE'
  | 'TRESOR_COMMERCE'
  | 'COMMUNICATION'
  | 'ADMINISTRATION_GENERALE';

export type Permission =
  | 'intranet:view'
  | 'dashboard:view'
  | 'documents:view' | 'documents:create' | 'documents:edit' | 'documents:delete' | 'documents:submit_review' | 'documents:approve_service' | 'documents:approve_state' | 'documents:sign' | 'documents:publish' | 'documents:archive'
  | 'dossiers:view' | 'dossiers:create' | 'dossiers:edit' | 'dossiers:delete' | 'dossiers:close' | 'dossiers:assign_members' | 'dossiers:confidential_access'
  | 'communication:view' | 'communication:post' | 'communication:announcements_post'
  | 'planning:view' | 'planning:create' | 'planning:edit' | 'planning:delete'
  | 'tasks:view' | 'tasks:create' | 'tasks:edit' | 'tasks:delete' | 'tasks:assign'
  | 'directory:view'
  | 'admin:users_manage' | 'admin:roles_manage' | 'admin:settings'
  | 'audit:logs_view' | 'audit:reports_export' | 'audit:delete_logs'
  | 'lawyer:intranet_access';

export type UserStatus = 'available' | 'busy' | 'away' | 'offline';

export interface User {
  id: string;
  username: string;
  role: Role;
  service_id: ServiceID;
  name: string;
  service_name: string;
  grade: string;
  permissions: Permission[];
  status: UserStatus;
  matricule?: string;
  callsign?: string;
  avatar?: string;
  // Client portal fields
  client_id?: string;
  is_client?: boolean;
  access_method?: 'email_password' | 'token';
  token_expires_at?: string;
}
