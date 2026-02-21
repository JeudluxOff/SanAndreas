import { 
  FolderOpen, 
  ChevronLeft, 
  Clock, 
  FileText, 
  Plus, 
  Download, 
  Printer, 
  Users, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Paperclip,
  Share2,
  Trash2,
  Calendar,
  History,
  Activity
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { useAuth, Permission, ServiceID } from "@/contexts/AuthContext";

const DossierDetail = () => {
  const { user, hasPermission, logAction, canAccessService } = useAuth();
  const { id } = useParams<{ id: string }>();

  // Mock data for a single dossier
  const dossier = {
    id: "SA-2024-0142",
    title: "Plan d'Urbanisme Intégré - Los Santos 2024-2030",
    status: "En cours",
    priority: "Haute",
    creationDate: "12 Avril 2024",
    deadline: "30 Juin 2024",
    service_id: "CABINET" as ServiceID,
    service_name: "Cabinet du Gouverneur",
    owner: "Arthur Vance",
    is_confidential: true,
    description: "Révision complète du plan d'urbanisme pour la zone sud de Los Santos, incluant la revitalisation des quais et l'amélioration des infrastructures de transport en commun. Ce dossier nécessite une coordination avec les services de Sécurité Publique pour les nouveaux accès d'urgence.",
    progress: 65,
    acl: ['sec_etat', 'sec_securite'],
    participants: [
      { id: 'governor', name: "Arthur Vance", role: "Gouverneur" },
      { id: 'press', name: "Lamar Davis", role: "Press Secretary" },
      { id: 'sec_securite', name: "Jackson Teller", role: "Secrétaire Sécurité" }
    ],
    documents: [
      { id: "DEC-24-0042", title: "Décret d'Urbanisme Préliminaire", status: "Signé", date: "15 Mai 2024" },
      { id: "RAP-24-1021", title: "Rapport d'Impact Environnemental", status: "À valider", date: "20 Mai 2024" },
      { id: "MAP-24-0001", title: "Plans Topographiques Phase 1", status: "Brouillon", date: "22 Mai 2024" }
    ],
    timeline: [
      { date: "22 Mai, 14:30", user: "Arthur Vance", action: "Ajout du document 'Plans Topographiques Phase 1'", type: "file" },
      { date: "20 Mai, 09:15", user: "Jackson Teller", action: "Validation des protocoles de sécurité", type: "check" },
      { date: "18 Mai, 11:00", user: "Lamar Davis", action: "Note interne: Problème d'accès zone portuaire", type: "note" },
      { date: "15 Mai, 16:45", user: "Arthur Vance", action: "Signature du Décret d'Urbanisme", type: "sign" },
      { date: "12 Avril, 08:00", user: "System", action: "Création du dossier", type: "system" }
    ]
  };

  const canView = user?.role === 'gouverneur' ||
                  dossier.service_id === user?.service_id ||
                  dossier.participants.some(p => p.id === user?.id) ||
                  (user?.id && dossier.acl.includes(user.id));

  if (!canView) {
    return (
      <IntranetLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="p-6 bg-red-50 text-red-600 rounded-full border-4 border-red-100 shadow-xl animate-pulse">
            <AlertCircle className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Accès Refusé</h1>
          <p className="text-slate-500 max-w-md font-medium italic">
            Vous n'avez pas les permissions nécessaires pour consulter ce dossier confidentiel.
            Toute tentative d'accès non autorisée est enregistrée dans les registres d'audit de l'État.
          </p>
          <Button onClick={() => { logAction('Tentative accès dossier non autorisé', { dossier_id: dossier.id }); window.history.back(); }} className="bg-slate-900 text-white font-bold uppercase tracking-widest px-8">
            Retourner
          </Button>
        </div>
      </IntranetLayout>
    );
  }

  const handleDossierAction = (action: string) => {
    logAction(`${action} sur le dossier: ${dossier.id}`);
  };

  return (
    <IntranetLayout>
      <div className="space-y-6 pb-20">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/intranet/dossiers">
              <Button variant="ghost" size="icon" className="rounded-full border border-slate-200">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono text-[10px] font-black tracking-widest text-primary border-primary/20">
                  #{dossier.id}
                </Badge>
                <Badge className={cn(
                  "text-[9px] font-black uppercase tracking-widest px-2",
                  dossier.priority === 'Haute' ? 'bg-red-600' : 'bg-slate-600'
                )}>
                  PRIORITÉ {dossier.priority}
                </Badge>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase leading-none">{dossier.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-bold gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
            {hasPermission('dossiers:edit') && (
              <Button className="bg-[#1B365D] font-bold gap-2">
                <Settings className="w-4 h-4" /> Gérer Dossier
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-slate-100 py-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Présentation du Dossier
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Responsable</span>
                    <p className="text-sm font-black text-slate-900 uppercase">{dossier.service_name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date de Création</span>
                    <p className="text-sm font-black text-slate-900">{dossier.creationDate}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Échéance</span>
                    <p className="text-sm font-black text-red-600">{dossier.deadline}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Propriétaire</span>
                    <p className="text-sm font-black text-slate-900 uppercase">{dossier.owner}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progression Globale</span>
                  <div className="flex items-center gap-4">
                    <Progress value={dossier.progress} className="h-2 flex-grow" />
                    <span className="text-sm font-black text-primary">{dossier.progress}%</span>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description / Objet</span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {dossier.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-white border border-slate-200 h-12 p-1">
                <TabsTrigger value="documents" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                  Documents Liés ({dossier.documents.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                  Notes Internes
                </TabsTrigger>
                <TabsTrigger value="attachments" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                  Pièces Jointes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="mt-4">
                <Card className="border-none shadow-md overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {dossier.documents.map((doc) => (
                      <div key={doc.id} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2 rounded-lg",
                            doc.status === 'Signé' ? "bg-emerald-50 text-emerald-600" :
                            doc.status === 'À valider' ? "bg-amber-50 text-amber-600" :
                            "bg-blue-50 text-blue-600"
                          )}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 uppercase group-hover:text-primary transition-colors cursor-pointer">{doc.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-primary font-bold tracking-widest">{doc.id}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5",
                            doc.status === 'Signé' ? 'bg-emerald-600' :
                            doc.status === 'À valider' ? 'bg-amber-500' :
                            'bg-blue-600'
                          )}>
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    {hasPermission('documents:create') && (
                      <Button variant="outline" className="w-full border-dashed border-2 border-slate-200 font-bold uppercase text-[10px] tracking-widest hover:border-primary hover:text-primary hover:bg-white transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Attacher un document existant
                      </Button>
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <Card className="border-none shadow-md p-6 flex flex-col items-center justify-center text-slate-400 py-12">
                  <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs mb-2">Aucune note interne</p>
                  <Button variant="outline" size="sm" className="font-bold uppercase text-[9px]">Ajouter une note</Button>
                </Card>
              </TabsContent>

              <TabsContent value="attachments" className="mt-4">
                <Card className="border-none shadow-md p-6 flex flex-col items-center justify-center text-slate-400 py-12">
                  <Paperclip className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs mb-2">Aucune pièce jointe</p>
                  <Button variant="outline" size="sm" className="font-bold uppercase text-[9px]">Téléverser</Button>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-slate-900 text-white py-4">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Participants Assignés
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {dossier.participants.map((p, i) => (
                    <div key={i} className="p-4 flex items-center gap-4 group hover:bg-slate-50 transition-colors">
                      <Avatar className="h-10 w-10 border-2 border-slate-100 shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} />
                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="text-sm font-black text-slate-900 uppercase group-hover:text-primary transition-colors">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{p.role}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-900">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  {hasPermission('dossiers:assign_members') && (
                    <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest border-slate-200 bg-white">
                      <Plus className="w-3 h-3 mr-2" /> Ajouter un participant
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline / History */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Historique d'Activité
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                  {dossier.timeline.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-6 group">
                      <div className={cn(
                        "absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center -translate-x-1/2 z-10 transition-transform group-hover:scale-110",
                        item.type === 'file' ? 'bg-blue-600' :
                        item.type === 'check' ? 'bg-emerald-600' :
                        item.type === 'sign' ? 'bg-primary' :
                        item.type === 'note' ? 'bg-amber-600' :
                        'bg-slate-800'
                      )}>
                        {item.type === 'file' && <FileText className="w-3 h-3 text-white" />}
                        {item.type === 'check' && <CheckCircle2 className="w-3 h-3 text-white" />}
                        {item.type === 'sign' && <Activity className="w-3 h-3 text-white" />}
                        {item.type === 'note' && <MessageSquare className="w-3 h-3 text-white" />}
                        {item.type === 'system' && <Settings className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex flex-col gap-1 ml-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.date}</span>
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          <span className="text-primary uppercase mr-1">{item.user}</span>
                          {item.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-[10px] font-black text-slate-400 mt-6 uppercase tracking-widest hover:text-primary transition-colors">
                  Voir tout l'historique
                </Button>
              </CardContent>
            </Card>

            {/* Actions Panel */}
            <div className="p-6 bg-slate-900 rounded-xl text-white shadow-xl space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest border-b border-white/10 pb-2">Actions Rapides</h4>
              <div className="grid grid-cols-2 gap-2">
                {hasPermission('documents:approve_service') && (
                  <Button size="sm" onClick={() => handleDossierAction('Validation Étape')} className="bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-[9px] h-9">
                    <CheckCircle2 className="w-3 h-3 mr-2" /> Valider Étape
                  </Button>
                )}
                <Button size="sm" onClick={() => handleDossierAction('Rappel Urgence')} className="bg-amber-600 hover:bg-amber-700 font-bold uppercase text-[9px] h-9">
                  <AlertCircle className="w-3 h-3 mr-2" /> Rappel Urgence
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDossierAction('Partage')} className="bg-transparent border-white/20 hover:bg-white/10 font-bold uppercase text-[9px] h-9">
                  <Share2 className="w-3 h-3 mr-2" /> Partager
                </Button>
                {hasPermission('dossiers:close') && (
                  <Button variant="outline" size="sm" onClick={() => handleDossierAction('Archivage Dossier')} className="bg-transparent border-red-900/50 text-red-400 hover:bg-red-900/20 font-bold uppercase text-[9px] h-9">
                    <Trash2 className="w-3 h-3 mr-2" /> Archiver
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
};

export default DossierDetail;
