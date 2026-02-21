import React, { useState } from "react";
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
  ChevronLeft,
  ShieldCheck,
  TrendingUp,
  HeartPulse,
  Gavel,
  ShieldAlert,
  Download,
  Printer,
  Lock
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { useAuth, ServiceID, Permission } from "@/contexts/AuthContext";

const Workspace = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { user, canAccessService, hasPermission, logAction, emergencyMode } = useAuth();
  const [activeTab, setActiveTab] = React.useState("overview");

  const upperServiceId = serviceId?.toUpperCase() as ServiceID;

  if (!canAccessService(upperServiceId)) {
    return (
      <IntranetLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="p-6 bg-amber-50 text-amber-600 rounded-full border-4 border-amber-100 shadow-xl">
            <ShieldAlert className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Accès Restreint</h1>
          <p className="text-slate-500 max-w-md font-medium italic">
            Vous n'êtes pas assigné à cet espace de service. L'accès est réservé aux membres du service et à l'Exécutif.
          </p>
          <Button onClick={() => window.history.back()} className="bg-slate-900 text-white font-bold uppercase tracking-widest px-8">
            Retourner
          </Button>
        </div>
      </IntranetLayout>
    );
  }

  // Mock data for workspaces
  const workspaces: Record<string, any> = {
    cabinet: {
      name: "Cabinet du Gouverneur",
      icon: <ShieldCheck className="w-8 h-8" />,
      color: "bg-primary",
      members: 12,
      activeDossiers: 8,
      description: "Centre névralgique du gouvernement. Gestion des décrets, de la stratégie politique et des relations institutionnelles.",
      procedures: ["Rédaction d'un décret", "Protocole de signature", "Liaison inter-agences"],
      staff: [
        { name: "Arthur Vance", role: "Gouverneur", role_short: "Gov", status: 'available' },
        { name: "Elena Rodriguez", role: "Lieutenant-Gouverneur", role_short: "Lt-Gov", status: 'busy' },
        { name: "Jean Dupont", role: "Chef de Cabinet", role_short: "Chef", status: 'away' }
      ],
      tasks: [
        { id: 1, title: "Rédaction Décret Urbanisme", status: "in_progress", priority: "high", due: "Demain" },
        { id: 2, title: "Préparation Conférence de Presse", status: "pending", priority: "medium", due: "26 Mai" }
      ],
      announcements: [
        { id: 1, title: "Rappel : Réunion Hebdomadaire", text: "Présence obligatoire de tous les membres demain à 9h.", date: "Il y a 2h", author: "Arthur V." }
      ],
      documents: [
        { id: "DOC-CAB-001", title: "Plan Stratégique 2024", type: "PDF", date: "15 Mai" },
        { id: "DOC-CAB-002", title: "Protocole Crise", type: "DOCX", date: "10 Mai" }
      ],
      dossiers: [
        { id: "DOS-CAB-88", title: "Réforme Constitutionnelle", status: "En cours" },
        { id: "DOS-CAB-92", title: "Budget État T3", status: "À valider" }
      ]
    },
    securite_publique: {
      name: "Sécurité Publique (LSPD/LSSD)",
      icon: <ShieldAlert className="w-8 h-8" />,
      color: "bg-emerald-700",
      members: 85,
      activeDossiers: 154,
      description: "Coordination des forces de l'ordre, gestion des budgets de sécurité et élaboration des plans de réponse aux urgences.",
      procedures: ["Rapport d'incident", "Demande de renforts", "Protocole d'intervention"],
      staff: [
        { name: "Jackson Teller", role: "Secrétaire Sécurité", role_short: "Sec", status: 'available' },
        { name: "Marcus Wright", role: "Commandant LSPD", role_short: "Cmd", status: 'busy' },
        { name: "Sarah Miller", role: "Shérif LSSD", role_short: "Shr", status: 'available' }
      ],
      tasks: [
        { id: 1, title: "Déploiement Patrouilles Sud", status: "completed", priority: "high", due: "Terminé" },
        { id: 2, title: "Révision Budget Munitions", status: "in_progress", priority: "medium", due: "30 Mai" }
      ],
      announcements: [
        { id: 1, title: "Alerte : Manifestation prévue", text: "Déploiement préventif aux alentours de la Mairie.", date: "Il y a 1h", author: "Jackson T." }
      ],
      documents: [
        { id: "DOC-SEC-442", title: "Inventaire Arsenal LSPD", type: "XLSX", date: "20 Mai" },
        { id: "DOC-SEC-445", title: "Carte Patrouilles", type: "IMG", date: "18 Mai" }
      ],
      dossiers: [
        { id: "DOS-SEC-1024", title: "Opération Clean Street", status: "En cours" },
        { id: "DOS-SEC-1056", title: "Achat Véhicules Intervention", status: "Clos" }
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
        { name: "Thomas Vercetti", role: "Secrétaire Justice", role_short: "Sec", status: 'available' },
        { name: "Harvey Dent", role: "Procureur", role_short: "Proc", status: 'away' }
      ],
      tasks: [
        { id: 1, title: "Rédaction nouveau Code Pénal", status: "in_progress", priority: "critical", due: "15 Juin" }
      ],
      announcements: [],
      documents: [],
      dossiers: []
    },
    sante_humains: {
      name: "Santé & Services Humains",
      icon: <HeartPulse className="w-8 h-8" />,
      color: "bg-red-600",
      members: 42,
      activeDossiers: 30,
      description: "Gestion de la santé publique, des services sociaux et des protocoles d'urgence médicale (SAMS).",
      procedures: ["Aide sociale", "Licence médicale", "Rapport épidémiologique"],
      staff: [
        { name: "Julian Frost", role: "Secrétaire Santé", role_short: "Sec", status: 'available' }
      ],
      tasks: [],
      announcements: [],
      documents: [],
      dossiers: []
    },
    securite_interieure: {
      name: "Sécurité Intérieure",
      icon: <Lock className="w-8 h-8" />,
      color: "bg-slate-700",
      members: 15,
      activeDossiers: 12,
      description: "Contre-espionnage, protection des infrastructures critiques et gestion des menaces intérieures.",
      procedures: ["Habilitation Secret-Défense", "Surveillance zone", "Note de renseignement"],
      staff: [
        { name: "Sarah Connor", role: "Secrétaire S.I.", role_short: "Sec", status: 'available' }
      ],
      tasks: [],
      announcements: [],
      documents: [],
      dossiers: []
    },
    tresor_commerce: {
      name: "Trésor & Commerce",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-blue-600",
      members: 18,
      activeDossiers: 45,
      description: "Gestion des finances publiques, régulation du commerce et développement des entreprises de San Andreas.",
      procedures: ["Octroi de licence", "Demande de subvention", "Rapport fiscal"],
      staff: [
        { name: "Franklin Clinton", role: "Secrétaire Trésor", role_short: "Sec", status: 'available' }
      ],
      tasks: [],
      announcements: [],
      documents: [],
      dossiers: []
    },
    communication: {
      name: "Bureau de la Communication",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "bg-purple-600",
      members: 8,
      activeDossiers: 5,
      description: "Gestion de l'image du gouvernement, relations presse et diffusion des communiqués officiels.",
      procedures: ["Communiqué de presse", "Briefing média", "Journal Officiel"],
      staff: [
        { name: "Lamar Davis", role: "Press Secretary", role_short: "Press", status: 'available' }
      ],
      tasks: [],
      announcements: [],
      documents: [],
      dossiers: []
    },
    administration_generale: {
      name: "Administration Générale",
      icon: <Briefcase className="w-8 h-8" />,
      color: "bg-slate-800",
      members: 30,
      activeDossiers: 20,
      description: "Coordination inter-services, gestion des ressources humaines et logistique gouvernementale.",
      procedures: ["Formulaire embauche", "Demande matériel", "Ordre de mission"],
      staff: [
        { name: "James Marshall", role: "Secrétaire d'État", role_short: "Sec", status: 'available' }
      ],
      tasks: [],
      announcements: [],
      documents: [],
      dossiers: []
    }
  };

  const currentWorkspace = workspaces[serviceId?.toLowerCase() || ''] || workspaces.cabinet;

  const [tasks, setTasks] = React.useState(currentWorkspace.tasks || []);

  const handleAction = (action: string) => {
    logAction(`${action} dans le service: ${currentWorkspace.name}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-amber-500';
      case 'offline': return 'bg-slate-500';
      default: return 'bg-slate-300';
    }
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'critical': return 'bg-red-600 text-white border-none animate-pulse';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

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
                <Link to="/intranet">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-white/70 hover:text-white hover:bg-white/10 gap-1 font-bold text-[9px] uppercase tracking-tighter">
                    <ChevronLeft className="w-3 h-3" /> Retour
                  </Button>
                </Link>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={cn(
                "bg-white border border-slate-200 h-12 p-1 w-full justify-start gap-1 overflow-x-auto overflow-y-hidden whitespace-nowrap",
                emergencyMode && "bg-red-950 border-red-900"
              )}>
                <TabsTrigger value="overview" className={cn(
                  "font-bold uppercase text-[10px] tracking-widest h-10 px-6",
                  emergencyMode ? "data-[state=active]:bg-red-600 text-red-400" : "data-[state=active]:bg-primary text-slate-500"
                )}>
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger value="documents" className={cn(
                  "font-bold uppercase text-[10px] tracking-widest h-10 px-6",
                  emergencyMode ? "data-[state=active]:bg-red-600 text-red-400" : "data-[state=active]:bg-primary text-slate-500"
                )}>
                  Documents
                </TabsTrigger>
                <TabsTrigger value="dossiers" className={cn(
                  "font-bold uppercase text-[10px] tracking-widest h-10 px-6",
                  emergencyMode ? "data-[state=active]:bg-red-600 text-red-400" : "data-[state=active]:bg-primary text-slate-500"
                )}>
                  Dossiers du Service
                </TabsTrigger>
                <TabsTrigger value="tasks" className={cn(
                  "font-bold uppercase text-[10px] tracking-widest h-10 px-6",
                  emergencyMode ? "data-[state=active]:bg-red-600 text-red-400" : "data-[state=active]:bg-primary text-slate-500"
                )}>
                  Tâches Opérationnelles
                </TabsTrigger>
                <TabsTrigger value="members" className={cn(
                  "font-bold uppercase text-[10px] tracking-widest h-10 px-6",
                  emergencyMode ? "data-[state=active]:bg-red-600 text-red-400" : "data-[state=active]:bg-primary text-slate-500"
                )}>
                  Effectifs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={cn("border-none shadow-md", emergencyMode && "bg-red-950/20")}>
                    <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                      <CardTitle className={cn("text-xs font-black uppercase tracking-widest flex items-center gap-2", emergencyMode && "text-red-400")}>
                        <Book className="w-4 h-4" />
                        Procédures & Modèles
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="font-bold text-[10px] text-primary">Gérer</Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {currentWorkspace.procedures.map((proc, i) => (
                          <div key={i} className={cn(
                            "flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group hover:border-primary transition-all",
                            emergencyMode && "bg-red-900/10 border-red-900 group-hover:border-red-600"
                          )}>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-md border border-slate-200 text-slate-400 group-hover:text-primary transition-colors">
                                <FileText className="w-4 h-4" />
                              </div>
                              <span className={cn("text-sm font-bold text-slate-700 uppercase", emergencyMode && "text-red-200")}>{proc}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-primary">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={cn("border-none shadow-md", emergencyMode && "bg-red-950/20")}>
                    <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                      <CardTitle className={cn("text-xs font-black uppercase tracking-widest flex items-center gap-2", emergencyMode && "text-red-400")}>
                        <MessageSquare className="w-4 h-4" />
                        Notes de Service
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="font-bold text-[10px] text-primary">Tout voir</Button>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      {currentWorkspace.announcements.length > 0 ? currentWorkspace.announcements.map((ann: any) => (
                        <div key={ann.id} className={cn(
                          "p-4 border-l-4 rounded-r-lg bg-slate-50 border-slate-300",
                          emergencyMode ? "bg-red-900/20 border-red-600" : (ann.priority === 'high' ? "bg-amber-50 border-amber-400" : "")
                        )}>
                          <h4 className={cn("text-xs font-bold uppercase mb-1", emergencyMode ? "text-red-400" : "text-slate-900")}>{ann.title}</h4>
                          <p className={cn("text-[11px] leading-relaxed italic", emergencyMode ? "text-red-200" : "text-slate-700")}>
                            {ann.text}
                          </p>
                          <span className="text-[9px] font-bold text-slate-400 uppercase mt-2 block">{ann.date} • Par {ann.author}</span>
                        </div>
                      )) : (
                        <div className="p-12 text-center">
                          <p className="text-xs text-slate-400 italic">Aucune note de service récente.</p>
                        </div>
                      )}
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
                    <button
                      key={i}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg transition-all group",
                        emergencyMode && "bg-red-950/20 border-red-900 hover:border-red-600"
                      )}
                    >
                      <div className={cn("p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-all mb-3", s.color)}>
                        {s.icon}
                      </div>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", emergencyMode ? "text-red-400" : "text-slate-700")}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card className={cn("border-none shadow-md", emergencyMode && "bg-red-950/20")}>
                  <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className={cn("text-xs font-black uppercase tracking-widest", emergencyMode && "text-red-400")}>Bibliothèque de Service</CardTitle>
                      <CardDescription className={cn("text-[10px] font-bold uppercase", emergencyMode && "text-red-800")}>Fichiers partagés et archives administratives</CardDescription>
                    </div>
                    <Button size="sm" className={cn("bg-primary font-bold uppercase text-[10px] px-4", emergencyMode && "bg-red-600")}>Importer</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {(currentWorkspace.documents || []).length > 0 ? currentWorkspace.documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded text-slate-400 group-hover:text-primary transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className={cn("text-sm font-black uppercase tracking-tight", emergencyMode ? "text-white" : "text-slate-900")}>{doc.title}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{doc.type}</Badge>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Mis à jour : {doc.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-primary"><Download className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-primary"><Printer className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      )) : (
                        <div className="p-12 text-center text-slate-400 italic text-sm">
                          Aucun document dans la bibliothèque du service.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dossiers" className="mt-6">
                <Card className={cn("border-none shadow-md", emergencyMode && "bg-red-950/20")}>
                  <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className={cn("text-xs font-black uppercase tracking-widest", emergencyMode && "text-red-400")}>Dossiers Spécifiques au Service</CardTitle>
                      <CardDescription className={cn("text-[10px] font-bold uppercase", emergencyMode && "text-red-800")}>Suivi des dossiers de niveau {currentWorkspace.name}</CardDescription>
                    </div>
                    <Button size="sm" className={cn("bg-primary font-bold uppercase text-[10px] px-4", emergencyMode && "bg-red-600")}>Nouveau Dossier</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {(currentWorkspace.dossiers || []).length > 0 ? currentWorkspace.dossiers.map((dos: any) => (
                        <div key={dos.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded text-slate-400 group-hover:text-primary transition-colors">
                              <FolderOpen className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className={cn("text-sm font-black uppercase tracking-tight", emergencyMode ? "text-white" : "text-slate-900")}>{dos.title}</p>
                              <span className="text-[9px] font-bold text-primary uppercase">{dos.id}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              dos.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                            )}>
                              {dos.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-primary"><ChevronRight className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      )) : (
                        <div className="p-12 text-center text-slate-400 italic text-sm">
                          Aucun dossier actif pour ce service.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <Card className={cn("border-none shadow-md", emergencyMode && "bg-red-950/20")}>
                  <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className={cn("text-xs font-black uppercase tracking-widest", emergencyMode && "text-red-400")}>Gestion des Tâches Opérationnelles</CardTitle>
                      <CardDescription className={cn("text-[10px] font-bold uppercase", emergencyMode && "text-red-800")}>Attribution et suivi des missions du service</CardDescription>
                    </div>
                    <Button size="sm" className={cn("bg-primary font-bold uppercase text-[10px] px-4", emergencyMode && "bg-red-600")}>Ajouter une tâche</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {tasks.length > 0 ? tasks.map((task: any) => (
                        <div key={task.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-2 h-10 rounded-full",
                              task.status === 'completed' ? 'bg-emerald-500' :
                              task.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'
                            )} />
                            <div className="space-y-1">
                              <p className={cn("text-sm font-black uppercase tracking-tight", emergencyMode ? "text-white" : "text-slate-900")}>{task.title}</p>
                              <div className="flex items-center gap-2">
                                <Badge className={cn("text-[8px] font-black uppercase tracking-widest", getTaskPriorityColor(task.priority))}>
                                  {task.priority}
                                </Badge>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Échéance : {task.due}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Modifier</Button>
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              task.status === 'completed' ? 'text-emerald-500 border-emerald-500' :
                              task.status === 'in_progress' ? 'text-blue-500 border-blue-500' : 'text-slate-400'
                            )}>
                              {task.status === 'in_progress' ? 'En cours' : task.status === 'completed' ? 'Terminé' : 'En attente'}
                            </Badge>
                          </div>
                        </div>
                      )) : (
                        <div className="p-12 text-center text-slate-400 italic text-sm">
                          Aucune tâche en cours pour ce service.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <Card className={cn("border-none shadow-md", emergencyMode && "bg-red-950/20")}>
                   <CardHeader className="border-b border-slate-100">
                      <CardTitle className={cn("text-xs font-black uppercase tracking-widest", emergencyMode && "text-red-400")}>Registre des Effectifs du Service</CardTitle>
                   </CardHeader>
                   <CardContent className="p-0">
                      <table className="w-full text-left">
                        <thead className={cn("bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500", emergencyMode && "bg-red-900/40 text-red-500")}>
                          <tr>
                            <th className="px-6 py-4">Agent</th>
                            <th className="px-6 py-4">Grade / Fonction</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentWorkspace.staff.map((staff: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors group">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} />
                                  <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className={cn("text-xs font-bold uppercase", emergencyMode && "text-white")}>{staff.name}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{staff.role}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-2 h-2 rounded-full", getStatusColor(staff.status))} />
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">{staff.status === 'available' ? 'En service' : staff.status === 'busy' ? 'Occupé' : 'Absent'}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" className="text-primary font-bold text-[10px] uppercase">Message</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Context Widget */}
            {emergencyMode && (
              <Card className="bg-red-600 border-none shadow-xl text-white p-6 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6" />
                  <span className="text-sm font-black uppercase tracking-widest">Alerte Secteur</span>
                </div>
                <p className="text-xs font-bold leading-relaxed uppercase">
                  Protocole d'Urgence actif pour le service {currentWorkspace.name}.
                  Toutes les permissions de congés sont annulées.
                </p>
              </Card>
            )}

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
