# BrainBox v2 — Master Agent Prompt (Updated 2026-04-11)

## 0. Context
- **Dashboard UI:** Finished (Next.js 16.2, React 19.2).
- **Extension:** To be built (Vite 8.x, MV3).
- **Architecture:** Passive observer, Context Menus only, No DOM injection.

## 1. Tech Stack (Source of Truth)
| Package | Version | Note |
|---|---|---|
| Next.js | 16.2 | Async params/cookies/headers mandatory |
| React | 19.2 | Activity, useEffectEvent |
| Vite | 8.x | Rolldown + Oxc |
| Tailwind | 4.x | CSS-first |
| Zustand | 5.x | useShallow |

## 2. Phase Plan
- **Phase 4:** Extension Architecture (Vite 8, MV3).
- **Phase 5:** Dashboard API Layer (Connect Extension).
- **Phase 6:** Dashboard State Layer (Sync logic).
- **Phase 8:** Full Testing Suite (E2E).

## 3. Critical Rules
- **No localStorage** in Extension (Use chrome.storage.local).
- **No DOM injection** in AI sites (Use chrome.contextMenus).
- **Async params** in Next.js 16.2 (await params).
- **useEffectEvent** for Chrome listeners.

## 4. Logging
Always run `node scripts/update-log.js` before and after tasks.
