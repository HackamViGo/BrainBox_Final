## Task: Centralized Configuration Management

### Plan

- [x] Create Implementation Plan and get approval
- [ ] **Step 1: pnpm Catalogs**
  - [ ] Update `pnpm-workspace.yaml` with `catalog` section
  - [ ] Replace versions with `catalog:` in all `package.json` files
  - [ ] Run `pnpm install` and verify
  - [ ] Run `pnpm typecheck` and verify
- [ ] **Step 2: .env Strategy (dotenv-cli)**
  - [ ] Install `dotenv-cli` at root (`-Dw`)
  - [ ] Update `apps/web-app/package.json` scripts (`dev`, `build`) to use `dotenv-cli`
  - [ ] Delete `apps/web-app/.env.local`
  - [ ] Update root `.gitignore` and `.env.example`
- [ ] **Step 3: packages/config Hub**
  - [ ] Refine `packages/config/tsconfig.base.json`
  - [ ] Setup `packages/config/eslint.config.js`
  - [ ] Sync styles to `packages/config/styles/brainbox.css` from `/brainbox/src/index.css`
- [ ] **Step 4: Documentation**
  - [ ] Create `docs/VERCEL_SETUP.md`
- [ ] **Verification**
  - [ ] Final `pnpm install --frozen-lockfile`
  - [ ] Final `pnpm typecheck`
  - [ ] Verify `pnpm --filter web-app dev` reads env vars

### Done When

- [ ] `pnpm-workspace.yaml` has `catalog:` section (20+ packages)
- [ ] All `package.json` files use `catalog:` references
- [ ] No `.env.local` files in `apps/`
- [ ] `web-app` reads root env vars via `dotenv-cli`
- [ ] `docs/VERCEL_SETUP.md` is present
- [ ] Typecheck passes monorepo-wide

## Fix: Runtime development script and MCP configuration

### Plan

- [x] Fix apps/web-app/package.json dev/build scripts (env var placement)
- [x] Fix mcp_config.json vercel-mcp entry (binary name mismatch)
- [x] Fix mcp_config.json supabase-mcp entry (binary name mismatch)
- [x] Verify pnpm run dev success

### Review

- Завършено: 2026-04-13
- Какво беше направено: Коригирани са скриптовете за разработка и MCP конфигурациите.
- Проблеми срещнати: pnpm dev гърмеше заради грешно поставен NODE_OPTIONS; npx не намираше vercel-mcp поради разминаване в името на пакета и бинарния файл.
- Решения: Преместен NODE_OPTIONS в началото; добавен -p флаг в npx.
