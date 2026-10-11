import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Button } from '../../components/common/Button';
import { PageSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { ShieldAlert, Users, Building, HardDrive, DollarSign, ArrowUpRight, Lock, Eye } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { client, showToast, navigateTo, qaLoading, qaError } = useApp();
  const [metrics, setMetrics] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const [m, ws, u] = await Promise.all([
        client.adminOverview(),
        client.adminListWorkspaces(),
        client.adminListUsers(),
      ]);
      setMetrics(m);
      setWorkspaces(ws);
      setUsers(u);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleImpersonate = async (userId: string, userName: string) => {
    setImpersonatingId(userId);
    try {
      await client.adminImpersonate(userId);
      showToast(`Impersonating ${userName} (Logged in audit trail)`, 'warning');
      navigateTo('/app');
    } finally {
      setImpersonatingId(null);
    }
  };

  if (loading || qaLoading) {
    return <PageSkeleton />;
  }

  if (hasError || qaError || !metrics) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Platform Operator Overview</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Real-time platform metrics, global tenant management, and revenue monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            System Healthy (99.99%)
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[var(--muted)]">Monthly Recurring Revenue</span>
          <p className="text-2xl font-black text-[var(--text)]">${metrics.mrr.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[var(--muted)]">Active Workspaces</span>
          <p className="text-2xl font-black text-[var(--text)]">{metrics.workspacesCount}</p>
          <span className="text-[11px] text-blue-600 font-semibold">28 agency tenants</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[var(--muted)]">Registered Freelancers</span>
          <p className="text-2xl font-black text-[var(--text)]">{metrics.usersCount}</p>
          <span className="text-[11px] text-purple-600 font-semibold">42 user accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[var(--muted)]">Total Active Projects</span>
          <p className="text-2xl font-black text-[var(--text)]">{metrics.projectsCount}</p>
          <span className="text-[11px] text-amber-600 font-semibold">114 projects</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[var(--muted)]">Total Storage Consumed</span>
          <p className="text-2xl font-black text-[var(--text)]">{metrics.storageTotalGB} GB</p>
          <span className="text-[11px] text-slate-500 font-semibold">Object storage</span>
        </div>
      </div>

      {/* Tables: Workspaces & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workspaces List */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[var(--text)]">Workspaces Directory</h3>
            <span className="text-xs text-[var(--muted)]">{workspaces.length} total</span>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {workspaces.length === 0 ? (
              <EmptyState
                icon={<Building className="w-6 h-6" />}
                title="No workspaces found"
                description="Tenant workspaces will be listed here."
              />
            ) : (
              workspaces.map((ws) => (
                <div key={ws.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[var(--text)] block">{ws.name}</span>
                    <span className="text-[11px] text-[var(--muted)] uppercase font-mono">{ws.planId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {ws.planStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Users List with Impersonate */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[var(--text)]">Platform Users & Support Impersonation</h3>
            <span className="text-xs text-[var(--muted)]">{users.length} total</span>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {users.length === 0 ? (
              <EmptyState
                icon={<Users className="w-6 h-6" />}
                title="No users found"
                description="Registered user accounts will be listed here."
              />
            ) : (
              users.map((u) => (
                <div key={u.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[var(--text)] block">{u.name}</span>
                    <span className="text-[11px] text-[var(--muted)]">{u.email}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    isLoading={impersonatingId === u.id}
                    onClick={() => handleImpersonate(u.id, u.name)}
                  >
                    Impersonate
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
