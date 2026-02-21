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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-primary text-white shadow-xl mb-6">
              <Shield className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
              Portail Intranet
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium uppercase tracking-widest">
              Gouvernement de San Andreas
            </p>
            <div className="mt-4">
              <Link to="/" className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-1 uppercase tracking-tighter">
                <ArrowLeft className="w-4 h-4" /> Retour au site public
              </Link>
            </div>
          </div>

          <Card className="border-t-4 border-primary shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Accès Sécurisé
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
                  className="w-full h-12 bg-primary hover:bg-[#1B365D]/90 text-white font-bold text-lg uppercase tracking-wider transition-all shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "S'identifier"}
                </Button>
              </form>

              <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-xs text-slate-600 space-y-3">
                    <p className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1 text-[10px] tracking-widest">Identifiants de Test (Mots de passe : admin)</p>
                    <div className="grid grid-cols-2 gap-2">
                      <p><code className="bg-slate-200 px-1 py-0.5 rounded">governor</code> (Gov.)</p>
                      <p><code className="bg-slate-200 px-1 py-0.5 rounded">lt_governor</code> (Lt.)</p>
                      <p><code className="bg-slate-200 px-1 py-0.5 rounded">sec_etat</code> (Admin)</p>
                      <p><code className="bg-slate-200 px-1 py-0.5 rounded">sec_securite</code> (Sécu.)</p>
                      <p><code className="bg-slate-200 px-1 py-0.5 rounded">press</code> (Presse)</p>
                      <p><code className="bg-slate-200 px-1 py-0.5 rounded">sec_justice</code> (Just.)</p>
                      <p><code className="bg-slate-200 px-1 py-0.5 rounded">sec_sante</code> (Santé)</p>
                      <p><code className="bg-slate-200 px-1 py-0.5 rounded">sec_tresor</code> (Éco.)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 py-4 flex flex-col items-center gap-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center">
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
