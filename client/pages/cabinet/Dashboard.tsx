import React from 'react';
import { 
  Briefcase, 
  FolderOpen, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Zap,
  FileSignature,
  CreditCard,
  BellRing,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import LegalIntranetLayout from './intranet/LegalIntranetLayout';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const cases = legalStore.getCases();
  const tasks = legalStore.getTasks(undefined, user?.id);
  const docs = legalStore.getDocuments();
  const hearings = legalStore.getHearings();
  const invoices = legalStore.getInvoices();

  const urgentTasks = tasks.filter(t => t.priority === 'Critique' || t.priority === 'Haute');
  const pendingDocs = docs.filter(d => d.status === 'Relecture' || d.status === 'Validé');
  const activeCases = cases.filter(c => c.status === 'En cours');
  const unpaidInvoices = invoices.filter(i => i.status === 'En retard' || i.status === 'Envoyé');

  const totalBilling = invoices.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <LegalIntranetLayout>
      <div className="p-10 space-y-10">
        {/* Urgent Alerts Bar */}
        <div className="flex gap-4 animate-in slide-in-from-top duration-700">
          <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-3 flex items-center gap-4 flex-grow shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
            <div className="flex-grow">
              <p className="text-[10px] font-black text-red-900 uppercase tracking-widest">Alerte Prioritaire</p>
              <p className="text-xs font-bold text-red-700/70 uppercase">
                {urgentTasks.length > 0 ? `Tâche urgente : ${urgentTasks[0].title}` : 'Aucune alerte critique immédiate'}
              </p>
            </div>
            {urgentTasks.length > 0 && (
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-black uppercase h-8 px-4 rounded-lg">Consulter</Button>
            )}
          </div>
          <div className="bg-[#c1a461]/10 border border-[#c1a461]/20 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm">
            <BellRing className="w-5 h-5 text-[#c1a461]" />
            <div>
              <p className="text-[10px] font-black text-[#c1a461] uppercase tracking-widest">Notification</p>
              <p className="text-xs font-bold text-[#c1a461]/70 uppercase">{pendingDocs.length} nouveaux documents en attente</p>
            </div>
          </div>
        </div>

        {/* Hero Section with Global Metrics */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tableau de Bord Stratégique</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#c1a461]" /> {new Date().toLocaleString()} • Session Sécurisée AES-256
            </p>
          </div>
          
          <div className="flex gap-4">
            <Card className="bg-white border-none shadow-md px-6 py-4 flex items-center gap-4 rounded-2xl">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{totalBilling.toLocaleString()} SA$</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Facturation Totale</p>
              </div>
            </Card>
            <Card className="bg-white border-none shadow-md px-6 py-4 flex items-center gap-4 rounded-2xl">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{activeCases.length}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dossiers Actifs</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: Tasks & Cases */}
          <div className="lg:col-span-2 space-y-10">
            {/* Action Required: Documents & Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden border-t-4 border-amber-500">
                <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-900">
                    <FileSignature className="w-4 h-4 text-amber-500" /> Documents en Attente
                  </CardTitle>
                  <Badge className="bg-amber-100 text-amber-700 border-none text-[10px]">{pendingDocs.length} Docs</Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {pendingDocs.slice(0, 3).map((doc, idx) => (
                    <Link key={idx} to={`/cabinet/intranet/dossiers/${doc.case_id}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-all cursor-pointer">
                      <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase text-slate-900 leading-tight">{doc.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{doc.id} • {doc.category}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-600 text-[8px] uppercase">{doc.status}</Badge>
                    </Link>
                  ))}
                  {pendingDocs.length === 0 && (
                     <p className="text-center py-6 text-[10px] font-bold text-slate-400 uppercase">Aucun document en attente</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[32px] bg-[#0a0f18] text-white overflow-hidden border-t-4 border-[#c1a461]">
                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#c1a461]" /> Tâches Prioritaires
                  </CardTitle>
                  <Badge className="bg-[#c1a461] text-white border-none text-[10px]">{urgentTasks.length} Urgent</Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {urgentTasks.slice(0, 3).map((task, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                      <div className={cn("w-1 h-full rounded-full", task.priority === 'Critique' ? 'bg-red-500' : 'bg-[#c1a461]')} />
                      <div className="flex-grow">
                        <p className="text-[11px] font-black uppercase leading-tight">{task.title}</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Échéance: {new Date(task.due_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {urgentTasks.length === 0 && (
                     <p className="text-center py-6 text-[10px] font-bold text-white/20 uppercase">Aucune tâche urgente</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Active Cases Priority List */}
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-[#c1a461]" /> Dossiers Actifs
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Aperçu des dossiers prioritaires</CardDescription>
                </div>
                <Link to="/cabinet/intranet/dossiers">
                   <Button variant="ghost" className="text-[10px] font-black uppercase text-[#c1a461]">Gérer tout</Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {activeCases.slice(0, 5).map((item, idx) => (
                    <Link to={`/cabinet/intranet/dossiers/${item.id}`} key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-white group-hover:text-[#c1a461] shadow-inner transition-all">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-slate-900 uppercase tracking-tighter">{item.title}</h4>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.id}</Badge>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{item.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1", 
                          item.confidentiality === 'Secret' ? 'bg-red-600 text-white' : 
                          item.confidentiality === 'Confidentiel' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                        )}>
                          {item.confidentiality}
                        </Badge>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#c1a461] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Column: Calendar & Audit */}
          <div className="space-y-10">
            {/* Upcoming Hearings */}
            <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 bg-[#c1a461]/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-[#c1a461]">
                  <Calendar className="w-4 h-4" /> Audiences à Venir
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {hearings.slice(0, 3).map((hearing, idx) => (
                  <Link to={`/cabinet/intranet/dossiers/${hearing.case_id}`} key={idx} className="flex gap-6 items-center p-4 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="text-center bg-slate-900 text-white rounded-xl p-3 min-w-[60px] group-hover:bg-[#c1a461] transition-colors">
                      <p className="text-lg font-black leading-none">{new Date(hearing.date).getDate()}</p>
                      <p className="text-[8px] font-bold uppercase mt-1 opacity-60">
                        {new Date(hearing.date).toLocaleString('default', { month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-slate-900 leading-tight">{hearing.title}</p>
                      <p className="text-[9px] font-bold text-[#c1a461] uppercase mt-0.5">{hearing.judge}</p>
                    </div>
                  </Link>
                ))}
                <Link to="/cabinet/intranet/planning">
                  <Button variant="outline" className="w-full border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                    Calendrier Complet
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Financial Alerts: Unpaid Invoices */}
            <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-red-600">
                  <CreditCard className="w-4 h-4" /> Honoraires en Attente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {unpaidInvoices.slice(0, 3).map((inv, idx) => {
                  const client = legalStore.getClient(inv.client_id);
                  return (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase text-slate-900 leading-tight">{client?.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Échéance : {new Date(inv.due_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-red-600 tracking-tighter">{inv.amount.toLocaleString()} {inv.currency}</p>
                        <Badge className={cn("text-[8px] font-black uppercase border-none px-2 py-0", 
                           inv.status === 'En retard' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                        )}>
                           {inv.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                <Link to="/cabinet/intranet/billing">
                  <Button className="w-full bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl hover:bg-slate-800 transition-all">
                    Module Facturation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Evidence Vault Status Widget */}
            <Card className="border-none shadow-xl rounded-[32px] bg-gradient-to-br from-[#c1a461] to-[#927843] text-white p-8 space-y-6">
              <div className="p-3 bg-white/20 rounded-2xl w-fit border border-white/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter">Evidence Vault Status</h3>
                <p className="text-white/70 text-[10px] font-medium leading-relaxed uppercase tracking-tight">
                  Système de stockage chiffré opérationnel. <br /> Intégrité des preuves : 100%.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-white/20 text-[10px] font-black uppercase tracking-widest">
                <span>Capacité: 84%</span>
                <span className="bg-white/20 px-3 py-1 rounded-full animate-pulse">SÉCURISÉ</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </LegalIntranetLayout>
  );
};

export default Dashboard;
