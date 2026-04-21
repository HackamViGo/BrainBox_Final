---
name: extension-mv3
description: "Load when working on any extension code — service-worker.ts, content scripts, manifest, crypto, sync queue. ALSO load if agent mentions background.ts, background/index.ts, or injecting UI into AI platforms."
---

## ⛔ HARD STOPS — Read first

```
❌ NEVER create background.ts or src/background/index.ts
   MV3 has NO background pages — use service-worker.ts ONLY

❌ NEVER inject UI, buttons, overlays into AI platform DOM
   Content scripts are READ-ONLY (extract data only)
   The ONLY write allowed: injectText() into existing textarea
   See extension-bridge skill

❌ NEVER setInterval() in service worker
   Service workers are killed after ~30s inactivity
   Use chrome.alarms API instead

❌ NEVER store token as plaintext
   Always AES-GCM encrypt before chrome.storage.local.set()

❌ NEVER fetch supabase.co directly from extension
   All API calls go through Dashboard HTTP API
   POST /api/chats/extension, /api/prompts, /api/chunks

❌ NEVER open /extension-auth on 'update' in onInstalled
   ONLY on 'install' AND only if no token exists
```

## Rules

- Manifest V3 only — service workers only (no background pages)
- Extension never writes to Supabase directly — always via Dashboard HTTP API
- JWT stored AES-GCM encrypted in `chrome.storage.local` — never plaintext
- `DEBUG_MODE=false` in `.env.production`
- **Vite `^6.2.x`** for extension build — NOT Vite 8 (CRXJS not stable with 8)
- Service worker is coordinator only — no business logic inline
- Context menus registered ONLY in `onInstalled` — not at every SW event
- Extension is built LAST (Phase 8) — after web app is complete and approved

## File: service-worker.ts (not background.ts)

```typescript
// apps/extension/src/service-worker.ts ← CORRECT filename
// Coordinator only — all logic in separate modules

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenus(); // context-menu-manager.ts
  setupInstallation(); // installation-manager.ts
  syncManager.init(); // sync-manager.ts (uses chrome.alarms)
});

chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  messageRouter.route(message, sender, sendResponse);
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "brainbox_sync_retry") syncManager.flush();
});
```

## Offline Sync Queue (chrome.alarms, not setInterval)

```typescript
// sync-manager.ts
let isFlushing = false; // mutex

async function flush(): Promise<void> {
  if (isFlushing) return;
  isFlushing = true;
  try {
    // process queue...
  } finally {
    isFlushing = false;
  }
}

function init(): void {
  // chrome.alarms survives service worker restarts — setInterval does NOT
  chrome.alarms.create("brainbox_sync_retry", { periodInMinutes: 2 });
}
```

## AES-GCM Token Storage

```typescript
// crypto.ts
async function getKey(): Promise<CryptoKey> {
  const seed = new TextEncoder().encode(chrome.runtime.id);
  const base = await crypto.subtle.importKey("raw", seed, "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: seed, iterations: 100_000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptToken(token: string): Promise<string> {
  /* ... */
}
export async function decryptToken(encrypted: string): Promise<string | null> {
  /* ... */
}
```

## Content Script Rules

Content scripts (`src/content/index.ts`) do:

- ✅ Listen for chrome.runtime.onMessage
- ✅ Extract conversation text from DOM (read-only)
- ✅ Find textarea element and inject text (via prompt-inject.ts)
- ✅ Listen for postMessage on /extension-auth page (content-dashboard-auth.ts)

Content scripts do NOT:

- ❌ Inject buttons, overlays, or any UI elements
- ❌ Modify page styling
- ❌ Call external APIs directly
- ❌ Store auth tokens

## Rate Limits (Token Bucket)

| Platform      | RPM |
| ------------- | --- |
| ChatGPT       | 60  |
| Claude        | 30  |
| Gemini        | 20  |
| DeepSeek      | 40  |
| Perplexity    | 30  |
| Dashboard API | 30  |

## ⚠️ CRXJS Status (April 2026)

CRXJS v2 is in maintenance. Use Vite ^6.2.x (NOT 8).
If CRXJS is archived: evaluate `wxt` (https://wxt.dev) as replacement.

## Anti-patterns

```
❌ background.ts or src/background/index.ts — use service-worker.ts
❌ chrome.storage.local.set({ token: jwtString })  — use encryptToken()
❌ fetch('https://supabase.co/...') — via Dashboard API only
❌ setInterval() in service worker — use chrome.alarms
❌ eval() or new Function() — MV3 forbidden
❌ DOM injection of UI elements — read-only content scripts
❌ Using Vite 8 with CRXJS
❌ Context menus outside onInstalled
```
