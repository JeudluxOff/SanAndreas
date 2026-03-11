/**
 * Centralized permission constants for consistent RBAC enforcement
 * Import these instead of using string literals in components
 */

export const PERMISSIONS = {
  // Intranet access
  INTRANET_VIEW: 'intranet:view',
  INTRANET_ACCESS: 'lawyer:intranet_access',
  
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  
  // Documents
  DOCUMENTS_VIEW: 'documents:view',
  DOCUMENTS_CREATE: 'documents:create',
  DOCUMENTS_EDIT: 'documents:edit',
  DOCUMENTS_SIGN: 'documents:sign',
  DOCUMENTS_PUBLISH: 'documents:publish',
  DOCUMENTS_ARCHIVE: 'documents:archive',
  DOCUMENTS_DELETE: 'documents:delete',
  DOCUMENTS_APPROVE_STATE: 'documents:approve_state',
  
  // Dossiers (Cases)
  DOSSIERS_VIEW: 'dossiers:view',
  DOSSIERS_CREATE: 'dossiers:create',
  DOSSIERS_EDIT: 'dossiers:edit',
  DOSSIERS_DELETE: 'dossiers:delete',
  DOSSIERS_ASSIGN_MEMBERS: 'dossiers:assign_members',
  DOSSIERS_CLOSE: 'dossiers:close',
  
  // Planning / Calendar
  PLANNING_VIEW: 'planning:view',
  PLANNING_CREATE: 'planning:create',
  PLANNING_EDIT: 'planning:edit',
  PLANNING_DELETE: 'planning:delete',
  
  // Tasks
  TASKS_VIEW: 'tasks:view',
  TASKS_CREATE: 'tasks:create',
  TASKS_EDIT: 'tasks:edit',
  TASKS_DELETE: 'tasks:delete',
  TASKS_ASSIGN: 'tasks:assign',
  
  // Audit
  AUDIT_LOGS_VIEW: 'audit:logs_view',
  AUDIT_REPORTS_EXPORT: 'audit:reports_export',
  AUDIT_DELETE_LOGS: 'audit:delete_logs',
  
  // Admin / User Management
  ADMIN_USERS_MANAGE: 'admin:users_manage',
  ADMIN_ROLES_MANAGE: 'admin:roles_manage',
  ADMIN_SETTINGS: 'admin:settings',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

/**
 * Get display name for a permission (for UI/logging)
 */
export function getPermissionDisplayName(permission: string): string {
  const key = Object.entries(PERMISSIONS).find(([_, val]) => val === permission)?.[0];
  return key ? key.replace(/_/g, ' ') : permission;
}

/**
 * Check if user has required permission
 */
export function hasPermission(userPermissions: string[] | undefined, requiredPermission: string): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if user has ANY of the required permissions
 */
export function hasAnyPermission(userPermissions: string[] | undefined, permissions: string[]): boolean {
  if (!userPermissions) return false;
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * Check if user has ALL of the required permissions
 */
export function hasAllPermissions(userPermissions: string[] | undefined, permissions: string[]): boolean {
  if (!userPermissions) return false;
  return permissions.every(p => userPermissions.includes(p));
}
