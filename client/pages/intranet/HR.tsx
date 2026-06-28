import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Search, UserPlus, ChevronLeft, MoveVertical as MoreVertical, Shield, Eye, Archive, Ban, Download } from "lucide-react";
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
  GovDivisionId
} from "@/lib/government-rbac";
import { GovUserAccess, isGovernmentAdmin, canAccessHRPage } from "@/lib/government-access";

const HR = () => {
  const { user } = useAuth();
  const store = useGovernmentStore();

  const govAccess: GovUserAccess | null = user ? {
    id: user.id,
    roleTechnique: (user.govRoleTechnique || 'employee') as any,
    primaryDivision: (user.govPrimaryDivision || 'administration_generale') as any,
    secondaryDivisions: (user.govSecondaryDivisions || []) as any[],
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
    grade: "",
    roleTechnique: "",
    primaryDivision: "",
  });

  const employees = store.getEmployeesV2();

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricule?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = !gradeFilter || emp.grade === gradeFilter;
    const matchesDivision = !divisionFilter || emp.govPrimaryDivision === divisionFilter;
    const matchesStatus = !statusFilter || emp.govStatus === statusFilter;

    return matchesSearch && matchesGrade && matchesDivision && matchesStatus;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.govStatus === 'actif').length;
  const suspendedEmployees = employees.filter(e => e.govStatus === 'suspendu').length;

  const handleCreateEmployee = async () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.matricule ||
      !formData.grade ||
      !formData.roleTechnique ||
      !formData.primaryDivision
    ) {
      alert("Tous les champs sont requis");
      return;
    }

    const newEmployee = {
      username: formData.username,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      matricule: formData.matricule,
      grade: formData.grade,
      govRoleTechnique: formData.roleTechnique,
      govPrimaryDivision: formData.primaryDivision as GovDivisionId,
      govStatus: 'actif' as const,
    };

    governmentStore.createEmployee(newEmployee);
    setIsCreateDialogOpen(false);
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      matricule: "",
      grade: "",
      roleTechnique: "",
      primaryDivision: "",
    });
  };

  const handleExport = () => {
    const csvContent = [
      ["Matricule", "Nom", "Prénom", "Grade", "Rôle Technique", "Division", "Statut"],
      ...filteredEmployees.map(emp => [
        emp.matricule,
        emp.lastName,
        emp.firstName,
        emp.grade,
        GOV_ROLE_LABELS[emp.govRoleTechnique] || emp.govRoleTechnique,
        GOV_DIVISION_LABELS[emp.govPrimaryDivision] || emp.govPrimaryDivision,
        GOV_STATUS_LABELS[emp.govStatus] || emp.govStatus
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
            <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">Accès Refusé</h2>
            <p className="text-slate-500 font-medium mb-6">Vous n'avez pas la permission d'accéder à cette page.</p>
            <Link to="/intranet">
              <Button className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold">
                Retour à l'intranet
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
              <p className="text-slate-500 font-medium italic">Gestion des employés gouvernementaux</p>
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
                  {GOV_DIVISIONS.map(div => (
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
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Employe</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Role Technique</th>
                    <th className="px-6 py-4">Division</th>
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
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.id}`} />
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
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200 bg-white">
                          {GOV_ROLE_LABELS[emp.govRoleTechnique] || emp.govRoleTechnique}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-700">
                          {GOV_DIVISION_LABELS[emp.govPrimaryDivision] || emp.govPrimaryDivision}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={cn(
                            "font-bold text-white text-[9px]",
                            GOV_STATUS_COLORS[emp.govStatus] || "bg-slate-600"
                          )}
                        >
                          {GOV_STATUS_LABELS[emp.govStatus] || emp.govStatus}
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
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Eye className="w-4 h-4" /> Editer
                                </DropdownMenuItem>
                                {emp.govStatus === 'actif' && (
                                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-amber-600">
                                    <Ban className="w-4 h-4" /> Suspendre
                                  </DropdownMenuItem>
                                )}
                                {emp.govStatus === 'suspendu' && (
                                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-emerald-600">
                                    <Shield className="w-4 h-4" /> Reactiver
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600">
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
          </CardContent>
        </Card>
      </div>

      {/* Create Employee Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Role Technique</Label>
                <Select value={formData.roleTechnique} onValueChange={(value) => setFormData({ ...formData, roleTechnique: value })}>
                  <SelectTrigger className="border-slate-200 font-bold">
                    <SelectValue placeholder="Selectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOV_ROLES_TECHNIQUES.map(role => (
                      <SelectItem key={role} value={role} disabled={role === 'admin' && !isGovernmentAdmin(govAccess!)}>
                        {GOV_ROLE_LABELS[role] || role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Division</Label>
                <Select value={formData.primaryDivision} onValueChange={(value) => setFormData({ ...formData, primaryDivision: value })}>
                  <SelectTrigger className="border-slate-200 font-bold">
                    <SelectValue placeholder="Selectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOV_DIVISIONS.map(div => (
                      <SelectItem key={div} value={div}>
                        {GOV_DIVISION_LABELS[div] || div}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
