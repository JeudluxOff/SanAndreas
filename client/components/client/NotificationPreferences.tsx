import React from 'react';
import { Bell, Mail, FileText, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NotificationPreferencesProps {
  clientId?: string;
}

const NotificationPreferences = ({ clientId }: NotificationPreferencesProps) => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = React.useState({
    email_documents: true,
    email_invoices: true,
    email_announcements: true,
    push_notifications: true,
    case_updates: true
  });
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save preferences to user profile
      if (user) {
        updateUser({
          ...user,
          // Can extend User interface to include notification_preferences if needed
        } as any);
      }
      toast.success('Préférences sauvegardées');
      setHasChanges(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const preferenceItems = [
    {
      key: 'email_documents' as const,
      icon: FileText,
      label: 'Notification de Nouveaux Documents',
      description: 'Recevez un email quand un document est partagé'
    },
    {
      key: 'email_invoices' as const,
      icon: DollarSign,
      label: 'Notification de Facturation',
      description: 'Recevez un email quand une facture est émise'
    },
    {
      key: 'email_announcements' as const,
      icon: Bell,
      label: 'Annonces du Cabinet',
      description: 'Recevez les annonces importantes du cabinet'
    },
    {
      key: 'push_notifications' as const,
      icon: Bell,
      label: 'Notifications Push',
      description: 'Recevez les mises à jour en temps réel'
    },
    {
      key: 'case_updates' as const,
      icon: CheckCircle2,
      label: 'Mises à Jour de Dossier',
      description: 'Notifiez-moi des changements de statut'
    }
  ];

  return (
    <Card className="border-white/10 bg-white/5 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#c1a461]" />
          Préférences de Notifications
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {preferenceItems.map(item => {
            const Icon = item.icon;
            const isEnabled = preferences[item.key];

            return (
              <div
                key={item.key}
                className="p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-[#c1a461]/10 text-[#c1a461] mt-1 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-[10px] font-black text-white uppercase tracking-tight block cursor-pointer mb-1">
                      {item.label}
                    </Label>
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                      {item.description}
                    </p>
                  </div>
                </div>

                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => handleToggle(item.key)}
                  className="ml-4 shrink-0"
                />
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[9px] font-bold text-blue-300/80 uppercase tracking-widest">
            <p>ℹ️ Vous pouvez modifier ces préférences à tout moment</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setPreferences({
                email_documents: true,
                email_invoices: true,
                email_announcements: true,
                push_notifications: true,
                case_updates: true
              });
              setHasChanges(false);
            }}
            disabled={!hasChanges}
            className="text-white/40 font-black uppercase text-[9px] disabled:opacity-50"
          >
            Réinitialiser
          </Button>

          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-[#c1a461] hover:bg-[#d1b471] text-white font-black uppercase text-[9px] px-6 disabled:opacity-50"
          >
            {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
