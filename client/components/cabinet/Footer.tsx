import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Shield, 
  Mail, 
  Phone, 
  MapPin
} from 'lucide-react';

export const Footer = () => (
  <footer id="contact" className="bg-[#0a0f18] pt-32 pb-12 text-white border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <div className="space-y-8">
          <Link to="/cabinet" className="flex items-center gap-3">
            <div className="p-2 bg-[#c1a461] rounded shadow-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-white tracking-[0.2em] uppercase leading-none">Noxwood <span className="text-[#c1a461]">&</span> Partner</h1>
          </Link>
          <p className="text-sm text-white/40 font-medium leading-relaxed uppercase tracking-tight">
            L'excellence juridique au service des intérêts les plus sensibles de San Andreas.
          </p>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#c1a461] hover:border-[#c1a461] transition-all cursor-pointer">
                <Shield className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.4em]">Expertises</h4>
          <ul className="space-y-4">
            {[
              { name: 'Pénal', href: '/cabinet/criminal-law' },
              { name: 'Civil', href: '/cabinet/civil-law' },
              { name: 'Affaires', href: '/cabinet/business-law' },
              { name: 'Administratif', href: '/cabinet/administrative-law' }
            ].map(item => (
              <li key={item.name}>
                <Link to={item.href} className="text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors">
                  Droit {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.4em]">Cabinet</h4>
          <ul className="space-y-4">
            {[
              { name: 'Équipe', href: '/cabinet#équipe' },
              { name: 'Méthodologie', href: '/cabinet/methodology' },
              { name: 'Honoraires', href: '/cabinet/fees' }
            ].map(item => (
              <li key={item.name}>
                {item.href.startsWith('#') ? (
                  <a href={item.href} className="text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors">
                    {item.name}
                  </a>
                ) : (
                  <Link to={item.href} className="text-[11px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.4em]">Siège Social</h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#c1a461]" />
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                442 Rockwell Avenue <br />
                Financial District, Los Santos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-[#c1a461]" />
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">555-010-942</p>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-[#c1a461]" />
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">contact@noxwood-partner.sa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
        <p>© 2024 Noxwood & Partner. Tous droits réservés.</p>
        <div className="flex gap-8">
          <span className="hover:text-white transition-colors cursor-pointer">Mentions Légales</span>
          <span className="hover:text-white transition-colors cursor-pointer">Politique de Confidentialité</span>
          <span className="hover:text-white transition-colors cursor-pointer">Déontologie</span>
        </div>
      </div>
    </div>
  </footer>
);
