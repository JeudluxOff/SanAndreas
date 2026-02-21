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
  Bell, 
  Search,
  ChevronRight,
  User,
  Activity,
  Briefcase
} from 'lucide-react';
import { useAuth, Role } from '@/contexts/AuthContext';
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
  roles?: Role[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Tableau de Bord', path: '/intranet', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Bibliothèque Documents', path: '/intranet/documents', icon: <FileText className="w-5 h-5" /> },
  { label: 'Gestion des Dossiers', path: '/intranet/dossiers', icon: <FolderOpen className="w-5 h-5" /> },
  { label: 'Communication Interne', path: '/intranet/communication', icon: <MessageSquare className="w-5 h-5" /> },
  { label: 'Planning & Réunions', path: '/intranet/calendar', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Espaces de Travail', path: '/intranet/workspaces', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Annuaire & RH', path: '/intranet/hr', icon: <Users className="w-5 h-5" />, roles: ['gouverneur', 'vice_gouverneur', 'directeur'] },
  { label: 'Audit & Logs', path: '/intranet/logs', icon: <Activity className="w-5 h-5" />, roles: ['gouverneur', 'auditeur'] },
];

export function IntranetLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const filteredSidebarItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(user.role)
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

          {sidebarOpen && (
            <div className="mt-8 px-3">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Espaces de Services</div>
              <div className="space-y-1">
                <Link to="/intranet/workspace/cabinet" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Cabinet
                </Link>
                <Link to="/intranet/workspace/securite" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Sécurité Publique
                </Link>
                <Link to="/intranet/workspace/justice" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Justice
                </Link>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="mt-auto p-4 border-t border-slate-800 space-y-4">
          <div className={cn("flex items-center gap-3 overflow-hidden", sidebarOpen ? "px-2" : "justify-center")}>
            <Avatar className="w-10 h-10 border-2 border-slate-800 shadow-lg">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
              <AvatarFallback className="bg-primary text-white">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate">{user.name}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 truncate">{user.grade}</span>
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
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
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
                <span className="text-xs font-bold text-slate-900 leading-none">{user.service}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Secteur: {user.role.replace('_', ' ')}</span>
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
