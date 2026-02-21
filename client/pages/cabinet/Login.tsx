import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Lock, ShieldCheck, ArrowRight, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function CabinetLogin() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/cabinet/intranet');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#c1a461] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <Link to="/cabinet" className="inline-flex items-center gap-3 group">
            <div className="p-3 bg-[#c1a461] rounded-2xl shadow-2xl shadow-[#c1a461]/20 group-hover:scale-110 transition-transform">
              <Scale className="w-8 h-8 text-white" />
            </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em]">Accès Sécurisé</h1>
            <p className="text-[10px] font-bold text-[#c1a461] uppercase tracking-[0.4em]">Harrington & Cole — Intranet Avocats</p>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-12 rounded-[40px] shadow-2xl space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="flex justify-center">
            <div className="p-4 bg-white/5 rounded-full border border-white/10">
              <Fingerprint className="w-10 h-10 text-[#c1a461]" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Identifiant Professionnel</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="j.harrington@harrington-cole.sa" 
                  className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-white/10 focus:ring-[#c1a461]/20 focus:border-[#c1a461]/40 transition-all font-medium"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Clé de Chiffrement</Label>
                  <button type="button" className="text-[9px] font-black text-[#c1a461] uppercase tracking-widest hover:text-white transition-colors">Oubliée ?</button>
                </div>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-white/10 focus:ring-[#c1a461]/20 focus:border-[#c1a461]/40 transition-all"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-xs tracking-[0.2em] h-16 rounded-2xl shadow-xl shadow-[#c1a461]/10 gap-3 group">
              Authentification <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
              Cet espace est strictement réservé aux membres assermentés du cabinet. <br />
              Toute tentative d'accès non autorisée est enregistrée et transmise au Parquet.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
          <Link to="/" className="hover:text-white transition-colors">Portail État</Link>
          <Link to="/cabinet/portal" className="hover:text-white transition-colors">Portail Client</Link>
          <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> Chiffrement AES-256</span>
        </div>
      </div>
    </div>
  );
}
