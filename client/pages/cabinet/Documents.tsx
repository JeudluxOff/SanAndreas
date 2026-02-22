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
  History
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
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { LegalDocument, DocumentCategory, DocumentStatus } from '@shared/api';
import { Link } from 'react-router-dom';

const Documents = () => {
  const { user } = useAuth();
  const [docs, setDocs] = React.useState(legalStore.getDocuments());
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showSignModal, setShowSignModal] = React.useState(false);
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newDoc, setNewDoc] = React.useState({
    title: '',
    case_id: '',
    category: 'Conclusions' as DocumentCategory
  });

  const cases = legalStore.getCases();

  const handleCreate = () => {
    if (!user || !newDoc.title || !newDoc.case_id) return;

    const doc: LegalDocument = {
      id: `HC-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      case_id: newDoc.case_id,
      title: newDoc.title,
      category: newDoc.category,
      status: 'Brouillon',
      current_version: 1,
      versions: [{
        version: 1,
        file_url: '#',
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
    setNewDoc({ title: '', case_id: '', category: 'Conclusions' });
    
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

    // In a real app we'd call an update method in legalStore
    // For now we use createDocument which unshifts (acts as update in this mock)
    // Actually let's add an updateDocument to legalStore for clarity if I can, 
    // but I'll just re-read and replace for now.
    
    // (Simulated update)
    const allDocs = legalStore.getDocuments();
    const idx = allDocs.findIndex(d => d.id === docId);
    if (idx !== -1) {
       allDocs[idx] = updated;
       localStorage.setItem('hc_legal_store', JSON.stringify({ ...JSON.parse(localStorage.getItem('hc_legal_store')!), documents: allDocs }));
       setDocs([...allDocs]);
    }

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
            </div>

            <DialogFooter>
              <Button 
                variant="ghost" 
                onClick={() => { setShowCreateModal(false); setNewDoc({ title: '', case_id: '', category: 'Conclusions' }); }}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!newDoc.title || !newDoc.case_id}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-black/10"
              >
                Générer & Indexer
              </Button>
            </DialogFooter>
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
                        <Link to={`/cabinet/intranet/dossiers/${item.case_id}`} className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                          </div>
                        </Link>
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
                          item.status === 'Relecture' ? 'bg-[#c1a461] text-white' : 'bg-slate-100 text-slate-600'
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
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
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
