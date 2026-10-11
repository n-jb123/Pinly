/**
 * Pinly Data Types Contract
 * Exact specifications from FRONTEND_SPEC.md 3.1
 */

export type ID = string;
export type Locale = 'en' | 'ar';
export type Role = 'owner' | 'member';

export interface PlanLimits {
  activeProjects: number | null;
  storageBytes: number;
  members: number;
  maxUploadBytes: number;
  screenshotsPerMonth: number;
  branding: boolean;
  webhooks: boolean;
  certificate: boolean;
  analytics: 'cards' | 'full';
}

export interface Plan {
  id: ID;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  limits: PlanLimits;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  locale: Locale;
  theme: 'system' | 'light' | 'dark';
  mfaEnabled: boolean;
  isPlatformAdmin: boolean;
}

export interface Workspace {
  id: ID;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  clientLocale: Locale;
  timezone: string;
  planId: ID;
  planStatus: 'active' | 'frozen' | 'cancelled';
  storageUsedBytes: number;
}

export interface Member {
  userId: ID;
  name: string;
  email: string;
  role: Role;
  joinedAt: string;
}

export interface Client {
  id: ID;
  name: string;
  company?: string;
  email: string;
  projectCount: number;
}

export type WorkStatus = 'draft' | 'in_review' | 'changes_requested' | 'awaiting_approval' | 'approved';
export type ProjectStatus = WorkStatus | 'archived';

export interface Project {
  id: ID;
  name: string;
  description?: string;
  clientId?: ID;
  assigneeId?: ID;
  deadline?: string;
  status: ProjectStatus;
  archived: boolean;
  workCount: number;
  openThreads: number;
  updatedAt: string;
}

export type WorkType = 'image' | 'pdf' | 'video' | 'website';

export interface Work {
  id: ID;
  projectId: ID;
  title: string;
  type: WorkType;
  status: WorkStatus;
  order: number;
  websiteMode?: 'auto' | 'live' | 'screenshot';
  websiteUrl?: string;
  videoSource?: 'upload' | 'youtube' | 'vimeo';
  currentVersionId: ID;
}

export type VersionState = 'draft' | 'sent' | 'superseded' | 'approved';
export type Viewport = 'desktop' | 'tablet' | 'mobile';

export interface VersionScreenshot {
  viewport: Viewport;
  url: string;
}

export interface Version {
  id: ID;
  workId: ID;
  number: number;
  state: VersionState;
  sentAt?: string;
  mediaUrl: string;
  displayUrl?: string;
  thumbUrl?: string;
  pageCount?: number;
  durationSec?: number;
  screenshots?: VersionScreenshot[];
  liveAllowed?: boolean;
}

export type AnnotationType = 'pin' | 'rect' | 'freehand' | 'highlight' | 'general';

export interface AnnotationGeometry {
  x: number;
  y: number;
  w?: number;
  h?: number;
  points?: [number, number][]; // 0..1 normalized
}

export interface Annotation {
  id: ID;
  versionId: ID;
  type: AnnotationType;
  geometry?: AnnotationGeometry;
  page?: number;
  timeStart?: number;
  timeEnd?: number;
  viewport?: Viewport;
}

export type ThreadStatus = 'open' | 'resolved' | 'closed';

export interface Thread {
  id: ID;
  annotationId: ID;
  versionId: ID;
  number: number;
  status: ThreadStatus;
  createdAt: string;
  annotation?: Annotation;
  comments?: Comment[];
}

export interface Attachment {
  id: ID;
  name: string;
  url: string;
  mime: string;
  sizeBytes: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  mine: boolean;
}

export interface Comment {
  id: ID;
  threadId: ID;
  authorKind: 'member' | 'client';
  authorName: string;
  authorEmail?: string;
  body: string;
  attachments: Attachment[];
  voiceUrl?: string;
  voiceSec?: number;
  reactions: Reaction[];
  editedAt?: string;
  deletedAt?: string;
  createdAt: string;
}

export interface ReviewLink {
  id: ID;
  projectId: ID;
  token: string;
  url: string;
  enabled: boolean;
  hasPassword: boolean;
  password?: string;
  expiresAt?: string;
  approverEmails: string[];
  lastVisitAt?: string;
  neverOpened: boolean;
}

export interface Approval {
  id: ID;
  workId: ID;
  versionId: ID;
  approverName: string;
  approverEmail: string;
  approvedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ActivityEvent {
  id: ID;
  at: string;
  actorName: string;
  actorKind: 'member' | 'client' | 'system';
  kind: string;
  targetLabel: string;
}

export interface AppNotification {
  id: ID;
  at: string;
  kind: string;
  text: string;
  read: boolean;
  href: string;
}

export interface WebhookEndpoint {
  id: ID;
  kind: 'slack' | 'discord' | 'teams' | 'generic';
  url: string;
  events: string[];
  active: boolean;
  lastStatus?: 'ok' | 'failed';
}

export interface SupportMessage {
  id: ID;
  from: string;
  subject: string;
  body: string;
  context: string;
  status: 'new' | 'answered';
  at: string;
  reply?: string;
}

export interface Announcement {
  id: ID;
  title: string;
  body: string;
  active: boolean;
}

export interface AuditEntry {
  id: ID;
  at: string;
  actorName: string;
  actorRole: string;
  type: string;
  details: string;
  originalText?: string;
}
