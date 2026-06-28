import React from 'react';
import {
  FileText,
  Search,
  Plus,
  Filter,
  MoreVertical,
  ChevronRight,
  Lock,
  Download,
  FileCheck,
  TrendingUp,
  Zap,
  Clock,
  ArrowRight,
  FileSearch,
  CheckCircle2,
  FileSignature,
  FileEdit,
  History,
  Archive,
  Trash2,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { LegalDocument, DocumentCategory, DocumentStatus } from '@shared/api';
import { uploadFile, validateFile } from '@/lib/file-upload';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Documents = () => {
  const { user } = useAuth();
  const [docs, setDocs] = React.useState(legalStore.getDocuments().filter(d => d.status !== 'Archivé'));
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showSignModal, setShowSignModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
  const [selectedClientsToShare, setSelectedClientsToShare] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newDoc, setNewDoc] = React.useState({
    title: '',
    case_id: '',
    category: 'Conclusions' as DocumentCategory,
    content: '',
    file: null as File | null
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [editingDoc, setEditingDoc] = React.useState({
    title: '',
    case_id: '',
    category: 'Conclusions' as DocumentCategory,
    content: ''
  });

  const cases = legalStore.getCases();
  const clients = legalStore.getClients();

  const handleCreate = async () => {
    if (!user || !newDoc.title || !newDoc.case_id) return;

    setIsUploading(true);
    try {
      let file_url = '/api/files/pending';

      // Upload file if provided
      if (newDoc.file) {
        const validation = validateFile(newDoc.file);
        if (!validation.valid) {
          toast.error(validation.error || 'File validation failed');
          setIsUploading(false);
          return;
        }

        try {
          const uploaded = await uploadFile(newDoc.file);
          file_url = uploaded.file_url;
        } catch (error) {
          toast.error('File upload failed');
          setIsUploading(false);
          return;
        }
      }

      const doc: LegalDocument = {
        id: `HC-2024-${Math.floor(Math.random() * 9000) + 1000}`,
        case_id: newDoc.case_id,
        title: newDoc.title,
        content: newDoc.content,
        category: newDoc.category,
        status: 'Brouillon',
        current_version: 1,
        versions: [{
          version: 1,
          file_url,
          created_at: new Date().toISOString(),
          created_by: user.id,
          change_note: 'Version initiale'
        }],
        signatures: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      legalStore.createDocument(doc);
      setDocs(legalStore.getDocuments());
      setShowCreateModal(false);
      setNewDoc({ title: '', case_id: '', category: 'Conclusions', content: '', file: null });

      legalStore.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: user.id,
        user_name: user.name,
        action: 'Création document',
        target_type: 'Document',
        target_id: doc.id,
        metadata: { title: doc.title, case_id: doc.case_id }
      });

      toast.success('Document créé avec succès');
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleEdit = () => {
    if (!user || !selectedDocId || !editingDoc.title || !editingDoc.case_id) return;

    const doc = legalStore.getDocuments().find(d => d.id === selectedDocId);
    if (!doc) return;

    const updated: LegalDocument = {
      ...doc,
      title: editingDoc.title,
      content: editingDoc.content,
      category: editingDoc.category,
      case_id: editingDoc.case_id,
      current_version: doc.current_version + 1,
      versions: [
        {
          version: doc.current_version + 1,
          file_url: '#',
          created_at: new Date().toISOString(),
          created_by: user.id,
          change_note: 'Mise à jour du contenu'
        },
        ...doc.versions
      ],
      updated_at: new Date().toISOString()
    };

    legalStore.updateDocument(updated);
    setDocs(legalStore.getDocuments().filter(d => d.status !== 'Archivé'));
    setShowEditModal(false);
    setSelectedDocId(null);

    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Modification document',
      target_type: 'Document',
      target_id: doc.id,
      metadata: { title: doc.title, case_id: doc.case_id }
    });
  };

  const handleUpdateStatus = (docId: string, nextStatus: DocumentStatus) => {
    if (!user) return;
    const doc = legalStore.getDocuments().find(d => d.id === docId);
    if (!doc) return;

    const updated: LegalDocument = {
      ...doc,
      status: nextStatus,
      updated_at: new Date().toISOString()
    };

    // If signing, add signature
    if (nextStatus === 'Signé') {
      updated.signatures.push({
        user_id: user.id,
        signed_at: new Date().toISOString(),
        role: user.role
      });
    }

    // Persistent update
    legalStore.updateDocument(updated);
    setDocs(legalStore.getDocuments().filter(d => d.status !== 'Archivé'));

    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: `Changement statut document: ${nextStatus}`,
      target_type: 'Document',
      target_id: docId
    });
  };

  const handleSign = () => {
    if (selectedDocId) {
      handleUpdateStatus(selectedDocId, 'Signé');
      setShowSignModal(false);
      setSelectedDocId(null);
    }
  };

  const handleArchiveDoc = (id: string) => {
    if (!user) return;
    legalStore.archiveDocument(id, user.id);
    setDocs(legalStore.getDocuments().filter(d => d.status !== 'Archivé'));
  };

  const handleDeleteDoc = (id: string) => {
    if (!user) return;
    if (confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      legalStore.deleteDocument(id, user.id);
      setDocs(legalStore.getDocuments().filter(d => d.status !== 'Archivé'));
    }
  };

  const handleShareDoc = () => {
    if (!user || !selectedDocId || selectedClientsToShare.length === 0) {
      toast.error('Veuillez sélectionner au moins un client');
      return;
    }

    legalStore.shareDocumentWithClient(selectedDocId, selectedClientsToShare, user.id);

    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: `Partage document avec ${selectedClientsToShare.length} client(s)`,
      target_type: 'Document',
      target_id: selectedDocId,
      metadata: { shared_with_count: selectedClientsToShare.length }
    });

    toast.success(`Document partagé avec ${selectedClientsToShare.length} client(s)`);
    setShowShareModal(false);
    setSelectedDocId(null);
    setSelectedClientsToShare([]);
    setDocs(legalStore.getDocuments().filter(d => d.status !== 'Archivé'));
  };

  const filteredDocs = docs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion Documentaire</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Versioning AES-256 • Workflow de Signature • HC-YYYY-XXXX
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <FileSearch className="w-4 h-4" /> Modèles (Templates)
            </Button>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2"
            >
              <Plus className="w-4 h-4" /> Nouveau Document
            </Button>
          </div>
        </div>

        {/* Create Document Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Nouveau Document Juridique</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Le document sera automatiquement numéroté et versionné.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Document</Label>
                <Input
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                  placeholder="EX: CONCLUSIONS PÉNALES..."
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contenu du Document</Label>
                <Textarea
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({...newDoc, content: e.target.value})}
                  placeholder="RÉDIGEZ LE CONTENU ICI. VOUS POUVEZ METTRE DES LIENS DIRECTEMENT."
                  className="bg-slate-50 border-none rounded-xl min-h-[200px] text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</Label>
                  <Select 
                    value={newDoc.category}
                    onValueChange={(val) => setNewDoc({...newDoc, category: val as DocumentCategory})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conclusions">Conclusions</SelectItem>
                      <SelectItem value="Requête">Requête</SelectItem>
                      <SelectItem value="Convention">Convention</SelectItem>
                      <SelectItem value="Plainte">Plainte</SelectItem>
                      <SelectItem value="Courrier">Courrier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier Assigné</Label>
                  <Select 
                    value={newDoc.case_id}
                    onValueChange={(val) => setNewDoc({...newDoc, case_id: val})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue placeholder="Choisir un dossier..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.id} - {c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joindre un Fichier (Optionnel)</Label>
                <Input
                  type="file"
                  onChange={(e) => setNewDoc({...newDoc, file: e.target.files?.[0] || null})}
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif,.webp"
                />
                {newDoc.file && <p className="text-[9px] font-bold text-slate-500">Fichier: {newDoc.file.name}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => { setShowCreateModal(false); setNewDoc({ title: '', case_id: '', category: 'Conclusions', content: '', file: null }); }}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newDoc.title || !newDoc.case_id || isUploading}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-black/10"
              >
                {isUploading ? 'Téléchargement...' : 'Générer & Indexer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Document Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-4xl bg-white rounded-[32px] p-10 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Modifier le Document</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Une nouvelle version sera créée automatiquement lors de l'enregistrement.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Document</Label>
                <Input
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({...editingDoc, title: e.target.value})}
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contenu du Document</Label>
                <Textarea
                  value={editingDoc.content}
                  onChange={(e) => setEditingDoc({...editingDoc, content: e.target.value})}
                  placeholder="MODIFIEZ LE CONTENU ICI..."
                  className="bg-slate-50 border-none rounded-xl min-h-[400px] text-sm font-medium"
                />
                <p className="text-[9px] font-bold text-slate-400 italic">CONSEIL: Les URLs (http://...) seront cliquables dans le visualiseur.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</Label>
                  <Select
                    value={editingDoc.category}
                    onValueChange={(val) => setEditingDoc({...editingDoc, category: val as DocumentCategory})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conclusions">Conclusions</SelectItem>
                      <SelectItem value="Requête">Requête</SelectItem>
                      <SelectItem value="Convention">Convention</SelectItem>
                      <SelectItem value="Plainte">Plainte</SelectItem>
                      <SelectItem value="Courrier">Courrier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier Assigné</Label>
                  <Select
                    value={editingDoc.case_id}
                    onValueChange={(val) => setEditingDoc({...editingDoc, case_id: val})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue placeholder="Choisir un dossier..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.id} - {c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => { setShowEditModal(false); setSelectedDocId(null); }}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!editingDoc.title || !editingDoc.case_id}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-black/10"
              >
                Enregistrer & Incrémenter v{legalStore.getDocuments().find(d => d.id === selectedDocId)?.current_version! + 1}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Document Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-4xl bg-white rounded-[32px] p-10 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
            {selectedDocId && (
              <>
                <DialogHeader className="flex flex-row items-center justify-between space-y-0">
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
                    docs.find(d => d.id === selectedDocId)?.status === 'Relecture' ? 'bg-[#c1a461] text-white' :
                    docs.find(d => d.id === selectedDocId)?.status === 'Archivé' ? 'bg-slate-400 text-white' : 'bg-slate-100 text-slate-600'
                  )}>
                    {docs.find(d => d.id === selectedDocId)?.status}
                  </Badge>
                </DialogHeader>

                <div className="my-8 p-8 bg-slate-50 rounded-2xl border border-slate-100 min-h-[400px]">
                  <div className="whitespace-pre-wrap text-sm text-slate-700 font-medium leading-relaxed">
                    {linkify(docs.find(d => d.id === selectedDocId)?.content || "AUCUN CONTENU RÉDIGÉ POUR CE DOCUMENT.")}
                  </div>
                </div>

                <DialogFooter className="flex justify-between items-center w-full">
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const doc = docs.find(d => d.id === selectedDocId);
                        if (doc) {
                          setEditingDoc({
                            title: doc.title,
                            content: doc.content || '',
                            category: doc.category,
                            case_id: doc.case_id
                          });
                          setShowViewModal(false);
                          setShowEditModal(true);
                        }
                      }}
                      className="text-[10px] font-black uppercase tracking-widest h-10 px-6 gap-2"
                    >
                      <FileEdit className="w-4 h-4" /> Modifier
                    </Button>
                    <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest h-10 px-6 gap-2">
                      <Download className="w-4 h-4" /> Télécharger
                    </Button>
                  </div>
                  <Button
                    onClick={() => setShowViewModal(false)}
                    className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-10 px-8 rounded-xl shadow-xl shadow-black/10"
                  >
                    Fermer
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Digital Signature Modal */}
        <Dialog open={showSignModal} onOpenChange={setShowSignModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Signature Électronique Certifiée</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                En signant, vous apposez votre sceau numérique HC-SIG-2024.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 my-8">
              <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center space-y-4">
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Zone de signature manuelle ou tampon</div>
                 <FileSignature className="w-12 h-12 text-slate-200" />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identité du Signataire</p>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                  </Avatar>
                  <p className="text-sm font-bold text-slate-900 uppercase">{user?.name} — {user?.role}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowSignModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSign}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest h-12 px-10 rounded-xl shadow-xl shadow-emerald-600/10"
              >
                Signer & Sceller le PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Document Modal */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Partager le Document</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Sélectionnez les clients avec qui partager ce document.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-6 max-h-[400px] overflow-y-auto">
              {clients.length > 0 ? (
                clients.map((client) => (
                  <div key={client.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg border border-slate-100">
                    <Checkbox
                      id={client.id}
                      checked={selectedClientsToShare.includes(client.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedClientsToShare([...selectedClientsToShare, client.id]);
                        } else {
                          setSelectedClientsToShare(selectedClientsToShare.filter(id => id !== client.id));
                        }
                      }}
                    />
                    <Label htmlFor={client.id} className="flex-1 cursor-pointer text-sm font-bold text-slate-900 uppercase">
                      {client.name}
                    </Label>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{client.email}</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-8">
                  Aucun client disponible
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowShareModal(false);
                  setSelectedDocId(null);
                  setSelectedClientsToShare([]);
                }}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleShareDoc}
                disabled={selectedClientsToShare.length === 0}
                className="bg-[#c1a461] hover:bg-[#c1a461]/90 text-white text-[10px] font-black uppercase tracking-widest h-12 px-10 rounded-xl shadow-xl shadow-[#c1a461]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Partager avec {selectedClientsToShare.length} client{selectedClientsToShare.length !== 1 ? 's' : ''}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: "En Brouillon", value: docs.filter(d => d.status === 'Brouillon').length, icon: <Zap className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Validés", value: docs.filter(d => d.status === 'Validé').length, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Signés", value: docs.filter(d => d.status === 'Signé').length, icon: <FileSignature className="w-5 h-5" />, color: "text-[#c1a461]", bg: "bg-[#c1a461]/5" },
            { label: "Total Index", value: docs.length, icon: <FileText className="w-5 h-5" />, color: "text-slate-600", bg: "bg-slate-50" }
          ].map((stat, idx) => (
            <Card key={idx} className="bg-white border-none shadow-md px-6 py-5 flex items-center gap-5 rounded-2xl">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Index des Documents Récents</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Traçabilité complète et versioning AES-256</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="RECHERCHER UN DOCUMENT..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9 w-64" 
                 />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro / Nom</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                    <th className="px-8 py-5 text-[10px) font-black text-slate-400 uppercase tracking-widest">Statut</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Version</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDocs.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setSelectedDocId(item.id); setShowViewModal(true); }}>
                          <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.title}</p>
                              {item.shared_with && item.shared_with.length > 0 ? (
                                <Badge className="bg-emerald-50 text-emerald-700 text-[7px] font-black px-2 py-0.5 uppercase tracking-widest">
                                  👥 Partagé ({item.shared_with.length})
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-400 text-[7px] font-black px-2 py-0.5 uppercase tracking-widest border-slate-200">
                                  🔒 Privé
                                </Badge>
                              )}
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.case_id}</p>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.category}</Badge>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1",
                          item.status === 'Signé' ? 'bg-emerald-600 text-white' :
                          item.status === 'Validé' ? 'bg-blue-600 text-white' :
                          item.status === 'Relecture' ? 'bg-[#c1a461] text-white' :
                          item.status === 'Archivé' ? 'bg-slate-400 text-white' : 'bg-slate-100 text-slate-600'
                        )}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-black text-slate-500 uppercase">v{item.current_version}</span>
                           <History className="w-3 h-3 text-slate-300" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          {item.status === 'Brouillon' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUpdateStatus(item.id, 'Validé'); }}
                              className="text-slate-300 hover:text-blue-600"
                            >
                              <FileCheck className="w-4 h-4" />
                            </Button>
                          )}
                          {item.status === 'Validé' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedDocId(item.id);
                                setShowSignModal(true);
                              }}
                              className="text-slate-300 hover:text-emerald-600"
                            >
                              <FileSignature className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                            <Download className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-slate-100 rounded-xl shadow-xl p-2">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDocId(item.id);
                                  setEditingDoc({
                                    title: item.title,
                                    content: item.content || '',
                                    category: item.category,
                                    case_id: item.case_id
                                  });
                                  setShowEditModal(true);
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#c1a461] p-3 rounded-lg cursor-pointer flex gap-3"
                              >
                                <FileEdit className="w-4 h-4" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDocId(item.id);
                                  setSelectedClientsToShare([]);
                                  setShowShareModal(true);
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-[#c1a461] hover:text-[#c1a461]/80 p-3 rounded-lg cursor-pointer flex gap-3"
                              >
                                <Share2 className="w-4 h-4" /> Partager Avec Client
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleArchiveDoc(item.id)}
                                disabled={item.status === 'Archivé'}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#c1a461] p-3 rounded-lg cursor-pointer flex gap-3"
                              >
                                <Archive className="w-4 h-4" /> Archiver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDoc(item.id)}
                                className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 p-3 rounded-lg cursor-pointer flex gap-3"
                              >
                                <Trash2 className="w-4 h-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Documents;
