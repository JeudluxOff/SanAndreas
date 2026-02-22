import React from 'react';
import { 
  Scale, 
  Briefcase, 
  FileText, 
  Users, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  ShieldCheck, 
  Activity, 
  Settings,
  Bell,
  Search,
  Plus,
  Lock,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const ROLE_COLORS = {
  'Associé': 'bg-amber-600 text-white',
  'Avocat': 'bg-blue-600 text-white',
  'Juriste': 'bg-slate-600 text-white',
  'Secrétaire': 'bg-emerald-600 text-white',
  'Comptable': 'bg-indigo-600 text-white',
  'Stagiaire': 'bg-slate-400 text-white',
  'Auditeur': 'bg-red-600 text-white'
};

const MENU_ITEMS = [
  { icon: <Activity className="w-4 h-4" />, label: "Tableau de Bord", path: "/cabinet/intranet" },
  { icon: <Briefcase className="w-4 h-4" />, label: "Dossiers", path: "/cabinet/intranet/dossiers" },
  { icon: <FileText className="w-4 h-4" />, label: "Documents", path: "/cabinet/intranet/documents" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Preuves (Vault)", path: "/cabinet/intranet/evidence" },
  { icon: <Calendar className="w-4 h-4" />, label: "Planning", path: "/cabinet/intranet/planning" },
  { icon: <CreditCard className="w-4 h-4" />, label: "Facturation", path: "/cabinet/intranet/billing" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "Communication", path: "/cabinet/intranet/communication" },
  { icon: <Users className="w-4 h-4" />, label: "Clients", path: "/cabinet/intranet/clients" },
  { icon: <Lock className="w-4 h-4" />, label: "Audit & Logs", path: "/cabinet/intranet/audit" },
  { icon: <Settings className="w-4 h-4" />, label: "Administration", path: "/cabinet/intranet/admin" }
];

export const Sidebar = ({ activeRole }: { activeRole: string }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#0a0f18] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-white/5 z-50">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#c1a461] rounded shadow-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-[0.2em] uppercase">Harrington <span className="text-[#c1a461]">&</span> Cole</h1>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Intranet Legal</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-2 py-8">
        {MENU_ITEMS.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={idx}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left",
                isActive
                  ? "text-[#c1a461] bg-[#c1a461]/10 shadow-inner"
                  : "text-white/40 hover:text-[#c1a461] hover:bg-white/5"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-6 bg-white/5 m-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-[#c1a461]/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Julian`} />
            <AvatarFallback>JH</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black truncate">Julian Harrington</p>
            <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0 mt-1", ROLE_COLORS[activeRole as keyof typeof ROLE_COLORS])}>
              {activeRole}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Header = ({ activeRole, onRoleChange }: { activeRole: string, onRoleChange: (val: string) => void }) => (
  <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-8">
      <Link to="/cabinet">
        <Button variant="ghost" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#c1a461] hover:bg-[#c1a461]/5 gap-2 group px-0">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="hidden md:inline">Sortir du Cabinet</span>
        </Button>
      </Link>

      <div className="h-6 w-px bg-slate-100" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="RECHERCHER UN DOSSIER, UN CLIENT, UN DOCUMENT..."
          className="w-96 h-10 bg-slate-50 border-none rounded-lg pl-10 text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-400 focus:ring-2 ring-primary/5 transition-all"
        />
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3 mr-4">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Simulation Rôle:</span>
        <Select value={activeRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-32 h-8 text-[9px] font-black uppercase border-none bg-slate-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(ROLE_COLORS).map(role => (
              <SelectItem key={role} value={role} className="text-[9px] font-black uppercase">{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>
      <div className="h-8 w-px bg-slate-100" />
      <Button className="bg-[#0a0f18] text-white font-black uppercase text-[10px] tracking-widest h-10 px-6 gap-2">
        <Plus className="w-4 h-4" /> Nouveau Dossier
      </Button>
    </div>
  </header>
);

export default function LegalIntranetLayout({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = React.useState('Associé');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeRole={activeRole} />
      <div className="flex-grow pl-64 flex flex-col min-h-screen">
        <Header activeRole={activeRole} onRoleChange={setActiveRole} />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
