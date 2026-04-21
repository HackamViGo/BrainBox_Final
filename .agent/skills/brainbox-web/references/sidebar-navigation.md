---
name: brainbox-sidebar-navigation
description: >
  BrainBox Sidebar и навигационна система за Next.js 16.2.
  Ползвай при: миграция на Sidebar компонента, имплементация на SwitchBar/SwitchMode логиката
  (global/folders/feathers/pulse/workspace), мобилна навигация, или при работа с
  contextual navigation (различни switch видове за различни екрани).
  Задължително прочети преди да работиш със Sidebar, мобилното меню, или screen switching логиката.
---

# BrainBox — Sidebar & Navigation

## Архитектура

Sidebar-ът е **контекстуален** — съдържанието му зависи от `activeScreen`.

```
switchMode стойности:
  'global'    → главна навигация (всички screens)
  'folders'   → папки (Library, Prompts)
  'feathers'  → AI модели за бърз switch
  'pulse'     → (бъдеща функционалност)
  'workspace' → Workspace-специфично съдържание
```

### Кой screen показва switch:

```typescript
const SCREENS_WITH_SWITCH = ["dashboard", "workspace", "analytics"];
const SCREENS_WITHOUT_SIDEBAR = []; // няма — дори Login ползва sidebar (hidden зад overlay)
```

---

## Миграция от Vite към Next.js

### Главна промяна: prop drilling → Zustand

```tsx
// Vite — Sidebar получава 15+ props от App.tsx
<Sidebar
  theme={theme}
  activeScreen={activeScreen}
  setActiveScreen={handleSetActiveScreen}
  activeModelId={activeModelId}
  onModelSelect={(modelId) => setPendingModelId(modelId)}
  activeFolder={activeFolder}
  setActiveFolder={setActiveFolder}
  onDragStart={onDragStart}
  isExpanded={isSidebarExpanded}
  setIsExpanded={setIsSidebarExpanded}
  isMobileOpen={isMobileSidebarOpen}
  onCloseMobile={() => setIsMobileSidebarOpen(false)}
  libraryFolders={libraryFolders}
  setLibraryFolders={setLibraryFolders}
  promptFolders={promptFolders}
  setPromptFolders={setPromptFolders}
  items={items}
  setItems={setItems}
/>

// Next.js — Sidebar без props
<Sidebar />
// Вътре в Sidebar:
const theme = useAppStore(s => s.theme)
const activeScreen = useAppStore(s => s.activeScreen)
const setActiveScreen = useAppStore(s => s.setActiveScreen)
const { libraryFolders, promptFolders, items } = useLibraryStore()
// ...
```

---

## Sidebar Component

```tsx
// apps/web-app/components/Sidebar.tsx (или packages/ui/src/Sidebar.tsx)
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "@/store/useAppStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import type { ThemeName } from "@brainbox/types";
import { THEMES, ICON_LIBRARY, MODELS } from "@brainbox/types";

type SwitchMode = "global" | "folders" | "feathers" | "pulse" | "workspace";

export function Sidebar() {
  const theme = useAppStore((s) => s.theme);
  const activeScreen = useAppStore((s) => s.activeScreen);
  const setActiveScreen = useAppStore((s) => s.setActiveScreen);
  const activeModelId = useAppStore((s) => s.activeModelId);
  const setPendingModelId = useAppStore((s) => s.setPendingModelId);
  const activeFolder = useAppStore((s) => s.activeFolder);
  const setActiveFolder = useAppStore((s) => s.setActiveFolder);
  const isExpanded = useAppStore((s) => s.isSidebarExpanded);
  const setIsExpanded = useAppStore((s) => s.setIsSidebarExpanded);
  const isMobileOpen = useAppStore((s) => s.isMobileSidebarOpen);
  const closeMobile = useAppStore((s) => s.closeMobileSidebar);

  const { libraryFolders, promptFolders, items, addFolder, removeFolder } =
    useLibraryStore();

  const [isPinned, setIsPinned] = useState(false);
  const [switchMode, setSwitchMode] = useState<SwitchMode>("global");
  const [slideDirection, setSlideDirection] = useState(1);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Drag-and-drop handler (локален, не prop)
  const handleDragStart = (
    e: React.DragEvent,
    nodeType: string,
    data: unknown,
  ) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
  };

  // ... rest of component logic unchanged from Vite
}
```

---

## Store additions (useAppStore)

```typescript
// Добави в useAppStore.ts:
interface AppStore {
  // ... existing fields
  isSidebarExpanded: boolean
  isMobileSidebarOpen: boolean
  pendingModelId: string | null

  setIsSidebarExpanded: (v: boolean) => void
  setIsMobileSidebarOpen: (v: boolean) => void
  closeMobileSidebar: () => void
  setPendingModelId: (id: string | null) => void
}

// В create():
isSidebarExpanded: false,
isMobileSidebarOpen: false,
pendingModelId: null,

setIsSidebarExpanded: (v) => set({ isSidebarExpanded: v }),
setIsMobileSidebarOpen: (v) => set({ isMobileSidebarOpen: v }),
closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
setPendingModelId: (id) => set({ pendingModelId: id }),

// setActiveScreen вече closes mobile:
setActiveScreen: (screen) => {
  if (screen !== get().activeScreen) set({ activeFolder: null })
  set({ activeScreen: screen, isMobileSidebarOpen: false })
},
```

---

## Mobile Header

```tsx
// В page.tsx — мобилен хедър (запази от Vite)
{
  /* Mobile Header */
}
<header className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-transparent z-[80] flex items-center justify-between px-6 pointer-events-none">
  <div className="flex items-center gap-3 pointer-events-auto">
    <button
      onClick={() => useAppStore.getState().setIsMobileSidebarOpen(true)}
      className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors"
    >
      <Menu className="w-5 h-5 text-white/40" />
    </button>
  </div>
</header>;
```

---

## SwitchMode логика (запазена от Vite)

```typescript
// Тази логика е сложна — запази я точно от Vite Sidebar.tsx
// Резюме на state machine:

// При смяна на activeScreen:
useEffect(() => {
  if (activeScreen === "library" || activeScreen === "prompts") {
    setSwitchMode("folders");
  } else if (activeScreen === "workspace") {
    setSwitchMode("workspace");
  } else {
    setSwitchMode("global");
  }
}, [activeScreen]);

// При клик на switch button:
// global → feathers (AI models)
// feathers → pulse
// folders → global
// workspace → global
// pulse → feathers
```

---

## Sidebar в packages/ui vs apps/web-app

**Препоръка за Phase 1 (миграция):** Дръж Sidebar в `apps/web-app/components/Sidebar.tsx`.

Причини:

- Sidebar директно ползва store hooks (`useAppStore`, `useLibraryStore`)
- Store hooks не могат да бъдат в `packages/ui` (те не знаят за конкретния store)
- Преместването в `packages/ui` изисква dependency injection pattern (по-сложно)

**Бъдеще (Phase 2):** Може да се извлече с render props или context pattern.

---

## NeuralField в Sidebar

Vite Sidebar има своя NeuralField инстанция (НЕ глобалната):

```tsx
// В Sidebar — запази тази инстанция
import dynamic from 'next/dynamic'

const NeuralFieldMini = dynamic(
  () => import('@brainbox/ui').then(m => m.NeuralField),
  { ssr: false }
)

// Render в expanded sidebar panel:
<NeuralFieldMini
  theme={theme}
  mode="wander"
  speedMultiplier={0.5}
  particleCount={80}
/>
```

---

## SmartSwitchModal

```tsx
// components/SmartSwitchModal.tsx — запази от Vite
// Мигрира точно като останалите компоненти:
// 1. 'use client'
// 2. Import types от @brainbox/types
// 3. Приема props от page.tsx (pendingModelId, clearPendingModel, setTheme)
//    ИЛИ чете от store (препоръчително)
```
