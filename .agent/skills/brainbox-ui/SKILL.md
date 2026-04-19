---
name: brainbox-ui
description: "Load when building any BrainBox UI — dashboard screens, layout components, or design tokens."
---

## Rules

- Tailwind v4 CSS-first — `@import "tailwindcss"` + `@theme {}`. NO `tailwind.config.ts`
- `.glass-panel` and `.glass-panel-light` from `packages/ui/tokens/effects.css` only
- `motion/react` for animations — NEVER `framer-motion`
- All scrollbars are INVISIBLE by design (`scrollbar-width: none`)
- Dashboard routing: single `page.tsx` with `activeScreen` state — NOT multiple routes
- `NeuralField` and `AmbientLight` must never remount between screens
- Import: `import { motion, AnimatePresence } from 'motion/react'`

## Design Tokens

### Colors (`packages/ui/tokens/colors.css`)

```css
:root {
  --color-bb-bg: #000000;
  --color-bb-surface: rgba(20, 20, 20, 0.4);
  --color-bb-border: rgba(255, 255, 255, 0.08);
  --color-bb-text: #ffffff;
  --color-bb-muted: rgba(255, 255, 255, 0.5);

  --color-acc-chatgpt: #10a37f;
  --color-acc-gemini: #8ab4f8;
  --color-acc-claude: #d97757;
  --color-acc-grok: #e5e5e5;
  --color-acc-perplexity: #22d3ee;
  --color-acc-lmarena: #fbbf24;
  --color-acc-deepseek: #2563eb;
  --color-acc-qwen: #a855f7;
}
```

### Glass Effects (`packages/ui/tokens/effects.css`)

```css
.glass-panel {
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.glass-panel-light {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

## THEMES (from `packages/types`)

```typescript
import { THEMES } from "@brainbox/types";
// ThemeName, Theme types also from @brainbox/types

export const THEMES: Record<ThemeName, Theme> = {
  chatgpt: { color: "#10a37f", lightPosition: "top-left" },
  gemini: { color: "#8ab4f8", lightPosition: "bottom-right" },
  claude: { color: "#d97757", lightPosition: "top-right" },
  grok: { color: "#e5e5e5", lightPosition: "bottom-left" },
  perplexity: { color: "#22d3ee", lightPosition: "top-center" },
  lmarena: { color: "#fbbf24", lightPosition: "center" },
  deepseek: { color: "#2563eb", lightPosition: "bottom-center" },
  qwen: { color: "#a855f7", lightPosition: "center-right" },
};
```

## AmbientLight

```typescript
"use client";
import { motion } from "motion/react";
import { THEMES } from "@brainbox/types";

// Props: theme: ThemeName, monochrome?: boolean
// monochrome={true} only for Archive screen
// Animates: position + color based on theme
```

## NeuralField

```typescript
"use client";
// HTML5 Canvas — must be 'use client'
// Props: theme: ThemeName, activeScreen: ActiveScreen
// brain mode: when activeScreen === 'dashboard' (particles gathered)
// wander mode: all other screens (particles scattered)
// monochrome + speedMultiplier: 0.25 when activeScreen === 'archive'
```

## Sidebar — 5 switchMode states

1. `global` — main navigation menu
2. `folderRails-library` — library folder tree (when activeScreen === 'library')
3. `folderRails-prompts` — prompt folder tree (when activeScreen === 'prompts')
4. `folderRails-workspace` — split 50/50 Library+Prompts (when activeScreen === 'workspace')
5. `feathers` — AI platform switcher (when activeScreen === 'studio')

All switchMode logic preserved from reference — do NOT restructure.

## Screen to Component Mapping

| activeScreen | Component               |
| ------------ | ----------------------- |
| `dashboard`  | `screens/Dashboard.tsx` |
| `library`    | `screens/Library.tsx`   |
| `prompts`    | `screens/Prompts.tsx`   |
| `studio`     | `screens/AINexus.tsx`   |
| `workspace`  | `screens/Workspace.tsx` |
| `analytics`  | `screens/MindGraph.tsx` |
| `archive`    | `screens/Archive.tsx`   |
| `settings`   | `screens/Settings.tsx`  |
| `profile`    | `screens/Identity.tsx`  |
| `extension`  | `screens/Extension.tsx` |

## Animation Patterns

```typescript
// Page entrance
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

// Card hover
<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>

// Screen transitions (AnimatePresence not needed — screens don't unmount/remount)
```

## Phase 3 → Phase 5 Data Replacement

```typescript
// Phase 3 (temporary):
const [chats, setChats] = useState<Chat[]>([]);

// Phase 5 (replace with):
const { chats } = useChatStore(useShallow((s) => ({ chats: s.chats })));
```

## Anti-patterns

```typescript
❌ tailwind.config.ts                          // v4 is CSS-first
❌ import { motion } from 'framer-motion'       // use motion/react
❌ Multiple Next.js routes for screens          // use activeScreen state
❌ localStorage for persistent UI state         // use Zustand in Phase 5
❌ NeuralField without 'use client'             // canvas API needs client
❌ ApiKeyModal in production                    // API keys are server-side
```
