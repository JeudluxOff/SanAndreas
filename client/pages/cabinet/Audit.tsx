import React from 'react';
import { 
  Lock, 
  Search, 
  ShieldAlert, 
  Activity, 
  MoreVertical, 
  ChevronRight, 
  Download,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLegalRBAC } from '@/pages/cabinet/intranet/LegalIntranetLayout';
import { Link } from 'react-router-dom';
import { legalStore } from '@/lib/legal-store';

const Audit = () => {
  const { isAssocié, canAudit } = useLegalRBAC();
  const logs = legalStore.getAuditLogs();
  const sealedAccessLogs = logs.filter(l => l.action === 'Accès Dossier Scellé');

  if (!isAssocié && !canAudit) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-slate-400 p-10">
        <Lock className="w-16 h-16 mb-6 opacity-20" />
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Accès Auditeur Requis</h2>
        <p className="text-xs font-bold uppercase tracking-widest mt-2 max-w-md text-center">
          Les journaux d'audit et les logs de sécurité sont accessibles uniquement aux Associés et aux Auditeurs externes habilités.
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
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Audit & Sécurité Système</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Journalisation AES-256 • Traçabilité totale des accès • Surveillance en temps réel
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <ShieldAlert className="w-4 h-4" /> Analyse Vulnérabilités
            </Button>
            <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Download className="w-4 h-4" /> Exporter Logs (PDF/JSON)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="bg-emerald-600 text-white border-none shadow-xl px-8 py-6 rounded-[32px]">
            <div className="flex justify-between items-start mb-4">
              <ShieldCheck className="w-8 h-8 opacity-40" />
              <Badge className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest border-none">NOMINAL</Badge>
            </div>
            <p className="text-2xl font-black leading-none text-left">Status OK</p>
            <p className="text-[9px] font-bold text-emerald-100 uppercase tracking-widest mt-1 text-left">Tous les services sont actifs</p>
          </Card>
          <Card className="bg-white border-none shadow-md px-8 py-6 flex flex-col justify-between rounded-[32px]">
            <div className="flex justify-between items-start mb-4">
              <Activity className="w-8 h-8 text-[#c1a461] opacity-40" />
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">HISTORIQUE</Badge>
            </div>
            <div className="text-left">
               <p className="text-2xl font-black text-slate-900 leading-none">{logs.length}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Actions Logguées</p>
            </div>
          </Card>
          <Card className="bg-white border-none shadow-md px-8 py-6 flex flex-col justify-between rounded-[32px]">
            <div className="flex justify-between items-start mb-4">
              <Eye className="w-8 h-8 text-blue-600 opacity-40" />
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">CRITIQUE</Badge>
            </div>
            <div className="text-left">
               <p className="text-2xl font-black text-slate-900 leading-none">{sealedAccessLogs.length}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accès Dossiers Scellés</p>
            </div>
          </Card>
          <Card className="bg-slate-900 text-white border-none shadow-xl px-8 py-6 rounded-[32px]">
            <div className="flex justify-between items-start mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 opacity-40" />
              <Badge className="bg-amber-600 text-white text-[8px] font-black uppercase tracking-widest border-none">ALERTES: 0</Badge>
            </div>
            <p className="text-2xl font-black leading-none text-amber-500 text-left">Sécurité</p>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1 text-left">Intégrité des données : 100%</p>
          </Card>
        </div>

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Journal d'Audit du Système</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Traçabilité complète des actions utilisateurs (Immutable)</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                 <input type="text" placeholder="RECHERCHER UN LOG..." className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9 w-64" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur / Rôle</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action / Cible</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type Cible</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horodatage</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.length > 0 ? logs.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.user_name}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">{item.user_id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.action}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {item.target_id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">
                          {item.target_type}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <Button variant="ghost" className="text-[#c1a461] text-[9px] font-black uppercase tracking-widest hover:bg-[#c1a461]/5">Détails <ChevronRight className="w-3 h-3 ml-1" /></Button>
                      </td>
                    </tr>
                  )) : (
                     <tr>
                       <td colSpan={5} className="p-20 text-center text-slate-400 uppercase font-black text-[10px]">Aucun log d'audit enregistré</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Audit;
