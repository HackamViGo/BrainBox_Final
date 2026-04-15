## Task: BrainBox Completion Plan
### Plan

#### ФАЗА 1 — Критични fixes
- [x] 1.1 Remove exactOptionalPropertyTypes
- [x] 1.2 NeuralField dynamic import в Sidebar
- [x] 1.3 getUser() в extension-auth
- [x] 1.4 useHasHydrated pattern
- [x] 1.5 MOCK data от store initial state

#### ФАЗА 2 — High priority
- [x] 2.1 Rate limit на /api/chats/extension (+ lib/rate-limit.ts)
- [x] 2.2 useAINexusStore (messages, generating狀態, modelVersion)
- [x] 2.3 Explicit return types за всички async функции
- [x] 2.4 useLibraryStore partialize (нищо не се пази в localStorage)
- [x] 2.5 Workspace / MindGraph / Identity да ползват store hooks

#### ФАЗА 3 — CSS и Design System
- [ ] 3.1 Accent CSS variables (packages/config/styles/brainbox.css)
- [ ] 3.2 Replace hardcoded hex with var(--color-acc-*)

#### ФАЗА 4 — Extension Build Fix
- [ ] Run build to find errors
- [ ] Add missing entry points placeholders (content, service-worker)
- [ ] Run build again

#### ФАЗА 5 — Cleanup
- [ ] 5.1 localStorage → Zustand
- [ ] 5.2 console.log → logger
- [ ] 5.3 any type reduction

#### ФАЗА 6 — Testing
- [ ] Run coverage
- [ ] Add tests for new store, hook and rate limit
- [ ] Run tests (all green)

#### ФИНАЛНА ВЕРИФИКАЦИЯ
- [ ] pnpm typecheck
- [ ] pnpm test --run
- [ ] pnpm --filter web-app build
- [ ] pnpm --filter @brainbox/extension build
- [ ] Manual checks

#### Документация
- [ ] Update docs/AUDIT_REPORT.md
- [ ] Add to docs/DECISIONS.md
- [ ] Update docs/GRAPH.json
- [ ] Update Review in tasks/todo.md and tasks/lessons.md

### Done When
- [ ] pnpm typecheck → 0 грешки
- [ ] pnpm test --run → всички passing
- [ ] pnpm --filter web-app build → success
- [ ] pnpm --filter @brainbox/extension build → success
- [ ] exactOptionalPropertyTypes НЕ е в нито един tsconfig
- [ ] getSession() НЕ е в extension-auth/page.tsx
- [ ] NeuralField в Sidebar е dynamic({ ssr: false })
- [ ] useAINexusStore.ts съществува
- [ ] MOCK data НЕ е в initial store state
- [ ] --color-acc-* vars са дефинирани
- [ ] docs/AUDIT_REPORT.md обновен

### Review
- Завършено: [дата]
- Какво беше направено:
- Проблеми срещнати:
- Решения:
- Всички промени са записани в `docs/PROGRESS.md`.
