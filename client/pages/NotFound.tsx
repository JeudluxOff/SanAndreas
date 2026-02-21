import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Search, Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="bg-slate-50 py-24 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="relative inline-block">
              <div className="text-[12rem] font-black text-slate-200 leading-none">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertTriangle className="w-24 h-24 text-secondary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-primary uppercase tracking-tighter">
                Erreur Administrative : Page Introuvable
              </h1>
              <p className="text-xl text-slate-500 font-medium">
                Le document ou la ressource que vous recherchez n'existe pas ou a été déplacé par les services administratifs de l'État.
              </p>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-lg shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Link to="/">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 h-auto text-lg rounded-sm">
                    <Home className="mr-2 w-5 h-5" /> Retour à l'accueil
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2 border-primary text-primary font-bold px-8 py-6 h-auto text-lg rounded-sm hover:bg-primary/5">
                  <Search className="mr-2 w-5 h-5" /> Rechercher sur le site
                </Button>
              </div>
            </div>

            <div className="pt-8 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
              Code d'erreur : ERR_PAGE_NOT_FOUND_SA_GOV
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
