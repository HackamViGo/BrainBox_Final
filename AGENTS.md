# AGENTS.md — BrainBox Project Rules
*Shared rules for Antigravity, Cursor, and Claude Code*

## Tech Stack
- **Monorepo:** pnpm workspaces + Turborepo
- **Frontend:** Next.js 16.2 (App Router) + React 19.2 + Zustand v5
- **Extension:** WXT + Chrome MV3 + TypeScript strict
- **Database:** Supabase (PostgreSQL + RLS) via @supabase/ssr
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animation:** Framer Motion + NeuralField Canvas
- **Testing:** Vitest + Playwright

## Version Locking (April 11, 2026)
- **Next.js:** 16.2 (Async params/cookies/headers mandatory)
- **React:** 19.2 (Activity mode, useEffectEvent)
- **Vite:** 8.x (Rolldown + Oxc)
- **Tailwind:** 4.x
- **Node.js:** ≥22
- **WXT:** 0.19+ (replaces CRXJS)

## Core Principles
1. **No `any` type.** Use `unknown` + type guard if needed.
2. **No `console.log`.** Use project logger.
3. **No `getSession()`.** Always `getUser()` for Supabase auth.
4. **No direct Supabase in client components.** Use Server Actions for mutations.
5. **Security First.** JWT in Extension must be AES-GCM encrypted in `chrome.storage.local`.
6. **Package Boundaries.** Packages never import from `apps/`.
7. **Conventional Commits.** Use `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.

## Detailed Rules Index
Full rule details are organized in `.agent/rules/`:
- **[Task Management](.agent/rules/core/task-management.md)**
- **[Documentation](.agent/rules/core/documentation.md)**
- **[Testing](.agent/rules/core/testing.md)**
- **[Commits](.agent/rules/core/commits.md)**
- **[CI/CD](.agent/rules/core/ci-cd.md)**
- **[Architecture](.agent/rules/brainbox/architecture.md)**
- **[Code Standards](.agent/rules/brainbox/code-standards.md)**
- **[Hooks](.agent/rules/brainbox/hooks.md)**
- **[Workflows](.agent/rules/brainbox/workflows.md)**
