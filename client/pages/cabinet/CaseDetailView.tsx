import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Calendar, User, Lock, TrendingUp, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { legalStore } from '@/lib/legal-store';

const CaseDetailView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { caseId } = useParams();

  const caseData = legalStore.getCase(caseId || '');
  const client = caseData ? legalStore.getClient(caseData.client_id) : null;
  const documents = legalStore.getDocuments(caseId).filter(d => d.status !== 'Archivé');
  const staff = legalStore.getStaff();
  const lead = caseData && staff.find(s => s.id === caseData.lead_id);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[#0a0f18] p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-white font-bold text-lg">Dossier non trouvé</p>
          <Button onClick={() => navigate('/cabinet/portal')} className="bg-[#c1a461]">
            Retour au Portail
          </Button>
        </div>
      </div>
    );
  }

  // Simulate timeline events based on case data
  const timelineEvents = [
    {
      date: caseData.created_at,
      action: `Dossier créé: ${caseData.title}`,
      status: 'completed'
    },
    ...(caseData.step_description ? [{
      date: caseData.updated_at,
      action: caseData.step_description,
      status: 'completed' as const
    }] : []),
    {
      date: new Date(new Date(caseData.updated_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      action: `Prochaine audience: Cour ${caseData.type}`,
      status: 'pending' as const
    }
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-[#0a0f18] text-white">
      {/* Header */}
      <div className="border-b border-white/5 p-6 md:p-10 sticky top-0 z-40 bg-[#0a0f18]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/cabinet/portal')}
            className="text-white/40 hover:text-white p-0 h-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight flex-1">{caseData.title}</h1>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Badge className={cn(
              "font-black tracking-widest uppercase text-[8px] px-3 py-1",
              caseData.status === 'En cours' ? 'bg-emerald-600' :
              caseData.status === 'En attente' ? 'bg-amber-600' :
              caseData.status === 'Clos' ? 'bg-blue-600' :
              'bg-slate-600'
            )}>
              {caseData.status}
            </Badge>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{caseData.id}</span>
          </div>

          <div className="flex items-center gap-6 text-[9px] font-black text-white/60 uppercase tracking-widest">
            <div>Type: <span className="text-white">{caseData.type}</span></div>
            <div>Confidentialité: <span className={cn(
              caseData.confidentiality === 'Secret' ? 'text-red-400' :
              caseData.confidentiality === 'Confidentiel' ? 'text-amber-400' :
              'text-emerald-400'
            )}>{caseData.confidentiality}</span></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        {/* Case Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Case Details Card */}
          <Card className="md:col-span-2 border-white/10 bg-white/5 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/60">Détails du Dossier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {caseData.description && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Description</p>
                  <p className="text-sm text-white/80 leading-relaxed">{caseData.description}</p>
                </div>
              )}

              {client && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Client</p>
                  <p className="text-sm font-bold text-white">{client.name}</p>
                  {client.email && <p className="text-[10px] text-white/60">{client.email}</p>}
                </div>
              )}

              {lead && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Responsable</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#c1a461]/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#c1a461]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{lead.name}</p>
                      <p className="text-[9px] text-white/60">{lead.role}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Créé le</p>
                  <p className="text-[10px] font-bold text-white mt-1">{new Date(caseData.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Modifié le</p>
                  <p className="text-[10px] font-bold text-white mt-1">{new Date(caseData.updated_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-white/10 bg-white/5 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/60">Progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold uppercase text-white/60">
                  <span>Avancement</span>
                  <span className="text-[#c1a461]">{caseData.progression || 45}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c1a461] rounded-full transition-all"
                    style={{ width: `${caseData.progression || 45}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2 text-[9px]">
                <div className="flex items-center gap-2 text-white/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dossier actif</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="w-4 h-4 text-white/40" />
                  <span>En cours de traitement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#c1a461]" /> Chronologie
          </h2>

          <div className="space-y-4">
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="flex gap-6 relative">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 border-white/20 transition-all",
                    event.status === 'completed' ? 'bg-[#c1a461] border-[#c1a461]' : 'bg-transparent'
                  )} />
                  {idx < timelineEvents.length - 1 && <div className="h-16 w-px bg-white/10" />}
                </div>

                <div className="flex-1 pb-8">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">
                    {new Date(event.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <Card className="border-white/10 bg-white/5">
                    <CardContent className="p-4">
                      <p className="text-sm font-bold text-white">{event.action}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        {documents.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c1a461]" /> Documents ({documents.length})
            </h2>

            <div className="grid gap-4">
              {documents.map(doc => (
                <Card key={doc.id} className="border-white/10 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#c1a461]/10 rounded-lg">
                        <FileText className="w-5 h-5 text-[#c1a461]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase text-white truncate">{doc.title}</p>
                        <p className="text-[9px] font-bold text-white/40 mt-1">{doc.category} • {doc.status}</p>
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-white text-[8px] font-black uppercase shrink-0">
                      v{doc.current_version}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CaseDetailView;
