# BrainBox Skills Index

**Последна актуализация:** 2026-04-19
**Версии:** Next.js 16.2 | React 19.2 | Vite 8.x | Zustand ^5 | Tailwind v4 | WXT 0.19+

---

## Кога да зареждаш кой skill

| Задача                                                        | Skill                                    |
| ------------------------------------------------------------- | ---------------------------------------- |
| Архитектура на монорепото, миграция, SSR стратегия            | `brainbox-web`                           |
| Интерфейс, дизайн система, NeuralField, анимации              | `brainbox-ui`                            |
| Zustand store, персистиране, useShallow, оптимистични ъпдейти | `zustand` / `zustand-v5`                 |
| Supabase интеграция: Server Actions, Auth, CRUD               | `brainbox-supabase`                      |
| Сигурност: RLS политики, DB миграции, схеми                   | `supabase-rls` / `security`              |
| Chrome Extension (Master): WXT, Adapters, Sync                | `wxt-extension`                          |
| Комуникация Extension ↔ Web App (Bridge)                      | `extension-bridge`                       |
| MV3 Runtime: Service Worker lifecycle, alarms, storage        | `extension-mv3`                          |
| Gemini SDK, AI Pipeline, Промпт инженеринг                    | `ai-pipeline`                            |
| Next.js API, Server Components, `proxy.ts`, Auth checks       | `nextjs-api`                             |
| Next.js App Router, Server Actions, async params              | `nextjs-app-router`                      |
| Стандарти: Логове, Грешки, Тестване                           | `logging` / `error-handling` / `testing` |
| Монорепо стандарти, package boundaries                        | `core-standards` / `pnpm-monorepo`       |
| TypeScript strict, zero `any`                                 | `typescript-strict`                      |
| Tailwind v4 CSS-first                                         | `tailwind-v4`                            |
| shadcn/ui компоненти                                          | `shadcn-ui`                              |
| Zod схеми и валидация                                         | `zod-validation`                         |
| React 19.2 patterns (Activity, useActionState)                | `react-19`                               |
| Framer Motion / motion/react анимации                         | `framer-motion`                          |
| AES-GCM криптиране на JWT                                     | `aes-gcm-crypto`                         |
| Vite 8, Rolldown, Oxc конфигурация                            | `vite-8`                                 |
| Нов skill / оптимизиране на инструкции                        | `skill-creator`                          |

---

## Пълен списък на Skills

### 🏗️ BrainBox Домейн Skills

#### `brainbox-web`

**Файл:** `.agent/skills/brainbox-web/SKILL.md`
**Responsibility:** Глобална архитектура на монорепото, миграционни чек-листи и SSR безопасност.

#### `brainbox-ui`

**Файл:** `.agent/skills/brainbox-ui/SKILL.md`
**Responsibility:** Дизайн система, `motion/react` анимации, `NeuralField`, `AmbientLight` и управление на теми.
**⚠️ КРИТИЧНО:** `motion/react` — НИКОГА `framer-motion`. `NeuralField` никога не се размонтира.

#### `wxt-extension` ← MASTER за extension

**Файл:** `.agent/skills/wxt-extension/SKILL.md`
**Responsibility:** Пълна WXT архитектура. File-based entrypoints, wxt.config.ts, HMR, React 19 интеграция.
**Заменя:** `brainbox-extension` (legacy CRXJS), ADR-016.

#### `brainbox-extension` ← LEGACY (CRXJS — архивен)

**Файл:** `.agent/skills/brainbox-extension/SKILL.md`
**⚠️ DEPRECATED** — Заменен от `wxt-extension` (ADR-016). Четете само за исторически контекст.

#### `extension-bridge`

**Файл:** `.agent/skills/extension-bridge/SKILL.md`
**Responsibility:** Auth handshake (window.postMessage → chrome.runtime), sync protocol (→ Dashboard API), message types.

#### `extension-mv3`

**Файл:** `.agent/skills/extension-mv3/SKILL.md`
**Responsibility:** MV3 runtime правила — Service Worker lifecycle, `chrome.alarms`, storage APIs, content script isolation.

#### `brainbox-supabase`

**Файл:** `.agent/skills/brainbox-supabase/SKILL.md`
**Responsibility:** Пълна интеграция на Supabase. Auth (getUser()), Server Actions за Library управление.

#### `ai-pipeline`

**Файл:** `.agent/skills/ai-pipeline/SKILL.md`
**Responsibility:** Google Gemini SDK, Prompt Refinement с кристали, анализ на съдържание.

---

### 🔌 Инфраструктурни & Технически Skills

#### `nextjs-api`

**Файл:** `.agent/skills/nextjs-api/SKILL.md`
**⚠️ КРИТИЧНО:** Файлът е `proxy.ts` (НЕ `middleware.ts`). `getUser()` ВИНАГИ — НИКОГА `getSession()`.

#### `nextjs-app-router`

**Файл:** `.agent/skills/nextjs-app-router/SKILL.md`
**Responsibility:** Async params/cookies, Server Actions pattern, RSC vs Client components.

#### `zustand` / `zustand-v5`

**Файл:** `.agent/skills/zustand/SKILL.md` | `.agent/skills/zustand-v5/SKILL.md`
**⚠️ КРИТИЧНО:** `skipHydration: true` в ВСЕКИ persist store.

#### `supabase-rls`

**Файл:** `.agent/skills/supabase-rls/SKILL.md`
**Responsibility:** Database миграции, RLS политики, генериране на TypeScript типове.

#### `security`

**Файл:** `.agent/skills/security/SKILL.md`
**Responsibility:** Rate limiting, API key management, защитен token обмен.

#### `aes-gcm-crypto`

**Файл:** `.agent/skills/aes-gcm-crypto/SKILL.md`
**Responsibility:** AES-GCM Web Crypto API. Задължително за JWT съхранение в extension.

#### `vite-8`

**Файл:** `.agent/skills/vite-8/SKILL.md`
**Responsibility:** Vite 8 + Rolldown + Oxc. `@vitejs/plugin-react-oxc` (НЕ babel). `rolldownOptions` (НЕ `rollupOptions`).

#### `pnpm-monorepo`

**Файл:** `.agent/skills/pnpm-monorepo/SKILL.md`
**Responsibility:** pnpm workspaces, Catalogs, package boundary rules.

---

### 🎨 UI & Styling Skills

#### `tailwind-v4`

**Файл:** `.agent/skills/tailwind-v4/SKILL.md`
**Responsibility:** CSS-first config с `@theme {}`. Без `tailwind.config.ts`.

#### `shadcn-ui`

**Файл:** `.agent/skills/shadcn-ui/SKILL.md`
**Responsibility:** shadcn/ui компоненти, Radix accessibility, Tailwind v4 theming.

#### `framer-motion`

**Файл:** `.agent/skills/framer-motion/SKILL.md`
**⚠️:** Импортирай от `motion/react` — НИКОГА `framer-motion`.

---

### ⚙️ Language & Framework Skills

#### `react-19`

**Файл:** `.agent/skills/react-19/SKILL.md`
**Responsibility:** Activity mode, `useActionState`, `use(Promise)`, `useEffectEvent`.

#### `typescript-strict`

**Файл:** `.agent/skills/typescript-strict/SKILL.md`
**Responsibility:** Zero `any` policy. `exactOptionalPropertyTypes: false` (BrainBox requirement).

#### `zod-validation`

**Файл:** `.agent/skills/zod-validation/SKILL.md`
**Responsibility:** Zod v4 schemas в `packages/types/src/schemas.ts`. API + DB validation.

---

### 📋 Стандарти & Качество

#### `core-standards`

**Файл:** `.agent/skills/core-standards/SKILL.md`
**Responsibility:** TypeScript strict, package boundaries, монорепо конвенции.

#### `logging`

**Файл:** `.agent/skills/logging/SKILL.md`
**⚠️ КРИТИЧНО:** НИКОГА `console.log`. Импорт: `import { logger } from '@/lib/logger'` (web-app) или `import { logger } from '@brainbox/utils'` (packages).

#### `error-handling`

**Файл:** `.agent/skills/error-handling/SKILL.md`
**Responsibility:** `AppError` клас, Error Boundaries, catch-all в API routes.

#### `testing`

**Файл:** `.agent/skills/testing/SKILL.md`
**Responsibility:** Vitest unit, Playwright E2E, coverage ≥85% statements / ≥80% branches.

#### `skill-creator`

**Файл:** `.agent/skills/skill-creator/SKILL.md`
**Responsibility:** Scaffold и оптимизиране на нови agent skills.

---

## Package Naming (Схема A — ОФИЦИАЛНА)

```typescript
import type { ThemeName, Folder, Item } from "@brainbox/types";
import { THEMES, MODELS } from "@brainbox/types";
import { NeuralField, AmbientLight } from "@brainbox/ui";
import { cn } from "@brainbox/utils";
import { logger } from "@/lib/logger"; // в apps/web-app
import { logger } from "@brainbox/utils"; // в packages/
```

**НЕ СЪЩЕСТВУВАТ:** `@brainbox/shared`, `@brainbox/validation`, `@brainbox/database`, `@brainbox/assets`

---

## Критични правила (Винаги активни)

1. **proxy.ts** — НЕ middleware.ts за Next.js 16.2.
2. **getUser()** — НИКОГА getSession() (чете невалидирани cookies).
3. **skipHydration: true** — задължително в ВСЕКИ Zustand persist store.
4. **motion/react** — НИКОГА framer-motion (React 19 съвместимост).
5. **'use client' + useEffect** — вървят ЗАЕДНО за browser APIs.
6. **NeuralField** — никога не се размонтира при навигация; само mode prop се сменя.
7. **localStorage** — ЗАБРАНЕНО; само Zustand persist или `chrome.storage.local`.
8. **console.log/error** — ЗАБРАНЕНО; само logger.
9. **any в TypeScript** — ЗАБРАНЕНО без `// TODO: type this` коментар.
10. **@brainbox/shared** — НЕ СЪЩЕСТВУВА; виж Package Naming по-горе.
11. **WXT** — НИКОГА ръчен `manifest.json`. НИКОГА `@crxjs/vite-plugin`.
12. **defineBackground()** — ВСЯКА background логика трябва да е обвита в него.

---

## Версии (Version Lock — April 2026)

| Технология       | Версия               |
| ---------------- | -------------------- |
| Next.js          | 16.2.x               |
| React            | 19.2.x               |
| Vite (extension) | 8.x (Rolldown + Oxc) |
| WXT              | 0.19+                |
| Tailwind CSS     | 4.x                  |
| Zustand          | ^5.0.10              |
| Zod              | ^4.x                 |
| TypeScript       | ~5.8.x               |
| Node.js          | ≥22                  |
| pnpm             | 9.x                  |
