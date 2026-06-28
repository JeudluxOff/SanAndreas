import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMdt } from '@/contexts/MdtContext';
import { MDT_SERVICES } from '@/lib/mdt-types';
import { Monitor, Radio, Car, MapPin, Users, User, Truck, Building2, Crosshair, FileText, Banknote, Search, Flame, Scroll, FlaskConical, Package, CircleParking as ParkingCircle, CircleAlert as AlertCircle, Shield, Camera, Megaphone, Link2, ClipboardList, BookOpen, Clock, Settings, LogOut, Bell, ChevronRight, Menu, X, Chrome as Home, Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  perm?: string;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    section: 'Général',
    items: [
      { label: 'Bureau', path: '/mdt', icon: <Home className="w-4 h-4" /> },
      { label: 'Dispatch', path: '/mdt/dispatch', icon: <Radio className="w-4 h-4" /> },
      { label: 'Unités', path: '/mdt/units', icon: <Car className="w-4 h-4" /> },
      { label: 'Quartiers chauds', path: '/mdt/hotspots', icon: <MapPin className="w-4 h-4" /> },
      { label: 'Effectifs', path: '/mdt/effectifs', icon: <Users className="w-4 h-4" /> },
    ],
  },
  {
    section: 'Personnes & Biens',
    items: [
      { label: 'Citoyens', path: '/mdt/citizens', icon: <User className="w-4 h-4" /> },
      { label: 'Véhicules', path: '/mdt/vehicles', icon: <Truck className="w-4 h-4" /> },
      { label: 'Propriétés', path: '/mdt/properties', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Registre d\'armes', path: '/mdt/weapons', icon: <Crosshair className="w-4 h-4" /> },
    ],
  },
  {
    section: 'Opérations',
    items: [
      { label: 'Rapports', path: '/mdt/reports', icon: <FileText className="w-4 h-4" /> },
      { label: 'Amendes', path: '/mdt/fines', icon: <Banknote className="w-4 h-4" /> },
      { label: 'Enquêtes', path: '/mdt/investigations', icon: <Search className="w-4 h-4" /> },
      { label: 'Rapports fusillade', path: '/mdt/shooting-reports', icon: <Flame className="w-4 h-4" /> },
      { label: 'Mandats', path: '/mdt/warrants', icon: <Scroll className="w-4 h-4" /> },
      { label: 'Balistique', path: '/mdt/ballistics', icon: <Siren className="w-4 h-4" /> },
      { label: 'Laboratoire', path: '/mdt/lab', icon: <FlaskConical className="w-4 h-4" /> },
      { label: 'Saisies', path: '/mdt/seizures', icon: <Package className="w-4 h-4" /> },
      { label: 'Saisies véhicule', path: '/mdt/vehicle-seizures', icon: <ParkingCircle className="w-4 h-4" /> },
      { label: 'BOLO', path: '/mdt/bolo', icon: <AlertCircle className="w-4 h-4" /> },
      { label: 'Gangs', path: '/mdt/gangs', icon: <Shield className="w-4 h-4" /> },
      { label: 'Photo-preuve', path: '/mdt/evidence', icon: <Camera className="w-4 h-4" /> },
      { label: 'Annonces', path: '/mdt/announcements', icon: <Megaphone className="w-4 h-4" /> },
      { label: 'Bracelets', path: '/mdt/bracelets', icon: <Link2 className="w-4 h-4" /> },
      { label: 'Plaintes', path: '/mdt/complaints', icon: <ClipboardList className="w-4 h-4" /> },
      { label: 'Dépositions', path: '/mdt/depositions', icon: <BookOpen className="w-4 h-4" /> },
    ],
  },
  {
    section: 'Références',
    items: [
      { label: 'Code Pénal', path: '/mdt/penal-code', icon: <BookOpen className="w-4 h-4" /> },
      { label: 'Heures de service', path: '/mdt/service-hours', icon: <Clock className="w-4 h-4" /> },
    ],
  },
];

interface MdtLayoutProps {
  children: React.ReactNode;
}

export function MdtLayout({ children }: MdtLayoutProps) {
  const { mdtUser, mdtLogout, updateMdtStatus } = useMdt();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const service = mdtUser?.service ? MDT_SERVICES[mdtUser.service] : MDT_SERVICES.USSS;
  const accentColor = service.color;

  const handleLogout = () => {
    mdtLogout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/mdt') return location.pathname === '/mdt';
    return location.pathname.startsWith(path);
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0B0F1A] border-r border-[#1F2937]">
      {/* Service Logo */}
      <div className="p-4 border-b border-[#1F2937] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs"
            style={{ backgroundColor: accentColor }}
          >
            {mdtUser?.service || 'MDT'}
          </div>
          <div>
            <p className="text-white font-black text-xs uppercase tracking-widest">{mdtUser?.service || 'MDT'}</p>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Mobile Data Terminal</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
        {NAV.map((section) => (
          <div key={section.section} className="mb-2">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 px-3 py-2">
              {section.section}
            </p>
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                  isActive(item.path)
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
                style={isActive(item.path) ? { backgroundColor: `${accentColor}20`, color: accentColor } : {}}
              >
                <span className={isActive(item.path) ? '' : 'opacity-60'}>{item.icon}</span>
                <span className="uppercase tracking-wider">{item.label}</span>
                {isActive(item.path) && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Settings at bottom */}
      <div className="border-t border-[#1F2937] p-2">
        <Link
          to="/mdt/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all",
            isActive('/mdt/settings') ? "text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
          )}
          style={isActive('/mdt/settings') ? { backgroundColor: `${accentColor}20`, color: accentColor } : {}}
        >
          <Settings className="w-4 h-4 opacity-60" />
          <span className="uppercase tracking-wider">Paramètres</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#080A0F] text-white overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-[#1F2937] bg-[#0B0F1A] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Service name */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                {service.label}
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white border border-[#1F2937]">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    mdtUser?.status === 'En service' ? "bg-emerald-500" :
                    mdtUser?.status === 'En pause' ? "bg-amber-500" :
                    "bg-slate-500"
                  )} />
                  <span className="hidden sm:inline">{mdtUser?.status || 'Hors service'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#111827] border-[#1F2937] text-white font-bold text-xs uppercase tracking-widest">
                <DropdownMenuItem onClick={() => updateMdtStatus('En service')} className="gap-2 hover:bg-white/10 focus:bg-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> En service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateMdtStatus('En pause')} className="gap-2 hover:bg-white/10 focus:bg-white/10">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> En pause
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateMdtStatus('Hors service')} className="gap-2 hover:bg-white/10 focus:bg-white/10">
                  <div className="w-2 h-2 rounded-full bg-slate-500" /> Hors service
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white border border-[#1F2937]">
              <Bell className="w-4 h-4" />
            </Button>

            {/* Agent profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all border border-[#1F2937]">
                  <Avatar className="h-7 w-7 border border-slate-700">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mdtUser?.username}`} />
                    <AvatarFallback className="bg-slate-700 text-[10px]">{mdtUser?.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-[10px] font-black text-white uppercase tracking-tight">{mdtUser?.name}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{mdtUser?.rank} · {mdtUser?.service}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#111827] border-[#1F2937] text-white min-w-48">
                <div className="px-3 py-2 border-b border-[#1F2937]">
                  <p className="text-xs font-black uppercase tracking-widest">{mdtUser?.name}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{mdtUser?.matricule} · {mdtUser?.rank}</p>
                </div>
                <DropdownMenuSeparator className="bg-[#1F2937]" />
                <DropdownMenuItem
                  className="gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-white/10 focus:bg-white/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
