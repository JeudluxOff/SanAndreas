import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Shield, 
  Gavel, 
  Award, 
  Users, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Menu,
  X,
  Lock,
  Search,
  BookOpen,
  Briefcase,
  Landmark,
  UserCheck,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed w-full z-50 bg-[#0a0f18]/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <Link to="/cabinet" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-[#c1a461] to-[#927843] rounded shadow-lg group-hover:scale-105 transition-transform">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-[0.2em] uppercase leading-none">Harrington <span className="text-[#c1a461]">&</span> Cole</h1>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">Cabinet d'Avocats</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {['Expertise', 'Équipe', 'Méthodologie', 'Honoraires', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[11px] font-black text-white/60 hover:text-[#c1a461] uppercase tracking-[0.2em] transition-colors"
            >
              {item}
            </a>
          ))}
          <div className="h-6 w-px bg-white/10 mx-4" />
          <Link to="/intranet">
            <Button variant="ghost" className="text-[11px] font-black text-[#c1a461] uppercase tracking-[0.2em] hover:bg-[#c1a461]/10 gap-2">
              <Lock className="w-3 h-3" /> Intranet
            </Button>
          </Link>
          <Link to="/cabinet/portal">
            <Button className="bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-[11px] tracking-[0.2em] px-8 h-12 shadow-xl shadow-[#c1a461]/10">
              Portail Client
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-2">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-[#0a0f18] border-b border-white/5 p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            {['Expertise', 'Équipe', 'Méthodologie', 'Honoraires', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]"
              >
                {item}
              </a>
            ))}
            <hr className="border-white/5" />
            <Link to="/intranet" className="text-[11px] font-black text-[#c1a461] uppercase tracking-[0.2em]">Intranet</Link>
            <Link to="/cabinet/portal">
              <Button className="w-full bg-[#c1a461] text-white font-black uppercase text-[11px] tracking-[0.2em] h-12">Portail Client</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#0a0f18]">
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c1a461] rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white rounded-full blur-[150px] opacity-10" />
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
              <Button className="bg-white text-[#0a0f18] hover:bg-white/90 font-black uppercase text-xs tracking-[0.2em] px-10 h-16 shadow-2xl">
                Prendre rendez-vous
              </Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase text-xs tracking-[0.2em] px-10 h-16">
                Voir nos expertises
              </Button>
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
    { title: "Droit Pénal", desc: "Défense d'urgence, crimes graves et délits complexes. Protection absolue de vos libertés.", icon: <Shield className="w-8 h-8" /> },
    { title: "Droit Civil", desc: "Litiges contractuels, responsabilité civile et protection du patrimoine familial.", icon: <Users className="w-8 h-8" /> },
    { title: "Droit des Affaires", desc: "Conseil stratégique, fusions-acquisitions et contentieux commercial de haut vol.", icon: <Briefcase className="w-8 h-8" /> },
    { title: "Droit Administratif", desc: "Recours contre l'État, marchés publics et contentieux des collectivités territoriales.", icon: <Landmark className="w-8 h-8" /> }
  ];

  return (
    <section id="expertise" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5 space-y-10">
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
              <Card key={idx} className="group border-none shadow-2xl hover:shadow-[#c1a461]/5 transition-all duration-500 overflow-hidden bg-slate-50 border-t-4 border-transparent hover:border-[#c1a461]">
                <CardContent className="p-10 space-y-6">
                  <div className="p-4 bg-white rounded-2xl text-[#c1a461] inline-block shadow-xl group-hover:scale-110 transition-transform duration-500">
                    {exp.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#0a0f18] uppercase tracking-tighter leading-tight">{exp.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{exp.desc}</p>
                  <Button variant="link" className="p-0 text-[10px] font-black uppercase tracking-widest text-[#c1a461] gap-2">
                    En savoir plus <ArrowRight className="w-3 h-3" />
                  </Button>
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
    { name: "Julian Harrington", role: "Associé Fondateur", bio: "Spécialiste en droit pénal des affaires, ancien procureur fédéral reconnu pour sa ténacité.", seed: "Julian" },
    { name: "Victoria Cole", role: "Associée Fondatrice", bio: "Experte en contentieux civil complexe et arbitrage international. Maîtresse de la stratégie.", seed: "Victoria" },
    { name: "Marcus Vane", role: "Avocat Senior", bio: "Défense criminelle d'élite. Connu pour ses acquittements dans des dossiers sensibles.", seed: "Marcus" }
  ];

  return (
    <section id="équipe" className="py-32 bg-[#0a0f18] text-white">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-24">
          <span className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.5em]">Les Architectes de votre Défense</span>
          <h2 className="text-6xl font-black uppercase tracking-tighter">Notre Élite</h2>
          <div className="w-24 h-2 bg-[#c1a461] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {team.map((member, idx) => (
            <div key={idx} className="group space-y-8 text-center md:text-left">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-900 border border-white/5">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}&backgroundColor=0a0f18`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                  alt={member.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] to-transparent opacity-60" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight">{member.name}</h3>
                  <p className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.3em]">{member.role}</p>
                </div>
                <p className="text-sm text-white/60 font-medium leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <Mail className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
                  <Phone className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
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
        <div className="space-y-10">
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

        <div className="relative">
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

const Footer = () => (
  <footer id="contact" className="bg-[#0a0f18] pt-32 pb-12 text-white border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <div className="space-y-8">
          <Link to="/cabinet" className="flex items-center gap-3">
            <div className="p-2 bg-[#c1a461] rounded shadow-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-white tracking-[0.2em] uppercase leading-none">Harrington <span className="text-[#c1a461]">&</span> Cole</h1>
          </Link>
          <p className="text-sm text-white/40 font-medium leading-relaxed uppercase tracking-tight">
            L'excellence juridique au service des intérêts les plus sensibles de San Andreas.
          </p>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#c1a461] hover:border-[#c1a461] transition-all cursor-pointer">
                <Shield className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.4em]">Expertises</h4>
          <ul className="space-y-4">
            {['Pénal', 'Civil', 'Affaires', 'Administratif'].map(item => (
              <li key={item} className="text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors cursor-pointer">
                Droit {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.4em]">Cabinet</h4>
          <ul className="space-y-4">
            {['Équipe', 'Méthodologie', 'Honoraires', 'Carrières'].map(item => (
              <li key={item} className="text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.4em]">Siège Social</h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#c1a461]" />
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                442 Rockwell Avenue <br />
                Financial District, Los Santos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-[#c1a461]" />
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">555-010-942</p>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-[#c1a461]" />
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">contact@harrington-cole.sa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
        <p>© 2024 Harrington & Cole. Tous droits réservés.</p>
        <div className="flex gap-8">
          <span className="hover:text-white transition-colors cursor-pointer">Mentions Légales</span>
          <span className="hover:text-white transition-colors cursor-pointer">Politique de Confidentialité</span>
          <span className="hover:text-white transition-colors cursor-pointer">Déontologie</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function Cabinet() {
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
