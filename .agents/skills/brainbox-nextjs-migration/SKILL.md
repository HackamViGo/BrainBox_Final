---
name: brainbox-nextjs-migration
description: >
  Converts the BrainBox Vite+React project into a production-ready Next.js 16.2 + React 19.2
  monorepo with pnpm workspaces, Zustand, Zod, Supabase, shadcn/ui, and Tailwind CSS v4.
  Use this skill whenever the user mentions: converting BrainBox to Next.js, setting up the
  BrainBox monorepo, migrating the Vite app, scaffolding apps/web-app, or working on the
  NeuralField/theme/animation system in Next.js context. Also trigger for any task involving
  the BrainBox monorepo structure, shared packages, or the Vite→Next migration path.
---

# BrainBox — Vite → Next.js 16.2 Migration Skill

## Context

BrainBox is a single-page app (Vite + React 19) that manages AI chats and prompts.
It uses a canvas-based `NeuralField` animation, 8 color themes tied to AI models,
a contextual `Sidebar`, and state-based routing (no React Router).

Target: **pnpm monorepo** → `apps/web-app` (Next.js 16.2) + `apps/extension` (Vite 7, future)
+ `packages/ui`, `packages/types`, `packages/utils`, `packages/config`

> ⚠️ **CRITICAL**: Next.js 16.2 + React 19.2 — NOT 15.x. Major API differences apply.
> See `references/nextjs16-react19-api.md` for breaking changes before writing any code.

---

## Phase 0 — Read References First

Before writing any code, read:
1. `references/nextjs16-react19-api.md` — breaking changes in Next.js 16 + React 19
2. `references/monorepo-structure.md` — exact file/folder layout
3. `references/neural-animation-strategy.md` — NeuralField + theme transition strategy

---

## Critical Rule: `'use client'` vs `useEffect`

**These are NOT alternatives — both are required together for browser components.**

| | Какво прави | Без него |
|--|-------------|----------|
| `'use client'` | Директива на ниво файл — казва на Next.js "рендерирай в браузъра" | Компонентът е Server Component → `useState`/`useEffect`/browser APIs = crash |
| `useEffect` | React hook за side effects (canvas, timers, event listeners) | Анимацията/canvas не стартира |

```tsx
// ✅ ПРАВИЛНО — NeuralField, AmbientLight, Sidebar, page.tsx
'use client'                          // ← Next.js директива (ниво файл)
import { useEffect, useRef } from 'react'

export function NeuralField({ mode, theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {                   // ← React hook (ниво компонент)
    const canvas = canvasRef.current
    // canvas animation loop...
    return () => cancelAnimationFrame(animId)
  }, [mode, theme])                   // ← dependencies: mode и themeColor

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}
```

**Правило за всеки файл в BrainBox:**
- Ползва `canvas`, `window`, `document`, `localStorage`, `requestAnimationFrame` → `'use client'` + `useEffect`
- Ползва `useState`, `useRef`, event handlers (`onClick` и т.н.) → `'use client'`
- Само рендерира данни, без интерактивност → Server Component (без директива)

---

## Phase 1 — Monorepo Scaffold

### Root `package.json`
```json
{
  "name": "brainbox-monorepo",
  "private": true,
  "packageManager": "pnpm@9.x",
  "scripts": {
    "dev": "pnpm --filter web-app dev",
    "build": "pnpm --filter web-app build",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck"
  },
  "workspaces": ["apps/*", "packages/*"]
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Directory layout
```
brainbox/
├── apps/
│   ├── web-app/          ← Next.js 16.2
│   └── extension/        ← Vite 7 (future, scaffold only)
├── packages/
│   ├── ui/               ← NeuralField, AmbientLight, Sidebar, shadcn base
│   ├── types/            ← ThemeName, THEMES, Folder, Item, Zod schemas
│   ├── utils/            ← helpers (cn, formatDate, etc.)
│   └── config/           ← tailwind.config, eslint.config, tsconfig base
├── package.json
└── pnpm-workspace.yaml
```

---

## Phase 2 — Shared Packages

### `packages/types`

Export everything from the Vite `src/types.ts` + add Zod schemas:

```typescript
// packages/types/src/index.ts
export type { Folder, Item, Theme } from './models'
export type { ThemeName } from './models'
export { THEMES, THEME_KEYS, MODELS } from './constants'
export { FolderSchema, ItemSchema } from './schemas'  // Zod
```

Key rule: `THEMES` and `ThemeName` live HERE, not in `packages/ui`.
`packages/ui` imports from `@brainbox/types`.

### `packages/utils`

```typescript
// cn helper (clsx + tailwind-merge)
export { cn } from './cn'
// localStorage keys
export { STORAGE_KEYS } from './storage'
// Theme helpers
export { getThemeColor, getNextTheme } from './theme'
```

### `packages/config`

- `tailwind.config.ts` — shared Tailwind v4 config with BrainBox CSS vars
- `tsconfig.base.json` — strict TS config
- `eslint.config.js` — shared ESLint

### `packages/ui`

Contains: `NeuralField`, `AmbientLight`, `Sidebar` + shadcn/ui components.

> ⚠️ All components in `packages/ui` MUST be `'use client'` — they use canvas, refs, mouse events.

---

## Phase 3 — Next.js App (`apps/web-app`)

### Architecture Decision: Single-Page with App Router

The app is **one logical page** (`/`) because:
- `NeuralField` is a persistent canvas — it must NOT unmount between screens
- Dashboard↔Extension transition uses scroll (wheel/touch) → brain→wander→extension animation
- Theme auto-cycles (15s interval) unless on library/prompts/studio screens
- Login overlay animates on top of the already-rendered app

**Routing strategy:**
```
app/
├── layout.tsx          ← html, body, providers
├── page.tsx            ← THE single page (client component)
├── (auth)/
│   └── login/page.tsx  ← optional separate route (or keep as overlay)
└── api/
    └── [...]/          ← Supabase server actions
```

`page.tsx` is `'use client'` and owns `activeScreen` state — same as Vite's `App.tsx`.

### State Management with Zustand

Split into **3 stores** (not one giant store):

```typescript
// store/useAppStore.ts — navigation + theme + auth
interface AppStore {
  activeScreen: ScreenName
  theme: ThemeName
  isLoggedIn: boolean
  isSidebarExpanded: boolean
  isMobileSidebarOpen: boolean
  activeModelId: string
  pendingModelId: string | null
  activeFolder: string | null
  setActiveScreen: (screen: ScreenName) => void
  setTheme: (theme: ThemeName) => void
  // ...actions
}

// store/useLibraryStore.ts — folders + items (persisted to Supabase)
interface LibraryStore {
  libraryFolders: Folder[]
  promptFolders: Folder[]
  items: Item[]
  // CRUD actions
}

// store/useAINexusStore.ts — AI model selection
interface AINexusStore {
  activeModelId: string
  pendingModelId: string | null
  selectModel: (id: string) => void
  confirmModel: () => void
}
```

Use Zustand `persist` middleware with `localStorage` initially, then swap to Supabase.

### Supabase Integration

```typescript
// lib/supabase/client.ts — browser client ('use client')
// lib/supabase/server.ts — server client (Server Components / Route Handlers)
// lib/supabase/middleware.ts — session refresh in middleware.ts

// Schema (Supabase tables):
// users — managed by Supabase Auth
// folders — id, name, icon_index, parent_id, type, level, user_id
// items   — id, title, description, type, folder_id, content, theme, user_id, ...
```

### Zod Validation

```typescript
// packages/types/src/schemas.ts
export const FolderSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  iconIndex: z.number().int().min(0).max(76),
  parentId: z.string().nullable(),
  type: z.enum(['library', 'prompt']),
  level: z.number().int().min(0).max(5),
})

export const ItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string(),
  type: z.enum(['chat', 'prompt']),
  folderId: z.string().nullable(),
  content: z.string(),
  theme: ThemeNameSchema.optional(),
  isFrozen: z.boolean().optional(),
  deletedAt: z.string().optional(),
})
```

---

## Phase 4 — NeuralField Migration (Critical)

> Read `references/neural-animation-strategy.md` for full details.

### Key rules:
1. `NeuralField` must be `'use client'` in `packages/ui`
2. The canvas is `position: fixed` — it persists across ALL screen changes
3. The `mode` prop changes drive the particle transition (brain↔wander↔extension)
4. Mode is derived from `activeScreen` in the store — NOT from routing

```typescript
// In page.tsx
const activeScreen = useAppStore(s => s.activeScreen)
const theme = useAppStore(s => s.theme)

const neuralMode = activeScreen === 'dashboard' ? 'brain'
  : activeScreen === 'extension' ? 'extension'
  : 'wander'
```

### Theme transition animation sequence:
- **Between themes** (same screen): `brain` → intermediate dissolve → `brain`
- **Dashboard → Extension** (scroll down): `brain` → `wander` → `extension`  
- **Extension → Dashboard** (scroll up): `extension` → `wander` → `brain`

The intermediate state is handled by `prevModeRef` in the existing `NeuralField` — **preserve this logic exactly**.

### Dashboard ↔ Extension scroll transition:
```typescript
// In Dashboard screen component
const handleWheel = (e: React.WheelEvent) => {
  if (e.deltaY > 50) setActiveScreen('extension')
}
// In Extension screen component  
const handleWheel = (e: React.WheelEvent) => {
  if (e.deltaY < -50) setActiveScreen('dashboard')
}
```

---

## Phase 5 — CSS / Tailwind Migration

### Global CSS (`apps/web-app/app/globals.css`)

Port ALL custom classes from Vite's `src/index.css`:
- `.glass-panel`, `.glass-panel-light`
- `.bg-grain` (noise texture overlay)
- `.neural-edge-path`, `.neural-edge-path-fast` (animations)
- Custom scrollbar hiding
- `html, body` overflow:hidden + fixed positioning

### Tailwind v4 config
```typescript
// packages/config/tailwind.config.ts
export default {
  content: [
    '../../apps/*/app/**/*.{ts,tsx}',
    '../../apps/*/src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  // No theme customization needed — BrainBox uses inline Tailwind classes
}
```

### shadcn/ui setup
Install in `apps/web-app`. Components go to `apps/web-app/components/ui/`.
Use for: dialogs, dropdowns, tooltips, inputs — NOT for replacing custom BrainBox components.

---

## Phase 6 — Screen Migration Checklist

Migrate screens in this order (complexity low → high):

| Screen | File | Notes |
|--------|------|-------|
| Login | `screens/Login.tsx` | Overlay pattern, zoom-out animation on login |
| Settings | `screens/Settings.tsx` | Simple form, Zod validation |
| Identity | `screens/Identity.tsx` | IdentitySphere — client only |
| Archive | `screens/Archive.tsx` | Monochrome NeuralField mode |
| Library | `screens/Library.tsx` | Folder tree, drag source |
| Prompts | `screens/Prompts.tsx` | 4 sub-views, Gemini API call |
| AINexus | `screens/AINexus.tsx` | Theme mutation on model select |
| Dashboard | `screens/Dashboard.tsx` | Scroll → Extension trigger |
| Extension | `screens/Extension.tsx` | Scroll → Dashboard trigger |
| MindGraph | `screens/MindGraph.tsx` | D3.js — dynamic import required |
| Workspace | `screens/Workspace.tsx` | React Flow — dynamic import required |

### Dynamic imports required:
```typescript
// D3 and React Flow must be dynamic — they're not SSR-safe
const MindGraph = dynamic(() => import('./screens/MindGraph'), { ssr: false })
const Workspace = dynamic(() => import('./screens/Workspace'), { ssr: false })
```

---

## Phase 7 — Sidebar Migration

The Sidebar has 5 `switchMode` states: `global | folders | feathers | pulse | workspace`.

Key rules:
- Sidebar is `'use client'`
- Receives `theme` from store (not prop drilling from page)
- `showSwitch` logic: visible on `dashboard`, `workspace`, `analytics` — hidden on others
- Mobile: overlay behavior with `isMobileSidebarOpen` from store

---

## Phase 8 — Auth Migration

Replace `localStorage` `brainbox_is_logged_in` with Supabase Auth:

```typescript
// middleware.ts (at apps/web-app root)
// Protects all routes except /login
// Uses @supabase/ssr for cookie-based sessions

// app/(auth)/login/page.tsx OR keep as overlay in page.tsx
// Recommended: keep as overlay (AnimatePresence pattern) for the zoom-out animation
```

---

## Automation Tools to Build

Create these scripts in `apps/web-app/scripts/`:

### `migrate-screens.ts`
Reads Vite `src/screens/*.tsx`, strips Vite-specific imports, adds `'use client'`, 
adjusts import paths to monorepo aliases (`@brainbox/types`, `@brainbox/ui`, etc.)

### `generate-zustand-stores.ts`  
Reads `App.tsx` state declarations → generates typed Zustand store files.

### `check-ssr-safety.ts`
Scans all components for `window`, `document`, `localStorage`, `canvas` usage
→ outputs list of files that need `'use client'` or `dynamic()`.

---

## Common Pitfalls

| Issue | Fix |
|-------|-----|
| NeuralField flickers between screens | Keep canvas mounted always — only change `mode` prop |
| `localStorage` errors in SSR | Wrap in `typeof window !== 'undefined'` or use Zustand `persist` with `skipHydration` |
| `motion/react` SSR issues | Add `'use client'` to ALL components using `motion` |
| D3/ReactFlow SSR crash | `dynamic(() => import(...), { ssr: false })` |
| Theme auto-cycle on wrong screens | Check `activeScreen` in store, not URL |
| `canvas.getContext` undefined | Guard with `if (!canvas) return` — already in source, keep it |
| Tailwind v4 in monorepo | Use `@import` in globals.css, NOT `@tailwind` directives |

---

## Definition of Done

- [ ] Monorepo boots with `pnpm dev` from root
- [ ] All 11 screens render correctly
- [ ] NeuralField persists and transitions correctly (brain↔wander↔extension)
- [ ] Theme auto-cycle works (skips library/prompts/studio)
- [ ] Login overlay + zoom-out animation works
- [ ] Sidebar renders with correct switchMode per screen
- [ ] Supabase Auth replaces localStorage login
- [ ] Supabase DB replaces localStorage for folders/items
- [ ] Zod validates all DB inputs/outputs
- [ ] `pnpm build` succeeds with zero TypeScript errors
- [ ] `apps/extension` scaffolded (empty Vite 7 app, ready for future work)
