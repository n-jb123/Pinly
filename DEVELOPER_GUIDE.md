# Pinly — Developer & Backend Handoff Guide

This guide is designed for software engineers maintaining Pinly or transitioning the frontend data layer to a production Supabase backend.

---

## 1. Architectural File Organization

Pinly follows a strict single-responsibility file structure:

```
src/
├── config/
│   └── brand.ts                 # Central brand and whitelabel parameters
├── locales/
│   ├── en.json                  # English localization dictionary
│   └── ar.json                  # Arabic localization dictionary (verbatim strings)
├── data/
│   ├── types.ts                 # Strict TypeScript domain interfaces
│   ├── client.ts                # DataClient interface contract
│   ├── context.tsx              # AppContext, browser history router, permissions, QA state
│   └── mock/
│       ├── seed.ts              # High-fidelity demo scenario data
│       └── mockClient.ts        # In-memory implementation of DataClient
├── components/
│   ├── common/                  # Reusable UI primitives (Button, Modal, Badge, Pin, etc.)
│   ├── layout/                  # Shell layouts (AppShell, AdminShell, Header, Sidebar)
│   ├── review/                  # Deliverable renderers & annotation tools (ImageViewer, etc.)
│   └── projects/                # Project cards and configuration modals
└── pages/
    ├── public/                  # Landing, Auth, Legal, Client Review, Client Portal
    ├── app/                     # Freelancer workspace (Dashboard, Projects, Feedback, Settings)
    └── admin/                   # Operator SuperAdmin console views
```

---

## 2. The Data Layer Contract

Screens never import mock data directly. All components invoke methods on `DataClient` through `useApp()` or `useData()`:

```typescript
// Example usage in any component
const { client } = useApp();
const projects = await client.listProjects();
```

### Transitioning to Supabase (Codex / Backend Phase):
To connect real Postgres and Supabase Auth:
1. Create `src/data/supabase/supabaseClient.ts` implementing the exact `DataClient` interface defined in `src/data/client.ts`.
2. Swap the instantiation in `src/data/context.tsx`:
```typescript
// Replace:
const singletonMockClient = new MockDataClient();
// With:
const singletonClient = new SupabaseDataClient();
```
3. No pages or UI components need to be modified.

---

## 3. Normalized Coordinates System

All visual annotations store coordinates as normalized floats from `0.0` to `1.0`:
```typescript
geometry: {
  x: 0.32,  // 32% from media left
  y: 0.28,  // 28% from media top
  w: 0.30,  // 30% width (rectangles)
  h: 0.18   // 18% height (rectangles)
}
```
This guarantees that annotations remain locked to the correct visual element regardless of screen resolution, viewport zoom, or container resizing.
