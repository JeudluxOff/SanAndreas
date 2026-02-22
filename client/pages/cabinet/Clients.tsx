import React from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Lock,
  Download,
  Mail,
  Phone,
  Briefcase,
  UserCheck,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import LegalIntranetLayout from './intranet/LegalIntranetLayout';

const Clients = () => {
  return (
    <LegalIntranetLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des Clients</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Base de données sécurisée • RGPD • 124 clients actifs
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Download className="w-4 h-4" /> Exporter CRM
            </Button>
            <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Plus className="w-4 h-4" /> Nouveau Client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: "Particuliers", value: 84, icon: <Users className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Entreprises", value: 32, icon: <Briefcase className="w-5 h-5" />, color: "text-[#c1a461]", bg: "bg-[#c1a461]/5" },
            { label: "VIP / Gouvernement", value: 8, icon: <Lock className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" },
            { label: "Clients Premium", value: 42, icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" }
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

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Annuaire des Clients</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Accès rapide aux coordonnées et dossiers</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                 <input type="text" placeholder="RECHERCHER..." className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client / Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossiers Actifs</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dernier Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: "Martin Madrazo", mail: "m.madrazo@cartel.sa", type: "VIP", cases: 2, status: "Actif", contact: "Hier" },
                  { name: "Union Depository", mail: "legal@uniondep.sa", type: "Entreprise", cases: 5, status: "Premium", contact: "2 jours" },
                  { name: "Thornton Duggan", mail: "t.duggan@ls-estate.sa", type: "Particulier", cases: 1, status: "Actif", contact: "5 jours" },
                  { name: "Gouvernement SA", mail: "justice@gov.sa", type: "Public", cases: 8, status: "Premium", contact: "Ce matin" },
                  { name: "Mairie de Los Santos", mail: "contact@ls-mayor.sa", type: "Public", cases: 3, status: "Actif", contact: "1 semaine" }
                ].map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-[#c1a461]/20 transition-all">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} />
                        </Avatar>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.mail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.type}</Badge>
                    </td>
                    <td className="px-8 py-6 text-xs font-black text-slate-900 uppercase">
                      {item.cases} Dossiers
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1", 
                        item.status === 'Premium' ? 'bg-[#c1a461] text-white' : 'bg-slate-100 text-slate-600'
                      )}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                      {item.contact}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex gap-2">
                         <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                           <Mail className="w-4 h-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                           <Phone className="w-4 h-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                           <MoreVertical className="w-5 h-5" />
                         </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </LegalIntranetLayout>
  );
};

export default Clients;
