import React from 'react';
import { 
  Zap, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Lock,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Flag,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import LegalIntranetLayout from './intranet/LegalIntranetLayout';

const Tasks = () => {
  return (
    <LegalIntranetLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des Tâches</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Assignations par dossier • Priorités Stratégiques • Suivi d'avancement
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Calendar className="w-4 h-4" /> Vue Calendrier
            </Button>
            <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Plus className="w-4 h-4" /> Nouvelle Tâche
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: "À Faire", value: 24, icon: <AlertCircle className="w-5 h-5" />, color: "text-slate-600", bg: "bg-slate-50" },
            { label: "En Cours", value: 12, icon: <Zap className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Urgent", value: 5, icon: <Flag className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" },
            { label: "Terminées", value: 184, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
                <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Liste des Tâches Actives</CardTitle>
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">Tout voir</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {[
                    { title: "Dépôt conclusions pénales", case: "Madrazo - Dossier #882", due: "Aujourd'hui, 14:00", prio: "Critique", by: "Victoria C." },
                    { title: "Révision contrat de fusion", case: "UD Fusion - Dossier #945", due: "Demain", prio: "Haute", by: "Julian H." },
                    { title: "Vérification Conflits V. Duggan", case: "Succession Duggan", due: "26 Mai", prio: "Normale", by: "Marcus V." },
                    { title: "Préparation de l'audience", case: "LS Mairie - Dossier #912", due: "28 Mai", prio: "Haute", by: "Elena R." }
                  ].map((task, idx) => (
                    <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className={cn("w-1.5 h-12 rounded-full", 
                          task.prio === 'Critique' ? 'bg-red-500' : 
                          task.prio === 'Haute' ? 'bg-amber-500' : 'bg-[#c1a461]'
                        )} />
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-slate-900 uppercase tracking-tighter">{task.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.case} • {task.due}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1", 
                          task.prio === 'Critique' ? 'bg-red-600 text-white' : 
                          task.prio === 'Haute' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                        )}>
                          {task.prio}
                        </Badge>
                        <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                          <AvatarFallback className="text-[8px] font-black">{task.by.split(' ')[0][0]}{task.by.split(' ')[1][0]}</AvatarFallback>
                        </Avatar>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#c1a461] transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[32px] bg-[#0a0f18] text-white p-8">
              <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#c1a461]" /> Vos Tâches
                </CardTitle>
                <Badge className="bg-[#c1a461] text-white text-[8px] font-black uppercase tracking-widest border-none">4 ACTIVES</Badge>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {[
                  { task: "Signature conclusions HC-882", due: "URGENT" },
                  { task: "Relecture requête Fleeca", due: "DEMAIN" },
                  { task: "Briefing Stagiaire - Dossier 402", due: "VENDREDI" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="w-1 h-full bg-[#c1a461] rounded-full" />
                    <div>
                      <p className="text-[11px] font-black uppercase text-white leading-tight">{item.task}</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{item.due}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[32px] bg-white p-8 space-y-6">
              <div className="p-3 bg-emerald-50 rounded-2xl w-fit">
                 <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tighter">Productivité Cabinet</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-tight">
                  Vous avez clôturé 12 dossiers ce mois-ci. Votre taux de complétion des tâches est de 94%.
                </p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </LegalIntranetLayout>
  );
};

export default Tasks;
