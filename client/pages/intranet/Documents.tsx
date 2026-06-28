import { useState } from "react";
import { FileText, Search, ListFilter as Filter, Plus, Download, Printer, Share2, MoveVertical as MoreVertical, ChevronRight, ChevronLeft, FileCheck, FileClock, FileLock2, FileWarning, FolderOpen, Users, Eye, CreditCard as Edit3, Trash2, ArrowUpDown, ShieldCheck } from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { useAuth, Permission, ServiceID } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";
import { GovUserAccess, isGovernmentAdmin, isGovernmentGovernor, canAccessGovernmentDocument } from '@/lib/government-access';
import { GovDivisionId } from '@/lib/government-rbac';

const Documents = () => {
  const { user, hasPermission, logAction } = useAuth();
  const store = useGovernmentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", type: "Rapport", content: "" });

  const govAccess: GovUserAccess | null = user ? {
    id: user.id,
    rolesTechniques: (user.govRolesTechniques || ['employee']) as any[],
    divisions: (user.govDivisions || ['administration_generale']) as GovDivisionId[],
    permissions: (user.govPermissions || []) as any[],
    status: user.govStatus || 'actif',
  } : null;

  const documents = store.getGlobalDocuments();

  const linkify = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{part}</a>;
      }
      return part;
    });
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = (filterType === "all" || doc.type === filterType);

    if (isGovernmentAdmin(govAccess) || isGovernmentGovernor(govAccess)) {
      return matchesSearch && matchesType;
    }
    const canAccess = canAccessGovernmentDocument(govAccess, { division_id: doc.division_id });
    const isOwner = doc.service_id === user?.service_id;
    const inACL = user?.id && doc.acl.includes(user.id);

    return matchesSearch && matchesType && (canAccess || isOwner || inACL);
  }).sort((a, b) => sortAsc
    ? a.title.localeCompare(b.title)
    : b.title.localeCompare(a.title)
  );

  const handleAction = (action: string, docTitle: string) => {
    logAction(`${action} sur le document: ${docTitle}`);
  };

  const handleDownload = (doc: any) => {
    const content = doc.content || `${doc.title}\n\nType: ${doc.type}\nStatut: ${doc.status}\nAuteur: ${doc.author}\nDate: ${doc.date}\n\nAucun contenu disponible.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${doc.id}-${doc.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    logAction('Telechargement document', { docId: doc.id, title: doc.title });
  };

  const handlePrintList = () => {
    const printContent = filteredDocs.map(d => `${d.id} | ${d.title} | ${d.type} | ${d.status} | ${d.date}`).join('\n');
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<pre style="font-family:monospace;padding:20px">${printContent}</pre>`);
      win.print();
    }
  };

  const handleCreateDocument = () => {
    if (!createForm.title.trim()) { alert("Titre requis"); return; }
    const serviceId = user?.service_id || 'CABINET';
    const doc = {
      id: `DOC-${Date.now()}`,
      title: createForm.title,
      type: createForm.type,
      content: createForm.content,
      status: 'Brouillon',
      date: new Date().toISOString().slice(0, 10),
      author: user?.name || 'Systeme',
      archived: false,
      acl: [],
      division_id: (user as any)?.govDivisions?.[0] || null,
    };
    store.createDocument(serviceId, doc);
    logAction('Creation document', { id: doc.id, title: doc.title });
    setShowCreateModal(false);
    setCreateForm({ title: '', type: 'Rapport', content: '' });
  };

  return (
    <IntranetLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/intranet">
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 text-slate-400 hover:text-primary rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Bibliothèque de Documents</h1>
              <p className="text-slate-500 font-medium italic">Accédez à l'ensemble des documents officiels et archives de l'État.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission('documents:create') && (
              <Button className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Nouveau Document
              </Button>
            )}
            <Button variant="outline" className="border-slate-300 font-bold flex items-center gap-2" onClick={handlePrintList}>
              <Printer className="w-4 h-4" />
              Imprimer Liste
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher par titre, ID, auteur..." 
                  className="pl-10 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Type de Document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="Décret">Décret</SelectItem>
                    <SelectItem value="Arrêté">Arrêté</SelectItem>
                    <SelectItem value="Rapport">Rapport</SelectItem>
                    <SelectItem value="Mandat">Mandat</SelectItem>
                    <SelectItem value="Licence">Licence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-grow h-10 font-bold border-slate-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres Avancés
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200" onClick={() => setSortAsc(s => !s)} title={sortAsc ? "Z → A" : "A → Z"}>
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Grid/Table */}
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID / Type</th>
                    <th className="px-6 py-4">Titre du Document</th>
                    <th className="px-6 py-4">Service / Auteur</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[11px] font-black text-primary">{doc.id}</span>
                          <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-tighter px-1.5 py-0 border-slate-200">
                            {doc.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div { ... (doc.content ? { onClick: () => { setSelectedDocId(doc.id); setShowViewModal(true); }, className: "cursor-pointer" } : {}) } className={cn(
                            "p-2 rounded-lg",
                            doc.status === 'Signé' ? "bg-emerald-50 text-emerald-600" :
                            doc.status === 'Brouillon' ? "bg-slate-100 text-slate-500" :
                            doc.status === 'En relecture' ? "bg-amber-50 text-amber-600" :
                            "bg-blue-50 text-blue-600"
                          )}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <span onClick={() => { if(doc.content) { setSelectedDocId(doc.id); setShowViewModal(true); } }} className={cn("text-sm font-bold text-slate-900 group-hover:text-primary transition-colors", doc.content && "cursor-pointer")}>{doc.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-slate-700">{doc.service_name}</span>
                          <span className="text-[10px] font-medium text-slate-500">{doc.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{doc.date}</td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5",
                          doc.status === 'Signé' ? 'bg-emerald-600 text-white' :
                          doc.status === 'En relecture' ? 'bg-amber-500 text-white' :
                          doc.status === 'Brouillon' ? 'bg-slate-400 text-white' :
                          doc.status === 'Publié' ? 'bg-blue-600 text-white' :
                          'bg-slate-900 text-white'
                        )}>
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-primary"
                            title="Voir"
                            onClick={() => { setSelectedDocId(doc.id); setShowViewModal(true); }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {hasPermission('documents:edit') && (doc.service_id === user?.service_id || user?.role === 'gouverneur') && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary" title="Modifier">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 font-bold text-xs uppercase tracking-tighter">
                              <DropdownMenuLabel>Actions Gouvernementales</DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              {doc.status === 'Brouillon' && hasPermission('documents:submit_review') && (
                                <DropdownMenuItem className="flex items-center gap-2 text-blue-600" onClick={() => handleAction('Soumission relecture', doc.title)}>
                                  <FileClock className="w-4 h-4" /> Soumettre relecture
                                </DropdownMenuItem>
                              )}

                              {doc.status === 'En relecture' && hasPermission('documents:approve_service') && doc.service_id === user?.service_id && (
                                <DropdownMenuItem className="flex items-center gap-2 text-emerald-600" onClick={() => handleAction('Validation Service', doc.title)}>
                                  <FileCheck className="w-4 h-4" /> Valider (Service)
                                </DropdownMenuItem>
                              )}

                              {hasPermission('documents:approve_state') && (
                                <DropdownMenuItem className="flex items-center gap-2 text-amber-600" onClick={() => handleAction('Approbation État', doc.title)}>
                                  <ShieldCheck className="w-4 h-4" /> Approuver (État)
                                </DropdownMenuItem>
                              )}

                              {hasPermission('documents:sign') && (
                                <DropdownMenuItem className="flex items-center gap-2 text-primary font-black" onClick={() => handleAction('Signature officielle', doc.title)}>
                                  <Edit3 className="w-4 h-4" /> Signer le Document
                                </DropdownMenuItem>
                              )}

                              {hasPermission('documents:publish') && (
                                <DropdownMenuItem className="flex items-center gap-2 text-indigo-600" onClick={() => handleAction('Publication', doc.title)}>
                                  <Share2 className="w-4 h-4" /> Publier
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleDownload(documents.find(d => d.id === doc.id))}>
                                <Download className="w-4 h-4" /> Telecharger
                              </DropdownMenuItem>

                              {hasPermission('documents:archive') && (
                                <DropdownMenuItem className="flex items-center gap-2 text-slate-500" onClick={() => handleAction('Archivage', doc.title)}>
                                  <FileLock2 className="w-4 h-4" /> Archiver
                                </DropdownMenuItem>
                              )}

                              {hasPermission('documents:delete') && (
                                <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={() => handleAction('Suppression', doc.title)}>
                                  <Trash2 className="w-4 h-4" /> Supprimer
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDocs.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <FileWarning className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-sm">Aucun document trouvé</p>
                <p className="text-xs">Modifiez vos filtres ou effectuez une nouvelle recherche.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories / Quick Filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-red-50 text-red-600 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
              <FileLock2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Décrets</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FileCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Arrêtés</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-all">
              <FileClock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Mandats</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Rapports</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-full group-hover:bg-slate-600 group-hover:text-white transition-all">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Dossiers</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Licences</span>
          </button>
        </div>
      </div>

      {/* Document View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl bg-white rounded-3xl p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
          {selectedDocId && (
            <>
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 text-left border-b pb-6">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    {documents.find(d => d.id === selectedDocId)?.title}
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    #{selectedDocId} • {documents.find(d => d.id === selectedDocId)?.service_name}
                  </DialogDescription>
                </div>
                <Badge className={cn(
                  "text-[9px] font-black uppercase tracking-widest px-3 py-1",
                  documents.find(d => d.id === selectedDocId)?.status === 'Signé' ? 'bg-emerald-600 text-white' :
                  documents.find(d => d.id === selectedDocId)?.status === 'En relecture' ? 'bg-amber-500 text-white' :
                  documents.find(d => d.id === selectedDocId)?.status === 'Brouillon' ? 'bg-slate-400 text-white' :
                  'bg-blue-600 text-white'
                )}>
                  {documents.find(d => d.id === selectedDocId)?.status}
                </Badge>
              </DialogHeader>

              <div className="my-8 p-8 bg-slate-50 rounded-2xl border border-slate-100 min-h-[400px]">
                <div className="whitespace-pre-wrap text-sm text-slate-700 font-medium leading-relaxed text-left">
                  {linkify(documents.find(d => d.id === selectedDocId)?.content || "AUCUN CONTENU DISPONIBLE POUR CE DOCUMENT OFFICIEL.")}
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center w-full">
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="font-bold uppercase text-[10px] tracking-widest h-10 px-6 gap-2" onClick={() => handleDownload(documents.find(d => d.id === selectedDocId))}>
                    <Download className="w-4 h-4" /> Telecharger
                  </Button>
                </div>
                <Button
                  onClick={() => setShowViewModal(false)}
                  className="bg-[#1B365D] text-white font-bold uppercase text-[10px] tracking-widest h-10 px-8 rounded-xl shadow-xl shadow-blue-900/10"
                >
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Create Document Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">Nouveau Document</DialogTitle>
            <DialogDescription>Creez un nouveau document gouvernemental en brouillon.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Titre</label>
              <Input placeholder="Titre du document" value={createForm.title} onChange={e => setCreateForm({ ...createForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Type</label>
              <Select value={createForm.type} onValueChange={v => setCreateForm({ ...createForm, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Rapport', 'Decret', 'Arrete', 'Mandat', 'Licence', 'Note Interne'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Contenu (optionnel)</label>
              <textarea
                className="w-full h-32 border border-slate-200 rounded-lg p-3 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Contenu du document..."
                value={createForm.content}
                onChange={e => setCreateForm({ ...createForm, content: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)} className="font-bold uppercase text-[10px]">Annuler</Button>
            <Button onClick={handleCreateDocument} className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold uppercase text-[10px]">Creer le Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IntranetLayout>
  );
};

export default Documents;
