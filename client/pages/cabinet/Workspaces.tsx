import React from 'react';
import { 
  Gavel, 
  Users, 
  Briefcase, 
  Landmark, 
  Settings, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Plus, 
  ChevronRight,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Lock,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import LegalIntranetLayout from './intranet/LegalIntranetLayout';
import { legalStore } from '@/lib/legal-store';
import { CaseType } from '@shared/api';
import { Link } from 'react-router-dom';

const WORKSPACES_CONFIG = [
  { 
    id: 'penal' as CaseType, 
    name: 'Pôle Pénal', 
    icon: <Gavel className="w-6 h-6" />, 
    color: 'text-red-600', 
    bg: 'bg-red-50',
    procedures: ["Audit de conflit", "Dépôt conclusions", "Scellement Vault"]
  },
  { 
    id: 'civil' as CaseType, 
    name: 'Pôle Civil', 
    icon: <Users className="w-6 h-6" />, 
    color: 'text-[#c1a461]', 
    bg: 'bg-[#c1a461]/5',
    procedures: ["Convention Honoraires", "Assignation", "Signification"]
  },
  { 
    id: 'affaires' as CaseType, 
    name: 'Pôle Affaires', 
    icon: <Briefcase className="w-6 h-6" />, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    procedures: ["Fusion-Acquisition", "Audit LCB-FT", "Contrat cadre"]
  },
  { 
    id: 'admin' as CaseType, 
    name: 'Pôle Administratif', 
    icon: <Landmark className="w-6 h-6" />, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50',
    procedures: ["Recours pour excès de pouvoir", "Urbanisme", "Marchés publics"]
  }
];

const Workspaces = () => {
  const [selectedType, setSelectedType] = React.useState<CaseType>('Pénal');
  const cases = legalStore.getCases();
  
  const selectedConfig = WORKSPACES_CONFIG.find(w => w.name.includes(selectedType)) || WORKSPACES_CONFIG[0];
  const activeCases = cases.filter(c => c.type === selectedType && c.status === 'En cours');
  const poleDocs = legalStore.getDocuments().filter(d => {
    const c = legalStore.getCase(d.case_id);
    return c?.type === selectedType;
  });

  return (
    <LegalIntranetLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1 text-left">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Espaces de Travail (Pôles)</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Organisation par spécialité • Procédures dédiées • Performance analytique
            </p>
          </div>
          <div className="flex gap-4">
            <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Plus className="w-4 h-4" /> Nouveau Pôle
            </Button>
          </div>
        </div>

        {/* Horizontal Workspace Selector */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {WORKSPACES_CONFIG.map((ws) => {
            const type = ws.name.split(' ')[1] as CaseType;
            const poleCases = cases.filter(c => c.type === type);
            return (
              <Card 
                key={ws.id}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "cursor-pointer transition-all duration-500 border-none shadow-md hover:shadow-xl rounded-3xl group overflow-hidden",
                  selectedType === type ? "ring-2 ring-[#c1a461] shadow-[#c1a461]/10 scale-[1.02]" : "hover:-translate-y-1"
                )}
              >
                <CardContent className="p-8">
                  <div className={cn("p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110", ws.bg, ws.color)}>
                    {ws.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 text-left">{ws.name}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex -space-x-2">
                      {[1, 2].map((i) => (
                        <Avatar key={i} className="h-6 w-6 ring-2 ring-white">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Pole${ws.id}${i}`} />
                        </Avatar>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200">{poleCases.length} Dossiers</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Workspace Detail Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Procedures & Docs */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-4">
               <div className={cn("p-3 rounded-xl", selectedConfig.bg, selectedConfig.color)}>
                 {selectedConfig.icon}
               </div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedConfig.name} — Workspace</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#c1a461]" /> Procédures & Modèles
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]"><Plus className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {selectedConfig.procedures.map((proc, idx) => (
                      <div key={idx} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <FileText className="w-4 h-4 text-slate-300 group-hover:text-[#c1a461]" />
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-tight text-left">{proc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-200 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-50">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#c1a461]" /> Dossiers Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {activeCases.slice(0, 5).map((c) => (
                      <Link to={`/cabinet/intranet/dossiers/${c.id}`} key={c.id} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                        <div className="space-y-0.5 text-left">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{c.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{c.id}</p>
                        </div>
                        <Badge className="bg-slate-100 text-slate-600 text-[8px] font-black">{c.status}</Badge>
                      </Link>
                    ))}
                    {activeCases.length === 0 && (
                       <p className="p-10 text-center text-slate-400 uppercase font-black text-[10px]">Aucun dossier actif</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance KPIs */}
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-[#0a0f18] text-white">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-[#c1a461]">
                  <TrendingUp className="w-4 h-4" /> Performance du Pôle
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Docs Indexés</p>
                    <div className="text-center">
                       <p className="text-4xl font-black text-white">{poleDocs.length}</p>
                       <p className="text-[9px] font-bold text-[#c1a461] uppercase tracking-widest mt-2">Volume Documentaire</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-center">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Dossiers / Avocat</p>
                    <p className="text-4xl font-black text-white">4.2</p>
                    <p className="text-[9px] font-bold text-[#c1a461] uppercase tracking-widest">Ratio Optimal</p>
                  </div>
                  <div className="space-y-4 text-center">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Taux de Clôture</p>
                    <p className="text-4xl font-black text-white">92%</p>
                    <p className="text-[9px] font-bold text-[#c1a461] uppercase tracking-widest">Performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Notes & Members */}
          <div className="lg:col-span-4 space-y-10">
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Équipe du Pôle</CardTitle>
                <Users className="w-4 h-4 text-slate-300" />
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 ring-2 ring-slate-100">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Staff${selectedType}${i}`} />
                    </Avatar>
                    <div className="flex-grow text-left">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Staff Member {i}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pôle {selectedType}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl">
                  Gérer les Affectations
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[32px] bg-[#c1a461] text-white p-8 space-y-6">
              <div className="p-3 bg-white/20 rounded-2xl w-fit">
                 <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2 text-left">
                <h3 className="text-lg font-black uppercase tracking-tighter">Objectifs Trimestriels</h3>
                <p className="text-white/80 text-xs font-medium leading-relaxed uppercase tracking-tight leading-loose">
                  • Atteindre 95% de satisfaction client. <br />
                  • Réduire le temps de relecture de 15%. <br />
                  • Digitalisation totale des archives 2023.
                </p>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: '65%' }} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </LegalIntranetLayout>
  );
};

export default Workspaces;
