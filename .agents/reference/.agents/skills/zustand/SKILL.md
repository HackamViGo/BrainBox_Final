---
name: zustand
description: "State management with optimistic updates."
---

## Pattern
1. Snapshot current state.
2. Update state optimistically.
3. Call API.
4. Rollback on error.

## useShallow
Always use `useShallow` for multi-field selectors to prevent re-renders.
