---
name: monorepo
description: "Workspace boundaries and Turborepo."
---

## Boundaries
- `apps/extension` ↛ `apps/web-app` (Forbidden)
- `packages/*` ↛ `apps/*` (Forbidden)
- Shared logic must live in `packages/`.

## Pipeline
- `pnpm verify`: Runs boundaries check, lint, type-check, and tests.
- `turbo build`: Uses remote caching if configured.
