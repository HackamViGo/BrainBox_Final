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
- `apps/extension`: Chrome extension (Vite 7).

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
- Схема: `folders` и `items` таблици с RLS.
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
