import { useState, useEffect } from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft,
  Calendar,
  User,
  Shield,
  ExternalLink,
  Trash2,
  FileSpreadsheet
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";

const AuditLogs = () => {
  const { user, hasPermission, logAction } = useAuth();
  const store = useGovernmentStore();
  const [searchTerm, setSearchTerm] = useState("");

  const logs = store.getAuditLogs();

  if (!hasPermission('audit:logs_view')) {
    return <Navigate to="/intranet" replace />;
  }

  const filteredLogs = logs.filter(log => 
    log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    logAction('Export des registres d\'audit');
    // Mock export
    alert("Export des données en cours... (Format CSV)");
  };

  const clearLogs = () => {
    if (confirm("Êtes-vous sûr de vouloir vider les registres d'audit ? Cette action est irréversible.")) {
      localStorage.setItem('sa_gov_audit_logs', '[]');
      setLogs([]);
      logAction('Nettoyage des registres d\'audit');
    }
  };

  return (
    <IntranetLayout>
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/intranet">
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 text-slate-400 hover:text-primary rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Registres d'Audit</h1>
              <p className="text-slate-500 font-medium italic">Historique complet des actions effectuées sur le système gouvernemental.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission('audit:reports_export') && (
              <Button onClick={handleExport} className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Exporter CSV
              </Button>
            )}
            {user?.role === 'gouverneur' && (
              <Button variant="outline" onClick={clearLogs} className="border-red-200 text-red-600 hover:bg-red-50 font-bold flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Vider les logs
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Actions Total</p>
              <h3 className="text-3xl font-black text-slate-900">{logs.length}</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Dernière Action</p>
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {logs[0]?.action || 'Aucune'}
              </h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-emerald-600 text-white">
            <CardContent className="pt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Intégrité Système</p>
              <h3 className="text-lg font-bold">VÉRIFIÉE & SÉCURISÉE</h3>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Filtrer par agent, action, rôle..." 
                className="pl-10 h-10 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Horodatage</th>
                    <th className="px-6 py-4">Agent</th>
                    <th className="px-6 py-4">Service / Rôle</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4 text-right">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{new Date(log.timestamp).toLocaleDateString()}</span>
                          <span className="text-[10px] font-medium text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                            {log.user_name.charAt(0)}
                          </div>
                          <span className="text-sm font-black text-slate-900 uppercase">{log.user_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-widest border-slate-200">
                            {log.service_id}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-500 italic">{log.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-xs font-bold px-2 py-1 rounded",
                          log.action.includes('Tentative') ? "bg-red-50 text-red-700" :
                          log.action.includes('Suppression') ? "bg-red-50 text-red-700" :
                          log.action.includes('Connexion') ? "bg-blue-50 text-blue-700" :
                          log.action.includes('Validation') ? "bg-emerald-50 text-emerald-700" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLogs.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Activity className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-sm">Aucun log trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </IntranetLayout>
  );
};

export default AuditLogs;
