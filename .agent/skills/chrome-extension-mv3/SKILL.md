---
name: chrome-extension-mv3
description: "Chrome Extension MV3 architectural patterns, service workers, and secure storage."
---

# Chrome Extension MV3 Standards

## 1. Service Worker (Background)

- **File Naming**: Must be `service-worker.ts` (mapped to `background.service_worker` in `manifest.json`).
- **No Persistence**: Assume the worker can terminate at any point. Do NOT use global variables for state.
- **Alarms**: Use `chrome.alarms` instead of `setInterval` or `setTimeout` for background tasks.

## 2. Manifest Schema

```json
{
  "manifest_version": 3,
  "action": { "default_popup": "index.html" },
  "background": {
    "service_worker": "src/background/service-worker.ts",
    "type": "module"
  },
  "permissions": ["storage", "contextMenus", "alarms", "tabs"]
}
```

## 3. Storage Rules

- **chrome.storage.local**: Primary persistent storage.
- **chrome.storage.session**: Use for sensitive session data that shouldn't persist on disk (browser-restart volatile).
- **Prohibited**: `localStorage` and `sessionStorage` are NOT accessible in service workers. Use `chrome.storage` API only.

## 4. Content Scripts

- **Isolation**: Use `world: 'ISOLATED'` for standard scripts.
- **UI Injections**: No raw DOM injections. Use Shadow DOM if UI elements are required (not allowed in BrainBox per GEMINI.md).
