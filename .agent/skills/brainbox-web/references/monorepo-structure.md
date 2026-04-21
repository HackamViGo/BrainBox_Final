# BrainBox Monorepo — Exact Structure Reference

## Complete Directory Tree

```text
brainbox/
├── package.json                    ← root workspace
├── pnpm-workspace.yaml
├── .gitignore
├── .env.example
│
├── apps/
│   ├── web-app/                    ← Next.js 16.2
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── proxy.ts                 ← Supabase session refresh (Next.js 16.2)
│   │   ├── components.json          ← shadcn/ui config
│   │   │
│   │   ├── app/
│   │   │   ├── layout.tsx           ← html, body, Providers, Inter font
│   │   │   ├── page.tsx             ← 'use client' — main SPA shell
│   │   │   ├── globals.css          ← Tailwind v4 + BrainBox CSS vars
│   │   │   ├── providers.tsx        ← 'use client' — Zustand rehydration
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   └── login/           ← optional, or use overlay in page.tsx
│   │   │   │
│   │   │   └── api/
│   │   │       └── auth/
│   │   │           └── callback/
│   │   │               └── route.ts ← Supabase OAuth callback
│   │   │
│   │   ├── screens/                 ← migrated from Vite src/screens/
│   │   │   ├── Dashboard.tsx        ← 'use client'
│   │   │   ├── Extension.tsx        ← 'use client'
│   │   │   ├── Library.tsx          ← 'use client'
│   │   │   ├── Prompts.tsx          ← 'use client'
│   │   │   ├── AINexus.tsx          ← 'use client'
│   │   │   ├── Workspace.tsx        ← 'use client' (dynamic import ReactFlow)
│   │   │   ├── MindGraph.tsx        ← 'use client' (dynamic import D3)
│   │   │   ├── Archive.tsx          ← 'use client'
│   │   │   ├── Settings.tsx         ← 'use client'
│   │   │   ├── Identity.tsx         ← 'use client'
│   │   │   └── Login.tsx            ← 'use client' (overlay component)
│   │   │
│   │   ├── store/
│   │   │   ├── useAppStore.ts       ← activeScreen, theme, auth, sidebar
│   │   │   ├── useLibraryStore.ts   ← folders + items (Supabase sync)
│   │   │   ├── useAINexusStore.ts   ← AI model selection
│   │   │   ├── useExtensionStore.ts ← extension sync state
│   │   │   └── usePromptStore.ts    ← prompts state
│   │   │
│   │   ├── hooks/               ← reusable client hooks
│   │   │   ├── useHasHydrated.ts    ← SSR hydration guard
│   │   │   ├── useThemeCycle.ts     ← 15s auto-cycle (pauses on lib/prompts/studio)
│   │   │   ├── useScrollTransition.ts   ← Dashboard↔Extension
│   │   │   └── useSupabaseRealtime.ts   ← Realtime subscriptions
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                  ← shadcn/ui auto-generated
│   │   │   ├── Sidebar.tsx          ← 'use client' + dynamic NeuralField
│   │   │   ├── PersistentShell.tsx  ← useHasHydrated guard
│   │   │   ├── ApiKeyModal.tsx      ← API key management
│   │   │   └── prompts/             ← prompt sub-components
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts        ← browser client
│   │   │   │   └── server.ts        ← server client
│   │   │   └── gemini.ts            ← migrated from src/services/gemini.ts
│   │   │
│   │   ├── actions/                 ← Server Actions
│   │   │   ├── library.ts           ← createFolder, deleteFolder, upsertItem
│   │   │   └── auth.ts              ← login, logout, getUser
│   │   │
│   │   ├── components/
│   │   │   └── ui/                  ← shadcn/ui components (auto-generated)
│   │   │
│   │   └── scripts/                 ← automation tools
│   │       ├── migrate-screens.ts
│   │       ├── generate-zustand-stores.ts
│   │       └── check-ssr-safety.ts
│   │
│   └── extension/                   ← Vite 8 (scaffold only for now)
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── manifest.json
│       └── src/
│           └── index.tsx
│
├── packages/
│   │
│   ├── types/                       ← @brainbox/types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts             ← re-exports everything
│   │       ├── models.ts            ← Folder, Item, Theme interfaces
│   │       ├── constants.ts         ← THEMES, THEME_KEYS, MODELS (from Vite constants.ts)
│   │       └── schemas.ts           ← Zod schemas
│   │
│   ├── ui/                          ← @brainbox/ui
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── NeuralField.tsx      ← 'use client' — exact port from Vite
│   │       ├── AmbientLight.tsx     ← 'use client'
│   │       └── Sidebar.tsx          ← 'use client' (or keep in web-app for now)
│   │
│   ├── utils/                       ← @brainbox/utils
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── cn.ts                ← clsx + tailwind-merge
│   │       ├── storage.ts           ← STORAGE_KEYS constants
│   │       └── theme.ts             ← getThemeColor, getNextTheme helpers
│   │
│   └── config/                      ← @brainbox/config
│       ├── package.json
│       ├── tailwind.config.ts       ← shared Tailwind config
│       ├── tsconfig.base.json       ← base TS config
│       ├── eslint.config.js         ← shared ESLint
│       └── styles/
│           └── brainbox.css         ← glass-panel, bg-grain, neural-edge CSS
```

---

## Package.json Files

### `packages/types/package.json`

```json
{
  "name": "@brainbox/types",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "zod": "^3.x"
  }
}
```

### `packages/ui/package.json`

```json
{
  "name": "@brainbox/ui",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@brainbox/types": "workspace:*",
    "motion": "^12.x",
    "lucide-react": "^0.5x",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

### `packages/utils/package.json`

```json
{
  "name": "@brainbox/utils",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "dependencies": {
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

### `apps/web-app/package.json`

```json
{
  "name": "web-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@brainbox/types": "workspace:*",
    "@brainbox/ui": "workspace:*",
    "@brainbox/utils": "workspace:*",
    "@supabase/ssr": "^0.x",
    "@supabase/supabase-js": "^2.x",
    "@xyflow/react": "^12.x",
    "d3": "^7.x",
    "lucide-react": "^0.5x",
    "motion": "^12.x",
    "next": "16.2.x",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "zustand": "^5.x",
    "zod": "^3.x",
    "@google/genai": "^1.x"
  },
  "devDependencies": {
    "@brainbox/config": "workspace:*",
    "@types/d3": "^7.x",
    "@types/node": "^22.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x",
    "typescript": "~5.8.x"
  }
}
```

---

## TypeScript Config

### `packages/config/tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": false, // ← DISABLED: breaks Zustand v5 + shadcn/ui
    "jsx": "preserve",
    "incremental": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

### `apps/web-app/tsconfig.json`

```json
{
  "extends": "@brainbox/config/tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@brainbox/types": ["../../packages/types/src/index.ts"],
      "@brainbox/ui": ["../../packages/ui/src/index.ts"],
      "@brainbox/utils": ["../../packages/utils/src/index.ts"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## next.config.ts

```typescript
import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@brainbox/ui", "@brainbox/types", "@brainbox/utils"],
  experimental: {
    // React Compiler (auto-memo) — enabled in Next.js 16
    reactCompiler: true,
  },
};

export default config;
```

---

## Sidebar — Which Screens Show Switch

```typescript
// Derived from Vite App.tsx logic
const SCREENS_WITH_SWITCH = ["dashboard", "workspace", "analytics"] as const;
const SCREENS_WITHOUT_SIDEBAR = ["login"] as const;

// Auto-theme-cycle disabled on:
const SCREENS_NO_AUTO_THEME = ["library", "prompts", "studio"] as const;
```

---

## Supabase Database Schema

```sql
-- Run in Supabase SQL editor

create table folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon_index integer not null default 0,
  parent_id uuid references folders(id) on delete cascade,
  type text not null check (type in ('library', 'prompt')),
  level integer not null default 0,
  created_at timestamptz default now()
);

create table items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null default '',
  type text not null check (type in ('chat', 'prompt')),
  folder_id uuid references folders(id) on delete set null,
  content text not null default '',
  theme text check (theme in ('chatgpt','gemini','claude','grok','perplexity','lmarena','deepseek','qwen')),
  tags text[] default '{}',
  is_frozen boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS policies
alter table folders enable row level security;
alter table items enable row level security;

create policy "Users own their folders" on folders
  for all using (auth.uid() = user_id);

create policy "Users own their items" on items
  for all using (auth.uid() = user_id);
```
