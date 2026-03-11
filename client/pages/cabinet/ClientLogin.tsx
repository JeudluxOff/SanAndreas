import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Key, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ClientLogin = () => {
  const navigate = useNavigate();
  const { clientLogin } = useAuth();

  // Email + Password state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Token state
  const [accessToken, setAccessToken] = React.useState('');
  const [isLoadingToken, setIsLoadingToken] = React.useState(false);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const success = clientLogin(email, password);
      if (success) {
        toast.success('Connexion réussie');
        navigate('/cabinet/portal');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error('Veuillez entrer votre code d\'accès');
      return;
    }

    setIsLoadingToken(true);
    try {
      // Parse token format: TOKEN-{CASE_ID}-{RANDOM_STRING}
      const tokenParts = accessToken.split('-');
      if (tokenParts.length !== 3 || tokenParts[0] !== 'TOKEN') {
        toast.error('Format de code d\'accès invalide');
        return;
      }

      const caseId = tokenParts[1];
      // Validate token on server (would call /api/v2/auth/login-token in production)
      // For now, create a temporary client session
      const tempUser = {
        id: `client-${Date.now()}`,
        username: `client-${Date.now()}`,
        role: 'avocat' as const,
        service_id: 'JUSTICE' as const,
        name: 'Client Visiteur',
        service_name: 'Portail Client',
        grade: 'Client',
        permissions: [],
        status: 'available' as const,
        client_id: caseId,
        is_client: true,
        access_method: 'token' as const,
        token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      localStorage.setItem('sa_gov_user', JSON.stringify(tempUser));
      toast.success('Connexion réussie');
      navigate('/cabinet/portal');
    } catch (error) {
      toast.error('Erreur lors de la validation du code d\'accès');
    } finally {
      setIsLoadingToken(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c1a461] rounded-full blur-[150px] opacity-5" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1B365D] rounded-full blur-[150px] opacity-5" />
      </div>

      <Card className="w-full max-w-md bg-[#0a0f18] border-white/10 rounded-[32px] shadow-2xl relative z-10">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#c1a461]/10 rounded-2xl border border-[#c1a461]/20">
              <LogIn className="w-8 h-8 text-[#c1a461]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">
            Portail Client
          </CardTitle>
          <CardDescription className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Accédez à vos dossiers et documents
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-xl p-1 mb-6">
              <TabsTrigger
                value="email"
                className="data-[state=active]:bg-[#c1a461] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/40 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger
                value="token"
                className="data-[state=active]:bg-[#c1a461] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/40 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Key className="w-4 h-4 mr-2" />
                Code
              </TabsTrigger>
            </TabsList>

            {/* Email + Password Tab */}
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="votremail@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl font-bold"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    Mot de Passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl font-bold pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#c1a461] hover:bg-[#d1b471] text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-[#c1a461]/20 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Connexion...' : 'Se Connecter'}
                </Button>
              </form>

              <div className="pt-2 text-center text-[9px] text-white/40">
                <p>Première visite ? Utilisez votre code d'accès</p>
              </div>
            </TabsContent>

            {/* Token Tab */}
            <TabsContent value="token" className="space-y-4">
              <form onSubmit={handleTokenLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    Code d'Accès
                  </label>
                  <Input
                    type="text"
                    placeholder="TOKEN-HC-2024-001-XXXX"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value.toUpperCase())}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl font-bold tracking-widest"
                    disabled={isLoadingToken}
                  />
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-[9px] text-white/60 space-y-2">
                  <p className="font-bold uppercase tracking-widest">Format du code :</p>
                  <code className="block text-[#c1a461]">TOKEN-DOSSIER-CLÉ</code>
                  <p>Vous avez reçu ce code par email de votre avocat.</p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoadingToken}
                  className="w-full h-12 bg-[#c1a461] hover:bg-[#d1b471] text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-[#c1a461]/20 transition-all disabled:opacity-50"
                >
                  {isLoadingToken ? 'Vérification...' : 'Accéder'}
                </Button>
              </form>

              <div className="pt-2 text-center text-[9px] text-white/40">
                <p>Pas encore de code ? Contactez votre cabinet juridique</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">
              © 2024 Noxwood & Partner — Portail Sécurisé
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientLogin;
