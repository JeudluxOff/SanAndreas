import React from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Lock,
  Download,
  FileCheck,
  TrendingUp,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import LegalIntranetLayout, { useLegalRBAC } from './intranet/LegalIntranetLayout';
import { Link } from 'react-router-dom';
import { legalStore } from '@/lib/legal-store';
import { Invoice } from '@shared/api';

const Billing = () => {
  const { isAssocié, canBill } = useLegalRBAC();
  const invoices = legalStore.getInvoices();
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!isAssocié && !canBill) {
    return (
      <LegalIntranetLayout>
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-slate-400 p-10">
          <CreditCard className="w-16 h-16 mb-6 opacity-20" />
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Accès Facturation Restreint</h2>
          <p className="text-xs font-bold uppercase tracking-widest mt-2 max-w-md text-center">
            La gestion des honoraires et de la facturation est réservée aux Associés et au pôle Comptabilité.
          </p>
          <Link to="/cabinet/intranet">
            <Button className="mt-8 bg-[#0a0f18] text-white uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl">
              Retour au Tableau de Bord
            </Button>
          </Link>
        </div>
      </LegalIntranetLayout>
    );
  }

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'Payé').reduce((acc, inv) => acc + inv.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'Payé').reduce((acc, inv) => acc + inv.amount, 0);

  const filteredInvoices = invoices.filter(inv => {
    const client = legalStore.getClient(inv.client_id);
    const caseObj = legalStore.getCase(inv.case_id);
    return (
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseObj?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <LegalIntranetLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion de Facturation</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Honoraires • Provisions • Factures • {totalInvoiced.toLocaleString()} SA$ au total
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Download className="w-4 h-4" /> Rapport Financier
            </Button>
            <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2">
              <Plus className="w-4 h-4" /> Nouvelle Facture
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white border-none shadow-md px-8 py-6 flex items-center gap-6 rounded-[32px]">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{totalInvoiced.toLocaleString()} SA$</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Honoraires Facturés</p>
            </div>
          </Card>
          <Card className="bg-white border-none shadow-md px-8 py-6 flex items-center gap-6 rounded-[32px]">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{totalPending.toLocaleString()} SA$</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">En attente de paiement</p>
            </div>
          </Card>
          <Card className="bg-white border-none shadow-md px-8 py-6 flex items-center gap-6 rounded-[32px]">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{totalPaid.toLocaleString()} SA$</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Montant recouvré</p>
            </div>
          </Card>
        </div>

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Factures Récentes</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Suivi des honoraires par dossier</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="RECHERCHER..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-slate-200 border rounded-lg pl-9 text-[9px] font-bold uppercase tracking-widest h-9" 
                 />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Facture #</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier / Client</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Émission</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((item, idx) => {
                  const client = legalStore.getClient(item.client_id);
                  const caseObj = legalStore.getCase(item.case_id);
                  return (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.id}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{caseObj?.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{client?.name} • Réf: {item.case_id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900 tracking-tighter">{item.amount.toLocaleString()} {item.currency}</p>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1", 
                          item.status === 'Payé' ? 'bg-emerald-600 text-white' : 
                          item.status === 'Envoyé' ? 'bg-blue-600 text-white' : 
                          item.status === 'En retard' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                        )}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                            <Download className="w-4 h-4" />
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

export default Billing;
