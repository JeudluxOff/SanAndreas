import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Gavel, Scale, FileText, Landmark, GraduationCap, Users, Search, ArrowRight, BookOpen, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";

const justiceDepts = [
  {
    name: "Parquet Général",
    role: "Poursuite Pénale",
    description: "Le Parquet est responsable de la poursuite des crimes et délits commis sur l'État de San Andreas.",
    icon: <Scale className="w-6 h-6" />,
    color: "bg-red-900"
  },
  {
    name: "Cabinet des Juges",
    role: "Pouvoir Judiciaire",
    description: "Les juges assurent l'équité des procès, prononcent les sentences et arbitrent les litiges civils.",
    icon: <Gavel className="w-6 h-6" />,
    color: "bg-slate-900"
  },
  {
    name: "Barreau de San Andreas",
    role: "Défense & Conseil",
    description: "Regroupe les avocats assermentés de l'État pour garantir le droit à la défense de chaque citoyen.",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "bg-slate-700"
  }
];

export default function Justice() {
  const { emergencyMode } = useAuth();
  const store = useGovernmentStore();
  const justiceStats = store.getJusticeStats();

  return (
    <Layout>
      {/* Hero Section */}
      <div className={cn(
        "py-24 text-white relative overflow-hidden transition-colors duration-500",
        emergencyMode ? "bg-red-950" : "bg-[#1B365D]"
      )}>
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none transform -rotate-12 scale-150 translate-x-1/4">
          <Gavel className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none border-l-8 pl-8 transition-colors",
              emergencyMode ? "border-red-600" : "border-secondary"
            )}>
              {emergencyMode ? "LOI MARTIALE" : "Justice"} <br /> <span className={cn("transition-colors", emergencyMode ? "text-red-500" : "text-secondary")}>
                {emergencyMode ? "ACTIF" : "& Droits Civils"}
              </span>
            </h1>
            <p className={cn(
              "text-xl md:text-2xl font-medium leading-relaxed max-w-2xl uppercase tracking-tight transition-colors",
              emergencyMode ? "text-red-300" : "text-slate-300"
            )}>
              {emergencyMode
                ? "LES PROCÉDURES CIVILES SONT SUSPENDUES. LES TRIBUNAUX MILITAIRES ONT COMPÉTENCE SUR TOUTES LES INFRACTIONS."
                : "Garantir une justice équitable, protéger les droits fondamentaux et assurer le respect des lois."}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Search Section */}
      <section className={cn(
        "py-12 border-y-4 shadow-2xl relative z-20 transition-all duration-500",
        emergencyMode ? "bg-red-700 border-red-500 animate-pulse" : "bg-slate-900 border-secondary"
      )}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-white">
            <div className={cn("p-3 rounded-full transition-colors", emergencyMode ? "bg-white text-red-700 shadow-lg" : "bg-secondary text-white")}>
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {emergencyMode ? "RECHERCHE DE MANDAT" : "Recherche de Dossier"}
              </h2>
              <p className={cn("font-bold uppercase text-[10px] tracking-widest transition-colors", emergencyMode ? "text-red-200" : "text-slate-400")}>
                {emergencyMode ? "BASE DE DONNÉES DE SÉCURITÉ NATIONALE" : "Accéder aux archives judiciaires publiques"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <input
                type="text"
                placeholder="N° DE DOSSIER (EX: SA-2024-XXX)"
                className="w-full bg-white/10 border border-white/20 rounded-sm h-12 px-4 text-white text-xs font-bold uppercase tracking-widest placeholder:text-white/40 focus:bg-white/20 transition-all outline-none"
              />
            </div>
            <Button className="bg-secondary text-white hover:bg-secondary/90 font-black uppercase tracking-widest px-8 h-12">
              Vérifier le statut
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={cn(
        "py-12 border-b shadow-sm relative z-20 transition-colors duration-500",
        emergencyMode ? "bg-red-900 border-red-800" : "bg-white border-slate-200"
      )}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {justiceStats.map((stat) => (
              <div key={stat.label} className={cn(
                "p-6 border rounded-2xl flex flex-col items-center text-center space-y-2 group transition-all duration-300",
                emergencyMode
                  ? "bg-red-950 border-red-800 hover:bg-red-800 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl"
              )}>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors",
                  emergencyMode ? "text-red-500" : "text-slate-400 group-hover:text-primary"
                )}>{stat.label}</span>
                <span className={cn(
                  "text-3xl font-black tracking-tighter transition-colors",
                  emergencyMode ? "text-white" : "text-primary"
                )}>{emergencyMode ? "---" : stat.value}</span>
                <div className={cn(
                  "flex items-center gap-1 font-bold text-[10px] uppercase tracking-widest",
                  stat.status === 'up' ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-20 space-y-4 max-w-3xl">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter leading-tight">Départements Judiciaires</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3">
              <Landmark className="w-5 h-5 text-secondary" />
              L'organisation du pouvoir de la loi
            </p>
            <div className="w-24 h-2 bg-secondary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {justiceDepts.map((dept) => (
              <Card key={dept.name} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-slate-50 border-t-4 border-secondary">
                <CardHeader className="p-8 text-center flex flex-col items-center">
                  <div className={cn("p-4 rounded-full text-white inline-block mb-4 shadow-lg ring-4 ring-white", dept.color)}>
                    {dept.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-tight">{dept.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest mt-2 border-slate-200 text-slate-500">{dept.role}</Badge>
                </CardHeader>
                <CardContent className="px-8 pb-8 text-center">
                  <p className="text-slate-600 font-medium leading-relaxed mb-8">
                    {dept.description}
                  </p>
                  <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-widest transition-all">
                    Plus d'informations
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Aid & Services */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <BookOpen className="w-8 h-8" />, label: "Code Civil", color: "bg-blue-100 text-blue-700" },
                  { icon: <ShieldCheck className="w-8 h-8" />, label: "Code Pénal", color: "bg-red-100 text-red-700" },
                  { icon: <Users className="w-8 h-8" />, label: "Aide Juridique", color: "bg-amber-100 text-amber-700" },
                  { icon: <Clock className="w-8 h-8" />, label: "Casier Judiciaire", color: "bg-emerald-100 text-emerald-700" }
                ].map((item, idx) => (
                  <div key={idx} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-center space-y-4">
                    <div className={cn("p-4 rounded-2xl mx-auto inline-block", item.color)}>
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-black text-primary uppercase tracking-tight">{item.label}</h4>
                    <Button variant="link" className="text-[10px] font-black uppercase tracking-widest p-0">Accéder <ArrowRight className="w-3 h-3 ml-1" /></Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Votre Justice, Vos Droits</h2>
                <div className="w-24 h-1 bg-secondary" />
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Le système judiciaire de San Andreas est conçu pour être accessible à tous. Nous mettons à votre disposition des outils pour comprendre vos droits et naviguer dans les procédures légales.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Link to="/cabinet" className="w-full">
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest py-8">
                      Trouver un Avocat
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-2 border-primary text-primary font-bold uppercase tracking-widest py-8 hover:bg-primary/5">
                    Demande de Grâce
                  </Button>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-2xl border-l-8 border-secondary flex gap-4 items-center">
                <div className="p-2 bg-secondary rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h5 className="text-white font-black uppercase text-sm tracking-tight">Prochaine Audience Publique</h5>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Lundi 24 Mai, 10h30 — Cour de Los Santos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forms & Procedures */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Formulaires Officiels</h2>
              <div className="w-24 h-2 bg-secondary mx-auto md:mx-0" />
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest px-8 h-14">
              Consulter tout le catalogue (PDF)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: "JUD-001", title: "Dépôt de plainte simple", color: "border-blue-200" },
              { id: "JUD-012", title: "Demande de remise de peine", color: "border-red-200" },
              { id: "JUD-045", title: "Autorisation de manifestation", color: "border-amber-200" },
              { id: "JUD-089", title: "Recours administratif global", color: "border-emerald-200" }
            ].map((doc) => (
              <div key={doc.id} className={cn("p-6 bg-slate-50 border-t-4 rounded-xl hover:bg-white hover:shadow-xl transition-all group", doc.color)}>
                <FileText className="w-8 h-8 text-primary mb-4" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ID: {doc.id}</span>
                <h4 className="text-sm font-black text-primary uppercase tracking-tight leading-tight group-hover:text-secondary transition-colors mb-4">{doc.title}</h4>
                <Button variant="link" className="p-0 text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                  Télécharger <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
