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
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useLegalRBAC } from './intranet/LegalIntranetLayout';
import { Link } from 'react-router-dom';
import { legalStore } from '@/lib/legal-store';
import { Invoice } from '@shared/api';
import { useAuth } from '@/contexts/AuthContext';

const Billing = () => {
  const { user } = useAuth();
  const { isAssocié, canBill } = useLegalRBAC();
  const [invoices, setInvoices] = React.useState(legalStore.getInvoices());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = React.useState<string | null>(null);
  const [deleteReason, setDeleteReason] = React.useState('');
  const [newInvoice, setNewInvoice] = React.useState({
    case_id: '',
    amount: '',
    description: ''
  });

  // Real-time animation for numbers (simulated)
  const [displayTotal, setDisplayTotal] = React.useState(0);

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'Payé').reduce((acc, inv) => acc + inv.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'Payé').reduce((acc, inv) => acc + inv.amount, 0);

  React.useEffect(() => {
    let start = 0;
    const end = totalInvoiced;
    if (start === end) return;

    let timer = setInterval(() => {
      start += Math.ceil((end - start) / 10);
      if (start >= end) {
        setDisplayTotal(end);
        clearInterval(timer);
      } else {
        setDisplayTotal(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [totalInvoiced]);

  const cases = legalStore.getCases();

  if (!isAssocié && !canBill) {
    return (
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
    );
  }

  const handleCreateInvoice = () => {
    if (!newInvoice.case_id || !newInvoice.amount || !user) return;
    const caseObj = legalStore.getCase(newInvoice.case_id);
    if (!caseObj) return;

    const inv: Invoice = {
      id: `INV-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      case_id: newInvoice.case_id,
      client_id: caseObj.client_id,
      amount: Number(newInvoice.amount),
      currency: 'SA$',
      status: 'Envoyé',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      items: [{ description: newInvoice.description || 'Honoraires juridiques', amount: Number(newInvoice.amount) }]
    };

    legalStore.createInvoice(inv);

    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Émission de facture',
      target_type: 'Invoice',
      target_id: inv.id,
      metadata: { amount: inv.amount, case_id: inv.case_id }
    });

    setInvoices(legalStore.getInvoices());
    setShowCreateModal(false);
    setNewInvoice({ case_id: '', amount: '', description: '' });
  };

  const handleMarkAsPaid = (id: string) => {
    if (!user) return;
    const allInvoices = legalStore.getInvoices();
    const inv = allInvoices.find(i => i.id === id);
    if (inv) {
      inv.status = 'Payé';
      legalStore.updateInvoice(inv);

      legalStore.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: user.id,
        user_name: user.name,
        action: 'Facture payée',
        target_type: 'Invoice',
        target_id: id,
        metadata: { amount: inv.amount }
      });

      setInvoices([...legalStore.getInvoices()]);
    }
  };

  const handleDeleteInvoice = () => {
    if (!user || !invoiceToDelete || !deleteReason.trim()) return;

    legalStore.deleteInvoice(invoiceToDelete, user.id, deleteReason.trim());

    // Custom log since deleteInvoice in store uses 'System' as default user_name
    legalStore.logAction({
      id: `LOG-${Date.now()}-DEL`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Suppression Facture (avec motif)',
      target_type: 'Invoice',
      target_id: invoiceToDelete,
      metadata: { reason: deleteReason.trim() }
    });

    setInvoices(legalStore.getInvoices());
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
    setDeleteReason('');
  };

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
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 gap-2"
            >
              <Plus className="w-4 h-4" /> Nouvelle Facture
            </Button>
          </div>
        </div>

        {/* Create Invoice Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-xl bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Émission de Facture</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Générez une demande d'honoraires pour un dossier spécifique.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier Assigné</Label>
                <Select value={newInvoice.case_id} onValueChange={(val) => setNewInvoice({...newInvoice, case_id: val})}>
                  <SelectTrigger className="bg-slate-50 border-none rounded-xl h-12">
                    <SelectValue placeholder="Choisir un dossier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.id} - {c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant (SA$)</Label>
                  <Input
                    type="number"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                    placeholder="0.00"
                    className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Libellé</Label>
                  <Input
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                    placeholder="Honoraires..."
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
                onClick={handleCreateInvoice}
                disabled={!newInvoice.case_id || !newInvoice.amount}
                className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl"
              >
                Générer la Facture
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-[#0a0f18] text-white border-none shadow-2xl px-8 py-10 flex flex-col justify-between rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-24 h-24 rotate-12" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Chiffre d'Affaires Global</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black tracking-tighter leading-none">{displayTotal.toLocaleString()}</p>
                <p className="text-xl font-black text-[#c1a461] uppercase tracking-widest">SA$</p>
              </div>
            </div>
            <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c1a461] animate-pulse" />
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest text-left">Mise à jour en temps réel</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20" />
            </div>
          </Card>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white border-none shadow-md px-8 py-6 flex items-center gap-6 rounded-[32px]">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-slate-900 leading-none">{totalPending.toLocaleString()} SA$</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">En attente de paiement</p>
              </div>
            </Card>
            <Card className="bg-white border-none shadow-md px-8 py-6 flex items-center gap-6 rounded-[32px]">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-slate-900 leading-none">{totalPaid.toLocaleString()} SA$</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Montant recouvré</p>
              </div>
            </Card>
            <Card className="bg-white border-none shadow-md px-8 py-6 flex items-center gap-6 rounded-[32px] md:col-span-2">
               <div className="flex-grow flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance de Recouvrement</p>
                    <p className="text-sm font-black text-slate-900 uppercase">{Math.round((totalPaid / (totalInvoiced || 1)) * 100)}% de réussite</p>
                  </div>
                  <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#c1a461] transition-all duration-1000" style={{ width: `${(totalPaid / (totalInvoiced || 1)) * 100}%` }} />
                  </div>
               </div>
            </Card>
          </div>
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
                      <td className="px-8 py-6 text-right">
                        <div className="flex gap-2 justify-end">
                          {item.status !== 'Payé' && (
                            <Button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMarkAsPaid(item.id); }}
                              variant="ghost"
                              size="icon"
                              className="text-slate-300 hover:text-emerald-600"
                            >
                              <FileCheck className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setInvoiceToDelete(item.id);
                              setShowDeleteModal(true);
                            }}
                            variant="ghost"
                            size="icon"
                            className="text-slate-300 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md bg-white rounded-[32px] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Supprimer la Facture</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Cette action est irréversible. Un motif de suppression est requis.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-6 text-left">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motif de suppression</Label>
              <Input
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="EX: ERREUR DE MONTANT, ANNULATION CLIENT..."
                className="bg-slate-50 border-none rounded-xl h-12 text-sm font-bold uppercase"
              />
            </div>

            <DialogFooter className="flex-col gap-3">
              <Button
                onClick={handleDeleteInvoice}
                disabled={!deleteReason.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest h-12 rounded-xl"
              >
                Confirmer la Suppression
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default Billing;
