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
import LegalIntranetLayout from './intranet/LegalIntranetLayout';

const INITIAL_DOCS = [
  { id: "HC-2024-0882", name: "Conclusions Pénales - Madrazo", case: "Dossier #882", cat: "Conclusions", status: "Signé", ver: "v3" },
  { id: "HC-2024-0912", name: "Requête en Référé - LS Mairie", case: "Dossier #912", cat: "Requête", status: "Validé", ver: "v2" },
  { id: "HC-2024-0945", name: "Accord de Confidentialité UD", case: "Dossier #945", cat: "Convention", status: "Brouillon", ver: "v1" },
  { id: "HC-2024-0988", name: "Mémoire en Défense - Duggan", case: "Dossier #988", cat: "Mémoire", status: "Validé", ver: "v4" }
];

const Documents = () => {
  const [docs, setDocs] = React.useState(INITIAL_DOCS);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newDoc, setNewDoc] = React.useState({
    name: '',
    case: '',
    cat: 'Conclusions'
  });

  const handleCreate = () => {
    const newEntry = {
      id: `HC-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      name: newDoc.name,
      case: newDoc.case || "Dossier #000",
      cat: newDoc.cat,
      status: "Brouillon",
      ver: "v1"
    };
    setDocs([newEntry, ...docs]);
    setShowCreateModal(false);
    setNewDoc({ name: '', case: '', cat: 'Conclusions' });
    alert("DOCUMENT CRÉÉ : Le document a été généré et indexé sous le numéro " + newEntry.id);
  };

  const handleUpdateStatus = (idx: number, nextStatus: string) => {
    const updatedDocs = [...docs];
    const currentVer = parseInt(updatedDocs[idx].ver.substring(1));
    updatedDocs[idx].status = nextStatus;
    updatedDocs[idx].ver = `v${currentVer + 1}`;
    setDocs(updatedDocs);
    alert(`WORKFLOW : Document mis à jour vers le statut [${nextStatus}]. Nouvelle version : ${updatedDocs[idx].ver}`);
  };

  return (
    <LegalIntranetLayout>
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
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                  placeholder="EX: CONCLUSIONS PÉNALES..." 
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</Label>
                  <Select 
                    value={newDoc.cat}
                    onValueChange={(val) => setNewDoc({...newDoc, cat: val})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conclusions">Conclusions</SelectItem>
                      <SelectItem value="Requête">Requête</SelectItem>
                      <SelectItem value="Convention">Convention</SelectItem>
                      <SelectItem value="Plainte">Plainte</SelectItem>
                      <SelectItem value="Mémoire">Mémoire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Réf Dossier</Label>
                  <Input 
                    value={newDoc.case}
                    onChange={(e) => setNewDoc({...newDoc, case: e.target.value})}
                    placeholder="EX: DOSSIER #882" 
                    className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="ghost" 
                onClick={() => setShowCreateModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!newDoc.name}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-black/10"
              >
                Générer & Indexer
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
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Documents Récents</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Index des conclusions, requêtes et conventions</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                 <input type="text" placeholder="RECHERCHER..." className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro / Nom</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Version</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {docs.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.case}</p>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.cat}</Badge>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1", 
                        item.status === 'Signé' ? 'bg-emerald-600 text-white' : 
                        item.status === 'Validé' ? 'bg-blue-600 text-white' : 
                        item.status === 'Relu' ? 'bg-[#c1a461] text-white' : 'bg-slate-100 text-slate-600'
                      )}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-black text-slate-500 uppercase">{item.ver}</span>
                         <History className="w-3 h-3 text-slate-300" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        {item.status === 'Brouillon' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(idx, 'Validé'); }}
                            className="text-slate-300 hover:text-blue-600"
                          >
                            <FileCheck className="w-4 h-4" />
                          </Button>
                        )}
                        {item.status === 'Validé' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(idx, 'Signé'); }}
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
          </CardContent>
        </Card>
      </div>
    </LegalIntranetLayout>
  );
};

export default Documents;
