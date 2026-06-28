import { useState } from "react";
import { FolderOpen, Search, ListFilter as Filter, Plus, ChevronRight, ChevronLeft, Clock, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Users, Download } from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth, ServiceID } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";
import { GovUserAccess, isGovernmentAdmin, isGovernmentGovernor, canAccessGovernmentCase } from '@/lib/government-access';
import { GovDivisionId } from '@/lib/government-rbac';

const PRIORITY_OPTIONS = ['Critique', 'Haute', 'Normale'];
const STATUS_OPTIONS = ['En cours', 'À valider', 'Publié', 'Archivé'];

const Dossiers = () => {
  const { user, hasPermission, logAction } = useAuth();
  const store = useGovernmentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    priority: 'Normale',
  });

  const govAccess: GovUserAccess | null = user ? {
    id: user.id,
    rolesTechniques: (user.govRolesTechniques || ['employee']) as any[],
    divisions: (user.govDivisions || ['administration_generale']) as GovDivisionId[],
    permissions: (user.govPermissions || []) as any[],
    status: user.govStatus || 'actif',
  } : null;

  const allDossiers = store.getGlobalDossiers();

  const filteredDossiers = allDossiers.filter(dossier => {
    const title = dossier.title ?? "";
    const id = dossier.id ?? "";
    const acl = dossier.acl ?? [];

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority.length === 0 || filterPriority.includes(dossier.priority || 'Normale');
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(dossier.status);

    if (!matchesSearch || !matchesPriority || !matchesStatus) return false;

    if (isGovernmentAdmin(govAccess) || isGovernmentGovernor(govAccess)) return true;
    const canAccess = canAccessGovernmentCase(govAccess, { division_id: dossier.division_id });
    const isOwner = dossier.service_id === user?.service_id;
    const inACL = user?.id ? acl.includes(user.id) : false;
    return canAccess || isOwner || inACL;
  });

  const handleCreateDossier = () => {
    if (!createForm.title.trim() || !user) return;
    const serviceId = (user.govDivisions?.[0] || 'administration_generale').toUpperCase();
    const newDossier = {
      id: `DOS-${Date.now()}`,
      title: createForm.title.trim(),
      description: createForm.description.trim(),
      priority: createForm.priority,
      status: 'En cours',
      archived: false,
      acl: [user.id],
      creationDate: new Date().toISOString(),
      division_id: user.govDivisions?.[0] || 'administration_generale',
      participants: [{ id: user.id, name: user.name, role: user.role }],
      progress: 0,
    };
    store.createDossier(serviceId, newDossier);
    logAction('Création dossier', { title: newDossier.title });
    setShowCreateModal(false);
    setCreateForm({ title: '', description: '', priority: 'Normale' });
  };

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Titre', 'Service', 'Priorité', 'Statut', 'Date Création'],
      ...filteredDossiers.map(d => [
        d.id,
        d.title,
        d.service_name || '',
        d.priority || '',
        d.status,
        d.creationDate ? new Date(d.creationDate).toLocaleDateString('fr-FR') : ''
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dossiers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logAction('Export CSV dossiers');
  };

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const activeFilterCount = filterPriority.length + filterStatus.length;

  return (
    <IntranetLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/intranet">
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 text-slate-400 hover:text-primary rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Gestion des Dossiers</h1>
              <p className="text-slate-500 font-medium italic">Administration et suivi des dossiers gouvernementaux en cours.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission('dossiers:create') && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Dossier
              </Button>
            )}
            <Button
              variant="outline"
              className="border-slate-300 font-bold flex items-center gap-2"
              onClick={handleExportCSV}
            >
              <Download className="w-4 h-4" />
              Rapports
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un dossier par titre ou ID..."
                  className="pl-10 h-10 border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 font-bold border-slate-200 relative">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 space-y-4" align="end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Priorité</p>
                    <div className="flex flex-wrap gap-2">
                      {PRIORITY_OPTIONS.map(p => (
                        <button
                          key={p}
                          onClick={() => toggleFilter(filterPriority, p, setFilterPriority)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold border transition-all",
                            filterPriority.includes(p)
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-slate-600 border-slate-200 hover:border-primary"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Statut</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => toggleFilter(filterStatus, s, setFilterStatus)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold border transition-all",
                            filterStatus.includes(s)
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-slate-600 border-slate-200 hover:border-primary"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-slate-400 text-xs font-bold"
                      onClick={() => { setFilterPriority([]); setFilterStatus([]); }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredDossiers.map((dossier) => (
            <Card key={dossier.id} className="border-none shadow-md hover:shadow-lg transition-all group overflow-hidden">
              <div className="flex items-center p-6 gap-6">
                <div className={cn(
                  "h-16 w-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform",
                  dossier.priority === 'Critique' ? "bg-red-50 text-red-600" :
                  dossier.priority === 'Haute' ? "bg-amber-50 text-amber-600" :
                  "bg-blue-50 text-blue-600"
                )}>
                  <FolderOpen className="w-8 h-8" />
                </div>

                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-primary uppercase tracking-widest">{dossier.id}</span>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-slate-200">
                      {dossier.service_name}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                    {dossier.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Créé: {dossier.creationDate ? new Date(dossier.creationDate).toLocaleDateString('fr-FR') : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> Membres: {dossier.participants?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                  <Badge className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3",
                    dossier.status === 'En cours' ? 'bg-blue-600' :
                    dossier.status === 'À valider' ? 'bg-amber-500' :
                    dossier.status === 'Publié' ? 'bg-emerald-600' :
                    'bg-slate-600'
                  )}>
                    {dossier.status}
                  </Badge>
                  <Link to={`/intranet/dossiers/${dossier.id}`}>
                    <Button variant="ghost" className="font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 gap-2">
                      Consulter <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}

          {filteredDossiers.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl shadow-inner border border-dashed border-slate-200">
              <AlertTriangle className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-sm">Aucun dossier accessible</p>
              <p className="text-xs">Vous ne disposez peut-être pas des habilitations nécessaires pour consulter les dossiers de ce secteur.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">Nouveau Dossier</DialogTitle>
            <DialogDescription>Créez un nouveau dossier gouvernemental.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">Titre du dossier *</label>
              <Input
                placeholder="Ex: Réforme du code pénal 2024"
                value={createForm.title}
                onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">Description</label>
              <textarea
                placeholder="Description du dossier..."
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm font-medium focus:ring-primary focus:border-primary outline-none resize-none h-24"
                value={createForm.description}
                onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">Priorité</label>
              <div className="flex gap-2">
                {PRIORITY_OPTIONS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCreateForm(f => ({ ...f, priority: p }))}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                      createForm.priority === p
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Annuler</Button>
            <Button onClick={handleCreateDossier} disabled={!createForm.title.trim()}>
              Créer le Dossier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IntranetLayout>
  );
};

export default Dossiers;
