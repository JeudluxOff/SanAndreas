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
import { useAuth } from '@/contexts/AuthContext';
import { legalStore } from '@/lib/legal-store';
import { useLegalStore } from '@/hooks/useLegalStore';
import { Message } from '@shared/api';

const Communication = () => {
  const store = useLegalStore();
  const { user } = useAuth();
  const [activeChannelId, setActiveChannelId] = React.useState("channel:penal");
  const [activeChannelName, setActiveChannelName] = React.useState("Pôle Pénal");
  const [isDM, setIsDM] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const chatMessages = store.getMessages(activeChannelId);
  const staff = store.getStaff();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      channel_id: activeChannelId,
      sender_id: user.id,
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    store.createMessage(newMessage);
    setMessage("");
  };

  const getSenderName = (senderId: string) => {
    if (senderId === user?.id) return user.name;
    const member = staff.find(s => s.id === senderId);
    return member ? member.name : "Anonyme";
  };

  return (
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
                   { name: "Annonces Associés", locked: true, id: "channel:annonces" },
                   { name: "Pôle Pénal", locked: false, id: "channel:penal" },
                   { name: "Pôle Civil", locked: false, id: "channel:civil" },
                   { name: "Pôle Affaires", locked: false, id: "channel:affaires" },
                   { name: "Dossiers Scellés", locked: true, id: "channel:scelles" }
                 ].map((channel, idx) => (
                   <button
                    key={idx}
                    onClick={() => {
                      setActiveChannelId(channel.id);
                      setActiveChannelName(channel.name);
                      setIsDM(false);
                    }}
                    className={cn(
                     "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-left",
                     activeChannelId === channel.id ? "bg-[#c1a461]/5 text-[#c1a461]" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                   )}>
                     {channel.locked ? <Lock className="w-3.5 h-3.5" /> : <Hash className="w-4 h-4" />}
                     <span className="text-[11px] font-black uppercase tracking-tight">{channel.name}</span>
                     {activeChannelId === channel.id && <div className="w-1.5 h-1.5 rounded-full bg-[#c1a461] ml-auto" />}
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
                 {staff.filter(s => s.id !== user?.id).map((u, idx) => {
                   const dmId = [user?.id, u.id].sort().join(':');
                   const isActive = activeChannelId === dmId;
                   return (
                     <button
                      key={idx}
                      onClick={() => {
                        setActiveChannelId(dmId);
                        setActiveChannelName(u.name);
                        setIsDM(true);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-left",
                        isActive ? "bg-[#c1a461]/5 text-[#c1a461]" : "hover:bg-slate-50 text-slate-400 hover:text-slate-900"
                      )}>
                       <div className="relative shrink-0">
                         <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-[#c1a461]/20 transition-all">
                           <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} />
                           <AvatarFallback>{u.name[0]}</AvatarFallback>
                         </Avatar>
                         <div className={cn("absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
                           u.status === 'Actif' ? 'bg-emerald-500' : 'bg-slate-300'
                         )} />
                       </div>
                       <div className="overflow-hidden">
                         <p className={cn("text-[11px] font-black uppercase leading-none", isActive ? "text-[#c1a461]" : "text-slate-900")}>{u.name}</p>
                         <p className="text-[9px] font-bold text-slate-400 truncate mt-1">{u.role}</p>
                       </div>
                     </button>
                   );
                 })}
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
                {isDM ? <UserCheck className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tighter">{activeChannelName}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Communication confidentielle • {isDM ? '1:1' : '8 membres'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               {!isDM && (
                 <div className="flex -space-x-3">
                   {staff.slice(0, 4).map((s, i) => (
                     <Avatar key={i} className="h-8 w-8 ring-4 ring-white">
                       <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`} />
                       <AvatarFallback>{s.name[0]}</AvatarFallback>
                     </Avatar>
                   ))}
                   {staff.length > 4 && (
                     <div className="h-8 w-8 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[8px] font-black text-slate-400">
                       +{staff.length - 4}
                     </div>
                   )}
                 </div>
               )}
               <div className="h-6 w-px bg-slate-100 mx-2" />
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#c1a461]">
                 <Bell className="w-5 h-5" />
               </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-10 space-y-10">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="flex gap-6 max-w-4xl animate-in fade-in slide-in-from-bottom duration-500">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender_id}`} />
                  <AvatarFallback>{getSenderName(msg.sender_id)[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1.5 flex-grow text-left">
                  <div className="flex items-end gap-3">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{getSenderName(msg.sender_id)}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm font-medium leading-relaxed uppercase tracking-tight text-slate-600">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                <MessageSquare className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">Aucun message dans ce salon</p>
              </div>
            )}
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
  );
};

export default Communication;
