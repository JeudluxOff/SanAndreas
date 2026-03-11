import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  ShieldCheck, 
  Gavel, 
  TrendingUp, 
  HeartPulse, 
  Users, 
  Menu,
  X,
  Search,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Accueil", path: "/", icon: <Building2 className="w-4 h-4" /> },
  { label: "Gouvernement", path: "/gouvernement", icon: <Users className="w-4 h-4" /> },
  { label: "Sécurité", path: "/securite", icon: <ShieldCheck className="w-4 h-4" /> },
  { label: "Justice", path: "/justice", icon: <Gavel className="w-4 h-4" /> },
  { label: "Économie", path: "/economie", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Santé", path: "/sante", icon: <HeartPulse className="w-4 h-4" /> },
  { label: "Services", path: "/services", icon: <Building2 className="w-4 h-4" /> },
  { label: "Espace Employés", path: "/login", icon: <Users className="w-4 h-4" />, isEmployee: true },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { emergencyMode } = useAuth();

  const publicNavItems = navItems.filter(item => !item.isEmployee);
  const employeeItem = navItems.find(item => item.isEmployee);

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans text-slate-900 transition-colors duration-500",
      emergencyMode ? "bg-red-950/20" : "bg-slate-50"
    )}>
      {/* Emergency Mode Overlay/Border */}
      {emergencyMode && (
        <div className="fixed inset-0 pointer-events-none z-[100] border-[12px] border-red-600 animate-emergency-pulse pointer-events-none" />
      )}

      {/* Official Top Bar */}
      <div className={cn(
        "text-white py-1.5 px-4 text-[10px] md:text-xs font-semibold tracking-wide flex items-center justify-center border-b uppercase transition-colors z-[60]",
        emergencyMode ? "bg-red-600 border-red-700 shadow-lg" : "bg-[#1B365D] border-white/10"
      )}>
        <span className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full animate-pulse", emergencyMode ? "bg-white" : "bg-red-500")} />
          {emergencyMode ? "PROTOCOLE D'URGENCE ACTIF — RESTEZ CHEZ VOUS ET ÉCOUTEZ LES CONSIGNES OFFICIELLES" : "Site Officiel de l'État de San Andreas — sanandreas.gov"}
        </span>
      </div>

      {/* Emergency Alert Bar (Marquee) */}
      {emergencyMode && (
        <div className="h-10 bg-red-800 flex items-center justify-center gap-8 overflow-hidden whitespace-nowrap z-[60] shadow-lg border-b border-red-700">
           {Array.from({ length: 10 }).map((_, i) => (
             <div key={i} className="flex items-center gap-4 animate-marquee">
               <ShieldAlert className="w-4 h-4 text-white" />
               <span className="text-white font-black uppercase text-[11px] tracking-[0.2em]">ALERTE ROUGE - COUVRE-FEU IMMÉDIAT - ÉVACUATION DES ZONES À RISQUE - PROTOCOLE GOUVERNEMENTAL ACTIVÉ</span>
             </div>
           ))}
        </div>
      )}

      {/* Header */}
      <header className={cn(
        "border-b sticky top-0 z-50 shadow-sm transition-colors",
        emergencyMode ? "bg-red-900 border-red-800 text-white" : "bg-white border-slate-200"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className={cn(
                "w-12 h-12 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center rounded-full text-white overflow-hidden border-2 shadow-lg transition-transform group-hover:scale-105",
                emergencyMode ? "bg-red-600 border-red-500 animate-pulse" : "bg-primary border-primary"
              )}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F4e331a0ce80644199f9cae8c33fdc854%2F600291090c3f4dfba93193e69d252af7?format=webp&width=800&height=1200"
                  alt="San Andreas Seal"
                  className="w-10 h-10 md:w-14 md:h-14 opacity-90 group-hover:opacity-100"
                />
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-lg md:text-xl font-extrabold leading-tight tracking-tight uppercase",
                  emergencyMode ? "text-white" : "text-primary"
                )}>
                  État de San Andreas
                </span>
                <span className={cn(
                  "text-xs md:text-sm font-semibold tracking-widest uppercase",
                  emergencyMode ? "text-red-400" : "text-secondary"
                )}>
                  {emergencyMode ? "SÉCURITÉ NATIONALE" : "Gouvernement Officiel"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {publicNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 text-sm font-bold transition-all border-b-2 relative",
                    emergencyMode
                      ? (location.pathname === item.path ? "text-white border-white" : "text-red-300 border-transparent hover:text-white hover:border-red-400")
                      : (location.pathname === item.path ? "text-primary border-secondary" : "text-slate-600 border-transparent hover:text-primary hover:border-slate-300")
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {employeeItem && (
                <Link
                  to={employeeItem.path}
                  className={cn(
                    "ml-4 px-4 py-2 text-white text-xs font-bold rounded shadow-md transition-colors uppercase tracking-wider flex items-center gap-2",
                    emergencyMode ? "bg-red-600 hover:bg-red-500 animate-pulse" : "bg-[#1B365D] hover:bg-[#254a7c]"
                  )}
                >
                  {emergencyMode ? <ShieldAlert className="w-4 h-4" /> : employeeItem.icon}
                  {emergencyMode ? "CRISIS CENTER" : employeeItem.label}
                </Link>
              )}

              <div className="ml-2 pl-2 border-l border-slate-200">
                <Button size="icon" variant="ghost" className="text-slate-600">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl overflow-y-auto max-h-[calc(100vh-6rem)]">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg text-base font-bold transition-colors",
                    location.pathname === item.path
                      ? "bg-primary/5 text-primary border-l-4 border-secondary"
                      : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent",
                    item.isEmployee && "bg-slate-900 text-white hover:bg-slate-800"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 mt-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-sm py-6">
                  Rechercher un service
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow relative overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className={cn(
        "text-white pt-16 pb-8 border-t-8 transition-colors",
        emergencyMode ? "bg-red-950 border-red-600" : "bg-primary border-secondary"
      )}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img src="/placeholder.svg" alt="San Andreas Logo" className="w-12 h-12 brightness-0 invert" />
                <div className="flex flex-col">
                  <span className="text-xl font-black uppercase tracking-tighter">San Andreas</span>
                  <span className={cn(
                    "text-xs uppercase tracking-widest",
                    emergencyMode ? "text-red-400" : "text-slate-300"
                  )}>Gouvernement</span>
                </div>
              </div>
              <p className={cn(
                "text-sm leading-relaxed max-w-sm",
                emergencyMode ? "text-red-200" : "text-slate-300"
              )}>
                {emergencyMode
                  ? "CANAL D'INFORMATION D'URGENCE. Toutes les communications publiques sont soumises au protocole de sécurité nationale."
                  : "Le portail officiel du gouvernement de l'État de San Andreas. Votre source d'information directe pour les services publics, la législation et les actualités gouvernementales."}
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 bg-white/10 hover:bg-secondary rounded-full transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 bg-white/10 hover:bg-secondary rounded-full transition-colors">
                  <Users className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-white/20 pb-2 inline-block">Départements</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Justice & Droits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sécurité Publique (LSPD/LSSD)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Santé & SAMS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Développement Économique</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Transports & Infrastructures</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-white/20 pb-2 inline-block">Services Populaires</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Demander un permis de port d'arme</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enregistrer une entreprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Payer une amende judiciaire</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Consulter le Code Pénal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Signaler un incident</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-white/20 pb-2 inline-block">Contact Officiel</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>Palais du Gouverneur, Los Santos, San Andreas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center bg-secondary rounded text-[8px] font-bold">HQ</div>
                  <span>Contactez les services administratifs</span>
                </div>
                <div className="pt-4">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold rounded-sm border-none shadow-lg">
                    Urgence : Composez le 911
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center space-y-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} État de San Andreas — Tous Droits Réservés
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Accessibilité</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions d'Utilisation</a>
              <a href="#" className="hover:text-white transition-colors">Plan du Site</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
