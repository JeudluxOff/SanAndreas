import React, { createContext, useContext } from 'react';
import {
  Scale,
  Briefcase,
  Archive,
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
  X,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { legalStore } from '@/lib/legal-store';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// RBAC Context for Simulation
type LegalRole = 'Associé' | 'Avocat' | 'Juriste' | 'Secrétaire' | 'Comptable' | 'Stagiaire' | 'Auditeur';

interface LegalRBACContextType {
  activeRole: LegalRole;
  setActiveRole: (role: LegalRole) => void;
  isAssocié: boolean;
  canSign: boolean;
  canBill: boolean;
  canAudit: boolean;
}

const LegalRBACContext = createContext<LegalRBACContextType | undefined>(undefined);

export const useLegalRBAC = () => {
  const context = useContext(LegalRBACContext);
  if (!context) throw new Error('useLegalRBAC must be used within a LegalIntranetLayout');
  return context;
};

const ROLE_COLORS: Record<LegalRole, string> = {
  'Associé': 'bg-amber-600 text-white',
  'Avocat': 'bg-blue-600 text-white',
  'Juriste': 'bg-slate-600 text-white',
  'Secrétaire': 'bg-emerald-600 text-white',
  'Comptable': 'bg-indigo-600 text-white',
  'Stagiaire': 'bg-slate-400 text-white',
  'Auditeur': 'bg-red-600 text-white'
};

const MENU_ITEMS = [
  { icon: <Activity className="w-4 h-4" />, label: "Tableau de Bord", path: "/cabinet/intranet", roles: ['Associé', 'Avocat', 'Juriste', 'Secrétaire', 'Comptable', 'Stagiaire', 'Auditeur'] },
  { icon: <Briefcase className="w-4 h-4" />, label: "Dossiers", path: "/cabinet/intranet/dossiers", roles: ['Associé', 'Avocat', 'Juriste', 'Stagiaire'] },
  { icon: <Archive className="w-4 h-4" />, label: "Archives", path: "/cabinet/intranet/archives", roles: ['Associé', 'Avocat', 'Juriste', 'Secrétaire', 'Auditeur'] },
  { icon: <FileText className="w-4 h-4" />, label: "Documents", path: "/cabinet/intranet/documents", roles: ['Associé', 'Avocat', 'Juriste', 'Stagiaire'] },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Preuves (Vault)", path: "/cabinet/intranet/evidence", roles: ['Associé', 'Avocat'] },
  { icon: <Zap className="w-4 h-4" />, label: "Tâches", path: "/cabinet/intranet/tasks", roles: ['Associé', 'Avocat', 'Juriste', 'Secrétaire'] },
  { icon: <Calendar className="w-4 h-4" />, label: "Planning", path: "/cabinet/intranet/planning", roles: ['Associé', 'Avocat', 'Juriste', 'Secrétaire'] },
  { icon: <CreditCard className="w-4 h-4" />, label: "Facturation", path: "/cabinet/intranet/billing", roles: ['Associé', 'Comptable'] },
  { icon: <MessageSquare className="w-4 h-4" />, label: "Communication", path: "/cabinet/intranet/communication", roles: ['Associé', 'Avocat', 'Secrétaire'] },
  { icon: <Users className="w-4 h-4" />, label: "Clients", path: "/cabinet/intranet/clients", roles: ['Associé', 'Avocat', 'Secrétaire'] },
  { icon: <Lock className="w-4 h-4" />, label: "Audit & Logs", path: "/cabinet/intranet/audit", roles: ['Associé', 'Auditeur'] },
  { icon: <Settings className="w-4 h-4" />, label: "Administration", path: "/cabinet/intranet/admin", roles: ['Associé'] }
];

export const Sidebar = () => {
  const { activeRole } = useLegalRBAC();
  const { user } = useAuth();
  const location = useLocation();

  const filteredItems = MENU_ITEMS.filter(item =>
    !item.roles || item.roles.includes(activeRole)
  );

  return (
    <div className="w-64 bg-[#0a0f18] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-white/5 z-50">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#c1a461] rounded shadow-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-[0.2em] uppercase">Noxwood <span className="text-[#c1a461]">&</span> Partner</h1>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Intranet Legal</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-2 py-8">
        {filteredItems.map((item, idx) => {
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
    </div>
  );
};

export const Header = () => {
  const { activeRole, setActiveRole } = useLegalRBAC();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = React.useState(false);

  React.useEffect(() => {
    return legalStore.subscribe(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1000);
    });
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/cabinet">
          <Button variant="ghost" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#c1a461] hover:bg-[#c1a461]/5 gap-2 group px-0">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden md:inline">Sortir du Cabinet</span>
          </Button>
        </Link>

        <div className="h-6 w-px bg-slate-100" />

        <div className="flex items-center gap-2">
          <RefreshCw className={cn("w-3 h-3 text-slate-300", isSyncing && "animate-spin text-[#c1a461]")} />
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
            {isSyncing ? "Synchronisation..." : "Données synchronisées"}
          </span>
        </div>

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
        {user?.role === 'admin' && (
          <div className="flex items-center gap-3 mr-4">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Simulation Rôle:</span>
            <Select value={activeRole} onValueChange={(val) => setActiveRole(val as LegalRole)}>
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
        )}

        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="h-8 w-px bg-slate-100" />
        <Button
          onClick={() => navigate('/cabinet/intranet/dossiers?action=new')}
          className="bg-[#0a0f18] text-white font-black uppercase text-[10px] tracking-widest h-10 px-6 gap-2"
        >
          <Plus className="w-4 h-4" /> Nouveau Dossier
        </Button>
      </div>
    </header>
  );
};

export default function LegalIntranetLayout({ children }: { children: React.ReactNode }) {
  const { user, updateUser, logout } = useAuth();
  const [activeRole, setActiveRole] = React.useState<LegalRole>(() => {
    if (user?.role === 'admin') return 'Associé';
    if (user?.role === 'avocat') return 'Avocat';
    return 'Juriste';
  });

  const [isProfileDialogOpen, setIsProfileDialogOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
  }, [user]);

  const handleUpdateName = () => {
    if (newName.trim()) {
      updateUser({ name: newName });
      setIsProfileDialogOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/cabinet/login');
  };

  const value = {
    activeRole,
    setActiveRole,
    isAssocié: activeRole === 'Associé',
    canSign: ['Associé', 'Avocat'].includes(activeRole),
    canBill: ['Associé', 'Comptable'].includes(activeRole),
    canAudit: ['Associé', 'Auditeur'].includes(activeRole)
  };

  return (
    <LegalRBACContext.Provider value={value}>
      <div className="min-h-screen bg-slate-50 flex relative">
        <Sidebar />
        <div className="flex-grow pl-64 flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </div>

        {/* Floating User Profile Button (Bottom Left) */}
        <div className="fixed bottom-8 left-8 z-[60]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-4 p-2 bg-[#0a0f18] text-white rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-900 transition-all group scale-110 md:scale-125 origin-bottom-left">
                <Avatar className="h-10 w-10 ring-2 ring-[#c1a461]/20 border border-white/5">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Julian'}`} />
                  <AvatarFallback className="bg-slate-800 text-white font-black">{user?.name?.substring(0, 2).toUpperCase() || 'JN'}</AvatarFallback>
                </Avatar>
                <div className="text-left pr-4">
                  <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">{user?.name || 'Julian Noxwood'}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-bold text-white/40 uppercase tracking-[0.2em]">En Ligne</span>
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-[#0a0f18] text-white border-white/10 p-2 rounded-xl mb-4 shadow-2xl">
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-white/40 px-3 py-2">Compte Utilisateur</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                onClick={() => setIsProfileDialogOpen(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#c1a461]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Modifier Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-[#0a0f18] text-white border-white/5">
            <DialogHeader>
              <DialogTitle className="uppercase font-black tracking-tight text-xl">Profil Officiel</DialogTitle>
              <DialogDescription className="italic font-medium text-white/40 text-xs">
                Modifiez votre identité pour les documents et l'annuaire du cabinet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-white/40">
                  Nom & Prénom
                </Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white font-black uppercase placeholder:text-white/10"
                  placeholder="EX: JULIAN NOXWOOD"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsProfileDialogOpen(false)} className="text-white/40 font-black uppercase text-[10px]">Annuler</Button>
              <Button onClick={handleUpdateName} className="bg-[#c1a461] hover:bg-[#d1b471] text-white font-black uppercase text-[10px] px-8">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LegalRBACContext.Provider>
  );
}
