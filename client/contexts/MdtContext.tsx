import React, { createContext, useContext, useState, useEffect } from 'react';
import { MdtUser, MdtPermission, MdtServiceId, MDT_ROLE_PERMISSIONS } from '@/lib/mdt-types';
import { mdtStore } from '@/lib/mdt-store';

interface MdtContextType {
  mdtUser: MdtUser | null;
  isMdtUser: boolean;
  hasMdtPermission: (perm: MdtPermission) => boolean;
  mdtLogout: () => void;
  updateMdtStatus: (status: MdtUser['status']) => void;
}

const MdtContext = createContext<MdtContextType>({
  mdtUser: null,
  isMdtUser: false,
  hasMdtPermission: () => false,
  mdtLogout: () => {},
  updateMdtStatus: () => {},
});

export function MdtProvider({ children }: { children: React.ReactNode }) {
  const [mdtUser, setMdtUser] = useState<MdtUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sa_mdt_user');
    if (saved) {
      try { setMdtUser(JSON.parse(saved)); } catch { localStorage.removeItem('sa_mdt_user'); }
    }
  }, []);

  const hasMdtPermission = (perm: MdtPermission) => {
    if (!mdtUser) return false;
    return mdtUser.permissions.includes(perm);
  };

  const mdtLogout = () => {
    setMdtUser(null);
    localStorage.removeItem('sa_mdt_user');
  };

  const updateMdtStatus = (status: MdtUser['status']) => {
    if (!mdtUser) return;
    const updated = { ...mdtUser, status };
    setMdtUser(updated);
    localStorage.setItem('sa_mdt_user', JSON.stringify(updated));
  };

  return (
    <MdtContext.Provider value={{ mdtUser, isMdtUser: !!mdtUser, hasMdtPermission, mdtLogout, updateMdtStatus }}>
      {children}
    </MdtContext.Provider>
  );
}

export function useMdt() {
  return useContext(MdtContext);
}

// Helper to build MdtUser from agent data
export function buildMdtUser(username: string): MdtUser | null {
  const agent = mdtStore.getAgentByUsername(username);
  if (!agent) return null;
  return {
    id: agent.id,
    username: agent.username,
    name: `${agent.lastName} ${agent.firstName}`,
    service: agent.service,
    rank: agent.rank,
    callsign: agent.callsign,
    mdtRole: agent.mdtRole,
    permissions: MDT_ROLE_PERMISSIONS[agent.mdtRole],
    status: agent.status === 'Suspendu' ? 'Hors service' : agent.status,
    matricule: agent.matricule,
    avatar: agent.avatar,
  };
}

// MDT usernames that should redirect to /mdt after login
export const MDT_USERNAMES = new Set(['usss', 'lspd', 'lssd', 'fib', 'sams', 'lsfd', 'mdt_admin']);
