---
name: extension-bridge
description: "Communication bridge between BrainBox Chrome Extension and Web Dashboard. Auth handshake, message protocol, and sync patterns."
---

# Extension ↔ Dashboard Bridge

Describes how the BrainBox extension communicates with the Next.js Dashboard (`apps/web-app`).

> **Note:** The extension uses WXT. Background logic lives in `entrypoints/background.ts` (ADR-016).

## Auth Handshake Flow

```
Dashboard (/extension-auth page)
  → postMessage('BRAINBOX_AUTH_HANDSHAKE', { token, user })
  → Content Script listens
  → chrome.runtime.sendMessage('SET_AUTH', { token, user })
  → Background stores in chrome.storage.local (AES-GCM encrypted)
```

### content script side

```typescript
window.addEventListener("message", (event) => {
  if (event.data?.type === "BRAINBOX_AUTH_HANDSHAKE") {
    const { token, user } = event.data.payload;
    if (token) {
      chrome.runtime.sendMessage({
        type: "SET_AUTH",
        payload: { token, user },
      });
    }
  }
});
```

### background side (defineBackground)

```typescript
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SET_AUTH") {
    // Encrypt before store — see aes-gcm-crypto skill
    chrome.storage.local.set({ auth: message.payload });
    sendResponse({ success: true });
  }
  return true;
});
```

## Sync Protocol (Extension → Dashboard API)

All data sync goes via `POST /api/chats/extension` — NEVER directly to Supabase.

```typescript
async function syncToDashboard(data: unknown): Promise<{ success: boolean }> {
  const { auth } = await chrome.storage.local.get("auth");
  if (!auth?.token) return { success: false, error: "Unauthorized" };

  const response = await fetch(`${DASHBOARD_URL}/api/chats/extension`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(data),
  });

  return response.ok ? { success: true } : { success: false };
}
```

## Message Types

| Type                      | Direction      | Description                   |
| ------------------------- | -------------- | ----------------------------- |
| `PING`                    | Popup → BG     | Health check                  |
| `SET_AUTH`                | CS → BG        | Store JWT from auth handshake |
| `SYNC_CHAT`               | CS/Popup → BG  | Trigger sync to Dashboard     |
| `EXTRACT_CHAT`            | BG → CS        | Request chat data extraction  |
| `INJECT_TEXT`             | BG → CS        | Inject text into textarea     |
| `BRAINBOX_AUTH_HANDSHAKE` | Dashboard → CS | window.postMessage auth       |

## Security Rules

- **AES-GCM encryption** on JWT before `chrome.storage.local.set`.
- **Origin check**: content script listeners verify `event.origin`.
- **No Supabase keys** in extension code — only Dashboard API Bearer tokens.
