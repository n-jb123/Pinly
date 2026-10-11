/**
 * Pinly Mock DataClient Implementation
 * State-preserving in-memory implementation of DataClient
 */

import { DataClient } from '../client';
import {
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
  Plan,
  SupportMessage,
  Announcement,
  AuditEntry,
  WebhookEndpoint,
  Locale,
  Role,
  ThreadStatus,
} from '../types';
import {
  seedPlans,
  seedCurrentUser,
  seedWorkspace,
  seedMembers,
  seedClients,
  seedProjects,
  seedWorks,
  seedVersions,
  seedAnnotations,
  seedThreads,
  seedReviewLinks,
  seedApprovals,
  seedActivity,
  seedNotifications,
  seedWebhooks,
  seedSupportMessages,
  seedAnnouncements,
  seedAuditEntries,
} from './seed';

export class MockDataClient implements DataClient {
  private user: User = { ...seedCurrentUser };
  private workspace: Workspace = { ...seedWorkspace };
  private members: Member[] = [...seedMembers];
  private clients: Client[] = [...seedClients];
  private projects: Project[] = [...seedProjects];
  private works: Work[] = [...seedWorks];
  private versions: Version[] = [...seedVersions];
  private annotations: Annotation[] = [...seedAnnotations];
  private threads: Thread[] = [...seedThreads];
  private reviewLinks: ReviewLink[] = [...seedReviewLinks];
  private approvals: Approval[] = [...seedApprovals];
  private activity: ActivityEvent[] = [...seedActivity];
  private notifications: AppNotification[] = [...seedNotifications];
  private webhooks: WebhookEndpoint[] = [...seedWebhooks];
  private plans: Plan[] = [...seedPlans];
  private supportMessages: SupportMessage[] = [...seedSupportMessages];
  private announcements: Announcement[] = [...seedAnnouncements];
  private auditEntries: AuditEntry[] = [...seedAuditEntries];

  // QA Overrides
  public simulateEmpty = false;
  public simulateError = false;
  public simulateLoading = false;
  public simulateWebsiteBlocked = false;

  private delay(ms = 150): Promise<void> {
    if (this.simulateError) {
      return Promise.reject(new Error('Simulated network failure. Try again.'));
    }
    if (this.simulateLoading) {
      return new Promise((resolve) => setTimeout(resolve, 5000));
    }
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Session
  async getSession() {
    await this.delay();
    return { user: this.user, workspace: this.workspace };
  }

  async signIn(email: string, pw?: string) {
    await this.delay();
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (pw !== undefined) {
      if (pw.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (pw === 'wrongpassword') {
        throw new Error('Invalid email or password combination. Try demo: password123');
      }
    }
    this.user.email = email;
    return { user: this.user };
  }

  async signInWithGoogle() {
    await this.delay(350);
    return { user: this.user };
  }

  async signUp(data: { name: string; email: string; password?: string }) {
    await this.delay();
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (data.password && data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    this.user.name = data.name;
    this.user.email = data.email;
    return { user: this.user };
  }

  async signOut() {
    await this.delay();
  }

  async requestPasswordReset(email: string) {
    await this.delay();
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address to receive reset instructions.');
    }
  }

  async verifyEmail(code: string) {
    await this.delay();
    const cleanCode = code.trim();
    if (cleanCode !== '123456' && cleanCode !== '654321') {
      throw new Error('Invalid verification code. Use demo code: 123456');
    }
    return true;
  }

  async verifyTwoFactor(code: string) {
    await this.delay();
    const cleanCode = code.trim();
    if (cleanCode !== '123456' && cleanCode !== '654321') {
      throw new Error('Invalid 2FA code. Use demo code: 123456');
    }
    return true;
  }

  async setLocale(locale: Locale) {
    this.user.locale = locale;
    this.workspace.clientLocale = locale;
  }

  async setTheme(theme: 'system' | 'light' | 'dark') {
    this.user.theme = theme;
  }

  // Workspace
  async getWorkspace() {
    await this.delay();
    return this.workspace;
  }

  async updateWorkspace(patch: Partial<Workspace>) {
    await this.delay();
    this.workspace = { ...this.workspace, ...patch };
    return this.workspace;
  }

  async listMembers() {
    await this.delay();
    return this.members;
  }

  async inviteMember(email: string, role: Role = 'member') {
    await this.delay();
    const newMember: Member = {
      userId: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      joinedAt: new Date().toISOString(),
    };
    this.members.push(newMember);
    return newMember;
  }

  async removeMember(userId: string) {
    await this.delay();
    this.members = this.members.filter((m) => m.userId !== userId);
  }

  async transferOwnership(userId: string) {
    await this.delay();
    this.members = this.members.map((m) => {
      if (m.userId === userId) return { ...m, role: 'owner' };
      if (m.userId === this.user.id) return { ...m, role: 'member' };
      return m;
    });
  }

  async deleteWorkspace() {
    await this.delay();
  }

  async getPlanUsage() {
    await this.delay();
    return {
      storageBytes: this.workspace.storageUsedBytes,
      projectCount: this.projects.filter((p) => !p.archived).length,
      memberCount: this.members.length,
      screenshotsCount: 42,
    };
  }

  async exportMyData() {
    await this.delay();
    return { downloadUrl: '#exported-data.zip' };
  }

  // Clients
  async listClients() {
    await this.delay();
    if (this.simulateEmpty) return [];
    return this.clients;
  }

  async getClient(id: string) {
    await this.delay();
    return this.clients.find((c) => c.id === id);
  }

  async createClient(data: { name: string; company?: string; email: string }) {
    await this.delay();
    const newClient: Client = {
      id: `cli_${Date.now()}`,
      name: data.name,
      company: data.company,
      email: data.email,
      projectCount: 0,
    };
    this.clients.push(newClient);
    return newClient;
  }

  async updateClient(id: string, patch: Partial<Client>) {
    await this.delay();
    this.clients = this.clients.map((c) => (c.id === id ? { ...c, ...patch } : c));
    return this.clients.find((c) => c.id === id)!;
  }

  async sendPortalLink(_clientId: string) {
    await this.delay();
    return { success: true };
  }

  // Projects & Works
  async listProjects(filter?: string) {
    await this.delay();
    if (this.simulateEmpty) return [];
    let result = this.projects;
    if (filter === 'archived') {
      result = result.filter((p) => p.archived);
    } else {
      result = result.filter((p) => !p.archived);
      if (filter && filter !== 'all') {
        result = result.filter((p) => p.status === filter);
      }
    }
    return result;
  }

  async getProject(id: string) {
    await this.delay();
    return this.projects.find((p) => p.id === id);
  }

  async createProject(data: { name: string; clientId?: string }) {
    await this.delay();
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: data.name,
      clientId: data.clientId,
      assigneeId: this.user.id,
      status: 'draft',
      archived: false,
      workCount: 0,
      openThreads: 0,
      updatedAt: new Date().toISOString(),
    };
    this.projects.unshift(newProj);

    // Create associated review link
    const newLink: ReviewLink = {
      id: `link_${Date.now()}`,
      projectId: newProj.id,
      token: `review-${Date.now().toString(36)}`,
      url: `https://pinly.app/r/review-${Date.now().toString(36)}`,
      enabled: true,
      hasPassword: false,
      approverEmails: [],
      neverOpened: true,
    };
    this.reviewLinks.push(newLink);

    return newProj;
  }

  async updateProject(id: string, patch: Partial<Project>) {
    await this.delay();
    this.projects = this.projects.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p));
    return this.projects.find((p) => p.id === id)!;
  }

  async archiveProject(id: string) {
    await this.delay();
    this.projects = this.projects.map((p) => (p.id === id ? { ...p, archived: true, status: 'archived' } : p));
    return this.projects.find((p) => p.id === id)!;
  }

  async trashProject(id: string) {
    await this.delay();
    this.projects = this.projects.filter((p) => p.id !== id);
  }

  async restoreProject(id: string) {
    await this.delay();
    this.projects = this.projects.map((p) => (p.id === id ? { ...p, archived: false, status: 'in_review' } : p));
  }

  async listWorks(projectId: string) {
    await this.delay();
    if (this.simulateEmpty) return [];
    return this.works.filter((w) => w.projectId === projectId);
  }

  async createWork(projectId: string, data: Partial<Work>) {
    await this.delay();
    const newWorkId = `work_${Date.now()}`;
    const newVerId = `ver_${Date.now()}`;

    const newVersion: Version = {
      id: newVerId,
      workId: newWorkId,
      number: 1,
      state: 'draft',
      mediaUrl: data.type === 'website' ? (data.websiteUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600') : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600',
      thumbUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=240',
    };
    this.versions.push(newVersion);

    const newWork: Work = {
      id: newWorkId,
      projectId,
      title: data.title || 'Untitled Work',
      type: data.type || 'image',
      status: 'draft',
      order: this.works.filter((w) => w.projectId === projectId).length,
      currentVersionId: newVerId,
      websiteUrl: data.websiteUrl,
      websiteMode: data.websiteMode || 'auto',
      videoSource: data.videoSource || 'upload',
    };
    this.works.push(newWork);

    // Update project work count
    this.projects = this.projects.map((p) => (p.id === projectId ? { ...p, workCount: p.workCount + 1 } : p));

    return newWork;
  }

  async reorderWorks(projectId: string, workIds: string[]) {
    await this.delay();
    workIds.forEach((id, index) => {
      this.works = this.works.map((w) => (w.id === id && w.projectId === projectId ? { ...w, order: index } : w));
    });
  }

  async getWork(id: string) {
    await this.delay();
    return this.works.find((w) => w.id === id);
  }

  async uploadVersion(workId: string, mediaUrl: string) {
    await this.delay();
    const existing = this.versions.filter((v) => v.workId === workId);
    const nextNumber = existing.length + 1;
    const newVer: Version = {
      id: `ver_${Date.now()}`,
      workId,
      number: nextNumber,
      state: 'draft', // uploaded as hidden draft
      mediaUrl,
      thumbUrl: mediaUrl,
    };
    this.versions.push(newVer);
    this.works = this.works.map((w) => (w.id === workId ? { ...w, currentVersionId: newVer.id } : w));
    return newVer;
  }

  async sendForReview(workIdOrProjectId: string) {
    await this.delay();
    const work = this.works.find((w) => w.id === workIdOrProjectId);
    if (work) {
      this.versions = this.versions.map((v) => {
        if (v.id === work.currentVersionId) {
          return { ...v, state: 'sent', sentAt: new Date().toISOString() };
        }
        if (v.workId === work.id && v.state === 'sent') {
          return { ...v, state: 'superseded' };
        }
        return v;
      });
      this.works = this.works.map((w) => (w.id === work.id ? { ...w, status: 'in_review' } : w));
    }
  }

  async requestApproval(workId: string) {
    await this.delay();
    this.works = this.works.map((w) => (w.id === workId ? { ...w, status: 'awaiting_approval' } : w));
  }

  async reopenWork(workId: string) {
    await this.delay();
    this.works = this.works.map((w) => (w.id === workId ? { ...w, status: 'changes_requested' } : w));
  }

  async compareVersions(v1Id: string, v2Id: string) {
    await this.delay();
    const v1 = this.versions.find((v) => v.id === v1Id)!;
    const v2 = this.versions.find((v) => v.id === v2Id)!;
    return { v1, v2 };
  }

  // Review Link
  async getReviewLink(projectId: string) {
    await this.delay();
    let link = this.reviewLinks.find((l) => l.projectId === projectId);
    if (!link) {
      link = {
        id: `link_${Date.now()}`,
        projectId,
        token: `token-${projectId.slice(-6)}`,
        url: `https://pinly.app/r/token-${projectId.slice(-6)}`,
        enabled: true,
        hasPassword: false,
        approverEmails: [],
        neverOpened: false,
      };
      this.reviewLinks.push(link);
    }
    return link;
  }

  async updateReviewLink(projectId: string, patch: Partial<ReviewLink>) {
    await this.delay();
    this.reviewLinks = this.reviewLinks.map((l) => (l.projectId === projectId ? { ...l, ...patch } : l));
    return this.reviewLinks.find((l) => l.projectId === projectId)!;
  }

  async regenerateReviewLink(projectId: string) {
    await this.delay();
    const newToken = `token-${Math.random().toString(36).substring(2, 9)}`;
    this.reviewLinks = this.reviewLinks.map((l) =>
      l.projectId === projectId ? { ...l, token: newToken, url: `https://pinly.app/r/${newToken}`, neverOpened: true } : l
    );
    return this.reviewLinks.find((l) => l.projectId === projectId)!;
  }

  async sendReviewEmail(_projectId: string, _text?: string) {
    await this.delay();
  }

  async remindClient(_projectId: string) {
    await this.delay();
  }

  // Review (Client Side)
  async openReviewLink(token: string) {
    await this.delay();
    const link = this.reviewLinks.find((l) => l.token === token) || this.reviewLinks[0];
    const project = this.projects.find((p) => p.id === link.projectId) || this.projects[0];
    const works = this.works.filter((w) => w.projectId === project.id);
    const activeWork = works[0] || this.works[0];
    const versions = this.versions.filter((v) => v.workId === activeWork.id);
    const threads = this.threads.filter((t) => t.versionId === activeWork.currentVersionId);

    // update last visited
    link.lastVisitAt = new Date().toISOString();
    link.neverOpened = false;

    return { project, works, activeWork, versions, threads };
  }

  async identifyReviewer(data: { name: string; email: string }) {
    await this.delay();
    localStorage.setItem('pinly_reviewer_identity', JSON.stringify(data));
  }

  async listThreads(versionId: string) {
    await this.delay();
    if (this.simulateEmpty) return [];
    return this.threads.filter((t) => t.versionId === versionId);
  }

  async createThread(annotation: Partial<Annotation>, commentDraft: { body: string; voiceUrl?: string; attachments?: any[] }) {
    await this.delay();
    const newAnnId = `ann_${Date.now()}`;
    const newAnn: Annotation = {
      id: newAnnId,
      versionId: annotation.versionId!,
      type: annotation.type || 'pin',
      geometry: annotation.geometry,
      page: annotation.page,
      timeStart: annotation.timeStart,
      timeEnd: annotation.timeEnd,
      viewport: annotation.viewport,
    };
    this.annotations.push(newAnn);

    const newThreadId = `thr_${Date.now()}`;
    const newNumber = this.threads.length + 1;
    const initialComment: Comment = {
      id: `com_${Date.now()}`,
      threadId: newThreadId,
      authorKind: 'client',
      authorName: 'Reviewer',
      body: commentDraft.body,
      voiceUrl: commentDraft.voiceUrl,
      attachments: commentDraft.attachments || [],
      reactions: [],
      createdAt: new Date().toISOString(),
    };

    const newThread: Thread = {
      id: newThreadId,
      annotationId: newAnnId,
      versionId: annotation.versionId!,
      number: newNumber,
      status: 'open',
      createdAt: new Date().toISOString(),
      annotation: newAnn,
      comments: [initialComment],
    };
    this.threads.unshift(newThread);
    return newThread;
  }

  async replyToThread(threadId: string, comment: { body: string; voiceUrl?: string; attachments?: any[] }) {
    await this.delay();
    const newComment: Comment = {
      id: `com_${Date.now()}`,
      threadId,
      authorKind: 'member',
      authorName: this.user.name,
      body: comment.body,
      voiceUrl: comment.voiceUrl,
      attachments: comment.attachments || [],
      reactions: [],
      createdAt: new Date().toISOString(),
    };
    this.threads = this.threads.map((t) => {
      if (t.id === threadId) {
        return { ...t, comments: [...(t.comments || []), newComment] };
      }
      return t;
    });
    return newComment;
  }

  async editComment(commentId: string, newBody: string) {
    await this.delay();
    let updatedComment: Comment | undefined;
    this.threads = this.threads.map((t) => {
      const comments = (t.comments || []).map((c) => {
        if (c.id === commentId) {
          // Log original text to audit log before editing
          this.auditEntries.unshift({
            id: `aud_${Date.now()}`,
            at: new Date().toISOString(),
            actorName: c.authorName,
            actorRole: c.authorKind,
            type: 'comment.edited',
            details: `Edited comment in Thread #${t.number}`,
            originalText: c.body,
          });
          updatedComment = { ...c, body: newBody, editedAt: new Date().toISOString() };
          return updatedComment;
        }
        return c;
      });
      return { ...t, comments };
    });
    return updatedComment!;
  }

  async deleteComment(commentId: string) {
    await this.delay();
    this.threads = this.threads.map((t) => {
      const comments = (t.comments || []).map((c) => {
        if (c.id === commentId) {
          // Log original text to audit log before deleting
          this.auditEntries.unshift({
            id: `aud_${Date.now()}`,
            at: new Date().toISOString(),
            actorName: c.authorName,
            actorRole: c.authorKind,
            type: 'comment.deleted',
            details: `Deleted comment in Thread #${t.number}`,
            originalText: c.body,
          });
          return { ...c, body: 'This comment was deleted', deletedAt: new Date().toISOString() };
        }
        return c;
      });
      return { ...t, comments };
    });
  }

  async react(commentId: string, emoji: string) {
    await this.delay();
    this.threads = this.threads.map((t) => {
      const comments = (t.comments || []).map((c) => {
        if (c.id === commentId) {
          const existing = c.reactions.find((r) => r.emoji === emoji);
          let newReactions;
          if (existing) {
            newReactions = c.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.mine ? r.count - 1 : r.count + 1, mine: !r.mine } : r));
          } else {
            newReactions = [...c.reactions, { emoji, count: 1, mine: true }];
          }
          return { ...c, reactions: newReactions };
        }
        return c;
      });
      return { ...t, comments };
    });
  }

  async setThreadStatus(threadId: string, status: ThreadStatus) {
    await this.delay();
    this.threads = this.threads.map((t) => (t.id === threadId ? { ...t, status } : t));
    return this.threads.find((t) => t.id === threadId)!;
  }

  async submitFeedback(workId: string) {
    await this.delay();
    this.works = this.works.map((w) => (w.id === workId ? { ...w, status: 'changes_requested' } : w));
  }

  async requestApprovalVerification(_workId: string, _email: string) {
    await this.delay();
    return { success: true, codeSent: true };
  }

  async confirmApproval(workId: string, _code: string, approverName: string, approverEmail: string) {
    await this.delay();
    const work = this.works.find((w) => w.id === workId)!;
    const newApproval: Approval = {
      id: `appr_${Date.now()}`,
      workId,
      versionId: work.currentVersionId,
      approverName,
      approverEmail,
      approvedAt: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent,
    };
    this.approvals.push(newApproval);

    // Lock version & update status
    this.versions = this.versions.map((v) => (v.id === work.currentVersionId ? { ...v, state: 'approved' } : v));
    this.works = this.works.map((w) => (w.id === workId ? { ...w, status: 'approved' } : w));

    // Auto-close open/resolved threads
    this.threads = this.threads.map((t) => (t.versionId === work.currentVersionId ? { ...t, status: 'closed' } : t));

    return newApproval;
  }

  // Dashboards & Features
  async getDashboard() {
    await this.delay();
    if (this.simulateEmpty) {
      return {
        activeProjectsCount: 0,
        inReviewCount: 0,
        changesRequestedCount: 0,
        awaitingApprovalCount: 0,
        recentActivity: [],
        needsAttention: { unvisitedCount: 0, remindersCount: 0, approvalsPendingCount: 0 },
      };
    }
    return {
      activeProjectsCount: this.projects.filter((p) => !p.archived).length,
      inReviewCount: this.projects.filter((p) => p.status === 'in_review').length,
      changesRequestedCount: this.projects.filter((p) => p.status === 'changes_requested').length,
      awaitingApprovalCount: this.projects.filter((p) => p.status === 'awaiting_approval').length,
      recentActivity: this.activity,
      needsAttention: {
        unvisitedCount: this.reviewLinks.filter((l) => l.neverOpened).length,
        remindersCount: 1,
        approvalsPendingCount: this.projects.filter((p) => p.status === 'awaiting_approval').length,
      },
    };
  }

  async getFeedbackStats(_filter?: any) {
    await this.delay();
    return {
      open: this.threads.filter((t) => t.status === 'open').length,
      resolved: this.threads.filter((t) => t.status === 'resolved').length,
      closed: this.threads.filter((t) => t.status === 'closed').length,
    };
  }

  async listFeedback(filter?: any) {
    await this.delay();
    if (this.simulateEmpty) return [];
    let list = this.threads;
    if (filter?.status) {
      list = list.filter((t) => t.status === filter.status);
    }
    return list;
  }

  async getAnalytics(_range?: string) {
    await this.delay();
    return {
      avgTimeToApprovalHours: 38.5,
      revisionRoundsPerProject: 2.1,
      clientResponseTimeHours: 4.8,
      openFeedbackCount: this.threads.filter((t) => t.status === 'open').length,
      trendDays: [
        { day: 'Mon', approved: 2, revisions: 4 },
        { day: 'Tue', approved: 3, revisions: 3 },
        { day: 'Wed', approved: 5, revisions: 6 },
        { day: 'Thu', approved: 4, revisions: 2 },
        { day: 'Fri', approved: 6, revisions: 5 },
        { day: 'Sat', approved: 2, revisions: 1 },
        { day: 'Sun', approved: 1, revisions: 1 },
      ],
    };
  }

  async search(q: string) {
    await this.delay();
    const query = q.toLowerCase();
    const filteredProjects = this.projects.filter((p) => p.name.toLowerCase().includes(query));
    const filteredClients = this.clients.filter((c) => c.name.toLowerCase().includes(query) || c.company?.toLowerCase().includes(query));
    const filteredWorks = this.works.filter((w) => w.title.toLowerCase().includes(query));
    const allComments = this.threads.flatMap((t) => t.comments || []);
    const filteredComments = allComments.filter((c) => c.body.toLowerCase().includes(query));

    return {
      projects: filteredProjects,
      clients: filteredClients,
      works: filteredWorks,
      comments: filteredComments,
    };
  }

  async listActivity(_filter?: any) {
    await this.delay();
    if (this.simulateEmpty) return [];
    return this.activity;
  }

  async listNotifications() {
    await this.delay();
    if (this.simulateEmpty) return [];
    return this.notifications;
  }

  async markNotificationsRead() {
    await this.delay();
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
  }

  async markNotificationRead(id: string) {
    await this.delay();
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  }

  async deleteNotification(id: string) {
    await this.delay();
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  // Exports & Certs
  async exportFeedback(_workIdOrVersionId: string, format: 'pdf' | 'csv') {
    await this.delay();
    return { downloadUrl: `#feedback-export.${format}` };
  }

  async downloadCertificate(_approvalId: string) {
    await this.delay();
    return { downloadUrl: '#approval-certificate.pdf' };
  }

  // Integrations & Billing
  async listWebhooks() {
    await this.delay();
    return this.webhooks;
  }

  async saveWebhook(endpoint: Partial<WebhookEndpoint>) {
    await this.delay();
    const newEp: WebhookEndpoint = {
      id: endpoint.id || `wh_${Date.now()}`,
      kind: endpoint.kind || 'generic',
      url: endpoint.url || '',
      events: endpoint.events || ['work.approved'],
      active: endpoint.active !== undefined ? endpoint.active : true,
      lastStatus: 'ok',
    };
    if (endpoint.id) {
      this.webhooks = this.webhooks.map((w) => (w.id === endpoint.id ? newEp : w));
    } else {
      this.webhooks.push(newEp);
    }
    return newEp;
  }

  async testWebhook(_id: string) {
    await this.delay();
    return true;
  }

  async deleteWebhook(id: string) {
    await this.delay();
    this.webhooks = this.webhooks.filter((w) => w.id !== id);
  }

  async listPlans() {
    await this.delay();
    return this.plans;
  }

  async getSubscription() {
    await this.delay();
    const currentPlan = this.plans.find((p) => p.id === this.workspace.planId) || this.plans[2];
    return {
      plan: currentPlan,
      cycle: 'yearly' as const,
      renewalDate: '2027-01-10T00:00:00Z',
    };
  }

  async changePlan(planId: string) {
    await this.delay();
    this.workspace.planId = planId;
  }

  async cancelSubscription() {
    await this.delay();
    this.workspace.planStatus = 'cancelled';
  }

  // Support & Admin
  async sendSupportMessage(msg: { subject: string; body: string }) {
    await this.delay();
    const newMsg: SupportMessage = {
      id: `sup_${Date.now()}`,
      from: this.user.email,
      subject: msg.subject,
      body: msg.body,
      context: `User: ${this.user.name} | Workspace: ${this.workspace.name} | Browser: ${navigator.userAgent}`,
      status: 'new',
      at: new Date().toISOString(),
    };
    this.supportMessages.unshift(newMsg);
  }

  async adminOverview() {
    await this.delay();
    return {
      usersCount: 42,
      workspacesCount: 28,
      projectsCount: 114,
      storageTotalGB: 412,
      mrr: 2940,
    };
  }

  async adminListWorkspaces() {
    await this.delay();
    return [
      this.workspace,
      {
        id: 'ws_creative_cairo',
        name: 'Creative Cairo Group',
        primaryColor: '#0F1A2E',
        clientLocale: 'ar' as const,
        timezone: 'Africa/Cairo',
        planId: 'plan_pro',
        planStatus: 'active' as const,
        storageUsedBytes: 4 * 1024 * 1024 * 1024,
      },
      {
        id: 'ws_dubai_spark',
        name: 'Spark Studio Dubai',
        primaryColor: '#FF5A3C',
        clientLocale: 'en' as const,
        timezone: 'Asia/Dubai',
        planId: 'plan_free',
        planStatus: 'active' as const,
        storageUsedBytes: 850 * 1024 * 1024,
      },
    ];
  }

  async adminListUsers() {
    await this.delay();
    return [
      this.user,
      {
        id: 'usr_sarah',
        name: 'Sarah Jenkins',
        email: 'sarah@fintechspark.io',
        locale: 'en' as const,
        theme: 'light' as const,
        mfaEnabled: false,
        isPlatformAdmin: false,
      },
      {
        id: 'usr_omar',
        name: 'Omar Farouq',
        email: 'omar@pixelagency.ae',
        locale: 'ar' as const,
        theme: 'dark' as const,
        mfaEnabled: true,
        isPlatformAdmin: false,
      },
    ];
  }

  async adminSuspend(_kind: 'workspace' | 'user', _id: string) {
    await this.delay();
  }

  async adminChangePlan(workspaceId: string, planId: string) {
    await this.delay();
    if (this.workspace.id === workspaceId) {
      this.workspace.planId = planId;
    }
  }

  async adminListPlans() {
    await this.delay();
    return this.plans;
  }

  async adminSavePlan(plan: Plan) {
    await this.delay();
    this.plans = this.plans.map((p) => (p.id === plan.id ? plan : p));
    return plan;
  }

  async adminRevenue() {
    await this.delay();
    return {
      mrr: 2940,
      churnRate: 1.8,
      newUsers: 14,
      planBreakdown: {
        Free: 18,
        Pro: 12,
        Agency: 6,
      },
    };
  }

  async adminListSupport() {
    await this.delay();
    return this.supportMessages;
  }

  async adminReplySupport(id: string, reply: string) {
    await this.delay();
    this.supportMessages = this.supportMessages.map((m) => (m.id === id ? { ...m, reply, status: 'answered' } : m));
  }

  async adminAudit(_filter?: any) {
    await this.delay();
    return this.auditEntries;
  }

  async adminImpersonate(userId: string) {
    await this.delay();
    const target = (await this.adminListUsers()).find((u) => u.id === userId) || this.user;
    return { user: target };
  }

  async adminListAnnouncements() {
    await this.delay();
    return this.announcements;
  }

  async adminSaveAnnouncement(announcement: Partial<Announcement>) {
    await this.delay();
    const newAnn: Announcement = {
      id: announcement.id || `ann_${Date.now()}`,
      title: announcement.title || '',
      body: announcement.body || '',
      active: announcement.active !== undefined ? announcement.active : true,
    };
    if (announcement.id) {
      this.announcements = this.announcements.map((a) => (a.id === announcement.id ? newAnn : a));
    } else {
      this.announcements.unshift(newAnn);
    }
    return newAnn;
  }

  async adminGetContent() {
    await this.delay();
    return {
      landingHeadline: 'Get client feedback exactly where it matters.',
      termsMd: '# Terms of Service\n\nWelcome to Pinly...',
      privacyMd: '# Privacy Policy\n\nYour privacy is paramount...',
    };
  }

  async adminSaveContent(_data: any) {
    await this.delay();
  }

  async adminGetSettings() {
    await this.delay();
    return {
      platformName: 'Pinly',
      primaryColor: '#FF5A3C',
      paymentProvider: 'Stripe',
      screenshotProvider: 'ScreenshotOne',
      storageLimitFreeGB: 1,
    };
  }

  async adminSaveSettings(_data: any) {
    await this.delay();
  }
}
