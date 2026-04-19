---
name: wxt-extension
description: |
  Build next-gen cross-browser web extensions with WXT. Covers file-based entrypoints, automated manifest generation, superior HMR, and React 19.2 integration.
  Use when: migrating from CRXJS/Vite, setting up manifest-v3 (MV3), adding new background/content scripts, or configuring Vite 8 + Rolldown for extensions.
---

# WXT Extension (Web Extension Framework)

WXT is the "Next.js for Extensions". It replaces manual `manifest.json` and fragmented Vite configs with a centralized, file-based entrypoint system. **This is the active extension framework for BrainBox** (ADR-016, replaced CRXJS).

## 📍 BrainBox Extension Location

```
apps/extension/
├── entrypoints/
│   ├── background.ts        # Service Worker (defineBackground)
│   ├── content/             # Content Scripts
│   │   ├── index.ts         # defineContentScript
│   │   └── style.css
│   └── popup/
│       ├── index.html       # WXT popup template
│       └── main.tsx         # ReactDOM.createRoot entry
├── src/
│   ├── content/adapters/    # Platform adapters (ChatGPT, Gemini...)
│   ├── hooks/               # useStorage etc.
│   ├── store/               # useExtensionStore (Zustand)
│   └── utils/storage.ts     # chrome.storage.local wrapper
├── wxt.config.ts            # WXT config (replaces vite.config.ts + manifest.json)
└── package.json
```

## 📋 Core Principles

1. **File-based Entrypoints**: Every file in `entrypoints/` is auto-registered.
   - `entrypoints/background.ts` → Service Worker
   - `entrypoints/content/index.ts` → Content Script
   - `entrypoints/popup/index.html` → Popup
2. **No manual manifest**: Configure metadata in `wxt.config.ts`. WXT generates `manifest.json` on build.
3. **`wxt prepare`**: Run after `pnpm install` to generate `.wxt/` TypeScript types.
4. **`@wxt-dev/module-react`**: Use instead of `@vitejs/plugin-react` — compatible with Vite 8 + Oxc.

## 🛠️ Configuration (wxt.config.ts)

```typescript
import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "BrainBox",
    version: "2.0.0",
    description: "Premium AI conversation organizer.",
    permissions: [
      "storage",
      "contextMenus",
      "tabs",
      "alarms",
      "activeTab",
      "scripting",
      "webNavigation",
    ],
    host_permissions: [
      "https://gemini.google.com/*",
      "https://chatgpt.com/*",
      "https://claude.ai/*",
      "https://*.brainbox.ai/*",
      "http://localhost:3000/*",
    ],
  },
  vite: () => ({
    build: {
      minify: "lightningcss",
      target: "chrome120",
    },
  }),
});
```

## 📜 Entrypoint Patterns

### Background (Service Worker)

```typescript
// entrypoints/background.ts
export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "brainbox-capture",
      title: "Save to BrainBox",
      contexts: ["selection"],
    });
  });

  // Use chrome.alarms — NEVER setInterval
  chrome.alarms.create("heartbeat", { periodInMinutes: 1 });
});
```

### Content Script

```typescript
// entrypoints/content/index.ts
export default defineContentScript({
  matches: [
    "https://chatgpt.com/*",
    "https://gemini.google.com/*",
    "https://claude.ai/*",
  ],
  runAt: "document_start",
  main() {
    // READ-ONLY DOM. Only textarea injection allowed.
    // NO buttons, overlays, or sidebars.
  },
});
```

### Popup

```typescript
// entrypoints/popup/main.tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "dev": "wxt",
    "build": "wxt build",
    "zip": "wxt zip",
    "prepare": "wxt prepare",
    "postinstall": "wxt prepare",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

## ⚙️ TypeScript Config

```json
{
  "extends": "../../packages/config/tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["chrome"],
    "paths": {
      "@/*": ["./src/*"],
      "@brainbox/types": ["../../packages/types/src/index.ts"],
      "@brainbox/utils": ["../../packages/utils/src/index.ts"]
    }
  },
  "include": ["src", "entrypoints", ".wxt/types.d.ts"]
}
```

## 🔄 Migration from CRXJS (Checklist)

1. **Remove**: `@crxjs/vite-plugin`, `@vitejs/plugin-react`, `vite-tsconfig-paths`
2. **Delete**: `vite.config.ts`, `manifest.json`, root `index.html`
3. **Add**: `wxt`, `@wxt-dev/module-react`
4. **Add `postinstall`** script: `"postinstall": "wxt prepare"`
5. **Move** background logic → `entrypoints/background.ts` with `defineBackground()`
6. **Move** content script → `entrypoints/content/index.ts` with `defineContentScript()`
7. **Create** `entrypoints/popup/index.html` + `main.tsx`
8. **Create** `wxt.config.ts` with permissions from old `manifest.json`
9. **Update** `tsconfig.json` include: add `.wxt/types.d.ts`

## ⚠️ Critical Rules (BrainBox)

- **No manual `manifest.json` edits** — WXT overwrites it on every build.
- **`defineBackground()`** — wraps ALL service worker logic. No top-level code.
- **`chrome.alarms`** — NEVER `setInterval` or `setTimeout` for background tasks.
- **READ-ONLY content scripts** — NO DOM injection. Textarea value only.
- **`chrome.storage.local`** — NEVER `localStorage` in extension context.
- **No direct Supabase** — only via Dashboard API (`/api/chats/extension`).
- **Encrypt JWT** — AES-GCM before storing in `chrome.storage.local` (see `aes-gcm-crypto` skill).

## 🏗️ CI/CD

```yaml
# extension-build.yml
- name: Build Extension
  run: pnpm --filter extension build
  # Outputs: apps/extension/.output/chrome-mv3/

- name: Validate Manifest
  run: |
    jq '.manifest_version' apps/extension/.output/chrome-mv3/manifest.json | grep -q "3"
```

## 📋 WXT vs CRXJS Comparison

| Feature       | CRXJS (old)                    | WXT (new)                 |
| ------------- | ------------------------------ | ------------------------- |
| Manifest      | Manual JSON                    | Auto-generated            |
| Entrypoints   | Manual config                  | File-based                |
| HMR           | Broken on Vite 8               | Works out-of-box          |
| React Plugin  | `@vitejs/plugin-react` (babel) | `@wxt-dev/module-react`   |
| Types         | `@types/chrome` manual         | `wxt prepare` auto        |
| Cross-browser | Chrome only config             | Chrome + Firefox + Safari |
| Status        | Beta, unmaintained             | Production stable         |
