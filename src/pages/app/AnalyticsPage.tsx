import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Button } from '../../components/common/Button';
import { PlanLock } from '../../components/common/PlanLock';
import { PageSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { BarChart3, Clock, RotateCcw, MessageSquare, Download, Calendar } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { client, workspace, showToast, qaLoading, qaError } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isFreePlan = workspace.planId === 'plan_free';

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await client.getAnalytics();
      setData(res);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleExport = (format: 'pdf' | 'csv') => {
    showToast(`Analytics report exported as ${format.toUpperCase()}`, 'success');
  };

  if (loading || qaLoading) {
    return <PageSkeleton />;
  }

  if (hasError || qaError || !data) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">Workspace Analytics</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Turnaround times, revision cycle velocity, and client sign-off metrics.
          </p>
        </div>

        {!isFreePlan && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={() => handleExport('csv')}>
              Export CSV
            </Button>
            <Button size="sm" variant="primary" icon={<Download className="w-3.5 h-3.5" />} onClick={() => handleExport('pdf')}>
              Export PDF Report
            </Button>
          </div>
        )}
      </div>

      {/* 4 Metric Cards (Shown on all plans) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)]">
            <span>Avg Time to Approval</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-[var(--text)]">{data.avgTimeToApprovalHours}h</p>
          <span className="text-[11px] text-emerald-600 font-semibold">↓ 12% faster this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)]">
            <span>Revision Rounds / Project</span>
            <RotateCcw className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-[var(--text)]">{data.revisionRoundsPerProject}</p>
          <span className="text-[11px] text-[var(--muted)]">Industry avg: 3.4 rounds</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)]">
            <span>Client Response Time</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-[var(--text)]">{data.clientResponseTimeHours}h</p>
          <span className="text-[11px] text-purple-600 font-semibold">Within same business day</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)]">
            <span>Current Open Pins</span>
            <MessageSquare className="w-4 h-4 text-[#FF5A3C]" />
          </div>
          <p className="text-3xl font-black text-[#FF5A3C]">{data.openFeedbackCount}</p>
          <span className="text-[11px] text-[var(--muted)]">Across active versions</span>
        </div>
      </div>

      {/* Charts & Advanced Breakdown */}
      {isFreePlan ? (
        <PlanLock featureName="Detailed Analytics Charts & PDF/CSV Export" minPlan="Pro" />
      ) : (
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[var(--text)]">Weekly Revisions vs Approvals</h3>
              <p className="text-xs text-[var(--muted)]">Daily trend of closed feedback vs new revision iterations.</p>
            </div>
            <span className="text-xs text-[var(--muted)] font-mono">Past 7 Days</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4 border-b border-[var(--border)] pb-4">
            {data.trendDays.map((td: any) => {
              const maxVal = 8;
              const appHeight = (td.approved / maxVal) * 100;
              const revHeight = (td.revisions / maxVal) * 100;

              return (
                <div key={td.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Approvals Bar */}
                    <div
                      className="w-4 sm:w-6 rounded-t-md bg-emerald-500 transition-all hover:opacity-90"
                      style={{ height: `${appHeight}%` }}
                      title={`Approved: ${td.approved}`}
                    />
                    {/* Revisions Bar */}
                    <div
                      className="w-4 sm:w-6 rounded-t-md bg-[#FF5A3C] transition-all hover:opacity-90"
                      style={{ height: `${revHeight}%` }}
                      title={`Revisions: ${td.revisions}`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--muted)]">{td.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-6 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span>Approved Deliverables</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-[#FF5A3C]" />
              <span>Revision Cycles</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
