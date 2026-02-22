import React, { useEffect } from 'react';
import { Navigation } from '@/components/cabinet/Navigation';
import { Footer } from '@/components/cabinet/Footer';
import { BookOpen, Search, Target, Shield, MessageSquare, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Methodology() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      title: "Analyse Initiale",
      desc: "Chaque dossier commence par un audit approfondi des faits et une analyse minutieuse de la jurisprudence applicable.",
      icon: <Search className="w-8 h-8" />
    },
    {
      title: "Stratégie Sur Mesure",
      desc: "Nous élaborons une stratégie de défense ou de conseil adaptée à vos objectifs spécifiques et aux enjeux du dossier.",
      icon: <Target className="w-8 h-8" />
    },
    {
      title: "Action & Réactivité",
      desc: "Une mise en œuvre rigoureuse des actes juridiques et une communication constante sur l'évolution de la procédure.",
      icon: <MessageSquare className="w-8 h-8" />
    },
    {
      title: "Rigueur Technique",
      desc: "Une exigence absolue de qualité dans la rédaction de nos écritures et la préparation de nos plaidoiries.",
      icon: <BookOpen className="w-8 h-8" />
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Notre ADN</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              Notre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c1a461] via-[#927843] to-[#c1a461]">
                Méthodologie
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed uppercase tracking-tight max-w-2xl">
              L'excellence n'est pas un acte, c'est une habitude. Découvrez comment nous construisons vos victoires.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-white rounded-t-[60px]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-5xl font-black text-[#0a0f18] uppercase tracking-tighter leading-tight">Une Rigueur <br /> Chirurgicale</h2>
                <div className="w-24 h-2 bg-[#c1a461]" />
              </div>
              <p className="text-lg text-slate-600 leading-relaxed italic">
                "Le cabinet Harrington & Cole ne se contente pas de traiter des dossiers. Nous analysons chaque détail comme s'il s'agissait de l'élément clé de la victoire. Notre méthodologie repose sur une discipline intellectuelle sans faille et une réactivité totale face aux évolutions de la procédure."
              </p>
              <div className="flex items-center gap-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <Shield className="w-10 h-10 text-[#c1a461]" />
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">Confidentialité</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Absolue</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <Briefcase className="w-10 h-10 text-[#c1a461]" />
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">Expertise</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Multi-Domaine</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6 group hover:border-[#c1a461] transition-all duration-500">
                  <div className="p-4 bg-white rounded-2xl text-[#c1a461] inline-block shadow-xl group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#0a0f18] uppercase tracking-tighter">{step.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-[#0a0f18] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
        <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Prêt à entamer votre défense ?</h2>
          <Button className="bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-xs tracking-[0.2em] px-12 h-20 rounded-full shadow-2xl">
            Prendre un premier contact <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
