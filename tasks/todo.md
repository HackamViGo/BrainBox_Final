## Task: Properly Restoring Code Quality after WXT Migration

### Plan

- [x] **Research & Explain** SharedArrayBuffer vs ArrayBuffer mismatch in Web Crypto. ✓
- [x] **Proper Fix for crypto.ts**: ✓
  - [x] Remove `as unknown as ArrayBuffer` hack. ✓
  - [x] Implement a safe buffer check/transformation using proper ArrayBuffer allocation. ✓
  - [x] Ensure full type safety without `any` or `unknown`. ✓
- [x] **Fix Extension Verification**: ✓
  - [x] Revert `--passWithNoTests` flag in `apps/extension/package.json`. ✓
  - [x] Restore/Migrate basic smoke tests to verify extension entrypoints. ✓
  - [x] Update `vitest.config.ts` if needed (ensure it covers `entrypoints/`). ✓
- [x] **Monorepo Audit**: ✓
  - [x] Run `pnpm typecheck` and ensure 0 errors with the correct fix. ✓
  - [x] Run `pnpm lint` and ensure 0 errors. ✓
  - [x] Run `pnpm test` and ensure all tests pass (including extension). ✓
- [x] **Proper Git Operations**: ✓
  - [x] Use `fix:` and `chore:` prefixes as requested. ✓
  - [x] Document changes in `docs/PROGRESS.md`. ✓ (Done in commit bodies)

### Done When

- [x] `pnpm typecheck` → 0 грешки (без type-hacking) ✓
- [x] `pnpm test` → 0 грешки (вкл. extension) ✓
- [x] `pnpm lint` → 0 грешки ✓
- [x] Commit съобщенията следват `fix:`/`chore:` конвенцията. ✓

## Review

- Завършено: 2026-04-21
- Какво беше направено: Коректно решение на проблема със SharedArrayBuffer чрез копиране на паметта, възстановяване на инфраструктурата за тестване на разширението и изчистване на линтинг правилата.
- Проблеми срещнати: Линтиране на build artifacts (.output), което генерираше хиляди фалшиви грешки; ТS mismatch при Web Crypto API свързан с SharedArrayBuffer.
- Решения: Използван `new ArrayBuffer()` за гарантиране на non-shared памет; Въведен `setup.ts` за глобални мокове на Chrome в Vitest; Добавени комплексни `ignores` в ESLint.
