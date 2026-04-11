# NeuralField + Theme Transition Strategy

## Core Principle: Never Unmount the Canvas

The `NeuralField` canvas is `position: fixed, inset: 0` — it covers the entire screen
and persists behind ALL screens. It must NEVER unmount during navigation.

In Next.js, this means it lives in `app/page.tsx` (the SPA shell), NOT in individual screens.

```tsx
// app/page.tsx — correct placement
'use client'
export default function Page() {
  const activeScreen = useAppStore(s => s.activeScreen)
  const theme = useAppStore(s => s.theme)

  return (
    <div className="relative h-dvh w-full bg-[#050505] text-white overflow-hidden flex bg-grain">
      {/* These NEVER unmount */}
      <AmbientLight theme={theme} monochrome={activeScreen === 'archive'} />
      <NeuralField
        theme={theme}
        mode={getNeuralMode(activeScreen)}
        speedMultiplier={activeScreen === 'archive' ? 0.25 : 1}
        monochrome={activeScreen === 'archive'}
      />

      {/* Screens swap via conditional rendering */}
      <main>
        {activeScreen === 'dashboard' && <Dashboard />}
        {activeScreen === 'extension' && <Extension />}
        {/* etc. */}
      </main>
    </div>
  )
}

function getNeuralMode(screen: string): 'brain' | 'wander' | 'extension' {
  if (screen === 'dashboard') return 'brain'
  if (screen === 'extension') return 'extension'
  return 'wander'
}
```

---

## Animation Sequences

### 1. Theme Change (same screen)
Triggered by: AI model selection in AINexus, or auto-cycle timer

```
Current state: brain (dashboard)
→ themeColor changes
→ NeuralField useEffect fires (themeColor in deps)
→ existing particles get p.color = themeColor (in initParticles transition branch)
→ AmbientLight animates to new color (motion.div with duration: 2)
Result: smooth color shift while particles stay in brain formation
```

No intermediate mode change. The `prevModeRef` stays `'brain'`.

### 2. Dashboard → Extension (scroll down / swipe up)
Triggered by: `handleWheel` (deltaY > 50) or touch swipe

```
1. setActiveScreen('extension')
2. NeuralField receives mode='extension'
3. useEffect fires (mode changed)
4. initParticles() runs in "transition" branch:
   - For each particle: scatter to random position across screen
   - Apply "kick" force (particles burst outward from center)
   - prevModeRef updated to 'extension'
5. AmbientLight: theme stays same, position animates
```

The intermediate "dissolve" state is the kick animation itself — particles scatter
organically. This is the `extension` mode transition in the existing code.

### 3. Extension → Dashboard (scroll up / swipe down)
Triggered by: `handleWheel` (deltaY < -50) in Extension screen

```
1. setActiveScreen('dashboard')
2. NeuralField receives mode='brain'
3. initParticles() transition branch:
   - Each particle gets new baseX/baseY inside brain ellipse
   - Particles gradually return to base positions
   - No kick — smooth convergence
```

### 4. Any screen → Archive
```
NeuralField: mode='wander', speedMultiplier=0.25, monochrome=true
AmbientLight: monochrome=true → renders dark gradient
```

---

## NeuralField Port to packages/ui

### `'use client'` + `useEffect` — ДВЕТЕ са задължителни

`'use client'` казва на Next.js да рендерира файла в браузъра.
`useEffect` изпълнява canvas кода след mount — browser API, не работи на сървър.
**Без `'use client'` → `useEffect` никога не се вика → canvas е черен.**

### Required changes from Vite version:

1. Add `'use client'` at top
2. Change import path:
   ```typescript
   // Before (Vite)
   import { THEMES, ThemeName } from '../types'
   // After (Next.js monorepo)
   import { THEMES } from '@brainbox/types'
   import type { ThemeName } from '@brainbox/types'
   ```
3. No other changes needed — the canvas logic is pure browser JS

```typescript
// packages/ui/src/NeuralField.tsx
'use client'

import { useEffect, useRef } from 'react'
import type { ThemeName } from '@brainbox/types'
import { THEMES } from '@brainbox/types'

// ... rest of component unchanged
```

---

## AmbientLight Port

Same approach:

```typescript
// packages/ui/src/AmbientLight.tsx
'use client'

import { motion } from 'motion/react'
import type { ThemeName } from '@brainbox/types'
import { THEMES } from '@brainbox/types'

// ... rest of component unchanged
```

---

## Theme Auto-Cycle

In Vite, this lives in `App.tsx` with `useEffect`. In Next.js, it moves to a Zustand action
or a `useEffect` in `page.tsx`:

```typescript
// In page.tsx or a custom hook useThemeCycle.ts
useEffect(() => {
  if (['library', 'prompts', 'studio'].includes(activeScreen)) return

  const interval = setInterval(() => {
    const otherThemes = THEME_KEYS.filter(t => t !== theme)
    const next = otherThemes[Math.floor(Math.random() * otherThemes.length)]
    setTheme(next)
  }, 15000)

  return () => clearInterval(interval)
}, [activeScreen, theme, setTheme])
```

Prefer a custom hook: `hooks/useThemeCycle.ts` called from `page.tsx`.

---

## Login Overlay Animation

The Login screen is an overlay on top of the already-rendered app:

```tsx
// In page.tsx
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
      <Login onLogin={() => setIsLoggedIn(true)} />
    </motion.div>
  )}
</AnimatePresence>

{/* App blurred behind login */}
<div className={`relative flex flex-1 h-full w-full transition-all duration-1000 ${
  !isLoggedIn ? 'blur-2xl scale-95 pointer-events-none' : 'blur-0 scale-100'
}`}>
  {/* ... rest of app */}
</div>
```

This is identical to the Vite version — no changes needed except `'use client'`.

---

## `h-dvh` vs `h-screen`

In Next.js with mobile support, use `h-dvh` (dynamic viewport height) instead of `h-screen`:
- Fixes the iOS Safari viewport bug where browser chrome changes height
- BrainBox is `overflow: hidden` — `h-dvh` ensures full coverage

---

## NeuralField in Sidebar

The Vite Sidebar imports and renders its own NeuralField instance:
```tsx
// src/components/Sidebar.tsx line ~85
import { NeuralField } from './NeuralField'
```

This creates a SECOND canvas inside the sidebar (not the full-screen one).
Preserve this — it's intentional for the sidebar's visual effect.

In Next.js: both the page-level NeuralField AND the sidebar NeuralField
should be dynamically imported with `ssr: false`.

---

## Performance Notes

- Canvas with 600 particles + connection lines = heavy on CPU
- The `speedMultiplier=0.25` on archive intentionally reduces load
- React 19 Compiler won't optimize canvas animations (refs/imperative code)
- Consider `will-change: transform` on the canvas element for GPU compositing
- The existing `requestAnimationFrame` + `cancelAnimationFrame` cleanup is correct — keep it
