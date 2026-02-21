import { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Hash, 
  Search, 
  MoreVertical, 
  Plus, 
  AtSign, 
  Paperclip, 
  Smile, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  User as UserIcon,
  Filter,
  FileText,
  Volume2
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const channels = [
  { id: 'general', name: 'annonces-officielles', type: 'announcement', icon: <Volume2 className="w-4 h-4" /> },
  { id: 'cabinet', name: 'cabinet-gouverneur', type: 'channel', icon: <Hash className="w-4 h-4" /> },
  { id: 'securite', name: 'securite-publique', type: 'channel', icon: <Hash className="w-4 h-4" /> },
  { id: 'justice', name: 'justice-parquet', type: 'channel', icon: <Hash className="w-4 h-4" /> },
];

const directMessages = [
  { id: 'arthur', name: 'Arthur Vance', role: 'Gouverneur', status: 'online' },
  { id: 'elena', name: 'Elena Rodriguez', role: 'Press Secretary', status: 'online' },
  { id: 'jackson', name: 'Jackson Teller', role: 'Secrétaire Sécurité', status: 'offline' },
  { id: 'thomas', name: 'Thomas Vercetti', role: 'Secrétaire Justice', status: 'online' },
];

const messages = [
  { id: 1, user: 'Arthur Vance', role: 'Gouverneur', text: 'Bonjour à tous, une réunion de cabinet est prévue à 14h00 pour discuter du plan d\'urbanisme.', time: '09:15', isMe: false },
  { id: 2, user: 'Elena Rodriguez', role: 'PR', text: 'Bien reçu, je prépare le communiqué de presse préliminaire.', time: '09:20', isMe: false },
  { id: 3, user: 'Jackson Teller', role: 'Sécurité', text: 'Je serai présent avec le rapport de sécurité de la zone sud.', time: '09:25', isMe: false },
  { id: 4, user: 'Moi', role: 'Secrétaire', text: 'J\'ai mis à jour les dossiers correspondants sur l\'intranet.', time: '09:30', isMe: true },
];

const Communication = () => {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Mock sending message
    setMessage("");
  };

  return (
    <IntranetLayout>
      <div className="h-[calc(100vh-12rem)] flex overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-xl">
        {/* Left Sidebar - Channels & DMs */}
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
              {/* Channels Section */}
              <div className="space-y-1">
                <div className="px-3 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salons Officiels</span>
                  <Plus className="w-3 h-3 text-slate-400 hover:text-primary cursor-pointer" />
                </div>
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all group",
                      activeChannel.id === channel.id 
                        ? "bg-primary text-white font-bold shadow-md" 
                        : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-md",
                      activeChannel.id === channel.id ? "bg-white/20" : "bg-slate-200 group-hover:bg-primary/10"
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

              {/* DMs Section */}
              <div className="space-y-1">
                <div className="px-3 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Messages Directs</span>
                  <Plus className="w-3 h-3 text-slate-400 hover:text-primary cursor-pointer" />
                </div>
                {directMessages.map((dm) => (
                  <button
                    key={dm.id}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm transition-all group"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 border border-slate-200">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dm.name}`} />
                        <AvatarFallback>{dm.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full",
                        dm.status === 'online' ? "bg-emerald-500" : "bg-slate-300"
                      )} />
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate uppercase">{dm.name}</span>
                      <span className="text-[9px] font-bold text-slate-400 truncate uppercase">{dm.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-900 text-white rounded-b-2xl">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-black truncate uppercase">{user?.name}</span>
                <span className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-tighter">{user?.role.replace('_', ' ')}</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto text-slate-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-grow flex flex-col min-w-0 bg-white relative">
          {/* Chat Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                {activeChannel.icon}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">#{activeChannel.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Salon {activeChannel.type === 'announcement' ? 'd\'annonces officielles' : 'de discussion interne'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                <Users className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <Button variant="ghost" size="icon" className="text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Messages Area */}
          <ScrollArea className="flex-grow p-6">
            <div className="space-y-8 pb-10">
              {/* Channel Welcome Info */}
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="p-6 bg-slate-50 rounded-full border border-slate-100 text-slate-300">
                  <MessageSquare className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Bienvenue dans #{activeChannel.name}</h4>
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
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lu par Arthur V.</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <footer className="p-6 bg-white border-t border-slate-200">
            <form onSubmit={handleSendMessage} className="relative bg-slate-50 border border-slate-200 rounded-2xl p-2 shadow-inner focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <textarea 
                placeholder={`Message dans #${activeChannel.name}...`}
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
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                    <AtSign className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <div className="h-4 w-px bg-slate-200 mx-2" />
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
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

        {/* Right Sidebar - Info (Desktop) */}
        <aside className="hidden lg:flex w-64 flex-col border-l border-slate-200 bg-slate-50 overflow-auto">
          <div className="p-6 space-y-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto p-4 bg-primary/10 rounded-2xl text-primary w-fit">
                {activeChannel.icon}
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">À propos de #{activeChannel.name}</h4>
                <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed">
                  Salon utilisé pour les communications relatives au {activeChannel.id === 'general' ? 'Gouvernement entier' : 'service ' + activeChannel.name}.
                </p>
              </div>
            </div>

            <Separator className="bg-slate-200" />

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Derniers Fichiers Partagés</h5>
              <div className="space-y-3">
                {[
                  { name: "Decret-Urbanisme.pdf", time: "Hier" },
                  { name: "Planning-Briefing.xlsx", time: "Hier" },
                  { name: "Photo-Site-Sud.jpg", time: "2 jrs" }
                ].map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 group cursor-pointer hover:border-primary transition-all shadow-sm">
                    <div className="p-1.5 bg-slate-50 rounded text-slate-400 group-hover:text-primary transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-slate-700 truncate uppercase">{file.name}</span>
                      <span className="text-[9px] font-medium text-slate-400">{file.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Voir tout</Button>
            </div>

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
    </IntranetLayout>
  );
};

export default Communication;
