import { createContext } from 'react';
import { User, Role, Permission, ServiceID, UserStatus } from './AuthContextTypes';

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
  canAccessService: (serviceId: ServiceID) => boolean;
  logAction: (action: string, metadata?: any) => void;
  updateStatus: (status: UserStatus) => void;
  updateUser: (updates: Partial<User>) => void;
  emergencyMode: boolean;
  toggleEmergencyMode: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
