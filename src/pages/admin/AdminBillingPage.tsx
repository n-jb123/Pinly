import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { CreditCard, DollarSign, ArrowUpRight, TrendingUp, Users, Download } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { PageSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';

export const AdminBillingPage: React.FC = () => {
  const { client, showToast, qaLoading, qaError } = useApp();
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const data = await client.adminRevenue();
      setRevenueData(data);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  if (loading || qaLoading) {
    return <PageSkeleton />;
  }

  if (hasError || qaError || !revenueData) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Platform Revenue & Subscriptions</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            MRR growth, churn rates, tier subscription distribution, and payment gateway logs.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          icon={<Download className="w-3.5 h-3.5" />}
          onClick={() => showToast('Financial transactions CSV exported', 'success')}
        >
          Export CSV Ledger
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[var(--muted)]">Monthly Recurring Revenue (MRR)</span>
          <p className="text-3xl font-black text-[var(--text)]">${revenueData.mrr.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +$420 this month
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[var(--muted)]">Net Monthly Churn Rate</span>
          <p className="text-3xl font-black text-[var(--text)]">{revenueData.churnRate}%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Healthy (&lt; 2.5% target)</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[var(--muted)]">New Subscriptions This Month</span>
          <p className="text-3xl font-black text-[var(--text)]">+{revenueData.newUsers}</p>
          <span className="text-[11px] text-purple-600 font-semibold">14 paid upgrades</span>
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[var(--text)]">Subscription Tier Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(revenueData.planBreakdown).map(([tier, count]: [string, any]) => (
            <div key={tier} className="p-4 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-xs space-y-1">
              <span className="font-bold text-sm block text-[var(--text)]">{tier} Plan</span>
              <p className="text-2xl font-black text-[#FF5A3C]">{count} Workspaces</p>
              <span className="text-[11px] text-[var(--muted)]">Active subscribers</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[var(--text)]">Recent Gateway Invoices</h3>
        <div className="divide-y divide-[var(--border)] text-xs">
          {[
            { id: 'INV-9021', workspace: 'Studio Noor', amount: '$79.00', status: 'Paid', date: 'Oct 08, 2026' },
            { id: 'INV-9020', workspace: 'Creative Cairo Group', amount: '$29.00', status: 'Paid', date: 'Oct 07, 2026' },
            { id: 'INV-9019', workspace: 'Apex Design Lab', amount: '$79.00', status: 'Paid', date: 'Oct 04, 2026' },
          ].map((inv) => (
            <div key={inv.id} className="py-3 flex justify-between items-center">
              <div>
                <span className="font-bold font-mono text-[var(--text)]">{inv.id}</span>
                <span className="ms-3 text-[var(--muted)]">{inv.workspace}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[var(--text)]">{inv.amount}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {inv.status}
                </span>
                <span className="text-[11px] text-[var(--muted)]">{inv.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
