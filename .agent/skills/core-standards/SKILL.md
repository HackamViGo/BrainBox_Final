---
name: core-standards
description: "Core standards for BrainBox: Monorepo boundaries, TypeScript, Context Rules, Security, Testing, Logging, and Monitoring."
---

# BrainBox Core Standards

## 1. Context Rules & Documentation Discovery

Before writing ANY code:

- Never scan `docs/` manually. Always read `docs/AGENTS_GRAPH.json` / `docs/GRAPH.json` to find the correct document.
- If a new decision is made, create an ADR in `docs/DECISIONS.md`.
- All shared types go to `packages/types/`. All shared schemas go to `packages/types/` (Zod export).

## 2. Monorepo Boundaries

- `apps/extension` ↛ `apps/web-app` (Forbidden). No cross-app imports.
- `packages/*` ↛ `apps/*` (Forbidden). Packages cannot depend on apps.
- Shared logic must live in `packages/`.
- `pnpm verify`: Runs boundaries check, lint, type-check, and tests.

## 3. TypeScript & Zod Validation

- `strict: true` and `noImplicitAny: true`.
- `exactOptionalPropertyTypes: false` (Required for Zustand/Shadcn compatibility).
- **Zero `any` policy.**
- Use `satisfies` for object literals dynamically typed.
- Use Zod for all external data (API responses, Supabase data, Storage).

## 4. Testing (Vitest & Playwright)

- Coverage Target: 85% Lines, 80% Branches.
- `pnpm check:coverage` fails CI if below.
- Mocks: Use `useEffectEvent` mocks for Chrome APIs in Vitest.

## 5. Security & Auth (JWT & Rate Limiting)

- Auth Flow: JWT is retrieved from Dashboard and stored securely.
- Avoid persistent XSS by using generic React sanitization and avoiding `dangerouslySetInnerHTML`.
- Rate Limiting logic implemented at Edge/Middleware.

## 6. Error Handling

- Use `AppError` format for throwing specific errors in workflows:
  ```typescript
  throw new AppError(ErrorCodes.AUTH_INVALID_CREDENTIALS, { detail: "..." });
  ```
- Error Code Ranges: 1000 (Auth), 2000 (Chat), 5000 (Sync), 9000 (System).

## 7. Logging (Phase & Runtime)

- Phase Logging: Use `node scripts/update-log.js` for phase transitions (`start`, `mcp-gate`, `finish`).
- Runtime Logger: Use `@brainbox/utils/logger` (`logger.info`, `logger.error`).
- **Forbidden:** `console.log`, `console.error`.
- Log Index: `ops/logs/INDEX.json` is the source of truth for progress.

## 8. Monitoring (Sentry 9.x)

- Root Configuration in `next.config.ts`:
  ```typescript
  import { withSentryConfig } from "@sentry/nextjs";
  export default withSentryConfig(nextConfig, {
    org: "brainbox-ai",
    project: "web-app",
    tunnelRoute: "/monitoring",
  });
  ```
- Use `beforeSend` in client config to scrub PII (emails, tokens, IPs, sensitive URLs) before they leave the client.
- `/api/health` endpoint checks Supabase connection and app version.
