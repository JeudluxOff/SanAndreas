import { Layout } from "@/components/Layout";
import { Users, UserCheck, Shield, Scale, TrendingUp, HeartPulse, MessageSquare, Gavel, ShieldAlert, Landmark, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGovernmentStore } from "@/hooks/useGovernmentStore";

const roleToIcon: Record<string, any> = {
  "Gouverneur": <UserCheck className="w-5 h-5" />,
  "Lieutenant-Gouverneur": <UserCheck className="w-5 h-5" />,
  "Secrétaire d'État Général": <Scale className="w-5 h-5" />,
  "Secrétaire à la Sécurité": <Shield className="w-5 h-5" />,
  "Press Secretary": <MessageSquare className="w-5 h-5" />,
  "Secrétaire à la Santé": <HeartPulse className="w-5 h-5" />,
  "Secrétaire Justice": <Gavel className="w-5 h-5" />,
  "Secrétaire S.I.": <ShieldAlert className="w-5 h-5" />,
  "Secrétaire Trésor": <Landmark className="w-5 h-5" />,
  "Secrétaire Travail": <Construction className="w-5 h-5" />
};

export default function Gouvernement() {
  const store = useGovernmentStore();
  const employees = store.getEmployees();

  // Filtrer pour n'afficher que le cabinet (rôles de haut niveau)
  const cabinetMembers = employees.filter(e =>
    ["Gouverneur", "Lieutenant-Gouverneur", "Cabinet", "Secrétaire", "Exécutif"].includes(e.grade) ||
    ["Gouverneur", "Press Secretary", "Lieutenant-Gouverneur"].includes(e.role)
  ).map(e => ({
    role: e.role,
    name: e.name,
    image: e.image || "/placeholder.svg",
    description: e.description || `Membre officiel du Gouvernement de San Andreas au sein du service ${e.service}.`,
    icon: roleToIcon[e.role] || <UserCheck className="w-5 h-5" />
  }));

  return (
    <Layout>
      <div className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none transform -rotate-12 scale-150">
          <img src="/placeholder.svg" alt="Pattern" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none border-l-8 border-secondary pl-8">
              Le Gouvernement <br /> <span className="text-secondary">de San Andreas</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl">
              Une administration dévouée au service du public, assurant la stabilité et la prospérité de notre État à travers une gouvernance transparente.
            </p>
          </div>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-20 space-y-4 max-w-3xl">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Le Cabinet Exécutif</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3">
              <Users className="w-5 h-5 text-secondary" />
              L'Équipe Dirigeante de l'État
            </p>
            <div className="w-24 h-2 bg-secondary" />
            <p className="text-slate-600 text-lg pt-4">
              Le Cabinet est composé des chefs des principaux départements de l'État. Ils travaillent de concert avec le Gouverneur pour mettre en œuvre les politiques et gérer les services essentiels aux citoyens de San Andreas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {cabinetMembers.map((member) => (
              <div key={member.name} className="group flex flex-col h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-white text-[10px] font-black uppercase tracking-widest mb-2 shadow-lg">
                      {member.icon}
                      {member.role}
                    </span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{member.name}</h3>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow bg-white border-t border-slate-100">
                  <p className="text-slate-600 leading-relaxed font-medium mb-8 italic">
                    "{member.description}"
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest px-4">
                      Biographie Officielle
                    </Button>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-secondary transition-colors" />
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles and responsibilities section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Rôles & Responsabilités</h2>
                <div className="w-24 h-1 bg-secondary" />
              </div>
              
              <div className="space-y-8">
                {[
                  { title: "Exécution des Lois", desc: "Assurer que toutes les lois de l'État sont appliquées de manière juste et équitable dans tous les comtés." },
                  { title: "Budgétisation", desc: "Allouer les ressources financières de manière responsable pour les services essentiels et les infrastructures." },
                  { title: "Représentation", desc: "Servir de voix officielle pour les intérêts de San Andreas au niveau fédéral et international." },
                  { title: "Crise & Urgence", desc: "Coordonner les réponses rapides en cas de catastrophes naturelles ou de menaces à la sécurité publique." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-primary/10 rounded-full flex items-center justify-center font-black text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-primary uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] transform translate-x-4 translate-y-4" />
              <div className="relative bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">Organigramme de l'Administration</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Structure Hiérarchique 2024</p>
                </div>
                
                <div className="flex flex-col gap-4 items-center">
                  <div className="w-full p-4 bg-primary text-white text-center rounded font-black uppercase text-sm border-b-4 border-secondary shadow-lg">Gouverneur Miller</div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="w-full p-4 bg-white border-2 border-primary/20 text-primary text-center rounded font-black uppercase text-xs shadow-sm">Cabinet Exécutif</div>
                  <div className="grid grid-cols-2 gap-4 w-full pt-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 text-center rounded font-bold uppercase text-[9px] text-slate-500">Agences de Sécurité</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 text-center rounded font-bold uppercase text-[9px] text-slate-500">Santé & Services Humains</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 text-center rounded font-bold uppercase text-[9px] text-slate-500">Département Justice</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 text-center rounded font-bold uppercase text-[9px] text-slate-500">Sécurité Intérieure</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 text-center rounded font-bold uppercase text-[9px] text-slate-500">Trésor & Commerce</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 text-center rounded font-bold uppercase text-[9px] text-slate-500">Département du Travail</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 text-center rounded font-bold uppercase text-[9px] text-slate-500">Service de Presse</div>
                  </div>
                </div>
                
                <div className="pt-8 text-center">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase py-6">
                    Télécharger l'Organigramme complet (PDF)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter leading-none">Participez à la vie de <br /> l'État de San Andreas</h2>
            <div className="w-24 h-2 bg-secondary mx-auto" />
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-12 rounded-sm border-b-4 border-slate-900 shadow-xl">
              Devenir Employé de l'État
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary font-bold px-12 rounded-sm hover:bg-primary/5">
              Assister à une session plénière
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
