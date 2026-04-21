---
name: brainbox-extension
description: "Vite 8, CRXJS, React 19.2, MV3 Service Worker, Extension Bridge, Context Menus, API Sync, and Platform Adapters."
---

# BrainBox Extension Architecture (MV3)

## Tech Stack (2026 Core)

- **Vite 8.x:** Rolldown-powered build system with Oxc parser.
- **CRXJS 2.4+:** Native support for Vite 8.
- **React 19.2:** Use `<Activity>` for popup screen management (preserving state while hidden).
- **Service Worker:** Native MV3 background worker for context menus and storage orchestration.

## Vite Configuration

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // NOT plugin-react-swc (stability for Rolldown)
import { crx } from "@crxjs/vite-plugin";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    target: "chrome120", // Align with MV3 support in 2026
    minify: "lightningcss",
  },
});
```

## Extension Bridge & Runtime Principles

- **Passive Observer:** The BrainBox extension acts as a passive observer. Direct Supabase calls are forbidden (use Dashboard API).
- **DOM Injection:** No floating buttons or overlay injections allowed into foreign origins. The ONLY allowed DOM interaction is injecting a prompt template into the active `textarea` or `[contenteditable]` of an AI site.
- **Storage:** Use ONLY `chrome.storage.local`. `localStorage` is completely forbidden in MV3 contexts.
- **`useEffectEvent`:** Essential for Chrome Event Listeners. Ensures callback has latest state without dependency re-runs.
- **Strict CSP:** No external `@import` in CSS. All styles must be bundled locally.
- **React Server Components (RSC):** Only standard CSR is supported in the extension build.

## Context Menus Actions

- `capture-chat`: Detects structural message patterns via Platform Adapters and saves the active conversation.
- `capture-selection`: Captures highlighted text and mapping metadata.
- `refine-with-gemini`: Sends captured snippet to Dashboard's AI pipeline.
- `inject-brainbox-prompt`: Injects predefined prompt templates.

## Sync & Communication

- **Dashboard API:** Sync to `/api/chats/extension` using HTTP/fetch with a Bearer JWT.
- **Auth Flow:** JWT is retrieved from Dashboard (via Popup) and stored in `chrome.storage.local`.
- **Batching:** Sync captures every 30 seconds or immediately if the user selects "Sync Now" in the Popup.

## Platform Adapters (DOM Analysis)

### Supported AI Platforms (April 2026)

- **ChatGPT:** `[data-message-author-role]` attributes and structural list items.
- **Claude:** Specific CSS classes like `font-claude-message` or data-attributes identified via `context7`.
- **Gemini:** `message-content` tags and user-prompt wrappers.

### Structural Analysis & SPAs

- Adapters must use pattern matching to extract conversation threads without persistent DOM markers.
- Most AI platforms are SPAs. URL changes do not trigger page reloads.
- **`webNavigation` API:** Listener in the Service Worker to detect `onHistoryStateUpdated`.
- **`MutationObserver`:** Secondary fallback to detect internal view transitions.
- **Re-initialization:** Content scripts must re-bind context menus upon detecting a navigation event. Always verify UI selectors against current states using Context7.
