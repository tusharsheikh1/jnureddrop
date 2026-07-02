import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isDonor } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(() => {
    if (!isDonor) {
      setUnreadCount(0);
      return;
    }
    api.get('/donor/notifications/unread-count')
      .then(res => setUnreadCount(res.data.count ?? 0))
      .catch(() => {});
  }, [isDonor]);

  useEffect(() => {
    fetchUnreadCount();
    const id = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(id);
  }, [fetchUnreadCount]);

  const markAllRead = useCallback(async () => {
    try {
      await api.post('/donor/notifications/mark-read');
      setUnreadCount(0);
    } catch {}
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, markAllRead, fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
