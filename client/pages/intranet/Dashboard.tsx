import {
  Bell,
  Calendar,
  FileText,
  FolderOpen,
  MessageSquare,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Activity,
  User as UserIcon,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserStatus } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";

const Dashboard = () => {
  const { user, hasPermission, logAction, updateStatus, emergencyMode } = useAuth();
  const store = useGovernmentStore();

  if (!user) return null;

  const statusColors = {
    available: 'bg-emerald-500',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-500'
  };

  const statusLabels = {
    available: 'En service',
    busy: 'Occupé',
    away: 'Absent',
    offline: 'Hors service'
  };

  const notifications = store.getNotifications();
  const announcements = store.getGlobalAnnouncements();
  const calendarEvents = store.getCalendarEvents();

  const workspaces = store.getWorkspaces();
  const allRecentFiles = Object.entries(workspaces).flatMap(([wsId, ws]) =>
    (ws.dossiers || []).map(d => ({
      id: d.id,
      title: d.title,
      status: d.status,
      service: ws.name,
      date: '2024',
      service_id: wsId.toUpperCase(),
      acl: [] as string[]
    }))
  ).filter(d => d.status !== 'Archivé');

  const filteredFiles = allRecentFiles.filter(file => {
    const isGovernor = user?.role === 'gouverneur';
    const isOwner = file.service_id === user?.service_id;
    const inACL = user?.id && file.acl.includes(user.id);
    return isGovernor || isOwner || inACL;
  });

  const filteredNotifications = notifications.filter(n => {
    const isGovernor = user?.role === 'gouverneur';
    const isSameService = n.service_id === user?.service_id;
    return isGovernor || isSameService;
  });

  return (
    <IntranetLayout>
      <div className="space-y-8">
        {/* Emergency Mode Alert */}
        {emergencyMode && (
          <Card className="bg-red-600 border-none shadow-2xl animate-pulse overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:40px_40px] opacity-20" />
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 rounded-2xl shadow-inner">
                  <ShieldAlert className="w-10 h-10 text-white animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">PROTOCOLE D'URGENCE ACTIVÉ</h2>
                  <p className="text-red-100 font-bold uppercase tracking-widest text-[10px]">Alerte Gouvernementale de Niveau 1 - Restriction des Accès Non-Essentiels</p>
                </div>
              </div>
              <Link to="/intranet/communication">
                <Button className="bg-white text-red-600 hover:bg-slate-100 font-black uppercase tracking-widest px-8 py-6 h-auto shadow-lg">
                  Rejoindre le canal de crise
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Tableau de Bord</h1>
            <p className="text-slate-500 font-medium">
              Bienvenue, {user.grade} <span className="text-slate-900 font-bold">{user.name}</span>. Votre accès de niveau <span className="text-primary font-bold uppercase">{user.role.replace('_', ' ')}</span> est actif.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" className="text-slate-500 hover:text-primary font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest h-10 border border-slate-200 bg-white">
                <ArrowLeft className="w-4 h-4" />
                Quitter l'espace
              </Button>
            </Link>
            {hasPermission('dossiers:create') && (
              <Button className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold rounded shadow-lg flex items-center gap-2 h-10 px-4 uppercase text-[10px] tracking-widest" onClick={() => logAction('Création nouveau dossier (interface)')}>
                <PlusCircle className="w-4 h-4" />
                Nouveau Dossier
              </Button>
            )}
            <Button variant="outline" className="border-slate-300 font-bold flex items-center gap-2 h-10 px-4 uppercase text-[10px] tracking-widest" onClick={() => logAction('Consultation journal activité')}>
              <Clock className="w-4 h-4" />
              Journal d'activité
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-blue-600 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Dossiers en cours</p>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FolderOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900">42</h3>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-tighter italic">Mis à jour en temps réel</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-amber-500 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">À Valider</p>
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900">12</h3>
                <span className="text-xs font-bold text-slate-400">En attente</span>
              </div>
              <Progress value={65} className="h-1.5 mt-4" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-emerald-600 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Documents Signés</p>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900">156</h3>
                <span className="text-xs font-bold text-emerald-600">Ce mois</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-tighter italic">Total annuel: 1,402</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-slate-800 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Notifications</p>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
                  <Bell className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900">7</h3>
                <Badge className="bg-red-500 text-white animate-pulse">URGENT</Badge>
              </div>
              <div className="flex gap-1 mt-4">
                <div className="h-1.5 flex-grow bg-red-500 rounded-full" />
                <div className="h-1.5 flex-grow bg-slate-200 rounded-full" />
                <div className="h-1.5 flex-grow bg-slate-200 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg transition-all group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-primary group-hover:text-white transition-all mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Nouveau Document</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg transition-all group">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-full group-hover:bg-primary group-hover:text-white transition-all mb-3">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Créer Dossier</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg transition-all group">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-primary group-hover:text-white transition-all mb-3">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Note Interne</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg transition-all group">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-full group-hover:bg-primary group-hover:text-white transition-all mb-3">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">Ouvrir Messagerie</span>
              </button>
            </div>

            {/* Recent Dossiers */}
            <Card className="shadow-lg border-none">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 rounded-t-xl py-4">
                <div>
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">Statut des Dossiers Récents</CardTitle>
                  <CardDescription>Dernières modifications sur vos dossiers assignés</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="font-bold text-primary flex items-center gap-1">
                  Voir tout <ChevronRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">ID Dossier</th>
                        <th className="px-6 py-4">Intitulé</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{file.id}</td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-900">{file.title}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter px-1.5 py-0 border-slate-200">
                              {file.service}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">{file.date}</td>
                          <td className="px-6 py-4">
                            <Badge className={cn(
                              "text-[10px] font-black uppercase tracking-tighter px-2",
                              file.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                              file.status === 'À valider' ? 'bg-amber-100 text-amber-700' :
                              file.status === 'Publié' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-700'
                            )}>
                              {file.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/intranet/dossiers/${file.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors">
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Internal Announcements */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 ml-1">Derniers Communiqués Internes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((ann) => (
                  <Card key={ann.id} className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-primary text-white text-[10px] font-black">OFFICIEL</Badge>
                        <span className="text-[10px] font-bold text-slate-500">{ann.date}</span>
                      </div>
                      <CardTitle className="text-md font-bold text-white tracking-tight">{ann.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">{ann.text}</p>
                      <Button variant="link" className="text-primary p-0 h-auto font-bold text-xs flex items-center gap-1">
                        Lire la note complète <ArrowRight className="w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Dashboard Column */}
          <div className="space-y-8">
            {/* Notifications Panel */}
            <Card className="shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    Notifications
                  </CardTitle>
                  <Badge variant="outline" className="bg-white font-bold border-slate-200">
                    {filteredNotifications.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[320px]">
                  <div className="divide-y divide-slate-100">
                    {filteredNotifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start relative overflow-hidden group">
                        {notif.priority === 'high' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}
                        <div className={cn(
                          "p-2 rounded-lg flex-shrink-0",
                          notif.type === 'validation' ? "bg-amber-50 text-amber-600" :
                          notif.type === 'assignment' ? "bg-blue-50 text-blue-600" :
                          "bg-slate-50 text-slate-600"
                        )}>
                          {notif.type === 'validation' ? <ShieldAlert className="w-4 h-4" /> :
                           notif.type === 'assignment' ? <FolderOpen className="w-4 h-4" /> :
                           <Calendar className="w-4 h-4" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                            {notif.text}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{notif.time}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-tighter",
                              notif.priority === 'high' ? "text-red-500" : 
                              notif.priority === 'medium' ? "text-amber-500" : 
                              "text-slate-500"
                            )}>
                              Priorité {notif.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest border-slate-200 bg-white">
                    Tout marquer comme lu
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <Card className="shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-[#1B365D] text-white py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Agenda de la Semaine
                  </CardTitle>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">MAI 2024</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 flex gap-2 overflow-x-auto bg-slate-50 border-b border-slate-100">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <button 
                      key={i} 
                      className={cn(
                        "flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-all",
                        i === 1 ? "bg-primary text-white shadow-lg scale-110" : "hover:bg-slate-200 text-slate-600"
                      )}
                    >
                      <span className="text-[8px] font-bold uppercase">{day}</span>
                      <span className="text-sm font-black">{20 + i}</span>
                    </button>
                  ))}
                </div>
                <div className="p-4 space-y-4">
                  {calendarEvents.map((event, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <span className="text-xs font-black text-slate-400 w-10 text-right group-hover:text-primary transition-colors">{event.time}</span>
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            event.type === 'securite' ? "bg-emerald-500" :
                            event.type === 'economie' ? "bg-blue-500" :
                            event.type === 'justice' ? "bg-amber-500" :
                            "bg-primary"
                          )} />
                          <span className="text-sm font-bold text-slate-900 tracking-tight">{event.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter ml-3.5">
                          {event.type.replace('_', ' ')} — Salle 4B
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-xs font-bold text-primary mt-2">
                    Voir le calendrier complet
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Status / Help */}
            <Card className="shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-primary" />
                  Votre Disponibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-primary shadow-md">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full",
                      statusColors[user.status || 'available']
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{statusLabels[user.status || 'available']}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(['available', 'busy', 'away', 'offline'] as UserStatus[]).map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      className={cn(
                        "h-9 text-[9px] font-black uppercase tracking-widest gap-2 border-slate-200 justify-start",
                        user.status === status && "bg-primary/5 border-primary text-primary"
                      )}
                      onClick={() => updateStatus(status)}
                    >
                      <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
                      {statusLabels[status]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-gradient-to-br from-primary to-[#254a7c] rounded-2xl text-white shadow-xl relative overflow-hidden group">
              <Activity className="absolute bottom-[-10px] right-[-10px] w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2">Centre d'Assistance</h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Besoin d'aide avec un document ou une procédure ? Contactez le service informatique ou consultez les guides RH.
                </p>
                <Button size="sm" className="bg-white text-primary hover:bg-slate-100 font-bold px-6">
                  Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
};

export default Dashboard;
