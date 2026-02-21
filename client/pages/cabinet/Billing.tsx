import React from 'react';
import { 
  CreditCard, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  FileCheck,
  MoreVertical,
  TrendingUp,
  Landmark,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sidebar, Header } from './Dashboard';

const Billing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeRole="Associé" />
      
      <main className="flex-grow pl-64">
        <Header />
        
        <div className="p-10 space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion Financière & Honoraires</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Comptabilité analytique Harrington & Cole</p>
            </div>
            
            <Button className="bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl shadow-xl shadow-[#c1a461]/10">
              <Plus className="w-4 h-4 mr-2" /> Créer une Facture
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl rounded-[32px] bg-[#0a0f18] text-white p-8">
               <div className="space-y-8">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-white/5 rounded-2xl text-[#c1a461]">
                        <TrendingUp className="w-6 h-6" />
                     </div>
                     <Badge className="bg-[#c1a461] text-white font-black uppercase text-[8px] tracking-widest">+12.4%</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Honoraires Totaux (Mois)</p>
                    <p className="text-4xl font-black text-white tracking-tighter mt-2">142,500 SA$</p>
                  </div>
               </div>
            </Card>

            <Card className="border-none shadow-xl rounded-[32px] bg-white p-8">
               <div className="space-y-8">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                        <Clock className="w-6 h-6" />
                     </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Impayés / En Retard</p>
                    <p className="text-4xl font-black text-red-600 tracking-tighter mt-2">12,400 SA$</p>
                  </div>
               </div>
            </Card>

            <Card className="border-none shadow-xl rounded-[32px] bg-white p-8">
               <div className="space-y-8">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <FileCheck className="w-6 h-6" />
                     </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recouvrement Réalisé</p>
                    <p className="text-4xl font-black text-emerald-600 tracking-tighter mt-2">84,000 SA$</p>
                  </div>
               </div>
            </Card>
          </div>

          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#c1a461]" /> Historique des Factures
              </CardTitle>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input placeholder="NUMÉRO OU CLIENT..." className="w-64 h-10 bg-slate-50 border-none rounded-lg pl-9 text-[10px] font-bold uppercase tracking-widest focus:ring-1 ring-[#c1a461]/20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-4">N° Facture</th>
                    <th className="px-8 py-4">Client</th>
                    <th className="px-8 py-4">Dossier</th>
                    <th className="px-8 py-4">Montant</th>
                    <th className="px-8 py-4">Statut</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: "INV-8821", client: "M. Madrazo", case: "SA vs. Madrazo", amount: "45,000 SA$", status: "Payé" },
                    { id: "INV-8822", client: "Fleeca Bank", case: "Legacy vs. Fleeca", amount: "12,400 SA$", status: "Partiel" },
                    { id: "INV-8823", client: "UD Corp", case: "Union Depository", amount: "85,000 SA$", status: "Impayé" }
                  ].map((inv, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50 transition-all cursor-pointer">
                      <td className="px-8 py-6 text-[11px] font-black uppercase text-[#c1a461]">{inv.id}</td>
                      <td className="px-8 py-6 text-[10px] font-black uppercase text-slate-900">{inv.client}</td>
                      <td className="px-8 py-6 text-[10px] font-bold uppercase text-slate-400 tracking-tight">{inv.case}</td>
                      <td className="px-8 py-6 text-[11px] font-black text-slate-900">{inv.amount}</td>
                      <td className="px-8 py-6">
                        <Badge className={cn("text-[9px] font-black uppercase tracking-widest", 
                          inv.status === 'Payé' ? 'bg-emerald-100 text-emerald-700' : 
                          inv.status === 'Partiel' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        )}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary"><Download className="w-4 h-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Billing;
