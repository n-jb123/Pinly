import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { ActivityEvent } from '../../data/types';
import { Button } from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import {
  FolderKanban,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  EyeOff,
  Bell,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { QuickCreateProjectModal } from '../../components/projects/QuickCreateProjectModal';

export const DashboardPage: React.FC = () => {
  const { client, user, workspace, t, navigateTo, qaLoading, qaError } = useApp();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await client.getDashboard();
      const cls = await client.listClients();
      setDashboardData(data);
      setClients(cls);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  if (loading || qaLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (qaError || !dashboardData) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--text)]">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Here is your client feedback and revision progress overview for <strong>{workspace.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowNewProjectModal(true)}
          >
            {t('action.newProject')}
          </Button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Projects */}
        <div
          onClick={() => navigateTo('/app/projects')}
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:border-[#FF5A3C]/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--muted)]">Active Projects</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--text)]">
              {dashboardData.activeProjectsCount}
            </span>
            <span className="text-xs text-[var(--muted)]">in production</span>
          </div>
        </div>

        {/* Awaiting Client Review */}
        <div
          onClick={() => navigateTo('/app/projects?filter=in_review')}
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:border-[#FF5A3C]/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--muted)]">In Client Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--text)]">
              {dashboardData.inReviewCount}
            </span>
            <span className="text-xs text-amber-500 font-semibold">with reviewers</span>
          </div>
        </div>

        {/* Changes Requested */}
        <div
          onClick={() => navigateTo('/app/projects?filter=changes_requested')}
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:border-[#FF5A3C]/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--muted)]">Changes Requested</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--text)]">
              {dashboardData.changesRequestedCount}
            </span>
            <span className="text-xs text-rose-500 font-semibold">needs revision</span>
          </div>
        </div>

        {/* Awaiting Approval */}
        <div
          onClick={() => navigateTo('/app/projects?filter=awaiting_approval')}
          className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:border-[#FF5A3C]/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--muted)]">Awaiting Approval</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--text)]">
              {dashboardData.awaitingApprovalCount}
            </span>
            <span className="text-xs text-purple-500 font-semibold">final review</span>
          </div>
        </div>
      </div>

      {/* Grid: Needs Your Attention & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Your Attention (Column 1) */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF5A3C]" />
            Needs Attention
          </h2>

          <div className="space-y-3">
            {dashboardData.needsAttention.unvisitedCount > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                  <EyeOff className="w-4 h-4" />
                  <span>Unopened Review Link</span>
                </div>
                <p className="text-[11px] text-[var(--muted)]">
                  Q3 Investor Pitch Deck was sent 2 days ago but the client has never opened the link.
                </p>
                <button
                  onClick={() => navigateTo('/app/projects/proj_pitch_deck')}
                  className="text-xs font-semibold text-[#FF5A3C] hover:underline pt-1 inline-block cursor-pointer"
                >
                  Send reminder now →
                </button>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-xs space-y-1">
              <span className="font-bold text-[var(--text)] block">Pending Sign-Off</span>
              <p className="text-[11px] text-[var(--muted)]">
                Spark Mobile App UI Kit is waiting for Sarah Jenkins's email verification.
              </p>
              <button
                onClick={() => navigateTo('/app/projects/proj_fintech_app')}
                className="text-xs font-semibold text-[#FF5A3C] hover:underline pt-1 inline-block cursor-pointer"
              >
                Inspect deliverable →
              </button>
            </div>
          </div>
        </div>

        {/* Recent Workspace Activity (Columns 2 & 3) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-[var(--text)]">Recent Activity</h2>
            <button
              onClick={() => navigateTo('/app/activity')}
              className="text-xs font-semibold text-[#FF5A3C] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {(dashboardData.recentActivity as ActivityEvent[]).map((act) => (
              <div key={act.id} className="py-3 text-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[var(--canvas)] text-[#FF5A3C] flex items-center justify-center font-bold">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[var(--text)]">{act.actorName}</span>{' '}
                    <span className="text-[var(--muted)]">
                      {act.kind.replace('_', ' ')} on <strong>{act.targetLabel}</strong>
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-[var(--muted)] shrink-0 font-mono">
                  {new Date(act.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Create Project Modal */}
      <QuickCreateProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        clients={clients}
        onCreate={async (name, clientId) => {
          const newProj = await client.createProject({ name, clientId });
          navigateTo(`/app/projects/${newProj.id}`);
        }}
      />
    </div>
  );
};
