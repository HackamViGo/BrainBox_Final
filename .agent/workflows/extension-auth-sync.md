---
description:
---

---

## description: Auth Criteries

# Workflow: Extension Auth & Sync

Manage local storage and sync to Dashboard.

## Steps

1. **Auth from Dashboard**:
   - Popup opens `dashboard.brainbox.ai/auth/extension`.
   - On success, dashboard sends JWT back to extension via `chrome.runtime.sendMessage`.
2. **Store JWT**: Encrypt and save to `chrome.storage.local`.
3. **Capture Logic**:
   - On context menu click, capture data locally.
   - Show "Captured" notification if possible.
4. **Sync Loop**:
   - Background script checks `chrome.storage.local` every 30s.
   - Batch upload to `/api/chats/extension` using HTTP POST.
   - Use Bearer JWT in headers.

## Criteria

- [ ] NO localStorage usage.
- [ ] Secure JWT handling.
- [ ] Sync failures handled with retries.
