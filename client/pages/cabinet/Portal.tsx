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

const Portal = () => {
  const [activeTab, setActiveTab] = React.useState('dossier');

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
              <p className="text-[10px] font-black text-white uppercase tracking-tighter">Martin Madrazo</p>
              <p className="text-[8px] font-black text-[#c1a461] uppercase tracking-[0.2em]">Client Premium</p>
            </div>
            <Avatar className="h-10 w-10 ring-2 ring-[#c1a461]/20">
              <AvatarFallback>MM</AvatarFallback>
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
              <Badge className="bg-[#c1a461] text-white font-black tracking-widest uppercase text-[9px] px-4 py-1">DOSSIER ACTIF</Badge>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">REF: SA-2024-882</span>
            </div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
              État de San Andreas <br /> <span className="text-[#c1a461]">vs. Martin Madrazo</span>
            </h2>
            <p className="text-white/60 font-medium text-lg leading-relaxed uppercase tracking-tight">
              Votre dossier est actuellement au stade des conclusions pénales. Notre équipe d'élite finalise la stratégie de défense pour l'audience préliminaire.
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
                {[
                  { title: "Convention d'Honoraires", date: "15 Mai", type: "PDF" },
                  { title: "Rapport d'Expertise Comptable", date: "20 Mai", type: "PDF" }
                ].map((doc, idx) => (
                  <Card key={idx} className="bg-white/5 border-white/5 rounded-3xl p-6 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-white/5 rounded-2xl text-[#c1a461]">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[11px] font-black uppercase text-white tracking-tight">{doc.title}</p>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">{doc.date} • {doc.type}</p>
                      </div>
                      <Download className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            {/* Direct Contact Card */}
            <Card className="border-none shadow-2xl rounded-[40px] bg-[#c1a461] text-white p-10 space-y-8">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-white/20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria`} />
                </Avatar>
                <div>
                  <h4 className="text-xl font-black uppercase leading-none">Victoria Partner</h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-70">Avocate en charge</p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed uppercase tracking-tight opacity-90">
                "Martin, vos conclusions ont été transmises ce matin. Le juge Miller semble ouvert à une médiation, nous restons sur notre stratégie."
              </p>
              <Button className="w-full bg-white text-[#c1a461] hover:bg-white/90 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl shadow-xl">
                Contacter Maître Partner
              </Button>
            </Card>

            {/* Financial Summary */}
            <Card className="border-none shadow-2xl rounded-[40px] bg-white p-10 space-y-10">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Facturation</h4>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black tracking-widest uppercase text-[8px] py-0.5">À JOUR</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Convention d'honoraires totale</p>
                <p className="text-4xl font-black text-[#0a0f18] tracking-tighter">125,000 SA$</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase">
                  <span className="text-slate-400">Réglé</span>
                  <span className="text-emerald-600">85,000 SA$</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <Button variant="outline" className="w-full border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl">
                Voir toutes les factures
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
