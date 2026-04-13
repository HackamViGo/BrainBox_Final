# Core Rules: CI/CD

## GitHub Actions Pipeline

### 1. CI (на всеки PR) — `ci.yml`

- **Trigger**: `push` към `main`/`develop`, `pull_request`.
- **Jobs**:
  - `typecheck`: `pnpm typecheck` (0 грешки).
  - `lint`: `pnpm lint`.
  - `unit-tests`: `pnpm test --run` (Vitest).
  - `graph-check`: `npx tsx scripts/generate-graph.ts --check`.
  - `skills-check`: `node scripts/check-skills.js`.

### 2. E2E (на PR към main) — `e2e.yml`

- **Trigger**: `pull_request` към `main`.
- **Стъпки**: Build → Playwright Install → Playwright Test.

### 3. Deploy — `deploy.yml`

- **Trigger**: `push` към `main`.
- **Target**: Vercel (Web App) + Extension Artifacts (GitHub Releases).

## PR Правила

- Никой не merge-ва директно в `main` без PR.
- Всички CI checks трябва да са зелени.
- PR трябва да съдържа описание на промените и скрийншот/видео за UI промени.
- Използвай labels: `feature`, `bug`, `refactor`, `docs`.

## Branch Naming

- `feature/[name]`
- `fix/[name]`
- `chore/[name]`
- `docs/[name]`
