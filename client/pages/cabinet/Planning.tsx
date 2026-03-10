import React from 'react';
import {
  Bell,
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
  Lock,
  Trash2,
  CalendarDays,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { legalStore } from '@/lib/legal-store';
import { useLegalStore } from '@/hooks/useLegalStore';
import { Hearing, NotificationSettings } from '@shared/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Planning = () => {
  const store = useLegalStore();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<'week' | 'day'>('week');
  const hearings = store.getHearings();

  // Modals state
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showNotificationModal, setShowNotificationModal] = React.useState(false);
  const [hearingToDelete, setHearingToDelete] = React.useState<string | null>(null);

  // Notification Settings state
  const [notifSettings, setNotifSettings] = React.useState<NotificationSettings>(store.getNotificationSettings());

  const handleSaveNotifSettings = () => {
    store.updateNotificationSettings(notifSettings);
    toast.success("Paramètres mis à jour", {
      description: "Vos préférences de notifications ont été enregistrées."
    });
    setShowNotificationModal(false);
  };

  // Form state
  const [newHearing, setNewHearing] = React.useState({
    title: '',
    case_id: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    location: '',
    judge: '',
    type: 'Pénal'
  });

  const cases = store.getCases();

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
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2"
            >
              <Plus className="w-4 h-4" /> Nouvel Événement
            </Button>
          </div>
        </div>

        {/* Create Hearing Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Planification d'Événement</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Enregistrez une nouvelle audience ou un rendez-vous client important.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-6">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé de l'Événement</Label>
                <Input
                  value={newHearing.title}
                  onChange={(e) => setNewHearing({...newHearing, title: e.target.value})}
                  placeholder="EX: AUDIENCE PRÉLIMINAIRE..."
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier Assigné (Optionnel)</Label>
                  <Select value={newHearing.case_id} onValueChange={(val) => setNewHearing({...newHearing, case_id: val === 'none' ? '' : val})}>
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue placeholder="Choisir un dossier..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-slate-400 italic font-bold">-- AUCUN DOSSIER --</SelectItem>
                      {cases.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.id} - {c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type d'Événement</Label>
                  <Select value={newHearing.type} onValueChange={(val) => setNewHearing({...newHearing, type: val})}>
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pénal">Pénal</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Affaires">Affaires</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</Label>
                  <Input
                    type="datetime-local"
                    value={newHearing.date}
                    onChange={(e) => setNewHearing({...newHearing, date: e.target.value})}
                    className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu / Tribunal</Label>
                  <Input
                    value={newHearing.location}
                    onChange={(e) => setNewHearing({...newHearing, location: e.target.value})}
                    placeholder="EX: COUR SUPÉRIEURE..."
                    className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Juge en charge</Label>
                <Input
                  value={newHearing.judge}
                  onChange={(e) => setNewHearing({...newHearing, judge: e.target.value})}
                  placeholder="EX: HON. J. MILLER..."
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (!user || !newHearing.title) return;
                  const h: Hearing = {
                    id: `HR-${Date.now()}`,
                    ...newHearing,
                    status: 'Confirmé'
                  };
                  store.createHearing(h);

                  store.logAction({
                    id: `LOG-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    user_id: user.id,
                    user_name: user.name,
                    action: 'Planification Audience',
                    target_type: 'Hearing',
                    target_id: h.id,
                    metadata: { title: h.title, case_id: h.case_id || 'none' }
                  });

                  setShowCreateModal(false);
                  setNewHearing({
                    title: '',
                    case_id: '',
                    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                    location: '',
                    judge: '',
                    type: 'Pénal'
                  });
                }}
                disabled={!newHearing.title}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl"
              >
                Enregistrer au Planning
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Hearing Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Annuler l'Événement</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Êtes-vous sûr de vouloir supprimer cette audience du planning ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex-col gap-3 mt-6">
              <Button
                onClick={() => {
                  if (!user || !hearingToDelete) return;
                  store.deleteHearing(hearingToDelete, user.id);
                  setShowDeleteModal(false);
                  setHearingToDelete(null);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest h-12 rounded-xl"
              >
                Confirmer l'Annulation
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Retour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                      const caseObj = event.case_id ? store.getCase(event.case_id) : null;
                      return (
                        <div key={event.id} className="flex gap-8 group">
                          <div className="w-24 text-right pt-1">
                            <p className="text-xs font-black text-slate-900">{format(new Date(event.date), 'HH:mm')}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{event.type}</p>
                          </div>
                          <div className={cn(
                            "flex-grow p-6 rounded-[24px] border transition-all duration-500 cursor-pointer hover:shadow-xl hover:-translate-y-1 relative group-item",
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
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {caseObj ? `${caseObj.id} - ${caseObj.title}` : (event.case_id || "RENDEZ-VOUS HORS DOSSIER")}
                                  </span>
                                </div>
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter text-left">{event.title}</h4>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#c1a461]" /> {event.location}</span>
                                  <span className="flex items-center gap-1"><Gavel className="w-3 h-3 text-[#c1a461]" /> {event.judge}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 ring-4 ring-white shadow-lg">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.id}`} />
                                  <AvatarFallback>H</AvatarFallback>
                                </Avatar>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-white border-slate-100 rounded-xl shadow-xl p-2 min-w-[150px]">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setHearingToDelete(event.id);
                                        setShowDeleteModal(true);
                                      }}
                                      className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 p-3 rounded-lg cursor-pointer flex gap-3"
                                    >
                                      <Trash2 className="w-4 h-4" /> Annuler l'Audience
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
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
                  <p className="text-[10px] font-black text-[#c1a461] uppercase tracking-widest text-left">Prochaine Audience</p>
                  <p className="text-xs font-bold text-white uppercase tracking-tight text-left">
                    {hearings.length > 0 ? hearings[0].title : 'Aucune audience'}
                  </p>
                  {hearings.length > 0 && (
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest text-left">
                      {format(new Date(hearings[0].date), 'dd MMMM HH:mm', { locale: fr })}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => {
                    setNotifSettings(store.getNotificationSettings());
                    setShowNotificationModal(true);
                  }}
                  className="w-full bg-[#c1a461] hover:bg-[#927843] text-white text-[10px] font-black uppercase h-12 rounded-xl mt-4"
                >
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

        {/* Notification Management Modal */}
        <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
          <DialogContent className="max-w-md bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#c1a461]/10 rounded-2xl">
                  <Bell className="w-6 h-6 text-[#c1a461]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Notifications</DialogTitle>
                  <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Configurez vos alertes en temps réel
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 my-8">
              {[
                { key: 'dossiers', label: 'Nouveaux Dossiers', desc: 'Alertes lors de la création de dossiers' },
                { key: 'documents', label: 'Documents & Actes', desc: 'Dépôts et modifications de documents' },
                { key: 'evidence', label: 'Pièces à Conviction', desc: 'Nouvelles preuves versées au dossier' },
                { key: 'hearings', label: 'Audiences & Délais', desc: 'Rappels et nouvelles dates d\'audiences' },
                { key: 'tasks', label: 'Tâches & Missions', desc: 'Assignations et mises à jour de tâches' },
                { key: 'invoices', label: 'Facturation', desc: 'Émission et paiement de factures' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between group">
                  <div className="space-y-1 text-left">
                    <Label className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.label}</Label>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{item.desc}</p>
                  </div>
                  <Switch
                    checked={(notifSettings as any)[item.key]}
                    onCheckedChange={(checked) => setNotifSettings({...notifSettings, [item.key]: checked})}
                    className="data-[state=checked]:bg-[#c1a461]"
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowNotificationModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveNotifSettings}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl"
              >
                Enregistrer les Préférences
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default Planning;
