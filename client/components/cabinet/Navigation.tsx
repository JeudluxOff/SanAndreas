import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Scale,
  ChevronLeft,
  Menu as MenuIcon,
  X as XIcon,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/cabinet';

  const navItems = [
    { name: 'Expertise', href: isHome ? '#expertise' : '/cabinet#expertise' },
    { name: 'Équipe', href: isHome ? '#équipe' : '/cabinet#équipe' },
    { name: 'Méthodologie', href: '/cabinet/methodology' },
    { name: 'Honoraires', href: '/cabinet/fees' },
    { name: 'Contact', href: isHome ? '#contact' : '/cabinet#contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#0a0f18]/90 backdrop-blur-md border-b border-white/5 animate-in fade-in slide-in-from-top duration-700">
      {/* Top Bar: Logo & Actions */}
      <div className="container mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-8">
          <Link to="/">
            <Button variant="ghost" className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-[#c1a461] hover:bg-white/5 gap-2 px-0 group">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="hidden md:inline">Retour Portail</span>
            </Button>
          </Link>

          <Link to="/cabinet" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-[#c1a461] to-[#927843] rounded shadow-lg group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-[0.2em] uppercase leading-none">Noxwood <span className="text-[#c1a461]">&</span> Partner</h1>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">Cabinet d'Avocats</p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/cabinet/login">
            <Button variant="ghost" className="text-[10px] font-black text-[#c1a461] uppercase tracking-[0.2em] hover:bg-[#c1a461]/10 gap-2 border border-[#c1a461]/20 px-6 h-10">
              <Lock className="w-3 h-3" /> Accès Avocats
            </Button>
          </Link>
          <Link to="/cabinet/client-login">
            <Button className="bg-[#c1a461] hover:bg-[#927843] text-white font-black uppercase text-[10px] tracking-[0.2em] px-8 h-10 shadow-xl shadow-[#c1a461]/10">
              Portail Client
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-2">
          {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sub-Bar: Navigation Menu */}
      <div className="hidden lg:block bg-white/[0.02]">
        <div className="container mx-auto px-6 h-12 flex items-center justify-center gap-16">
          {navItems.map((item) => (
            item.href.startsWith('#') ? (
              <a
                key={item.name}
                href={item.href}
                className="group relative"
              >
                <span className="text-[10px] font-black text-white/40 hover:text-[#c1a461] uppercase tracking-[0.4em] transition-colors duration-300">
                  {item.name}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c1a461] transition-all duration-300 group-hover:w-full opacity-50" />
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="group relative"
              >
                <span className="text-[10px] font-black text-white/40 hover:text-[#c1a461] uppercase tracking-[0.4em] transition-colors duration-300">
                  {item.name}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c1a461] transition-all duration-300 group-hover:w-full opacity-50" />
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-[#0a0f18] border-b border-white/5 p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
               item.href.startsWith('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]"
                >
                  {item.name}
                </a>
               ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]"
                >
                  {item.name}
                </Link>
               )
            ))}
            <hr className="border-white/5" />
            <Link to="/cabinet/login" className="text-[11px] font-black text-[#c1a461] uppercase tracking-[0.2em]">Accès Avocats</Link>
            <Link to="/cabinet/portal">
              <Button className="w-full bg-[#c1a461] text-white font-black uppercase text-[11px] tracking-[0.2em] h-12">Portail Client</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
