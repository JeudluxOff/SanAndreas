import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  History, 
  UserCheck, 
  AlertTriangle, 
  FileCheck, 
  Search, 
  Filter, 
  ChevronRight, 
  Database, 
  Key,
  ShieldAlert,
  Terminal,
  Clock,
  Landmark,
  UserX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sidebar, Header } from './Dashboard';

const Audit = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeRole="Associé" />
      
      <main className="flex-grow pl-64">
        <Header />
        
        <div className="p-10 space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Centre de Sécurité & Audit</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Surveillance en temps réel et logs déontologiques</p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" className="border-2 border-red-200 text-red-600 font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-xl hover:bg-red-50">
                <ShieldAlert className="w-4 h-4 mr-2" /> Rapport d'Incident
              </Button>
              <Button className="bg-[#0a0f18] text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl">
                <FileCheck className="w-4 h-4 mr-2" /> Exporter Registre
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Security Overview */}
            <Card className="border-none shadow-xl rounded-[32px] bg-white p-8 space-y-8">
               <div className="space-y-6">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit shadow-inner">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Statut Intégrité</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1 italic flex items-center gap-2 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Systèmes Nominaux
                    </p>
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-50">
                  {[
                    { label: "Accès Dossiers Scellés", value: "Strict", status: "Secure" },
                    { label: "Chiffrement Vault", value: "AES-256", status: "Active" },
                    { label: "2FA Enforcement", value: "94%", status: "Mandatory" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-slate-900">{item.value}</span>
                    </div>
                  ))}
               </div>
            </Card>

            {/* Alert Center */}
            <Card className="border-none shadow-xl rounded-[32px] bg-[#0a0f18] text-white p-8 lg:col-span-2 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32 pointer-events-none" />
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 h-full relative z-10">
                  <div className="space-y-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" /> Centre d'Alertes Sécurité
                    </CardTitle>
                    <p className="text-2xl font-black uppercase tracking-tighter max-w-md">
                      0 Tentatives d'intrusion détectées sur les dernières 24h.
                    </p>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest px-8 h-14 rounded-2xl">
                    Lancer Audit Manuel
                  </Button>
               </div>
            </Card>
          </div>

          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#c1a461]" /> Journal d'Audit Système
              </CardTitle>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input placeholder="RECHERCHER UTILISATEUR, IP, ACTION..." className="w-72 h-10 bg-slate-50 border-none rounded-lg pl-10 text-[10px] font-bold uppercase tracking-widest focus:ring-1 ring-[#c1a461]/20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-4">Utilisateur / Rôle</th>
                    <th className="px-8 py-4">Action / Cible</th>
                    <th className="px-8 py-4">Niveau Sécurité</th>
                    <th className="px-8 py-4">Date & Heure</th>
                    <th className="px-8 py-4 text-right">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { user: "Victoria Cole", role: "Associé", action: "Accès Dossier Scellé", target: "CASE-2024-102", level: "Critical", time: "10:42:15" },
                    { user: "Marcus Vane", role: "Avocat", action: "Upload Preuve Vault", target: "CASE-2024-882", level: "High", time: "09:15:30" },
                    { user: "Secrétariat", role: "Secrétaire", role: "Secrétaire", action: "Modification Planning", target: "Audiences J. Miller", level: "Normal", time: "08:30:12" },
                    { user: "Julian Harrington", role: "Associé", action: "Audit Conflit Intérêts", target: "Client: UD Corp", level: "High", time: "Hier, 17:00" },
                    { user: "Compte Auditeur", role: "Auditeur", action: "Export Logs Mensuel", target: "Registre Audit", level: "Critical", time: "22 Mai, 23:59" }
                  ].map((log, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                            {log.user.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-900 leading-none">{log.user}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{log.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[10px] font-black uppercase text-slate-600 leading-none">{log.action}</p>
                        <p className="text-[8px] font-bold text-[#c1a461] uppercase tracking-widest mt-1.5">{log.target}</p>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={cn("text-[8px] font-black uppercase tracking-widest", 
                          log.level === 'Critical' ? 'bg-red-600 text-white' : 
                          log.level === 'High' ? 'bg-[#1B365D] text-white' : 'bg-slate-100 text-slate-600'
                        )}>
                          {log.level}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{log.time}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary transition-all"><Eye className="w-4 h-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-4">
                   <Clock className="w-3.5 h-3.5" /> Dernier backup réalisé il y a 4h • Hash: 882-MM-SA-PORTAL-AUDIT
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Audit;
