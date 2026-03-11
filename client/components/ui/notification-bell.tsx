import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  AlertCircle,
  FileText,
  Calendar,
  CreditCard,
  MessageSquare,
  Megaphone,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification, NotificationType } from '@/lib/notification-system';

/**
 * Get icon for notification type
 */
function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'document_shared':
      return <FileText className="w-4 h-4" />;
    case 'appointment_scheduled':
      return <Calendar className="w-4 h-4" />;
    case 'invoice_issued':
      return <CreditCard className="w-4 h-4" />;
    case 'message_received':
      return <MessageSquare className="w-4 h-4" />;
    case 'announcement':
      return <Megaphone className="w-4 h-4" />;
    case 'case_update':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
}

/**
 * Get color for notification priority
 */
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return 'bg-red-50 border-red-100 text-red-900';
    case 'high':
      return 'bg-orange-50 border-orange-100 text-orange-900';
    case 'normal':
      return 'bg-blue-50 border-blue-100 text-blue-900';
    case 'low':
      return 'bg-gray-50 border-gray-100 text-gray-900';
    default:
      return 'bg-slate-50 border-slate-100 text-slate-900';
  }
}

/**
 * Notification bell component
 */
export const NotificationBell: React.FC<{ className?: string }> = ({ className }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('relative text-slate-400 hover:text-slate-600', className)}>
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-slate-100 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
              Notifications {unreadCount > 0 && <span className="text-red-600">({unreadCount})</span>}
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs font-black text-slate-400 hover:text-slate-600 p-0 h-auto"
              >
                <Check className="w-3 h-3 mr-1" /> Mark all read
              </Button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 transition-all hover:bg-slate-50 cursor-pointer',
                  !notification.read && 'bg-blue-50'
                )}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                }}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1 text-slate-400">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-[9px] text-slate-400 mt-2 uppercase tracking-widest">
                      {new Date(notification.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-slate-300 hover:text-red-500 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {notifications.length > 10 && (
          <div className="p-3 text-center border-t border-slate-100">
            <Button variant="link" className="text-xs font-black text-slate-400 p-0 h-auto">
              View all {notifications.length} notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
