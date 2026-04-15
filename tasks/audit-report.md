# BrainBox Audit Report — 2026-04-14

## 1. Web App Status
### Завършени компоненти
- **Layout & Routing**: `PersistentShell` и SPA navigation (`activeScreen` в Zustand) са напълно функционални.
- **Supabase Integration**: Server Actions в `actions/library.ts` и `actions/auth.ts` са имплементирани с Zod валидация и auth checks.
- **State Management**: Zustand stores (`useAppStore`, `useLibraryStore`, `usePromptStore`) са правилно конфигурирани със `skipHydration: true` и `persist`.
- **Primary Screens**: `AINexus`, `Library`, `Prompts`, `Settings`, `Archive`, `Workspace` имат реална бизнес логика.
- **Auth Bridge**: `extension-auth/page.tsx` е готов за комуникация с разширението.

### Незавършени / Stub компоненти
- **MindGraph.tsx**: Използва `generateGraphData()` за генериране на mock данни. Липсва връзка с реалните `items` от `useLibraryStore`.
- **Identity.tsx**: Usage stats (`modelUsage`) са hardcoded mock стойности.
- **Workspace components**: `AssetLibrary.tsx` и `WhisperPanel.tsx` имат UI, но интеграцията с реалните файлове/гласов запис е в начален етап.

### Критични липси
- **SSR сесия в proxy.ts**: `proxy.ts` (Next.js middleware съответствие) съществува, но трябва да се провери дали се активира коректно от Next.js (стандартно име е `middleware.ts`).

## 2. Extension Status
### Какво реално съществува
- **Popup UI**: `src/popup/App.tsx` и `App.css` съществуват (базов UI).
- **Adapters**: `ChatGPTAdapter` и `GeminiAdapter` имат базова логика за екстракция на DOM елементи.
- **Storage**: `src/utils/storage.ts` използва `chrome.storage.local`.

### Какво липсва изцяло (КРИТИЧНО)
- **Background Service Worker**: Файлът `src/background/index.ts` липсва, въпреки че е указан в `manifest.json`.
- **Content Script Entry**: Файлът `src/content/index.ts` липсва. Без него адаптерите не се зареждат.
- **Auth Sync Logic**: Липсва автоматичният механизъм за захващане на токена от `extension-auth` страницата.
- **Context Menus**: Имплементацията на десния бутон (capture selection) липсва.

### Блокиращи неизвестни
- **Sync Strategy**: Как точно ще се тригърва синхронизацията (автоматично при нов чат или с бутон)?
- **CRXJS Build**: Липсата на входни точки в `src/` може да доведе до грешки при `pnpm build` в `apps/extension`.

## 3. Configuration Status
### Завършени конфигурации
- **pnpm Catalogs**: Повечето зависимости са успешно мигрирани към `catalog:` в root `pnpm-workspace.yaml`.
- **Tailwind v4**: `@source` директивите в `globals.css` са правилно насочени към packages.
- **TS Path Aliases**: `@/` за `apps/web-app` е настроен коректно.

### Незавършени конфигурации
- **ESLint**: `packages/config/eslint.config.js` съществува, но не е ясно дали се прилага стриктно във всички подпроекти.
- **Supabase RLS**: Схемата е дефинирана, но трябва да се проверят `schema.sql` за липсващи `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` команди и политики.

## 4. Testing Status
### Покрити тестове
- **Stores**: `useLibraryStore`, `useAppStore`, `usePromptStore` имат unit тестове.
- **Actions**: `auth` и `library` actions имат базов покритие.

### Непокрити (задължителни по GEMINI.md)
- **Component Tests**: Повечето екрани в `screens/` нямат тестове.
- **E2E Tests**: Playwright тестовете са в начален стадий и не покриват основните flow-ове (Auth -> Sync -> Workspace).
- **Zod Schemas**: Липсват unit тестове конкретно за валидацията в `packages/types`.

## 5. CI/CD Status
- **Workflows**: `ci.yml`, `e2e.yml` и `deploy.yml` съществуват.
- **Graph Check**: `scripts/generate-graph.ts` съществува и е включен в CI.

## 6. Неизвестни и блокери
- **[БЛОКЕР] Липсващи файлове в Extension**: Липсата на `background/index.ts` и `content/index.ts` прави разширението нефункционално. Нужно е спешно имплементиране на входните точки.
- **[НЕИЗВЕСТНО] Middleware naming**: Ако `proxy.ts` не се разпознава автоматично от Next.js, той трябва да бъде преименуван или включен чрез custom config.
