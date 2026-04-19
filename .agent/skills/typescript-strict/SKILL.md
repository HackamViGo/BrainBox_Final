---
name: typescript-strict
description: "TypeScript strict mode enforcement and 'any' type prohibition."
---

# TypeScript Strict Standards

## 1. Zero 'any' Policy

- **NO `any` types allowed.**
- If a type is truly unknown, use `unknown` and a type guard/assertion.
- All legacy `any` types identified in audits must be refactored into interfaces or Zod-backed types.

## 2. Configuration (`tsconfig.json`)

- `strict: true` is mandatory.
- `noImplicitAny: true`
- `strictNullChecks: true`
- `exactOptionalPropertyTypes: false` (Required for BrainBox compatibility with shadcn/Zustand).

## 3. Type Safety Patterns

```typescript
// Type Guard
function isItem(obj: unknown): obj is Item {
  return (obj as Item).id !== undefined;
}

// Utility Types
type PartialItem = Partial<Item>;
type ItemId = Item["id"];
```
