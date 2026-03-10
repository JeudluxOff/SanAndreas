import React from 'react';
import { 
  Settings, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Lock,
  Download,
  Users,
  ShieldCheck,
  UserPlus,
  Activity,
  Zap,
  Clock,
  ArrowRight,
  Database,
  Globe,
  Mail,
  Server
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
  DialogTrigger,
  DialogFooter,
  DialogDescription
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
import { useLegalRBAC } from '@/pages/cabinet/intranet/LegalIntranetLayout';
import { Link } from 'react-router-dom';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Admin = () => {
  const { isAssocié, canAudit } = useLegalRBAC();
  const { registerUser } = useAuth();

  const [staff, setStaff] = React.useState(legalStore.getStaff());
  const [logs, setLogs] = React.useState(legalStore.getAuditLogs());
  const settings = legalStore.getSettings();

  React.useEffect(() => {
    return legalStore.subscribe(() => {
      setStaff([...legalStore.getStaff()]);
      setLogs([...legalStore.getAuditLogs()]);
    });
  }, []);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newUserForm, setNewUserForm] = React.useState({
    username: '',
    password: '',
    name: '',
    role: 'avocat' as any,
    service_id: 'JUSTICE' as any,
    service_name: 'Noxwood & Partner',
    grade: 'Avocat à la Cour',
    matricule: '',
    callsign: '',
    avatar: ''
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.username || !newUserForm.password || !newUserForm.name) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    registerUser(newUserForm, newUserForm.password);
    toast.success("Utilisateur créé avec succès");
    setIsDialogOpen(false);
    setNewUserForm({
      username: '',
      password: '',
      name: '',
      role: 'avocat',
      service_id: 'JUSTICE',
      service_name: 'Noxwood & Partner',
      grade: 'Avocat à la Cour',
      matricule: '',
      callsign: '',
      avatar: ''
    });
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAssocié && !canAudit) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-slate-400 p-10">
        <Lock className="w-16 h-16 mb-6 opacity-20" />
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Accès Refusé</h2>
        <p className="text-xs font-bold uppercase tracking-widest mt-2 max-w-md text-center">
          Cette section est strictement réservée à l'Administration et aux Auditeurs du cabinet.
        </p>
        <Link to="/cabinet/intranet">
          <Button className="mt-8 bg-[#0a0f18] text-white uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl">
            Retour au Tableau de Bord
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1 text-left">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Administration du Cabinet</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Configuration Système • Gestion RH • Permissions RBAC
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Download className="w-4 h-4" /> Rapport Système
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
                  <UserPlus className="w-4 h-4" /> Nouvel Utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-none shadow-2xl rounded-[32px] p-0 overflow-hidden">
                <div className="bg-[#0a0f18] p-8 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                      <div className="p-2 bg-[#c1a461] rounded-lg">
                        <UserPlus className="w-5 h-5 text-[#0a0f18]" />
                      </div>
                      Création d'Utilisateur
                    </DialogTitle>
                    <DialogDescription className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
                      Enregistrement d'un nouveau membre dans l'intranet cabinet
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom d'utilisateur</Label>
                      <Input
                        placeholder="EX: HARVEY_S"
                        className="bg-slate-50 border-none h-12 text-xs font-bold uppercase tracking-widest rounded-xl focus-visible:ring-1 focus-visible:ring-[#c1a461]"
                        value={newUserForm.username}
                        onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value.toLowerCase().replace(/\s/g, '_')})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de passe</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-slate-50 border-none h-12 text-xs font-bold uppercase tracking-widest rounded-xl focus-visible:ring-1 focus-visible:ring-[#c1a461]"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom Complet</Label>
                      <Input
                        placeholder="EX: HARVEY SPECTER"
                        className="bg-slate-50 border-none h-12 text-xs font-bold uppercase tracking-widest rounded-xl focus-visible:ring-1 focus-visible:ring-[#c1a461]"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Niveau d'Accès</Label>
                      <Select
                        value={newUserForm.role}
                        onValueChange={(val) => setNewUserForm({...newUserForm, role: val})}
                      >
                        <SelectTrigger className="bg-slate-50 border-none h-12 text-xs font-bold uppercase tracking-widest rounded-xl focus:ring-1 focus:ring-[#c1a461]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 rounded-xl">
                          <SelectItem value="avocat" className="text-[10px] font-bold uppercase tracking-widest">Avocat (Standard)</SelectItem>
                          <SelectItem value="admin" className="text-[10px] font-bold uppercase tracking-widest">Admin (Complet)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fonction / Grade</Label>
                      <Input
                        placeholder="EX: AVOCAT SENIOR"
                        className="bg-slate-50 border-none h-12 text-xs font-bold uppercase tracking-widest rounded-xl focus-visible:ring-1 focus-visible:ring-[#c1a461]"
                        value={newUserForm.grade}
                        onChange={(e) => setNewUserForm({...newUserForm, grade: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Matricule</Label>
                      <Input
                        placeholder="EX: HS-01"
                        className="bg-slate-50 border-none h-12 text-xs font-bold uppercase tracking-widest rounded-xl focus-visible:ring-1 focus-visible:ring-[#c1a461]"
                        value={newUserForm.matricule}
                        onChange={(e) => setNewUserForm({...newUserForm, matricule: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Code Action (Callsign)</Label>
                      <Input
                        placeholder="EX: A-5"
                        className="bg-slate-50 border-none h-12 text-xs font-bold uppercase tracking-widest rounded-xl focus-visible:ring-1 focus-visible:ring-[#c1a461]"
                        value={newUserForm.callsign}
                        onChange={(e) => setNewUserForm({...newUserForm, callsign: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL Avatar</Label>
                      <Input
                        placeholder="HTTPS://..."
                        className="bg-slate-50 border-none h-12 text-xs font-bold uppercase tracking-widest rounded-xl focus-visible:ring-1 focus-visible:ring-[#c1a461]"
                        value={newUserForm.avatar}
                        onChange={(e) => setNewUserForm({...newUserForm, avatar: e.target.value})}
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#c1a461] text-[#0a0f18] text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl hover:bg-[#c1a461]/90"
                    >
                      Confirmer la Création
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: "Membres Cabinet", value: staff.length, icon: <Users className="w-5 h-5" />, color: "text-[#c1a461]", bg: "bg-[#c1a461]/5" },
            { label: "Audit Logs", value: logs.length, icon: <ShieldCheck className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Dossiers Scellés", value: legalStore.getCases().filter(c => c.status === 'Scellé').length, icon: <Lock className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Stockage Vault", value: "84%", icon: <Server className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
              <div className="text-left">
                <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Gestion des Équipes</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Annuaire interne et gestion des accès</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="RECHERCHER..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9 w-48"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {filteredStaff.map((member) => (
                  <div key={member.id} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-[#c1a461]/20 transition-all">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                          {member.callsign && <span className="text-[#c1a461] mr-1">[{member.callsign}]</span>}
                          {member.name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{member.role} • {member.email} {member.matricule && `• ${member.matricule}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1",
                         member.status === 'Actif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                       )}>{member.status}</Badge>
                       <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                         <MoreVertical className="w-5 h-5" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[32px] bg-[#0a0f18] text-white p-8">
              <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#c1a461]" /> Configuration Système
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {[
                  { label: "Chiffrement AES-256", status: "Activé", desc: "Clé rotative tous les 30 jours" },
                  { label: "Authentification 2FA", status: "Requis", desc: "Obligatoire pour Associés" },
                  { label: "Backups Automatiques", status: "OK", desc: "Toutes les 4 heures (Dernier: 11:00)" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="w-1 h-full bg-[#c1a461] rounded-full" />
                    <div className="flex-grow text-left">
                      <div className="flex justify-between items-center">
                         <p className="text-[11px] font-black uppercase text-white leading-tight">{item.label}</p>
                         <Badge className="bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest border-none px-2 py-0.5">{item.status}</Badge>
                      </div>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[32px] bg-white p-8 space-y-6">
              <div className="p-3 bg-blue-50 rounded-2xl w-fit">
                 <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-4 text-left">
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tighter">Information du Cabinet</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Cabinet</span>
                    <span className="text-xs font-bold text-slate-900 uppercase">{settings.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">TVA</span>
                    <span className="text-xs font-bold text-slate-900 uppercase">{settings.vat_number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Retention Audit</span>
                    <span className="text-xs font-bold text-slate-900 uppercase">{settings.audit_retention_days} jours</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-slate-200 text-[9px] font-black uppercase tracking-widest h-10">Modifier les paramètres</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default Admin;
