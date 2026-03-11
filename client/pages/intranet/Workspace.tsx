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
  Lock,
  Archive,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth, ServiceID, Permission } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";
import { PERMISSIONS } from "@/lib/permissions";

const Workspace = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { user, canAccessService, hasPermission, logAction, emergencyMode } = useAuth();
  const store = useGovernmentStore();
  const [activeTab, setActiveTab] = React.useState("overview");

  const currentWorkspace = store.getWorkspace(serviceId || 'cabinet');
  const tasks = currentWorkspace?.tasks || [];

  if (!currentWorkspace) return null;

  // States for modals
  const [isDocumentModalOpen, setIsDocumentModalOpen] = React.useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = React.useState(false);
  const [editingDoc, setEditingDoc] = React.useState<any>(null);
  const [editingDossier, setEditingDossier] = React.useState<any>(null);
  const [editingTask, setEditingTask] = React.useState<any>(null);

  // Form states
  const [docTitle, setDocTitle] = React.useState("");
  const [docType, setDocType] = React.useState("PDF");
  const [dossierTitle, setDossierTitle] = React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskPriority, setTaskPriority] = React.useState("medium");
  const [taskDue, setTaskDue] = React.useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

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

  const handleCreateDocument = () => {
    if (!docTitle || !serviceId) return;

    // Check permission before creating document
    if (!hasPermission(PERMISSIONS.DOCUMENTS_CREATE)) {
      console.warn('User does not have permission to create documents');
      return;
    }

    const newDoc = {
      id: `DOC-${upperServiceId}-${Math.floor(Math.random() * 999)}`,
      title: docTitle,
      type: docType,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      archived: false
    };

    store.createDocument(serviceId, newDoc);

    setDocTitle("");
    setIsDocumentModalOpen(false);
    logAction(`Création du document : ${docTitle}`);
  };

  const handleUpdateDocument = () => {
    if (!docTitle || !editingDoc || !serviceId) return;

    // Check permission before updating document
    if (!hasPermission(PERMISSIONS.DOCUMENTS_EDIT)) {
      console.warn('User does not have permission to edit documents');
      return;
    }

    store.updateDocument(serviceId, { ...editingDoc, title: docTitle, type: docType });

    setDocTitle("");
    setEditingDoc(null);
    setIsDocumentModalOpen(false);
    logAction(`Modification du document : ${docTitle}`);
  };

  const handleDeleteDocument = (docId: string) => {
    if (!serviceId) return;

    // Check permission before deleting document
    if (!hasPermission(PERMISSIONS.DOCUMENTS_DELETE)) {
      console.warn('User does not have permission to delete documents');
      return;
    }

    store.deleteDocument(serviceId, docId);
    logAction(`Suppression du document ID : ${docId}`);
  };

  const handleCreateDossier = () => {
    if (!dossierTitle || !serviceId) return;

    // Check permission before creating dossier
    if (!hasPermission(PERMISSIONS.DOSSIERS_CREATE)) {
      console.warn('User does not have permission to create dossiers');
      return;
    }

    const newDossier = {
      id: `DOS-${upperServiceId}-${Math.floor(Math.random() * 9999)}`,
      title: dossierTitle,
      status: "En cours",
      archived: false
    };

    store.createDossier(serviceId, newDossier);

    setDossierTitle("");
    setIsDossierModalOpen(false);
    logAction(`Création du dossier : ${dossierTitle}`);
  };

  const handleUpdateDossier = () => {
    if (!dossierTitle || !editingDossier || !serviceId) return;

    // Check permission before updating dossier
    if (!hasPermission(PERMISSIONS.DOSSIERS_EDIT)) {
      console.warn('User does not have permission to edit dossiers');
      return;
    }

    store.updateDossier(serviceId, { ...editingDossier, title: dossierTitle });

    setDossierTitle("");
    setEditingDossier(null);
    setIsDossierModalOpen(false);
    logAction(`Modification du dossier : ${dossierTitle}`);
  };

  const handleDeleteDossier = (dosId: string) => {
    if (!serviceId) return;

    // Check permission before deleting dossier
    if (!hasPermission(PERMISSIONS.DOSSIERS_DELETE)) {
      console.warn('User does not have permission to delete dossiers');
      return;
    }

    store.deleteDossier(serviceId, dosId);
    logAction(`Suppression du dossier ID : ${dosId}`);
  };

  const handleCreateTask = () => {
    if (!taskTitle || !serviceId) return;

    // Check permission before creating task
    if (!hasPermission(PERMISSIONS.TASKS_CREATE)) {
      console.warn('User does not have permission to create tasks');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      status: "pending",
      priority: taskPriority,
      due: taskDue || "À définir"
    };

    store.createTask(serviceId, newTask);

    setTaskTitle("");
    setTaskDue("");
    setTaskPriority("medium");
    setIsTaskModalOpen(false);
    logAction(`Création de la tâche : ${taskTitle}`);
  };

  const handleUpdateTask = () => {
    if (!taskTitle || !editingTask || !serviceId) return;

    // Check permission before updating task
    if (!hasPermission(PERMISSIONS.TASKS_EDIT)) {
      console.warn('User does not have permission to edit tasks');
      return;
    }

    store.updateTask(serviceId, { ...editingTask, title: taskTitle, priority: taskPriority, due: taskDue || editingTask.due });

    setTaskTitle("");
    setTaskDue("");
    setEditingTask(null);
    setIsTaskModalOpen(false);
    logAction(`Modification de la tâche : ${taskTitle}`);
  };

  const handleDeleteTask = (taskId: number) => {
    if (!serviceId) return;

    // Check permission before deleting task
    if (!hasPermission(PERMISSIONS.TASKS_DELETE)) {
      console.warn('User does not have permission to delete tasks');
      return;
    }

    store.deleteTask(serviceId, taskId);
    logAction(`Suppression de la tâche ID : ${taskId}`);
  };

  const handleToggleTaskStatus = (taskId: number) => {
    if (!serviceId) return;
    store.toggleTaskStatus(serviceId, taskId);
  };

  const handleArchiveDocument = (docId: string) => {
    if (!serviceId) return;
    store.archiveDocument(serviceId, docId);
    logAction(`Archivage/Désarchivage du document ID : ${docId}`);
  };

  const handleArchiveDossier = (dosId: string) => {
    if (!serviceId) return;
    store.archiveDossier(serviceId, dosId);
    logAction(`Archivage/Désarchivage du dossier ID : ${dosId}`);
  };

  const openEditDoc = (doc: any) => {
    setEditingDoc(doc);
    setDocTitle(doc.title);
    setDocType(doc.type);
    setIsDocumentModalOpen(true);
  };

  const openEditDossier = (dos: any) => {
    setEditingDossier(dos);
    setDossierTitle(dos.title);
    setIsDossierModalOpen(true);
  };

  const openEditTask = (task: any) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskPriority(task.priority);
    setTaskDue(task.due);
    setIsTaskModalOpen(true);
  };

  const visibleDocuments = (currentWorkspace.documents || []).filter((d: any) => !d.archived);
  const archivedDocuments = (currentWorkspace.documents || []).filter((d: any) => d.archived);
  const visibleDossiers = (currentWorkspace.dossiers || []).filter((d: any) => !d.archived);
  const archivedDossiers = (currentWorkspace.dossiers || []).filter((d: any) => d.archived);

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
              {currentWorkspace.name === "Cabinet du Gouverneur" && <ShieldCheck className="w-8 h-8" />}
              {currentWorkspace.name === "Sécurité Publique (LSPD/LSSD)" && <ShieldAlert className="w-8 h-8" />}
              {currentWorkspace.name === "Département de la Justice" && <Gavel className="w-8 h-8" />}
              {currentWorkspace.name === "Santé & Services Humains" && <HeartPulse className="w-8 h-8" />}
              {currentWorkspace.name === "Sécurité Intérieure" && <Lock className="w-8 h-8" />}
              {currentWorkspace.name === "Trésor & Commerce" && <TrendingUp className="w-8 h-8" />}
              {currentWorkspace.name === "Bureau de la Communication" && <MessageSquare className="w-8 h-8" />}
              {currentWorkspace.name === "Administration Générale" && <Briefcase className="w-8 h-8" />}
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
                <Button
                  onClick={() => { setEditingDoc(null); setDocTitle(""); setIsDocumentModalOpen(true); }}
                  className="bg-white text-slate-900 hover:bg-white/90 font-bold uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg"
                >
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
                <TabsTrigger value="archive" className={cn(
                  "font-bold uppercase text-[10px] tracking-widest h-10 px-6",
                  emergencyMode ? "data-[state=active]:bg-red-600 text-red-400" : "data-[state=active]:bg-primary text-slate-500"
                )}>
                  Archives
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
                    { label: "Créer Rapport", icon: <FileText className="w-5 h-5" />, color: "bg-blue-50 text-blue-600", action: () => { setEditingDoc(null); setDocTitle(""); setIsDocumentModalOpen(true); } },
                    { label: "Nouveau Dossier", icon: <FolderOpen className="w-5 h-5" />, color: "bg-amber-50 text-amber-600", action: () => { setDossierTitle(""); setIsDossierModalOpen(true); } },
                    { label: "Archive Service", icon: <Archive className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600", action: () => setActiveTab("archive") },
                    { label: "Imprimer Forms", icon: <Printer className="w-5 h-5" />, color: "bg-slate-50 text-slate-600", action: () => window.print() }
                  ].map((s, i) => (
                    <button
                      key={i}
                      onClick={s.action}
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
                    <Button
                      onClick={() => { setEditingDoc(null); setDocTitle(""); setIsDocumentModalOpen(true); }}
                      size="sm" className={cn("bg-primary font-bold uppercase text-[10px] px-4", emergencyMode && "bg-red-600")}
                    >
                      Nouveau Document
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {visibleDocuments.length > 0 ? visibleDocuments.map((doc: any) => (
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary"><MoreVertical className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 uppercase font-bold text-[10px]">
                                <DropdownMenuItem onClick={() => openEditDoc(doc)} className="gap-2"><Edit className="w-3 h-3" /> Modifier</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleArchiveDocument(doc.id)} className="gap-2"><Archive className="w-3 h-3" /> Archiver</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteDocument(doc.id)} className="gap-2 text-red-600"><Trash2 className="w-3 h-3" /> Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                    <Button
                      onClick={() => { setEditingDossier(null); setDossierTitle(""); setIsDossierModalOpen(true); }}
                      size="sm" className={cn("bg-primary font-bold uppercase text-[10px] px-4", emergencyMode && "bg-red-600")}
                    >
                      Nouveau Dossier
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {visibleDossiers.length > 0 ? visibleDossiers.map((dos: any) => (
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary"><MoreVertical className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 uppercase font-bold text-[10px]">
                                <DropdownMenuItem onClick={() => openEditDossier(dos)} className="gap-2"><Edit className="w-3 h-3" /> Modifier</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleArchiveDossier(dos.id)} className="gap-2"><Archive className="w-3 h-3" /> Archiver</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteDossier(dos.id)} className="gap-2 text-red-600"><Trash2 className="w-3 h-3" /> Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                    <Button onClick={() => { setEditingTask(null); setTaskTitle(""); setTaskDue(""); setTaskPriority("medium"); setIsTaskModalOpen(true); }} size="sm" className={cn("bg-primary font-bold uppercase text-[10px] px-4", emergencyMode && "bg-red-600")}>Ajouter une tâche</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {tasks.length > 0 ? tasks.map((task: any) => (
                        <div key={task.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleToggleTaskStatus(task.id)}
                              className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-primary'
                              )}
                            >
                              {task.status === 'completed' && <Plus className="w-4 h-4 rotate-45" style={{ transform: 'rotate(45deg) scale(0.8)' }} />}
                            </button>
                            <div className="space-y-1">
                              <p className={cn("text-sm font-black uppercase tracking-tight", emergencyMode ? "text-white" : "text-slate-900", task.status === 'completed' && "line-through opacity-50")}>{task.title}</p>
                              <div className="flex items-center gap-2">
                                <Badge className={cn("text-[8px] font-black uppercase tracking-widest", getTaskPriorityColor(task.priority))}>
                                  {task.priority}
                                </Badge>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Échéance : {task.due}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary"><MoreVertical className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 uppercase font-bold text-[10px]">
                                <DropdownMenuItem onClick={() => openEditTask(task)} className="gap-2"><Edit className="w-3 h-3" /> Modifier</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="gap-2 text-red-600"><Trash2 className="w-3 h-3" /> Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

              <TabsContent value="archive" className="mt-6 space-y-6">
                <Card className={cn("border-none shadow-md", emergencyMode && "bg-red-950/20")}>
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className={cn("text-xs font-black uppercase tracking-widest flex items-center gap-2", emergencyMode && "text-red-400")}>
                      <Archive className="w-4 h-4" /> Documents Archivés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {archivedDocuments.length > 0 ? archivedDocuments.map((doc: any) => (
                        <div key={doc.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <FileText className="w-5 h-5 text-slate-300" />
                            <div>
                              <p className="text-sm font-black uppercase text-slate-400">{doc.title}</p>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{doc.id}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleArchiveDocument(doc.id)} className="text-[9px] font-black uppercase">Désarchiver</Button>
                        </div>
                      )) : (
                        <div className="p-8 text-center text-slate-400 italic text-xs">Aucun document archivé.</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn("border-none shadow-md", emergencyMode && "bg-red-950/20")}>
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className={cn("text-xs font-black uppercase tracking-widest flex items-center gap-2", emergencyMode && "text-red-400")}>
                      <Archive className="w-4 h-4" /> Dossiers Archivés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {archivedDossiers.length > 0 ? archivedDossiers.map((dos: any) => (
                        <div key={dos.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <FolderOpen className="w-5 h-5 text-slate-300" />
                            <div>
                              <p className="text-sm font-black uppercase text-slate-400">{dos.title}</p>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{dos.id}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleArchiveDossier(dos.id)} className="text-[9px] font-black uppercase">Désarchiver</Button>
                        </div>
                      )) : (
                        <div className="p-8 text-center text-slate-400 italic text-xs">Aucun dossier archivé.</div>
                      )}
                    </div>
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
                  {currentWorkspace.staff.map((p: any, i: number) => (
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

      {/* Modals */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">{editingDoc ? "Modifier le Document" : "Nouveau Document"}</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase italic">
              Enregistrez un nouveau document dans la bibliothèque du service.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest">Titre du document</Label>
              <Input
                id="title"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Ex: Rapport d'intervention #442"
                className="font-bold uppercase text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest">Type de fichier</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="font-bold uppercase text-xs">
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent className="font-bold uppercase text-[10px]">
                  <SelectItem value="PDF">PDF (Protocole / Rapport)</SelectItem>
                  <SelectItem value="DOCX">DOCX (Édition / Brouillon)</SelectItem>
                  <SelectItem value="XLSX">XLSX (Tableur / Inventaire)</SelectItem>
                  <SelectItem value="IMG">IMG (Preuve / Carte)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editingDoc ? handleUpdateDocument : handleCreateDocument} className="font-black uppercase tracking-widest text-[10px] w-full py-6">
              {editingDoc ? "Mettre à jour" : "Créer le document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDossierModalOpen} onOpenChange={setIsDossierModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">{editingDossier ? "Modifier le Dossier" : "Ouvrir un Nouveau Dossier"}</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase italic">
              {editingDossier ? "Mettez à jour les informations du dossier." : "Créez un suivi opérationnel pour une nouvelle affaire ou mission."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dos-title" className="text-[10px] font-black uppercase tracking-widest">Nom du dossier</Label>
              <Input
                id="dos-title"
                value={dossierTitle}
                onChange={(e) => setDossierTitle(e.target.value)}
                placeholder="Ex: Opération Underworld"
                className="font-bold uppercase text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editingDossier ? handleUpdateDossier : handleCreateDossier} className="font-black uppercase tracking-widest text-[10px] w-full py-6 bg-emerald-600 hover:bg-emerald-700">
              {editingDossier ? "Mettre à jour" : "Ouvrir le dossier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">{editingTask ? "Modifier la Tâche" : "Nouvelle Tâche Opérationnelle"}</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase italic">
              Définissez les objectifs et l'échéance de la mission.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title" className="text-[10px] font-black uppercase tracking-widest">Intitulé de la tâche</Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Ex: Sécurisation périmètre Mairie"
                className="font-bold uppercase text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-priority" className="text-[10px] font-black uppercase tracking-widest">Priorité</Label>
                <Select value={taskPriority} onValueChange={setTaskPriority}>
                  <SelectTrigger className="font-bold uppercase text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-bold uppercase text-[10px]">
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="critical">CRITIQUE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due" className="text-[10px] font-black uppercase tracking-widest">Échéance</Label>
                <Input
                  id="task-due"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  placeholder="Ex: 20:00"
                  className="font-bold uppercase text-xs"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editingTask ? handleUpdateTask : handleCreateTask} className="font-black uppercase tracking-widest text-[10px] w-full py-6">
              {editingTask ? "Mettre à jour" : "Assigner la tâche"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IntranetLayout>
  );
};

export default Workspace;
