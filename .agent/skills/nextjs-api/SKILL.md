---
name: nextjs-api
description: "Load when writing API routes, Server Components, Client Components, or proxy.ts. Next.js 16.2 App Router. ALSO load if agent mentions middleware.ts — it must be proxy.ts."
---

## ⛔ HARD STOP — Next.js 16 renamed middleware.ts to proxy.ts

```
❌ middleware.ts — DEPRECATED in Next.js 16
✅ proxy.ts — CORRECT for Next.js 16

If middleware.ts exists: run npx @next/codemod@latest middleware-to-proxy .
The exported function is also renamed: middleware() → proxy()
```

## Rules

- Server Components by default — `'use client'` only for interactivity/hooks
- Auth check is FIRST in every API route
- `user_id` server-side only from `auth.getUser()` — never from request body
- Error responses always `{ error: string }` — never expose DB errors
- `<Suspense>` + Skeleton for every async boundary
- Next.js 16.2 requires React 19 and Node ≥ 22
- **`getUser()` not `getSession()`** — getSession reads unverified cookie data

## proxy.ts (Session Refresh)

```typescript
// apps/web-app/proxy.ts ← CORRECT filename
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  await supabase.auth.getUser();
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
```

## API Route Template

```typescript
// src/app/api/chats/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createChatSchema } from "@brainbox/validation";
import { crudRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request): Promise<NextResponse> {
  // 1. AUTH — always first
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. RATE LIMIT
  const { success } = await crudRateLimit.limit(user.id);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // 3. PARSE + VALIDATE
  const body: unknown = await request.json();
  const result = createChatSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 },
    );
  }

  // 4. DB OPERATION
  const { data, error } = await supabase
    .from("chats")
    .insert({ ...result.data, user_id: user.id })
    .select()
    .single();

  if (error) {
    logger.error("API:chats:POST", "Insert failed", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  // 5. RESPONSE
  return NextResponse.json(data, { status: 201 });
}
```

## Dashboard Routing Strategy

Dashboard uses a SINGLE `page.tsx` with `activeScreen` state — NOT multiple routes.
Reason: NeuralField canvas must not remount between screen changes.

## NeuralField and canvas components MUST be dynamic

```typescript
// ANY component using canvas, window, or browser APIs:
import dynamic from "next/dynamic";

const NeuralField = dynamic(
  () => import("@brainbox/ui").then((m) => ({ default: m.NeuralField })),
  { ssr: false },
);

// This includes NeuralField in Sidebar — it also needs dynamic import
```

## Anti-patterns

```typescript
❌ middleware.ts — use proxy.ts (Next.js 16)
❌ export function middleware() — use export function proxy()
❌ 'use client' on a page with no interactivity
❌ const { data } = await supabase.auth.getSession()  // use getUser()
❌ return NextResponse.json({ error: err.message })   // exposes internals
❌ Multiple Next.js routes for dashboard screens      // breaks canvas
❌ Static import of NeuralField or canvas components  // use dynamic({ ssr: false })
```
