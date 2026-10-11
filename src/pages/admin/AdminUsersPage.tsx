import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { User } from '../../data/types';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { Users, Eye, ShieldCheck, Search, ShieldAlert } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { client, showToast, navigateTo, qaLoading, qaError } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const uList = await client.adminListUsers();
      setUsers(uList);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleImpersonate = async (u: User) => {
    setActionUserId(u.id);
    try {
      await client.adminImpersonate(u.id);
      showToast(`Impersonating ${u.name} (Logged in platform audit)`, 'warning');
      navigateTo('/app');
    } finally {
      setActionUserId(null);
    }
  };

  const handleToggleSuspend = async (u: User) => {
    setActionUserId(u.id);
    try {
      await client.adminSuspend('user', u.id);
      showToast(`Toggled user suspension state for ${u.name}`, 'info');
    } finally {
      setActionUserId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (hasError || qaError) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Users Directory & Permissions</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Registered freelancer and agency accounts, 2FA enforcement status, and support impersonation sessions.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F1A2E] text-white font-bold flex items-center justify-center border border-slate-700">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[var(--text)]">{u.name}</h3>
                    {u.isPlatformAdmin && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        SuperAdmin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--muted)]">
                    <span>{u.email}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className={`w-3.5 h-3.5 ${u.mfaEnabled ? 'text-emerald-500' : 'text-slate-400'}`} />
                      {u.mfaEnabled ? '2FA Active' : '2FA Disabled'}
                    </span>
                    <span>•</span>
                    <span className="uppercase font-mono">{u.locale}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() => handleImpersonate(u)}
                >
                  Impersonate
                </Button>

                {!u.isPlatformAdmin && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleToggleSuspend(u)}
                  >
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
