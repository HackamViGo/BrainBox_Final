---
description:
---

---

## description: Follow this for adding a new AI platform adapter to the extension.

# Workflow: Extension Platform Adapter Setup

Follow this for adding a new AI platform adapter to the extension.

## Steps

1. **Identify Selectors**: Use `context7` to find the latest DOM selectors for the platform.
2. **Create Adapter**: Add file to `apps/extension/src/content/adapters/[platform].ts`.
3. **Implement Passive Detection**:
   - Use structural patterns to extract messages.
   - **Forbidden**: Do not inject buttons or markers into the platform's messages.
4. **Register Adapter**: Add to the main content script observer loop.
5. **Test SPA Navigation**:
   - Verify that switching chats within the platform triggers a re-scan.
   - Use `webNavigation` in the Service Worker to re-trigger the adapter.

## Criteria

- [ ] No DOM injection except template injection into textareas.
- [ ] Works without page reload (SPA support).
- [ ] 0 TypeScript errors.
