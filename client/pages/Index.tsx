import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Gavel,
  TrendingUp,
  HeartPulse,
  ChevronRight,
  MessageSquare,
  Calendar,
  FileText,
  AlertCircle,
  ShieldAlert
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const priorities = [
  {
    title: "Sécurité Publique",
    description: "Renforcement des effectifs du LSPD et du LSSD pour assurer la paix dans tout l'État.",
    icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
    link: "/securite"
  },
  {
    title: "Justice & Équité",
    description: "Réforme du code pénal et modernisation du système judiciaire pour une justice plus rapide.",
    icon: <Gavel className="w-8 h-8 text-secondary" />,
    link: "/justice"
  },
  {
    title: "Économie & Croissance",
    description: "Programmes de soutien aux PME et simplification de la fiscalité pour les nouveaux entrepreneurs.",
    icon: <TrendingUp className="w-8 h-8 text-secondary" />,
    link: "/economie"
  },
  {
    title: "Santé & Services",
    description: "Amélioration des infrastructures SAMS et accès facilité aux soins pour tous les citoyens.",
    icon: <HeartPulse className="w-8 h-8 text-secondary" />,
    link: "/sante"
  }
];

const news = [
  {
    date: "15 Mai 2024",
    category: "Sécurité",
    title: "Inauguration du nouveau centre de formation du LSPD à Mission Row.",
    image: "/placeholder.svg"
  },
  {
    date: "12 Mai 2024",
    category: "Économie",
    title: "Publication du rapport trimestriel sur la croissance économique de Los Santos.",
    image: "/placeholder.svg"
  },
  {
    date: "10 Mai 2024",
    category: "Justice",
    title: "Nomination de trois nouveaux juges à la Cour Supérieure de San Andreas.",
    image: "/placeholder.svg"
  }
];

export default function Index() {
  const { emergencyMode } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className={cn(
          "absolute inset-0 z-10 transition-colors duration-1000",
          emergencyMode ? "bg-red-950/80" : "bg-primary/80"
        )} />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{
            backgroundImage: "url('/placeholder.svg')",
            transform: emergencyMode ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        <div className="container mx-auto px-4 h-full relative z-20 flex items-center">
          <div className="max-w-3xl space-y-6">
            <div className={cn(
              "inline-block px-4 py-1 text-white text-xs font-black uppercase tracking-[0.2em] animate-fade-in transition-colors",
              emergencyMode ? "bg-red-600 animate-pulse" : "bg-secondary"
            )}>
              {emergencyMode ? "ALERTE NATIONALE CRITIQUE" : "Portail Officiel du Gouvernement"}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
              {emergencyMode ? (
                <>SÉCURITÉ & <br /> <span className="text-red-500">SURVIE</span></>
              ) : (
                <>Gouverner avec <br /> <span className="text-secondary">Intégrité</span> & Vision</>
              )}
            </h1>
            <p className={cn(
              "text-xl md:text-2xl font-medium leading-relaxed max-w-2xl border-l-4 pl-6 transition-all",
              emergencyMode ? "text-red-200 border-red-600 italic" : "text-slate-100 border-secondary"
            )}>
              {emergencyMode
                ? "Le Protocole d'Urgence National est actif. Restez à l'écoute des fréquences gouvernementales et conformez-vous aux ordres de mobilisation."
                : "\"Notre mission est de bâtir un San Andreas plus sûr, plus prospère et plus juste pour chaque citoyen, de Paleto Bay à South Central.\""}
            </p>
            <div className="pt-8 flex flex-wrap gap-4">
              <Link to={emergencyMode ? "/securite" : "/gouvernement"}>
                <Button className={cn(
                  "font-bold px-8 py-6 h-auto text-lg rounded-sm shadow-xl transition-all hover:translate-y-[-2px]",
                  emergencyMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-secondary hover:bg-secondary/90 text-white"
                )}>
                  {emergencyMode ? "DIRECTIVES DE SÉCURITÉ" : "Message du Gouverneur"}
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className={cn(
                  "border-2 font-bold px-8 py-6 h-auto text-lg rounded-sm shadow-lg backdrop-blur-sm transition-colors",
                  emergencyMode ? "border-red-500 text-red-500 hover:bg-red-500/10" : "border-white text-white hover:bg-white/10"
                )}>
                  Services d'Urgence
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Banner with Seal */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 backdrop-blur-md border-t py-4 z-20 transition-colors",
          emergencyMode ? "bg-red-600 border-red-500 shadow-[0_-4px_20px_rgba(220,38,38,0.3)]" : "bg-white/5 border-white/20"
        )}>
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className={cn(
              "hidden md:flex items-center gap-4 text-sm font-bold tracking-widest uppercase",
              emergencyMode ? "text-white animate-pulse" : "text-white/80"
            )}>
              <ShieldAlert className={cn("w-5 h-5", emergencyMode ? "text-white" : "text-secondary")} />
              <span>{emergencyMode ? "ALERTE DE NIVEAU 1 : ACTIF" : "Prochaine Session : 20 Mai 2024"}</span>
            </div>
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-tighter">
              <ShieldCheck className={cn("w-5 h-5", emergencyMode ? "text-white animate-bounce" : "text-secondary")} />
              État d'urgence : {emergencyMode ? "CRITIQUE" : "Niveau Normal"}
            </div>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute -inset-4 bg-secondary/10 rounded-lg transform rotate-2 group-hover:rotate-1 transition-transform" />
              <img 
                src="/placeholder.svg" 
                alt="Governor of San Andreas" 
                className="relative rounded-lg shadow-2xl border-8 border-white object-cover aspect-[4/5] w-full"
              />
              <div className="absolute -bottom-8 -right-8 bg-primary p-8 rounded-lg shadow-xl hidden md:block border-t-4 border-secondary">
                <p className="text-white font-black text-2xl uppercase tracking-tighter leading-none mb-1">Jonathon Miller</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Gouverneur de San Andreas</p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter leading-none">
                  Un Engagement pour <span className="text-secondary underline decoration-4 underline-offset-8">Tous les Citoyens</span>
                </h2>
                <div className="w-24 h-2 bg-secondary" />
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
                "Chaque décision prise dans ces murs est guidée par l'intérêt supérieur du peuple. Nous ne nous contentons pas de gérer l'État, nous forgeons son futur."
              </p>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Depuis le début de mon mandat, nous avons mis l'accent sur la transparence et l'efficacité administrative. L'État de San Andreas traverse une période de transformation sans précédent.
                </p>
                <p>
                  Que ce soit par le renforcement de nos forces de l'ordre pour garantir votre sécurité, ou par la création d'un environnement économique propice à l'innovation, nous travaillons sans relâche pour vous.
                </p>
              </div>
              <div className="pt-4">
                <Link to="/gouvernement" className="text-primary font-black uppercase tracking-widest text-sm flex items-center gap-2 group">
                  Découvrir le Cabinet <ChevronRight className="w-5 h-5 text-secondary group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Priorities Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter">Priorités du Mandat</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-sm">Vision Strategique 2024-2026</p>
            <div className="w-24 h-1 bg-secondary mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {priorities.map((priority) => (
              <div 
                key={priority.title} 
                className="group bg-white p-8 rounded-lg shadow-sm border border-slate-200 transition-all hover:shadow-xl hover:border-primary/20 hover:-translate-y-2"
              >
                <div className="mb-6 p-4 bg-slate-50 rounded-full inline-block group-hover:bg-primary/5 transition-colors">
                  {priority.icon}
                </div>
                <h3 className="text-xl font-black text-primary mb-4 uppercase tracking-tight">{priority.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                  {priority.description}
                </p>
                <Link to={priority.link} className="inline-flex items-center text-primary font-bold text-xs uppercase tracking-widest gap-2 group-hover:text-secondary transition-colors">
                  En savoir plus <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Dernières Annonces</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Actualités Gouvernementales</p>
            </div>
            <Button variant="outline" className="border-2 border-primary text-primary font-bold uppercase tracking-widest rounded-sm">
              Voir toutes les actualités
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {news.map((item, idx) => (
              <article key={idx} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-6 shadow-lg h-64 border-b-4 border-secondary">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm font-medium line-clamp-3 leading-relaxed">
                    Communiqué officiel concernant les nouvelles mesures adoptées par le cabinet gouvernemental lors de la dernière session plénière...
                  </p>
                  <div className="pt-2">
                    <span className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-secondary pb-1 group-hover:pr-4 transition-all">
                      Lire la suite
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency / Hotline Section */}
      <section className="py-12 bg-secondary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 rounded-full">
                <AlertCircle className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Service d'Urgence National</h3>
                <p className="text-white/80 font-bold uppercase tracking-widest text-sm">Disponible 24h/24 et 7j/7</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white text-secondary px-8 py-4 rounded-sm font-black text-3xl shadow-xl flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest text-secondary/60">Composez le</span>
                911
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-4 h-auto text-lg rounded-sm border-2 border-white/20 shadow-xl">
                Contacter un Agent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Official Links Grid */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { label: "LSPD", icon: <ShieldCheck className="w-6 h-6" /> },
              { label: "LSSD", icon: <ShieldCheck className="w-6 h-6" /> },
              { label: "SAMS", icon: <HeartPulse className="w-6 h-6" /> },
              { label: "DOJ", icon: <Gavel className="w-6 h-6" /> },
              { label: "IAA", icon: <ShieldCheck className="w-6 h-6" /> },
              { label: "FIB", icon: <ShieldCheck className="w-6 h-6" /> },
            ].map((org) => (
              <a 
                key={org.label} 
                href="#" 
                className="flex flex-col items-center gap-4 p-6 border border-white/10 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="text-white/40 group-hover:text-secondary transition-colors">
                  {org.icon}
                </div>
                <span className="font-black text-sm tracking-widest uppercase text-white/60 group-hover:text-white">{org.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
