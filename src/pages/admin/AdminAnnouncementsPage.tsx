import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Announcement } from '../../data/types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { Megaphone, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const { client, showToast, qaLoading, qaError } = useApp();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const data = await client.adminListAnnouncements();
      setAnnouncements(data);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    await client.adminSaveAnnouncement({
      title: title.trim(),
      body: body.trim(),
      active: true,
    });

    showToast('Platform banner announcement published', 'success');
    setTitle('');
    setBody('');
    setShowModal(false);
    loadData();
  };

  const handleToggle = async (a: Announcement) => {
    await client.adminSaveAnnouncement({
      ...a,
      active: !a.active,
    });
    setAnnouncements((prev) =>
      prev.map((item) => (item.id === a.id ? { ...item, active: !item.active } : item))
    );
    showToast(`Announcement ${!a.active ? 'activated' : 'deactivated'}`, 'info');
  };

  if (loading || qaLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-[var(--border)]/50 rounded-xl animate-pulse" />
          <div className="h-8 w-32 bg-[var(--border)]/50 rounded-xl animate-pulse" />
        </div>
        <TableSkeleton rows={4} />
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
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">In-App Announcements</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Broadcast platform updates, scheduled maintenance, or feature releases to all logged-in freelancers.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Create Announcement
        </Button>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-8 h-8" />}
          title="No in-app announcements"
          description="Create your first global banner to inform all users about new releases or maintenance."
          action={
            <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
              Create Announcement
            </Button>
          }
        />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] shadow-xs overflow-hidden">
          {announcements.map((a) => (
            <div key={a.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[var(--text)]">{a.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      a.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {a.active ? 'Live Banner' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[var(--muted)] leading-relaxed max-w-xl">{a.body}</p>
              </div>

              <Button
                size="sm"
                variant={a.active ? 'outline' : 'primary'}
                onClick={() => handleToggle(a)}
              >
                {a.active ? 'Deactivate' : 'Publish Banner'}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} maxWidth="sm" title="New Global Announcement">
        <form onSubmit={handleCreate} className="space-y-3.5 pt-1 text-xs">
          <div>
            <label className="block font-semibold mb-1">Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New Live Voice Review Assistant Available!"
              className="w-full p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Message Body</label>
            <textarea
              rows={3}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Provide concise details for users..."
              className="w-full p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
