import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMdt } from '@/contexts/MdtContext';
import { useMdtStore } from '@/hooks/useMdtStore';
import { MDT_SERVICES } from '@/lib/mdt-types';
import { FileText, Search, Scroll, Package, CircleAlert as AlertCircle, StickyNote, Archive, Plus, CirclePlus as PlusCircle, ClipboardList, BookOpen, Car, User, Radio, Clock, Shield, Users, Siren, FlaskConical, Banknote, CircleCheck as CheckCircle2, ChevronRight, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ACTIVITY_ICONS = {
  report: <FileText className="w-3.5 h-3.5" />,
  warrant: <Scroll className="w-3.5 h-3.5" />,
  bolo: <AlertCircle className="w-3.5 h-3.5" />,
  seizure: <Package className="w-3.5 h-3.5" />,
  fine: <Banknote className="w-3.5 h-3.5" />,
  announcement: <Siren className="w-3.5 h-3.5" />,
  service: <CheckCircle2 className="w-3.5 h-3.5" />,
};

const ACTIVITY_COLORS = {
  report: 'text-blue-400',
  warrant: 'text-amber-400',
  bolo: 'text-red-400',
  seizure: 'text-purple-400',
  fine: 'text-emerald-400',
  announcement: 'text-orange-400',
  service: 'text-slate-400',
};

const PRIORITY_COLORS = {
  normal: 'border-slate-700 text-slate-400',
  high: 'border-amber-500/40 text-amber-400',
  critical: 'border-red-500/40 text-red-400',
};

export default function MdtBureau() {
  const { mdtUser, hasMdtPermission } = useMdt();
  const store = useMdtStore();
  const navigate = useNavigate();

  if (!mdtUser) return null;

  const service = MDT_SERVICES[mdtUser.service];
  const accentColor = service.color;

  const activities = store.getActivities(
    mdtUser.mdtRole === 'mdt_admin' ? undefined : mdtUser.service
  ).slice(0, 8);

  const announcements = store.getAnnouncements(
    mdtUser.mdtRole === 'mdt_admin' ? undefined : mdtUser.service
  );

  const activeAgents = store.getActiveAgentsCount(
    mdtUser.mdtRole === 'mdt_admin' ? undefined : mdtUser.service
  );

  const isSams = mdtUser.service === 'SAMS';

  // ─── Folders ────────────────────────────────────────────────────────────────
  const folders = [
    { label: 'Rapports', icon: <FileText className="w-6 h-6" />, path: '/mdt/reports', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Enquêtes', icon: <Search className="w-6 h-6" />, path: '/mdt/investigations', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Mandats', icon: <Scroll className="w-6 h-6" />, path: '/mdt/warrants', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'BOLO', icon: <AlertCircle className="w-6 h-6" />, path: '/mdt/bolo', color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Saisies', icon: <Package className="w-6 h-6" />, path: '/mdt/seizures', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Dépositions', icon: <BookOpen className="w-6 h-6" />, path: '/mdt/depositions', color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'Annonces', icon: <Siren className="w-6 h-6" />, path: '/mdt/announcements', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Archives', icon: <Archive className="w-6 h-6" />, path: '/mdt/reports', color: 'text-slate-400', bg: 'bg-slate-500/10' },
  ];

  // ─── Shortcuts ──────────────────────────────────────────────────────────────
  const shortcuts = [
    { label: 'Nouveau Rapport', icon: <Plus className="w-4 h-4" />, path: '/mdt/reports', perm: 'create_reports' as const },
    { label: 'Nouvelle Enquête', icon: <PlusCircle className="w-4 h-4" />, path: '/mdt/investigations', perm: 'create_investigations' as const },
    { label: 'Nouveau BOLO', icon: <AlertCircle className="w-4 h-4" />, path: '/mdt/bolo', perm: 'create_bolo' as const },
    { label: 'Créer Mandat', icon: <Scroll className="w-4 h-4" />, path: '/mdt/warrants', perm: 'create_warrants' as const },
    { label: 'Ajouter Saisie', icon: <Package className="w-4 h-4" />, path: '/mdt/seizures', perm: 'create_seizures' as const },
    { label: 'Consulter Citoyen', icon: <User className="w-4 h-4" />, path: '/mdt/citizens', perm: 'view_citizens' as const },
    { label: 'Consulter Véhicule', icon: <Car className="w-4 h-4" />, path: '/mdt/vehicles', perm: 'view_vehicles' as const },
  ].filter(s => hasMdtPermission(s.perm));

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const stats = [
    { label: 'Unités en service', value: activeAgents.toString(), icon: <Radio className="w-4 h-4" />, color: 'text-emerald-400' },
    { label: 'Rapports du jour', value: '—', icon: <FileText className="w-4 h-4" />, color: 'text-blue-400' },
    { label: 'Enquêtes ouvertes', value: '—', icon: <Search className="w-4 h-4" />, color: 'text-purple-400' },
    { label: 'BOLO actifs', value: '—', icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-400' },
    { label: 'Mandats actifs', value: '—', icon: <Scroll className="w-4 h-4" />, color: 'text-amber-400' },
    { label: 'Agents connectés', value: activeAgents.toString(), icon: <Users className="w-4 h-4" />, color: 'text-slate-400' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* SAMS Banner */}
      {isSams && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
          <FlaskConical className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Module SAMS en cours de configuration — Les modules médicaux avancés seront disponibles prochainement.
          </p>
        </div>
      )}

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Bureau MDT
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
            <span style={{ color: accentColor }}>{mdtUser.service}</span>
            {' · '}
            <span>{mdtUser.rank}</span>
            {' · '}
            <span>{mdtUser.matricule}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-widest",
            mdtUser.status === 'En service' ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
            mdtUser.status === 'En pause' ? "border-amber-500/30 text-amber-400 bg-amber-500/5" :
            "border-slate-700 text-slate-400"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              mdtUser.status === 'En service' ? "bg-emerald-500 animate-pulse" :
              mdtUser.status === 'En pause' ? "bg-amber-500" :
              "bg-slate-500"
            )} />
            {mdtUser.status}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-2">
            <div className={cn("flex items-center gap-2", stat.color)}>
              {stat.icon}
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Folders + Shortcuts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Folders */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Dossiers Rapides</h2>
            <div className="grid grid-cols-4 gap-3">
              {folders.map((folder) => (
                <button
                  key={folder.path}
                  onClick={() => navigate(folder.path)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", folder.bg, folder.color)}>
                    {folder.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-tight text-center leading-tight">{folder.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shortcuts */}
          {shortcuts.length > 0 && (
            <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Raccourcis Opérationnels</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {shortcuts.map((sc) => (
                  <button
                    key={sc.path + sc.label}
                    onClick={() => navigate(sc.path)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#1F2937] hover:border-slate-600 text-xs font-bold text-slate-400 hover:text-white transition-all group"
                    style={{}}
                  >
                    <span className="opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
                      {sc.icon}
                    </span>
                    <span className="uppercase tracking-tight truncate">{sc.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Annonces du Service</h2>
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest text-center py-4">Aucune annonce</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={cn(
                      "p-4 rounded-xl border",
                      ann.priority === 'critical' ? "bg-red-500/5 border-red-500/30" :
                      ann.priority === 'high' ? "bg-amber-500/5 border-amber-500/30" :
                      "bg-[#0B0F1A] border-[#1F2937]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className={cn(
                        "text-xs font-black uppercase tracking-tight",
                        ann.priority === 'critical' ? "text-red-400" :
                        ann.priority === 'high' ? "text-amber-400" :
                        "text-white"
                      )}>{ann.title}</h3>
                      <Badge className={cn(
                        "text-[8px] font-black uppercase tracking-widest border h-4 px-1.5 flex-shrink-0 bg-transparent",
                        PRIORITY_COLORS[ann.priority]
                      )}>
                        {ann.priority === 'critical' ? 'CRITIQUE' : ann.priority === 'high' ? 'HAUTE' : 'NORMAL'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{ann.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{ann.author}</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        {formatDistanceToNow(new Date(ann.date), { locale: fr, addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Activity */}
        <div className="space-y-6">
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Activité Récente</h2>
            </div>
            {activities.length === 0 ? (
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest text-center py-4">Aucune activité</p>
            ) : (
              <div className="space-y-1">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 py-2.5 border-b border-[#1F2937] last:border-0">
                    <div className={cn("mt-0.5 flex-shrink-0", ACTIVITY_COLORS[act.type])}>
                      {ACTIVITY_ICONS[act.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-300 leading-tight truncate">{act.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-600 uppercase">{act.service}</span>
                        <span className="text-slate-700">·</span>
                        <span className="text-[9px] font-bold text-slate-600">
                          {formatDistanceToNow(new Date(act.timestamp), { locale: fr, addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick access by service */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Accès Rapide</h2>
            <div className="space-y-2">
              {[
                { label: 'Dispatch', path: '/mdt/dispatch', icon: <Radio className="w-3.5 h-3.5" /> },
                { label: 'Effectifs', path: '/mdt/effectifs', icon: <Users className="w-3.5 h-3.5" /> },
                { label: 'Code Pénal', path: '/mdt/penal-code', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { label: 'Heures de service', path: '/mdt/service-hours', icon: <Clock className="w-3.5 h-3.5" /> },
                { label: 'Plaintes', path: '/mdt/complaints', icon: <ClipboardList className="w-3.5 h-3.5" /> },
              ].map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-300">
                    {item.icon}
                    <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-slate-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
