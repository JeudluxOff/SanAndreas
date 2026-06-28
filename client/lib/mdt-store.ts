import {
  MdtAgent, MdtServiceId, MdtUser, MdtActivity, MdtRole,
  MDT_ROLE_PERMISSIONS, SERVICE_RANKS
} from './mdt-types';

// ─── Seed Agents ──────────────────────────────────────────────────────────────
const SEED_AGENTS: MdtAgent[] = [
  // USSS
  {
    id: 'mdt-usss-admin',
    username: 'usss',
    firstName: 'Mathieu',
    lastName: 'Gerrin',
    matricule: 'E-95',
    callsign: 'E-95',
    service: 'USSS',
    rank: 'Field Agent',
    mdtRole: 'admin',
    permissions: MDT_ROLE_PERMISSIONS['admin'],
    status: 'En service',
    email: 'gerrin@usss.gov',
    joinedAt: '2024-01-15',
  },
  // LSPD
  {
    id: 'mdt-lspd-admin',
    username: 'lspd',
    firstName: 'Marcus',
    lastName: 'Reed',
    matricule: 'L-01',
    callsign: 'L-01',
    service: 'LSPD',
    rank: 'Captain',
    mdtRole: 'admin',
    permissions: MDT_ROLE_PERMISSIONS['admin'],
    status: 'En service',
    email: 'reed@lspd.gov',
    joinedAt: '2023-06-01',
  },
  // LSSD
  {
    id: 'mdt-lssd-admin',
    username: 'lssd',
    firstName: 'Wayne',
    lastName: 'Holden',
    matricule: 'S-01',
    callsign: 'S-01',
    service: 'LSSD',
    rank: 'Lieutenant',
    mdtRole: 'admin',
    permissions: MDT_ROLE_PERMISSIONS['admin'],
    status: 'En service',
    email: 'holden@lssd.gov',
    joinedAt: '2023-03-20',
  },
  // FIB
  {
    id: 'mdt-fib-admin',
    username: 'fib',
    firstName: 'Dana',
    lastName: 'Whitfield',
    matricule: 'F-01',
    callsign: 'F-01',
    service: 'FIB',
    rank: 'Special Agent',
    mdtRole: 'admin',
    permissions: MDT_ROLE_PERMISSIONS['admin'],
    status: 'En service',
    email: 'whitfield@fib.gov',
    joinedAt: '2023-09-10',
  },
  // LSFD
  {
    id: 'mdt-lsfd-admin',
    username: 'lsfd',
    firstName: 'Carlos',
    lastName: 'Ortega',
    matricule: 'FD-01',
    callsign: 'FD-01',
    service: 'LSFD',
    rank: 'Battalion Chief',
    mdtRole: 'admin',
    permissions: MDT_ROLE_PERMISSIONS['admin'],
    status: 'En service',
    email: 'ortega@lsfd.gov',
    joinedAt: '2023-11-05',
  },
  // SAMS
  {
    id: 'mdt-sams-admin',
    username: 'sams',
    firstName: 'Lisa',
    lastName: 'Chen',
    matricule: 'M-01',
    callsign: 'M-01',
    service: 'SAMS',
    rank: 'Senior Paramedic',
    mdtRole: 'admin',
    permissions: MDT_ROLE_PERMISSIONS['admin'],
    status: 'En service',
    email: 'chen@sams.gov',
    joinedAt: '2024-02-01',
  },
  // MDT Admin global
  {
    id: 'mdt-global-admin',
    username: 'mdt_admin',
    firstName: 'System',
    lastName: 'Administrator',
    matricule: 'ADM-01',
    callsign: 'ADM-01',
    service: 'USSS',
    rank: 'Chief',
    mdtRole: 'mdt_admin',
    permissions: MDT_ROLE_PERMISSIONS['mdt_admin'],
    status: 'En service',
    email: 'admin@mdt.gov',
    joinedAt: '2024-01-01',
  },
];

// ─── Seed Activities ──────────────────────────────────────────────────────────
const SEED_ACTIVITIES: MdtActivity[] = [
  { id: 'act-1', type: 'service', title: 'Gerrin Mathieu — Prise de service', service: 'USSS', author: 'Système', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'act-2', type: 'bolo', title: 'BOLO publié — Véhicule Vagrant S/P inconnu', service: 'LSPD', author: 'Reed Marcus', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: 'act-3', type: 'announcement', title: 'Briefing opérationnel 18h00 — Tous services', service: 'USSS', author: 'Gerrin Mathieu', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'act-4', type: 'warrant', title: 'Mandat d\'arrêt validé — Dossier #R-221', service: 'FIB', author: 'Whitfield Dana', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'act-5', type: 'report', title: 'Rapport d\'intervention créé — Fusillade Vinewood', service: 'LSPD', author: 'Reed Marcus', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'act-6', type: 'seizure', title: 'Saisie enregistrée — 2x Glock-17', service: 'LSSD', author: 'Holden Wayne', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
];

interface MdtStoreData {
  agents: MdtAgent[];
  activities: MdtActivity[];
  announcements: { id: string; title: string; content: string; priority: 'normal' | 'high' | 'critical'; service: MdtServiceId; author: string; date: string }[];
}

type Subscriber = () => void;

class MdtStoreManager {
  private data: MdtStoreData;
  private subscribers: Subscriber[] = [];

  constructor() {
    const saved = localStorage.getItem('sa_mdt_store');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        // Ensure seeds are present
        SEED_AGENTS.forEach(seed => {
          if (!this.data.agents.find(a => a.username === seed.username)) {
            this.data.agents.push(seed);
          }
        });
      } catch {
        this.data = this.defaultData();
      }
    } else {
      this.data = this.defaultData();
    }
    this.save();
  }

  private defaultData(): MdtStoreData {
    return {
      agents: [...SEED_AGENTS],
      activities: [...SEED_ACTIVITIES],
      announcements: [
        {
          id: 'ann-1',
          title: 'Réunion de coordination inter-services',
          content: 'Briefing opérationnel ce soir à 18h00. Présence obligatoire pour tous les superviseurs.',
          priority: 'high',
          service: 'USSS',
          author: 'Gerrin Mathieu',
          date: new Date().toISOString(),
        },
        {
          id: 'ann-2',
          title: 'Mise à jour des protocoles d\'intervention',
          content: 'Les nouvelles directives d\'intervention en milieu urbain sont disponibles dans la section Références.',
          priority: 'normal',
          service: 'LSPD',
          author: 'Reed Marcus',
          date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
      ],
    };
  }

  private save() {
    localStorage.setItem('sa_mdt_store', JSON.stringify(this.data));
    this.subscribers.forEach(fn => fn());
  }

  subscribe(fn: Subscriber) {
    this.subscribers.push(fn);
    return () => { this.subscribers = this.subscribers.filter(s => s !== fn); };
  }

  // ─── Agents ────────────────────────────────────────────────────────────────
  getAgentByUsername(username: string): MdtAgent | undefined {
    return this.data.agents.find(a => a.username === username);
  }

  getAgentsByService(service: MdtServiceId): MdtAgent[] {
    return this.data.agents.filter(a => a.service === service);
  }

  getAllAgents(): MdtAgent[] {
    return this.data.agents;
  }

  getActiveAgentsCount(service?: MdtServiceId): number {
    const list = service ? this.getAgentsByService(service) : this.data.agents;
    return list.filter(a => a.status === 'En service').length;
  }

  // ─── Activities ────────────────────────────────────────────────────────────
  getActivities(service?: MdtServiceId): MdtActivity[] {
    const list = service
      ? this.data.activities.filter(a => a.service === service)
      : this.data.activities;
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addActivity(activity: MdtActivity) {
    this.data.activities.unshift(activity);
    if (this.data.activities.length > 100) this.data.activities.pop();
    this.save();
  }

  // ─── Announcements ─────────────────────────────────────────────────────────
  getAnnouncements(service?: MdtServiceId) {
    const list = service
      ? this.data.announcements.filter(a => a.service === service)
      : this.data.announcements;
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export const mdtStore = new MdtStoreManager();
