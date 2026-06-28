import React, { useState, useMemo } from 'react';
import { useMdt } from '@/contexts/MdtContext';
import { MDT_SERVICES } from '@/lib/mdt-types';
import { cn } from '@/lib/utils';
import { HandMetal as Handcuffs, Plus, Search, ListFilter as Filter, ChevronDown, X, User, Calendar, FileText, Scale, MapPin, Clock, Pencil, Trash2, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, CircleDot, ChevronRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// ─── Types ────────────────────────────────────────────────────────────────────

type ArrestStatus = 'en_cours' | 'transmis' | 'clos';

interface ArrestCharge {
  id: string;
  article: string;
  description: string;
  category: 'crime' | 'delit' | 'contravention';
}

interface ArrestDossier {
  id: string;
  numero: string;
  suspect: string;
  dob?: string;
  location: string;
  date: string;
  time: string;
  officers: string[];
  charges: ArrestCharge[];
  notes: string;
  status: ArrestStatus;
  service: string;
  createdBy: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ArrestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  en_cours: {
    label: 'En cours',
    color: '#F59E0B',
    icon: <CircleDot className="w-3 h-3" />,
  },
  transmis: {
    label: 'Transmis au parquet',
    color: '#3B82F6',
    icon: <Scale className="w-3 h-3" />,
  },
  clos: {
    label: 'Clos',
    color: '#6B7280',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

const CHARGE_CATEGORY_COLORS: Record<ArrestCharge['category'], string> = {
  crime: '#EF4444',
  delit: '#F59E0B',
  contravention: '#6B7280',
};

function genId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function genNumero(service: string) {
  const year = new Date().getFullYear();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `ARRT-${service}-${year}-${seq}`;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

function seedDossiers(service: string): ArrestDossier[] {
  return [
    {
      id: genId(),
      numero: genNumero(service),
      suspect: 'Trevor Philips',
      dob: '1968-11-14',
      location: 'Sandy Shores, Route 68',
      date: '2026-06-27',
      time: '02:15',
      officers: ['L. Reed', 'K. Chen'],
      charges: [
        { id: genId(), article: 'Art. 214-1', description: 'Trafic de stupéfiants', category: 'crime' },
        { id: genId(), article: 'Art. 433-6', description: 'Résistance à agent', category: 'delit' },
      ],
      notes: 'Sujet appréhendé après une course-poursuite de 3 km. Véhicule abandonné. Arme à feu retrouvée.',
      status: 'transmis',
      service,
      createdBy: 'L. Reed',
    },
    {
      id: genId(),
      numero: genNumero(service),
      suspect: 'Jimmy De Santa',
      dob: '2001-04-20',
      location: 'Vinewood Hills, Portola Dr',
      date: '2026-06-26',
      time: '18:40',
      officers: ['M. Torres'],
      charges: [
        { id: genId(), article: 'Art. 311-1', description: 'Vol avec violence', category: 'crime' },
      ],
      notes: 'Vol à l\'arraché d\'un téléphone. Témoin présent sur les lieux.',
      status: 'en_cours',
      service,
      createdBy: 'M. Torres',
    },
    {
      id: genId(),
      numero: genNumero(service),
      suspect: 'Lamar Davis',
      dob: '1994-08-03',
      location: 'Chamberlain Hills, Forum Dr',
      date: '2026-06-24',
      time: '23:55',
      officers: ['D. Nguyen', 'L. Reed'],
      charges: [
        { id: genId(), article: 'Art. 222-11', description: 'Violence volontaire', category: 'delit' },
        { id: genId(), article: 'Art. 431-1', description: 'Trouble à l\'ordre public', category: 'delit' },
      ],
      notes: 'Rixe impliquant plusieurs individus. Deux blessés légers.',
      status: 'clos',
      service,
      createdBy: 'D. Nguyen',
    },
  ];
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = (service: string) => `sa_mdt_arrest_${service}`;

function loadDossiers(service: string): ArrestDossier[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(service));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const seeded = seedDossiers(service);
  localStorage.setItem(STORAGE_KEY(service), JSON.stringify(seeded));
  return seeded;
}

function saveDossiers(service: string, dossiers: ArrestDossier[]) {
  localStorage.setItem(STORAGE_KEY(service), JSON.stringify(dossiers));
}

// ─── Empty form ───────────────────────────────────────────────────────────────

function emptyDossier(service: string, agentName: string): Omit<ArrestDossier, 'id' | 'numero'> {
  return {
    suspect: '',
    dob: '',
    location: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    officers: [agentName],
    charges: [],
    notes: '',
    status: 'en_cours',
    service,
    createdBy: agentName,
  };
}

// ─── Charge form ──────────────────────────────────────────────────────────────

function ChargeForm({ onAdd, onClose }: { onAdd: (c: ArrestCharge) => void; onClose: () => void }) {
  const [article, setArticle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ArrestCharge['category']>('delit');

  return (
    <div className="bg-[#0B0F1A] border border-[#1F2937] rounded-xl p-4 space-y-3">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ajouter un chef d'inculpation</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Article</label>
          <Input
            placeholder="Art. 311-1"
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            className="bg-[#111827] border-[#1F2937] text-white text-xs h-8"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ArrestCharge['category'])}
            className="w-full h-8 px-2 bg-[#111827] border border-[#1F2937] text-white text-xs rounded-md"
          >
            <option value="crime">Crime</option>
            <option value="delit">Délit</option>
            <option value="contravention">Contravention</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Description</label>
        <Input
          placeholder="Trafic de stupéfiants..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-[#111827] border-[#1F2937] text-white text-xs h-8"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={onClose} className="text-[10px] border-[#1F2937] text-slate-500 hover:text-white h-7">
          Annuler
        </Button>
        <Button
          size="sm"
          disabled={!article.trim() || !description.trim()}
          onClick={() => { onAdd({ id: genId(), article, description, category }); onClose(); }}
          className="text-[10px] h-7 font-black uppercase tracking-widest"
          style={{ backgroundColor: '#3B82F6' }}
        >
          Ajouter
        </Button>
      </div>
    </div>
  );
}

// ─── Dossier form modal ───────────────────────────────────────────────────────

interface DossierFormProps {
  initial: Partial<ArrestDossier>;
  onSave: (d: Omit<ArrestDossier, 'id' | 'numero'>) => void;
  onClose: () => void;
  accentColor: string;
}

function DossierFormModal({ initial, onSave, onClose, accentColor }: DossierFormProps) {
  const [form, setForm] = useState<Omit<ArrestDossier, 'id' | 'numero'>>({
    suspect: initial.suspect ?? '',
    dob: initial.dob ?? '',
    location: initial.location ?? '',
    date: initial.date ?? format(new Date(), 'yyyy-MM-dd'),
    time: initial.time ?? format(new Date(), 'HH:mm'),
    officers: initial.officers ?? [],
    charges: initial.charges ?? [],
    notes: initial.notes ?? '',
    status: initial.status ?? 'en_cours',
    service: initial.service ?? '',
    createdBy: initial.createdBy ?? '',
  });
  const [newOfficer, setNewOfficer] = useState('');
  const [showChargeForm, setShowChargeForm] = useState(false);

  const set = (field: keyof typeof form, val: unknown) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-[#111827] border border-[#1F2937] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2937]" style={{ borderTopColor: accentColor }}>
          <div className="flex items-center gap-3">
            <Handcuffs className="w-5 h-5" style={{ color: accentColor }} />
            <span className="text-sm font-black text-white uppercase tracking-widest">
              {initial.id ? 'Modifier le dossier' : 'Nouveau dossier d\'arrestation'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Suspect */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Identité du suspect</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Nom complet *</label>
                <Input
                  placeholder="Prénom Nom"
                  value={form.suspect}
                  onChange={(e) => set('suspect', e.target.value)}
                  className="bg-[#0B0F1A] border-[#1F2937] text-white text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Date de naissance</label>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => set('dob', e.target.value)}
                  className="bg-[#0B0F1A] border-[#1F2937] text-white text-xs h-9"
                />
              </div>
            </div>
          </div>

          {/* Intervention */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Intervention</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 space-y-1">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Lieu d'arrestation *</label>
                <Input
                  placeholder="Adresse ou lieu"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  className="bg-[#0B0F1A] border-[#1F2937] text-white text-xs h-9"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Date *</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  className="bg-[#0B0F1A] border-[#1F2937] text-white text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Heure</label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => set('time', e.target.value)}
                  className="bg-[#0B0F1A] border-[#1F2937] text-white text-xs h-9"
                />
              </div>
            </div>
          </div>

          {/* Officiers */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Officiers présents</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.officers.map((o, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1F2937] text-[10px] font-bold text-slate-300"
                >
                  {o}
                  <button onClick={() => set('officers', form.officers.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un officier..."
                value={newOfficer}
                onChange={(e) => setNewOfficer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newOfficer.trim()) {
                    set('officers', [...form.officers, newOfficer.trim()]);
                    setNewOfficer('');
                  }
                }}
                className="bg-[#0B0F1A] border-[#1F2937] text-white text-xs h-8 flex-1"
              />
              <Button
                size="sm" variant="outline" className="h-8 text-[10px] border-[#1F2937] text-slate-400 hover:text-white"
                onClick={() => { if (newOfficer.trim()) { set('officers', [...form.officers, newOfficer.trim()]); setNewOfficer(''); } }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Chefs d'inculpation */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Chefs d'inculpation</p>
            <div className="space-y-2">
              {form.charges.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 bg-[#0B0F1A] rounded-xl border border-[#1F2937]">
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest"
                    style={{ color: CHARGE_CATEGORY_COLORS[c.category], backgroundColor: `${CHARGE_CATEGORY_COLORS[c.category]}15` }}
                  >
                    {c.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{c.article}</span>
                  <span className="text-[10px] font-medium text-slate-300 flex-1 truncate">{c.description}</span>
                  <button onClick={() => set('charges', form.charges.filter((x) => x.id !== c.id))} className="text-slate-600 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            {showChargeForm ? (
              <ChargeForm
                onAdd={(c) => set('charges', [...form.charges, c])}
                onClose={() => setShowChargeForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowChargeForm(true)}
                className="w-full py-2 rounded-xl border border-dashed border-[#1F2937] text-[10px] font-bold text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> Ajouter un chef d'inculpation
              </button>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Notes de l'officier</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Circonstances de l'arrestation, éléments matériels..."
              className="w-full px-3 py-2 bg-[#0B0F1A] border border-[#1F2937] rounded-xl text-xs text-white placeholder:text-slate-600 resize-none outline-none focus:border-slate-600 transition-colors"
            />
          </div>

          {/* Statut */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Statut du dossier</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(STATUS_CONFIG) as [ArrestStatus, typeof STATUS_CONFIG[ArrestStatus]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => set('status', key)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-bold transition-all',
                    form.status === key ? 'border-current text-current' : 'border-[#1F2937] text-slate-500 hover:border-slate-600',
                  )}
                  style={form.status === key ? { color: cfg.color, borderColor: cfg.color, backgroundColor: `${cfg.color}10` } : {}}
                >
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1F2937]">
          <Button variant="outline" onClick={onClose} className="text-xs border-[#1F2937] text-slate-400 hover:text-white font-bold uppercase tracking-widest">
            Annuler
          </Button>
          <Button
            onClick={() => onSave(form)}
            disabled={!form.suspect.trim() || !form.location.trim()}
            className="text-xs font-black uppercase tracking-widest"
            style={{ backgroundColor: accentColor }}
          >
            {initial.id ? 'Enregistrer' : 'Créer le dossier'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Dossier detail modal ─────────────────────────────────────────────────────

function DossierDetailModal({
  dossier, accentColor, onClose, onEdit, onDelete, onStatusChange,
}: {
  dossier: ArrestDossier;
  accentColor: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: ArrestStatus) => void;
}) {
  const cfg = STATUS_CONFIG[dossier.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-[#111827] border border-[#1F2937] rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2937]">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{dossier.numero}</p>
            <h2 className="text-base font-black text-white uppercase tracking-tight">{dossier.suspect}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-white ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: `${cfg.color}40`, backgroundColor: `${cfg.color}08` }}>
            <span style={{ color: cfg.color }}>{cfg.icon}</span>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
            <div className="ml-auto flex gap-2">
              {(Object.entries(STATUS_CONFIG) as [ArrestStatus, typeof STATUS_CONFIG[ArrestStatus]][])
                .filter(([k]) => k !== dossier.status)
                .map(([key, c]) => (
                  <button
                    key={key}
                    onClick={() => onStatusChange(key)}
                    className="text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest transition-all hover:opacity-80"
                    style={{ color: c.color, borderColor: `${c.color}40`, backgroundColor: `${c.color}10` }}
                  >
                    {c.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#0B0F1A] border border-[#1F2937]">
              <User className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Suspect</p>
                <p className="text-xs font-bold text-white mt-0.5">{dossier.suspect}</p>
                {dossier.dob && <p className="text-[9px] text-slate-500 mt-0.5">Né le {format(new Date(dossier.dob), 'd MMM yyyy', { locale: fr })}</p>}
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#0B0F1A] border border-[#1F2937]">
              <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Lieu</p>
                <p className="text-xs font-bold text-white mt-0.5">{dossier.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#0B0F1A] border border-[#1F2937]">
              <Calendar className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Date & Heure</p>
                <p className="text-xs font-bold text-white mt-0.5">
                  {format(new Date(dossier.date), 'd MMM yyyy', { locale: fr })} à {dossier.time}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#0B0F1A] border border-[#1F2937]">
              <Shield className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Officiers</p>
                <p className="text-xs font-bold text-white mt-0.5">{dossier.officers.join(', ') || '—'}</p>
              </div>
            </div>
          </div>

          {/* Charges */}
          {dossier.charges.length > 0 && (
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Chefs d'inculpation</p>
              {dossier.charges.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 bg-[#0B0F1A] rounded-xl border border-[#1F2937]">
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest flex-shrink-0"
                    style={{ color: CHARGE_CATEGORY_COLORS[c.category], backgroundColor: `${CHARGE_CATEGORY_COLORS[c.category]}15` }}
                  >
                    {c.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">{c.article}</span>
                  <span className="text-[10px] font-medium text-slate-300 flex-1">{c.description}</span>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {dossier.notes && (
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Notes</p>
              <p className="text-xs text-slate-400 leading-relaxed bg-[#0B0F1A] border border-[#1F2937] rounded-xl p-3">
                {dossier.notes}
              </p>
            </div>
          )}

          <p className="text-[9px] font-bold text-slate-700 text-right uppercase tracking-widest">
            Créé par {dossier.createdBy}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const SERVICES_WITH_ACCESS = ['USSS', 'LSPD', 'LSSD', 'FIB'];

export default function MdtArrestDossiers() {
  const { mdtUser } = useMdt();

  if (!mdtUser) return null;

  const service = MDT_SERVICES[mdtUser.service];
  const accentColor = service.color;

  // Access guard
  if (!SERVICES_WITH_ACCESS.includes(mdtUser.service)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-red-500/10">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Accès restreint</h1>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest max-w-sm leading-relaxed">
          Les dossiers d'arrestation ne sont pas accessibles au service {mdtUser.service}.
        </p>
      </div>
    );
  }

  return <ArrestDossiersContent accentColor={accentColor} mdtUser={mdtUser} />;
}

function ArrestDossiersContent({
  accentColor,
  mdtUser,
}: {
  accentColor: string;
  mdtUser: { service: string; name: string; mdtRole: string };
}) {
  const [dossiers, setDossiersRaw] = useState<ArrestDossier[]>(() => loadDossiers(mdtUser.service));
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ArrestStatus | 'all'>('all');
  const [selected, setSelected] = useState<ArrestDossier | null>(null);
  const [editing, setEditing] = useState<Partial<ArrestDossier> | null>(null);
  const [creating, setCreating] = useState(false);

  const setDossiers = (fn: (prev: ArrestDossier[]) => ArrestDossier[]) => {
    setDossiersRaw((prev) => {
      const next = fn(prev);
      saveDossiers(mdtUser.service, next);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return dossiers
      .filter((d) => filterStatus === 'all' || d.status === filterStatus)
      .filter((d) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return d.suspect.toLowerCase().includes(q) || d.numero.toLowerCase().includes(q) || d.location.toLowerCase().includes(q);
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [dossiers, search, filterStatus]);

  const handleCreate = (form: Omit<ArrestDossier, 'id' | 'numero'>) => {
    const newD: ArrestDossier = {
      ...form,
      id: genId(),
      numero: genNumero(mdtUser.service),
    };
    setDossiers((prev) => [newD, ...prev]);
    setCreating(false);
  };

  const handleEdit = (form: Omit<ArrestDossier, 'id' | 'numero'>) => {
    if (!editing?.id) return;
    setDossiers((prev) => prev.map((d) => d.id === editing.id ? { ...d, ...form } : d));
    setEditing(null);
    setSelected(null);
  };

  const handleDelete = (id: string) => {
    setDossiers((prev) => prev.filter((d) => d.id !== id));
    setSelected(null);
  };

  const handleStatusChange = (id: string, status: ArrestStatus) => {
    setDossiers((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
    setSelected((prev) => prev?.id === id ? { ...prev, status } : prev);
  };

  const canCreate = mdtUser.mdtRole !== 'agent' || true; // all roles can create arrest dossiers

  const counts = useMemo(() => ({
    en_cours: dossiers.filter((d) => d.status === 'en_cours').length,
    transmis: dossiers.filter((d) => d.status === 'transmis').length,
    clos: dossiers.filter((d) => d.status === 'clos').length,
  }), [dossiers]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Handcuffs className="w-6 h-6" style={{ color: accentColor }} />
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Dossiers d'Arrestation</h1>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            {mdtUser.service} · {dossiers.length} dossier{dossiers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest flex-shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" /> Nouveau dossier
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(counts) as [ArrestStatus, number][]).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
              className={cn(
                'p-4 rounded-xl border transition-all text-left',
                filterStatus === status
                  ? 'border-current'
                  : 'border-[#1F2937] hover:border-slate-600 bg-[#111827]',
              )}
              style={filterStatus === status ? {
                color: cfg.color,
                borderColor: cfg.color,
                backgroundColor: `${cfg.color}08`,
              } : {}}
            >
              <div className="flex items-center gap-2 mb-2" style={filterStatus === status ? { color: cfg.color } : { color: cfg.color }}>
                {cfg.icon}
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{cfg.label}</span>
              </div>
              <p className="text-3xl font-black" style={{ color: cfg.color }}>{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Rechercher par suspect, numéro, lieu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-[#111827] border-[#1F2937] text-white placeholder:text-slate-600 text-xs h-10"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Handcuffs className="w-10 h-10 text-slate-700 mb-3" />
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Aucun dossier trouvé</p>
          </div>
        ) : (
          filtered.map((d) => {
            const cfg = STATUS_CONFIG[d.status];
            const highestCharge = d.charges.find((c) => c.category === 'crime') ?? d.charges[0];
            return (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-[#1F2937] bg-[#111827] hover:border-slate-600 hover:bg-[#111827] transition-all text-left group"
              >
                {/* Status strip */}
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-white uppercase tracking-tight">{d.suspect}</span>
                    {d.charges.length > 0 && (
                      <Badge className="text-[8px] font-black border bg-transparent px-1.5 h-4" style={{ color: CHARGE_CATEGORY_COLORS[highestCharge.category], borderColor: `${CHARGE_CATEGORY_COLORS[highestCharge.category]}40` }}>
                        {d.charges.length} chef{d.charges.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <MapPin className="w-2.5 h-2.5" /> {d.location}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <Calendar className="w-2.5 h-2.5" />
                      {format(new Date(d.date), 'd MMM yyyy', { locale: fr })} {d.time}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">{d.numero}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5 flex-shrink-0" style={{ color: cfg.color }}>
                  {cfg.icon}
                  <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">{cfg.label}</span>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              </button>
            );
          })
        )}
      </div>

      {/* Modals */}
      {creating && (
        <DossierFormModal
          initial={emptyDossier(mdtUser.service, mdtUser.name)}
          onSave={handleCreate}
          onClose={() => setCreating(false)}
          accentColor={accentColor}
        />
      )}

      {editing && (
        <DossierFormModal
          initial={editing}
          onSave={handleEdit}
          onClose={() => setEditing(null)}
          accentColor={accentColor}
        />
      )}

      {selected && !editing && (
        <DossierDetailModal
          dossier={selected}
          accentColor={accentColor}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setSelected(null); }}
          onDelete={() => handleDelete(selected.id)}
          onStatusChange={(s) => handleStatusChange(selected.id, s)}
        />
      )}
    </div>
  );
}
