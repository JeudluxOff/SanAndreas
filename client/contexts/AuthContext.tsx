import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 
  | 'gouverneur' 
  | 'vice_gouverneur' 
  | 'secretaire_securite' 
  | 'secretaire_justice' 
  | 'secretaire_economie' 
  | 'secretaire_sante' 
  | 'directeur' 
  | 'employe' 
  | 'auditeur';

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
  service: string;
  grade: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('sa_gov_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Mock login - in a real app this would be an API call
    // For demo purposes, we accept any username and password "admin"
    if (password === 'admin') {
      const mockUser: User = {
        id: '1',
        username,
        role: username === 'governor' ? 'gouverneur' : 'employe',
        name: username === 'governor' ? 'Arthur Vance' : 'John Doe',
        service: username === 'governor' ? 'Cabinet du Gouverneur' : 'Services Généraux',
        grade: username === 'governor' ? 'Gouverneur' : 'Agent de Liaison',
      };
      
      // Customize mock user based on username for easier testing
      if (username === 'securite') {
        mockUser.role = 'secretaire_securite';
        mockUser.name = 'Jackson Teller';
        mockUser.service = 'Sécurité Publique';
        mockUser.grade = 'Secrétaire';
      } else if (username === 'justice') {
        mockUser.role = 'secretaire_justice';
        mockUser.name = 'Thomas Vercetti';
        mockUser.service = 'Justice';
        mockUser.grade = 'Secrétaire';
      }

      setUser(mockUser);
      localStorage.setItem('sa_gov_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sa_gov_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
