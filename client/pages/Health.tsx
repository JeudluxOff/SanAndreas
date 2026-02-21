import { Layout } from "@/components/Layout";
import { HeartPulse, Stethoscope, Briefcase, Pill, Ambulance, Microscope, ArrowRight, Phone, ShieldCheck, MapPin, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const healthStats = [
  { label: "Médecins Actifs", value: "245", trend: "+12", status: "up" },
  { label: "Établissements", value: "12", trend: "Stable", status: "neutral" },
  { label: "Urgences / Jour", value: "85", trend: "-5%", status: "down" },
  { label: "Budget Santé", value: "$450M", trend: "+15%", status: "up" }
];

const healthServices = [
  {
    name: "SAMS - San Andreas Medical Services",
    role: "Urgences & Soins",
    description: "Le SAMS assure les secours d'urgence, le transport médical et les soins hospitaliers majeurs.",
    icon: <Ambulance className="w-6 h-6" />,
    color: "bg-red-600"
  },
  {
    name: "Département de la Santé Publique",
    role: "Prévention & Contrôle",
    description: "Surveille la santé de la population, gère les campagnes de vaccination et le contrôle sanitaire.",
    icon: <Microscope className="w-6 h-6" />,
    color: "bg-blue-600"
  },
  {
    name: "Assurance Santé d'État",
    role: "Couverture Médicale",
    description: "Le régime public d'assurance santé garantit l'accès aux soins essentiels pour tous les citoyens.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-emerald-600"
  }
];

export default function Health() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-[#1B365D] py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none transform -rotate-12 scale-150">
          <HeartPulse className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none border-l-8 border-secondary pl-8">
              Santé <br /> <span className="text-secondary">& Services Humains</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl uppercase tracking-tight">
              Prendre soin de chaque citoyen de San Andreas, de la prévention aux soins d'urgence.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <section className="bg-red-600 py-8 border-y-4 border-white shadow-2xl relative z-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white text-red-600 rounded-full animate-pulse">
              <Ambulance className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Urgence Médicale</h2>
              <p className="text-white/80 font-bold uppercase text-xs tracking-widest">Composer le 911 — Dispatch Médical</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-red-600 hover:bg-slate-100 font-black uppercase tracking-widest px-8 h-12">
              Trouver un Hôpital
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-black uppercase tracking-widest px-8 h-12">
              Prise de RDV SAMS
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-20 space-y-4 max-w-3xl text-center md:text-left">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter leading-tight">Système de Santé Publique</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center md:justify-start gap-3">
              <Stethoscope className="w-5 h-5 text-secondary" />
              L'engagement pour le bien-être de l'État
            </p>
            <div className="w-24 h-2 bg-secondary mx-auto md:mx-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthServices.map((service) => (
              <Card key={service.name} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-slate-50 border-t-4 border-secondary">
                <CardHeader className="p-8">
                  <div className={cn("p-4 rounded-xl text-white inline-block mb-4 shadow-lg", service.color)}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-tight">{service.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest mt-2 border-secondary text-secondary">{service.role}</Badge>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-slate-600 font-medium leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Plus de détails <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention & Data */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative p-12 bg-white rounded-[3rem] shadow-2xl space-y-8 border-l-8 border-secondary overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-secondary rounded-2xl">
                   <Activity className="w-8 h-8 text-white" />
                 </div>
                 <h3 className="text-3xl font-black text-primary uppercase tracking-tighter">Indicateurs de Santé</h3>
               </div>
               <div className="space-y-6">
                 {healthStats.map((stat, idx) => (
                   <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-none">
                     <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
                     <div className="text-right">
                       <span className="block text-2xl font-black text-primary">{stat.value}</span>
                       <span className={cn(
                         "text-[10px] font-bold uppercase",
                         stat.status === 'up' ? 'text-emerald-600' : stat.status === 'down' ? 'text-red-600' : 'text-slate-400'
                       )}>{stat.trend}</span>
                     </div>
                   </div>
                 ))}
               </div>
               <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest py-8">
                 Consulter le bulletin épidémiologique
               </Button>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Prévention & Bien-être</h2>
                <div className="w-24 h-1 bg-secondary" />
              </div>
              
              <div className="space-y-8">
                {[
                  { icon: <Pill className="w-8 h-8" />, title: "Réseau de Pharmacies", desc: "Localisez les pharmacies de garde et accédez à vos prescriptions numériques." },
                  { icon: <Briefcase className="w-8 h-8" />, title: "Santé au Travail", desc: "Programmes de bien-être pour les employés et régulations de sécurité au travail." },
                  { icon: <MapPin className="w-8 h-8" />, title: "Centres de Soins", desc: "Carte interactive des cliniques locales et des centres de santé communautaires." },
                  { icon: <Clock className="w-8 h-8" />, title: "Dossier Médical", desc: "Espace sécurisé pour consulter vos analyses, vaccins et historiques médicaux." }
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
          </div>
        </div>
      </section>

      {/* Campaigns & News */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter leading-none">Campagnes de Santé Publique</h2>
            <div className="w-24 h-2 bg-secondary mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { id: 1, title: "Campagne de Vaccination", text: "Protéger San Andreas contre les virus saisonniers. Vaccination gratuite disponible dès lundi.", date: "24 Mai 2024" },
              { id: 2, title: "Santé Mentale pour Tous", text: "Lancement d'une ligne d'écoute gratuite 24/7 pour le soutien psychologique des citoyens.", date: "22 Mai 2024" },
              { id: 3, title: "Don de Sang National", text: "Le SAMS a besoin de vous. Devenez donneur et sauvez des vies. Rendez-vous au Mount Zonah.", date: "20 Mai 2024" }
            ].map((news) => (
              <div key={news.id} className="p-8 bg-slate-900 text-white rounded-[2rem] space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-20 transition-all duration-500" />
                <Badge className="bg-secondary text-white font-black tracking-widest text-[10px] uppercase">INFOS SANTÉ</Badge>
                <h4 className="text-xl font-black uppercase tracking-tight leading-tight">{news.title}</h4>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">{news.text}</p>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">{news.date}</span>
                  <Button variant="link" className="text-secondary p-0 h-auto font-black uppercase text-[10px] tracking-widest flex items-center gap-1">Lire l'article <ArrowRight className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
