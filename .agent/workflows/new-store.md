---
description: "Scaffold нов Zustand store в BrainBox с persist, skipHydration, optimistic updates."
---

# Workflow: New Zustand Store

> **Преди да започнеш:** Прочети `.agent/skills/zustand/SKILL.md`

## Кога да създаваш нов store

Създавай НОВА store файл когато:

- Нова domain area с >3 свързани state полета
- Логиката ще се ползва в 2+ компонента
- Данните трябва да persista между navegations

**НЕ** създавай store за локален UI state на един компонент.

---

## Стъпки

### 1. Създай файла

```bash
# Конвенция: apps/web-app/store/use[Domain]Store.ts
touch apps/web-app/store/use[Name]Store.ts
```

### 2. Store шаблон (с persist)

```typescript
'use client'
// apps/web-app/store/use[Name]Store.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { [YourType] } from '@brainbox/types'
import { logger } from '@/lib/logger'

// ── Types ──────────────────────────────────────────────────────────────────

interface [Name]State {
  /** Public description of each field */
  items: [YourType][]
  isLoading: boolean
}

interface [Name]Actions {
  /** Fetch items from Supabase */
  fetchItems: () => Promise<void>
  /** Add item optimistically, rollback on failure */
  addItem: (item: [YourType]) => Promise<void>
  /** Update item optimistically, rollback on failure */
  updateItem: (id: string, patch: Partial<[YourType]>) => Promise<void>
  /** Delete item optimistically, rollback on failure */
  deleteItem: (id: string) => Promise<void>
}

type [Name]Store = [Name]State & [Name]Actions

// ── Store ──────────────────────────────────────────────────────────────────

export const use[Name]Store = create<[Name]Store>()(
  persist(
    (set, get) => ({
      // ── Initial State ──
      items: [],
      isLoading: false,

      // ── Actions ──
      fetchItems: async (): Promise<void> => {
        set({ isLoading: true })
        try {
          const res = await fetch('/api/[resource]')
          if (!res.ok) throw new Error('fetch failed')
          const data: [YourType][] = await res.json()
          set({ items: data, isLoading: false })
        } catch (error) {
          logger.error('[Name]Store', 'fetchItems failed', error)
          set({ isLoading: false })
        }
      },

      addItem: async (item): Promise<void> => {
        const snapshot = get().items                     // 1. snapshot
        set(s => ({ items: [...s.items, item] }))        // 2. optimistic
        const res = await fetch('/api/[resource]', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        })
        if (!res.ok) {
          set({ items: snapshot })                        // 3. rollback
          logger.error('[Name]Store', 'addItem failed', { item })
        }
      },

      updateItem: async (id, patch): Promise<void> => {
        const snapshot = get().items
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch } : i) }))
        const res = await fetch(`/api/[resource]/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })
        if (!res.ok) {
          set({ items: snapshot })
          logger.error('[Name]Store', 'updateItem failed', { id })
        }
      },

      deleteItem: async (id): Promise<void> => {
        const snapshot = get().items
        set(s => ({ items: s.items.filter(i => i.id !== id) }))
        const res = await fetch(`/api/[resource]/${id}`, { method: 'DELETE' })
        if (!res.ok) {
          set({ items: snapshot })
          logger.error('[Name]Store', 'deleteItem failed', { id })
        }
      },
    }),
    {
      name: 'brainbox-[name]-store',                     // localStorage key
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,                               // ← ЗАДЪЛЖИТЕЛНО за Next.js SSR
      partialize: (state) => ({                          // ← само нужните полета
        items: state.items,
        // НЕ persist: isLoading и временен UI state
      }),
    }
  )
)

// ── Selector Hooks (re-exports за convenience) ─────────────────────────────

/** Use this for single-field reads */
export const use[Name]Items = () => use[Name]Store(s => s.items)

/** Use this for multi-field reads — useShallow задължително */
export const use[Name]Actions = () =>
  use[Name]Store(
    useShallow(s => ({
      fetchItems: s.fetchItems,
      addItem: s.addItem,
      updateItem: s.updateItem,
      deleteItem: s.deleteItem,
    }))
  )
```

### 3. Регистрирай за рехидратация

Добави в `apps/web-app/app/providers.tsx`:

```typescript
import { use[Name]Store } from '@/store/use[Name]Store'

// В useEffect:
use[Name]Store.persist.rehydrate()
```

### 4. Добави unit тест

```bash
touch apps/web-app/__tests__/unit/store/use[Name]Store.test.ts
```

Минимален тест:

```typescript
import { use[Name]Store } from '@/store/use[Name]Store'
import { beforeEach, describe, it, expect } from 'vitest'

beforeEach(() => {
  use[Name]Store.setState({ items: [], isLoading: false })
})

describe('use[Name]Store', () => {
  it('should initialize with empty items', () => {
    expect(use[Name]Store.getState().items).toEqual([])
  })

  it('should add item optimistically', () => {
    const mockItem = { id: '1', /* ... */ }
    use[Name]Store.getState().addItem(mockItem)
    expect(use[Name]Store.getState().items).toContainEqual(mockItem)
  })
})
```

### 5. Обнови GRAPH.json

Добави node за новия store:

```jsonc
{
  "id": "apps/web-app/store/use[Name]Store.ts",
  "workspace": "web-app",
  "type": "store",
  "responsibility": "Manages [domain] state with optimistic CRUD and Supabase sync.",
  "dependencies": ["packages/types/src/index.ts"],
  "dependents": [],
  "side_effects": ["localStorage persist"],
  "public_api": [
    "use[Name]Store",
    "fetchItems(): Promise<void>",
    "addItem(item: [Type]): Promise<void>",
    "updateItem(id: string, patch: Partial<[Type]>): Promise<void>",
    "deleteItem(id: string): Promise<void>",
  ],
  "status": "active",
}
```

---

## Критерии за завършване

- [ ] Store файлът съществува с правилно TypeScript типизиране
- [ ] `skipHydration: true` присъства
- [ ] `partialize` е дефинирано (само нужните полета)
- [ ] Всички mutating actions имат: snapshot → optimistic → rollback
- [ ] Всички async actions имат explicit return types (`: Promise<void>`)
- [ ] Рехидратация регистрирана в `providers.tsx`
- [ ] Unit тест с поне 2 test cases
- [ ] Node в `docs/GRAPH.json`
- [ ] `pnpm typecheck` → 0 грешки
