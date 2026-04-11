---
name: typescript
description: "Strict typing and Zod schemas."
---

## Rules
- `strict: true`
- `noImplicitAny: true`
- `exactOptionalPropertyTypes: false` (Required for Zustand/Shadcn compatibility).
- **Zero `any` policy.**

## Patterns
- Use `satisfies` for object literals.
- Use Zod for all external data (API responses, Storage).
