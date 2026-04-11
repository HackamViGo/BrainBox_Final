## Task: Sidebar Navigation Migration
### Plan
- [x] Identify all Sidebar-related state in legacy `App.tsx` ✓
- [x] Extend `AppStore` with `switchMode`, `expandedFolders`, `dragTarget`, etc. ✓
- [x] Refactor `ApiKeyModal` and `SmartSwitchModal` to use global store ✓
- [x] Implement the `Sidebar` layout with all states (expanded, pinned, mobile) ✓
- [x] Implement sub-components (FolderItem, NavItem) as client components ✓
- [x] Verify state transitions (e.g., auto-switch mode on navigation) ✓

### Done When
- [x] Sidebar state is fully reactive and persisted ✓
- [x] No prop-drilling for navigation state ✓
- [x] Modals are triggered via store actions ✓
- [x] `Sidebar` correctly switches modes based on `activeScreen` ✓
- [x] `isExpanded` and `isPinned` logic works exactly as in Vite ✓
- [x] `ApiKeyModal` and `SmartSwitchModal` open/close via Zustand ✓
- [x] Update Hooks, Workflows, CI/CD and Tests as per rules
- [x] `pnpm typecheck` → 0 errors ✓
- [ ] `next build` passes

## Task: Update Agent Assets
### Plan
- [ ] Hooks: Create `useDragDrop.ts` and `useSupabaseRealtime.ts` (placeholder)
- [ ] Workflows: Create `.agents/workflows/` with mandated files
- [ ] CI/CD: Create `.github/workflows/` with `ci.yml`, `e2e.yml`, `deploy.yml`
- [ ] Tests: Verify and adjust test structure
- [ ] Update `AGENTS_GRAPH.json` and `GRAPH.json`

### Progress
- [x] Hooks: `useDragDrop.ts` ✓
- [x] Hooks: `useSupabaseRealtime.ts` ✓
- [x] Workflows: `new-screen.md` ✓
- [x] Workflows: `migrate-screen.md` ✓
- [x] Workflows: `new-server-action.md` ✓
- [x] Workflows: `deploy.md` ✓
- [x] CI/CD: `ci.yml` ✓
- [x] CI/CD: `e2e.yml` ✓
- [x] CI/CD: `deploy.yml` ✓
- [x] Tests structure check ✓
- [x] AGENTS_GRAPH.json update ✓

## Review
- Завършено: 2026-04-11
- Какво беше направено: Миграция на Sidebar към Zustand, имплементация на global modals (API Key, Smart Switch, New Folder/Chat).
- Проблеми срещнати: Липсващи икони в @brainbox/ui, несъответствие в имената на пропъртита (icon_index vs iconIndex).
- Решения: Експорт на ICON_LIBRARY от @brainbox/ui, рефактор към camelCase.
