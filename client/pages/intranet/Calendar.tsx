import { IntranetLayout } from "@/components/IntranetLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight,
  Plus, MoreVertical, Filter, Search, Shield, Bell, CheckCircle2, AlertTriangle, Info, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const events = [
  {
    id: 1,
    time: '09:00 - 10:30',
    title: 'Briefing Sécurité Hebdomadaire',
    service: 'SECURITE_PUBLIQUE',
    location: 'Salle de Crise - Cabinet',
    participants: 8,
    type: 'critical',
    date: '24 Mai 2024'
  },
  {
    id: 2,
    time: '11:00 - 12:00',
    title: 'Comité de Direction Sanitaire',
    service: 'SANTE_HUMAINS',
    location: 'Visioconférence',
    participants: 12,
    type: 'internal',
    date: '24 Mai 2024'
  },
  {
    id: 3,
    time: '14:30 - 16:00',
    title: 'Réunion Budgétaire - T2',
    service: 'TRESOR_COMMERCE',
    location: 'Sénat - Bureau 12',
    participants: 5,
    type: 'official',
    date: '24 Mai 2024'
  },
  {
    id: 4,
    time: '16:30 - 17:30',
    title: 'Point Presse Officiel',
    service: 'COMMUNICATION',
    location: 'Salle de Presse - RdC',
    participants: 25,
    type: 'public',
    date: '24 Mai 2024'
  }
];

export default function Calendar() {
  const { user, hasPermission, emergencyMode, toggleEmergencyMode } = useAuth();
  const [selectedDate, setSelectedDate] = useState('24 Mai 2024');

  const getServiceColor = (serviceId: string) => {
    switch (serviceId) {
      case 'CABINET': return 'bg-slate-900';
      case 'SECURITE_PUBLIQUE': return 'bg-blue-600';
      case 'JUSTICE': return 'bg-red-700';
      case 'SANTE_HUMAINS': return 'bg-emerald-600';
      case 'TRESOR_COMMERCE': return 'bg-amber-600';
      case 'COMMUNICATION': return 'bg-indigo-600';
      default: return 'bg-slate-500';
    }
  };

  return (
    <IntranetLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none flex items-center gap-4">
               <CalendarIcon className="w-10 h-10 text-primary" /> Planning & Réunions
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Gérez votre emploi du temps gouvernemental
            </p>
          </div>
          
          <div className="flex items-center gap-2">
             {hasPermission('planning:create') && (
               <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] gap-2 px-6 h-11">
                  <Plus className="w-4 h-4" /> Nouvelle Réunion
               </Button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="shadow-xl border-none overflow-hidden rounded-3xl">
               <CardHeader className="bg-slate-900 text-white pb-8">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-sm font-black uppercase tracking-widest text-slate-400">Mai 2024</span>
                     <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10"><ChevronRight className="w-4 h-4" /></Button>
                     </div>
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter">Mai <span className="text-secondary text-2xl align-top">24</span></h2>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                      <span key={`${day}-${idx}`} className="text-[10px] font-black uppercase text-slate-400 py-2">{day}</span>
                    ))}
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      const isSelected = day === 24;
                      const hasEvents = [15, 18, 22, 24, 25, 28].includes(day);
                      
                      return (
                        <button 
                          key={day} 
                          className={cn(
                            "h-10 w-full rounded-lg text-sm font-black transition-all relative flex items-center justify-center",
                            isSelected ? "bg-primary text-white shadow-lg scale-110" : "hover:bg-slate-100 text-slate-700",
                            !isSelected && hasEvents && "text-primary"
                          )}
                        >
                          {day}
                          {hasEvents && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-secondary rounded-full" />}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-12 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-3">Statut par département</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Cabinet', count: 4, color: 'bg-slate-900' },
                        { label: 'SAMS / Santé', count: 2, color: 'bg-emerald-600' },
                        { label: 'Sécurité Publique', count: 7, color: 'bg-blue-600' },
                        { label: 'Justice', count: 3, color: 'bg-red-700' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className={cn("w-2 h-2 rounded-full", item.color)} />
                              <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
                           </div>
                           <Badge variant="secondary" className="bg-slate-100 text-[10px] font-black">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
               </CardContent>
            </Card>
            
            <Card className={cn(
               "border-none shadow-xl rounded-3xl overflow-hidden p-8 space-y-6 transition-all duration-500",
               emergencyMode ? "bg-red-600 animate-pulse scale-105 shadow-[0_0_30px_rgba(220,38,38,0.5)]" : "bg-secondary"
            )}>
               <div className="p-3 bg-white/20 rounded-2xl w-fit">
                  {emergencyMode ? (
                    <ShieldAlert className="w-8 h-8 text-white animate-bounce" />
                  ) : (
                    <Shield className="w-8 h-8 text-white" />
                  )}
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                    {emergencyMode ? "PROTOCOLE D'URGENCE ACTIF" : "Réunions de Crise"}
                  </h3>
                  <p className="text-white/70 text-sm font-medium leading-relaxed uppercase tracking-tight">
                     {emergencyMode
                       ? "Alerte de niveau 1 déclenchée. Tous les services doivent se rapporter immédiatement à leur poste."
                       : "En cas d'alerte rouge, toutes les réunions non-essentielles sont suspendues automatiquement."}
                  </p>
               </div>
               <Button
                 onClick={toggleEmergencyMode}
                 className={cn(
                   "w-full font-black uppercase tracking-widest py-6 h-auto transition-all",
                   emergencyMode
                    ? "bg-white text-red-600 hover:bg-slate-100"
                    : "bg-white text-secondary hover:bg-slate-100"
                 )}
               >
                  {emergencyMode ? "Désactiver le Protocole" : "Protocole d'urgence"}
               </Button>
            </Card>
          </div>

          {/* Timeline / Events List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between mb-2">
               <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Timeline du Jour</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedDate}</p>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="font-bold border-slate-200 text-slate-500 uppercase tracking-widest text-[10px]">Aujourd'hui</Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200"><Filter className="w-4 h-4 text-slate-400" /></Button>
               </div>
            </div>

            <div className="space-y-6 relative">
              <div className="absolute left-12 top-0 bottom-0 w-px bg-slate-200 hidden md:block" />
              
              {events.map((event) => (
                <div key={event.id} className="group relative flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                   <div className="w-24 flex-shrink-0 text-right pt-4 hidden md:block">
                      <span className="block text-xs font-black text-slate-900 uppercase tracking-tighter">{event.time.split(' - ')[0]}</span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.time.split(' - ')[1]}</span>
                   </div>
                   
                   <div className="hidden md:block absolute left-[45px] top-5 w-4 h-4 rounded-full border-4 border-white bg-slate-200 group-hover:bg-primary group-hover:scale-125 transition-all z-10" />
                   
                   <Card className="flex-grow shadow-lg border-none hover:shadow-2xl transition-all hover:-translate-y-1 group-hover:border-l-4 group-hover:border-primary">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                               <Badge className={cn("text-white font-black tracking-widest uppercase text-[9px]", getServiceColor(event.service))}>
                                  {event.service}
                               </Badge>
                               <Badge variant="outline" className={cn(
                                 "font-black tracking-widest uppercase text-[9px]",
                                 event.type === 'critical' ? 'border-red-500 text-red-600' :
                                 event.type === 'official' ? 'border-blue-500 text-blue-600' :
                                 'border-slate-300 text-slate-500'
                               )}>
                                  {event.type}
                               </Badge>
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{event.title}</h3>
                            
                            <div className="flex flex-wrap items-center gap-6">
                               <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-tight">
                                  <MapPin className="w-3 h-3 text-primary" /> {event.location}
                               </div>
                               <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-tight">
                                  <Users className="w-3 h-3 text-primary" /> {event.participants} Participants
                               </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-4">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical className="w-4 h-4" /></Button>
                             <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500">
                                     P{i}
                                  </div>
                                ))}
                             </div>
                          </div>
                        </div>
                      </CardContent>
                   </Card>
                </div>
              ))}
            </div>
            
            {/* Quick Actions / Notices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
               {[
                 { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, title: "Disponibilité", text: "Toutes les salles de conférence du Cabinet sont libres cet après-midi." },
                 { icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, title: "Rappel", text: "Soumission des rapports de réunion requise sous 24h après chaque session." },
                 { icon: <Info className="w-5 h-5 text-blue-500" />, title: "Maintenance", text: "Le système de visio-conférence subira une mise à jour ce soir à 22h00." }
               ].map((notice, idx) => (
                 <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                       {notice.icon}
                       <span className="text-xs font-black uppercase text-slate-900 tracking-tight">{notice.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{notice.text}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
}
