# BrainBox Roadmap

**Version:** 1.0.0  
**Last Updated:** 2026-04-19  
**Project:** BrainBox Monorepo  
**Repo:** HackamViGo/BrainBox\_ (нов monorepo)  
**Reference Extension:** HackamViGo/Chat-Organizer @ v3.0.0-stable  
**Status:** Active Development

---

## 🗺️ Обзор на архитектурата

```
BrainBox_/
├── apps/
│   ├── web-app/          → Next.js 16.2 + React 19.2 (Dashboard/знания)
│   └── extension/        → Vite 8 + CRXJS + MV3 (passive observer)
├── packages/
│   ├── @brainbox/types   → Zod схеми + TypeScript типове
│   ├── @brainbox/ui      → shadcn/ui компоненти + design tokens
│   ├── @brainbox/utils   → logger, helpers, constants
│   └── @brainbox/config  → tsconfig.base, eslint, CSS tokens
├── docs/
│   ├── DECISIONS.md      → ADR архив (16 ADR-а)
│   ├── GRAPH.json        → 76 nodes архитектурна карта
│   ├── AGENTS_GRAPH.json → Agent dependency граф
│   └── audits/           → Audit доклади (генерирани от агент)
├── tasks/
│   ├── todo.md
│   └── lessons.md
├── .agent/
│   └── skills/           → 13+ Antigravity skills
├── .github/
│   └── workflows/        → CI/CD (typecheck, lint, test, build)
├── .husky/               → Pre-commit hooks
├── pnpm-workspace.yaml   → Catalogs за версии
├── turbo.json            → Turborepo pipeline
├── GEMINI.md             → Workspace-level rules за агента
└── .env.local            → Единствен env файл (dotenv-cli)
```

### Комуникационни пътеки (само 3 легитимни)

Extension → HTTPS + Bearer JWT → /api/\*\* (web-app) → Supabase (RLS)
web-app → @supabase/ssr → PostgreSQL + Realtime
web-app /extension-auth → postMessage → Extension chrome.storage.local (JWT bridge, еднократно)

---

## ⚡ Известни проблеми при старт (Pre-Roadmap)

| #   | Проблем                                               | Тип      | Файл                                  |
| --- | ----------------------------------------------------- | -------- | ------------------------------------- |
| 1   | `background/index.ts` трябва да е `service-worker.ts` | CRITICAL | `apps/extension/src/background/`      |
| 2   | JWT в `chrome.storage.local` без AES-GCM криптиране   | CRITICAL | `apps/extension/src/lib/storage.ts`   |
| 3   | CRXJS `esbuild` опция deprecated → трябва `oxc`       | HIGH     | `apps/extension/vite.config.ts`       |
| 4   | `Unknown input options: platform` от CRXJS            | HIGH     | CRXJS несъвместимост с Rolldown       |
| 5   | `optimizeDeps.rollupOptions` → `rolldownOptions`      | HIGH     | `apps/extension/vite.config.ts`       |
| 6   | `Promise<any>` в server actions                       | HIGH     | `apps/web-app/actions/library.ts`     |
| 7   | 48 инстанции `any` тип                                | HIGH     | Целия проект                          |
| 8   | 12 директни `localStorage` извън Zustand              | MEDIUM   | Различни компоненти                   |
| 9   | 5 `console.log` в extension                           | MEDIUM   | `apps/extension/src/`                 |
| 10  | Липсват `--color-acc-*` CSS токени                    | MEDIUM   | `packages/config/styles/brainbox.css` |
| 11  | Hydration mismatch в body (browser extension attr)    | MEDIUM   | `apps/web-app/app/layout.tsx`         |
| 12  | `refresh_token_not_found` при стартиране              | LOW      | Supabase session, изтекъл токен       |

---

## 🔧 CRXJS + Vite 8 Decision Point

```
Сегашна ситуация:
- CRXJS работи с Vite 8 (стартира, HMR работи)
- Но: deprecated warnings, Unknown input options: platform
- Риск: CRXJS е в beta, Vite 8 промени Rolldown API

Стратегия:
Phase 0-2 → CRXJS (работи, приемливо)
Phase 3    → Оценка: ако CRXJS има >2 breaking issues → мигриране към WXT
Phase 4+   → WXT (ако е нужно)

WXT trigger критерии:
- CRXJS спре да поддържа HMR в content scripts
- Build failures в production mode
- Невъзможност да се fix-не "platform" option грешката
```

---

## 📋 PHASES OVERVIEW

| Phase | Фокус              | Цел                               | Gate (минимум за преминаване)                           |
| ----- | ------------------ | --------------------------------- | ------------------------------------------------------- |
| **0** | Foundation Fix     | Коригиране на критичните проблеми | `pnpm build` без errors; 0 `any` в критични файлове     |
| **1** | Web App Stability  | Стабилизиране на web-app          | Всички 11 screens работят; Supabase CRUD работи         |
| **2** | Shared Packages    | Консолидиране на packages         | `@brainbox/*` exports без `any`; CSS tokens пълни       |
| **3** | Extension Core     | Работещ extension MVP             | Install unpacked; ChatGPT + Gemini capture работи       |
| **4** | Extension Advanced | Claude + offline queue            | 3 платформи + AES-GCM + offline queue                   |
| **5** | Integration        | Web-app ↔ Extension               | Auth bridge работи; `/api/chats/extension` приема данни |
| **6** | Polish & UX        | Glassmorphism popup               | Popup отразява web-app visual identity                  |
| **7** | Production         | Chrome Web Store ready            | Lighthouse >90; 0 console.log; manifest clean           |

---

## 🔴 PHASE 0 — Foundation Fix

**Цел:** Изчистване на всички CRITICAL и HIGH проблеми ПРЕДИ да се продължи с нови функции.  
**Принцип:** Не се добавя нищо ново докато не работи стабилно старото.

### 0.1 Extension — Service Worker Rename

**Файлове:**

```
apps/extension/src/background/service-worker.ts   ← преименуване от index.ts
apps/extension/manifest.json                       ← обновяване на path
```

**Логика:** MV3 изисква explicit service_worker декларация. Naming конвенцията е задължителна (Absolute Prohibition 2 в архитектурата).

**manifest.json промяна:**

```json
"background": {
  "service_worker": "src/background/service-worker.ts",
  "type": "module"
}
```

### 0.2 Extension — Vite 8 Config Fix

**Файлове:**

```
apps/extension/vite.config.ts
```

**Промени:**

- `build.rollupOptions` → `build.rolldownOptions`
- `optimizeDeps.rollupOptions` → `optimizeDeps.rolldownOptions`
- Смяна на `@vitejs/plugin-react` (babel) → `@vitejs/plugin-react-oxc`
- Проверка на `@crxjs/vite-plugin` за `platform` option fix

**Очакван резултат:** 0 deprecation warnings при `pnpm dev`.

### 0.3 Web App — Премахване на `any` в критични файлове

**Файлове:**

```
apps/web-app/actions/library.ts       ← Promise<any> → конкретни типове
apps/web-app/store/useLibraryStore.ts ← вътрешни any трансформации
```

**Логика:** Server Actions са входна точка за данни. `any` тук означава 0 type safety за Supabase операции.

**Минимален тип пример:**

```typescript
// Преди
async function loadUserData(): Promise<any> { ... }

// След
import type { Folder, Item } from '@brainbox/types'
async function loadUserData(): Promise<{ folders: Folder[]; items: Item[] }> { ... }
```

### 0.4 Web App — localStorage → Zustand

**Файлове:** Намерете с `grep -rn "localStorage" apps/web-app/`  
**Логика:** 12 директни `localStorage` calls нарушават ADR-004. Всички трябва да минат през Zustand persist.

### 0.5 Extension — console.log → logger

**Файлове:** `apps/extension/src/**`  
**Логика:** Production код не трябва да leak-ва данни в console. `@brainbox/utils` logger вече е наличен.

### 🚦 Phase 0 Gate — Минимални файлове и условия

```
✅ apps/extension/src/background/service-worker.ts  (не index.ts)
✅ apps/extension/manifest.json                      (service_worker path обновен)
✅ apps/extension/vite.config.ts                     (0 deprecated options)
✅ apps/web-app/actions/library.ts                   (0 Promise<any>)
✅ pnpm build                                        → 0 errors
✅ pnpm typecheck                                    → 0 errors в критичните файлове
✅ pnpm dev                                          → 0 CRXJS deprecated warnings
```

---

## 🟠 PHASE 1 — Web App Stability

**Цел:** Всички 11 screens работят стабилно с реални Supabase данни.  
**Принцип:** Никакъв mock data в production paths.

### 1.1 Screens Audit & Fix

**Засегнати screens от аудита:**

- `Library.tsx` → hardcoded colors (`#10a37f`) → CSS токени
- `MindGraph.tsx` → масово `#hex` за D3 → CSS токени + D3 color scale
- `Prompts.tsx` → грешки (споменати от теб)
- `Login.tsx` → hardcoded colors

**Файлова структура (минимум):**

```
apps/web-app/
├── app/
│   ├── layout.tsx                    → RootLayout + PersistentShell
│   ├── page.tsx                      → Dashboard redirect
│   ├── (auth)/
│   │   └── login/page.tsx
│   └── (app)/
│       ├── library/page.tsx
│       ├── prompts/page.tsx
│       ├── ai-nexus/page.tsx
│       ├── workspace/page.tsx
│       ├── mind-graph/page.tsx
│       ├── archive/page.tsx
│       ├── settings/page.tsx
│       └── identity/page.tsx
├── components/
│   ├── shell/
│   │   ├── PersistentShell.tsx       → NeuralField + AmbientLight wrapper
│   │   └── Sidebar.tsx
│   ├── prompts/
│   │   ├── HubView.tsx
│   │   ├── FrameworksView.tsx
│   │   ├── RefineView.tsx
│   │   ├── CapturesView.tsx
│   │   ├── SavedPromptsView.tsx
│   │   └── ViewWrapper.tsx           → AnimatePresence
│   └── modals/
│       ├── ApiKeyModal.tsx
│       ├── SmartSwitchModal.tsx
│       ├── NewFolderModal.tsx
│       └── NewChatModal.tsx
├── store/
│   ├── useAppStore.ts                → switchMode, isPinned, expandedFolders
│   ├── useLibraryStore.ts            → folders, items (skipHydration: true)
│   ├── useExtensionStore.ts          → extension status, captures
│   ├── useAINexusStore.ts            → AI model selection, API keys
│   └── usePromptStore.ts             → prompts, saved prompts
├── actions/
│   ├── auth.ts                       → signIn, signOut, getUser
│   └── library.ts                    → loadUserData, createFolder, etc.
├── proxy.ts                          → Supabase SSR proxy (замества middleware.ts)
└── api/
    ├── chats/
    │   └── extension/route.ts        → Extension sync endpoint (30 RPM)
    └── prompts/
        └── route.ts
```

### 1.2 Hydration Fix

**Файл:** `apps/web-app/app/layout.tsx`  
**Проблем:** Browser extension инжектира атрибути в `<body>` → hydration mismatch.  
**Fix:**

```tsx
<body suppressHydrationWarning className="antialiased font-sans">
```

`suppressHydrationWarning` е правилното решение когато external actors (browser extensions) модифицират DOM.

### 1.3 Supabase Auth Fix

**Проблем:** `refresh_token_not_found` при стартиране.  
**Причина:** Изтекъл токен в `.env.local` или стара сесия.  
**Fix:** Изчисти Supabase сесията локално + провери middleware refresh pattern.

### 1.4 CSS Tokens — Акцентни цветове

**Файл:** `packages/config/styles/brainbox.css`  
**Добавяне:**

```css
@theme {
  /* Platform accent colors */
  --color-acc-chatgpt: #10a37f;
  --color-acc-claude: #cc785c;
  --color-acc-gemini: #8ab4f8;
  --color-acc-deepseek: #4d6bfe;
  --color-acc-grok: #1da1f2;
  --color-acc-perplexity: #20b2aa;
  --color-acc-qwen: #ff6a00;
  --color-acc-lmarena: #7c3aed;

  /* Glass system */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: 12px;
}
```

### 🚦 Phase 1 Gate

```
✅ Всички 11 screens рендерират без React errors
✅ Library CRUD работи (create/read/update/delete folder + item)
✅ Login/Logout работи без refresh_token_not_found
✅ PersistentShell + NeuralField без hydration mismatch
✅ 0 hardcoded hex colors в screens (всичко е CSS токени)
✅ Всички модали отварят/затварят коректно
✅ pnpm typecheck → 0 errors
✅ pnpm lint → 0 errors
```

---

## 🟡 PHASE 2 — Shared Packages Consolidation

**Цел:** `@brainbox/*` пакетите са единствен source of truth. Нито един тип не е дефиниран на две места.

### 2.1 `@brainbox/types` — Пълна схема

**Файлова структура:**

```
packages/types/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                      → re-exports всичко
    ├── schemas.ts                    → Zod схеми (единствен source of truth)
    ├── database.ts                   → Supabase генерирани типове
    └── extension.ts                  → Extension-специфични типове
```

**Минимални типове в `schemas.ts`:**

```typescript
// Core entities
export const FolderSchema = z.object({ ... })
export const ItemSchema = z.object({ ... })
export const ChatSchema = z.object({ ... })        // Extension capture
export const SyncItemSchema = z.object({ ... })    // Offline queue item

// Extension-specific
export const ExtensionChatPayloadSchema = z.object({
  platform: z.enum(['chatgpt', 'gemini', 'claude', 'deepseek', 'grok', 'perplexity', 'qwen', 'lmarena']),
  chatId: z.string(),
  title: z.string(),
  messages: z.array(MessageSchema),
  capturedAt: z.string().datetime(),
})

export type ExtensionChatPayload = z.infer<typeof ExtensionChatPayloadSchema>
```

### 2.2 `@brainbox/ui` — shadcn/ui + Design Tokens

**Файлова структура:**

```
packages/ui/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── components/                   → shadcn/ui компоненти
    │   ├── Button.tsx
    │   ├── Dialog.tsx
    │   ├── Input.tsx
    │   └── ...
    └── tokens/
        ├── colors.ts                 → Design tokens като JS константи
        └── index.ts
```

**Правило:** `@brainbox/ui` НЕ импортира от `apps/`. Само `packages/config` CSS токени.

### 2.3 `@brainbox/utils` — Logger + Helpers

**Файлова структура:**

```
packages/utils/
├── package.json
└── src/
    ├── index.ts
    ├── logger.ts                     → Централизиран логер (DEBUG_MODE aware)
    ├── crypto.ts                     → AES-GCM (за extension storage)
    └── constants.ts                  → Платформени URLs, rate limits
```

**Важно:** `crypto.ts` трябва да работи в **browser context** (extension) и **Node.js** (web-app). Ползвай `globalThis.crypto`.

### 🚦 Phase 2 Gate

```
✅ packages/types/src/schemas.ts → всички Zod схеми дефинирани
✅ packages/types → 0 any exports
✅ packages/ui → shadcn/ui компоненти инсталирани и работят
✅ packages/utils/src/logger.ts → работи в browser + Node.js
✅ packages/utils/src/crypto.ts → AES-GCM encrypt/decrypt тестван
✅ pnpm -r build → всички packages build-ват без errors
✅ Web-app импортира от @brainbox/* (не relative paths към packages)
```

---

## 🟢 PHASE 3 — Extension Core (MVP)

**Цел:** Extension се инсталира, connect-ва с web-app, и улавя чатове от ChatGPT + Gemini.

### 3.1 Файлова структура — Extension MVP

```
apps/extension/
├── manifest.json                     → MV3, всички permissions
├── package.json
├── vite.config.ts                    → Vite 8 + CRXJS (fixed)
├── tsconfig.json
└── src/
    ├── background/
    │   └── service-worker.ts         → Главен координатор
    │   └── modules/
    │       ├── authManager.ts        → JWT lifecycle + AES-GCM
    │       ├── messageRouter.ts      → onMessage dispatcher
    │       ├── syncManager.ts        → Offline queue + chrome.alarms
    │       ├── dashboardApi.ts       → HTTP клиент към web-app API
    │       └── platformAdapters/
    │           ├── base.ts           → Abstract BaseAdapter
    │           ├── index.ts          → Registry/factory
    │           ├── chatgpt.adapter.ts
    │           └── gemini.adapter.ts
    ├── content/
    │   ├── content-chatgpt.ts        → ChatGPT content script
    │   ├── content-gemini.ts         → Gemini content script
    │   ├── inject-gemini-main.ts     → MAIN world inject (WIZ_global_data)
    │   └── content-dashboard-auth.ts → JWT bridge от web-app
    ├── popup/
    │   ├── index.html
    │   ├── index.tsx
    │   └── App.tsx                   → Minimal status popup
    └── lib/
        ├── config.ts                 → URLs по environment (dev/prod)
        ├── storage.ts                → chrome.storage.local wrapper
        └── logger.ts                 → re-export от @brainbox/utils
```

### 3.2 Service Worker архитектура

```typescript
// service-worker.ts — само координация, без бизнес логика
import { MessageRouter } from "./modules/messageRouter";
import { AuthManager } from "./modules/authManager";
import { SyncManager } from "./modules/syncManager";

chrome.runtime.onInstalled.addListener(() => {
  AuthManager.init();
  SyncManager.init();
  // Context menu setup
  chrome.contextMenus.create({
    id: "save-to-brainbox",
    title: "Save to BrainBox",
    contexts: ["selection", "page"],
  });
});

chrome.runtime.onMessage.addListener(MessageRouter.handle);
chrome.alarms.onAlarm.addListener(SyncManager.onAlarm);
```

### 3.3 Auth Bridge (postMessage)

```
Поток:
1. Потребителят влиза в web-app (/extension-auth)
2. content-dashboard-auth.ts слуша за BRAINBOX_AUTH_TOKEN message
3. web-app изпраща: window.postMessage({ type: 'BRAINBOX_AUTH_TOKEN', token: jwt })
4. content script → chrome.runtime.sendMessage → authManager.ts
5. authManager.ts: AES-GCM encrypt → chrome.storage.local.set
6. При всяка API заявка: decrypt → Authorization: Bearer <jwt>
```

### 3.4 Platform Adapters — Логика (от Chat-Organizer reference)

```
⚠️ ВАЖНО: Не се copy-paste-ва код.
Взима се само архитектурния pattern:

BaseAdapter (abstract):
  - abstract extract(): Promise<ChatData>
  - abstract getPlatformId(): Platform
  - protected sendToBackground(data): void

ChatGPTAdapter extends BaseAdapter:
  - Метод на capture: DOM scraping на article елементи
  - Source fingerprint: URL chat ID (chat.openai.com/c/{chatId})
  - Duplicate detection: chatId като уникален ключ

GeminiAdapter extends BaseAdapter:
  - Метод: inject-gemini-main.ts чете WIZ_global_data от MAIN world
  - document_start injection (за да хване данните преди React mount)
  - postMessage от MAIN world → ISOLATED world → background
```

### 3.5 Manifest (MVP версия)

```json
{
  "manifest_version": 3,
  "name": "BrainBox",
  "version": "3.0.0",
  "permissions": ["storage", "contextMenus", "tabs", "scripting", "alarms"],
  "host_permissions": [
    "https://chatgpt.com/*",
    "https://chat.openai.com/*",
    "https://gemini.google.com/*",
    "https://brainbox.ai/*",
    "http://localhost:3000/*"
  ],
  "background": {
    "service_worker": "src/background/service-worker.ts",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["https://chatgpt.com/*", "https://chat.openai.com/*"],
      "js": ["src/content/content-chatgpt.ts"],
      "run_at": "document_idle"
    },
    {
      "matches": ["https://gemini.google.com/*"],
      "js": ["src/content/content-gemini.ts"],
      "run_at": "document_start"
    },
    {
      "matches": [
        "http://localhost:3000/extension-auth",
        "https://brainbox.ai/extension-auth"
      ],
      "js": ["src/content/content-dashboard-auth.ts"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "src/popup/index.html"
  },
  "web_accessible_resources": [
    {
      "resources": ["src/content/inject-gemini-main.js"],
      "matches": ["https://gemini.google.com/*"]
    }
  ]
}
```

### 🚦 Phase 3 Gate

```
✅ Extension load unpacked без errors в chrome://extensions
✅ service-worker.ts регистриран коректно (не index.ts)
✅ Context menu "Save to BrainBox" се появява
✅ Auth bridge: login в web-app → токен се записва в extension
✅ ChatGPT: content script inject-ван, чата се улавя
✅ Gemini: inject-gemini-main.ts работи в MAIN world
✅ Captured chat се изпраща към /api/chats/extension
✅ 0 console.log в extension (само logger)
✅ AES-GCM: JWT е криптиран в chrome.storage.local
✅ vite build → dist/ папка без errors
```

---

## 🔵 PHASE 4 — Extension Advanced

**Цел:** Добавяне на Claude адаптер, offline queue, и robust selectors.

### 4.1 Claude Adapter

```
apps/extension/src/background/modules/platformAdapters/claude.adapter.ts
apps/extension/src/content/content-claude.ts
```

**Метод:** DOM scraping на claude.ai  
**URL pattern:** `https://claude.ai/*`  
**Source fingerprint:** URL conversation ID

### 4.2 Offline Queue (SyncManager)

```typescript
// syncManager.ts
interface SyncItem {
  id: string; // uuid
  payload: ExtensionChatPayload; // от @brainbox/types (не any!)
  attempts: number;
  createdAt: number;
  lastAttempt: number | null;
}

// Queue в chrome.storage.local под ключ 'brainbox_sync_queue'
// chrome.alarms за retry на всеки 5 минути
// Exponential backoff: 5min → 10min → 20min (max 3 опита)
// При success: премахване от queue
```

### 4.3 Robust Selectors

**Проблем:** DOM selectors за ChatGPT/Gemini се чупят при UI updates на платформата.  
**Решение:** Multiple selector fallbacks + MutationObserver за dynamic content:

```typescript
const CHATGPT_SELECTORS = {
  // Primary
  messages: '[data-testid="conversation-turn"]',
  // Fallback 1
  messagesFallback1: "article[data-scroll-anchor]",
  // Fallback 2 (generic, последен resort)
  messagesFallback2: 'main [class*="group"]',
};
```

### 4.4 Source Fingerprinting & Duplicate Detection

```typescript
// При capture: извличане на уникален chatId от URL
const getChatId = (url: string, platform: Platform): string => {
  // ChatGPT: chat.openai.com/c/{chatId}
  // Gemini: gemini.google.com/app/{sessionId}
  // Claude: claude.ai/chat/{chatId}
};

// В SyncManager: проверка преди добавяне в queue
const isDuplicate = await storage.get(`captured_${chatId}`);
```

### 🚦 Phase 4 Gate

```
✅ Claude adapter работи (capture от claude.ai)
✅ Offline queue: при спрян web-app → чатовете се записват локално
✅ При рестарт на web-app → queue се синхронизира автоматично
✅ chrome.alarms вместо setInterval навсякъде
✅ Duplicate detection: повторен capture на същия chat → ignored
✅ 3 платформи (ChatGPT + Gemini + Claude) работят едновременно
✅ @brainbox/types → SyncItem типизиран (не any)
```

---

## 🟣 PHASE 5 — Integration

**Цел:** Web-app и Extension работят заедно end-to-end. Данните от extension се виждат в web-app.

### 5.1 `/api/chats/extension` — Endpoint

```typescript
// apps/web-app/app/api/chats/extension/route.ts
// Rate limit: 30 RPM (сървърна страна)
// Auth: Bearer JWT validation чрез getUser()
// Body: ExtensionChatPayloadSchema (Zod validation)
// Action: INSERT в Supabase chats таблица (RLS enforced)
// Response: { success: true, chatId: string }
```

### 5.2 Extension Auth Bridge — Финализиране

```
apps/extension/src/content/content-dashboard-auth.ts
apps/web-app/app/(app)/extension-auth/page.tsx

Поток (пълен):
1. User → web-app → Settings → "Connect Extension"
2. web-app redirect → /extension-auth
3. /extension-auth → auth.getUser() (НЕ getSession!)
4. window.postMessage({ type: 'BRAINBOX_AUTH_TOKEN', jwt, userId })
5. content-dashboard-auth → chrome.runtime.sendMessage
6. authManager → AES-GCM encrypt → chrome.storage.local
7. Extension popup показва: "Connected as user@email.com"
```

### 5.3 `CapturesView.tsx` — Live feed

```
apps/web-app/components/prompts/CapturesView.tsx

Показва: Raw captures от extension
Source: useExtensionStore → polling /api/chats/extension?status=pending
или Supabase Realtime subscription
```

### 5.4 useExtensionStore

```typescript
// apps/web-app/store/useExtensionStore.ts
interface ExtensionStore {
  isConnected: boolean; // Има ли активна extension сесия
  lastSync: Date | null;
  pendingCaptures: ChatCapture[];
  actions: {
    loadCaptures: () => Promise<void>;
    approveCapture: (id: string) => Promise<void>;
    rejectCapture: (id: string) => Promise<void>;
  };
}
```

### 🚦 Phase 5 Gate

```
✅ Extension capture → /api/chats/extension → Supabase → CapturesView
✅ Auth bridge: connect extension от web-app Settings
✅ Extension popup: показва connected status + user email
✅ Rate limiting: extension не изпраща >30 RPM
✅ Zod validation: невалиден payload → 400 response
✅ RLS: потребителят вижда само своите captures
✅ E2E flow: ChatGPT → capture → web-app Library работи
```

---

## ⚪ PHASE 6 — Polish & UX

**Цел:** Extension popup визуално съответства на web-app identity.

### 6.1 Glassmorphism Popup

```
apps/extension/src/popup/
├── App.tsx                    → Главен компонент
├── components/
│   ├── StatusBar.tsx          → Connected/Disconnected indicator
│   ├── QuickCapture.tsx       → Бутон за manual capture
│   ├── RecentCaptures.tsx     → Последни 3 capture-а
│   └── PlatformBadge.tsx      → Цветен badge по платформа
└── styles/
    └── popup.css              → Glass panels, neural-inspired

Визуален стил:
- Background: dark, subtle gradient (като NeuralField но статичен)
- Panels: glass-bg + glass-border от CSS токени
- Typography: Inter, same as web-app
- Animations: subtle fade-in, no heavy canvas
- Size: 380x500px (Chrome extension popup limit)
- NO full NeuralField canvas (performance в popup context)
```

### 6.2 Context Menu Enhancement

```typescript
// service-worker.ts
// Context menu → "Save to BrainBox" → открива popup или директно captures
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-to-brainbox") {
    // Изпраща message към content script на текущия tab
    chrome.tabs.sendMessage(tab.id, { action: "CAPTURE_CURRENT_CHAT" });
  }
});
```

### 🚦 Phase 6 Gate

```
✅ Popup се отваря в 380x500px без layout overflow
✅ Glass panels изглеждат consistent с web-app design
✅ Platform badges показват правилния цвят (от CSS токени)
✅ "Save to BrainBox" context menu работи
✅ Popup → Connected status → user email visible
✅ No console errors при popup open
```

---

## 🏁 PHASE 7 — Production Ready

**Цел:** Chrome Web Store submission ready.

### 7.1 stripDevCSP Plugin (от legacy reference)

```typescript
// apps/extension/vite.config.ts
// Адаптиран от стария проект:
function stripDevCSP(): Plugin {
  // При production build:
  // - Премахва localhost от host_permissions
  // - Премахва http:// URLs
  // - Проверява CSP е коректен
}
```

### 7.2 Production Checklist

```
Manifest:
☐ version bump (следва SemVer)
☐ description е ясна и не-спамова
☐ icons всички размери (16/32/48/128)
☐ 0 localhost URLs
☐ permissions са минималните необходими
☐ host_permissions са само production URLs

Code:
☐ 0 console.log (само logger с DEBUG_MODE=false)
☐ 0 hardcoded localhost URLs в код
☐ AES-GCM криптиране за storage
☐ source maps: false в production build

Performance:
☐ Popup bundle < 150KB gzipped
☐ Content script < 50KB gzipped
☐ Service worker < 100KB gzipped

Web App:
☐ Lighthouse > 90 (всички категории)
☐ LCP < 2.5s
☐ 0 console.log в production
☐ Error boundaries навсякъде
☐ Loading skeletons за D3/ReactFlow screens

CI:
☐ pnpm typecheck → 0 errors
☐ pnpm lint → 0 errors
☐ pnpm test → all passing, coverage ≥ 85%
☐ pnpm build → успешен build на всички apps
```

### 7.3 WXT Migration Decision

```
Ако до Phase 7 CRXJS има нерешени проблеми:
1. Инсталирай WXT: pnpm add -D wxt
2. Мигрирай vite.config.ts → wxt.config.ts
3. Провери manifest generation compatibility
4. Тествай HMR в content scripts

WXT предимства за production:
- Активно поддържан (не beta)
- Built-in stripDevCSP equivalent
- По-добра Vite 8 интеграция
```

### 🚦 Phase 7 Gate (Production Ready)

```
✅ Chrome Web Store: manifest validation passes
✅ Extension review guidelines: no violations
✅ 0 any types в целия проект
✅ 0 localStorage директни calls
✅ 0 console.log
✅ Всички тестове passing (≥ 85% coverage)
✅ Production build без warnings
✅ Lighthouse ≥ 90 за web-app
✅ Extension popup load < 500ms
```

---

## 📐 Взаимодействия между компонентите

```
┌─────────────────────────────────────────────────────────────┐
│  packages/ (@brainbox/*)                                     │
│  types ← validation ← ui ← utils ← config                  │
│     ↑              ↑                                         │
└─────┼──────────────┼──────────────────────────────────────┘
      │              │
┌─────▼──────┐  ┌────▼───────────────────────────────────────┐
│ Extension  │  │ Web App (Next.js)                           │
│ (Vite 8)  │  │                                             │
│           │  │ layout.tsx                                  │
│ SW ←─────────→ /api/chats/extension (Bearer JWT)           │
│ content   │  │ /extension-auth (postMessage bridge)        │
│ scripts   │  │                                             │
│ popup     │  │ store/ → actions/ → Supabase               │
└───────────┘  └────────────────────┬────────────────────────┘
                                    │ @supabase/ssr
                              ┌─────▼──────────┐
                              │ Supabase       │
                              │ PostgreSQL+RLS │
                              │ Auth + Realtime│
                              └────────────────┘
```

### Какво взаимодейства с какво:

| Source                      | Target                      | Метод                        | Данни                     |
| --------------------------- | --------------------------- | ---------------------------- | ------------------------- |
| `content-chatgpt.ts`        | `service-worker.ts`         | `chrome.runtime.sendMessage` | Raw DOM chat data         |
| `service-worker.ts`         | `messageRouter.ts`          | Direct call                  | Message dispatch          |
| `messageRouter.ts`          | `platformAdapters/`         | Factory pattern              | Normalize to ChatSchema   |
| `platformAdapters/`         | `syncManager.ts`            | Direct call                  | ExtensionChatPayload      |
| `syncManager.ts`            | `dashboardApi.ts`           | Queue flush                  | POST /api/chats/extension |
| `dashboardApi.ts`           | `web-app API`               | HTTPS + Bearer JWT           | ExtensionChatPayload      |
| `web-app API`               | `Supabase`                  | @supabase/ssr                | INSERT chats (RLS)        |
| `web-app /extension-auth`   | `content-dashboard-auth.ts` | `window.postMessage`         | JWT token                 |
| `content-dashboard-auth.ts` | `authManager.ts`            | `chrome.runtime.sendMessage` | JWT                       |
| `authManager.ts`            | `chrome.storage.local`      | AES-GCM encrypted            | JWT                       |
| `useLibraryStore`           | `actions/library.ts`        | Server Action                | CRUD operations           |
| `actions/library.ts`        | `Supabase`                  | Server-side client           | SQL queries               |
| `PersistentShell`           | `NeuralField`               | React children               | Canvas animation          |
| `MindGraph.tsx`             | `D3`                        | `dynamic(ssr:false)`         | Node graph visualization  |
| `Workspace.tsx`             | `ReactFlow`                 | `dynamic(ssr:false)`         | Flow editor               |

---

## 🔒 Absolute Prohibitions (никога не се нарушават)

```
1. Extension НЕ пише директно в Supabase
2. Service Worker се казва service-worker.ts (не index.ts)
3. JWT НЕ се съхранява в plain text (задължително AES-GCM)
4. any тип е забранен навсякъде
5. console.log е забранен в production код
6. Supabase service role key НЕ влиза в client код или Extension
7. Бизнес логика НЕ е в UI компоненти
8. Supabase заявки НЕ са в Zustand stores (само в actions/)
9. Extension НЕ инжектира UI в AI платформите (само textarea inject)
10. getSession() НЕ се ползва (само getUser() за security)
```
