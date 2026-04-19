---
name: testing
description: "Load when writing Vitest tests, Playwright E2E, coverage config, or mock patterns."
---

## Rules

- Coverage thresholds: 85% lines/statements, 80% branches — never lower them
- Write tests based on VERIFIED behavior — not theoretical
- Every test must FAIL if behavior deviates
- Mock `fetch` with `vi.stubGlobal` — never real network in unit tests
- Mock data must use `satisfies` not `as` for type safety

## Vitest Config

```typescript
// apps/web-app/vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../../tooling/testing/setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: { lines: 85, branches: 80, functions: 80, statements: 85 },
    },
  },
});
```

## Mock Patterns

```typescript
// Mock fetch
vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(data) }),
);

// Mock Supabase
vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi
        .fn()
        .mockResolvedValue({ data: { user: mockUser }, error: null }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi
          .fn()
          .mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
      }),
    }),
  }),
}));

// Mock rate limit — always pass in tests
vi.mock("@/lib/rate-limit", () => ({
  crudRateLimit: { limit: vi.fn().mockResolvedValue({ success: true }) },
  aiRateLimit: { limit: vi.fn().mockResolvedValue({ success: true }) },
}));
```

## Store Test Pattern

```typescript
beforeEach(() => {
  // Reset store to known state
  useChatStore.setState({ chats: [mockChat], isLoading: false });
  vi.restoreAllMocks();
});

it("rolls back on API failure", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
  await useChatStore.getState().deleteChat("chat-1");
  expect(useChatStore.getState().chats).toHaveLength(1); // rollback happened
});
```

## RLS Isolation Test (Playwright — Critical)

```typescript
test("User A cannot access User B data", async ({ request }) => {
  // Must pass — verifies RLS works end-to-end
  const chatId = await createChatAsUserA(request);
  const response = await request.get(`/api/chats/${chatId}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  expect(response.status()).toBe(404);
});
```

## Coverage Gate

```bash
pnpm turbo test:coverage
node scripts/check-coverage.js   # fails if under threshold
```

## Anti-patterns

```typescript
❌ it.skip(...)  // without GitHub issue reference in comment
❌ const mock = { id: 'x' } as Chat  // use satisfies
❌ Real network calls in unit tests
❌ Lowering coverage thresholds
❌ Writing tests before Phase 3 human approval
```
