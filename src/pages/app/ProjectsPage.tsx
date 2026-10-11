import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Project, Client, ProjectStatus } from '../../data/types';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { QuickCreateProjectModal } from '../../components/projects/QuickCreateProjectModal';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { Plus, Search, FolderKanban, Filter } from 'lucide-react';

export interface ProjectsPageProps {
  initialFilter?: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ initialFilter = 'all' }) => {
  const { client, t, navigateTo, qaLoading, qaError } = useApp();

  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (initialFilter) {
      setActiveFilter(initialFilter);
    }
  }, [initialFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const projs = await client.listProjects(activeFilter);
      const cls = await client.listClients();
      setProjects(projs);
      setClients(cls);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client, activeFilter]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = selectedClient === 'all' || p.clientId === selectedClient;
    return matchesSearch && matchesClient;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            {t('nav.projects')}
          </h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Manage your client review workspaces, deliverables, and revision statuses.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          {t('action.newProject')}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'in_review', label: t('status.in_review') },
            { id: 'changes_requested', label: t('status.changes_requested') },
            { id: 'awaiting_approval', label: t('status.awaiting_approval') },
            { id: 'approved', label: t('status.approved') },
            { id: 'archived', label: t('status.archived') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                navigateTo(tab.id === 'all' ? '/app/projects' : `/app/projects?filter=${tab.id}`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--canvas)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Client Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-[var(--border)]">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--muted)] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full text-xs ps-9 pe-3 py-1.5 rounded-xl bg-[var(--canvas)] border border-transparent focus:border-[var(--border)] focus:outline-none"
            />
          </div>

          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-1.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-[var(--text)] font-semibold"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-8 h-8" />}
          title={t('empty.projects')}
          description="Create your first client project to start uploading creative deliverables."
          actionLabel={t('action.newProject')}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => {
            const clientRecord = clients.find((c) => c.id === proj.clientId);
            return (
              <ProjectCard
                key={proj.id}
                project={proj}
                client={clientRecord}
                onClick={() => navigateTo(`/app/projects/${proj.id}`)}
              />
            );
          })}
        </div>
      )}

      {/* Quick Create Dialog */}
      <QuickCreateProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        clients={clients}
        onCreate={async (name, clientId) => {
          const newP = await client.createProject({ name, clientId });
          navigateTo(`/app/projects/${newP.id}`);
        }}
      />
    </div>
  );
};
