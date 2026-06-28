import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, FolderOpen, Users, MessageSquare, Calendar, Settings, LogOut, Menu, X, ArrowLeft, Chrome as Home, Bell, Search, ChevronRight, User, Activity, Briefcase, ShieldAlert, CreditCard as Edit2 } from 'lucide-react';
import { useAuth, Role, Permission, ServiceID, UserStatus } from '@/contexts/AuthContext';
import { GovUserAccess, canAccessHRPage, canAccessLogsPage, getGovernmentAccessibleDivisions, isGovernmentAdmin, isGovernmentGovernor } from '@/lib/government-access';
import { GOV_DIVISION_LABELS, GOV_DIVISION_COLORS, GovDivisionId, GOV_DIVISIONS } from '@/lib/government-rbac';
import { useGovernmentStore } from '@/hooks/useGovernmentStore';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: Permission;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Tableau de Bord', path: '/intranet', icon: <LayoutDashboard className="w-5 h-5" />, permission: 'dashboard:view' },
  { label: 'Bibliothèque Documents', path: '/intranet/documents', icon: <FileText className="w-5 h-5" />, permission: 'documents:view' },
  { label: 'Gestion des Dossiers', path: '/intranet/dossiers', icon: <FolderOpen className="w-5 h-5" />, permission: 'dossiers:view' },
  { label: 'Communication Interne', path: '/intranet/communication', icon: <MessageSquare className="w-5 h-5" />, permission: 'communication:view' },
  { label: 'Planning & Réunions', path: '/intranet/calendar', icon: <Calendar className="w-5 h-5" />, permission: 'planning:view' },
  { label: 'Espaces de Travail', path: '/intranet/workspaces', icon: <Briefcase className="w-5 h-5" />, permission: 'intranet:view' },
  { label: 'Annuaire & RH', path: '/intranet/hr', icon: <Users className="w-5 h-5" />, permission: 'directory:view' },
  { label: 'Audit & Logs', path: '/intranet/logs', icon: <Activity className="w-5 h-5" />, permission: 'audit:logs_view' },
];

const workspaceServices: { id: ServiceID, label: string, color: string }[] = [
  { id: 'CABINET', label: 'Cabinet', color: 'bg-blue-500' },
  { id: 'SECURITE_PUBLIQUE', label: 'Sécurité Publique', color: 'bg-emerald-500' },
  { id: 'JUSTICE', label: 'Justice', color: 'bg-amber-500' },
  { id: 'SANTE_HUMAINS', label: 'Santé & Humains', color: 'bg-red-500' },
  { id: 'SECURITE_INTERIEURE', label: 'Sécurité Intérieure', color: 'bg-slate-500' },
  { id: 'TRESOR_COMMERCE', label: 'Trésor & Commerce', color: 'bg-blue-700' },
  { id: 'COMMUNICATION', label: 'Bureau de Presse', color: 'bg-purple-500' },
  { id: 'ADMINISTRATION_GENERALE', label: 'Administration', color: 'bg-slate-700' },
];

export function IntranetLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, hasPermission, canAccessService, updateStatus, updateUser, emergencyMode, toggleEmergencyMode } = useAuth();
  const store = useGovernmentStore();
  const govAccess: GovUserAccess | null = user ? {
    id: user.id,
    rolesTechniques: (user.govRolesTechniques || ['employee']) as any[],
    divisions: (user.govDivisions || ['administration_generale']) as GovDivisionId[],
    permissions: (user.govPermissions || []) as any[],
    status: user.govStatus || 'actif',
  } : null;
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      setNewName(user.name);
      setNewAvatar(user.avatar || '');
    }
  }, [user]);

  React.useEffect(() => {
    return store.subscribe(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1000);
    });
  }, [store]);

  if (!user) return null;

  const handleUpdateProfile = () => {
    if (newName.trim()) {
      updateUser({
        name: newName,
        avatar: newAvatar.trim() || undefined
      });
      setIsProfileDialogOpen(false);
    }
  };

  const statusColors = {
    available: 'bg-emerald-500',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-500'
  };

  const statusLabels = {
    available: 'En service',
    busy: 'Occupé',
    away: 'Absent',
    offline: 'Hors service'
  };

  const filteredSidebarItems = sidebarItems.filter(item => {
    if (!item.permission) return true;
    if (isGovernmentAdmin(govAccess) || isGovernmentGovernor(govAccess)) return true;
    if (item.path === '/intranet/hr') return canAccessHRPage(govAccess);
    if (item.path === '/intranet/logs') return canAccessLogsPage(govAccess);
    return hasPermission(item.permission);
  });

  const accessibleDivisions = getGovernmentAccessibleDivisions(govAccess);
  const visibleWorkspaces = workspaceServices.filter(ws => {
    if (isGovernmentAdmin(govAccess) || isGovernmentGovernor(govAccess)) return true;
    return canAccessService(ws.id);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={cn(
      "min-h-screen flex overflow-hidden font-sans transition-all duration-500",
      emergencyMode ? "bg-red-950/20" : "bg-slate-100"
    )}>
      {/* Emergency Mode Overlay/Border */}
      {emergencyMode && (
        <div className="fixed inset-0 pointer-events-none z-[100] border-[12px] border-red-600 animate-emergency-pulse pointer-events-none" />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "text-slate-300 transition-all duration-300 flex flex-col z-50",
          emergencyMode ? "bg-red-950 border-r border-red-900" : "bg-slate-900",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className={cn(
          "h-16 flex items-center px-4 border-b",
          emergencyMode ? "bg-red-900 border-red-800 shadow-[0_4px_12px_rgba(220,38,38,0.2)]" : "bg-slate-950 border-slate-800"
        )}>
          <Link to="/intranet" className="flex items-center gap-3 overflow-hidden">
            <div className={cn(
              "p-1.5 rounded-md flex-shrink-0 shadow-lg",
              emergencyMode ? "bg-red-600 animate-pulse" : "bg-primary"
            )}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-bold text-white uppercase text-xs tracking-tighter">SAN ANDREAS</span>
                <span className={cn(
                  "text-[10px] uppercase font-semibold tracking-widest",
                  emergencyMode ? "text-red-400" : "text-slate-500"
                )}>GOUVERNEMENT</span>
              </div>
            )}
          </Link>
        </div>

        <ScrollArea className="flex-grow py-4 px-3">
          <nav className="space-y-1">
            {filteredSidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group",
                    isActive
                      ? (emergencyMode ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] font-bold" : "bg-primary text-white shadow-md font-bold")
                      : (emergencyMode ? "hover:bg-red-900/50 hover:text-white" : "hover:bg-slate-800 hover:text-white")
                  )}
                >
                  <div className={cn("flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")}>
                    {item.icon}
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {sidebarOpen && visibleWorkspaces.length > 0 && (
            <div className="mt-8 px-3">
              <div className={cn(
                "text-[10px] font-bold uppercase tracking-widest mb-4",
                emergencyMode ? "text-red-400" : "text-slate-500"
              )}>Espaces de Services</div>
              <div className="space-y-1">
                {visibleWorkspaces.map(ws => (
                  <Link
                    key={ws.id}
                    to={`/intranet/workspace/${ws.id.toLowerCase()}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all",
                      emergencyMode
                        ? "text-red-300 hover:text-white hover:bg-red-900/40"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", ws.color)} />
                    {ws.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className={cn(
          "mt-auto p-4 border-t space-y-4",
          emergencyMode ? "border-red-900 bg-red-950/50" : "border-slate-800"
        )}>
          {emergencyMode && sidebarOpen && (
            <div className="mb-4 p-2 bg-red-600/20 border border-red-600/30 rounded-lg text-center animate-pulse">
               <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">PROTOCOLE URGENCE ACTIF</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-md hover:bg-red-900/20 hover:text-red-400 transition-all text-slate-400",
              !sidebarOpen && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        {/* Emergency Alert Bar */}
        {emergencyMode && (
          <div className="h-10 bg-red-600 flex items-center justify-center gap-8 overflow-hidden whitespace-nowrap z-[60] shadow-lg">
             {Array.from({ length: 10 }).map((_, i) => (
               <div key={i} className="flex items-center gap-4 animate-marquee">
                 <ShieldAlert className="w-4 h-4 text-white" />
                 <span className="text-white font-black uppercase text-[11px] tracking-[0.2em]">ALERTE ROUGE - PROTOCOLE D'URGENCE ACTIF - ÉVACUATION DES CANAUX NON-SÉCURISÉS</span>
               </div>
             ))}
          </div>
        )}

        {/* Header */}
        <header className={cn(
          "h-16 flex items-center justify-between px-6 border-b shadow-sm z-40 transition-colors",
          emergencyMode ? "bg-red-900 border-red-800 text-white" : "bg-white border-slate-200"
        )}>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                "lg:flex",
                emergencyMode ? "text-red-200 hover:text-white hover:bg-red-800" : "text-slate-600"
              )}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div className={cn("h-6 w-px mx-1 hidden md:block", emergencyMode ? "bg-red-800" : "bg-slate-200")} />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className={cn(
                  "h-9 w-9",
                  emergencyMode ? "text-red-300 hover:text-white hover:bg-red-800" : "text-slate-400 hover:text-primary"
                )}
                title="Retour"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Link to="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    emergencyMode ? "text-red-300 hover:text-white hover:bg-red-800" : "text-slate-400 hover:text-primary"
                  )}
                  title="Accueil Public"
                >
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className={cn(
              "hidden md:flex items-center gap-2 text-sm font-medium ml-2",
              emergencyMode ? "text-red-400" : "text-slate-500"
            )}>
              <span>Intranet</span>
              <ChevronRight className={cn("w-4 h-4", emergencyMode ? "text-red-800" : "text-slate-300")} />
              <span className={cn(
                "font-bold capitalize",
                emergencyMode ? "text-white" : "text-slate-900"
              )}>
                {location.pathname === '/intranet' ? 'Tableau de Bord' : location.pathname.split('/').pop()?.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex relative">
              <Search className={cn("absolute left-3 top-2.5 h-4 w-4", emergencyMode ? "text-red-400" : "text-slate-400")} />
              <input
                type="text"
                placeholder="Rechercher document, dossier..."
                className={cn(
                  "pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 w-64 md:w-80 transition-colors",
                  emergencyMode
                    ? "bg-red-950 border-red-800 text-white placeholder-red-700 focus:ring-red-500/20 focus:border-red-600"
                    : "bg-slate-50 border-slate-200 focus:ring-primary/20 focus:border-primary"
                )}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className={cn(
                "relative",
                emergencyMode ? "text-red-200 hover:text-white hover:bg-red-800" : "text-slate-600"
              )}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              <div className={cn("h-8 w-px mx-1 hidden sm:block", emergencyMode ? "bg-red-800" : "bg-slate-200")} />
              <div className="hidden sm:flex flex-col text-right">
                <span className={cn("text-xs font-bold leading-none", emergencyMode ? "text-white" : "text-slate-900")}>{user.service_name}</span>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <RefreshCw className={cn("w-2.5 h-2.5", isSyncing ? "animate-spin text-primary" : "text-slate-400")} />
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter",
                    emergencyMode ? "text-red-400" : "text-slate-500"
                  )}>Secteur: {user.role.replace(/_/g, ' ')}</span>
                </div>
              </div>
              <Badge variant="outline" className={cn(
                "font-bold ml-2 transition-colors",
                emergencyMode ? "bg-red-600 text-white border-none animate-pulse" : "bg-primary/5 text-primary border-primary/20"
              )}>
                {emergencyMode ? "URGENCE" : "LIVE"}
              </Badge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className={cn(
          "flex-grow overflow-auto p-6 md:p-8 transition-colors",
          emergencyMode ? "bg-red-950/10" : "bg-slate-100"
        )}>
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating User Profile Button (Centered in Sidebar) */}
      <div className={cn(
        "fixed bottom-10 left-0 flex justify-center z-[60] transition-all duration-300 pointer-events-none",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="pointer-events-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-4 p-2 rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all group scale-110 md:scale-125",
                emergencyMode ? "bg-red-900 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
              )}>
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-white/10 border border-white/5">
                    <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                    <AvatarFallback className="bg-primary text-white font-black">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-slate-900 rounded-full",
                    statusColors[user.status || 'available']
                  )} />
                </div>
                {sidebarOpen && (
                  <div className="text-left pr-4">
                    <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">{user.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[7px] font-bold text-white/40 uppercase tracking-[0.2em]">
                        {statusLabels[user.status || 'available']}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="w-56 bg-slate-950 text-white border-slate-800 p-2 rounded-xl mb-4 shadow-2xl">
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 py-2">Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                onClick={() => setIsProfileDialogOpen(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <Edit2 className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Modifier Profil</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3 py-2">Changer Statut</DropdownMenuLabel>
              {Object.entries(statusLabels).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => updateStatus(key as UserStatus)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <div className={cn("w-2 h-2 rounded-full", statusColors[key as UserStatus])} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">Modifier mon profil</DialogTitle>
            <DialogDescription className="italic font-medium">
              Modifiez votre identité officielle sur l'intranet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-xs font-black uppercase text-slate-500">
                URL Photo de Profil
              </Label>
              <div className="flex gap-4 items-center">
                <Avatar className="h-12 w-12 border border-slate-200">
                  <AvatarImage src={newAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
                  <AvatarFallback>{newName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Input
                  id="avatar"
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                  className="flex-grow font-bold"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-black uppercase text-slate-500">
                Nom Complet
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="font-bold"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)} className="font-bold uppercase text-[10px]">Annuler</Button>
            <Button onClick={handleUpdateProfile} className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold uppercase text-[10px]">Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
