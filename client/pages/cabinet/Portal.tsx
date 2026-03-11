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
      {/* Client Portal Header - Mobile Responsive */}
      <header className="border-b border-white/5 bg-[#0a0f18]/80 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-10 py-4 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
        <div className="flex items-center gap-3 md:gap-8 w-full md:w-auto">
          <Link to="/cabinet">
            <Button variant="ghost" className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] md:tracking-[0.3em] hover:text-[#c1a461] hover:bg-white/5 gap-2 px-2 md:px-0 group shrink-0">
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Quitter</span>
            </Button>
          </Link>

          <div className="h-4 md:h-6 w-px bg-white/5" />

          <Link to="/cabinet" className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-[#c1a461] rounded shadow-lg shrink-0">
              <Scale className="w-3 h-3 md:w-5 md:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[9px] md:text-xs font-black tracking-[0.15em] md:tracking-[0.2em] uppercase text-white leading-tight md:leading-none">Noxwood <span className="text-[#c1a461]">&</span> Partner</h1>
              <p className="text-[7px] md:text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Portail Client</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
          <nav className="hidden sm:flex items-center gap-4 md:gap-8">
            {['Dossier', 'Documents', 'Facturation'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all whitespace-nowrap",
                  activeTab === tab.toLowerCase() ? "text-[#c1a461]" : "text-white/40 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="h-6 md:h-8 w-px bg-white/5 hidden sm:block" />
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-right hidden xs:block">
              <p className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-tight leading-none">{user?.name || 'Client'}</p>
              <p className="text-[7px] font-black text-[#c1a461] uppercase tracking-[0.15em] mt-1">{activeCases.length} Dossier(s)</p>
            </div>
            <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-[#c1a461]/20 shrink-0">
              <AvatarFallback>{user?.name?.[0] || 'C'}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" className="p-2 text-white/20 hover:text-red-500 transition-colors shrink-0">
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto w-full space-y-8 md:space-y-12">
        {/* Welcome Banner */}
        <div className="relative p-6 md:p-12 bg-gradient-to-br from-[#1B365D] to-[#0a0f18] rounded-2xl md:rounded-[48px] overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-[#c1a461] rounded-full blur-[100px] md:blur-[150px] opacity-10 -mr-16 md:-mr-32 -mt-16 md:-mt-32" />
          <div className="relative z-10 space-y-4 md:space-y-6 max-w-2xl">
            <div className="flex items-center gap-3">
              <Badge className="bg-[#c1a461] text-white font-black tracking-widest uppercase text-[8px] md:text-[9px] px-3 py-1">
                {activeCases.length > 0 ? 'ACTIF' : 'AUCUN'}
              </Badge>
              <span className="text-[8px] md:text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] md:tracking-[0.3em]">
                {activeCases.length > 0 ? activeCases[0].id : 'N/A'}
              </span>
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight md:leading-none">
              {activeCases.length > 0 ? (
                <>
                  {activeCases[0].title.substring(0, 30)}{activeCases[0].title.length > 30 ? '...' : ''} <br className="hidden md:block" /> <span className="text-[#c1a461]">Dossier {activeCases[0].type}</span>
                </>
              ) : (
                <>Bienvenue <br /> <span className="text-[#c1a461]">Portail Client</span></>
              )}
            </h2>
            <p className="text-white/60 font-medium text-xs md:text-lg leading-relaxed uppercase tracking-tight">
              {activeCases.length > 0
                ? `Statut: ${activeCases[0].status}`
                : 'Aucun dossier actif'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            {/* Timeline Section */}
            <section className="space-y-6 md:space-y-8">
              <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 md:gap-3">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#c1a461] shrink-0" /> Évolution du Dossier
                </h3>
                <Button variant="link" className="text-[9px] md:text-[10px] font-black text-[#c1a461] uppercase tracking-[0.15em] md:tracking-[0.2em] p-0 h-auto">Historique <ChevronRight className="w-3 h-3 ml-1" /></Button>
              </div>

              <div className="space-y-4 md:space-y-6 relative">
                <div className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
                {[
                  { date: "Hier, 14:30", action: "Conclusions pénales déposées par Maître Partner", status: "completed" },
                  { date: "22 Mai, 10:00", action: "Revue stratégique au cabinet", status: "completed" },
                  { date: "26 Mai, 09:00", action: "Audience Préliminaire — Cour Supérieure", status: "pending" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 md:gap-8 items-start relative group">
                    <div className={cn(
                      "text-[8px] md:text-[10px] font-black uppercase tracking-widest hidden md:block md:w-20 md:pt-1 md:text-right shrink-0",
                      item.status === 'completed' ? 'text-[#c1a461]' : 'text-white/20'
                    )}>
                      {item.date}
                    </div>
                    <div className={cn(
                      "w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-[#0a0f18] mt-1 relative z-10 transition-all shrink-0",
                      item.status === 'completed' ? 'bg-[#c1a461]' : 'bg-white/5 border-white/20 group-hover:bg-white/10'
                    )} />
                    <Card className="flex-grow bg-white/5 border-white/5 shadow-none rounded-xl md:rounded-[32px] p-4 md:p-8">
                      <p className={cn(
                        "text-sm md:text-lg font-black uppercase tracking-tighter leading-tight",
                        item.status === 'completed' ? 'text-white' : 'text-white/40'
                      )}>
                        {item.action}
                      </p>
                      <p className={cn(
                        "text-[8px] md:hidden font-bold uppercase tracking-widest mt-2",
                        item.status === 'completed' ? 'text-[#c1a461]' : 'text-white/20'
                      )}>
                        {item.date}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Documents */}
            <section className="space-y-6 md:space-y-8">
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 md:gap-3">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#c1a461] shrink-0" /> Documents
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {caseDocuments.length > 0 ? (
                  caseDocuments.slice(0, 4).map((doc) => (
                    <Card key={doc.id} className="bg-white/5 border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 group hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="p-3 md:p-4 bg-white/5 rounded-lg md:rounded-2xl text-[#c1a461] shrink-0">
                          <FileText className="w-5 h-5 md:w-8 md:h-8" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[10px] md:text-[11px] font-black uppercase text-white tracking-tight truncate">{doc.title}</p>
                          <p className="text-[8px] md:text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">
                            {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Download className="w-4 h-4 md:w-5 md:h-5 text-white/20 group-hover:text-white transition-colors shrink-0" />
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-full bg-white/5 border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                    <p className="text-[10px] md:text-[11px] font-black uppercase text-white/40 tracking-tight text-center py-4">
                      Aucun document
                    </p>
                  </Card>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6 md:space-y-12">
            {/* Direct Contact Card */}
            <Card className="border-none shadow-2xl rounded-2xl md:rounded-[40px] bg-[#c1a461] text-white p-6 md:p-10 space-y-6 md:space-y-8">
              {assignedStaff ? (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 md:h-16 md:w-16 ring-4 ring-white/20 shrink-0">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignedStaff.id}`} />
                      <AvatarFallback>{assignedStaff.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h4 className="text-lg md:text-xl font-black uppercase leading-none">{assignedStaff.name}</h4>
                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] mt-1 opacity-70">{assignedStaff.role}</p>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm font-medium leading-relaxed uppercase tracking-tight opacity-90">
                    {activeCases.length > 0
                      ? `Votre dossier ${activeCases[0].id} en cours de traitement.`
                      : 'Nous sommes disponibles pour vous assister.'}
                  </p>
                  <Button className="w-full bg-white text-[#c1a461] hover:bg-white/90 font-black uppercase text-[9px] md:text-[10px] tracking-widest h-12 md:h-14 rounded-xl md:rounded-2xl shadow-xl">
                    Contacter {assignedStaff.name.split(' ')[0]}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4 py-2 md:py-4">
                  <p className="text-xs md:text-sm font-medium leading-relaxed uppercase tracking-tight opacity-90">
                    Aucun avocat assigné
                  </p>
                  <Button className="w-full bg-white text-[#c1a461] hover:bg-white/90 font-black uppercase text-[9px] md:text-[10px] tracking-widest h-12 md:h-14 rounded-xl md:rounded-2xl shadow-xl">
                    Demander Consultation
                  </Button>
                </div>
              )}
            </Card>

            {/* Financial Summary */}
            <Card className="border-none shadow-2xl rounded-2xl md:rounded-[40px] bg-white p-6 md:p-10 space-y-6 md:space-y-10">
              <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
                <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em]">Facturation</h4>
                <Badge className={cn(
                  "font-black tracking-widest uppercase text-[7px] md:text-[8px] py-0.5 shrink-0",
                  totalAmount === 0 ? 'bg-slate-50 text-slate-600' :
                  paidAmount === totalAmount ? 'bg-emerald-50 text-emerald-600' :
                  'bg-amber-50 text-amber-600'
                )}>
                  {totalAmount === 0 ? 'AUCUNE' : paidAmount === totalAmount ? 'À JOUR' : 'EN ATTENTE'}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                <p className="text-3xl md:text-4xl font-black text-[#0a0f18] tracking-tighter">{totalAmount.toLocaleString()} SA$</p>
              </div>
              {totalAmount > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] md:text-[11px] font-black uppercase">
                    <span className="text-slate-400">Réglé</span>
                    <span className="text-emerald-600">{paidAmount.toLocaleString()} SA$</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0}%` }} />
                  </div>
                </div>
              )}
              <Button variant="outline" className="w-full border-2 border-slate-900 text-slate-900 font-black uppercase text-[9px] md:text-[10px] tracking-widest h-12 md:h-14 rounded-xl md:rounded-2xl">
                Factures ({clientInvoices.length})
              </Button>
            </Card>

            {/* Security Audit Badge */}
            <div className="p-6 md:p-8 border border-white/5 rounded-2xl md:rounded-[40px] bg-white/[0.02] flex flex-col items-center text-center space-y-3 md:space-y-4">
              <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-[#c1a461]" />
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">Données Protégées</p>
                <p className="text-[7px] md:text-[8px] font-bold text-white/30 uppercase tracking-[0.15em] mt-1">882-MM-SA-PORTAL</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="px-4 md:px-6 py-8 md:py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em]">
        <p>© 2024 Noxwood & Partner — Portail Sécurisé</p>
        <div className="flex gap-4 md:gap-8 text-center md:text-left">
          <span>Assistance 24/7</span>
          <span className="hidden sm:inline">Sécurité</span>
        </div>
      </footer>
    </div>
  );
};

export default Portal;
