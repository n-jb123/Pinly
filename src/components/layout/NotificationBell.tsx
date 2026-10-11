import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useApp } from '../../data/context';
import { AppNotification } from '../../data/types';

export const NotificationBell: React.FC = () => {
  const { client, navigateTo } = useApp();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    client.listNotifications().then(setNotifications);
  }, [client]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    await client.markNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/20 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-[#FF5A3C]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between p-3.5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text)]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#FF5A3C] text-[#0F1A2E] text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--muted)]">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    setIsOpen(false);
                    navigateTo(notif.href);
                  }}
                  className={`p-3 text-xs hover:bg-[var(--canvas)] transition-colors cursor-pointer ${
                    !notif.read ? 'bg-[#FF5A3C]/5 font-medium' : ''
                  }`}
                >
                  <p className="text-[var(--text)] line-clamp-2">{notif.text}</p>
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">Recently</span>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-[var(--border)] text-center bg-[var(--canvas)]/40">
            <button
              onClick={() => {
                setIsOpen(false);
                navigateTo('/app/notifications');
              }}
              className="text-xs font-bold text-[#FF5A3C] hover:underline cursor-pointer"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
