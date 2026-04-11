---
name: extension-mv3
description: "Vite 8, CRXJS, and MV3 Service Worker."
---

## Tech Stack
- **Vite 8.x:** Rolldown + Oxc.
- **React 19.2:** Use `<Activity>` for popup screens.
- **Storage:** `chrome.storage.local` (Async).

## Vite Config
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'

export default defineConfig({
  plugins: [react(), crx({ manifest })]
})
```

## Forbidden
- `localStorage` (Use `chrome.storage.local`).
- External `@import` in CSS.
