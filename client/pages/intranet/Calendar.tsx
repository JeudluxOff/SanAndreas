import { IntranetLayout } from "@/components/IntranetLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight,
  Plus, MoreVertical, Filter, Search, Shield, Bell, CheckCircle2, AlertTriangle, Info, ShieldAlert,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { format, addDays, subDays, isSameDay, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

const MOCK_EVENTS = [
  {
    id: 1,
    time: '09:00 - 10:30',
    title: 'Briefing Sécurité Hebdomadaire',
    service: 'SECURITE_PUBLIQUE',
    location: 'Salle de Crise - Cabinet',
    participants: 8,
    type: 'critical',
    date: new Date()
  },
  {
    id: 2,
    time: '11:00 - 12:00',
    title: 'Comité de Direction Sanitaire',
    service: 'SANTE_HUMAINS',
    location: 'Visioconférence',
    participants: 12,
    type: 'internal',
    date: new Date()
  },
  {
    id: 3,
    time: '14:30 - 16:00',
    title: 'Réunion Budgétaire - T2',
    service: 'TRESOR_COMMERCE',
    location: 'Sénat - Bureau 12',
    participants: 5,
    type: 'official',
    date: addDays(new Date(), 1)
  },
  {
    id: 4,
    time: '16:30 - 17:30',
    title: 'Point Presse Officiel',
    service: 'COMMUNICATION',
    location: 'Salle de Presse - RdC',
    participants: 25,
    type: 'public',
    date: addDays(new Date(), -1)
  },
  {
    id: 5,
    time: '10:00 - 11:00',
    title: 'Revue de Protocole',
    service: 'CABINET',
    location: 'Bureau du Gouverneur',
    participants: 3,
    type: 'internal',
    date: addDays(new Date(), 2)
  }
];

export default function Calendar() {
  const { user, hasPermission, emergencyMode, toggleEmergencyMode } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Generate a range of dates for the scroller (15 days before, 30 days after)
  const startDate = subDays(new Date(), 15);
  const scrollDates = Array.from({ length: 45 }, (_, i) => addDays(startDate, i));

  // Generate a range of dates for the timeline (e.g., 7 days starting from selectedDate or today)
  const timelineDates = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));

  const getEventsForDate = (date: Date) => {
    return MOCK_EVENTS.filter(event => isSameDay(event.date, date));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Initial scroll to current date in the scroller
    if (scrollerRef.current) {
       const todayIndex = 15; // as we start 15 days before
       const cardWidth = 84; // approximate width of each date card + margin
       scrollerRef.current.scrollLeft = (todayIndex * cardWidth) - (scrollerRef.current.clientWidth / 2) + (cardWidth / 2);
    }
  }, []);

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
               <CardHeader className="bg-[#0f172a] text-white pb-10 pt-8 px-8">
                  <div className="flex items-center justify-between mb-6">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                       {format(selectedDate, 'MMMM yyyy', { locale: fr })}
                     </span>
                     <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                          className="h-6 w-6 text-white hover:bg-white/10 p-0"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                          className="h-6 w-6 text-white hover:bg-white/10 p-0"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                     </div>
                  </div>
                  <h2 className="text-6xl font-black uppercase tracking-tighter flex items-start">
                    {format(selectedDate, 'MMM', { locale: fr })} <span className="text-[#ef4444] text-2xl font-black ml-1 mt-1">{format(selectedDate, 'd')}</span>
                  </h2>
               </CardHeader>
               <CardContent className="p-8 pt-10">
                  <div className="grid grid-cols-7 gap-y-6 text-center mb-8">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                      <span key={`${day}-${idx}`} className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{day}</span>
                    ))}
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      // Logic for current month display
                      const isSelected = isSameDay(addDays(startOfMonth(selectedDate), i), selectedDate);
                      const hasEvents = MOCK_EVENTS.some(e => isSameDay(e.date, addDays(startOfMonth(selectedDate), i)));

                      return (
                        <div key={day} className="flex flex-col items-center justify-center relative">
                          <button
                            onClick={() => setSelectedDate(addDays(startOfMonth(selectedDate), i))}
                            className={cn(
                              "h-10 w-10 rounded-xl text-sm font-black transition-all flex items-center justify-center",
                              isSelected
                                ? "bg-[#1e293b] text-white shadow-xl shadow-slate-200"
                                : "hover:bg-slate-50 text-[#1e293b]"
                            )}
                          >
                            {day}
                          </button>
                          {hasEvents && (
                            <div className={cn(
                              "absolute -bottom-1 w-1 h-1 rounded-full",
                              isSelected ? "bg-white/40" : "bg-red-500"
                            )} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-16 space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-4">STATUT PAR DÉPARTEMENT</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'CABINET', color: 'bg-slate-900' },
                        { label: 'SAMS / SANTÉ', color: 'bg-emerald-600' },
                        { label: 'SÉCURITÉ PUBLIQUE', color: 'bg-blue-600' },
                        { label: 'JUSTICE', color: 'bg-red-700' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", item.color)} />
                              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider group-hover:text-primary transition-colors">{item.label}</span>
                           </div>
                           <div className="w-10 h-5 bg-slate-50 rounded-full border border-slate-100 flex items-center px-1 opacity-50">
                              <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                           </div>
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
            {/* Real Planning Date Scroller */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 overflow-hidden relative">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Sélecteur de date dynamique</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => scroll('left')}
                      className="h-8 w-8 text-slate-400 hover:text-primary"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => scroll('right')}
                      className="h-8 w-8 text-slate-400 hover:text-primary"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
               </div>

               <div
                 ref={scrollerRef}
                 className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2 scroll-smooth no-scrollbar"
                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
               >
                  {scrollDates.map((date, idx) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "flex flex-col items-center min-w-[70px] py-4 rounded-2xl transition-all border-2",
                          isSelected
                            ? "bg-primary border-primary text-white shadow-lg -translate-y-1 scale-105"
                            : "bg-slate-50 border-transparent hover:border-slate-200 text-slate-600",
                          isToday && !isSelected && "border-primary/20 bg-primary/5"
                        )}
                      >
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest mb-1 opacity-70",
                          isSelected && "opacity-100"
                        )}>
                          {format(date, 'EEE', { locale: fr })}
                        </span>
                        <span className="text-2xl font-black">{format(date, 'd')}</span>
                        {isToday && !isSelected && (
                          <div className="w-1 h-1 bg-primary rounded-full mt-1" />
                        )}
                        {isSelected && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full mt-1" />
                        )}
                      </button>
                    );
                  })}
               </div>
            </div>

            <div className="flex items-center justify-between mb-6 px-2">
               <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Planning de la Semaine</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Défilement continu des événements</p>
               </div>
               <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setSelectedDate(today);
                    }}
                    className="font-bold border-slate-200 text-slate-500 uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white hover:border-primary transition-all px-4"
                  >
                    Revenir à Aujourd'hui
                  </Button>
               </div>
            </div>

            <div className="space-y-12 relative pb-20">
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-slate-200 hidden md:block" />

              {timelineDates.map((date, dateIdx) => {
                const dayEvents = getEventsForDate(date);
                const isToday = isSameDay(date, new Date());

                return (
                  <div key={dateIdx} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Sticky Date Header */}
                    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm py-4 -mx-2 px-2 flex items-center gap-4">
                       <div className={cn(
                         "flex flex-col items-center justify-center w-12 h-12 rounded-2xl shadow-sm border-2",
                         isToday ? "bg-primary border-primary text-white" : "bg-slate-100 border-transparent text-slate-900"
                       )}>
                          <span className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">
                            {format(date, 'EEE', { locale: fr })}
                          </span>
                          <span className="text-xl font-black leading-none">{format(date, 'd')}</span>
                       </div>
                       <div>
                          <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900">
                            {format(date, 'EEEE d MMMM', { locale: fr })}
                          </h3>
                          {dayEvents.length > 0 ? (
                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{dayEvents.length} Événement(s) planifié(s)</p>
                          ) : (
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Aucune réunion prévue</p>
                          )}
                       </div>
                    </div>

                    <div className="space-y-6">
                      {dayEvents.length > 0 ? dayEvents.map((event) => (
                        <div key={event.id} className="group relative flex flex-col md:flex-row gap-6 md:gap-12 items-start pl-4 md:pl-0">
                           <div className="w-24 flex-shrink-0 text-right pt-4 hidden md:block">
                              <span className="block text-xs font-black text-slate-900 uppercase tracking-tighter">{event.time.split(' - ')[0]}</span>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.time.split(' - ')[1]}</span>
                           </div>

                           <div className={cn(
                             "hidden md:block absolute left-[45px] top-5 w-4 h-4 rounded-full border-4 border-white transition-all z-10 shadow-sm",
                             isToday ? "bg-primary scale-110" : "bg-slate-200 group-hover:bg-primary"
                           )} />

                           <Card className="flex-grow shadow-md border-none hover:shadow-xl transition-all hover:-translate-y-1 group-hover:border-l-4 group-hover:border-primary overflow-hidden">
                              <CardContent className="p-0">
                                <div className="flex">
                                  <div className={cn("w-2 flex-shrink-0", getServiceColor(event.service))} />
                                  <div className="p-6 flex flex-col md:flex-row justify-between items-start gap-4 flex-grow">
                                    <div className="space-y-4">
                                      <div className="flex flex-wrap items-center gap-2">
                                         <Badge className={cn("text-white font-black tracking-widest uppercase text-[9px]", getServiceColor(event.service))}>
                                            {event.service}
                                         </Badge>
                                         <Badge variant="outline" className={cn(
                                           "font-black tracking-widest uppercase text-[9px]",
                                           event.type === 'critical' ? 'border-red-500 text-red-600 animate-pulse' :
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
                                            <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                                               P{i}
                                            </div>
                                          ))}
                                       </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                           </Card>
                        </div>
                      )) : (
                        <div className="flex items-center gap-6 pl-[52px] opacity-40">
                          <div className="w-4 h-px bg-slate-300" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Aucun événement à cette heure</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
