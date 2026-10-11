import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { AppNotification } from '../../data/types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Search,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Clock,
  Filter,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { client, t, navigateTo, showToast, qaLoading, qaError } = useApp();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'approvals' | 'comments'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMarkingAll, setIsMarkingAll] = useState<boolean>(false);

  const loadNotifications = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await client.listNotifications();
      setNotifications(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [client]);

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      await client.markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast(t('toast.saved'), 'success');
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleMarkSingleRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await client.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await client.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Notification removed', 'info');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    // Filter tab
    if (activeTab === 'unread' && n.read) return false;
    if (activeTab === 'approvals' && !n.kind.includes('approved') && !n.kind.includes('approval')) return false;
    if (activeTab === 'comments' && !n.kind.includes('comment') && !n.kind.includes('feedback')) return false;

    // Search query
    if (searchQuery.trim()) {
      return n.text.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getNotificationIcon = (kind: string) => {
    if (kind.includes('approved') || kind.includes('approval')) {
      return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
    if (kind.includes('comment') || kind.includes('feedback')) {
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
    return <Bell className="w-4 h-4 text-[#FF5A3C]" />;
  };

  if (loading || qaLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-[var(--border)]/50 rounded-xl animate-pulse" />
          <div className="h-8 w-32 bg-[var(--border)]/50 rounded-xl animate-pulse" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error || qaError) {
    return <ErrorState onRetry={loadNotifications} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
              {t('nav.notifications')}
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#FF5A3C] text-[#0F1A2E] text-xs font-black">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Real-time feed of client reviews, approvals, mentions, and revision requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<CheckCheck className="w-4 h-4" />}
              isLoading={isMarkingAll}
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All Notifications', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              {
                id: 'approvals',
                label: 'Approvals & Sign-Offs',
                count: notifications.filter((n) => n.kind.includes('approved')).length,
              },
              {
                id: 'comments',
                label: 'Comments & Feedback',
                count: notifications.filter((n) => n.kind.includes('comment')).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === tab.id
                        ? 'bg-[#0F1A2E]/20 text-[#0F1A2E]'
                        : 'bg-[var(--border)]/50 text-[var(--muted)]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-2 border-t border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification messages..."
            className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
          />
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title={t('empty.notifications')}
          description="You are all caught up! New client reviews and mentions will appear here instantly."
        />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs overflow-hidden divide-y divide-[var(--border)]">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => navigateTo(notif.href)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer group ${
                !notif.read ? 'bg-[#FF5A3C]/5 font-medium' : 'hover:bg-[var(--canvas)]/50'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                  {getNotificationIcon(notif.kind)}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[var(--text)] leading-relaxed font-semibold">
                      {notif.text}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FF5A3C] shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[var(--muted)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.at ? new Date(notif.at).toLocaleDateString() : 'Just now'}
                    </span>
                    <span>•</span>
                    <span className="uppercase text-[10px] font-mono tracking-wider">
                      {notif.kind.replace('.', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                {!notif.read && (
                  <button
                    onClick={(e) => handleMarkSingleRead(notif.id, e)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg text-[var(--muted)] hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => handleDeleteNotification(notif.id, e)}
                  title="Remove notification"
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="ps-1">
                  <ExternalLink className="w-4 h-4 text-[var(--muted)] group-hover:text-[#FF5A3C] transition-colors rtl:rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
