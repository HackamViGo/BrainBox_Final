# Extension Agent Rules

**Location:** apps/extension/AGENTS.md

## Identity

Module: Chrome Extension (MV3)
Role: Passive Observer — captures AI chats, syncs to web-app API.
Never: Direct Supabase, UI injection, business logic.

## File Rules

| File                | Rule                                              |
| ------------------- | ------------------------------------------------- |
| `service-worker.ts` | Координация само. No business logic.              |
| `authManager.ts`    | AES-GCM encrypt/decrypt. Never plain text JWT.    |
| `syncManager.ts`    | Queue management only. No HTTP calls directly.    |
| `dashboardApi.ts`   | HTTP calls only. No DOM, no platform logic.       |
| `platformAdapters/` | Normalize only. No network. No storage.           |
| `content-*.ts`      | Read DOM only. One allowed write: textarea value. |

## Manifest Rules

- `service_worker` path: `src/background/service-worker.ts`
- New platform: new content script + new adapter + manifest update
- Production build: stripDevCSP removes all localhost URLs

## Vite 8 Rules

- Use `build.rolldownOptions` (not `rollupOptions`)
- Use `optimizeDeps.rolldownOptions` (not `rollupOptions`)
- Use `@vitejs/plugin-react-oxc` (not babel plugin)
- CRXJS deprecation warnings: acceptable until WXT migration

## Platform Adapter Pattern

```typescript
// All adapters MUST follow this pattern
class XAdapter extends BaseAdapter {
  getPlatformId(): Platform {
    return "x";
  }
  async extract(): Promise<ExtensionChatPayload> {
    // 1. Get chatId from URL (source fingerprint)
    // 2. Check for duplicates before proceeding
    // 3. Extract messages (primary selector → fallback selectors)
    // 4. Return validated ExtensionChatPayload (from @brainbox/types)
  }
}
```

## Debugging

- `DEBUG_MODE = false` in production (enforced)
- Use `logger` from `@brainbox/utils` always
- chrome.storage.local inspection: chrome://extensions → SW → Inspect
