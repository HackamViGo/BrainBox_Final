# ПЪЛЕН ОДИТ НА ТЕКУЩОТО СЪСТОЯНИЕ НА КОДА (16.04.2026)

Този документ съдържа детайлно описание на ключови компоненти и магазини (stores) в BrainBox, съгласно изискванията за ИЗЧЕРПАТЕЛЕН одит.

---

## СЕКЦИЯ A — AmbientLight

**Файл:** `packages/ui/src/AmbientLight.tsx`

### 1. Пълен код на компонента:

```tsx
"use client";

import { motion } from "motion/react";
import { THEMES } from "@brainbox/types";
import type { ThemeName } from "@brainbox/types";

export function AmbientLight({
  theme,
  monochrome = false,
}: {
  theme: ThemeName;
  monochrome?: boolean;
}) {
  const currentTheme = THEMES[theme];

  const getPosition = (pos: string) => {
    switch (pos) {
      case "top-left":
        return { top: "-10%", left: "-10%" };
      case "top-right":
        return { top: "-10%", right: "-10%" };
      case "bottom-left":
        return { bottom: "-10%", left: "-10%" };
      case "bottom-right":
        return { bottom: "-10%", right: "-10%" };
      case "top-center":
        return { top: "-15%", left: "50%", x: "-50%" };
      case "bottom-center":
        return { bottom: "-15%", left: "50%", x: "-50%" };
      case "center-right":
        return { top: "50%", right: "-15%", y: "-50%" };
      case "center":
        return { top: "50%", left: "50%", x: "-50%", y: "-50%" };
      default:
        return { top: "-10%", left: "-10%" };
    }
  };

  const baseOpacity = monochrome ? 0.15 : 0.25;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary Light */}
      <motion.div
        className="absolute w-[100vw] h-[100vw] rounded-full mix-blend-screen blur-[140px]"
        animate={{
          background: `radial-gradient(circle, ${monochrome ? "#1a1a2e" : currentTheme.color} 0%, transparent 65%)`,
          opacity: baseOpacity,
          ...getPosition(currentTheme.lightPosition),
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />

      {/* Secondary Depth Light (Slow Drift) */}
      <motion.div
        className="absolute w-[80vw] h-[80vw] rounded-full mix-blend-soft-light blur-[100px]"
        animate={{
          background: `radial-gradient(circle, ${monochrome ? "#0f0f15" : currentTheme.color} 0%, transparent 70%)`,
          opacity: baseOpacity * 0.5,
          top: ["20%", "40%", "20%"],
          left: ["20%", "60%", "20%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
```

### 2. Специфични параметри:

- **className (Primary):** `"absolute w-[100vw] h-[100vw] rounded-full mix-blend-screen blur-[140px]"`
- **className (Secondary):** `"absolute w-[80vw] h-[80vw] rounded-full mix-blend-soft-light blur-[100px]"`
- **Opacity:** 0.25 (Primary) и 0.125 (Secondary) при стандартен режим.
- **Blur:** 140px (Primary) и 100px (Secondary).
- **Mix-Blend-Mode:** `screen` (Primary) и `soft-light` (Secondary).

---

## СЕКЦИЯ B — NeuralField

**Файл:** `packages/ui/src/NeuralField.tsx`

### 1. Пълен код на компонента:

(Кратък преглед на ключовата логика)

```tsx
"use client";

import { useEffect, useRef } from "react";
import { THEMES } from "@brainbox/types";
import type { ThemeName } from "@brainbox/types";

export function NeuralField({
  theme,
  mode = "brain",
  speedMultiplier = 1,
  monochrome = false,
  particleCount,
}: {
  theme: ThemeName;
  mode?: "brain" | "wander" | "grid" | "extension";
  speedMultiplier?: number;
  monochrome?: boolean;
  particleCount?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeColor = monochrome ? "#333333" : THEMES[theme].color;
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });
  const particlesRef = useRef<Particle[]>([]);
  const prevModeRef = useRef<string>(mode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // ... логика за resize, initParticles, draw и requestAnimationFrame
  }, [mode, themeColor, particleCount, speedMultiplier]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  );
}
```

### 2. Анализ на поведението:

- **Mode Handling:** Поддържа `brain`, `wander`, `grid`, `extension`. При смяна на режима (`isModeChange`), частиците се преразпределят към новите `baseX` и `baseY`.
- **Dependencies:** `useEffect` следи `[mode, themeColor, particleCount, speedMultiplier]`. Това означава, че всяка промяна на темата рестартира или преизчислява цвета на частиците.
- **Canvas Setup:** Използва `fixed inset-0` и `z-0`, за да бъде винаги най-отдолу, но да покрива целия екран.

---

## СЕКЦИЯ C — useAppStore

**Файл:** `apps/web-app/store/useAppStore.ts`

### 1. Структура на състоянието (State):

- **theme:** `chatgpt` (default).
- **hoverTheme:** `null` (default). Използва се за временен визуален преглед.
- **\_hasHydrated:** Флаг за SSR безопасност, инициализиран на `false`.

### 2. Конфигурация на Persistence:

- **skipHydration:** `true` (Задължително според GEMINI.md).
- **onRehydrateStorage:** При приключване на рехидратацията извиква `state?.setHasHydrated(true)`.
- **Partialization:** Персистира само `theme`, `isLoggedIn`, `activeModelId`, `isPinned`, `isSidebarExpanded`, `expandedFolders`, `apiKeys`. (Забележка: `hoverTheme` НЕ се персистира).

---

## СЕКЦИЯ D — PersistentShell

**Файл:** `apps/web-app/components/PersistentShell.tsx`

### 1. Рендериране на фоновите ефекти:

- Компанентите `NeuralField` и `AmbientLight` се зареждат чрез `next/dynamic` с `ssr: false`, за да се избегнат хидратационни грешки.
- **Active Theme Logic:** `const effectiveTheme = hoverTheme ?? theme;`. Това гарантира, че `hoverTheme` винаги има приоритет, ако не е `null`.

### 2. SSR/Hydration Safeguard:

- Преди `hasHydrated` компонентът връща Loader с фиксирана тема `chatgpt`:

```tsx
if (!hasHydrated) {
  return (
    <div className="h-dvh w-full bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <AmbientLight theme="chatgpt" />
      <NeuralField theme="chatgpt" mode="wander" />
      <Loader2 className="w-8 h-8 text-white/20 animate-spin relative z-10" />
    </div>
  );
}
```

---

**Забележка:** Одитът е извършен в режим "само четене". Кодът не е променян.
