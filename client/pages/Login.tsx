import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Lock, User as UserIcon, AlertCircle, Info, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Layout } from "@/components/Layout";
import { cn } from "@/lib/utils";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, emergencyMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/intranet");
      } else {
        setError("Identifiant ou mot de passe incorrect.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className={cn(
        "min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500",
        emergencyMode ? "bg-red-950/20" : "bg-slate-50"
      )}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className={cn(
              "mx-auto h-20 w-20 flex items-center justify-center rounded-full text-white shadow-xl mb-6 transition-colors",
              emergencyMode ? "bg-red-600 animate-pulse" : "bg-primary"
            )}>
              <Shield className="h-10 w-10" />
            </div>
            <h2 className={cn(
              "text-3xl font-extrabold tracking-tight uppercase transition-colors",
              emergencyMode ? "text-white" : "text-slate-900"
            )}>
              {emergencyMode ? "PORTAIL DE CRISE" : "Portail Intranet"}
            </h2>
            <p className={cn(
              "mt-2 text-sm font-medium uppercase tracking-widest transition-colors",
              emergencyMode ? "text-red-400" : "text-slate-600"
            )}>
              {emergencyMode ? "ACCÈS RESTREINT - AUTHENTIFICATION CRITIQUE" : "Gouvernement de San Andreas"}
            </p>
            <div className="mt-4">
              <Link to="/" className={cn(
                "text-sm font-bold hover:underline flex items-center justify-center gap-1 uppercase tracking-tighter transition-colors",
                emergencyMode ? "text-red-300" : "text-primary"
              )}>
                <ArrowLeft className="w-4 h-4" /> Retour au site public
              </Link>
            </div>
          </div>

          <Card className={cn(
            "border-t-4 shadow-2xl transition-colors",
            emergencyMode ? "border-red-600 bg-red-950/40" : "border-primary"
          )}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className={cn(
                "text-xl font-bold text-center flex items-center justify-center gap-2 transition-colors",
                emergencyMode ? "text-white" : "text-slate-900"
              )}>
                <Lock className={cn("w-5 h-5", emergencyMode ? "text-red-500" : "text-primary")} />
                {emergencyMode ? "IDENTIFICATION SÉCURISÉE (CRÉDIT COUVERT)" : "Accès Sécurisé"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur d'authentification</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Identifiant Employé</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Identifiant"
                      className="pl-10 h-12 border-slate-300 focus:ring-primary focus:border-primary"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-slate-300 focus:ring-primary focus:border-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn(
                    "w-full h-12 text-white font-bold text-lg uppercase tracking-wider transition-all shadow-lg",
                    emergencyMode ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-[#1B365D]/90"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (emergencyMode ? "CRYPTAGE EN COURS..." : "Connexion en cours...") : "S'identifier"}
                </Button>
              </form>

              <div className={cn(
                "mt-8 p-4 border rounded-lg transition-colors",
                emergencyMode ? "bg-red-900/30 border-red-800" : "bg-slate-50 border-slate-200"
              )}>
                <div className="flex gap-3">
                  <Info className={cn("w-5 h-5 flex-shrink-0", emergencyMode ? "text-red-400" : "text-blue-600")} />
                  <div className={cn("text-xs space-y-3", emergencyMode ? "text-red-200" : "text-slate-600")}>
                    <p className={cn(
                      "font-bold uppercase border-b pb-1 text-[10px] tracking-widest",
                      emergencyMode ? "text-white border-red-800" : "text-slate-900 border-slate-200"
                    )}>Identifiants de Test (Mots de passe : admin)</p>
                    <div className="grid grid-cols-2 gap-2">
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200 text-blue-700")}>admin</code> (Accès Total)</p>
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200")}>governor</code> (Gov.)</p>
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200")}>lt_governor</code> (Lt.)</p>
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200")}>sec_etat</code> (Admin)</p>
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200")}>sec_securite</code> (Sécu.)</p>
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200")}>press</code> (Presse.)</p>
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200")}>sec_justice</code> (Just.)</p>
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200")}>sec_sante</code> (Santé)</p>
                      <p><code className={cn("px-1 py-0.5 rounded", emergencyMode ? "bg-red-800 text-white" : "bg-slate-200")}>sec_tresor</code> (Éco.)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className={cn(
              "border-t py-4 flex flex-col items-center gap-2 transition-colors",
              emergencyMode ? "bg-red-900/50 border-red-900" : "bg-slate-50 border-slate-100"
            )}>
              <p className={cn(
                "text-[10px] uppercase font-bold tracking-widest text-center transition-colors",
                emergencyMode ? "text-red-400" : "text-slate-400"
              )}>
                Système sous surveillance — Toute tentative d'accès non autorisée est passible de poursuites judiciaires.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
