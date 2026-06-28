import { useNavigate } from 'react-router-dom';
import { MDT_SERVICES } from '@/lib/mdt-types';
import { useMdt } from '@/contexts/MdtContext';
import { Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MdtPlaceholderProps {
  title: string;
  description?: string;
}

export default function MdtPlaceholder({ title, description }: MdtPlaceholderProps) {
  const { mdtUser } = useMdt();
  const navigate = useNavigate();
  const service = mdtUser?.service ? MDT_SERVICES[mdtUser.service] : MDT_SERVICES.USSS;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: `${service.color}15` }}
      >
        <Construction className="w-8 h-8" style={{ color: service.color }} />
      </div>
      <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{title}</h1>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest max-w-sm leading-relaxed">
        {description || 'Ce module est en cours de développement. Il sera disponible prochainement.'}
      </p>
      <Button
        variant="outline"
        className="mt-8 border-[#1F2937] text-slate-400 hover:text-white hover:border-slate-600 font-bold uppercase tracking-widest text-xs"
        onClick={() => navigate('/mdt')}
      >
        Retour au Bureau
      </Button>
    </div>
  );
}
