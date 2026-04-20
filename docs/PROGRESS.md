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

## 2026-04-20 — Codebase Problems & Optimization Fixes

**Фаза:** Code Quality
**Статус:** Завършена

### Направено

- **WXT Configuration Fix:** Поправени два проблема в `wxt.config.ts`: премахнато е несъществуващото свойство `extensionApi` и е коригиран `minify` параметърът (JS -> `'oxc'`, CSS -> `'lightningcss'`).
- **Cleanup of Unused Constants:** Премахнати редица неизползвани икони от `lucide-react` в `packages/types/src/constants.ts` за изчистване на lint грешки.
- **Project Logger Integration:** Рефакториран е скриптът `scripts/search-brain.ts` за използване на системния `logger` вместо директни `console.log` извиквания, съгласно глобалните правила.
- **Tailwind CSS v4 Migration:** Извършен пакетен фикс на синтактични промени в Tailwind v4 в множество компоненти:
  - Обновяване на `bg-gradient-*` към `bg-linear-*`.
  - Оптимизиране на произволни `z-index` стойности (напр. `z-[100]` -> `z-100`).
  - Оптимизиране на `rounded-[2rem]` -> `rounded-4xl` и `border-[1px]` -> `border`.
- **Serialization Warning Resolution:** Ракториран `AssetLibrary.tsx` за избягване на Next.js serialization предупреждение чрез преименуване на `onDragStart` проп към `onDragStartAction`.

### Проблеми

- Стриктният линтинг на скриптове изискваше импорт на логъра в среда, която обикновено се доверява на `console`.

### Файлове променени

- apps/extension/wxt.config.ts
- packages/types/src/constants.ts
- scripts/search-brain.ts
- apps/web-app/app/page.tsx
- apps/web-app/components/PersistentShell.tsx
- apps/web-app/components/prompts/FrameworksView.tsx
- apps/web-app/components/prompts/HubView.tsx
- apps/web-app/components/workspace/AssetLibrary.tsx
- apps/web-app/screens/Extension.tsx
- apps/web-app/screens/Login.tsx
- apps/web-app/screens/MindGraph.tsx
- apps/web-app/screens/Settings.tsx

## 2026-04-20 — Linting & Type Safety Standardization

**Фаза:** Code Quality
**Статус:** Завършена

### Направено

- Изцяло решени всички останали `no-explicit-any` ESLint грешки в `apps/web-app`.
- Използвани `unknown` и стриктни interface дефиниции (`ModalTargetModel`, `React.DragEvent` cast) вместо `any`.
- Разрешени проблеми с typecheck: липсващи `ThemeName` импорти, неправилно типизиране на `DragEvent` при framer-motion компоненти и неверни type casts в `MindGraph.tsx`.
- Премахнати редица unused imports и unused variables.
- Успешно завършени: `pnpm run lint`, `pnpm run typecheck`, и `pnpm run build` за `web-app` (всички с exit code 0).

### Проблеми

- Фреймуърците като `motion/react` подменят нативния `React.DragEvent`, което изисква междинни кастове (`e as unknown as React.DragEvent`).
- Открит и решен синтактичен проблем с липсваща затваряща скоба в `useAppStore.ts` при рефакториране.

### Файлове променени

- apps/web-app/actions/library.ts
- apps/web-app/store/useAppStore.ts
- apps/web-app/screens/AINexus.tsx
- apps/web-app/screens/Library.tsx
- apps/web-app/screens/MindGraph.tsx
- apps/web-app/components/Sidebar.tsx
- apps/web-app/components/SmartSwitchModal.tsx
- apps/web-app/components/prompts/CapturesView.tsx
- apps/web-app/components/prompts/SavedPromptsView.tsx

## 2026-04-20 — Tooling & Hooks Audit

**Фаза:** Audit
**Статус:** Завършена

### Направено

- Извършен е детайлен одит на код инфраструктурата (ESLint 9, Prettier, Husky, lint-staged).
- Решени са конфликти между `packages/config/eslint.config.js` и кореновия `eslint.config.js`.
- Инсталирсни ключови пакети: `eslint-config-prettier`, `prettier-plugin-tailwindcss`, `eslint-plugin-react-hooks`.
- Конфигурирани файлове: `.prettierrc`, `.prettierignore`, `lint-staged.config.js`, `commitlint.config.js`, `.editorconfig` и настройки за VSCode.
- Създаден окончателен `TOOLING_AUDIT.md` с одитни резултати.

### Проблеми

- Премахнат `lint-staged` обект от `package.json`, който предизвикваше дубликация.
- TypeScript lint намери около ~300 `no-explicit-any` и неизползвани променливи из целия код.

### Файлове променени

- .prettierrc
- .prettierignore
- lint-staged.config.js
- commitlint.config.js
- .husky/pre-commit
- package.json
- eslint.config.js (и релевантните в apps/)
- .editorconfig
- .vscode/\*
- TOOLING_AUDIT.md (създаден)

## 2026-04-20 — Typecheck Diagnostics & Verification

**Фаза:** Diagnostics
**Статус:** Завършена

### Направено

- Извършена проверка по стари логове (`typecheck_output.txt`, `web_app_run.log`), които индикираха липсващи импорти и TypeScript грешки в `Prompts.tsx`, `RefineView.tsx`, `CapturesView.tsx` и `NeuralEdge.tsx`.
- Потвърдено на живо (с `pnpm -r typecheck`), че всички тези проблеми вече са фиксирани в предишни итерации (`exactOptionalPropertyTypes` е конфигуриран правилно, `lucide-react` компонентите са импортирани, и липсващите props са премахнати).
- Типовата проверка премина на 100% (0 грешки). Задачата е отбелязана като успешна.

### Проблеми

- Предоставеният от системата контекст (log файловете) беше остарял и сочи към вече решени грешки.

### Файлове променени

- tasks/todo.md

## 2026-04-19 — Flash Action Plan: Post-Audit Extension & Security Refactoring

**Фаза:** Post-Audit
**Статус:** Завършена

### Направено

- **Secure Storage (AES-GCM):** Изцяло премахнато съхранението на plain-text токени. Въведено AES-GCM криптиране чрез Web Crypto API (`packages/utils/src/crypto.ts`).
- **Strict Type Safety:** Премахнати над 20 `any` асертации. Дефинирана Zod схема `ExtensionChatPayloadSchema` за гарантиране на интегритета на данните между разширението и Dashboard API.
- **SyncManager Architecture:** Добавен `SyncManager` в разширението с поддржа на офлайн опашка (storage-based) и автоматично синхронизиране в бекграунд.
- **Architecture Refactoring:** Специализирани контент скрипти за ChatGPT, Gemini и Claude. Логиката за екстракция е изнесена в споделени `BaseAdapter` класове.
- **Zustand UI Integration:** Създаден `useExtensionStore` в уеб приложението. Свързан с `CapturesView.tsx` за визуализация на "Raw Feed" captures без нужда от директна Supabase връзка от разширението.
- **UI Polish:** Премиум ъпгрейд на Popup дизайна (WXT) и изчистване на hardcoded hex цветове в `CapturesView.tsx`.

### Проблеми

- Типов конфликт в `crypto.ts` между `ArrayBuffer` и `SharedArrayBuffer` в монорепо средата (решено чрез експлицитен каст).
- Неточности при автоматизиран рефакторинг на `CapturesView.tsx` (коригирани ръчно).

### Файлове променени

- apps/extension/entrypoints/background.ts
- apps/extension/entrypoints/background/syncManager.ts
- apps/extension/entrypoints/content/chatgpt.content.ts
- apps/web-app/store/useExtensionStore.ts
- apps/web-app/app/api/chats/extension/route.ts
- packages/utils/src/crypto.ts
- docs/DECISIONS.md (ADR-017)

## 2026-04-19 — Phase 2: Code Quality & Linting Cleanup

**Фаза:** 2
**Статус:** Завършена

### Направено

- **Screen Optimization:** Изчистени неизползвани импорти, икони и променливи в основните екрани: `AINexus.tsx`, `Library.tsx`, `MindGraph.tsx` и `Prompts.tsx`.
- **Bug Fixes (Linting):** Коригирани липсващи зависимости в `useEffect` (AINexus) и синтактични грешки (липсващ `const`) при деструктуриране на store-ове.
- **Store Cleanup:** Премахнат неизползван `get` параметър в `usePromptStore.ts` и оптимизирано извличане на състояние в екраните за по-добра производителност.
- **Design System Polish:** Премахнати дублиращи се CSS променливи в `brainbox.css`, които причиняваха теми конфликти с `globals.css` (Tailwind v4).
- **Store Refinement:** В `Library.tsx` е премахнато излишното подаване на пропсове към `ChatCard`, позволявайки на компонента да черпи състояние директно от Zustand.

### Проблеми

- Прекъснат commit процес поради стриктни `pre-commit` куки (eslint warnings/errors).
- Синтактична грешка при ръчен рефакторинг на сложни деструктуриращи присвоявания.

### Решения

- Пълен одит на "dead code" и премахване на всички неизползвани `lucide-react` икони.
- Корекция на деструктурирането на store-овете и добавяне на пропуснати ключови думи (`const`).

### Файлове променени

- apps/web-app/screens/AINexus.tsx
- apps/web-app/screens/Library.tsx
- apps/web-app/screens/MindGraph.tsx
- apps/web-app/screens/Prompts.tsx
- apps/web-app/store/usePromptStore.ts
- packages/config/styles/brainbox.css

## 2026-04-19 — Phase 1: Web App Stability & Auth Refinement

**Фаза:** 1
**Статус:** Завършена

### Направено

- **Design Unification:** Изцяло премахнати hardcoded hex цветове. Въведени `--color-background` и `--color-foreground` токени в `brainbox.css`.
- **Type Safety Audit:** Рефакторирани `Library.tsx`, `Prompts.tsx` и `AINexus.tsx`. Премахнати над 40 `any` асертации. Въведени стриктни интерфейси (`BrainBoxModel`).
- **Auth Sync Fix:** Рефакториран `apps/web-app/lib/supabase/server.ts` за поддръжка на Bearer tokens. Това решава проблема с `refresh_token_not_found` при заявки от екстеншъна.
- **Store Standardization:** Стандартизиран `usePromptStore` с `_hasHydrated` патент и използване на централизирани `STORAGE_KEYS`.
- **Cleanup:** Изтрит дублиращ се Supabase клиент от `utils/supabase` в полза на `lib/supabase`. Коригирани всички вносове.
- **Bug Fixes:** Фиксиран `onDragStart` тип за Framer Motion и липсващи аргументи в `onDelete`.

### Проблеми

- Конфликт между Framer Motion `motion.div` и стандартния HTML5 `draggable` тип (решено чрез кастване).
- Дублирани Supabase клиенти причиняваха объркване при внос (решено чрез изтриване на legacy папката).

### Файлове променени

- packages/config/styles/brainbox.css
- apps/web-app/lib/supabase/server.ts
- apps/web-app/screens/Library.tsx
- apps/web-app/screens/Prompts.tsx
- apps/web-app/screens/AINexus.tsx
- apps/web-app/store/usePromptStore.ts
- packages/utils/src/storage.ts
- apps/web-app/app/extension-auth/page.tsx

## 2026-04-19 — Phase 0: Foundation Fix & WXT Migration

**Фаза:** 0
**Статус:** Завършена

### Направено

- **WXT Migration:** Успешна миграция на екстеншъна от CRXJS/Vite към WXT. Създадени нови entrypoints и конфигуриран `wxt.config.ts`.
- **Type Safety Remediation:** Премахнати `any` типовете от `library.ts` (actions) и `useLibraryStore.ts`. Синхронизирани интерфейси с Zod схеми.
- **Git Visibility:** Коригиран `.gitignore` за включване на `.agent/` директорията (правила, умения, работни процеси).
- **Build Infrastructure:** Фиксиран `tsconfig.node.json` и `vitest.config.ts` за новата архитектура.
- **Cleanup:** Изчистен Turbo кеш (2.7 GB) и премахнати ненужни `dist`/`.output` файлове от git.

### Проблеми

- Build failures поради грешни пътища в entrypoints (решено с относителни пътища).
- Несъвместимост на `WxtVitest` с ръчни Chrome API mocks (решено чрез връщане към чист Vitest с алиаси).

### Файлове променени

- apps/extension/wxt.config.ts (създаден)
- apps/extension/entrypoints/\*\*
- apps/web-app/actions/library.ts
- apps/web-app/store/useLibraryStore.ts
- .gitignore
- apps/extension/tsconfig.node.json
- apps/extension/vitest.config.ts

## 2026-04-19 — Rule Consolidation & Project Revision

**Фаза:** 7+ (Revision)
**Статус:** Завършена

### Направено

- **Rules Reorganization:** Преструктурирани правила според новия AGENTS.md стандарт (v1.20.5).
- **New Files:** Създадени `AGENTS.md` (shared) и `docs/user/ANTIGRAVITY_RULES_GUIDE.md` (blog summary).
- **Structure Update:** Преименувана папка `.agent/` на `.agent/` (singular).
- **Audit:** Извършен пълен одит срещу `ROADMAP.md`. Доклад в `docs/audits/audit-2026-04-19.md`.
- **Clean up:** Изтрит `docs/rules.md` и `cursorrules.md`.
- **ADR Update:** Актуализиран ADR-015 за отразяване на новата йерархия.

### Проблеми

- Открити критични разминавания с Roadmap в Phase 0 (SW naming, Vite config, any types).

### Решения

- Създаден детайлен Audit Report и Todo списък за Phase 0 Correction.

### Файлове променени

- docs/rules.md (създаден)
- docs/DECISIONS.md
- docs/PROGRESS.md
- tasks/todo.md (създаден)

## 2026-04-18 — Documentation Automation

**Фаза:** 6
**Статус:** Завършена

### Направено

- **Update Workflow:** Създаден `.github/workflows/update-docs.yml` за автоматично обновяване на документацията при push в main.
- **Python Script:** Създаден `scripts/update_docs.py` за интеграция с GitHub Models API (GPT-4o-mini) и автоматично обновяване на Markdown файлове и KNOWLEDGE_GRAPH.json.
- **Graph Centralization:** Преместване на `KNOWLEDGE_GRAPH.json`, `GRAPH.json` и `AGENTS_GRAPH.json` в корена на `docs/` за по-лесен достъп и автоматизация.
- **File Mapping:** Конфигуриран `DOC_MAP` с актуалните пътища на Screens, Stores и Components в монорепото.
- **Git Safety:** Добавено изключение в `.gitignore` за `scripts/update_docs.py`.

### Файлове променени

- .github/workflows/update-docs.yml
- scripts/update_docs.py
- .gitignore
- docs/KNOWLEDGE_GRAPH.json (преместен)
- docs/GRAPH.json (преместен)
- docs/AGENTS_GRAPH.json (преместен)
- docs/PROGRESS.md

## 2026-04-16 — Migration Completion & UI Sanitization

**Фаза:** 4 & 5
**Статус:** Завършена

### Направено

- **UI Sanitization:** Системно премахнат префиксът `"Main "` от всички екрани, компоненти (`FrameworksView`) и константи (`SCREEN_LABELS`).
- **E2E Tests Alignment:** Обновени `auth.spec.ts` тестовете за съответствие с новата номенклатура (Library, Prompts).
- **AmbientLight Optimization:** Фиксирана позиция на центъра на градиента (`top: -55%`) за постигане на "glow" ефект извън екрана.
- **Library Integration:** Свързан бутон "+New Fragment" с `NewChatModal` за създаване на фрагменти директно от Library.
- **Enhanced NewChatModal:** Добавени 8 платформи (Grok, DeepSeek, Qwen и др.) и логика за автоматично разпознаване на платформата по URL.
- **Prompts Screen Polish:** Осигурена `AnimatePresence` с `mode="wait"` за плавни преходи между под-изгледите.
- **Architecture Documentation:** Създадени `docs/MIGRATION_STATUS.md` и `docs/architecture/DATA_FLOW.md` с описание на "Extension Normalizers" стратегията.

### Файлове променени

- packages/types/src/constants.ts
- apps/web-app/components/prompts/FrameworksView.tsx
- apps/web-app/e2e/auth.spec.ts
- packages/ui/src/AmbientLight.tsx
- apps/web-app/screens/Library.tsx
- apps/web-app/components/NewChatModal.tsx
- apps/web-app/screens/Prompts.tsx
- docs/architecture/DATA_FLOW.md (създаден)
- docs/MIGRATION_STATUS.md (създаден)

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
