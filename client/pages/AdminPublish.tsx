import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export default function AdminPublish() {
  const { draftChanges, publishDrafts, removeDraftChange, clearDraftChanges, hasPendingChanges } = useAdmin();
  const [isPublishing, setIsPublishing] = React.useState(false);

  const handlePublishAll = async () => {
    setIsPublishing(true);
    try {
      await publishDrafts('all');
      toast.success('Tous les changements ont été publiés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishByType = async (type: 'government' | 'legal') => {
    setIsPublishing(true);
    try {
      await publishDrafts(type);
      toast.success(`Changements ${type === 'government' ? 'du Gouvernement' : 'du Cabinet'} publiés`);
    } catch (error) {
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPublishing(false);
    }
  };

  const governmentChanges = draftChanges.filter(c => c.type === 'government');
  const legalChanges = draftChanges.filter(c => c.type === 'legal');

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Gestion des Publications</h1>
            <p className="text-slate-300 font-bold uppercase tracking-widest text-sm mt-2">
              Contrôlez et publiez les modifications des intranets vers le site public
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Total Changements</p>
                    <p className="text-4xl font-black text-primary mt-2">{draftChanges.length}</p>
                  </div>
                  <Clock className="w-12 h-12 text-amber-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Gouvernement</p>
                    <p className="text-4xl font-black text-blue-600 mt-2">{governmentChanges.length}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-blue-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Cabinet Avocat</p>
                    <p className="text-4xl font-black text-purple-600 mt-2">{legalChanges.length}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-purple-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Publication Actions */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-100 border-b border-slate-200">
              <CardTitle className="text-lg">Actions de Publication</CardTitle>
              <CardDescription>Publiez les changements sur le site public</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handlePublishAll}
                  disabled={!hasPendingChanges() || isPublishing}
                  className="bg-green-600 hover:bg-green-700 text-white font-black uppercase text-sm tracking-widest flex-1"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isPublishing ? 'Publication...' : 'Publier Tout'}
                </Button>
                <Button
                  onClick={() => handlePublishByType('government')}
                  disabled={governmentChanges.length === 0 || isPublishing}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 font-bold uppercase text-sm tracking-widest"
                >
                  Publier Gouvernement ({governmentChanges.length})
                </Button>
                <Button
                  onClick={() => handlePublishByType('legal')}
                  disabled={legalChanges.length === 0 || isPublishing}
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 font-bold uppercase text-sm tracking-widest"
                >
                  Publier Cabinet ({legalChanges.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Changes List */}
          {draftChanges.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Changements Non Publiés</h2>
              
              <div className="space-y-4">
                {draftChanges.map((change) => (
                  <Card key={change.id} className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge className={change.type === 'government' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                              {change.type === 'government' ? 'Gouvernement' : 'Cabinet'}
                            </Badge>
                            <Badge variant="outline" className="font-bold uppercase text-[10px]">
                              {change.action === 'create' ? 'Créé' : change.action === 'update' ? 'Modifié' : 'Supprimé'}
                            </Badge>
                            <span className="text-xs text-slate-500 font-bold">{change.entityType}</span>
                          </div>
                          <p className="font-bold text-slate-900">
                            {change.entityName}
                          </p>
                          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Changements :</p>
                            <pre className="text-[10px] font-mono text-slate-700 overflow-auto max-h-40">
                              {JSON.stringify(change.changes, null, 2)}
                            </pre>
                          </div>
                          <div className="flex gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
                            <span>Par: {change.userName}</span>
                            <span>•</span>
                            <span>{new Date(change.timestamp).toLocaleString('fr-FR')}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeDraftChange(change.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {draftChanges.length > 0 && (
                <div className="text-center">
                  <Button
                    onClick={clearDraftChanges}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 font-bold uppercase"
                  >
                    Annuler Tous les Changements
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-slate-200">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Aucun Changement Non Publié</h3>
              <p className="text-slate-500 font-bold uppercase text-sm tracking-widest mt-2">
                Tous les changements sont à jour avec le site public
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
