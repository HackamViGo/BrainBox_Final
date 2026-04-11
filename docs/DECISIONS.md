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
