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
import { legalStore } from '@/lib/legal-store';

const Clients = () => {
  const [clients, setClients] = React.useState(legalStore.getClients());
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const cases = legalStore.getCases();

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <LegalIntranetLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1 text-left">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des Clients</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Base de données sécurisée • RGPD • {clients.length} clients actifs
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
            { label: "Individus", value: clients.filter(c => c.type === 'Individu').length, icon: <Users className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Entreprises", value: clients.filter(c => c.type === 'Entreprise').length, icon: <Briefcase className="w-5 h-5" />, color: "text-[#c1a461]", bg: "bg-[#c1a461]/5" },
            { label: "Total Base", value: clients.length, icon: <Lock className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" },
            { label: "Croissance", value: "+12%", icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" }
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

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Annuaire des Clients</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Accès rapide aux coordonnées et dossiers</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="RECHERCHER UN CLIENT..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9 w-64" 
                 />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client / Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossiers liés</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Création</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClients.map((item, idx) => {
                  const clientCases = cases.filter(c => c.client_id === item.id);
                  return (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-[#c1a461]/20 transition-all">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} />
                            <AvatarFallback>{item.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.email || 'Pas d\'email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.type}</Badge>
                      </td>
                      <td className="px-8 py-6 text-xs font-black text-slate-900 uppercase">
                        {clientCases.length} Dossiers
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex gap-2 justify-end">
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
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </LegalIntranetLayout>
  );
};

export default Clients;
