import React, { createContext, useContext, useState, useEffect } from 'react';
import { governmentStore } from '@/lib/government-store';

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
  | 'dossiers:view' | 'dossiers:create' | 'dossiers:edit' | 'dossiers:close' | 'dossiers:assign_members' | 'dossiers:confidential_access'
  | 'communication:view' | 'communication:post' | 'communication:announcements_post'
  | 'planning:view' | 'planning:create' | 'planning:edit'
  | 'directory:view'
  | 'admin:users_manage' | 'admin:roles_manage'
  | 'audit:logs_view' | 'audit:reports_export'
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
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
  canAccessService: (serviceId: ServiceID) => boolean;
  logAction: (action: string, metadata?: any) => void;
  updateStatus: (status: UserStatus) => void;
  emergencyMode: boolean;
  toggleEmergencyMode: () => void;
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  'gouverneur': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:delete', 'documents:submit_review', 'documents:approve_service', 'documents:approve_state', 'documents:sign', 'documents:publish', 'documents:archive',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:close', 'dossiers:assign_members', 'dossiers:confidential_access',
    'communication:view', 'communication:post', 'communication:announcements_post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view', 'admin:users_manage', 'admin:roles_manage',
    'audit:logs_view', 'audit:reports_export'
  ],
  'vice_gouverneur': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:submit_review', 'documents:approve_service', 'documents:approve_state', 'documents:sign',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:close', 'dossiers:assign_members', 'dossiers:confidential_access',
    'communication:view', 'communication:post', 'communication:announcements_post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view', 'audit:logs_view'
  ],
  'secretaire_etat_general': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:submit_review', 'documents:approve_service', 'documents:approve_state',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:assign_members',
    'communication:view', 'communication:post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view', 'audit:reports_export'
  ],
  'secretaire_securite': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:submit_review', 'documents:approve_service',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:close', 'dossiers:assign_members', 'dossiers:confidential_access',
    'communication:view', 'communication:post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view'
  ],
  'press_secretary': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:submit_review', 'documents:publish',
    'dossiers:view',
    'communication:view', 'communication:post', 'communication:announcements_post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view'
  ],
  'secretaire_sante': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:submit_review', 'documents:approve_service',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:close', 'dossiers:assign_members', 'dossiers:confidential_access',
    'communication:view', 'communication:post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view'
  ],
  'secretaire_justice': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:submit_review', 'documents:approve_service',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:close', 'dossiers:assign_members', 'dossiers:confidential_access',
    'communication:view', 'communication:post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view'
  ],
  'secretaire_securite_interieure': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:submit_review', 'documents:approve_service',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:close', 'dossiers:assign_members', 'dossiers:confidential_access',
    'communication:view', 'communication:post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view'
  ],
  'secretaire_tresor_commerce': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:submit_review', 'documents:approve_service',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:close', 'dossiers:assign_members', 'dossiers:confidential_access',
    'communication:view', 'communication:post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view', 'audit:reports_export',
    'lawyer:intranet_access'
  ],
  'avocat': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit',
    'dossiers:view', 'dossiers:create', 'dossiers:edit',
    'communication:view', 'communication:post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view',
    'lawyer:intranet_access'
  ],
  'admin': [
    'intranet:view', 'dashboard:view', 'documents:view', 'documents:create', 'documents:edit', 'documents:delete', 'documents:submit_review', 'documents:approve_service', 'documents:approve_state', 'documents:sign', 'documents:publish', 'documents:archive',
    'dossiers:view', 'dossiers:create', 'dossiers:edit', 'dossiers:close', 'dossiers:assign_members', 'dossiers:confidential_access',
    'communication:view', 'communication:post', 'communication:announcements_post',
    'planning:view', 'planning:create', 'planning:edit',
    'directory:view', 'admin:users_manage', 'admin:roles_manage',
    'audit:logs_view', 'audit:reports_export',
    'lawyer:intranet_access'
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  useEffect(() => {
    return governmentStore.subscribe(() => {
      setEmergencyMode(governmentStore.getEmergencyMode());
    });
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('sa_gov_user');
    const savedEmergency = localStorage.getItem('sa_gov_emergency_mode');

    if (savedEmergency === 'true') {
      setEmergencyMode(true);
    }
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        // Migration: If user object is missing status, set to available
        if (!parsedUser.status) {
          parsedUser.status = 'available';
        }
        // If user object is missing permissions (old session), re-attach them
        if (!parsedUser.permissions) {
          parsedUser.permissions = ROLE_PERMISSIONS[parsedUser.role] || [];
        }
        setUser(parsedUser);
      } catch (e) {
        console.error("Erreur de chargement de la session:", e);
        localStorage.removeItem('sa_gov_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Mock login system based on predefined roles
    if (password === 'admin') {
      const mockUsers: Record<string, Partial<User>> = {
        'governor': {
          role: 'gouverneur',
          service_id: 'CABINET',
          name: 'Arthur Vance',
          service_name: 'Cabinet du Gouverneur',
          grade: 'Gouverneur de San Andreas'
        },
        'lt_governor': {
          role: 'vice_gouverneur',
          service_id: 'CABINET',
          name: 'Elena Rodriguez',
          service_name: 'Cabinet du Gouverneur',
          grade: 'Lieutenant-Gouverneur'
        },
        'sec_etat': {
          role: 'secretaire_etat_general',
          service_id: 'ADMINISTRATION_GENERALE',
          name: 'James Marshall',
          service_name: 'Administration Générale',
          grade: 'Secrétaire d\'État Général'
        },
        'sec_securite': {
          role: 'secretaire_securite',
          service_id: 'SECURITE_PUBLIQUE',
          name: 'Jackson Teller',
          service_name: 'Sécurité Publique',
          grade: 'Secrétaire à la Sécurité'
        },
        'press': {
          role: 'press_secretary',
          service_id: 'COMMUNICATION',
          name: 'Lamar Davis',
          service_name: 'Bureau de Presse',
          grade: 'Press Secretary'
        },
        'sec_sante': {
          role: 'secretaire_sante',
          service_id: 'SANTE_HUMAINS',
          name: 'Julian Frost',
          service_name: 'Santé & Services Humains',
          grade: 'Secrétaire à la Santé'
        },
        'sec_justice': {
          role: 'secretaire_justice',
          service_id: 'JUSTICE',
          name: 'Thomas Vercetti',
          service_name: 'Département de la Justice',
          grade: 'Secrétaire à la Justice'
        },
        'sec_interieure': {
          role: 'secretaire_securite_interieure',
          service_id: 'SECURITE_INTERIEURE',
          name: 'Sarah Connor',
          service_name: 'Sécurité Intérieure',
          grade: 'Secrétaire à la Sécurité Intérieure'
        },
        'sec_tresor': {
          role: 'secretaire_tresor_commerce',
          service_id: 'TRESOR_COMMERCE',
          name: 'Franklin Clinton',
          service_name: 'Trésor & Commerce',
          grade: 'Secrétaire au Trésor'
        },
        'avocat': {
          role: 'avocat',
          service_id: 'JUSTICE',
          name: 'Harvey Specter',
          service_name: 'Barreau de San Andreas',
          grade: 'Avocat à la Cour'
        },
        'admin': {
          role: 'admin',
          service_id: 'CABINET',
          name: 'Administrateur Système',
          service_name: 'Services Techniques',
          grade: 'Administrateur Global'
        },
        'admin_avocat': {
          role: 'admin',
          service_id: 'JUSTICE',
          name: 'Julian Noxwood',
          service_name: 'Noxwood & Partner',
          grade: 'Associé Fondateur & Admin'
        }
      };

      const baseUser = mockUsers[username];
      if (baseUser) {
        const fullUser: User = {
          id: username,
          username,
          role: baseUser.role!,
          service_id: baseUser.service_id!,
          name: baseUser.name!,
          service_name: baseUser.service_name!,
          grade: baseUser.grade!,
          permissions: ROLE_PERMISSIONS[baseUser.role!],
          status: 'available'
        };

        setUser(fullUser);
        localStorage.setItem('sa_gov_user', JSON.stringify(fullUser));
        logAction('Connexion réussie', { username });
        return true;
      }
    }
    return false;
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const canAccessService = (serviceId: ServiceID): boolean => {
    if (!user) return false;
    if (user.role === 'gouverneur' || user.role === 'admin') return true;
    if (user.role === 'vice_gouverneur' && serviceId === 'CABINET') return true;
    return user.service_id === serviceId;
  };

  const logAction = (action: string, metadata?: any) => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      user_id: user?.id || 'system',
      user_name: user?.name || 'Système',
      role: user?.role || 'none',
      service_id: user?.service_id || 'none',
      action,
      metadata
    };
    governmentStore.logAction(newLog);
  };

  const logout = () => {
    logAction('Déconnexion');
    setUser(null);
    localStorage.removeItem('sa_gov_user');
  };

  const updateStatus = (status: UserStatus) => {
    if (!user) return;
    const updatedUser = { ...user, status };
    setUser(updatedUser);
    localStorage.setItem('sa_gov_user', JSON.stringify(updatedUser));
    logAction('Mise à jour statut', { status });
  };

  const toggleEmergencyMode = () => {
    const newMode = !emergencyMode;
    setEmergencyMode(newMode);
    governmentStore.setEmergencyMode(newMode);
    logAction(newMode ? 'Activation Protocole Urgence' : 'Désactivation Protocole Urgence');
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, isLoading, hasPermission, canAccessService,
      logAction, updateStatus, emergencyMode, toggleEmergencyMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
