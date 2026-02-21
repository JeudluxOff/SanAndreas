import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users, 
  MessageSquare, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ArrowLeft,
  Home,
  Bell,
  Search,
  ChevronRight,
  User,
  Activity,
  Briefcase
} from 'lucide-react';
import { useAuth, Role, Permission, ServiceID, UserStatus } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
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
  const { user, logout, hasPermission, canAccessService, updateStatus } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

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

  const filteredSidebarItems = sidebarItems.filter(item =>
    !item.permission || hasPermission(item.permission)
  );

  const visibleWorkspaces = workspaceServices.filter(ws =>
    canAccessService(ws.id)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-4 bg-slate-950 border-b border-slate-800">
          <Link to="/intranet" className="flex items-center gap-3 overflow-hidden">
            <div className="bg-primary p-1.5 rounded-md flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-bold text-white uppercase text-xs tracking-tighter">SAN ANDREAS</span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-widest">GOUVERNEMENT</span>
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
                      ? "bg-primary text-white shadow-md font-bold" 
                      : "hover:bg-slate-800 hover:text-white"
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
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Espaces de Services</div>
              <div className="space-y-1">
                {visibleWorkspaces.map(ws => (
                  <Link
                    key={ws.id}
                    to={`/intranet/workspace/${ws.id.toLowerCase()}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all"
                  >
                    <div className={cn("w-2 h-2 rounded-full", ws.color)} />
                    {ws.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="mt-auto p-4 border-t border-slate-800 space-y-4">
          <div className={cn("flex items-center gap-3 overflow-hidden", sidebarOpen ? "px-2" : "justify-center")}>
            <div className="relative flex-shrink-0">
              <Avatar className="w-10 h-10 border-2 border-slate-800 shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback className="bg-primary text-white">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-slate-900 rounded-full",
                statusColors[user.status || 'available']
              )} />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0 flex-grow">
                <span className="text-sm font-bold text-white truncate">{user.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 hover:text-white transition-colors">
                      {statusLabels[user.status || 'available']}
                      <ChevronRight className="w-2.5 h-2.5 rotate-90" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40 font-bold text-[10px] uppercase tracking-widest">
                    <DropdownMenuLabel>Changer Statut</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => updateStatus('available')}>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> En service
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => updateStatus('busy')}>
                      <div className="w-2 h-2 rounded-full bg-red-500" /> Occupé
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => updateStatus('away')}>
                      <div className="w-2 h-2 rounded-full bg-amber-500" /> Absent
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => updateStatus('offline')}>
                      <div className="w-2 h-2 rounded-full bg-slate-500" /> Hors service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
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
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 lg:flex"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-slate-400 hover:text-primary h-9 w-9"
                title="Retour"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Link to="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-primary h-9 w-9"
                  title="Accueil Public"
                >
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium ml-2">
              <span>Intranet</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="text-slate-900 font-bold capitalize">
                {location.pathname === '/intranet' ? 'Tableau de Bord' : location.pathname.split('/').pop()?.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher document, dossier..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 md:w-80"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative text-slate-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-none">{user.service_name}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Secteur: {user.role.replace(/_/g, ' ')}</span>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold ml-2">
                LIVE
              </Badge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow overflow-auto bg-slate-100 p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
