import { useState } from "react";
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  ArrowUpDown,
  Lock
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth, ServiceID } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";

const Dossiers = () => {
  const { user, hasPermission, logAction } = useAuth();
  const store = useGovernmentStore();
  const [searchTerm, setSearchTerm] = useState("");

  const mockDossiers = store.getGlobalDossiers();

  const filteredDossiers = mockDossiers.filter(dossier => {
    const matchesSearch = (dossier.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dossier.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // RBAC Visibility Rules
    const isGovernor = user?.role === 'gouverneur';
    const isOwner = dossier.service_id === user?.service_id;
    const inACL = user?.id && dossier.acl.includes(user.id);
    
    return matchesSearch && (isGovernor || isOwner || inACL);
  });

  return (
    <IntranetLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/intranet">
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 text-slate-400 hover:text-primary rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Gestion des Dossiers</h1>
              <p className="text-slate-500 font-medium italic">Administration et suivi des dossiers gouvernementaux en cours.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission('dossiers:create') && (
              <Button className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Dossier
              </Button>
            )}
            <Button variant="outline" className="border-slate-300 font-bold">
              Rapports
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher un dossier par titre ou ID..." 
                  className="pl-10 h-10 border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-10 font-bold border-slate-200">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dossier List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDossiers.map((dossier) => (
            <Card key={dossier.id} className="border-none shadow-md hover:shadow-lg transition-all group overflow-hidden">
              <div className="flex items-center p-6 gap-6">
                <div className={cn(
                  "h-16 w-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform",
                  dossier.priority === 'Critique' ? "bg-red-50 text-red-600" :
                  dossier.priority === 'Haute' ? "bg-amber-50 text-amber-600" :
                  "bg-blue-50 text-blue-600"
                )}>
                  <FolderOpen className="w-8 h-8" />
                </div>
                
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-primary uppercase tracking-widest">{dossier.id}</span>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-slate-200">
                      {dossier.service_name}
                    </Badge>
                    {dossier.confidential && (
                      <Badge className="bg-red-600 text-white text-[9px] font-black uppercase flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Confidentiel
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                    {dossier.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Mis à jour: {dossier.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> Membres: 3
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                  <Badge className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3",
                    dossier.status === 'En cours' ? 'bg-blue-600' :
                    dossier.status === 'À valider' ? 'bg-amber-500' :
                    dossier.status === 'Publié' ? 'bg-emerald-600' :
                    'bg-slate-600'
                  )}>
                    {dossier.status}
                  </Badge>
                  <Link to={`/intranet/dossiers/${dossier.id}`}>
                    <Button variant="ghost" className="font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 gap-2">
                      Consulter <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredDossiers.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl shadow-inner border border-dashed border-slate-200">
              <AlertTriangle className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-sm">Aucun dossier accessible</p>
              <p className="text-xs">Vous ne disposez peut-être pas des habilitations nécessaires pour consulter les dossiers de ce secteur.</p>
            </div>
          )}
        </div>
      </div>
    </IntranetLayout>
  );
};

export default Dossiers;
