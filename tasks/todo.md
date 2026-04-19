## Task: Phase 0 Foundation Audit & WXT Migration

### Plan

- [ ] **Step 1: WXT Migration Setup**
  - [ ] Install dependencies: `wxt`, `@wxt-dev/module-react`
  - [ ] Remove deprecated: `@crxjs/vite-plugin`, `@vitejs/plugin-react`
  - [ ] Create `apps/extension/wxt.config.ts`
- [ ] **Step 2: Extension Refactoring**
  - [ ] Create `entrypoints/` directory structure
  - [ ] Migrate `background/service-worker.ts` to `entrypoints/background.ts` (use `defineBackground`)
- [x] **Step 1: WXT Migration Setup**
  - [x] Install dependencies: `wxt`, `@wxt-dev/module-react`
  - [x] Remove deprecated: `@crxjs/vite-plugin`, `@vitejs/plugin-react`
  - [x] Create `apps/extension/wxt.config.ts`
- [x] **Step 2: Extension Refactoring**
  - [x] Create `entrypoints/` directory structure
  - [x] Migrate `background/service-worker.ts` to `entrypoints/background.ts` (use `defineBackground`)
  - [x] Migrate `content/index.ts` to `entrypoints/content/index.ts` (use `defineContentScript`)
  - [x] Create `entrypoints/popup/index.html` and `main.tsx`
  - [x] Delete `manifest.json` and `vite.config.ts`
- [x] **Step 3: Type Safety Remediation (Part 1)**
  - [x] Refactor `apps/web-app/actions/library.ts` to remove `any` types
  - [x] Refactor `apps/web-app/store/useLibraryStore.ts` to remove `any` types
- [x] **Step 4: Verification**
  - [x] Run `pnpm --filter extension prepare`
  - [x] Run `pnpm build` across the monorepo
  - [x] Run `pnpm typecheck`

### Done When

- [x] `pnpm build` succeeds for all apps ✓
- [x] `pnpm typecheck` returns 0 errors in `library.ts` and `extension/` ✓
- [x] WXT development server starts without old CRXJS warnings ✓

### Done When

- [ ] All 11 screens render without React errors
- [ ] Library CRUD (folders/items) works with real Supabase data
- [ ] Phase 1 Gate criteria in `ROADMAP.md` met
- [ ] `pnpm typecheck` and `pnpm lint` return 0 errors

## Phase 1: Web App Stability & Auth Refinement

### Plan

- [x] **Step 1: Unify Design System**
  - [x] Move hardcoded hex colors to `packages/config/styles/brainbox.css` ✓
  - [x] Update `Library.tsx`, `Dashboard.tsx`, `Login.tsx` to use CSS variables ✓
  - [x] Add base background/foreground tokens ✓
- [x] **Step 2: Type Safety Audit**
  - [x] Refactor `Library.tsx` (remove 30+ `any` assertions) ✓
  - [x] Refactor `AINexus.tsx` and `Prompts.tsx` ✓
  - [x] Standardize `useAppStore` and `usePromptStore` hydration ✓
- [x] **Step 3: Cross-Origin Auth Sync**
  - [x] Refactor `supabase/server.ts` to support Bearer tokens ✓
  - [x] Verify `ExtensionAuth` bridge page logic ✓
  - [x] Resolve `refresh_token_not_found` via Auth Header support ✓

### Done When

- [x] `pnpm typecheck` -> 0 errors in `apps/web-app` ✓
- [x] Extension can sync data via REST API with Bearer token ✓
- [x] All hardcoded colors replaced with `var(--color-*)` ✓

## Review

- Завършено: 2026-04-19 (Phase 1)
- Какво беше направено: Стабилизиране на Web App. Пълна унификация на цветовете. Пълна поддръжка на Bearer tokens за екстеншъна. Премахване на `any` типовете.
- Проблеми срещнати: Конфликти в типовете на Framer Motion `onDragStart`. Дублиране на Supabase клиенти.
- Решения: Кастване на драг събития към `any`/`React.DragEvent`. Изтриване на `utils/supabase` в полза на `lib/supabase`.
- Записвай всички промени в `docs/PROGRESS.md`.
