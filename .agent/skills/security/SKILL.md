---
name: security
description: "Load when writing API routes, handling auth, storing tokens, adding rate limiting, or rendering user content."
---

## Rules

- Auth check is FIRST in every API route — before body parse, before validation
- `user_id` from `auth.getUser()` server-side only — never from request body
- Every new Supabase table requires RLS migration
- Every AI endpoint requires rate limiting (5/min per user)
- Extension JWT must be AES-GCM encrypted in `chrome.storage.local`
- Raw HTML from user/AI content must pass through DOMPurify
- `auth.getUser()` not `auth.getSession()` — getSession can return stale data

## Auth Pattern (every API route)

```typescript
// STEP 1 — always first
const supabase = await createServerClient();
const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();
if (authError || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
// user.id is now safe — never use body.user_id
```

## Rate Limiting (Upstash)

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const aiRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});

// In route:
const { success } = await aiRateLimit.limit(user.id);
if (!success) {
  return NextResponse.json(
    { error: "Rate limit exceeded", retryAfter: 60 },
    { status: 429, headers: { "Retry-After": "60" } },
  );
}
```

## Rate Limits by Endpoint

| Endpoint                          | Limit   | Window | Identifier |
| --------------------------------- | ------- | ------ | ---------- |
| `/api/ai/*`                       | 5 req   | 1 min  | user.id    |
| `/api/chats/extension`            | 30 req  | 1 min  | user.id    |
| `/api/chats`, `/api/prompts` etc. | 100 req | 1 min  | user.id    |

## AES-GCM Token Storage (Extension)

```typescript
async function getKey(): Promise<CryptoKey> {
  const seed = new TextEncoder().encode(chrome.runtime.id);
  const base = await crypto.subtle.importKey("raw", seed, "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: seed, iterations: 100_000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
```

## Secrets Classification

| Variable                        | Type       | Where           |
| ------------------------------- | ---------- | --------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public     | Client + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public     | Client + Server |
| `SUPABASE_SERVICE_ROLE_KEY`     | **Secret** | Server only     |
| `GEMINI_API_KEY`                | **Secret** | Server only     |
| `UPSTASH_REDIS_REST_TOKEN`      | **Secret** | Server only     |

## DOMPurify

```typescript
import DOMPurify from "dompurify";
const safeHtml = DOMPurify.sanitize(rawContent, {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "code", "pre", "ul", "ol", "li"],
  ALLOWED_ATTR: [],
});
```

## Anti-patterns

```typescript
❌ const { data: { session } } = await supabase.auth.getSession()
❌ const userId = body.user_id
❌ NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
❌ <div dangerouslySetInnerHTML={{ __html: chat.content }} />
❌ logger.info('Auth', 'Token', { token: jwt })
```
