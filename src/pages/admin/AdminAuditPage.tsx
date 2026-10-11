import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { AuditEntry } from '../../data/types';
import { TableSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { History, ShieldAlert, Eye, MessageSquare, AlertCircle } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const { client, qaLoading, qaError } = useApp();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const auds = await client.adminAudit();
      setEntries(auds);
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Platform Audit & Legal Ledger</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Strict immutable audit trail. Original pre-edit and pre-deletion comment contents are retained exclusively here for legal dispute resolution.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          Admin Classified
        </span>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title="No audit entries logged yet"
          description="User actions, comment revisions, and security events will be automatically tracked here."
        />
      ) : (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] shadow-xs overflow-hidden">
        {entries.map((entry) => (
          <div key={entry.id} className="p-5 space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--text)]">{entry.actorName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--canvas)] uppercase font-mono">
                  {entry.actorRole}
                </span>
                <span className="font-semibold text-rose-600 font-mono text-[11px]">{entry.type}</span>
              </div>
              <span className="text-[11px] text-[var(--muted)] font-mono">
                {new Date(entry.at).toLocaleString()}
              </span>
            </div>

            <p className="text-[var(--muted)]">{entry.details}</p>

            {/* Original content display - ONLY visible to platform admin */}
            {entry.originalText && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 space-y-1">
                <span className="font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <Eye className="w-3.5 h-3.5" />
                  Preserved Original Text Prior to Modification:
                </span>
                <p className="font-mono text-xs bg-[var(--surface)] p-2 rounded-lg border border-amber-500/20">
                  &ldquo;{entry.originalText}&rdquo;
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
