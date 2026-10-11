import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Project, Workspace } from '../../data/types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { PageSkeleton } from '../../components/common/Skeleton';
import { ArrowLeft, Mail, Layers, CheckCircle2, ExternalLink, Building, Lock } from 'lucide-react';

export interface ClientPortalPageProps {
  workspaceSlug?: string;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({ workspaceSlug }) => {
  const { client, workspace, t, showToast, navigateTo, qaLoading, qaError } = useApp();
  const [email, setEmail] = useState<string>('tariq@apexlogistics.com');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [portalWorkspaceName, setPortalWorkspaceName] = useState<string>(workspace.name);

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      if (workspaceSlug) {
        // Look up workspace or client name if specific slug provided
        const clients = await client.listClients();
        const matchedClient = clients.find(
          (c) => c.id === workspaceSlug || c.name.toLowerCase().includes(workspaceSlug.toLowerCase())
        );
        if (matchedClient) {
          setPortalWorkspaceName(`${workspace.name} • ${matchedClient.name}`);
        } else {
          setPortalWorkspaceName(workspaceSlug.replace(/-/g, ' ').toUpperCase());
        }
      } else {
        setPortalWorkspaceName(workspace.name);
      }

      const projs = await client.listProjects();
      setProjects(projs);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [workspaceSlug, client]);

  const handleRequestMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid business email address', 'danger');
      return;
    }
    setMagicLinkSent(true);
    showToast('Magic access link sent to ' + email, 'info');
  };

  if (loading || qaLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  if (hasError || qaError) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-12 px-4 flex items-center justify-center">
        <ErrorState
          message="Failed to load client deliverables portal."
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          Back to Pinly
        </button>

        {/* Workspace Brand Header */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A3C] text-[#0F1A2E] flex items-center justify-center font-black text-lg shadow-xs">
              P
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[var(--text)]">{portalWorkspaceName}</h1>
              <p className="text-xs text-[var(--muted)]">Client Deliverables & Review Portal</p>
            </div>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted)]">
                Signed in as <strong>{email}</strong>
              </span>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-xs text-[#FF5A3C] hover:underline ms-2 cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Authentication required
            </span>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-4 text-center">
            <Mail className="w-10 h-10 text-[#FF5A3C] mx-auto" />
            <h2 className="text-lg font-bold text-[var(--text)]">Access Client Portal</h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Enter your corporate email to receive a passwordless magic access link valid for 15 minutes.
            </p>

            {magicLinkSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs text-start space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="font-bold">Check your inbox!</p>
                <p>We sent a one-click login link to {email}.</p>
                <Button size="sm" variant="primary" onClick={() => setIsLoggedIn(true)}>
                  Simulate Magic Link Click
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRequestMagicLink} className="space-y-3 pt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tariq@apexlogistics.com"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C]"
                />
                <Button type="submit" variant="primary" className="w-full text-xs font-bold">
                  Send Magic Link
                </Button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-[var(--text)]">Your Active Review Projects</h2>
              <span className="text-xs text-[var(--muted)]">{projects.length} deliverables assigned</span>
            </div>

            {projects.length === 0 ? (
              <EmptyState
                icon={<Layers className="w-8 h-8" />}
                title="No active review projects"
                description="Your creative team has not shared any review packages with this client portal yet."
              />
            ) : (
              <div className="grid gap-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--text)]">{proj.name}</h3>
                        <Badge status={proj.status}>
                          {t(`status.${proj.status}`)}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--muted)]">
                        {proj.workCount} deliverables • {proj.openThreads} open threads • Updated {new Date(proj.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      icon={<ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />}
                      onClick={() => navigateTo(`/r/apex-redesign-2026`)}
                    >
                      Open Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
