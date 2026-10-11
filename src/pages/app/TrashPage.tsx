import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { Trash2, RotateCcw, AlertTriangle, Layers } from 'lucide-react';

export const TrashPage: React.FC = () => {
  const { showToast, qaLoading, qaError, qaEmpty } = useApp();
  const [trashItems, setTrashItems] = useState([
    {
      id: 'proj_legacy_campaign',
      name: '2025 Winter Marketing Assets',
      deletedAt: '2026-09-15T09:00:00Z',
      daysRemaining: 12,
      workCount: 3,
    },
  ]);

  if (qaLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-8 w-44 bg-[var(--border)]/50 rounded-xl animate-pulse" />
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (qaError) {
    return <ErrorState onRetry={() => showToast('Refreshed trash', 'info')} />;
  }

  const effectiveItems = qaEmpty ? [] : trashItems;

  const handleRestore = (id: string) => {
    setTrashItems(trashItems.filter((i) => i.id !== id));
    showToast('Project restored from trash', 'success');
  };

  const handlePermanentDelete = (id: string) => {
    if (confirm('Permanently delete this project? This cannot be undone.')) {
      setTrashItems(trashItems.filter((i) => i.id !== id));
      showToast('Project permanently deleted', 'warning');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">Trash Retention</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Deleted projects are stored safely for 30 days before permanent erasure.
        </p>
      </div>

      {effectiveItems.length === 0 ? (
        <EmptyState
          icon={<Trash2 className="w-8 h-8" />}
          title="Trash is empty"
          description="Deleted projects will appear here for 30 days before permanent deletion."
        />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] shadow-xs">
          {effectiveItems.map((item) => (
            <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[var(--text)]">{item.name}</h3>
                <p className="text-xs text-[var(--muted)] flex items-center gap-2">
                  <span>{item.workCount} deliverables</span>
                  <span>•</span>
                  <span className="text-amber-500 font-semibold">{item.daysRemaining} days remaining</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={() => handleRestore(item.id)}
                >
                  Restore
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => handlePermanentDelete(item.id)}
                >
                  Delete Permanently
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
