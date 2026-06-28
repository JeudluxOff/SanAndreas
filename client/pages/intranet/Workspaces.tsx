import { IntranetLayout } from "@/components/IntranetLayout";
import { Link } from "react-router-dom";
import { useAuth, ServiceID } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Scale, HeartPulse, Building2, Landmark, MessageSquare, Users, Briefcase, ArrowRight, ShieldAlert, UserCheck, Search, ListFilter as Filter, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GovUserAccess, isGovernmentAdmin, isGovernmentGovernor, getGovernmentAccessibleDivisions } from '@/lib/government-access';
import { GovDivisionId, DIVISION_TO_WORKSPACE_MAP } from '@/lib/government-rbac';

const workspaces = [
  {
    id: 'CABINET' as ServiceID,
    name: "Cabinet du Gouverneur",
    description: "Coordination exécutive et décisions stratégiques de l'État.",
    icon: <Shield className="w-8 h-8" />,
    color: "bg-slate-900",
    borderColor: "border-slate-200",
    members: 12,
    activeTasks: 4
  },
  {
    id: 'SECURITE_PUBLIQUE' as ServiceID,
    name: "Sécurité Publique",
    description: "Gestion des agences LSPD, LSSD et coordination tactique.",
    icon: <ShieldAlert className="w-8 h-8" />,
    color: "bg-blue-900",
    borderColor: "border-blue-200",
    members: 45,
    activeTasks: 12
  },
  {
    id: 'JUSTICE' as ServiceID,
    name: "Département de la Justice",
    description: "Affaires juridiques, parquet général et administration judiciaire.",
    icon: <Scale className="w-8 h-8" />,
    color: "bg-red-900",
    borderColor: "border-red-200",
    members: 18,
    activeTasks: 8
  },
  {
    id: 'SANTE_HUMAINS' as ServiceID,
    name: "Santé & Services Humains",
    description: "Coordination du SAMS et des services de santé publique.",
    icon: <HeartPulse className="w-8 h-8" />,
    color: "bg-emerald-800",
    borderColor: "border-emerald-200",
    members: 24,
    activeTasks: 5
  },
  {
    id: 'SECURITE_INTERIEURE' as ServiceID,
    name: "Sécurité Intérieure",
    description: "Cyber-sécurité, lutte contre le terrorisme et gestion des crises.",
    icon: <Lock className="w-8 h-8" />,
    color: "bg-slate-800",
    borderColor: "border-slate-300",
    members: 15,
    activeTasks: 3
  },
  {
    id: 'TRESOR_COMMERCE' as ServiceID,
    name: "Trésor & Commerce",
    description: "Régulations économiques, budget d'État et commerce international.",
    icon: <Landmark className="w-8 h-8" />,
    color: "bg-amber-800",
    borderColor: "border-amber-200",
    members: 9,
    activeTasks: 6
  },
  {
    id: 'COMMUNICATION' as ServiceID,
    name: "Bureau de Presse",
    description: "Communication officielle, relations médias et transparence.",
    icon: <MessageSquare className="w-8 h-8" />,
    color: "bg-indigo-900",
    borderColor: "border-indigo-200",
    members: 6,
    activeTasks: 2
  },
  {
    id: 'ADMINISTRATION_GENERALE' as ServiceID,
    name: "Administration Générale",
    description: "Support logistique, ressources humaines et services centraux.",
    icon: <Building2 className="w-8 h-8" />,
    color: "bg-slate-700",
    borderColor: "border-slate-200",
    members: 20,
    activeTasks: 9
  }
];

export default function Workspaces() {
  const { user, canAccessService } = useAuth();
  const store = useGovernmentStore();
  const workspacesData = store.getWorkspaces();

  const govAccess: GovUserAccess | null = user ? {
    id: user.id,
    rolesTechniques: (user.govRolesTechniques || ['employee']) as any[],
    divisions: (user.govDivisions || ['administration_generale']) as GovDivisionId[],
    permissions: (user.govPermissions || []) as any[],
    status: user.govStatus || 'actif',
  } : null;

  const accessibleWorkspaceIds = new Set<string>();
  if (isGovernmentAdmin(govAccess) || isGovernmentGovernor(govAccess)) {
    workspaces.forEach(ws => accessibleWorkspaceIds.add(ws.id));
  } else {
    const divisions = getGovernmentAccessibleDivisions(govAccess);
    divisions.forEach(div => {
      const wsId = DIVISION_TO_WORKSPACE_MAP[div];
      if (wsId) accessibleWorkspaceIds.add(wsId);
    });
  }

  const visibleWorkspaces = workspaces.filter(ws => accessibleWorkspaceIds.has(ws.id));

  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Espaces de Travail</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Répertoire des Services Gouvernementaux
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  className="pl-9 h-10 w-64 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                />
             </div>
             <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200">
                <Filter className="w-4 h-4" />
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleWorkspaces.map((workspace) => {
            const hasAccess = canAccessService(workspace.id);
            const dynamicData = workspacesData[workspace.id.toLowerCase()];
            const membersCount = dynamicData?.members || workspace.members;
            const activeTasksCount = dynamicData?.tasks?.filter(t => t.status !== 'completed').length || workspace.activeTasks;

            return (
              <Card key={workspace.id} className={cn(
                "group relative overflow-hidden border-2 transition-all duration-300",
                hasAccess ? "hover:shadow-xl hover:-translate-y-1" : "opacity-75 grayscale cursor-not-allowed",
                workspace.borderColor
              )}>
                <CardHeader className="p-6 relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500",
                    workspace.color
                  )}>
                    {workspace.icon}
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{workspace.name}</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {workspace.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-6 pb-6 relative z-10 flex flex-wrap gap-2">
                   <Badge variant="secondary" className="bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 py-1">
                      <Users className="w-3 h-3 mr-1" /> {membersCount} Membres
                   </Badge>
                   <Badge variant="secondary" className="bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 py-1">
                      <Briefcase className="w-3 h-3 mr-1" /> {activeTasksCount} Tâches
                   </Badge>
                </CardContent>

                <CardFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 relative z-10">
                  {hasAccess ? (
                    <Link to={`/intranet/workspace/${workspace.id.toLowerCase()}`} className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-4 transition-all">
                        Accéder à l'espace <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="w-full py-2.5 px-4 bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest text-center rounded flex items-center justify-center gap-2">
                       <Lock className="w-3 h-3" /> Accès Restreint
                    </div>
                  )}
                </CardFooter>
                
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none transform -rotate-12 scale-150 translate-x-1/2 -translate-y-1/2">
                   {workspace.icon}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Global Stats */}
        <div className="p-8 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-2xl border-l-8 border-secondary mt-12">
           <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none transform -rotate-12 scale-150 translate-x-1/4">
              <Building2 className="w-full h-full" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-4 text-center md:text-left">
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Coordination Inter-Départementale</h2>
                 <p className="text-slate-400 font-medium max-w-xl text-sm leading-relaxed">
                    Le portail intranet centralise les ressources pour les {visibleWorkspaces.length} services de l'État de San Andreas, assurant une collaboration efficace et sécurisée.
                 </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                 {[
                    { label: "Employes actifs", value: store.getEmployeesV2().filter(e => e.status === 'actif').length.toString() },
                    { label: "Dossiers en cours", value: store.getTotalDossiersCount().toString() },
                    { label: "Documents actifs", value: store.getTotalDocumentsCount().toString() }
                 ].map((stat, idx) => (
                    <div key={idx} className="text-center space-y-1">
                       <span className="text-3xl font-black text-secondary tracking-tighter block">{stat.value}</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </IntranetLayout>
  );
}
