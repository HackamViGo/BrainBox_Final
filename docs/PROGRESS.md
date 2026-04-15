BrainBox — Progress Log
Хронологичен дневник на завършените фази и важни промени.
Агентът попълва след всяка завършена задача.

<!-- TEMPLATE за всеки запис:

## [YYYY-MM-DD] — [Task Name]
**Фаза:** [номер]
**Статус:** Завършена / Частично / Блокирана

### Направено
- ...

### Проблеми
- ...

### Решения
- ...

### Файлове променени
- apps/web-app/src/...
- packages/...

-->

## 2026-04-14

### Stabilizing Monorepo Architecture (Block 1)

- **Fix 1: exactOptionalPropertyTypes -> REMOVED**
  - Removed from `packages/config/tsconfig.base.json`.
  - Resolved conflicts with Zustand v5 and shadcn/ui.
- **Fix 2: NeuralField Dynamic Import**
  - Converted `NeuralField` import in `Sidebar.tsx` to `dynamic({ ssr: false })`.
  - Fixed "window is not defined" SSR build errors.
- **Fix 3: Extension Auth Bridge Security**
  - Replaced `getSession()` with `getUser()` in `apps/web-app/app/extension-auth/page.tsx`.
  - Ensured server-side user verification for the extension auth bridge.

## 2026-04-15 — Phase 1: Critical Fixes

**Фаза:** 1
**Статус:** Завършена

### Направено

- Премахнат `exactOptionalPropertyTypes` от TSConfigs (потвърдено).
- Обновен `NeuralField` dynamic import в `Sidebar.tsx` и `PersistentShell.tsx` (правилно пренасочване към default export).
- Заменен `getSession()` с `getUser()` в `extension-auth/page.tsx` (Security fix).
- Имплементиран `_hasHydrated` патент в `useAppStore.ts` с `onRehydrateStorage`.
- Обновен `PersistentShell` за показване на `NeuralField` по време на хидратация (премахване на празен екран/моков флаш).
- Потвърдено отсъствието на `MOCK_` данни в `useLibraryStore.ts`.

### Файлове променени

- apps/web-app/store/useAppStore.ts
- apps/web-app/components/Sidebar.tsx
- apps/web-app/components/PersistentShell.tsx
- apps/web-app/app/extension-auth/page.tsx
- tasks/todo.md

## 2026-04-15 — Phase 2: High Priority Logic & Store Refactoring

**Фаза:** 2
**Статус:** Завършена

### Направено

- **Rate Limiting:** Имплементиран `Upstash` базиран rate limit за `/api/chats/extension` (`lib/rate-limit.ts`).
- **AINexus Store:** Създаден `useAINexusStore.ts` за управление на чат съобщения, състояние на генериране и модел версии.
- **Store Refactoring:** Обновен `useLibraryStore` за използване на `partialize` (складиране само на UI състояние, не на тежки данни в localStorage).
- **Hooks Migration:** Екраните `Workspace`, `MindGraph` и `Identity` са прехвърлени към използване на Zustand store hooks вместо локално състояние или директни Supabase извиквания.
- **Type Safety:** Добавени explicit return types за всички нови асинхронни функции и Server Actions.
- **Extension Infrastructure:** Подготвени базови структури за Chrome Extension (`apps/extension/`).

### Файлове променени

- apps/web-app/store/useAINexusStore.ts
- apps/web-app/store/useLibraryStore.ts
- apps/web-app/lib/rate-limit.ts
- apps/web-app/app/api/chats/extension/route.ts
- apps/web-app/screens/Workspace.tsx
- apps/web-app/screens/MindGraph.tsx
- apps/web-app/screens/Identity.tsx
- apps/extension/\*
- packages/types/src/schemas.ts

## 2026-04-15 — Migration Diagnostics & Repair

**Фаза:** 3
**Статус:** Завършена

### Направено

- **Root Configuration:** Създаден `turbo.json` и актуализирани root `package.json` скриптове за пълна Turbo интеграция.
- **Dependency Management:** Преместени `turbo`, `eslint` и `eslint-config-next` в root `catalog` за унифицирано управление на версиите.
- **CSS Resolution:** Поправени пътищата за внос на `brainbox.css` в `apps/extension` и `apps/web-app` (`../../../../` vs `../../../`).
- **Store Safety:** Добавени `'use client'` директиви в `usePromptStore.ts` и `useExtensionStore.ts`.
- **Linting Fix:** Актуализиран `lint` скрипт в `web-app` за използване на `eslint .` директно, заобикаляйки проблеми с CLI на Next.js 16 в монорепо среда.
- **Build Verification:** Потвърден успешен build (`pnpm turbo build`) на целия монорепо.

### Файлове променени

- turbo.json (създаден)
- package.json
- pnpm-workspace.yaml
- apps/web-app/package.json
- apps/web-app/.eslintrc.json (създаден)
- apps/web-app/app/globals.css
- apps/extension/src/popup/App.css
- apps/web-app/store/usePromptStore.ts
- apps/web-app/store/useExtensionStore.ts
