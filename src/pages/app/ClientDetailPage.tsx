import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Client, Project } from '../../data/types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { PageSkeleton, CardSkeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { QuickCreateProjectModal } from '../../components/projects/QuickCreateProjectModal';
import {
  ArrowLeft,
  Users,
  Building,
  Mail,
  Send,
  ExternalLink,
  Plus,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  Globe,
  Edit3,
} from 'lucide-react';

export interface ClientDetailPageProps {
  clientId: string;
}

export const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ clientId }) => {
  const { client: dataClient, t, navigateTo, showToast, qaLoading, qaError } = useApp();
  const [clientData, setClientData] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isSendingPortal, setIsSendingPortal] = useState<boolean>(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editCompany, setEditCompany] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const allClients = await dataClient.listClients();
      const current = allClients.find((c) => c.id === clientId) || (await dataClient.getClient(clientId));
      if (!current) {
        setHasError(true);
        return;
      }
      setClientData(current);
      setEditName(current.name);
      setEditCompany(current.company || '');
      setEditEmail(current.email);

      const allProjects = await dataClient.listProjects();
      const clientProjs = allProjects.filter((p) => p.clientId === clientId);
      setProjects(clientProjs);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clientId, dataClient]);

  const handleSendPortalLink = async () => {
    if (!clientData) return;
    setIsSendingPortal(true);
    try {
      await dataClient.sendPortalLink(clientData.id);
      showToast(`Magic access portal link emailed to ${clientData.email}`, 'success');
    } finally {
      setIsSendingPortal(false);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientData) return;
    try {
      const updated = await dataClient.updateClient(clientData.id, {
        name: editName.trim(),
        company: editCompany.trim(),
        email: editEmail.trim(),
      });
      setClientData(updated);
      showToast('Client details updated successfully', 'success');
      setShowEditModal(false);
    } catch {
      showToast('Failed to update client', 'danger');
    }
  };

  if (loading || qaLoading) {
    return <PageSkeleton />;
  }

  if (hasError || qaError || !clientData) {
    return (
      <ErrorState
        message="Client not found or failed to load client profile."
        onRetry={loadData}
      />
    );
  }

  const inReviewCount = projects.filter((p) => p.status === 'in_review').length;
  const approvedCount = projects.filter((p) => p.status === 'approved').length;
  const changesCount = projects.filter((p) => p.status === 'changes_requested').length;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('/app/clients')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          Back to Clients
        </button>
      </div>

      {/* Header Profile Card */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black text-2xl border-2 border-white shadow-sm">
            {clientData.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-black text-[var(--text)] tracking-tight">
                {clientData.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Active Client
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
              {clientData.company && (
                <span className="flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5" />
                  {clientData.company}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {clientData.email}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<Edit3 className="w-3.5 h-3.5" />}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<Send className="w-3.5 h-3.5" />}
            isLoading={isSendingPortal}
            onClick={handleSendPortalLink}
          >
            Send Magic Portal Link
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={<ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />}
            onClick={() => navigateTo(`/portal/${clientData.id}`)}
          >
            View Portal
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowNewProjectModal(true)}
          >
            {t('action.newProject')}
          </Button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs text-[var(--muted)] font-bold">Total Projects</span>
          <div className="text-2xl font-black text-[var(--text)]">{projects.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs text-amber-500 font-bold">In Client Review</span>
          <div className="text-2xl font-black text-[var(--text)]">{inReviewCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs text-rose-500 font-bold">Changes Requested</span>
          <div className="text-2xl font-black text-[var(--text)]">{changesCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-1">
          <span className="text-xs text-emerald-500 font-bold">Approved Deliverables</span>
          <div className="text-2xl font-black text-[var(--text)]">{approvedCount}</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-[var(--text)]">
            Client Review Workspaces ({projects.length})
          </h2>
          <Button
            size="sm"
            variant="outline"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowNewProjectModal(true)}
          >
            Add Deliverable
          </Button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="w-8 h-8" />}
            title="No projects assigned yet"
            description={`Start by creating a review workspace for ${clientData.name} to upload design files, videos, or websites.`}
            actionLabel={t('action.newProject')}
            onAction={() => setShowNewProjectModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} client={clientData} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Client Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" title="Edit Client Details">
        <form onSubmit={handleSaveClient} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Client Name *</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Company / Organization</label>
            <input
              type="text"
              value={editCompany}
              onChange={(e) => setEditCompany(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" type="button" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Create Project Modal */}
      <QuickCreateProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        clients={[clientData]}
        onCreated={() => loadData()}
      />
    </div>
  );
};
