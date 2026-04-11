---
name: brainbox-screens-migration
description: >
  Детайлен гайд за миграция на всеки BrainBox екран от Vite към Next.js 16.2.
  Използвай когато мигрираш конкретен екран (Dashboard, Extension, Prompts, Library,
  AINexus, Workspace, MindGraph, Archive, Settings, Identity, Login), когато трябва да
  адаптираш Gemini API calls, drag-and-drop, D3 force graph, ReactFlow canvas, или
  AI-powered Refine/Analyze функционалности за Next.js Server Actions.
  Задължително прочети при работа с Prompts (1238 реда), Library (537 реда) или MindGraph (475 реда).
---

# BrainBox — Screen Migration Guide

## Бърза справка: сложност на екраните

| Екран | Редове | Сложност | Специални изисквания |
|-------|--------|----------|----------------------|
| Login | 156 | ⭐ | AnimatePresence overlay, blur backdrop |
| Extension | 90 | ⭐ | Scroll trigger → Dashboard |
| Dashboard | 108 | ⭐⭐ | Scroll trigger → Extension, touch support |
| Settings | 341 | ⭐⭐ | Zod validation, Supabase update, API keys |
| Archive | 347 | ⭐⭐ | Echoes/Artifacts logic, monochrome mode |
| AINexus | 317 | ⭐⭐⭐ | Theme mutation, Gemini chat, model switch |
| Workspace | 263 | ⭐⭐⭐ | ReactFlow — `dynamic({ ssr: false })` |
| Identity | 385 | ⭐⭐⭐ | IdentitySphere canvas, Neural Charge |
| Library | 537 | ⭐⭐⭐⭐ | Gemini analysis, folder tree, drag source |
| MindGraph | 475 | ⭐⭐⭐⭐ | D3 force graph — `dynamic({ ssr: false })` |
| Prompts | 1238 | ⭐⭐⭐⭐⭐ | 4 sub-views, 7 Crystals, Gemini Refine |

---

## Обща структура за всеки екран

```tsx
// apps/web-app/screens/[ScreenName].tsx
'use client'  // ← ЗАДЪЛЖИТЕЛНО — всички екрани ползват useState/useEffect

import { motion, AnimatePresence } from 'motion/react'
import { useAppStore } from '@/store/useAppStore'
import { useLibraryStore } from '@/store/useLibraryStore'
// Импортирай типове от monorepo пакета:
import type { ThemeName, Folder, Item } from '@brainbox/types'
import { THEMES, MODELS } from '@brainbox/types'
// Utility:
import { cn } from '@brainbox/utils'

// ❌ ПРЕМАХНИ тези Vite-специфични пропове — вземи от store:
// setTheme, setActiveScreen, libraryFolders, promptFolders, items, setItems
// ✅ Вместо това:
const theme = useAppStore(s => s.theme)
const setTheme = useAppStore(s => s.setTheme)
const setActiveScreen = useAppStore(s => s.setActiveScreen)
```

---

## Критични промени: prop drilling → Zustand store

**В Vite:** App.tsx подава всичко като props надолу.
**В Next.js:** Всеки екран чете директно от store.

```typescript
// Vite (СТАР начин)
<Prompts
  setTheme={setTheme}
  activeFolder={activeFolder}
  setActiveFolder={setActiveFolder}
  promptFolders={promptFolders}
  items={items}
  setItems={setItems}
  onDragStart={onDragStart}
/>

// Next.js (НОВ начин) — никакви props
<Prompts />
// Вътре в Prompts:
const { promptFolders, items, setItems } = useLibraryStore()
const { activeFolder, setActiveFolder } = useAppStore()
```

---

## Екрани с scroll trigger (Dashboard ↔ Extension)

```tsx
// screens/Dashboard.tsx
'use client'
export function Dashboard() {
  const setActiveScreen = useAppStore(s => s.setActiveScreen)

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 50) setActiveScreen('extension')
  }
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current - e.changedTouches[0].clientY > 50)
      setActiveScreen('extension')
  }
  // ... JSX unchanged from Vite
}

// screens/Extension.tsx — обратното
const handleWheel = (e: React.WheelEvent) => {
  if (e.deltaY < -50) setActiveScreen('dashboard')
}
```

---

## Gemini API — Vite vs Next.js

```typescript
// Vite: директен import на сервиса
import { generateGeminiResponse } from '../services/gemini'
const result = await generateGeminiResponse(prompt, apiKey)

// Next.js: два варианта

// Вариант 1 (прост): Запази клиентски call (подходящо за Refine/Analyze)
// apps/web-app/lib/gemini.ts — точно копие на src/services/gemini.ts
// Env var: NEXT_PUBLIC_GEMINI_API_KEY (не GEMINI_API_KEY!)
import { generateGeminiResponse } from '@/lib/gemini'

// Вариант 2 (сигурен): Server Action — API key не излиза в клиента
// apps/web-app/actions/ai.ts
'use server'
export async function refinePrompt(prompt: string, crystalType: string) {
  const apiKey = process.env.GEMINI_API_KEY // server-only, не NEXT_PUBLIC_
  // ...call Gemini
}
// Използване в компонент:
import { refinePrompt } from '@/actions/ai'
```

> Препоръка: Използвай **Server Action** за Gemini — API ключът не се излага в клиента.

---

## Prompts — 4 sub-views архитектура

```
Prompts/
├── index.tsx          ← root, управлява activeTab state
├── views/
│   ├── Hub.tsx        ← Prompt of the Day + Gateways + MOCK_CAPTURES
│   ├── Frameworks.tsx ← 7x7 матрица (MATRIX_DATA)
│   ├── Refine.tsx     ← 7 Crystals + Gemini AI optimize
│   └── Saved.tsx      ← списък + папки + drag source
└── modals/
    ├── NewPromptModal.tsx
    └── EditPromptModal.tsx
```

**MATRIX_DATA е mock** — не се пази в Supabase (статични frameworks).
**MOCK_CAPTURES** → бъдеще: идват от Chrome Extension чрез API.
**Saved prompts** → идват от `useLibraryStore().items.filter(i => i.type === 'prompt')`.

### Refine Crystals — Server Action pattern:
```typescript
// actions/ai.ts
'use server'
export async function refinepromptWithCrystal(
  prompt: string,
  crystalId: 'clarity' | 'structure' | 'creative' | 'technical' | 'efficiency' | 'role' | 'context'
) {
  const systemPrompts = {
    clarity: 'Clears ambiguities and sharpens instructions...',
    structure: 'Organizes prompt into Markdown...',
    // ...
  }
  // call Gemini with system prompt
}
```

---

## Library — Gemini Analysis

Library има два Gemini use-cases:
1. **Summarize** — 7 варианта (Quick, Detailed, Bullets, Takeaways, Executive, Narrative, Actions)
2. **Analyze** — 7 варианта (Sentiment, Topic, Entity, Intent, Tone, Logic, Bias)

```typescript
// Същата Server Action за двата случая:
'use server'
export async function analyzeContent(
  content: string,
  promptTemplate: string  // от SUMMARIZE_OPTIONS или ANALYZE_OPTIONS
): Promise<string> {
  const fullPrompt = `${promptTemplate}\n\nContent:\n${content}`
  // call Gemini
}
```

### Drag source (Library → Workspace):

```tsx
// В Next.js: onDragStart вече НЕ е prop — вземи от utility или дефинирай локално
const handleDragStart = (e: React.DragEvent, nodeType: string, data: unknown) => {
  e.dataTransfer.setData('application/reactflow', nodeType)
  e.dataTransfer.setData('application/json', JSON.stringify(data))
  e.dataTransfer.effectAllowed = 'move'
}
```

---

## Workspace — ReactFlow

```tsx
// screens/Workspace.tsx
'use client'
import dynamic from 'next/dynamic'

// ReactFlow трябва dynamic import — ползва browser APIs
const ReactFlow = dynamic(
  () => import('@xyflow/react').then(m => m.ReactFlow),
  { ssr: false }
)
// Същото за: Background, Controls, MiniMap

// Custom nodes са чисти React компоненти — не се нуждаят от dynamic
import { GlassNode } from '@/components/workspace/GlassNode'
import { StickyNode } from '@/components/workspace/StickyNode'
import { NeuralEdge } from '@/components/workspace/NeuralEdge'
```

---

## MindGraph — D3.js

```tsx
// screens/MindGraph.tsx
'use client'
import { useEffect, useRef } from 'react'

// D3 се импортира директно — НЕ dynamic (само ползва useEffect)
// D3 не рендерира JSX, само манипулира SVG в useEffect
import * as d3 from 'd3'

// Ако има SSR проблеми, wrap в dynamic:
// const MindGraph = dynamic(() => import('./MindGraph'), { ssr: false })
// (решава се в page.tsx, не вътре в самия компонент)
```

---

## Archive — Echoes & Artifacts

```typescript
// Echoes: deletedAt е setнато, isFrozen = false
// Artifacts: isFrozen = true
// Логиката в Zustand store:

// useLibraryStore.ts
deleteItem: (id: string) => set(state => ({
  items: state.items.map(item =>
    item.id === id
      ? { ...item, deletedAt: new Date().toISOString() }
      : item
  )
})),
freezeItem: (id: string) => set(state => ({
  items: state.items.map(item =>
    item.id === id ? { ...item, isFrozen: true } : item
  )
})),
```

**NeuralField за Archive:**
```tsx
// В page.tsx — вече е имплементирано
mode={activeScreen === 'archive' ? 'wander' : ...}
speedMultiplier={activeScreen === 'archive' ? 0.25 : 1}
monochrome={activeScreen === 'archive'}
```

---

## Login — Overlay Pattern

Login **не е отделна страница** — overlay в `page.tsx`:

```tsx
// ⚠️ НЕ правй app/(auth)/login/page.tsx за BrainBox
// Zoom-out анимацията изисква app-а да е вече рендериран отзад

// В page.tsx — запази точно от Vite:
<AnimatePresence>
  {!isLoggedIn && (
    <motion.div
      key="login-overlay"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.2,
        filter: 'blur(20px)',
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <Login onLogin={handleLogin} />
    </motion.div>
  )}
</AnimatePresence>
```

---

## Import path cheatsheet (Vite → Next.js)

| Vite import | Next.js import |
|-------------|----------------|
| `'../types'` | `'@brainbox/types'` |
| `'../constants'` | `'@brainbox/types'` |
| `'../components/NeuralField'` | `'@brainbox/ui'` |
| `'../components/AmbientLight'` | `'@brainbox/ui'` |
| `'../services/gemini'` | `'@/lib/gemini'` или Server Action |
| `'../components/ApiKeyModal'` | `'@/components/ApiKeyModal'` |
| `process.env.GEMINI_API_KEY` | `process.env.NEXT_PUBLIC_GEMINI_API_KEY` (client) |

---

## Автоматизация: `migrate-screens.ts`

```typescript
// apps/web-app/scripts/migrate-screens.ts
// Стартирай: npx tsx scripts/migrate-screens.ts

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const replacements = [
  [/from ['"]\.\.\/types['"]/g, "from '@brainbox/types'"],
  [/from ['"]\.\.\/constants['"]/g, "from '@brainbox/types'"],
  [/from ['"]\.\.\/components\/NeuralField['"]/g, "from '@brainbox/ui'"],
  [/from ['"]\.\.\/components\/AmbientLight['"]/g, "from '@brainbox/ui'"],
  [/from ['"]\.\.\/services\/gemini['"]/g, "from '@/lib/gemini'"],
  [/process\.env\.GEMINI_API_KEY/g, "process.env.NEXT_PUBLIC_GEMINI_API_KEY"],
]

const files = glob.sync('../brainbox/src/screens/*.tsx')
files.forEach(file => {
  let content = `'use client'\n\n` + readFileSync(file, 'utf-8')
  replacements.forEach(([from, to]) => {
    content = content.replace(from as RegExp, to as string)
  })
  const outPath = file.replace('../brainbox/src/screens/', 'src/screens/')
  writeFileSync(outPath, content)
  console.log(`✅ Migrated: ${outPath}`)
})
```
