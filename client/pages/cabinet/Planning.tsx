import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Gavel, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Zap,
  UserCheck,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { legalStore } from '@/lib/legal-store';
import { Hearing } from '@shared/api';

const Planning = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<'week' | 'day'>('week');
  const hearings = legalStore.getHearings();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (day: Date) => {
    return hearings.filter(h => isSameDay(new Date(h.date), day));
  };

  return (
    <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1 text-left">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Planning & Audiences</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Calendrier Centralisé • Audiences Judiciaires • Rendez-vous Clients
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl mr-4">
              <Button 
                variant={view === 'week' ? 'default' : 'ghost'} 
                onClick={() => setView('week')}
                className={cn("h-9 px-4 text-[9px] font-black uppercase tracking-widest rounded-lg", view === 'week' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
              >Semaine</Button>
              <Button 
                variant={view === 'day' ? 'default' : 'ghost'} 
                onClick={() => setView('day')}
                className={cn("h-9 px-4 text-[9px] font-black uppercase tracking-widest rounded-lg", view === 'day' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
              >Jour</Button>
            </div>
            <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Plus className="w-4 h-4" /> Nouvel Événement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Calendar View */}
          <div className="lg:col-span-9 space-y-8">
            <Card className="border-none shadow-xl rounded-[40px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-6">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="text-slate-400">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    {format(weekStart, 'MMMM yyyy', { locale: fr })}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="text-slate-400">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500" />
                     <span className="text-[9px] font-black text-slate-400 uppercase">Audiences</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-[#c1a461]" />
                     <span className="text-[9px] font-black text-slate-400 uppercase">Clients</span>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="p-6 text-center border-r border-slate-100 last:border-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{format(day, 'EEE', { locale: fr })}</p>
                      <p className={cn(
                        "text-xl font-black rounded-xl w-10 h-10 flex items-center justify-center mx-auto",
                        isSameDay(day, new Date()) ? "bg-[#c1a461] text-white shadow-lg shadow-[#c1a461]/20" : "text-slate-900"
                      )}>{format(day, 'd')}</p>
                    </div>
                  ))}
                </div>
                
                <div className="min-h-[600px] relative">
                  {/* Timeline hours */}
                  <div className="absolute left-0 top-0 bottom-0 w-20 border-r border-slate-50 flex flex-col pt-10">
                    {[8, 10, 12, 14, 16, 18].map(h => (
                      <div key={h} className="h-24 text-[9px] font-black text-slate-300 text-center uppercase tracking-widest">{h}:00</div>
                    ))}
                  </div>
                  
                  {/* Events Overlay (Simplified for UI) */}
                  <div className="ml-20 p-10 space-y-6">
                    {hearings.length > 0 ? hearings.map((event) => {
                      const caseObj = legalStore.getCase(event.case_id);
                      return (
                        <div key={event.id} className="flex gap-8 group">
                          <div className="w-24 text-right pt-1">
                            <p className="text-xs font-black text-slate-900">{format(new Date(event.date), 'HH:mm')}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{event.type}</p>
                          </div>
                          <div className={cn(
                            "flex-grow p-6 rounded-[24px] border transition-all duration-500 cursor-pointer hover:shadow-xl hover:-translate-y-1",
                            event.type === 'Pénal' ? "bg-red-50/50 border-red-100" : "bg-white shadow-md border-slate-50"
                          )}>
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <Badge className={cn("text-[8px] font-black uppercase px-2 py-0 border-none", 
                                    event.type === 'Pénal' ? "bg-red-600 text-white" : "bg-[#c1a461] text-white"
                                  )}>
                                    {event.type}
                                  </Badge>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{caseObj?.title || event.case_id}</span>
                                </div>
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter text-left">{event.title}</h4>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#c1a461]" /> {event.location}</span>
                                  <span className="flex items-center gap-1"><Gavel className="w-3 h-3 text-[#c1a461]" /> {event.judge}</span>
                                </div>
                              </div>
                              <Avatar className="h-10 w-10 ring-4 ring-white shadow-lg">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.id}`} />
                                <AvatarFallback>H</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                       <div className="p-20 text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Aucun événement programmé</p>
                       </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel: Urgent & Stats */}
          <div className="lg:col-span-3 space-y-10">
            {/* Quick Actions */}
            <Card className="border-none shadow-xl rounded-[32px] bg-[#0a0f18] text-white p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#c1a461]" /> Rappels Critiques
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-[#c1a461] uppercase tracking-widest">Prochaine Audience</p>
                  <p className="text-xs font-bold text-white uppercase tracking-tight">
                    {hearings.length > 0 ? hearings[0].title : 'Aucune audience'}
                  </p>
                </div>
                <Button className="w-full bg-[#c1a461] hover:bg-[#927843] text-white text-[10px] font-black uppercase h-12 rounded-xl mt-4">
                  Gérer les Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Hearing Stats */}
            <Card className="border-none shadow-xl rounded-[32px] bg-white p-8 space-y-6">
              <div className="p-3 bg-emerald-50 rounded-2xl w-fit">
                 <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tighter text-left">Suivi des Audiences</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-tight text-left">
                  {hearings.length} audiences ce mois-ci. Taux de report : 8%. Succès des référés : 92%.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                 <span className="text-slate-400">Target Atteinte</span>
                 <span className="text-emerald-600">+15%</span>
              </div>
            </Card>

            {/* Security Notice */}
            <div className="p-8 border border-[#c1a461]/20 rounded-[32px] bg-[#c1a461]/5 flex flex-col items-center text-center space-y-4">
              <Lock className="w-8 h-8 text-[#c1a461] opacity-40" />
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Intégrité du Planning</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">
                  Toute modification est tracée et horodatée par le système d'audit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Planning;
