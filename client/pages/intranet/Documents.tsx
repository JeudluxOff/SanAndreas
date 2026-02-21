import { useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Printer, 
  Share2, 
  MoreVertical,
  ChevronRight,
  FileCheck,
  FileClock,
  FileLock2,
  FileWarning,
  Eye,
  Edit3,
  Trash2,
  ArrowUpDown
} from "lucide-react";
import { IntranetLayout } from "@/components/IntranetLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const documents = [
  { id: 'DEC-24-0042', title: 'Décret sur la régulation des commerces', type: 'Décret', status: 'Signé', author: 'Arthur Vance', date: '22 Mai 2024', service: 'Cabinet' },
  { id: 'ARR-24-1102', title: 'Arrêté préfectoral zone de sécurité', type: 'Arrêté', status: 'En relecture', author: 'Jackson Teller', date: '21 Mai 2024', service: 'Sécurité' },
  { id: 'RAP-24-0892', title: 'Rapport trimestriel économique Q1', type: 'Rapport', status: 'Brouillon', author: 'Elena Rodriguez', date: '19 Mai 2024', service: 'Économie' },
  { id: 'MAN-24-0012', title: 'Mandat d\'arrêt #SA-99', type: 'Mandat', status: 'Exécuté', author: 'Thomas Vercetti', date: '15 Mai 2024', service: 'Justice' },
  { id: 'LIC-24-0556', title: 'Licence commerciale #884', type: 'Licence', status: 'Publié', author: 'Lamar Davis', date: '12 Mai 2024', service: 'Commerce' },
  { id: 'DOS-24-0142', title: 'Dossier Judiciaire Vercetti', type: 'Dossier', status: 'Archivé', author: 'System', date: '10 Mai 2024', service: 'Justice' },
  { id: 'DEC-24-0041', title: 'Décret sur les subventions SAMS', type: 'Décret', status: 'Signé', author: 'Arthur Vance', date: '08 Mai 2024', service: 'Cabinet' },
  { id: 'COM-24-0001', title: 'Note de service RH #01', type: 'RH', status: 'Publié', author: 'Lamar Davis', date: '05 Mai 2024', service: 'RH' },
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredDocs = documents.filter(doc => 
    (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     doc.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === "all" || doc.type === filterType)
  );

  return (
    <IntranetLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Bibliothèque de Documents</h1>
            <p className="text-slate-500 font-medium italic">Accédez à l'ensemble des documents officiels et archives de l'État.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-white font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Document
            </Button>
            <Button variant="outline" className="border-slate-300 font-bold flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimer Liste
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher par titre, ID, auteur..." 
                  className="pl-10 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Type de Document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="Décret">Décret</SelectItem>
                    <SelectItem value="Arrêté">Arrêté</SelectItem>
                    <SelectItem value="Rapport">Rapport</SelectItem>
                    <SelectItem value="Mandat">Mandat</SelectItem>
                    <SelectItem value="Licence">Licence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-grow h-10 font-bold border-slate-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres Avancés
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200">
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Grid/Table */}
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID / Type</th>
                    <th className="px-6 py-4">Titre du Document</th>
                    <th className="px-6 py-4">Service / Auteur</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[11px] font-black text-primary">{doc.id}</span>
                          <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-tighter px-1.5 py-0 border-slate-200">
                            {doc.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            doc.status === 'Signé' ? "bg-emerald-50 text-emerald-600" :
                            doc.status === 'Brouillon' ? "bg-slate-100 text-slate-500" :
                            doc.status === 'En relecture' ? "bg-amber-50 text-amber-600" :
                            "bg-blue-50 text-blue-600"
                          )}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">{doc.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-slate-700">{doc.service}</span>
                          <span className="text-[10px] font-medium text-slate-500">{doc.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{doc.date}</td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5",
                          doc.status === 'Signé' ? 'bg-emerald-600 text-white' :
                          doc.status === 'En relecture' ? 'bg-amber-500 text-white' :
                          doc.status === 'Brouillon' ? 'bg-slate-400 text-white' :
                          doc.status === 'Publié' ? 'bg-blue-600 text-white' :
                          'bg-slate-900 text-white'
                        )}>
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 font-bold text-xs uppercase tracking-tighter">
                              <DropdownMenuLabel>Options Document</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Download className="w-4 h-4" /> Télécharger PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Share2 className="w-4 h-4" /> Partager Interne
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Printer className="w-4 h-4" /> Imprimer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                <Trash2 className="w-4 h-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDocs.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <FileWarning className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-sm">Aucun document trouvé</p>
                <p className="text-xs">Modifiez vos filtres ou effectuez une nouvelle recherche.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories / Quick Filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-red-50 text-red-600 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
              <FileLock2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Décrets</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FileCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Arrêtés</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-all">
              <FileClock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Mandats</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Rapports</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-full group-hover:bg-slate-600 group-hover:text-white transition-all">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Dossiers</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center gap-2 group">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Licences</span>
          </button>
        </div>
      </div>
    </IntranetLayout>
  );
};

export default Documents;
