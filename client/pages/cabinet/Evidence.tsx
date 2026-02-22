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
  Clock
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
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { Evidence, ConfidentialityLevel } from '@shared/api';
import { Link } from 'react-router-dom';

const EvidenceVault = () => {
  const { user } = useAuth();
  const [evidence, setEvidence] = React.useState(legalStore.getCases().flatMap(c => legalStore.getEvidence(c.id)));
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newEvidence, setNewEvidence] = React.useState({
    name: '',
    case_id: '',
    type: 'Document',
    confidentiality: 'Normal' as ConfidentialityLevel
  });

  const cases = legalStore.getCases();

  const handleUpload = () => {
    if (!user || !newEvidence.name || !newEvidence.case_id) return;

    const evi: Evidence = {
      id: `EVI-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`,
      case_id: newEvidence.case_id,
      name: newEvidence.name,
      type: newEvidence.type,
      file_url: '#',
      confidentiality: newEvidence.confidentiality,
      uploaded_by: user.name,
      uploaded_at: new Date().toISOString(),
      to_produce_at_hearing: false
    };

    legalStore.addEvidence(evi);
    setEvidence(legalStore.getCases().flatMap(c => legalStore.getEvidence(c.id)));
    setShowUploadModal(false);
    setNewEvidence({ name: '', case_id: '', type: 'Document', confidentiality: 'Normal' });
    
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
  };

  const filteredEvidence = evidence.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.case_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LegalIntranetLayout>
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
                disabled={!newEvidence.name || !newEvidence.case_id}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl"
              >
                Chiffrer & Sceller
              </Button>
            </DialogFooter>
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
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                    <td className="px-8 py-6">
                      <Link to={`/cabinet/intranet/dossiers/${item.case_id}`} className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                          <Fingerprint className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.case_id}</p>
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
    </LegalIntranetLayout>
  );
};

export default EvidenceVault;
