## Task: Diagnostics and Repair of Migration to Next.js Monorepo

### Plan

- [x] Initial Diagnosis (Step 1) ✓
- [ ] Step 2: Analyze specifically missing parts and config errors
- [ ] Create `turbo.json` in root
- [ ] Update root `package.json` with `turbo` scripts and `turbo` devDependency
- [ ] Verify/Fix package names and exports for existing packages (config, types, ui, utils)
- [ ] Check `apps/web-app` dependencies and workspace references
- [ ] Check `apps/extension` dependencies and workspace references
- [ ] Run `pnpm install`
- [ ] Run `pnpm turbo type-check` and fix errors
- [ ] Run `pnpm turbo build` and fix errors
- [ ] Verify if everything from `brainbox/` (Vite project) is migrated
- [ ] Remove old Vite files from root (once confirmed)
- [ ] Document results in `docs/PROGRESS.md`

### Done When

- [ ] pnpm typecheck → 0 errors
- [ ] pnpm turbo build → 0 errors
- [ ] dev server starts successfully
- [ ] All packages are properly linked via `workspace:*`
