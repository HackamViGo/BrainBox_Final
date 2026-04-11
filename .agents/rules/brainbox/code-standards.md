# BrainBox Code Standards

Приложимо за: **BrainBox монорепо**

## Next.js 16.2 + React 19.2

- **Default: Server Component.** Добавяй `'use client'` само когато е нужно
- `'use client'` е задължително при: `useState`, `useEffect`, `useRef`, event handlers, browser APIs
- `'use client'` + `useEffect` вървят ЗАЕДНО за browser side effects
- Server Actions живеят в `actions/` с `'use server'` directive
- `getUser()` от Supabase — ВИНАГИ. НИКОГА `getSession()`

## Monorepo imports

```typescript
// ✅ Правилно
import type { ThemeName, Folder, Item } from '@brainbox/types'
import { THEMES, MODELS } from '@brainbox/types'
import { NeuralField, AmbientLight } from '@brainbox/ui'
import { cn } from '@brainbox/utils'

// ❌ Грешно
import { ThemeName } from '../../packages/types/src'
import { NeuralField } from '../../../packages/ui/src/NeuralField'
```

## TypeScript

- `strict: true` навсякъде — без `any`, без `@ts-ignore` без коментар защо
- Zod validation на ВСЕКИ external input (Supabase response, form data, Server Action args)
- Типовете живеят в `@brainbox/types` — не дефинирай types локално ако са споделени

## Styling

- Tailwind v4 — `@import "tailwindcss"`, НЕ `@tailwind` directives
- `@source` директиви в `globals.css` за всички `packages/` с компоненти
- BrainBox custom класове (`glass-panel`, `bg-grain`, `neural-edge-*`) — само от `globals.css`
- shadcn/ui — само за accessibility primitives (Dialog, Dropdown, Tooltip)

## Folder & File Naming

```text
PascalCase    → компоненти (.tsx): NeuralField.tsx, Sidebar.tsx
camelCase     → hooks, utils, stores, actions: useAppStore.ts, createFolder.ts
kebab-case    → config файлове: next.config.ts, postcss.config.mjs
UPPER_SNAKE   → constants: STORAGE_KEYS, THEME_KEYS
```

## BrainBox Specific Documentation

- **Всяка Zustand store** → JSDoc за state полетата и non-obvious actions
- **Всеки Server Action** → JSDoc с `@throws`, `@returns`
- **NeuralField и сложни animation компоненти** → коментар за всеки `useEffect` dep
