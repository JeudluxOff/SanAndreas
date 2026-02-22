import React, { useEffect } from 'react';
import Navigation from '@/components/cabinet/Navigation';
import { Footer } from '@/components/cabinet/Footer';
import { CreditCard, CheckCircle2, ChevronRight, Gavel, Scale, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Fees() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pricingModels = [
    {
      title: "Forfait Fixe",
      desc: "Idéal pour les dossiers standardisés, offrant une visibilité totale sur le coût de la prestation dès le premier rendez-vous.",
      icon: <CreditCard className="w-8 h-8" />,
      features: ["Budget Maîtrisé", "Pas de mauvaise surprise", "Modalités de paiement", "Convention signée"]
    },
    {
      title: "Temps Passé",
      desc: "Facturation au prorata des heures consacrées au dossier, adaptée aux litiges complexes ou de longue durée.",
      icon: <Scale className="w-8 h-8" />,
      features: ["Transparence Totale", "Facturation Détaillée", "Rapport de diligences", "Acomptes successifs"]
    },
    {
      title: "Honoraire de Résultat",
      desc: "Un complément proportionnel aux gains obtenus ou aux pertes évitées, en accord avec la déontologie.",
      icon: <Gavel className="w-8 h-8" />,
      features: ["Performance Partagée", "Enjeu Stratégique", "Plafonnement possible", "Complément forfaitaire"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f18] selection:bg-[#c1a461] selection:text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="flex items-center gap-4 text-[#c1a461]">
              <div className="w-12 h-px bg-[#c1a461]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Transparence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              Nos <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c1a461] via-[#927843] to-[#c1a461]">
                Honoraires
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed uppercase tracking-tight max-w-2xl">
              Une relation de confiance commence par une parfaite clarté sur les modalités de facturation de nos services.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-32 bg-white rounded-t-[60px]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {pricingModels.map((model, idx) => (
              <Card key={idx} className="group border-none shadow-2xl hover:shadow-[#c1a461]/5 transition-all duration-500 overflow-hidden bg-slate-50 border-t-4 border-transparent hover:border-[#c1a461]">
                <CardContent className="p-12 space-y-8">
                  <div className="p-4 bg-white rounded-2xl text-[#c1a461] inline-block shadow-xl group-hover:scale-110 transition-transform">
                    {model.icon}
                  </div>
                  <h3 className="text-2xl font-black text-[#0a0f18] uppercase tracking-tighter leading-tight">{model.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{model.desc}</p>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    {model.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#c1a461]" />
                        <span className="text-xs font-black text-[#0a0f18] uppercase tracking-widest">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-32 max-w-4xl mx-auto p-12 bg-[#0a0f18] rounded-[40px] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="w-32 h-32" />
            </div>
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4 text-[#c1a461]">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-black uppercase tracking-tighter leading-tight text-white">Ethique et Déontologie</h3>
              </div>
              <p className="text-lg text-white/60 font-medium italic">
                "Conformément à nos règles déontologiques, chaque dossier donne lieu à la signature d'une convention d'honoraires détaillant précisément les modalités de calcul et de règlement de nos prestations."
              </p>
              <Button className="bg-white text-[#0a0f18] hover:bg-white/90 font-black uppercase text-xs tracking-[0.2em] px-10 h-16 rounded-xl shadow-2xl">
                Demander un devis personnalisé <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
