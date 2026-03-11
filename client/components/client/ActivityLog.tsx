import React from 'react';
import { Activity, FileText, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';

interface ActivityLogProps {
  caseId?: string;
  limit?: number;
}

const ActivityLog = ({ caseId, limit = 10 }: ActivityLogProps) => {
  const auditLogs = legalStore.getAuditLogs();

  const caseActivityLogs = caseId
    ? auditLogs.filter(log => log.target_id === caseId || log.metadata?.case_id === caseId)
    : auditLogs;

  const recentLogs = caseActivityLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  const getActionIcon = (action: string) => {
    if (action.includes('Création')) return <FileText className="w-4 h-4" />;
    if (action.includes('Suppression')) return <AlertCircle className="w-4 h-4" />;
    if (action.includes('Mise à jour')) return <CheckCircle2 className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('Création')) return 'bg-emerald-600';
    if (action.includes('Suppression')) return 'bg-red-600';
    if (action.includes('Mise à jour')) return 'bg-blue-600';
    return 'bg-slate-600';
  };

  return (
    <Card className="border-white/10 bg-white/5 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#c1a461]" />
          Historique d'Activité
        </CardTitle>
      </CardHeader>

      <CardContent>
        {recentLogs.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Activity className="w-8 h-8 text-white/20 mx-auto" />
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
              Aucune activité
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log, idx) => (
              <div
                key={log.id}
                className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg shrink-0 text-white",
                    getActionColor(log.action)
                  )}>
                    {getActionIcon(log.action)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">
                        {log.action}
                      </p>
                      <Badge className="bg-white/10 text-white/60 text-[7px] font-bold uppercase shrink-0">
                        {log.target_type}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[8px] text-white/40 font-bold uppercase tracking-widest">
                        <Users className="w-3 h-3" />
                        <span>{log.user_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[8px] text-white/40 font-bold uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(log.timestamp).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/5 text-[8px] text-white/50 space-y-1">
                        {Object.entries(log.metadata).slice(0, 2).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key}:</span>
                            <span className="text-white/70 font-bold">{String(value).substring(0, 30)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
