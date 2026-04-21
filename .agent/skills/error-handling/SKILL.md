---
name: error-handling
description: "Load when throwing errors, catching errors in API routes, writing error boundaries, or working with AppError."
---

## Rules

- Always use `AppError` — never `throw new Error('string')`
- Error codes in `packages/utils/src/errors/error-codes.ts` — never inline
- API routes return `{ error: string }` — never raw DB errors
- Empty catch blocks forbidden — always log + handle

## AppError

```typescript
import { AppError } from "@brainbox/utils";

throw new AppError("CHAT_NOT_FOUND", { details: { chatId: id } });
throw new AppError("RATE_LIMIT_AI");
throw new AppError("SYSTEM_INTERNAL", {
  cause: error instanceof Error ? error : undefined,
});
```

## API Route Error Handling

```typescript
try {
  // ... route logic
} catch (error) {
  if (error instanceof AppError) {
    logger.warn("API:chats", "AppError", { code: error.errorCode });
    return NextResponse.json(error.toJSON(), { status: error.statusCode });
  }
  logger.error("API:chats", "Unexpected error", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
```

## Error Codes Registry

```
AUTH_*:       1000-1999   AUTH_UNAUTHORIZED (401)
CHAT_*:       2000-2999   CHAT_NOT_FOUND (404)
FOLDER_*:     3000-3999   FOLDER_NOT_FOUND (404)
PROMPT_*:     4000-4999   PROMPT_NOT_FOUND (404)
AI_*:         6000-6999   AI_QUOTA_EXCEEDED (429)
RATE_LIMIT_*: 7000-7999   RATE_LIMIT_API (429)
SYSTEM_*:     9000-9999   SYSTEM_INTERNAL (500)
```

## Anti-patterns

```typescript
❌ throw new Error('Chat not found')
❌ catch (error) {}
❌ return NextResponse.json({ error: err.message })
❌ console.error('Failed:', error)
```
