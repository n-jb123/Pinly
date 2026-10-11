import React, { useState, useEffect } from 'react';
import { useApp } from '../../data/context';
import { Member, Plan, WebhookEndpoint } from '../../data/types';
import { Button } from '../../components/common/Button';
import { UsageBar } from '../../components/common/UsageBar';
import { PlanLock } from '../../components/common/PlanLock';
import { Modal } from '../../components/common/Modal';
import { PageSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import {
  User,
  Shield,
  Building,
  Users,
  Palette,
  Bell,
  Webhook,
  CreditCard,
  HardDrive,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  QrCode,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

export interface SettingsPageProps {
  initialTab?: 'profile' | 'security' | 'workspace' | 'members' | 'branding' | 'notifications' | 'integrations' | 'billing' | 'data';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ initialTab = 'profile' }) => {
  const { client, user, workspace, showToast, t, navigateTo, canManageBilling, canManageMembers, canManageBranding, qaLoading, qaError } = useApp();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'workspace' | 'members' | 'branding' | 'notifications' | 'integrations' | 'billing' | 'data'
  >(initialTab);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSelectTab = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    navigateTo(`/app/settings/${tabId}`);
  };

  // State
  const [members, setMembers] = useState<Member[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookKind, setWebhookKind] = useState<'slack' | 'discord' | 'teams' | 'generic'>('slack');

  const loadData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const [mems, whs, pls, usg] = await Promise.all([
        client.listMembers(),
        client.listWebhooks(),
        client.listPlans(),
        client.getPlanUsage(),
      ]);
      setMembers(mems);
      setWebhooks(whs);
      setPlans(pls);
      setUsage(usg);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [client]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    await client.inviteMember(inviteEmail.trim());
    showToast(`Invitation sent to ${inviteEmail}`, 'success');
    setInviteEmail('');
    setShowInviteModal(false);
    client.listMembers().then(setMembers);
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;
    await client.saveWebhook({
      kind: webhookKind,
      url: webhookUrl.trim(),
      events: ['work.approved', 'comment.created'],
    });
    showToast('Webhook endpoint configured', 'success');
    setWebhookUrl('');
    setShowWebhookModal(false);
    client.listWebhooks().then(setWebhooks);
  };

  const handleExportData = async () => {
    await client.exportMyData();
    showToast('Your full archive download has been prepared', 'success');
  };

  const isAgency = workspace.planId === 'plan_agency';
  const isFree = workspace.planId === 'plan_free';

  const settingsTabs = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'security', label: t('settings.security'), icon: Shield },
    { id: 'workspace', label: t('settings.workspace'), icon: Building },
    { id: 'members', label: t('settings.members'), icon: Users },
    { id: 'branding', label: t('settings.branding'), icon: Palette },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'integrations', label: t('settings.integrations'), icon: Webhook },
    { id: 'billing', label: t('settings.billing'), icon: CreditCard },
    { id: 'data', label: t('settings.data'), icon: HardDrive },
  ];

  if (loading || qaLoading) {
    return <PageSkeleton />;
  }

  if (hasError || qaError) {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">{t('nav.settings')}</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Manage workspace settings, team access, agency branding, webhooks, and billing.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-56 space-y-1 shrink-0">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5A3C] text-[#0F1A2E] font-bold shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 space-y-6">
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[var(--text)]">{t('settings.personalProfile')}</h3>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-14 h-14 rounded-full bg-[#FF5A3C] text-[#0F1A2E] font-bold text-xl flex items-center justify-center border-2 border-white shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--text)]">{user.name}</h4>
                  <p className="text-xs text-[var(--muted)]">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[var(--text)]">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-[var(--muted)]">
                  Protect your account with standard TOTP authenticator apps (Google Authenticator, 1Password).
                </p>
                <div className="p-4 rounded-xl bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-8 h-8 text-[var(--text)]" />
                    <div className="text-xs">
                      <span className="font-bold block text-[var(--text)]">Authenticator App Status</span>
                      <span className="text-emerald-600 font-semibold">Enabled & Active</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Regenerate Backup Codes
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-rose-200 dark:border-rose-950 space-y-3">
                <h3 className="font-bold text-sm text-rose-600">Delete Personal Account</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Personal details will be erased. Past comments will display as &quot;Deleted user&quot;, and approval sign-off certificates will preserve legally binding verification logs as disclosed in the Privacy Policy.
                </p>
                <Button size="sm" variant="danger">
                  Request Account Deletion
                </Button>
              </div>
            </div>
          )}

          {/* WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[var(--text)]">Workspace Details</h3>
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue={workspace.name}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Default Client Language</label>
                  <select className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-semibold">
                    <option value="en">English (LTR)</option>
                    <option value="ar">العربية (RTL)</option>
                  </select>
                </div>
                <Button size="sm" variant="primary">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* MEMBERS */}
          {activeTab === 'members' && (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)]">Team Members ({members.length})</h3>
                  <p className="text-xs text-[var(--muted)]">All members can create projects and reply to feedback.</p>
                </div>
                <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowInviteModal(true)}>
                  Invite Member
                </Button>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {members.map((m) => (
                  <div key={m.userId} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[var(--text)]">{m.name}</span>{' '}
                      <span className="text-[var(--muted)]">({m.email})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--canvas)] text-[10px] font-bold uppercase">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BRANDING */}
          {activeTab === 'branding' && (
            <>
              {!isAgency ? (
                <PlanLock featureName="Agency Whitelabel & Custom Review Branding" minPlan="Agency" />
              ) : (
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-[var(--text)]">Agency Branding (Agency Plan)</h3>
                  <p className="text-xs text-[var(--muted)]">
                    Customize the client review header, emails, and client portal with your agency&apos;s identity.
                  </p>

                  <div className="space-y-3 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Agency Display Name</label>
                      <input
                        type="text"
                        defaultValue={workspace.name}
                        className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Primary Brand Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" defaultValue="#FF5A3C" className="w-10 h-8 rounded-lg cursor-pointer" />
                        <span className="text-xs font-mono">#FF5A3C</span>
                      </div>
                    </div>
                    <Button size="sm" variant="primary">
                      Update Brand Settings
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* INTEGRATIONS (WEBHOOKS) */}
          {activeTab === 'integrations' && (
            <>
              {isFree ? (
                <PlanLock featureName="Slack, Discord & Generic Webhooks" minPlan="Pro" />
              ) : (
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text)]">Webhook Endpoints ({webhooks.length})</h3>
                      <p className="text-xs text-[var(--muted)]">Send automated JSON notifications on new feedback or approvals.</p>
                    </div>
                    <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowWebhookModal(true)}>
                      Add Webhook
                    </Button>
                  </div>

                  <div className="divide-y divide-[var(--border)]">
                    {webhooks.map((wh) => (
                      <div key={wh.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold uppercase text-[10px] text-[#FF5A3C]">{wh.kind}</span>
                          <p className="font-mono text-[11px] text-[var(--muted)] truncate max-w-sm">{wh.url}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          Active (200 OK)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* BILLING */}
          {activeTab === 'billing' && (
            !canManageBilling ? (
              <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="font-bold text-sm text-[var(--text)]">Permission Restricted</h3>
                <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                  Only the workspace owner can view subscription invoices, manage payments, or upgrade billing plans.
                </p>
              </div>
            ) : (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6">
              <div>
                <h3 className="font-bold text-sm text-[var(--text)]">Plan & Resource Usage</h3>
                <p className="text-xs text-[var(--muted)]">Your workspace is currently on the <strong>Agency Plan</strong>.</p>
              </div>

              {usage && (
                <div className="space-y-4 max-w-md">
                  <UsageBar label="Storage Capacity" used={14} total={250} unit="GB" />
                  <UsageBar label="Active Projects" used={4} total={100} unit="Projects" />
                  <UsageBar label="Team Seats" used={members.length} total={10} unit="Members" />
                  <UsageBar label="Website Screenshots" used={42} total={500} unit="/ month" />
                </div>
              )}

              <div className="pt-2">
                <Button size="sm" variant="outline">
                  Manage Stripe Subscription
                </Button>
              </div>
            </div>
            )
          )}

          {/* DATA EXPORT */}
          {activeTab === 'data' && (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[var(--text)]">Export Workspace Data</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Download a complete standalone ZIP archive of all uploaded original deliverables, annotations, comments, and immutable approval certificates.
              </p>
              <Button size="sm" variant="primary" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExportData}>
                {t('settings.exportData')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} maxWidth="sm" title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Member Email Address</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@agency.com"
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" type="button" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Webhook Modal */}
      <Modal isOpen={showWebhookModal} onClose={() => setShowWebhookModal(false)} maxWidth="sm" title="Configure Webhook">
        <form onSubmit={handleSaveWebhook} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Webhook Type</label>
            <select
              value={webhookKind}
              onChange={(e) => setWebhookKind(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] font-semibold"
            >
              <option value="slack">Slack Incoming Webhook</option>
              <option value="discord">Discord Channel Webhook</option>
              <option value="teams">Microsoft Teams Webhook</option>
              <option value="generic">Generic Signed JSON Webhook (HMAC)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Target Endpoint URL</label>
            <input
              type="url"
              required
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" type="button" onClick={() => setShowWebhookModal(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Webhook
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
