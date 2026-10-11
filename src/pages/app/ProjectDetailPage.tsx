import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Project, Work, ReviewLink, Client, ActivityEvent } from '../../data/types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SendToClientPanel } from '../../components/projects/SendToClientPanel';
import { AddWorkModal } from '../../components/projects/AddWorkModal';
import { ReviewLinkSettingsModal } from '../../components/projects/ReviewLinkSettingsModal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { PageSkeleton } from '../../components/common/Skeleton';
import {
  ArrowLeft,
  Plus,
  Image,
  FileText,
  Video,
  Globe,
  Settings,
  History,
  Layers,
  MessageSquare,
  Clock,
  Trash2,
  Bell,
  Archive,
  ExternalLink,
} from 'lucide-react';

export const ProjectDetailPage: React.FC<{ projectId?: string }> = ({
  projectId = 'proj_website_redesign',
}) => {
  const { client, t, showToast, navigateTo, qaLoading, qaError } = useApp();

  const [project, setProject] = useState<Project | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [reviewLink, setReviewLink] = useState<ReviewLink | null>(null);
  const [clientInfo, setClientInfo] = useState<Client | undefined>(undefined);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'works' | 'activity' | 'settings'>('works');

  // Modals
  const [showAddWorkModal, setShowAddWorkModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const p = await client.getProject(projectId);
      if (p) {
        setProject(p);
        if (p.clientId) {
          const c = await client.getClient(p.clientId);
          setClientInfo(c);
        }
      } else {
        setHasError(true);
      }
      const wks = await client.listWorks(projectId);
      setWorks(wks);
      const link = await client.getReviewLink(projectId);
      setReviewLink(link);
      const acts = await client.listActivity();
      setActivity(acts);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleSendForReview = async () => {
    await client.sendForReview(projectId);
    showToast(t('toast.sent'), 'success');
    loadData();
  };

  const handleRemindClient = async () => {
    await client.remindClient(projectId);
    showToast('Client reminder email sent', 'success');
  };

  const handleArchive = async () => {
    if (confirm('Archive this project?')) {
      await client.archiveProject(projectId);
      showToast('Project archived', 'info');
      navigateTo('/app/projects');
    }
  };

  const handleDelete = async () => {
    if (confirm('Move this project to trash (retained 30 days)?')) {
      await client.trashProject(projectId);
      showToast('Project moved to trash', 'warning');
      navigateTo('/app/projects');
    }
  };

  if (loading || qaLoading) {
    return <PageSkeleton />;
  }

  if (hasError || qaError || !project || !reviewLink) {
    return (
      <ErrorState
        message="Project could not be found or failed to load."
        onRetry={loadData}
      />
    );
  }

  const getTypeIcon = (type: Work['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4 text-[#FF5A3C]" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-[#FF5A3C]" />;
      case 'video':
        return <Video className="w-4 h-4 text-[#FF5A3C]" />;
      case 'website':
        return <Globe className="w-4 h-4 text-[#FF5A3C]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigateTo('/app/projects')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            Back to Projects
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
              {project.name}
            </h1>
            <Badge status={project.status}>
              {t(`status.${project.status}`)}
            </Badge>
          </div>
          {clientInfo && (
            <p className="text-xs text-[var(--muted)]">
              Client: <strong>{clientInfo.name}</strong> ({clientInfo.company})
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => navigateTo(`/r/${reviewLink.token}`)}
          >
            Open Review Link
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddWorkModal(true)}
          >
            {t('action.addWork')}
          </Button>
        </div>
      </div>

      {/* Prominent Send to Client Panel */}
      {works.length > 0 && (
        <SendToClientPanel
          project={project}
          reviewLink={reviewLink}
          works={works}
          onSendForReview={handleSendForReview}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('works')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'works'
              ? 'border-[#FF5A3C] text-[var(--text)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          Works ({works.length})
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'activity'
              ? 'border-[#FF5A3C] text-[var(--text)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <History className="w-4 h-4" />
          Activity Log
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'border-[#FF5A3C] text-[var(--text)]'
              : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <Settings className="w-4 h-4" />
          Project Settings
        </button>
      </div>

      {/* TAB 1: Works Grid */}
      {activeTab === 'works' && (
        <div className="space-y-4">
          {works.length === 0 ? (
            <EmptyState
              icon={<Layers className="w-8 h-8" />}
              title={t('empty.works')}
              description="Upload images, PDFs, videos, or web links to send for review."
              actionLabel={t('action.addWork')}
              onAction={() => setShowAddWorkModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {works.map((work) => (
                <div
                  key={work.id}
                  onClick={() => navigateTo(`/app/projects/${project.id}/works/${work.id}`)}
                  className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:border-[#FF5A3C]/40 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 h-36 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2 start-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-white">
                      {getTypeIcon(work.type)}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-[var(--text)] truncate group-hover:text-[#FF5A3C] transition-colors">
                      {work.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <Badge status={work.status} size="sm">
                        {t(`status.${work.status}`)}
                      </Badge>
                      <span className="text-[10px] text-[var(--muted)] font-mono">
                        V{work.order + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Activity Stream */}
      {activeTab === 'activity' && (
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] divide-y divide-[var(--border)]">
          {activity.map((act) => (
            <div key={act.id} className="py-3 text-xs flex justify-between items-center">
              <div>
                <strong className="text-[var(--text)]">{act.actorName}</strong>{' '}
                <span className="text-[var(--muted)]">performed {act.kind.replace('_', ' ')} on</span>{' '}
                <strong>{act.targetLabel}</strong>
              </div>
              <span className="text-[10px] text-[var(--muted)] font-mono">
                {new Date(act.at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Project Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--text)]">Review Link & Approvers</h3>
            <p className="text-xs text-[var(--muted)]">
              Manage passcodes, designated client approvers, and token regeneration.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={<Settings className="w-3.5 h-3.5" />}
              onClick={() => setShowSettingsModal(true)}
            >
              Configure Review Link Security
            </Button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--text)]">Client Reminders</h3>
            <p className="text-xs text-[var(--muted)]">
              Send a polite notification email to reminding the client to review open pins.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={<Bell className="w-3.5 h-3.5" />}
              onClick={handleRemindClient}
            >
              {t('action.remindClient')}
            </Button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-rose-200 dark:border-rose-950 space-y-4">
            <h3 className="text-sm font-bold text-rose-600">Danger Zone</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" icon={<Archive className="w-3.5 h-3.5" />} onClick={handleArchive}>
                Archive Project
              </Button>
              <Button variant="danger" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={handleDelete}>
                Move to Trash (30 Days)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddWorkModal
        isOpen={showAddWorkModal}
        onClose={() => setShowAddWorkModal(false)}
        onAddWork={async (data) => {
          await client.createWork(projectId, data);
          showToast('Work created as draft', 'success');
          loadData();
        }}
      />

      <ReviewLinkSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        reviewLink={reviewLink}
        onSave={async (patch) => {
          await client.updateReviewLink(projectId, patch);
          loadData();
        }}
        onRegenerate={async () => {
          await client.regenerateReviewLink(projectId);
          loadData();
        }}
      />
    </div>
  );
};
