import React from 'react';
import { 
  Scale, 
  Briefcase, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Lock, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  UserPlus, 
  History,
  Activity,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Sidebar, Header } from './Dashboard'; // Reusing components

const CASE_TYPES = ['Pénal', 'Civil', 'Affaires', 'Administratif'];
const CONFIDENTIALITY_LEVELS = ['Normal', 'Confidentiel', 'Secret', 'Scellé'];

const Dossiers = () => {
  const [showNewCaseModal, setShowNewCaseModal] = React.useState(false);
  const [conflictCheckDone, setConflictCheckDone] = React.useState(false);
  const [conflictResult, setConflictResult] = React.useState<'safe' | 'conflict' | null>(null);

  const handleConflictCheck = () => {
    // Simulated conflict check
    setConflictCheckDone(true);
    setConflictResult('safe');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeRole="Associé" />
      
      <main className="flex-grow pl-64">
        <Header />
        
        <div className="p-10 space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des Dossiers (Cases)</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Système centralisé de gestion juridique Harrington & Cole</p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" className="border-2 border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-xl hover:bg-slate-100">
                <Archive className="w-4 h-4 mr-2" /> Archives
              </Button>
              <Button onClick={() => setShowNewCaseModal(true)} className="bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl shadow-xl shadow-[#c1a461]/10">
                <Plus className="w-4 h-4 mr-2" /> Ouvrir un Nouveau Dossier
              </Button>
            </div>
          </div>

          {/* Conflict Check Banner */}
          {!conflictCheckDone && (
            <Card className="bg-amber-50 border-2 border-amber-200 shadow-none p-6 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[24px]">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Vérification des Conflits d'Intérêts Obligatoire</h4>
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1">Aucun dossier ne peut être ouvert sans validation déontologique préalable.</p>
                </div>
              </div>
              <Button onClick={handleConflictCheck} className="bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl">
                Lancer l'Audit de Conflit
              </Button>
            </Card>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Dossiers Actifs", count: "42", color: "text-blue-600" },
              { label: "En Audience", count: "12", color: "text-amber-600" },
              { label: "En Attente", count: "8", color: "text-slate-400" },
              { label: "Clos (Mois)", count: "15", color: "text-emerald-600" }
            ].map((stat, idx) => (
              <Card key={idx} className="border-none shadow-md p-6 bg-white rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className={cn("text-3xl font-black leading-none", stat.color)}>{stat.count}</p>
              </Card>
            ))}
          </div>

          {/* Main List */}
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input placeholder="FILTRER PAR NOM, NUMÉRO..." className="w-72 h-10 bg-slate-50 border-none rounded-lg pl-9 text-[10px] font-bold uppercase tracking-widest focus:ring-1 ring-[#c1a461]/20" />
                </div>
                <Select defaultValue="tous">
                  <SelectTrigger className="w-40 h-10 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase tracking-widest">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="text-[10px] font-black uppercase tracking-widest">
                    <SelectItem value="tous">Tous les Types</SelectItem>
                    {CASE_TYPES.map(t => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300"><Filter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300"><History className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-4">Numéro / Dossier</th>
                    <th className="px-8 py-4">Client Principal</th>
                    <th className="px-8 py-4">Statut / Type</th>
                    <th className="px-8 py-4">Confidentialité</th>
                    <th className="px-8 py-4">Équipe</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: "CASE-2024-882", title: "État vs. Madrazo", client: "Martin Madrazo", type: "Pénal", status: "En cours", conf: "Confidentiel", lead: "Victoria C." },
                    { id: "CASE-2024-912", title: "Mairie LS - Recours", client: "LS Administration", type: "Admin", status: "Audiences", conf: "Normal", lead: "Julian H." },
                    { id: "CASE-2024-945", title: "Union Depository", client: "UD Corp", type: "Affaires", status: "Rédaction", conf: "Secret", lead: "Marcus V." },
                    { id: "CASE-2024-998", title: "Legacy vs. Fleeca", client: "Fleeca Bank", type: "Affaires", status: "Clos", conf: "Normal", lead: "Victoria C." },
                    { id: "CASE-2024-102", title: "Affaire Scellée Audit", client: "Confidentiel", type: "Spécial", status: "Scellé", conf: "Scellé", lead: "Auditeur" }
                  ].map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-[10px]", 
                            item.conf === 'Scellé' ? 'bg-[#0a0f18]' : 'bg-[#c1a461]/10 text-[#c1a461]'
                          )}>
                            {item.conf === 'Scellé' ? <Lock className="w-4 h-4 text-white" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase text-slate-900 leading-none">{item.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[10px] font-black uppercase text-slate-600">{item.client}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <Badge className={cn("w-fit text-[8px] font-black uppercase px-2", 
                            item.status === 'Clos' ? 'bg-emerald-500' : 'bg-[#1B365D]'
                          )}>
                            {item.status}
                          </Badge>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className={cn("text-[8px] font-black uppercase border-2", 
                          item.conf === 'Secret' ? 'border-red-500 text-red-600' : 
                          item.conf === 'Scellé' ? 'border-[#0a0f18] text-[#0a0f18] bg-slate-100' : 'border-slate-200 text-slate-400'
                        )}>
                          {item.conf}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.lead}`} />
                          </Avatar>
                          <span className="text-[9px] font-black uppercase text-slate-500">{item.lead}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-[#c1a461]"><ChevronRight className="w-5 h-5" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Affichage de 5 sur 42 dossiers</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dossiers;
