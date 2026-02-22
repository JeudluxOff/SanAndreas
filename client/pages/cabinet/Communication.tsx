import React from 'react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Lock,
  Download,
  FileCheck,
  TrendingUp,
  Zap,
  Clock,
  ArrowRight,
  Hash,
  Send,
  UserCheck,
  Bell,
  Activity,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import LegalIntranetLayout from './intranet/LegalIntranetLayout';
import { useAuth } from '@/contexts/AuthContext';
import { legalStore } from '@/lib/legal-store';

const Communication = () => {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = React.useState("Pôle Pénal");
  const [message, setMessage] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState([
    { user: "Victoria Cole", time: "10:15", msg: "Bonjour l'équipe. Quelqu'un a pu relire les conclusions pour l'affaire Madrazo ?", system: false },
    { user: "Marcus Vane", time: "10:18", msg: "Je m'en occupe dès mon retour d'audience, vers 11h30.", system: false },
    { user: "Elena Rossi", time: "10:20", msg: "Victoria, j'ai ajouté une note sur le témoin principal dans le vault. Dossier HC-2024-001.", system: false },
    { user: "System", time: "10:22", msg: "Audit Log: Elena Rossi a partagé le document [PREUVE-CCTV-01] dans ce salon.", system: true }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !user) return;

    const newMessage = {
      user: user.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: message,
      system: false
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage("");
  };

  return (
    <LegalIntranetLayout>
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Chat Sidebar (Channels & DMs) */}
        <div className="w-80 bg-white border-r border-slate-100 flex flex-col shrink-0">
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Communication</h2>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#c1a461]">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="RECHERCHER..." className="w-full bg-slate-50 border-none rounded-xl pl-10 text-[10px] font-bold uppercase tracking-widest h-10 focus:ring-2 ring-primary/5" />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-4 space-y-10 pb-10">
            {/* Channels */}
            <div className="space-y-4">
               <h4 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Canaux de Pôle</h4>
               <div className="space-y-1">
                 {[
                   { name: "Annonces Associés", locked: true },
                   { name: "Pôle Pénal", locked: false },
                   { name: "Pôle Civil", locked: false },
                   { name: "Pôle Affaires", locked: false },
                   { name: "Dossiers Scellés", locked: true }
                 ].map((channel, idx) => (
                   <button 
                    key={idx} 
                    onClick={() => setActiveChannel(channel.name)}
                    className={cn(
                     "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-left",
                     activeChannel === channel.name ? "bg-[#c1a461]/5 text-[#c1a461]" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                   )}>
                     {channel.locked ? <Lock className="w-3.5 h-3.5" /> : <Hash className="w-4 h-4" />}
                     <span className="text-[11px] font-black uppercase tracking-tight">{channel.name}</span>
                     {activeChannel === channel.name && <div className="w-1.5 h-1.5 rounded-full bg-[#c1a461] ml-auto" />}
                   </button>
                 ))}
               </div>
            </div>

            {/* Direct Messages */}
            <div className="space-y-4">
               <div className="flex justify-between items-center px-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Messages Directs</h4>
                 <UserPlus className="w-3.5 h-3.5 text-slate-400 hover:text-[#c1a461] cursor-pointer" />
               </div>
               <div className="space-y-1">
                 {[
                   { name: "Julian Harrington", status: "online", msg: "Dossier 402 validé.", id: "julian" },
                   { name: "Victoria Cole", status: "online", msg: "Conclusions prêtes.", id: "victoria" },
                   { name: "Marcus Vane", status: "busy", msg: "En audience...", id: "marcus" },
                   { name: "Elena Rossi", status: "away", msg: "Retour à 14h.", id: "elena" }
                 ].map((u, idx) => (
                   <button key={idx} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group text-left">
                     <div className="relative shrink-0">
                       <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-[#c1a461]/20 transition-all">
                         <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} />
                         <AvatarFallback>{u.name[0]}</AvatarFallback>
                       </Avatar>
                       <div className={cn("absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white", 
                         u.status === 'online' ? 'bg-emerald-500' : 
                         u.status === 'busy' ? 'bg-red-500' : 'bg-slate-300'
                       )} />
                     </div>
                     <div className="overflow-hidden">
                       <p className="text-[11px] font-black uppercase text-slate-900 leading-none">{u.name}</p>
                       <p className="text-[9px] font-bold text-slate-400 truncate mt-1">{u.msg}</p>
                     </div>
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Chat Main Area */}
        <div className="flex-grow flex flex-col bg-slate-50/50">
          {/* Chat Header */}
          <div className="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#c1a461]/5 text-[#c1a461] rounded-lg">
                <Hash className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tighter">{activeChannel}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Communication confidentielle • 8 membres</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                 {[1, 2, 3, 4].map(i => (
                   <Avatar key={i} className="h-8 w-8 ring-4 ring-white">
                     <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Staff${i}`} />
                   </Avatar>
                 ))}
               </div>
               <div className="h-6 w-px bg-slate-100 mx-2" />
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#c1a461]">
                 <Bell className="w-5 h-5" />
               </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-10 space-y-10">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-6 max-w-4xl animate-in fade-in slide-in-from-bottom duration-500", 
                msg.system ? "bg-[#c1a461]/5 p-6 rounded-[24px] border border-[#c1a461]/10 mx-auto" : ""
              )}>
                {!msg.system && (
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`} />
                    <AvatarFallback>{msg.user[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className="space-y-1.5 flex-grow text-left">
                  {!msg.system && (
                    <div className="flex items-end gap-3">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{msg.user}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{msg.time}</span>
                    </div>
                  )}
                  <div className={cn(
                    "text-sm font-medium leading-relaxed uppercase tracking-tight",
                    msg.system ? "text-[#c1a461] text-center italic" : "text-slate-600"
                  )}>
                    {msg.msg}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Area */}
          <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-slate-100 shrink-0">
            <div className="relative group">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ÉCRIVEZ VOTRE MESSAGE..." 
                className="w-full h-14 bg-slate-50 border-none rounded-[20px] pl-8 pr-16 text-xs font-bold uppercase tracking-widest focus:ring-2 ring-[#c1a461]/20 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-[#0a0f18] text-white rounded-xl hover:bg-[#c1a461] transition-all shadow-xl group-focus-within:shadow-[#c1a461]/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex gap-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <button type="button" className="hover:text-[#c1a461] transition-colors">+ Joindre un document</button>
              <button type="button" className="hover:text-[#c1a461] transition-colors">+ Partager une preuve</button>
              <button type="button" className="hover:text-[#c1a461] transition-colors">+ Créer une tâche</button>
            </div>
          </form>
        </div>
      </div>
    </LegalIntranetLayout>
  );
};

export default Communication;
