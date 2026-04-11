---
name: security
description: "Auth, JWT, and Rate Limiting."
---

## Extension Security
- **JWT Storage:** Encrypted via AES-GCM in `chrome.storage.local`.
- **No Direct DB:** Extension must never call Supabase directly.
- **Origin Check:** API must verify `chrome-extension://` origin.

## Dashboard Security
- **Server-side Auth:** Always use `auth.getUser()` in Route Handlers.
- **Rate Limiting:** Upstash Redis for `/api/ai/*` and `/api/chats/extension`.
- **DOMPurify:** Mandatory for rendering any AI-generated HTML.
