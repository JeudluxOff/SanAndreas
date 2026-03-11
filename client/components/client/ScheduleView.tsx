import React from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { legalStore } from '@/lib/legal-store';

interface ScheduleViewProps {
  caseId?: string;
}

const ScheduleView = ({ caseId }: ScheduleViewProps) => {
  const allHearings = legalStore.getHearings();

  const hearings = caseId
    ? allHearings.filter(h => h.case_id === caseId)
    : allHearings;

  const upcomingHearings = hearings
    .filter(h => new Date(h.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastHearings = hearings
    .filter(h => new Date(h.date) <= new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé':
        return 'bg-emerald-600';
      case 'Reporté':
        return 'bg-amber-600';
      case 'Terminé':
        return 'bg-blue-600';
      case 'Annulé':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  const HearingCard = ({ hearing }: { hearing: any }) => {
    const hearingDate = new Date(hearing.date);
    const isUpcoming = hearingDate > new Date();

    return (
      <Card className={cn(
        "border-white/10 rounded-xl transition-all",
        isUpcoming ? "bg-white/5 hover:bg-white/10" : "bg-white/[0.02] opacity-70"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="text-[10px] font-black text-white uppercase tracking-tight mb-1">
                {hearing.title}
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-white/10 text-white/60 text-[7px] font-bold uppercase">
                  {hearing.type}
                </Badge>
                <Badge className={cn(
                  "text-white text-[7px] font-bold uppercase",
                  getStatusColor(hearing.status)
                )}>
                  {hearing.status}
                </Badge>
              </div>
            </div>
            {isUpcoming && (
              <div className="ml-2 w-2 h-2 rounded-full bg-[#c1a461] animate-pulse shrink-0" />
            )}
          </div>

          <div className="space-y-2 text-[9px] text-white/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#c1a461]" />
              <span className="font-bold">
                {hearingDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#c1a461]" />
              <span className="font-bold">
                {hearingDate.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {hearing.location && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 text-[#c1a461] mt-0.5 shrink-0" />
                <span className="font-bold flex-1">{hearing.location}</span>
              </div>
            )}

            {hearing.judge && (
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-[#c1a461]" />
                <span className="font-bold">{hearing.judge}</span>
              </div>
            )}

            {hearing.result && (
              <div className="pt-2 border-t border-white/10 mt-2">
                <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Résultat</p>
                <p className="text-white/70">{hearing.result}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Upcoming Hearings */}
      <div>
        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#c1a461]" />
          Audiences à Venir
        </h3>

        {upcomingHearings.length === 0 ? (
          <Card className="border-white/10 bg-white/5 rounded-xl">
            <CardContent className="p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-white/20 mx-auto" />
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                Aucune audience programmée
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingHearings.map(hearing => (
              <HearingCard key={hearing.id} hearing={hearing} />
            ))}
          </div>
        )}
      </div>

      {/* Past Hearings */}
      {pastHearings.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            Audiences Passées
          </h3>

          <div className="space-y-3">
            {pastHearings.map(hearing => (
              <HearingCard key={hearing.id} hearing={hearing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
