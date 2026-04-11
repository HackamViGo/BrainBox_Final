# BrainBox Master Todo

## Task: Graph Maintenance & Consistency

### Plan: Graph Maintenance

- [x] Update `docs/GRAPH.json`
  - [x] Add node for `apps/web-app/store/usePromptStore.ts` ✓
  - [x] Run `scripts/generate-graph.ts` to sync dependencies and dependents ✓
  - [x] Verify there are 0 missing/orphan referenced nodes ✓
- [x] Update `docs/AGENTS_GRAPH.json`
  - [x] Add node for `.agents/rules/cursorrules.md` (type: rule) ✓
  - [x] Add node for `.agents/skills/supabase/SKILL.md` (type: skill) ✓
  - [x] Verify all existing nodes have correct responsibilities ✓
  - [x] Update metadata (total_nodes, coverage) ✓
- [x] Verify consistency between the two graphs ✓

### Done When: Graph Maintenance

- [x] `npx tsx scripts/generate-graph.ts --check` returns 0 errors (for GRAPH.json) ✓
- [x] `AGENTS_GRAPH.json` reflects all current files in `.agents/` ✓
- [x] Metadata in both files is accurate ✓

### Review: Graph Maintenance

- Завършено: 2026-04-11
- Какво беше направено: Всички графи на зависимостите са обновени.

---

## Task: Tailwind V4 & SPA Shell

### Plan: SPA Shell

- [x] Настрой Tailwind v4 с @tailwindcss/postcss ✓
- [x] Инсталирай и конфигурирай shadcn/ui с Nova preset ✓
- [x] Имплементирай globals.css с BrainBox custom styles ✓
- [x] Финализирай app/layout.tsx с Inter font и TooltipProvider ✓
- [x] Имплементирай app/page.tsx като SPA Shell с dynamic imports ✓
- [x] Добави useThemeCycle и useScrollTransition hooks ✓
- [x] Валидирай чрез pnpm build ✓

### Done When: SPA Shell

- [x] pnpm build в web-app минава успешно
- [x] Всички 11 екрана са регистрирани в SPA shell
- [x] Tailwind v4 работи в монорепо контекст

### Review: SPA Shell

- Завършено: 2026-04-11
- Какво беше направено: Успешно мигрирахме към Tailwind v4, настроихме shadcn/ui и изградихме SPA Shell. Внедрени са механизми за динамично зареждане на тежки компоненти и автоматична ротация на теми. Оправени са критични типови несъответствия между Zustand stores и Sidebar компонента.
- Проблеми срещнати: Липсващи екрани при build, типови грешки при destructuring на stores, проблеми с exactOptionalPropertyTypes в shadcn компоненти.
- Решения: Създадени stubs за екрани, актуализиран ScreenNameSchema, оправени пропъртита в useAppStore и Sidebar.
