import React from 'react';
import { 
  Archive, 
  FileText, 
  Briefcase, 
  Search, 
  History, 
  Download,
  MoreVertical,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { legalStore } from '@/lib/legal-store';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Case, LegalDocument } from '@shared/api';

const Archives = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('cases');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const [archivedCases, setArchivedCases] = React.useState<Case[]>(
    legalStore.getCases().filter(c => c.status === 'Archivé')
  );
  
  const [archivedDocs, setArchivedDocs] = React.useState<LegalDocument[]>(
    legalStore.getDocuments().filter(d => d.status === 'Archivé')
  );

  const handleUnarchiveCase = (id: string) => {
    if (!user) return;
    const dossier = legalStore.getCase(id);
    if (dossier) {
      dossier.status = 'En cours';
      legalStore.updateCase(dossier);
      legalStore.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: user.id,
        user_name: user.name,
        action: 'Désarchivage du dossier',
        target_type: 'Case',
        target_id: id
      });
      setArchivedCases(legalStore.getCases().filter(c => c.status === 'Archivé'));
    }
  };

  const handleUnarchiveDoc = (id: string) => {
    if (!user) return;
    const doc = legalStore.getDocuments().find(d => d.id === id);
    if (doc) {
      doc.status = 'Brouillon'; // Or appropriate status
      legalStore.updateDocument(doc);
      legalStore.logAction({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user_id: user.id,
        user_name: user.name,
        action: 'Désarchivage du document',
        target_type: 'Document',
        target_id: id
      });
      setArchivedDocs(legalStore.getDocuments().filter(d => d.status === 'Archivé'));
    }
  };

  const filteredCases = archivedCases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = archivedDocs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
            <Archive className="w-8 h-8 text-[#c1a461]" /> Archives Centralisées
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Accès aux dossiers et documents archivés du cabinet
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="RECHERCHER DANS LES ARCHIVES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-10 text-[10px] font-black uppercase tracking-widest focus:ring-2 ring-[#c1a461]/20 transition-all"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-12">
          <TabsTrigger value="cases" className="rounded-lg px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#c1a461] transition-all">
            <Briefcase className="w-4 h-4 mr-2" /> Dossiers Archivés ({archivedCases.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#c1a461] transition-all">
            <FileText className="w-4 h-4 mr-2" /> Documents Archivés ({archivedDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases">
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro / Dossier</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date d'archivage</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCases.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:text-[#c1a461] transition-colors">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                          {legalStore.getClient(item.client_id)?.name || 'Inconnu'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.type}</Badge>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUnarchiveCase(item.id)}
                            className="text-[9px] font-black uppercase text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2"
                          >
                            <RotateCcw className="w-3 h-3" /> Restaurer
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCases.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aucun dossier archivé trouvé</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Référence / Nom</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Archivé le</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDocs.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:text-[#c1a461] transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{item.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-500 uppercase">{item.case_id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{item.category}</Badge>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUnarchiveDoc(item.id)}
                            className="text-[9px] font-black uppercase text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2"
                          >
                            <RotateCcw className="w-3 h-3" /> Restaurer
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aucun document archivé trouvé</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Archives;
