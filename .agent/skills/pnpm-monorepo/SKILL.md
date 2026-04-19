---
name: pnpm-monorepo
description: "pnpm workspaces, Catalogs, and monorepo boundary management."
---

# pnpm Monorepo Standards

## 1. Workspace Structure

- **apps/**: Executable applications (web-app, extension).
- **packages/**: Shared logic and components (ui, types, utils, config).

## 2. Dependency Management

- Use **pnpm catalogs** for version consistency across workspaces.
- `pnpm-workspace.yaml` defines the root boundaries.

## 3. Boundary Rules

- **Packages NEVER import from `apps/`**.
- Cross-package imports must use `@brainbox/*` monorepo aliases.
- Use `pnpm install --frozen-lockfile` in CI.

## 4. Scripts

- Run commands across all workspaces: `pnpm -r <command>`.
- Filter commands: `pnpm --filter <app-name> <command>`.
