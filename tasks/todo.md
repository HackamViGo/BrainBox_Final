## Task: Properly Restoring Code Quality after WXT Migration

### Plan

- [ ] **Research & Explain** SharedArrayBuffer vs ArrayBuffer mismatch in Web Crypto.
- [ ] **Proper Fix for crypto.ts**:
  - [ ] Remove `as unknown as ArrayBuffer` hack.
  - [ ] Implement a safe buffer check/transformation using `slice()` or proper type guards.
  - [ ] Ensure full type safety without `any` or `unknown`.
- [ ] **Fix Extension Verification**:
  - [ ] Revert `--passWithNoTests` flag in `apps/extension/package.json`.
  - [ ] Restore/Migrate basic smoke tests to verify extension entrypoints.
  - [ ] Update `vitest.config.ts` if needed (ensure it covers `entrypoints/`).
- [ ] **Monorepo Audit**:
  - [ ] Run `pnpm typecheck` and ensure 0 errors with the correct fix.
  - [ ] Run `pnpm lint` and ensure 0 errors.
  - [ ] Run `pnpm test` and ensure all tests pass (including extension).
- [ ] **Proper Git Operations**:
  - [ ] Use `fix:` and `chore:` prefixes as requested.
  - [ ] Document changes in `docs/PROGRESS.md`.

### Done When

- [ ] `pnpm typecheck` → 0 грешки (без type-hacking)
- [ ] `pnpm test` → 0 грешки (вкл. extension)
- [ ] `pnpm lint` → 0 грешки
- [ ] Commit съобщенията следват `fix:`/`chore:` конвенцията.

## Review

- Завършено: [дата]
- Какво беше направено: ...
- Проблеми срещнати: ...
- Решения: ...
