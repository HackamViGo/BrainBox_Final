---
name: platform-adapters
description: "DOM Selectors for AI Platforms."
---

## Selectors (Current 2026)
- **ChatGPT:** `[data-message-author-role]`
- **Claude:** `.font-claude-message` (Verify via context7)
- **Gemini:** `message-content`

## SPA Navigation
Use `MutationObserver` to detect URL changes in ChatGPT/Claude without page reload.
