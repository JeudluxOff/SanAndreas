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
import { useLegalRBAC } from '@/pages/cabinet/intranet/LegalIntranetLayout';
import { Link } from 'react-router-dom';
import { legalStore } from '@/lib/legal-store';

const Admin = () => {
  const { isAssocié, canAudit } = useLegalRBAC();
  const logs = legalStore.getAuditLogs();
  const staff = legalStore.getStaff();
  const settings = legalStore.getSettings();

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAssocié && !canAudit) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-slate-400 p-10">
        <Lock className="w-16 h-16 mb-6 opacity-20" />
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Accès Refusé</h2>
        <p className="text-xs font-bold uppercase tracking-widest mt-2 max-w-md text-center">
          Cette section est strictement réservée à l'Administration et aux Auditeurs du cabinet.
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
            { label: "Membres Cabinet", value: staff.length, icon: <Users className="w-5 h-5" />, color: "text-[#c1a461]", bg: "bg-[#c1a461]/5" },
            { label: "Audit Logs", value: logs.length, icon: <ShieldCheck className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Dossiers Scellés", value: legalStore.getCases().filter(c => c.status === 'Scellé').length, icon: <Lock className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Stockage Vault", value: "84%", icon: <Server className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" }
          ].map((stat, idx) => (
            <Card key={idx} className="bg-white border-none shadow-md px-6 py-5 flex items-center gap-5 rounded-2xl">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none text-left">{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-left">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
              <div className="text-left">
                <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Gestion des Équipes</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Annuaire interne et gestion des accès</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="RECHERCHER..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9 w-48"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {filteredStaff.map((member) => (
                  <div key={member.id} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-[#c1a461]/20 transition-all">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{member.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{member.role} • {member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1",
                         member.status === 'Actif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                       )}>{member.status}</Badge>
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
                    <div className="flex-grow text-left">
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
              <div className="space-y-4 text-left">
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tighter">Information du Cabinet</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Cabinet</span>
                    <span className="text-xs font-bold text-slate-900 uppercase">{settings.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">TVA</span>
                    <span className="text-xs font-bold text-slate-900 uppercase">{settings.vat_number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Retention Audit</span>
                    <span className="text-xs font-bold text-slate-900 uppercase">{settings.audit_retention_days} jours</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-slate-200 text-[9px] font-black uppercase tracking-widest h-10">Modifier les paramètres</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default Admin;
