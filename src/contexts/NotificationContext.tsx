'use client';

import { createContext, useCallback, useState, ReactNode, useContext, useMemo } from 'react';
import { PlatformNotification } from '@/lib/types';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data/notifications';
import { TenantContext } from './TenantContext';

interface NotificationContextType {
  notifications: PlatformNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markRead: () => {},
  markAllRead: () => {},
  dismiss: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { activeTenant } = useContext(TenantContext);
  const [notifications, setNotifications] = useState<PlatformNotification[]>(MOCK_NOTIFICATIONS);

  const tenantNotifications = useMemo(
    () =>
      activeTenant
        ? notifications.filter((n) => n.tenantId === activeTenant.id)
        : notifications,
    [notifications, activeTenant]
  );

  const unreadCount = tenantNotifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications: tenantNotifications,
        unreadCount,
        markRead,
        markAllRead,
        dismiss,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
