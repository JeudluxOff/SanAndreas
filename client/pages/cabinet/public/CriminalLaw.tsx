import React, { useEffect } from 'react';
import Navigation from '@/components/cabinet/Navigation';
import { Footer } from '@/components/cabinet/Footer';
import { Shield, CheckCircle2, ArrowRight, Gavel, Scale, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CriminalLaw() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const expertises = [
    "Défense en garde à vue",
    "Assistance devant le juge d'instruction",
    "Audition devant le tribunal correctionnel",
    "Contentieux des libertés et de la détention",
    "Droit pénal des affaires",
    "Assistance aux victimes"
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
              <Shield className="w-8 h-8" />
              <div className="w-12 h-px bg-[#c1a461]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Expertise Majeure</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              Droit <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c1a461] via-[#927843] to-[#c1a461]">
                Pénal
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed uppercase tracking-tight max-w-2xl">
              Une défense d'urgence sans concession. Harrington & Cole assure la protection de vos libertés face aux juridictions répressives.
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
                <h2 className="text-4xl font-black text-[#0a0f18] uppercase tracking-tighter">Votre liberté est notre priorité absolue</h2>
                <div className="w-24 h-2 bg-[#c1a461]" />
                <p className="text-lg text-slate-600 leading-relaxed">
                  Le cabinet Harrington & Cole intervient à tous les stades de la procédure pénale, de la garde à vue à l'aménagement de peine. Notre approche est fondée sur une analyse technique rigoureuse du dossier et une stratégie de défense proactive.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Qu'il s'agisse de délits routiers, de contentieux complexe ou de droit pénal des affaires, nous mobilisons l'ensemble de nos ressources pour garantir le respect de vos droits fondamentaux.
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
                  <Gavel className="w-32 h-32" />
                </div>
                <CardContent className="p-0 space-y-8 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Urgence Pénale 24/7</h3>
                  <p className="text-white/60 text-sm leading-relaxed uppercase tracking-wide">
                    En cas de garde à vue ou de perquisition, chaque minute compte. Nos avocats sont mobilisables immédiatement pour assister nos clients.
                  </p>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/5">
                      <AlertCircle className="w-6 h-6 text-[#c1a461]" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#c1a461]">Ligne d'Urgence</p>
                        <p className="text-lg font-black">555-010-999</p>
                      </div>
                    </div>
                    <Button className="w-full bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-xs tracking-[0.2em] h-16 rounded-xl">
                      Demander une assistance
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
