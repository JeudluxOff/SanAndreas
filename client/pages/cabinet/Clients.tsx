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
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { useLegalRBAC } from '@/pages/cabinet/intranet/LegalIntranetLayout';
import { Client } from '@shared/api';

const Clients = () => {
  const { user } = useAuth();
  const { activeRole } = useLegalRBAC();
  const [clients, setClients] = React.useState(legalStore.getClients());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newClient, setNewClient] = React.useState<Partial<Client>>({
    name: '',
    email: '',
    type: 'Individu'
  });

  const cases = legalStore.getCases();

  const handleCreateClient = () => {
    if (!newClient.name || !user) return;

    const clientToCreate: Client = {
      id: `cli-${Date.now()}`,
      name: newClient.name,
      email: newClient.email,
      type: newClient.type as 'Individu' | 'Entreprise',
      created_at: new Date().toISOString().split('T')[0]
    };

    legalStore.createClient(clientToCreate);
    setClients(legalStore.getClients());
    setShowCreateModal(false);
    setNewClient({ name: '', email: '', type: 'Individu' });

    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Création client',
      target_type: 'Client',
      target_id: clientToCreate.id,
      metadata: { name: clientToCreate.name }
    });
  };

  const handleDeleteClient = (id: string) => {
    if (!user) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      legalStore.deleteClient(id, user.id);
      setClients(legalStore.getClients());
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
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
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2"
            >
              <Plus className="w-4 h-4" /> Nouveau Client
            </Button>
          </div>
        </div>

        {/* Create Client Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Nouveau Client</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Enregistrez une nouvelle entité dans la base de données du cabinet.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-6">
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom complet ou Raison Sociale</Label>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="EX: JOHN DOE..."
                  className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</Label>
                  <Select
                    value={newClient.type}
                    onValueChange={(val) => setNewClient({...newClient, type: val as any})}
                  >
                    <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individu">Individu</SelectItem>
                      <SelectItem value="Entreprise">Entreprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email (Facultatif)</Label>
                  <Input
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    placeholder="CLIENT@EMAIL.SA"
                    className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateClient}
                disabled={!newClient.name}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-black/10"
              >
                Créer la Fiche
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                           {(activeRole === 'Avocat' || activeRole === 'Associé') && (
                             <Button
                               variant="ghost"
                               size="icon"
                               className="text-slate-300 hover:text-red-600"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDeleteClient(item.id);
                               }}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           )}
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
  );
};

export default Clients;
