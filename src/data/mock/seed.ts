/**
 * Pinly Mock Data Scenario
 * Compliant with FRONTEND_SPEC.md section 8
 */

import {
  User,
  Workspace,
  Member,
  Client,
  Project,
  Work,
  Version,
  Thread,
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
} from '../types';

export const seedPlans: Plan[] = [
  {
    id: 'plan_free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'USD',
    limits: {
      activeProjects: 3,
      storageBytes: 1024 * 1024 * 1024, // 1 GB
      members: 1,
      maxUploadBytes: 100 * 1024 * 1024, // 100 MB
      screenshotsPerMonth: 10,
      branding: false,
      webhooks: false,
      certificate: false,
      analytics: 'cards',
    },
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    priceMonthly: 29,
    priceYearly: 290,
    currency: 'USD',
    limits: {
      activeProjects: null, // Unlimited
      storageBytes: 50 * 1024 * 1024 * 1024, // 50 GB
      members: 1,
      maxUploadBytes: 1024 * 1024 * 1024, // 1 GB
      screenshotsPerMonth: 100,
      branding: false,
      webhooks: true,
      certificate: true,
      analytics: 'full',
    },
  },
  {
    id: 'plan_agency',
    name: 'Agency',
    priceMonthly: 79,
    priceYearly: 790,
    currency: 'USD',
    limits: {
      activeProjects: null, // Unlimited
      storageBytes: 250 * 1024 * 1024 * 1024, // 250 GB
      members: 10,
      maxUploadBytes: 2048 * 1024 * 1024, // 2 GB
      screenshotsPerMonth: 500,
      branding: true,
      webhooks: true,
      certificate: true,
      analytics: 'full',
    },
  },
];

export const seedCurrentUser: User = {
  id: 'usr_nazim',
  name: 'Nazim Jbaara',
  email: 'nazemjbaara@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  locale: 'en',
  theme: 'light',
  mfaEnabled: true,
  isPlatformAdmin: true,
};

export const seedWorkspace: Workspace = {
  id: 'ws_studio_noor',
  name: 'Studio Noor',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
  primaryColor: '#FF5A3C',
  clientLocale: 'en',
  timezone: 'UTC',
  planId: 'plan_agency',
  planStatus: 'active',
  storageUsedBytes: 14 * 1024 * 1024 * 1024, // 14 GB
};

export const seedMembers: Member[] = [
  {
    userId: 'usr_nazim',
    name: 'Nazim Jbaara',
    email: 'nazemjbaara@gmail.com',
    role: 'owner',
    joinedAt: '2026-01-10T10:00:00Z',
  },
  {
    userId: 'usr_lina',
    name: 'Lina Al-Mansoor',
    email: 'lina@studionoor.design',
    role: 'member',
    joinedAt: '2026-02-01T14:30:00Z',
  },
];

export const seedClients: Client[] = [
  {
    id: 'cli_acme',
    name: 'Tariq Al-Sabah',
    company: 'Apex Logistics & Retail',
    email: 'tariq@apexlogistics.com',
    projectCount: 2,
  },
  {
    id: 'cli_khalid',
    name: 'Sarah Jenkins',
    company: 'Fintech Spark Dubai',
    email: 'sarah@fintechspark.io',
    projectCount: 1,
  },
  {
    id: 'cli_nour',
    name: 'Nour El-Din',
    company: 'Cairo Creative Collective',
    email: 'nour@creativecairo.eg',
    projectCount: 1,
  },
];

export const seedProjects: Project[] = [
  {
    id: 'proj_website_redesign',
    name: 'Apex Brand & Website Redesign',
    description: 'Complete overhaul of the web platform, corporate brand guidelines, and promo launch video.',
    clientId: 'cli_acme',
    assigneeId: 'usr_nazim',
    deadline: '2026-10-24T18:00:00Z',
    status: 'in_review',
    archived: false,
    workCount: 4,
    openThreads: 2,
    updatedAt: '2026-10-10T08:15:00Z',
  },
  {
    id: 'proj_fintech_app',
    name: 'Spark Mobile App UI Kit',
    description: 'Onboarding flows and interactive trading screens.',
    clientId: 'cli_khalid',
    assigneeId: 'usr_lina',
    deadline: '2026-10-18T12:00:00Z',
    status: 'awaiting_approval',
    archived: false,
    workCount: 2,
    openThreads: 0,
    updatedAt: '2026-10-09T16:20:00Z',
  },
  {
    id: 'proj_brand_identity',
    name: 'Cairo Creative Identity System',
    description: 'Final logo lockups, typography system and business stationery.',
    clientId: 'cli_nour',
    assigneeId: 'usr_nazim',
    deadline: '2026-10-05T00:00:00Z',
    status: 'approved',
    archived: false,
    workCount: 1,
    openThreads: 0,
    updatedAt: '2026-10-04T19:00:00Z',
  },
  {
    id: 'proj_pitch_deck',
    name: 'Q3 Investor Pitch Deck',
    description: 'Draft slides for seed fundraising pitch.',
    clientId: 'cli_acme',
    assigneeId: 'usr_nazim',
    status: 'draft',
    archived: false,
    workCount: 1,
    openThreads: 0,
    updatedAt: '2026-10-02T11:00:00Z',
  },
  {
    id: 'proj_legacy_campaign',
    name: '2025 Winter Marketing Assets',
    description: 'Deleted project kept in 30-day trash retention.',
    clientId: 'cli_khalid',
    assigneeId: 'usr_lina',
    status: 'archived',
    archived: true,
    workCount: 3,
    openThreads: 0,
    updatedAt: '2026-09-15T09:00:00Z',
  },
];

export const seedWorks: Work[] = [
  // Works for 'proj_website_redesign'
  {
    id: 'work_landing_page',
    projectId: 'proj_website_redesign',
    title: 'Landing Page Hero & Features',
    type: 'image',
    status: 'changes_requested',
    order: 0,
    currentVersionId: 'ver_landing_v3',
  },
  {
    id: 'work_brand_pdf',
    projectId: 'proj_website_redesign',
    title: 'Corporate Brand Guidelines PDF',
    type: 'pdf',
    status: 'in_review',
    order: 1,
    currentVersionId: 'ver_brand_v1',
  },
  {
    id: 'work_promo_video',
    projectId: 'proj_website_redesign',
    title: '30s Launch Teaser Video',
    type: 'video',
    status: 'in_review',
    order: 2,
    videoSource: 'upload',
    currentVersionId: 'ver_video_v2',
  },
  {
    id: 'work_website_live',
    projectId: 'proj_website_redesign',
    title: 'Interactive Pricing & Demo Page',
    type: 'website',
    status: 'in_review',
    order: 3,
    websiteMode: 'auto',
    websiteUrl: 'https://apexlogistics.example.com/pricing',
    currentVersionId: 'ver_web_v1',
  },
  // Work for 'proj_fintech_app'
  {
    id: 'work_spark_screens',
    projectId: 'proj_fintech_app',
    title: 'Spark Onboarding Flow',
    type: 'image',
    status: 'awaiting_approval',
    order: 0,
    currentVersionId: 'ver_spark_v2',
  },
  // Work for 'proj_brand_identity'
  {
    id: 'work_cairo_logo',
    projectId: 'proj_brand_identity',
    title: 'Official Logo & Brand Marks',
    type: 'image',
    status: 'approved',
    order: 0,
    currentVersionId: 'ver_cairo_v1',
  },
];

export const seedVersions: Version[] = [
  // Landing Page versions (V1, V2 superseded, V3 sent)
  {
    id: 'ver_landing_v1',
    workId: 'work_landing_page',
    number: 1,
    state: 'superseded',
    sentAt: '2026-10-01T10:00:00Z',
    mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'ver_landing_v2',
    workId: 'work_landing_page',
    number: 2,
    state: 'superseded',
    sentAt: '2026-10-05T12:00:00Z',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'ver_landing_v3',
    workId: 'work_landing_page',
    number: 3,
    state: 'sent',
    sentAt: '2026-10-09T18:00:00Z',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=240&auto=format&fit=crop&q=80',
  },
  // Brand guidelines PDF
  {
    id: 'ver_brand_v1',
    workId: 'work_brand_pdf',
    number: 1,
    state: 'sent',
    sentAt: '2026-10-07T14:00:00Z',
    mediaUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1400&auto=format&fit=crop&q=80',
    pageCount: 6,
    thumbUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=240&auto=format&fit=crop&q=80',
  },
  // Promo video
  {
    id: 'ver_video_v1',
    workId: 'work_promo_video',
    number: 1,
    state: 'superseded',
    sentAt: '2026-10-03T11:00:00Z',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSec: 15,
    thumbUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'ver_video_v2',
    workId: 'work_promo_video',
    number: 2,
    state: 'sent',
    sentAt: '2026-10-08T09:30:00Z',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSec: 30,
    thumbUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=240&auto=format&fit=crop&q=80',
  },
  // Website page
  {
    id: 'ver_web_v1',
    workId: 'work_website_live',
    number: 1,
    state: 'sent',
    sentAt: '2026-10-09T14:00:00Z',
    mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=80',
    liveAllowed: true,
    screenshots: [
      { viewport: 'desktop', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=80' },
      { viewport: 'tablet', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80' },
      { viewport: 'mobile', url: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=500&auto=format&fit=crop&q=80' },
    ],
    thumbUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=240&auto=format&fit=crop&q=80',
  },
  // Spark Screens (V2 sent)
  {
    id: 'ver_spark_v2',
    workId: 'work_spark_screens',
    number: 2,
    state: 'sent',
    sentAt: '2026-10-09T15:00:00Z',
    mediaUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=240&auto=format&fit=crop&q=80',
  },
  // Cairo logo (V1 approved)
  {
    id: 'ver_cairo_v1',
    workId: 'work_cairo_logo',
    number: 1,
    state: 'approved',
    sentAt: '2026-10-04T12:00:00Z',
    mediaUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1600&auto=format&fit=crop&q=80',
    thumbUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=240&auto=format&fit=crop&q=80',
  },
];

export const seedAnnotations: Annotation[] = [
  // Annotations for Landing V3
  {
    id: 'ann_1',
    versionId: 'ver_landing_v3',
    type: 'pin',
    geometry: { x: 0.32, y: 0.28 },
  },
  {
    id: 'ann_2',
    versionId: 'ver_landing_v3',
    type: 'rect',
    geometry: { x: 0.55, y: 0.42, w: 0.30, h: 0.18 },
  },
  {
    id: 'ann_3',
    versionId: 'ver_landing_v3',
    type: 'freehand',
    geometry: {
      x: 0.18,
      y: 0.65,
      points: [[0.18, 0.65], [0.22, 0.68], [0.26, 0.64], [0.30, 0.70]],
    },
  },
  {
    id: 'ann_4',
    versionId: 'ver_landing_v3',
    type: 'general',
  },
  // Annotations for Brand PDF
  {
    id: 'ann_5',
    versionId: 'ver_brand_v1',
    type: 'pin',
    page: 1,
    geometry: { x: 0.45, y: 0.35 },
  },
  {
    id: 'ann_6',
    versionId: 'ver_brand_v1',
    type: 'highlight',
    page: 2,
    geometry: { x: 0.20, y: 0.50, w: 0.60, h: 0.05 },
  },
  // Annotations for Video V2
  {
    id: 'ann_7',
    versionId: 'ver_video_v2',
    type: 'pin',
    timeStart: 6,
    geometry: { x: 0.50, y: 0.40 },
  },
  {
    id: 'ann_8',
    versionId: 'ver_video_v2',
    type: 'rect',
    timeStart: 12,
    timeEnd: 18,
    geometry: { x: 0.25, y: 0.30, w: 0.50, h: 0.35 },
  },
  // Annotations for Website V1
  {
    id: 'ann_9',
    versionId: 'ver_web_v1',
    type: 'pin',
    viewport: 'desktop',
    geometry: { x: 0.40, y: 0.22 },
  },
  {
    id: 'ann_10',
    versionId: 'ver_web_v1',
    type: 'pin',
    viewport: 'mobile',
    geometry: { x: 0.50, y: 0.60 },
  },
  // Previous version annotations (Landing V2)
  {
    id: 'ann_11',
    versionId: 'ver_landing_v2',
    type: 'pin',
    geometry: { x: 0.25, y: 0.30 },
  },
  {
    id: 'ann_12',
    versionId: 'ver_landing_v2',
    type: 'pin',
    geometry: { x: 0.70, y: 0.50 },
  },
];

export const seedThreads: Thread[] = [
  // Threads on Landing V3
  {
    id: 'thr_1',
    annotationId: 'ann_1',
    versionId: 'ver_landing_v3',
    number: 1,
    status: 'open',
    createdAt: '2026-10-10T07:15:00Z',
    comments: [
      {
        id: 'com_1',
        threadId: 'thr_1',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        authorEmail: 'tariq@apexlogistics.com',
        body: 'Can we make the primary CTA button darker and increase the font size by 2px? It feels a little soft on high-res displays.',
        attachments: [],
        reactions: [{ emoji: '👍', count: 1, mine: false }],
        createdAt: '2026-10-10T07:15:00Z',
      },
      {
        id: 'com_2',
        threadId: 'thr_1',
        authorKind: 'member',
        authorName: 'Nazim Jbaara',
        body: 'Great catch Tariq! Updating that now with our bolder coral contrast.',
        attachments: [],
        reactions: [{ emoji: '🚀', count: 2, mine: true }],
        createdAt: '2026-10-10T07:45:00Z',
      },
    ],
  },
  {
    id: 'thr_2',
    annotationId: 'ann_2',
    versionId: 'ver_landing_v3',
    number: 2,
    status: 'open',
    createdAt: '2026-10-10T07:22:00Z',
    comments: [
      {
        id: 'com_3',
        threadId: 'thr_2',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        authorEmail: 'tariq@apexlogistics.com',
        body: 'هل يمكن استبدال هذه الصورة بلقطة شاشة واقعية للوحة التحكم؟ الصورة الحالية عامة جداً.',
        attachments: [
          {
            id: 'att_1',
            name: 'dashboard_reference.png',
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
            mime: 'image/png',
            sizeBytes: 1024 * 450,
          },
        ],
        reactions: [],
        createdAt: '2026-10-10T07:22:00Z',
      },
    ],
  },
  {
    id: 'thr_3',
    annotationId: 'ann_3',
    versionId: 'ver_landing_v3',
    number: 3,
    status: 'resolved',
    createdAt: '2026-10-09T20:10:00Z',
    comments: [
      {
        id: 'com_4',
        threadId: 'thr_3',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'Check the spacing between the partner logos in this section.',
        attachments: [],
        reactions: [{ emoji: '👀', count: 1, mine: false }],
        createdAt: '2026-10-09T20:10:00Z',
      },
      {
        id: 'com_5',
        threadId: 'thr_3',
        authorKind: 'member',
        authorName: 'Lina Al-Mansoor',
        body: 'Aligned them with a standard 48px gap and centered vertical metrics.',
        attachments: [],
        reactions: [],
        createdAt: '2026-10-10T06:00:00Z',
      },
    ],
  },
  {
    id: 'thr_4',
    annotationId: 'ann_4',
    versionId: 'ver_landing_v3',
    number: 4,
    status: 'closed',
    createdAt: '2026-10-09T19:00:00Z',
    comments: [
      {
        id: 'com_6',
        threadId: 'thr_4',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'Overall aesthetic is looking remarkably sharp in this iteration.',
        attachments: [],
        voiceUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
        voiceSec: 14,
        reactions: [{ emoji: '❤️', count: 2, mine: true }],
        createdAt: '2026-10-09T19:00:00Z',
      },
    ],
  },
  // Threads on Brand PDF
  {
    id: 'thr_5',
    annotationId: 'ann_5',
    versionId: 'ver_brand_v1',
    number: 5,
    status: 'resolved',
    createdAt: '2026-10-08T11:00:00Z',
    comments: [
      {
        id: 'com_7',
        threadId: 'thr_5',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'Ensure the CMYK code for our secondary navy matches the ISO coated proof.',
        attachments: [],
        reactions: [],
        createdAt: '2026-10-08T11:00:00Z',
      },
      {
        id: 'com_8',
        threadId: 'thr_5',
        authorKind: 'member',
        authorName: 'Nazim Jbaara',
        body: 'Verified: CMYK 100/78/32/45 matches exact print spec.',
        attachments: [],
        reactions: [{ emoji: '✅', count: 1, mine: false }],
        createdAt: '2026-10-08T14:30:00Z',
      },
    ],
  },
  {
    id: 'thr_6',
    annotationId: 'ann_6',
    versionId: 'ver_brand_v1',
    number: 6,
    status: 'closed',
    createdAt: '2026-10-08T12:00:00Z',
    comments: [
      {
        id: 'com_9',
        threadId: 'thr_6',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'Typo in headline: "Gradiant" should be "Gradient".',
        attachments: [],
        editedAt: '2026-10-08T12:05:00Z',
        reactions: [],
        createdAt: '2026-10-08T12:00:00Z',
      },
      {
        id: 'com_10',
        threadId: 'thr_6',
        authorKind: 'member',
        authorName: 'Lina Al-Mansoor',
        body: 'Fixed spelling across all page headers.',
        attachments: [],
        reactions: [],
        createdAt: '2026-10-08T13:00:00Z',
      },
    ],
  },
  // Video Threads
  {
    id: 'thr_7',
    annotationId: 'ann_7',
    versionId: 'ver_video_v2',
    number: 7,
    status: 'resolved',
    createdAt: '2026-10-08T16:00:00Z',
    comments: [
      {
        id: 'com_11',
        threadId: 'thr_7',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'At 00:06, the transition happens slightly too fast before the viewer can read the tagline.',
        attachments: [],
        reactions: [],
        createdAt: '2026-10-08T16:00:00Z',
      },
      {
        id: 'com_12',
        threadId: 'thr_7',
        authorKind: 'member',
        authorName: 'Nazim Jbaara',
        body: 'Extended hold duration from 1.2s to 2.4s.',
        attachments: [],
        reactions: [{ emoji: '👏', count: 1, mine: true }],
        createdAt: '2026-10-08T18:00:00Z',
      },
    ],
  },
  {
    id: 'thr_8',
    annotationId: 'ann_8',
    versionId: 'ver_video_v2',
    number: 8,
    status: 'closed',
    createdAt: '2026-10-08T17:00:00Z',
    comments: [
      {
        id: 'com_13',
        threadId: 'thr_8',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'Range 00:12 - 00:18: Background music volume drops nicely for the voiceover.',
        attachments: [],
        reactions: [{ emoji: '🔥', count: 3, mine: false }],
        createdAt: '2026-10-08T17:00:00Z',
      },
    ],
  },
  // Website Threads
  {
    id: 'thr_9',
    annotationId: 'ann_9',
    versionId: 'ver_web_v1',
    number: 9,
    status: 'resolved',
    createdAt: '2026-10-09T16:00:00Z',
    comments: [
      {
        id: 'com_14',
        threadId: 'thr_9',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'Pricing card borders look too thin on Safari desktop.',
        attachments: [],
        reactions: [],
        createdAt: '2026-10-09T16:00:00Z',
      },
    ],
  },
  {
    id: 'thr_10',
    annotationId: 'ann_10',
    versionId: 'ver_web_v1',
    number: 10,
    status: 'closed',
    createdAt: '2026-10-09T16:30:00Z',
    comments: [
      {
        id: 'com_15',
        threadId: 'thr_10',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'Mobile layout flows very cleanly, good job.',
        attachments: [],
        reactions: [],
        createdAt: '2026-10-09T16:30:00Z',
      },
    ],
  },
  // Old Version Threads (Landing V2)
  {
    id: 'thr_11',
    annotationId: 'ann_11',
    versionId: 'ver_landing_v2',
    number: 11,
    status: 'resolved',
    createdAt: '2026-10-05T14:00:00Z',
    comments: [
      {
        id: 'com_16',
        threadId: 'thr_11',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'Header navigation items were overflowing on 13" laptop screens.',
        attachments: [],
        reactions: [],
        createdAt: '2026-10-05T14:00:00Z',
      },
    ],
  },
  {
    id: 'thr_12',
    annotationId: 'ann_12',
    versionId: 'ver_landing_v2',
    number: 12,
    status: 'closed',
    createdAt: '2026-10-05T15:00:00Z',
    comments: [
      {
        id: 'com_17',
        threadId: 'thr_12',
        authorKind: 'client',
        authorName: 'Tariq Al-Sabah',
        body: 'This comment was deleted',
        deletedAt: '2026-10-05T16:00:00Z',
        attachments: [],
        reactions: [],
        createdAt: '2026-10-05T15:00:00Z',
      },
    ],
  },
];

export const seedReviewLinks: ReviewLink[] = [
  {
    id: 'link_1',
    projectId: 'proj_website_redesign',
    token: 'apex-redesign-2026',
    url: 'https://pinly.app/r/apex-redesign-2026',
    enabled: true,
    hasPassword: false,
    approverEmails: ['tariq@apexlogistics.com'],
    lastVisitAt: '2026-10-10T07:30:00Z',
    neverOpened: false,
  },
  {
    id: 'link_2',
    projectId: 'proj_fintech_app',
    token: 'spark-ui-8492',
    url: 'https://pinly.app/r/spark-ui-8492',
    enabled: true,
    hasPassword: true,
    password: 'spark-review',
    approverEmails: ['sarah@fintechspark.io'],
    lastVisitAt: '2026-10-09T18:00:00Z',
    neverOpened: false,
  },
  {
    id: 'link_3',
    projectId: 'proj_brand_identity',
    token: 'cairo-identity-991',
    url: 'https://pinly.app/r/cairo-identity-991',
    enabled: true,
    hasPassword: false,
    approverEmails: ['nour@creativecairo.eg'],
    lastVisitAt: '2026-10-04T19:30:00Z',
    neverOpened: false,
  },
  {
    id: 'link_4',
    projectId: 'proj_pitch_deck',
    token: 'deck-draft-332',
    url: 'https://pinly.app/r/deck-draft-332',
    enabled: true,
    hasPassword: false,
    approverEmails: [],
    neverOpened: true, // Shows the "Never opened" flag
  },
];

export const seedApprovals: Approval[] = [
  {
    id: 'appr_cairo_logo',
    workId: 'work_cairo_logo',
    versionId: 'ver_cairo_v1',
    approverName: 'Nour El-Din',
    approverEmail: 'nour@creativecairo.eg',
    approvedAt: '2026-10-04T19:30:00Z',
    ipAddress: '197.35.120.44',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
];

export const seedActivity: ActivityEvent[] = [
  {
    id: 'act_1',
    at: '2026-10-10T07:45:00Z',
    actorName: 'Nazim Jbaara',
    actorKind: 'member',
    kind: 'reply_added',
    targetLabel: 'Thread #1 on Landing Page Hero',
  },
  {
    id: 'act_2',
    at: '2026-10-10T07:22:00Z',
    actorName: 'Tariq Al-Sabah',
    actorKind: 'client',
    kind: 'comment_created',
    targetLabel: 'Thread #2 on Landing Page Hero',
  },
  {
    id: 'act_3',
    at: '2026-10-09T18:00:00Z',
    actorName: 'Nazim Jbaara',
    actorKind: 'member',
    kind: 'version_sent',
    targetLabel: 'Landing Page Hero (V3)',
  },
  {
    id: 'act_4',
    at: '2026-10-04T19:30:00Z',
    actorName: 'Nour El-Din',
    actorKind: 'client',
    kind: 'work_approved',
    targetLabel: 'Cairo Creative Logo (V1)',
  },
];

export const seedNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    at: '2026-10-10T07:22:00Z',
    kind: 'new_feedback',
    text: 'Tariq Al-Sabah pinned a comment on Landing Page Hero & Features',
    read: false,
    href: '/app/projects/proj_website_redesign/works/work_landing_page',
  },
  {
    id: 'notif_2',
    at: '2026-10-09T18:30:00Z',
    kind: 'approval_requested',
    text: 'Sarah Jenkins requested changes on Spark Mobile App UI Kit',
    read: true,
    href: '/app/projects/proj_fintech_app',
  },
  {
    id: 'notif_3',
    at: '2026-10-04T19:30:00Z',
    kind: 'approved',
    text: 'Cairo Creative Identity System has been fully approved by Nour El-Din',
    read: true,
    href: '/app/projects/proj_brand_identity',
  },
];

export const seedWebhooks: WebhookEndpoint[] = [
  {
    id: 'wh_slack',
    kind: 'slack',
    url: 'https://hooks.slack.com/services/T00/B00/XXXXX',
    events: ['comment.created', 'work.approved', 'approval.requested'],
    active: true,
    lastStatus: 'ok',
  },
  {
    id: 'wh_discord',
    kind: 'discord',
    url: 'https://discord.com/api/webhooks/12345/abcdef',
    events: ['work.approved'],
    active: false,
  },
];

export const seedSupportMessages: SupportMessage[] = [
  {
    id: 'sup_1',
    from: 'omar@pixelagency.ae',
    subject: 'Requesting webhook retry rate information',
    body: 'We want to hook Pinly events into our internal CRM via n8n. What is your timeout threshold on failed webhook responses?',
    context: 'Workspace: Pixel Agency AE | Plan: Agency | Browser: Chrome 128 / macOS',
    status: 'new',
    at: '2026-10-10T05:20:00Z',
  },
  {
    id: 'sup_2',
    from: 'karim@designhaus.de',
    subject: 'PDF multi-page annotation question',
    body: 'Can our reviewers search through text inside multi-page PDFs to jump to comments directly?',
    context: 'Workspace: DesignHaus | Plan: Pro | Browser: Safari 18 / iOS',
    status: 'answered',
    at: '2026-10-09T11:00:00Z',
    reply: 'Hello Karim! Yes, with our PDF review tool, reviewers can navigate pages and use the highlight tool directly.',
  },
];

export const seedAnnouncements: Announcement[] = [
  {
    id: 'ann_1',
    title: 'New: High-fidelity Live Voice Review Assistant',
    body: 'You can now talk through feedback and ask Pinly questions about comments in real-time!',
    active: true,
  },
  {
    id: 'ann_2',
    title: 'Scheduled maintenance for storage migration completed',
    body: 'All signed URL endpoints are running at 99.99% reliability.',
    active: false,
  },
];

export const seedAuditEntries: AuditEntry[] = [
  {
    id: 'aud_1',
    at: '2026-10-05T16:00:00Z',
    actorName: 'Tariq Al-Sabah',
    actorRole: 'client',
    type: 'comment.deleted',
    details: 'Deleted comment on Thread #12 (Landing Page V2)',
    originalText: 'Wait, I just noticed the illustration in the footer is slightly misaligned with the text column.',
  },
  {
    id: 'aud_2',
    at: '2026-10-08T12:05:00Z',
    actorName: 'Tariq Al-Sabah',
    actorRole: 'client',
    type: 'comment.edited',
    details: 'Edited comment on Thread #6 (Brand PDF V1)',
    originalText: 'Typo in headline: "Gradiant" should be "Gradient". Also verify font kerning.',
  },
  {
    id: 'aud_3',
    at: '2026-10-04T19:30:00Z',
    actorName: 'Nour El-Din',
    actorRole: 'client',
    type: 'work.approved',
    details: 'Signed off work_cairo_logo (V1) with email confirmation nourish@creativecairo.eg',
  },
];
