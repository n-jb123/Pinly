/**
 * Pinly - Client Review & Approval Platform
 * Main Application Routing Entry Point
 */

import React from 'react';
import { AppProvider, useApp } from './data/context';
import { AppShell } from './components/layout/AppShell';
import { AdminShell } from './components/layout/AdminShell';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { AuthPage } from './pages/public/AuthPage';
import { LegalPage } from './pages/public/LegalPage';
import { HelpCenterPage } from './pages/public/HelpCenterPage';
import { ContactPage } from './pages/public/ContactPage';
import { StatusPage } from './pages/public/StatusPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { ClientReviewPage } from './pages/public/ClientReviewPage';
import { ClientPortalPage } from './pages/public/ClientPortalPage';
import { ClientReviewGatePage } from './pages/public/ClientReviewGatePage';
import { ClientReviewVerifyPage } from './pages/public/ClientReviewVerifyPage';
import { ClientReviewUnavailablePage } from './pages/public/ClientReviewUnavailablePage';

// Freelancer App pages
import { DashboardPage } from './pages/app/DashboardPage';
import { ProjectsPage } from './pages/app/ProjectsPage';
import { ProjectDetailPage } from './pages/app/ProjectDetailPage';
import { WorkWorkspacePage } from './pages/app/WorkWorkspacePage';
import { ClientsPage } from './pages/app/ClientsPage';
import { ClientDetailPage } from './pages/app/ClientDetailPage';
import { NotificationsPage } from './pages/app/NotificationsPage';
import { FeedbackPage } from './pages/app/FeedbackPage';
import { AnalyticsPage } from './pages/app/AnalyticsPage';
import { SearchPage } from './pages/app/SearchPage';
import { ActivityPage } from './pages/app/ActivityPage';
import { TrashPage } from './pages/app/TrashPage';
import { SettingsPage } from './pages/app/SettingsPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminWorkspacesPage } from './pages/admin/AdminWorkspacesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminBillingPage } from './pages/admin/AdminBillingPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminPlansPage } from './pages/admin/AdminPlansPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { AdminSupportPage } from './pages/admin/AdminSupportPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const RouterView: React.FC = () => {
  const { currentRoute, canAccessAdmin, navigateTo, t } = useApp();

  // Parse path and query parameters
  const [pathname, queryString] = currentRoute.split('?');
  const searchParams = new URLSearchParams(queryString || '');

  // 1. Public Routes (No shell)
  if (pathname === '/') {
    return <LandingPage />;
  }

  if (pathname === '/auth' || pathname.startsWith('/auth/')) {
    const isSignUp = pathname.includes('sign-up');
    return <AuthPage initialMode={isSignUp ? 'sign-up' : 'sign-in'} />;
  }

  if (pathname.startsWith('/legal/')) {
    const slug = pathname.replace('/legal/', '') || 'terms';
    return <LegalPage slug={slug} />;
  }

  if (pathname === '/help') {
    return <HelpCenterPage />;
  }

  if (pathname === '/contact') {
    return <ContactPage />;
  }

  if (pathname === '/status') {
    return <StatusPage />;
  }

  // 2. Client Review Specific Sub-Routes (Gate, Verify, Unavailable, Review Canvas)
  if (pathname.includes('/gate')) {
    const token = pathname.replace('/r/', '').replace('/gate', '').replace(/^\/+|\/+$/g, '') || 'spark-ui-8492';
    return <ClientReviewGatePage token={token} />;
  }

  if (pathname.includes('/verify')) {
    const token = pathname.replace('/r/', '').replace('/verify', '').replace(/^\/+|\/+$/g, '') || 'apex-redesign-2026';
    return <ClientReviewVerifyPage token={token} />;
  }

  if (pathname.includes('/unavailable')) {
    return <ClientReviewUnavailablePage />;
  }

  if (pathname.startsWith('/r/')) {
    const token = pathname.replace('/r/', '').replace(/^\/+|\/+$/g, '') || 'apex-redesign-2026';
    return <ClientReviewPage token={token} isClientView={true} />;
  }

  if (pathname.startsWith('/portal')) {
    const slug = pathname.replace('/portal/', '').replace('/portal', '').replace(/^\/+|\/+$/g, '');
    return <ClientPortalPage workspaceSlug={slug || undefined} />;
  }

  // 3. Platform Admin Routes (AdminShell) with Permission Guard
  if (pathname.startsWith('/admin')) {
    if (!canAccessAdmin) {
      return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-2xl bg-[var(--surface)] border border-rose-200 dark:border-rose-950 shadow-xl space-y-4">
            <h2 className="text-lg font-black text-rose-600">{t('error.403')}</h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              This area is restricted to the platform operator (SuperAdmin). Switch your role to Administrator in the QA Inspector button to access the console.
            </p>
            <button
              onClick={() => navigateTo('/app')}
              className="px-4 py-2 rounded-xl bg-[#0F1A2E] text-white text-xs font-bold hover:bg-[#1A2844] transition-colors cursor-pointer"
            >
              Back to Freelancer App
            </button>
          </div>
        </div>
      );
    }

    let adminContent = <AdminDashboardPage />;
    if (pathname === '/admin/workspaces') {
      adminContent = <AdminWorkspacesPage />;
    } else if (pathname === '/admin/users') {
      adminContent = <AdminUsersPage />;
    } else if (pathname === '/admin/billing') {
      adminContent = <AdminBillingPage />;
    } else if (pathname === '/admin/announcements') {
      adminContent = <AdminAnnouncementsPage />;
    } else if (pathname === '/admin/plans') {
      adminContent = <AdminPlansPage />;
    } else if (pathname === '/admin/audit') {
      adminContent = <AdminAuditPage />;
    } else if (pathname === '/admin/support') {
      adminContent = <AdminSupportPage />;
    } else if (pathname === '/admin/content') {
      adminContent = <AdminContentPage />;
    } else if (pathname === '/admin/settings') {
      adminContent = <AdminSettingsPage />;
    }

    return <AdminShell>{adminContent}</AdminShell>;
  }

  // 4. Work Review Workspace Route
  if (pathname.includes('/works/')) {
    const parts = pathname.split('/');
    const workId = parts[parts.length - 1];
    const projectId = parts[parts.indexOf('projects') + 1] || 'proj_website_redesign';
    return <WorkWorkspacePage projectId={projectId} workId={workId} />;
  }

  // 5. Project Detail Route (/app/projects/:id)
  if (pathname.startsWith('/app/projects/') && pathname !== '/app/projects') {
    const projectId = pathname.replace('/app/projects/', '');
    return (
      <AppShell>
        <ProjectDetailPage projectId={projectId} />
      </AppShell>
    );
  }

  // 6. Client Detail Route (/app/clients/:id)
  if (pathname.startsWith('/app/clients/') && pathname !== '/app/clients') {
    const clientId = pathname.replace('/app/clients/', '');
    return (
      <AppShell>
        <ClientDetailPage clientId={clientId} />
      </AppShell>
    );
  }

  // 7. Sub-routes for Settings (/app/settings/:tab)
  if (pathname.startsWith('/app/settings/')) {
    const tabName = pathname.replace('/app/settings/', '') as any;
    return (
      <AppShell>
        <SettingsPage initialTab={tabName} />
      </AppShell>
    );
  }

  // 8. Standard Freelancer App Routes (AppShell)
  if (pathname === '/app/projects') {
    const filter = searchParams.get('filter') || 'all';
    return (
      <AppShell>
        <ProjectsPage initialFilter={filter} />
      </AppShell>
    );
  }

  if (pathname === '/app/clients') {
    return (
      <AppShell>
        <ClientsPage />
      </AppShell>
    );
  }

  if (pathname === '/app/notifications') {
    return (
      <AppShell>
        <NotificationsPage />
      </AppShell>
    );
  }

  if (pathname === '/app/feedback') {
    return (
      <AppShell>
        <FeedbackPage />
      </AppShell>
    );
  }

  if (pathname === '/app/analytics') {
    return (
      <AppShell>
        <AnalyticsPage />
      </AppShell>
    );
  }

  if (pathname === '/app/search') {
    return (
      <AppShell>
        <SearchPage />
      </AppShell>
    );
  }

  if (pathname === '/app/activity') {
    return (
      <AppShell>
        <ActivityPage />
      </AppShell>
    );
  }

  if (pathname === '/app/trash') {
    return (
      <AppShell>
        <TrashPage />
      </AppShell>
    );
  }

  if (pathname === '/app/help') {
    return (
      <AppShell>
        <HelpCenterPage />
      </AppShell>
    );
  }

  if (pathname === '/app/settings') {
    return (
      <AppShell>
        <SettingsPage />
      </AppShell>
    );
  }

  if (pathname === '/app') {
    return (
      <AppShell>
        <DashboardPage />
      </AppShell>
    );
  }

  // If starts with /app/ but unmatched, fallback to dashboard
  if (pathname.startsWith('/app')) {
    return (
      <AppShell>
        <DashboardPage />
      </AppShell>
    );
  }

  // 9. Unmatched routes -> 404
  return <NotFoundPage />;
};

export default function App() {
  return (
    <AppProvider>
      <RouterView />
    </AppProvider>
  );
}
