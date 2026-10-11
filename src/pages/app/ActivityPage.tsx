import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { ActivityEvent } from '../../data/types';
import { TableSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { History, MessageSquare, CheckCircle2, UploadCloud, Shield, Filter } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { client, t, qaLoading, qaError } = useApp();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const acts = await client.listActivity();
      setEvents(acts);
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
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-8 w-44 bg-[var(--border)]/50 rounded-xl animate-pulse" />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (hasError || qaError) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">{t('nav.activity')}</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Auditable chronological record of uploads, review requests, pinned comments, and verified approvals.
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title={t('empty.activity')}
          description="Workspace activity logs will appear here as team members and clients interact."
        />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] shadow-xs">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--canvas)] text-[#FF5A3C] flex items-center justify-center font-bold shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[var(--text)]">
                    <strong className="font-bold">{ev.actorName}</strong>{' '}
                    <span className="text-[10px] text-[var(--muted)] font-mono">({ev.actorKind})</span>{' '}
                    <span className="text-[var(--muted)]">performed</span>{' '}
                    <span className="font-semibold text-[var(--text)]">{ev.kind.replace('_', ' ')}</span>
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">Target: {ev.targetLabel}</p>
                </div>
              </div>

              <span className="text-[11px] text-[var(--muted)] font-mono shrink-0">
                {new Date(ev.at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
