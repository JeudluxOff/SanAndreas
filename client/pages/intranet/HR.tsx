import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Trash2,
  UserCog,
  History,
  Activity,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Printer,
  Download
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth, Role } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";
import { governmentStore } from "@/lib/government-store";

const HR = () => {
  const { user, hasPermission, logAction, updateUser } = useAuth();
  const store = useGovernmentStore();
  const canManageUsers = hasPermission('admin:users_manage');
  const canManageRoles = hasPermission('admin:roles_manage');
  const [searchTerm, setSearchTerm] = useState("");

  // Role Management State
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [newRole, setNewRole] = useState<Role | "">("");

  const employees = store.getEmployees();

  const statusLabels: Record<string, string> = {
    available: 'En service',
    busy: 'Occupé',
    away: 'Absent',
    offline: 'Hors service'
  };

  const handleAdminAction = (action: string, target?: string) => {
    logAction(`${action}${target ? ' sur ' + target : ''}`);
  };

  const openRoleDialog = (emp: any) => {
    setSelectedEmployee(emp);
    // Find matching role key or default to current
    setNewRole(emp.role as Role);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (selectedEmployee && newRole) {
      // Update in store
      governmentStore.updateEmployee(selectedEmployee.name, { role: newRole });

      // If we are updating ourselves, update AuthContext too
      if (selectedEmployee.name === user?.name) {
        updateUser({ role: newRole as Role });
      }

      logAction(`Changement de rôle pour ${selectedEmployee.name}`, { role: newRole });
      setIsRoleDialogOpen(false);
    }
  };

  // Sync current user status in list
  const displayEmployees = employees.map(emp => {
    if (emp.name === user?.name) {
      return { ...emp, status: statusLabels[user.status] || emp.status };
    }
    return emp;
  });

  const filteredEmployees = displayEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <IntranetLayout>
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/intranet">
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 text-slate-400 hover:text-primary rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Annuaire & Ressources Humaines</h1>
              <p className="text-slate-500 font-medium italic">Gérez les effectifs gouvernementaux et accédez à l'annuaire complet.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canManageUsers && (
              <Button className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold gap-2" onClick={() => handleAdminAction('Ouverture formulaire ajout employé')}>
                <UserPlus className="w-4 h-4" /> Ajouter un Employé
              </Button>
            )}
            <Button variant="outline" className="border-slate-300 font-bold gap-2" onClick={() => handleAdminAction('Export annuaire')}>
              <Printer className="w-4 h-4" /> Imprimer Annuaire
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-md bg-slate-900 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Effectifs</p>
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-4xl font-black">{employees.length}</h3>
              <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest italic">+2 Arrivées ce mois</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">En Service (Live)</p>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-slate-900">
                  {displayEmployees.filter(e => e.status === "En service").length}
                </h3>
                <Badge className="bg-emerald-500 text-white animate-pulse">LIVE</Badge>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest italic">Taux de présence: 85%</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nouveaux Dossiers RH</p>
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-slate-900">4</h3>
                <span className="text-xs font-bold text-slate-400">En attente</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full mt-2">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher par nom, service, rôle..." 
                  className="pl-10 h-10 border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Button variant="outline" className="w-full h-10 font-bold border-slate-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer par Service
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-grow h-10 font-bold border-slate-200">
                  Rôles
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee List */}
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Registre des Employés Officiels</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white border-slate-200 font-bold">{filteredEmployees.length} Résultats</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Agent / Identité</th>
                    <th className="px-6 py-4">Service / Rôle</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Arrivée</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} />
                            <AvatarFallback className="bg-primary text-white">{emp.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 uppercase group-hover:text-primary transition-colors">{emp.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emp.grade}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-widest border-slate-200 bg-white">
                            {emp.service}
                          </Badge>
                          <span className="text-[11px] font-bold text-slate-700 italic">{emp.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                            <Mail className="w-3 h-3 text-primary" /> {emp.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 uppercase">{emp.joinDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            emp.status === "En service" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                            emp.status === "Occupé" ? "bg-red-500" :
                            emp.status === "Absent" ? "bg-amber-500" : "bg-slate-300"
                          )} />
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            emp.status === "En service" ? "text-emerald-700" :
                            emp.status === "Occupé" ? "text-red-700" :
                            emp.status === "Absent" ? "text-amber-700" : "text-slate-500"
                          )}>{emp.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" title="Historique">
                            <History className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" title="Fiche complète">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          {(canManageUsers || canManageRoles) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 font-bold text-xs uppercase tracking-tighter">
                                <DropdownMenuLabel>Gestion Agent</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {canManageRoles && (
                                  <>
                                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => openRoleDialog(emp)}>
                                      <UserCog className="w-4 h-4" /> Modifier Rôle
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleAdminAction('Audit permissions', emp.name)}>
                                      <ShieldCheck className="w-4 h-4" /> Permissions RBAC
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleAdminAction('Consultation logs', emp.name)}>
                                  <Activity className="w-4 h-4" /> Logs Activité
                                </DropdownMenuItem>
                                {canManageUsers && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={() => handleAdminAction('Révocation accès', emp.name)}>
                                      <Trash2 className="w-4 h-4" /> Retirer Accès
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* RBAC Info / Role Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-[#1B365D] text-white py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Matrice des Rôles (RBAC)
              </CardTitle>
              {canManageRoles && (
                <Button variant="ghost" size="sm" className="bg-white/10 text-white hover:bg-white/20 font-bold text-[9px]" onClick={() => handleAdminAction('Gestion globale des rôles')}>Gérer Rôles</Button>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  { name: "Gouverneur", count: 1, level: "Admin Total", color: "bg-red-600" },
                  { name: "Vice-Gouverneur", count: 1, level: "Admin Partiel", color: "bg-red-400" },
                  { name: "Secrétaire d'État", count: 7, level: "Gestion Service", color: "bg-blue-600" },
                  { name: "Chef de Service", count: 12, level: "Gestion Équipe", color: "bg-emerald-600" },
                  { name: "Employé", count: 85, level: "Utilisateur Standard", color: "bg-slate-600" }
                ].map((role, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50 group hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1 h-8 rounded-full", role.color)} />
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{role.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{role.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-bold border-slate-200">{role.count} Agents</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-primary">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-md bg-gradient-to-br from-primary to-[#254a7c] text-white overflow-hidden relative group">
              <Activity className="absolute bottom-[-20px] right-[-20px] w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Audit & Contrôle Interne
                </CardTitle>
                <CardDescription className="text-white/60 text-xs font-medium">Suivez toutes les actions sensibles effectuées sur le système.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3">
                  {[
                    { user: "Arthur Vance", action: "Nouveau Rôle : Secrétaire Travail", time: "10:30" },
                    { user: "Jackson Teller", action: "Accès Dossier Judiciaire #JD-41", time: "09:15" },
                    { user: "System", action: "Mise à jour permissions groupe 'Justice'", time: "Hier" }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/10 backdrop-blur-md rounded border border-white/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase">{log.user}</span>
                        <span className="text-[11px] font-medium text-white/80 italic">{log.action}</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/40">{log.time}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 font-bold uppercase text-[10px] tracking-widest h-10">
                  Consulter les Logs complets
                </Button>
              </CardContent>
            </Card>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-md flex items-center gap-6">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex-shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 uppercase">Sécurité du Système</h4>
                <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                  Le système 2FA est actif pour tous les comptes de niveau Cabinet et Secrétariat.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-emerald-500 text-white text-[9px] font-black">ACTIF</Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dernier scan: Aujourd'hui 06:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">Modifier le rôle de l'agent</DialogTitle>
            <DialogDescription className="italic font-medium text-xs">
              Mettez à jour les responsabilités et les accès de l'agent <strong>{selectedEmployee?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Nouveau Rôle Officiel</Label>
              <Select value={newRole} onValueChange={(value) => setNewRole(value as Role)}>
                <SelectTrigger className="w-full font-bold">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" className="font-bold">Administrateur Global</SelectItem>
                  <SelectItem value="gouverneur" className="font-bold">Gouverneur</SelectItem>
                  <SelectItem value="vice_gouverneur" className="font-bold">Vice-Gouverneur</SelectItem>
                  <SelectItem value="secretaire_etat_general" className="font-bold">Secrétaire d'État Général</SelectItem>
                  <SelectItem value="secretaire_justice" className="font-bold">Secrétaire à la Justice</SelectItem>
                  <SelectItem value="secretaire_securite" className="font-bold">Secrétaire à la Sécurité</SelectItem>
                  <SelectItem value="secretaire_sante" className="font-bold">Secrétaire à la Santé</SelectItem>
                  <SelectItem value="secretaire_securite_interieure" className="font-bold">Secrétaire à la Sécurité Intérieure</SelectItem>
                  <SelectItem value="secretaire_tresor_commerce" className="font-bold">Secrétaire au Trésor</SelectItem>
                  <SelectItem value="press_secretary" className="font-bold">Press Secretary</SelectItem>
                  <SelectItem value="avocat" className="font-bold">Avocat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
              <div className="flex gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-[10px] font-bold text-amber-800 leading-relaxed italic">
                  Attention: La modification du rôle entraîne un changement immédiat des permissions RBAC.
                  L'agent devra peut-être se reconnecter pour voir certains changements.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="font-bold uppercase text-[10px]">Annuler</Button>
            <Button onClick={handleUpdateRole} className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold uppercase text-[10px]">Appliquer le Rôle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IntranetLayout>
  );
};

export default HR;
