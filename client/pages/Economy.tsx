import { Layout } from "@/components/Layout";
import { TrendingUp, Landmark, Briefcase, ShoppingCart, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Building, Globe, Zap, BarChart3, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const economyStats = [
  { label: "PIB de l'État", value: "$4.2B", trend: "+2.4%", status: "up" },
  { label: "Taux de Chômage", value: "3.8%", trend: "-0.5%", status: "down" },
  { label: "Inflation Annuelle", value: "2.1%", trend: "+0.1%", status: "up" },
  { label: "Dette Publique", value: "$1.2B", trend: "-1.2%", status: "down" }
];

const economicSectors = [
  {
    name: "Commerce & Logistique",
    role: "Moteur de croissance",
    description: "Le commerce de détail et la logistique représentent 25% de l'activité économique de Los Santos.",
    icon: <ShoppingCart className="w-6 h-6" />,
    color: "bg-blue-600"
  },
  {
    name: "Finance & Immobilier",
    role: "Secteur Tertiaire",
    description: "Maze Bank Tower et le quartier financier sont les piliers de notre puissance monétaire.",
    icon: <Landmark className="w-6 h-6" />,
    color: "bg-emerald-600"
  },
  {
    name: "Industrie & Énergie",
    role: "Secteur Secondaire",
    description: "La zone portuaire et les raffineries de la région assurent notre indépendance énergétique.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-amber-600"
  }
];

export default function Economy() {
  const { emergencyMode } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <div className={cn(
        "py-24 text-white relative overflow-hidden transition-colors duration-500",
        emergencyMode ? "bg-red-950" : "bg-[#1B365D]"
      )}>
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4 scale-150">
          <TrendingUp className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none border-l-8 pl-8 transition-colors",
              emergencyMode ? "border-red-600" : "border-secondary"
            )}>
              {emergencyMode ? "ÉCONOMIE DE" : "Économie"} <br /> <span className={cn("transition-colors", emergencyMode ? "text-red-500" : "text-secondary")}>
                {emergencyMode ? "GUERRE" : "& Commerce"}
              </span>
            </h1>
            <p className={cn(
              "text-xl md:text-2xl font-medium leading-relaxed max-w-2xl uppercase tracking-tight transition-colors",
              emergencyMode ? "text-red-300" : "text-slate-300"
            )}>
              {emergencyMode
                ? "GEL DES MARCHÉS FINANCIERS. RÉQUISITION DES RESSOURCES INDUSTRIELLES POUR L'EFFORT NATIONAL."
                : "Soutenir l'innovation, réguler les marchés et assurer la prospérité durable de San Andreas."}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Stats Section */}
      <section className={cn(
        "py-12 border-y shadow-sm relative z-20 transition-colors duration-500",
        emergencyMode ? "bg-red-900 border-red-800" : "bg-white border-slate-200"
      )}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {economyStats.map((stat) => (
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
                  "flex items-center gap-1 font-bold text-xs uppercase tracking-widest",
                  emergencyMode ? "text-red-500 animate-pulse" : (stat.status === 'up' ? 'text-emerald-600' : 'text-red-600')
                )}>
                  {emergencyMode ? <ShieldAlert className="w-4 h-4" /> : (stat.status === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />)}
                  {emergencyMode ? "SUSPENDU" : stat.trend} <span className={cn("text-[8px] font-medium ml-1", emergencyMode ? "text-red-800" : "text-slate-400")}>CE MOIS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-20 space-y-4 max-w-3xl">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Secteurs Clés</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-secondary" />
              L'ossature de notre développement
            </p>
            <div className="w-24 h-2 bg-secondary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {economicSectors.map((sector) => (
              <Card key={sector.name} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-slate-50 border-t-4 border-secondary">
                <CardHeader className="p-8">
                  <div className={cn("p-4 rounded-xl text-white inline-block mb-4 shadow-lg", sector.color)}>
                    {sector.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-tight">{sector.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest mt-2 border-secondary text-secondary">{sector.role}</Badge>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-slate-600 font-medium leading-relaxed mb-8">
                    {sector.description}
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Plus de détails <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Support & Services */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Aide aux Entreprises</h2>
                <div className="w-24 h-1 bg-secondary" />
              </div>
              
              <div className="space-y-8">
                {[
                  { icon: <Building className="w-8 h-8" />, title: "Licences & Permis", desc: "Obtenez toutes les autorisations nécessaires pour ouvrir et exploiter votre commerce légalement." },
                  { icon: <Briefcase className="w-8 h-8" />, title: "Portail de l'Emploi", desc: "Publiez des offres d'emploi ou trouvez votre prochain poste au sein de l'État." },
                  { icon: <DollarSign className="w-8 h-8" />, title: "Subventions & Prêts", desc: "Programmes de soutien financier pour les startups et les entreprises en difficulté." },
                  { icon: <Globe className="w-8 h-8" />, title: "Investissement Étranger", desc: "Attirer des capitaux pour stimuler l'innovation et les grands projets d'infrastructure." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-primary/10 rounded-full flex items-center justify-center font-black text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-primary uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative p-12 bg-primary rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white group">
              <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none transform -rotate-12 scale-150 translate-x-1/4">
                <PieChart className="w-full h-full" />
              </div>
              <div className="relative z-10 space-y-8 text-center md:text-left">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Rapport Économique 2024</h3>
                  <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Découvrez l'état de notre santé financière</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="block text-2xl font-black text-white">$142M</span>
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Excédent Budgétaire</span>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="block text-2xl font-black text-white">12,400</span>
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Nouveaux Emplois</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest py-8 shadow-xl">
                    Consulter le Rapport complet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Tax & Regulations */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Cadre Réglementaire</h2>
            <div className="w-24 h-2 bg-secondary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="p-8 bg-slate-900 text-white rounded-[2rem] space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-full">
                  <Landmark className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">Portail de la Fiscalité</h3>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                Le gouvernement de San Andreas s'engage à maintenir une fiscalité attractive et transparente pour favoriser l'investissement tout en assurant le financement des services publics essentiels.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest">Taxe sur les sociétés</span>
                  <span className="text-xl font-black text-secondary">8%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-widest">Taxe foncière (Moyenne)</span>
                  <span className="text-xl font-black text-secondary">1.2%</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-bold uppercase tracking-widest">Taxe sur les ventes</span>
                  <span className="text-xl font-black text-secondary">5%</span>
                </div>
              </div>
              <Button size="lg" className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest py-8">
                Accéder au service des impôts
              </Button>
            </div>

            <div className="space-y-8">
              <h3 className="text-3xl font-black text-primary uppercase tracking-tighter leading-tight">Transparence des Marchés</h3>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Toutes les entreprises de l'État doivent se conformer aux régulations en vigueur pour garantir une concurrence saine et protéger les consommateurs.
              </p>
              <ul className="space-y-4">
                {[
                  "Publication obligatoire des rapports annuels",
                  "Respect des normes environnementales",
                  "Égalité des chances en matière d'emploi",
                  "Lutte contre le blanchiment d'argent"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-bold text-slate-700 uppercase tracking-tight text-sm">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="link" className="p-0 text-primary font-black uppercase tracking-widest flex items-center gap-2">
                Consulter tout le code du commerce <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
