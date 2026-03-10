import React from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ChevronRight,
  Lock,
  UserCheck,
  Calendar,
  ShieldAlert,
  Search as SearchIcon,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Archive,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useLegalRBAC } from '@/pages/cabinet/intranet/LegalIntranetLayout';
import { Link, useLocation } from 'react-router-dom';
import { legalStore } from '@/lib/legal-store';
import { useLegalStore } from '@/hooks/useLegalStore';
import { useAuth } from '@/contexts/AuthContext';
import { Case, CaseType, ConfidentialityLevel, Client } from '@shared/api';

const Dossiers = () => {
  const store = useLegalStore();
  const { isAssocié } = useLegalRBAC();
  const { user } = useAuth();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showQuickClientModal, setShowQuickClientModal] = React.useState(false);
  const [showConflictModal, setShowConflictModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [conflictSearchQuery, setConflictSearchQuery] = React.useState('');
  const [conflictResult, setConflictResult] = React.useState<'none' | 'conflict' | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [newClient, setNewClient] = React.useState<Partial<Client>>({
    name: '',
    type: 'Individu'
  });

  // Handle "action=new" from Header
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      // Clear action=new from URL to allow re-triggering from header if needed
      window.history.replaceState({}, '', location.pathname);
      setShowConflictModal(true);
    }
  }, [location]);

  // Create Case Form State
  const [newCase, setNewCase] = React.useState<Partial<Case>>({
    title: '',
    description: '',
    client_id: '',
    type: 'Pénal',
    confidentiality: 'Normal',
  });

  const cases = store.getCases().filter(c => c.status !== 'Archivé');
  const clients = store.getClients();

  const handleQuickAddClient = () => {
    if (!newClient.name || !user) return;
    const client: Client = {
      id: `cli-${Date.now()}`,
      name: newClient.name,
      type: (newClient.type as 'Individu' | 'Entreprise') || 'Individu',
      created_at: new Date().toISOString().split('T')[0]
    };
    store.createClient(client);
    setNewCase(prev => ({ ...prev, client_id: client.id }));
    setShowQuickClientModal(false);
    setNewClient({ name: '', type: 'Individu' });
  };

  const handleConflictCheck = () => {
    if (!user) return;
    const check = store.performConflictCheck(conflictSearchQuery, user.id);
    setConflictResult(check.result === 'Pass' ? 'none' : 'conflict');

    store.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Vérification conflit intérêts',
      target_type: 'ConflictCheck',
      target_id: check.id,
      metadata: { query: conflictSearchQuery, result: check.result }
    });
  };

  const handleCreateCase = () => {
    if (!user) return;

    if (!newCase.title || !newCase.client_id) {
      setError("Veuillez remplir l'intitulé et sélectionner un client.");
      return;
    }

    const caseToCreate: Case = {
      id: `HC-2024-${String(cases.length + 1).padStart(3, '0')}`,
      title: newCase.title,
      description: newCase.description,
      client_id: newCase.client_id,
      type: (newCase.type as CaseType) || 'Pénal',
      status: 'Ouvert',
      confidentiality: (newCase.confidentiality as ConfidentialityLevel) || 'Normal',
      lead_id: user.id,
      members: [{ user_id: user.id, name: user.name, role: user.role, avatar: user.id }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.createCase(caseToCreate);
    setShowCreateModal(false);
    setShowConflictModal(false);
    setConflictResult(null);
    setConflictSearchQuery('');
    setError(null);
    setNewCase({ title: '', description: '', client_id: '', type: 'Pénal', confidentiality: 'Normal' });

    store.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Création dossier',
      target_type: 'Case',
      target_id: caseToCreate.id,
      metadata: { title: caseToCreate.title }
    });
  };

  const handleArchiveCase = (id: string) => {
    if (!user) return;
    store.archiveCase(id, user.id);
  };

  const handleDeleteCase = (id: string) => {
    if (!user) return;
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible.")) {
      store.deleteCase(id, user.id);
    }
  };

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des Dossiers</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Index centralisé des affaires • {cases.length} dossiers enregistrés
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="RECHERCHER..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-10 text-[10px] font-black uppercase tracking-widest focus:ring-2 ring-[#c1a461]/20 transition-all"
               />
            </div>
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Filter className="w-4 h-4" /> Filtrer
            </Button>
            <Button
              onClick={() => setShowQuickClientModal(true)}
              variant="outline"
              className="border-[#c1a461] text-[#c1a461] text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2"
            >
              <Plus className="w-4 h-4" /> Nouveau Client
            </Button>
            <Button
              onClick={() => setShowConflictModal(true)}
              className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2"
            >
              <Plus className="w-4 h-4" /> Nouveau Dossier
            </Button>
          </div>
        </div>

        {/* Audit Banner for Conflict Check */}
        <Card className="bg-amber-50 border-amber-100 border shadow-none rounded-2xl overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Audit de Conflit Obligatoire</p>
                <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest">Tout nouveau dossier doit faire l'objet d'une vérification préalable dans la base centralisée.</p>
              </div>
            </div>
            <Button
              onClick={() => setShowConflictModal(true)}
              variant="outline"
              className="border-amber-200 text-amber-700 text-[9px] font-black uppercase tracking-widest hover:bg-amber-100"
            >
              Lancer un Audit
            </Button>
          </CardContent>
        </Card>

        {/* Conflict Check Modal */}
        <Dialog open={showConflictModal} onOpenChange={setShowConflictModal}>
          <DialogContent className="max-w-2xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Vérification de Conflit d'Intérêts</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Recherchez si le client potentiel ou la partie adverse figure déjà dans nos archives.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 my-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du Client ou de la Partie Adverse</Label>
                <div className="relative group">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#c1a461] transition-colors" />
                  <Input
                    value={conflictSearchQuery}
                    onChange={(e) => setConflictSearchQuery(e.target.value)}
                    placeholder="EX: MARTIN MADRAZO..."
                    className="h-14 bg-slate-50 border-none rounded-2xl pl-12 text-sm font-bold uppercase tracking-widest focus:ring-2 ring-[#c1a461]/20 transition-all"
                  />
                </div>
              </div>

              {conflictResult === 'none' && (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top duration-500">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-emerald-900 uppercase tracking-tight">Aucun conflit détecté</p>
                      <p className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest mt-1">L'entité n'est pas présente dans nos dossiers actuels. Vous pouvez procéder à la création du dossier.</p>
                    </div>
                  </div>
                    <div className="flex gap-4 mt-4">
                      <Button
                        onClick={() => {
                          setShowConflictModal(false);
                          setShowCreateModal(true);
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl shadow-lg"
                      >
                        Procéder à la Création
                      </Button>
                      <Button
                        onClick={() => {
                          setNewClient({ ...newClient, name: conflictSearchQuery });
                          setShowConflictModal(false);
                          setShowQuickClientModal(true);
                        }}
                        variant="outline"
                        className="flex-1 border-emerald-200 text-emerald-700 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl"
                      >
                        Ajouter Client uniquement
                      </Button>
                    </div>
                  </div>
              )}

              {conflictResult === 'conflict' && (
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top duration-500">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-red-900 uppercase tracking-tight">CONFLIT D'INTÉRÊTS DÉTECTÉ</p>
                      <p className="text-[10px] font-bold text-red-700/60 uppercase tracking-widest mt-1">L'entité est déjà cliente ou partie adverse dans un dossier actif. Création bloquée par le système.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowConflictModal(false);
                  setConflictResult(null);
                  setConflictSearchQuery('');
                }}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest h-12"
              >
                Annuler
              </Button>
              <Button
                onClick={handleConflictCheck}
                className="bg-[#c1a461] hover:bg-[#927843] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-[#c1a461]/10"
              >
                Lancer la Vérification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Case Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Ouverture de Dossier</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Configurez les paramètres initiaux du nouveau dossier juridique.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-8">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top duration-300">
                  {error}
                </div>
              )}
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intitulé du Dossier</Label>
                <Input
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  placeholder="EX: ÉTAT DE SA VS. JOHN DOE..."
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold uppercase tracking-widest focus:ring-2 ring-[#c1a461]/20 transition-all"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description / Notes de Synthèse</Label>
                <Textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="RÉSUMÉ DE L'AFFAIRE, ÉLÉMENTS CLÉS, LIENS UTILES..."
                  className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-[#c1a461]/20 transition-all min-h-[120px]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Assigné</Label>
                  <Button
                    variant="link"
                    onClick={() => setShowQuickClientModal(true)}
                    className="text-[9px] font-black text-[#c1a461] uppercase p-0 h-auto"
                  >
                    + Nouveau Client
                  </Button>
                </div>
                <Select value={newCase.client_id} onValueChange={(val) => setNewCase({ ...newCase, client_id: val })}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold uppercase tracking-widest">
                    <SelectValue placeholder="Sélectionner un client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de Pôle</Label>
                  <Select value={newCase.type} onValueChange={(val) => setNewCase({ ...newCase, type: val as CaseType })}>
                    <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold uppercase tracking-widest">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pénal">Droit Pénal</SelectItem>
                      <SelectItem value="Civil">Droit Civil</SelectItem>
                      <SelectItem value="Affaires">Droit des Affaires</SelectItem>
                      <SelectItem value="Admin">Droit Administratif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confidentialité</Label>
                  <Select value={newCase.confidentiality} onValueChange={(val) => setNewCase({ ...newCase, confidentiality: val as ConfidentialityLevel })}>
                    <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold uppercase tracking-widest">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Confidentiel">Confidentiel</SelectItem>
                      <SelectItem value="Secret">Secret</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest h-12"
              >
                Retour
              </Button>
              <Button
                onClick={handleCreateCase}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-10 rounded-xl shadow-xl shadow-black/10"
              >
                Créer le Dossier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Add Client Modal */}
        <Dialog open={showQuickClientModal} onOpenChange={setShowQuickClientModal}>
          <DialogContent className="max-w-md bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Ajout Rapide Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 my-6">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom complet</Label>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="EX: MICHEL FONTAINE..."
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</Label>
                <Select
                  value={newClient.type}
                  onValueChange={(val) => setNewClient({ ...newClient, type: val as any })}
                >
                  <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individu">Individu</SelectItem>
                    <SelectItem value="Entreprise">Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowQuickClientModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleQuickAddClient}
                disabled={!newClient.name}
                className="bg-[#c1a461] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-[#c1a461]/10"
              >
                Ajouter Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro / Dossier</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut / Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidentialité</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsable</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCases.map((item, idx) => {
                  const isSealed = item.confidentiality === 'Scellé';
                  const client = store.getClient(item.client_id);
                  const lead = item.members.find(m => m.user_id === item.lead_id);

                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <Link to={`/cabinet/intranet/dossiers/${item.id}`} className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{client?.name || 'Inconnu'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.status}</Badge>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1",
                          item.confidentiality === 'Scellé' ? 'bg-[#0a0f18] text-white' :
                          item.confidentiality === 'Secret' ? 'bg-red-600 text-white' :
                          item.confidentiality === 'Confidentiel' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                        )}>
                          {isSealed && <Lock className="w-2 h-2 mr-1 inline-block" />}
                          {item.confidentiality}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{lead?.name || 'Non assigné'}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border-slate-100 rounded-xl shadow-xl p-2">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchiveCase(item.id);
                              }}
                              className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#c1a461] p-3 rounded-lg cursor-pointer flex gap-3"
                            >
                              <Archive className="w-4 h-4" /> Archiver
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCase(item.id);
                              }}
                              className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 p-3 rounded-lg cursor-pointer flex gap-3"
                            >
                              <Trash2 className="w-4 h-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredCases.length === 0 && (
              <div className="p-20 text-center space-y-6">
                <div className="p-6 bg-slate-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-slate-200">
                  <FolderOpen className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Aucun dossier trouvé</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Affinez votre recherche ou commencez une nouvelle affaire.</p>
                </div>
                <Button
                  onClick={() => setShowConflictModal(true)}
                  className="bg-[#c1a461] hover:bg-[#927843] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-[#c1a461]/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> Ouvrir un Dossier
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
};

export default Dossiers;
