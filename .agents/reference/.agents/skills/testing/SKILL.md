---
name: testing
description: "Vitest and Playwright."
---

## Coverage
- Target: 85% Lines, 80% Branches.
- `pnpm check:coverage` fails CI if below.

## Mocks
- Use `useEffectEvent` mocks for Chrome APIs in Vitest.
