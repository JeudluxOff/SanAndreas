import { Layout } from "@/components/Layout";
import { Shield, ShieldAlert, Target, ShieldCheck, Siren, MapPin, Phone, Eye, ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";

const securityAgencies = [
  {
    name: "LSPD - Los Santos Police Department",
    role: "Police Urbaine",
    description: "Assure l'ordre et la sécurité dans les zones urbaines de Los Santos, gère la criminalité quotidienne et la protection des citoyens.",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-blue-600"
  },
  {
    name: "LSSD - Los Santos Sheriff Department",
    role: "Police des Comtés",
    description: "Compétent dans les zones rurales et périurbaines, le LSSD maintient l'ordre dans le comté de Blaine et de Los Santos.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-amber-600"
  },
  {
    name: "FIB - Federal Investigation Bureau",
    role: "Sécurité Fédérale",
    description: "S'occupe des crimes fédéraux, du terrorisme, de la corruption et des menaces majeures contre la sécurité de l'État.",
    icon: <Target className="w-6 h-6" />,
    color: "bg-slate-900"
  }
];

export default function Security() {
  const { emergencyMode } = useAuth();
  const store = useGovernmentStore();
  const securityStats = store.getSecurityStats();

  return (
    <Layout>
      {/* Hero Section */}
      <div className={cn(
        "py-24 text-white relative overflow-hidden transition-colors duration-500 min-h-[600px] md:min-h-[700px] flex items-center",
        emergencyMode ? "bg-red-950" : "bg-[#1B365D]"
      )}>
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: "url('https://cdn.builder.io/api/v1/image/assets%2F4e331a0ce80644199f9cae8c33fdc854%2Fb35afc6ca05d4598bd3f540c9b832fe2?format=webp&width=800&height=1200')"
          }}
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B365D]/0 via-transparent to-transparent" />

        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none transform rotate-45 scale-150">
          <ShieldAlert className="w-full h-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className={cn(
              "text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none border-l-8 pl-8 transition-colors",
              emergencyMode ? "border-red-600" : "border-secondary"
            )}>
              {emergencyMode ? "ÉTAT D'URGENCE" : "Sécurité"} <br /> <span className={cn("transition-colors", emergencyMode ? "text-red-500" : "text-secondary")}>
                {emergencyMode ? "NATIONAL" : "& Ordre Public"}
              </span>
            </h1>
            <p className={cn(
              "text-xl md:text-2xl font-medium leading-relaxed max-w-2xl uppercase tracking-tight transition-colors",
              emergencyMode ? "text-red-300" : "text-slate-300"
            )}>
              {emergencyMode
                ? "DÉPLOIEMENT IMMÉDIAT DES FORCES DE SÉCURITÉ. TOUS LES SERVICES SONT SOUS COMMANDEMENT DIRECT DU CABINET."
                : "Protéger, Servir et Maintenir la Paix Civile à travers l'État de San Andreas."}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <section className={cn(
        "py-8 border-y-4 shadow-2xl relative z-20 transition-all duration-500",
        emergencyMode ? "bg-red-700 border-red-500 animate-pulse" : "bg-red-600 border-white"
      )}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white text-red-600 rounded-full animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {emergencyMode ? "LIGNE DE CRISE" : "Urgence Immédiate"}
              </h2>
              <p className="text-white/80 font-bold uppercase text-xs tracking-widest">
                {emergencyMode ? "PRIORITÉ ABSOLUE AUX APPELS DE SÉCURITÉ" : "Composer le 911 en cas de danger"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-red-600 hover:bg-slate-100 font-black uppercase tracking-widest px-8">
              Signaler un Crime
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-black uppercase tracking-widest px-8">
              Avis de Recherche
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
            {securityStats.map((stat) => (
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

      {/* Agencies Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-20 space-y-4 max-w-3xl">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Agences de l'Ordre</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3">
              <Siren className="w-5 h-5 text-secondary" />
              Les piliers de notre sécurité
            </p>
            <div className="w-24 h-2 bg-secondary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityAgencies.map((agency) => (
              <Card key={agency.name} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-slate-50 border-t-4 border-secondary">
                <CardHeader className="p-8">
                  <div className={cn("p-4 rounded-xl text-white inline-block mb-4 shadow-lg", agency.color)}>
                    {agency.icon}
                  </div>
                  <CardTitle className="text-2xl font-black text-primary uppercase tracking-tighter leading-tight">{agency.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest mt-2 border-secondary text-secondary">{agency.role}</Badge>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-slate-600 font-medium leading-relaxed mb-8">
                    {agency.description}
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                    Accéder au portail <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crime Map Placeholder */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Transparence & Données</h2>
                <div className="w-24 h-1 bg-secondary" />
              </div>
              
              <div className="space-y-8">
                {[
                  { title: "Statistiques de Criminalité", desc: "Consultez les rapports hebdomadaires sur les incidents dans chaque quartier." },
                  { title: "Zones à Risque", desc: "Informations en temps réel sur les opérations en cours et les périmètres de sécurité." },
                  { title: "Plaintes en Ligne", desc: "Soumettez vos plaintes administratives ou criminelles via notre plateforme sécurisée." },
                  { title: "Recrutement", desc: "Rejoignez les rangs des forces de l'ordre de San Andreas." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-primary/10 rounded-full flex items-center justify-center font-black text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-primary uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative aspect-square md:aspect-video bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white group">
              <img
                src="https://images.pexels.com/photos/16124523/pexels-photo-16124523.jpeg"
                alt="Map"
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="p-4 bg-primary/20 backdrop-blur-md rounded-full border border-white/20">
                  <MapPin className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Carte d'Intervention en Direct</h3>
                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs max-w-sm">Visualisez la position des patrouilles et les incidents majeurs en temps réel.</p>
                <Button className="bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest px-8 shadow-xl">
                  Accéder à la carte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory & News */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Bulletins de Vigilance</h2>
              <div className="w-24 h-2 bg-secondary" />
            </div>
            <Button variant="link" className="text-primary font-black uppercase tracking-widest flex items-center gap-2">
              Voir toutes les alertes <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                id: "VIG-042", 
                type: "Alerte Météo", 
                title: "Vigilance Tempête de Sable", 
                text: "Une tempête de sable majeure approche du Grand Senora Desert. Visibilité réduite à moins de 10m. Évitez les déplacements non essentiels.",
                date: "Aujourd'hui, 14:30",
                priority: "High"
              },
              { 
                id: "SEC-891", 
                type: "Sécurité Routière", 
                title: "Opération Contrôle de Vitesse", 
                text: "Déploiement de radars mobiles sur Great Ocean Highway ce week-end. Respectez scrupuleusement les limitations de vitesse.",
                date: "Hier, 09:15",
                priority: "Medium"
              }
            ].map((alert) => (
              <div key={alert.id} className="p-8 bg-slate-900 rounded-3xl relative overflow-hidden group">
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -mr-16 -mt-16 blur-3xl",
                  alert.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'
                )} />
                <div className="flex items-center justify-between mb-6">
                  <Badge className={cn(
                    "font-black tracking-widest uppercase text-[10px]",
                    alert.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'
                  )}>
                    {alert.type}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-500">{alert.date}</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{alert.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8">{alert.text}</p>
                <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                  <Bell className="w-4 h-4" /> ID: {alert.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
