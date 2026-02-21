import { Layout } from "@/components/Layout";
import { useLocation } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Placeholder({ title: propTitle, noLayout = false }: { title?: string, noLayout?: boolean }) {
  const location = useLocation();
  const isIntranet = location.pathname.startsWith('/intranet');
  const path = location.pathname.substring(1);
  const derivedTitle = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  const title = propTitle || derivedTitle;

  const content = (
    <div className={cn("bg-primary/5 py-12 md:py-24", isIntranet ? "min-h-[70vh] rounded-3xl" : "")}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-primary flex items-center justify-center rounded-full text-white mx-auto shadow-xl border-4 border-white">
            <Building2 className="w-12 h-12 md:w-16 md:h-16" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight uppercase">
              {title || "Page en construction"}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Cette section du portail officiel de l'État de San Andreas est actuellement en cours de mise à jour par les services administratifs.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-200 rounded-lg shadow-sm space-y-6">
            <div className="inline-block px-4 py-1.5 bg-secondary text-white text-xs font-black uppercase tracking-widest rounded-full">
              Maintenance Programmée
            </div>
            <p className="text-slate-500 italic">
              Nous nous excusons pour le désagrément. Veuillez revenir prochainement pour accéder aux formulaires et informations officiels.
            </p>

            <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-4">
              <Link to={isIntranet ? "/intranet" : "/"}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 h-auto text-lg rounded-sm uppercase tracking-widest">
                  <ArrowLeft className="mr-2 w-5 h-5" /> {isIntranet ? "Retour au Tableau de Bord" : "Retour à l'accueil"}
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary font-bold px-8 py-6 h-auto text-lg rounded-sm hover:bg-primary/5 uppercase tracking-widest">
                Contacter le support
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { label: "Délai estimé", value: "24-48 heures" },
              { label: "Priorité", value: "Haute" },
              { label: "Statut", value: "Développement" }
            ].map((stat) => (
              <div key={stat.label} className="p-6 bg-slate-100 rounded border border-slate-200">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</span>
                <span className="text-lg font-bold text-primary">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (noLayout || isIntranet) {
    return content;
  }

  return (
    <Layout>
      {content}
    </Layout>
  );
}
