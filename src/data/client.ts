/**
 * Pinly DataClient Interface
 * Specification from FRONTEND_SPEC.md 3.2
 */

import {
  ID,
  User,
  Workspace,
  Member,
  Client,
  Project,
  Work,
  Version,
  Thread,
  Comment,
  Annotation,
  ReviewLink,
  Approval,
  ActivityEvent,
  AppNotification,
  WebhookEndpoint,
  Plan,
  SupportMessage,
  Announcement,
  AuditEntry,
  Locale,
  Role,
  ThreadStatus,
} from './types';

export interface DataClient {
  // Session
  getSession(): Promise<{ user: User; workspace: Workspace }>;
  signIn(email: string, pw?: string): Promise<{ user: User }>;
  signInWithGoogle(): Promise<{ user: User }>;
  signUp(data: { name: string; email: string; password?: string }): Promise<{ user: User }>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  verifyEmail(code: string): Promise<boolean>;
  verifyTwoFactor(code: string): Promise<boolean>;
  setLocale(locale: Locale): Promise<void>;
  setTheme(theme: 'system' | 'light' | 'dark'): Promise<void>;

  // Workspace
  getWorkspace(): Promise<Workspace>;
  updateWorkspace(patch: Partial<Workspace>): Promise<Workspace>;
  listMembers(): Promise<Member[]>;
  inviteMember(email: string, role?: Role): Promise<Member>;
  removeMember(userId: ID): Promise<void>;
  transferOwnership(userId: ID): Promise<void>;
  deleteWorkspace(): Promise<void>;
  getPlanUsage(): Promise<{ storageBytes: number; projectCount: number; memberCount: number; screenshotsCount: number }>;
  exportMyData(): Promise<{ downloadUrl: string }>;

  // Clients
  listClients(): Promise<Client[]>;
  getClient(id: ID): Promise<Client | undefined>;
  createClient(data: { name: string; company?: string; email: string }): Promise<Client>;
  updateClient(id: ID, patch: Partial<Client>): Promise<Client>;
  sendPortalLink(clientId: ID): Promise<{ success: boolean }>;

  // Projects & Works
  listProjects(filter?: string): Promise<Project[]>;
  getProject(id: ID): Promise<Project | undefined>;
  createProject(data: { name: string; clientId?: ID }): Promise<Project>;
  updateProject(id: ID, patch: Partial<Project>): Promise<Project>;
  archiveProject(id: ID): Promise<Project>;
  trashProject(id: ID): Promise<void>;
  restoreProject(id: ID): Promise<void>;
  listWorks(projectId: ID): Promise<Work[]>;
  createWork(projectId: ID, data: Partial<Work>): Promise<Work>;
  reorderWorks(projectId: ID, workIds: ID[]): Promise<void>;
  getWork(id: ID): Promise<Work | undefined>;
  uploadVersion(workId: ID, mediaUrl: string): Promise<Version>;
  sendForReview(workIdOrProjectId: ID, message?: string): Promise<void>;
  requestApproval(workId: ID): Promise<void>;
  reopenWork(workId: ID): Promise<void>;
  compareVersions(v1Id: ID, v2Id: ID): Promise<{ v1: Version; v2: Version }>;

  // Review Link
  getReviewLink(projectId: ID): Promise<ReviewLink>;
  updateReviewLink(projectId: ID, patch: Partial<ReviewLink>): Promise<ReviewLink>;
  regenerateReviewLink(projectId: ID): Promise<ReviewLink>;
  sendReviewEmail(projectId: ID, text?: string): Promise<void>;
  remindClient(projectId: ID): Promise<void>;

  // Review (Client side)
  openReviewLink(token: string, password?: string): Promise<{ project: Project; works: Work[]; activeWork: Work; versions: Version[]; threads: Thread[] }>;
  identifyReviewer(data: { name: string; email: string }): Promise<void>;
  listThreads(versionId: ID): Promise<Thread[]>;
  createThread(annotation: Partial<Annotation>, commentDraft: { body: string; voiceUrl?: string; attachments?: any[] }): Promise<Thread>;
  replyToThread(threadId: ID, comment: { body: string; voiceUrl?: string; attachments?: any[] }): Promise<Comment>;
  editComment(commentId: ID, newBody: string): Promise<Comment>;
  deleteComment(commentId: ID): Promise<void>;
  react(commentId: ID, emoji: string): Promise<void>;
  setThreadStatus(threadId: ID, status: ThreadStatus): Promise<Thread>;
  submitFeedback(workId: ID): Promise<void>;
  requestApprovalVerification(workId: ID, email: string): Promise<{ success: boolean; codeSent: boolean }>;
  confirmApproval(workId: ID, code: string, approverName: string, approverEmail: string): Promise<Approval>;

  // Dashboards & Features
  getDashboard(): Promise<{
    activeProjectsCount: number;
    inReviewCount: number;
    changesRequestedCount: number;
    awaitingApprovalCount: number;
    recentActivity: ActivityEvent[];
    needsAttention: { unvisitedCount: number; remindersCount: number; approvalsPendingCount: number };
  }>;
  getFeedbackStats(filter?: any): Promise<{ open: number; resolved: number; closed: number }>;
  listFeedback(filter?: any): Promise<Thread[]>;
  getAnalytics(range?: string): Promise<{
    avgTimeToApprovalHours: number;
    revisionRoundsPerProject: number;
    clientResponseTimeHours: number;
    openFeedbackCount: number;
    trendDays: { day: string; approved: number; revisions: number }[];
  }>;
  search(q: string): Promise<{ projects: Project[]; clients: Client[]; comments: Comment[]; works: Work[] }>;
  listActivity(filter?: any): Promise<ActivityEvent[]>;
  listNotifications(): Promise<AppNotification[]>;
  markNotificationsRead(): Promise<void>;
  markNotificationRead(id: ID): Promise<void>;
  deleteNotification(id: ID): Promise<void>;

  // Exports & Certs
  exportFeedback(workIdOrVersionId: ID, format: 'pdf' | 'csv'): Promise<{ downloadUrl: string }>;
  downloadCertificate(approvalId: ID): Promise<{ downloadUrl: string }>;

  // Integrations & Billing
  listWebhooks(): Promise<WebhookEndpoint[]>;
  saveWebhook(endpoint: Partial<WebhookEndpoint>): Promise<WebhookEndpoint>;
  testWebhook(id: ID): Promise<boolean>;
  deleteWebhook(id: ID): Promise<void>;
  listPlans(): Promise<Plan[]>;
  getSubscription(): Promise<{ plan: Plan; cycle: 'monthly' | 'yearly'; renewalDate: string }>;
  changePlan(planId: ID, cycle: 'monthly' | 'yearly'): Promise<void>;
  cancelSubscription(): Promise<void>;

  // Support & Admin
  sendSupportMessage(msg: { subject: string; body: string }): Promise<void>;
  adminOverview(): Promise<{ usersCount: number; workspacesCount: number; projectsCount: number; storageTotalGB: number; mrr: number }>;
  adminListWorkspaces(): Promise<Workspace[]>;
  adminListUsers(): Promise<User[]>;
  adminSuspend(kind: 'workspace' | 'user', id: ID): Promise<void>;
  adminChangePlan(workspaceId: ID, planId: ID): Promise<void>;
  adminListPlans(): Promise<Plan[]>;
  adminSavePlan(plan: Plan): Promise<Plan>;
  adminRevenue(): Promise<{ mrr: number; churnRate: number; newUsers: number; planBreakdown: Record<string, number> }>;
  adminListSupport(): Promise<SupportMessage[]>;
  adminReplySupport(id: ID, reply: string): Promise<void>;
  adminAudit(filter?: any): Promise<AuditEntry[]>;
  adminImpersonate(userId: ID): Promise<{ user: User }>;
  adminListAnnouncements(): Promise<Announcement[]>;
  adminSaveAnnouncement(announcement: Partial<Announcement>): Promise<Announcement>;
  adminGetContent(): Promise<{ landingHeadline: string; termsMd: string; privacyMd: string }>;
  adminSaveContent(data: any): Promise<void>;
  adminGetSettings(): Promise<any>;
  adminSaveSettings(data: any): Promise<void>;
}
