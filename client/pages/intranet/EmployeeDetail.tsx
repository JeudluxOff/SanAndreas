import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Save,
  User,
  Shield,
  Building2,
  Key,
  Eye,
  History,
  ShieldCheck,
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";
import { useAuth } from "@/contexts/AuthContext";
import { governmentStore } from "@/lib/government-store";
import {
  GOV_DIVISIONS,
  GOV_DIVISION_LABELS,
  GOV_GRADES,
  GOV_ROLES_TECHNIQUES,
  GOV_ROLE_LABELS,
  GOV_PERMISSIONS,
  GOV_PERMISSION_LABELS,
  GOV_STATUSES,
  GOV_STATUS_LABELS,
  GOV_STATUS_COLORS,
  GovDivisionId,
  GovRoleTechnique,
} from "@/lib/government-rbac";
import {
  isGovernmentAdmin,
  getGeneratedGovernmentAccess,
  GovUserAccess,
} from "@/lib/government-access";

export default function EmployeeDetail() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { user, logAction } = useAuth();
  const store = useGovernmentStore();

  const employee = employeeId ? governmentStore.getEmployeeById(employeeId) : null;

  const govAccess: GovUserAccess | null = user ? {
    id: user.id,
    rolesTechniques: (user.govRolesTechniques || ['employee']) as any[],
    divisions: (user.govDivisions || ['administration_generale']) as any[],
    permissions: (user.govPermissions || []) as any[],
    status: user.govStatus || 'actif',
  } : null;

  const canManage = govAccess && isGovernmentAdmin(govAccess);

  const [formData, setFormData] = useState({
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    matricule: employee?.matricule || "",
    status: employee?.status || "actif",
    joinedAt: employee?.joinedAt || "",
    notes: employee?.notes || "",
  });

  const [gradeData, setGradeData] = useState({
    grade: employee?.grade || "",
    functionTitle: employee?.functionTitle || "",
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    employee?.rolesTechniques || ['employee']
  );

  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(
    employee?.divisions || ['administration_generale']
  );

  const [permissionsData, setPermissionsData] = useState<string[]>(
    employee?.permissions || []
  );

  if (!employee) {
    return (
      <IntranetLayout>
        <div className="space-y-8 pb-20">
          <div className="flex items-center gap-4">
            <Link to="/intranet/hr">
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 text-slate-400 hover:text-primary rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Employe Non Trouve</h1>
              <p className="text-slate-500 font-medium italic">L'employe que vous recherchez n'existe pas.</p>
            </div>
          </div>
          <Link to="/intranet/hr">
            <Button className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold">Retour a l'Annuaire</Button>
          </Link>
        </div>
      </IntranetLayout>
    );
  }

  const handleSaveProfil = () => {
    governmentStore.updateEmployeeV2(employeeId!, formData);
    logAction('Mise a jour profil employe', { employeeId, fields: Object.keys(formData) });
  };

  const handleSaveGrade = () => {
    const oldGrade = employee.grade;
    governmentStore.updateEmployeeV2(employeeId!, gradeData);
    if (gradeData.grade !== oldGrade) {
      governmentStore.addHRHistoryEntry(employeeId!, {
        id: `hr-${Date.now()}`,
        date: new Date().toISOString(),
        author: user?.name || 'Admin',
        action: 'Changement de grade',
        oldValue: oldGrade,
        newValue: gradeData.grade,
      });
    }
    logAction('Mise a jour grade employe', { employeeId });
  };

  const handleSaveDivisions = () => {
    const oldDivisions = employee.divisions || [];
    governmentStore.updateEmployeeV2(employeeId!, {
      rolesTechniques: selectedRoles,
      divisions: selectedDivisions,
    });
    if (JSON.stringify(oldDivisions) !== JSON.stringify(selectedDivisions)) {
      governmentStore.addHRHistoryEntry(employeeId!, {
        id: `hr-${Date.now()}`,
        date: new Date().toISOString(),
        author: user?.name || 'Admin',
        action: 'Mise a jour divisions',
        oldValue: oldDivisions.join(', '),
        newValue: selectedDivisions.join(', '),
      });
    }
    logAction('Mise a jour divisions employe', { employeeId });
  };

  const handleSavePermissions = () => {
    governmentStore.updateEmployeeV2(employeeId!, { permissions: permissionsData });
    logAction('Mise a jour permissions employe', { employeeId });
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleDivision = (div: string) => {
    setSelectedDivisions(prev =>
      prev.includes(div) ? prev.filter(d => d !== div) : [...prev, div]
    );
  };

  const empAsAccess: GovUserAccess = {
    id: employee.id,
    rolesTechniques: employee.rolesTechniques as any[],
    divisions: employee.divisions as GovDivisionId[],
    permissions: employee.permissions as any[],
    status: employee.status,
  };
  const generatedAccess = getGeneratedGovernmentAccess(empAsAccess);
  const avatarUrl = employee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}-${employee.lastName}`;

  return (
    <IntranetLayout>
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/intranet/hr">
            <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 text-slate-400 hover:text-primary rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Avatar className="h-16 w-16 border-2 border-slate-200 shadow-md">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary text-white font-bold">
              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
              {employee.firstName} {employee.lastName}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-bold text-slate-500 uppercase">{employee.matricule}</span>
              <Badge className={`${GOV_STATUS_COLORS[employee.status as keyof typeof GOV_STATUS_COLORS] || "bg-slate-400"} text-white text-xs font-black uppercase`}>
                {GOV_STATUS_LABELS[employee.status as keyof typeof GOV_STATUS_LABELS]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profil" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="profil" className="text-xs font-bold uppercase"><User className="w-4 h-4 mr-1" /> Profil</TabsTrigger>
            <TabsTrigger value="grade" className="text-xs font-bold uppercase"><Shield className="w-4 h-4 mr-1" /> Grade</TabsTrigger>
            <TabsTrigger value="divisions" className="text-xs font-bold uppercase"><Building2 className="w-4 h-4 mr-1" /> Divisions</TabsTrigger>
            <TabsTrigger value="permissions" className="text-xs font-bold uppercase"><Key className="w-4 h-4 mr-1" /> Permissions</TabsTrigger>
            <TabsTrigger value="acces" className="text-xs font-bold uppercase"><Eye className="w-4 h-4 mr-1" /> Acces</TabsTrigger>
            <TabsTrigger value="histoire" className="text-xs font-bold uppercase"><History className="w-4 h-4 mr-1" /> Histoire</TabsTrigger>
          </TabsList>

          {/* Tab 1: Profil */}
          <TabsContent value="profil" className="space-y-6 mt-6">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" /> Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Prenom</Label>
                    <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} disabled={!canManage} className="font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Nom</Label>
                    <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} disabled={!canManage} className="font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Matricule</Label>
                    <Input value={formData.matricule} disabled className="font-bold bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Statut</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })} disabled={!canManage}>
                      <SelectTrigger className="font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {GOV_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>{GOV_STATUS_LABELS[status]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Email</Label>
                    <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!canManage} className="font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Telephone</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!canManage} className="font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Date d'Arrivee</Label>
                  <Input value={formData.joinedAt} onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })} disabled={!canManage} className="font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Notes</Label>
                  <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} disabled={!canManage} className="font-bold min-h-24" />
                </div>
                {canManage && (
                  <Button onClick={handleSaveProfil} className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold gap-2 w-full">
                    <Save className="w-4 h-4" /> Sauvegarder Profil
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Grade & Fonction */}
          <TabsContent value="grade" className="space-y-6 mt-6">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Grade & Fonction
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Grade</Label>
                  <Select value={gradeData.grade} onValueChange={(value) => setGradeData({ ...gradeData, grade: value })} disabled={!canManage}>
                    <SelectTrigger className="font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GOV_GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Titre Fonction</Label>
                  <Input value={gradeData.functionTitle} onChange={(e) => setGradeData({ ...gradeData, functionTitle: e.target.value })} disabled={!canManage} className="font-bold" />
                </div>
                {employee.gradeHistory && employee.gradeHistory.length > 0 && (
                  <div className="space-y-3">
                    <Separator className="my-4" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-600">Historique des Grades</h4>
                    <ScrollArea className="h-40 rounded-lg border border-slate-200 p-4">
                      <div className="space-y-2">
                        {employee.gradeHistory.map((entry: any, idx: number) => (
                          <div key={idx} className="text-xs p-2 bg-slate-50 rounded border border-slate-100">
                            <div className="font-bold text-slate-900">{entry.oldGrade} → {entry.newGrade}</div>
                            <div className="text-slate-500 text-[10px] italic">{entry.date} — par {entry.author}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                {canManage && (
                  <Button onClick={handleSaveGrade} className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold gap-2 w-full">
                    <Save className="w-4 h-4" /> Sauvegarder Grade
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Divisions & Roles */}
          <TabsContent value="divisions" className="space-y-6 mt-6">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Divisions & Roles Techniques
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-600">
                    Roles Techniques <span className="text-slate-400 normal-case font-medium">(plusieurs possibles)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                    {GOV_ROLES_TECHNIQUES.map(role => {
                      const isAdminRole = role === 'admin';
                      const disabled = (isAdminRole && !isGovernmentAdmin(govAccess!)) || !canManage;
                      return (
                        <div key={role} className={`flex items-center gap-2 ${disabled ? 'opacity-40' : ''}`}>
                          <Checkbox
                            id={`edit-role-${role}`}
                            checked={selectedRoles.includes(role)}
                            onCheckedChange={() => !disabled && toggleRole(role)}
                            disabled={disabled}
                          />
                          <label htmlFor={`edit-role-${role}`} className="text-xs font-bold cursor-pointer select-none">
                            {GOV_ROLE_LABELS[role as GovRoleTechnique] || role}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-600">
                    Divisions <span className="text-slate-400 normal-case font-medium">(la 1ere = principale)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50 max-h-64 overflow-y-auto">
                    {Object.values(GOV_DIVISIONS).map(div => (
                      <div key={div} className="flex items-center gap-2">
                        <Checkbox
                          id={`edit-div-${div}`}
                          checked={selectedDivisions.includes(div)}
                          onCheckedChange={() => canManage && toggleDivision(div)}
                          disabled={!canManage}
                        />
                        <label htmlFor={`edit-div-${div}`} className="text-xs font-bold cursor-pointer select-none leading-tight">
                          {GOV_DIVISION_LABELS[div as GovDivisionId] || div}
                          {selectedDivisions[0] === div && (
                            <span className="ml-1 text-[9px] text-emerald-600 font-black">(PRINCIPALE)</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {canManage && (
                  <Button onClick={handleSaveDivisions} className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold gap-2 w-full">
                    <Save className="w-4 h-4" /> Sauvegarder Divisions & Roles
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Permissions */}
          <TabsContent value="permissions" className="space-y-6 mt-6">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4" /> Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(GOV_PERMISSIONS).map(([key, value]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`perm-${value}`}
                        checked={permissionsData.includes(value as any)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPermissionsData([...permissionsData, value as any]);
                          } else {
                            setPermissionsData(permissionsData.filter((p) => p !== value));
                          }
                        }}
                        disabled={!canManage}
                      />
                      <Label htmlFor={`perm-${value}`} className="text-xs font-medium text-slate-700 cursor-pointer">
                        {GOV_PERMISSION_LABELS[value as any]}
                      </Label>
                    </div>
                  ))}
                </div>
                {canManage && (
                  <Button onClick={handleSavePermissions} className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold gap-2 w-full">
                    <Save className="w-4 h-4" /> Sauvegarder Permissions
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Acces Generes */}
          <TabsContent value="acces" className="space-y-6 mt-6">
            {isGovernmentAdmin(empAsAccess) ? (
              <Card className="border-none shadow-md bg-gradient-to-r from-emerald-50 to-emerald-100">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center justify-center gap-4">
                    <div className="p-4 bg-emerald-500 rounded-full text-white">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-emerald-900 uppercase">ACCES TOTAL ADMINISTRATEUR</h3>
                      <p className="text-emerald-700 font-bold italic text-sm">Tous les droits et permissions sont accordes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-none shadow-md">
                  <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-900 flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Acces Accordes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-600 mb-2">Pages</h4>
                        <div className="space-y-1">
                          {generatedAccess.pages.map((page) => (
                            <Badge key={page} className="block w-full justify-start bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                              {page}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-600 mb-2">Canaux</h4>
                        <ScrollArea className="h-40">
                          <div className="space-y-1 pr-4">
                            {generatedAccess.channels.map((ch) => (
                              <Badge key={ch} className="block w-full justify-start bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                                {ch}
                              </Badge>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                  <CardHeader className="bg-red-50 border-b border-red-100">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-red-900 flex items-center gap-2">
                      <Eye className="w-4 h-4 opacity-50" /> Acces Refuses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-600 mb-2">Divisions</h4>
                        {generatedAccess.deniedDivisions.length > 0 ? (
                          <div className="space-y-1">
                            {generatedAccess.deniedDivisions.map((div) => (
                              <Badge key={div} className="block w-full justify-start bg-red-100 text-red-900 font-bold text-[10px]">
                                {div}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">Aucune restriction</p>
                        )}
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-600 mb-2">Pages</h4>
                        {generatedAccess.deniedPages.length > 0 ? (
                          <div className="space-y-1">
                            {generatedAccess.deniedPages.map((page) => (
                              <Badge key={page} className="block w-full justify-start bg-red-100 text-red-900 font-bold text-[10px]">
                                {page}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">Aucune restriction</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Tab 6: Historique RH */}
          <TabsContent value="histoire" className="space-y-6 mt-6">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4" /> Historique Ressources Humaines
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {employee.hrHistory && employee.hrHistory.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                      {employee.hrHistory.map((entry: any, idx: number) => (
                        <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-grow">
                              <h4 className="text-xs font-black uppercase text-slate-900 tracking-tight">{entry.action}</h4>
                              <div className="mt-2 space-y-1 text-[10px] font-bold text-slate-600">
                                <p><span className="text-slate-400">Par:</span> {entry.author}</p>
                                <p><span className="text-slate-400">Date:</span> {entry.date || entry.timestamp}</p>
                                {entry.oldValue && entry.newValue && (
                                  <p className="italic">{entry.oldValue} → {entry.newValue}</p>
                                )}
                              </div>
                            </div>
                            <Badge className="bg-slate-300 text-slate-900 text-[9px] font-black uppercase flex-shrink-0">RH</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-slate-500 font-medium italic">Aucun historique RH disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </IntranetLayout>
  );
}
