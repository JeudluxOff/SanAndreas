import { useState } from "react";
import { MessageSquare, Send, Users, Hash, Search, MoveVertical as MoreVertical, Plus, AtSign, Paperclip, Smile, Bell, CircleCheck as CheckCircle2, Settings, User as UserIcon, FileText, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth, ServiceID } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";
import { GovUserAccess, isGovernmentAdmin, isGovernmentGovernor, canAccessGovernmentChannel } from '@/lib/government-access';
import { GovDivisionId, GOV_CHANNELS } from '@/lib/government-rbac';
import { ShieldAlert } from "lucide-react";

const allChannels = [
  { id: 'general', name: 'annonces-officielles', type: 'announcement', icon: <Volume2 className="w-4 h-4" />, service_id: 'CABINET' as ServiceID },
  { id: 'cabinet', name: 'cabinet-gouverneur', type: 'channel', icon: <Hash className="w-4 h-4" />, service_id: 'CABINET' as ServiceID },
  { id: 'securite', name: 'securite-publique', type: 'channel', icon: <Hash className="w-4 h-4" />, service_id: 'SECURITE_PUBLIQUE' as ServiceID },
  { id: 'justice', name: 'justice-parquet', type: 'channel', icon: <Hash className="w-4 h-4" />, service_id: 'JUSTICE' as ServiceID },
  { id: 'sante', name: 'sante-services', type: 'channel', icon: <Hash className="w-4 h-4" />, service_id: 'SANTE_HUMAINS' as ServiceID },
  { id: 'tresor', name: 'tresor-commerce', type: 'channel', icon: <Hash className="w-4 h-4" />, service_id: 'TRESOR_COMMERCE' as ServiceID },
  { id: 'admin', name: 'administration-coordination', type: 'channel', icon: <Hash className="w-4 h-4" />, service_id: 'ADMINISTRATION_GENERALE' as ServiceID },
];

const Communication = () => {
  const { user, canAccessService, hasPermission, logAction, updateStatus } = useAuth();
  const store = useGovernmentStore();

  const govAccess: GovUserAccess | null = user ? {
    id: user.id,
    rolesTechniques: (user.govRolesTechniques || ['employee']) as any[],
    divisions: (user.govDivisions || ['administration_generale']) as GovDivisionId[],
    permissions: (user.govPermissions || []) as any[],
    status: user.govStatus || 'actif',
  } : null;

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

  const visibleChannels = allChannels.filter(channel => {
    if (isGovernmentAdmin(govAccess) || isGovernmentGovernor(govAccess)) return true;
    if (channel.id === 'general') return true;
    const matchingGovChannel = GOV_CHANNELS.find(gc => gc.id === channel.id || gc.name.toLowerCase().includes(channel.name.replace(/-/g, ' ').toLowerCase()));
    if (matchingGovChannel) {
      return canAccessGovernmentChannel(govAccess, matchingGovChannel);
    }
    return canAccessService(channel.service_id);
  });

  const [activeChannel, setActiveChannel] = useState(visibleChannels[0]);
  const [message, setMessage] = useState("");
  const [showNewChannelDialog, setShowNewChannelDialog] = useState(false);
  const [showNewDMDialog, setShowNewDMDialog] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newDMUsername, setNewDMUsername] = useState("");
  const [showMembersPanel, setShowMembersPanel] = useState(false);

  const employees = store.getEmployeesV2().filter(e => e.status === 'actif');

  const messages = store.getMessages(activeChannel.id).map(m => ({
    id: m.id,
    user: m.sender_name,
    role: m.sender_role,
    text: m.content,
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMe: m.sender_id === user?.id
  }));

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    if (activeChannel.type === 'announcement' && !hasPermission('communication:announcements_post')) {
      alert("Vous n'avez pas l'autorisation de poster dans le salon des annonces officielles.");
      return;
    }

    const newMessage = {
      id: `MSG-${Date.now()}`,
      channel_id: activeChannel.id,
      sender_id: user.id,
      sender_name: user.name,
      sender_role: user.role,
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    store.createMessage(newMessage);
    logAction('Envoi de message', { channel: activeChannel.name });
    setMessage("");
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    logAction('Création salon', { name: newChannelName });
    setNewChannelName("");
    setShowNewChannelDialog(false);
  };

  const handleCreateDM = () => {
    if (!newDMUsername.trim()) return;
    logAction('Ouverture message direct', { target: newDMUsername });
    setNewDMUsername("");
    setShowNewDMDialog(false);
  };

  return (
    <IntranetLayout>
      <div className="h-[calc(100vh-12rem)] flex overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-xl">
        {/* Left Sidebar */}
        <aside className="w-64 md:w-80 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Messagerie
            </h2>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher salon, agent..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <ScrollArea className="flex-grow p-2">
            <div className="space-y-6 pt-2">
              {/* Channels */}
              <div className="space-y-1">
                <div className="px-3 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salons Officiels</span>
                  <button
                    onClick={() => setShowNewChannelDialog(true)}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {visibleChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all group",
                      activeChannel?.id === channel.id
                        ? "bg-primary text-white font-bold shadow-md"
                        : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-md",
                      activeChannel?.id === channel.id ? "bg-white/20" : "bg-slate-200 group-hover:bg-primary/10"
                    )}>
                      {channel.icon}
                    </div>
                    <span className="truncate">#{channel.name}</span>
                    {channel.type === 'announcement' && (
                      <Badge className="ml-auto bg-red-500 text-[8px] h-4 px-1 border-none">OFFICIEL</Badge>
                    )}
                  </button>
                ))}
              </div>

              {/* DMs — from real employees */}
              <div className="space-y-1">
                <div className="px-3 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Messages Directs</span>
                  <button
                    onClick={() => setShowNewDMDialog(true)}
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {employees.filter(e => e.id !== user?.govEmployeeId).slice(0, 5).map((emp) => (
                  <button
                    key={emp.id}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm transition-all group"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 border border-slate-200">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.username}`} />
                        <AvatarFallback>{emp.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full",
                        emp.status === 'actif' ? "bg-emerald-500" : "bg-slate-300"
                      )} />
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate uppercase">{emp.firstName} {emp.lastName}</span>
                      <span className="text-[9px] font-bold text-slate-400 truncate uppercase">{emp.functionTitle}</span>
                    </div>
                  </button>
                ))}
                {employees.filter(e => e.id !== user?.govEmployeeId).length === 0 && (
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-3 py-2">Aucun agent disponible</p>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-900 text-white rounded-b-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-primary shadow-lg">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-slate-900 rounded-full",
                  statusColors[user?.status || 'available']
                )} />
              </div>
              <div className="flex flex-col overflow-hidden flex-grow">
                <span className="text-sm font-black truncate uppercase">{user?.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-tighter flex items-center gap-1 hover:text-white transition-colors">
                      {statusLabels[user?.status || 'available']}
                      <ChevronRight className="w-2.5 h-2.5 rotate-90" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40 font-bold text-[10px] uppercase tracking-widest">
                    <DropdownMenuLabel>Changer Statut</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => updateStatus('available')}>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> En service
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => updateStatus('busy')}>
                      <div className="w-2 h-2 rounded-full bg-red-500" /> Occupé
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => updateStatus('away')}>
                      <div className="w-2 h-2 rounded-full bg-amber-500" /> Absent
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => updateStatus('offline')}>
                      <div className="w-2 h-2 rounded-full bg-slate-500" /> Hors service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="font-bold text-xs uppercase tracking-widest">
                  <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logAction('Ouverture préférences notification')}>
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logAction('Ouverture profil messagerie')}>
                    Mon Profil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-grow flex flex-col min-w-0 bg-white relative">
          <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <Link to="/intranet" className="md:hidden">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                {activeChannel?.icon}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">#{activeChannel?.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Salon {activeChannel?.type === 'announcement' ? 'd\'annonces officielles' : 'de discussion interne'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-primary"
                onClick={() => setShowMembersPanel(v => !v)}
                title="Membres du salon"
              >
                <Users className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary" title="Notifications">
                    <Bell className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="font-bold text-xs uppercase tracking-widest">
                  <DropdownMenuLabel>Notifications du salon</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logAction('Notifications salon: toutes')}>Toutes les notifications</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logAction('Notifications salon: mentions')}>Mentions seulement</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logAction('Notifications salon: aucune')}>Aucune notification</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="font-bold text-xs uppercase tracking-widest">
                  <DropdownMenuItem onClick={() => logAction('Voir fichiers partagés', { channel: activeChannel.name })}>
                    Fichiers partagés
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logAction('Recherche dans salon', { channel: activeChannel.name })}>
                    Rechercher dans ce salon
                  </DropdownMenuItem>
                  {hasPermission('manage_settings') && (
                    <DropdownMenuItem onClick={() => logAction('Paramètres salon', { channel: activeChannel.name })} className="text-red-600">
                      Paramètres du salon
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <ScrollArea className="flex-grow p-6">
            <div className="space-y-8 pb-10">
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="p-6 bg-slate-50 rounded-full border border-slate-100 text-slate-300">
                  <MessageSquare className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Bienvenue dans #{activeChannel?.name}</h4>
                  <p className="text-sm text-slate-500 max-w-md italic">C'est le début de l'historique de ce salon. Les communications ici sont archivées et soumises aux protocoles de sécurité de l'État.</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex gap-4 group transition-all",
                  msg.isMe ? "flex-row-reverse" : "flex-row"
                )}>
                  <Avatar className="h-10 w-10 border shadow-sm flex-shrink-0 transition-transform group-hover:scale-110">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`} />
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "max-w-[70%] space-y-1",
                    msg.isMe ? "items-end text-right" : "items-start"
                  )}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs font-black uppercase text-slate-900 tracking-tight">{msg.user}</span>
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary h-4 px-1">
                        {msg.role}
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed",
                      msg.isMe
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200"
                    )}>
                      {msg.text}
                    </div>
                    {msg.isMe && (
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Envoyé</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <footer className="p-6 bg-white border-t border-slate-200">
            <form onSubmit={handleSendMessage} className="relative bg-slate-50 border border-slate-200 rounded-2xl p-2 shadow-inner focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <textarea
                placeholder={`Message dans #${activeChannel?.name}...`}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-3 text-sm font-medium min-h-[60px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="flex items-center justify-between px-2 pb-1 pt-1 border-t border-slate-100 mt-1">
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" title="Joindre fichier" onClick={() => logAction('Joindre fichier (messagerie)')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" title="Pièce jointe" onClick={() => logAction('Pièce jointe messagerie')}>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" title="Mention" onClick={() => setMessage(m => m + '@')}>
                    <AtSign className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" title="Emoji" onClick={() => logAction('Ouverture sélecteur emoji')}>
                    <Smile className="w-4 h-4" />
                  </Button>
                  <div className="h-4 w-px bg-slate-200 mx-2" />
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" title="Note interne" onClick={() => logAction('Note interne messagerie')}>
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-primary hover:bg-[#1B365D] text-white font-black uppercase text-[10px] tracking-widest h-8 px-4 rounded-lg shadow-md disabled:opacity-50"
                >
                  Envoyer <Send className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </form>
            <p className="mt-2 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Appuyez sur Entrée pour envoyer — Shift + Entrée pour une nouvelle ligne
            </p>
          </footer>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-l border-slate-200 bg-slate-50 overflow-auto">
          <div className="p-6 space-y-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto p-4 bg-primary/10 rounded-2xl text-primary w-fit">
                {activeChannel?.icon}
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">À propos de #{activeChannel?.name}</h4>
                <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed">
                  Salon utilisé pour les communications relatives au {activeChannel?.id === 'general' ? 'Gouvernement entier' : 'service ' + activeChannel?.name}.
                </p>
              </div>
            </div>

            <Separator className="bg-slate-200" />

            {showMembersPanel ? (
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Membres ({employees.length})</h5>
                <div className="space-y-3">
                  {employees.slice(0, 8).map(emp => (
                    <div key={emp.id} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-slate-200">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.username}`} />
                        <AvatarFallback>{emp.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold text-slate-700 truncate uppercase">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Informations</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>{employees.length} membre(s) actif(s)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span>{store.getMessages(activeChannel.id).length} message(s)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Confidentialité</span>
              </div>
              <p className="text-[10px] italic leading-relaxed text-amber-800 font-medium">
                Toutes les données transitant ici sont cryptées. Ne partagez jamais vos identifiants d'accès.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* New Channel Dialog */}
      <Dialog open={showNewChannelDialog} onOpenChange={setShowNewChannelDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">Nouveau Salon</DialogTitle>
            <DialogDescription>Créez un nouveau salon de discussion interne.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">Nom du salon</label>
            <Input
              placeholder="ex: coordination-budget"
              value={newChannelName}
              onChange={e => setNewChannelName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewChannelDialog(false)}>Annuler</Button>
            <Button onClick={handleCreateChannel} disabled={!newChannelName.trim()}>Créer le Salon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New DM Dialog */}
      <Dialog open={showNewDMDialog} onOpenChange={setShowNewDMDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">Nouveau Message Direct</DialogTitle>
            <DialogDescription>Démarrez une conversation privée avec un agent.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">Nom d'utilisateur ou agent</label>
            <Input
              placeholder="ex: jean.dupont"
              value={newDMUsername}
              onChange={e => setNewDMUsername(e.target.value)}
            />
            {employees.length > 0 && (
              <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
                {employees.filter(e =>
                  e.id !== user?.govEmployeeId &&
                  (newDMUsername === '' || `${e.firstName} ${e.lastName}`.toLowerCase().includes(newDMUsername.toLowerCase()) || e.username.toLowerCase().includes(newDMUsername.toLowerCase()))
                ).slice(0, 5).map(emp => (
                  <button
                    key={emp.id}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-left transition-all"
                    onClick={() => setNewDMUsername(`${emp.firstName} ${emp.lastName}`)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.username}`} />
                      <AvatarFallback>{emp.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold text-slate-700 uppercase">{emp.firstName} {emp.lastName}</span>
                    <span className="text-[9px] font-medium text-slate-400 ml-auto">{emp.functionTitle}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDMDialog(false)}>Annuler</Button>
            <Button onClick={handleCreateDM} disabled={!newDMUsername.trim()}>Démarrer la conversation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IntranetLayout>
  );
};

export default Communication;
