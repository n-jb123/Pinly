import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Thread, ThreadStatus } from '../../data/types';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { PageSkeleton } from '../../components/common/Skeleton';
import { MessageSquare, CheckCircle2, Clock, Filter, ArrowRight } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { client, t, navigateTo, qaLoading, qaError } = useApp();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [stats, setStats] = useState<{ open: number; resolved: number; closed: number }>({ open: 0, resolved: 0, closed: 0 });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const [th, st] = await Promise.all([
        client.listFeedback(),
        client.getFeedbackStats(),
      ]);
      setThreads(th);
      setStats(st);
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

  if (hasError || qaError) {
    return <ErrorState onRetry={loadData} />;
  }

  const filteredThreads = threads.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">{t('nav.feedback')}</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Centralized inbox of all client annotation pins, threads, and resolution statuses across all projects.
        </p>
      </div>

      {/* 3 Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterStatus('open')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'open'
              ? 'bg-[#FF5A3C]/10 border-[#FF5A3C] shadow-sm'
              : 'bg-[var(--surface)] border-[var(--border)]'
          }`}
        >
          <span className="text-xs font-bold text-[var(--muted)]">Open Feedback</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-[#FF5A3C]">{stats.open}</span>
            <span className="text-xs text-[var(--muted)]">unresolved</span>
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('resolved')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'resolved'
              ? 'bg-emerald-500/10 border-emerald-500 shadow-sm'
              : 'bg-[var(--surface)] border-[var(--border)]'
          }`}
        >
          <span className="text-xs font-bold text-[var(--muted)]">Resolved</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{stats.resolved}</span>
            <span className="text-xs text-[var(--muted)]">awaiting client confirmation</span>
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('closed')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'closed'
              ? 'bg-slate-500/10 border-slate-500 shadow-sm'
              : 'bg-[var(--surface)] border-[var(--border)]'
          }`}
        >
          <span className="text-xs font-bold text-[var(--muted)]">Closed & Approved</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-500">{stats.closed}</span>
            <span className="text-xs text-[var(--muted)]">completed</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 pb-1 border-b border-[var(--border)]">
        {['all', 'open', 'resolved', 'closed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-colors ${
              filterStatus === st
                ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {st === 'all' ? 'All Threads' : t(`thread.${st}`)}
          </button>
        ))}
      </div>

      {/* Feedback Threads List */}
      {filteredThreads.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-8 h-8" />}
          title="No feedback found"
          description="There are currently no feedback threads matching this filter."
        />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] shadow-xs overflow-hidden">
          {filteredThreads.map((thread) => {
            const firstComment = thread.comments?.[0];
            return (
              <div
                key={thread.id}
                onClick={() =>
                  navigateTo('/app/projects/proj_website_redesign/works/work_landing_page')
                }
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--canvas)] transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border-2 border-white shadow-xs ${
                      thread.status === 'resolved'
                        ? 'bg-emerald-500 text-white'
                        : thread.status === 'closed'
                        ? 'bg-slate-500 text-white'
                        : 'bg-[#FF5A3C] text-[#0F1A2E]'
                    }`}
                  >
                    {thread.number}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--text)]">
                        {firstComment?.authorName || 'Reviewer'}
                      </span>
                      <Badge status={thread.status} size="sm">
                        {t(`thread.${thread.status}`)}
                      </Badge>
                      <span className="text-[10px] text-[var(--muted)] font-mono">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] line-clamp-2 max-w-2xl leading-relaxed">
                      {firstComment?.body || 'No message content'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-[var(--muted)] group-hover:text-[#FF5A3C] transition-colors shrink-0">
                  <span>Open Deliverable</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
