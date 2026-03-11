import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getNotificationSystem,
  requestNotificationPermission,
  Notification as NotificationData,
  NotificationSystem
} from '@/lib/notification-system';
import { getSyncClient } from '@/lib/websocket-sync';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  addNotification: (
    type: any,
    title: string,
    message: string,
    options?: any
  ) => NotificationData;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  requestPermission: () => Promise<boolean>;
  notificationSystem: NotificationSystem;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Notification Provider Component
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationSystem = getNotificationSystem();

  // Initialize notification system
  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationSystem.getNotifications());
    updateUnreadCount();

    // Subscribe to new notifications
    const unsubscribe = notificationSystem.subscribe((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      updateUnreadCount();
    });

    return unsubscribe;
  }, []);

  // Subscribe to WebSocket events for real-time notifications
  useEffect(() => {
    try {
      const syncClient = getSyncClient();

      // Setup listener if connected, otherwise wait for connection
      const setupListener = () => {
        if (syncClient.isConnected()) {
          return syncClient.on('notification:new', (event) => {
            const { title, message, type } = event.data;
            notificationSystem.addNotification(type, title, message, {
              priority: 'normal',
              data: event.data
            });
          });
        }
        return null;
      };

      let unsubscribe = setupListener();

      // Try to setup listener after a delay if not connected
      const timeout = setTimeout(() => {
        if (!unsubscribe) {
          unsubscribe = setupListener();
        }
      }, 2000);

      return () => {
        clearTimeout(timeout);
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (error) {
      // Silently handle WebSocket errors
      return undefined;
    }
  }, []);

  const updateUnreadCount = () => {
    setUnreadCount(notificationSystem.getUnreadCount());
  };

  const handleMarkAsRead = (notificationId: string) => {
    notificationSystem.markAsRead(notificationId);
    updateUnreadCount();
  };

  const handleMarkAllAsRead = () => {
    notificationSystem.markAllAsRead();
    updateUnreadCount();
  };

  const handleDeleteNotification = (notificationId: string) => {
    notificationSystem.deleteNotification(notificationId);
    setNotifications(notificationSystem.getNotifications());
    updateUnreadCount();
  };

  const handleAddNotification = (
    type: any,
    title: string,
    message: string,
    options?: any
  ): NotificationData => {
    const notification = notificationSystem.addNotification(type, title, message, options);
    setNotifications(notificationSystem.getNotifications());
    updateUnreadCount();
    return notification;
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification: handleAddNotification,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    requestPermission: requestNotificationPermission,
    notificationSystem
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook to use notification context
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
