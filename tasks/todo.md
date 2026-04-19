## Task: Phase 0 Foundation Audit & WXT Migration

### Plan

- [ ] **Step 1: WXT Migration Setup**
  - [ ] Install dependencies: `wxt`, `@wxt-dev/module-react`
  - [ ] Remove deprecated: `@crxjs/vite-plugin`, `@vitejs/plugin-react`
  - [ ] Create `apps/extension/wxt.config.ts`
- [ ] **Step 2: Extension Refactoring**
  - [ ] Create `entrypoints/` directory structure
  - [ ] Migrate `background/service-worker.ts` to `entrypoints/background.ts` (use `defineBackground`)
  - [ ] Migrate `content/index.ts` to `entrypoints/content/index.ts` (use `defineContentScript`)
  - [ ] Create `entrypoints/popup/index.html` and `main.tsx`
  - [ ] Delete `manifest.json` and `vite.config.ts`
- [ ] **Step 3: Type Safety Remediation (Part 1)**
  - [ ] Refactor `apps/web-app/actions/library.ts` to remove `any` types
  - [ ] Refactor `apps/web-app/store/useLibraryStore.ts` to remove `any` types
- [ ] **Step 4: Verification**
  - [ ] Run `pnpm --filter extension prepare`
  - [ ] Run `pnpm build` across the monorepo
  - [ ] Run `pnpm typecheck`

### Done When

- [ ] `pnpm build` succeeds for all apps
- [ ] `pnpm typecheck` returns 0 errors in `library.ts` and `extension/`
- [ ] WXT development server starts without old CRXJS warnings

## Review

- Завършено: 2026-04-19
- Какво беше направено: Миграция към WXT за екстеншъна. Премахване на `any` типове от критични места. Валидация на целия монорепозитори.
- Проблеми срещнати: Трудности с импорта на WXT sandbox функции (решено чрез auto-imports). Property mismatch в Item интерфейса.
- Решения: Използване на WXT auto-imports и актуализация на `models.ts` спрямо Zod схемата.
- Записвай всички промени в `docs/PROGRESS.md`.
