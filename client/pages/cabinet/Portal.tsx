import React from 'react';
import {
  Scale,
  Lock,
  FileText,
  CreditCard,
  MessageSquare,
  Calendar,
  ArrowRight,
  Download,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Landmark,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { legalStore } from '@/lib/legal-store';

const Portal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dossier');

  // Get all cases and documents for this client
  const allCases = legalStore.getCases();
  const clientCases = allCases.filter(c => c.client_id === user?.client_id);
  const activeCases = clientCases.filter(c => c.status !== 'Clos' && c.status !== 'Archivé');

  // Get documents for active cases
  const allDocuments = legalStore.getDocuments();
  const caseDocuments = allDocuments.filter(d =>
    activeCases.some(c => c.id === d.case_id) && d.status !== 'Archivé'
  );

  // Get invoices for this client
  const allInvoices = legalStore.getInvoices();
  const clientInvoices = allInvoices.filter(inv => inv.client_id === user?.client_id);
  const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = clientInvoices.filter(inv => inv.status === 'Payé').reduce((sum, inv) => sum + inv.amount, 0);

  // Get staff for contact info
  const staff = legalStore.getStaff();
  const assignedStaff = activeCases.length > 0
    ? staff.find(s => s.id === activeCases[0].lead_id)
    : staff[0];

  return (
    <div className="min-h-screen bg-[#0a0f18] flex flex-col font-sans">
      {/* Client Portal Header */}
      <header className="h-24 border-b border-white/5 bg-[#0a0f18]/80 backdrop-blur-xl sticky top-0 z-50 px-10 flex items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <Link to="/cabinet">
            <Button variant="ghost" className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-[#c1a461] hover:bg-white/5 gap-2 px-0 group">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="hidden md:inline">Quitter le Portail</span>
            </Button>
          </Link>

          <div className="h-6 w-px bg-white/5" />

          <Link to="/cabinet" className="flex items-center gap-3">
            <div className="p-2 bg-[#c1a461] rounded shadow-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xs font-black tracking-[0.2em] uppercase text-white leading-none">Noxwood <span className="text-[#c1a461]">&</span> Partner</h1>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Portail Client Sécurisé</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {['Dossier', 'Documents', 'Facturation', 'Audiences'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                  activeTab === tab.toLowerCase() ? "text-[#c1a461]" : "text-white/40 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-white uppercase tracking-tighter">{user?.name || 'Client'}</p>
              <p className="text-[8px] font-black text-[#c1a461] uppercase tracking-[0.2em]">{activeCases.length > 0 ? activeCases.length + ' Dossier(s) Actif(s)' : 'Aucun Dossier'}</p>
            </div>
            <Avatar className="h-10 w-10 ring-2 ring-[#c1a461]/20">
              <AvatarFallback>{user?.name?.[0] || 'C'}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" className="p-2 text-white/20 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 flex-grow max-w-7xl space-y-12">
        {/* Welcome Banner */}
        <div className="relative p-12 bg-gradient-to-br from-[#1B365D] to-[#0a0f18] rounded-[48px] overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c1a461] rounded-full blur-[150px] opacity-10 -mr-32 -mt-32" />
          <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <Badge className="bg-[#c1a461] text-white font-black tracking-widest uppercase text-[9px] px-4 py-1">
                {activeCases.length > 0 ? 'DOSSIER ACTIF' : 'AUCUN DOSSIER'}
              </Badge>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                REF: {activeCases.length > 0 ? activeCases[0].id : 'N/A'}
              </span>
            </div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
              {activeCases.length > 0 ? (
                <>
                  {activeCases[0].title} <br /> <span className="text-[#c1a461]">Dossier {activeCases[0].type}</span>
                </>
              ) : (
                <>Bienvenue sur votre <br /> <span className="text-[#c1a461]">Portail Client</span></>
              )}
            </h2>
            <p className="text-white/60 font-medium text-lg leading-relaxed uppercase tracking-tight">
              {activeCases.length > 0
                ? `Votre dossier est actuellement en statut: ${activeCases[0].status}. Progression: ${activeCases[0].progression || 0}%`
                : 'Vous n\'avez actuellement aucun dossier actif. Contactez-nous pour plus d\'informations.'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Timeline Section */}
            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#c1a461]" /> Évolution du Dossier
                </h3>
                <Button variant="link" className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.2em]">Historique complet <ChevronRight className="w-3 h-3 ml-2" /></Button>
              </div>

              <div className="space-y-6 relative">
                <div className="absolute left-10 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
                {[
                  { date: "Hier, 14:30", action: "Conclusions pénales déposées par Maître Partner", status: "completed" },
                  { date: "22 Mai, 10:00", action: "Revue stratégique au cabinet", status: "completed" },
                  { date: "26 Mai, 09:00", action: "Audience Préliminaire — Cour Supérieure", status: "pending" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 items-start relative group">
                    <div className={cn(
                      "w-20 pt-1 text-right text-[10px] font-black uppercase tracking-widest hidden md:block",
                      item.status === 'completed' ? 'text-[#c1a461]' : 'text-white/20'
                    )}>
                      {item.date}
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 border-[#0a0f18] mt-1 relative z-10 transition-all",
                      item.status === 'completed' ? 'bg-[#c1a461]' : 'bg-white/5 border-white/20 group-hover:bg-white/10'
                    )} />
                    <Card className="flex-grow bg-white/5 border-white/5 shadow-none rounded-[32px] p-8">
                      <p className={cn(
                        "text-lg font-black uppercase tracking-tighter leading-tight",
                        item.status === 'completed' ? 'text-white' : 'text-white/40'
                      )}>
                        {item.action}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Documents */}
            <section className="space-y-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#c1a461]" /> Derniers Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseDocuments.length > 0 ? (
                  caseDocuments.slice(0, 4).map((doc) => (
                    <Card key={doc.id} className="bg-white/5 border-white/5 rounded-3xl p-6 group hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/5 rounded-2xl text-[#c1a461]">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-[11px] font-black uppercase text-white tracking-tight">{doc.title}</p>
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">
                            {new Date(doc.created_at).toLocaleDateString('fr-FR')} • {doc.category}
                          </p>
                        </div>
                        <Download className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full bg-white/5 border-white/5 rounded-3xl p-6">
                    <p className="text-[11px] font-black uppercase text-white/40 tracking-tight text-center py-4">
                      Aucun document disponible
                    </p>
                  </Card>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            {/* Direct Contact Card */}
            <Card className="border-none shadow-2xl rounded-[40px] bg-[#c1a461] text-white p-10 space-y-8">
              {assignedStaff ? (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-4 ring-white/20">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignedStaff.id}`} />
                      <AvatarFallback>{assignedStaff.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xl font-black uppercase leading-none">{assignedStaff.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-70">{assignedStaff.role}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium leading-relaxed uppercase tracking-tight opacity-90">
                    {activeCases.length > 0
                      ? `Vos conclusions pour le dossier ${activeCases[0].id} ont été traitées. Nous restons disponibles pour toute question.`
                      : 'Nous restonsavailable pour vous assister. N\'hésitez pas à nous contacter pour tout besoin.'}
                  </p>
                  <Button className="w-full bg-white text-[#c1a461] hover:bg-white/90 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl shadow-xl">
                    Contacter {assignedStaff.name.split(' ')[0]}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <p className="text-sm font-medium leading-relaxed uppercase tracking-tight opacity-90">
                    Aucun avocat assigné pour le moment
                  </p>
                  <Button className="w-full bg-white text-[#c1a461] hover:bg-white/90 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl shadow-xl">
                    Demander une Consultation
                  </Button>
                </div>
              )}
            </Card>

            {/* Financial Summary */}
            <Card className="border-none shadow-2xl rounded-[40px] bg-white p-10 space-y-10">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Facturation</h4>
                <Badge className={cn(
                  "font-black tracking-widest uppercase text-[8px] py-0.5",
                  totalAmount === 0 ? 'bg-slate-50 text-slate-600' :
                  paidAmount === totalAmount ? 'bg-emerald-50 text-emerald-600' :
                  'bg-amber-50 text-amber-600'
                )}>
                  {totalAmount === 0 ? 'AUCUNE FACTURE' : paidAmount === totalAmount ? 'À JOUR' : 'PAIEMENT EN ATTENTE'}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total des factures</p>
                <p className="text-4xl font-black text-[#0a0f18] tracking-tighter">{totalAmount.toLocaleString()} SA$</p>
              </div>
              {totalAmount > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-black uppercase">
                    <span className="text-slate-400">Réglé</span>
                    <span className="text-emerald-600">{paidAmount.toLocaleString()} SA$</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0}%` }} />
                  </div>
                </div>
              )}
              <Button variant="outline" className="w-full border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl">
                Voir toutes les factures ({clientInvoices.length})
              </Button>
            </Card>

            {/* Security Audit Badge */}
            <div className="p-8 border border-white/5 rounded-[40px] bg-white/[0.02] flex flex-col items-center text-center space-y-4">
              <ShieldCheck className="w-8 h-8 text-[#c1a461]" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Données Protégées</p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Audit Log ID: 882-MM-SA-PORTAL</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
        <p>© 2024 Noxwood & Partner — Portail Client Sécurisé.</p>
        <div className="flex gap-8">
          <span>Assistance 24/7</span>
          <span>Sécurité des données</span>
        </div>
      </footer>
    </div>
  );
};

export default Portal;
