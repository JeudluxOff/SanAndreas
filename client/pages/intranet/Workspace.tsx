import { useParams, Link } from "react-router-dom";
import { 
  Briefcase, 
  FileText, 
  FolderOpen, 
  Users, 
  MessageSquare, 
  Book, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  HeartPulse,
  Gavel,
  ShieldAlert,
  Download,
  Printer
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Workspace = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  // Mock data for workspaces
  const workspaces = {
    cabinet: {
      name: "Cabinet du Gouverneur",
      icon: <ShieldCheck className="w-8 h-8" />,
      color: "bg-primary",
      members: 12,
      activeDossiers: 8,
      description: "Centre névralgique du gouvernement. Gestion des décrets, de la stratégie politique et des relations institutionnelles.",
      procedures: ["Rédaction d'un décret", "Protocole de signature", "Liaison inter-agences"],
      staff: [
        { name: "Arthur Vance", role: "Gouverneur", role_short: "Gov" },
        { name: "Elena Rodriguez", role: "Press Secretary", role_short: "PR" },
        { name: "Julian Frost", role: "Secrétaire Santé", role_short: "Santé" }
      ]
    },
    securite: {
      name: "Sécurité Publique (LSPD/LSSD)",
      icon: <ShieldAlert className="w-8 h-8" />,
      color: "bg-emerald-700",
      members: 85,
      activeDossiers: 154,
      description: "Coordination des forces de l'ordre, gestion des budgets de sécurité et élaboration des plans de réponse aux urgences.",
      procedures: ["Rapport d'incident", "Demande de renforts", "Protocole d'intervention"],
      staff: [
        { name: "Jackson Teller", role: "Secrétaire Sécurité", role_short: "Sec" },
        { name: "Tommy Vercetti", role: "Secrétaire Justice", role_short: "Jus" }
      ]
    },
    justice: {
      name: "Département de la Justice",
      icon: <Gavel className="w-8 h-8" />,
      color: "bg-amber-600",
      members: 24,
      activeDossiers: 89,
      description: "Gestion du système judiciaire, des parquets et de l'administration pénitentiaire. Rédaction du Code Pénal.",
      procedures: ["Dépôt de plainte État", "Mandat judiciaire", "Rapport d'audition"],
      staff: [
        { name: "Thomas Vercetti", role: "Secrétaire Justice", role_short: "Sec" }
      ]
    },
    economie: {
      name: "Économie & Commerce",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-blue-600",
      members: 18,
      activeDossiers: 45,
      description: "Gestion des finances publiques, régulation du commerce et développement des entreprises de San Andreas.",
      procedures: ["Octroi de licence", "Demande de subvention", "Rapport fiscal"],
      staff: [
        { name: "Franklin Clinton", role: "Secrétaire Trésor", role_short: "Sec" }
      ]
    }
  };

  const currentWorkspace = workspaces[serviceId as keyof typeof workspaces] || workspaces.cabinet;

  return (
    <IntranetLayout>
      <div className="space-y-8">
        {/* Workspace Header */}
        <div className={cn(
          "relative overflow-hidden rounded-2xl p-8 text-white shadow-xl",
          currentWorkspace.color
        )}>
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
              {currentWorkspace.icon}
            </div>
            <div className="text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm uppercase font-black text-[10px] tracking-widest">ESPACE DE TRAVAIL</Badge>
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm font-bold flex items-center gap-1">
                  <Users className="w-3 h-3" /> {currentWorkspace.members} Membres
                </Badge>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight">{currentWorkspace.name}</h1>
              <p className="max-w-2xl text-white/80 font-medium leading-relaxed italic">{currentWorkspace.description}</p>
            </div>
            <div className="md:ml-auto flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-2">
                <Button className="bg-white text-slate-900 hover:bg-white/90 font-bold uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg">
                  <Plus className="w-4 h-4 mr-2" /> Nouveau Document
                </Button>
                <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-bold uppercase text-[10px] tracking-widest h-10">
                  <MessageSquare className="w-4 h-4" /> Salon Service
                </Button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 italic">Accès Niveau : SECRET / CONFIDENTIEL</p>
            </div>
          </div>
        </div>

        {/* Workspace Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white border border-slate-200 h-12 p-1 w-full justify-start gap-1">
                <TabsTrigger value="overview" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white h-10 px-6">
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger value="documents" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white h-10 px-6">
                  Documents du Service
                </TabsTrigger>
                <TabsTrigger value="dossiers" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white h-10 px-6">
                  Dossiers Actifs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-md">
                    <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Book className="w-4 h-4 text-primary" />
                        Procédures & Modèles
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="font-bold text-[10px] text-primary">Gérer</Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {currentWorkspace.procedures.map((proc, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group hover:border-primary transition-all">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-md border border-slate-200 text-slate-400 group-hover:text-primary transition-colors">
                                <FileText className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-bold text-slate-700 uppercase">{proc}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-primary">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-md">
                    <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Notes de Service
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="font-bold text-[10px] text-primary">Tout voir</Button>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                        <h4 className="text-xs font-bold text-amber-900 uppercase mb-1">Attention : Nouveau Protocole</h4>
                        <p className="text-[11px] text-amber-800 leading-relaxed italic">
                          À compter de lundi, tous les rapports de service devront être validés par le secrétariat avant publication.
                        </p>
                        <span className="text-[9px] font-bold text-amber-600/60 uppercase mt-2 block">Posté il y a 2h • Par Admin</span>
                      </div>
                      <div className="p-4 bg-slate-50 border-l-4 border-slate-300 rounded-r-lg">
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-1">Réunion de service</h4>
                        <p className="text-[11px] text-slate-700 leading-relaxed italic">
                          Point hebdo en salle de briefing à 10h00 demain. Présence obligatoire.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Créer Rapport", icon: <FileText className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
                    { label: "Nouveau Dossier", icon: <FolderOpen className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
                    { label: "Archive Service", icon: <Book className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600" },
                    { label: "Imprimer Forms", icon: <Printer className="w-5 h-5" />, color: "bg-slate-50 text-slate-600" }
                  ].map((s, i) => (
                    <button key={i} className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg transition-all group">
                      <div className={cn("p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-all mb-3", s.color)}>
                        {s.icon}
                      </div>
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{s.label}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Members List */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-slate-900 text-white py-4">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Membres du Service
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {currentWorkspace.staff.map((p, i) => (
                    <div key={i} className="p-4 flex items-center gap-4 group hover:bg-slate-50 transition-colors">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-slate-100 shadow-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} />
                          <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-black text-slate-900 uppercase group-hover:text-primary transition-colors">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{p.role}</p>
                      </div>
                      <Badge variant="outline" className="text-[8px] font-black tracking-widest uppercase border-slate-200 opacity-60">
                        {p.role_short}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    Voir tout l'annuaire <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Service Stats */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Activité du Service
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dossiers Clôturés</span>
                    <span className="text-sm font-black text-slate-900">75%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Documents en attente</span>
                    <span className="text-sm font-black text-slate-900">12</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Membres Actifs</p>
                    <p className="text-xl font-black text-slate-900">8/12</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Réunions/Sem</p>
                    <p className="text-xl font-black text-slate-900">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
};

export default Workspace;
