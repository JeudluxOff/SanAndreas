import React from 'react';
import { MessageSquare, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';

interface CommunicationPanelProps {
  caseId?: string;
  staffId?: string;
}

const CommunicationPanel = ({ caseId, staffId }: CommunicationPanelProps) => {
  const { user } = useAuth();
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const channelId = `${user?.id}:${staffId || 'general'}`;
  const staff = staffId ? legalStore.getStaff().find(s => s.id === staffId) : null;

  React.useEffect(() => {
    const channelMessages = legalStore.getMessages(channelId);
    setMessages(channelMessages);
  }, [channelId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setIsLoading(true);
    try {
      const newMessage: any = {
        id: `MSG-${Date.now()}`,
        channel_id: channelId,
        sender_id: user.id,
        content: message,
        timestamp: new Date().toISOString()
      };

      legalStore.createMessage(newMessage);
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 rounded-2xl h-full flex flex-col">
      <CardHeader className="border-b border-white/5">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-[#c1a461]" />
          <div>
            <CardTitle className="text-[10px] font-black uppercase tracking-widest">
              {staff ? `Communication avec ${staff.name}` : 'Messages'}
            </CardTitle>
            <p className="text-[8px] font-bold text-white/40 mt-1">
              {staff?.role || 'Cabinet'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-3">
              <MessageSquare className="w-8 h-8 text-white/20 mx-auto" />
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                Aucun message
              </p>
              <p className="text-[8px] text-white/30">
                Démarrez une conversation
              </p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.sender_id === user?.id ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender_id !== user?.id && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={staff?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${staffId}`} />
                  <AvatarFallback>{staff?.name?.[0]}</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-[70%] rounded-xl p-3",
                  msg.sender_id === user?.id
                    ? "bg-[#c1a461] text-white"
                    : "bg-white/10 text-white/80"
                )}
              >
                <p className="text-xs leading-relaxed">{msg.content}</p>
                <div className="flex items-center gap-1 mt-2 text-[7px] opacity-70">
                  <Clock className="w-2 h-2" />
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message..."
          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-lg h-10 text-sm"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="bg-[#c1a461] hover:bg-[#d1b471] text-white font-black uppercase text-[9px] px-4 h-10 rounded-lg disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
};

export default CommunicationPanel;
