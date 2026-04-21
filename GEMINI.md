# BrainBox — Antigravity Specific Rules (GEMINI.md)
*Highest priority overrides for Antigravity Agent*

## 📍 Critical Locations Index
- **Shared types:** `packages/types/src/schemas.ts`
- **CSS tokens:** `packages/config/styles/brainbox.css`
- **Extension config:** `apps/extension/wxt.config.ts`
- **Extension entrypoint (BG):** `apps/extension/entrypoints/background.ts`
- **Extension entrypoint (CS):** `apps/extension/entrypoints/content/index.ts`
- **Extension entrypoint (Popup):** `apps/extension/entrypoints/popup/`
- **Platform adapters:** `apps/extension/src/content/adapters/`
- **Web-app stores:** `apps/web-app/store/use*Store.ts`
- **Server actions:** `apps/web-app/actions/*.ts`
- **API routes:** `apps/web-app/app/api/**/route.ts`
- **Auth bridge:** `apps/web-app/app/(app)/extension-auth/page.tsx`
- **Rules:** `AGENTS.md`, `GEMINI.md`, `docs/DECISIONS.md`
- **Roadmap:** `ROADMAP.md`

## 0. ABSOLUTE PROHIBITIONS
1. **`proxy.ts` — НЕ `middleware.ts`** (Next.js 16.2 in this project uses `proxy.ts`).
2. **WXT `background.ts` — използвай `defineBackground()`**. WXT компилира до Service Worker автоматично. НЕ създавай `service-worker.ts` ръчно.
3. **READ-ONLY Content Scripts.** Do NOT inject UI/buttons into AI platforms (textarea value only).
4. **`getUser()` — ALWAYS.** Never use `getSession()`.
5. **`chrome.alarms` — ALWAYS.** Never use `setInterval()` in extension background.
6. **`skipHydration: true`** on all Zustand persisted stores.
7. **`exactOptionalPropertyTypes: false`** (MUST be false to avoid breaking Zustand/shadcn).
8. **НЕ редактирай `manifest.json`** — WXT го генерира автоматично. Всички permissions са в `wxt.config.ts`.

## 🚫 Forbidden Additions
- **Extension DOM Injection:** No floating buttons or sidebars. Context menu capture ONLY.
- **Extension DB Access:** No direct Supabase calls. Sync via Dashboard API ONLY.
- **Extension Storage:** NO `localStorage`. Use `storage` WXT helper или `chrome.storage.local` ONLY.
- **Next.js 16 Sync Patterns:** No synchronous access to `params`, `searchParams`, `cookies()`, or `headers()`.

## 1. AGENTIC WORKFLOW & ARTIFACTS
- **Plan First:** Always create/update `tasks/todo.md` before execution.
- **Implementation Plans:** Required for complex architectural changes.
- **Walkthroughs:** Create after significant UI/feature changes.

## 2. NEURALFIELD & DESIGN
- **Persistent Shell:** `NeuralField` canvas MUST NOT unmount between screens. Only change `mode` prop.
- **Premium Aesthetics:** Prioritize vibrant colors, glassmorphism, and smooth animations.
- **Dynamic Imports:** `NeuralField` and `AmbientLight` must be `dynamic(() => import(...), { ssr: false })`.

## 3. PROJECT STRUCTURE OVERRIDES
- **Folder Names:** Use `.agent/` (singular) for specialized agent files.
- **Exports:** Use named exports in `packages/`, avoid default exports where possible.
- **Server Actions:** All data mutations MUST live in `apps/web-app/actions/`.

---
*Refer to [AGENTS.md](./AGENTS.md) for shared cross-tool standards.*
