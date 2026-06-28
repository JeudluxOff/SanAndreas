import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMdt } from '@/contexts/MdtContext';
import { MDT_SERVICES } from '@/lib/mdt-types';
import { cn } from '@/lib/utils';
import { Folder, FolderOpen, Radio, Car, MapPin, Users, User, Truck, Building2, Crosshair, FileText, Banknote, Search, Flame, Scroll, FlaskConical, Package, CircleParking as ParkingCircle, CircleAlert as AlertCircle, Shield, Camera, Megaphone, Link2, ClipboardList, BookOpen, Clock, Trash2, X, Siren, Monitor, FolderPlus, Plus, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── Types ──────────────────────────────────────────────────────────────────

type DesktopShortcut = {
  id: string;
  type: 'shortcut';
  name: string;
  path: string;
  iconKey: string;
  color: string;
};

type DesktopFolder = {
  id: string;
  type: 'folder';
  name: string;
  color: string;
  items: DesktopShortcut[];
};

type DesktopItem = (DesktopShortcut | DesktopFolder) & { col: number; row: number };

type CtxMenu =
  | { kind: 'desktop'; x: number; y: number }
  | { kind: 'icon'; x: number; y: number; id: string };

// ─── Icon registry ──────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  Radio, Car, MapPin, Users, User, Truck, Building2, Crosshair, FileText,
  Banknote, Search, Flame, Scroll, FlaskConical, Package, ParkingCircle,
  AlertCircle, Shield, Camera, Megaphone, Link2, ClipboardList, BookOpen,
  Clock, Siren, Monitor,
};

const AVAILABLE_MODULES = [
  { label: 'Dispatch', path: '/mdt/dispatch', iconKey: 'Radio' },
  { label: 'Unités', path: '/mdt/units', iconKey: 'Car' },
  { label: 'Quartiers chauds', path: '/mdt/hotspots', iconKey: 'MapPin' },
  { label: 'Effectifs', path: '/mdt/effectifs', iconKey: 'Users' },
  { label: 'Citoyens', path: '/mdt/citizens', iconKey: 'User' },
  { label: 'Véhicules', path: '/mdt/vehicles', iconKey: 'Truck' },
  { label: 'Propriétés', path: '/mdt/properties', iconKey: 'Building2' },
  { label: "Registre d'armes", path: '/mdt/weapons', iconKey: 'Crosshair' },
  { label: 'Rapports', path: '/mdt/reports', iconKey: 'FileText' },
  { label: 'Amendes', path: '/mdt/fines', iconKey: 'Banknote' },
  { label: 'Enquêtes', path: '/mdt/investigations', iconKey: 'Search' },
  { label: 'Rapports fusillade', path: '/mdt/shooting-reports', iconKey: 'Flame' },
  { label: 'Mandats', path: '/mdt/warrants', iconKey: 'Scroll' },
  { label: 'Balistique', path: '/mdt/ballistics', iconKey: 'Siren' },
  { label: 'Laboratoire', path: '/mdt/lab', iconKey: 'FlaskConical' },
  { label: 'Saisies', path: '/mdt/seizures', iconKey: 'Package' },
  { label: 'Saisies véhicule', path: '/mdt/vehicle-seizures', iconKey: 'ParkingCircle' },
  { label: 'BOLO', path: '/mdt/bolo', iconKey: 'AlertCircle' },
  { label: 'Gangs', path: '/mdt/gangs', iconKey: 'Shield' },
  { label: 'Photo-preuve', path: '/mdt/evidence', iconKey: 'Camera' },
  { label: 'Annonces', path: '/mdt/announcements', iconKey: 'Megaphone' },
  { label: 'Bracelets', path: '/mdt/bracelets', iconKey: 'Link2' },
  { label: 'Plaintes', path: '/mdt/complaints', iconKey: 'ClipboardList' },
  { label: 'Dépositions', path: '/mdt/depositions', iconKey: 'BookOpen' },
  { label: 'Code Pénal', path: '/mdt/penal-code', iconKey: 'BookOpen' },
  { label: 'Heures de service', path: '/mdt/service-hours', iconKey: 'Clock' },
];

// ─── Default desktop layout by service ──────────────────────────────────────

function defaultItems(service: string, accent: string): DesktopItem[] {
  const base: DesktopItem[] = [
    { id: 'sc-citizens', type: 'shortcut', name: 'Citoyens', path: '/mdt/citizens', iconKey: 'User', color: accent, col: 0, row: 0 },
    { id: 'sc-vehicles', type: 'shortcut', name: 'Véhicules', path: '/mdt/vehicles', iconKey: 'Truck', color: '#6B7280', col: 0, row: 1 },
    { id: 'sc-penal', type: 'shortcut', name: 'Code Pénal', path: '/mdt/penal-code', iconKey: 'BookOpen', color: '#6B7280', col: 0, row: 2 },
    { id: 'sc-hours', type: 'shortcut', name: 'Heures de service', path: '/mdt/service-hours', iconKey: 'Clock', color: '#6B7280', col: 0, row: 3 },
    {
      id: 'folder-ops', type: 'folder', name: 'Opérations', color: accent, col: 1, row: 0,
      items: [
        { id: 'sc-dispatch', type: 'shortcut', name: 'Dispatch', path: '/mdt/dispatch', iconKey: 'Radio', color: accent },
        { id: 'sc-reports', type: 'shortcut', name: 'Rapports', path: '/mdt/reports', iconKey: 'FileText', color: accent },
        { id: 'sc-warrants', type: 'shortcut', name: 'Mandats', path: '/mdt/warrants', iconKey: 'Scroll', color: '#F59E0B' },
        { id: 'sc-bolo', type: 'shortcut', name: 'BOLO', path: '/mdt/bolo', iconKey: 'AlertCircle', color: '#EF4444' },
      ],
    },
  ];

  const serviceFolder: DesktopFolder & { col: number; row: number } = (() => {
    if (service === 'FIB') return {
      id: 'folder-fib', type: 'folder', name: 'Enquêtes FIB', color: '#DC2626', col: 1, row: 1,
      items: [
        { id: 'sc-inv', type: 'shortcut', name: 'Enquêtes', path: '/mdt/investigations', iconKey: 'Search', color: '#DC2626' },
        { id: 'sc-bal', type: 'shortcut', name: 'Balistique', path: '/mdt/ballistics', iconKey: 'Siren', color: '#DC2626' },
        { id: 'sc-lab', type: 'shortcut', name: 'Laboratoire', path: '/mdt/lab', iconKey: 'FlaskConical', color: '#DC2626' },
      ],
    };
    if (service === 'LSPD') return {
      id: 'folder-lspd', type: 'folder', name: 'Terrain', color: '#2563EB', col: 1, row: 1,
      items: [
        { id: 'sc-fines', type: 'shortcut', name: 'Amendes', path: '/mdt/fines', iconKey: 'Banknote', color: '#10B981' },
        { id: 'sc-seizures', type: 'shortcut', name: 'Saisies', path: '/mdt/seizures', iconKey: 'Package', color: '#8B5CF6' },
        { id: 'sc-gangs', type: 'shortcut', name: 'Gangs', path: '/mdt/gangs', iconKey: 'Shield', color: '#EF4444' },
      ],
    };
    if (service === 'LSSD') return {
      id: 'folder-lssd', type: 'folder', name: 'Terrain', color: '#D97706', col: 1, row: 1,
      items: [
        { id: 'sc-fines2', type: 'shortcut', name: 'Amendes', path: '/mdt/fines', iconKey: 'Banknote', color: '#10B981' },
        { id: 'sc-seizures2', type: 'shortcut', name: 'Saisies', path: '/mdt/seizures', iconKey: 'Package', color: '#8B5CF6' },
      ],
    };
    if (service === 'USSS') return {
      id: 'folder-usss', type: 'folder', name: 'Sécurité', color: '#3B82F6', col: 1, row: 1,
      items: [
        { id: 'sc-units', type: 'shortcut', name: 'Unités', path: '/mdt/units', iconKey: 'Car', color: '#3B82F6' },
        { id: 'sc-hot', type: 'shortcut', name: 'Zones sensibles', path: '/mdt/hotspots', iconKey: 'MapPin', color: '#EF4444' },
        { id: 'sc-ann', type: 'shortcut', name: 'Annonces', path: '/mdt/announcements', iconKey: 'Megaphone', color: '#F59E0B' },
      ],
    };
    return {
      id: 'folder-inter', type: 'folder', name: 'Interventions', color: service === 'LSFD' ? '#EA580C' : '#16A34A', col: 1, row: 1,
      items: [
        { id: 'sc-disp2', type: 'shortcut', name: 'Dispatch', path: '/mdt/dispatch', iconKey: 'Radio', color: service === 'LSFD' ? '#EA580C' : '#16A34A' },
        { id: 'sc-shoot', type: 'shortcut', name: 'Rapports fusillade', path: '/mdt/shooting-reports', iconKey: 'Flame', color: '#EF4444' },
      ],
    };
  })();

  return [...base, serviceFolder];
}

// ─── Storage helpers ─────────────────────────────────────────────────────────

function loadDesktop(username: string, service: string, accent: string): DesktopItem[] {
  try {
    const raw = localStorage.getItem(`sa_mdt_desktop_${username}`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return defaultItems(service, accent);
}

function saveDesktop(username: string, items: DesktopItem[]) {
  localStorage.setItem(`sa_mdt_desktop_${username}`, JSON.stringify(items));
}

// ─── Icon renderer ───────────────────────────────────────────────────────────

function DynamicIcon({ iconKey, className, style }: { iconKey: string; className?: string; style?: React.CSSProperties }) {
  const Icon = ICON_MAP[iconKey] ?? FileText;
  return <Icon className={className} style={style} />;
}

// ─── Desktop icon ────────────────────────────────────────────────────────────

const CELL_W = 88;
const CELL_H = 96;

interface IconProps {
  item: DesktopItem;
  selected: boolean;
  renaming: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onRenameCommit: (name: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
}

function DesktopIcon({ item, selected, renaming, onSelect, onDoubleClick, onContextMenu, onRenameCommit, onDragStart }: IconProps) {
  const [nameInput, setNameInput] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming) {
      setNameInput(item.name);
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [renaming, item.name]);

  const isFolder = item.type === 'folder';
  const color = item.color;

  return (
    <div
      className={cn(
        'absolute flex flex-col items-center gap-1 cursor-pointer select-none group',
        'transition-transform duration-75',
      )}
      style={{
        left: item.col * (CELL_W + 12) + 16,
        top: item.row * (CELL_H + 8) + 16,
        width: CELL_W,
      }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onDoubleClick={(e) => { e.stopPropagation(); if (!renaming) onDoubleClick(); }}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e); }}
      onMouseDown={(e) => { if (e.button === 0 && !renaming) onDragStart(e, item.id); }}
    >
      {/* Icon box */}
      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center transition-all',
          selected ? 'ring-2 ring-white/30 scale-105' : 'group-hover:scale-105',
          isFolder ? 'bg-transparent' : '',
        )}
        style={!isFolder ? { backgroundColor: `${color}18`, border: `1px solid ${color}30` } : {}}
      >
        {isFolder ? (
          <Folder className="w-9 h-9" style={{ color }} />
        ) : (
          <DynamicIcon iconKey={(item as DesktopShortcut).iconKey} className="w-7 h-7" style={{ color }} />
        )}
      </div>

      {/* Label */}
      {renaming ? (
        <input
          ref={inputRef}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={() => onRenameCommit(nameInput)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onRenameCommit(nameInput);
            if (e.key === 'Escape') onRenameCommit(item.name);
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full text-center text-[10px] font-bold bg-[#1F2937] text-white border border-blue-500 rounded px-1 py-0.5 outline-none"
        />
      ) : (
        <span
          className={cn(
            'text-[10px] font-bold text-center leading-tight uppercase tracking-tight line-clamp-2 px-1 w-full',
            selected ? 'bg-blue-600/40 rounded text-white' : 'text-slate-300 group-hover:text-white',
          )}
        >
          {item.name}
        </span>
      )}
    </div>
  );
}

// ─── Folder window ───────────────────────────────────────────────────────────

interface FolderWindowProps {
  folder: DesktopFolder;
  accentColor: string;
  onClose: () => void;
  onOpenShortcut: (path: string) => void;
  onAddShortcut: () => void;
  onDeleteShortcut: (id: string) => void;
}

function FolderWindow({ folder, accentColor, onClose, onOpenShortcut, onAddShortcut, onDeleteShortcut }: FolderWindowProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const winRef = useRef<HTMLDivElement>(null);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging({ startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y });
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setPos({ x: dragging.origX + e.clientX - dragging.startX, y: dragging.origY + e.clientY - dragging.startY });
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  return (
    <div
      ref={winRef}
      className="fixed z-40 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl w-80"
      style={{ left: `calc(50% + ${pos.x}px - 160px)`, top: `calc(50% + ${pos.y}px - 160px)` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#1F2937] cursor-move rounded-t-2xl"
        style={{ backgroundColor: `${folder.color}18` }}
        onMouseDown={handleHeaderMouseDown}
      >
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4" style={{ color: folder.color }} />
          <span className="text-xs font-black text-white uppercase tracking-widest">{folder.name}</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {folder.items.length === 0 ? (
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-4">
            Dossier vide
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {folder.items.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  className="w-full flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/5 transition-all"
                  onDoubleClick={() => onOpenShortcut(item.path)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}18`, border: `1px solid ${item.color}30` }}
                  >
                    <DynamicIcon iconKey={item.iconKey} className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight text-center leading-tight line-clamp-2">
                    {item.name}
                  </span>
                </button>
                <button
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white hidden group-hover:flex items-center justify-center"
                  onClick={() => onDeleteShortcut(item.id)}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onAddShortcut}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-[#1F2937] text-[10px] font-bold text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all uppercase tracking-widest"
        >
          <Plus className="w-3 h-3" /> Ajouter un raccourci
        </button>
      </div>
    </div>
  );
}

// ─── Add shortcut dialog ─────────────────────────────────────────────────────

interface AddShortcutDialogProps {
  title: string;
  accentColor: string;
  onAdd: (module: typeof AVAILABLE_MODULES[number]) => void;
  onClose: () => void;
}

function AddShortcutDialog({ title, accentColor, onAdd, onClose }: AddShortcutDialogProps) {
  const [search, setSearch] = useState('');
  const filtered = AVAILABLE_MODULES.filter(m => m.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl w-96 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2937]">
          <span className="text-xs font-black text-white uppercase tracking-widest">{title}</span>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          <Input
            autoFocus
            placeholder="Rechercher un module..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0B0F1A] border-[#1F2937] text-white text-xs placeholder:text-slate-600 h-9"
          />
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filtered.map((mod) => (
              <button
                key={mod.path}
                onClick={() => { onAdd(mod); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}18` }}
                >
                  <DynamicIcon iconKey={mod.iconKey} className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase tracking-wider transition-colors">
                  {mod.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Context menu ─────────────────────────────────────────────────────────────

interface ContextMenuProps {
  menu: CtxMenu;
  onNewFolder: () => void;
  onNewShortcut: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function ContextMenuUI({ menu, onNewFolder, onNewShortcut, onRename, onDelete, onClose }: ContextMenuProps) {
  const items = menu.kind === 'desktop'
    ? [
        { label: 'Nouveau dossier', icon: <FolderPlus className="w-3.5 h-3.5" />, action: onNewFolder },
        { label: 'Nouveau raccourci', icon: <Plus className="w-3.5 h-3.5" />, action: onNewShortcut },
      ]
    : [
        { label: 'Renommer', icon: <Pencil className="w-3.5 h-3.5" />, action: () => onRename(menu.id) },
        { label: 'Supprimer', icon: <Trash2 className="w-3.5 h-3.5" />, action: () => onDelete(menu.id), danger: true },
      ];

  return (
    <div
      className="fixed z-50 bg-[#111827] border border-[#1F2937] rounded-xl shadow-2xl py-1.5 min-w-44"
      style={{ left: menu.x, top: menu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => { item.action(); onClose(); }}
          className={cn(
            'w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors',
            (item as { danger?: boolean }).danger
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-slate-400 hover:bg-white/5 hover:text-white',
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── New folder dialog ────────────────────────────────────────────────────────

function NewFolderDialog({ onCreate, onClose }: { onCreate: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState('Nouveau dossier');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl w-80 shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
        <p className="text-xs font-black text-white uppercase tracking-widest mb-4">Nouveau dossier</p>
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onCreate(name); if (e.key === 'Escape') onClose(); }}
          className="bg-[#0B0F1A] border-[#1F2937] text-white text-xs h-9 mb-4"
        />
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onClose} className="text-xs border-[#1F2937] text-slate-400 hover:text-white">Annuler</Button>
          <Button size="sm" onClick={() => onCreate(name)} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">Créer</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Taskbar ──────────────────────────────────────────────────────────────────

function Taskbar({ mdtUser, accentColor }: { mdtUser: { name: string; service: string; rank: string; status: string }; accentColor: string }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="h-10 bg-[#0B0F1A]/90 backdrop-blur border-t border-[#1F2937] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: accentColor }} />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">{mdtUser.service}</span>
        <span className="text-slate-700">·</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{mdtUser.name}</span>
        <span className="text-slate-700">·</span>
        <div className="flex items-center gap-1">
          <div className={cn(
            'w-1.5 h-1.5 rounded-full',
            mdtUser.status === 'En service' ? 'bg-emerald-500' :
            mdtUser.status === 'En pause' ? 'bg-amber-500' : 'bg-slate-500'
          )} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{mdtUser.status}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">{dateStr}</span>
        <span className="text-[11px] font-black text-white font-mono tracking-widest">{hh}:{mm}:{ss}</span>
      </div>
    </div>
  );
}

// ─── Main Bureau component ────────────────────────────────────────────────────

export default function MdtBureau() {
  const { mdtUser } = useMdt();
  const navigate = useNavigate();

  const service = mdtUser ? MDT_SERVICES[mdtUser.service] : null;
  const accentColor = service?.color ?? '#3B82F6';

  const [items, setItemsRaw] = useState<DesktopItem[]>(() =>
    mdtUser ? loadDesktop(mdtUser.username, mdtUser.service, accentColor) : []
  );

  const setItems = useCallback((next: DesktopItem[] | ((prev: DesktopItem[]) => DesktopItem[])) => {
    setItemsRaw((prev) => {
      const val = typeof next === 'function' ? next(prev) : next;
      if (mdtUser) saveDesktop(mdtUser.username, val);
      return val;
    });
  }, [mdtUser]);

  const [selected, setSelected] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [ctxMenu, setCtxMenu] = useState<CtxMenu | null>(null);
  const [openFolder, setOpenFolder] = useState<(DesktopFolder & { col: number; row: number }) | null>(null);
  const [addShortcutTarget, setAddShortcutTarget] = useState<'desktop' | string | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  // Drag state
  const dragState = useRef<{
    id: string; startX: number; startY: number;
    origCol: number; origRow: number;
    ghostEl: HTMLDivElement | null;
  } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    if (!ctxMenu) return;
    const handler = () => setCtxMenu(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [ctxMenu]);

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const handleDragStart = useCallback((e: React.MouseEvent, id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    dragState.current = {
      id, startX: e.clientX, startY: e.clientY,
      origCol: item.col, origRow: item.row,
      ghostEl: null,
    };
    e.preventDefault();
  }, [items]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragState.current || !desktopRef.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      // Move item live
      const col = Math.max(0, dragState.current.origCol + Math.round(dx / (CELL_W + 12)));
      const row = Math.max(0, dragState.current.origRow + Math.round(dy / (CELL_H + 8)));
      setItemsRaw((prev) => {
        const next = prev.map((i) => i.id === dragState.current!.id ? { ...i, col, row } : i);
        return next;
      });
    };

    const onUp = () => {
      if (!dragState.current) return;
      const { id } = dragState.current;
      dragState.current = null;
      // Persist final position
      setItemsRaw((prev) => {
        if (mdtUser) saveDesktop(mdtUser.username, prev);
        return prev;
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [mdtUser]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDesktopClick = () => { setSelected(null); setCtxMenu(null); };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ kind: 'desktop', x: e.clientX, y: e.clientY });
  };

  const handleIconContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setSelected(id);
    setCtxMenu({ kind: 'icon', x: e.clientX, y: e.clientY, id });
  };

  const handleDoubleClick = (item: DesktopItem) => {
    if (item.type === 'shortcut') navigate(item.path);
    else setOpenFolder(item as DesktopFolder & { col: number; row: number });
  };

  const handleRenameCommit = (id: string, name: string) => {
    if (name.trim()) setItems((prev) => prev.map((i) => i.id === id ? { ...i, name: name.trim() } : i));
    setRenaming(null);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected(null);
    if (openFolder?.id === id) setOpenFolder(null);
  };

  // New folder
  const handleCreateFolder = (name: string) => {
    const usedCols = new Set(items.map((i) => `${i.col},${i.row}`));
    let col = 2, row = 0;
    while (usedCols.has(`${col},${row}`)) { row++; if (row > 10) { col++; row = 0; } }
    const newItem: DesktopItem = {
      id: `folder-${Date.now()}`, type: 'folder', name, color: accentColor,
      items: [], col, row,
    };
    setItems((prev) => [...prev, newItem]);
    setNewFolderOpen(false);
  };

  // New shortcut on desktop
  const handleAddDesktopShortcut = (mod: typeof AVAILABLE_MODULES[number]) => {
    const usedCols = new Set(items.map((i) => `${i.col},${i.row}`));
    let col = 2, row = 0;
    while (usedCols.has(`${col},${row}`)) { row++; if (row > 10) { col++; row = 0; } }
    const newItem: DesktopItem = {
      id: `sc-${Date.now()}`, type: 'shortcut', name: mod.label,
      path: mod.path, iconKey: mod.iconKey, color: accentColor, col, row,
    };
    setItems((prev) => [...prev, newItem]);
    setAddShortcutTarget(null);
  };

  // New shortcut inside folder
  const handleAddFolderShortcut = (folderId: string, mod: typeof AVAILABLE_MODULES[number]) => {
    const newSc: DesktopShortcut = {
      id: `sc-${Date.now()}`, type: 'shortcut', name: mod.label,
      path: mod.path, iconKey: mod.iconKey, color: accentColor,
    };
    setItems((prev) => prev.map((i) => {
      if (i.id !== folderId || i.type !== 'folder') return i;
      const updated = { ...i, items: [...(i as DesktopFolder).items, newSc] };
      if (openFolder?.id === folderId) setOpenFolder(updated as typeof openFolder);
      return updated;
    }));
    setAddShortcutTarget(null);
  };

  const handleDeleteFolderShortcut = (folderId: string, scId: string) => {
    setItems((prev) => prev.map((i) => {
      if (i.id !== folderId || i.type !== 'folder') return i;
      const updated = { ...i, items: (i as DesktopFolder).items.filter((s) => s.id !== scId) };
      setOpenFolder(updated as typeof openFolder);
      return updated;
    }));
  };

  // ── Next free position for context-menu creation ──────────────────────────

  if (!mdtUser) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#080A0F' }}>
      {/* Desktop area */}
      <div
        ref={desktopRef}
        className="flex-1 relative overflow-hidden"
        onClick={handleDesktopClick}
        onContextMenu={handleDesktopContextMenu}
        style={{
          backgroundImage: 'radial-gradient(circle, #1F2937 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        {/* Wallpaper service accent glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 80% 20%, ${accentColor}08 0%, transparent 60%)`,
          }}
        />

        {/* Desktop icons */}
        {items.map((item) => (
          <DesktopIcon
            key={item.id}
            item={item}
            selected={selected === item.id}
            renaming={renaming === item.id}
            onSelect={() => setSelected(item.id)}
            onDoubleClick={() => handleDoubleClick(item)}
            onContextMenu={(e) => handleIconContextMenu(e, item.id)}
            onRenameCommit={(name) => handleRenameCommit(item.id, name)}
            onDragStart={handleDragStart}
          />
        ))}

        {/* Context menu */}
        {ctxMenu && (
          <ContextMenuUI
            menu={ctxMenu}
            onNewFolder={() => setNewFolderOpen(true)}
            onNewShortcut={() => setAddShortcutTarget('desktop')}
            onRename={(id) => { setRenaming(id); setSelected(id); }}
            onDelete={handleDelete}
            onClose={() => setCtxMenu(null)}
          />
        )}

        {/* Folder window */}
        {openFolder && (
          <FolderWindow
            folder={openFolder}
            accentColor={accentColor}
            onClose={() => setOpenFolder(null)}
            onOpenShortcut={(path) => navigate(path)}
            onAddShortcut={() => setAddShortcutTarget(openFolder.id)}
            onDeleteShortcut={(scId) => handleDeleteFolderShortcut(openFolder.id, scId)}
          />
        )}
      </div>

      {/* Taskbar */}
      <Taskbar mdtUser={mdtUser} accentColor={accentColor} />

      {/* Dialogs */}
      {newFolderOpen && (
        <NewFolderDialog
          onCreate={handleCreateFolder}
          onClose={() => setNewFolderOpen(false)}
        />
      )}

      {addShortcutTarget === 'desktop' && (
        <AddShortcutDialog
          title="Nouveau raccourci"
          accentColor={accentColor}
          onAdd={handleAddDesktopShortcut}
          onClose={() => setAddShortcutTarget(null)}
        />
      )}

      {addShortcutTarget && addShortcutTarget !== 'desktop' && (
        <AddShortcutDialog
          title="Ajouter un raccourci"
          accentColor={accentColor}
          onAdd={(mod) => handleAddFolderShortcut(addShortcutTarget, mod)}
          onClose={() => setAddShortcutTarget(null)}
        />
      )}
    </div>
  );
}
