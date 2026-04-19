# Architectural Decisions (ADR)

## [ADR-001] Next.js 16.2 Monorepo Migration

**Date:** 2026-04-11
**Status:** Прието

### Контекст

Проектът BrainBox трябва да се мигрира от Vite към Next.js за по-добра поддръжка на SSR, SEO и по-лесна интеграция със Supabase.

### Решение

Използване на Next.js 16.2 (Canary/Latest) с React 19.2 в pnpm monorepo структура.

- `@brainbox/types`: споделени Zod схеми и типове.
- `@brainbox/utils`: споделени хелпъри.
- `@brainbox/ui`: споделени UI компоненти.
- `apps/web-app`: основното приложение.
- `apps/extension`: Chrome extension (Vite 8).

### Причини

- Next.js 16/React 19 предлагат подобрен Server Component модел.
- Monorepo позволява споделяне на код между уеб приложението и разширението.

### Последици

- Трябва да се внимава с Persistent SPA shell заради NeuralField canvas-а.
- Всички Zustand stores трябва да използват `skipHydration: true`.

---

## [ADR-002] Persistent Shell Pattern

**Date:** 2026-04-11
**Status:** Прието

### Контекст

`NeuralField` (canvas анимация) не трябва да се unmount-ва при навигация между страници, за да се запази визуалната приемственост.

### Решение

Имплементиране на `PersistentShell` компонент в `apps/web-app/components`, който се поставя в Root Layout. Той рендерва `NeuralField` и `AmbientLight` само веднъж и използва Next.js `children` за рендерване на страниците върху тях.

### Причини

- Избягване на премигване/рестарт на анимациите.
- По-добро UX (плавни преходи).

### Последици

- Всички страници в приложението споделят един и същ фон и анимационен слой.

---

## [ADR-003] Supabase Integration with @supabase/ssr

**Date:** 2026-04-11
**Status:** Прието

### Контекст

Нужда от стабилна аутентикация и персистентност на данните (Library, Folders, Items) отвъд localStorage.

### Решение

Интегриране на Supabase с използване на `@supabase/ssr` (Server-Side Rendering) пакета.

- Схема: `folders` и `items` таблици with RLS.
- Middleware: Задължителен за session refresh pattern.
- Client: Отделни `createBrowserClient` и `createServerClient` фабрики.
- Auth: Използване на `getUser()` вместо `getSession()` за сигурност.

### Причини

- `@supabase/ssr` е текущият препоръчан стандарт за Next.js App Router.
- RLS осигурява сигурност на ниво база данни.
- Middleware предотвратява изтичане на сесиите.

### Последици

- Всички CRUD операции минават през Server Actions с Zod валидация.
- Zustand store се синхронизира със Supabase след логване.

---

## [ADR-004] Sidebar State Management Architecture

**Дата:** 2026-04-11
**Статус:** Прието

### Контекст

Легендарният Sidebar компонент в Vite имаше сложен стейт (SwitchMode), управляван чрез prop drilling и локален useState. Това водеше до проблеми при синхронизацията между екраните и затруднено тестване.

### Решение

Преместване на целия Sidebar стейт в `useAppStore`:

- `switchMode`: `'global' | 'folders' | 'feathers' | 'pulse' | 'workspace'`
- `isPinned`: `boolean`
- `expandedFolders`: `string[]` (за persist)
- `searchQuery`: `string`

Всички модали (`ApiKeyModal`, `SmartSwitchModal`) се отварят чрез стейт в съответните стори (`AINexusStore`, `AppStore`).

### Причини

- **Единен източник на истина**: Навигацията зависи от глобалния стейт на приложението.
- **Persistence**: Потребителят запазва състоянието на Sidebar (pinned/expanded) след рестарт.
- **Тестваемост**: Лесно тестване на стейт трансформации без рендерване на UI.

### Алтеративи разгледани

- **Локален стейт**: Отхвърлено, защото при SPA навигация (макар и в един шел) искаме да контролираме Sidebar от самите екрани.

### Последици

- `Sidebar.tsx` става по-лек.
- Всички екрани имат достъп до `setSwitchMode` ако е нужно.
- Трябва да се внимава със SSR хидратацията на `expandedFolders`.

---

## [ADR-005] Global Modals and API Key Management

**Дата:** 2026-04-11
**Статус:** Прието

### Контекст

Компоненти като `AINexus`, `Library` и `Prompts` се нуждаят от унифициран начин за управление на API ключове и превключване на модели (SmartSwitch). Prop drilling за тези модали прави екраните трудни за поддръжка и води до тип-грешки.

### Решение

- Модалите (`ApiKeyModal`, `SmartSwitchModal`, `NewFolderModal`, `NewChatModal`) се рендерват глобално в `PersistentShell`.
- Управлението им става чрез глобални действия в `useAppStore` (`setModalOpen`, `setApiKeyModel`, `clearPendingModel`).
- Отпада нуждата от подаване на `isOpen`, `onClose` и данни като пропове към тези компоненти - те консумират стейт директно от стора.

### Причини

- **Clean Architecture**: Екраните се фокусират върху бизнес логиката (напр. генериране на отговор), а не върху жизнения цикъл на диалоговите прозорци.
- **Consistency**: API ключовете се съхраняват и изискват по идентичен начин в цялото приложение.
- **Type Safety**: Премахването на сложни проп обекти намалява `tsc` грешките при интеграция.

### Последици

- Намален boilerplate в компонентите за екрани.
- Унифицирано поведение на модалите (анимации, backdrop, затваряне).
- Лесна добавяне на нови модали чрез разширяване на `AppStore` интерфейса.

---

## [ADR-006] Prompts Screen Decomposition

**Дата:** 2026-04-11
**Статус:** Прието

### Контекст

`Prompts.tsx` е най-големият екран в BrainBox (~1200 реда в Vite), съдържащ 4 основни sub-views (Hub, Frameworks, Refine, Captures) и Saved Prompts списък. Поддържането му в един файл затруднява разработката и води до конфликти.

### Решение

Разделяне на `Prompts.tsx` на малки, фокусирани компоненти в `components/prompts/`:

- `HubView.tsx`: Главна навигация.
- `FrameworksView.tsx`: Списък с методологии.
- `RefineView.tsx`: Основната Gemini AI Refine функционалност.
- `CapturesView.tsx`: Raw feed от разширението.
- `SavedPromptsView.tsx`: Списък със запазени промпти.
- `ViewWrapper.tsx`: Анимиран преход (`AnimatePresence`) между тези изгледи.

### Причини

- **Модуларност**: По-лесно тестване и повторна употреба на компоненти (напр. `RefineView` може да се ползва и в Workspace).
- **Производителност**: По-малки bundle-и при евентуално използване на lazy loading.
- **Maintainability**: Ясно разграничение на отговорностите.

---

## [ADR-007] D3 and ReactFlow Dynamic Imports

**Дата:** 2026-04-11
**Статус:** Прието

### Контекст

Библиотеките за визуализация (`d3` за MindGraph и `reactflow` за Workspace) разчитат силно на DOM API (`window`, `document`, `SVG`), което не е налично по време на Server-Side Rendering (SSR).

### Решение

- Използване на Next.js `dynamic()` с `ssr: false` за зареждане на целите екрани `MindGraph.tsx` и `Workspace.tsx`.
- Директен импорт на библиотеките вътре в тези компоненти (тъй като компонентите се изпълняват само на клиента).

### Причини

- Предотвратяване на "Window is not defined" грешки при build.
- Намаляване на първоначалния bundle size на приложението чрез code splitting.

### Последици

- Трябва да се осигурят подходящи loading skeleton-и за тези екрани, тъй като те не се рендират по време на първоначалния paint.
  �то на сложни проп обекти намалява `tsc` грешките при интеграция.

### Последици

- Намален boilerplate в компонентите за екрани.
- Унифицирано поведение на модалите (анимации, backdrop, затваряне).
- Лесна добавяне на нови модали чрез разширяване на `AppStore` интерфейса.

---

## [ADR-006] Prompts Screen Decomposition

**Дата:** 2026-04-11
**Статус:** Прието

### Контекст

`Prompts.tsx` е най-големият екран в BrainBox (~1200 реда в Vite), съдържащ 4 основни sub-views (Hub, Frameworks, Refine, Captures) и Saved Prompts списък. Поддържането му в един файл затруднява разработката и води до конфликти.

### Решение

Разделяне на `Prompts.tsx` на малки, фокусирани компоненти в `components/prompts/`:

- `HubView.tsx`: Главна навигация.
- `FrameworksView.tsx`: Списък с методологии.
- `RefineView.tsx`: Основната Gemini AI Refine функционалност.
- `CapturesView.tsx`: Raw feed от разширението.
- `SavedPromptsView.tsx`: Списък със запазени промпти.
- `ViewWrapper.tsx`: Анимиран преход (`AnimatePresence`) между тези изгледи.

### Причини

- **Модуларност**: По-лесно тестване и повторна употреба на компоненти (напр. `RefineView` може да се ползва и в Workspace).
- **Производителност**: По-малки bundle-и при евентуално използване на lazy loading.
- **Maintainability**: Ясно разграничение на отговорностите.

---

## [ADR-007] D3 and ReactFlow Dynamic Imports

**Дата:** 2026-04-11
**Статус:** Прието

### Контекст

Библиотеките за визуализация (`d3` за MindGraph и `reactflow` за Workspace) разчитат силно на DOM API (`window`, `document`, `SVG`), което не е налично по време на Server-Side Rendering (SSR).

### Решение

- Използване на Next.js `dynamic()` с `ssr: false` за зареждане на целите екрани `MindGraph.tsx` и `Workspace.tsx`.
- Директен импорт на библиотеките вътре в тези компоненти (тъй като компонентите се изпълняват само на клиента).

### Причини

- Предотвратяване на "Window is not defined" грешки при build.
- Намаляване на първоначалния bundle size на приложението чрез code splitting.

### Последици

- Трябва да се осигурят подходящи loading skeleton-и за тези екрани, тъй като те не се рендират по време на първоначалния paint.

---

## [ADR-008] Valid JSON for AGENTS_GRAPH.json

**Дата:** 2026-04-11
**Статус:** Прието

### Контекст

Файлът `docs/AGENTS_GRAPH.json` първоначално съдържаше JSONC-style коментари (`//`) за по-добра четимост. Те обаче предизвикват линтинг грешки (LSP/IDE), тъй като разширението е `.json`, а не `.jsonc`.

### Решение

- Всички коментари се премахват от `docs/AGENTS_GRAPH.json`.
- Файлът трябва да остане валиден JSON 1.0.
- За обяснения и метаданни се използва секцията `"metadata"` вътре в самия файл.

### Причини

- **Compatibility**: Повечето стандартни инструменти и скриптове за обработка на JSON (напр. `JSON.parse`) не поддържат коментари.
- **Lint-free Environment**: Поддържане на чист workflow без грешки в IDE-то.

### Последици

- Намалена визуална структура (няма разделители), но гарантирана машинна обработваемост.

---

## [ADR-009] pnpm Catalogs for Dependency Management

**Дата:** 2026-04-13
**Статус:** Прието

### Контекст

В монорепото се ползват идентични версии на React, TypeScript, Tailwind и др. Поддръжката им в множество `package.json` води до несъответствия ("dependency drift") и трудни ъпгрейди.

### Решение

Използване на `pnpm Catalogs`. Всички споделени версии се дефинират в `pnpm-workspace.yaml`, а в локалните `package.json` се реферират като `"catalog:"`.

### Причини

- **Single Source of Truth**: Версиите се сменят на едно място за целия проект.
- **Производителност**: По-малко дублирани версии в `node_modules` и по-бърза инсталация.
- **Consistency**: Гарантира се, че `web-app` и `extension` винаги ползват една и съща версия на React 19.

### Последици

Всеки нов пакет, който се ползва в повече от едно място, трябва да бъде добавен в каталога.

---

## [ADR-010] Centralized Env Management (No Symlinks)

**Дата:** 2026-04-13
**Статус:** Прието

### Контекст

Предишната стратегия използваше симлинкове или ръчно копиране на `.env.local` файлове от корена към `apps/`. Това е нестабилно при различни ОС и води до грешки при качване в GitHub.

### Решение

Използване на `dotenv-cli`. Поддържа се само един `/.env.local` в корена. Скриптовете за разработка в `apps/` се стартират чрез `dotenv -e ../../.env.local -- next dev`.

### Причини

- **Сигурност**: По-малък шанс за случайно добавяне на локален `.env` файл в Git.
- **Удобство**: Промените в коренния файл се отразяват мигново във всички приложения без нужда от рестарт или ресинк.
- **Cloud-Ready**: Vercel чете env от Dashboard, а този подход е идентичен с cloud логиката (външно инжектиране).

---

## [ADR-011] Shared Configuration Hub (packages/config)

**Дата:** 2026-04-13
**Статус:** Прието

### Контекст

TypeScript, ESLint и CSS токените са разпръснати из проекта, което води до различни стилове на писане и визуален дизайн.

### Решение

Централизиране в пакет `@brainbox/config`:

- `tsconfig.base.json`: База за всички проекти (TS 6.0 compatible).
- `eslint.config.js`: Споделени правила за качество на кода.
- `styles/brainbox.css`: Глобални CSS токени (glass-panel, neural-anim).

### Причини

- **Design Integrity**: Промяна на глас-модула в конфига обновява и Workspace, и Library веднага.
- **Code Standards**: Еднакви строги правила за всички пакети в монорепото.
- **TS Compatibility**: Решаване на deprecation предупреждения от TS 6.0 на централно ниво.

---

## [ADR-012] Extension Architecture and Passive Observer Sync

**Дата:** 2026-04-13
**Статус:** Прието

### Контекст

Разширението BrainBox трябва да мигрира към новата монорепо архитектура, като същевременно поддържа висока сигурност и избягва директно излагане на Supabase ключове в клиентския код на разширението (MV3).

### Решение

1. **Vite 8 + CRXJS**: Използване на Vite 8 с Rolldown за бързи билдове и CRXJS за управление на Manifest V3.
2. **Passive Observer Pattern**: Разширението не комуникира директно със Supabase. Вместо това, то изпраща събраните данни към Dashboard API (`/api/chats/extension`) с Bearer JWT.
3. **Multi-World Interception**:
   - **MAIN World**: Инжектиран скрипт за 'batchexecute' прехващане на мрежови заявки.
   - **ISOLATED World**: Контент скрипт за DOM екстракция (fallback) и мост към фоновия скрипт.
4. **Auth Bridge**: JWT токенът се извлича от Dashboard сесията и се съхранява в `chrome.storage.local`.

### Причини

- **Сигурност**: Supabase ключовете остават само в Dashboard-а.
- **Производителност**: Vite 8/Rolldown намалява времето за компилация на разширението.
- **Reliability**: Комбинацията от мрежово прехващане и DOM екстракция гарантира максимален capture rate за Gemini.

### Последици

- Нужда от синхронизация на типовете чрез `@brainbox/types`.
- Трябва да се управлява жизнения цикъл на токена (refresh flow) чрез Dashboard-а.

---

## [ADR-013] Removal of exactOptionalPropertyTypes for Compatibility

**Дата:** 2026-04-14
**Статус:** Прието

### Контекст

`exactOptionalPropertyTypes: true` в TypeScript конфигурацията стриктно забранява задаването на `undefined` към опционални полета, освен ако това не е изрично в типа. Това чупи съвместимостта с Zustand v5 (стейт мениджмънт) и дефинициите на shadcn/ui.

### Решение

Премахване на `"exactOptionalPropertyTypes": true` от `packages/config/tsconfig.base.json`.

### Причини

- **Compatibility**: Zustand v5 и много външни библиотеки за React 19 не са напълно оптимизирани за този стриктен флаг.
- **Production Block**: Този флаг блокираше успешното преминаване на `pnpm typecheck` при правилно написан код.

### Последици

- По-гъвкаво боравене с опционални пропове.
- Вече няма нужда от специфични хакове в стейт обектите.

---

## [ADR-014] Verification of User Identity in Extension Auth Bridge

**Дата:** 2026-04-14
**Статус:** Прието

### Контекст

`extension-auth/page.tsx` служеше за предаване на JWT токен към Chrome разширението. Използването на `getSession()` разчиташе единствено на бисквитките от браузъра, което е потенциално уязвимо при XSS/CSRF атаки.

### Решение

Замяна на `auth.getSession()` с `auth.getUser()` в аутентикационния мост.

### Причини

- **Security**: `getUser()` винаги прави сървърна валидация на сесията срещу Supabase Auth сървъра.
- **Data Integrity**: Гарантира се, че `user.id` и `user.email` are автентични.

### Последици

- Минимално забавяне в аутентикацията (заради сървърния call), но защитен мост.
- Вече се излъчват верифицирани данни към `postMessage` слушателите.

---

## [ADR-016] Extension Build System: WXT replaces CRXJS/Vite

**Дата:** 2026-04-19
**Статус:** Прието — Заменя ADR-012 (Extension Architecture)

### Контекст

Разширението ползваше Vite 8 + `@crxjs/vite-plugin` + ръчно поддържан `manifest.json`. Появиха се три проблема:

1. `@crxjs/vite-plugin` е в бета — `2.0.0-beta.33` — без финален release за Vite 8.
2. Ръчният `manifest.json` изисква синхронно обновяване при всяка промяна на permissions/entrypoints — бавно и error-prone.
3. Структурата с `src/background/service-worker.ts`, `src/content/index.ts` и root `index.html` не е file-based — тежка за мащабиране.

### Решение

Миграция към **WXT** (Web Extension Framework) — "Next.js за extensions".

- **`wxt.config.ts`** заменя `vite.config.ts` + `manifest.json`.
- **`entrypoints/`** директория: file-based entrypoints (background, content, popup).
- **`@wxt-dev/module-react`** заменя `@vitejs/plugin-react` (babel) — съвместимо с Vite 8 + Oxc.
- **`wxt prepare`** генерира TypeScript типове (`.wxt/`) — без нужда от `@types/chrome` workarounds.
- Манифестът се генерира автоматично от WXT при build — никога ръчни редакции.

### Ключови структурни промени

```
# Стара структура (CRXJS)           # Нова структура (WXT)
src/background/service-worker.ts  → entrypoints/background.ts
src/content/index.ts              → entrypoints/content/index.ts
src/popup/index.tsx               → entrypoints/popup/main.tsx
manifest.json (ръчен)             → генерира се от wxt.config.ts
vite.config.ts                    → wxt.config.ts
```

### Причини

- **Стабилност**: WXT е production-ready (v0.19+). CRXJS beta е незавършена за Vite 8.
- **Zero-config HMR**: WXT HMR работи за popup и content scripts без ръчна конфигурация.
- **Type Safety**: `wxt prepare` генерира `browser` типове специфични за проекта.
- **Cross-browser**: WXT поддържа Firefox/Safari без промяна на кода (бъдеща нужда).
- **Maintenance**: Манифестът се управлява на едно място — `wxt.config.ts`.

### Алтернативи разгледани

- **Продължаване с CRXJS** — отхвърлено, бета без Vite 8 финална поддръжка.
- **Чист Vite 8 без CRXJS** — отхвърлено, ръчен manifest overhead.
- **Plasmo Framework** — отхвърлено, React-only lock-in и тежка абстракция.

### Последици

- `GEMINI.md` Prohibition #2 се обновява: `background.ts` (WXT entrypoint) е новото правило — НЕ `service-worker.ts`.
- `AGENTS.md` tech stack се обновява: `WXT` вместо `CRXJS`.
- `extension-build.yml` workflow: `wxt build` вместо `vite build`.
- `wxt zip` генерира `.zip` за Chrome Web Store директно.
- Всички agent rules за `service-worker.ts` трябва да четат `background.ts` (WXT компилира го до SW автоматично).

---

## [ADR-015] Multi-Tool Rules Standard (AGENTS.md & GEMINI.md)

**Дата:** 2026-04-19
**Статус:** Прието (Заменя "Centralized Rule Documentation")

### Контекст

Предишният подход за консолидация в `docs/rules.md` се оказа несъвместим с новите cross-tool стандарти (v1.20.5) и затруднява преноса на правила към други инструменти (Cursor, Claude Code).

### Решение

Преминаване към йерархична структура на правилата:

1. **AGENTS.md (Root):** Споделени стандарти за всички AI инструменти (Tech stack, Core principles, Git).
2. **GEMINI.md (Root):** Специфични за Antigravity инструкции и "Absolute Prohibitions".
3. **.agent/rules/ (Folder):** Подробни правила, разделени по категории (Core, BrainBox).

### Причини

- **Interoperability:** `AGENTS.md` е новият индустриален стандарт за споделени правила.
- **Precedence Control:** Позволява на Antigravity да има специфични хакове (напр. `proxy.ts`) без да обърква други инструменти.
- **Organization:** Използването на `.agent/` (singular) директория съответства на най-новите гайдлайни от Antigravity Codes.

### Последици

- Изтрит е `docs/rules.md`.
- Папката `.agent/` е преименувана на `.agent/`.
- Агентите трябва да четат `AGENTS.md` за общ контекст и `GEMINI.md` за стриктни ограничения.
