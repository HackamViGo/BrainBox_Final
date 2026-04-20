BrainBox Roadmap
Version: 1.0.0
Last Updated: 2025-04-19
Project: BrainBox Monorepo
Repo: HackamViGo/BrainBox_Final (нов monorepo)
Reference Extension: HackamViGo/Chat-Organizer @ v3.0.0-stable
Status: Active Development
Build System: WXT + Vite 8 (мигриран от CRXJS)

🗺️ Обзор на архитектурата
text

BrainBox\_/
├── apps/
│ ├── web-app/ → Next.js 16.2 + React 19.2 (Dashboard/знания)
│ └── extension/ → WXT + Vite 8 + MV3 (passive observer)
├── packages/
│ ├── @brainbox/types → Zod схеми + TypeScript типове
│ ├── @brainbox/ui → shadcn/ui компоненти + design tokens
│ ├── @brainbox/utils → logger, helpers, constants
│ └── @brainbox/config → tsconfig.base, eslint, CSS tokens
├── docs/
│ ├── DECISIONS.md → ADR архив
│ ├── GRAPH.json → Архитектурна карта
│ └── audits/ → Audit доклади
├── tasks/
│ ├── todo.md
│ └── lessons.md
├── .agent/
│ └── skills/ → Antigravity skills
├── .github/
│ └── workflows/ → CI/CD
├── .husky/ → Pre-commit hooks
├── pnpm-workspace.yaml → Catalogs за версии
├── turbo.json → Turborepo pipeline
├── GEMINI.md → Workspace-level rules
└── .env.local → Единствен env файл
Комуникационни пътеки (само 3 легитимни)
Extension → HTTPS + Bearer JWT → /api/\*\* (web-app) → Supabase (RLS)
web-app → @supabase/ssr → PostgreSQL + Realtime
web-app /extension-auth → postMessage → Extension chrome.storage.local (JWT bridge, еднократно)
⚡ Build System Migration: CRXJS → WXT
text

Решение взето: 2025-04-19
Причина: CRXJS deprecated warnings, несъвместимост с Vite 8 Rolldown API

WXT предимства:
✅ Активно поддържан (не beta)
✅ First-class Vite 8 support
✅ Built-in manifest generation
✅ Automatic dev/prod environment handling
✅ Type-safe entrypoints
✅ HMR за всички script types (background, content, popup)

Migration impact:

- vite.config.ts → wxt.config.ts
- manifest.json → wxt.config.ts defineConfig
- entrypoints/ структура вместо src/
- built-in stripDevCSP equivalent
  📋 PHASES OVERVIEW
  Phase Фокус Цел Gate (минимум за преминаване)
  0 Foundation Fix Коригиране на критичните проблеми pnpm build без errors; WXT migration завършена
  1 Web App Stability Стабилизиране на web-app Всички 11 screens работят; Supabase CRUD работи
  2 Shared Packages Консолидиране на packages @brainbox/\* exports без any; CSS tokens пълни
  3 Extension Core Работещ extension MVP Install unpacked; ChatGPT + Gemini capture работи
  4 Extension Advanced Claude + offline queue 3 платформи + AES-GCM + offline queue
  5 Integration Web-app ↔ Extension Auth bridge работи; /api/chats/extension приема данни
  6 Polish & UX Glassmorphism popup Popup отразява web-app visual identity
  7 Production Chrome Web Store ready Lighthouse >90; 0 console.log; manifest clean
  🔴 PHASE 0 — Foundation Fix
  Цел: WXT migration + изчистване на критични проблеми
  Принцип: Не се добавя нищо ново докато не работи стабилно старото.

  0.1 Extension — WXT Migration
  Нова файлова структура:

text

apps/extension/
├── wxt.config.ts → WXT configuration
├── package.json → @wxt-dev/wxt dependency
├── tsconfig.json
└── entrypoints/ → WXT entrypoints (замества src/)
├── background.ts → Service worker (auto MV3)
├── popup/
│ ├── index.html
│ └── main.tsx
└── content/
├── chatgpt.content.ts → ChatGPT observer
├── gemini.content.ts → Gemini observer
├── gemini-inject.ts → MAIN world script
└── dashboard-auth.content.ts → JWT bridge
wxt.config.ts минимална конфигурация:

TypeScript

import { defineConfig } from 'wxt';

export default defineConfig({
extensionApi: 'chrome',
modules: ['@wxt-dev/module-react'],
manifest: {
name: 'BrainBox',
version: '3.0.0',
permissions: ['storage', 'contextMenus', 'tabs', 'scripting', 'alarms'],
host_permissions: [
'https://chatgpt.com/*',
'https://chat.openai.com/*',
'https://gemini.google.com/*',
],
},
runner: {
disabled: process.env.NODE_ENV === 'production',
},
vite: () => ({
plugins: [react()],
}),
});
WXT entrypoint pattern:

TypeScript

// entrypoints/background.ts
export default defineBackground({
type: 'module',
main() {
console.log('BrainBox service worker started');
// Init logic
},
});

// entrypoints/content/chatgpt.content.ts
export default defineContentScript({
matches: ['https://chatgpt.com/*', 'https://chat.openai.com/*'],
runAt: 'document_idle',
main() {
// Content script logic
},
});
0.2 Web App — Премахване на any в критични файлове
Файлове:

text

apps/web-app/actions/library.ts ← Promise<any> → конкретни типове
apps/web-app/store/useLibraryStore.ts ← вътрешни any трансформации
Минимален тип пример:

TypeScript

// Преди
async function loadUserData(): Promise<any> { ... }

// След
import type { Folder, Item } from '@brainbox/types'
async function loadUserData(): Promise<{ folders: Folder[]; items: Item[] }> { ... }
0.3 Web App — localStorage → Zustand
Файлове: Намерете с grep -rn "localStorage" apps/web-app/
Логика: Всички localStorage calls трябва да минат през Zustand persist.

0.4 Extension — console.log → logger
Файлове: apps/extension/entrypoints/\*\*
Логика: Production код не трябва да leak-ва данни в console. @brainbox/utils logger вече е наличен.

🚦 Phase 0 Gate — Минимални условия
text

✅ WXT migration завършена
✅ entrypoints/background.ts работи (service worker регистриран)
✅ entrypoints/popup/main.tsx се зарежда
✅ wxt.config.ts manifest генерира валиден manifest.json
✅ apps/web-app/actions/library.ts → 0 Promise<any>
✅ pnpm build → 0 errors
✅ pnpm typecheck → 0 errors в критичните файлове
✅ pnpm dev (extension) → WXT dev server без errors
🟠 PHASE 1 — Web App Stability
Цел: Всички 11 screens работят стабилно с реални Supabase данни.
Принцип: Никакъв mock data в production paths.

1.1 Screens Audit & Fix
Засегнати screens:

Library.tsx → hardcoded colors → CSS токени
MindGraph.tsx → #hex за D3 → CSS токени + D3 color scale
Prompts.tsx → грешки
Login.tsx → hardcoded colors
Файлова структура (минимум):

text

apps/web-app/
├── app/
│ ├── layout.tsx → RootLayout + PersistentShell
│ ├── page.tsx → Dashboard redirect
│ ├── (auth)/
│ │ └── login/page.tsx
│ └── (app)/
│ ├── library/page.tsx
│ ├── prompts/page.tsx
│ ├── ai-nexus/page.tsx
│ ├── workspace/page.tsx
│ ├── mind-graph/page.tsx
│ ├── archive/page.tsx
│ ├── settings/page.tsx
│ └── identity/page.tsx
├── components/
│ ├── shell/
│ │ ├── PersistentShell.tsx
│ │ └── Sidebar.tsx
│ ├── prompts/
│ │ ├── HubView.tsx
│ │ ├── FrameworksView.tsx
│ │ ├── RefineView.tsx
│ │ ├── CapturesView.tsx
│ │ ├── SavedPromptsView.tsx
│ │ └── ViewWrapper.tsx
│ └── modals/
│ ├── ApiKeyModal.tsx
│ ├── SmartSwitchModal.tsx
│ ├── NewFolderModal.tsx
│ └── NewChatModal.tsx
├── store/
│ ├── useAppStore.ts
│ ├── useLibraryStore.ts
│ ├── useExtensionStore.ts
│ ├── useAINexusStore.ts
│ └── usePromptStore.ts
├── actions/
│ ├── auth.ts
│ └── library.ts
└── api/
├── chats/
│ └── extension/route.ts
└── prompts/route.ts
1.2 Hydration Fix
Файл: apps/web-app/app/layout.tsx
Fix:

React

<body suppressHydrationWarning className="antialiased font-sans">
1.3 CSS Tokens — Акцентни цветове
Файл: packages/config/styles/brainbox.css

CSS

@theme {
/_ Platform accent colors _/
--color-acc-chatgpt: #10a37f;
--color-acc-claude: #cc785c;
--color-acc-gemini: #8ab4f8;
--color-acc-deepseek: #4d6bfe;
--color-acc-grok: #1da1f2;
--color-acc-perplexity: #20b2aa;
--color-acc-qwen: #ff6a00;
--color-acc-lmarena: #7c3aed;

/_ Glass system _/
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: 12px;
}
🚦 Phase 1 Gate
text

✅ Всички 11 screens рендерират без React errors
✅ Library CRUD работи (create/read/update/delete folder + item)
✅ Login/Logout работи
✅ PersistentShell + NeuralField без hydration mismatch
✅ 0 hardcoded hex colors в screens
✅ Всички модали отварят/затварят коректно
✅ pnpm typecheck → 0 errors
✅ pnpm lint → 0 errors
🟡 PHASE 2 — Shared Packages Consolidation
Цел: @brainbox/\* пакетите са единствен source of truth.

2.1 @brainbox/types — Пълна схема
Файлова структура:

text

packages/types/
├── package.json
├── tsconfig.json
└── src/
├── index.ts
├── schemas.ts → Zod схеми
├── database.ts → Supabase типове
└── extension.ts → Extension типове
Минимални типове:

TypeScript

export const ExtensionChatPayloadSchema = z.object({
platform: z.enum(['chatgpt', 'gemini', 'claude', 'deepseek', 'grok', 'perplexity', 'qwen', 'lmarena']),
chatId: z.string(),
title: z.string(),
messages: z.array(MessageSchema),
capturedAt: z.string().datetime(),
});

export type ExtensionChatPayload = z.infer<typeof ExtensionChatPayloadSchema>;
2.2 @brainbox/ui — shadcn/ui + Design Tokens
text

packages/ui/
├── src/
│ ├── components/ → shadcn/ui
│ └── tokens/
│ └── colors.ts → Design tokens
2.3 @brainbox/utils — Logger + Helpers
text

packages/utils/
└── src/
├── logger.ts → Централизиран логер
├── crypto.ts → AES-GCM (browser + Node.js)
└── constants.ts → URLs, rate limits
🚦 Phase 2 Gate
text

✅ packages/types/src/schemas.ts → всички Zod схеми
✅ packages/types → 0 any exports
✅ packages/ui → shadcn/ui компоненти работят
✅ packages/utils/src/logger.ts → browser + Node.js compatible
✅ packages/utils/src/crypto.ts → AES-GCM тестван
✅ pnpm -r build → всички packages build-ват
✅ Web-app импортира от @brainbox/\* (не relative paths)
🟢 PHASE 3 — Extension Core (MVP)
Цел: Extension се инсталира, connect-ва с web-app, и улавя чатове от ChatGPT + Gemini.

3.1 WXT Файлова структура — Extension MVP
text

apps/extension/
├── wxt.config.ts
├── package.json
└── entrypoints/
├── background.ts → Service worker
├── background/
│ ├── authManager.ts → JWT lifecycle + AES-GCM
│ ├── messageRouter.ts → Message dispatcher
│ ├── syncManager.ts → Offline queue + alarms
│ ├── dashboardApi.ts → HTTP клиент
│ └── platformAdapters/
│ ├── base.ts
│ ├── index.ts
│ ├── chatgpt.adapter.ts
│ └── gemini.adapter.ts
├── content/
│ ├── chatgpt.content.ts
│ ├── gemini.content.ts
│ ├── gemini-inject.ts → MAIN world
│ └── dashboard-auth.content.ts
├── popup/
│ ├── index.html
│ ├── main.tsx
│ └── App.tsx
└── lib/
├── config.ts
├── storage.ts
└── logger.ts
3.2 WXT Background Pattern
TypeScript

// entrypoints/background.ts
import { AuthManager } from './background/authManager';
import { MessageRouter } from './background/messageRouter';
import { SyncManager } from './background/syncManager';

export default defineBackground({
type: 'module',
main() {
AuthManager.init();
SyncManager.init();

    browser.contextMenus.create({
      id: 'save-to-brainbox',
      title: 'Save to BrainBox',
      contexts: ['selection', 'page'],
    });

    browser.runtime.onMessage.addListener(MessageRouter.handle);
    browser.alarms.onAlarm.addListener(SyncManager.onAlarm);

},
});
3.3 Auth Bridge (postMessage)
text

Поток:

1. User влиза в web-app (/extension-auth)
2. dashboard-auth.content.ts слуша BRAINBOX_AUTH_TOKEN
3. web-app: window.postMessage({ type: 'BRAINBOX_AUTH_TOKEN', token: jwt })
4. content → browser.runtime.sendMessage → authManager.ts
5. authManager: AES-GCM encrypt → browser.storage.local.set
6. API заявки: decrypt → Authorization: Bearer <jwt>
   3.4 WXT Manifest Generation
   TypeScript

// wxt.config.ts
export default defineConfig({
manifest: ({ browser, manifestVersion }) => ({
name: 'BrainBox',
version: '3.0.0',
permissions: ['storage', 'contextMenus', 'tabs', 'scripting', 'alarms'],
host_permissions: [
'https://chatgpt.com/*',
'https://chat.openai.com/*',
'https://gemini.google.com/*',
...(import.meta.env.DEV ? ['http://localhost:3000/*'] : ['https://brainbox.ai/*']),
],
}),
});
🚦 Phase 3 Gate
text

✅ Extension load unpacked без errors
✅ background.ts service worker регистриран
✅ Context menu "Save to BrainBox" работи
✅ Auth bridge: login в web-app → токен в extension
✅ ChatGPT: content script capture работи
✅ Gemini: inject script работи в MAIN world
✅ Captured chat → /api/chats/extension
✅ 0 console.log (само logger)
✅ AES-GCM: JWT криптиран в storage
✅ wxt build → .output/ без errors
🔵 PHASE 4 — Extension Advanced
Цел: Claude адаптер, offline queue, robust selectors.

4.1 Claude Adapter
text

entrypoints/background/platformAdapters/claude.adapter.ts
entrypoints/content/claude.content.ts
WXT Content Script:

TypeScript

// entrypoints/content/claude.content.ts
export default defineContentScript({
matches: ['https://claude.ai/*'],
runAt: 'document_idle',
main() {
// Claude capture logic
},
});
4.2 Offline Queue (SyncManager)
TypeScript

interface SyncItem {
id: string;
payload: ExtensionChatPayload;
attempts: number;
createdAt: number;
lastAttempt: number | null;
}

// Queue в browser.storage.local
// browser.alarms за retry
// Exponential backoff: 5min → 10min → 20min (max 3)
🚦 Phase 4 Gate
text

✅ Claude adapter работи
✅ Offline queue: спрян web-app → локално записване
✅ Рестарт → автоматична синхронизация
✅ browser.alarms вместо setInterval
✅ Duplicate detection работи
✅ 3 платформи (ChatGPT + Gemini + Claude)
✅ @brainbox/types → SyncItem типизиран
🟣 PHASE 5 — Integration
Цел: Web-app и Extension работят заедно end-to-end.

5.1 /api/chats/extension — Endpoint
TypeScript

// apps/web-app/app/api/chats/extension/route.ts
// Rate limit: 30 RPM
// Auth: Bearer JWT validation
// Body: ExtensionChatPayloadSchema validation
// Action: INSERT в Supabase (RLS)
// Response: { success: true, chatId: string }
5.2 Extension Auth Bridge — Финализиране
text

entrypoints/content/dashboard-auth.content.ts
apps/web-app/app/(app)/extension-auth/page.tsx
5.3 CapturesView.tsx — Live feed
text

apps/web-app/components/prompts/CapturesView.tsx
Source: useExtensionStore → Supabase Realtime
🚦 Phase 5 Gate
text

✅ Extension capture → API → Supabase → CapturesView
✅ Auth bridge работи от Settings
✅ Extension popup: connected status + email
✅ Rate limiting: <30 RPM
✅ Zod validation: невалиден payload → 400
✅ RLS: user вижда само своите captures
✅ E2E: ChatGPT → capture → Library
⚪ PHASE 6 — Polish & UX
Цел: Extension popup визуално съответства на web-app.

6.1 Glassmorphism Popup
text

entrypoints/popup/
├── main.tsx
├── App.tsx
├── components/
│ ├── StatusBar.tsx
│ ├── QuickCapture.tsx
│ ├── RecentCaptures.tsx
│ └── PlatformBadge.tsx
└── styles/
└── popup.css

Визуал:

- Glass panels (CSS токени)
- Inter typography
- Subtle animations
- 380x500px
- NO full NeuralField (performance)
  🚦 Phase 6 Gate
  text

✅ Popup 380x500px без overflow
✅ Glass panels consistent с web-app
✅ Platform badges правилни цветове
✅ Context menu работи
✅ Connected status visible
✅ 0 console errors при popup open
🏁 PHASE 7 — Production Ready
Цел: Chrome Web Store submission ready.

7.1 WXT Production Build
TypeScript

// wxt.config.ts
export default defineConfig({
runner: {
disabled: process.env.NODE_ENV === 'production',
},
manifest: ({ browser }) => ({
// Само production URLs
host_permissions: [
'https://chatgpt.com/*',
'https://gemini.google.com/*',
'https://claude.ai/*',
'https://brainbox.ai/*',
],
}),
});
7.2 Production Checklist
text

Manifest:
☐ version bump (SemVer)
☐ description ясна
☐ icons всички размери (16/32/48/128)
☐ 0 localhost URLs
☐ permissions минимални

Code:
☐ 0 console.log
☐ 0 hardcoded localhost
☐ AES-GCM за storage
☐ source maps: false

Performance:
☐ Popup bundle < 150KB gzipped
☐ Content script < 50KB gzipped
☐ Service worker < 100KB gzipped

Web App:
☐ Lighthouse > 90
☐ LCP < 2.5s
☐ 0 console.log
☐ Error boundaries
☐ Loading skeletons

CI:
☐ pnpm typecheck → 0 errors
☐ pnpm lint → 0 errors
☐ pnpm test → all passing, ≥85% coverage
☐ pnpm build → успешен build
🚦 Phase 7 Gate
text

✅ Chrome Web Store manifest validation passes
✅ Extension review guidelines: no violations
✅ 0 any types
✅ 0 localStorage директни calls
✅ 0 console.log
✅ Тестове ≥85% coverage
✅ Production build без warnings
✅ Lighthouse ≥90
✅ Extension popup load <500ms
🔒 Absolute Prohibitions
text

1. Extension НЕ пише директно в Supabase
2. Background worker в entrypoints/background.ts (WXT pattern)
3. JWT НЕ в plain text (задължително AES-GCM)
4. any тип забранен
5. console.log забранен в production
6. Supabase service role key НЕ в client/Extension
7. Бизнес логика НЕ в UI компоненти
8. Supabase заявки НЕ в Zustand (само actions/)
9. Extension НЕ инжектира UI в AI платформи
10. getSession() НЕ се ползва (само getUser())
    📊 WXT vs CRXJS Comparison
    Аспект CRXJS WXT
    Vite 8 Support ⚠️ Beta, warnings ✅ Native support
    HMR ✅ Works ✅ Works (all scripts)
    Manifest Gen ❌ Manual ✅ Auto via config
    Type Safety ⚠️ Partial ✅ Full
    Dev/Prod Split ❌ Manual stripCSP ✅ Built-in
    Maintenance ⚠️ Beta ✅ Active
    Entrypoints src/ structure entrypoints/ pattern
    Browser API chrome._ browser._ (cross)
    Production Ready ⚠️ Requires hacking ✅ Production-ready
