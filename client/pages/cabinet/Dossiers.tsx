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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import LegalIntranetLayout from './intranet/LegalIntranetLayout';

const MOCK_EXISTING_CLIENTS = [
  "Martin Madrazo",
  "Union Depository",
  "Thornton Duggan",
  "Gouvernement SA",
  "Mairie de Los Santos"
];

const Dossiers = () => {
  const [showConflictModal, setShowConflictModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [conflictResult, setConflictResult] = React.useState<'none' | 'conflict' | null>(null);

  const handleConflictCheck = () => {
    if (MOCK_EXISTING_CLIENTS.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()))) {
      setConflictResult('conflict');
    } else {
      setConflictResult('none');
    }
  };

  return (
    <LegalIntranetLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des Dossiers</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Index centralisé des affaires • 42 dossiers actifs
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Filter className="w-4 h-4" /> Filtrer
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                </div>
              )}

              {conflictResult === 'conflict' && (
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top duration-500">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-red-900 uppercase tracking-tight">CONFLIT D'INTÉRÊTS DÉTECTÉ</p>
                      <p className="text-[10px] font-bold text-red-700/60 uppercase tracking-widest mt-1">L'entité est déjà cliente ou partie adverse dans un dossier actif (Réf: Dossier Madrazo). Création bloquée.</p>
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
                  setSearchQuery('');
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

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro / Dossier</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Principal</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut / Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidentialité</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Équipe</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: "HC-2024-001", title: "État de SA vs. Madrazo", client: "Martin Madrazo", type: "Pénal", status: "Audiences", conf: "Confidentiel", lead: "Victoria C." },
                  { id: "HC-2024-002", title: "Fusion UD & Fleeca", client: "Union Depository", type: "Affaires", status: "Rédaction", conf: "Secret", lead: "Julian H." },
                  { id: "HC-2024-003", title: "V. Duggan - Succession", client: "Thornton Duggan", type: "Civil", status: "En attente", conf: "Normal", lead: "Marcus V." },
                  { id: "HC-2024-004", title: "Mairie LS - Urbanisme", client: "Gouvernement SA", type: "Admin", status: "Plaidoirie", conf: "Normal", lead: "Elena R." },
                  { id: "HC-2024-005", title: "Scellé - Affaire 402", client: "Confidentiel", type: "Pénal", status: "Scellé", conf: "Scellé", lead: "Associé Uniquement" }
                ].map((item, idx) => {
                  const isSealed = item.conf === 'Scellé';
                  return (
                    <tr
                      key={idx}
                      onClick={() => {
                        if (isSealed) {
                          alert(`ACCÈS SÉCURISÉ : Votre tentative d'accès au dossier scellé ${item.id} a été enregistrée dans les logs d'audit.`);
                        }
                      }}
                      className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.client}</span>
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
                          item.conf === 'Scellé' ? 'bg-[#0a0f18] text-white' :
                          item.conf === 'Secret' ? 'bg-red-600 text-white' :
                          item.conf === 'Confidentiel' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                        )}>
                          {isSealed && <Lock className="w-2 h-2 mr-1 inline-block" />}
                          {item.conf}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.lead}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </LegalIntranetLayout>
  );
};

export default Dossiers;
