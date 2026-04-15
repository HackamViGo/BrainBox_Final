```markdown
# BrainBox — Agent Rules

Тези правила важат за **ВСИЧКИ задачи** в BrainBox монорепото.  
Прочитай целия файл преди да започнеш която и да е задача.

---

## 0. ABSOLUTE PROHIBITIONS (преди всичко друго)

Преди да пишеш какъвто и да е план или код, провери тези правила:

1) **proxy.ts — НЕ middleware.ts**
- Next.js 16 в този проект използва `proxy.ts` (не `middleware.ts`)
- Експортът е `proxy()`, не `middleware()`
- Ако агентът предлага „преименувай proxy.ts на middleware.ts“ → **ГРЕШНО**

2) **service-worker.ts — НЕ background.ts**
- Manifest V3 няма background pages
- Ако агентът предлага `background.ts` → **ГРЕШНО**

3) **НЕ инжектирай UI в AI платформи**
- Content scripts са **READ-ONLY**
- Единственото позволено DOM write: **textarea value injection**
- Ако агентът предлага „inject бутони/overlay/селектори“ → **ГРЕШНО**

4) **Auth token storage е РЕШЕНО**
- **AES-GCM encrypted** в `chrome.storage.local`
- Ако агентът пита „как да пазим токена?“ → вече е решено

5) **getUser() — НЕ getSession()**
- `getSession()` чете unverified cookie data
- Ако агентът ползва `getSession()` → **ГРЕШНО**

6) **chrome.alarms — НЕ setInterval() (в extension)**
- Service workers умират след ~30s
- Ако агентът предлага `setInterval` в extension → **ГРЕШНО**

---

## 1. TASK MANAGEMENT (задължително за всяка задача)

### Принцип: Plan → Verify → Execute → Document

### Стъпка 1 — Plan First
Преди да пишеш код, създай `tasks/todo.md` с checkable items:

```markdown
## Task: [name]
### Plan
- [ ] Стъпка 1
- [ ] Стъпка 2
- [ ] Стъпка 3

### Done When
- [ ] pnpm typecheck → 0 грешки
- [ ] [feature-specific criteria]
```

### Стъпка 2 — Verify Plan
След като напишеш плана, **СПРИ** и изчакай approval преди да започнеш имплементация.  
Изключение: ако Artifact Review Policy е **"Always Proceed"** — продължи.

### Стъпка 3 — Track Progress
Маркирай всяка стъпка като завършена веднага щом приключи:

```markdown
- [x] Стъпка 1 ✓
- [ ] Стъпка 2  ← в момента
```

### Стъпка 4 — Explain Changes
При всяка значима стъпка добави кратко обяснение в чата:
`"Завърших X. Причина за подхода: Y. Следва: Z."`

### Стъпка 5 — Document Results
В края на задачата добави `## Review` секция в `tasks/todo.md`:

```markdown
## Review
- Завършено: [дата]
- Какво беше направено: ... 
- Проблеми срещнати: ...
- Решения: ...
- Записвай всички промени в `docs/PROGRESS.md`. 
```

### Стъпка 6 — Capture Lessons
Ако е имало корекция или неочакван проблем, добави в `tasks/lessons.md`:

```markdown
## [дата] — [кратко описание на проблема]
**Контекст:** ...
**Грешка:** ...
**Решение:** ...
**Правило напред:** ...
```

---

## 2. DOCUMENTATION RULES

### 2.1 DECISIONS.md — Архитектурни решения

Файлът живее в `docs/DECISIONS.md`.  
**Пиши в него при ВСЯКО архитектурно или технологично решение.**

Формат за всяко решение:

```markdown
## [ADR-NNN] [Кратко заглавие]
**Дата:** YYYY-MM-DD
**Статус:** Прието | Отхвърлено | Заменено от ADR-NNN

### Контекст
Какъв е проблемът, който налага решение?
- Опиши го така, че да е ясно защо е било нужно да се вземе решение.
- Опиши го така, че да е ясно какви са били алтернативите и защо са били отхвърлени.
- Опиши го така, че да е ясно какви са били trade-offs.

### Решение
Какво беше избрано? 

### Причини
- Причина 1
- Причина 2

### Алтернативи разгледани
- Алтернатива A — защо не
- Алтернатива Б — защо не

### Последици
Какво се променя? Какви trade-offs?
```

**Кога да пишеш в DECISIONS.md:**
- Избор на библиотека (shadcn vs друго)
- Архитектурен pattern (overlay login vs /login route)
- Store организация (1 store vs split)
- Routing стратегия
- Supabase schema решения
- Performance оптимизации с trade-offs
- Всичко, което ще накара бъдещия dev да пита "защо е така?"
- Всяко решение, което води до "hack" или "workaround" вместо елегантно решение.
- Води документацията така, че след 1 година да можеш да разбереш защо си взел дадено решение. И къде и какво има в кода и защо.
- Не прави компромиси с качеството на кода.

### 2.2 README.md — Задължителна структура

`apps/web-app/README.md` трябва да съдържа:
- Setup инструкции (pnpm install, env vars)
- Как да стартираш dev server
- Структура на проекта (кратка)
- Линк към docs/

### 2.3 Inline документация

- **Всяка Zustand store** → JSDoc за state полетата и non-obvious actions
- **Всеки Server Action** → JSDoc с `@throws`, `@returns`
- **NeuralField и сложни animation компоненти** → коментар за всеки `useEffect` dep
- **Сложна бизнес логика** → inline comment **ЗАЩО**, не **КАКВО**

---

## 3. CODE RULES

### 3.1 Next.js 16.2 + React 19.2

- **Default: Server Component.** Добавяй `'use client'` само когато е нужно.
- `'use client'` е задължително при: `useState`, `useEffect`, `useRef`, event handlers, browser APIs (`window`, `canvas`, `localStorage`, `requestAnimationFrame`).
- `'use client'` + `useEffect` вървят **ЗАЕДНО** за browser side effects — никога едното без другото.
- Server Actions живеят в `actions/` с `'use server'` directive.
- `getUser()` от Supabase — **ВИНАГИ. НИКОГА `getSession()`**.
- **Dashboard routing:** Dashboard е **единствен `page.tsx`** с `activeScreen` state (**НЕ multiple routes**).

### 3.1.1 proxy.ts (критично)
- `proxy.ts` (НЕ `middleware.ts`)
- Функцията е `proxy()`, не `middleware()`

### 3.2 Monorepo imports

```ts
// ✅ Правилно
import type { ThemeName, Folder, Item } from '@brainbox/types'
import { THEMES, MODELS } from '@brainbox/types'
import { NeuralField, AmbientLight } from '@brainbox/ui'
import { cn } from '@brainbox/utils'

// ❌ Грешно
import { ThemeName } from '../../packages/types/src'
import { NeuralField } from '../../../packages/ui/src/NeuralField'

// ❌ Грешно — @brainbox/shared не съществува в този проект
import { Chat } from '@brainbox/shared'
```

### 3.3 Zustand

- `skipHydration: true` в **ВСЕКИ** persist store — без изключение.
- SSR safety:
  - `_hasHydrated` флаг
  - `onRehydrateStorage` за правилно поведение при hydration
- `partialize` — persist само необходимото (не целия state).
- Optimistic updates за всички CRUD операции — update state веднага, rollback при грешка.
- Store actions не трябва да знаят за UI — само state трансформации.
- **Explicit return types** на async actions.
- **НЕ persist-вай auth или UI stores.** (Persist само на данни, които реално трябва да оцелеят refresh.)

### 3.4 NeuralField — критично правило

- NeuralField canvas **НЕ СЕ unmount-ва** между screens — само `mode` prop се сменя.
- NeuralField и AmbientLight винаги с `dynamic(() => import(...), { ssr: false })`.
- Sidebar има **СВОЯ отделна NeuralField инстанция** — това е умишлено, не го премахвай.

### 3.5 Extension правила (MV3)

- Файл: `service-worker.ts` (**НЕ** `background.ts`).
- Service worker timers:
  - **`chrome.alarms`** (**НЕ** `setInterval()`).
- Content scripts:
  - **READ-ONLY DOM** — единственото позволено DOM write е **textarea value injection**.
  - Не добавяй бутони, overlays, selectors, toolbars в AI платформи.
- Security:
  - Tokens: **AES-GCM encrypted** в `chrome.storage.local`.
  - **Никога fetch към `supabase.co` директно от extension** — само чрез Dashboard API/бекенд слой с правила.

### 3.6 TypeScript

- `strict: true` навсякъде — без `any`, без `@ts-ignore` без коментар защо.
- **`exactOptionalPropertyTypes` → НИКОГА** (чупи Zustand v5 + shadcn).
- Zod validation на **ВСЕКИ** external input (Supabase response, form data, Server Action args).
- Типовете живеят в `@brainbox/types` — не дефинирай types локално ако са споделени.
- **Explicit return types** на async функции.

### 3.7 Styling

- Tailwind v4 — `@import "tailwindcss"`, **НЕ** `@tailwind` directives.
- `@source` директиви в `globals.css` за всички `packages/` с компоненти.
- BrainBox custom класове (напр. `glass-panel`, `bg-grain`, `neural-edge-*`) — **само от `packages/config/styles/brainbox.css`**.
- Платформени цветове: `--color-acc-*` CSS vars (**НЕ** hardcoded hex).
- shadcn/ui — само за accessibility primitives (Dialog, Dropdown, Tooltip). **НЕ** замества custom BrainBox компоненти.

---

## 4. TESTING RULES

### 4.1 Кога се пишат тестове

| Какво | Кога | Тип |
|------|------|-----|
| Zustand store action | Веднага при създаване | Unit (Vitest) |
| Zod schema | Веднага при създаване | Unit (Vitest) |
| Server Action | Веднага при създаване | Unit (Vitest + mock Supabase) |
| Utility функция в `@brainbox/utils` | Веднага при създаване | Unit (Vitest) |
| Adapter (extension) | Веднага при създаване | Unit (Vitest + jsdom) |
| UI компонент с бизнес логика | При PR | Component (Vitest + RTL) |
| Критичен user flow | При PR за тази feature | E2E (Playwright) |
| Pure presentational компонент | По избор | Пропусни |

**Правило:** Ако пишеш функция с повече от 1 branch (if/else, switch) → пиши тест.  
**Правило 2:** Правиш тестове за **ВСИЧКИ** нови функции и компоненти.

### 4.1.1 Coverage thresholds (задължително)
- 85% lines
- 80% branches  
**Никога не намалявай** тези прагове.

### 4.2 Структура на тестовете

```
apps/web-app/
├── __tests__/
│   ├── unit/
│   │   ├── store/
│   │   │   ├── useAppStore.test.ts
│   │   │   └── useLibraryStore.test.ts
│   │   ├── actions/
│   │   │   ├── library.test.ts
│   │   │   └── auth.test.ts
│   │   └── utils/
│   │       └── theme.test.ts
│   └── components/
│       ├── Login.test.tsx
│       └── Sidebar.test.tsx
├── e2e/
│   ├── auth.spec.ts
│   ├── library.spec.ts
│   └── prompts.spec.ts

packages/
├── types/__tests__/schemas.test.ts
└── utils/__tests__/cn.test.ts
```

### 4.3 Vitest конфигурация (unit + component tests)

```ts
// apps/web-app/vitest.config.mts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules', '.next', 'e2e'],
    },
  },
})
```

### 4.4 Playwright конфигурация (E2E)

```ts
// apps/web-app/playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 4.5 Правила за писане на тестове

- **Arrange → Act → Assert** структура в всеки тест.
- Mock Supabase client в unit тестове — никога реална DB.
- E2E тестове използват Supabase test environment (отделен проект).
- Тест файловете са до компонента или в `__tests__/` — не и двете.
- Описателни имена: `it('should redirect to login when user is not authenticated')`.
- Не тествай implementation details — тествай behaviour.

---

## 5. HOOKS RULES

### Кога се създава custom hook

Създавай hook (`hooks/use[Name].ts`) когато:
- Същата логика с `useEffect`/`useState` се повтаря в 2+ компонента
- Сложна side-effect логика, която замърсява компонент (>20 реда)
- Browser API abstraction (`useMediaQuery`, `useLocalStorage`)
- Subscription логика (WebSocket, Supabase Realtime)

**НЕ** прави hook ако логиката е само в един компонент и е под 10 реда.  
**Прави** винаги hook ако логиката е сложна и ще се ползва на повече от 1 място.

### Задължителни hooks за BrainBox

```
apps/web-app/hooks/
├── useThemeCycle.ts        ← тема auto-cycle (15s interval, спира на library/prompts/studio)
├── useHasHydrated.ts       ← Zustand SSR safety
├── useDragDrop.ts          ← drag source за Library → Workspace
├── useScrollTransition.ts  ← Dashboard↔Extension scroll detection
└── useSupabaseRealtime.ts  ← (бъдеще) realtime subscriptions
```

---

## 6. WORKFLOWS RULES

### Кога се създава Workflow

Съ��давай Workflow файл (`/workflow-name`) когато:
- Задача се повтаря повече от 2 пъти
- Multi-step процес с определен ред
- Onboarding стъпки за нов dev

### Задължителни workflows за BrainBox

```
.agents/workflows/
├── new-screen.md         ← scaffold нов screen с 'use client', store imports, placeholder
├── migrate-screen.md     ← стъпки за миграция на screen от Vite
├── new-server-action.md  ← scaffold action с Zod validation + Supabase + error handling
└── deploy.md             ← build → typecheck → test → deploy
```

---

## 7. CI/CD RULES

### 7.1 GitHub Actions структура

```
.github/workflows/
├── ci.yml          ← на всеки PR: typecheck + lint + unit tests + graph-check
├── e2e.yml         ← на PR към main: Playwright E2E
└── deploy.yml      ← на push към main: build + deploy
```

### 7.2 ci.yml — задължителни checks

- CI има **4 jobs**: `typecheck`, `lint`, `unit-tests`, `graph-check`.

Базов пример (минимумът, който трябва да покрива):

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --run

  graph-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: npx tsx scripts/generate-graph.ts --check
```

### 7.3 PR правила

- Никой не merge-ва директно в `main` без PR.
- PR трябва да има: описание на промяната, линк към task, скрийншот ако е UI.
- Всички CI checks трябва да минават преди merge.
- Branch naming: `feature/`, `fix/`, `chore/`, `docs/`

---

## 8. FOLDER & FILE NAMING

```
PascalCase    → компоненти (.tsx): NeuralField.tsx, Sidebar.tsx
camelCase     → hooks, utils, stores, actions: useAppStore.ts, createFolder.ts
kebab-case    → config файлове: next.config.ts, postcss.config.mjs
UPPER_SNAKE   → constants: STORAGE_KEYS, THEME_KEYS
```

- Всеки нов файл с компонент → `'use client'` или явен Server Component коментар горе.
- Index файлове само в `packages/*/src/index.ts` — не в компоненти.

---

## 9. COMMIT RULES (Conventional Commits)

```
feat:     нова функционалност
fix:      bug fix
chore:    build, deps, config
docs:     само документация
test:     добавяне/поправка на тестове
refactor: без нова функционалност или fix
style:    форматиране, без логика
```

Примери:
```
feat(prompts): add Gemini Refine with 7 crystals
fix(neural-field): prevent canvas unmount on screen change
docs(decisions): add ADR-003 for overlay login pattern
test(store): add unit tests for useLibraryStore CRUD actions
```

---

## 10. GRAPH.json — Dependency Graph

Проектът поддържа два живи dependency graph файла:

| Файл | Покрива | Поддържа се |
|------|---------|-------------|
| `docs/GRAPH.json` | Целия монорепо (packages/ + apps/) | Скрипт + агент |
| `docs/AGENTS_GRAPH.json` | .agents/ папката (skills, rules, workflows) | Само агент (ръчно) |

### Кога се обновява GRAPH.json

**Автоматично** — скриптът обновява `dependencies` и `dependents`:
```bash
npx tsx scripts/generate-graph.ts         # обнови
npx tsx scripts/generate-graph.ts --check # само провери (CI)
```

**Ръчно от агента** — при всяка от следните промени:
- Създаден нов файл → добави нов node
- Изтрит файл → смени `"status": "deleted"`, не изтривай node
- Преименуван файл → обнови `id` и всички references
- Сменено `responsibility` на модул → обнови полето
- Открит нов `side_effect` → добави в масива
- Сменен `public_api` (нова функция, сменена сигнатура) → обнови

**Правило:** Винаги обновявай GRAPH.json след всяка промяна.

### Структура на node

```jsonc
{
  "id": "apps/web-app/store/useAppStore.ts",
  "workspace": "web-app",
  "type": "store",
  "responsibility": "Едно изречение.",
  "dependencies": ["packages/types/src/index.ts"],
  "dependents":   ["apps/web-app/app/page.tsx"],
  "side_effects": ["localStorage persist"],
  "public_api": ["functionName(param: Type): Return"],
  "status": "active"
}
```

### Валидни type стойности

`package-entry` | `module` | `component` | `screen` | `store` | `hook` |
`server-action` | `middleware` | `layout` | `page` | `config` | `stylesheet` |
`skill` | `skill-reference` | `rule` | `workflow` | `task-log`

### Правила

1. **Всеки нов файл** получава node преди или в същия commit.
2. **`id`** е винаги относителен path от монорепо root — `apps/web-app/screens/Foo.tsx`, не `./screens/Foo.tsx`.
3. **`responsibility`** — едно изречение, Bulgarian или English, без "This module...".
4. **`side_effects`** — само реални side effects (browser API, external call, timer, event listener). Празен масив ако няма.
5. **`public_api`** — само exports, не internal helpers. Формат: `"functionName(param: Type): ReturnType"`.
6. **Никога не трий node** — смени на `"status": "deleted"`.
7. **`--check` в CI** — `npx tsx scripts/generate-graph.ts --check`.

---

## 11. NEVER DO

- ❌ `middleware.ts` — само `proxy.ts` (Next.js 16)
- ❌ `background.ts` — само `service-worker.ts` (MV3)
- ❌ `getSession()` от Supabase — само `getUser()`
- ❌ `setInterval()` в extension — само `chrome.alarms`
- ❌ Inject UI/бутони/overlay в AI платформи — content scripts са READ-ONLY
- ❌ DOM writes в content scripts (освен textarea value injection)
- ❌ fetch към `supabase.co` от extension — само чрез Dashboard API/бекенд слой
- ❌ `exactOptionalPropertyTypes: true` — чупи Zustand v5 + shadcn
- ❌ NeuralField статичен import — само `dynamic(..., { ssr: false })`
- ❌ `@brainbox/shared` — не съществува, ползвай `@brainbox/types`
- ❌ `localStorage` директно в компонент — само чрез Zustand persist или `STORAGE_KEYS`
- ❌ Hardcoded strings за screen names — само от `ScreenName` type
- ❌ NeuralField unmount при навигация — само смяна на `mode` prop
- ❌ `skipHydration: false` в Zustand persist stores
- ❌ `any` в TypeScript без коментар `// TODO: type this`
- ❌ `@ts-ignore` без коментар защо
- ❌ `console.log` в production код — използвай logger (или поне `console.error` само за реални грешки)
- ❌ Директен fetch от client component към Supabase без RLS проверка
- ❌ Промяна на файлове в `/brainbox/` (Vite reference project) — read-only
- ❌ Merge в `main` без минали CI checks
```
