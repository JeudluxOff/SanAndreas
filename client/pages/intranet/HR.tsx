import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Search, UserPlus, ChevronLeft, MoveVertical as MoreVertical, Shield, Eye, Archive, Ban, Download, SquareCheck as CheckSquare, Square } from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";
import { governmentStore } from "@/lib/government-store";
import {
  GOV_GRADES,
  GOV_ROLES_TECHNIQUES,
  GOV_ROLE_LABELS,
  GOV_DIVISIONS,
  GOV_DIVISION_LABELS,
  GOV_STATUSES,
  GOV_STATUS_LABELS,
  GOV_STATUS_COLORS,
  GovDivisionId,
  GovRoleTechnique
} from "@/lib/government-rbac";
import { GovUserAccess, isGovernmentAdmin, canAccessHRPage } from "@/lib/government-access";

const HR = () => {
  const { user, logAction } = useAuth();
  const store = useGovernmentStore();
  const navigate = useNavigate();

  const govAccess: GovUserAccess | null = user ? {
    id: user.id,
    rolesTechniques: (user.govRolesTechniques || ['employee']) as any[],
    divisions: (user.govDivisions || ['administration_generale']) as any[],
    permissions: (user.govPermissions || []) as any[],
    status: user.govStatus || 'actif',
  } : null;

  const hasAccess = govAccess && (
    isGovernmentAdmin(govAccess) ||
    canAccessHRPage(govAccess)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    matricule: "",
    functionTitle: "",
    grade: "",
    selectedRoles: [] as string[],
    selectedDivisions: [] as string[],
  });

  const employees = store.getEmployeesV2();

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricule?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = !gradeFilter || emp.grade === gradeFilter;
    const matchesDivision = !divisionFilter || emp.divisions?.includes(divisionFilter);
    const matchesStatus = !statusFilter || emp.status === statusFilter;

    return matchesSearch && matchesGrade && matchesDivision && matchesStatus;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'actif').length;
  const suspendedEmployees = employees.filter(e => e.status === 'suspendu').length;

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter(r => r !== role)
        : [...prev.selectedRoles, role]
    }));
  };

  const toggleDivision = (div: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDivisions: prev.selectedDivisions.includes(div)
        ? prev.selectedDivisions.filter(d => d !== div)
        : [...prev.selectedDivisions, div]
    }));
  };

  const handleCreateEmployee = async () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.matricule ||
      !formData.grade ||
      formData.selectedRoles.length === 0 ||
      formData.selectedDivisions.length === 0
    ) {
      alert("Tous les champs sont requis, et au moins un role et une division doivent etre selectionnes");
      return;
    }

    const newEmployee = {
      id: `emp-${Date.now()}`,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      matricule: formData.matricule,
      grade: formData.grade,
      functionTitle: formData.functionTitle || formData.grade,
      rolesTechniques: formData.selectedRoles,
      divisions: formData.selectedDivisions,
      permissions: [],
      status: 'actif',
      joinedAt: new Date().toISOString().slice(0, 10),
      gradeHistory: [],
      hrHistory: []
    };

    const success = governmentStore.createEmployeeV2(newEmployee);
    if (!success) {
      alert("Nom d'utilisateur ou matricule deja utilise");
      return;
    }

    // Register auth credentials
    const regUsers = JSON.parse(localStorage.getItem('sa_gov_registered_users') || '{}');
    regUsers[formData.username] = {
      user: {
        id: formData.username,
        username: formData.username,
        name: `${formData.firstName} ${formData.lastName}`,
        role: 'admin',
        service_id: 'CABINET',
        service_name: 'Gouvernement',
        grade: formData.grade,
        permissions: [],
        status: 'available',
      },
      password: formData.password
    };
    localStorage.setItem('sa_gov_registered_users', JSON.stringify(regUsers));

    logAction('Création employe', { username: formData.username, matricule: formData.matricule });

    setIsCreateDialogOpen(false);
    setFormData({
      username: "", password: "", firstName: "", lastName: "",
      matricule: "", functionTitle: "", grade: "", selectedRoles: [], selectedDivisions: [],
    });
  };

  const handleSuspend = (empId: string, empName: string) => {
    const success = governmentStore.suspendEmployee(empId, user?.name || 'Admin');
    if (!success) {
      alert("Impossible de suspendre ce compte (dernier administrateur actif)");
    } else {
      logAction('Suspension employe', { employeeId: empId, name: empName });
    }
  };

  const handleReactivate = (empId: string, empName: string) => {
    governmentStore.updateEmployeeV2(empId, { status: 'actif' });
    governmentStore.addHRHistoryEntry(empId, {
      id: `hr-${Date.now()}`,
      date: new Date().toISOString(),
      author: user?.name || 'Admin',
      action: 'Reactivation',
      oldValue: 'suspendu',
      newValue: 'actif'
    });
    logAction('Reactivation employe', { employeeId: empId, name: empName });
  };

  const handleArchive = (empId: string, empName: string) => {
    const success = governmentStore.archiveEmployeeV2(empId, user?.name || 'Admin');
    if (!success) {
      alert("Impossible d'archiver ce compte (dernier administrateur actif)");
    } else {
      logAction('Archivage employe', { employeeId: empId, name: empName });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Matricule", "Nom", "Prenom", "Grade", "Roles Techniques", "Divisions", "Statut"],
      ...filteredEmployees.map(emp => [
        emp.matricule,
        emp.lastName,
        emp.firstName,
        emp.grade,
        (emp.rolesTechniques || []).map(r => GOV_ROLE_LABELS[r as GovRoleTechnique] || r).join(' | '),
        (emp.divisions || []).map(d => GOV_DIVISION_LABELS[d as GovDivisionId] || d).join(' | '),
        GOV_STATUS_LABELS[emp.status as any] || emp.status
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `employes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  if (!hasAccess) {
    return (
      <IntranetLayout>
        <div className="flex items-center justify-center h-screen">
          <Card className="border-none shadow-md p-8 text-center">
            <div className="mb-4">
              <Shield className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">Acces Refuse</h2>
            <p className="text-slate-500 font-medium mb-6">Vous n'avez pas la permission d'acceder a cette page.</p>
            <Link to="/intranet">
              <Button className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold">
                Retour a l'intranet
              </Button>
            </Link>
          </Card>
        </div>
      </IntranetLayout>
    );
  }

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
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Ressources Humaines</h1>
              <p className="text-slate-500 font-medium italic">Gestion des employes gouvernementaux</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isGovernmentAdmin(govAccess!) && (
              <Button
                className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold gap-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <UserPlus className="w-4 h-4" /> Creer un Employe
              </Button>
            )}
            <Button
              variant="outline"
              className="border-slate-300 font-bold gap-2"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" /> Exporter
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Employes</p>
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-4xl font-black text-slate-900">{totalEmployees}</h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Actifs</p>
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-4xl font-black text-slate-900">{activeEmployees}</h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Suspendus</p>
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-4xl font-black text-slate-900">{suspendedEmployees}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10 h-10 border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="h-10 border-slate-200 font-bold">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les grades</SelectItem>
                  {GOV_GRADES.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                <SelectTrigger className="h-10 border-slate-200 font-bold">
                  <SelectValue placeholder="Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes divisions</SelectItem>
                  {Object.values(GOV_DIVISIONS).map(div => (
                    <SelectItem key={div} value={div}>
                      {GOV_DIVISION_LABELS[div] || div}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 border-slate-200 font-bold">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous statuts</SelectItem>
                  {GOV_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {GOV_STATUS_LABELS[status] || status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Registre des Employes</CardTitle>
              <Badge variant="outline" className="bg-white border-slate-200 font-bold">
                {filteredEmployees.length} Resultats
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-bold text-sm">Aucun employe enregistre</p>
                {isGovernmentAdmin(govAccess!) && (
                  <p className="text-xs mt-1">Cliquez sur "Creer un Employe" pour ajouter le premier compte</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Employe</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Roles Techniques</th>
                      <th className="px-6 py-4">Divisions</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-all group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-slate-100 shadow-sm">
                              <AvatarImage src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.id}`} />
                              <AvatarFallback className="bg-primary text-white">
                                {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900 uppercase">
                                {emp.firstName} {emp.lastName}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {emp.matricule}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-700">{emp.grade}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(emp.rolesTechniques || []).map(r => (
                              <Badge key={r} variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200 bg-white">
                                {GOV_ROLE_LABELS[r as GovRoleTechnique] || r}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            {(emp.divisions || []).slice(0, 2).map((d, i) => (
                              <span key={d} className={cn("text-xs font-bold", i === 0 ? "text-slate-800" : "text-slate-400")}>
                                {i === 0 ? '' : '↳ '}{GOV_DIVISION_LABELS[d as GovDivisionId] || d}
                              </span>
                            ))}
                            {(emp.divisions || []).length > 2 && (
                              <span className="text-[9px] text-slate-400">+{emp.divisions!.length - 2} autres</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={cn(
                              "font-bold text-white text-[9px]",
                              GOV_STATUS_COLORS[emp.status as any] || "bg-slate-600"
                            )}
                          >
                            {GOV_STATUS_LABELS[emp.status as any] || emp.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/intranet/hr/${emp.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-primary"
                                title="Voir le profil"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            {isGovernmentAdmin(govAccess!) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 font-bold text-xs uppercase tracking-tighter">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => navigate(`/intranet/hr/${emp.id}`)}
                                  >
                                    <Eye className="w-4 h-4" /> Editer
                                  </DropdownMenuItem>
                                  {emp.status === 'actif' && (
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 cursor-pointer text-amber-600"
                                      onClick={() => handleSuspend(emp.id, `${emp.firstName} ${emp.lastName}`)}
                                    >
                                      <Ban className="w-4 h-4" /> Suspendre
                                    </DropdownMenuItem>
                                  )}
                                  {emp.status === 'suspendu' && (
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 cursor-pointer text-emerald-600"
                                      onClick={() => handleReactivate(emp.id, `${emp.firstName} ${emp.lastName}`)}
                                    >
                                      <Shield className="w-4 h-4" /> Reactiver
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer text-red-600"
                                    onClick={() => handleArchive(emp.id, `${emp.firstName} ${emp.lastName}`)}
                                  >
                                    <Archive className="w-4 h-4" /> Archiver
                                  </DropdownMenuItem>
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Employee Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="uppercase font-black tracking-tight">Creer un Nouvel Employe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Prenom</Label>
                <Input
                  placeholder="Prenom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Nom</Label>
                <Input
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Matricule</Label>
                <Input
                  placeholder="Matricule"
                  value={formData.matricule}
                  onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Grade</Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                  <SelectTrigger className="border-slate-200 font-bold">
                    <SelectValue placeholder="Selectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOV_GRADES.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Titre de Fonction</Label>
              <Input
                placeholder="Ex: Agent de terrain LSPD"
                value={formData.functionTitle}
                onChange={(e) => setFormData({ ...formData, functionTitle: e.target.value })}
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                Roles Techniques <span className="text-slate-400 normal-case">(plusieurs possibles)</span>
              </Label>
              <div className="grid grid-cols-2 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
                {GOV_ROLES_TECHNIQUES.map(role => {
                  const isAdmin = role === 'admin';
                  const disabled = isAdmin && !isGovernmentAdmin(govAccess!);
                  return (
                    <div key={role} className={cn("flex items-center gap-2", disabled && "opacity-40")}>
                      <Checkbox
                        id={`role-${role}`}
                        checked={formData.selectedRoles.includes(role)}
                        onCheckedChange={() => !disabled && toggleRole(role)}
                        disabled={disabled}
                      />
                      <label htmlFor={`role-${role}`} className="text-xs font-bold cursor-pointer select-none">
                        {GOV_ROLE_LABELS[role] || role}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                Divisions <span className="text-slate-400 normal-case">(plusieurs possibles, la 1ere est principale)</span>
              </Label>
              <div className="grid grid-cols-2 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50 max-h-48 overflow-y-auto">
                {Object.values(GOV_DIVISIONS).map(div => (
                  <div key={div} className="flex items-center gap-2">
                    <Checkbox
                      id={`div-${div}`}
                      checked={formData.selectedDivisions.includes(div)}
                      onCheckedChange={() => toggleDivision(div)}
                    />
                    <label htmlFor={`div-${div}`} className="text-xs font-bold cursor-pointer select-none leading-tight">
                      {GOV_DIVISION_LABELS[div as GovDivisionId] || div}
                      {formData.selectedDivisions[0] === div && (
                        <span className="ml-1 text-[9px] text-emerald-600 font-black">(PRINCIPALE)</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Nom d'Utilisateur</Label>
              <Input
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Mot de Passe</Label>
              <Input
                placeholder="Mot de passe"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="font-bold uppercase text-[10px]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateEmployee}
              className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold uppercase text-[10px]"
            >
              Creer l'Employe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IntranetLayout>
  );
};

export default HR;
