import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Plan } from '../../data/types';
import { Button } from '../../components/common/Button';
import { PageSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { CheckCircle2, Save, Sliders } from 'lucide-react';

export const AdminPlansPage: React.FC = () => {
  const { client, showToast, qaLoading, qaError } = useApp();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const pls = await client.adminListPlans();
      setPlans(pls);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleUpdatePlan = (index: number, field: string, value: any) => {
    const updated = [...plans];
    if (field.startsWith('limits.')) {
      const limitKey = field.split('.')[1];
      (updated[index].limits as any)[limitKey] = value;
    } else {
      (updated[index] as any)[field] = value;
    }
    setPlans(updated);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const p of plans) {
        await client.adminSavePlan(p);
      }
      showToast('Plan tiers and limits updated successfully', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || qaLoading) {
    return <PageSkeleton />;
  }

  if (hasError || qaError) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Subscription Plans & Limits</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Configure pricing tiers, member limits, storage capacities, and gated feature flags without code changes.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={<Save className="w-4 h-4" />}
          isLoading={isSaving}
          onClick={handleSaveAll}
        >
          Save All Plan Changes
        </Button>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          icon={<Sliders className="w-8 h-8" />}
          title="No subscription plans configured"
          description="Default pricing tiers will appear once initialized."
        />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div key={p.id} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Plan Tier</span>
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleUpdatePlan(idx, 'name', e.target.value)}
                className="w-full text-lg font-black bg-transparent border-none text-[var(--text)] focus:outline-none"
              />
            </div>

            {/* Pricing Fields */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">Monthly ($)</label>
                <input
                  type="number"
                  value={p.priceMonthly}
                  onChange={(e) => handleUpdatePlan(idx, 'priceMonthly', Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">Yearly ($)</label>
                <input
                  type="number"
                  value={p.priceYearly}
                  onChange={(e) => handleUpdatePlan(idx, 'priceYearly', Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-bold text-xs"
                />
              </div>
            </div>

            {/* Limits Controls */}
            <div className="space-y-3 pt-2 text-xs border-t border-[var(--border)]">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                  Active Projects (0 for Unlimited)
                </label>
                <input
                  type="number"
                  value={p.limits.activeProjects || 0}
                  onChange={(e) => handleUpdatePlan(idx, 'limits.activeProjects', Number(e.target.value) || null)}
                  className="w-full p-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                  Storage (GB)
                </label>
                <input
                  type="number"
                  value={Math.round(p.limits.storageBytes / (1024 * 1024 * 1024))}
                  onChange={(e) =>
                    handleUpdatePlan(idx, 'limits.storageBytes', Number(e.target.value) * 1024 * 1024 * 1024)
                  }
                  className="w-full p-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                  Team Members Limit
                </label>
                <input
                  type="number"
                  value={p.limits.members}
                  onChange={(e) => handleUpdatePlan(idx, 'limits.members', Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--muted)] mb-1">
                  Website Screenshots / mo
                </label>
                <input
                  type="number"
                  value={p.limits.screenshotsPerMonth}
                  onChange={(e) => handleUpdatePlan(idx, 'limits.screenshotsPerMonth', Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-xs font-semibold"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2 border-t border-[var(--border)]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Custom Agency Branding</span>
                  <input
                    type="checkbox"
                    checked={p.limits.branding}
                    onChange={(e) => handleUpdatePlan(idx, 'limits.branding', e.target.checked)}
                    className="rounded text-[#FF5A3C]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span>Webhooks Integration</span>
                  <input
                    type="checkbox"
                    checked={p.limits.webhooks}
                    onChange={(e) => handleUpdatePlan(idx, 'limits.webhooks', e.target.checked)}
                    className="rounded text-[#FF5A3C]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span>PDF Approval Certificate</span>
                  <input
                    type="checkbox"
                    checked={p.limits.certificate}
                    onChange={(e) => handleUpdatePlan(idx, 'limits.certificate', e.target.checked)}
                    className="rounded text-[#FF5A3C]"
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
