import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Workspace, Plan } from '../../data/types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { Building, ShieldAlert, Sliders, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

export const AdminWorkspacesPage: React.FC = () => {
  const { client, showToast, qaLoading, qaError } = useApp();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWs, setSelectedWs] = useState<Workspace | null>(null);
  const [targetPlanId, setTargetPlanId] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const [wsList, plList] = await Promise.all([
        client.adminListWorkspaces(),
        client.adminListPlans(),
      ]);
      setWorkspaces(wsList);
      setPlans(plList);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleToggleSuspend = async (ws: Workspace) => {
    setUpdatingId(ws.id);
    try {
      const newStatus = ws.planStatus === 'frozen' ? 'active' : 'frozen';
      await client.adminSuspend('workspace', ws.id);
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === ws.id ? { ...w, planStatus: newStatus } : w))
      );
      showToast(`Workspace ${ws.name} is now ${newStatus}`, 'info');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedWs || !targetPlanId) return;
    await client.adminChangePlan(selectedWs.id, targetPlanId);
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === selectedWs.id ? { ...w, planId: targetPlanId } : w))
    );
    showToast(`Plan updated for ${selectedWs.name}`, 'success');
    setSelectedWs(null);
  };

  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Workspaces Management</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Inspect all tenant agencies and freelancers, manage active subscriptions, and suspend non-compliant accounts.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workspace..."
            className="w-full text-xs ps-9 pe-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building className="w-8 h-8" />}
          title="No workspaces match search"
          description="Try adjusting your search query to find tenant workspaces."
        />
      ) : (

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((ws) => (
            <div
              key={ws.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--canvas)] text-[#FF5A3C] font-black flex items-center justify-center border border-[var(--border)]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)]">{ws.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--muted)]">
                    <span className="uppercase font-mono font-bold text-[#FF5A3C]">{ws.planId.replace('plan_', '')}</span>
                    <span>•</span>
                    <span>Storage: {Math.round(ws.storageUsedBytes / (1024 * 1024 * 1024))} GB</span>
                    <span>•</span>
                    <span className="font-mono">{ws.timezone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    ws.planStatus === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ws.planStatus}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  icon={<Sliders className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setSelectedWs(ws);
                    setTargetPlanId(ws.planId);
                  }}
                >
                  Change Plan
                </Button>

                <Button
                  size="sm"
                  variant={ws.planStatus === 'frozen' ? 'primary' : 'danger'}
                  onClick={() => handleToggleSuspend(ws)}
                >
                  {ws.planStatus === 'frozen' ? 'Reactivate' : 'Suspend'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Change Plan Modal */}
      {selectedWs && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedWs(null)}
          maxWidth="sm"
          title={`Change Plan: ${selectedWs.name}`}
        >
          <div className="space-y-4 pt-1 text-xs">
            <p className="text-[var(--muted)]">
              Manually override the billing tier for this workspace without Stripe charges.
            </p>
            <div>
              <label className="block font-semibold mb-1">Select Target Plan</label>
              <select
                value={targetPlanId}
                onChange={(e) => setTargetPlanId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-semibold"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.priceMonthly}/mo)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setSelectedWs(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleChangePlan}>
                Apply Override
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
