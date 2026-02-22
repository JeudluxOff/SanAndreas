import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  ChevronLeft, 
  Clock, 
  Users, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  MoreVertical, 
  Plus, 
  Lock,
  ArrowRight,
  Download,
  History,
  CheckCircle2,
  AlertTriangle,
  Gavel,
  MessageSquare,
  UserPlus,
  Send,
  Eye,
  Activity,
  Archive,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';
import { useLegalStore } from '@/hooks/useLegalStore';
import { useAuth } from '@/contexts/AuthContext';
import { Case, LegalDocument, Evidence, Task, Hearing, DocumentCategory, ConfidentialityLevel, CaseStatus, InternalNote } from '@shared/api';

const DossierDetail = () => {
  const store = useLegalStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');

  const dossier = store.getCase(id || '');
  const [localStatus, setLocalStatus] = React.useState<string>(dossier?.status || '');
  const docs = store.getDocuments(id).filter(d => d.status !== 'Archivé');
  const evidences = store.getEvidence(id || '');
  const tasks = store.getTasks(id);
  const [members, setMembers] = React.useState(dossier?.members || []);
  const hearings = store.getHearings().filter(h => h.case_id === id);
  const client = dossier ? store.getClient(dossier.client_id) : null;
  const auditLogs = store.getAuditLogs().filter(log => log.target_id === id);

  // Modals state
  const [showDocModal, setShowDocModal] = React.useState(false);
  const [showDocViewModal, setShowDocViewModal] = React.useState(false);
  const [showEviModal, setShowEviModal] = React.useState(false);
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const [showStatusModal, setShowStatusModal] = React.useState(false);
  const [showProgressionModal, setShowProgressionModal] = React.useState(false);
  const [showMemberModal, setShowMemberModal] = React.useState(false);
  const [showEviViewModal, setShowEviViewModal] = React.useState(false);
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
  const [selectedEviId, setSelectedEviId] = React.useState<string | null>(null);

  // Form states
  const [newDoc, setNewDoc] = React.useState({ title: '', category: 'Conclusions' as DocumentCategory, content: '' });
  const [newEvi, setNewEvi] = React.useState({ name: '', type: 'Document', content: '', images: [] as string[], confidentiality: 'Normal' as ConfidentialityLevel });
  const [newTask, setNewTask] = React.useState({ title: '', priority: 'Moyenne' as any });
  const [progression, setProgression] = React.useState(dossier?.progression || 0);
  const [stepDescription, setStepDescription] = React.useState(dossier?.step_description || '');
  const [caseDescription, setCaseDescription] = React.useState(dossier?.description || '');
  const [newMember, setNewMember] = React.useState({ user_id: '', name: '', role: '' });
  const [internalNotes, setInternalNotes] = React.useState<InternalNote[]>(dossier?.internal_notes || []);
  const [newNote, setNewNote] = React.useState('');

  const staff = store.getStaff();

  const linkify = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#c1a461] hover:underline break-all">{part}</a>;
      }
      return part;
    });
  };

  const handleUpdateCase = (updates: Partial<Case>) => {
    if (!dossier || !user) return;
    const updatedCase = { ...dossier, ...updates, updated_at: new Date().toISOString() };
    store.updateCase(updatedCase);
    // Refresh local state if needed (not all fields have local state)
    if (updates.status) setLocalStatus(updates.status);
    if (updates.progression !== undefined) setProgression(updates.progression);
    if (updates.step_description !== undefined) setStepDescription(updates.step_description);
    if (updates.description !== undefined) setCaseDescription(updates.description);
    if (updates.members) setMembers(updates.members);
    if (updates.internal_notes) setInternalNotes(updates.internal_notes);

    store.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Mise à jour dossier',
      target_type: 'Case',
      target_id: dossier.id,
      metadata: updates
    });
  };

  const handleAddMember = () => {
    if (!dossier || !newMember.user_id) return;
    const memberExists = members.some(m => m.user_id === newMember.user_id);
    if (memberExists) return;

    const selectedStaff = staff.find(s => s.id === newMember.user_id);
    if (!selectedStaff) return;

    const updatedMembers = [...members, {
      user_id: selectedStaff.id,
      name: selectedStaff.name,
      role: selectedStaff.role,
      avatar: selectedStaff.avatar || selectedStaff.id
    }];

    handleUpdateCase({ members: updatedMembers });
    setShowMemberModal(false);
    setNewMember({ user_id: '', name: '', role: '' });
  };

  const handleRemoveMember = (userId: string) => {
    if (!dossier || dossier.lead_id === userId) return; // Can't remove lead
    const updatedMembers = dossier.members.filter(m => m.user_id !== userId);
    handleUpdateCase({ members: updatedMembers });
  };

  const handleAddNote = () => {
    if (!user || !dossier || !newNote.trim()) return;
    const note: InternalNote = {
      id: `NOTE-${Date.now()}`,
      author_id: user.id,
      author_name: user.name,
      content: newNote.trim(),
      timestamp: new Date().toISOString()
    };
    const updatedNotes = [...internalNotes, note];
    handleUpdateCase({ internal_notes: updatedNotes });
    setNewNote('');
  };

  const handleCreateDoc = () => {
    if (!user || !id || !newDoc.title) return;
    const doc: LegalDocument = {
      id: `HC-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      case_id: id,
      title: newDoc.title,
      content: newDoc.content,
      category: newDoc.category,
      status: 'Brouillon',
      current_version: 1,
      versions: [{ version: 1, file_url: '#', created_at: new Date().toISOString(), created_by: user.id }],
      signatures: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.createDocument(doc);
    setShowDocModal(false);
    setNewDoc({ title: '', category: 'Conclusions', content: '' });
  };

  const handleCreateEvi = () => {
    if (!user || !id || !newEvi.name) return;
    const evi: Evidence = {
      id: `EVI-${Date.now()}`,
      case_id: id,
      name: newEvi.name,
      type: newEvi.type,
      content: newEvi.content,
      images: newEvi.images,
      file_url: '#',
      confidentiality: newEvi.confidentiality,
      uploaded_by: user.name,
      uploaded_at: new Date().toISOString(),
      to_produce_at_hearing: false
    };
    store.addEvidence(evi);
    setShowEviModal(false);
    setNewEvi({ name: '', type: 'Document', content: '', images: [], confidentiality: 'Normal' });
  };

  const handleCreateTask = () => {
    if (!user || !id || !newTask.title) return;
    const task: Task = {
      id: `TSK-${Date.now()}`,
      case_id: id,
      title: newTask.title,
      priority: newTask.priority,
      status: 'Todo',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: user.id,
      created_at: new Date().toISOString()
    };
    store.createTask(task);
    setShowTaskModal(false);
    setNewTask({ title: '', priority: 'Moyenne' });
  };

  const handleSeal = () => {
    if (!id || !user) return;
    store.sealCase(id, user.id);
    setLocalStatus('Scellé');
    store.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Scellement Dossier',
      target_type: 'Case',
      target_id: id,
      metadata: { reason: 'Demande manuelle de scellement' }
    });
  };

  const handleClose = () => {
    if (!id || !user) return;
    store.closeCase(id, user.id);
    setLocalStatus('Clos');
    store.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Clôture Dossier',
      target_type: 'Case',
      target_id: id,
      metadata: { reason: 'Affaire terminée' }
    });
  };

  const handleArchiveCase = () => {
    if (!id || !user) return;
    store.archiveCase(id, user.id);
    setLocalStatus('Archivé');
  };

  const handleDeleteCase = () => {
    if (!id || !user) return;
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible.")) {
      store.deleteCase(id, user.id);
      navigate('/cabinet/intranet/dossiers');
    }
  };

  const handleArchiveDoc = (docId: string) => {
    if (!id || !user) return;
    store.archiveDocument(docId, user.id);
  };

  const handleDeleteDoc = (docId: string) => {
    if (!id || !user) return;
    if (confirm("Supprimer ce document ?")) {
      store.deleteDocument(docId, user.id);
    }
  };

  const handleDeleteEvi = (eviId: string) => {
    if (!id || !user) return;
    if (confirm("Supprimer cette preuve ?")) {
      store.deleteEvidence(eviId, user.id);
    }
  };

  // Security check for Sealed cases
  React.useEffect(() => {
    if (dossier?.confidentiality === 'Scellé') {
      if (user?.role !== 'admin' && user?.role !== 'gouverneur') {
        navigate('/cabinet/intranet/dossiers');
        return;
      }
      
      // Log access to sealed dossier
      if (user) {
        store.logAction({
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user_id: user.id,
          user_name: user.name,
          action: 'Accès Dossier Scellé',
          target_type: 'Case',
          target_id: dossier.id,
          metadata: { reason: 'Consultation dossier scellé' }
        });
      }
    }
  }, [dossier, user, navigate]);

  if (!dossier) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-black uppercase tracking-widest text-slate-400">Dossier non trouvé</h2>
      <Link to="/cabinet/intranet/dossiers">
        <Button variant="link" className="text-[#c1a461] uppercase mt-4">Retour aux dossiers</Button>
      </Link>
    </div>
  );

  return (
    <div className="p-10 space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/cabinet/intranet/dossiers">
              <Button variant="ghost" className="h-12 w-12 rounded-2xl border border-slate-200 text-slate-400 hover:text-[#c1a461]">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{dossier.id}</span>
                <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0", 
                  dossier.confidentiality === 'Scellé' ? 'bg-[#0a0f18] text-white' :
                  dossier.confidentiality === 'Secret' ? 'bg-red-600 text-white' :
                  dossier.confidentiality === 'Confidentiel' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                )}>
                  {dossier.confidentiality}
                </Badge>
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{dossier.title}</h2>
            </div>
          </div>
          
          <div className="flex gap-4">
            {localStatus !== 'Scellé' && localStatus !== 'Clos' && (
               <Button
                onClick={handleSeal}
                variant="outline"
                className="border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest h-12 px-6 gap-2 hover:bg-red-50"
               >
                 <Lock className="w-4 h-4" /> Sceller Dossier
               </Button>
            )}
            {localStatus !== 'Clos' && (
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest h-12 px-6 gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Clôturer Dossier
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 gap-2 shadow-xl shadow-black/10">
                  Actions Dossier <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-slate-100 rounded-xl shadow-xl p-2 min-w-[180px]">
                <DropdownMenuItem
                  onClick={handleArchiveCase}
                  disabled={localStatus === 'Archivé'}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#c1a461] p-3 rounded-lg cursor-pointer flex gap-3"
                >
                  <Archive className="w-4 h-4" /> Archiver Dossier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteCase}
                  className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 p-3 rounded-lg cursor-pointer flex gap-3"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer Dossier
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-slate-100">
          <div className="flex gap-12 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'documents', label: 'Documents' },
              { id: 'evidence', label: 'Preuves (Vault)' },
              { id: 'timeline', label: 'Timeline & Logs' },
              { id: 'billing', label: 'Honoraires' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all whitespace-nowrap",
                  activeTab === tab.id ? "text-[#c1a461]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#c1a461] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8 space-y-10">
            {activeTab === 'overview' && (
              <>
                {/* Dossier Summary / Content */}
                <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#c1a461]" /> Synthèse de l'Affaire
                    </CardTitle>
                    <Button
                      variant="ghost"
                      onClick={() => setShowProgressionModal(true)}
                      className="text-[10px] font-black uppercase text-[#c1a461]"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Modifier
                    </Button>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="whitespace-pre-wrap text-sm text-slate-700 font-medium leading-relaxed text-left">
                      {linkify(caseDescription || "AUCUNE SYNTHÈSE RÉDIGÉE POUR LE MOMENT.")}
                    </div>
                  </CardContent>
                </Card>

                {/* Status & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card
                    className="bg-white border-none shadow-md p-6 rounded-[32px] cursor-pointer hover:ring-2 ring-[#c1a461]/20 transition-all"
                    onClick={() => setShowStatusModal(true)}
                  >
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Statut Actuel</p>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full animate-pulse",
                        localStatus === 'Clos' ? 'bg-slate-400' :
                        localStatus === 'Scellé' ? 'bg-red-600' : 'bg-[#c1a461]'
                      )} />
                      <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{localStatus}</p>
                    </div>
                  </Card>
                  <Card className="bg-white border-none shadow-md p-6 rounded-[32px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pôle Juridique</p>
                    <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{dossier.type}</p>
                  </Card>
                  <Card
                    className="bg-[#0a0f18] text-white border-none shadow-xl p-6 rounded-[32px] cursor-pointer hover:ring-2 ring-[#c1a461]/50 transition-all"
                    onClick={() => setShowProgressionModal(true)}
                  >
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 text-center">Progression</p>
                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                         <span className="text-[9px] font-bold text-[#c1a461] uppercase tracking-widest">{stepDescription || 'En cours'}</span>
                         <span className="text-lg font-black tracking-tight">{progression}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-[#c1a461] transition-all duration-500" style={{ width: `${progression}%` }} />
                       </div>
                    </div>
                  </Card>
                </div>

                {/* Upcoming Hearings */}
                <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <Gavel className="w-5 h-5 text-[#c1a461]" /> Audiences & Calendrier
                    </CardTitle>
                    <Button variant="ghost" className="text-[10px] font-black uppercase text-[#c1a461]">+ Ajouter</Button>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    {hearings.length > 0 ? hearings.map((h, idx) => (
                      <div key={idx} className="flex gap-8 items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="text-center bg-slate-900 text-white rounded-2xl p-4 min-w-[80px]">
                          <p className="text-2xl font-black leading-none">{new Date(h.date).getDate()}</p>
                          <p className="text-[10px] font-bold uppercase mt-1">
                            {new Date(h.date).toLocaleString('default', { month: 'short' })}
                          </p>
                        </div>
                        <div className="flex-grow space-y-1">
                          <p className="text-lg font-black uppercase text-slate-900 leading-tight">{h.title}</p>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>📍 {h.location}</span>
                            <span>⚖️ {h.judge}</span>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 text-white font-black uppercase text-[9px] px-4 py-1.5">{h.status}</Badge>
                      </div>
                    )) : (
                       <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Aucune audience programmée</p>
                       </div>
                    )}
                  </CardContent>
                </Card>

                {/* Latest Activity Preview */}
                <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#c1a461]" /> Activité Récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                      {auditLogs.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c1a461]" />
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{item.action}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                {item.user_name} • {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 border-t border-slate-50 text-center">
                       <Button variant="link" className="text-[10px] font-black uppercase text-[#c1a461] tracking-widest" onClick={() => setActiveTab('timeline')}>
                         Voir tout l'historique d'audit
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-left">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Index Documentaire</h3>
                  <Button
                    onClick={() => setShowDocModal(true)}
                    className="bg-[#c1a461] text-white text-[10px] font-black uppercase h-10 px-6"
                  >
                    + Nouveau
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {docs.map((doc, idx) => (
                    <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all group p-6 rounded-[24px] cursor-pointer" onClick={() => { setSelectedDocId(doc.id); setShowDocViewModal(true); }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-black text-slate-900 uppercase tracking-tight">{doc.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.id} • Version {doc.current_version}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1",
                            doc.status === 'Signé' ? 'bg-emerald-600 text-white' :
                            doc.status === 'Validé' ? 'bg-blue-600 text-white' :
                            doc.status === 'Archivé' ? 'bg-slate-400 text-white' : 'bg-slate-200 text-slate-600'
                          )}>
                            {doc.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-slate-100 rounded-xl shadow-xl p-2">
                              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#c1a461] p-3 rounded-lg cursor-pointer flex gap-3">
                                <Download className="w-4 h-4" /> Télécharger
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleArchiveDoc(doc.id)}
                                disabled={doc.status === 'Archivé'}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#c1a461] p-3 rounded-lg cursor-pointer flex gap-3"
                              >
                                <Archive className="w-4 h-4" /> Archiver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 p-3 rounded-lg cursor-pointer flex gap-3"
                              >
                                <Trash2 className="w-4 h-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {docs.length === 0 && (
                     <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Aucun document lié</p>
                     </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-white p-10 rounded-[40px] bg-[#0a0f18] relative overflow-hidden text-left">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Evidence Vault Access</h3>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Zone hautement sécurisée • Chiffrement AES-256</p>
                  </div>
                  <Button
                    onClick={() => setShowEviModal(true)}
                    className="relative z-10 bg-[#c1a461] hover:bg-[#927843] text-white text-[10px] font-black uppercase h-12 px-8 rounded-xl shadow-2xl"
                  >
                    Déposer Preuve
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {evidences.map((evi, idx) => (
                    <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all p-8 rounded-[32px] bg-white group cursor-pointer" onClick={() => { setSelectedEviId(evi.id); setShowEviViewModal(true); }}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                        <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5", 
                          evi.confidentiality === 'Secret' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                        )}>
                          {evi.confidentiality}
                        </Badge>
                      </div>
                      <div className="space-y-1 mb-6">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{evi.type}</p>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight">{evi.name}</h4>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                        <span className="text-[10px] font-black text-slate-300 uppercase">{evi.id}</span>
                        <div className="flex gap-2">
                           {evi.to_produce_at_hearing && <Badge className="bg-red-50 text-red-600 border-red-100 text-[8px] uppercase">À produire</Badge>}
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                                 <MoreVertical className="w-5 h-5" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="bg-white border-slate-100 rounded-xl shadow-xl p-2">
                               <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#c1a461] p-3 rounded-lg cursor-pointer flex gap-3">
                                 <Download className="w-4 h-4" /> Télécharger
                               </DropdownMenuItem>
                               <DropdownMenuItem
                                 onClick={() => handleDeleteEvi(evi.id)}
                                 className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 p-3 rounded-lg cursor-pointer flex gap-3"
                               >
                                 <Trash2 className="w-4 h-4" /> Supprimer
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {evidences.length === 0 && (
                     <div className="col-span-2 p-10 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Aucune preuve enregistrée</p>
                     </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
               <div className="space-y-10">
                 <div className="flex justify-between items-center text-left">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Timeline & Tâches</h3>
                    <Button
                      onClick={() => setShowTaskModal(true)}
                      className="bg-[#0a0f18] text-white text-[10px] font-black uppercase h-10 px-6"
                    >
                      + Nouvelle Tâche
                    </Button>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {tasks.map((task, idx) => (
                      <Card key={idx} className="border-none shadow-md p-6 rounded-[24px] bg-white group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className={cn("w-1.5 h-10 rounded-full",
                              task.priority === 'Critique' ? 'bg-red-500' : 'bg-[#c1a461]'
                            )} />
                            <div className="text-left">
                              <p className="text-base font-black text-slate-900 uppercase tracking-tight">{task.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Échéance : {new Date(task.due_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[9px] font-black uppercase">{task.status}</Badge>
                        </div>
                      </Card>
                    ))}
                 </div>

                 <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden text-left">
                   <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/50">
                      <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <History className="w-5 h-5 text-[#c1a461]" /> Historique d'Audit
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-8">
                      <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                         {auditLogs.length > 0 ? auditLogs.map((log, idx) => (
                           <div key={idx} className="relative pl-10">
                              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center">
                                 <div className="w-1.5 h-1.5 rounded-full bg-[#c1a461]" />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</p>
                                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.action}</p>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Effectué par : {log.user_name}</p>
                              </div>
                           </div>
                         )) : (
                            <p className="text-center py-10 text-slate-400 text-[10px] uppercase font-black">Aucun log disponible</p>
                         )}
                      </div>
                   </CardContent>
                 </Card>
               </div>
            )}
          </div>

          {/* Right Column (Sidebar Stats & Members) */}
          <div className="lg:col-span-4 space-y-10">
            {/* Team Members Section */}
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#c1a461]" /> Équipe Assignée
                </CardTitle>
                <UserPlus
                  className="w-4 h-4 text-slate-300 hover:text-[#c1a461] cursor-pointer transition-colors"
                  onClick={() => setShowMemberModal(true)}
                />
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {members.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <Avatar className="h-10 w-10 ring-2 ring-slate-100">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar || member.user_id}`} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow text-left">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{member.name}</p>
                      <p className="text-[9px] font-bold text-[#c1a461] uppercase tracking-widest">{member.role}</p>
                    </div>
                    {member.user_id === dossier.lead_id ? (
                      <Badge className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase px-2 py-0 border-none">LEAD</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-600"
                        onClick={() => handleRemoveMember(member.user_id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl">
                  Gérer les Accès ACL
                </Button>
              </CardContent>
            </Card>

            {/* Client Card */}
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
               <CardHeader className="p-8 border-b border-slate-50">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#c1a461]" /> Information Client
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-4">
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Principal</p>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">{client?.name || 'Inconnu'}</p>
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-bold text-slate-600 uppercase">{client?.type}</p>
                  </div>
                  <Button variant="outline" className="w-full mt-2 border-slate-200 text-[9px] font-black uppercase tracking-widest h-10 px-4">
                     Fiche Client Complète
                  </Button>
               </CardContent>
            </Card>

            {/* Quick Communication Tool */}
            <Card className="border-none shadow-xl rounded-[32px] bg-slate-900 text-white overflow-hidden">
              <CardHeader className="p-8 bg-[#c1a461]/10 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#c1a461]" /> Notes Internes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-8 space-y-6 max-h-[300px] overflow-y-auto">
                   {internalNotes.length > 0 ? internalNotes.map((note, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-[#c1a461] uppercase tracking-widest">{note.author_name}</span>
                          <span className="text-[8px] font-bold text-white/20 uppercase">{new Date(note.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs font-medium text-white/80 leading-relaxed text-left">{note.content}</p>
                      </div>
                   )) : (
                      <p className="text-[9px] font-bold text-white/30 uppercase text-center py-4">Aucune note interne</p>
                   )}
                   <p className="text-[9px] font-bold text-white/10 uppercase text-center py-4 border-t border-white/5">Fin de la conversation</p>
                </div>
                <div className="p-6 bg-black/20 border-t border-white/5">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="NOTER..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      className="w-full h-12 bg-white/5 border-none rounded-xl pl-6 pr-12 text-[10px] font-bold text-white uppercase placeholder:text-white/20 focus:ring-1 ring-[#c1a461]/50 transition-all"
                    />
                    <Send
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#c1a461] cursor-pointer hover:text-white transition-colors"
                      onClick={handleAddNote}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <Dialog open={showDocModal} onOpenChange={setShowDocModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Nouveau Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 my-6">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé</Label>
                <Input value={newDoc.title} onChange={(e) => setNewDoc({...newDoc, title: e.target.value})} placeholder="EX: CONCLUSIONS PÉNALES..." className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase" />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contenu du Document</Label>
                <Textarea
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({...newDoc, content: e.target.value})}
                  placeholder="RÉDIGEZ LE CONTENU ICI..."
                  className="bg-slate-50 border-none rounded-xl min-h-[150px] text-sm font-medium"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</Label>
                <Select value={newDoc.category} onValueChange={(val) => setNewDoc({...newDoc, category: val as any})}>
                  <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conclusions">Conclusions</SelectItem>
                    <SelectItem value="Requête">Requête</SelectItem>
                    <SelectItem value="Convention">Convention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateDoc} className="bg-[#0a0f18] text-white text-[10px] font-black uppercase h-12 px-8 rounded-xl">Indexer Document</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEviModal} onOpenChange={setShowEviModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Dépôt de Preuve</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 my-6">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom de la preuve</Label>
                <Input value={newEvi.name} onChange={(e) => setNewEvi({...newEvi, name: e.target.value})} placeholder="EX: ENREGISTREMENT CCTV..." className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase" />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contenu / Description de la preuve</Label>
                <Textarea
                  value={newEvi.content}
                  onChange={(e) => setNewEvi({...newEvi, content: e.target.value})}
                  placeholder="DÉCRIVEZ LA PREUVE ICI. LES LIENS SONT SUPPORTÉS."
                  className="bg-slate-50 border-none rounded-xl min-h-[150px] text-sm font-medium"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photos / Images (URLs)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://..."
                    className="bg-slate-50 border-none rounded-xl h-12 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setNewEvi({...newEvi, images: [...newEvi.images, val]});
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value) {
                        setNewEvi({...newEvi, images: [...newEvi.images, input.value]});
                        input.value = '';
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 h-12 px-4 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newEvi.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEvi.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                        <button
                          onClick={() => setNewEvi({...newEvi, images: newEvi.images.filter((_, idx) => idx !== i)})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</Label>
                  <Select value={newEvi.type} onValueChange={(val) => setNewEvi({...newEvi, type: val})}>
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vidéo">Vidéo</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidentialité</Label>
                  <Select value={newEvi.confidentiality} onValueChange={(val) => setNewEvi({...newEvi, confidentiality: val as any})}>
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Secret">Secret</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateEvi} className="bg-[#c1a461] text-white text-[10px] font-black uppercase h-12 px-8 rounded-xl">Chiffrer & Déposer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Nouvelle Tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 my-6">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé</Label>
                <Input value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="EX: RECHERCHE JURISPRUDENCE..." className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase" />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priorité</Label>
                <Select value={newTask.priority} onValueChange={(val) => setNewTask({...newTask, priority: val as any})}>
                  <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basse">Basse</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Haute">Haute</SelectItem>
                    <SelectItem value="Critique">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTask} className="bg-[#0a0f18] text-white text-[10px] font-black uppercase h-12 px-8 rounded-xl">Créer Tâche</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Document View Modal */}
        <Dialog open={showDocViewModal} onOpenChange={setShowDocViewModal}>
          <DialogContent className="max-w-4xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            {selectedDocId && (
              <>
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 text-left">
                  <div className="space-y-1">
                    <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                      {docs.find(d => d.id === selectedDocId)?.title}
                    </DialogTitle>
                    <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {selectedDocId} • Version {docs.find(d => d.id === selectedDocId)?.current_version}
                    </DialogDescription>
                  </div>
                  <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1",
                    docs.find(d => d.id === selectedDocId)?.status === 'Signé' ? 'bg-emerald-600 text-white' :
                    docs.find(d => d.id === selectedDocId)?.status === 'Validé' ? 'bg-blue-600 text-white' :
                    docs.find(d => d.id === selectedDocId)?.status === 'Archivé' ? 'bg-slate-400 text-white' : 'bg-slate-100 text-slate-600'
                  )}>
                    {docs.find(d => d.id === selectedDocId)?.status}
                  </Badge>
                </DialogHeader>

                <div className="my-8 p-8 bg-slate-50 rounded-2xl border border-slate-100 min-h-[400px]">
                  <div className="whitespace-pre-wrap text-sm text-slate-700 font-medium leading-relaxed text-left">
                    {linkify(docs.find(d => d.id === selectedDocId)?.content || "AUCUN CONTENU RÉDIGÉ POUR CE DOCUMENT.")}
                  </div>
                </div>

                <DialogFooter className="flex justify-between items-center w-full">
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest h-10 px-6 gap-2">
                      <Download className="w-4 h-4" /> Télécharger
                    </Button>
                  </div>
                  <Button
                    onClick={() => setShowDocViewModal(false)}
                    className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-10 px-8 rounded-xl shadow-xl shadow-black/10"
                  >
                    Fermer
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Evidence View Modal */}
        <Dialog open={showEviViewModal} onOpenChange={setShowEviViewModal}>
          <DialogContent className="max-w-2xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            {selectedEviId && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    {evidences.find(e => e.id === selectedEviId)?.name}
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                    {evidences.find(e => e.id === selectedEviId)?.type} • Vault Security Level: {evidences.find(e => e.id === selectedEviId)?.confidentiality}
                  </DialogDescription>
                </DialogHeader>

                <div className="my-8 p-8 bg-slate-50 rounded-2xl border border-slate-100 min-h-[200px] space-y-6">
                  <div className="whitespace-pre-wrap text-sm text-slate-700 font-medium leading-relaxed text-left">
                    {linkify(evidences.find(e => e.id === selectedEviId)?.content || "AUCUNE DESCRIPTION DISPONIBLE.")}
                  </div>

                  {evidences.find(e => e.id === selectedEviId)?.images && (evidences.find(e => e.id === selectedEviId)?.images?.length || 0) > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {evidences.find(e => e.id === selectedEviId)?.images?.map((img, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 shadow-sm">
                          <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="ghost" size="icon" className="text-white" onClick={() => window.open(img, '_blank')}>
                              <Eye className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    onClick={() => setShowEviViewModal(false)}
                    className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-10 rounded-xl w-full"
                  >
                    Fermer
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Edit Modal */}
        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent className="max-w-md bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Modifier le Statut</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 my-6">
              <Select value={localStatus} onValueChange={(val) => handleUpdateCase({ status: val as CaseStatus })}>
                <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Clos">Clos</SelectItem>
                  <SelectItem value="Archivé">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowStatusModal(false)} className="bg-[#0a0f18] text-white text-[10px] font-black uppercase h-12 px-8 rounded-xl w-full">Terminer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Progression Edit Modal */}
        <Dialog open={showProgressionModal} onOpenChange={setShowProgressionModal}>
          <DialogContent className="max-w-md bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Modifier la Progression</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 my-6">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthèse Globale du Dossier</Label>
                <Textarea
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="MODIFIEZ LA SYNTHÈSE ICI..."
                  className="bg-slate-50 border-none rounded-xl min-h-[200px] text-sm font-medium"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pourcentage ({progression}%)</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progression}
                  onChange={(e) => setProgression(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#c1a461]"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Libellé de l'étape</Label>
                <Input
                  value={stepDescription}
                  onChange={(e) => setStepDescription(e.target.value)}
                  placeholder="EX: ÉTAPE 3/4..."
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  handleUpdateCase({ progression, step_description: stepDescription, description: caseDescription });
                  setShowProgressionModal(false);
                }}
                className="bg-[#c1a461] text-white text-[10px] font-black uppercase h-12 px-8 rounded-xl w-full shadow-xl shadow-[#c1a461]/20"
              >
                Mettre à jour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Member Management Modal */}
        <Dialog open={showMemberModal} onOpenChange={setShowMemberModal}>
          <DialogContent className="max-w-md bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Ajouter un Membre</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 my-6">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collaborateur</Label>
                <Select value={newMember.user_id} onValueChange={(val) => setNewMember({ ...newMember, user_id: val })}>
                  <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                    <SelectValue placeholder="Choisir un collaborateur..." />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.filter(s => !members.some(m => m.user_id === s.id)).map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name} — {s.role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddMember}
                disabled={!newMember.user_id}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase h-12 px-8 rounded-xl w-full"
              >
                Ajouter à l'Équipe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default DossierDetail;
