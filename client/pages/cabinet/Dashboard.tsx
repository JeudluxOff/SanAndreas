import React from 'react';
import { 
  Scale, 
  Briefcase, 
  FileText, 
  FolderOpen, 
  Users, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  ShieldCheck, 
  Activity, 
  Settings,
  Bell,
  Search,
  Plus,
  MoreVertical,
  ChevronRight,
  Clock,
  Lock,
  Archive,
  Menu,
  X,
  UserCheck,
  TrendingUp,
  FileCheck,
  Zap,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const ROLE_COLORS = {
  'Associé': 'bg-amber-600 text-white',
  'Avocat': 'bg-blue-600 text-white',
  'Juriste': 'bg-slate-600 text-white',
  'Secrétaire': 'bg-emerald-600 text-white',
  'Comptable': 'bg-indigo-600 text-white',
  'Stagiaire': 'bg-slate-400 text-white',
  'Auditeur': 'bg-red-600 text-white'
};

export const Sidebar = ({ activeRole }: { activeRole: string }) => (
  <div className="w-64 bg-[#0a0f18] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-white/5 z-50">
    <div className="p-8 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#c1a461] rounded shadow-lg">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xs font-black tracking-[0.2em] uppercase">Harrington <span className="text-[#c1a461]">&</span> Cole</h1>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Intranet Legal</p>
        </div>
      </div>
    </div>

    <div className="flex-grow overflow-y-auto p-4 space-y-2 py-8">
      {[
        { icon: <Activity className="w-4 h-4" />, label: "Tableau de Bord", path: "/cabinet/intranet" },
        { icon: <Briefcase className="w-4 h-4" />, label: "Dossiers (Cases)", path: "/cabinet/intranet/dossiers" },
        { icon: <FileText className="w-4 h-4" />, label: "Documents", path: "/cabinet/intranet/documents" },
        { icon: <ShieldCheck className="w-4 h-4" />, label: "Preuves (Vault)", path: "/cabinet/intranet/evidence" },
        { icon: <Calendar className="w-4 h-4" />, label: "Planning", path: "/cabinet/intranet/planning" },
        { icon: <CreditCard className="w-4 h-4" />, label: "Facturation", path: "/cabinet/intranet/billing" },
        { icon: <MessageSquare className="w-4 h-4" />, label: "Communication", path: "/cabinet/intranet/communication" },
        { icon: <Users className="w-4 h-4" />, label: "Clients", path: "/cabinet/intranet/clients" },
        { icon: <Lock className="w-4 h-4" />, label: "Audit & Logs", path: "/cabinet/intranet/audit" },
        { icon: <Settings className="w-4 h-4" />, label: "Administration", path: "/cabinet/intranet/admin" }
      ].map((item, idx) => (
        <button key={idx} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white/40 hover:text-[#c1a461] hover:bg-white/5 transition-all text-left">
          {item.icon}
          <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </div>

    <div className="p-6 bg-white/5 m-4 rounded-xl border border-white/5">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 ring-2 ring-[#c1a461]/20">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Julian`} />
          <AvatarFallback>JH</AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <p className="text-[10px] font-black truncate">Julian Harrington</p>
          <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0 mt-1", ROLE_COLORS['Associé'])}>
            Associé
          </Badge>
        </div>
      </div>
    </div>
  </div>
);

export const Header = () => (
  <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-8">
      <Link to="/cabinet">
        <Button variant="ghost" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#c1a461] hover:bg-[#c1a461]/5 gap-2 group px-0">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="hidden md:inline">Sortir du Cabinet</span>
        </Button>
      </Link>

      <div className="h-6 w-px bg-slate-100" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="RECHERCHER UN DOSSIER, UN CLIENT, UN DOCUMENT..."
          className="w-96 h-10 bg-slate-50 border-none rounded-lg pl-10 text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-400 focus:ring-2 ring-primary/5 transition-all"
        />
      </div>
    </div>

    <div className="flex items-center gap-6">
      <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>
      <div className="h-8 w-px bg-slate-100" />
      <Button className="bg-[#0a0f18] text-white font-black uppercase text-[10px] tracking-widest h-10 px-6 gap-2">
        <Plus className="w-4 h-4" /> Nouveau Dossier
      </Button>
    </div>
  </header>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeRole="Associé" />
      
      <main className="flex-grow pl-64">
        <Header />
        
        <div className="p-10 space-y-10">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tableau de Bord Stratégique</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3 text-[#c1a461]" /> Lundi 24 Mai 2024 • 09:42 • Session Sécurisée
              </p>
            </div>
            
            <div className="flex gap-4">
              <Card className="bg-white border-none shadow-md px-6 py-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 leading-none">12.4k SA$</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Facturation Mois</p>
                </div>
              </Card>
              <Card className="bg-white border-none shadow-md px-6 py-4 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 leading-none">42</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dossiers Actifs</p>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-10">
              {/* Active Cases */}
              <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-[#c1a461]" /> Vos Dossiers Prioritaires
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Dossiers dont vous êtes responsable</CardDescription>
                  </div>
                  <Button variant="ghost" className="text-[10px] font-black uppercase text-primary">Tout voir</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {[
                      { id: "CASE-2024-882", title: "État de SA vs. Madrazo", type: "Pénal", status: "En cours", conf: "Confidentiel" },
                      { id: "CASE-2024-912", title: "Mairie LS - Recours Administratif", type: "Admin", status: "Audiences", conf: "Normal" },
                      { id: "CASE-2024-945", title: "Union Depository - Fusion", type: "Affaires", status: "Rédaction", conf: "Secret" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
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
                        <div className="flex items-center gap-6">
                          <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1", 
                            item.conf === 'Secret' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                          )}>
                            {item.conf}
                          </Badge>
                          <div className="text-right">
                             <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{item.status}</p>
                             <div className="w-20 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                               <div className="h-full bg-[#c1a461]" style={{ width: '60%' }} />
                             </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#c1a461] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tasks and Deadlines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="border-none shadow-xl rounded-[32px] bg-[#0a0f18] text-white">
                  <CardHeader className="p-8 border-b border-white/5">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#c1a461]" /> Tâches Urgentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {[
                      { task: "Dépôt conclusions pénales", case: "Madrazo", due: "14:00" },
                      { task: "Vérification Conflits", case: "Nouveau Dossier V.", due: "Demain" }
                    ].map((task, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-1 h-full bg-[#c1a461] rounded-full" />
                        <div className="flex-grow">
                          <p className="text-[11px] font-black uppercase leading-tight">{task.task}</p>
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Dossier: {task.case} • {task.due}</p>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl">
                      Gestionnaire de Tâches
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl rounded-[32px] bg-white">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#c1a461]" /> Prochaines Audiences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {[
                      { date: "26 Mai", title: "Audience Préliminaire", judge: "Hon. J. Miller" },
                      { date: "28 Mai", title: "Jugement en Référé", judge: "Hon. S. Wright" }
                    ].map((hearing, idx) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <div className="text-center">
                          <p className="text-xl font-black text-slate-900 leading-none">{hearing.date.split(' ')[0]}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{hearing.date.split(' ')[1]}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase text-slate-900">{hearing.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{hearing.judge}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar Content Area */}
            <div className="space-y-10">
              {/* Activity Audit */}
              <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden">
                <CardHeader className="p-8 bg-slate-900 text-white">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#c1a461]" /> Journal d'Audit (Securisé)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[
                      { user: "Victoria C.", action: "Accès Dossier Scellé", time: "10m" },
                      { user: "Marcus V.", action: "Signature Document", time: "2h" },
                      { user: "Secrétariat", action: "Upload Preuve Vault", time: "4h" }
                    ].map((log, idx) => (
                      <div key={idx} className="flex items-start gap-4 text-[10px] font-bold uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 bg-[#c1a461] rounded-full mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-slate-900 leading-none">{log.user} — <span className="text-slate-400">{log.action}</span></p>
                          <p className="text-[9px] text-slate-400 tracking-widest mt-1">Il y a {log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-10 border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl">
                    Voir les Logs Complets
                  </Button>
                </CardContent>
              </Card>

              {/* Secure Vault Info */}
              <Card className="border-none shadow-xl rounded-[32px] bg-gradient-to-br from-[#c1a461] to-[#927843] text-white p-8 space-y-6">
                <div className="p-3 bg-white/20 rounded-2xl w-fit">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Evidence Vault v2.4</h3>
                  <p className="text-white/70 text-sm font-medium leading-relaxed uppercase tracking-tight">
                    Stockage chiffré de bout-en-bout. Toutes les preuves numériques sont scellées et horodatées par le Parquet Général.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-white/20 text-[10px] font-black uppercase tracking-widest">
                  <span>Capacité: 84%</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full animate-pulse">Système Sécurisé</span>
                </div>
              </Card>

              {/* Quick Communication */}
              <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Communication</CardTitle>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {[
                    { name: "Victoria Cole", status: "online", msg: "Dossier Madrazo validé..." },
                    { name: "Marcus Vane", status: "busy", msg: "En audience cour suprême" }
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      </Avatar>
                      <div className="flex-grow">
                        <p className="text-[11px] font-black uppercase text-slate-900 leading-none">{user.name}</p>
                        <p className="text-[9px] text-slate-400 truncate mt-1">{user.msg}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-primary tracking-widest">Ouvrir le Chat Cabinet</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
