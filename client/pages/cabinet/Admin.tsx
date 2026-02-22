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
import { cn } from '@/lib/utils';
import LegalIntranetLayout from './intranet/LegalIntranetLayout';

const Admin = () => {
  return (
    <LegalIntranetLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Administration du Cabinet</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Configuration Système • Gestion RH • Permissions RBAC
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Download className="w-4 h-4" /> Rapport Système
            </Button>
            <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <UserPlus className="w-4 h-4" /> Nouvel Utilisateur
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: "Membres Cabinet", value: 12, icon: <Users className="w-5 h-5" />, color: "text-[#c1a461]", bg: "bg-[#c1a461]/5" },
            { label: "Canaux Actifs", value: 8, icon: <Activity className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Logs de Sécurité", value: "842", icon: <ShieldCheck className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Stockage Vault", value: "84%", icon: <Server className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" }
          ].map((stat, idx) => (
            <Card key={idx} className="bg-white border-none shadow-md px-6 py-5 flex items-center gap-5 rounded-2xl">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Gestion des Équipes</CardTitle>
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">12 Membres</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {[
                  { name: "Julian Harrington", role: "Associé", access: "Total", status: "Actif" },
                  { name: "Victoria Cole", role: "Associée", access: "Total", status: "Actif" },
                  { name: "Marcus Vane", role: "Avocat Senior", access: "Élevé", status: "Actif" },
                  { name: "Elena Rossi", role: "Avocate", access: "Standard", status: "Actif" },
                  { name: "Thomas Miller", role: "Comptable", access: "Finance", status: "Actif" }
                ].map((user, idx) => (
                  <div key={idx} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-[#c1a461]/20 transition-all">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      </Avatar>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{user.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <Badge className="bg-slate-100 text-slate-600 text-[8px] font-black uppercase tracking-widest px-3 py-1">Accès: {user.access}</Badge>
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
                    <div className="flex-grow">
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
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tighter">Infrastructure Cloud</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-tight">
                  Serveurs localisés à San Andreas. Bande passante illimitée. Monitoring actif 24/7.
                </p>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                 <span className="text-slate-400">Latence: 12ms</span>
                 <span className="text-emerald-600">Disponibilité: 99.9%</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </LegalIntranetLayout>
  );
};

export default Admin;
