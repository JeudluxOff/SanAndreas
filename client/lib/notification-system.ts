/**
 * Real-time notification system for client events
 * Integrates with WebSocket for live updates
 */

export type NotificationType =
  | 'case_update'
  | 'document_shared'
  | 'appointment_scheduled'
  | 'invoice_issued'
  | 'message_received'
  | 'case_closed'
  | 'announcement'
  | 'payment_received'
  | 'system_alert';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  action_url?: string;
  action_label?: string;
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  case_updates: boolean;
  documents: boolean;
  appointments: boolean;
  invoices: boolean;
  messages: boolean;
  announcements: boolean;
}

/**
 * Notification system for managing real-time notifications
 */
export class NotificationSystem {
  private notifications: Notification[] = [];
  private listeners: Set<(notification: Notification) => void> = new Set();
  private readListeners: Set<(notificationId: string) => void> = new Set();
  private maxNotifications: number = 50;
  private preferences: NotificationPreferences = {
    email_notifications: false,
    push_notifications: true,
    in_app_notifications: true,
    case_updates: true,
    documents: true,
    appointments: true,
    invoices: true,
    messages: true,
    announcements: true
  };

  constructor() {
    this.loadNotifications();
    this.loadPreferences();
  }

  /**
   * Add a new notification
   */
  addNotification(
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      priority?: NotificationPriority;
      action_url?: string;
      action_label?: string;
      data?: Record<string, any>;
    }
  ): Notification {
    // Check preferences before adding
    if (!this.shouldShowNotification(type)) {
      return null as any;
    }

    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      priority: options?.priority || 'normal',
      timestamp: new Date().toISOString(),
      read: false,
      action_url: options?.action_url,
      action_label: options?.action_label,
      data: options?.data
    };

    // Add to list
    this.notifications.unshift(notification);

    // Keep only recent notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }

    // Save to localStorage
    this.saveNotifications();

    // Notify listeners
    this.listeners.forEach((listener) => listener(notification));

    // Show browser notification if enabled
    if (this.preferences.push_notifications && this.isNotificationEnabled(type)) {
      this.showBrowserNotification(notification);
    }

    return notification;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.saveNotifications();
      this.readListeners.forEach((listener) => listener(notificationId));
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    let changed = false;
    this.notifications.forEach((notification) => {
      if (!notification.read) {
        notification.read = true;
        changed = true;
      }
    });

    if (changed) {
      this.saveNotifications();
    }
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.saveNotifications();
  }

  /**
   * Get all notifications
   */
  getNotifications(unreadOnly: boolean = false): Notification[] {
    if (unreadOnly) {
      return this.notifications.filter((n) => !n.read);
    }
    return [...this.notifications];
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: NotificationType): Notification[] {
    return this.notifications.filter((n) => n.type === type);
  }

  /**
   * Subscribe to new notifications
   */
  subscribe(listener: (notification: Notification) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe to read notifications
   */
  subscribeToRead(listener: (notificationId: string) => void): () => void {
    this.readListeners.add(listener);

    return () => {
      this.readListeners.delete(listener);
    };
  }

  /**
   * Update notification preferences
   */
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    localStorage.setItem('notification_preferences', JSON.stringify(this.preferences));
  }

  /**
   * Get notification preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // ============ Private Methods ============

  private shouldShowNotification(type: NotificationType): boolean {
    switch (type) {
      case 'case_update':
        return this.preferences.case_updates;
      case 'document_shared':
        return this.preferences.documents;
      case 'appointment_scheduled':
        return this.preferences.appointments;
      case 'invoice_issued':
        return this.preferences.invoices;
      case 'message_received':
        return this.preferences.messages;
      case 'announcement':
        return this.preferences.announcements;
      default:
        return this.preferences.in_app_notifications;
    }
  }

  private isNotificationEnabled(type: NotificationType): boolean {
    return this.shouldShowNotification(type);
  }

  private showBrowserNotification(notification: Notification): void {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });
    }
  }

  private saveNotifications(): void {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
    }
  }

  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem('notification_preferences');
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }
}

// Export singleton instance
let notificationSystem: NotificationSystem | null = null;

export function getNotificationSystem(): NotificationSystem {
  if (!notificationSystem) {
    notificationSystem = new NotificationSystem();
  }
  return notificationSystem;
}

/**
 * Request browser notification permission
 */
export function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return Promise.resolve(false);
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission().then((permission) => permission === 'granted');
  }

  return Promise.resolve(false);
}
