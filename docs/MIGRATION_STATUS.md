# Migration Status: Legacy brainbox/ → apps/web-app/

## Overview

This document tracks the progress of migrating the legacy Vite-based BrainBox application to the new Next.js 16 monorepo structure.

## Status Summary

- **UI & Layout:** 95% Migrated. All main screens (Library, Prompts, Workspace, Studio) are functional in Next.js.
- **State Management:** 100% Migrated. All stores moved from `src/store/` to `apps/web-app/store/` using Zustand v5 with proper persist config.
- **Naming Convention:** 100% Clean. "Main " prefixes removed from all labels and E2E tests.
- **Animations:** 100% Migrated. NeuralField and AmbientLight are synchronized.

## Detailed Progress

### 1. Structure & Infrastructure

- [x] Monorepo setup with pnpm workspaces.
- [x] Shared packages: `@brainbox/types`, `@brainbox/ui`, `@brainbox/utils`, `@brainbox/config`.
- [x] Next.js 16.2 App Router implementation.
- [x] `proxy.ts` established as the request interceptor (replacing middleware).

### 2. Branding & Naming

- [x] Purged "Main " prefix from `FrameworksView`.
- [x] Purged "Main " prefix from `constants.ts` (`SCREEN_LABELS`).
- [x] Updated E2E tests to match clean labels.

### 3. Components & Screens

- [x] Library: Logic connected to `useLibraryStore`, "+New Fragment" modal flow implemented.
- [x] Prompts: `AnimatePresence` with `mode="wait"` integrated.
- [x] Workspace: React Flow migration completed with custom `NeuralEdge`.
- [x] Studio: Canvas architecture migrated.
- [x] AmbientLight: Center positioning fixed to `top: -55%` for diffuse glow effect.

### 4. Known Gaps & Residuals

- [ ] Legacy `brainbox/` directory still contains code that might be useful for future reference but is NOT source of truth.
- [ ] Some complex animation parameters in `NeuralField` might need slight tuning for ultra-high refresh rate displays.

## Guidelines for Future Agents

- **NEVER** read `brainbox/` as the current state.
- **ALWAYS** check `apps/web-app/` and `packages/` for active code.
- **CLEAN LABELS:** Only "Library", "Prompts", etc. No "Main ".
- **PROXY:** Use `proxy.ts` for logic that would traditionally go in `middleware.ts`.
