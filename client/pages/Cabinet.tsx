import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/cabinet/Navigation';
import { Footer } from '@/components/cabinet/Footer';
import {
  Scale,
  Shield,
  Gavel,
  Users,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ChevronLeft,
  X,
  Lock,
  BookOpen,
  Briefcase,
  Landmark,
  UserCheck,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#0a0f18]">
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c1a461] rounded-full blur-[150px] animate-in zoom-in-0 duration-1000" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white rounded-full blur-[150px] opacity-10 animate-in zoom-in-0 duration-1000 delay-200" />
    </div>
    
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl space-y-12">
        <div className="space-y-4 animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-4 text-[#c1a461]">
            <div className="w-12 h-px bg-[#c1a461]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Élite Juridique • San Andreas</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">
            Harrington <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c1a461] via-[#927843] to-[#c1a461]">
              & Cole
            </span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          <div className="flex-grow space-y-8">
            <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed uppercase tracking-tight max-w-xl">
              Rigueur. Discrétion. Stratégie. <br />
              <span className="text-white">L'excellence au service de votre défense.</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact">
                <Button className="bg-white text-[#0a0f18] hover:bg-white/90 font-black uppercase text-xs tracking-[0.2em] px-10 h-16 shadow-2xl">
                  Prendre rendez-vous
                </Button>
              </a>
              <a href="#expertise">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase text-xs tracking-[0.2em] px-10 h-16">
                  Voir nos expertises
                </Button>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-1 border-l border-white/10 pl-6">
              <span className="text-3xl font-black text-white">98%</span>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Taux de succès</p>
            </div>
            <div className="space-y-1 border-l border-white/10 pl-6">
              <span className="text-3xl font-black text-white">15+</span>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Années d'expertise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Expertise = () => {
  const expertises = [
    { title: "Droit Pénal", desc: "Défense d'urgence, crimes graves et délits complexes. Protection absolue de vos libertés.", icon: <Shield className="w-8 h-8" />, href: "/cabinet/criminal-law" },
    { title: "Droit Civil", desc: "Litiges contractuels, responsabilité civile et protection du patrimoine familial.", icon: <Users className="w-8 h-8" />, href: "/cabinet/civil-law" },
    { title: "Droit des Affaires", desc: "Conseil stratégique, fusions-acquisitions et contentieux commercial de haut vol.", icon: <Briefcase className="w-8 h-8" />, href: "/cabinet/business-law" },
    { title: "Droit Administratif", desc: "Recours contre l'État, marchés publics et contentieux des collectivités territoriales.", icon: <Landmark className="w-8 h-8" />, href: "/cabinet/administrative-law" }
  ];

  return (
    <section id="expertise" className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.5em]">Notre Savoir-Faire</span>
              <h2 className="text-5xl font-black text-[#0a0f18] uppercase tracking-tighter leading-tight">
                Une Expertise <br /> Sans Compromis
              </h2>
              <div className="w-24 h-2 bg-[#c1a461]" />
            </div>
            <p className="text-lg text-slate-600 font-medium leading-relaxed italic">
              "Chaque dossier est une bataille stratégique. Nous ne nous contentons pas de plaider, nous construisons des victoires basées sur une rigueur intellectuelle absolue et une connaissance chirurgicale de la jurisprudence."
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 shadow-xl overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Advocate${i}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-black text-[#0a0f18] uppercase tracking-tighter">Équipe d'élite</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">8 Associés Senior</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {expertises.map((exp, idx) => (
              <Card key={idx} className={cn(
                "group border-none shadow-2xl hover:shadow-[#c1a461]/5 transition-all duration-500 overflow-hidden bg-slate-50 border-t-4 border-transparent hover:border-[#c1a461]",
                "animate-in fade-in zoom-in-95 duration-700",
                idx % 2 === 0 ? "slide-in-from-right-12" : "slide-in-from-left-12"
              )} style={{ animationDelay: `${idx * 150}ms` }}>
                <CardContent className="p-10 space-y-6">
                  <div className="p-4 bg-white rounded-2xl text-[#c1a461] inline-block shadow-xl group-hover:scale-110 transition-transform duration-500">
                    {exp.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#0a0f18] uppercase tracking-tighter leading-tight">{exp.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{exp.desc}</p>
                  <Link to={exp.href}>
                    <Button variant="link" className="p-0 text-[10px] font-black uppercase tracking-widest text-[#c1a461] gap-2">
                      En savoir plus <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const team = [
    {
      name: "Julian Harrington",
      role: "Associé Fondateur",
      specialty: "Droit Pénal des Affaires",
      bio: "Spécialiste reconnu pour sa ténacité dans les dossiers fédéraux complexes. Ancien procureur de Los Santos.",
      seed: "Julian"
    },
    {
      name: "Victoria Cole",
      role: "Associée Fondatrice",
      specialty: "Arbitrage International",
      bio: "Maîtresse de la stratégie juridique et du contentieux civil complexe. Conseil auprès des grandes institutions.",
      seed: "Victoria"
    },
    {
      name: "Marcus Vane",
      role: "Avocat Senior",
      specialty: "Défense Criminelle",
      bio: "Expert en protection des libertés individuelles. Connu pour ses acquittements dans des affaires médiatisées.",
      seed: "Marcus"
    },
    {
      name: "Elena Rossi",
      role: "Avocate Senior",
      specialty: "Droit des Sociétés",
      bio: "Spécialiste des fusions-acquisitions et de la restructuration d'entreprises à fort enjeu stratégique.",
      seed: "Elena"
    }
  ];

  return (
    <section id="équipe" className="py-32 bg-[#0a0f18] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="space-y-6">
            <span className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.5em]">L'Excellence à votre Service</span>
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Nos <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c1a461] to-[#927843]">Associés</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-white/40 font-medium uppercase tracking-widest leading-relaxed">
              Une équipe d'élite composée des meilleurs juristes de San Andreas, dédiée à la protection de vos intérêts les plus critiques.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {team.map((member, idx) => (
            <div key={idx} className="group space-y-10 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${idx * 200 + 400}ms` }}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[40px] bg-slate-900 border border-white/5 transition-all duration-700 group-hover:rounded-[20px] group-hover:shadow-2xl group-hover:shadow-[#c1a461]/10">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}&backgroundColor=0a0f18`}
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
                  alt={member.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-8 left-8 right-8 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <Badge className="bg-[#c1a461] text-white font-black uppercase text-[8px] tracking-widest px-3 py-1">
                    {member.role}
                  </Badge>
                  <h3 className="text-xl font-black uppercase tracking-tight">{member.name}</h3>
                </div>
              </div>

              <div className="px-4 space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.3em]">{member.specialty}</p>
                  <p className="text-sm text-white/60 font-medium leading-relaxed italic">
                    "{member.bio}"
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                  <div className="flex gap-4">
                    <Mail className="w-4 h-4 text-white/20 hover:text-[#c1a461] transition-colors cursor-pointer" />
                    <Phone className="w-4 h-4 text-white/20 hover:text-[#c1a461] transition-colors cursor-pointer" />
                  </div>
                  <Button variant="link" className="p-0 text-[10px] font-black uppercase tracking-widest text-[#c1a461] group-hover:gap-3 transition-all ml-auto">
                    Consulter Bio <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => (
  <section className="py-32 bg-slate-50 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
      <Scale className="w-full h-full text-[#0a0f18] transform -rotate-12 scale-150" />
    </div>
    
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-10 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.5em]">Confiance & Excellence</span>
            <h2 className="text-5xl font-black text-[#0a0f18] uppercase tracking-tighter leading-tight">Ils nous ont <br /> confié leur avenir</h2>
            <div className="w-24 h-2 bg-[#c1a461]" />
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex text-[#c1a461]">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <span className="text-sm font-black text-[#0a0f18] uppercase tracking-widest">Score 4.9/5 sur Audit National</span>
          </div>
        </div>

        <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <Card className="border-none shadow-2xl p-12 bg-white rounded-[40px] relative z-20">
            <CardContent className="p-0 space-y-8">
              <BookOpen className="w-12 h-12 text-[#c1a461] opacity-20" />
              <p className="text-xl text-slate-700 font-medium italic leading-relaxed">
                "Dans un dossier de droit des affaires qui semblait perdu d'avance, le cabinet Harrington & Cole a su déployer une stratégie d'une finesse incroyable. Leur discrétion est absolue et leur efficacité redoutable."
              </p>
              <div className="flex items-center gap-4 border-t border-slate-100 pt-8">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">CL</div>
                <div>
                  <p className="text-sm font-black text-[#0a0f18] uppercase tracking-tighter">Directeur Général</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Anonyme par confidentialité</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="absolute -top-10 -right-10 w-full h-full bg-[#c1a461] rounded-[40px] opacity-10 -rotate-3" />
        </div>
      </div>
    </div>
  </section>
);

export default function Cabinet() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-[#c1a461] selection:text-white">
      <Navigation />
      <Hero />
      <Expertise />
      <Team />
      <Testimonials />
      <Footer />
    </div>
  );
}
