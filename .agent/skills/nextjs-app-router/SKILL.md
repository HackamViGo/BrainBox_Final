---
name: nextjs-app-router
description: "Next.js 16.2 App Router best practices, Server Actions, and Async Patterns."
---

# Next.js 16.2 App Router Standards

## 1. Async Params & Headers

In Next.js 16, `params`, `searchParams`, `cookies()`, and `headers()` are asynchronous.

```typescript
// ✅ Correct
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
}
```

## 2. Server Actions (Mutations)

All data mutations MUST happen via Server Actions in `apps/web-app/actions/`.

```typescript
"use server";
export async function createItem(formData: FormData) {
  // validation -> supabase -> revalidatePath
}
```

## 3. proxy.ts (NOT middleware.ts)

BrainBox uses `apps/web-app/proxy.ts` for session management and route protection.

## 4. RSC vs Client Components

- Default to **Server Components**.
- Use `'use client'` ONLY when: `useState`, `useEffect`, Browser APIs (canvas, window), or Event Handlers are needed.
- **BrainBox Special**: `NeuralField` and `AmbientLight` are ALWAYS client components.
