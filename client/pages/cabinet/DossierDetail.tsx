import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  ChevronLeft, 
  Clock, 
  Users, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  MoreVertical, 
  Plus, 
  Lock,
  ArrowRight,
  Download,
  History,
  CheckCircle2,
  AlertTriangle,
  Gavel,
  MessageSquare,
  UserPlus,
  Send,
  Eye,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { Case, LegalDocument, Evidence, Task, Hearing } from '@shared/api';

const DossierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');
  
  const dossier = legalStore.getCase(id || '');
  const [localStatus, setLocalStatus] = React.useState<string>(dossier?.status || '');
  const docs = legalStore.getDocuments(id);
  const evidence = legalStore.getEvidence(id || '');
  const tasks = legalStore.getTasks(id);
  const hearings = legalStore.getHearings().filter(h => h.case_id === id);
  const client = dossier ? legalStore.getClient(dossier.client_id) : null;
  const auditLogs = legalStore.getAuditLogs().filter(log => log.target_id === id);

  const handleSeal = () => {
    if (!id || !user) return;
    legalStore.sealCase(id, user.id);
    setLocalStatus('Scellé');
    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Scellement Dossier',
      target_type: 'Case',
      target_id: id,
      metadata: { reason: 'Demande manuelle de scellement' }
    });
  };

  const handleClose = () => {
    if (!id || !user) return;
    legalStore.closeCase(id, user.id);
    setLocalStatus('Clos');
    legalStore.logAction({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action: 'Clôture Dossier',
      target_type: 'Case',
      target_id: id,
      metadata: { reason: 'Affaire terminée' }
    });
  };

  // Security check for Sealed cases
  React.useEffect(() => {
    if (dossier?.confidentiality === 'Scellé') {
      if (user?.role !== 'admin' && user?.role !== 'gouverneur') {
        navigate('/cabinet/intranet/dossiers');
        return;
      }
      
      // Log access to sealed dossier
      if (user) {
        legalStore.logAction({
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user_id: user.id,
          user_name: user.name,
          action: 'Accès Dossier Scellé',
          target_type: 'Case',
          target_id: dossier.id,
          metadata: { reason: 'Consultation dossier scellé' }
        });
      }
    }
  }, [dossier, user, navigate]);

  if (!dossier) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-black uppercase tracking-widest text-slate-400">Dossier non trouvé</h2>
      <Link to="/cabinet/intranet/dossiers">
        <Button variant="link" className="text-[#c1a461] uppercase mt-4">Retour aux dossiers</Button>
      </Link>
    </div>
  );

  return (
    <div className="p-10 space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/cabinet/intranet/dossiers">
              <Button variant="ghost" className="h-12 w-12 rounded-2xl border border-slate-200 text-slate-400 hover:text-[#c1a461]">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{dossier.id}</span>
                <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0", 
                  dossier.confidentiality === 'Scellé' ? 'bg-[#0a0f18] text-white' :
                  dossier.confidentiality === 'Secret' ? 'bg-red-600 text-white' :
                  dossier.confidentiality === 'Confidentiel' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                )}>
                  {dossier.confidentiality}
                </Badge>
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{dossier.title}</h2>
            </div>
          </div>
          
          <div className="flex gap-4">
            {localStatus !== 'Scellé' && localStatus !== 'Clos' && (
               <Button
                onClick={handleSeal}
                variant="outline"
                className="border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest h-12 px-6 gap-2 hover:bg-red-50"
               >
                 <Lock className="w-4 h-4" /> Sceller Dossier
               </Button>
            )}
            {localStatus !== 'Clos' && (
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest h-12 px-6 gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Clôturer Dossier
              </Button>
            )}
            <Button className="bg-[#0a0f18] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 gap-2 shadow-xl shadow-black/10">
              Actions Dossier <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-slate-100">
          <div className="flex gap-12 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'documents', label: 'Documents' },
              { id: 'evidence', label: 'Preuves (Vault)' },
              { id: 'timeline', label: 'Timeline & Logs' },
              { id: 'billing', label: 'Honoraires' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all whitespace-nowrap",
                  activeTab === tab.id ? "text-[#c1a461]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#c1a461] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8 space-y-10">
            {activeTab === 'overview' && (
              <>
                {/* Status & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white border-none shadow-md p-6 rounded-[32px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Statut Actuel</p>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full animate-pulse",
                        localStatus === 'Clos' ? 'bg-slate-400' :
                        localStatus === 'Scellé' ? 'bg-red-600' : 'bg-[#c1a461]'
                      )} />
                      <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{localStatus}</p>
                    </div>
                  </Card>
                  <Card className="bg-white border-none shadow-md p-6 rounded-[32px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pôle Juridique</p>
                    <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{dossier.type}</p>
                  </Card>
                  <Card className="bg-[#0a0f18] text-white border-none shadow-xl p-6 rounded-[32px]">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 text-center">Progression</p>
                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                         <span className="text-[9px] font-bold text-[#c1a461] uppercase tracking-widest">Étape 3/4</span>
                         <span className="text-lg font-black tracking-tight">85%</span>
                       </div>
                       <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-[#c1a461]" style={{ width: '85%' }} />
                       </div>
                    </div>
                  </Card>
                </div>

                {/* Upcoming Hearings */}
                <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <Gavel className="w-5 h-5 text-[#c1a461]" /> Audiences & Calendrier
                    </CardTitle>
                    <Button variant="ghost" className="text-[10px] font-black uppercase text-[#c1a461]">+ Ajouter</Button>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    {hearings.length > 0 ? hearings.map((h, idx) => (
                      <div key={idx} className="flex gap-8 items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="text-center bg-slate-900 text-white rounded-2xl p-4 min-w-[80px]">
                          <p className="text-2xl font-black leading-none">{new Date(h.date).getDate()}</p>
                          <p className="text-[10px] font-bold uppercase mt-1">
                            {new Date(h.date).toLocaleString('default', { month: 'short' })}
                          </p>
                        </div>
                        <div className="flex-grow space-y-1">
                          <p className="text-lg font-black uppercase text-slate-900 leading-tight">{h.title}</p>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>📍 {h.location}</span>
                            <span>⚖️ {h.judge}</span>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 text-white font-black uppercase text-[9px] px-4 py-1.5">{h.status}</Badge>
                      </div>
                    )) : (
                       <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Aucune audience programmée</p>
                       </div>
                    )}
                  </CardContent>
                </Card>

                {/* Latest Activity Preview */}
                <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#c1a461]" /> Activité Récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                      {auditLogs.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c1a461]" />
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{item.action}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                {item.user_name} • {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 border-t border-slate-50 text-center">
                       <Button variant="link" className="text-[10px] font-black uppercase text-[#c1a461] tracking-widest" onClick={() => setActiveTab('timeline')}>
                         Voir tout l'historique d'audit
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Index Documentaire</h3>
                  <Button className="bg-[#c1a461] text-white text-[10px] font-black uppercase h-10 px-6">+ Nouveau</Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {docs.map((doc, idx) => (
                    <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all group p-6 rounded-[24px]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-black text-slate-900 uppercase tracking-tight">{doc.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.id} • Version {doc.current_version}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1", 
                            doc.status === 'Signé' ? 'bg-emerald-600 text-white' : 
                            doc.status === 'Validé' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                          )}>
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                            <Download className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {docs.length === 0 && (
                     <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Aucun document lié</p>
                     </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-white p-10 rounded-[40px] bg-[#0a0f18] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Evidence Vault Access</h3>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Zone hautement sécurisée • Chiffrement AES-256</p>
                  </div>
                  <Button className="relative z-10 bg-[#c1a461] hover:bg-[#927843] text-white text-[10px] font-black uppercase h-12 px-8 rounded-xl shadow-2xl">
                    Déposer Preuve
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {evidence.map((evi, idx) => (
                    <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all p-8 rounded-[32px] bg-white group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-[#c1a461] transition-colors">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                        <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5", 
                          evi.confidentiality === 'Secret' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                        )}>
                          {evi.confidentiality}
                        </Badge>
                      </div>
                      <div className="space-y-1 mb-6">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{evi.type}</p>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight">{evi.name}</h4>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                        <span className="text-[10px] font-black text-slate-300 uppercase">{evi.id}</span>
                        <div className="flex gap-2">
                           {evi.to_produce_at_hearing && <Badge className="bg-red-50 text-red-600 border-red-100 text-[8px] uppercase">À produire</Badge>}
                           <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#c1a461]">
                             <Download className="w-5 h-5" />
                           </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {evidence.length === 0 && (
                     <div className="col-span-2 p-10 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Aucune preuve enregistrée</p>
                     </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
               <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden">
                 <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/50">
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <History className="w-5 h-5 text-[#c1a461]" /> Historique d'Audit & Timeline
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-8">
                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                       {auditLogs.length > 0 ? auditLogs.map((log, idx) => (
                         <div key={idx} className="relative pl-10">
                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#c1a461]" />
                            </div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</p>
                               <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.action}</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Effectué par : {log.user_name}</p>
                               {log.metadata && (
                                  <div className="mt-2 p-3 bg-slate-50 rounded-xl text-[9px] font-mono text-slate-500">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </div>
                               )}
                            </div>
                         </div>
                       )) : (
                          <p className="text-center py-10 text-slate-400 text-[10px] uppercase font-black">Aucun log disponible</p>
                       )}
                    </div>
                 </CardContent>
               </Card>
            )}
          </div>

          {/* Right Column (Sidebar Stats & Members) */}
          <div className="lg:col-span-4 space-y-10">
            {/* Team Members Section */}
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#c1a461]" /> Équipe Assignée
                </CardTitle>
                <UserPlus className="w-4 h-4 text-slate-300 hover:text-[#c1a461] cursor-pointer transition-colors" />
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {dossier.members.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 ring-2 ring-slate-100">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar || member.user_id}`} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{member.name}</p>
                      <p className="text-[9px] font-bold text-[#c1a461] uppercase tracking-widest">{member.role}</p>
                    </div>
                    {member.user_id === dossier.lead_id && <Badge className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase px-2 py-0 border-none">LEAD</Badge>}
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 border-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl">
                  Gérer les Accès ACL
                </Button>
              </CardContent>
            </Card>

            {/* Client Card */}
            <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
               <CardHeader className="p-8 border-b border-slate-50">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#c1a461]" /> Information Client
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Principal</p>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">{client?.name || 'Inconnu'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-bold text-slate-600 uppercase">{client?.type}</p>
                  </div>
                  <Button variant="outline" className="w-full mt-2 border-slate-200 text-[9px] font-black uppercase tracking-widest h-10 px-4">
                     Fiche Client Complète
                  </Button>
               </CardContent>
            </Card>

            {/* Quick Communication Tool */}
            <Card className="border-none shadow-xl rounded-[32px] bg-slate-900 text-white overflow-hidden">
              <CardHeader className="p-8 bg-[#c1a461]/10 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#c1a461]" /> Notes Internes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-8 space-y-6 max-h-[300px] overflow-y-auto">
                   <p className="text-[9px] font-bold text-white/30 uppercase text-center py-4">Fin de la conversation</p>
                </div>
                <div className="p-6 bg-black/20 border-t border-white/5">
                  <div className="relative group">
                    <input type="text" placeholder="NOTER..." className="w-full h-12 bg-white/5 border-none rounded-xl pl-6 pr-12 text-[10px] font-bold text-white uppercase placeholder:text-white/20 focus:ring-1 ring-[#c1a461]/50 transition-all" />
                    <Send className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#c1a461] cursor-pointer" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default DossierDetail;
