---
name: zod-validation
description: "Zod schemas for API validation, database integrity, and form handling."
---

# Zod Validation Standards

## 1. Schema Location

- Shared schemas go to `packages/types/src/schemas.ts`.

## 2. API Validation

Always validate incoming request bodies in API routes and Server Actions.

```typescript
import { FolderSchema } from "@brainbox/types";

export async function POST(req: Request) {
  const json = await req.json();
  const result = FolderSchema.safeParse(json);

  if (!result.success) {
    return Response.json(result.error, { status: 400 });
  }
  // ...
}
```

## 3. Database Sync

User Zod to infer TypeScript types to ensure the code and validation are always in sync.

```typescript
export type Folder = z.infer<typeof FolderSchema>;
```
