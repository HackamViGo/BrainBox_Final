---
name: extension-mv3
description: "Chrome Extension Manifest V3 specifics: Service Worker lifecycle, chrome.* APIs, and alarms. BrainBox uses WXT for build — these are the MV3 runtime rules."
---

# Chrome Extension MV3 Runtime Rules

> **Build system:** BrainBox uses **WXT** (ADR-016). These rules cover MV3 **runtime** behavior.
> WXT compiles `entrypoints/background.ts` to a proper Service Worker automatically.

## Service Worker Lifecycle

Service workers in MV3 are **ephemeral** — they terminate after ~30 seconds of inactivity.

```typescript
// ✅ Use chrome.alarms for background tasks
export default defineBackground(() => {
  chrome.alarms.create("sync-heartbeat", { periodInMinutes: 5 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "sync-heartbeat") {
      // periodic work here
    }
  });
});

// ❌ NEVER — dies when SW terminates
setInterval(doWork, 60_000);
```

## Storage Rules

| API                      | Use Case                                           |
| ------------------------ | -------------------------------------------------- |
| `chrome.storage.local`   | All persistent extension data (tokens, settings)   |
| `chrome.storage.session` | Volatile session data (cleared on browser restart) |
| `chrome.storage.sync`    | Small user preferences synced across devices       |
| `localStorage`           | ❌ FORBIDDEN — not accessible in Service Workers   |

## Context Menu API

```typescript
// Set up on install — context menus persist across SW restarts
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "brainbox-capture",
    title: "Save to BrainBox",
    contexts: ["selection"],
  });
});
```

## Async Message Handling

```typescript
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "ASYNC_OP") {
    doAsyncWork(message.payload)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // ← CRITICAL: keeps channel open for async response
  }
});
```

## Content Script Rules (BrainBox ONLY)

- **`world: 'ISOLATED'`** — default, isolated from page JS.
- **READ-ONLY DOM** — the ONLY allowed write is textarea value injection via native setter.
- **NO** buttons, overlays, floating UI, or sidebars injected into AI platforms.

```typescript
// ✅ Only allowed DOM mutation
const nativeSetter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype,
  "value",
)?.set;
nativeSetter?.call(textarea, text);
textarea.dispatchEvent(new Event("input", { bubbles: true }));
```

## Permissions (configured in wxt.config.ts)

```typescript
manifest: {
  permissions: ['storage', 'contextMenus', 'tabs', 'alarms', 'activeTab', 'scripting', 'webNavigation'],
  host_permissions: ['https://gemini.google.com/*', 'https://chatgpt.com/*', 'https://claude.ai/*'],
}
```

> **Never add unnecessary permissions** — Chrome Web Store reviewers reject over-permissioned extensions.
