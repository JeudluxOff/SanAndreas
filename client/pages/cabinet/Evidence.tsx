import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Lock,
  Download,
  Eye,
  AlertTriangle,
  FileDigit,
  Fingerprint,
  Activity,
  ShieldAlert,
  ChevronRight,
  Zap,
  Clock,
  FileEdit,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useAuth } from '@/contexts/AuthContext';
import { Evidence, ConfidentialityLevel } from '@shared/api';
import { uploadFile, validateFile } from '@/lib/file-upload';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const EvidenceVault = () => {
  const { user } = useAuth();
  const [evidence, setEvidence] = React.useState(legalStore.getCases().flatMap(c => legalStore.getEvidence(c.id)));
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [selectedEviId, setSelectedEviId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newEvidence, setNewEvidence] = React.useState({
    name: '',
    case_id: '',
    type: 'Document',
    content: '',
    images: [] as string[],
    confidentiality: 'Normal' as ConfidentialityLevel,
    file: null as File | null
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [editingEvi, setEditingEvi] = React.useState({
    name: '',
    case_id: '',
    type: 'Document',
    content: '',
    images: [] as string[],
    confidentiality: 'Normal' as ConfidentialityLevel
  });

  const cases = legalStore.getCases();

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

  const handleUpload = async () => {
    if (!user || !newEvidence.name || !newEvidence.case_id) return;

    setIsUploading(true);
    try {
      let file_url = '/api/files/pending';

      // Upload file if provided
      if (newEvidence.file) {
        const validation = validateFile(newEvidence.file);
        if (!validation.valid) {
          toast.error(validation.error || 'File validation failed');
          setIsUploading(false);
          return;
        }

        try {
          const uploaded = await uploadFile(newEvidence.file);
          file_url = uploaded.file_url;
        } catch (error) {
          toast.error('File upload failed');
          setIsUploading(false);
          return;
        }
      }

      const evi: Evidence = {
        id: `EVI-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`,
        case_id: newEvidence.case_id,
        name: newEvidence.name,
        type: newEvidence.type,
        content: newEvidence.content,
        images: newEvidence.images,
        file_url,
        confidentiality: newEvidence.confidentiality,
        uploaded_by: user.name,
        uploaded_at: new Date().toISOString(),
        to_produce_at_hearing: false
      };

      legalStore.addEvidence(evi);
      setEvidence(legalStore.getCases().flatMap(c => legalStore.getEvidence(c.id)));
      setShowUploadModal(false);
      setNewEvidence({ name: '', case_id: '', type: 'Document', content: '', images: [], confidentiality: 'Normal', file: null });

      legalStore.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: user.id,
        user_name: user.name,
        action: 'Dépôt preuve',
        target_type: 'Evidence',
        target_id: evi.id,
        metadata: { name: evi.name, case_id: evi.case_id }
      });

      toast.success('Preuve ajoutée avec succès');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = () => {
    if (!user || !selectedEviId || !editingEvi.name || !editingEvi.case_id) return;

    const allEvidences = legalStore.getCases().flatMap(c => legalStore.getEvidence(c.id));
    const evi = allEvidences.find(e => e.id === selectedEviId);
    if (!evi) return;

    const updated: Evidence = {
      ...evi,
      name: editingEvi.name,
      case_id: editingEvi.case_id,
      type: editingEvi.type,
      content: editingEvi.content,
      images: editingEvi.images,
      confidentiality: editingEvi.confidentiality
    };

    legalStore.deleteEvidence(evi.id, user.id);
    legalStore.addEvidence(updated);

    setEvidence(legalStore.getCases().flatMap(c => legalStore.getEvidence(c.id)));
    setShowEditModal(false);
    setSelectedEviId(null);

    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Modification preuve',
      target_type: 'Evidence',
      target_id: evi.id,
      metadata: { name: updated.name }
    });
  };

  const filteredEvidence = evidence.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.case_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Evidence Vault v2.4</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Stockage Chiffré • Scellement Numérique • Horodatage Certifié Parquet
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <ShieldAlert className="w-4 h-4" /> Audit d'Accès
            </Button>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-[#c1a461] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2"
            >
              <Plus className="w-4 h-4" /> Déposer une Preuve
            </Button>
          </div>
        </div>

        {/* Upload Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Dépôt de Preuve Sécurisé</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Le fichier sera immédiatement chiffré en AES-256 et horodaté.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom de la Preuve</Label>
                <Input
                  value={newEvidence.name}
                  onChange={(e) => setNewEvidence({...newEvidence, name: e.target.value})}
                  placeholder="EX: ENREGISTREMENT DASHCAM..."
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description / Contenu</Label>
                <Textarea
                  value={newEvidence.content}
                  onChange={(e) => setNewEvidence({...newEvidence, content: e.target.value})}
                  placeholder="DÉCRIVEZ LA PREUVE, AJOUTEZ DES LIENS..."
                  className="bg-slate-50 border-none rounded-xl min-h-[120px] text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
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
                          setNewEvidence({...newEvidence, images: [...newEvidence.images, val]});
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
                        setNewEvidence({...newEvidence, images: [...newEvidence.images, input.value]});
                        input.value = '';
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 h-12 px-4 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newEvidence.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEvidence.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                        <button
                          onClick={() => setNewEvidence({...newEvidence, images: newEvidence.images.filter((_, idx) => idx !== i)})}
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
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</Label>
                  <Select 
                    value={newEvidence.type}
                    onValueChange={(val) => setNewEvidence({...newEvidence, type: val})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Vidéo">Vidéo</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Digital">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveau Confidentialité</Label>
                  <Select 
                    value={newEvidence.confidentiality}
                    onValueChange={(val) => setNewEvidence({...newEvidence, confidentiality: val as ConfidentialityLevel})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Confidentiel">Confidentiel</SelectItem>
                      <SelectItem value="Secret">Secret</SelectItem>
                      <SelectItem value="Scellé">Scellé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier Assigné</Label>
                <Select 
                  value={newEvidence.case_id}
                  onValueChange={(val) => setNewEvidence({...newEvidence, case_id: val})}
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

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joindre un Fichier (Optionnel)</Label>
                <Input
                  type="file"
                  onChange={(e) => setNewEvidence({...newEvidence, file: e.target.files?.[0] || null})}
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif,.webp,.mp3,.mp4,.mov,.avi"
                />
                {newEvidence.file && <p className="text-[9px] font-bold text-slate-500">Fichier: {newEvidence.file.name}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowUploadModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!newEvidence.name || !newEvidence.case_id || isUploading}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl"
              >
                {isUploading ? 'Téléchargement...' : 'Chiffrer & Sceller'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl bg-white rounded-[32px] p-10 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Modifier la Preuve</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom de la Preuve</Label>
                <Input
                  value={editingEvi.name}
                  onChange={(e) => setEditingEvi({...editingEvi, name: e.target.value})}
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description / Contenu</Label>
                <Textarea
                  value={editingEvi.content}
                  onChange={(e) => setEditingEvi({...editingEvi, content: e.target.value})}
                  placeholder="MODIFIEZ LA DESCRIPTION ICI..."
                  className="bg-slate-50 border-none rounded-xl min-h-[200px] text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
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
                          setEditingEvi({...editingEvi, images: [...editingEvi.images, val]});
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
                        setEditingEvi({...editingEvi, images: [...editingEvi.images, input.value]});
                        input.value = '';
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 h-12 px-4 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {editingEvi.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingEvi.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                        <button
                          onClick={() => setEditingEvi({...editingEvi, images: editingEvi.images.filter((_, idx) => idx !== i)})}
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
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</Label>
                  <Select
                    value={editingEvi.type}
                    onValueChange={(val) => setEditingEvi({...editingEvi, type: val})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Vidéo">Vidéo</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Digital">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveau Confidentialité</Label>
                  <Select
                    value={editingEvi.confidentiality}
                    onValueChange={(val) => setEditingEvi({...editingEvi, confidentiality: val as ConfidentialityLevel})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Confidentiel">Confidentiel</SelectItem>
                      <SelectItem value="Secret">Secret</SelectItem>
                      <SelectItem value="Scellé">Scellé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier Assigné</Label>
                <Select
                  value={editingEvi.case_id}
                  onValueChange={(val) => setEditingEvi({...editingEvi, case_id: val})}
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

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowEditModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!editingEvi.name || !editingEvi.case_id}
                className="bg-[#c1a461] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-[#c1a461]/10"
              >
                Enregistrer les Modifications
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-3xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            {selectedEviId && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    {evidence.find(e => e.id === selectedEviId)?.name}
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                    {evidence.find(e => e.id === selectedEviId)?.type} • Dossier: {evidence.find(e => e.id === selectedEviId)?.case_id}
                  </DialogDescription>
                </DialogHeader>

                <div className="my-8 p-8 bg-slate-50 rounded-2xl border border-slate-100 min-h-[250px] space-y-6">
                  <div className="whitespace-pre-wrap text-sm text-slate-700 font-medium leading-relaxed text-left">
                    {linkify(evidence.find(e => e.id === selectedEviId)?.content || "AUCUNE DESCRIPTION DISPONIBLE.")}
                  </div>

                  {evidence.find(e => e.id === selectedEviId)?.images && (evidence.find(e => e.id === selectedEviId)?.images?.length || 0) > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {evidence.find(e => e.id === selectedEviId)?.images?.map((img, i) => (
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

                <DialogFooter className="flex justify-between items-center w-full">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const evi = evidence.find(e => e.id === selectedEviId);
                      if (evi) {
                        setEditingEvi({
                          name: evi.name,
                          case_id: evi.case_id,
                          type: evi.type,
                          content: evi.content || '',
                          images: evi.images || [],
                          confidentiality: evi.confidentiality
                        });
                        setShowViewModal(false);
                        setShowEditModal(true);
                      }
                    }}
                    className="text-[10px] font-black uppercase tracking-widest h-10 px-6 gap-2"
                  >
                    <FileEdit className="w-4 h-4" /> Modifier
                  </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-[#0a0f18] text-white border-none shadow-xl px-8 py-6 rounded-[32px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c1a461] rounded-full blur-[80px] opacity-10 -mr-16 -mt-16" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="p-3 bg-white/5 rounded-xl w-fit border border-white/10 mb-6">
                 <ShieldCheck className="w-6 h-6 text-[#c1a461]" />
              </div>
              <div>
                <p className="text-2xl font-black leading-none">AES-256 Active</p>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Chiffrement de bout-en-bout</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white border-none shadow-md px-8 py-6 flex flex-col justify-between rounded-[32px]">
            <div className="p-3 bg-[#c1a461]/5 rounded-xl w-fit mb-6">
               <FileDigit className="w-6 h-6 text-[#c1a461]" />
            </div>
            <div>
               <p className="text-2xl font-black text-slate-900 leading-none">{filteredEvidence.length} Éléments</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Données Scellées</p>
            </div>
          </Card>
          <Card className="bg-white border-none shadow-md px-8 py-6 flex flex-col justify-between rounded-[32px]">
            <div className="p-3 bg-red-50 rounded-xl w-fit mb-6">
               <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
               <p className="text-2xl font-black text-slate-900 leading-none">Intégrité 100%</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit de scellement validé</p>
            </div>
          </Card>
        </div>

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Index des Preuves Numériques</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Fichiers multimédias, documents scannés et extraits certifiés</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="RECHERCHER..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9" 
                 />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Réf Preuve / Nom</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidentialité</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Déposé par</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEvidence.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => { setSelectedEviId(item.id); setShowViewModal(true); }}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                          <Fingerprint className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                            {item.images && item.images.length > 0 && (
                              <Badge variant="outline" className="text-[7px] font-black uppercase h-4 px-1 gap-1 border-amber-200 text-amber-600 bg-amber-50">
                                <ImageIcon className="w-2.5 h-2.5" /> {item.images.length} PHOTO{item.images.length > 1 ? 'S' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                      <Link to={`/cabinet/intranet/dossiers/${item.case_id}`}>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-tight hover:text-[#c1a461] transition-colors">{item.case_id}</p>
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.type}</Badge>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1", 
                        item.confidentiality === 'Scellé' ? 'bg-[#0a0f18] text-white' : 
                        item.confidentiality === 'Secret' ? 'bg-red-600 text-white' : 
                        item.confidentiality === 'Confidentiel' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                      )}>
                        {item.confidentiality}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.uploaded_by}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
  );
};

export default EvidenceVault;
