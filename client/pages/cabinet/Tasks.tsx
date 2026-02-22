import React from 'react';
import { 
  Zap, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Lock,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Flag,
  UserCheck
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@shared/api';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = React.useState(legalStore.getTasks());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    title: '',
    case_id: '',
    priority: 'Moyenne' as any,
    assigned_to: ''
  });

  const cases = legalStore.getCases();
  const staff = legalStore.getStaff();

  const handleCreate = () => {
    if (!user || !newTask.title || !newTask.case_id) return;

    const task: Task = {
      id: `TSK-${Math.floor(Math.random() * 9000) + 1000}`,
      case_id: newTask.case_id,
      title: newTask.title,
      priority: newTask.priority,
      status: 'Todo',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: newTask.assigned_to || user.id,
      created_at: new Date().toISOString()
    };

    legalStore.createTask(task);
    setTasks(legalStore.getTasks());
    setShowCreateModal(false);
    setNewTask({ title: '', case_id: '', priority: 'Moyenne', assigned_to: '' });

    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Création tâche',
      target_type: 'Task',
      target_id: task.id,
      metadata: { title: task.title, case_id: task.case_id }
    });
  };

  const myTasks = tasks.filter(t => t.assigned_to === user?.id);
  const urgentTasks = tasks.filter(t => t.priority === 'Critique' || t.priority === 'Haute');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.case_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1 text-left">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des Tâches</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Assignations par dossier • Priorités Stratégiques • Suivi d'avancement
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Calendar className="w-4 h-4" /> Vue Calendrier
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2"
            >
              <Plus className="w-4 h-4" /> Nouvelle Tâche
            </Button>
          </div>
        </div>

        {/* Create Task Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Nouvelle Tâche Cabinet</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Attribuez des actions prioritaires à un dossier ou un collaborateur.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé de la Tâche</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="EX: RÉDACTION ASSIGNATION..."
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priorité</Label>
                  <Select value={newTask.priority} onValueChange={(val) => setNewTask({...newTask, priority: val as any})}>
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basse">Basse</SelectItem>
                      <SelectItem value="Moyenne">Moyenne</SelectItem>
                      <SelectItem value="Haute">Haute</SelectItem>
                      <SelectItem value="Critique">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigné à</Label>
                  <Select value={newTask.assigned_to} onValueChange={(val) => setNewTask({...newTask, assigned_to: val})}>
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue placeholder="Choisir staff..." />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.role})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier Assigné</Label>
                <Select value={newTask.case_id} onValueChange={(val) => setNewTask({...newTask, case_id: val})}>
                  <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                    <SelectValue placeholder="Choisir un dossier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.id} - {c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                onClick={handleCreate}
                disabled={!newTask.title || !newTask.case_id}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-black/10"
              >
                Créer la Tâche
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: "À Faire", value: tasks.filter(t => t.status === 'Todo').length, icon: <AlertCircle className="w-5 h-5" />, color: "text-slate-600", bg: "bg-slate-50" },
            { label: "En Cours", value: inProgressTasks.length, icon: <Zap className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Urgent", value: urgentTasks.length, icon: <Flag className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" },
            { label: "Terminées", value: doneTasks.length, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" }
          ].map((stat, idx) => (
            <Card key={idx} className="bg-white border-none shadow-md px-6 py-5 flex items-center gap-5 rounded-2xl">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none text-left">{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-left">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
                <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Liste des Tâches Actives</CardTitle>
                <div className="flex items-center gap-4">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                     <input 
                      type="text" 
                      placeholder="RECHERCHER..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9" 
                     />
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {filteredTasks.map((task, idx) => {
                    const caseObj = legalStore.getCase(task.case_id);
                    return (
                      <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                        <div className="flex items-center gap-6">
                          <div className={cn("w-1.5 h-12 rounded-full", 
                            task.priority === 'Critique' ? 'bg-red-500' : 
                            task.priority === 'Haute' ? 'bg-amber-500' : 'bg-[#c1a461]'
                          )} />
                          <div className="space-y-1 text-left">
                            <h4 className="text-base font-black text-slate-900 uppercase tracking-tighter">{task.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{caseObj?.title || task.case_id} • Échéance: {new Date(task.due_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1", 
                            task.priority === 'Critique' ? 'bg-red-600 text-white' : 
                            task.priority === 'Haute' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                          )}>
                            {task.priority}
                          </Badge>
                          <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigned_to}`} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#c1a461] transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                  {filteredTasks.length === 0 && (
                     <div className="p-20 text-center text-slate-400 uppercase font-black text-[10px]">Aucune tâche correspondante</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[32px] bg-[#0a0f18] text-white p-8">
              <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#c1a461]" /> Vos Tâches
                </CardTitle>
                <Badge className="bg-[#c1a461] text-white text-[8px] font-black uppercase tracking-widest border-none">{myTasks.length} ACTIVES</Badge>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {myTasks.length > 0 ? myTasks.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="w-1 h-full bg-[#c1a461] rounded-full" />
                    <div className="text-left">
                      <p className="text-[11px] font-black uppercase text-white leading-tight">{item.title}</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{item.priority}</p>
                    </div>
                  </div>
                )) : (
                   <p className="text-[9px] font-bold text-white/20 uppercase text-center py-4">Aucune tâche assignée</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[32px] bg-white p-8 space-y-6">
              <div className="p-3 bg-emerald-50 rounded-2xl w-fit">
                 <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="space-y-2 text-left">
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tighter">Productivité Cabinet</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-tight">
                  Taux de complétion des tâches : {Math.round((doneTasks.length / (tasks.length || 1)) * 100)}%.
                </p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((doneTasks.length / (tasks.length || 1)) * 100)}%` }} />
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default Tasks;
