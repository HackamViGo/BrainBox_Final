# Next.js 16.2 + React 19.2 — Breaking Changes & Key APIs

## Next.js 16 vs 15 — Critical Differences

### App Router is Default and Stable

- Pages Router still available but not recommended for new projects
- `app/` directory structure is the standard
- Route Groups `(group)/` for logical organization without URL segments

### React 19 Compiler (Auto-Memo)

- React 19 includes the React Compiler (formerly React Forget)
- **You do NOT need `useMemo`, `useCallback`, `memo()` for performance** — compiler handles it
- Still use them for semantic correctness (stable refs), not performance
- NeuralField's `useRef` patterns remain valid — refs are never affected by compiler

### New React 19 APIs to Use

```typescript
// use() hook — replaces useEffect for data fetching in some cases
import { use } from "react";
const data = use(promise); // suspends until resolved

// useOptimistic — for optimistic UI updates (Library, Prompts screens)
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (state, newItem) => [...state, newItem],
);

// useFormStatus — for form states (Settings screen)
import { useFormStatus } from "react-dom";

// useActionState — replaces useReducer + server action pattern
import { useActionState } from "react";
```

### Server Components vs Client Components

**Default: Server Component** (no `'use client'`)
**Explicit Client:** Add `'use client'` at top of file

Rules for BrainBox:

- `app/layout.tsx` → Server Component (wraps providers)
- `app/page.tsx` → `'use client'` (owns activeScreen state)
- All screens → `'use client'` (use motion, refs, event handlers)
- All packages/ui components → `'use client'`
- Zustand stores → `'use client'`
- Supabase server client → Server Component only

### Server Actions (replaces API routes for mutations)

```typescript
// app/actions/library.ts
"use server";
import { z } from "zod";
import { FolderSchema } from "@brainbox/types";

export async function createFolder(data: unknown) {
  const validated = FolderSchema.parse(data); // Zod validates on server
  const supabase = createServerClient();
  const { data: folder, error } = await supabase
    .from("folders")
    .insert(validated)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return folder;
}
```

### Metadata API (Next.js 16)

```typescript
// app/layout.tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "BrainBox",
  description: "Вторият ти мозък, подреден до съвършенство.",
};
```

### next/font

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin", "cyrillic"] });
// Apply: <html className={inter.className}>
```

### Dynamic Imports (REQUIRED for D3, ReactFlow, Canvas)

```typescript
import dynamic from 'next/dynamic'

// For components that use browser APIs
const MindGraph = dynamic(
  () => import('@/screens/MindGraph').then(m => m.MindGraph),
  {
    ssr: false,
    loading: () => <div className="h-full flex items-center justify-center">
      <span className="text-white/30">Loading...</span>
    </div>
  }
)

// NeuralField — technically needs ssr:false too (canvas API)
const NeuralField = dynamic(
  () => import('@brainbox/ui').then(m => m.NeuralField),
  { ssr: false }
)
```

### next/image vs img

- Use `next/image` for static assets
- For the NeuralField canvas: regular `<canvas>` element (no change)
- For icons: lucide-react directly (no change)

---

## Tailwind CSS v4 in Next.js 16

### Setup (different from v3!)

```typescript
// tailwind.config.ts does NOT use `content` array the same way
// v4 uses CSS-first configuration

// app/globals.css
@import "tailwindcss";
@import "../../packages/config/styles/brainbox.css"; /* shared vars */

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

### No `tailwind.config.js` plugins needed for v4

- `@tailwindcss/vite` → use `@tailwindcss/postcss` in Next.js
- Or use the new `tailwindcss` package directly with PostCSS

### CSS Variables approach (BrainBox theme system)

```css
/* packages/config/styles/brainbox.css */
:root {
  --glass-bg: rgba(20, 20, 20, 0.4);
  --glass-border: rgba(255, 255, 255, 0.08);
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
}
```

---

## Zustand v5 (с React 19) — Верифицирано от Context7

### ⚠️ Задължително: `skipHydration: true` за Next.js SSR

Без него: сървърът рендерира с initial state, клиентът рехидратира с localStorage state → React hydration mismatch error.

```typescript
// store/useAppStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      activeScreen: "dashboard",
      theme: "chatgpt" as ThemeName,
      isLoggedIn: false,
      isSidebarExpanded: false,
      isMobileSidebarOpen: false,
      activeModelId: "chatgpt",
      pendingModelId: null,
      activeFolder: null,

      setActiveScreen: (screen) => {
        if (screen !== get().activeScreen) {
          set({ activeFolder: null });
        }
        set({ activeScreen: screen, isMobileSidebarOpen: false });
      },
      setTheme: (theme) => set({ theme }),
      setIsLoggedIn: (v) => set({ isLoggedIn: v }),
    }),
    {
      name: "brainbox-app-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // ← КРИТИЧНО за Next.js
      partialize: (state) => ({
        // ← само тези полета се persist-ват
        theme: state.theme,
        isLoggedIn: state.isLoggedIn,
        activeModelId: state.activeModelId,
      }),
    },
  ),
);
```

### Рехидратация — в `app/providers.tsx`

```tsx
// app/providers.tsx
"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useLibraryStore } from "@/store/useLibraryStore";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ръчна рехидратация след mount — предотвратява SSR mismatch
    useAppStore.persist.rehydrate();
    useLibraryStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
```

```tsx
// app/layout.tsx (Server Component)
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Supabase SSR Setup (Next.js 16) — Верифицирано от Context7

### Package: `@supabase/ssr` — единствения правилен пакет за Next.js

> ⚠️ НЕ използвай `@supabase/auth-helpers-nextjs` — deprecated.
> Middleware е **задължителен** за правилен token refresh. Без него сесията не се обновява.

```typescript
// lib/supabase/client.ts — Browser client ('use client' компоненти)
"use client";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Singleton по подразбиране — безопасно да се вика многократно
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

```typescript
// lib/supabase/server.ts — Server Components / Route Handlers
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        // Server Components: само четат cookies, не пишат
      },
    },
  );
}
```

```typescript
// proxy.ts — ЗАДЪЛЖИТЕЛНО за session refresh (Next.js 16.2 = proxy.ts, NOT middleware.ts)
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          // Пише в request И в response — критично за Next.js
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ВИНАГИ използвай getUser() — не getSession() (getSession е unverified)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // BrainBox: всичко е зад login — redirect ако не е логнат
  if (!user && request.nextUrl.pathname !== "/login") {
    // За overlay подхода (login в page.tsx) — не redirect, само refresh
    // Ако ползваш /login route: return NextResponse.redirect(new URL('/login', request.url))
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### Auth в BrainBox — Overlay vs Route

BrainBox ползва **Login overlay** (анимиран zoom-out). Препоръка: запази overlay подхода.
Supabase Auth заменя само `localStorage.setItem('brainbox_is_logged_in', 'true')`:

```typescript
// В Login компонента (замества симулираната анимация)
"use client";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const handleLogin = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error) onLogin(); // → triggers zoom-out animation в page.tsx
};
```

---

## motion/react (Framer Motion v12) — No Changes

BrainBox uses `motion/react` — this is the correct package for React 19.

- `AnimatePresence` works the same
- All existing animation code is compatible
- Mark components using `motion.*` as `'use client'`

---

## React Flow (@xyflow/react) — SSR Issue

```typescript
// MUST use dynamic import — ReactFlow uses browser APIs
const Workspace = dynamic(
  () => import("./Workspace").then((m) => ({ default: m.Workspace })),
  { ssr: false },
);
```

---

## D3.js — SSR Issue

```typescript
// D3 manipulates DOM — must be client-only
const MindGraph = dynamic(
  () => import("./MindGraph").then((m) => ({ default: m.MindGraph })),
  { ssr: false },
);
```

---

## Environment Variables

```bash
# apps/web-app/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_GEMINI_API_KEY=xxx  # replaces Vite's GEMINI_API_KEY

# Note: Vite used `process.env.GEMINI_API_KEY` via vite.config define
# Next.js uses NEXT_PUBLIC_ prefix for client-side env vars
```

---

## Next.js 16.2 — Asynchronous Paradigms & Caching

### Asynchronous Request-Time APIs (Mandatory)

In Next.js 16.2, several Request-time APIs are strictly asynchronous:

```tsx
import { cookies, headers } from "next/headers";

export async function Dashboard() {
  const cookieStore = await cookies(); // Await mandatory
  const token = cookieStore.get("token");
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params; // Await mandatory
}
```

### Advanced Caching Strategies

#### 'use cache' Directive

Defaults to 15-minute revalidation. Replaces unstable_cache.

```tsx
import { cacheLife, cacheTag } from "next/cache";
async function getPrompts() {
  "use cache";
  cacheTag("prompts-list");
  cacheLife("days");
  return db.prompts.findMany();
}
```

#### 'use cache: private'

CRITICAL for BrainBox user data. Ensures data is cached only for the current session/user.

```tsx
async function getMyBrain() {
  "use cache: private";
  cacheTag("user-brain-data");
}
```

---

## React 19.2 UI Patterns & Concurrent Logic

### Activity Component (Standard)

Use for keeping state and underlying assets (like Canvas) alive in hidden tabs or screens without unmounting.

```tsx
<Activity mode={active ? "visible" : "hidden"}>
  <NeuralField />
</Activity>
```

### useEffectEvent (Stability)

Use for callbacks inside effects that should not trigger re-runs. Mandatory for Chrome event listeners and WebSocket handlers.

```tsx
import { useEffect, useEffectEvent } from "react";
function ChatLogger({ onLog }) {
  const onLogStable = useEffectEvent(onLog);
  useEffect(() => {
    const handler = (e) => onLogStable(e.data);
    // ...
  }, []); // No need to include onLogStable in deps
}
```

### DOM Prefixes

Always prefix `useId` with `_r_` to ensure compatibility with View Transitions and prevent ID collisions in monorepos.
