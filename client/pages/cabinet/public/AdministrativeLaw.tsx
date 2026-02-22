import React, { useEffect } from 'react';
import Navigation from '@/components/cabinet/Navigation';
import { Footer } from '@/components/cabinet/Footer';
import { Landmark, CheckCircle2, FileText, Gavel, Building, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdministrativeLaw() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const expertises = [
    "Recours pour excès de pouvoir",
    "Contentieux des marchés publics",
    "Responsabilité administrative de l'État",
    "Droit de l'urbanisme et de l'aménagement",
    "Contentieux des collectivités locales",
    "Défense des agents publics"
  ];

  return (
    <div className="min-h-screen bg-[#0a0f18] selection:bg-[#c1a461] selection:text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c1a461] rounded-full blur-[150px] animate-pulse" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="flex items-center gap-4 text-[#c1a461]">
              <Landmark className="w-8 h-8" />
              <div className="w-12 h-px bg-[#c1a461]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Expertise Majeure</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              Droit <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c1a461] via-[#927843] to-[#c1a461]">
                Administratif
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed uppercase tracking-tight max-w-2xl">
              Garantir l'équilibre entre citoyen et État. Harrington & Cole assure une défense de haut niveau face aux institutions publiques.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-32 bg-white rounded-t-[60px]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            <div className="lg:col-span-7 space-y-16 animate-in fade-in slide-in-from-bottom duration-1000">
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-[#0a0f18] uppercase tracking-tighter">Faire valoir vos droits face à la puissance publique</h2>
                <div className="w-24 h-2 bg-[#c1a461]" />
                <p className="text-lg text-slate-600 leading-relaxed">
                  Le droit administratif est un domaine complexe qui requiert une expertise spécifique. Notre cabinet intervient pour contester les décisions administratives injustes, négocier avec les administrations ou engager leur responsabilité.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Qu'il s'agisse de recours contre des refus de permis de construire, de contentieux électoraux ou de litiges contractuels avec le secteur public, Harrington & Cole apporte une réponse technique et stratégique rigoureuse.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expertises.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#c1a461] transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-[#c1a461] shrink-0" />
                    <span className="text-sm font-black text-[#0a0f18] uppercase tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <Card className="border-none bg-[#0a0f18] text-white p-12 rounded-[40px] shadow-2xl sticky top-32 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck className="w-32 h-32" />
                </div>
                <CardContent className="p-0 space-y-8 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Protection des Libertés</h3>
                  <p className="text-white/60 text-sm leading-relaxed uppercase tracking-wide">
                    Le cabinet Harrington & Cole a une expertise reconnue dans la défense des libertés publiques et des droits fondamentaux face aux mesures coercitives de l'administration.
                  </p>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/5">
                      <Building className="w-6 h-6 text-[#c1a461]" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#c1a461]">Recours Administratif</p>
                        <p className="text-lg font-black">Audit de Légalité</p>
                      </div>
                    </div>
                    <Button className="w-full bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-xs tracking-[0.2em] h-16 rounded-xl">
                      Prendre rendez-vous
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
