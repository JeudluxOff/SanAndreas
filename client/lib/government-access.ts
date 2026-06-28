import {
  GovDivisionId,
  GovPermission,
  GovRoleTechnique,
  GOV_DIVISIONS,
  GOV_DIVISION_LABELS,
  GOV_CHANNELS,
  DIVISION_TO_WORKSPACE_MAP,
} from './government-rbac';

export interface GovUserAccess {
  id: string;
  rolesTechniques: GovRoleTechnique[];
  divisions: GovDivisionId[];
  permissions: GovPermission[];
  status: string;
}

export function isGovernmentAdmin(user: GovUserAccess | null | undefined): boolean {
  if (!user) return false;
  return user.rolesTechniques.includes('admin');
}

export function isGovernmentGovernor(user: GovUserAccess | null | undefined): boolean {
  if (!user) return false;
  return user.rolesTechniques.includes('governor');
}

export function hasGovernmentPermission(user: GovUserAccess | null | undefined, permission: GovPermission): boolean {
  if (!user) return false;
  if (isGovernmentAdmin(user)) return true;
  return user.permissions.includes(permission);
}

export function hasGovernmentDivision(user: GovUserAccess | null | undefined, divisionId: GovDivisionId): boolean {
  if (!user) return false;
  if (isGovernmentAdmin(user)) return true;
  if (isGovernmentGovernor(user)) return true;
  return user.divisions.includes(divisionId);
}

export function canAccessGovernmentWorkspace(user: GovUserAccess | null | undefined, divisionId: GovDivisionId): boolean {
  if (!user) return false;
  if (isGovernmentAdmin(user)) return true;
  if (isGovernmentGovernor(user)) return true;
  return hasGovernmentDivision(user, divisionId);
}

export function canAccessGovernmentDocument(user: GovUserAccess | null | undefined, document: { division_id?: string | null }): boolean {
  if (!user) return false;
  if (isGovernmentAdmin(user)) return true;
  if (isGovernmentGovernor(user)) return true;
  if (!document.division_id) return true;
  return hasGovernmentDivision(user, document.division_id as GovDivisionId);
}

export function canAccessGovernmentCase(user: GovUserAccess | null | undefined, dossier: { division_id?: string | null }): boolean {
  if (!user) return false;
  if (isGovernmentAdmin(user)) return true;
  if (isGovernmentGovernor(user)) return true;
  if (!dossier.division_id) return true;
  return hasGovernmentDivision(user, dossier.division_id as GovDivisionId);
}

export function canAccessGovernmentChannel(user: GovUserAccess | null | undefined, channel: { division_id: string | null }): boolean {
  if (!user) return false;
  if (isGovernmentAdmin(user)) return true;
  if (isGovernmentGovernor(user)) return true;
  if (!channel.division_id) return true;
  return hasGovernmentDivision(user, channel.division_id as GovDivisionId);
}

export function getGovernmentAccessibleDivisions(user: GovUserAccess | null | undefined): GovDivisionId[] {
  if (!user) return [];
  if (isGovernmentAdmin(user) || isGovernmentGovernor(user)) {
    return Object.values(GOV_DIVISIONS);
  }
  return [...new Set(user.divisions)];
}

export function canAccessHRPage(user: GovUserAccess | null | undefined): boolean {
  if (!user) return false;
  if (isGovernmentAdmin(user)) return true;
  if (isGovernmentGovernor(user)) return true;
  if (user.rolesTechniques.includes('hr')) return true;
  return user.permissions.includes('manage_employees');
}

export function canAccessLogsPage(user: GovUserAccess | null | undefined): boolean {
  if (!user) return false;
  if (isGovernmentAdmin(user)) return true;
  if (isGovernmentGovernor(user)) return true;
  return user.permissions.includes('view_logs');
}

export function isAccountBlocked(status: string): boolean {
  return status === 'suspendu' || status === 'archive';
}

export interface GeneratedAccess {
  pages: string[];
  workspaces: string[];
  channels: string[];
  permissions: string[];
  deniedDivisions: string[];
  deniedPages: string[];
  deniedChannels: string[];
}

export function getGeneratedGovernmentAccess(user: GovUserAccess | null | undefined): GeneratedAccess {
  const allDivisions = Object.values(GOV_DIVISIONS);
  const allPages = ['Tableau de Bord', 'Documents', 'Dossiers', 'Communication', 'Planning', 'Espaces de Travail', 'Ressources Humaines', 'Audit & Logs'];

  if (!user) return { pages: [], workspaces: [], channels: [], permissions: [], deniedDivisions: allDivisions.map(d => GOV_DIVISION_LABELS[d]), deniedPages: allPages, deniedChannels: GOV_CHANNELS.map(c => c.name) };

  if (isGovernmentAdmin(user)) {
    return {
      pages: allPages,
      workspaces: allDivisions.map(d => GOV_DIVISION_LABELS[d]),
      channels: GOV_CHANNELS.map(c => c.name),
      permissions: ['Acces total administrateur'],
      deniedDivisions: [],
      deniedPages: [],
      deniedChannels: [],
    };
  }

  const accessibleDivisions = getGovernmentAccessibleDivisions(user);
  const accessibleDivisionLabels = accessibleDivisions.map(d => GOV_DIVISION_LABELS[d]);
  const deniedDivisions = allDivisions.filter(d => !accessibleDivisions.includes(d)).map(d => GOV_DIVISION_LABELS[d]);

  const pages: string[] = ['Tableau de Bord', 'Communication', 'Planning', 'Espaces de Travail'];
  const deniedPages: string[] = [];

  if (hasGovernmentPermission(user, 'create_documents') || hasGovernmentPermission(user, 'edit_documents') || hasGovernmentPermission(user, 'validate_documents')) {
    pages.push('Documents');
  } else {
    pages.push('Documents (lecture seule)');
  }

  if (hasGovernmentPermission(user, 'create_cases') || hasGovernmentPermission(user, 'edit_cases')) {
    pages.push('Dossiers');
  } else {
    pages.push('Dossiers (lecture seule)');
  }

  if (canAccessHRPage(user)) {
    pages.push('Ressources Humaines');
  } else {
    deniedPages.push('Ressources Humaines');
  }

  if (canAccessLogsPage(user)) {
    pages.push('Audit & Logs');
  } else {
    deniedPages.push('Audit & Logs');
  }

  const channels = GOV_CHANNELS.filter(c => canAccessGovernmentChannel(user, c)).map(c => c.name);
  const deniedChannels = GOV_CHANNELS.filter(c => !canAccessGovernmentChannel(user, c)).map(c => c.name);

  return {
    pages,
    workspaces: accessibleDivisionLabels,
    channels,
    permissions: user.permissions,
    deniedDivisions,
    deniedPages,
    deniedChannels,
  };
}
